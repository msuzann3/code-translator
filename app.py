import os
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

app = Flask(__name__)
client = Anthropic()

MODEL = "claude-haiku-4-5"

AUDIENCE_PROMPTS = {
    "engineer": (
        "You are explaining code to a software engineer. Be precise and technical. "
        "Cover what the code does, the notable logic, edge cases, and any correctness "
        "or performance concerns. Assume they already know how to program."
    ),
    "pm": (
        "You are explaining code to a product manager who does not write code. "
        "Skip syntax entirely. Explain what the code accomplishes for the product, "
        "what a user would experience, and any limitations, in plain language."
    ),
    "executive": (
        "You are explaining code to a business executive. In two or three sentences, "
        "say what this code accomplishes and why it matters to the business — the outcome, "
        "cost, or risk. No technical detail."
    ),
}
@app.route("/")
def home():
    return send_from_directory("static", "index.html")
@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    code = data.get("code", "")
    audience = data.get("audience", "engineer")

    system_prompt = AUDIENCE_PROMPTS.get(audience, AUDIENCE_PROMPTS["engineer"])

    message = client.messages.create(
        model=MODEL,
        max_tokens=1000,
        system=system_prompt,
        messages=[
            {"role": "user", "content": f"Explain this code:\n\n{code}"}
        ],
    )

    explanation = message.content[0].text

    return jsonify({
        "audience": audience,
        "explanation": explanation
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)