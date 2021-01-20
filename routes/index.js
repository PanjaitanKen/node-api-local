const dateCtrl = require('../controller/dateCtrl')
const countJobTaskCtrl = require('../controller/countJobTaskCtrl')
const ListJobTaskCtrl = require('../controller/listJobTaskCtrl')
const getLongitudeBranchCtrl = require('../controller/getLongitudeBranchCtrl')
// const dateCtrl = require('../controller/dateCtrl')


module.exports = function(app) {
    app.route('/mmf/api/getBirthDatebyId')
        .post(dateCtrl.datePost);
    app.route('/mmf/api/getCountJobTask')
        .post(countJobTaskCtrl.getCountJobTask);
    app.route('/mmf/api/getListJobTask')
        .post(ListJobTaskCtrl.getListJobTask);
    app.route('/mmf/api/getLongitude_Branch')
        .post(getLongitudeBranchCtrl.getLongitude_Branch);
};