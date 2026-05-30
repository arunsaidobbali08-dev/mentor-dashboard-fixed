const stateKey = "mentorMapAIState";

const fallbackRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cyber Security Analyst",
  "Blockchain Developer",
  "Android Developer",
  "iOS Developer",
  "Mobile App Developer",
  "UI/UX Designer",
  "Software Engineer",
  "System Design Engineer",
  "Game Developer",
  "QA Engineer",
  "Site Reliability Engineer",
  "Database Administrator",
  "AR/VR Developer",
  "Embedded Systems Engineer"
];

const defaultState = {
  role: "",
  roadmap: null,
  mission: null,
  xp: 0,
  streak: 0,
  completed: 0,
  progress: 0,
  lastCompletedDate: "",
  chat: [],
  bookmarks: [],
  completedMissions: []
};

let state = loadState();
let roles = [...fallbackRoles];

const els = {
  sidebar: document.getElementById("sidebar"),
  sidebarToggle: document.getElementById("sidebarToggle"),
  roleForm: document.getElementById("roleForm"),
  roleInput: document.getElementById("roleInput"),
  roleOptions: document.getElementById("roleOptions"),
  roleChips: document.getElementById("roleChips"),
  generateBtn: document.getElementById("generateBtn"),
  bookmarkBtn: document.getElementById("bookmarkBtn"),
  roadmapBookmarkBtn: document.getElementById("roadmapBookmarkBtn"),
  sidebarRole: document.getElementById("sidebarRole"),
  continueTitle: document.getElementById("continueTitle"),
  continueText: document.getElementById("continueText"),
  levelBadge: document.getElementById("levelBadge"),
  miniProgressLabel: document.getElementById("miniProgressLabel"),
  miniProgressBar: document.getElementById("miniProgressBar"),
  careerGrid: document.getElementById("careerGrid"),
  bookmarkList: document.getElementById("bookmarkList"),
  xpValue: document.getElementById("xpValue"),
  streakValue: document.getElementById("streakValue"),
  completedValue: document.getElementById("completedValue"),
  nextLevelText: document.getElementById("nextLevelText"),
  progressValue: document.getElementById("progressValue"),
  progressRing: document.getElementById("progressRing"),
  progressLabel: document.getElementById("progressLabel"),
  roadmapTitle: document.getElementById("roadmapTitle"),
  roadmapSummary: document.getElementById("roadmapSummary"),
  timelineBadge: document.getElementById("timelineBadge"),
  roadmapMeta: document.getElementById("roadmapMeta"),
  roadmapVisual: document.getElementById("roadmapVisual"),
  phaseList: document.getElementById("phaseList"),
  missionContent: document.getElementById("missionContent"),
  newMissionBtn: document.getElementById("newMissionBtn"),
  achievementGrid: document.getElementById("achievementGrid"),
  quickPrompts: document.getElementById("quickPrompts"),
  chatLog: document.getElementById("chatLog"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput")
};

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(stateKey) || localStorage.getItem("aiMentorDashboardState"));
    return { ...defaultState, ...(stored || {}) };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(stateKey, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const payload = await response.json();
  if (!response.ok && !payload.data) {
    const error = new Error(payload.visibleError || payload.error || "Request failed");
    error.detail = payload.error;
    throw error;
  }
  return payload;
}

function setBusy(button, busy, label = "Working") {
  if (!button) return;
  button.disabled = busy;
  if (busy) {
    button.dataset.label = button.textContent;
    button.textContent = label;
  } else {
    button.textContent = button.dataset.label || button.textContent;
  }
}

function getLevel() {
  return Math.floor(state.xp / 250) + 1;
}

function xpToNextLevel() {
  const nextLevelXp = getLevel() * 250;
  return Math.max(0, nextLevelXp - state.xp);
}

function isBookmarked(role = state.role) {
  return Boolean(role && state.bookmarks.some((item) => item.role.toLowerCase() === role.toLowerCase()));
}

