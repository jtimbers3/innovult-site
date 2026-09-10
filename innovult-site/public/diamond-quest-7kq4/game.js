const STORAGE_KEY = "diamondQuestProgressV1";
const TTS_SETTINGS_KEY = "diamondQuestTtsSettingsV1";
let ttsReady = Promise.resolve();

const profiles = {
  rumi: {
    id: "rumi",
    name: "Rumi",
    age: 3,
    league: "Rookie League",
    photo: "assets/rumi-and-mason.png",
    alt: "Rumi at the ballpark with Mason",
    maxChoices: 3,
    skillPlan: {
      word: ["spokenWord"],
      sentence: ["spokenWord"],
      rhyme: ["spokenWord"],
    },
  },
  mason: {
    id: "mason",
    name: "Mason",
    age: 5,
    league: "Major League",
    photo: "assets/mason-at-park.png",
    alt: "Mason at the ballpark",
    maxChoices: 3,
    skillPlan: {
      word: ["spokenWord"],
      sentence: ["spokenWord"],
      rhyme: ["spokenWord"],
    },
  },
};

const state = {
  activeProfileId: "mason",
  halfInning: "top",
  mode: "word",
  runs: 0,
  inning: 1,
  streak: 0,
  outs: 0,
  base: 0,
  bases: createEmptyBases(),
  sound: true,
  current: null,
  currentAttemptStartedAt: 0,
  hintLevel: 0,
  buildIndex: 0,
  wrongAttempts: 0,
  answeringLocked: false,
  gameStarted: false,
  voices: [],
  tts: {
    provider: "offline-fallback",
    voice: loadTtsSettings().voice,
    fallbackVoiceURI: loadTtsSettings().fallbackVoiceURI,
    audioCache: new Map(),
    currentAudio: null,
  },
  progress: loadProgress(),
};

const playerPhotos = {
  mason: {
    name: "Mason",
    src: "assets/mason-at-park.png",
    alt: "Mason at the ballpark",
  },
  rumi: {
    name: "Rumi",
    src: "assets/rumi-and-mason.png",
    alt: "Rumi in the stands with Mason",
  },
  both: {
    name: "Rumi + Mason",
    src: "assets/rumi-and-mason.png",
    alt: "Rumi and Mason at the ballpark",
  },
};

const inningRoles = {
  top: {
    label: "Top",
    hitter: "mason",
    pitcher: "rumi",
  },
  bottom: {
    label: "Bottom",
    hitter: "rumi",
    pitcher: "mason",
  },
};

const characterAssets = {
  mason: {
    batter: "assets/illustrated/mason-ready-to-hit.png",
    pitcher: "assets/illustrated/mason-pitcher.png",
    runner: "assets/illustrated/mason-runner.png",
  },
  rumi: {
    batter: "assets/illustrated/rumi-ready-to-hit.png",
    pitcher: "assets/illustrated/rumi-pitcher.png",
    runner: "assets/illustrated/rumi-runner.png",
  },
};

const baseCoordinates = {
  home: { x: 50, y: 76.2, scale: 0.54 },
  first: { x: 93, y: 57, scale: 0.56 },
  second: { x: 37, y: 55, scale: 0.5 },
  third: { x: 1, y: 67, scale: 0.56 },
};

const runnerLeadCoordinates = {
  first: { x: 93, y: 57, scale: 0.56 },
  second: { x: 37, y: 55, scale: 0.5 },
  third: { x: 1, y: 67, scale: 0.56 },
};

const hitFlightTargets = {
  1: [
    { liftX: 41, liftY: 43, arcX: 35, arcY: 36, endX: 28, endY: 35, endScale: 0.36, trailAngle: 16 },
    { liftX: 63, liftY: 41, arcX: 68, arcY: 34, endX: 77, endY: 35, endScale: 0.36, trailAngle: -16 },
    { liftX: 72, liftY: 46, arcX: 78, arcY: 39, endX: 88, endY: 43, endScale: 0.38, trailAngle: -20 },
  ],
  2: [
    { liftX: 39, liftY: 39, arcX: 29, arcY: 28, endX: 18, endY: 20, endScale: 0.26, trailAngle: 18 },
    { liftX: 66, liftY: 38, arcX: 75, arcY: 27, endX: 86, endY: 22, endScale: 0.26, trailAngle: -18 },
    { liftX: 74, liftY: 42, arcX: 82, arcY: 30, endX: 94, endY: 24, endScale: 0.26, trailAngle: -22 },
  ],
  3: [
    { liftX: 36, liftY: 35, arcX: 24, arcY: 21, endX: 10, endY: 13, endScale: 0.21, trailAngle: 22 },
    { liftX: 69, liftY: 35, arcX: 80, arcY: 21, endX: 96, endY: 14, endScale: 0.21, trailAngle: -22 },
    { liftX: 75, liftY: 37, arcX: 85, arcY: 22, endX: 99, endY: 11, endScale: 0.2, trailAngle: -24 },
  ],
  4: [
    { liftX: 34, liftY: 31, arcX: 22, arcY: 14, endX: 7, endY: 3, endScale: 0.18, trailAngle: 24 },
    { liftX: 70, liftY: 30, arcX: 82, arcY: 13, endX: 97, endY: 4, endScale: 0.18, trailAngle: -24 },
    { liftX: 76, liftY: 34, arcX: 88, arcY: 15, endX: 103, endY: 2, endScale: 0.17, trailAngle: -26 },
  ],
};

const baseNames = ["first", "second", "third"];

const baseByNumber = {
  0: "home",
  1: "first",
  2: "second",
  3: "third",
};

function createEmptyBases() {
  return { first: null, second: null, third: null };
}

const skillMeta = {
  spokenWord: { label: "Heard word match", strand: "Words", order: 1 },
};

