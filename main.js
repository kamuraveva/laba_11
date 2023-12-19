require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.set('view engine', 'ejs');

app.use("", require("./routes/routes"));

async function doConnect() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/users_db");

        app.listen(PORT, () => {
            console.log(`Server was started at http://localhost:${PORT}`)
        });
        console.log("Сервер ожидает подключения...");
    } catch (err) {
        console.log("Ошибка подключения к БД", err)
    }
};

doConnect();
