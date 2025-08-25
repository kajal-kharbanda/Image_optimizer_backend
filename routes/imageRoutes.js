const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authUser');
const  convertImage  = require('../controllers/convertController');
const  resizeImage  = require('../controllers/resizeController');
const  compressImage  = require('../controllers/compressControoler');
const cropImage = require('../controllers/cropController');
const  DisplayUserImages  = require('../controllers/displayImages');
const upload = require('../middleware/multerCloudinary');
// const upload = multer({ dest: 'uploads/' });

router.post('/convert', auth, upload.single('file'), convertImage);
router.post('/resize', auth, upload.single('file'), resizeImage);
router.post('/compress', auth, upload.single('file'), compressImage);
router.post('/crop',auth,upload.single('file'),cropImage);
router.get('/display/:id',DisplayUserImages)
module.exports = router;