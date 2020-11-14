const mongoose = require('mongoose');
const config = require('./config/config');
const app = require('./server/express');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_CONNECT, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

app.listen(config.port, (err) => {
	if (err) {
		console.log(err);
	}
	console.info(`server running on port ${config.port}`);
});
