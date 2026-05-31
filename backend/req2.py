import requests
res = requests.post("http://localhost:8000/auth/login", json={"email": "staff1@example.com", "password": "password123"})
if res.status_code == 200:
    token = res.json()["access_token"]
    res2 = requests.get("http://localhost:8000/tasks/mine", headers={"Authorization": f"Bearer {token}"})
    print("Tasks status:", res2.status_code)
    try:
        print(res2.json()[:2])
    except:
        print(res2.text)
else:
    print("Login err", res.text)
