<div align="center">
<img src="https://www.google.com/search?q=https://placehold.co/150x150/2c3e50/ffffff%3Ftext%3DApp%2BAntrian%26font%3Dmontserrat" alt="Logo App Antrian" width="140" height="140" style="border-radius: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

<h1 align="center">📌 App-Antrian Metrologi</h1>

<p align="center">
<b>Sistem Antrian Terintegrasi & Real-Time untuk Pelayanan Publik</b>





<i>Efisien • Transparan • Modern</i>
</p>

<p align="center">
<a href="https://github.com/features">
<img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge&logo=github" alt="Status Active">
</a>
<a href="https://www.electronjs.org/">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Platform-Electron-2B2E3A%3Fstyle%3Dfor-the-badge%26logo%3Delectron%26logoColor%3D9FEAF9" alt="Platform Electron">
</a>
<a href="https://nodejs.org/">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Backend-Node.js-339933%3Fstyle%3Dfor-the-badge%26logo%3Dnodedotjs%26logoColor%3Dwhite" alt="Build Nodejs">
</a>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Code-JavaScript-F7DF1E%3Fstyle%3Dfor-the-badge%26logo%3Djavascript%26logoColor%3Dblack" alt="Javascript">
</a>
</p>

<p align="center">
<a href="#-deskripsi-singkat">📝 Deskripsi</a> •
<a href="#-struktur-sistem">🧩 Arsitektur</a> •
<a href="#-fitur-utama">🚀 Fitur</a> •
<a href="#-instalasi--penggunaan">⚙️ Instalasi</a> •
<a href="#-galeri-antarmuka">📸 Galeri</a>
</p>
</div>

<details open>
<summary><b>📚 Daftar Isi (Klik untuk menutup/membuka)</b></summary>





<ol>
<li><a href="#-deskripsi-singkat">Deskripsi Singkat</a></li>
<li><a href="#-struktur-sistem">Struktur Sistem Aplikasi</a></li>
<li><a href="#-teknologi-yang-digunakan">Teknologi yang Digunakan</a></li>
<li><a href="#-fitur-utama">Fitur Utama</a></li>
<li><a href="#-instalasi--penggunaan">Instalasi & Penggunaan</a></li>
<li><a href="#-galeri-antarmuka">Galeri Antarmuka</a></li>
<li><a href="#-lisensi">Lisensi & Kontak</a></li>
</ol>
</details>

📖 Deskripsi Singkat

App-Antrian Metrologi adalah aplikasi manajemen antrian digital end-to-end yang dirancang khusus untuk mendigitalisasi proses pelayanan di Direktorat Metrologi (atau instansi pelayanan publik lainnya).

Sistem ini menggantikan metode antrian kertas manual dengan solusi cerdas berbasis jaringan lokal (LAN/WLAN) yang menyinkronkan data secara real-time antara Mesin Tiket (Kiosk), Petugas Loket (Admin), dan Layar Utama (Display TV).

🎯 Tujuan Utama:

Mempercepat alur pelayanan masyarakat.

Memberikan transparansi urutan antrian.

Mengurangi penumpukan di area ruang tunggu.

🧩 Struktur Sistem

Sistem ini menggunakan arsitektur client-server lokal yang terbagi menjadi 3 modul/perangkat utama yang saling terhubung menggunakan WebSockets untuk pembaruan real-time:

graph TD;
    User((👤 Pengunjung)) -->|Ambil Tiket| KIOSK[🎟️ Mesin Kiosk];
    KIOSK -->|Simpan Data & Cetak| DB[(🗄️ Database / Node Server)];
    DB -->|WebSockets Sync| ADMIN[🖥️ PC Operator / Loket];
    DB -->|WebSockets Sync| DISPLAY[📺 Smart TV / Display];
    ADMIN -->|Panggil / Lewati| DB;
    DISPLAY -.->|Voice Announcer / Text-to-Speech| User;


🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan stack teknologi modern untuk memastikan performa yang cepat dan stabil di lingkungan desktop:

Kategori

Teknologi

Deskripsi

Desktop Framework



Wrapper aplikasi desktop cross-platform.

Backend & API



Server lokal dan routing API.

Real-Time Engine



Komunikasi dua arah (Auto-refresh antrian).

Frontend UI



Antarmuka pengguna yang responsif.

Database



Penyimpanan data ringan & tanpa konfigurasi server.

