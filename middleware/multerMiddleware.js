const mongoose = require('mongoose'),
  { Files } = require('../models'),
  multer = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname)
  }
})

const imgTypeFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || img.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

upload = multer({
  storage: storage,
  imgTypeFilter: imgTypeFilter,
})

let multerSingleImg = upload.single('img')


module.exports = {
  multerSingleImg,
}
