const pool = require('../../db')
var fs = require('fs');

//Tabel : employeeworkofftbl, leaverequest_tbl
var controller = {
    uploadImage :function (req, res) {
        try {
            if(!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                let avatar = req.files.image;
                let fileName = (String(avatar.name)).replace(".jpg", "-")
                console.log(fileName);
                let file = req.files.data;
                let randomNumber = Math.floor(Math.random()*90000) + 10000;
                let name = JSON.parse(file.data.toString('ascii'));
                console.log (name.employee_id)

                var dateFormat = require('dateformat');
                var day=dateFormat(new Date(), "yyyy-mm-dd-hh-MM-ss");
                console.log(day);

                //local
                // var dir = './uploads/'+ name.employee_id +'/';
                //server
                var dir = '/app/uploads/'+ name.employee_id +'/';

                console.log (dir)

                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }

                avatar.mv(dir+ 'mfinhr19'+'-'+ day+ '-'+ fileName  + randomNumber + '-'+'in'+ '.jpg'+ '.jpg');
                //'~/root/mandala/hcm_backend/uploads/' 
                // avatar.mv('/app/uploads/'+employee_id+ avatar.name);
    
                //send response
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: avatar.name,
                        mimetype: avatar.mimetype,
                        size: avatar.size
                    }
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }
};

module.exports = controller;
