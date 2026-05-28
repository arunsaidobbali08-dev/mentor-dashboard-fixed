const express = require("express");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");
console.log(`[env] Looking for .env at ${envPath}`);
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) return;
    process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  });
  console.log("[env] .env file loaded");
} else {
  console.log("[env] .env file not found");
}

const app = express();
const PORT = process.env.PORT || 3000;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const hasGroqKey = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "your_key_here");
console.log(`[env] GROQ_API_KEY loaded: ${hasGroqKey ? `yes (${process.env.GROQ_API_KEY.slice(0, 7)}...${process.env.GROQ_API_KEY.slice(-4)})` : "no"}`);
console.log(`[env] GROQ_MODEL: ${GROQ_MODEL}`);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const supportedRoles = [
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

const roleProfiles = {
  frontend: {
    domain: "browser-based product interfaces",
    coreSkills: ["HTML semantics", "CSS architecture", "JavaScript", "accessibility", "React or Vue", "state management"],
    tools: ["VS Code", "Chrome DevTools", "Figma", "Vite", "GitHub", "Playwright"],
    tech: ["TypeScript", "React", "Next.js", "Tailwind or CSS Modules", "REST/GraphQL", "Web Vitals"],
    projects: ["Responsive product dashboard", "Design-system component library", "API-powered analytics app"],
    resources: ["MDN Web Docs", "web.dev", "React docs", "Frontend Masters", "roadmap.sh/frontend"],
    interview: ["DOM and browser rendering", "CSS layout scenarios", "JavaScript async patterns", "accessibility reviews"]
  },
  backend: {
    domain: "APIs, data workflows, and server-side systems",
    coreSkills: ["HTTP", "API design", "databases", "authentication", "caching", "testing"],
    tools: ["Node.js", "Postman", "Docker", "PostgreSQL", "Redis", "GitHub Actions"],
    tech: ["Express or Fastify", "SQL", "JWT/OAuth", "Queues", "Observability", "Cloud deployment"],
    projects: ["REST API with auth", "Job queue worker", "Multi-tenant SaaS backend"],
    resources: ["Node.js docs", "PostgreSQL docs", "System Design Primer", "OWASP Cheat Sheet Series"],
    interview: ["API design tradeoffs", "database indexing", "auth flows", "concurrency and scaling"]
  },
  ai: {
    domain: "AI-powered applications, agents, and model integrations",
    coreSkills: ["Python", "LLM prompting", "embeddings", "RAG", "evaluation", "model deployment"],
    tools: ["Groq API", "Jupyter", "LangChain or LlamaIndex", "Vector databases", "Weights & Biases"],
    tech: ["Python", "FastAPI", "Transformers", "Vector search", "Function calling", "Evals"],
    projects: ["Document Q&A assistant", "AI coding mentor", "RAG knowledge base with evals"],
    resources: ["Groq docs", "Hugging Face course", "DeepLearning.AI short courses", "Papers with Code"],
    interview: ["LLM limitations", "RAG architecture", "evaluation design", "latency and cost optimization"]
  },
  data: {
    domain: "statistical analysis, data products, and business decision support",
    coreSkills: ["Python", "SQL", "statistics", "data cleaning", "visualization", "experimentation"],
    tools: ["Jupyter", "Pandas", "dbt", "Tableau or Power BI", "BigQuery", "Git"],
    tech: ["Python", "SQL", "Pandas", "NumPy", "scikit-learn", "BI dashboards"],
    projects: ["Churn analysis report", "A/B test readout", "Forecasting dashboard"],
    resources: ["Kaggle Learn", "Mode SQL Tutorial", "StatQuest", "Pandas docs"],
    interview: ["SQL case questions", "metrics design", "probability basics", "data storytelling"]
  },
  devops: {
    domain: "delivery pipelines, infrastructure, reliability, and automation",
    coreSkills: ["Linux", "networking", "CI/CD", "containers", "IaC", "monitoring"],
    tools: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus", "AWS or Azure"],
    tech: ["Bash", "YAML", "Kubernetes", "Terraform", "Helm", "OpenTelemetry"],
    projects: ["CI/CD pipeline", "Kubernetes deployment", "Infrastructure-as-code environment"],
    resources: ["Kubernetes docs", "Terraform docs", "Linux Journey", "AWS Well-Architected"],
    interview: ["deployment strategy", "incident response", "network basics", "scaling tradeoffs"]
  },
  design: {
    domain: "usable product experiences and design systems",
    coreSkills: ["user research", "wireframing", "visual hierarchy", "prototyping", "usability testing", "accessibility"],
    tools: ["Figma", "FigJam", "Notion", "Maze", "Webflow", "Design tokens"],
    tech: ["Design systems", "WCAG", "Information architecture", "Interaction design", "Product analytics"],
    projects: ["SaaS onboarding redesign", "Mobile booking flow", "Design system starter kit"],
    resources: ["Nielsen Norman Group", "Figma Learn", "Laws of UX", "Material Design"],
    interview: ["portfolio storytelling", "critique process", "research tradeoffs", "accessibility decisions"]
  },
  mobile: {
    domain: "native and cross-platform mobile applications",
    coreSkills: ["mobile UI patterns", "state management", "API integration", "offline storage", "app performance", "release workflows"],
    tools: ["Android Studio", "Xcode", "React Native or Flutter", "Firebase", "Fastlane"],
    tech: ["Kotlin", "Swift", "Flutter", "React Native", "SQLite", "Push notifications"],
    projects: ["Habit tracker app", "Offline notes app", "API-driven commerce app"],
    resources: ["Android Developers", "Apple Developer Docs", "Flutter docs", "React Native docs"],
    interview: ["lifecycle management", "performance profiling", "offline sync", "store release process"]
  },
  security: {
    domain: "defensive security, risk reduction, and threat detection",
    coreSkills: ["networking", "Linux", "threat modeling", "web security", "SIEM basics", "incident response"],
    tools: ["Burp Suite", "Wireshark", "Nmap", "Splunk", "Kali Linux", "OWASP ZAP"],
    tech: ["OWASP Top 10", "IAM", "Logging", "Vulnerability management", "Cloud security"],
    projects: ["Home lab detection rules", "Web app security report", "Incident response playbook"],
    resources: ["OWASP", "TryHackMe", "PortSwigger Academy", "MITRE ATT&CK"],
    interview: ["web vulnerabilities", "log investigation", "risk prioritization", "incident communication"]
  },
  cloud: {
    domain: "cloud architecture, managed services, and scalable platforms",
    coreSkills: ["cloud fundamentals", "networking", "IAM", "serverless", "containers", "cost management"],
    tools: ["AWS", "Azure or GCP", "Terraform", "Docker", "CloudWatch", "GitHub Actions"],
    tech: ["VPC/VNet", "Object storage", "Serverless functions", "Managed databases", "CDN", "Kubernetes"],
    projects: ["Static site with CDN", "Serverless API", "Resilient cloud app architecture"],
    resources: ["AWS Skill Builder", "Azure Learn", "Google Cloud Skills Boost", "Cloud Resume Challenge"],
    interview: ["IAM design", "high availability", "cost tradeoffs", "cloud migration planning"]
  },
  general: {
    domain: "software products and technical systems",
    coreSkills: ["programming fundamentals", "data structures", "Git", "testing", "debugging", "system design basics"],
    tools: ["VS Code", "GitHub", "Terminal", "Docker", "Postman"],
    tech: ["JavaScript or Python", "SQL", "REST APIs", "Testing", "Cloud basics"],
    projects: ["Portfolio app", "API-backed project", "Capstone case study"],
    resources: ["freeCodeCamp", "MDN", "The Odin Project", "System Design Primer"],
    interview: ["coding fundamentals", "project walkthroughs", "debugging scenarios", "system tradeoffs"]
  }
};

function profileFor(role) {
  const value = role.toLowerCase();
  if (value.includes("front")) return roleProfiles.frontend;
  if (value.includes("back")) return roleProfiles.backend;
  if (value.includes("full")) {
    return {
      ...roleProfiles.backend,
      domain: "end-to-end product engineering across UI, APIs, and databases",
      coreSkills: ["HTML/CSS", "JavaScript", "frontend frameworks", "API design", "databases", "deployment"],
      tools: ["React", "Node.js", "PostgreSQL", "Docker", "Vercel", "GitHub Actions"],
      tech: ["TypeScript", "React", "Express", "SQL", "Auth", "Cloud hosting"],
      projects: ["Full-stack SaaS dashboard", "Realtime collaboration app", "Subscription-ready product prototype"]
    };
  }
  if (value.includes("machine") || value.includes("ml")) return roleProfiles.ai;
  if (value.includes("ai")) return roleProfiles.ai;
  if (value.includes("data")) return roleProfiles.data;
  if (value.includes("devops") || value.includes("reliability") || value.includes("sre")) return roleProfiles.devops;
  if (value.includes("cloud")) return roleProfiles.cloud;
  if (value.includes("security") || value.includes("cyber")) return roleProfiles.security;
  if (value.includes("design") || value.includes("ui") || value.includes("ux")) return roleProfiles.design;
  if (value.includes("android") || value.includes("ios") || value.includes("mobile")) return roleProfiles.mobile;
  if (value.includes("blockchain")) {
    return {
      ...roleProfiles.backend,
      domain: "smart contracts, decentralized applications, and secure web3 systems",
      coreSkills: ["Solidity", "cryptography basics", "smart contract security", "wallet integration", "DeFi concepts"],
      tools: ["Hardhat", "Foundry", "MetaMask", "Ethers.js", "OpenZeppelin"],
      tech: ["Solidity", "Ethereum", "EVM", "Smart contracts", "IPFS", "The Graph"],
      projects: ["Token contract", "NFT minting dApp", "Audited escrow smart contract"],
      resources: ["Ethereum docs", "OpenZeppelin docs", "CryptoZombies", "Solidity docs"],
      interview: ["contract vulnerabilities", "gas optimization", "wallet flow", "decentralized architecture"]
    };
  }
  if (value.includes("game")) {
    return {
      ...roleProfiles.general,
      domain: "interactive games, gameplay systems, and real-time experiences",
      coreSkills: ["game loops", "physics basics", "C# or C++", "level design", "optimization", "asset pipelines"],
      tools: ["Unity", "Unreal Engine", "Blender", "Git LFS", "Profiler"],
      tech: ["C#", "C++", "Shaders", "Physics engines", "Multiplayer basics"],
      projects: ["2D platformer", "Physics puzzle prototype", "Small multiplayer arena"],
      resources: ["Unity Learn", "Unreal Online Learning", "Game Programming Patterns", "GDC talks"],
      interview: ["game loop design", "performance profiling", "math for games", "debugging gameplay systems"]
    };
  }
  if (value.includes("qa")) {
    return {
      ...roleProfiles.general,
      domain: "software quality, test automation, and release confidence",
      coreSkills: ["test planning", "manual testing", "automation", "API testing", "bug reporting", "CI quality gates"],
      tools: ["Playwright", "Selenium", "Postman", "Jira", "GitHub Actions"],
      tech: ["JavaScript", "Test design", "API automation", "Performance testing", "Accessibility testing"],
      projects: ["Automated regression suite", "API contract test pack", "QA release dashboard"],
      resources: ["Ministry of Testing", "Playwright docs", "ISTQB glossary", "Postman Learning Center"],
      interview: ["test strategy", "edge cases", "automation tradeoffs", "bug triage"]
    };
  }
  if (value.includes("database") || value.includes("dba")) {
    return {
      ...roleProfiles.backend,
      domain: "database performance, reliability, backups, and data integrity",
      coreSkills: ["SQL", "schema design", "indexing", "backup strategy", "replication", "query tuning"],
      tools: ["PostgreSQL", "MySQL", "MongoDB", "pgAdmin", "Grafana", "Liquibase"],
      tech: ["SQL", "Transactions", "Indexes", "Replication", "Partitioning", "Monitoring"],
      projects: ["Query optimization lab", "Backup and restore drill", "High-availability database setup"],
      resources: ["PostgreSQL docs", "Use The Index, Luke", "MongoDB University", "High Performance MySQL"],
      interview: ["index selection", "normalization", "locking", "disaster recovery"]
    };
  }
  if (value.includes("embedded")) {
    return {
      ...roleProfiles.general,
      domain: "firmware, hardware interfaces, and resource-constrained systems",
      coreSkills: ["C/C++", "microcontrollers", "RTOS basics", "sensors", "debugging hardware", "communication protocols"],
      tools: ["Arduino IDE", "STM32CubeIDE", "Oscilloscope", "Logic analyzer", "PlatformIO"],
      tech: ["C", "C++", "I2C", "SPI", "UART", "FreeRTOS"],
      projects: ["Sensor telemetry device", "RTOS task scheduler demo", "Bluetooth-connected controller"],
      resources: ["Embedded Artistry", "FreeRTOS docs", "Arduino docs", "STM32 tutorials"],
      interview: ["memory constraints", "interrupts", "protocol debugging", "real-time tradeoffs"]
    };
  }
  if (value.includes("ar") || value.includes("vr")) {
    return {
      ...roleProfiles.general,
      domain: "immersive 3D interfaces, spatial computing, and real-time interaction",
      coreSkills: ["3D math", "Unity or Unreal", "interaction design", "spatial UI", "performance", "XR SDKs"],
      tools: ["Unity", "Unreal Engine", "Meta XR SDK", "ARKit", "ARCore", "Blender"],
      tech: ["C#", "OpenXR", "3D assets", "Hand tracking", "Spatial anchors"],
      projects: ["AR product viewer", "VR training simulation", "Spatial dashboard prototype"],
      resources: ["OpenXR docs", "Unity XR docs", "Apple ARKit docs", "Meta Quest docs"],
      interview: ["frame rate constraints", "spatial UX", "asset optimization", "device capabilities"]
    };
  }
  return roleProfiles.general;
}

function phase(title, timeline, focus, skills, projects) {
  return {
    title,
    timeline,
    focus,
    skills,
    projects,
    checkpoints: [
      `Explain ${focus.toLowerCase()} in your own words`,
      "Ship one visible artifact",
      "Document tradeoffs and next steps"
    ]
  };
}

function fallbackRoadmap(role) {
  const cleanRole = role || "Software Engineer";
  const profile = profileFor(cleanRole);
  const salaryBand = cleanRole.toLowerCase().includes("senior") ? "$125k-$190k+" : "$75k-$155k";
  const nodes = [
    ...profile.coreSkills.slice(0, 4),
    ...profile.tech.slice(0, 4),
    ...profile.projects.slice(0, 3)
  ];

  return {
    role: cleanRole,
    summary: `${cleanRole}s build expertise in ${profile.domain}. This roadmap moves from fundamentals to portfolio proof, then into interview readiness and production-level judgment.`,
    overview: `${cleanRole} is a high-leverage technical path for people who enjoy solving practical problems, learning tools deeply, and turning ambiguous requirements into working outcomes.`,
    demand: `Demand is strongest for candidates who can show role-specific projects, communicate tradeoffs, and work with modern tooling. Hiring teams usually reward proof of shipped work more than certificates alone.`,
    salaryInsights: `Typical market ranges vary by country and experience, but many ${cleanRole} roles cluster around ${salaryBand} in US-based tech markets, with higher compensation for production ownership and specialized domain depth.`,
    timeline: "6-8 months",
    requiredSkills: profile.coreSkills,
    tools: profile.tools,
    technologies: profile.tech,
    projects: profile.projects,
    resources: profile.resources,
    portfolioGuidance: [
      "Lead with 2-3 polished projects that match the target role.",
      "Write case studies with problem, architecture, tradeoffs, screenshots, and measurable outcomes.",
      "Keep every project deployable, documented, and easy for a reviewer to run."
    ],
    interviewPreparation: profile.interview,
    faqs: [
      {
        question: `How long does it take to become job-ready as a ${cleanRole}?`,
        answer: "Most focused learners need 6-8 months of consistent practice, but a strong portfolio can shorten the path."
      },
      {
        question: "Should I learn every tool before applying?",
        answer: "No. Learn the core workflow, ship proof, then add tools when they solve a real project problem."
      },
      {
        question: "What matters most for interviews?",
        answer: "Clear fundamentals, project depth, debugging ability, and the way you explain tradeoffs."
      }
    ],
    phases: [
      phase("Beginner", "Weeks 1-8", "Core foundations", profile.coreSkills.slice(0, 4), [profile.projects[0], "Skill notebook with 20 practice entries"]),
      phase("Intermediate", "Weeks 9-18", "Applied role workflow", [...profile.coreSkills.slice(3), ...profile.tech.slice(0, 3)], [profile.projects[1], "Documented feature sprint"]),
      phase("Advanced", "Weeks 19-28", "Production readiness", [...profile.tech.slice(2), "Testing strategy", "Performance and reliability"], [profile.projects[2], "Portfolio case study"]),
      phase("Career Launch", "Weeks 29-32", "Interview and portfolio polish", ["Mock interviews", "Resume positioning", "System tradeoffs", "Communication"], ["Interview question bank", "Final portfolio review"])
    ],
    nodes: nodes.map((label, index) => ({
      id: `n${index + 1}`,
      label,
      type: index < 4 ? "foundation" : index < 8 ? "skill" : "project",
      status: index === 0 ? "active" : "locked"
    }))
  };
}

function fallbackMission(role, progress, roadmap = {}) {
  const phaseIndex = progress < 30 ? 0 : progress < 65 ? 1 : progress < 90 ? 2 : 3;
  const phase = roadmap.phases?.[phaseIndex] || fallbackRoadmap(role).phases[phaseIndex];
  const skill = phase.skills?.[0] || "one core skill";
  const project = phase.projects?.[0] || "a small role-specific project";
  const missionTypes = [
    {
      title: `Learn: ${skill}`,
      objective: `Study ${skill} and write a short explanation connected to ${role} work.`,
      steps: ["Read one focused resource", "Write five bullet notes", "Create one small example"],
      category: "Concept"
    },
    {
      title: `Build: ${project}`,
      objective: `Create a visible slice of ${project} that proves progress in the ${phase.title} phase.`,
      steps: ["Define the smallest deliverable", "Build for 45 minutes", "Commit or document what changed"],
      category: "Project"
    },
    {
      title: `${role} interview drill`,
      objective: `Practice one interview prompt from the ${phase.title} stage and explain your answer clearly.`,
      steps: ["Pick one prompt", "Answer out loud", "Write a stronger second version"],
      category: "Interview"
    }
  ];
  const mission = missionTypes[Math.min(missionTypes.length - 1, Math.floor(Math.random() * missionTypes.length))];
  return {
    ...mission,
    phase: phase.title,
    xp: 45 + phaseIndex * 15,
    estimatedMinutes: 40 + phaseIndex * 10
  };
}

function parseJson(text, fallback) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : text);
  } catch {
    return fallback;
  }
}

