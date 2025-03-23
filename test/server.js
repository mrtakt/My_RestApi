const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


mongoose.connect('mongodb+srv://yukiajjah:Anjay123@cluster0.ie43m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "kunyat"
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB database");
});
//======================
app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

  


app.listen(3000, () => {
    console.log('Server started on port 3000');
});