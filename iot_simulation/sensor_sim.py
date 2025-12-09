import requests
import time
import random
import json

# Konfigurasi Target Server
SERVER_URL = "http://localhost:5000/api/sensor"
NODE_ID = "HLT-BNHI-01" 

def generate_dummy_data():
    is_stepped = random.choice([True, False, False]) 
    
    if is_stepped:
        voltage = random.uniform(12.0, 14.5)
        current = random.uniform(0.5, 1.2)   
        steps = random.randint(1, 3)        
    else:
        voltage = random.uniform(0.1, 0.5) 
        current = 0.0
        steps = 0

    power = voltage * current 
    
    return {
        "node_id": NODE_ID,
        "voltage": round(voltage, 2),
        "current": round(current, 2),
        "power": round(power, 2),
        "steps": steps
    }

print(f"🚀 Memulai Simulasi Sensor IoT Node: {NODE_ID}")
print(f"📡 Mengirim data ke: {SERVER_URL}")
print("Tekan Ctrl+C untuk berhenti.\n")

try:
    while True:
        data = generate_dummy_data()
        try:
            response = requests.post(SERVER_URL, json=data)
            if response.status_code == 201:
                print(f"✅ Data Terkirim: {data['power']} Watt | {data['steps']} Steps")
            else:
                print(f"⚠️ Gagal: {response.status_code}")
        except Exception as e:
            print(f"❌ Error Koneksi: Pastikan Server Flask nyala! ({e})")
        
        time.sleep(2) 

except KeyboardInterrupt:
    print("\n🛑 Simulasi Dihentikan.")