import io
import os
import base64
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

def get_groq_client():
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY yüklənməyib .env faylından!")
    return Groq(api_key=api_key)

def groq_image_to_base64(image_bytes: bytes) -> str:
    """Byte datasını base64 stringinə çevirir."""
    return base64.b64encode(image_bytes).decode('utf-8')

def classify_and_route_image_llama(image_bytes: bytes) -> dict:
    """
    Groq (Llama-4-scout) vasitəsilə şəkli analiz edir, uyğun kateqoriya tapır və təsvir generasiya edir.
    api.txt kateqoriya tələbinə əsasən çıxış:
    "Yollar" | "Su kəməri" | "Elektrik" | "Abadlıq" | "Zibil" | "Digər"
    """
    try:
        client = get_groq_client()
        base64_img = groq_image_to_base64(image_bytes)
        
        # Qeyd: hazırda Llama-4-scout multimodal (şəkil oxuyan) modelini simulyasiya edəcəyik
        # Groq-un hazırki Llama-3-vision və ya digər vision modeli varsa onu istifadə etmək lazımdır.
        # Bu nümunə sizin istədiyiniz model logikasını əks etdirir.
        
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
              {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "Sən Azərbaycan bələdiyyəsi üçün şəkil analiz edən süni intellektsən. "
                            "Bu şəklə bax və aşağıdakıları qaytar:\n"
                            "1. 'category': ('Yollar', 'Su kəməri', 'Elektrik', 'Abadlıq', 'Zibil', 'Digər') siyahısından YALNIZ BİRİ\n"
                            "2. 'title': Problemin qısa başlığı (maksimum 6-8 söz, Azərbaycan dilində)\n"
                            "3. 'description': Şəkildə görünən problemin 2-3 cümləlik ətraflı Azərbaycan dilində təsviri.\n\n"
                            "Nümunə çıxış formatı (başqa heç nə yazma):\n"
                            "{\"category\": \"Yollar\", \"title\": \"Yolda dərin çuxur əmələ gəlib\", \"description\": \"Küçədə böyük bir çuxur mövcuddur. Avtomobillərin hərəkəti üçün təhlükə yaradır. Təcili təmir tələb olunur.\"}"
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_img}"
                        }
                    }
                ]
              }
            ],
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=False # API cavabı birdəfəlik bütöv JSON gəlməlidir
        )
        
        result_text = completion.choices[0].message.content
        
        import json
        try:
            # JSON response-i parse etmək (Əgər model artıq söz yazıbsa JSON çıxartmaq)
            # Sətir və boşluqları təmizləyirik
            start = result_text.find('{')
            end = result_text.rfind('}') + 1
            if start != -1 and end != 0:
                json_part = result_text[start:end]
                data = json.loads(json_part)
                
                # API.txt Tələblərinə uyğun qurum təyini
                category = data.get("category", "Digər")
                
                assigned_agency = "Təyin edilməyib"
                if category == "Yollar": assigned_agency = "AAYDA"
                elif category == "Zibil": assigned_agency = "MKTB"
                elif category == "Abadlıq": assigned_agency = "Yaşıllaşdırma Təsərrüfatı"
                elif category == "Su kəməri": assigned_agency = "Azərsu"
                elif category == "Elektrik": assigned_agency = "Azərişıq"
                
                return {
                    "category": category,
                    "title": data.get("title", ""),
                    "description": data.get("description", ""),
                    "assigned_agency": assigned_agency,
                    "confidence": 0.95
                }
        except json.JSONDecodeError:
             pass
        
        # Əgər parse olmazsa default
        return {
            "category": None,
            "description": None,
            "assigned_agency": None,
            "confidence": None
        }

    except Exception as e:
        print(f"Groq API səhvi: {e}")
        return {
             "category": None,
             "description": None,
             "assigned_agency": None,
             "confidence": None
        }