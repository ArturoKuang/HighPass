const makePage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

module.exports.makePage = makePage;
