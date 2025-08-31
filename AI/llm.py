import json
from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def gpt_format_response(query: str, raw_results: list):
    try:
        # Always serialize results for GPT
        raw_json = json.dumps(raw_results, default=str)
    except Exception:
        raw_json = str(raw_results)

    prompt = f"""
        You are a helpful assistant. A user asked:

        "{query}"

        Here are the raw database results:

        {raw_json}

        - If the raw results contain an "error" key, politely explain the error to the user.
        - If there are records, summarize them in a short, clear, and friendly conversational format.
        - Respond naturally, as if speaking to a human.
        Return only the final conversational response.
        """


    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        answer = response.choices[0].message.content.strip()
        return answer
    except Exception as e:
        return f"Failed to generate answer: {str(e)}"
