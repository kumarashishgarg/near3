const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');


/* GET users listing. */
router.post('/', function (req, res, next) {
  var newUser = new User({
    userName: 'near3bot',
    password: 'Password@01',
  });

  newUser.save(function (err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});


router.post('/', function (req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
