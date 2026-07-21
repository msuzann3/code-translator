from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    code = data.get("code",  "")
    audience = data.get("audience", "engineer")
	
    explanation = f"[placeholder] Explaining {len(code)} characters of code for a {audience}."
	
    return jsonify({
        "audience": audience,
        "explanation": explanation
    })
	
if __name__ == "__main__":
    app.run(debug=True, port=5001)
		