const express = require('express');
const router = express.Router();
const User = require('../DAO/usersManager.js')

router.get('/', (req, res) => {
    res.render('welcome');
  });


module.exports = router;
