const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authUser');
const  convertImage  = require('../controllers/convertController');
const  resizeImage  = require('../controllers/resizeController');
const  compressImage  = require('../controllers/compressControoler');
const cropImage = require('../controllers/cropController');
const  DisplayUserImages  = require('../controllers/displayImages');

const upload = multer({ dest: 'uploads/' });

router.post('/convert', auth, upload.single('image'), convertImage);
router.post('/resize', auth, upload.single('image'), resizeImage);
router.post('/compress', auth, upload.single('image'), compressImage);
router.post('/crop',auth,upload.single('image'),cropImage);
router.get('/display/:id',DisplayUserImages)
module.exports = router;