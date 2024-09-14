const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const prisma = require('../db/prismaClient');
const passport = require('passport');
const fs = require('node:fs');
const appRoot = require('app-root-path');

const registerValidation = [
    body('firstName').trim().notEmpty().withMessage('first name cannot be empty').isAlpha().withMessage('first name can only be alphabets'),
    body('lastName').trim().notEmpty().withMessage('last name cannot be empty').isAlpha().withMessage('first name can only be alphabets'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password cannot be empty')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    body('confirmPassword')
        .trim()
        .notEmpty().withMessage('Confirm password cannot be empty')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match');
            }
            return true;
        })

]

const getRegister = (req, res) => {
    res.render('register', { pageTitle: "Register User" })
}

const postRegister = [
    registerValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.locals.errors = errors.array()
            return res.status(400).render('register', { pageTitle: 'Register', errors: errors.array() })
        }
        const { firstName, lastName, email, password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(password, salt);
        try {
            const user = await prisma.user.create({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: hashedPass
                }
            })
            const alluser = await prisma.user.findMany();
            const folderName = `${appRoot}/uploads/${user.id}`;
            fs.mkdirSync(folderName);
            res.redirect('/');
        } catch (error) {
            throw new Error(error);
        }
        res.end();
    }
    //   email: 'mywozi@mailinator.com',
    //   password: 'Pa$$w0rd!',
]

const getLogIn = (req, res) => {
    res.render('login', { pageTitle: 'Log In' })
}

const postLogIn = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
})

const logOutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}

module.exports = {
    getRegister,
    postRegister,
    getLogIn,
    postLogIn,
    logOutUser
}