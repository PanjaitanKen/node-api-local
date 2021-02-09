const dateCtrl = require('../controller/dateCtrl')
const countJobTaskCtrl = require('../controller/countJobTaskCtrl')
const ListJobTaskCtrl = require('../controller/listJobTaskCtrl')
const getLongitudeBranchCtrl = require('../controller/getLongitudeBranchCtrl')
const getURLHCMCtrl = require('../controller/getURLHCMCtrl')
const uploadImageCtrl = require('../controller/uploadImageCtrl')
const AddClockInCtrl = require('../controller/AddClockInCtrl')
const AddClockOutCtrl = require('../controller/AddClockOutCtrl')
const getHistAttendanceCtrl = require('../controller/getHistattendanceCtrl')
const getDetailHistAttendanceCtrl = require('../controller/getDetailHistAttendanceCtrl')
const getURLPhotoAbsenCtrl = require('../controller/getURLPhotoAbsenCtrl')
const getDetailWorkOffAppCtrl = require('../controller/getDetailWorkOffAppCtrl')
const getDetailAttAppCtrl = require('../controller/getDetailAttAppCtrl')
const checkAttendanceCtrl = require('../controller/checkAttendanceCtrl')
const getHistAbsenceCtrl = require('../controller/getHistAbsenceCtrl')
const getHistDetailAbsenceCtrl = require('../controller/getHistDetailAbsenceCtrl')
const getHistDetail2AbsenceCtrl = require('../controller/getHistDetail2AbsenceCtrl')
const getMedicalInfoCtrl = require('../controller/getMedicalInfoCtrl')
const getBPJSInfoCtrl = require('../controller/getBPJSInfoCtrl')
const getHistLeaveCtrl = require('../controller/getHistLeaveCtrl')
const getHistDetailLeaveCtrl = require('../controller/getHistDetailLeaveCtrl')
const ParamVersionCtrl = require('../controller/ParamVersionCtrl')
const getCurrDateCtrl = require('../controller/getCurrDateCtrl')
const getLeaveCountCtrl = require('../controller/getLeaveCountCtrl')
const checkTokenNotifCtrl = require('../controller/checkTokenNotifCtrl')
const sendEmailCtrl = require('../controller/sendEmailCtrl')
const addFeedbackCtrl = require('../controller/addFeedbackCtrl')
const checkTokenOrangeCtrl = require('../controller/checkTokenOrangeCtrl')
const getComplaintCategoryCtrl = require('../controller/getComplaintCategoryCtrl')


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
        
    // app.route('/img/api/uploadImage')
    //     .post(uploadImageCtrl.uploadImage);

    app.route('/mmf/api/AddClockIn')
        .post(AddClockInCtrl.AddClock_In);

    app.route('/mmf/api/AddClockOut')
        .post(AddClockOutCtrl.AddClock_Out);

    app.route('/mmf/api/getHistAttendance')
        .post(getHistAttendanceCtrl.getHist_attendance);

    app.route('/mmf/api/getDetailHistAttendance')
        .post(getDetailHistAttendanceCtrl.getDetailHist_attendance);

    app.route('/hcm/api/getURLPhotoAbsen')
        .post(getURLPhotoAbsenCtrl.getURL_Photo_Absen);

    app.route('/mmf/api/getDetailWorkOffApp')
        .post(getDetailWorkOffAppCtrl.getDetail_WorkOff_App);

    app.route('/mmf/api/getDetailAttApp')
        .post(getDetailAttAppCtrl.getDetail_Att_App);

    app.route('/mmf/api/checkAttendance')
        .post(checkAttendanceCtrl.checkAttendance);
        
    app.route('/mmf/api/getHistDetail2Absence')
        .post(getHistDetail2AbsenceCtrl.getHist_Detail2_Absence);

    app.route('/mmf/api/getHistDetailAbsence')
        .post(getHistDetailAbsenceCtrl.getHist_Detail_Absence);

    app.route('/mmf/api/getHistAbsence')
        .post(getHistAbsenceCtrl.getHist_Absence);

    app.route('/mmf/api/getMedicalInfo')
        .post(getMedicalInfoCtrl.getMedical_Info);

    app.route('/mmf/api/getBPJSInfo')
        .post(getBPJSInfoCtrl.getBPJS_Info);

    app.route('/mmf/api/getHistLeave')
        .post(getHistLeaveCtrl.getHist_Leave);

    app.route('/mmf/api/getHistDetailLeave')
        .post(getHistDetailLeaveCtrl.getHist_Detail_Leave);

    app.route('/mmf/api/getCurrDate')
        .post(getCurrDateCtrl.getCurrDate);

    app.route('/mmf/api/getLeaveCount')
        .post(getLeaveCountCtrl.getLeave_Count);

    app.route('/hcm/api/checkTokenNotif')
        .post(checkTokenNotifCtrl.checkToken_Notif);

    app.route('/hcm/api/sendEmail')
        .post(sendEmailCtrl.sendEmail);

    app.route('/hcm/api/addFeedback')
        .post(addFeedbackCtrl.addFeedback);

    app.route('/mmf/api/checkTokenOrange')
        .post(checkTokenOrangeCtrl.checkTokenOrange);
        
    app.route('/hcm/api/getComplaintCategory')
        .post(getComplaintCategoryCtrl.getKategori_Komplain);
              
    app.route('/hcm/api/param-versions').get(ParamVersionCtrl.index);
    app.route('/hcm/api/param-version').post(ParamVersionCtrl.store);
};