const wordBankByInning = {
  1: {
    words: ["bat", "hit", "run", "cap", "win", "tag", "fan", "ball"],
    names: [
      { answer: "CJ Abrams", choices: ["CJ Abrams", "James Wood", "Bryce Harper"] },
      { answer: "James Wood", choices: ["James Wood", "CJ Abrams", "Bryce Harper"] },
      { answer: "Bryce Harper", choices: ["Bryce Harper", "James Wood", "CJ Abrams"] },
    ],
  },
  2: {
    words: ["base", "mitt", "team", "home", "safe", "out", "game", "toss", "catch", "glove"],
    names: [{ answer: "Shohei Ohtani", choices: ["Shohei Ohtani", "Bryce Harper", "James Wood"] }],
  },
  3: {
    words: ["pitch", "field", "swing", "throw", "coach", "slide", "score", "steal", "mound", "plate"],
    names: [{ answer: "Jacob Young", choices: ["Jacob Young", "James Wood", "CJ Abrams"] }],
  },
  4: {
    words: ["first", "third", "strike", "ground", "crowd", "grass", "sprint", "drive", "bench"],
    names: [
      { answer: "Dylan Crews", choices: ["Dylan Crews", "Brady Young", "Jacob Young"] },
      { answer: "Brady Young", choices: ["Brady Young", "Dylan Crews", "Jacob Young"] },
    ],
  },
  5: {
    words: ["runner", "batter", "pitcher", "catcher", "inning", "dugout", "helmet", "single", "double"],
    names: [
      { answer: "Keibert Ruiz", choices: ["Keibert Ruiz", "Harry Ford", "Shohei Ohtani"] },
      { answer: "Harry Ford", choices: ["Harry Ford", "Keibert Ruiz", "Brad Lord"] },
    ],
  },
  6: {
    words: ["triple", "lineup", "baseball", "outfield", "infield", "bullpen", "umpire", "stadium"],
    names: [
      { answer: "Cade Cavalli", choices: ["Cade Cavalli", "Brad Lord", "Jake Irving"] },
      { answer: "Brad Lord", choices: ["Brad Lord", "Cade Cavalli", "Jake Irving"] },
      { answer: "Jake Irving", choices: ["Jake Irving", "Brad Lord", "Cade Cavalli"] },
    ],
  },
  7: {
    words: ["diamond", "uniform", "fastball", "curveball", "grounder", "shortstop", "teammate"],
    names: [
      { answer: "Andres Chaparro", choices: ["Andres Chaparro", "Andrew Alvarez", "Abimelec Ortiz"] },
      { answer: "Daylen Lile", choices: ["Daylen Lile", "Nasim Nuñez", "Dylan Crews"] },
      { answer: "Nasim Nuñez", choices: ["Nasim Nuñez", "Daylen Lile", "Andres Chaparro"] },
      { answer: "Andrew Alvarez", choices: ["Andrew Alvarez", "Andres Chaparro", "Abimelec Ortiz"] },
    ],
  },
  8: {
    words: ["pitching", "batting", "running", "catching", "throwing", "sliding", "scoring", "stealing"],
    names: [{ answer: "Abimelec Ortiz", choices: ["Abimelec Ortiz", "Andres Chaparro", "Andrew Alvarez"] }],
  },
  9: {
    words: ["scoreboard", "baserunner", "centerfield", "rightfield", "leftfield", "ballplayer", "outfielder", "championship", "tournament", "celebration"],
    names: [],
  },
};

const wordChoiceOverrides = {
  bat: ["bat", "cat", "bit"],
  hit: ["hit", "hat", "sit"],
  run: ["run", "sun", "ran"],
  cap: ["cap", "cat", "cup"],
  win: ["win", "pin", "wig"],
  base: ["base", "ball", "bat"],
  ball: ["ball", "bell", "bat"],
  mitt: ["mitt", "mat", "hit"],
  team: ["team", "time", "home"],
  home: ["home", "hope", "team"],
  catch: ["catch", "patch", "coach"],
  pitch: ["pitch", "catch", "pinch"],
  coach: ["coach", "catch", "couch"],
  field: ["field", "filled", "held"],
  glove: ["glove", "give", "grove"],
  runner: ["runner", "rider", "winner"],
  batter: ["batter", "better", "butter"],
  pitcher: ["pitcher", "picture", "catcher"],
  catcher: ["catcher", "pitcher", "catch"],
  inning: ["inning", "ending", "inside"],
  dugout: ["dugout", "outfield", "ground"],
  baseball: ["baseball", "basketball", "ballpark"],
  outfield: ["outfield", "infield", "outside"],
};

const wordContexts = {
  bat: "swing",
  hit: "swing",
  run: "run",
  cap: "cap",
  win: "win",
  tag: "base",
  fan: "team",
  ball: "ball",
  base: "base",
  mitt: "catch",
  team: "team",
  home: "score",
  safe: "base",
  out: "scoreboard",
  game: "team",
  toss: "throw",
  catch: "catch",
  glove: "catch",
  pitch: "pitch",
  field: "field",
  swing: "swing",
  throw: "throw",
  coach: "coach",
  slide: "run",
  score: "score",
  steal: "run",
  mound: "pitch",
  plate: "base",
  first: "base",
  third: "base",
  strike: "pitch",
  ground: "field",
  crowd: "team",
  grass: "field",
  sprint: "run",
  drive: "swing",
  bench: "team",
  runner: "run",
  batter: "swing",
  pitcher: "pitch",
  catcher: "catch",
  inning: "scoreboard",
  dugout: "team",
  helmet: "cap",
  single: "base",
  double: "base",
  triple: "base",
  lineup: "team",
  baseball: "ball",
  outfield: "field",
  infield: "field",
  bullpen: "pitch",
  umpire: "scoreboard",
  stadium: "team",
  diamond: "field",
  uniform: "cap",
  fastball: "pitch",
  curveball: "pitch",
  grounder: "field",
  shortstop: "field",
  teammate: "team",
  pitching: "pitch",
  batting: "swing",
  running: "run",
  catching: "catch",
  throwing: "throw",
  sliding: "run",
  scoring: "score",
  stealing: "run",
  scoreboard: "scoreboard",
  baserunner: "run",
  centerfield: "field",
  rightfield: "field",
  leftfield: "field",
  ballplayer: "team",
  outfielder: "field",
  championship: "win",
  tournament: "team",
  celebration: "win",
};

