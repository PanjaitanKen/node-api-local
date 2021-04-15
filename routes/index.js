const { check } = require('express-validator');

// const uploadImageCtrl = require('../controller/uploadImageCtrl');
const dateCtrl = require('../controller/dateCtrl');
const countJobTaskCtrl = require('../controller/countJobTaskCtrl');
const ListJobTaskCtrl = require('../controller/listJobTaskCtrl');
const getLongitudeBranchCtrl = require('../controller/getLongitudeBranchCtrl');
const getURLHCMCtrl = require('../controller/getURLHCMCtrl');
const getURLAssetsCtrl = require('../controller/getURLAssetsCtrl');
const AddClockInCtrl = require('../controller/AddClockInCtrl');
const AddClockOutCtrl = require('../controller/AddClockOutCtrl');
const getHistAttendanceCtrl = require('../controller/getHistattendanceCtrl');
const getDetailHistAttendanceCtrl = require('../controller/getDetailHistAttendanceCtrl');
const getURLPhotoAbsenCtrl = require('../controller/getURLPhotoAbsenCtrl');
const getDetailWorkOffAppCtrl = require('../controller/getDetailWorkOffAppCtrl');
const getDetailAttAppCtrl = require('../controller/getDetailAttAppCtrl');
const checkAttendanceCtrl = require('../controller/checkAttendanceCtrl');
const getHistAbsenceCtrl = require('../controller/getHistAbsenceCtrl');
const getHistDetailAbsenceCtrl = require('../controller/getHistDetailAbsenceCtrl');
const getHistDetail2AbsenceCtrl = require('../controller/getHistDetail2AbsenceCtrl');
const getMedicalInfoCtrl = require('../controller/getMedicalInfoCtrl');
const getBPJSInfoCtrl = require('../controller/getBPJSInfoCtrl');
const getHistLeaveCtrl = require('../controller/getHistLeaveCtrl');
const getHistDetailLeaveCtrl = require('../controller/getHistDetailLeaveCtrl');
const ParamVersionCtrl = require('../controller/ParamVersionCtrl');
const getCurrDateCtrl = require('../controller/getCurrDateCtrl');
const getLeaveCountCtrl = require('../controller/getLeaveCountCtrl');
const checkTokenNotifCtrl = require('../controller/checkTokenNotifCtrl');
const sendEmailCtrl = require('../controller/sendEmailCtrl');
const addFeedbackCtrl = require('../controller/addFeedbackCtrl');
const resendFeedbackCtrl = require('../controller/resendFeedbackCtrl');
const checkTokenOrangeCtrl = require('../controller/checkTokenOrangeCtrl');
const getComplaintCategoryCtrl = require('../controller/getComplaintCategoryCtrl');
const pushNotificationCtrl = require('../controller/pushNotificationCtrl');
const CategoryComplaintCtrl = require('../controller/CategoryComplaintCtrl');
const ComplaintCtrl = require('../controller/ComplaintCtrl');
const checkPassRulesCtrl = require('../controller/checkPassRulesCtrl');
const checkEmployeeLoginUATCtrl = require('../controller/checkEmployeeLoginUATCtrl');
const NewsCtrl = require('../controller/NewsCtrl');
const WebViewCtrl = require('../controller/WebViewCtrl');
const getLeaveNameCtrl = require('../controller/getLeaveNameCtrl');
const getHistLeaveFilterCtrl = require('../controller/getHistLeaveFilterCtrl');
const sendDocPsdCtrl = require('../controller/sendDocPsdCtrl');
const getHistManageCtrl = require('../controller/getHistManageCtrl');
const getHistDetailManageCtrl = require('../controller/getHistDetailManageCtrl');
const getHistDetailManageTravelCtrl = require('../controller/getHistDetailManageTravelCtrl');
const getDetailTravelAppCtrl = require('../controller/getDetailTravelAppCtrl');
const getMenuDocCtrl = require('../controller/getMenuDocCtrl');
const getPositionEmployeeDocCtrl = require('../controller/getPositionEmployeeDocCtrl');
const getListMenuDocCtrl = require('../controller/getListMenuDocCtrl');
const getHolidayCtrl = require('../controller/getHolidayCtrl');
const mailNotifierCtrl = require('../controller/mailNotifierCtrl');
const UsersManagementCtrl = require('../controller/UsersManagementCtrl');
const oracleCheckAttendanceCtrl = require('../controller/oracle/checkAttendanceCtrl');
const notificationManagementCtrl = require('../controller/notificationManagementCtrl');
const getTokenNotifCtrl = require('../controller/getTokenNotifCtrl');
const addLogUserCtrl = require('../controller/addLogUserCtrl');

