const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const app = require('./app');

const URL = process.env.MONGO_URL.replace(
  '<PASSWORD>',
  process.env.DATA_BASE_PASSWORD,
);

mongoose.connect(URL).then(() => {
  console.log('connected successfully');
});

const port = process.env.PORT || 3000;
const hostName = process.env.HTTP_HOST || '127.0.0.1';

app.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}/`);
});