const questionBank = buildQuestionBank(wordBankByInning);

const els = {
  shell: document.querySelector(".game-shell"),
  runs: document.querySelector("#runs"),
  inning: document.querySelector("#inning"),
  streak: document.querySelector("#streak"),
  runner: document.querySelector("#runner"),
  runners: Array.from(document.querySelectorAll(".runner")),
  pitcher: document.querySelector("#pitcher"),
  batter: document.querySelector("#batter"),
  runnerArt: document.querySelector("#runner .sprite-art"),
  pitcherArt: document.querySelector("#pitcher .sprite-art"),
  batterArt: document.querySelector("#batter .sprite-art"),
  pitchBall: document.querySelector("#pitch-ball"),
  jumbotronStatus: document.querySelector("#jumbotron-status"),
  jumbotronMessage: document.querySelector("#jumbotron-message"),
  roundTitle: document.querySelector("#round-title"),
  prompt: document.querySelector("#prompt"),
  targetWord: document.querySelector("#target-word"),
  choices: document.querySelector("#choices"),
  feedback: document.querySelector("#feedback"),
  coachLine: document.querySelector("#coach-line"),
  playerPhoto: document.querySelector("#player-photo"),
  playerName: document.querySelector("#player-name"),
  skillFocus: document.querySelector("#skill-focus"),
  phonicsStrip: document.querySelector("#phonics-strip"),
  listen: document.querySelector("#listen"),
  teach: document.querySelector("#teach"),
  voiceSelect: document.querySelector("#voice-select"),
  browserVoiceSelect: document.querySelector("#browser-voice-select"),
  ttsStatus: document.querySelector("#tts-status"),
  startGame: document.querySelector("#start-game"),
  newPitch: document.querySelector("#new-pitch"),
  easyMode: document.querySelector("#easy-mode"),
  soundToggle: document.querySelector("#sound-toggle"),
  profileButtons: [...document.querySelectorAll(".profile-button")],
  tabs: [...document.querySelectorAll(".tab")],
};

els.startGame.disabled = true;
els.startGame.textContent = "Loading Voice";

function makeHeardWord(answer, choices, stage, context) {
  const isPlayerName = answer.includes(" ");
  return {
    id: `heard-${answer}`,
    level: "major",
    skillId: "spokenWord",
    type: "heardWord",
    target: answer,
    prompt: "",
    spokenPrompt: `Find ${isPlayerName ? answer : answer.toUpperCase()}.`,
    choices: textChoices(choices),
    graphemes: [],
    focus: `Hear ${isPlayerName ? answer : answer.toUpperCase()} and choose the matching word.`,
    stage,
    context,
    hitValue: Math.min(3, Math.max(1, stage)),
  };
}

function textChoices(labels) {
  return labels.map((label) => ({ label, value: label, kind: "text" }));
}

function buildQuestionBank(bankByInning) {
  return Object.entries(bankByInning).flatMap(([inning, group]) => {
    const stage = Number(inning);
    const wordQuestions = group.words.map((word, index) => makeHeardWord(word, getWordChoices(word, group.words, index), stage, wordContexts[word] || "team"));
    const nameQuestions = group.names.map((item) => makeHeardWord(item.answer, item.choices, stage, "team"));
    return [...wordQuestions, ...nameQuestions];
  });
}

function getWordChoices(word, inningWords, index) {
  if (wordChoiceOverrides[word]) return wordChoiceOverrides[word];
  const distractors = inningWords.filter((item) => item !== word);
  return [word, distractors[index % distractors.length], distractors[(index + 3) % distractors.length]].filter(Boolean);
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.profiles) return saved;
  } catch (error) {
    console.warn("Could not read saved progress.", error);
  }
  return {
    profiles: Object.fromEntries(
      Object.values(profiles).map((profile) => [
        profile.id,
        {
          league: profile.league,
          rewards: [],
          skills: {},
          attempts: [],
        },
      ]),
    ),
  };
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function getProfile() {
  syncHalfInningRoles();
  return profiles[state.activeProfileId];
}

function getProfileProgress() {
  syncHalfInningRoles();
  return state.progress.profiles[state.activeProfileId];
}

function getInningRoles() {
  return inningRoles[state.halfInning] || inningRoles.top;
}

