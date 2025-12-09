# TransJakarta Smart Energy Monitor (TJ-SEM) ⚡🚌

TJ-SEM adalah sistem dashboard cerdas berbasis Web 2.0 yang dirancang untuk memonitoring dan memprediksi output energi dari **Piezoelectric Flooring** di halte TransJakarta secara real-time. Proyek ini merupakan implementasi konsep *Self-Powered Smart Infrastructure* untuk mendukung visi **Jakarta Smart City 4.0** dan target **Net Zero Emission**.

---

## 🚀 Fitur Utama

* **Real-time Monitoring** – Memantau tegangan (Voltage), arus (Ampere), dan daya (Watt) dari setiap node lantai piezoelectric.
* **Footfall Analytics** – Mengestimasi jumlah penumpang berdasarkan frekuensi injakan/steps.
* **AI Power Forecasting** – Prediksi energi 1 jam ke depan menggunakan *Linear Regression*.
* **Health Check System** – Deteksi otomatis node/ubin yang mengalami anomali (Zero Output).

---

## 🛠️ Tech Stack – 5 Pilar Teknologi

Proyek ini mengintegrasikan lima teknologi kunci sesuai standar Industri 4.0.

### 1. IoT (Internet of Things)

Simulasi sensor node yang mengirim data telemetri (Volt, Ampere, Steps) via HTTP REST API.

### 2. Web 2.0

Dashboard interaktif menggunakan **React.js** dan **Tailwind CSS**.

### 3. Cloud Computing

Backend API Server menggunakan **Flask** sebagai Private Cloud/Edge Server.

### 4. Big Data

Penyimpanan log data historis sensor menggunakan **SQLite**.

### 5. AI / Machine Learning

Prediksi energi berbasis *Linear Regression* menggunakan **Scikit-Learn**.

---

## 📂 Struktur Proyek

```
/TJ-Smart-Energy-Monitor
│
├── /backend                # Otak Sistem (Server Flask & AI)
│   ├── app.py              # Main application file (API & Logic)
│   ├── database.py         # Config Database
│   └── requirements.txt    # Library Python
│
├── /frontend               # Wajah Sistem (React Dashboard)
│   ├── /src
│   │   ├── components      # Komponen UI
│   │   └── App.js          # Logic Tampilan Utama
│   ├── package.json        # Config React
│   └── tailwind.config.js  # Config CSS
│
├── /iot_simulation         # Sensor Palsu (Python Script)
│   └── sensor_sim.py       # Script pengirim data dummy
│
└── README.md               # Dokumentasi Proyek
```

---

## ⚙️ Cara Menjalankan (Localhost)

### **Prasyarat**

* Python 3.8+
* Node.js & NPM

### **1. Jalankan Backend (Server)**

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Server berjalan di: **[http://localhost:5000](http://localhost:5000)**

### **2. Jalankan Frontend (Dashboard)**

```bash
cd frontend
npm install
npm start
```

Dashboard otomatis terbuka di: **[http://localhost:3000](http://localhost:3000)**

### **3. Aktifkan Sensor IoT (Simulasi)**

```bash
cd iot_simulation
pip install requests
python sensor_sim.py
```

Sensor akan mengirim data dummy setiap 2 detik dan dashboard mulai menampilkan grafik.

---

*Diajukan untuk Tugas Akhir Mata Kuliah Transformasi Digital – Semester Ganjil 20XX*
