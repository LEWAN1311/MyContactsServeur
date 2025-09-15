const mongoose = require('mongoose');

const DEFAULT_URI = "mongodb+srv://lewan_db_user:Winwave123%40@mycontacts.etybc6m.mongodb.net/mycontacts?retryWrites=true&w=majority&appName=MyContacts";
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI;

let isConnected = false;

async function connectDb() {
  if (isConnected) return mongoose.connection;
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
  });
  isConnected = true;
  console.log('Connected to MongoDB (Mongoose)');
  return mongoose.connection;
}

function getDb() {
  if (!isConnected) throw new Error('DB not connected. Call connectDb() first.');
  return mongoose.connection;
}

module.exports = {
  connectDb,
  getDb,
};
