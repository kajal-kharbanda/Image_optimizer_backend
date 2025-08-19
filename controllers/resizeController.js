const sharp = require('sharp');
const AuthUser = require('../modals/Signup');
const UserImage = require('../modals/userImages')
const resizeImage = async (req, res) => {
  const file = req.file;
  const user_id = req.body.user_id;
  console.info(user_id)
  const { width, height } = req.body;
  const outputPath = `processed/resized_${Date.now()}.jpg`;
  const operate = `Resize image to ${width}x${height}`;
  console.log(operate);
  try {
    await sharp(file.path)
      .resize(parseInt(width), parseInt(height))
      .toFile(outputPath);
    const operate = `Resize image to ${width}x${height}`;
      console.log(outputPath);

       let login_user = await AuthUser.findById(user_id)
          console.log(login_user)
      
          if(login_user){
            let user_image = new UserImage({ auth_id: login_user._id, filename: outputPath,operation: operate});
            user_image.save()
          }
    res.json({
      path:   `${outputPath}`
    });
    
  } catch (err) {
    res.status(500).json({ error: 'Resize failed' });
  }
};

module.exports = resizeImage;