# Logging System (Winston) 

Kalian semua sudah pada tau kan kalo di node js itu kita melakukan logging pada setiap development itu menggunakan:

```js
console.log("log javascript!");
console.log(error);
```

tapi tau ga sih kalian kalo Node Js sudah di deploy ke server dan terjadi error dalam server, kita ga bisa nangkep error tersebut kenapa ? ya karena ga ada log yang di tampilkan, emangnya kita bisa ngecek log dengan cara mantau di server ? 

nah salah satunya adalah membuat offline log, offline log  yang berguna untuk melihat file kita secara offline + saat error di development. kita akan memakai library winston untuk generate file offline dimana file ini bisa ngebaca error apa yang terjadi.

```json
{"code":"ER_BAD_FIELD_ERROR","errno":1054,"sqlMessage":"Unknown column 'person' in 'where clause'","sqlState":"42S22","index":0,"sql":"SELECT * FROM user WHERE person = 'Kiddy'","level":"error"}
```
ini contoh diatas hasil generate offline log dari winston. 

## New Config Setup
Sebelum kita membuat logging system pada project kita, kita membuat file config terlebih dahulu untuk menaruh file file env kita agar lebih mudah akses nya. buat lah file config.js di folder config.

`config/config.js`
```js
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
      url: process.env.DATABASE_URL
    }
};
```

ingat environment kita terbagi 2 stage dalam backend 
- development
- production

setiap stage mempunyai logging berbeda, makanya kita punya NODE_ENV untuk membadakan mana stage server yang dijalankan.

update file env kalian untuk menaruh PORT di env, karna sebelumnya kita hardcode port kita di index.js

`.env`

```
DATABASE_URL="mysql://root:VE2vR87YwrTrhIzAzh7X@containers-us-west-154.railway.app:6803/railway"
PORT=3000
```

kenapa `NODE_ENV` tidak ada di file .env ? karena kita set variable itu di command package json kita. lihat script package.json

```json
"scripts": {
    "start": "pm2 start ecosystem.config.json --no-daemon",
    "dev": "cross-env NODE_ENV=development nodemon src/index.js",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "prettier": "prettier --check **/*.js",
    "prettier:fix": "prettier --write **/*.js",
    "prepare": "husky install"
  },
```

sekarang update index.js kita menggunakan config yang sudah kita buat.
```js
const app = require('./app');
const prisma = require('../prisma/client');
const config = require('./config/config')

let server;

if (prisma) {
  console.log('Connected to Database');
  server = app.listen(config.port, () => {
    console.log(`Listening to port ${port}`);
  });
}

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
```

setiap kalian ingin menambahkan variable yang berhubungan dengan credential wajib setup di config kalian, agar reduce code berulang ketika ingin mengganti variable tersebut.

## Logger Winston
Winston adalah sebuah pustaka (library) log penuh fitur untuk bahasa pemrograman JavaScript yang biasanya digunakan dalam lingkungan Node.js. Ini memungkinkan pengembang untuk membuat, mengelola, dan menghasilkan berbagai jenis log dalam aplikasi mereka. Winston adalah salah satu pustaka log yang populer dan sering digunakan dalam pengembangan aplikasi Node.js.

Berikut adalah beberapa fitur dan konsep kunci terkait dengan Winston:

1. **Pengaturan Tingkat Log (Log Level Setting)**: Winston mendukung pengaturan tingkat log yang berbeda, seperti info, warn, error, debug, dan lain-lain. Kalian dapat mengonfigurasi tingkat log yang berbeda untuk mengendalikan tingkat detail informasi yang akan dicatat.

2. **Multiple Transport**: Winston memungkinkan Kalian untuk menggunakan berbagai transport atau output yang berbeda untuk log Kalian. Kalian dapat mengirim log ke berkas teks, konsol, penyimpanan jarak jauh (remote storage), atau bahkan mengintegrasikannya dengan layanan pihak ketiga seperti Loggly atau Papertrail.

3. **Penyesuaian Format Log (Log Format Customization)**: Kalian dapat menyesuaikan format log sesuai dengan kebutuhan Kalian. Winston mendukung format log sederhana hingga yang sangat terstruktur dan dapat disesuaikan sepenuhnya.

