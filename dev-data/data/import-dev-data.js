const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
dotenv.config({ path: '../../.env' });

const URL = process.env.MONGO_URL.replace(
  '<PASSWORD>',
  process.env.DATA_BASE_PASSWORD,
);

mongoose.connect(URL).then(() => {
  console.log('connected successfully');
});

const data = fs.readFileSync(`${__dirname}/tours-simple.json`);

const tours = JSON.parse(data);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