function syncHalfInningRoles() {
  const roles = getInningRoles();
  state.activeProfileId = roles.hitter;
  els.shell.dataset.halfInning = state.halfInning;
  els.shell.dataset.batter = roles.hitter;
  els.shell.dataset.pitcher = roles.pitcher;
  els.shell.dataset.runner = roles.hitter;
  els.profileButtons.forEach((button) => {
    const active = button.dataset.profile === roles.hitter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderCharacterAssets() {
  const roles = getInningRoles();
  const batterAssets = characterAssets[roles.hitter] || characterAssets.mason;
  const pitcherAssets = characterAssets[roles.pitcher] || characterAssets.rumi;
  const runnerAssets = characterAssets[roles.hitter] || characterAssets.mason;
  if (els.batterArt) els.batterArt.src = batterAssets.batter;
  if (els.pitcherArt) els.pitcherArt.src = pitcherAssets.pitcher;
  if (els.runnerArt) els.runnerArt.src = runnerAssets.runner;
  els.runners.forEach((runner) => {
    const art = runner.querySelector(".sprite-art");
    if (art) art.src = runnerAssets.runner;
  });
}

function advanceHalfInning() {
  if (state.halfInning === "top") {
    state.halfInning = "bottom";
    return;
  }
  state.halfInning = "top";
  state.inning = Math.min(9, state.inning + 1);
}

function getSkillProgress(skillId) {
  const profileProgress = getProfileProgress();
  if (!profileProgress.skills[skillId]) {
    profileProgress.skills[skillId] = {
      attempts: 0,
      correct: 0,
      firstTryCorrect: 0,
      hinted: 0,
      recent: [],
      totalResponseMs: 0,
      mastery: 0,
    };
  }
  return profileProgress.skills[skillId];
}

function masteryFor(skillId) {
  return getSkillProgress(skillId).mastery || 0;
}

function masteryForQuestion(questionId) {
  const attempts = getProfileProgress().attempts.filter((attempt) => attempt.questionId === questionId).slice(-6);
  if (attempts.length < 2) return 0;
  const correct = attempts.filter((attempt) => attempt.correct).length / attempts.length;
  const firstTry = attempts.filter((attempt) => attempt.correct && attempt.firstTry).length / attempts.length;
  return Math.round((correct * 0.65 + firstTry * 0.35) * 100);
}

function updateMastery(skillId, correct, firstTry, hintLevel, responseMs) {
  const skill = getSkillProgress(skillId);
  skill.attempts += 1;
  if (correct) skill.correct += 1;
  if (firstTry && correct) skill.firstTryCorrect += 1;
  if (hintLevel > 0) skill.hinted += 1;
  skill.totalResponseMs += responseMs || 0;
  skill.recent.push(correct ? 1 : 0);
  skill.recent = skill.recent.slice(-10);
  const accuracy = skill.correct / skill.attempts;
  const recentAccuracy = skill.recent.reduce((sum, item) => sum + item, 0) / skill.recent.length;
  const independence = skill.correct ? Math.max(0, (skill.correct - skill.hinted * 0.45) / skill.correct) : 0;
  skill.mastery = Math.round((accuracy * 0.45 + recentAccuracy * 0.35 + independence * 0.2) * 100);
  const attempt = {
    questionId: state.current.id,
    skillId,
    correct,
    firstTry,
    hintLevel,
    responseMs,
    timestamp: Date.now(),
  };
  const profileProgress = getProfileProgress();
  profileProgress.attempts.push(attempt);
  profileProgress.attempts = profileProgress.attempts.slice(-80);
  saveProgress();
}

function loadTtsSettings() {
  try {
    return { voice: "nova", fallbackVoiceURI: "", ...JSON.parse(localStorage.getItem(TTS_SETTINGS_KEY)) };
  } catch {
    return { voice: "nova", fallbackVoiceURI: "" };
  }
}

function saveTtsSettings() {
  localStorage.setItem(TTS_SETTINGS_KEY, JSON.stringify({ voice: state.tts.voice, fallbackVoiceURI: state.tts.fallbackVoiceURI }));
}

async function initTts() {
  if (new URLSearchParams(window.location.search).get("settings") === "1") {
    document.body.classList.add("show-settings");
  }
  if (els.voiceSelect) {
    els.voiceSelect.value = state.tts.voice;
    els.voiceSelect.addEventListener("change", () => {
      state.tts.voice = els.voiceSelect.value;
      state.tts.audioCache.clear();
      saveTtsSettings();
      precacheTts();
    });
  }
  if (els.browserVoiceSelect) {
    els.browserVoiceSelect.value = state.tts.fallbackVoiceURI;
    els.browserVoiceSelect.addEventListener("change", () => {
      state.tts.fallbackVoiceURI = els.browserVoiceSelect.value;
      saveTtsSettings();
    });
  }
  loadBrowserVoices();
  try {
    const response = await fetch("/api/tts/config");
    if (!response.ok) throw new Error("TTS server unavailable");
    const config = await response.json();
    state.tts.provider = config.provider;
    state.tts.voice = config.voices?.[state.tts.voice] ? state.tts.voice : config.defaultVoice || state.tts.voice;
    updateTtsStatus(config.provider === "openai" ? `Voice: OpenAI ${state.tts.voice}` : "Voice: offline fallback");
    if (els.voiceSelect && config.voices) {
      els.voiceSelect.innerHTML = Object.keys(config.voices)
        .map((voice) => `<option value="${voice}">${voice[0].toUpperCase()}${voice.slice(1)}</option>`)
        .join("");
      els.voiceSelect.value = state.tts.voice;
    }
    precacheTts();
  } catch {
    state.tts.provider = "offline-fallback";
    updateTtsStatus("Voice: offline fallback");
    loadBrowserVoices();
  } finally {
    els.startGame.disabled = false;
    els.startGame.textContent = "Play Ball";
  }
}

function updateTtsStatus(text) {
  if (els.ttsStatus) els.ttsStatus.textContent = text;
}

function precacheTts() {
  if (state.tts.provider !== "openai") return;
  const items = [
    ...questionBank.flatMap((question) => [
      { text: readingText(question.target), category: "reading" },
      { text: question.spokenPrompt, category: "announcer" },
    ]),
    "Here comes the pitch!",
    "Great hit!",
    "Runner scores!",
    "Home run!",
    "Out!",
  ].map((item) => (typeof item === "string" ? { text: item, category: "announcer" } : item));
  fetch("/api/tts/precache", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voice: state.tts.voice, items }),
  }).catch(() => {});
}

function readingText(word) {
  return `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}.`;
}

