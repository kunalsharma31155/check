const path = require("path");
const util = require("util");
const multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./"+'../../')+'/upload/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage }).single("image");

let uploadFileMiddleware = util.promisify(upload);
module.exports = uploadFileMiddleware;