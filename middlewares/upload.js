const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const allowedMimetype = [
  'image/png', 'image/jpg', 'image/jpeg',
];
const storage = multer.memoryStorage();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimetype.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error('Invalid file type. Only PNG, JPG, JPEG is allowed');
      error.code = 'UNEXPECTED_FILE';
      cb(error);
    }
  },
}).single('image');

const uploading = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      if (err.code === 'UNEXPECTED_FILE') {
        return res.status(400).json({ error: `${err.message}` });
      } if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: `File size is too large. Maximum is 1MB ${err.message}` });
      } if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: `${err.message}` });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    if (req.file) {
      cloudinary.uploader.upload_stream({
        resource_type: 'image',
        folder: 'ems',
      }, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }
        req.cloudinaryUrl = result.secure_url;
        next()
      }).end(req.file.buffer);
    } else {
      next();
    }
  });

};

module.exports = uploading;
