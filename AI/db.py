import os
import json
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from logger import logger

load_dotenv()

# OpenAI Client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# MongoDB Client
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db_name = os.getenv("DB_NAME")
mongo_db = mongo_client[db_name]

# Supported collections
collections = {
    "users": mongo_db["users"],
    "tasks": mongo_db["tasks"],
    "companies": mongo_db["companies"],
    "attendances": mongo_db["attendances"]
}

def serialize_doc(doc):
    """Convert ObjectId and datetime to strings for JSON serialization"""
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            doc[k] = str(v)
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
        if isinstance(v, list):
            doc[k] = [str(i) if isinstance(i, ObjectId) else i for i in v]
    return doc

def get_user(user_id):
    try:
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        logger.info(f"Fetching user with ID: {user_id}")
        user_doc = collections["users"].find_one({"_id": user_id})
        return serialize_doc(user_doc) if user_doc else None
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        return None

def query_mongo(collection_name: str, filter_query: dict):
    if collection_name not in collections:
        logger.error(f"Collection '{collection_name}' not found.")
        return {"error": f"Collection '{collection_name}' not found."}

    # Convert _id in filter to ObjectId if needed
    for key, value in filter_query.items():
        if key.endswith("_id") and isinstance(value, str):
            try:
                filter_query[key] = ObjectId(value)
            except Exception:
                pass

    logger.info(f"Querying collection: {collection_name} with filter: {filter_query}")
    results = list(collections[collection_name].find(filter_query))
    return [serialize_doc(r) for r in results]

def classify_query(query: str):
    """Use GPT to classify a natural language query into a collection and Mongo filter"""
    prompt = f"""
        You are a MongoDB query assistant. You have the following collections:
        1. users
        2. tasks
        3. companies
        4. attendances

        Classify this user query into a collection and filter.
        Return STRICT JSON only:
        {{
            "collection": "<collection_name>",
            "filter": <filter_dict>
        }}
        Query: "{query}"
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        result_text = response.choices[0].message.content.strip()
        result_json = json.loads(result_text)
        logger.info(f"Classified query to collection: {result_json.get('collection')} with filter: {result_json.get('filter', {})}")
        return result_json.get("collection"), result_json.get("filter", {})
    except Exception as e:
        logger.error(f"Error classifying query: {e}")
        return None, {}

def run_query(collection_name, filter_query=None):
    if not collection_name:
        logger.error("No collection specified for query.")
        return {"error": "No collection specified."}
    if filter_query is None:
        filter_query = {}
    logger.info(f"Running query on collection: {collection_name} with filter: {filter_query}")
    return query_mongo(collection_name, filter_query)
