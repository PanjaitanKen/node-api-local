// Tabel : param_version
const { exec } = require('child_process');
const pool = require('../../db');

var controller = {
  index: (_, response) => {
    try {
      pool.db_HCM.query(
        'SELECT * FROM param_version ORDER BY tgl_input DESC',
        (error, results) => {
          if (error) throw error;

          if (results.rows != '') {
            response.status(200).send({
              status: 200,
              message: 'Load Data berhasil',
              data: results.rows,
            });
          } else {
            response.status(200).send({
              status: 200,
              message: 'Data Tidak Ditemukan',
              data: [],
            });
          }
        }
      );
    } catch (err) {
      response.status(500).send(err);
    }
  },
  store: (request, response) => {
    const { version, description } = request.body;

    pool.db_HCM.query(
      `SELECT COUNT(id_version) FROM param_version WHERE version = '${version}'`,
      (error, results) => {
        if (error) throw error;

        if (results.rows[0].count == 0) {
          exec(
            `
            echo "Pull Github" > /master/script.log
            echo "==========" >> /master/script.log
            echo "" >> /master/script.log

            cd /root/mandala/hcm_backend
            touch /master/script.log
            /usr/bin/git pull origin >> /master/script.log

            echo "---Finish Pull Github---" >> /master/script.log
            echo "" >> /master/script.log
            echo "" >> /master/script.log

            echo "Build Docker Image" >> /master/script.log
            echo "==================" >> /master/script.log

            #-- For development
            cd /root/mandala/hcm_backend
            /usr/bin/docker build -t dockerhub.mandalafinance.com:15000/node-hcm:${version} . >> /master/script.log

            #-- For production
            /usr/bin/docker build -t dockerhub.mandalafinance.com:15000/node-hcm:latest . >> /master/script.log

            echo "---Finish Build Docker Image---" >> /master/script.log
            echo "" >> /master/script.log
            echo "" >> /master/script.log

            echo "ReCreate Docker Container" >> /master/script.log
            echo "=========================" >> /master/script.log

            /usr/bin/docker stop node-hcm >> /master/script.log
            /usr/bin/docker rm node-hcm >> /master/script.log
            /usr/bin/docker run -d -p 3000:3000 --name node-hcm dockerhub.mandalafinance.com:15000/node-hcm:${version} >> /master/script.log

            echo "---Finish ReCreate Docker Container---" >> /master/script.log
          `,
            (err) => {
              if (err) {
                response.status(500).send({
                  status: false,
                  message: 'BUILD DOCKER FAILED!',
                  data: '',
                });
              } else {
                pool.db_HCM.query(
                  "INSERT INTO param_version (id_version, version, description, tgl_input) VALUES (nextval('param_id_version_seq'), $1, $2, current_timestamp)",
                  [version, description],
                  (error, _) => {
                    if (error) throw error;

                    response.status(201).send({
                      status: true,
                      message: 'INSERT VERSION SUCCESS',
                      data: version,
                    });
                  }
                );
              }
            }
          );
        } else {
          response.status(400).send({
            status: false,
            message: 'VERSION ALREADY EXISTS',
            data: '',
          });
        }
      }
    );
  },
};

module.exports = controller;
