var express = require('express');
var router = express.Router();
const indexController = require('./../controllers/index')
const { verifyToken, authAdmin, checkUserCanView } = require('./../middlewares/auth')

router.post('/createAccount', indexController.createAccount)

router.get('/test', function(req, res, next){
  res.status(200).json({ message: "test" })
})

router.post('/login', indexController.login)

router.route('/account/:id')
  .put(verifyToken, indexController.updateAccountByAdmin)
  .delete(verifyToken, authAdmin, indexController.deleteAccount)

router.route('/content/:id')
  .get(verifyToken, checkUserCanView, indexController.viewContent)
  .put(verifyToken, indexController.updateContent)
  .delete(verifyToken, indexController.deleteContent)
  .patch(indexController.updateUserCanView)

router.post('/add', indexController.addContent)

router.get('/all', indexController.viewAllContent)

module.exports = router;
