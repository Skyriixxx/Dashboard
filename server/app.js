const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Method", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = require('./app/models');

app.post('/api/auth/login', (req, res) => {
    console.log(req.body);
    if (! req.body.hasOwnProperty('username')
        || ! req.body.hasOwnProperty('password'))
        return res.send('wrong action');
    
    db.user.find({ username: req.body.username, password: req.body.password })
        .exec((err, users) => {
            if (err) res.status(500).send({ message: err });
            else if (users.length) res.send(users[0]);
            else res.status(400).send("username or password incorrect");
        });
});

app.post('/api/auth/register', (req, res) => {
    errorHandling = (err) => {
        switch (err['code']) {
            case 11000:
                res.status(400).send({ message: "ko! username already in use" });
                return;
            default:
                res.status(500).send({ message: err });
        }
    }

    console.log(req.body);

    nwUser = {
        'username': req.body.username,
        'password': req.body.password,
        'widgets': {
            cinema: {
                isActive: false,
                search: ""
            },
            youtube: {
                isActive: false,
                search: ""
            },
            weather: {
                isActive: false,
                search: ""
            },
        }
    }

    db.user.create(nwUser, (err, user) => {
        if (err) return errorHandling(err);
        res.send(user);
    });
});

app.post('/api/widget/:user/set', (req, res) => {
    console.log(req.params.user);
    if (!req.body.widget || (req.body.search != '' && !req.body.search)) {
        res.status(400).send('wrong parameters')
        return;
    }

    db.user.findOne({ 'username': req.params.user }, (err, user) => {
        console.log(user);
        if (err) res.status(500).send({ message: err });
        else if (!user.widgets.hasOwnProperty(req.body.widget)) res.status(400).send('mistype bro');
        else {
            console.log(req.body.widget)
            console.log("hello");
            user.widgets[req.body.widget].isActive = true;
            user.widgets[req.body.widget].search = req.body.search;
            user.save()
            console.log(user);
            res.send('ok');
        }
    });
});

app.post('/api/widget/:user/unset', (req, res) => {
    console.log(req.params.user);
    if (!req.body.widget) {
        res.status(400).send('wrong parameters')
        return;
    }

    db.user.findOne({ 'username': req.params.user }, (err, user) => {
        console.log(user);
        if (err) res.status(500).send({ message: err });
        else if (!user.widgets.hasOwnProperty(req.body.widget)) res.status(400).send('mistype bro');
        else {
            user.widgets[req.body.widget].isActive = false;
            user.widgets[req.body.widget].search = "";
            user.save()
            res.send('ok');
        }
    })
});


const About = require('./about');
app.get('/about.json', (req, res) => res.send(About(req.socket.remoteAddress)));

const PORT = 8080;
app.listen(PORT, () => console.log(`listening: localhost:${PORT}`));