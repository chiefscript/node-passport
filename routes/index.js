const express = require('express');
const router  = express.Router();
const { authGuard } = require('../config/guard');

router.get('/index', authGuard, (req, res) => 
    res.render('index', {
        name : req.user.name,
        layout : 'auth'
    }
));

module.exports = router;