function readableGroqError(message) {
  const jsonStart = message.indexOf("{");
  if (jsonStart === -1) return message;
  try {
    const parsed = JSON.parse(message.slice(jsonStart));
    return parsed.error?.message || message;
  } catch {
    return message;
  }
}

async function askGroq({ system, input, fallback, json = true, label = "groq", allowFallback = true }) {
  const requestId = `${label}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  if (!hasGroqKey) {
    console.warn(`[groq:${requestId}] API key loaded: no`);
    console.warn(`[groq:${requestId}] Fallback triggered: ${allowFallback ? "yes" : "no"} - missing GROQ_API_KEY`);
    if (!allowFallback) {
      throw new Error("GROQ_API_KEY is not loaded. Add it to .env and restart the server.");
    }
    return { data: fallback, usedFallback: true };
  }

  console.log(`[groq:${requestId}] API key loaded: yes`);
  console.log(`[groq:${requestId}] Request sent to Groq chat completions API with model ${GROQ_MODEL}`);
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: input }
      ],
      temperature: 0.65
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(`[groq:${requestId}] API error ${response.status}: ${detail}`);
    console.warn(`[groq:${requestId}] Fallback triggered: ${allowFallback ? "yes" : "no"}`);
    throw new Error(`Groq request failed: ${detail}`);
  }

  const payload = await response.json();
  console.log(`[groq:${requestId}] Response received: ${payload.id || "no-id"}`);
  const text = payload.choices?.[0]?.message?.content || "";
  console.log(`[groq:${requestId}] Actual Groq response:\n${text}`);
  console.log(`[groq:${requestId}] Fallback triggered: no`);
  return { data: json ? parseJson(text, fallback) : text, usedFallback: false };
}

app.get("/api/roles", (req, res) => {
  res.json({ roles: supportedRoles });
});

app.post("/api/roadmap", async (req, res) => {
  const role = String(req.body.role || "").trim().slice(0, 80);
  if (!role) return res.status(400).json({ error: "Role is required." });

  const fallback = fallbackRoadmap(role);
  try {
    const result = await askGroq({
      fallback,
      label: "roadmap",
      system: "You are a precise technical career mentor and roadmap architect. Return only valid JSON with realistic, role-specific content. Do not reuse generic phases across roles.",
      input: `Generate a professional roadmap.sh-style roadmap for "${role}". Return JSON with keys: role, summary, overview, demand, salaryInsights, timeline, requiredSkills array, tools array, technologies array, projects array, resources array, portfolioGuidance array, interviewPreparation array, faqs array of {question, answer}, phases array, nodes array. Each phase must include title, timeline, focus, skills array, projects array, checkpoints array. Nodes should include id, label, type, status. Make content specific to ${role}.`
 });

 if (!result.phases) {
  result.phases = [
    {
      title: "Foundation",
      timeline: "1-2 Months",
      focus: "Learn core fundamentals",
      skills: ["HTML", "CSS", "JavaScript"],
      projects: ["Portfolio Website"],
      checkpoints: ["Responsive Design"]
    },
    {
      title: "Intermediate",
      timeline: "2-4 Months",
      focus: "Build projects",
      skills: ["React", "Node.js"],
      projects: ["Full Stack App"],
      checkpoints: ["Deploy Project"]
    }
  ];
}
    res.json(result);
  } catch (error) {
    res.status(502).json({ error: error.message, data: fallback, usedFallback: true });
  }
});

app.post("/api/mission", async (req, res) => {
  const role = String(req.body.role || "Software Engineer").trim().slice(0, 80);
  const progress = Number(req.body.progress || 0);
  const roadmap = req.body.roadmap || {};
  const fallback = fallbackMission(role, progress, roadmap);

  try {
    const result = await askGroq({
      fallback,
      label: "mission",
      system: "You are a supportive AI mentor. Return only valid JSON.",
      input: `Create one daily mission for a ${role}. Progress: ${progress}%. Roadmap: ${JSON.stringify(roadmap).slice(0, 4500)}. Return JSON with title, objective, phase, category, steps array, xp number between 35 and 100, estimatedMinutes. Include either a concept, project, resource, coding practice, or interview drill.`
    });
    res.json(result);
  } catch (error) {
    res.status(502).json({ error: error.message, data: fallback, usedFallback: true });
  }
});

app.post("/api/chat", async (req, res) => {
  const role = String(req.body.role || "technical learner").trim().slice(0, 80);
  const message = String(req.body.message || "").trim().slice(0, 1200);
  const progress = Number(req.body.progress || 0);
  const roadmap = req.body.roadmap || {};
  const history = Array.isArray(req.body.history) ? req.body.history.slice(-8) : [];
  if (!message) return res.status(400).json({ error: "Message is required." });

  try {
    const result = await askGroq({
      fallback: null,
      json: false,
      label: "mentor",
      allowFallback: false,
      system: `You are an AI mentor for ${role}.

Keep responses under 120 words.
Use bullet points or short paragraphs.
Avoid long explanations.
Be beginner friendly.
Give direct and practical guidance.
Focus only on the user's current roadmap step.
Keep formatting clean and readable.
`,
      input: `Progress: ${progress}%\nRoadmap context: ${JSON.stringify(roadmap).slice(0, 3000)}\nRecent chat: ${JSON.stringify(history)}\n\nLearner asks: ${message}`
    });
    res.json(result);
  } catch (error) {
    console.error(`[mentor] Request failed: ${error.message}`);
    const readableError = readableGroqError(error.message);
    res.status(502).json({
      error: error.message,
      data: null,
      usedFallback: false,
      visibleError: `AI mentor is unavailable: ${readableError}`
    });
  }
});

app.post("/api/progress", (req, res) => {
  res.json({ ok: true, savedAt: new Date().toISOString(), progress: req.body || {} });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`AI Mentor Dashboard running at http://localhost:${PORT}`);
});
