const express = require('express');

const controller = require('./controller');

const router = express.Router();


router.get('/',
    controller.loadProject,
    function (req, res) {
        let result = res.locals ******
        return res.status(200).json()
    }
);

module.exports = router;