🚀 Fitur Utama

Aplikasi ini dibagi menjadi 3 modul mandiri dengan fitur spesifik:

1. 🖥️ Modul Operator (Loket)

Panggilan Otomatis (Call): Memanggil nomor antrian berikutnya dengan satu klik.

Panggil Ulang (Recall): Mengulang suara panggilan jika pengunjung tidak hadir.

Lewati (Skip): Melewati nomor antrian dan memanggil nomor selanjutnya.

Selesai (Finish): Menandai bahwa pelayanan untuk nomor tersebut telah selesai.

Dashboard Statistik: Melihat sisa antrian dan total yang sudah dilayani hari ini.

2. 📺 Modul Display (TV Ruang Tunggu)

Voice Announcer: Fitur Text-to-Speech atau Audio Rekaman otomatis ("Nomor antrian... A-0-1... Silahkan menuju... Loket 1").

Tampilan Real-Time: Angka berganti secara otomatis tanpa perlu refresh halaman.

Media Player Terintegrasi: Menampilkan video company profile atau gambar slider di sebelah nomor antrian.

Running Text: Teks berjalan di bagian bawah layar untuk informasi tambahan.

3. 🎟️ Modul Kiosk (Mesin Tiket)

Pilihan Layanan: Pengunjung dapat memilih kategori layanan (misal: Tera, Tera Ulang, Pengaduan).

Auto-Print: Terintegrasi langsung dengan Thermal Printer (USB/Bluetooth) untuk mencetak nomor antrian.

⚙️ Instalasi & Penggunaan

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di lingkungan lokal Anda.

Prasyarat (Prerequisites)

Pastikan Anda telah menginstal perangkat lunak berikut di PC/Server Anda:

Node.js (Versi 16.x atau terbaru)

Git (Opsional, untuk clone repositori)

Printer Thermal (Jika menggunakan fitur cetak Kiosk)

Langkah Instalasi

Clone Repositori

git clone [https://github.com/username-anda/app-antrian-metrologi.git](https://github.com/username-anda/app-antrian-metrologi.git)
cd app-antrian-metrologi


Install Dependensi

npm install


Konfigurasi Lingkungan (Optional)
Salin file .env.example menjadi .env dan sesuaikan port atau konfigurasi database jika diperlukan.

cp .env.example .env


Jalankan Aplikasi dalam Mode Development

npm start


Build Aplikasi (Produksi)
Untuk membuat file installer (.exe / .dmg), gunakan perintah:

npm run build


📸 Galeri Antarmuka

Berikut adalah cuplikan antarmuka dari masing-masing modul:

<table align="center">
<tr>
<td align="center"><b>Tampilan TV / Display</b></td>
<td align="center"><b>Tampilan Kiosk Mesin Tiket</b></td>
</tr>
<tr>
<td><img src="https://www.google.com/search?q=https://placehold.co/600x338/2c3e50/ffffff%3Ftext%3DScreenshot%2BDisplay%2BTV" alt="Display TV" style="border-radius: 8px;"></td>
<td><img src="https://www.google.com/search?q=https://placehold.co/600x338/2c3e50/ffffff%3Ftext%3DScreenshot%2BKiosk" alt="Kiosk" style="border-radius: 8px;"></td>
</tr>
<tr>
<td align="center" colspan="2"><b>Dashboard Operator / Loket</b></td>
</tr>
<tr>
<td colspan="2" align="center"><img src="https://www.google.com/search?q=https://placehold.co/800x400/2c3e50/ffffff%3Ftext%3DScreenshot%2BDashboard%2BOperator" alt="Dashboard" style="border-radius: 8px;"></td>
</tr>
</table>

Catatan: Ganti URL https://placehold.co/... pada source code dengan path gambar asli Anda (misal: ./assets/screenshots/display.png).

🤝 Kontribusi

Kami sangat terbuka untuk kontribusi! Jika Anda menemukan bug atau memiliki ide fitur baru:

Fork repositori ini

Buat branch fitur Anda (git checkout -b feature/FiturKeren)

Commit perubahan Anda (git commit -m 'Menambahkan FiturKeren')

Push ke branch (git push origin feature/FiturKeren)

Buka sebuah Pull Request

📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat file LICENSE untuk informasi lebih lanjut.

<div align="center">
<p>Dibuat dengan ❤️ untuk kemajuan Pelayanan Publik Indonesia.</p>
</div>
