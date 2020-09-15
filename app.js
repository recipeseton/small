const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser } = require('./middleware/authmiddleware');
require('dotenv').config();

const products = [
    {id: 1, name: "product 1", price: 30.00},
    {id: 2, name: "product 2", price: 50.00}
]

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_NAME}.j7ng8.mongodb.net/small?retryWrites=true&w=majority`;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(result => app.listen(5000))
.catch(err => console.error(err));


//app.get('*', checkUser);
app.get('/products', requireAuth, (req, res) => res.status(200).json({ products }));
//app.get('/', (req, res) => res.status(200).send("This is the home page"));
app.use(authRoutes);
app.use(companyRoutes);
