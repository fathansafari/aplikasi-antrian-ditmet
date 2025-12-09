<div align="center">
  <img src="https://placehold.co/150x150/2c3e50/ffffff?text=App+Antrian" alt="Logo App Antrian" width="140" height="140">

  <h1 align="center">📌 App-Antrian Metrologi</h1>

  <p align="center">
    <b>Sistem Antrian Terintegrasi untuk Pelayanan Publik</b>
    <br>
    Efisien • Real-Time • Modern
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

---

<details>
  <summary><b>📚 Daftar Isi (Klik untuk membuka)</b></summary>
  <br>
  <ol>
    <li><a href="#-deskripsi-singkat">Deskripsi Singkat</a></li>
    <li><a href="#-struktur-sistem-aplikasi">Struktur Sistem Aplikasi</a></li>
    <li><a href="#-teknologi-yang-digunakan">Teknologi yang Digunakan</a></li>
    <li><a href="#-fitur-utama">Fitur Utama</a></li>
    <li><a href="#-instalasi--penggunaan">Instalasi & Penggunaan</a></li>
    <li><a href="#-galeri-antarmuka">Galeri Antarmuka</a></li>
  </ol>
</details>

---

<a id="deskripsi-singkat"></a>
## 📖 Deskripsi Singkat

**App-Antrian** adalah aplikasi manajemen antrian digital yang dirancang khusus untuk **Direktorat Metrologi**. Sistem ini menggantikan metode antrian manual dengan solusi berbasis teknologi yang menampilkan informasi panggilan secara *real-time* di layar TV dan panel operator.

Tujuan utama sistem ini adalah meningkatkan kualitas pelayanan masyarakat agar lebih **tertib, transparan, dan cepat**.

---

<a id="struktur-sistem-aplikasi"></a>
## 🧩 Struktur Sistem Aplikasi

Sistem ini menggunakan arsitektur *client-server* lokal yang terdiri dari 3 modul utama. Berikut adalah alur kerjanya:

```mermaid
graph TD;
    User((👤 Pengunjung)) -->|Ambil Tiket| KIOSK[🎟️ Kiosk App];
    KIOSK -->|Simpan Data| DB[(🗄️ Database/Server)];
    DB -->|Sync Realtime| ADMIN[🖥️ Admin Operator];
    DB -->|Sync Realtime| DISPLAY[📺 Display TV];
    ADMIN -->|Panggil/Skip| DB;
    DISPLAY -.->|Voice Announcer| User;
