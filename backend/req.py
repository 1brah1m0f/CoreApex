import requests
res = requests.get('http://localhost:8000/reports/?status=pending')
print("Status:", res.status_code)
print("Data:", res.text[:200])
