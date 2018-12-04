const mongoose = require('mongoose');
const root = 'https://s3.amazonaws.com/lowpass-uploads';

mongoose.Promise = global.Promise;

let ImageModel = {};
const convertId = mongoose.Types.ObjectId;

function setPath(val) {
  return `${root}/${val}`;
}

const ImageSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    unique: true,
    set: setPath,
  },
  visibility: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  fileDate:
  {
    type: Date,
    default: Date.now,
  },
  keyPath:
  {
    type: String,
  },
});

ImageSchema.statics.toAPI = (doc) => ({
  fileName: doc.fileName,
  tags: doc.tags,
  title: doc.title,
  url: doc.url,
  id: doc._id,
  fileDate: doc.fileDate,
  keyPath: doc.keyPath,
});

ImageSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return ImageModel
    .find(search)
    .select('fileName fileDate tags keyPath title url _id'
    ).exec(callback);
};

ImageSchema.statics.findAllPublic = (callback) => {
  const search = {
    visibility: true,
  };
  return ImageModel
    .find(search)
    .select('fileName fileDate tags keyPath title url _id')
    .exec(callback);
};

ImageSchema.statics.deleteById = (imageKey, callback) => {
  ImageModel.deleteOne({ keyPath: imageKey }).exec(callback);
};

ImageSchema.statics.updateById = (imageTitle, imageTag, visible, fileUrl, callback) => {
  const search = {
    url: fileUrl,
  };

  const image = {
    title: imageTitle,
    tags: imageTag,
    visibility: visible,
  };

  return ImageModel.updateOne(search, { $set: image }).exec(callback);
};

ImageModel = mongoose.model('Image', ImageSchema);

module.exports.ImageModel = ImageModel;
module.exports.ImageSchema = ImageSchema;