4. **Logging Metadata**: Kalian dapat menyertakan metadata tambahan dalam setiap log. Ini bisa berupa informasi kontekstual yang berguna saat menganalisis log, seperti ID pengguna, waktu permintaan, atau informasi lingkungan.

5. **Logging Exceptions**: Winston memiliki fitur yang memungkinkan Kalian untuk dengan mudah melacak dan mencatat pengecualian (exceptions) dalam aplikasi Kalian, termasuk stack trace dan informasi terkait pengecualian.

6. **Pengaturan Fleksibel**: Winston memberikan fleksibilitas dalam konfigurasi dan penggunaan. Kalian dapat dengan mudah mengonfigurasi berbagai aspek log sesuai dengan kebutuhan proyek Kalian.

7. **Plugin dan Ekstensi**: Winston memiliki berbagai plugin dan ekstensi yang dapat Kalian gunakan untuk memperluas fungsionalitasnya, seperti dukungan untuk log rotasi, log ke berbagai platform, dan banyak lagi.

## Offline Logger Inventory System
buatlah file `logger.js` di dalam folder config

`config/logger.js`
```js
const winston = require('winston');
const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

module.exports = logger;
```

ini adalah penjelasan dari code yang sudah kita buat:

1. `const winston = require('winston');`: Ini mengimpor library Winston yang diperlukan untuk membuat dan mengelola log.

2. `const config = require('./config');`: Ini mengimpor berkas config.js yang berisi konfigurasi aplikasi, termasuk lingkungan (environment) aplikasi.

3. `const enumerateErrorFormat = winston.format((info) => { ... })`: Ini mendefinisikan format log khusus yang disebut enumerateErrorFormat. Format ini digunakan untuk mengubah pesan log jika informasi log adalah sebuah error. Jika log adalah instance dari Error, maka pesan log diganti dengan tumpukan (stack trace) dari error tersebut.

4. `const logger = winston.createLogger({ ... })`: Ini adalah bagian utama dari konfigurasi logger Winston. Di sini, kalian membuat sebuah instance logger dengan berbagai pengaturan:
- level: Tingkat log yang akan dicatat (misalnya, 'debug' atau 'info') tergantung pada lingkungan aplikasi yang diatur dalam konfigurasi.
- format: Ini adalah format log yang akan digunakan. Format ini mencakup:
  - enumerateErrorFormat(): Format yang telah didefinisikan sebelumnya untuk mengubah pesan log jika ada error.
  - winston.format.colorize() atau winston.format.uncolorize(): Pilihan ini mengatur apakah pesan log akan diwarnai (hanya untuk lingkungan pengembangan) atau tidak (untuk lingkungan produksi).
  - winston.format.splat(): Format ini memungkinkan interpolasi nilai-nilai dalam pesan log.
  - winston.format.printf(...): Ini mengatur format akhir pesan log yang akan dicetak, termasuk tingkat log dan pesan itu sendiri.
- transports: Ini adalah daftar transport (output) log yang akan digunakan. Dalam hal ini, digunakan transport Console untuk mencetak log ke konsol.

5. `module.exports = logger;`: Ini mengekspor logger yang telah dikonfigurasi sehingga dapat digunakan dalam berkas lain dalam aplikasi kalian.

Dengan konfigurasi ini, logger Winston akan menghasilkan pesan log sesuai dengan tingkat yang sesuai dengan lingkungan aplikasi (misalnya, 'debug' saat pengembangan dan 'info' saat produksi). Pesan log akan dicetak ke konsol dan akan memiliki format yang sesuai dengan preferensi dan konfigurasi kalian. Jika pesan log adalah sebuah error, pesannya akan diubah menjadi tumpukan (stack trace) untuk analisis lebih lanjut.
nah , logger.js inilah yang kita pakai untuk logging setiap proses di backend kita.
contoh cara pakainya:

```js
const logger = require('<path to src>/config/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

## Update Index.js
Ganti semua console.log kita dengan logger yang sudah kita buat agar saat backend kita di production lognya juga muncul.

```js
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const prisma = require('../prisma/client');

let server;

if(prisma){
  logger.info('Connected to Database');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
}

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
```

## Check Point Inventory System

![image](https://github.com/user-attachments/assets/65efc4f9-5ad3-48ec-a2d7-0524d18aaced)