function getAchievementData() {
  return [
    { title: "First roadmap", unlocked: Boolean(state.roadmap), detail: "Generated a career path" },
    { title: "Mission finisher", unlocked: state.completed >= 1, detail: "Completed one mission" },
    { title: "Momentum", unlocked: state.streak >= 3, detail: "Reached a 3 day streak" },
    { title: "Level 3", unlocked: getLevel() >= 3, detail: "Earned 500 XP" },
    { title: "Portfolio mode", unlocked: state.completed >= 5, detail: "Completed 5 missions" },
    { title: "Saved path", unlocked: state.bookmarks.length > 0, detail: "Bookmarked a roadmap" }
  ];
}

function renderRoles() {
  els.roleOptions.innerHTML = roles.map((role) => `<option value="${escapeHtml(role)}"></option>`).join("");
  els.roleChips.innerHTML = roles.slice(0, 8).map((role) => `<button type="button">${escapeHtml(role)}</button>`).join("");
  els.careerGrid.innerHTML = roles.map((role, index) => `
    <button type="button" class="career-card" data-role="${escapeHtml(role)}">
      <span>${index < 6 ? "Trending" : "Career"}</span>
      <strong>${escapeHtml(role)}</strong>
      <small>${careerBlurb(role)}</small>
    </button>
  `).join("");
}

function careerBlurb(role) {
  const lower = role.toLowerCase();
  if (lower.includes("ai") || lower.includes("machine")) return "Models, agents, automation, and intelligent products.";
  if (lower.includes("security") || lower.includes("cyber")) return "Threat detection, web security, and incident response.";
  if (lower.includes("devops") || lower.includes("cloud") || lower.includes("reliability")) return "Infrastructure, deployment, scale, and reliability.";
  if (lower.includes("design") || lower.includes("ui")) return "Research, product flows, prototypes, and design systems.";
  if (lower.includes("mobile") || lower.includes("android") || lower.includes("ios")) return "Native apps, mobile UX, releases, and performance.";
  return "Skills, projects, tools, interviews, and portfolio proof.";
}

function updateStats() {
  const level = getLevel();
  els.sidebarRole.textContent = state.role || "Choose a role";
  els.xpValue.textContent = state.xp;
  els.streakValue.textContent = state.streak;
  els.completedValue.textContent = state.completed;
  els.levelBadge.textContent = `Level ${level}`;
  els.nextLevelText.textContent = `${xpToNextLevel()} XP to next level`;
  els.progressValue.textContent = `${state.progress}%`;
  els.progressRing.style.setProperty("--progress", state.progress);
  els.progressLabel.textContent = state.progress ? `${state.role} path active` : "Ready to begin";
  els.continueTitle.textContent = state.role ? `Continue ${state.role}` : "Start your first roadmap";
  els.continueText.textContent = state.roadmap ? state.roadmap.summary : "Search a role to unlock daily learning, mentor chat, and career-specific projects.";
  els.miniProgressLabel.textContent = `${state.progress}%`;
  els.miniProgressBar.style.width = `${state.progress}%`;
  els.bookmarkBtn.textContent = isBookmarked() ? "Saved" : "Save roadmap";
  els.roadmapBookmarkBtn.textContent = isBookmarked() ? "Saved" : "Save roadmap";
  els.roadmapBookmarkBtn.disabled = !state.roadmap;
}

function renderBookmarks() {
  if (!state.bookmarks.length) {
    els.bookmarkList.innerHTML = `<p class="summary">No saved roadmaps yet. Save a role to continue it later.</p>`;
    return;
  }

  els.bookmarkList.innerHTML = state.bookmarks.map((item) => `
    <button type="button" class="bookmark-item" data-role="${escapeHtml(item.role)}">
      <strong>${escapeHtml(item.role)}</strong>
      <span>${escapeHtml(item.timeline || "Roadmap saved")}</span>
    </button>
  `).join("");
}

