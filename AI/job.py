import requests
import os
import json
import numpy as np
from dotenv import load_dotenv
from openai import OpenAI
from pymongo import MongoClient

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_embedding(text: str):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return np.array(response.data[0].embedding)

def normalize_sub_role(gpt_sub_role: str, employees_collection):
    db_roles = list(employees_collection.distinct("subRole"))
    if not db_roles:
        return gpt_sub_role  # fallback if DB empty

    gpt_vec = get_embedding(gpt_sub_role)

    best_role, best_score = None, -1
    for role in db_roles:
        role_vec = get_embedding(role)
        sim = np.dot(gpt_vec, role_vec) / (np.linalg.norm(gpt_vec) * np.linalg.norm(role_vec))
        if sim > best_score:
            best_role, best_score = role, sim

    print(f"Normalized sub_role: '{gpt_sub_role}' → '{best_role}' (score={best_score:.2f})")
    return best_role or gpt_sub_role

def classify_task(task_description, employees_collection):
    prompt = f"""
        Classify the following task into a sub-role and list required skills.
        Return ONLY JSON in the following format:
        {{
            "subRole": "technician",
            "skills": ["AC repair", "cooling systems"]
        }}
        Task: "{task_description}"
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    
    output_text = response.choices[0].message.content.strip()
    print("GPT raw output:", output_text)

    if output_text.startswith("```") and output_text.endswith("```"):
        output_text = "\n".join(output_text.split("\n")[1:-1]).strip()

    try:
        task_data = json.loads(output_text)
    except json.JSONDecodeError:
        print("Error parsing GPT response. Defaulting to generic role.")
        task_data = {"subRole": "technician", "skills": []}
    
    task_data["subRole"] = normalize_sub_role(task_data["subRole"], employees_collection)
    return task_data

mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["crewzy"]
employees_collection = db['users']

def get_matching_employees(subRole, skills):
    query = {
        "$or": [
            {"subRole": subRole},
            {"skills": {"$in": skills}}
        ]
    }
    return list(employees_collection.find(query))

MAPPLS_CLIENT_ID = os.getenv("MAPPLS_CLIENT_ID")
MAPPLS_CLIENT_SECRET = os.getenv("MAPPLS_CLIENT_SECRET")
TOKEN_URL = "https://outpost.mappls.com/api/security/oauth/token"
# ❌ Old URL: ROUTE_URL = "https://atlas.mappls.com/api/routing/route/matrix/v1/json"
# ✅ Updated URL based on Mappls documentation for Distance Matrix API
ROUTE_URL = "https://apis.mappls.com/advancedmaps/v1/distance_matrix/driving"

def get_mappls_token():
    payload = {
        'grant_type': 'client_credentials',
        'client_id': MAPPLS_CLIENT_ID,
        'client_secret': MAPPLS_CLIENT_SECRET
    }
    response = requests.post(TOKEN_URL, data=payload)
    response.raise_for_status()
    return response.json().get("access_token")

def get_driving_distance(origin_eloc, destination_eloc, token):
    headers = {"Authorization": f"bearer {token}"}
    payload = {
        "start_ll": origin_eloc,
        "dest_ll": destination_eloc,
        "mode": "driving" 
    }
    # Note: Using POST method for security with API key in headers
    response = requests.get(ROUTE_URL, params=payload, headers=headers)
    response.raise_for_status()
    data = response.json()
    distance_m = data["results"]["distances"][0][0]
    return distance_m / 1000  # km

def find_nearest_employee_mappls(customer_eloc, employees, token):
    if not employees:
        print("No matching employees found.")
        return None

    nearest = None
    min_distance = float('inf')
    
    for emp in employees:
        if "eLoc" not in emp:  # ✅ check correct field
            continue
        distance = get_driving_distance(customer_eloc, emp['eLoc'], token)  # ✅ use correct field
        if distance < min_distance:
            min_distance = distance
            nearest = emp
    
    return nearest


customer_task = {
    "name": "Alice",
    "number": "9999999999",
    "eLoc": "DKM001",  
    "task": "I need medical assistance"
}

task_info={}
task_info['subRole'] = "Nurse"
task_info['skills'] = ["Patient Care", "First Aid", "Medical Equipment Handling"]

matched_employees = get_matching_employees(task_info['subRole'], task_info['skills'])
print(f"Found {len(matched_employees)} matching employees.")

mappls_token = get_mappls_token()

assigned_employee = find_nearest_employee_mappls(
    customer_task['eLoc'], matched_employees, mappls_token
)

print("Assigned Employee (Mappls driving distance):", assigned_employee)