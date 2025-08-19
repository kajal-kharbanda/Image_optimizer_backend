// const sharp = require('sharp')
// const AuthUser = require('../modals/Signup')
// const UserImage = require('../modals/userImages')

// const cropImage = async (req, res) => {
//   const { image, x, y, width, height, user_id } = req.body
//   const base64Data = image.split(';base64,').pop()
//   const buffer = Buffer.from(base64Data, 'base64')
//   const outputPath = `processed/cropped_${Date.now()}.jpg`

//   try {
//     await sharp(buffer)
//       .extract({
//         left: Math.round(Number(x)),
//         top: Math.round(Number(y)),
//         width: Math.round(Number(width)),
//         height: Math.round(Number(height))
//       })
//       .toFile(outputPath)

//     let login_user = await AuthUser.findById(user_id)
//     if (login_user) {
//       let user_image = new UserImage({ auth_id: login_user._id, filename: outputPath })
//       await user_image.save()
//     }

//     res.json({ path: outputPath })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: 'Crop failed' })
//   }
// }

// module.exports = cropImage;
const sharp = require('sharp')
const AuthUser = require('../modals/Signup')
const UserImage = require('../modals/userImages')

const cropImage = async (req, res) => {
  const { x, y, width, height, user_id } = req.body
  const file = req.file

  if (!file) return res.status(400).json({ error: 'No image uploaded' })

  const outputPath = `processed/cropped_${Date.now()}.jpg`

  try {
    await sharp(file.path)
      .extract({
        left: Math.round(Number(x)),
        top: Math.round(Number(y)),
        width: Math.round(Number(width)),
        height: Math.round(Number(height))
      })
      .toFile(outputPath)

    const login_user = await AuthUser.findById(user_id)
    if (login_user) {
      const user_image = new UserImage({ auth_id: login_user._id, filename: outputPath })
      await user_image.save()
    }
    console.log(`Image Cropped Successfully with path ${outputPath}`)
    res.json({ path: outputPath })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Crop failed' })
  }
}

module.exports = cropImage;
