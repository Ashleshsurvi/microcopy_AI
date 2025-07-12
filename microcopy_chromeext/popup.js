document.addEventListener("DOMContentLoaded", () => {
  const inputText = document.getElementById("inputText");
  const tone = document.getElementById("tone");
  const generateBtn = document.getElementById("generateBtn");
  const results = document.getElementById("results");

  // Load the highlighted text
  chrome.storage.local.get("selectedText", (data) => {
    if (data.selectedText) {
      inputText.value = data.selectedText;
    }
  });

  generateBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    const selectedTone = tone.value;

    if (!text) {
      alert("Please enter some text.");
      return;
    }

    results.innerHTML = "Generating...";

    try {
      const response = await fetch(`${CONFIG.BACKEND_URL}/api/generateMicrocopy/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone: selectedTone })
      });

      const data = await response.json();

      if (!data.alternatives) throw new Error("Invalid response");

    results.innerHTML = data.alternatives
  .map(
    (alt, index) => `
      <div class="result">
        <div class="result-text">${alt}</div>
        <div class="copy-icon" data-index="${index}" title="Copy">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10 1.5a.5.5 0 0 1 .5.5v1H13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.5v-1a.5.5 0 0 1 .5-.5h2zm.5 2v-1h-2v1h2z"/>
            <path d="M4 4.5v9a.5.5 0 0 0 .5.5H13a.5.5 0 0 0 .5-.5v-9A.5.5 0 0 0 13 4H4.5a.5.5 0 0 0-.5.5z"/>
          </svg>
        </div>
      </div>
    `
  )
  .join("");





// Attach click listeners to all copy buttons
document.querySelectorAll(".copy-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    const index = icon.getAttribute("data-index");
    const textToCopy = data.alternatives[index];
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Copied to clipboard!");
    });
  });
});


    } catch (err) {
      console.error(err);
      results.innerHTML = "Error generating microcopy.";
    }
  });
});
