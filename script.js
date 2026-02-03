/*************************************************
 Resume ATS Checker - script.js
 Frontend-only JavaScript logic
**************************************************/

// ====== COMMON SKILL KEYWORDS ======
const hardSkills = [
  "javascript", "python", "java", "c++", "html", "css",
  "react", "node", "sql", "mongodb", "git", "api"
];

const softSkills = [
  "communication", "teamwork", "leadership",
  "problem solving", "adaptability", "time management"
];

const tools = [
  "github", "docker", "aws", "vscode", "figma", "jira"
];

// ====== ACTION VERBS FOR RESUME CHECK ======
const actionVerbs = [
  "developed", "designed", "implemented", "managed",
  "built", "created", "led", "optimized", "analyzed"
];

// ====== MAIN ANALYZE FUNCTION ======
function analyzeResume() {
  const resumeText = document.getElementById("resumeText").value.toLowerCase();
  const jobText = document.getElementById("jobDescription").value.toLowerCase();

  if (!resumeText || !jobText) {
    alert("Please paste both Resume and Job Description.");
    return;
  }

  // Extract keywords from job description
  const jobKeywords = extractKeywords(jobText);

  // Compare with resume
  const matchedKeywords = jobKeywords.filter(word =>
    resumeText.includes(word)
  );

  const missingKeywords = jobKeywords.filter(word =>
    !resumeText.includes(word)
  );

  // Calculate ATS Score
  const score = Math.round(
    (matchedKeywords.length / jobKeywords.length) * 100
  );

  // Display results
  updateScore(score);
  displayKeywords(matchedKeywords, missingKeywords);
  showSuggestions(score, missingKeywords, resumeText);

  // Save history
  saveHistory(score);
}

// ====== KEYWORD EXTRACTION ======
function extractKeywords(text) {
  const words = text
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .filter(word => word.length > 3);

  // Remove duplicates
  return [...new Set(words)];
}

// ====== UPDATE CIRCULAR SCORE ======
function updateScore(score) {
  const scoreText = document.getElementById("atsScore");
  scoreText.innerText = score + "%";
}

// ====== DISPLAY KEYWORDS ======
function displayKeywords(matched, missing) {
  document.getElementById("matchedKeywords").innerText =
    matched.join(", ") || "None";

  document.getElementById("missingKeywords").innerText =
    missing.join(", ") || "None";
}

// ====== SUGGESTIONS ENGINE ======
function showSuggestions(score, missing, resumeText) {
  const suggestions = [];

  if (score < 50) {
    suggestions.push("Your ATS score is low. Add more job-specific keywords.");
  }

  if (missing.length > 0) {
    suggestions.push(
      "Consider adding these keywords: " + missing.slice(0, 5).join(", ")
    );
  }

  // Resume length check
  const wordCount = resumeText.split(" ").length;
  if (wordCount < 300) {
    suggestions.push("Resume is too short. Aim for at least 300 words.");
  }

  // Action verbs check
  const hasActionVerbs = actionVerbs.some(verb =>
    resumeText.includes(verb)
  );
  if (!hasActionVerbs) {
    suggestions.push("Use more action verbs like 'developed', 'designed', etc.");
  }

  document.getElementById("suggestions").innerHTML =
    suggestions.map(s => `<li>${s}</li>`).join("");
}

// ====== HISTORY USING LOCAL STORAGE ======
function saveHistory(score) {
  let history = JSON.parse(localStorage.getItem("atsHistory")) || [];
  history.unshift({
    score: score,
    date: new Date().toLocaleString()
  });

  if (history.length > 3) history.pop();

  localStorage.setItem("atsHistory", JSON.stringify(history));
  showHistory();
}

function showHistory() {
  const history = JSON.parse(localStorage.getItem("atsHistory")) || [];
  const historyList = document.getElementById("history");

  historyList.innerHTML = history
    .map(item => `<li>${item.score}% - ${item.date}</li>`)
    .join("");
}

// ====== TAB SWITCHING ======
function openTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => (tab.style.display = "none"));

  document.getElementById(tabId).style.display = "block";
}

// ====== EXPORT AS PDF ======
function exportPDF() {
  window.print();
}

// ====== LOAD HISTORY ON PAGE LOAD ======
document.addEventListener("DOMContentLoaded", showHistory);

