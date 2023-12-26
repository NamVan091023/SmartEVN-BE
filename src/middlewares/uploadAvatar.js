const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatar");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
let uploadFile = multer({
  storage: storage,
  // limits: { fileSize: maxSize },
}).single("image");
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;