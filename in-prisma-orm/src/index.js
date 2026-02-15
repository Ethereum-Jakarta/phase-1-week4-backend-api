require("module-alias/register");
const app = require("./app");
const prisma = require("../prisma/client");

let server;
let port = 3000;

// if (prisma) {
//   console.log("Connected to Database");
//   server = app.listen(port, () => {
//     console.log(`Listening to port ${port}`);
//   });
// }

prisma
  .$connect()
  .then(() => {
    console.log("Connected to Database");
    server = app.listen(port, () => {
      console.log(`Listening to port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });




const exitHandler = async () => {
  if (server) {
    await prisma.$disconnect();
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// *NOTE: Fungsi ini melakukan dua hal penting saat aplikasi berhenti atau mengalami error:
// Tutup koneksi database dengan prisma.$disconnect() → Ini memastikan koneksi ke database tidak menggantung.
// Tutup server dengan server.close() → Ini membuat server berhenti menerima request baru sebelum benar-benar mati.
// ⚠️ Tanpa ini:
// Koneksi ke database bisa tetap terbuka (connection leak).
// Kalau ada banyak request masuk, server bisa jadi tidak stabil karena tidak ditutup dengan benar.





const unexpectedErrorHandler = (error) => {
  console.log(error);
  exitHandler();
};

// * NOTE: Menangkap Error Tak Terduga
// ibarat punya alarm kebakaran di restoran. Kalau terjadi sesuatu yang nggak terduga (misal: kebakaran di dapur), alarm bakal berbunyi, dan langsung ambil tindakan buat nutup restoran sebelum semuanya hancur.




process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//* NOTE: Tangkap Error Global
// Kode ini berfungsi seperti kamera pengawas di restoran. Dia menangkap:
// uncaughtException → Error yang terjadi di kode sinkronus tapi nggak ada try...catch.
// unhandledRejection → Error yang terjadi di Promise tapi nggak ada .catch().
// ⚠️ Tanpa ini:
// Kalau ada error yang nggak tertangkap, server bisa mati mendadak tanpa ada log yang jelas tentang apa yang terjadi.




process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});

// * NOTE:  Tangkap Sinyal untuk Mematikan Server dengan Benar:
// SIGTERM itu seperti surat perintah penutupan dari polisi. Biasanya, sinyal ini dikirim oleh layanan seperti Docker atau Heroku saat aplikasi dimatikan.
// ⚠️ Tanpa ini:
// Server bakal mati secara paksa tanpa nutup koneksi atau menyelesaikan tugas yang sedang berjalan.