const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();


//Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Importing Schema
const User = require('./Schema/User');
//connection
mongoose.connect('mongodb+srv://Gauravgdd_31:Gaurav31@cluster0-gwe1i.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDb Connected'))
    .catch(err => console.log(err))

app.get('/', (req,res) => {
    res.render('index');
})

app.post('/', (req,res) => {
    console.log(req.body);
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                return res.status(400).json({err: "Email alredy Exists"});
            }
            if(req.body.password !== req.body.confirm_password) {
                return res.json(400).json({err: 'password not Matching'});
            }

            const newUser = new User({
                username: req.body.username,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password
            });

            newUser.save()
                .then(profile => {
                    if(profile) {
                        return res.redirect('profiles')
                    }
                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
})

app.get('/profiles', (req,res) => {
    User.find({})
        .then(user => {
            if(user) {
                return res.render('profile', {profile: user})
            }else {
                return res.json({err: 'Sonmething is Wrong Bro'});
            }
        })
        .catch(err => console.log(err))
})

app.get('/edit/:id', (req,res) => {
    User.findOne({_id: req.params.id})
        .then(user => {
            console.log(user)
            if(user) {
                res.render('edit', {user: user});
            }else {
                return res.json({err: 'Something Went Wrong'});
            }
        })
        .catch(err => console.log(err))
});

app.post('/edit/:id', (req,res) => {
    User.findOne({_id: req.params.id})
        .then(user => {
            if(user) {
                user.username = req.body.username;
                user.phone = req.body.phone;
                user.email = req.body.email;
                user.password = req.body.password;
                user.save()
                    .then(success =>  {
                        if(success) {
                            return res.redirect('/profiles');
                        }
                    })
                    .catch(err => console.log(err))
            }
        }) 
        .catch(err => console.log(err))
})

app.listen(3000, () => console.log('Server Started'))