<div align="center">
<img src="https://placehold.co/150x150/2c3e50/ffffff?text=App+Antrian" alt="Logo App Antrian" width="140" height="140" style="border-radius: 20px;">

<h1 align="center">📌 App-Antrian Metrologi</h1>

<p align="center">
<b>Sistem Manajemen Antrian Terintegrasi untuk Pelayanan Publik</b>





Solusi Cerdas • Real-Time • Efisien • Modern
</p>

<p align="center">
<a href="https://github.com/features">
<img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge&logo=github" alt="Status Active">
</a>
<a href="https://www.electronjs.org/">
<img src="https://img.shields.io/badge/Platform-Electron-blue?style=for-the-badge&logo=electron&logoColor=white" alt="Platform Electron">
</a>
<a href="https://nodejs.org/">
<img src="https://img.shields.io/badge/Build-Node.js-green?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Build Nodejs">
</a>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
<img src="https://img.shields.io/badge/Code-JavaScript-yellow?style=for-the-badge&logo=javascript&logoColor=black" alt="Javascript">
</a>
</p>

<p align="center">
<a href="#-deskripsi-singkat">📝 Deskripsi</a> •
<a href="#-teknologi-yang-digunakan">🛠 Teknologi</a> •
<a href="#-fitur-utama">🚀 Fitur</a> •
<a href="#-galeri-antarmuka">📸 Galeri</a>
</p>
</div>

<details>
<summary><b>📚 Daftar Isi (Klik untuk membuka)</b></summary>





<ol>
<li><a href="#-deskripsi-singkat">Deskripsi Singkat</a></li>
<li><a href="#-struktur-sistem-aplikasi">Struktur Sistem Aplikasi</a></li>
<li><a href="#-teknologi-yang-digunakan">Teknologi yang Digunakan</a></li>
<li><a href="#-fitur-utama">Fitur Utama</a></li>
<li><a href="#-instalasi--penggunaan">Instalasi & Penggunaan</a></li>
<li><a href="#-galeri-antarmuka">Galeri Antarmuka</a></li>
</ol>
</details>

📖 Deskripsi Singkat

App-Antrian Metrologi adalah aplikasi manajemen antrian digital yang dirancang khusus untuk mengoptimalkan operasional pelayanan publik di Direktorat Metrologi. Sistem ini menggantikan metode antrian manual dengan solusi berbasis teknologi yang menampilkan informasi panggilan secara real-time di layar TV publik dan terintegrasi langsung dengan panel kontrol operator.

Keunggulan Utama:

Meningkatkan Efisiensi: Mempercepat alur kerja petugas loket dalam memanggil antrian.

Transparansi Layanan: Pengunjung dapat melihat status antrian dan estimasi secara langsung.

Profesionalisme: Dilengkapi dengan fitur Voice Announcer (pemanggil suara otomatis) yang memberikan kesan modern pada instansi.

🧩 Struktur Sistem Aplikasi

Sistem ini beroperasi menggunakan arsitektur client-server pada jaringan lokal (LAN) instansi, yang terdiri dari 3 modul utama. Berikut adalah alur kerjanya:

graph TD;
    User((👤 Pengunjung)) -->|Ambil Tiket| KIOSK[🎟️ Kiosk App];
    KIOSK -->|Simpan Data| DB[(🗄️ Database/Server)];
    DB -->|Sync Realtime| ADMIN[🖥️ Admin Operator];
    DB -->|Sync Realtime| DISPLAY[📺 Display TV];
    ADMIN -->|Panggil/Skip/Recall| DB;
    DISPLAY -.->|Voice Announcer| User;


🛠 Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan tumpukan teknologi modern untuk memastikan performa yang cepat, aman, dan stabil di lingkungan desktop:

Komponen

Teknologi

Keterangan

Framework Utama

Electron.js

Membungkus aplikasi web menjadi aplikasi desktop lintas platform.

Lingkungan Runtime

Node.js

Menangani logika backend dan manajemen sistem lokal.

Komunikasi Real-Time

Socket.io

