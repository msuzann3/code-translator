// Grab the three page elements to work with
const codeBox = document.getElementById("code");
const output = document.getElementById("output");
const buttons = document.querySelectorAll("#buttons button");

// Make every button call translate() with its own audience when clicked
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const audience = button.dataset.audience;
    translate(audience);
  });
});

// Send the code to the Flask server and show the answer
async function translate(audience) {
  const code = codeBox.value;

  if (code.trim() === "") {
    output.textContent = "Please paste some code first.";
    return;
  }

  output.textContent = "Thinking...";

  const response = await fetch("/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code, audience: audience }),
  });

  const data = await response.json();
  output.textContent = data.explanation;
}