require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('node:path');

const {PrismaClient} = require('./generated/prisma');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const passport = require('./authentications/passAuth');
const routes = require('./routes/baseRoute');
const folderRoutes = require('./routes/folderRoute');
const { env } = require('node:process');

const app = express();
const prisma = new PrismaClient();

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
        secret: process.env.sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(prisma,{
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);
app.use("/folder", folderRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});