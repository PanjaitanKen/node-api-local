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
const pushNotificationCtrl = require('../controller/pushNotificationCtrl')

const authenticateApiKey = (req, res, next) => {
    const authHeader = req.headers.api_key;
  
    if (authHeader) {
      const token = authHeader;
      if (token != process.env.API_KEY) return res.sendStatus(403);
      next();
    } else {
      res.sendStatus(401);
    }
};

module.exports = function(app) {
    app.route('/mmf/api/getBirthDatebyId')
        .all(authenticateApiKey)
        .post(dateCtrl.getBirthDate);

    app.route('/mmf/api/getCountJobTask')
        .all(authenticateApiKey)
        .post(countJobTaskCtrl.getCountJobTask);

    app.route('/mmf/api/getListJobTask')
        .all(authenticateApiKey)
        .post(ListJobTaskCtrl.getListJobTask);

    app.route('/mmf/api/getLongitudeBranch')
        .all(authenticateApiKey)
        .post(getLongitudeBranchCtrl.getLongitude_Branch);
        
    app.route('/hcm/api/getURLHCM')
        .all(authenticateApiKey)
        .post(getURLHCMCtrl.getURL_HCM);
        
    // app.route('/img/api/uploadImage')
    //     .post(uploadImageCtrl.uploadImage);

    app.route('/mmf/api/AddClockIn')
        .all(authenticateApiKey)
        .post(AddClockInCtrl.AddClock_In);

    app.route('/mmf/api/AddClockOut')
        .all(authenticateApiKey)
        .post(AddClockOutCtrl.AddClock_Out);

    app.route('/mmf/api/getHistAttendance')
        .all(authenticateApiKey)
        .post(getHistAttendanceCtrl.getHist_attendance);

    app.route('/mmf/api/getDetailHistAttendance')
        .all(authenticateApiKey)
        .post(getDetailHistAttendanceCtrl.getDetailHist_attendance);

    app.route('/hcm/api/getURLPhotoAbsen')
        .all(authenticateApiKey)
        .post(getURLPhotoAbsenCtrl.getURL_Photo_Absen);

    app.route('/mmf/api/getDetailWorkOffApp')
        .all(authenticateApiKey)
        .post(getDetailWorkOffAppCtrl.getDetail_WorkOff_App);

    app.route('/mmf/api/getDetailAttApp')
        .all(authenticateApiKey)
        .post(getDetailAttAppCtrl.getDetail_Att_App);

    app.route('/mmf/api/checkAttendance')
        .all(authenticateApiKey)
        .post(checkAttendanceCtrl.checkAttendance);
        
    app.route('/mmf/api/getHistDetail2Absence')
        .all(authenticateApiKey)
        .post(getHistDetail2AbsenceCtrl.getHist_Detail2_Absence);

    app.route('/mmf/api/getHistDetailAbsence')
        .all(authenticateApiKey)
        .post(getHistDetailAbsenceCtrl.getHist_Detail_Absence);

    app.route('/mmf/api/getHistAbsence')
        .all(authenticateApiKey)
        .post(getHistAbsenceCtrl.getHist_Absence);

    app.route('/mmf/api/getMedicalInfo')
        .all(authenticateApiKey)
        .post(getMedicalInfoCtrl.getMedical_Info);

    app.route('/mmf/api/getBPJSInfo')
        .all(authenticateApiKey)
        .post(getBPJSInfoCtrl.getBPJS_Info);

    app.route('/mmf/api/getHistLeave')
        .all(authenticateApiKey)
        .post(getHistLeaveCtrl.getHist_Leave);

    app.route('/mmf/api/getHistDetailLeave')
        .all(authenticateApiKey)
        .post(getHistDetailLeaveCtrl.getHist_Detail_Leave);

    app.route('/mmf/api/getCurrDate')
        .all(authenticateApiKey)
        .post(getCurrDateCtrl.getCurrDate);

    app.route('/mmf/api/getLeaveCount')
        .all(authenticateApiKey)
        .post(getLeaveCountCtrl.getLeave_Count);

    app.route('/hcm/api/checkTokenNotif')
        .all(authenticateApiKey)
        .post(checkTokenNotifCtrl.checkToken_Notif);

    app.route('/hcm/api/sendEmail')
        .all(authenticateApiKey)
        .post(sendEmailCtrl.sendEmail);

    app.route('/hcm/api/addFeedback')
        .all(authenticateApiKey)
        .post(addFeedbackCtrl.addFeedback);

    app.route('/mmf/api/checkTokenOrange')
        .all(authenticateApiKey)
        .post(checkTokenOrangeCtrl.checkTokenOrange);
        
    app.route('/hcm/api/getComplaintCategory')
        .all(authenticateApiKey)
        .post(getComplaintCategoryCtrl.getKategori_Komplain);

    
    app.route('/hcm/api/pushNotification')
        .all(authenticateApiKey)
        .post(pushNotificationCtrl.pushNotification);
              
    app.route('/hcm/api/param-versions').all(authenticateApiKey).get(ParamVersionCtrl.index);
    app.route('/hcm/api/param-version').all(authenticateApiKey).post(ParamVersionCtrl.store);
};