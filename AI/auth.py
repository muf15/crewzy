from openai import OpenAI
from logger import logger
from llm import gpt_format_response
import json, re,os
from dotenv import load_dotenv
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def classify_role(user_doc):
    role = user_doc.get("role", "").lower()
    logger.info(f"User role: {role}")
    return "admin" if role in ["hr", "admin"] else "employee"

def check_employee_query(user_doc, query: str):
 
    user_id = str(user_doc.get("_id", ""))
    user_name = user_doc.get("name", "").lower()
    
    # Construct a small GPT prompt
    prompt = f"""
        You are an authorization assistant.
        A user with ID '{user_id}' and name '{user_name}' (role: employee) wants to ask the following query:

        "{query}"

        Rules:
        1. Employees can only ask about themselves .
        2. If the query is about anyone else, it is NOT allowed.

        Reply STRICTLY in JSON format:
        {{
            "allowed": true or false,
            "message": "If not allowed, explain why. Null if allowed."
        }}
        """

    try:
        response_text = gpt_format_response("Authorization check", [{"prompt": prompt}])
        
        
        json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
        if not json_match:
            logger.warning("GPT did not return valid JSON for employee query check.")
            return False, "Authorization check failed."

        result = json.loads(json_match.group())
        allowed = result.get("allowed", False)
        message = result.get("message")
        logger.info(f"Employee query check (via GPT): allowed={allowed}, message={message}")
        return allowed, message
    except Exception as e:
        logger.error(f"Error in GPT-based employee check: {e}")
        return False, "Authorization check failed."
