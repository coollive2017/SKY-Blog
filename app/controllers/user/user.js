const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (app) => {
  app.use('/user', router);
};

router.get('/', (req, res, next) => {
  return res.redirect('/user/login')
});