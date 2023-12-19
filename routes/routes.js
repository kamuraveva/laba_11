const express = require('express');
const router = express.Router();
const User = require('../models/users');

// добавление нового пользователя
router.post("/add", async (req, res) => {
    console.log(req.body)
    if (!req.body) return res.sendStatus(400);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        createdAt: Date.now(),
        editedAt: Date.now(),
    });

    try {
        await user.save()
        req.session.message = {
            type: 'success',
            message: 'Пользователь успешно добавлен!'
        };
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    res.redirect("/");
});

// редактирование пользователя
router.post('/update/:id', async (req, res) => {
    console.log(req.body)
    let id = req.params.id;

    try {
        const user = await User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        editedAt: Date.now(),
        });
        req.session.message = {
            type: 'success',
            message: 'Редактирование данных пользователя прошло успешно!'
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message:err.message, type: 'danger' });
    }
});

// удаление пользователя
router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(id);
        req.session.message = {
            type: 'info',
            message: 'Пользователь успешно удален!'
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message:err.message });
    }
});

// главная страница 
router.get("/", async (req, res) => {
    try {
        const users = await User.find({});

        res.render('index', {
            title: 'Home Page',
            users: users
        });
    } catch (err) {
        res.json({
            message: err.message
        });
    }
});

// переход на форму добаления
router.get('/add', (req, res) => {
    res.render("add_users", { title: "Add Users" });
});

// переход на форму редактирования
router.get('/edit/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            res.redirect('/');
        } else {
            res.render('edit_users', {
                title: 'Редактирование данных пользователя',
                user: user,
            });
        }
    } catch (err) {
        res.redirect('/');
    }
});

module.exports = router;
