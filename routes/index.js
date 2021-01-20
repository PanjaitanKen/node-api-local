const dateCtrl = require('../controller/dateCtrl')
const countJobTaskCtrl = require('../controller/countJobTaskCtrl')
const ListJobTaskCtrl = require('../controller/listJobTaskCtrl')
const getLongitudeBranchCtrl = require('../controller/getLongitudeBranchCtrl')
const getURLHCMCtrl = require('../controller/getURLHCMCtrl')
const uploadImageCtrl = require('../controller/uploadImageCtrl')


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
};