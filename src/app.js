require('dotenv').config();
const express = require('express');
const app = express()
const port = process.env.PORT || 3000;
require('../src/db/conn')
const path = require('path')
const hbs = require('hbs')
const Register = require('./models/registres')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const static_path = path.join(__dirname, '../public')
const template_path = path.join(__dirname, '../templates/views')
const partials_path = path.join(__dirname, '../templates/partials')

console.log(process.env.SECRET_KEY)

app.use(express.static(static_path))
app.set("view engine", "hbs")
app.set('views', template_path)
hbs.registerPartials(partials_path)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });

        //this use when we use decrypt for password
        const isMatch = await bcrypt.compare(password, useremail.password)

        //automatic login by cookie
        const token = await useremail.generateOurToken();
        console.log(`the token is ${token}`)

        // if (useremail.password === password) {
        if (isMatch) {
            res.status(201).render('index');
        } else {
            res.send('invalid login detail')
        }
    } catch (err) {
        res.status(400).send("invalid login detail")
    }
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        if (password === confirmpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: confirmpassword,
            })

            console.log(`thw sucess pary is ${registerEmployee}`)
            //middleware cookie(for storing data)

            const token = await registerEmployee.generateOurToken();
            console.log(`the token is ${token}`)

            const registerd = await registerEmployee.save();
            res.status(201).render('index')
        } else {
            res.send('password are not matching ')
        }


    } catch (err) {
        res.status(400).send(err);
    }
})



// const bcrypt = require('bcryptjs');

// const securepassword = async (password) => {
//     const passwordhash = await bcrypt.hash(password, 10);
//     console.log(passwordhash)
//     const passwordmatch = await bcrypt.compare('vishal', passwordhash);
//     console.log(passwordmatch)

// }


// securepassword("vishal")


// const jwt = require('jsonwebtoken');
// const createToken = async () => {
//     //give the unique feature of data(id) and a private key(mynameisvishalzac )
//     const token = await jwt.sign({ _id: '63d007ffbd4362b36e125241' }, 'mynameisvishalzac', {
//         expiresIn: "5 second"
//     })
//     console.log(token)
//     //verify token
//     const userverify = await jwt.verify(token, 'mynameisvishalzac')
//     console.log(userverify)
// }
// createToken()

app.listen(port, () => {
    console.log(`server is running at port number ${port}`)
})