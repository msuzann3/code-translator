// Grab the page elements to work with
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

// Turn all buttons on or off together (so you can't fire two requests at once)
function setButtonsDisabled(disabled) {
  buttons.forEach(function (button) {
    button.disabled = disabled;
  });
}

// Send the code to the Flask server and show the answer
async function translate(audience) {
  const code = codeBox.value;

  if (code.trim() === "") {
    output.textContent = "Please paste some code first.";
    return;
  }

  // Read which mode radio button is currently selected
  const modeElement = document.querySelector('input[name="mode"]:checked');
  if (!modeElement) {
    output.textContent = "Error: mode selection not found.";
    return;
  }
  const mode = modeElement.value;

  output.textContent = "Thinking...";
  setButtonsDisabled(true);

  try {
    const response = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code, audience: audience, mode: mode }),
    });

    const data = await response.json();

    if (!response.ok) {
      output.textContent = data.error || "Something went wrong. Please try again.";
      return;
    }

    output.textContent = data.explanation;
  } catch (error) {
    output.textContent = "Couldn't reach the server. Is it still running?";
  } finally {
    setButtonsDisabled(false);
  }
}
