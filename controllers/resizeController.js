// const sharp = require('sharp');
// const AuthUser = require('../modals/Signup');
// const UserImage = require('../modals/userImages')
// const resizeImage = async (req, res) => {
//   const file = req.file;
//   const user_id = req.body.user_id;
//   console.info(user_id)
//   const { width, height } = req.body;
//   const outputPath = `processed/resized_${Date.now()}.jpg`;
//   const operate = `Resize image to ${width}x${height}`;
//   console.log(operate);
//   try {
//     await sharp(file.path)
//       .resize(parseInt(width), parseInt(height))
//       .toFile(outputPath);
//     const operate = `Resize image to ${width}x${height}`;
//       console.log(outputPath);

//        let login_user = await AuthUser.findById(user_id)
//           console.log(login_user)
      
//           if(login_user){
//             let user_image = new UserImage({ auth_id: login_user._id, filename: outputPath,operation: operate});
//             user_image.save()
//           }
//     res.json({
//       path:   `${outputPath}`
//     });
    
//   } catch (err) {
//     res.status(500).json({ error: 'Resize failed' });
//   }
// };

// module.exports = resizeImage;

const { v2: cloudinary } = require('cloudinary');
const AuthUser = require('../modals/Signup');
const UserImage = require('../modals/userImages');

const resizeImage = async (req, res) => {
  const file = req.file;
  const user_id = req.body.user_id;
  const { width, height } = req.body;

  console.log("Resize API working with Cloudinary");
  console.log("User:", user_id, "File:", file);

  try {
    // 1️⃣ Upload to Cloudinary with resizing
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "resized_images",
      width: parseInt(width),
      height: parseInt(height),
      crop: "scale",   // or "fit" / "fill" depending on how you want resize behavior
      format: "jpg"
    });

    // 2️⃣ Save Cloudinary URL in DB
    const operate = `Resize image to ${width}x${height}`;
    let login_user = await AuthUser.findById(user_id);

    if (login_user) {
      let user_image = new UserImage({
        auth_id: login_user._id,
       fileUrl: result.secure_url, // Cloudinary URL
        operation: operate
      });
      await user_image.save();
    }

    // 3️⃣ Return Cloudinary link
    res.json({
      path: result.secure_url
    });

  } catch (err) {
    console.error("Resize failed:", err);
    res.status(500).json({ error: 'Resize failed' });
  }
};

module.exports = resizeImage;