async function playSpeech(text, category = "announcer") {
  if (!state.sound || !text) return;
  stopSpeech();
  if (state.tts.provider === "openai") {
    try {
      const audio = await getNeuralAudio(text, category);
      state.tts.currentAudio = audio;
      audio.currentTime = 0;
      audio.volume = category === "reading" ? 0.94 : 0.98;
      await audio.play();
      await new Promise((resolve) => {
        audio.onended = resolve;
        audio.onerror = resolve;
      });
      return;
    } catch (error) {
      console.warn("Neural TTS failed; using offline fallback.", error);
      state.tts.provider = "offline-fallback";
      loadBrowserVoices();
    }
  }
  await fallbackSpeech(text, category);
}

async function playSpeechSequence(items) {
  for (const item of items) {
    await playSpeech(item.text, item.category);
    await waitMs(item.pauseMs || 120);
  }
}

function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getNeuralAudio(text, category) {
  const key = `${state.tts.voice}|${category}|${text}`;
  if (!state.tts.audioCache.has(key)) {
    const params = new URLSearchParams({ text, category, voice: state.tts.voice });
    const response = await fetch(`/api/tts/audio?${params.toString()}`);
    if (!response.ok) throw new Error(`TTS audio request failed: ${response.status}`);
    const blob = await response.blob();
    state.tts.audioCache.set(key, new Audio(URL.createObjectURL(blob)));
  }
  return state.tts.audioCache.get(key);
}

