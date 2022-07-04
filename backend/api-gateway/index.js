require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
// const httpProxy = require('express-http-proxy');

const app = express();
// disables caching
app.disable('etag');
// enable view JSON generation for requests
app.use(express.json());
// enable CORS middleware
app.use(cors());
// enable morgan to log
app.use(morgan('dev'));
// enable helmet
app.use(helmet());
//enable CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use(cookieParser());

// app.use('/accounts', httpProxy('http://localhost:5001', {timeout: 3000}));
// app.use('/invoices', httpProxy('http://localhost:5002', {timeout: 3000}));
// app.use('/products', httpProxy('http://localhost:5003', {timeout: 3000}));

app.use('/', routes);

// app.get('/', (req, res) => {
//     return res.status(400).json({message: 'API GATEWAY'});
// });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`API gateway server started on ${PORT}`);
});
