// preload.js (untuk Aplikasi Admin)

const { contextBridge, ipcRenderer } = require('electron');

// Mengekspos fungsi yang aman dari Main Process ke Renderer Process (admin.js)
contextBridge.exposeInMainWorld('electronAPI', {
  
  // Fungsi lama yang sudah ada (untuk membuka display TV)
  openDisplay: () => ipcRenderer.send('open-display'),

  // === PENAMBAHAN BARU UNTUK DETEKSI OTOMATIS ===
  // Fungsi ini akan tersedia di window.electronAPI.findServer() di dalam admin.js.
  // Saat dipanggil, ia akan memicu handler 'find-server' yang ada di main.js.
  findServer: () => ipcRenderer.invoke('find-server')
  // === AKHIR PENAMBAHAN ===

});