function stopSpeech() {
  if (state.tts.currentAudio) {
    state.tts.currentAudio.pause();
    state.tts.currentAudio.currentTime = 0;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function loadBrowserVoices() {
  if (!("speechSynthesis" in window)) return;
  state.voices = window.speechSynthesis.getVoices();
  renderBrowserVoiceSettings();
}

function getFallbackVoice() {
  const voices = state.voices;
  const selected = voices.find((voice) => voice.voiceURI === state.tts.fallbackVoiceURI);
  if (selected) return selected;
  return (
    voices.find((voice) => voice.lang.startsWith("en") && /microsoft.*natural/i.test(voice.name)) ||
    voices.find((voice) => voice.lang.startsWith("en") && /microsoft.*online/i.test(voice.name)) ||
    voices.find((voice) => voice.lang.startsWith("en") && !/zira|female|hazel/i.test(voice.name)) ||
    voices.find((voice) => voice.name === "Google US English") ||
    voices.find((voice) => voice.lang.startsWith("en") && /natural|online/i.test(voice.name)) ||
    voices.find((voice) => voice.lang.startsWith("en")) ||
    null
  );
}

function renderBrowserVoiceSettings() {
  if (!els.browserVoiceSelect) return;
  const englishVoices = state.voices
    .filter((voice) => voice.lang.startsWith("en"))
    .sort((a, b) => fallbackVoiceScore(b) - fallbackVoiceScore(a) || a.name.localeCompare(b.name));
  const bestVoice = getFallbackVoice();
  const options = [
    `<option value="">Auto: ${bestVoice ? bestVoice.name : "best detected English voice"}</option>`,
    ...englishVoices.map((voice) => `<option value="${escapeAttribute(voice.voiceURI)}">${escapeHtml(voice.name)} (${escapeHtml(voice.lang)})</option>`),
  ];
  els.browserVoiceSelect.innerHTML = options.join("");
  els.browserVoiceSelect.value = state.tts.fallbackVoiceURI;
}

function fallbackVoiceScore(voice) {
  const name = voice.name.toLowerCase();
  if (voice.lang === "en-US" && name.includes("microsoft") && name.includes("natural")) return 100;
  if (name.includes("microsoft") && name.includes("natural")) return 90;
  if (voice.lang === "en-US" && name.includes("microsoft") && name.includes("online")) return 80;
  if (name.includes("microsoft") && name.includes("online")) return 70;
  if (voice.name === "Google US English") return 50;
  if (voice.lang.startsWith("en")) return 20;
  return 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function fallbackSpeech(text, category) {
  if (!("speechSynthesis" in window)) return Promise.resolve();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getFallbackVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = category === "reading" ? 0.76 : 0.92;
  utterance.pitch = category === "reading" ? 0.96 : 1.02;
  utterance.volume = category === "reading" ? 0.94 : 0.98;
  const done = new Promise((resolve) => {
    utterance.onend = resolve;
    utterance.onerror = resolve;
  });
  window.speechSynthesis.speak(utterance);
  return done;
}

function speak(text, category = "announcer") {
  void playSpeech(text, category);
}

function playHitSound() {
  const context = getAudioContext();
  if (!context || !state.sound) return;
  const now = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(520, now + 0.07);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.34, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
  osc.connect(gain).connect(context.destination);
  osc.start(now);
  osc.stop(now + 0.14);
}

function playCheerSound() {
  const context = getAudioContext();
  if (!context || !state.sound) return;
  const now = context.currentTime;
  for (let i = 0; i < 5; i += 1) {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "sine";
    osc.frequency.value = 360 + i * 70;
    gain.gain.setValueAtTime(0.001, now + i * 0.035);
    gain.gain.exponentialRampToValueAtTime(0.06, now + i * 0.035 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.035 + 0.2);
    osc.connect(gain).connect(context.destination);
    osc.start(now + i * 0.035);
    osc.stop(now + i * 0.035 + 0.22);
  }
}

function getAudioContext() {
  if (!window.AudioContext && !window.webkitAudioContext) return null;
  if (!state.audioContext) state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (state.audioContext.state === "suspended") state.audioContext.resume();
  return state.audioContext;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function chooseQuestion() {
  const stageLimit = getStageLimit();
  const questions = questionBank.filter((question) => question.stage <= stageLimit);
  const recentMisses = getRecentMissedQuestionIds();
  const weightedQuestions = questions.flatMap((question) => {
    const mastery = masteryForQuestion(question.id);
    let weight = mastery >= 80 ? 1 : mastery < 40 ? 4 : 2;
    if (currentBaseballContexts().includes(question.context)) weight += 2;
    if (recentMisses.has(question.id)) weight += 6;
    return Array.from({ length: weight }, () => question);
  });
  return weightedQuestions[Math.floor(Math.random() * weightedQuestions.length)] || questionBank[0];
}

function getRecentMissedQuestionIds() {
  const attempts = getProfileProgress().attempts.slice(-12);
  const corrected = new Set(attempts.filter((attempt) => attempt.correct).map((attempt) => attempt.questionId));
  return new Set(attempts.filter((attempt) => !attempt.correct && !corrected.has(attempt.questionId)).map((attempt) => attempt.questionId));
}

function currentBaseballContexts() {
  const occupiedBases = getOccupiedRunners().length;
  if (occupiedBases === 0) return ["swing", "pitch", "ball", "cap"];
  if (state.bases.first || state.bases.second) return ["base", "run", "field", "catch"];
  return ["home", "score", "team", "base"];
}

function getStageLimit() {
  const attempts = getProfileProgress().attempts.filter((attempt) => attempt.skillId === "spokenWord");
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const recent = attempts.slice(-8);
  const recentAccuracy = recent.length ? recent.filter((attempt) => attempt.correct).length / recent.length : 0;
  if (correct >= 24 && recentAccuracy >= 0.72) return 5;
  if (correct >= 16 && recentAccuracy >= 0.68) return 4;
  if (correct >= 10 && recentAccuracy >= 0.64) return 3;
  if (correct >= 5 && recentAccuracy >= 0.6) return 2;
  return 1;
}

function renderQuestion() {
  syncHalfInningRoles();
  renderCharacterAssets();
  const question = chooseQuestion();
  const profile = getProfile();
  state.current = question;
  state.currentAttemptStartedAt = Date.now();
  state.hintLevel = 0;
  state.buildIndex = 0;
  state.wrongAttempts = 0;
  state.answeringLocked = true;
  els.shell.classList.remove("pitching", "hit-flight", "try-again", "at-bat-ready", "celebrating", "hit-single", "hit-double", "hit-triple", "hit-homer");
  els.prompt.textContent = getVisiblePrompt(question);
  els.coachLine.textContent = getCoachText(question);
  els.skillFocus.textContent = `${skillMeta[question.skillId].label}: ${question.focus}`;
  els.roundTitle.textContent = profile.name;
  setJumbotron(`${profile.name.toUpperCase()} IS UP`, `${getInningRoles().label.toUpperCase()} ${state.inning}`);
  els.feedback.textContent = "";
  renderPlayer(profile.id);
  renderTargetWord(question);
  renderPhonics(question);
  renderChoices(question);
  void els.shell.offsetWidth;
  els.shell.classList.add("pitching");
  void playSpeechSequence([
    { text: "Here comes the pitch!", category: "announcer" },
    { text: question.spokenPrompt, category: "announcer" },
  ]);
  setTimeout(() => {
    els.shell.classList.remove("pitching");
    els.shell.classList.add("at-bat-ready");
    setJumbotron("READ THE CARDS", "YOUR PICK");
    state.answeringLocked = false;
    state.currentAttemptStartedAt = Date.now();
  }, 850);
}

function getVisiblePrompt(question) {
  return "";
}

function getCoachText(question) {
  const profile = getProfile();
  return `${profile.name} is up.`;
}

function renderChoices(question) {
  const profile = getProfile();
  els.choices.innerHTML = "";
  const visibleChoices = getVisibleChoices(question, profile.maxChoices);
  els.choices.dataset.count = String(visibleChoices.length);
  visibleChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = `choice ${choice.kind === "picture" ? "picture-choice" : ""}`;
    button.type = "button";
    button.dataset.value = choice.value;
    if (choice.kind === "picture") {
      button.innerHTML = `<span class="choice-picture" aria-hidden="true">${choice.image}</span><span class="choice-label">${choice.label}</span>`;
    } else {
      button.textContent = shouldPreserveChoiceCase(choice.label) ? choice.label : choice.label.toUpperCase();
    }
    button.style.setProperty("--choice-font-size", getChoiceFontSize(choice.label));
    button.addEventListener("click", () => handleChoice(button, choice.value));
    els.choices.appendChild(button);
  });
}

function getChoiceFontSize(label) {
  const length = String(label || "").trim().length;
  if (length <= 3) return "clamp(2.05rem, 3.75vw, 3.2rem)";
  if (length <= 5) return "clamp(1.85rem, 3.35vw, 2.85rem)";
  if (length <= 7) return "clamp(1.55rem, 2.75vw, 2.28rem)";
  return "clamp(1.25rem, 2.25vw, 1.88rem)";
}

function shouldPreserveChoiceCase(label) {
  return String(label || "").includes(" ");
}

function getVisibleChoices(question, maxChoices) {
  const correct = question.choices.find((choice) => choice.value === question.target);
  const distractors = shuffle(question.choices.filter((choice) => choice.value !== question.target)).slice(0, Math.max(0, maxChoices - 1));
  return shuffle([correct, ...distractors].filter(Boolean));
}

function renderPhonics(question, activeIndex = -1, blended = false) {
  els.phonicsStrip.innerHTML = "";
}

function renderTargetWord(question) {
  els.targetWord.textContent = "";
}

function renderPlayer(profileId = "mason") {
  const profile = profiles[profileId] || profiles.mason;
  els.playerPhoto.src = profile.photo;
  els.playerPhoto.alt = profile.alt;
  els.playerName.textContent = `${profile.name} - age ${profile.age}`;
}

function handleChoice(button, value) {
  if (state.answeringLocked) return;
  const question = state.current;
  const correct = value === question.target;
  if (correct) {
    state.answeringLocked = true;
    button.classList.add("pending");
    setTimeout(() => handleCorrect(), 220);
    return;
  }
  state.hintLevel += 1;
  state.wrongAttempts += 1;
  button.classList.add("try");
  updateMastery(question.skillId, false, false, state.hintLevel, Date.now() - state.currentAttemptStartedAt);
  state.currentAttemptStartedAt = Date.now();
  handleOut(button);
}

function handleCorrect() {
  const question = state.current;
  const firstTry = state.hintLevel === 0;
  const responseMs = Date.now() - state.currentAttemptStartedAt;
  const priorMastery = masteryForQuestion(question.id);
  updateMastery(question.skillId, true, firstTry, state.hintLevel, responseMs);
  const hitValue = getHitValue(question, firstTry, priorMastery);
  const target = getDisplayTarget(question);
  els.shell.classList.remove("at-bat-ready", "try-again");
  els.shell.classList.add("celebrating");
  const reinforcement = `${target.toUpperCase()}!`;
  setJumbotron(reinforcement, hitName(hitValue).toUpperCase());
  els.feedback.textContent = "";
  speak(readingText(target).replace(".", "!"), "reading");
  setTimeout(() => {
    els.feedback.textContent = "";
    setJumbotron("GREAT HIT!", hitName(hitValue).toUpperCase());
    speak(hitValue >= 4 ? "Great hit! Home run!" : "Great hit!", "announcer");
    animateHit(hitValue);
    setTimeout(() => {
      const movementMs = updateBases(hitValue);
      setTimeout(renderQuestion, movementMs + 420);
    }, 1020);
  }, 260);
}

function getDisplayTarget(question) {
  return question.target;
}

function getHitValue(question, firstTry, priorMastery) {
  if (firstTry && state.streak >= 4) return 4;
  if (!firstTry) return 1;
  if (priorMastery >= 80) return 1;
  if (priorMastery >= 40) return 2;
  return Math.max(3, question.hitValue || 1);
}

function handleOut(button) {
  state.answeringLocked = true;
  els.shell.classList.remove("at-bat-ready", "celebrating");
  els.shell.classList.add("try-again");
  state.streak = 0;
  state.outs += 1;
  setJumbotron("OUT", "NEXT PITCH");
  if (state.outs >= 3) {
    state.outs = 0;
    resetBases();
    advanceHalfInning();
    syncHalfInningRoles();
    renderCharacterAssets();
    const nextRoles = getInningRoles();
    setJumbotron("THREE OUTS", `${nextRoles.label.toUpperCase()} ${state.inning}`);
  }
  updateScore();
  els.feedback.textContent = "OUT!";
  speak("Out!", "announcer");
  setTimeout(() => button.classList.remove("try"), 420);
  setTimeout(renderQuestion, 1500);
}

function animateHit(hitValue) {
  els.shell.classList.remove("hit-flight", "hit-single", "hit-double", "hit-triple", "hit-homer");
  setHitFlightTarget(hitValue);
  void els.shell.offsetWidth;
  setTimeout(() => {
    playHitSound();
    els.shell.classList.add(hitClass(hitValue));
    els.shell.classList.add("hit-flight");
  }, 80);
  setTimeout(playCheerSound, 640);
  setTimeout(() => {
    els.shell.classList.remove("pitching", "hit-flight", "try-again");
  }, 1700);
}

function setHitFlightTarget(hitValue) {
  const lanes = hitFlightTargets[Math.min(4, Math.max(1, hitValue))] || hitFlightTargets[1];
  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  els.pitchBall.style.setProperty("--hit-lift-x", `${lane.liftX}%`);
  els.pitchBall.style.setProperty("--hit-lift-y", `${lane.liftY}%`);
  els.pitchBall.style.setProperty("--hit-arc-x", `${lane.arcX}%`);
  els.pitchBall.style.setProperty("--hit-arc-y", `${lane.arcY}%`);
  els.pitchBall.style.setProperty("--hit-end-x", `${lane.endX}%`);
  els.pitchBall.style.setProperty("--hit-end-y", `${lane.endY}%`);
  els.pitchBall.style.setProperty("--hit-end-scale", lane.endScale);
  els.pitchBall.style.setProperty("--ball-trail-angle", `${lane.trailAngle}deg`);
}

function hitClass(hitValue) {
  if (hitValue >= 4) return "hit-homer";
  if (hitValue === 3) return "hit-triple";
  if (hitValue === 2) return "hit-double";
  return "hit-single";
}

function updateBases(hitValue) {
  state.streak += 1;
  const hitter = getInningRoles().hitter;
  const runners = getOccupiedRunners().sort((a, b) => b.from - a.from);
  runners.push({ player: hitter, from: 0 });

  const nextBases = createEmptyBases();
  const movements = runners.map((runner, index) => {
    const destination = getRunnerDestination(runner.from, hitValue);
    if (destination > 0) nextBases[baseByNumber[destination]] = runner.player;
    return {
      ...runner,
      id: `${Date.now()}-${index}`,
      destination,
      path: getRunnerPath(runner.from, destination),
    };
  });

  state.bases = createEmptyBases();
  syncLeadBase();
  renderBaseRunners();
  return animateRunnerAdvance(movements, nextBases);
}

function hitName(value) {
  if (value === 1) return "Single";
  if (value === 2) return "Double";
  if (value === 3) return "Triple";
  return "Home run";
}

function updateScore(renderBases = true) {
  els.runs.textContent = state.runs;
  els.inning.textContent = `${getInningRoles().label.toUpperCase()} ${state.inning}`;
  els.streak.textContent = state.outs;
  if (renderBases) renderBaseRunners();
}

function setJumbotron(status, message) {
  if (els.jumbotronStatus) els.jumbotronStatus.textContent = status;
  if (els.jumbotronMessage) els.jumbotronMessage.textContent = message;
}

function getRunnerDestination(fromBase, hitValue) {
  if (hitValue >= 4) return 0;
  const destination = fromBase + hitValue;
  return destination >= 4 ? 0 : destination;
}

function getRunnerPath(fromBase, destination) {
  const path = [];
  if (destination === 0) {
    for (let base = fromBase + 1; base <= 4; base += 1) {
      path.push(base === 4 ? 0 : base);
    }
    return path;
  }
  for (let base = fromBase + 1; base <= destination; base += 1) {
    path.push(base);
  }
  return path;
}

function animateRunnerAdvance(movements, nextBases) {
  let longestMs = 0;
  els.runners.forEach(hideRunner);
  movements.forEach((movement, index) => {
    const runner = els.runners[index];
    if (!runner) return;
    setRunnerPlayer(runner, movement.player);
    setRunnerBase(runner, movement.from, false, true);
    movement.path.forEach((base, stepIndex) => {
      const delay = index * 90 + stepIndex * 430;
      longestMs = Math.max(longestMs, delay + 460);
      setTimeout(() => {
        setRunnerBase(runner, base, true, true);
        if (base === 0) {
          state.runs += 1;
          els.runs.textContent = state.runs;
        }
      }, delay);
    });
    setTimeout(() => {
      if (movement.destination === 0) {
        hideRunner(runner);
        return;
      }
      setRunnerBase(runner, movement.destination, false, true);
    }, index * 90 + movement.path.length * 430 + 40);
  });
  setTimeout(() => {
    state.bases = nextBases;
    syncLeadBase();
    if (movements.some((movement) => movement.destination === 0)) {
      els.feedback.textContent += " Runner scores!";
      speak("Runner scores!", "announcer");
    }
    updateScore();
  }, longestMs + 120);
  return longestMs + 120;
}

function renderBaseRunners() {
  els.runners.forEach(hideRunner);
  baseNames.forEach((baseName, index) => {
    const player = state.bases[baseName];
    if (!player) return;
    const runner = els.runners[index];
    if (!runner) return;
    setRunnerPlayer(runner, player);
    setRunnerBase(runner, index + 1, false, true);
  });
}

function setRunnerPlayer(runner, playerId) {
  runner.dataset.runnerPlayer = playerId;
  const assets = characterAssets[playerId] || characterAssets.mason;
  const art = runner.querySelector(".sprite-art");
  if (art) art.src = assets.runner;
}

function setRunnerBase(runner, base, moving = false, occupied = false) {
  runner.className = "runner baseball-sprite runner-sprite";
  if (occupied) runner.classList.add("occupied");
  if (moving) runner.classList.add("running");
  if (base === 1) runner.classList.add("base-1");
  if (base === 2) runner.classList.add("base-2");
  if (base === 3) runner.classList.add("base-3");
  if (base === 0) runner.classList.add("home");
  positionRunner(runner, base, moving);
}

function hideRunner(runner) {
  runner.className = "runner baseball-sprite runner-sprite";
  delete runner.dataset.runnerPlayer;
  runner.style.removeProperty("left");
  runner.style.removeProperty("top");
  runner.style.removeProperty("transform");
}

function positionRunner(runner, base, moving = false) {
  const baseName = baseByNumber[base];
  const coordinates = !moving && runnerLeadCoordinates[baseName] ? runnerLeadCoordinates[baseName] : baseCoordinates[baseName];
  if (!coordinates) return;
  runner.style.setProperty("left", `${coordinates.x}%`, "important");
  runner.style.setProperty("top", `${coordinates.y}%`, "important");
  runner.style.setProperty("transform", `translate(-50%, -50%) scale(${coordinates.scale})`, "important");
}

function syncLeadBase() {
  const leadIndex = baseNames.reduce((lead, baseName, index) => (state.bases[baseName] ? index + 1 : lead), 0);
  state.base = leadIndex;
}

function getOccupiedRunners() {
  return baseNames
    .map((baseName, index) => (state.bases[baseName] ? { player: state.bases[baseName], from: index + 1 } : null))
    .filter(Boolean);
}

function resetBases() {
  state.base = 0;
  state.bases = createEmptyBases();
  renderBaseRunners();
}

function getRoundTitle() {
  if (state.mode === "sentence") return "Sentence Sprint";
  if (state.mode === "rhyme") return "Rhyme Catch";
  return "Word Hit";
}

function setProfile(profileId, shouldRender = state.gameStarted) {
  state.halfInning = profileId === "rumi" ? "bottom" : "top";
  syncHalfInningRoles();
  state.runs = 0;
  state.inning = 1;
  state.streak = 0;
  resetBases();
  state.outs = 0;
  els.shell.dataset.profile = state.activeProfileId;
  renderCharacterAssets();
  syncHalfInningRoles();
  updateScore();
  if (shouldRender) renderQuestion();
}

els.listen.addEventListener("click", () => {
  if (!state.current) return;
  speak(readingText(state.current.target), "reading");
});

els.startGame.addEventListener("click", () => {
  state.gameStarted = true;
  els.shell.classList.add("started");
  ttsReady.finally(() => setProfile(state.activeProfileId, true));
});

els.newPitch.addEventListener("click", renderQuestion);

els.easyMode.addEventListener("change", () => {
  if (!state.current) return;
  els.coachLine.textContent = els.easyMode.checked ? getCoachText(state.current) : "Listen. Read. Swing.";
});

els.soundToggle.addEventListener("click", () => {
  state.sound = !state.sound;
  els.soundToggle.textContent = state.sound ? "Pause" : "Play";
  if (!state.sound && "speechSynthesis" in window) window.speechSynthesis.cancel();
});

els.profileButtons.forEach((button) => {
  button.addEventListener("click", () => setProfile(button.dataset.profile));
});

els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.mode = tab.dataset.mode;
    els.tabs.forEach((item) => item.classList.toggle("active", item === tab));
    renderQuestion();
  });
});

updateScore();
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = loadBrowserVoices;
}
ttsReady = initTts();
ttsReady.finally(() => {
  setProfile(state.activeProfileId, false);
});
