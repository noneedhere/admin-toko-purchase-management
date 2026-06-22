require('dotenv').config();

const express = require('express');
const path = require('path');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use((req, res) => {
  res.status(404).render('errors/404', {
    title: '404 — Halaman Tidak Ditemukan'
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).render('errors/500', {
    title: '500 — Kesalahan Server'
  });
});

const server = app.listen(PORT, () => {
  console.log(`Admin Toko berjalan di http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} sudah digunakan oleh proses lain.`);
    console.error(`   Solusi:`);
    console.error(`   1. Tutup terminal lain yang menjalankan "npm start" atau "npm run dev"`);
    console.error(`   2. Atau ubah PORT di file .env (contoh: PORT=3001)\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

module.exports = app;
