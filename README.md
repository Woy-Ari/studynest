# StudyNest 📚

> **Satu tempat untuk semua catatanmu.**

StudyNest adalah aplikasi belajar all-in-one yang dirancang khusus untuk pelajar SMA/SMK Indonesia usia 14–18 tahun. Dengan fitur To-Do List, Catatan Digital dengan anotasi canvas, Timer Pomodoro, dan gamifikasi, belajar menjadi lebih menyenangkan dan produktif!

## ✨ Fitur Utama

### 🏠 **Dashboard**
- Sambutan personal dengan tanggal dan streak belajar
- Statistik real-time: Tugas Hari Ini, Streak Belajar, Total Catatan, XP Points
- Tugas-tugas mendesak (deadline terdekat)
- Catatan terbaru dengan preview
- Widget Timer Pomodoro
- Kata-kata motivasi yang berganti-ganti setiap sesi

### ✅ **To-Do List**
- Tambah, edit, dan hapus tugas dengan mudah
- Filter multi-level: Mata Pelajaran, Prioritas, Deadline, Status
- Kanban View: Belum Dikerjakan | Sedang Dikerjakan | Selesai
- Drag & Drop untuk mengubah urutan
- Badge deadline dinamis (Hijau/Kuning/Merah)
- Support subtask dan recurring task
- Animasi checkmark & confetti saat selesai ✨

### 📝 **Catatan Digital**
- **Editor Teks Lengkap**: Bold, Italic, Underline, Strikethrough, Highlight, Font Size, Text Color
- **Canvas Drawing**: Pen, Pencil, Highlighter, Eraser, Shapes (Line, Circle, Rect), Text Tool
- Insert Gambar langsung dari perangkat
- Warna berbeda untuk setiap mata pelajaran
- Pin catatan penting ke bagian atas
- Search dan filter berdasarkan mata pelajaran
- Export catatan ke PDF
- Duplikat catatan untuk reuse

### ⏱️ **Timer Pomodoro**
- Sesi kerja 25 menit (customizable)
- Istirahat pendek 5 menit
- Istirahat panjang 15 menit setiap 4 sesi
- Notifikasi otomatis saat selesai
- Tracking jumlah sesi yang diselesaikan
- XP rewards untuk setiap sesi

### 👤 **Profil & Gamifikasi**
- **XP System**: Dapatkan poin untuk setiap aktivitas
  - Task Selesai: +10 XP
  - Catatan Baru: +15 XP
  - Login Harian: +20 XP
  - Sesi Pomodoro: +25 XP
- **Badge/Pencapaian**: Kumpulkan badge eksklusif
  - 🌱 Langkah Pertama (selesaikan task pertama)
  - 📚 Sang Pencatat (buat 10 catatan)
  - 🔥 Seminggu Penuh (7 hari belajar berturut-turut)
  - 👑 Juara Sejati (30 hari streak)
  - ⏱️ Fokus Master (10 sesi pomodoro)
- **Streak Belajar**: Track konsistensi belajar harian
- Statistik lengkap: Total task, catatan, XP, badges

### 🌙 **Dark Mode**
- Toggle dark/light mode dengan satu klik
- Hemat mata saat belajar malam hari
- Preferensi tersimpan otomatis

## 🎨 **Desain & UX**

### Palet Warna
| Nama | Hex | Penggunaan |
|------|-----|-----------|
| Primary | `#7C3AED` | Ungu utama brand |
| Secondary | `#F472B6` | Pink aksen |
| Accent | `#06B6D4` | Cyan fokus |
| Success | `#10B981` | Hijau sukses |
| Warning | `#F59E0B` | Kuning warning |
| Danger | `#EF4444` | Merah danger |

### Font
- **Heading**: Poppins (bold, modern)
- **Body**: Nunito (rounded, ramah)
- **Code/Formula**: JetBrains Mono (technical)

### Prinsip Desain
- ✨ Gradient lembut untuk visual menarik
- 🎯 Micro-interactions pada setiap tombol
- 📐 Rounded corners konsisten (16px cards, 8px buttons)
- 🎨 Badge warna-warni untuk setiap mata pelajaran
- 🪟 Glassmorphism ringan pada sidebar & modal

## 📱 **Responsif & Accessibility**

### Breakpoints
- **Desktop** (>1024px): Sidebar permanen, grid 3 kolom
- **Tablet** (768px-1024px): Sidebar collapsible, grid 2 kolom
- **Mobile** (<768px): Bottom navigation, grid 1 kolom

### Accessibility
- Semantic HTML5
- ARIA labels & descriptions
- Keyboard navigation support
- Color contrast compliant (WCAG AA)
- Touch-friendly untuk mobile/tablet

## 🛠️ **Tech Stack**

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: LocalStorage (offline-first, no backend needed)
- **Canvas API**: HTML5 Canvas untuk drawing
- **PWA Ready**: Service Worker & Web Manifest

## 📂 **Struktur Folder**

