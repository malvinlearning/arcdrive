const bcrypt = require("bcryptjs");
const { PrismaClient } = require('../generated/prisma');

const passport = require("passport");

const prisma = new PrismaClient();

module.exports = {
    getMainPage: (req, res) => {
        res.render("mainPage");
    },

    getLoginPage: (req, res) => {

        res.render("loginPage");
    },

    postLogin: (req, res, next) => {
        require("passport").authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
        })
    (req, res, next);
},

    getLogout: (req, res, next) => {
        req.logout(err => {
            if (err) return next(err);
            res.redirect("/");
        });
    },

    getSignUpPage: (req, res) => {
        res.render("signUpPage");
    },

    postSignUp: async (req, res) => {
        const { username, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: { name:username, email, password: hashedPassword },
            });
            res.redirect("/login");
        } catch (err) {
            console.error(err);
            res.status(400).send("User already exists");
        }
    },
};