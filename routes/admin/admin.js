const express = require('express');
const auth = require('../../auth/auth');
const { getProducts, addProducts, postProducts } = require('../../controllers/user');
const router = express.Router();

router.get('/home', auth, getProducts);
router.get('/add', auth, addProducts);
router.post('/post', auth, postProducts);


module.exports = router;