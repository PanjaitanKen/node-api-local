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
const getPositionEmployeeDocCtrl = require('../controller/getPositionEmployeeDocCtrl');
const getListMenuDocCtrl = require('../controller/getListMenuDocCtrl');
const getHolidayCtrl = require('../controller/getHolidayCtrl');
const mailNotifierCtrl = require('../controller/mailNotifierCtrl');
const UsersManagementCtrl = require('../controller/UsersManagementCtrl');
const oracleCheckAttendanceCtrl = require('../controller/oracle/checkAttendanceCtrl');
const notificationManagementCtrl = require('../controller/notificationManagementCtrl');
const addLogUserCtrl = require('../controller/addLogUserCtrl');
const addEmployeeId = require('../controller/addEmployeeId');
const excelExportCtrl = require('../controller/excelExportCtrl');
const updateAbsenceCatCtrl = require('../controller/updateAbsenceCatCtrl');
const ParamHcmCtrl = require('../controller/ParamHcmCtrl');
const checkReadCKCtrl = require('../controller/checkReadCKCtrl');
const getInfoCKCtrl = require('../controller/getInfoCKCtrl');
const checkProgressBarCKCtrl = require('../controller/checkProgressBarCKCtrl');
const updateProgressBarCKCtrl = require('../controller/updateProgressBarCKCtrl');
const getFirstDayGuideDataCtrl = require('../controller/getFirstDayGuideDataCtrl');
const ProspectiveEmployee = require('../controller/ProspectiveEmployee');
const getListEmpAndProspectiveEmpCtrl = require('../controller/getListEmpAndProspectiveEmpCtrl');
const getCountCKCtrl = require('../controller/getCountCKCtrl');
const checkScanQrCtrl = require('../controller/checkScanQrCtrl');
const getURLLMSCtrl = require('../controller/getURLLMSCtrl');
const getPICHRLearningCtrl = require('../controller/getPICHRLearningCtrl');
const getDescAbsenceCtrl = require('../controller/getDescAbsenceCtrl');
const getListCategoryRevAbsenceCtrl = require('../controller/getListCategoryRevAbsenceCtrl');
const addRevAbsenceCtrl = require('../controller/addRevAbsenceCtrl');
const getHistDetailManageRevAbsenceCtrl = require('../controller/getHistDetailManageRevAbsenceCtrl');
const checkValidationRevAbsenceCtrl = require('../controller/checkValidationRevAbsenceCtrl');
const RejectCancelRevAbsenceCtrl = require('../controller/RejectCancelRevAbsenceCtrl');
const AppRevAbsenceCtrl = require('../controller/AppRevAbsenceCtrl');
const getParamHCMCtrl = require('../controller/getParamHCMCtrl');
const getStatusVaccineCtrl = require('../controller/getStatusVaccineCtrl');
const addStatusVaccineCtrl = require('../controller/addStatusVaccineCtrl');
const StatusVaksinCtrl = require('../controller/StatusVaksinCtrl');
const addClockInWithoutPhotoCtrl = require('../controller/addClockInWithoutPhotoCtrl');
const addClockOutWithoutPhotoCtrl = require('../controller/addClockOutWithoutPhotoCtrl');
const profilePhotoCtrl = require('../controller/profilePhotoCtrl');

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
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      dateCtrl.getBirthDate
    );

  app
    .route('/mmf/api/getCountJobTask')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      countJobTaskCtrl.getCountJobTask
    );

  app
    .route('/mmf/api/getListJobTask')
    .all(authenticateApiKey)
    .post(ListJobTaskCtrl.getListJobTask);

  app
    .route('/mmf/api/getLongitudeBranch')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      getLongitudeBranchCtrl.getLongitude_Branch
    );

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
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('latitude').notEmpty().withMessage('latitude REQUIRED!'),
        check('altitude').notEmpty().withMessage('altitude REQUIRED!'),
        check('longitude').notEmpty().withMessage('longitude REQUIRED!'),
        check('accuracy').notEmpty().withMessage('accuracy REQUIRED!'),
        check('location_no').notEmpty().withMessage('location_no REQUIRED!'),
        check('timeZoneAsia').notEmpty().withMessage('timeZoneAsia REQUIRED!'),
      ],
      AddClockOutCtrl.AddClock_Out
    );

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
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      checkAttendanceCtrl.checkAttendance
    );

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
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('filter_date').notEmpty().withMessage('filter_date REQUIRED!'),
      ],
      getHistAbsenceCtrl.getHist_Absence
    );

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
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('session_id').notEmpty().withMessage('session_id REQUIRED!'),
      ],
      checkTokenOrangeCtrl.checkTokenOrange
    );

  app
    .route('/hcm/api/getComplaintCategory')
    .all(authenticateApiKey)
    .post(getComplaintCategoryCtrl.getKategori_Komplain);

  app
    .route('/hcm/api/pushNotification')
    .all(authenticateApiKey)
    .post(pushNotificationCtrl.pushNotification);

  app
    .route('/hcm/api/pushNotifNewsEvent')
    .all(authenticateApiKey)
    .post(pushNotificationCtrl.pushNotifNewsEvent);

  app
    .route('/hcm/api/pushNotifBlastAll')
    .all(authenticateApiKey)
    .post(pushNotificationCtrl.pushNotifBlastAll);

  app
    .route('/hcm/api/pNRevAbsen')
    .all(authenticateApiKey)
    .post(pushNotificationCtrl.pNRevAbsen);

  app
    .route('/mmf/api/getLeaveName')
    .all(authenticateApiKey)
    .post(getLeaveNameCtrl.get_Leave_Name);

  app
    .route('/mmf/api/getHistLeaveFilter')
    .all(authenticateApiKey)
    .post(getHistLeaveFilterCtrl.get_Hist_Leave_Filter);

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
    .route('/hcm/api/getListMenuDoc')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      getListMenuDocCtrl.getListMenu_Doc
    );

  app
    .route('/hcm/api/addEmployeeid')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      addEmployeeId.storeEmployeeId
    );

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
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      getPositionEmployeeDocCtrl.getPositionEmployee_Doc
    );
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
      [
        check('user').notEmpty().withMessage('USER REQUIRED!'),
        check('menus').notEmpty().withMessage('MENUS REQUIRED!'),
      ],
      UsersManagementCtrl.manageUserMenus
    );

  app
    .route('/hcm/api/users-management/upload-profile-photo')
    .all(authenticateApiKey)
    .post(
      [check('userid').notEmpty().withMessage('USERID REQUIRED!')],
      UsersManagementCtrl.uploadProfilePhoto
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
      [
        check('kdsys').notEmpty().withMessage('KDSYS REQUIRED!'),
        check('nourut').notEmpty().withMessage('NOURUT REQUIRED!'),
        check('gprg').notEmpty().withMessage('GPRG REQUIRED!'),
        check('sprg').notEmpty().withMessage('SPRG REQUIRED!'),
        check('nprg').notEmpty().withMessage('NPRG REQUIRED!'),
        check('mode').notEmpty().withMessage('MODE REQUIRED!'),
        check('tgllaku').notEmpty().withMessage('TGLLAKU REQUIRED!'),
      ],
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
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('jenis').notEmpty().withMessage('jenis REQUIRED!'),
        check('ket1').notEmpty().withMessage('ket1 REQUIRED!'),
        check('ket2').notEmpty().withMessage('ket2 REQUIRED!'),
        check('golid').notEmpty().withMessage('golid REQUIRED!'),
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
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('golid').notEmpty().withMessage('golid REQUIRED!'),
      ],
      notificationManagementCtrl.updateTempNotif
    );

  app
    .route('/hcm/api/addLogUser')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      addLogUserCtrl.addLogUser
    );

  app
    .route('/hcm/api/logExportExcel')
    .all(authenticateApiKey)
    .post(
      [check('tanggal').notEmpty().withMessage('tanggal REQUIRED!')],
      excelExportCtrl.excelExportlog
    );

  app
    .route('/hcm/api/logExportExcelSummary')
    .all(authenticateApiKey)
    .post(
      [check('tanggal').notEmpty().withMessage('tanggal REQUIRED!')],
      excelExportCtrl.excelExportlogSummary
    );

  app
    .route('/hcm/api/updateAbsenceCategory')
    .all(authenticateApiKey)
    .post(
      [check('absen_code').notEmpty().withMessage('absen_code REQUIRED!')],
      updateAbsenceCatCtrl.updateAbsenceCat
    );

  // param hcm routes
  app
    .route('/hcm/api/param-hcm')
    .all(authenticateApiKey)
    .get(ParamHcmCtrl.index);

  app
    .route('/hcm/api/param-hcm/:id')
    .all(authenticateApiKey)
    .get(ParamHcmCtrl.show);

  app
    .route('/hcm/api/param-hcm')
    .all(authenticateApiKey)
    .post(
      [
        check('setting_name').notEmpty().withMessage('SETTING_NAME REQUIRED!'),
        check('setting_value')
          .notEmpty()
          .withMessage('SETTING_VALUE REQUIRED!'),
        check('description').notEmpty().withMessage('DESCRIPTION REQUIRED!'),
      ],
      ParamHcmCtrl.store
    );

  app
    .route('/hcm/api/param-hcm')
    .all(authenticateApiKey)
    .put(
      [
        check('param_id').notEmpty().withMessage('PARAM_ID REQUIRED!'),
        check('setting_name').notEmpty().withMessage('SETTING_NAME REQUIRED!'),
        check('setting_value')
          .notEmpty()
          .withMessage('SETTING_VALUE REQUIRED!'),
        check('description').notEmpty().withMessage('DESCRIPTION REQUIRED!'),
      ],
      ParamHcmCtrl.update
    );

  app
    .route('/hcm/api/param-hcm')
    .all(authenticateApiKey)
    .delete(
      [
        check('param_id')
          .notEmpty()
          .withMessage('PARAM_ID REQUIRED!')
          .isNumeric()
          .withMessage('PARAM_ID MUST NUMERIC!'),
      ],
      ParamHcmCtrl.destroy
    );

  app
    .route('/hcm/api/checkReadCK')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      checkReadCKCtrl.checkReadCK
    );

  app
    .route('/hcm/api/getInfoCK')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('userid_ck').notEmpty().withMessage('userid_ck REQUIRED!'),
      ],
      getInfoCKCtrl.getInfoCK
    );

  app
    .route('/hcm/api/checkProgressBarCK')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      checkProgressBarCKCtrl.checkProgressBarCK
    );

  app
    .route('/hcm/api/updateProgressBarCK')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('id_menu_ck').notEmpty().withMessage('id_menu_ck REQUIRED!'),
      ],
      updateProgressBarCKCtrl.updateProgressBarCK
    );

  app
    .route('/hcm/api/getFirstDayGuideData')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      getFirstDayGuideDataCtrl.getFirstDayGuideData
    );

  app
    .route('/hcm/api/prospective-employees')
    .all(authenticateApiKey)
    .get(ProspectiveEmployee.index);

  app
    .route('/hcm/api/prospective-employees/:id')
    .all(authenticateApiKey)
    .get(ProspectiveEmployee.show);

  app
    .route('/hcm/api/prospective-employees')
    .all(authenticateApiKey)
    .post(ProspectiveEmployee.store);

  app
    .route('/hcm/api/prospective-employees')
    .all(authenticateApiKey)
    .put(ProspectiveEmployee.update);

  app
    .route('/hcm/api/prospective-employees')
    .all(authenticateApiKey)
    .delete(
      check('applicant_id').notEmpty().withMessage('APPLICANT_ID REQUIRED!'),
      ProspectiveEmployee.destroy
    );

  app
    .route('/hcm/api/prospective-employees/login')
    .all(authenticateApiKey)
    .post(
      [
        check('username').notEmpty().withMessage('USERNAME REQUIRED!'),
        check('password').notEmpty().withMessage('PASSWORD REQUIRED!'),
      ],
      ProspectiveEmployee.login
    );

  app
    .route('/hcm/api/prospective-employees/resend-notif')
    .all(authenticateApiKey)
    .post(
      [
        check('category').notEmpty().withMessage('CATEGORY REQUIRED!'),
        check('applicant_id').notEmpty().withMessage('APPLICANT_ID REQUIRED!'),
      ],
      ProspectiveEmployee.resendNotif
    );

  app
    .route('/hcm/api/getListEmpAndProspectiveEmp')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      getListEmpAndProspectiveEmpCtrl.getListEmpAndProspectiveEmp
    );

  app
    .route('/hcm/api/getCountCK')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      getCountCKCtrl.getCountCK
    );

  app
    .route('/hcm/api/checkScanQr')
    .all(authenticateApiKey)
    .post(
      [check('userid_ck').notEmpty().withMessage('userid_ck REQUIRED!')],
      checkScanQrCtrl.checkScanQr
    );

  app
    .route('/hcm/api/getURLLMS')
    .all(authenticateApiKey)
    .post(getURLLMSCtrl.getURLLMS);

  app
    .route('/hcm/api/getPICHRLearning')
    .all(authenticateApiKey)
    .post(getPICHRLearningCtrl.getPICHRLearning);

  app.route('/health').get(getLongitudeBranchCtrl.checkHealth);

  app
    .route('/hcm/api/trxPushNotif')
    .all(authenticateApiKey)
    .get(notificationManagementCtrl.getTrxPushNotif);

  app
    .route('/hcm/api/trxPushNotif/:id')
    .all(authenticateApiKey)
    .get(notificationManagementCtrl.showTrxPushNotif);

  app
    .route('/hcm/api/trxPushNotif')
    .all(authenticateApiKey)
    .post(
      [
        check('judul').notEmpty().withMessage('judul REQUIRED!'),
        check('isi').notEmpty().withMessage('isi REQUIRED!'),
        check('tanggal').notEmpty().withMessage('tanggal REQUIRED!'),
      ],
      notificationManagementCtrl.insertTrxPushNotif
    );

  app
    .route('/hcm/api/trxPushNotif')
    .all(authenticateApiKey)
    .put(
      [
        check('id_push_notif')
          .notEmpty()
          .withMessage('id_push_notif REQUIRED!'),
        check('judul').notEmpty().withMessage('judul REQUIRED!'),
        check('isi').notEmpty().withMessage('isi REQUIRED!'),
        check('tanggal').notEmpty().withMessage('tanggal REQUIRED!'),
      ],
      notificationManagementCtrl.updateTrxPushNotif
    );

  app
    .route('/hcm/api/trxPushNotif')
    .all(authenticateApiKey)
    .delete(
      [
        check('id_push_notif')
          .notEmpty()
          .withMessage('id_push_notif REQUIRED!'),
      ],
      notificationManagementCtrl.deleteTrxPushNotif
    );

  app
    .route('/mmf/api/getDescAbsence')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('date_filter')
          .isISO8601()
          .withMessage('date_filter TO REQUIRED!'),
      ],
      getDescAbsenceCtrl.getDescAbsence
    );

  app
    .route('/hcm/api/getListCategoryRevAbsence')
    .all(authenticateApiKey)
    .post(getListCategoryRevAbsenceCtrl.getListCategoryRevAbsence);

  app
    .route('/mmf/api/addRevAbsence')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('clocking_date')
          .isISO8601()
          .withMessage('clocking_date REQUIRED!'),
        check('employee_name')
          .notEmpty()
          .withMessage('employee_name REQUIRED!'),
        check('id_category').notEmpty().withMessage('id_category REQUIRED!'),
        check('schedule_type')
          .notEmpty()
          .withMessage('schedule_type REQUIRED!'),
        check('days_to').notEmpty().withMessage('days_to REQUIRED!'),
        check('day_type').notEmpty().withMessage('day_type REQUIRED!'),
        check('default_clockin')
          .notEmpty()
          .withMessage('default_clockin REQUIRED!'),
        check('default_clockout')
          .notEmpty()
          .withMessage('default_clockout REQUIRED!'),
        check('reason').notEmpty().withMessage('reason REQUIRED!'),
        check('spv_employee_id')
          .notEmpty()
          .withMessage('spv_employee_id REQUIRED!'),
        check('spv_employee_name')
          .notEmpty()
          .withMessage('spv_employee_name REQUIRED!'),
        check('spv_employee_position')
          .notEmpty()
          .withMessage('spv_employee_position REQUIRED!'),
        check('hp_approver').notEmpty().withMessage('hp_approver REQUIRED!'),
        check('email_approver')
          .notEmpty()
          .withMessage('email_approver REQUIRED!'),
      ],
      addRevAbsenceCtrl.addRevAbsence
    );

  app
    .route('/mmf/api/getHistDetailManageRevAbsence')
    .all(authenticateApiKey)
    .post(
      [check('rev_id').notEmpty().withMessage('rev_id REQUIRED!')],
      getHistDetailManageRevAbsenceCtrl.getHistDetailManageRevAbsence
    );

  app
    .route('/mmf/api/checkValidationRevAbsence')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('date_filter')
          .isISO8601()
          .withMessage('date_filter TO REQUIRED!'),
      ],
      checkValidationRevAbsenceCtrl.checkValidationRevAbsence
    );

  app
    .route('/mmf/api/RejectCancelRevAbsence')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('date_filter')
          .isISO8601()
          .withMessage('date_filter TO REQUIRED!'),
        check('rev_id').notEmpty().withMessage('rev_id REQUIRED!'),
        check('status').notEmpty().withMessage('status REQUIRED!'),
      ],
      RejectCancelRevAbsenceCtrl.RejectCancelRevAbsence
    );

  app
    .route('/mmf/api/appRevAbsence')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('date_filter')
          .isISO8601()
          .withMessage('date_filter TO REQUIRED!'),
        check('rev_id').notEmpty().withMessage('rev_id REQUIRED!'),
        check('employee_name')
          .notEmpty()
          .withMessage('employee_name REQUIRED!'),
      ],
      AppRevAbsenceCtrl.AppRevAbsence
    );

  app
    .route('/hcm/api/getParamHCM')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      getParamHCMCtrl.getParamHCM
    );

  app
    .route('/hcm/api/getStatusVaccine')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      getStatusVaccineCtrl.getStatusVaccine
    );

  app
    .route('/hcm/api/addStatusVaccine')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('emp_vaccine_status')
          .notEmpty()
          .withMessage('emp_vaccine_status REQUIRED!'),
        check('emp_jumlah_anggota')
          .notEmpty()
          .withMessage('emp_jumlah_anggota REQUIRED!'),
        check('emp_jumlah_anggota_vaccine')
          .notEmpty()
          .withMessage('emp_jumlah_anggota_vaccine REQUIRED!'),
      ],
      addStatusVaccineCtrl.addStatusVaccine
    );

  app
    .route('/hcm/api/status-vaksins/export')
    .all(authenticateApiKey)
    .post(StatusVaksinCtrl.export);

  app
    .route('/mmf/api/addClockInWithoutPhoto')
    .all(authenticateApiKey)
    .post(addClockInWithoutPhotoCtrl.addClockInWithoutPhoto);

  app
    .route('/mmf/api/addClockOutWithoutPhoto')
    .all(authenticateApiKey)
    .post(
      [
        check('employee_id').notEmpty().withMessage('employee_id REQUIRED!'),
        check('latitude').notEmpty().withMessage('latitude REQUIRED!'),
        check('altitude').notEmpty().withMessage('altitude REQUIRED!'),
        check('longitude').notEmpty().withMessage('longitude REQUIRED!'),
        check('accuracy').notEmpty().withMessage('accuracy REQUIRED!'),
        check('location_no').notEmpty().withMessage('location_no REQUIRED!'),
        check('timeZoneAsia').notEmpty().withMessage('timeZoneAsia REQUIRED!'),
      ],
      addClockOutWithoutPhotoCtrl.addClockOutWithoutPhoto
    );

  app
    .route('/hcm/api/profilePhoto')
    .all(authenticateApiKey)
    .post(
      [check('employee_id').notEmpty().withMessage('employee_id REQUIRED!')],
      profilePhotoCtrl.profilePhoto
    );
};
