const express = require('express');
const auth = require('../auth/auth');
const { getProducts, postLogin, getLogin, getLogout, getImage, merger } = require('../controllers/user');
const router = express.Router();



router.get('/home', auth, getProducts);
router.post('/login', postLogin);
router.get('/login', getLogin);
router.get('/logout', getLogout);
router.get('/download', getImage);
router.get('/merger', merger);


module.exports = router;