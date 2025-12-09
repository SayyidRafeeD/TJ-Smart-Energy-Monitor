import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Activity, Zap, Footprints, Server, BatteryCharging, BrainCircuit } from 'lucide-react';

// --- REGISTER CHART COMPONENTS ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- KOMPONEN KARTU STATISTIK ---
const StatCard = ({ title, value, unit, icon: Icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition hover:shadow-md">
    <div className={`p-3 rounded-full ${color} text-white shadow-lg`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">
        {value} <span className="text-sm font-normal text-gray-400">{unit}</span>
      </h3>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  </div>
);

function App() {
  const [realtimeData, setRealtimeData] = useState({ voltage: 0, power: 0, total_steps: 0 });
  const [prediction, setPrediction] = useState({ predicted_power: 0, confidence: "0%" });
  const [isServerOnline, setIsServerOnline] = useState(false);
  
  // State untuk Data Grafik
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Real-time Power (Watt)',
        data: [],
        borderColor: 'rgb(240, 90, 34)', // Warna Orange TJ
        backgroundColor: 'rgba(240, 90, 34, 0.2)',
        tension: 0.4, // Garis melengkung halus
        fill: true,
      },
    ],
  });

  // --- FUNGSI FETCH DATA ---
  const fetchData = async () => {
    try {
      // 1. Ambil Data Realtime
      const resRealtime = await axios.get('http://localhost:5000/api/dashboard/realtime');
      setRealtimeData(resRealtime.data);
      setIsServerOnline(true);

      // 2. Update Grafik
      const now = new Date().toLocaleTimeString();
      setChartData(prev => {
        const newLabels = [...prev.labels, now].slice(-20); // Simpan 20 data terakhir
        const newData = [...prev.datasets[0].data, resRealtime.data.power].slice(-20);
        return {
          ...prev,
          labels: newLabels,
          datasets: [{ ...prev.datasets[0], data: newData }]
        };
      });

      // 3. Ambil Prediksi AI (Setiap cycle atau bisa dijarangkan)
      const resPredict = await axios.get('http://localhost:5000/api/dashboard/predict');
      setPrediction(resPredict.data);

    } catch (error) {
      console.error("Connection Error:", error);
      setIsServerOnline(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 2000); // Update tiap 2 detik
    return () => clearInterval(interval);
  }, []);

  // --- OPSI GRAFIK ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    },
    animation: { duration: 0 } // Matikan animasi biar gak "jiggle" tiap update
  };

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gray-50 font-sans">
      
      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            <span className="text-tjBlue">TransJakarta</span> Smart Energy Monitor
          </h1>
          <p className="text-gray-500 mt-1 flex items-center">
            <Activity size={16} className="mr-2 text-tjOrange"/> 
            Node ID: HLT-BNHI-01 (Bendungan Hilir)
          </p>
        </div>
        
        <div className={`mt-4 md:mt-0 px-5 py-2 rounded-full text-sm font-bold flex items-center shadow-inner ${isServerOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <Server size={18} className="mr-2" />
          {isServerOnline ? "SYSTEM ONLINE" : "DISCONNECTED"}
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* KOLOM KIRI: STATISTIK */}
        <div className="lg:col-span-1 space-y-6">
          <StatCard 
            title="Voltage Output" 
            value={realtimeData.voltage} 
            unit="V" 
            icon={Zap} 
            color="bg-yellow-500" 
          />
          <StatCard 
            title="Current Power" 
            value={realtimeData.power} 
            unit="W" 
            icon={BatteryCharging} 
            color="bg-tjOrange" // Custom color dari config
          />
          <StatCard 
            title="Total Footsteps" 
            value={realtimeData.total_steps} 
            unit="Steps" 
            icon={Footprints} 
            color="bg-blue-500" 
            subtext="Cumulative count today"
          />
          
          {/* KARTU AI PREDICTION */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center"><BrainCircuit className="mr-2"/> AI Forecast</h3>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">1 Hour Ahead</span>
            </div>
            <div className="text-center py-2">
              <p className="text-sm text-indigo-200">Predicted Energy Output</p>
              <h2 className="text-4xl font-bold mt-2">{prediction.predicted_power} <span className="text-lg font-normal">W</span></h2>
              <p className="text-xs mt-3 text-indigo-200">Confidence Level: {prediction.confidence}</p>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: GRAFIK BESAR */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 text-lg">Real-time Energy Generation Trend</h3>
              <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 text-gray-500">
                <option>Last 1 Hour</option>
                <option>Last 24 Hours</option>
              </select>
            </div>
            <div className="flex-grow relative">
              <Line options={chartOptions} data={chartData} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;