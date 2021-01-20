const pool = require('../../db')

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
                
                avatar.mv('./uploads/' + avatar.name);
    
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