function renderAchievements() {
  els.achievementGrid.innerHTML = getAchievementData().map((item) => `
    <div class="achievement ${item.unlocked ? "unlocked" : ""}">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.detail)}</span>
    </div>
  `).join("");
}

function renderRoadmap() {
  if (!state.roadmap) {
    els.roadmapMeta.innerHTML = "";
    els.roadmapVisual.innerHTML = `<div class="empty-visual">Your connected roadmap will appear here after search.</div>`;
    els.phaseList.innerHTML = "";
    return;
  }

  const roadmap = state.roadmap;
  console.log("FULL ROADMAP OBJECT:", roadmap);

  els.roadmapTitle.textContent = roadmap.role || state.role;
  els.roadmapSummary.textContent = roadmap.summary || "Your personalized roadmap is ready.";
  els.timelineBadge.textContent = roadmap.timeline || "Timeline ready";
  els.roadmapMeta.innerHTML = `
    ${insightCard("Role overview", roadmap.overview)}
    ${insightCard("Career demand", roadmap.demand)}
 ${insightCard(
  "Salary insights",
  roadmap.salaryInsights?.averageSalary || "Salary data unavailable"
)}
  `;
  console.log("ROADMAP DATA:", roadmap);
console.log("NODES:", roadmap.nodes);
 if (roadmap.nodes && roadmap.nodes.length) {
    renderRoadmapVisual(roadmap.nodes);
}

renderPhases(roadmap);
console.log("PHASES HTML", els.phaseList.innerHTML);
}

function insightCard(title, text) {
  return `
    <article class="insight-card">
      <span>${escapeHtml(title)}</span>
      <p>${text || "Details will be generated for this role."}</p>
    </article>
  `;
}