Sinkronisasi data seketika antara Kiosk, Admin, dan Display.

Antarmuka (UI/UX)

HTML5, CSS3, JS

Desain responsif, interaktif, dan ramah pengguna (User Friendly).

Basis Data

SQLite / MySQL

Penyimpanan data nomor antrian dan riwayat pelayanan.

Fitur Audio

Web Speech API

Konversi Teks ke Suara (TTS) otomatis untuk memanggil pengunjung.

🚀 Fitur Utama

1. Modul Kiosk (Pencetak Tiket Mandiri)

Kategori Layanan Dinamis: Memilih jenis layanan Metrologi yang spesifik (Tera, Tera Ulang, dll).

Cetak Otomatis: Terhubung langsung dengan printer thermal untuk mencetak struk nomor antrian.

Touch-Screen Ready: Antarmuka dengan tombol besar yang dioptimalkan untuk layar sentuh Kiosk.

2. Modul Admin / Operator Loket

Kontrol Panggilan Komprehensif: Tersedia tombol Call (Panggil), Recall (Panggil Ulang), dan Skip (Lewati).

Indikator Real-Time: Menampilkan sisa antrian yang belum dipanggil secara live.

Manajemen Multi-Loket: Mendukung banyak loket (Loket 1, Loket 2, dst) yang beroperasi secara bersamaan.

3. Modul Display (Layar TV Publik)

Tampilan Split-Screen: Menampilkan nomor antrian aktif di satu sisi dan video profil/edukasi di sisi lainnya.

Voice Announcer: Notifikasi suara otomatis dalam Bahasa Indonesia (contoh: "Nomor antrian... A... 0... 1... menuju... Loket... 1").

Running Text: Teks berjalan di bagian bawah layar untuk menyampaikan informasi/pengumuman tambahan.

⚙️ Instalasi & Penggunaan

Untuk menjalankan sistem ini secara lokal di lingkungan pengembangan (development), ikuti langkah-langkah berikut:

Prasyarat Sistem

Node.js (Direkomendasikan versi LTS 18.x atau lebih baru)

npm atau yarn

Git

Langkah Instalasi

Clone Repositori

git clone [https://github.com/username-anda/app-antrian-metrologi.git](https://github.com/username-anda/app-antrian-metrologi.git)
cd app-antrian-metrologi


Instalasi Dependensi

npm install


Konfigurasi Lingkungan (Environment)

Salin file .env.example menjadi .env.

Sesuaikan port atau konfigurasi database jika menggunakan MySQL (abaikan jika menggunakan SQLite bawaan).

cp .env.example .env


Jalankan Aplikasi (Mode Development)

npm run start


Build Aplikasi (Mode Production / .exe)

npm run build


(Hasil kompilasi file .exe atau installer akan berada di dalam folder dist atau release)

📸 Galeri Antarmuka

(Catatan: Ganti tautan gambar di bawah dengan tangkapan layar/screenshot asli dari aplikasi Anda)

Tampilan Kiosk (Pengunjung)

Tampilan Display (Layar TV)

<img src="https://www.google.com/search?q=https://placehold.co/400x250/34495e/ffffff%3Ftext%3DScreenshot%2BKiosk%2BUI" width="400" alt="UI Kiosk">

<img src="https://www.google.com/search?q=https://placehold.co/400x250/34495e/ffffff%3Ftext%3DScreenshot%2BDisplay%2BTV" width="400" alt="UI Display TV">

Tampilan Operator Loket

Struk Cetak Thermal

<img src="https://www.google.com/search?q=https://placehold.co/400x250/34495e/ffffff%3Ftext%3DScreenshot%2BAdmin%2BOperator" width="400" alt="UI Operator">

<img src="https://www.google.com/search?q=https://placehold.co/400x250/34495e/ffffff%3Ftext%3DContoh%2BStruk%2BAntrian" width="400" alt="UI Struk">

<div align="center">
<p>Dikembangkan dengan ❤️ untuk digitalisasi pelayanan publik.</p>
<p><b>Direktorat Metrologi</b></p>
</div>
