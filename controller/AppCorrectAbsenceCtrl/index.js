const { validationResult } = require('express-validator');
const pool = require('../../db');
const Helpers = require('../../helpers');
const axios = require('axios');
const nodemailer = require('nodemailer');
const dateFormat = require('dateformat');
const _ = require('lodash');

// Tabel : person_tbl, employee_tbl
const controller = {
  async AppCorrectAbsence(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(422).send(errors);

    const { employee_id, golid, data_perbaikan } = request.body;

    Helpers.logger(
      'SUCCESS',
      { employee_id },
      'getHistAbsenceNewCtrl.getHistAbsenceNew'
    );

    try {
      const query = `select a.employee_id,b.display_name as nama_pengaju,c.contact_value as no_hp_pengaju,
      d.contact_value as email_pengaju,e.supervisor_id , f.display_name as nama_atasan
      from employee_tbl a
      left join person_tbl b on a.person_id =b.person_id 
      left join person_contact_method_tbl c on b.person_id = c.person_id and c.contact_type ='3' and c.default_address ='Y'
      left join person_contact_method_tbl d on b.person_id = d.person_id and d.contact_type ='4' and d.default_address ='Y'
      left join employee_supervisor_tbl e on a.employee_id = e.employee_id and current_Date between e.valid_from and e.valid_to 
      left join person_tbl f on e.supervisor_id = f. person_id 
      where a.employee_id=$1`;

      await pool.db_MMFPROD
        .query(query, [employee_id])
        .then(({ rows }) => {
          // eslint-disable-next-line eqeqeq
          if (rows != 0) {
            const data_nama_pengaju = rows[0].nama_pengaju;
            const data_no_hp_pengaju = rows[0].no_hp_pengaju;
            const data_email_pengaju = rows[0].email_pengaju;
            const data_nama_atasan = rows[0].nama_atasan;
            pool.db_MMFPROD.query(
              `update correction_absence_hcm_h cahh  
              set state_approval = 'Approved' , approval_date = current_date
              where cor_absence_id = $1`,
              [golid],
              (error, results) => {
                if (error) {
                  // Helpers.logger(
                  //   'ERROR',
                  //   {
                  //     employee_id,
                  //     date_filter,
                  //     rev_id,
                  //     status,
                  //   },
                  //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                  //   error
                  // );

                  throw error;
                }

                // eslint-disable-next-line eqeqeq
                if (results.rowCount != 0) {
                  // eslint-disable-next-line no-plusplus
                  for (let i = 0; i < data_perbaikan.length; i++) {
                    let data_correction_time_in =
                      data_perbaikan[i].time_in == null
                        ? null
                        : data_perbaikan[i].date +
                          ' ' +
                          data_perbaikan[i].time_in +
                          ':' +
                          '00';
                    let data_correction_time_out =
                      data_perbaikan[i].time_out == null
                        ? null
                        : data_perbaikan[i].date +
                          ' ' +
                          data_perbaikan[i].time_out +
                          ':' +
                          '00';

                    pool.db_MMFPROD.query(
                      `update correction_absence_hcm_d set state = $3
                      where cor_absence_id = $1 and cor_id_detail = $2`,
                      [
                        golid,
                        data_perbaikan[i].id_detail,
                        data_perbaikan[i].status,
                      ],
                      (error, results) => {
                        if (error) {
                          // Helpers.logger(
                          //   'ERROR',
                          //   {
                          //     employee_id,
                          //     date_filter,
                          //     rev_id,
                          //     status,
                          //   },
                          //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                          //   error
                          // );

                          throw error;
                        }

                        // eslint-disable-next-line eqeqeq
                        if (results.rowCount != 0) {
                          console.log(data_perbaikan[i].status);
                          if (data_perbaikan[i].status === 'Approved') {
                            pool.db_MMFPROD.query(
                              ` select company_id ,employee_id ,clocking_date ,result_revised ,presence ,normal_hour ,overtime_hour ,absence_hour ,
                                late_hour,early_hour ,overtime_paid ,temp_day_type ,revised_company ,revised_by ,calc_day_type ,
                                normal_hour_off, late_in_wage , early_out_wage ,early_break_hour ,late_break_hour ,state ,golid ,golversion 
                                from emp_clocking_tbl ect 
                                where employee_id =$1 and clocking_date = $2
                                order by clocking_date desc`,
                              [employee_id, data_perbaikan[i].date],
                              (error, results) => {
                                if (error) {
                                  // Helpers.logger(
                                  //   'ERROR',
                                  //   {
                                  //     employee_id,
                                  //     date_filter
                                  //   },
                                  //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                  //   error
                                  // );

                                  throw error;
                                }
                                //  eslint-disable-next-line eqeqeq
                                if (results.rows != 0) {
                                  const data_company_id =
                                    results.rows[0].company_id;
                                  const data_result_revised =
                                    results.rows[0].result_revised;
                                  const data_presence =
                                    results.rows[0].presence;
                                  const data_normal_hour =
                                    results.rows[0].normal_hour;
                                  const data_overtime_hour =
                                    results.rows[0].overtime_hour;
                                  const data_absence_hour =
                                    results.rows[0].absence_hour;
                                  const data_late_hour =
                                    results.rows[0].late_hour;
                                  const data_early_hour =
                                    results.rows[0].early_hour;
                                  const data_overtime_paid =
                                    results.rows[0].overtime_paid;
                                  const data_temp_day_type =
                                    results.rows[0].temp_day_type;
                                  const data_revised_company =
                                    results.rows[0].revised_company;
                                  const data_revised_by =
                                    results.rows[0].revised_by;
                                  const data_calc_day_type =
                                    results.rows[0].calc_day_type;
                                  const data_normal_hour_off =
                                    results.rows[0].normal_hour_off;
                                  const data_late_in_wage =
                                    results.rows[0].late_in_wage;
                                  const data_early_out_wage =
                                    results.rows[0].early_out_wage;
                                  const data_early_break_hour =
                                    results.rows[0].early_break_hour;
                                  const data_late_break_hour =
                                    results.rows[0].late_break_hour;
                                  const data_state = results.rows[0].state;
                                  const data_golversion =
                                    results.rows[0].golversion;
                                  const data_golid = results.rows[0].golid;

                                  // eslint-disable-next-line eqeqeq
                                  pool.db_HCM.query(
                                    `insert into temp_emp_clocking_tbl (company_id ,employee_id ,clocking_date ,result_revised ,presence ,normal_hour ,overtime_hour ,absence_hour ,
                                        late_hour,early_hour ,overtime_paid ,temp_day_type ,revised_company ,revised_by ,calc_day_type ,
                                        normal_hour_off, late_in_wage , early_out_wage ,early_break_hour ,late_break_hour ,state ,golid ,golversion, cor_absence_id)
                                        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
                                    [
                                      data_company_id,
                                      employee_id,
                                      data_perbaikan[i].date,
                                      data_result_revised,
                                      data_presence,
                                      data_normal_hour,
                                      data_overtime_hour,
                                      data_absence_hour,
                                      data_late_hour,
                                      data_early_hour,
                                      data_overtime_paid,
                                      data_temp_day_type,
                                      data_revised_company,
                                      data_revised_by,
                                      data_calc_day_type,
                                      data_normal_hour_off,
                                      data_late_in_wage,
                                      data_early_out_wage,
                                      data_early_break_hour,
                                      data_late_break_hour,
                                      data_state,
                                      data_golid,
                                      data_golversion,
                                      golid,
                                    ],
                                    (error, results) => {
                                      if (error) {
                                        // Helpers.logger(
                                        //   'ERROR',
                                        //   {
                                        //     employee_id,
                                        //     date_filter,
                                        //     rev_id,
                                        //   },
                                        //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                        //   error
                                        // );

                                        throw error;
                                      }

                                      // eslint-disable-next-line eqeqeq
                                      if (results.rowCount != 0) {
                                        pool.db_MMFPROD.query(
                                          `delete from emp_clocking_tbl where employee_id =$1 and clocking_date = $2 `,

                                          [employee_id, data_perbaikan[i].date],
                                          (error, results) => {
                                            if (error) {
                                              // Helpers.logger(
                                              //   'ERROR',
                                              //   {
                                              //     employee_id,
                                              //     date_filter,
                                              //     rev_id,
                                              //     status,
                                              //   },
                                              //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                              //   error
                                              // );

                                              throw error;
                                            }

                                            // eslint-disable-next-line eqeqeq
                                            console.log(
                                              '>>>>>>>>>>>>>>>>>>>>>>>masuk delete 1<<<<<<<<<<<<<<<<'
                                            );

                                            // eslint-disable-next-line eqeqeq
                                            if (results.rowCount != 0) {
                                              pool.db_MMFPROD.query(
                                                `select company_id ,employee_id ,clocking_date ,time_in ,time_out ,off_site ,is_break ,note ,in_terminal,
                                                  out_terminal ,in_reg_type ,out_reg_type, absence_wage ,in_location ,out_location ,golid ,golversion 
                                                  from emp_clocking_detail_tbl ecdt 
                                                  where employee_id =$1 and clocking_date = $2
                                                  order by clocking_date desc`,
                                                [
                                                  employee_id,
                                                  data_perbaikan[i].date,
                                                ],
                                                (error, results) => {
                                                  if (error) {
                                                    // Helpers.logger(
                                                    //   'ERROR',
                                                    //   {
                                                    //     employee_id,
                                                    //     date_filter,
                                                    //     rev_id,
                                                    //     status,
                                                    //   },
                                                    //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                    //   error
                                                    // );

                                                    throw error;
                                                  }

                                                  // eslint-disable-next-line eqeqeq
                                                  if (results.rows != 0) {
                                                    const data1_company_id =
                                                      results.rows[0]
                                                        .company_id;
                                                    const data1_time_in =
                                                      results.rows[0].time_in;
                                                    const data1_time_out =
                                                      results.rows[0].time_out;
                                                    const data1_off_site =
                                                      results.rows[0].off_site;
                                                    const data1_is_break =
                                                      results.rows[0].is_break;
                                                    const data1_note =
                                                      results.rows[0].note;
                                                    const data1_in_terminal =
                                                      results.rows[0]
                                                        .in_terminal;
                                                    const data1_out_terminal =
                                                      results.rows[0]
                                                        .out_terminal;
                                                    const data1_in_reg_type =
                                                      results.rows[0]
                                                        .in_reg_type;
                                                    const data1_out_reg_type =
                                                      results.rows[0]
                                                        .out_reg_type;
                                                    const data1_absence_wage =
                                                      results.rows[0]
                                                        .absence_wage;
                                                    const data1_in_location =
                                                      results.rows[0]
                                                        .in_location;
                                                    const data1_out_location =
                                                      results.rows[0]
                                                        .out_location;
                                                    const data1_golid =
                                                      results.rows[0].golid;
                                                    const data1_golversion =
                                                      results.rows[0]
                                                        .golversion;

                                                    pool.db_HCM.query(
                                                      `insert into temp_emp_clocking_detail_tbl (company_id ,employee_id ,clocking_date ,time_in ,time_out ,off_site ,is_break ,note ,in_terminal,
                                                          out_terminal ,in_reg_type ,out_reg_type, absence_wage ,in_location ,out_location ,golid ,golversion, cor_absence_id  )
                                                          values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
                                                      [
                                                        data1_company_id,
                                                        employee_id,
                                                        data_perbaikan[i].date,
                                                        data1_time_in,
                                                        data1_time_out,
                                                        data1_off_site,
                                                        data1_is_break,
                                                        data1_note,
                                                        data1_in_terminal,
                                                        data1_out_terminal,
                                                        data1_in_reg_type,
                                                        data1_out_reg_type,
                                                        data1_absence_wage,
                                                        data1_in_location,
                                                        data1_out_location,
                                                        data1_golid,
                                                        data1_golversion,
                                                        golid,
                                                      ],
                                                      (error, results) => {
                                                        if (error) {
                                                          // Helpers.logger(
                                                          //   'ERROR',
                                                          //   {
                                                          //     employee_id,
                                                          //     date_filter,
                                                          //     rev_id,
                                                          //     status,
                                                          //   },
                                                          //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                          //   error
                                                          // );

                                                          throw error;
                                                        }

                                                        // eslint-disable-next-line eqeqeq
                                                        console.log(
                                                          '>>>>>>>>>>>>>>>>>>>>>>>masuk insert 2<<<<<<<<<<<<<<<<'
                                                        );
                                                        if (
                                                          results.rowCount != 0
                                                        ) {
                                                          pool.db_MMFPROD.query(
                                                            `delete from emp_clocking_detail_tbl where employee_id =$1 and clocking_date = $2 `,
                                                            [
                                                              employee_id,
                                                              data_perbaikan[i]
                                                                .date,
                                                            ],
                                                            (
                                                              error,
                                                              results
                                                            ) => {
                                                              if (error) {
                                                                // Helpers.logger(
                                                                //   'ERROR',
                                                                //   {
                                                                //     employee_id,
                                                                //     date_filter,
                                                                //     rev_id,
                                                                //     status,
                                                                //   },
                                                                //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                //   error
                                                                // );

                                                                throw error;
                                                              }

                                                              // eslint-disable-next-line eqeqeq
                                                              console.log(
                                                                '>>>>>>>>>>>>>>>>>>>>>>>masuk delete 2<<<<<<<<<<<<<<<<'
                                                              );
                                                              if (
                                                                results.rowCount !=
                                                                0
                                                              ) {
                                                                pool.db_MMFPROD.query(
                                                                  `select company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note, transfer_message ,
                                                                    state,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,
                                                                    location_method ,golid ,golversion 
                                                                    from emp_clocking_temp_tbl ectt 
                                                                    where employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD') = to_Char($2::date,'YYYY-MM-DD')`,
                                                                  [
                                                                    employee_id,
                                                                    data_perbaikan[
                                                                      i
                                                                    ].date,
                                                                  ],
                                                                  (
                                                                    error,
                                                                    results
                                                                  ) => {
                                                                    if (error) {
                                                                      // Helpers.logger(
                                                                      //   'ERROR',
                                                                      //   {
                                                                      //     employee_id,
                                                                      //     date_filter,
                                                                      //     rev_id,
                                                                      //     status,
                                                                      //   },
                                                                      //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                      //   error
                                                                      // );

                                                                      throw error;
                                                                    }

                                                                    // eslint-disable-next-line eqeqeq
                                                                    if (
                                                                      results.rows !=
                                                                      0
                                                                    ) {
                                                                      const data2_company_id =
                                                                        results
                                                                          .rows[0]
                                                                          .company_id;
                                                                      const data2_in_out =
                                                                        results
                                                                          .rows[0]
                                                                          .in_out;
                                                                      const data2_terminal_id =
                                                                        results
                                                                          .rows[0]
                                                                          .terminal_id;
                                                                      const data2_off_site =
                                                                        results
                                                                          .rows[0]
                                                                          .off_site;
                                                                      const data2_transfer_message =
                                                                        results
                                                                          .rows[0]
                                                                          .transfer_message;
                                                                      const data2_note =
                                                                        results
                                                                          .rows[0]
                                                                          .note;
                                                                      const data2_state =
                                                                        results
                                                                          .rows[0]
                                                                          .state;
                                                                      const data2_latitude =
                                                                        results
                                                                          .rows[0]
                                                                          .latitude;
                                                                      const data2_altitude =
                                                                        results
                                                                          .rows[0]
                                                                          .altitude;
                                                                      const data2_longitude =
                                                                        results
                                                                          .rows[0]
                                                                          .longitude;
                                                                      const data2_accuracy =
                                                                        results
                                                                          .rows[0]
                                                                          .accuracy;
                                                                      const data2_location_no =
                                                                        results
                                                                          .rows[0]
                                                                          .location_no;
                                                                      const data2_url_photo =
                                                                        results
                                                                          .rows[0]
                                                                          .url_photo;
                                                                      const data2_url_remove =
                                                                        results
                                                                          .rows[0]
                                                                          .url_remove;
                                                                      const data2_golversion =
                                                                        results
                                                                          .rows[0]
                                                                          .golversion;
                                                                      const data2_file_name =
                                                                        results
                                                                          .rows[0]
                                                                          .file_name;
                                                                      const data2_golid =
                                                                        results
                                                                          .rows[0]
                                                                          .golid;
                                                                      const data2_location_method =
                                                                        results
                                                                          .rows[0]
                                                                          .location_method;

                                                                      pool.db_HCM.query(
                                                                        `insert into temp_emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note, transfer_message ,
                                                                            state,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,
                                                                            location_method ,golid ,golversion,  cor_absence_id)
                                                                            values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20, $21)`,
                                                                        [
                                                                          data2_company_id,
                                                                          employee_id,
                                                                          data_perbaikan[
                                                                            i
                                                                          ]
                                                                            .date,
                                                                          data2_in_out,
                                                                          data2_terminal_id,
                                                                          data2_off_site,
                                                                          data2_note,
                                                                          data2_transfer_message,
                                                                          data2_state,
                                                                          data2_latitude,
                                                                          data2_altitude,
                                                                          data2_longitude,
                                                                          data2_accuracy,
                                                                          data2_location_no,
                                                                          data2_url_photo,
                                                                          data2_url_remove,
                                                                          data2_file_name,
                                                                          data2_location_method,
                                                                          data2_golid,
                                                                          data2_golversion,
                                                                          golid,
                                                                        ],
                                                                        (
                                                                          error,
                                                                          results
                                                                        ) => {
                                                                          if (
                                                                            error
                                                                          ) {
                                                                            // Helpers.logger(
                                                                            //   'ERROR',
                                                                            //   {
                                                                            //     employee_id,
                                                                            //     date_filter,
                                                                            //     rev_id,
                                                                            //     status,
                                                                            //   },
                                                                            //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                            //   error
                                                                            // );

                                                                            throw error;
                                                                          }

                                                                          // eslint-disable-next-line eqeqeq
                                                                          console.log(
                                                                            '>>>>>>>>>>>>>>>>>>>>>>>masuk insert 2<<<<<<<<<<<<<<<<'
                                                                          );
                                                                          if (
                                                                            results.rowCount !=
                                                                            0
                                                                          ) {
                                                                            pool.db_MMFPROD.query(
                                                                              `delete from emp_clocking_temp_tbl where company_id='MMF' 
                                                                                and employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD') = to_char($2::date,'YYYY-MM-DD') `,
                                                                              [
                                                                                employee_id,
                                                                                data_perbaikan[
                                                                                  i
                                                                                ]
                                                                                  .date,
                                                                              ],
                                                                              (
                                                                                error,
                                                                                results
                                                                              ) => {
                                                                                if (
                                                                                  error
                                                                                ) {
                                                                                  // Helpers.logger(
                                                                                  //   'ERROR',
                                                                                  //   {
                                                                                  //     employee_id,
                                                                                  //     date_filter,
                                                                                  //     rev_id,
                                                                                  //     status,
                                                                                  //   },
                                                                                  //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                                  //   error
                                                                                  // );

                                                                                  throw error;
                                                                                }

                                                                                // eslint-disable-next-line eqeqeq
                                                                                console.log(
                                                                                  '>>>>>>>>>>>>>>>>>>>>>>>masuk delete 2<<<<<<<<<<<<<<<<'
                                                                                );
                                                                                console.log(
                                                                                  results.rowCount
                                                                                );
                                                                                if (
                                                                                  results.rowCount !=
                                                                                  0
                                                                                ) {
                                                                                  pool.db_MMFPROD.query(
                                                                                    `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                                                        off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                                                        url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                                                        values ('MMF',$1, $2::timestamp , 0, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                                                        null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                                                    [
                                                                                      employee_id,
                                                                                      data_correction_time_in,
                                                                                    ],
                                                                                    (
                                                                                      error,
                                                                                      results
                                                                                    ) => {
                                                                                      if (
                                                                                        error
                                                                                      ) {
                                                                                        // Helpers.logger(
                                                                                        //   'ERROR',
                                                                                        //   {
                                                                                        //     employee_id,
                                                                                        //     date_filter,
                                                                                        //     rev_id,
                                                                                        //     status,
                                                                                        //   },
                                                                                        //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                                        //   error
                                                                                        // );

                                                                                        throw error;
                                                                                      }

                                                                                      // eslint-disable-next-line eqeqeq
                                                                                      if (
                                                                                        results.rowCount !=
                                                                                        0
                                                                                      ) {
                                                                                        pool.db_MMFPROD.query(
                                                                                          `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                                                            off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                                                            url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                                                            values ('MMF',$1, $2::timestamp , 1, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                                                            null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                                                          [
                                                                                            employee_id,
                                                                                            data_correction_time_out,
                                                                                          ],
                                                                                          (
                                                                                            error,
                                                                                            results
                                                                                          ) => {
                                                                                            if (
                                                                                              error
                                                                                            ) {
                                                                                              // Helpers.logger(
                                                                                              //   'ERROR',
                                                                                              //   {
                                                                                              //     employee_id,
                                                                                              //     date_filter,
                                                                                              //     rev_id,
                                                                                              //     status,
                                                                                              //   },
                                                                                              //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                                              //   error
                                                                                              // );

                                                                                              throw error;
                                                                                            }

                                                                                            // eslint-disable-next-line eqeqeq
                                                                                            if (
                                                                                              results.rowCount !=
                                                                                              0
                                                                                            ) {
                                                                                              console.log(
                                                                                                'data berhasil di update 3'
                                                                                              );
                                                                                            } else {
                                                                                              console.log(
                                                                                                'data tidak ditemukan 1'
                                                                                              );
                                                                                            }
                                                                                          }
                                                                                        );
                                                                                      } else {
                                                                                        console.log(
                                                                                          'tidak berhasil bosku'
                                                                                        );
                                                                                      }
                                                                                    }
                                                                                  );
                                                                                } else {
                                                                                  console.log(
                                                                                    'data tidak ditemukan 2'
                                                                                  );
                                                                                }
                                                                              }
                                                                            );
                                                                          } else {
                                                                            console.log(
                                                                              'data tidak ditemukan 3'
                                                                            );
                                                                          }
                                                                        }
                                                                      );
                                                                    } else {
                                                                      console.log(
                                                                        'data tidak ditemukan 4'
                                                                      );
                                                                    }
                                                                  }
                                                                );
                                                              }
                                                            }
                                                          );
                                                        } else {
                                                          console.log(
                                                            'data tidak ditemukan 5'
                                                          );
                                                        }
                                                      }
                                                    );
                                                  } else {
                                                    pool.db_MMFPROD.query(
                                                      `select company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note, transfer_message ,
                                                        state,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,
                                                        location_method ,golid ,golversion 
                                                        from emp_clocking_temp_tbl ectt 
                                                        where employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD') = to_Char($2::date,'YYYY-MM-DD')`,
                                                      [
                                                        employee_id,
                                                        data_perbaikan[i].date,
                                                      ],
                                                      (error, results) => {
                                                        if (error) {
                                                          // Helpers.logger(
                                                          //   'ERROR',
                                                          //   {
                                                          //     employee_id,
                                                          //     date_filter,
                                                          //     rev_id,
                                                          //     status,
                                                          //   },
                                                          //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                          //   error
                                                          // );

                                                          throw error;
                                                        }

                                                        // eslint-disable-next-line eqeqeq
                                                        if (results.rows != 0) {
                                                          const data2_company_id =
                                                            results.rows[0]
                                                              .company_id;
                                                          const data2_in_out =
                                                            results.rows[0]
                                                              .in_out;
                                                          const data2_terminal_id =
                                                            results.rows[0]
                                                              .terminal_id;
                                                          const data2_off_site =
                                                            results.rows[0]
                                                              .off_site;
                                                          const data2_transfer_message =
                                                            results.rows[0]
                                                              .transfer_message;
                                                          const data2_note =
                                                            results.rows[0]
                                                              .note;
                                                          const data2_state =
                                                            results.rows[0]
                                                              .state;
                                                          const data2_latitude =
                                                            results.rows[0]
                                                              .latitude;
                                                          const data2_altitude =
                                                            results.rows[0]
                                                              .altitude;
                                                          const data2_longitude =
                                                            results.rows[0]
                                                              .longitude;
                                                          const data2_accuracy =
                                                            results.rows[0]
                                                              .accuracy;
                                                          const data2_location_no =
                                                            results.rows[0]
                                                              .location_no;
                                                          const data2_url_photo =
                                                            results.rows[0]
                                                              .url_photo;
                                                          const data2_url_remove =
                                                            results.rows[0]
                                                              .url_remove;
                                                          const data2_golversion =
                                                            results.rows[0]
                                                              .golversion;
                                                          const data2_file_name =
                                                            results.rows[0]
                                                              .file_name;
                                                          const data2_golid =
                                                            results.rows[0]
                                                              .golid;
                                                          const data2_location_method =
                                                            results.rows[0]
                                                              .location_method;

                                                          pool.db_HCM.query(
                                                            `insert into temp_emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note, transfer_message ,
                                                                state,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,
                                                                location_method ,golid ,golversion,  cor_absence_id)
                                                                values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20, $21)`,
                                                            [
                                                              data2_company_id,
                                                              employee_id,
                                                              data_perbaikan[i]
                                                                .date,
                                                              data2_in_out,
                                                              data2_terminal_id,
                                                              data2_off_site,
                                                              data2_note,
                                                              data2_transfer_message,
                                                              data2_state,
                                                              data2_latitude,
                                                              data2_altitude,
                                                              data2_longitude,
                                                              data2_accuracy,
                                                              data2_location_no,
                                                              data2_url_photo,
                                                              data2_url_remove,
                                                              data2_file_name,
                                                              data2_location_method,
                                                              data2_golid,
                                                              data2_golversion,
                                                              golid,
                                                            ],
                                                            (
                                                              error,
                                                              results
                                                            ) => {
                                                              if (error) {
                                                                // Helpers.logger(
                                                                //   'ERROR',
                                                                //   {
                                                                //     employee_id,
                                                                //     date_filter,
                                                                //     rev_id,
                                                                //     status,
                                                                //   },
                                                                //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                //   error
                                                                // );

                                                                throw error;
                                                              }

                                                              // eslint-disable-next-line eqeqeq
                                                              console.log(
                                                                '>>>>>>>>>>>>>>>>>>>>>>>masuk insert 2<<<<<<<<<<<<<<<<'
                                                              );
                                                              if (
                                                                results.rowCount !=
                                                                0
                                                              ) {
                                                                pool.db_MMFPROD.query(
                                                                  `delete from emp_clocking_temp_tbl where company_id='MMF' 
                                                                    and employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD') = to_char($2::date,'YYYY-MM-DD') `,
                                                                  [
                                                                    employee_id,
                                                                    data_perbaikan[
                                                                      i
                                                                    ].date,
                                                                  ],
                                                                  (
                                                                    error,
                                                                    results
                                                                  ) => {
                                                                    if (error) {
                                                                      // Helpers.logger(
                                                                      //   'ERROR',
                                                                      //   {
                                                                      //     employee_id,
                                                                      //     date_filter,
                                                                      //     rev_id,
                                                                      //     status,
                                                                      //   },
                                                                      //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                      //   error
                                                                      // );

                                                                      throw error;
                                                                    }

                                                                    // eslint-disable-next-line eqeqeq
                                                                    console.log(
                                                                      '>>>>>>>>>>>>>>>>>>>>>>>masuk delete 2<<<<<<<<<<<<<<<<'
                                                                    );
                                                                    if (
                                                                      results.rowCount !=
                                                                      0
                                                                    ) {
                                                                      pool.db_MMFPROD.query(
                                                                        `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                                            off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                                            url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                                            values ('MMF',$1, $2::timestamp , 0, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                                            null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                                        [
                                                                          employee_id,
                                                                          data_correction_time_in,
                                                                        ],
                                                                        (
                                                                          error,
                                                                          results
                                                                        ) => {
                                                                          if (
                                                                            error
                                                                          ) {
                                                                            // Helpers.logger(
                                                                            //   'ERROR',
                                                                            //   {
                                                                            //     employee_id,
                                                                            //     date_filter,
                                                                            //     rev_id,
                                                                            //     status,
                                                                            //   },
                                                                            //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                            //   error
                                                                            // );

                                                                            throw error;
                                                                          }

                                                                          // eslint-disable-next-line eqeqeq
                                                                          if (
                                                                            results.rowCount !=
                                                                            0
                                                                          ) {
                                                                            pool.db_MMFPROD.query(
                                                                              `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                                                off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                                                url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                                                values ('MMF',$1, $2::timestamp , 1, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                                                null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                                              [
                                                                                employee_id,
                                                                                data_correction_time_out,
                                                                              ],
                                                                              (
                                                                                error,
                                                                                results
                                                                              ) => {
                                                                                if (
                                                                                  error
                                                                                ) {
                                                                                  // Helpers.logger(
                                                                                  //   'ERROR',
                                                                                  //   {
                                                                                  //     employee_id,
                                                                                  //     date_filter,
                                                                                  //     rev_id,
                                                                                  //     status,
                                                                                  //   },
                                                                                  //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                                  //   error
                                                                                  // );

                                                                                  throw error;
                                                                                }

                                                                                // eslint-disable-next-line eqeqeq
                                                                                if (
                                                                                  results.rowCount !=
                                                                                  0
                                                                                ) {
                                                                                  console.log(
                                                                                    'data berhasil di update 4'
                                                                                  );
                                                                                } else {
                                                                                  console.log(
                                                                                    'data tidak ditemukan 6'
                                                                                  );
                                                                                }
                                                                              }
                                                                            );
                                                                          } else {
                                                                            console.log(
                                                                              'tidak berhasil bosku'
                                                                            );
                                                                          }
                                                                        }
                                                                      );
                                                                    } else {
                                                                      console.log(
                                                                        'data tidak ditemukan 7'
                                                                      );
                                                                    }
                                                                  }
                                                                );
                                                              } else {
                                                                console.log(
                                                                  'data tidak ditemukan 8'
                                                                );
                                                              }
                                                            }
                                                          );
                                                        } else {
                                                          console.log(
                                                            'data tidak ditemukan 9'
                                                          );
                                                        }
                                                      }
                                                    );
                                                  }
                                                }
                                              );
                                            } else {
                                              console.log(
                                                'data tidak ditemukan 10'
                                              );
                                            }
                                          }
                                        );
                                      } else {
                                        console.log('insert data gagal 1');
                                      }
                                    }
                                  );
                                } else {
                                  pool.db_MMFPROD.query(
                                    `select company_id ,employee_id ,clocking_date ,time_in ,time_out ,off_site ,is_break ,note ,in_terminal,
                                      out_terminal ,in_reg_type ,out_reg_type, absence_wage ,in_location ,out_location ,golid ,golversion 
                                      from emp_clocking_detail_tbl ecdt 
                                      where employee_id =$1 and clocking_date = $2
                                      order by clocking_date desc`,
                                    [employee_id, data_perbaikan[i].date],
                                    (error, results) => {
                                      if (error) {
                                        // Helpers.logger(
                                        //   'ERROR',
                                        //   {
                                        //     employee_id,
                                        //     date_filter,
                                        //     rev_id,
                                        //     status,
                                        //   },
                                        //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                        //   error
                                        // );

                                        throw error;
                                      }

                                      // eslint-disable-next-line eqeqeq
                                      if (results.rows != 0) {
                                        const data1_company_id =
                                          results.rows[0].company_id;
                                        const data1_time_in =
                                          results.rows[0].time_in;
                                        const data1_time_out =
                                          results.rows[0].time_out;
                                        const data1_off_site =
                                          results.rows[0].off_site;
                                        const data1_is_break =
                                          results.rows[0].is_break;
                                        const data1_note = results.rows[0].note;
                                        const data1_in_terminal =
                                          results.rows[0].in_terminal;
                                        const data1_out_terminal =
                                          results.rows[0].out_terminal;
                                        const data1_in_reg_type =
                                          results.rows[0].in_reg_type;
                                        const data1_out_reg_type =
                                          results.rows[0].out_reg_type;
                                        const data1_absence_wage =
                                          results.rows[0].absence_wage;
                                        const data1_in_location =
                                          results.rows[0].in_location;
                                        const data1_out_location =
                                          results.rows[0].out_location;
                                        const data1_golid =
                                          results.rows[0].golid;
                                        const data1_golversion =
                                          results.rows[0].golversion;

                                        pool.db_HCM.query(
                                          `insert into temp_emp_clocking_detail_tbl (company_id ,employee_id ,clocking_date ,time_in ,time_out ,off_site ,is_break ,note ,in_terminal,
                                              out_terminal ,in_reg_type ,out_reg_type, absence_wage ,in_location ,out_location ,golid ,golversion, cor_absence_id  )
                                              values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
                                          [
                                            data1_company_id,
                                            employee_id,
                                            data_perbaikan[i].date,
                                            data1_time_in,
                                            data1_time_out,
                                            data1_off_site,
                                            data1_is_break,
                                            data1_note,
                                            data1_in_terminal,
                                            data1_out_terminal,
                                            data1_in_reg_type,
                                            data1_out_reg_type,
                                            data1_absence_wage,
                                            data1_in_location,
                                            data1_out_location,
                                            data1_golid,
                                            data1_golversion,
                                            golid,
                                          ],
                                          (error, results) => {
                                            if (error) {
                                              // Helpers.logger(
                                              //   'ERROR',
                                              //   {
                                              //     employee_id,
                                              //     date_filter,
                                              //     rev_id,
                                              //     status,
                                              //   },
                                              //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                              //   error
                                              // );

                                              throw error;
                                            }

                                            // eslint-disable-next-line eqeqeq
                                            console.log(
                                              '>>>>>>>>>>>>>>>>>>>>>>>masuk insert 2<<<<<<<<<<<<<<<<'
                                            );
                                            if (results.rowCount != 0) {
                                              pool.db_MMFPROD.query(
                                                `delete from emp_clocking_detail_tbl where employee_id =$1 and clocking_date = $2 `,
                                                [
                                                  employee_id,
                                                  data_perbaikan[i].date,
                                                ],
                                                (error, results) => {
                                                  if (error) {
                                                    // Helpers.logger(
                                                    //   'ERROR',
                                                    //   {
                                                    //     employee_id,
                                                    //     date_filter,
                                                    //     rev_id,
                                                    //     status,
                                                    //   },
                                                    //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                    //   error
                                                    // );

                                                    throw error;
                                                  }

                                                  // eslint-disable-next-line eqeqeq
                                                  console.log(
                                                    '>>>>>>>>>>>>>>>>>>>>>>>masuk delete 2<<<<<<<<<<<<<<<<'
                                                  );
                                                  if (results.rowCount != 0) {
                                                    pool.db_MMFPROD.query(
                                                      `select company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note, transfer_message ,
                                                        state,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,
                                                        location_method ,golid ,golversion 
                                                        from emp_clocking_temp_tbl ectt 
                                                        where employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD') = to_Char($2::date,'YYYY-MM-DD')`,
                                                      [
                                                        employee_id,
                                                        data_perbaikan[i].date,
                                                      ],
                                                      (error, results) => {
                                                        if (error) {
                                                          // Helpers.logger(
                                                          //   'ERROR',
                                                          //   {
                                                          //     employee_id,
                                                          //     date_filter,
                                                          //     rev_id,
                                                          //     status,
                                                          //   },
                                                          //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                          //   error
                                                          // );

                                                          throw error;
                                                        }

                                                        // eslint-disable-next-line eqeqeq
                                                        if (results.rows != 0) {
                                                          const data2_company_id =
                                                            results.rows[0]
                                                              .company_id;
                                                          const data2_in_out =
                                                            results.rows[0]
                                                              .in_out;
                                                          const data2_terminal_id =
                                                            results.rows[0]
                                                              .terminal_id;
                                                          const data2_off_site =
                                                            results.rows[0]
                                                              .off_site;
                                                          const data2_transfer_message =
                                                            results.rows[0]
                                                              .transfer_message;
                                                          const data2_note =
                                                            results.rows[0]
                                                              .note;
                                                          const data2_state =
                                                            results.rows[0]
                                                              .state;
                                                          const data2_latitude =
                                                            results.rows[0]
                                                              .latitude;
                                                          const data2_altitude =
                                                            results.rows[0]
                                                              .altitude;
                                                          const data2_longitude =
                                                            results.rows[0]
                                                              .longitude;
                                                          const data2_accuracy =
                                                            results.rows[0]
                                                              .accuracy;
                                                          const data2_location_no =
                                                            results.rows[0]
                                                              .location_no;
                                                          const data2_url_photo =
                                                            results.rows[0]
                                                              .url_photo;
                                                          const data2_url_remove =
                                                            results.rows[0]
                                                              .url_remove;
                                                          const data2_golversion =
                                                            results.rows[0]
                                                              .golversion;
                                                          const data2_file_name =
                                                            results.rows[0]
                                                              .file_name;
                                                          const data2_golid =
                                                            results.rows[0]
                                                              .golid;
                                                          const data2_location_method =
                                                            results.rows[0]
                                                              .location_method;

                                                          pool.db_HCM.query(
                                                            `insert into temp_emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note, transfer_message ,
                                                                state,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,
                                                                location_method ,golid ,golversion,  cor_absence_id)
                                                                values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20, $21)`,
                                                            [
                                                              data2_company_id,
                                                              employee_id,
                                                              data_perbaikan[i]
                                                                .date,
                                                              data2_in_out,
                                                              data2_terminal_id,
                                                              data2_off_site,
                                                              data2_note,
                                                              data2_transfer_message,
                                                              data2_state,
                                                              data2_latitude,
                                                              data2_altitude,
                                                              data2_longitude,
                                                              data2_accuracy,
                                                              data2_location_no,
                                                              data2_url_photo,
                                                              data2_url_remove,
                                                              data2_file_name,
                                                              data2_location_method,
                                                              data2_golid,
                                                              data2_golversion,
                                                              golid,
                                                            ],
                                                            (
                                                              error,
                                                              results
                                                            ) => {
                                                              if (error) {
                                                                // Helpers.logger(
                                                                //   'ERROR',
                                                                //   {
                                                                //     employee_id,
                                                                //     date_filter,
                                                                //     rev_id,
                                                                //     status,
                                                                //   },
                                                                //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                //   error
                                                                // );

                                                                throw error;
                                                              }

                                                              // eslint-disable-next-line eqeqeq
                                                              console.log(
                                                                '>>>>>>>>>>>>>>>>>>>>>>>masuk insert 2<<<<<<<<<<<<<<<<'
                                                              );
                                                              if (
                                                                results.rowCount !=
                                                                0
                                                              ) {
                                                                pool.db_MMFPROD.query(
                                                                  `delete from emp_clocking_temp_tbl where company_id='MMF' 
                                                                    and employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD') = to_char($2::date,'YYYY-MM-DD') `,
                                                                  [
                                                                    employee_id,
                                                                    data_perbaikan[
                                                                      i
                                                                    ].date,
                                                                  ],
                                                                  (
                                                                    error,
                                                                    results
                                                                  ) => {
                                                                    if (error) {
                                                                      // Helpers.logger(
                                                                      //   'ERROR',
                                                                      //   {
                                                                      //     employee_id,
                                                                      //     date_filter,
                                                                      //     rev_id,
                                                                      //     status,
                                                                      //   },
                                                                      //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                      //   error
                                                                      // );

                                                                      throw error;
                                                                    }

                                                                    // eslint-disable-next-line eqeqeq
                                                                    console.log(
                                                                      '>>>>>>>>>>>>>>>>>>>>>>>masuk delete 2<<<<<<<<<<<<<<<<'
                                                                    );
                                                                    if (
                                                                      results.rowCount !=
                                                                      0
                                                                    ) {
                                                                      pool.db_MMFPROD.query(
                                                                        `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                                            off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                                            url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                                            values ('MMF',$1, $2::timestamp , 0, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                                            null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                                        [
                                                                          employee_id,
                                                                          data_correction_time_in,
                                                                        ],
                                                                        (
                                                                          error,
                                                                          results
                                                                        ) => {
                                                                          if (
                                                                            error
                                                                          ) {
                                                                            // Helpers.logger(
                                                                            //   'ERROR',
                                                                            //   {
                                                                            //     employee_id,
                                                                            //     date_filter,
                                                                            //     rev_id,
                                                                            //     status,
                                                                            //   },
                                                                            //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                            //   error
                                                                            // );

                                                                            throw error;
                                                                          }

                                                                          // eslint-disable-next-line eqeqeq
                                                                          if (
                                                                            results.rowCount !=
                                                                            0
                                                                          ) {
                                                                            pool.db_MMFPROD.query(
                                                                              `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                                                off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                                                url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                                                values ('MMF',$1, $2::timestamp , 1, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                                                null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                                              [
                                                                                employee_id,
                                                                                data_correction_time_out,
                                                                              ],
                                                                              (
                                                                                error,
                                                                                results
                                                                              ) => {
                                                                                if (
                                                                                  error
                                                                                ) {
                                                                                  // Helpers.logger(
                                                                                  //   'ERROR',
                                                                                  //   {
                                                                                  //     employee_id,
                                                                                  //     date_filter,
                                                                                  //     rev_id,
                                                                                  //     status,
                                                                                  //   },
                                                                                  //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                                  //   error
                                                                                  // );

                                                                                  throw error;
                                                                                }

                                                                                // eslint-disable-next-line eqeqeq
                                                                                if (
                                                                                  results.rowCount !=
                                                                                  0
                                                                                ) {
                                                                                  console.log(
                                                                                    'data berhasil di update'
                                                                                  );
                                                                                } else {
                                                                                  console.log(
                                                                                    'data tidak ditemukan 11'
                                                                                  );
                                                                                }
                                                                              }
                                                                            );
                                                                          } else {
                                                                            console.log(
                                                                              'tidak berhasil bosku'
                                                                            );
                                                                          }
                                                                        }
                                                                      );
                                                                    } else {
                                                                      console.log(
                                                                        'data tidak ditemukan 12'
                                                                      );
                                                                    }
                                                                  }
                                                                );
                                                              } else {
                                                                console.log(
                                                                  'data tidak ditemukan 13'
                                                                );
                                                              }
                                                            }
                                                          );
                                                        } else {
                                                          pool.db_MMFPROD.query(
                                                            `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                                off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                                url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                                values ('MMF',$1, $2::timestamp , 0, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                                null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                            [
                                                              employee_id,
                                                              data_correction_time_in,
                                                            ],
                                                            (
                                                              error,
                                                              results
                                                            ) => {
                                                              if (error) {
                                                                // Helpers.logger(
                                                                //   'ERROR',
                                                                //   {
                                                                //     employee_id,
                                                                //     date_filter,
                                                                //     rev_id,
                                                                //     status,
                                                                //   },
                                                                //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                //   error
                                                                // );

                                                                throw error;
                                                              }

                                                              // eslint-disable-next-line eqeqeq
                                                              if (
                                                                results.rowCount !=
                                                                0
                                                              ) {
                                                                pool.db_MMFPROD.query(
                                                                  `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                                    off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                                    url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                                    values ('MMF',$1, $2::timestamp , 1, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                                    null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                                  [
                                                                    employee_id,
                                                                    data_correction_time_out,
                                                                  ],
                                                                  (
                                                                    error,
                                                                    results
                                                                  ) => {
                                                                    if (error) {
                                                                      // Helpers.logger(
                                                                      //   'ERROR',
                                                                      //   {
                                                                      //     employee_id,
                                                                      //     date_filter,
                                                                      //     rev_id,
                                                                      //     status,
                                                                      //   },
                                                                      //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                      //   error
                                                                      // );

                                                                      throw error;
                                                                    }

                                                                    // eslint-disable-next-line eqeqeq
                                                                    if (
                                                                      results.rowCount !=
                                                                      0
                                                                    ) {
                                                                      console.log(
                                                                        'data berhasil di update'
                                                                      );
                                                                    } else {
                                                                      console.log(
                                                                        'data tidak ditemukan 11'
                                                                      );
                                                                    }
                                                                  }
                                                                );
                                                              } else {
                                                                console.log(
                                                                  'tidak berhasil bosku'
                                                                );
                                                              }
                                                            }
                                                          );
                                                        }
                                                      }
                                                    );
                                                  }
                                                }
                                              );
                                            } else {
                                              console.log(
                                                'data tidak ditemukan 15'
                                              );
                                            }
                                          }
                                        );
                                      } else {
                                        pool.db_MMFPROD.query(
                                          `select company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note, transfer_message ,
                                            state,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,
                                            location_method ,golid ,golversion 
                                            from emp_clocking_temp_tbl ectt 
                                            where employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD') = to_Char($2::date,'YYYY-MM-DD')`,
                                          [employee_id, data_perbaikan[i].date],
                                          (error, results) => {
                                            if (error) {
                                              // Helpers.logger(
                                              //   'ERROR',
                                              //   {
                                              //     employee_id,
                                              //     date_filter,
                                              //     rev_id,
                                              //     status,
                                              //   },
                                              //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                              //   error
                                              // );

                                              throw error;
                                            }

                                            // eslint-disable-next-line eqeqeq
                                            if (results.rows != 0) {
                                              const data2_company_id =
                                                results.rows[0].company_id;
                                              const data2_in_out =
                                                results.rows[0].in_out;
                                              const data2_terminal_id =
                                                results.rows[0].terminal_id;
                                              const data2_off_site =
                                                results.rows[0].off_site;
                                              const data2_transfer_message =
                                                results.rows[0]
                                                  .transfer_message;
                                              const data2_note =
                                                results.rows[0].note;
                                              const data2_state =
                                                results.rows[0].state;
                                              const data2_latitude =
                                                results.rows[0].latitude;
                                              const data2_altitude =
                                                results.rows[0].altitude;
                                              const data2_longitude =
                                                results.rows[0].longitude;
                                              const data2_accuracy =
                                                results.rows[0].accuracy;
                                              const data2_location_no =
                                                results.rows[0].location_no;
                                              const data2_url_photo =
                                                results.rows[0].url_photo;
                                              const data2_url_remove =
                                                results.rows[0].url_remove;
                                              const data2_golversion =
                                                results.rows[0].golversion;
                                              const data2_file_name =
                                                results.rows[0].file_name;
                                              const data2_golid =
                                                results.rows[0].golid;
                                              const data2_location_method =
                                                results.rows[0].location_method;

                                              pool.db_HCM.query(
                                                `insert into temp_emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,off_site ,note, transfer_message ,
                                                    state,latitude ,altitude ,longitude ,accuracy ,location_no ,url_photo ,url_remove ,file_name ,
                                                    location_method ,golid ,golversion,  cor_absence_id)
                                                    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20, $21)`,
                                                [
                                                  data2_company_id,
                                                  employee_id,
                                                  data_perbaikan[i].date,
                                                  data2_in_out,
                                                  data2_terminal_id,
                                                  data2_off_site,
                                                  data2_note,
                                                  data2_transfer_message,
                                                  data2_state,
                                                  data2_latitude,
                                                  data2_altitude,
                                                  data2_longitude,
                                                  data2_accuracy,
                                                  data2_location_no,
                                                  data2_url_photo,
                                                  data2_url_remove,
                                                  data2_file_name,
                                                  data2_location_method,
                                                  data2_golid,
                                                  data2_golversion,
                                                  golid,
                                                ],
                                                (error, results) => {
                                                  if (error) {
                                                    // Helpers.logger(
                                                    //   'ERROR',
                                                    //   {
                                                    //     employee_id,
                                                    //     date_filter,
                                                    //     rev_id,
                                                    //     status,
                                                    //   },
                                                    //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                    //   error
                                                    // );

                                                    throw error;
                                                  }

                                                  // eslint-disable-next-line eqeqeq
                                                  console.log(
                                                    '>>>>>>>>>>>>>>>>>>>>>>>masuk insert 2<<<<<<<<<<<<<<<<'
                                                  );
                                                  if (results.rowCount != 0) {
                                                    pool.db_MMFPROD.query(
                                                      `delete from emp_clocking_temp_tbl where company_id='MMF' 
                                                        and employee_id =$1 and to_char(clocking_date,'YYYY-MM-DD') = to_char($2::date,'YYYY-MM-DD') `,
                                                      [
                                                        employee_id,
                                                        data_perbaikan[i].date,
                                                      ],
                                                      (error, results) => {
                                                        if (error) {
                                                          // Helpers.logger(
                                                          //   'ERROR',
                                                          //   {
                                                          //     employee_id,
                                                          //     date_filter,
                                                          //     rev_id,
                                                          //     status,
                                                          //   },
                                                          //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                          //   error
                                                          // );

                                                          throw error;
                                                        }

                                                        // eslint-disable-next-line eqeqeq
                                                        console.log(
                                                          '>>>>>>>>>>>>>>>>>>>>>>>masuk delete 2<<<<<<<<<<<<<<<<'
                                                        );
                                                        if (
                                                          results.rowCount != 0
                                                        ) {
                                                          pool.db_MMFPROD.query(
                                                            `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                                off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                                url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                                values ('MMF',$1, $2::timestamp , 0, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                                null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                            [
                                                              employee_id,
                                                              data_correction_time_in,
                                                            ],
                                                            (
                                                              error,
                                                              results
                                                            ) => {
                                                              if (error) {
                                                                // Helpers.logger(
                                                                //   'ERROR',
                                                                //   {
                                                                //     employee_id,
                                                                //     date_filter,
                                                                //     rev_id,
                                                                //     status,
                                                                //   },
                                                                //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                //   error
                                                                // );

                                                                throw error;
                                                              }

                                                              // eslint-disable-next-line eqeqeq
                                                              if (
                                                                results.rowCount !=
                                                                0
                                                              ) {
                                                                pool.db_MMFPROD.query(
                                                                  `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                                    off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                                    url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                                    values ('MMF',$1, $2::timestamp , 1, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                                    null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                                  [
                                                                    employee_id,
                                                                    data_correction_time_out,
                                                                  ],
                                                                  (
                                                                    error,
                                                                    results
                                                                  ) => {
                                                                    if (error) {
                                                                      // Helpers.logger(
                                                                      //   'ERROR',
                                                                      //   {
                                                                      //     employee_id,
                                                                      //     date_filter,
                                                                      //     rev_id,
                                                                      //     status,
                                                                      //   },
                                                                      //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                                      //   error
                                                                      // );

                                                                      throw error;
                                                                    }

                                                                    // eslint-disable-next-line eqeqeq
                                                                    if (
                                                                      results.rowCount !=
                                                                      0
                                                                    ) {
                                                                      console.log(
                                                                        'data berhasil diupdate 1 '
                                                                      );
                                                                    } else {
                                                                      console.log(
                                                                        'data tidak ditemukan 16'
                                                                      );
                                                                    }
                                                                  }
                                                                );
                                                              } else {
                                                                console.log(
                                                                  'tidak berhasil bosku'
                                                                );
                                                              }
                                                            }
                                                          );
                                                        } else {
                                                          console.log(
                                                            'data tidak ditemukan 17'
                                                          );
                                                        }
                                                      }
                                                    );
                                                  } else {
                                                    console.log(
                                                      'data tidak ditemukan 18'
                                                    );
                                                  }
                                                }
                                              );
                                            } else {
                                              pool.db_MMFPROD.query(
                                                `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                    off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                    url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                    values ('MMF',$1, $2::timestamp , 0, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                    null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                [
                                                  employee_id,
                                                  data_correction_time_in,
                                                ],
                                                (error, results) => {
                                                  if (error) {
                                                    // Helpers.logger(
                                                    //   'ERROR',
                                                    //   {
                                                    //     employee_id,
                                                    //     date_filter,
                                                    //     rev_id,
                                                    //     status,
                                                    //   },
                                                    //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                    //   error
                                                    // );

                                                    throw error;
                                                  }

                                                  // eslint-disable-next-line eqeqeq
                                                  if (results.rowCount != 0) {
                                                    pool.db_MMFPROD.query(
                                                      `insert into emp_clocking_temp_tbl (company_id ,employee_id ,clocking_date ,in_out ,terminal_id ,
                                                        off_site ,note , transfer_message ,state ,latitude ,altitude ,longitude ,accuracy ,location_no ,
                                                        url_photo ,url_remove ,file_name ,location_method , golid,golversion ) 
                                                        values ('MMF',$1, $2::timestamp , 1, null, null, 'Perbaikan Absen by HCM, Pengajuan tanggal '||to_char($2::timestamp,'DD/MM/YYY') , null , 'Prepared',null, null, null, null, null, null, 
                                                        null, null, null,nextval('emp_clocking_temp_tbl_golid_seq'),1)`,
                                                      [
                                                        employee_id,
                                                        data_correction_time_out,
                                                      ],
                                                      (error, results) => {
                                                        if (error) {
                                                          // Helpers.logger(
                                                          //   'ERROR',
                                                          //   {
                                                          //     employee_id,
                                                          //     date_filter,
                                                          //     rev_id,
                                                          //     status,
                                                          //   },
                                                          //   'RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence',
                                                          //   error
                                                          // );

                                                          throw error;
                                                        }

                                                        // eslint-disable-next-line eqeqeq
                                                        if (
                                                          results.rowCount != 0
                                                        ) {
                                                          console.log(
                                                            'data berhasil di update 2'
                                                          );
                                                        } else {
                                                          console.log(
                                                            'data tidak ditemukan 19'
                                                          );
                                                        }
                                                      }
                                                    );
                                                  } else {
                                                    console.log(
                                                      'tidak berhasil bosku'
                                                    );
                                                  }
                                                }
                                              );
                                            }
                                          }
                                        );
                                      }
                                    }
                                  );
                                }
                              }
                            );
                          } else {
                            console.log('Data already Updated');
                          }
                        }
                      }
                    );
                  }
                  //end of for
                  // insert notification perubahan absen -- start
                  // const data = {
                  //   employee_id,
                  //   data_nama_pengaju,
                  //   submission_id: '2',
                  // };

                  // const options = {
                  //   headers: {
                  //     'Content-Type': 'application/json',
                  //     API_KEY: process.env.API_KEY,
                  //   },
                  // };

                  // axios
                  //   .post(
                  //     `${process.env.URL}/hcm/api/pNRevAbsen`,
                  //     data,
                  //     options
                  //   )
                  //   .then((res) => {
                  //     console.log('RESPONSE ==== : ', res.data);
                  //   })
                  //   .catch((err) => {
                  //     console.log('ERROR: ====', err);
                  //     throw err;
                  //   });
                  // insert notification perubahan absen -- end

                  //email + wa feature
                  const subject_email = `Pengajuan Perbaikan Absen 'Approved/Rejected'`;
                  // const email_to = data_email_pengaju;
                  const email_to = 'panjaitankengkeng2@gmail.com';
                  pool.db_HCM.query(
                    'select * from param_hcm ',
                    (error, results) => {
                      if (error) throw error;

                      if (results.rowCount > 0) {
                        // map hostmail
                        const hostMailValue = _.filter(
                          results.rows,
                          // eslint-disable-next-line eqeqeq
                          (o) => o.setting_name == 'Host Feedback'
                        );

                        // map userMailValue
                        const userMailValue = _.filter(
                          results.rows,
                          // eslint-disable-next-line eqeqeq
                          (o) => o.setting_name == 'Email Feedback'
                        );

                        const passwordMailValue = _.filter(
                          results.rows,
                          // eslint-disable-next-line eqeqeq
                          (o) => o.setting_name == 'Password Feedback'
                        );

                        const hostMail = hostMailValue[0].setting_value;

                        const userMail = userMailValue[0].setting_value;

                        const passwordMail = passwordMailValue[0].setting_value;

                        const day = dateFormat(new Date(), 'yyyy-mm-dd');

                        const transporter = nodemailer.createTransport({
                          host: hostMail,
                          port: 587,
                          secure: false, // use SSL
                          auth: {
                            user: userMail,
                            pass: passwordMail,
                          },
                          tls: {
                            rejectUnauthorized: false,
                          },
                        });

                        let detail_pengajuan = [];
                        for (let i = 0; i < data_perbaikan.length; i++) {
                          detail_pengajuan[i] =
                            data_perbaikan[i].date +
                            ' - ' +
                            data_perbaikan[i].status +
                            '\n';
                        }
                        const mailOptions = {
                          from: userMail,
                          to: email_to,
                          subject: subject_email,
                          text:
                            `Dear ${data_nama_pengaju} \n` +
                            '\n' +
                            `No.Karyawan : ${employee_id} \n` +
                            `Tanggal pengajuan perbaikan : ${day} sudah dilakukan proses approval/tolak \n` +
                            'mohon cek kembali di riwayat absen mu  \n' +
                            '\n' +
                            `${detail_pengajuan}` +
                            '\n' +
                            'Demikian pengajuan yang disampaikan \n' +
                            '\n' +
                            'Salam Hormat \n' +
                            `${data_nama_atasan}`,
                        };

                        transporter.sendMail(mailOptions, (error) => {
                          if (error) {
                            console.error(
                              'ERROR (email tidak ada): ====',
                              error
                            );

                            console.log(
                              'email tidak ada atau tidak dapat mengirim ke email terdaftar'
                            );
                          }

                          // const data_no_hp_supervisor = data;
                          // insert wa message -- start
                          const data = {
                            // to: data_no_hp_pengaju,
                            to: '085156249767',
                            header: 'Pengajuan Perbaikan Absen',
                            text:
                              `Dear ${data_nama_pengaju} \n` +
                              '\n' +
                              `No.Karyawan : ${employee_id} \n` +
                              `Tanggal pengajuan perbaikan : ${day} sudah dilakukan proses approval/tolak \n` +
                              'mohon cek kembali di riwayat absen mu  \n' +
                              '\n' +
                              `${detail_pengajuan}` +
                              '\n' +
                              'Demikian pengajuan yang disampaikan \n' +
                              '\n' +
                              'Salam Hormat \n' +
                              `${data_nama_atasan}`,
                          };

                          const options = {
                            headers: {
                              'Content-Type': 'application/json',
                              API_KEY: process.env.API_KEY,
                            },
                          };

                          axios
                            .post(process.env.WA_SERVICE, data, options)
                            .then((res) => {
                              console.log('RESPONSE ==== : ', res.data);
                            })
                            .catch((err) => {
                              console.error(
                                'ERROR (nomor telepon tidak ada): ====',
                                err
                              );

                              console.log(
                                'Kami mengetahui bahwa nomor telepon ini di sistem tidak ada!'
                              );
                            });
                          // insert wa message -- end

                          response.status(200).send({
                            status: 200,
                            message:
                              'Berhasil memperbaharui data serta mengirim email dan whatsapp',
                            data: '',
                          });
                        });
                      } else {
                        response.status(200).send({
                          status: 200,
                          message: 'Data Tidak Ditemukan',
                          data: '',
                        });
                      }
                    }
                  );
                }
              }
            );
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan 21',
              validate_id: employee_id,
              data: '',
            });
          }
        })
        .catch((error) => {
          throw error;
        });
    } catch (err) {
      response.status(500).send(err);
    }
  },
};

module.exports = controller;
