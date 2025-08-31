import os
import json
import math
import numpy as np
from dotenv import load_dotenv
from openai import OpenAI
from pymongo import MongoClient

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["crewzy"]
employees_collection = db['users']

def get_embedding(text: str) -> np.ndarray:

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return np.array(response.data[0].embedding)


def normalize_sub_role(gpt_sub_role: str, employees_collection) -> str:

    db_roles = list(employees_collection.distinct("subRole"))
    if not db_roles:
        return gpt_sub_role

    gpt_vec = get_embedding(gpt_sub_role)
    best_role, best_score = None, -1

    for role in db_roles:
        role_vec = get_embedding(role)
        sim = np.dot(gpt_vec, role_vec) / (np.linalg.norm(gpt_vec) * np.linalg.norm(role_vec))
        if sim > best_score:
            best_role, best_score = role, sim

    return best_role or gpt_sub_role

def classify_task(task_description):
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
    if output_text.startswith("```") and output_text.endswith("```"):
        output_text = "\n".join(output_text.split("\n")[1:-1]).strip()

    try:
        task_data = json.loads(output_text)
    except json.JSONDecodeError:
        print("Error parsing GPT response. Defaulting to generic role.")
        task_data = {"subRole": "technician", "skills": []}

    # Use the global collection
    task_data["subRole"] = normalize_sub_role(task_data["subRole"], employees_collection)
    return task_data


def get_matching_employees(subRole: str, skills: list) -> list:

    query = {
        "$or": [
            {"subRole": {"$regex": f"^{subRole}$", "$options": "i"}},
            {"skills": {"$in": [s.lower() for s in skills]}}
        ]
    }
    return list(employees_collection.find(query))

def haversine_distance(coord1: list, coord2: list) -> float:
    """
    coord = [lng, lat]
    Returns distance in kilometers between two coordinates.
    """
    lon1, lat1 = coord1
    lon2, lat2 = coord2
    R = 6371

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def find_nearest_employee(customer_coords: list, employees: list) -> dict:
    """
    Return employee closest to customer_coords using Haversine distance.
    """
    if not employees:
        return None

    nearest = None
    min_distance = float('inf')
    for emp in employees:
        if "coordinates" not in emp or not emp["coordinates"]:
            continue
        distance = haversine_distance(customer_coords, emp["coordinates"])
        if distance < min_distance:
            min_distance = distance
            nearest = emp

    return nearest
