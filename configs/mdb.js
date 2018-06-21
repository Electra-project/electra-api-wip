// db.js
const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    const result = await mongoose.connect('mongodb://localhost/electra');
    console.log('Database connection successful');

    mongoose.connection.on('disconnected', () => {
      console.log('Database connection broken');
    });

    mongoose.connection.on('error', (err) => {
      console.log('database error');
      if (!mongoose.connection.db) {
        this.onLost();
      }
    });

    mongoose.connection.on('connected', () => {
      console.log('connected');
      this.onReady();
    });
  } catch (err) {
    console.log('Database connection error');
  }
}

connectToDatabase();
