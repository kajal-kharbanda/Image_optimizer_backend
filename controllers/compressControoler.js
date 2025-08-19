const sharp = require('sharp');
const AuthUser = require('../modals/Signup');
const UserImage = require('../modals/userImages')
const compressImage = async (req, res) => {

  const file = req.file;
  const user_id = req.body.user_id;
  console.info(user_id)
  const outputPath = `compressed/compressed_${Date.now()}.jpg`;
  console.log("Compress API working")
  console.log(file);
  const operate=`Compress quality is 25`;
  try {
    await sharp(file.path)
      .jpeg({ quality: 25 })
      .toFile(outputPath);

    let login_user = await AuthUser.findById(user_id)
    console.log(login_user)

    if(login_user){
      let user_image = new UserImage({ auth_id: login_user._id, filename: outputPath, operation:operate});
      user_image.save()
    }
    res.json({
      path: `${outputPath}`
    });


    // res.download(outputPath);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Compression failed' });
  }
};
module.exports = compressImage;