function nodeStatus(index, total) {
  if (!total) return "locked";
  const activeCount = Math.max(1, Math.ceil((state.progress / 100) * total));
  if (index < activeCount - 1) return "done";
  if (index === activeCount - 1) return "active";
  return "locked";
}
function renderRoadmapVisual(nodes = []) {
  if (!nodes.length) {
    els.roadmapVisual.innerHTML = `
      <div class="empty-visual">
        Your connected roadmap will appear here after search.
      </div>
    `;
    return;
  }

  els.roadmapVisual.innerHTML = `
    <div class="node-track">
      ${nodes.map((node, index) => `
        <div class="roadmap-node active">
          <span>${escapeHtml(node.type || "skill")}</span>
          <strong>${escapeHtml(node.label || node.title || "Roadmap Item")}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderPhases(roadmap) {
  const phases = roadmap.phases || [];
  els.phaseList.innerHTML = phases.map((phase, index) => `
    <details class="phase" ${index === 0 ? "open" : ""}>
      <summary>
        <span>
          <strong>${escapeHtml(phase.title || `Phase ${index + 1}`)}</strong>
          <small>${escapeHtml(phase.timeline || "Flexible timeline")} - ${escapeHtml(phase.focus || "Skill growth")}</small>
        </span>
        <b>Phase ${index + 1}</b>
      </summary>
      <div class="phase-body">
        ${listBlock("Skills", phase.skills)}
        ${listBlock("Projects", phase.projects)}
        ${listBlock("Checkpoints", phase.checkpoints)}
      </div>
    </details>
  `).join("") + `
    <div class="roadmap-detail-grid">
  ${listPanel("Required skills", roadmap.requiredSkills || roadmap.skills || [])}

${listPanel(
  "Tools and technologies",
  roadmap.tools || roadmap.technologies || []
)}

${listPanel(
  "Project ideas",
  roadmap.projectIdeas || roadmap.projects || []
)}

${listPanel(
  "Portfolio guidance",
  roadmap.portfolioGuidance || roadmap.portfolio || []
)}

${listPanel(
  "Interview preparation",
  roadmap.interviewPreparation || roadmap.interview || []
)}

${listPanel(
  "Recommended resources",
  roadmap.resources || roadmap.learningResources || []
)}
</div>
    <div class="faq-list">
      <h3>FAQs</h3>
      ${(roadmap.faqs || []).map((faq) => `
        <details>
          <summary>${escapeHtml(faq.question)}</summary>
          <p>${escapeHtml(faq.answer)}</p>
        </details>
      `).join("")}
    </div>
  `;
}

function listBlock(title, items = []) {
  return `
    <div class="phase-card">
      <h4>${escapeHtml(title)}</h4>
      <ul>
        ${(items || [])
          .map(
            (item) => `
              <li>${escapeHtml(String(item))}</li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;
}

function listPanel(title, items = []) {
  return `
    <div class="detail-panel">
      <h3>${escapeHtml(title)}</h3>

      <ul>
        ${(items || [])
          .map(
            (item) => `
              <li>${escapeHtml(String(item))}</li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;
}

function renderMission() {
  if (!state.mission) {
    els.missionContent.className = "mission-empty";
    els.missionContent.textContent = state.roadmap ? "Generate a mission for today." : "Generate a roadmap to unlock your first mission.";
    return;
  }

  const mission = state.mission;
  els.missionContent.className = "mission-card";
  els.missionContent.innerHTML = `
    <div class="mission-meta">
      <span>${escapeHtml(mission.phase || "Current phase")}</span>
      <span>${escapeHtml(mission.category || "Mission")}</span>
    </div>
    <div class="mission-title">${escapeHtml(mission.title)}</div>
    <p class="summary">${escapeHtml(mission.objective)}</p>
    <ul>${(mission.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul>
    <div class="mission-meta">
      <span>${Number(mission.xp || 50)} XP</span>
      <span>${Number(mission.estimatedMinutes || 45)} min</span>
    </div>
    <button class="complete-btn" type="button" id="completeMissionBtn">Complete mission</button>
  `;
  document.getElementById("completeMissionBtn").addEventListener("click", completeMission);
}

function renderChat() {
  const intro = state.chat.length ? "" : `<div class="chat-message mentor">Choose a role or ask me for a project, debugging help, concept explanation, or interview practice.</div>`;
  els.chatLog.innerHTML = intro + state.chat.map((item) => `
  <div class="chat-message ${item.role === "user" ? "user" : item.role === "error" ? "error" : "mentor"}">
    ${escapeHtml(item.content).replace(/\*\*/g, "")}
  </div>
`).join("");
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function render() {
  updateStats();
  renderBookmarks();
  renderAchievements();
  renderRoadmap();
  renderMission();
  renderChat();
}

async function generateRoadmap(role) {
  setBusy(els.generateBtn, true, "Generating");
  els.roadmapTitle.textContent = "Designing your roadmap...";
  els.roadmapSummary.textContent = "Building role-specific phases, connected nodes, projects, interview prep, and resources.";
  els.roadmapMeta.innerHTML = "";
  els.roadmapVisual.innerHTML = `<div class="empty-visual loading">Generating learning path...</div>`;
  els.phaseList.innerHTML = "";

  try {
    const payload = await postJson("/api/roadmap", { role });
    console.log(payload);
    state = {
      ...state,
      role,
      roadmap: payload.data || payload,
      mission: null,
      progress: Math.max(state.progress, 5)
    };
    saveState();

render();

console.log("ROADMAP DATA:", payload);
console.log("PHASES:", payload.phases);
console.log("ROADMAP:", state.roadmap);

await generateMission();
    document.getElementById("roadmap").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    els.roadmapSummary.textContent = error.message;
  } finally {
    setBusy(els.generateBtn, false);
  }
}

async function generateMission() {
  if (!state.role) return;
  setBusy(els.newMissionBtn, true, "...");
  els.missionContent.className = "mission-empty";
  els.missionContent.textContent = "Creating a daily mission matched to your phase and progress...";

  try {
    const payload = await postJson("/api/mission", {
      role: state.role,
      roadmap: state.roadmap,
      progress: state.progress
    });
    state.mission = payload.data;
    saveState();
    renderMission();
  } catch (error) {
    els.missionContent.textContent = error.message;
  } finally {
    setBusy(els.newMissionBtn, false);
  }
}

function completeMission() {
  if (!state.mission) return;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const xp = Number(state.mission.xp || 50);

  state.xp += xp;
  state.completed += 1;
  state.progress = Math.min(100, state.progress + 7 + Math.floor(xp / 25));
  state.completedMissions.push({
    title: state.mission.title,
    role: state.role,
    completedAt: new Date().toISOString(),
    xp
  });
  if (state.lastCompletedDate !== today) {
    state.streak = state.lastCompletedDate === yesterday ? state.streak + 1 : 1;
    state.lastCompletedDate = today;
  }
  state.mission = null;
  saveState();
  postJson("/api/progress", state).catch(() => {});
  render();
}

function toggleBookmark() {
  if (!state.role || !state.roadmap) return;
  if (isBookmarked()) {
    state.bookmarks = state.bookmarks.filter((item) => item.role.toLowerCase() !== state.role.toLowerCase());
  } else {
    state.bookmarks.unshift({
      role: state.role,
      timeline: state.roadmap.timeline,
      savedAt: new Date().toISOString()
    });
  }
  saveState();
  render();
}

function addTyping() {
  const node = document.createElement("div");
  node.className = "chat-message mentor";
  node.id = "typingBubble";
  node.innerHTML = `<span class="typing"><span></span><span></span><span></span></span>`;
  els.chatLog.appendChild(node);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function removeTyping() {
  document.getElementById("typingBubble")?.remove();
}

async function askMentor(message) {
  if (!message) return;
  state.chat.push({ role: "user", content: message });
  els.chatInput.value = "";
  saveState();
  renderChat();
  addTyping();

  try {
    const payload = await postJson("/api/chat", {
      role: state.role || "technical learner",
      message,
      history: state.chat,
      progress: state.progress,
      roadmap: state.roadmap
    });
    removeTyping();
    state.chat.push({ role: "mentor", content: payload.data });
    saveState();
    renderChat();
  } catch (error) {
    removeTyping();
    state.chat.push({ role: "error", content: error.message });
    saveState();
    renderChat();
  }
}

async function hydrateRoles() {
  try {
    const response = await fetch("/api/roles");
    const payload = await response.json();
    roles = payload.roles?.length ? payload.roles : roles;
  } catch {
    roles = [...fallbackRoles];
  }
  renderRoles();
}

els.roleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const role = els.roleInput.value.trim();
  if (role) {
  console.log("BUTTON WORKING");
  generateRoadmap(role);
}
  if (role) generateRoadmap(role);
});

els.roleChips.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  els.roleInput.value = button.textContent;
  generateRoadmap(button.textContent);
  state.chat = [];
  render();
});

els.careerGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-role]");
  if (!card) return;
  const role = card.dataset.role;
  els.roleInput.value = role;
  console.log("BUTTON WORKING");
generateRoadmap(button.textContent);
  state.chat =[];
  render();
});

els.bookmarkList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-role]");
  if (!item) return;
  els.roleInput.value = item.dataset.role;
  generateRoadmap(item.dataset.role);
  state.chat =[];
  render();
});

els.bookmarkBtn.addEventListener("click", toggleBookmark);
els.roadmapBookmarkBtn.addEventListener("click", toggleBookmark);
els.newMissionBtn.addEventListener("click", generateMission);
els.sidebarToggle.addEventListener("click", () => els.sidebar.classList.toggle("open"));

els.quickPrompts.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) askMentor(button.textContent);
});

els.chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  askMentor(els.chatInput.value.trim());
});

hydrateRoles();
render();
