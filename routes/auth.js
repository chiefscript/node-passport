const express = require('express');

const router  = express.Router();

router.get('/register', (req, res) => res.render('register', { layout : 'auth' }));
router.get('/login', (req, res) => res.render('login', { layout : 'auth' }));

module.exports = router;