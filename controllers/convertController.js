const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const AuthUser = require('../modals/Signup');
const UserImage = require('../modals/userImages')
const { PDFDocument } = require('pdf-lib');

const convertImage = async (req, res) => {
  const file = req.file;
  const user_id = req.body.user_id;
  console.info("convert backend",user_id)
  const format = req.body.format?.toLowerCase();

  console.log(file, format);

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!format || !['jpeg', 'jpg', 'png', 'webp', 'avif', 'pdf'].includes(format)) {
    return res.status(400).json({ error: 'Unsupported or missing format' });
  }
  const operate= `Format convert in ${format}`;

  try {
    const outputPath = `processed/convert_${Date.now()}.${format}`; // ✅ Declare early

    if (format === 'pdf') {
      const imageBuffer = fs.readFileSync(file.path);
      const pdfDoc = await PDFDocument.create();

      let imageEmbed;
      if (file.mimetype === 'image/png') {
        imageEmbed = await pdfDoc.embedPng(imageBuffer);
      } else {
        imageEmbed = await pdfDoc.embedJpg(imageBuffer);
      }

      const page = pdfDoc.addPage([imageEmbed.width, imageEmbed.height]);
      page.drawImage(imageEmbed, {
        x: 0,
        y: 0,
        width: imageEmbed.width,
        height: imageEmbed.height,
      });

      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(outputPath, pdfBytes);
     
    } 
    else {
      let image = sharp(file.path);

      switch (format) {
        case 'jpeg':
        case 'jpg':
          image = image.jpeg({ quality: 70 });
          break;
        case 'png':
          image = image.png({ compressionLevel: 8 });
          break;
        case 'webp':
          image = image.webp({ quality: 70 });
          break;
        case 'avif':
          image = image.avif({ quality: 50 });
          break;
        default:
          image = image.jpeg({ quality: 70 });
      }

     image.toFile(outputPath);
    }
    let login_user = await AuthUser.findById(user_id)
    console.log(login_user)

    if (login_user) {
      let user_image = new UserImage({ auth_id: login_user._id, filename: outputPath, operation:operate });
      user_image.save()
      console.log("pdf file save successfully");
    }

    console.log(outputPath);
    res.json({
      message: 'Image processed successfully!',
      path: `${outputPath}`
    });

  } catch (err) {
    console.error('Error converting image:', err);
    res.status(500).json({ error: 'Image conversion failed' });
  }
};

module.exports = convertImage;