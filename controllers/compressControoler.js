const { v2: cloudinary } = require('cloudinary');
const AuthUser = require('../modals/Signup');
const UserImage = require('../modals/userImages');

// Compress and upload to Cloudinary
const compressImage = async (req, res) => {
  try {
    const file = req.file;
    const user_id = req.body.user_id;
    console.log(file,user_id);
    console.log("Compress API working with Cloudinary");

    // Upload to Cloudinary with compression
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "compressed_images",
      quality: "10",   // compress
      format: "jpg"    // output format
    });

    let login_user = await AuthUser.findById(user_id);

    if (login_user) {
      let user_image = new UserImage({
        auth_id: login_user._id,
        fileUrl: result.secure_url,  //  Cloudinary URL
        operation: "Compress quality is 10"
      });
      await user_image.save();
    }

    res.json({
      path: result.secure_url   // return Cloudinary link
    });

  } catch (err) {
    console.error(err);
    console.log("API not working");
    res.status(500).json({ error: 'Compression failed' });
  }
};

module.exports = compressImage;
