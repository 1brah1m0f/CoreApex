import io
from PIL import Image
import numpy as np

# TensorFlow loglarını təmizləmək üçün (İstəyə bağlı)
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions # type: ignore

# Modeli qlobal olaraq yükləyirik ki, hər request-də yenidən yüklənməsin (Optimizasiya)
model = MobileNetV2(weights='imagenet')

def classify_and_route_image(image_bytes: bytes) -> dict:
    """
    MobileNetV2 ilə şəkli analiz edir, aidiyyəti qurumu və prioritet/SLA müddətini təyin edir.
    """
    
    # 1. Şəkli hazırlama (Pre-processing)
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # MobileNetV2 üçün 224x224 ölçüsü mütləqdir
    img = img.resize((224, 224))
    
    x = np.array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    
    # 2. Model Predict (Proqnozlaşdırma)
    preds = model.predict(x)
    decoded_preds = decode_predictions(preds, top=3)[0] # İlk 3 nəticə
    
    # Ən yüksək ehtimalı olan nəticə (Top 1)
    best_match_id, raw_label, confidence = decoded_preds[0]
    raw_label = raw_label.lower()
    
    # 3. Biznes Məntiqi və Azərbaycan Dövlət Qurumlarına Mapping
    category = "other"
    assigned_agency = "Təyin edilməyib"
    priority = "low"
    deadline_hours = 72
    
    if any(keyword in raw_label for keyword in ['pothole', 'street', 'road']):
        category = "road"
        assigned_agency = "AAYDA"
        priority = "high"
        deadline_hours = 48
        
    elif any(keyword in raw_label for keyword in ['trash', 'bin', 'garbage', 'dump']):
        category = "waste"
        assigned_agency = "MKTB"
        priority = "high"
        deadline_hours = 12
        
    elif any(keyword in raw_label for keyword in ['tree', 'plant', 'flower', 'pot']):
        category = "other"
        assigned_agency = "Yaşıllaşdırma"
        priority = "medium"
        deadline_hours = 48
        
    elif any(keyword in raw_label for keyword in ['water', 'pipe', 'fountain', 'shower']):
        category = "water"
        assigned_agency = "Azərsu"
        priority = "high"
        deadline_hours = 24
        
    return {
        "category": category,
        "assigned_agency": assigned_agency,
        "priority": priority,
        "deadline_hours": deadline_hours,
        "confidence": float(confidence),
        "ai_raw_label": raw_label
    }
