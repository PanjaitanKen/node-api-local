const dateCtrl = require('../controller/dateCtrl')
const countJobTaskCtrl = require('../controller/countJobTaskCtrl')
const ListJobTaskCtrl = require('../controller/listJobTaskCtrl')
const getLongitudeBranchCtrl = require('../controller/getLongitudeBranchCtrl')
const getURLHCMCtrl = require('../controller/getURLHCMCtrl')
const uploadImageCtrl = require('../controller/uploadImageCtrl')
const AddClockInCtrl = require('../controller/AddClockInCtrl')
const getHistAttendanceCtrl = require('../controller/getHistattendanceCtrl')
const getDetailHistAttendanceCtrl = require('../controller/getDetailHistattendanceCtrl')
const getURLPhotoAbsenCtrl = require('../controller/getURLPhotoAbsenCtrl')


module.exports = function(app) {
    app.route('/mmf/api/getBirthDatebyId')
        .post(dateCtrl.getBirthDate);

    app.route('/mmf/api/getCountJobTask')
        .post(countJobTaskCtrl.getCountJobTask);

    app.route('/mmf/api/getListJobTask')
        .post(ListJobTaskCtrl.getListJobTask);

    app.route('/mmf/api/getLongitudeBranch')
        .post(getLongitudeBranchCtrl.getLongitude_Branch);
        
    app.route('/hcm/api/getURLHCM')
        .post(getURLHCMCtrl.getURL_HCM);
        
    app.route('/img/api/uploadImage')
        .post(uploadImageCtrl.uploadImage);

    app.route('/mmf/api/AddClockIn')
        .post(AddClockInCtrl.AddClock_In);
        // async(app.route('/mmf/api/AddClockIn')
        // .post(AddClockInCtrl.AddClock_In));

    app.route('/mmf/api/getHistAttendance')
        .post(getHistAttendanceCtrl.getHist_attendance);

    app.route('/mmf/api/getDetailHistAttendance')
        .post(getDetailHistAttendanceCtrl.getDetailHist_attendance);

    app.route('/hcm/api/getURLPhotoAbsen')
        .post(getURLPhotoAbsenCtrl.getURL_Photo_Absen);
};