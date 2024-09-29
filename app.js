const express = require('express');
const app = express();
require('dotenv').config()
const path = require('node:path');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const indexRouter = require('./routes/indexRouter');
const PORT = process.env.PORT;
const cookieSecret = process.env.cookie_secret;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
        secret: cookieSecret,
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 2 * 60 * 1000,
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined
            }
        )
    })
);
app.use(passport.session());

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await prisma.user.findUnique(
                {
                    where: { email: email }
                }
            )
            if (!user) {
                return done(null, false, { message: "Incorrect email" })
            }

            const result = bcrypt.compareSync(password, user.password);



            if (result === false) {
                return done(null, false, { message: "Incorrect password" })
            }
            return done(null, user);
        } catch (err) {
            throw new Error(err);
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        })
        done(null, user);
    } catch (err) {
        done(err);
    }
})

// app.use(async (req, res, next) => {
//     console.log(await prisma.session.findMany());
//     console.log(await prisma.user.findMany());
//     next()
// })

app.use('/', indexRouter);

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})