const mongoose = require('mongoose');

const UserImages = new mongoose.Schema({
  auth_id: {
   type: mongoose.Schema.Types.ObjectId,
    ref: "AuthUser"
  },
  fileUrl: String,
  operation: String

});

module.exports = mongoose.model('UserImages', UserImages, "userimages");
