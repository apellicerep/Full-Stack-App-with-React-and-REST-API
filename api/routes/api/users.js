const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs');
const User = require('../../models').User
const authHandler = require('../.././auth.js').authenticateUser



/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

router.get('/', authHandler, asyncHandler(async (req, res, next) => {
    const user = req.currentUser;
    res.status(200).json({
        name: user.firstName,
        username: user.lastName,
        email: user.emailAddress
    })
}))


router.post('/', asyncHandler(async (req, res, next) => {
    let user;
    console.log(req.body)
    if (Object.keys(req.body).length == 0) {
        req.body = { password: "" }
    }

    try {
        if (!(req.body.password === undefined || req.body.password === "")) {
            req.body.password = bcryptjs.hashSync(req.body.password)
        }
        user = await User.create(req.body);
        res.status(201).location('/').end()
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            error.message = error.errors.map(error => error.message)
            error.status = 400
            next(error)
        } else if (error.name === "SequelizeUniqueConstraintError") {
            error.message = error.errors.map(error => error.message)
            error.status = 400
            next(error)
        } else {
            throw error;
        }
    }
}));


module.exports = router