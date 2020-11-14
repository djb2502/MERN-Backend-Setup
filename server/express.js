const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const helmet = require('helmet');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE, OPTIONS'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

//mount routes
app.use('/', userRoutes);
app.use('/', authRoutes);

app.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		res.status(401).json({ error: err.name + ': ' + err.message });
	} else if (err) {
		res.status(400).json({ error: err.name + ': ' + err.message });
		console.log(err);
	}
});

module.exports = app;
