from auth import classify_role, check_employee_query
from db import get_user, classify_query, run_query
from llm import gpt_format_response
from bson import ObjectId
from datetime import datetime
from logger import logger

def serialize_doc(doc):
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]

    if not isinstance(doc, dict):
        return doc

    serialized = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            serialized[k] = str(v)
        elif isinstance(v, datetime):
            serialized[k] = v.isoformat()
        elif isinstance(v, list):
            serialized[k] = [serialize_doc(i) for i in v]
        elif isinstance(v, dict):
            serialized[k] = serialize_doc(v)
        else:
            serialized[k] = v
    logger.info(f"Serialized document: {serialized}")
    return serialized

def process_query(user_id, query: str):
    user_doc = get_user(user_id)
    if not user_doc:
        return "User not found."

    role = classify_role(user_doc)
    logger.info(f"Processing query for user {user_id} with role {role}")

    if role == "employee":
        allowed, message = check_employee_query(user_doc, query)
        logger.info(f"Employee query check: allowed={allowed}, message={message}")
        if not allowed:
            results = "unauthorised infromation requested"
            return gpt_format_response(query, results)

        filter_query = {"assigneeId": user_doc["_id"]}
        results = run_query("tasks", filter_query)
        results = serialize_doc(results)
        return gpt_format_response(query, results)

    collection_name, filter_query = classify_query(query)
    if not collection_name:
        return gpt_format_response(query, [{"error": "Could not classify query."}])

    results = run_query(collection_name, filter_query)
    results = serialize_doc(results)
    logger.info(f"Query results: {results}")
    return gpt_format_response(query, results)


