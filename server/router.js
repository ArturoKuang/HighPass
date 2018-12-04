const controllers = require('./controllers');
const mid = require('./middleware');

// routes to go to
const router = (app) => {
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/account', mid.requiresLogin, controllers.Profile.makePage);
  app.get('/getAccountInfo', mid.requiresLogin, controllers.Account.getInfo);
  app.get('/files', mid.requiresLogin, controllers.Images.getAccountImages);
  app.get('/comments', mid.requiresLogin, controllers.Comment.getImageComment);
  app.post('/comments', mid.requiresLogin, controllers.Comment.saveComment);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/files/public', mid.requiresLogin, controllers.Images.getAllPublicImages);
  app.delete('/files/:id',
    mid.requiresLogin,
    controllers.Images.deleteImageS3,
    controllers.Images.deleteImage);
  app.post(
    '/uploadImage',
    mid.requiresLogin,
    controllers.Images.uploadImageS3.any(),
    controllers.Images.saveImage);
  app.post('/updateImage', mid.requiresLogin, controllers.Images.updateImage);
};


module.exports = router;

