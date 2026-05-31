import requests
res = requests.post('http://localhost:8000/auth/register', json={"name":"test", "email":"test@example.com", "password":"password123", "role":"citizen"})
print(res.status_code, res.text)
