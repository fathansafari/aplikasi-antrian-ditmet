# 📋 Antrian Electron — Panduan Instalasi & Penggunaan

Sistem manajemen antrian digital berbasis jaringan lokal untuk **Direktorat Metrologi**, yang terdiri dari beberapa aplikasi yang saling terhubung secara real-time.

---

## 📦 Download Aplikasi

| Aplikasi | Fungsi | Link |
|----------|--------|------|
| **Installer (Admin + Kiosk)** | Paket lengkap | [⬇️ Download via Google Drive](https://drive.google.com/file/d/1mM4jeM4n0nSdRhgePvTD_CruwI44vVXM/view?usp=drive_link) |

---

## 🧩 Tentang Sistem

Sistem antrian ini merupakan sistem antrian digital berbasis jaringan lokal yang terdiri dari beberapa komponen aplikasi yang saling terhubung. Sistem ini dirancang untuk mempermudah proses pengambilan nomor, pemanggilan nomor oleh operator, serta penyajian informasi antrian secara real-time kepada pengunjung melalui layar display.

Sistem terdiri dari **empat modul utama**:

---

### 1. 🖥️ Kiosk App — Pengambil Nomor Antrian

Aplikasi yang dijalankan pada perangkat Kiosk atau komputer yang berfungsi sebagai mesin antrian tempat pengunjung mengambil nomor. **Kiosk App merupakan pusat utama server** karena di dalamnya terdapat backend server (Node.js) yang menangani seluruh logika data.

Fungsi utama:
- Mencetak atau menampilkan nomor antrian secara otomatis
- Mengirim nomor baru ke server melalui protokol WebSocket
- Menampilkan informasi antrian sederhana pada layar kiosk

---

### 2. 🔧 Admin App — Operator Loket

Aplikasi untuk petugas loket yang bertugas memanggil nomor antrian. Admin App sepenuhnya bertindak sebagai **klien**, terhubung ke server melalui WebSocket atau koneksi manual berdasarkan IP. Tidak memiliki backend sendiri sehingga lebih ringan dan dapat dijalankan di banyak komputer.

Fitur utama:
- Pemanggilan nomor antrian berdasarkan peran/loket (Role A, B, C, dst.)
- Menampilkan daftar antrian, riwayat, dan status panggilan
- Mengelola antrian: **Call**, **Recall**, **Swap**, **Done**
- Notifikasi pemanggilan secara visual
- Menerima update secara real-time dari server kiosk

---

### 3. 📺 Display TV — Layar Informasi Antrian

Aplikasi tampilan khusus yang dipasang pada monitor besar di ruang tunggu. Terhubung dengan server kiosk menggunakan WebSocket dan otomatis menyesuaikan tampilan berdasarkan data antrian terbaru.

Fungsi utama:
- Menampilkan nomor antrian yang sedang dipanggil
- Menampilkan nomor di setiap role/loket
- Memutar playlist video, teks berjalan, dan informasi tambahan
- Menampilkan panggilan baru secara real-time

---

### 4. ⚙️ Backend Server — Node.js + SQLite

Backend berada di dalam perangkat kiosk dan bertanggung jawab mengatur seluruh jalannya sistem.

Fungsi utama:
- Menyimpan data antrian menggunakan database SQLite
- Mengatur logika antrian: new queue, call, recall, skip, done, next
- Mengirimkan update real-time ke Admin App dan Display TV
- Melakukan **UDP Discovery** agar klien bisa menemukan server secara otomatis di jaringan
- Menangani suara panggilan (bell + penyebutan nomor) pada perangkat kiosk

---

## 🖥️ Persyaratan Sistem

- **OS**: Windows 10 / 11 (64-bit)
- **RAM**: Minimal 4 GB
- **Storage**: Minimal 500 MB ruang kosong
- **Jaringan**: LAN (untuk komunikasi antar perangkat)

---

## 🚀 Cara Instalasi

### 1. Download File Installer
Klik link download di atas, lalu simpan file `.exe` ke komputer Anda.

### 2. Jalankan Installer

> ⚠️ Jika muncul peringatan **"Windows protected your PC"**, klik **More info** → **Run anyway**.
> Ini normal untuk aplikasi yang belum memiliki sertifikat resmi.

- Double-click file installer
- Ikuti langkah-langkah di wizard instalasi
- Klik **Install** dan tunggu hingga selesai

### 3. Selesai
Aplikasi siap digunakan. Shortcut akan muncul di Desktop dan Start Menu.

---

## 📖 Cara Menggunakan Admin App

### Langkah 1 — Login

Buka **Admin App**, lalu masukkan username dan password akun operator Anda.

![Login Admin App](screenshots/01-login.png)

> Jika belum memiliki akun, klik **Daftar** untuk membuat akun operator baru.

---

### Langkah 2 — Daftar Akun Baru (jika diperlukan)

Isi form pendaftaran dengan username, password, jenis layanan, dan nomor loket.

![Daftar Akun](screenshots/02-daftar.png)

> Akun yang dibuat melalui halaman ini adalah akun **operator (non-admin)**.

---

### Langkah 3 — Koneksi ke Server Kiosk

Jika Admin App tidak terhubung secara otomatis, klik **"atur koneksi manual"** lalu masukkan IP address perangkat Kiosk.

![Koneksi Manual](screenshots/03-koneksi.png)

> Setelah berhasil terhubung, akan muncul notifikasi **"Berhasil terhubung! Silakan login"**.

---

### Langkah 4 — Beranda & Dashboard

Setelah login, Anda akan melihat ringkasan aktivitas antrian hari ini: total antrian, sudah dilayani, dan sisa antrian.

![Beranda](screenshots/04-beranda.png)

Sidebar kiri menampilkan menu navigasi:
- **(A) Customer Service** — Loket layanan pelanggan
- **(B) Pendaftaran** — Loket pendaftaran
- **(C) Pengambilan Alat** — Loket pengambilan alat
- **Rekap Antrian** — Laporan dan histori antrian
- **Manajemen User** — Pengelolaan akun operator (khusus admin)

---

### Langkah 5 — Memanggil Antrian

Pilih menu layanan sesuai loket Anda (misal: **(A) Customer Service**), lalu gunakan tombol:
- **Panggil** — Memanggil nomor antrian berikutnya
- **Panggil Ulang** — Memanggil kembali nomor yang sama
- **Tukar Antrian** — Menukar urutan antrian

![Customer Service](screenshots/07-cs.png)

> Nomor yang sedang aktif ditampilkan di pojok kanan atas (**Nomor Saat Ini**).

---

### Langkah 6 — Melihat Daftar Antrian per Layanan

Setiap halaman layanan menampilkan daftar antrian yang sedang menunggu, lengkap dengan nomor, status, dan waktu pengambilan.

![Pengambilan Alat](screenshots/05-pengambilan.png)

---

### Langkah 7 — Rekap Antrian & Laporan

Buka menu **Rekap Antrian** untuk melihat histori lengkap antrian. Tersedia tab per layanan (CS, Pendaftaran, Pengambilan) dan fitur:
- **Ekspor Excel** — Unduh data antrian ke file Excel
- **Reset Harian** — Reset data antrian hari ini
- **Reset Keseluruhan** — Reset semua data antrian

![Rekap Antrian](screenshots/06-rekap.png)

---

### Tampilan Display TV

Layar TV di ruang tunggu menampilkan nomor antrian yang sedang dipanggil untuk setiap loket secara real-time, dilengkapi jam, tanggal, dan informasi teks berjalan.

![Display TV](screenshots/08-displaytv.png)

---

## 🌐 Pengaturan Jaringan

Semua aplikasi berkomunikasi melalui **jaringan lokal (LAN)**. Pastikan:

1. Kiosk App dan Admin App berada dalam **jaringan WiFi / LAN yang sama**
2. Firewall tidak memblokir koneksi antar perangkat
3. **Kiosk App dijalankan lebih dahulu** sebelum Admin App dan Display TV terhubung
4. Jika koneksi otomatis gagal, gunakan fitur **Koneksi Manual** dengan memasukkan IP address perangkat Kiosk

---

## ❓ FAQ

**Q: Aplikasi tidak bisa terbuka setelah install?**  
A: Klik kanan pada shortcut → **Run as Administrator**.

**Q: Admin App tidak bisa terhubung ke Kiosk?**  
A: Pastikan kedua perangkat terhubung ke jaringan yang sama, Kiosk App sudah berjalan, lalu coba koneksi manual dengan memasukkan IP Kiosk.

**Q: Muncul error "missing DLL" saat dibuka?**  
A: Install **Microsoft Visual C++ Redistributable** terbaru dari situs resmi Microsoft.

**Q: Apakah bisa digunakan di Mac atau Linux?**  
A: Saat ini hanya mendukung **Windows**.

**Q: Bagaimana cara menambah akun operator baru?**  
A: Login sebagai admin → menu **Manajemen User**, atau akses halaman **Daftar** dari layar login.

---

## 📞 Kontak & Dukungan

Jika mengalami kendala teknis, silakan kirim email ke:  
📧 **muhammadfathansafari@gmail.com**

---

*Versi Aplikasi: 1.2.1 — Direktorat Metrologi, Unit Pelayanan Terpadu Perdagangan IV*