const authenticateApiKey = (req, res, next) => {
  const authHeader = req.headers.api_key;

  if (authHeader) {
    const token = authHeader;
    if (token !== process.env.API_KEY) return res.sendStatus(403);
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = (app) => {
  // app.route('/img/api/uploadImage')
  //     .post(uploadImageCtrl.uploadImage);

  app
    .route('/mmf/api/getBirthDatebyId')
    .all(authenticateApiKey)
    .post(dateCtrl.getBirthDate);

  app
    .route('/mmf/api/getCountJobTask')
    .all(authenticateApiKey)
    .post(countJobTaskCtrl.getCountJobTask);

  app
    .route('/mmf/api/getListJobTask')
    .all(authenticateApiKey)
    .post(ListJobTaskCtrl.getListJobTask);

  app
    .route('/mmf/api/getLongitudeBranch')
    .all(authenticateApiKey)
    .post(getLongitudeBranchCtrl.getLongitude_Branch);

  app
    .route('/hcm/api/getURLHCM')
    .all(authenticateApiKey)
    .post(getURLHCMCtrl.getURL_HCM);

  app
    .route('/hcm/api/getURLAssets')
    .all(authenticateApiKey)
    .post(getURLAssetsCtrl.getURL_Assets);

  app
    .route('/mmf/api/AddClockIn')
    .all(authenticateApiKey)
    .post(AddClockInCtrl.AddClock_In);

  app
    .route('/mmf/api/AddClockOut')
    .all(authenticateApiKey)
    .post(AddClockOutCtrl.AddClock_Out);

  app
    .route('/mmf/api/getHistAttendance')
    .all(authenticateApiKey)
    .post(getHistAttendanceCtrl.getHist_attendance);

  app
    .route('/mmf/api/getDetailHistAttendance')
    .all(authenticateApiKey)
    .post(getDetailHistAttendanceCtrl.getDetailHist_attendance);

  app
    .route('/hcm/api/getURLPhotoAbsen')
    .all(authenticateApiKey)
    .post(getURLPhotoAbsenCtrl.getURL_Photo_Absen);

  app
    .route('/mmf/api/getDetailWorkOffApp')
    .all(authenticateApiKey)
    .post(getDetailWorkOffAppCtrl.getDetail_WorkOff_App);

  app
    .route('/mmf/api/getDetailAttApp')
    .all(authenticateApiKey)
    .post(getDetailAttAppCtrl.getDetail_Att_App);

  app
    .route('/mmf/api/checkAttendance')
    .all(authenticateApiKey)
    .post(checkAttendanceCtrl.checkAttendance);

  app
    .route('/mmf/api/getHistDetail2Absence')
    .all(authenticateApiKey)
    .post(getHistDetail2AbsenceCtrl.getHist_Detail2_Absence);

  app
    .route('/mmf/api/getHistDetailAbsence')
    .all(authenticateApiKey)
    .post(getHistDetailAbsenceCtrl.getHist_Detail_Absence);

  app
    .route('/mmf/api/getHistAbsence')
    .all(authenticateApiKey)
    .post(getHistAbsenceCtrl.getHist_Absence);

  app
    .route('/mmf/api/getMedicalInfo')
    .all(authenticateApiKey)
    .post(getMedicalInfoCtrl.getMedical_Info);

  app
    .route('/mmf/api/getBPJSInfo')
    .all(authenticateApiKey)
    .post(getBPJSInfoCtrl.getBPJS_Info);

  app
    .route('/mmf/api/getHistLeave')
    .all(authenticateApiKey)
    .post(getHistLeaveCtrl.getHist_Leave);

  app
    .route('/mmf/api/getHistDetailLeave')
    .all(authenticateApiKey)
    .post(getHistDetailLeaveCtrl.getHist_Detail_Leave);

  app
    .route('/mmf/api/getCurrDate')
    .all(authenticateApiKey)
    .post(getCurrDateCtrl.getCurrDate);

  app
    .route('/mmf/api/getLeaveCount')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('leave_date_from')
          .isISO8601()
          .withMessage('leave_date_from TO REQUIRED!'),
        check('leave_date_to')
          .isISO8601()
          .withMessage('leave_date_to TO REQUIRED!'),
      ],
      getLeaveCountCtrl.getLeave_Count
    );

  app
    .route('/mmf/api/checkPassRules')
    .all(authenticateApiKey)
    .post(checkPassRulesCtrl.checkPass_Rules);

  app
    .route('/hcm/api/checkTokenNotif')
    .all(authenticateApiKey)
    .post(checkTokenNotifCtrl.checkToken_Notif);

  app
    .route('/hcm/api/sendEmail')
    .all(authenticateApiKey)
    .post(sendEmailCtrl.sendEmail);

  app
    .route('/hcm/api/addFeedback')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('id_kategori_komplain')
          .notEmpty()
          .withMessage('id_kategori_komplain TO REQUIRED!'),
        check('information_data')
          .notEmpty()
          .withMessage('information_data TO REQUIRED!'),
        check('id_session')
          .notEmpty()
          .withMessage('id_session EMAIL REQUIRED!'),
      ],
      addFeedbackCtrl.addFeedback
    );

  app
    .route('/hcm/api/resendFeedback')
    .all(authenticateApiKey)
    .post(
      [check('id_komplain').notEmpty().withMessage('id_komplain REQUIRED!')],
      resendFeedbackCtrl.resendFeedback
    );

  app
    .route('/hcm/api/checkEmployeeLoginUAT')
    .all(authenticateApiKey)
    .post(checkEmployeeLoginUATCtrl.checkEmployeeLogin);

  app
    .route('/mmf/api/checkTokenOrange')
    .all(authenticateApiKey)
    .post(checkTokenOrangeCtrl.checkTokenOrange);

  app
    .route('/hcm/api/getComplaintCategory')
    .all(authenticateApiKey)
    .post(getComplaintCategoryCtrl.getKategori_Komplain);

  app
    .route('/hcm/api/pushNotification')
    .all(authenticateApiKey)
    .post(pushNotificationCtrl.pushNotification);

  app
    .route('/hcm/api/param-versions')
    .all(authenticateApiKey)
    .get(ParamVersionCtrl.index);

  app
    .route('/mmf/api/getLeaveName')
    .all(authenticateApiKey)
    .post(getLeaveNameCtrl.get_Leave_Name);

  app
    .route('/mmf/api/getHistLeaveFilter')
    .all(authenticateApiKey)
    .post(getHistLeaveFilterCtrl.get_Hist_Leave_Filter);

  app
    .route('/hcm/api/param-version')
    .all(authenticateApiKey)
    .post(ParamVersionCtrl.store);

  app
    .route('/hcm/api/sendDocsPsd')
    .all(authenticateApiKey)
    .post(sendDocPsdCtrl.send_Doc_Psd);

  app
    .route('/mmf/api/getHistManage')
    .all(authenticateApiKey)
    .post(getHistManageCtrl.getHistManage);

  app
    .route('/mmf/api/getHistDetailManage')
    .all(authenticateApiKey)
    .post(getHistDetailManageCtrl.getHistDetailManage);

  app
    .route('/mmf/api/getHistDetailManageTravel')
    .all(authenticateApiKey)
    .post(getHistDetailManageTravelCtrl.getHistDetailManageTravel);

  app
    .route('/mmf/api/getDetailTravelApp')
    .all(authenticateApiKey)
    .post(getDetailTravelAppCtrl.getDetail_Travel_App);

  app
    .route('/hcm/api/getMenuDoc')
    .all(authenticateApiKey)
    .post(getMenuDocCtrl.getMenu_Doc);

  app
    .route('/hcm/api/getListMenuDoc')
    .all(authenticateApiKey)
    .post(getListMenuDocCtrl.getListMenu_Doc);

  app
    .route('/hcm/api/getHoliday')
    .all(authenticateApiKey)
    .post(getHolidayCtrl.getHoliday);

  app
    .route('/hcm/api/mailNotifierCtrl')
    .all(authenticateApiKey)
    .post(mailNotifierCtrl.mailNotifier);

  app
    .route('/mmf/api/getPositionEmployeeDoc')
    .all(authenticateApiKey)
    .post(getPositionEmployeeDocCtrl.getPositionEmployee_Doc);
  // complaint routes
  app
    .route('/hcm/api/complaints')
    .all(authenticateApiKey)
    .get(ComplaintCtrl.index);

  // category complaint routes
  app
    .route('/hcm/api/category-complaints')
    .all(authenticateApiKey)
    .get(CategoryComplaintCtrl.index);

  app
    .route('/hcm/api/category-complaints/:id')
    .all(authenticateApiKey)
    .get(CategoryComplaintCtrl.show);

  app
    .route('/hcm/api/category-complaint')
    .all(authenticateApiKey)
    .post(
      [
        check('ket_kategori').notEmpty().withMessage('KET KATEGORI REQUIRED!'),
        check('email_to').notEmpty().withMessage('EMAIL TO REQUIRED!'),
        check('cc_to').notEmpty().withMessage('CC TO REQUIRED!'),
        check('subject_email')
          .notEmpty()
          .withMessage('SUBJECT EMAIL REQUIRED!'),
        check('no_hp').notEmpty().withMessage('NO HP REQUIRED!'),
      ],
      CategoryComplaintCtrl.store
    );

  app
    .route('/hcm/api/category-complaint')
    .all(authenticateApiKey)
    .put(
      [
        check('id_kategori_komplain')
          .notEmpty()
          .withMessage('ID KATEGORI KOMPLAIN REQUIRED!'),
        check('ket_kategori').notEmpty().withMessage('KET KATEGORI REQUIRED!'),
        check('email_to').notEmpty().withMessage('EMAIL TO REQUIRED!'),
        check('cc_to').notEmpty().withMessage('CC TO REQUIRED!'),
        check('subject_email')
          .notEmpty()
          .withMessage('SUBJECT EMAIL REQUIRED!'),
        check('no_hp').notEmpty().withMessage('NO HP REQUIRED!'),
      ],
      CategoryComplaintCtrl.update
    );

  app
    .route('/hcm/api/category-complaint')
    .all(authenticateApiKey)
    .delete(
      [
        check('id_kategori_komplain')
          .notEmpty()
          .withMessage('ID KATEGORI REQUIRED')
          .isNumeric()
          .withMessage('ID KATEGORI MUST NUMERIC'),
      ],
      CategoryComplaintCtrl.destroy
    );

  // news routes
  app.route('/hcm/api/news').all(authenticateApiKey).get(NewsCtrl.index);
  app.route('/hcm/api/news/:id').all(authenticateApiKey).get(NewsCtrl.show);

  app
    .route('/hcm/api/news')
    .all(authenticateApiKey)
    .post(
      [
        check('kategori_berita').notEmpty().withMessage('CATEGORY REQUIRED!'),
        check('ket_header').notEmpty().withMessage('TITLE REQUIRED!'),
        check('deskripsi').notEmpty().withMessage('DESCRIPTION REQUIRED!'),

        check('tgl_event_dr')
          .notEmpty()
          .withMessage('START EVENT DATE REQUIRED!'),

        check('tgl_event_sd')
          .notEmpty()
          .withMessage('END EVENT DATE REQUIRED!'),

        check('lokasi').notEmpty().withMessage('LOCATION REQUIRED!'),
        check('tgl_expired').notEmpty().withMessage('EXPIRED DATE REQUIRED!'),
      ],
      NewsCtrl.store
    );

  app
    .route('/hcm/api/news')
    .all(authenticateApiKey)
    .put(
      [
        check('berita_id').notEmpty().withMessage('BERITA ID REQUIRED!'),
        check('kategori_berita').notEmpty().withMessage('CATEGORY REQUIRED!'),
        check('ket_header').notEmpty().withMessage('TITLE REQUIRED!'),
        check('deskripsi').notEmpty().withMessage('DESCRIPTION REQUIRED!'),

        check('tgl_event_dr')
          .notEmpty()
          .withMessage('START EVENT DATE REQUIRED!'),

        check('tgl_event_sd')
          .notEmpty()
          .withMessage('END EVENT DATE REQUIRED!'),

        check('lokasi').notEmpty().withMessage('LOCATION REQUIRED!'),
        check('tgl_expired').notEmpty().withMessage('EXPIRED DATE REQUIRED!'),
      ],
      NewsCtrl.update
    );

  app
    .route('/hcm/api/news')
    .all(authenticateApiKey)
    .delete(
      [check('berita_id').notEmpty().withMessage('BERITA ID REQUIRED!')],
      NewsCtrl.destroy
    );

  // web view routes
  app.route('/documents/:slug').get(WebViewCtrl.documents); // documents
  app.route('/:category/:slug').get(WebViewCtrl.news); // news

  // users management routes //
  app
    .route('/hcm/api/users-management/login')
    .all(authenticateApiKey)
    .post(UsersManagementCtrl.login);

  app
    .route('/hcm/api/users-management/get-user-has-menu/:userid')
    .all(authenticateApiKey)
    .get(UsersManagementCtrl.getUserHasMenus);

  app
    .route('/hcm/api/users-management/manage-user-menu')
    .all(authenticateApiKey)
    .post(
      [check('user').notEmpty().withMessage('USER REQUIRED!')],
      [check('menus').notEmpty().withMessage('MENUS REQUIRED!')],
      UsersManagementCtrl.manageUserMenus
    );

  // users management routes -> system master menu
  app
    .route('/hcm/api/users-management/system-master-menu')
    .all(authenticateApiKey)
    .get(UsersManagementCtrl.getSystemMasterMenu);

  app
    .route('/hcm/api/users-management/system-master-menu')
    .all(authenticateApiKey)
    .post(
      [check('kdsys').notEmpty().withMessage('KDSYS REQUIRED!')],
      [check('nourut').notEmpty().withMessage('NOURUT REQUIRED!')],
      [check('gprg').notEmpty().withMessage('GPRG REQUIRED!')],
      [check('sprg').notEmpty().withMessage('SPRG REQUIRED!')],
      [check('nprg').notEmpty().withMessage('NPRG REQUIRED!')],
      [check('mode').notEmpty().withMessage('MODE REQUIRED!')],
      [check('tgllaku').notEmpty().withMessage('TGLLAKU REQUIRED!')],
      UsersManagementCtrl.insertSystemMasterMenu
    );

  // users management routes -> users
  app
    .route('/hcm/api/users-management/users')
    .all(authenticateApiKey)
    .get(UsersManagementCtrl.getUsers);

  app
    .route('/hcm/api/users-management/users/:employee_code')
    .all(authenticateApiKey)
    .get(UsersManagementCtrl.showUsers);

  app
    .route('/hcm/api/users-management/users')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_code')
          .notEmpty()
          .withMessage('EMPLOYEE_CODE REQUIRED!'),
        check('userid').notEmpty().withMessage('USERID REQUIRED!'),
        check('nmuser').notEmpty().withMessage('NMUSER REQUIRED!'),
        check('password').notEmpty().withMessage('PASSWORD REQUIRED!'),
        check('tglaku').notEmpty().withMessage('TGLAKU REQUIRED!'),
      ],
      UsersManagementCtrl.insertUsers
    );

  app
    .route('/hcm/api/users-management/users')
    .all(authenticateApiKey)
    .put(
      [
        check('employee_code')
          .notEmpty()
          .withMessage('EMPLOYEE_CODE REQUIRED!'),
        check('userid').notEmpty().withMessage('USERID REQUIRED!'),
        check('nmuser').notEmpty().withMessage('NMUSER REQUIRED!'),
        check('tglaku').notEmpty().withMessage('TGLAKU REQUIRED!'),
      ],
      UsersManagementCtrl.updateUsers
    );

  app
    .route('/hcm/api/users-management/users')
    .all(authenticateApiKey)
    .delete(
      [
        check('employee_code')
          .notEmpty()
          .withMessage('EMPLOYEE_CODE REQUIRED!'),
      ],
      UsersManagementCtrl.deleteUsers
    );

  // ORACLE
  app
    .route('/oracle/hcm/checkAttendance_oracle')
    .all(authenticateApiKey)
    .post(oracleCheckAttendanceCtrl.checkAttendance);

  // notification management routes //
  app
    .route('/hcm/api/notif-management/addTempNotif')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      [check('jenis').notEmpty().withMessage('jenis REQUIRED!')],
      [check('ket1').notEmpty().withMessage('ket1 REQUIRED!')],
      [check('ket2').notEmpty().withMessage('ket2 REQUIRED!')],
      [check('golid').notEmpty().withMessage('golid REQUIRED!')],
      [
        check('approved_date')
          .notEmpty()
          .withMessage('approved_date REQUIRED!'),
      ],
      notificationManagementCtrl.insert
    );

  app
    .route('/hcm/api/notif-management/countTempNotif')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      notificationManagementCtrl.countTempNotif
    );

  app
    .route('/hcm/api/notif-management/listTempNotif')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      notificationManagementCtrl.listTempNotif
    );

  app
    .route('/hcm/api/notif-management/updateTempNotif')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      [check('golid').notEmpty().withMessage('golid REQUIRED!')],
      notificationManagementCtrl.updateTempNotif
    );

  app
    .route('/hcm/api/getTokenNotif')
    .all(authenticateApiKey)
    .post(getTokenNotifCtrl.getTokenNotif);

  app
    .route('/hcm/api/addLogUser')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_code')
          .notEmpty()
          .withMessage('employee_code REQUIRED!'),
      ],
      [check('date').isISO8601().withMessage('date TO REQUIRED!')],
      [check('menu').notEmpty().withMessage('menu REQUIRED!')],
      addLogUserCtrl.addLogUser
    );
};
