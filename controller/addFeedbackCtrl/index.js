const pool = require('../../db')
var nodemailer = require('nodemailer');



//Tabel : person_tbl, faskes_tbl, employee_tbl
var controller = {
    addFeedback: function (request, response) {
        try {
            const { employee_id, id_kategori_komplain, information_data, id_session, number_phone } = request.body

            pool.db_MMFPROD.query(
                "select b.employee_id ,e.display_name,d.company_office cabang, " +
                "case when left(coalesce(coalesce(c.email_value1,c.email_value2),a.contact_value),1)<>'0' then " +
                "coalesce(coalesce(c.email_value1,c.email_value2),a.contact_value) else ' ' end " +
                "as email " +
                "from person_contact_method_tbl a " +
                "left join employee_tbl b on  a.person_id =b.person_id  " +
                "left join my_contact_method_tbl c on a.person_id = c.person_id  " +
                "left join emp_company_office_tbl d on b.employee_id =d.employee_id  " +
                "left join person_tbl e on a.person_id =e.person_id " +
                "where b.employee_id =$1 and  a.contact_type ='4' " +
                "limit 1 "
                , [employee_id], (error, results) => {
                    if (error) {
                        throw error
                    }
                    if (results.rows != '') {
                        console.log("query 1", results.rows);

                        const emp_cabang = results.rows[0].cabang
                        const emp_displayName = results.rows[0].display_name
                        const emp_email = results.rows[0].email

                        pool.db_HCM.query(
                            "select * from mas_kategori_komplain where id_kategori_komplain =$1 ", [id_kategori_komplain], (error, results) => {
                                if (error) {
                                    throw error
                                }
                                if (results.rows != '') {
                                    console.log("query 2", results.rows);
                                    const email_to = results.rows[0].email_to;
                                    const cc_to = results.rows[0].cc_to;
                                    const subject_email = results.rows[0].subject_email;
                                    const dateFormat = require('dateformat');
                                    const day = dateFormat(new Date(), "yyyy-mm-dd hh:MM:ss");
                                    pool.db_HCM.query(
                                        "insert into trx_komplain (cabang,employee_id ,no_hp , email ,id_kategori_komplain ,keterangan, tgl_komplain , id_session ,transfer_message ) " +
                                        "values ($1, $2 , $3,$4,$5,$6,$7, $8,$9)", [emp_cabang, employee_id, number_phone, emp_email, id_kategori_komplain, information_data, day, id_session, '0'], (error, results) => {
                                            if (error) {
                                                throw error
                                            }
                                            let transporter = nodemailer.createTransport({
                                                // service: 'gmail',
                                                host: 'mail.mandalafinance.com',
                                                port: 587,
                                                secure: false, // use SSL
                                                auth: {
                                                    user: 'mpower@mandalafinance.com',
                                                    pass: 'MandalaHCM123'
                                                },
                                                tls: {
                                                    rejectUnauthorized: false
                                                }
                                            });

                                            let mailOptions = {
                                                from: 'mpower@mandalafinance.com',
                                                to: email_to,
                                                cc: cc_to,
                                                subject: subject_email,
                                                text: 'Hello World'
                                            };

                                            transporter.sendMail(mailOptions, function (error, info) {
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    console.log('Email sent: ' + info.response);
                                                    const resp_api_email = info.response;
                                                    pool.db_HCM.query(
                                                        "UPDATE trx_komplain " +
                                                        "SET transfer_message = $1" +
                                                        "WHERE tgl_komplain = $2", [resp_api_email, day], (error, results) => {
                                                            if (error) {
                                                                throw error
                                                            }
                                                            response.status(200).send({
                                                                status: 200,
                                                                message: 'Berhasil mengirim email dan masuk kedalam tabel',
                                                                data: '',
                                                            });
                                                        })
                                                }
                                            });
                                        })
                                } else {
                                    response.status(200).send({
                                        status: 200,
                                        message: 'Data Tidak Ditemukan 1',
                                        data: results.rows
                                    });
                                }
                            })
                    } else {
                        response.status(200).send({
                            status: 200,
                            message: 'Email anda di orange belum didaftarkan',
                            data: results.rows
                        });
                    }
                })
        } catch (err) {
            res.status(500).send(err);
        }
    }
};

module.exports = controller;