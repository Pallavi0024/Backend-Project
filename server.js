const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error(" MongoDB Connection Error:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/', authRoutes);


app.get('/', (req, res) => {
  res.redirect('/register');
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
