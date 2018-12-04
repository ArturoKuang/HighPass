const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to string
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    // redirect to account page
    return res.json({ redirect: '/account' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to string to cover sec. flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Password do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/account' });
    });

    savePromise.catch((err) => {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getInfo = (request, response) => {
  const req = request;
  const res = response;

  const accountData = {
    info: req.session.account,
  };

  if (!req.session.account) {
    return res.status(400).json({ error: 'Invalid Account Name' });
  }
  return res.json(accountData);
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.oldpassword || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Error: Passwords do not match' });
  }

  const username = `${req.session.account.username}`;
  const oldPass = `${req.body.oldpassword}`;
  const newPass = `${req.body.pass}`;

  return Account.AccountModel.changePassword(username, oldPass, newPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    return res.json({ success: 'Successfully Changed Password' });
  });
};


const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfToken = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfToken);
};

module.exports.getInfo = getInfo;
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;
