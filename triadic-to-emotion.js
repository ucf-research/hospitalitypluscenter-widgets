const expandedColorEmotionMap = {"#ff0000": "Powerful, intense, urgent", "#00ff00": "Natural, peaceful, safe", "#0000ff": "Reliable, calm, trustworthy", "#ffff00": "Energetic, cheerful, optimistic", "#ff00ff": "Playful, imaginative, vibrant", "#00ffff": "Clear, refreshing, modern", "#ffa500": "Warm, enthusiastic, fun", "#800080": "Luxury, mystery, elegance", "#1c7eff": "Focused, clean, high-tech", "#ff1c7e": "Bold, passionate, romantic", "#7eff1c": "Fresh, optimistic, lively", "#ff69b4": "Sweet, youthful, energetic", "#a52a2a": "Earthy, dependable, rustic", "#708090": "Cool, distant, professional", "#4682b4": "Trustworthy, calm, intellectual"};

function getTriadicColors(baseHex) {
  const base = chroma(baseHex);
  const h = base.get("hsl.h");
  return [
    base.hex(),
    base.set("hsl.h", (h + 120) % 360).hex(),
    base.set("hsl.h", (h + 240) % 360).hex()
  ];
}

function findClosestEmotion(hex) {
  const input = chroma(hex).rgb();
  let closest = null;
  let minDist = Infinity;

  for (let color in expandedColorEmotionMap) {
    const target = chroma(color).rgb();
    const dist = Math.sqrt(
      (input[0] - target[0])**2 +
      (input[1] - target[1])**2 +
      (input[2] - target[2])**2
    );
    if (dist < minDist) {
      minDist = dist;
      closest = expandedColorEmotionMap[color];
    }
  }
  return closest || "Emotion unknown – use with design intention.";
}

var colorPicker = new iro.ColorPicker("#colorPicker", {
  width: 250,
  color: "#f00",
  borderWidth: 1,
  borderColor: "#fff"
});

colorPicker.on("color:change", function(color) {
  const baseHex = color.hexString;
  const triad = getTriadicColors(baseHex);

  let swatchesHtml = "";
  for (let i = 0; i < triad.length; i++) {
    swatchesHtml += `<div class="swatch" style="background:${triad[i]}"></div>`;
  }

  const emotionDescriptions = triad.map(function(hex) {
    const emotion = findClosestEmotion(hex);
    return "🎨 " + hex + ": " + emotion;
  }).join("<br>");

  document.getElementById("harmonies").innerHTML = `
    ${swatchesHtml}
    <p><strong>Triadic Colors:</strong> ${triad.join(", ")}</p>
  `;

  document.getElementById("emotionText").innerHTML = emotionDescriptions;
});
