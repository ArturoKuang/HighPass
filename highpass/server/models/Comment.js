const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let CommentModel = {};
const convertId = mongoose.Types.ObjectId;

const CommentSchema = new mongoose.Schema({
  discussion_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Image',
  },
  author: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});


CommentSchema.statics.toAPI = (doc) => ({
  author: doc.author,
  text: doc.text,
  createdDate: doc.createdDate,
});


CommentSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    discussion_id: convertId(ownerId),
  };

  return CommentModel.find(search).select('author text createdDate').exec(callback);
};

CommentModel = mongoose.model('Comment', CommentSchema);

module.exports.CommentModel = CommentModel;
module.exports.CommentSchema = CommentSchema;

