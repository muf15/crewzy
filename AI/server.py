from flask import Flask, request, jsonify
from flask_cors import CORS
from bson import ObjectId
from datetime import datetime
from chatbot import process_query
from task import classify_task, get_matching_employees, find_nearest_employee
from bson import ObjectId

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id_str = data.get("_id")
    query = data.get("query")

    if not user_id_str or not query:
        return jsonify({"response": "Missing required fields."}), 400

    try:
        user_id = ObjectId(user_id_str)
    except Exception:
        return jsonify({"response": "Invalid user ID."}), 400

    answer = process_query(user_id, query)
    return jsonify({"response": answer})


@app.route("/assign-employee", methods=["POST"])
def api_assign_employee():
    data = request.json
    required_fields = ["name", "number", "coordinates", "task"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing one of required fields: {required_fields}"}), 400

    task_info = classify_task(data["task"])

    matched_employees = get_matching_employees(task_info['subRole'], task_info['skills'])

    nearest_employee = find_nearest_employee(data["coordinates"], matched_employees)

    if nearest_employee:
        emp_json = nearest_employee.copy()
        emp_json["_id"] = str(emp_json["_id"])
        for k, v in emp_json.items():
            if isinstance(v, datetime):
                emp_json[k] = v.isoformat()
    else:
        emp_json = None

    return jsonify({
        "matched_count": len(matched_employees),
        "assigned_employee": emp_json
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
