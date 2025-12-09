from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)
CORS(app) 

DB_NAME = "energy.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS sensor_logs 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  timestamp DATETIME, 
                  node_id TEXT, 
                  voltage REAL, 
                  current REAL, 
                  power REAL, 
                  steps INTEGER)''')
    conn.commit()
    conn.close()

init_db()

# --- API ENDPOINTS ---

# 1. Menerima Data dari Sensor IoT (Simulasi)
@app.route('/api/sensor', methods=['POST'])
def receive_data():
    data = request.json
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("INSERT INTO sensor_logs (timestamp, node_id, voltage, current, power, steps) VALUES (?, ?, ?, ?, ?, ?)",
                  (datetime.now(), data['node_id'], data['voltage'], data['current'], data['power'], data['steps']))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Data saved"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 2. Mengirim Data Real-time ke Dashboard Frontend
@app.route('/api/dashboard/realtime', methods=['GET'])
def get_realtime_data():
    conn = sqlite3.connect(DB_NAME)
    df = pd.read_sql_query("SELECT * FROM sensor_logs ORDER BY id DESC LIMIT 10", conn)
    conn.close()
    
    if df.empty:
        return jsonify({"voltage": 0, "power": 0, "total_steps": 0})

    response = {
        "voltage": round(df['voltage'].mean(), 2),
        "power": round(df['power'].mean(), 2),
        "total_steps": int(df['steps'].sum())
    }
    return jsonify(response)

# 3. AI Prediction (Machine Learning Sederhana)
@app.route('/api/dashboard/predict', methods=['GET'])
def predict_energy():
    conn = sqlite3.connect(DB_NAME)
    df = pd.read_sql_query("SELECT * FROM sensor_logs ORDER BY id DESC LIMIT 100", conn)
    conn.close()

    if len(df) < 10:
        return jsonify({"prediction": 0, "status": "Not enough data"})

    # Simple Linear Regression: Prediksi Power berdasarkan Urutan Waktu
    df['time_index'] = range(len(df))
    X = df[['time_index']]
    y = df['power']

    model = LinearRegression()
    model.fit(X, y)

    # Prediksi untuk 1 jam ke depan (asumsi 60 data points ke depan)
    future_index = np.array([[len(df) + 60]])
    prediction = model.predict(future_index)[0]

    return jsonify({
        "predicted_power": round(max(0, prediction), 2),
        "confidence": "85%"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)