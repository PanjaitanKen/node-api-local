const dateCtrl = require('../controller/dateCtrl')
const countJobTaskCtrl = require('../controller/countJobTaskCtrl')
const ListJobTaskCtrl = require('../controller/listJobTaskCtrl')
const getLongitudeBranchCtrl = require('../controller/getLongitudeBranchCtrl')
const getURLHCM = require('../controller/getURLHCM')


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
        .post(getURLHCM.getURL_HCM);
};