```
studynest/
├── index.html                   # Login & Register page
├── dashboard.html               # Dashboard utama
├── todo.html                    # To-Do List page
├── notes.html                   # Daftar catatan
├── note-editor.html             # Editor catatan dengan canvas
├── profile.html                 # Profil & pengaturan user
│
├── css/
│   ├── global.css              # Variabel CSS, font, reset, dark mode
│   ├── auth.css                # Login & Register styling
│   ├── dashboard.css           # Dashboard layout & components
│   ├── todo.css                # To-Do List styling
│   ├── notes.css               # Notes grid & card styling
│   ├── editor.css              # Editor & canvas toolbar
│   ├── sidebar.css             # Sidebar navigation
│   └── components.css          # Reusable components (buttons, cards, modals)
│
├── js/
│   ├── auth.js                 # Authentication logic (login, register, logout)
│   ├── storage.js              # LocalStorage wrapper & data management
│   ├── dashboard.js            # Dashboard data & UI logic
│   ├── todo.js                 # To-Do CRUD & filtering
│   ├── notes.js                # Notes CRUD & search
│   ├── editor.js               # Text editor logic & toolbar handlers
│   ├── canvas.js               # Canvas drawing logic & tools
│   ├── pomodoro.js             # Timer logic & notifications
│   ├── quotes.js               # Motivational quotes database
│   └── theme.js                # Dark mode toggle & persistence
│
├── assets/
│   ├── icons/                  # SVG icons
│   └── images/                 # Illustrations & backgrounds
│
├── PROJECT_BRIEF.md            # Spesifikasi lengkap project
├── README.md                   # This file
└── .gitignore                  # Git ignore rules
```

## 🚀 **Cara Menggunakan**

### Quick Start
1. Clone repository:
   ```bash
   git clone https://github.com/Woy-Ari/studynest.git
   cd studynest
   ```

2. Buka di browser:
   ```
   Buka file index.html langsung di browser
   atau gunakan live server extension di VS Code
   ```

3. Daftar akun baru atau login dengan akun demo
4. Mulai tambah tugas & catatan
5. Gunakan timer Pomodoro untuk fokus belajar

### Keyboard Shortcuts
- `Ctrl+N` - Catatan baru
- `Ctrl+S` - Simpan catatan
- `Ctrl+Z` - Undo (di canvas)
- `Ctrl+Y` - Redo (di canvas)
- `Ctrl+P` - Print/Export catatan

## 📊 **Sistem Gamifikasi**

```javascript
// XP Rewards
- Selesaikan 1 task       → +10 XP
- Buat catatan baru       → +15 XP
- Login setiap hari       → +20 XP
- Selesaikan pomodoro     → +25 XP
- 7 hari streak           → +100 XP
- 30 hari streak          → +500 XP
```

## 🎁 **Fitur Bonus**

- ⌨️ Keyboard shortcuts lengkap
- 🔍 Search global (cari di to-do & catatan sekaligus)
- 🎨 Multiple canvas templates (grid, ruled, blank)
- 📥 Import gambar ke canvas
- 📤 Export catatan ke PDF
- 🧅 Onboarding tutorial untuk pengguna baru
- 🎉 Confetti animation saat selesai semua task hari ini
- 💾 Auto-save catatan setiap 30 detik
- 📱 Progressive Web App (bisa diinstall di HP)
- 🌙 Full dark mode support

## 📝 **Data Storage**

Data disimpan di browser menggunakan **LocalStorage**:
- User profile & settings
- To-do lists & status
- Catatan & canvas drawings (base64)
- Preferences (theme, language)

**Keuntungan:**
- ✅ Offline-first (tidak perlu internet)
- ✅ Privasi terjamin (data tetap di device)
- ✅ Tidak perlu backend/database

**Catatan:**
- Data hanya tersimpan di device yang sama
- Jangan clear browser cache/history (data bisa hilang)
- Backup data dengan export PDF jika penting

## 🐛 **Troubleshooting**

### Lupa Password?
Gunakan fitur "Lupa Password?" di halaman login. (Akan mengirim ke email terdaftar pada versi production)

### Data Hilang?
Jika data hilang, kemungkinan browser cache sudah di-clear. Buat akun baru atau restore dari backup.

### Canvas Tidak Bisa Dipakai di Mobile?
Pastikan menggunakan browser terbaru. Canvas sudah dioptimasi untuk touch device.

## 🤝 **Kontribusi**

Project ini dibuat untuk pembelajaran dan portofolio. Bebas di-fork dan dikembangkan lebih lanjut!

### Saran Pengembangan:
- Backend integration (Node.js, Express)
- Cloud storage (Firebase, MongoDB)
- Collaborative notes (real-time sync)
- Mobile app dengan React Native
- AI-powered study suggestions

## 📄 **Lisensi**

MIT License - Bebas digunakan untuk keperluan pribadi & komersial

## 👨‍💻 **Author**

Created with ❤️ by **Woy-Ari** for Indonesian students (SMA/SMK)

---

**Version:** 1.0.0 | **Last Updated:** 2025  
**Status:** ✅ Production Ready | **Support:** Issues & PRs welcome
