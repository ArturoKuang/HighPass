const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const models = require('../models');

const Image = models.Image;
const bucketName = 'lowpass-uploads';

const s3 = new AWS.S3({
  accessKeyId: 'AKIAIIWLKKESQAT2BAFQ',
  secretAccessKey: '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',
  Bucket: bucketName,
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerS3Config = multerS3({
  s3,
  bucket: bucketName,
  metadata(req, file, cb) {
    cb(null, {
      fieldName: file.fieldname,
      tag: req.body.tag,
      title: req.body.title,
      owner: req.session.account._id,
    });
  },
  key(req, file, cb) {
    const fileName = `${new Date().toISOString()}-${file.originalname}`;
    cb(null, `${req.session.account._id}/${fileName}`);
  },
});

const uploadImageS3 = multer({
  storage: multerS3Config,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // we are allowing only 5 MB files
  },
});

const saveImage = (req, res) => {
  const isPublic = !(!req.body.public);
  const imageData = {
    title: req.body.title,
    tags: req.body.tag,
    fileName: req.files[0].originalname,
    url: req.files[0].key,
    owner: req.session.account._id,
    keyPath: req.files[0].key,
    visibility: isPublic,
  };

  const newImage = new Image.ImageModel(imageData);
  const imagePromise = newImage.save();

  imagePromise.then(() => res.status(200).json({ redirect: '/account' }));

  imagePromise.catch(() => res.status(400).json({ error: 'An error occurred' }));
};

const getAccountImages = (req, res) => {
  Image.ImageModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.status(200).json({ images: docs });
  });
};

const getAllPublicImages = (req, res) => {
  Image.ImageModel.findAllPublic((err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.status(200).json({ images: docs });
  });
};

const deleteImageS3 = (req, res, next) => {
  const item = `${req.session.account._id}/${req.params.id}`;
  const params = { Bucket: bucketName, Key: item };
  s3.deleteObjects(params, () => next());
};

const updateImage = (req, res) => {
  const isPublic = !(!req.body.public);
  return Image.ImageModel.updateById(
    req.body.title,
    req.body.tag,
    isPublic,
    req.body.url,
    (err) => {
      if (err) { res.status(400).json({ error: 'An error occurred' }); }

      res.json({ redirect: '/account' });
    }
  );
};

const deleteImage = (req, res) => Image.ImageModel.deleteById(
  `${req.session.account._id}/${req.params.id}`,
  (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ images: docs });
  });

module.exports.getAccountImages = getAccountImages;
module.exports.deleteImage = deleteImage;
module.exports.deleteImageS3 = deleteImageS3;
module.exports.uploadImageS3 = uploadImageS3;
module.exports.saveImage = saveImage;
module.exports.getAllPublicImages = getAllPublicImages;
module.exports.updateImage = updateImage;
