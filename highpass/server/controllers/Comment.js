const models = require('../models');

const Comment = models.Comment;

const getImageComment = (req, res) => {
  Comment.CommentModel.findByOwner(req.query.id, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ comments: docs });
  });
};

const saveComment = (req, res) => {
  const commentData = {
    discussion_id: req.body.id,
    author: req.body.author,
    text: req.body.commentText,
  };

  const newComment = new Comment.CommentModel(commentData);
  const commentPromise = newComment.save();

  commentPromise.then(() => res.status(200).json({ success: 'comment successfully saved' }));

  commentPromise.catch(() => res.status(400).json({ error: 'An error occurred' }));
};


module.exports.getImageComment = getImageComment;
module.exports.saveComment = saveComment;
