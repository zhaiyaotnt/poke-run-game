(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const ui = {
    start: document.getElementById("startScreen"),
    pause: document.getElementById("pauseScreen"),
    win: document.getElementById("winScreen"),
    effort: document.getElementById("effortScreen"),
    over: document.getElementById("gameOverScreen"),
    startButton: document.getElementById("startButton"),
    resumeButton: document.getElementById("resumeButton"),
    pauseButton: document.getElementById("pauseButton"),
    gymExitButton: document.getElementById("gymExitButton"),
    throwPad: document.getElementById("throwPad"),
    targetChip: document.getElementById("targetChip"),
    targetName: document.getElementById("targetName"),
    targetStatus: document.getElementById("targetStatus"),
    caught: document.getElementById("caughtCount"),
    balls: document.getElementById("ballCount"),
    ballInventory: document.getElementById("ballInventory"),
    ballIcon: document.getElementById("selectedBallIcon"),
    ballTypeName: document.getElementById("ballTypeName"),
    throwBall: document.getElementById("throwBall"),
    throwLabel: document.getElementById("throwLabel"),
    hearts: [...document.querySelectorAll("#hearts span")],
    progress: document.getElementById("progressFill"),
    finalCaught: document.getElementById("finalCaught"),
    effortCaught: document.getElementById("effortCaught"),
    overTitle: document.getElementById("gameOverTitle"),
    overReason: document.getElementById("gameOverReason"),
    toast: document.getElementById("toast"),
    game: document.getElementById("game"),
    difficultyButtons: [...document.querySelectorAll("[data-difficulty]")],
    difficultyDescription: document.getElementById("difficultyDescription"),
    customControls: document.getElementById("customControls"),
    customSpeed: document.getElementById("customSpeed"),
    customSpeedValue: document.getElementById("customSpeedValue"),
    customObstacles: document.getElementById("customObstacles"),
    customObstaclesValue: document.getElementById("customObstaclesValue"),
    customBalls: document.getElementById("customBalls"),
    customBallsValue: document.getElementById("customBallsValue"),
    customPokemon: document.getElementById("customPokemon"),
    customPokemonValue: document.getElementById("customPokemonValue"),
    customRouteLength: document.getElementById("customRouteLength"),
    customRouteLengthValue: document.getElementById("customRouteLengthValue"),
    titlePokemonLeft: document.getElementById("titlePokemonLeft"),
    titlePokemonRight: document.getElementById("titlePokemonRight"),
    menuButtons: [...document.querySelectorAll(".menu-button")]
  };

  const TAU = Math.PI * 2;
  const BALL_ORDER = ["poke", "great", "ultra", "master"];
  const BALL_TYPES = {
    poke: { label: "POKÉ", fullLabel: "POKÉ BALL", range: .27, pickupColor: "#ef5050" },
    great: { label: "GREAT", fullLabel: "GREAT BALL", range: .43, pickupColor: "#3e7ed0" },
    ultra: { label: "ULTRA", fullLabel: "ULTRA BALL", range: .61, pickupColor: "#f0c936" },
    master: { label: "MASTER", fullLabel: "MASTER BALL", range: Infinity, pickupColor: "#9a5fbd" }
  };
  // National Pokédex height values in meters, sourced from PokeAPI.
  const creatureData = [
    [1,"bulbasaur",.7],[2,"ivysaur",1],[3,"venusaur",2],[4,"charmander",.6],[5,"charmeleon",1.1],[6,"charizard",1.7],
    [7,"squirtle",.5],[8,"wartortle",1],[9,"blastoise",1.6],[10,"caterpie",.3],[11,"metapod",.7],[12,"butterfree",1.1],
    [13,"weedle",.3],[14,"kakuna",.6],[15,"beedrill",1],[16,"pidgey",.3],[17,"pidgeotto",1.1],[18,"pidgeot",1.5],
    [19,"rattata",.3],[20,"raticate",.7],[21,"spearow",.3],[22,"fearow",1.2],[23,"ekans",2],[24,"arbok",3.5],
    [25,"pikachu",.4],[26,"raichu",.8],[27,"sandshrew",.6],[28,"sandslash",1],[29,"nidoran-f",.4],[30,"nidorina",.8],
    [31,"nidoqueen",1.3],[32,"nidoran-m",.5],[33,"nidorino",.9],[34,"nidoking",1.4],[35,"clefairy",.6],[36,"clefable",1.3],
    [37,"vulpix",.6],[38,"ninetales",1.1],[39,"jigglypuff",.5],[40,"wigglytuff",1],[41,"zubat",.8],[42,"golbat",1.6],
    [43,"oddish",.5],[44,"gloom",.8],[45,"vileplume",1.2],[46,"paras",.3],[47,"parasect",1],[48,"venonat",1],
    [49,"venomoth",1.5],[50,"diglett",.2],[51,"dugtrio",.7],[52,"meowth",.4],[53,"persian",1],[54,"psyduck",.8],
    [55,"golduck",1.7],[56,"mankey",.5],[57,"primeape",1],[58,"growlithe",.7],[59,"arcanine",1.9],[60,"poliwag",.6],
    [61,"poliwhirl",1],[62,"poliwrath",1.3],[63,"abra",.9],[64,"kadabra",1.3],[65,"alakazam",1.5],[66,"machop",.8],
    [67,"machoke",1.5],[68,"machamp",1.6],[69,"bellsprout",.7],[70,"weepinbell",1],[71,"victreebel",1.7],[72,"tentacool",.9],
    [73,"tentacruel",1.6],[74,"geodude",.4],[75,"graveler",1],[76,"golem",1.4],[77,"ponyta",1],[78,"rapidash",1.7],
    [79,"slowpoke",1.2],[80,"slowbro",1.6],[81,"magnemite",.3],[82,"magneton",1],[83,"farfetchd",.8],[84,"doduo",1.4],
    [85,"dodrio",1.8],[86,"seel",1.1],[87,"dewgong",1.7],[88,"grimer",.9],[89,"muk",1.2],[90,"shellder",.3],
    [91,"cloyster",1.5],[92,"gastly",1.3],[93,"haunter",1.6],[94,"gengar",1.5],[95,"onix",8.8],[96,"drowzee",1],
    [97,"hypno",1.6],[98,"krabby",.4],[99,"kingler",1.3],[100,"voltorb",.5],[101,"electrode",1.2],[102,"exeggcute",.4],
    [103,"exeggutor",2],[104,"cubone",.4],[105,"marowak",1],[106,"hitmonlee",1.5],[107,"hitmonchan",1.4],[108,"lickitung",1.2],
    [109,"koffing",.6],[110,"weezing",1.2],[111,"rhyhorn",1],[112,"rhydon",1.9],[113,"chansey",1.1],[114,"tangela",1],
    [115,"kangaskhan",2.2],[116,"horsea",.4],[117,"seadra",1.2],[118,"goldeen",.6],[119,"seaking",1.3],[120,"staryu",.8],
    [121,"starmie",1.1],[122,"mr-mime",1.3],[123,"scyther",1.5],[124,"jynx",1.4],[125,"electabuzz",1.1],[126,"magmar",1.3],
    [127,"pinsir",1.5],[128,"tauros",1.4],[129,"magikarp",.9],[130,"gyarados",6.5],[131,"lapras",2.5],[132,"ditto",.3],
    [133,"eevee",.3],[134,"vaporeon",1],[135,"jolteon",.8],[136,"flareon",.9],[137,"porygon",.8],[138,"omanyte",.4],
    [139,"omastar",1],[140,"kabuto",.5],[141,"kabutops",1.3],[142,"aerodactyl",1.8],[143,"snorlax",2.1],[144,"articuno",1.7],
    [145,"zapdos",1.6],[146,"moltres",2],[147,"dratini",1.8],[148,"dragonair",4],[149,"dragonite",2.2],[150,"mewtwo",2],
    [151,"mew",.4],[152,"chikorita",.9],[153,"bayleef",1.2],[154,"meganium",1.8],[155,"cyndaquil",.5],[156,"quilava",.9],
    [157,"typhlosion",1.7],[158,"totodile",.6],[159,"croconaw",1.1],[160,"feraligatr",2.3],[172,"pichu",.3],[174,"igglybuff",.3],
    [175,"togepi",.3],[176,"togetic",.6],[196,"espeon",.9],[197,"umbreon",1],[249,"lugia",5.2],[250,"ho-oh",3.8],
    [251,"celebi",.6],[280,"ralts",.4],[281,"kirlia",.8],[282,"gardevoir",1.6],[382,"kyogre",4.5],[383,"groudon",3.5],
    [384,"rayquaza",7],[385,"jirachi",.3],[386,"deoxys-normal",1.7],[446,"munchlax",.6],[447,"riolu",.7],[448,"lucario",1.2],
    [468,"togekiss",1.5],[470,"leafeon",1],[471,"glaceon",.8],[475,"gallade",1.6],[483,"dialga",5.4],[484,"palkia",4.2],
    [487,"giratina-altered",4.5],[493,"arceus",3.2],[570,"zorua",.7],[571,"zoroark",1.6],[643,"reshiram",3.2],[644,"zekrom",2.9],
    [646,"kyurem",3],[656,"froakie",.3],[657,"frogadier",.6],[658,"greninja",1.5],[700,"sylveon",1],[716,"xerneas",3],
    [717,"yveltal",5.8],[722,"rowlet",.3],[723,"dartrix",.7],[724,"decidueye",1.6],[791,"solgaleo",3.4],[792,"lunala",4],
    [810,"grookey",.3],[811,"thwackey",.7],[812,"rillaboom",2.1],[813,"scorbunny",.3],[814,"raboot",.6],[815,"cinderace",1.4],
    [816,"sobble",.3],[817,"drizzile",.7],[818,"inteleon",1.9],[888,"zacian",2.8],[889,"zamazenta",2.9],[906,"sprigatito",.4],
    [907,"floragato",.9],[908,"meowscarada",1.5],[909,"fuecoco",.4],[910,"crocalor",1],[911,"skeledirge",1.6],[912,"quaxly",.5],
    [913,"quaxwell",1.2],[914,"quaquaval",1.8],[1007,"koraidon",2.5],[1008,"miraidon",3.5]
  ];
  const LEGENDARY_DEX = new Set([144,145,146,150,151,249,250,251,382,383,384,385,386,483,484,487,493,643,644,646,716,717,791,792,888,889,1007,1008]);
  const ICONIC_DEX = new Set([1,4,7,25,26,35,37,39,52,54,58,63,74,77,79,92,94,104,113,123,129,130,131,132,133,143,147,149]);
  const creatureRoster = creatureData.map(([dex, type, heightM]) => ({
    dex,
    type,
    heightM,
    name: type.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join(" "),
    legendary: LEGENDARY_DEX.has(dex),
    iconic: ICONIC_DEX.has(dex),
    color: "#78c99a",
    asset: `assets/pokemon-3d/${dex}.png`
  }));

  function setTitlePokemon(element, creature, fallback) {
    if (!element || !creature) return;
    element.classList.remove("is-ready");
    element.dataset.dex = String(creature.dex);
    element.title = creature.name;
    let triedFallback = false;
    element.onload = () => element.classList.add("is-ready");
    element.onerror = () => {
      if (triedFallback || !fallback || creature.dex === fallback.dex) return;
      triedFallback = true;
      element.title = fallback.name;
      element.src = fallback.asset;
    };
    element.src = creature.asset;
    if (element.complete && element.naturalWidth) element.classList.add("is-ready");
  }

  function randomizeTitlePokemon() {
    const left = creatureRoster[Math.floor(Math.random() * creatureRoster.length)];
    let right = creatureRoster[Math.floor(Math.random() * creatureRoster.length)];
    while (right.dex === left.dex) right = creatureRoster[Math.floor(Math.random() * creatureRoster.length)];
    setTitlePokemon(ui.titlePokemonLeft, left, creatureRoster.find(creature => creature.dex === 25));
    setTitlePokemon(ui.titlePokemonRight, right, creatureRoster.find(creature => creature.dex === 150));
  }

  function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  // Keep only a small working set decoded. Eagerly decoding the full roster
  // causes long main-thread stalls on devices with modest graphics memory.
  const pokemonImages = new Map();
  const MAX_POKEMON_IMAGES = 18;

  function getPokemonImage(creature) {
    let image = pokemonImages.get(creature.type);
    if (!image) {
      image = new Image();
      image.decoding = "async";
      image.fetchPriority = "high";
      image.src = creature.asset;
      pokemonImages.set(creature.type, image);

      if (pokemonImages.size > MAX_POKEMON_IMAGES) {
        const visibleTypes = new Set([...state.creatures, ...state.gymCreatures].map(candidate => candidate.type));
        visibleTypes.add(creature.type);
        for (const type of pokemonImages.keys()) {
          if (!visibleTypes.has(type)) {
            pokemonImages.delete(type);
            break;
          }
        }
      }
    }
    return image;
  }
  const trainerWalkSheet = loadImage("assets/trainer/go-protagonist-walk-sheet.png");
  const trainerBackPose = loadImage("assets/trainer/go-protagonist-back-3d.png");
  const trainerFrontPose = loadImage("assets/trainer/go-protagonist-male.png");
  const meadowBackdrop = loadImage("assets/environment/alpine-meadow-ground-v2.jpg");
  meadowBackdrop.decoding = "async";
  const trainerFrameAnchors = Array.from({ length: 4 }, () => ({ centerX: .5, bottom: 1 }));

  function calibrateTrainerFrames() {
    const sampleWidth = 136;
    const sampleHeight = 181;
    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = sampleWidth;
    sampleCanvas.height = sampleHeight;
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    const cellWidth = trainerWalkSheet.naturalWidth / 2;
    const cellHeight = trainerWalkSheet.naturalHeight / 2;

    for (let frame = 0; frame < 4; frame++) {
      sampleCtx.clearRect(0, 0, sampleWidth, sampleHeight);
      sampleCtx.drawImage(
        trainerWalkSheet,
        (frame % 2) * cellWidth,
        Math.floor(frame / 2) * cellHeight,
        cellWidth,
        cellHeight,
        0,
        0,
        sampleWidth,
        sampleHeight
      );
      const pixels = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight).data;
      let minX = sampleWidth;
      let maxX = 0;
      let maxY = 0;
      for (let y = 0; y < sampleHeight; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          if (pixels[(y * sampleWidth + x) * 4 + 3] > 24) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }
      if (minX < sampleWidth) {
        trainerFrameAnchors[frame] = {
          centerX: ((minX + maxX) / 2 + .5) / sampleWidth,
          bottom: (maxY + 1) / sampleHeight
        };
      }
    }
  }

  if (trainerWalkSheet.complete && trainerWalkSheet.naturalWidth) calibrateTrainerFrames();
  else trainerWalkSheet.addEventListener("load", calibrateTrainerFrames, { once: true });

  const DIFFICULTIES = {
    explorer: {
      label: "EXPLORER",
      laneCount: 5,
      laneGapRate: 0,
      speed: .081,
      obstacleRate: .3024,
      startingInventory: { poke: 3, great: 1, ultra: 1, master: 0 },
      initialObstacleCount: 4,
      centerObstacleMinimum: 2,
      encounterCount: 4,
      routeLength: 30,
      bridgeStarts: [],
      description: "Five open lanes • 3 gyms • 30 sightings • 3 Poké + 1 Great + 1 Ultra"
    },
    trainer: {
      label: "TRAINER",
      laneCount: 3,
      laneGapRate: .32,
      speed: .0929,
      obstacleRate: .486,
      startingInventory: { poke: 2, great: 1, ultra: 0, master: 0 },
      initialObstacleCount: 5,
      centerObstacleMinimum: 2,
      encounterCount: 3,
      routeLength: 30,
      bridgeStarts: [],
      description: "Three lanes • occasional lane gaps • 3 gyms • 30 sightings • 2 Poké + 1 Great"
    },
    master: {
      label: "MASTER",
      laneCount: 3,
      laneGapRate: .56,
      speed: .108,
      obstacleRate: .6696,
      startingInventory: { poke: 1, great: 1, ultra: 0, master: 0 },
      initialObstacleCount: 7,
      centerObstacleMinimum: 3,
      encounterCount: 3,
      routeLength: 30,
      bridgeStarts: [],
      description: "Three lanes • frequent lane gaps • 3 gyms • 30 sightings • 1 Poké + 1 Great"
    },
    legend: {
      label: "LEGEND",
      laneCount: 3,
      laneGapRate: .78,
      speed: .1242,
      obstacleRate: .7776,
      startingInventory: { poke: 1, great: 0, ultra: 0, master: 0 },
      initialObstacleCount: 8,
      centerObstacleMinimum: 3,
      encounterCount: 2,
      routeLength: 30,
      bridgeStarts: [],
      description: "Three lanes • long lane gaps • 3 gyms • 30 sightings • 1 Poké Ball • maximum hazards"
    },
    custom: {
      label: "CUSTOM",
      laneCount: 3,
      laneGapRate: .48,
      speed: .090,
      obstacleRate: .50,
      startingInventory: { poke: 3, great: 1, ultra: 1, master: 0 },
      initialObstacleCount: 5,
      centerObstacleMinimum: 2,
      encounterCount: 3,
      routeLength: 30,
      bridgeStarts: [],
      customCounts: true,
      customBallCount: 5,
      description: "Custom • 100% speed • 5 obstacles • 5 balls • 3 gyms • 3 on screen • 30 sightings"
    }
  };

  function inventoryForTotal(total) {
    const inventory = { poke: 0, great: 0, ultra: 0, master: 0 };
    const distribution = ["poke", "poke", "great", "poke", "ultra", "great", "poke", "master"];
    for (let i = 0; i < total; i++) inventory[distribution[i % distribution.length]]++;
    return inventory;
  }

  function setCustomControlsVisible(visible) {
    ui.start.classList.toggle("custom-active", visible);
    ui.customControls.classList.toggle("hidden", !visible);
    ui.customControls.setAttribute("aria-hidden", String(!visible));
  }

  function updateCustomDifficulty() {
    const speedPercent = Number(ui.customSpeed.value);
    const obstacleCount = Number(ui.customObstacles.value);
    const ballCount = Number(ui.customBalls.value);
    const encounterCount = Number(ui.customPokemon.value);
    const routeLength = Number(ui.customRouteLength.value);
    const custom = DIFFICULTIES.custom;
    custom.speed = .09 * speedPercent / 100;
    custom.obstacleRate = obstacleCount / Math.max(1, obstacleCount + ballCount);
    custom.laneGapRate = Math.min(.78, obstacleCount / 10 * .78);
    custom.initialObstacleCount = obstacleCount;
    custom.customBallCount = ballCount;
    custom.centerObstacleMinimum = obstacleCount === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil(obstacleCount * .4)));
    custom.encounterCount = encounterCount;
    custom.routeLength = routeLength;
    custom.startingInventory = inventoryForTotal(ballCount);
    custom.description = `Custom • ${speedPercent}% speed • ${obstacleCount} obstacles • ${ballCount} balls • 3 gyms • ${encounterCount} on screen • ${routeLength} sightings`;
    ui.customSpeedValue.textContent = `${speedPercent}%`;
    ui.customObstaclesValue.textContent = String(obstacleCount);
    ui.customBallsValue.textContent = String(ballCount);
    ui.customPokemonValue.textContent = String(encounterCount);
    ui.customRouteLengthValue.textContent = `${routeLength} SIGHTINGS`;
    if (state.difficulty === "custom") {
      ui.difficultyDescription.textContent = custom.description;
      updateHUD();
    }
  }

  const state = {
    mode: "intro",
    lane: 0,
    visualLane: 0,
    playerZ: .89,
    visualZ: .89,
    health: 3,
    balls: { poke: 3, great: 2, ultra: 1, master: 1 },
    ballType: "poke",
    difficulty: "explorer",
    caught: 0,
    distance: 0,
    routeLength: 30,
    sightingsSpawned: 0,
    sightingsResolved: 0,
    finishLineActive: false,
    finishLineZ: .04,
    finishLineLastGap: null,
    finishTime: 0,
    finishWon: false,
    animTime: 0,
    forwardBoost: 0,
    speed: 0.081,
    roadSeed: 0,
    selected: null,
    thrown: null,
    flash: 0,
    shake: 0,
    invulnerable: 0,
    lastTime: 0,
    worldItems: [],
    scenery: [],
    crossings: [],
    creatures: [],
    particles: [],
    pointer: null,
    gestureHandled: false,
    gestureCandidate: null,
    ballGestureStart: null,
    ballGestureCurrent: null,
    ballGestureHandled: false,
    riverFall: false,
    fallSide: 0,
    riverFallTime: 0,
    throwing: false,
    dragCurrent: null,
    inGym: false,
    gymsEntered: 0,
    gymSchedule: [],
    gymGateIndex: 0,
    gymGateActive: false,
    gymGateZ: .04,
    gymGateLastGap: null,
    gymCreatures: [],
    gymObstacles: [],
    gymTime: 0,
    fallReason: null
  };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let toastTimer = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function activeLaneCount() {
    return state.inGym ? 5 : (DIFFICULTIES[state.difficulty].laneCount || 3);
  }

  function laneValues(count = activeLaneCount()) {
    const limit = Math.floor(count / 2);
    return Array.from({ length: count }, (_, index) => index - limit);
  }

  function randomLane(z = .04) {
    const lanes = state.inGym ? laneValues(5) : safeLanesAtWorld(state.distance - z);
    return lanes[Math.floor(Math.random() * lanes.length)] || 0;
  }
  function randomBetween(a, b) { return a + Math.random() * (b - a); }
  function easeZ(z) { return z * z; }

  function hashUnit(value) {
    const x = Math.sin(value * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  const ROAD_SEGMENT_LENGTH = .265;
  const ROAD_OBJECT_CLEARANCE = .055;

  function fullRouteLanes() {
    return laneValues(DIFFICULTIES[state.difficulty].laneCount || 3);
  }

  function roadIsForcedFull() {
    return state.finishLineActive || state.gymGateActive;
  }

  function availableLanesAtWorld(world) {
    const lanes = fullRouteLanes();
    const difficulty = DIFFICULTIES[state.difficulty];
    if (difficulty.laneCount === 5 || roadIsForcedFull()) return lanes;
    const segmentIndex = Math.floor(world / ROAD_SEGMENT_LENGTH);
    // Every gap is surrounded by complete road, so the player always gets a
    // full segment of warning and an escape route.
    if (((segmentIndex % 3) + 3) % 3 !== 1 || hashUnit(segmentIndex * 2.37 + 19 + state.roadSeed) >= difficulty.laneGapRate) return lanes;
    const missingLane = hashUnit(segmentIndex * 5.11 + 7 + state.roadSeed * .73) < .5 ? -1 : 1;
    return lanes.filter(lane => lane !== missingLane);
  }

  function safeLanesAtWorld(world) {
    const samples = [world - ROAD_OBJECT_CLEARANCE, world, world + ROAD_OBJECT_CLEARANCE];
    return fullRouteLanes().filter(lane => samples.every(sample => availableLanesAtWorld(sample).includes(lane)));
  }

  function chooseBallType() {
    const roll = Math.random();
    if (roll < .58) return "poke";
    if (roll < .82) return "great";
    if (roll < .96) return "ultra";
    return "master";
  }

  const BRIDGE_OBSTACLE_CLEARANCE = .11;
  const WORLD_ITEM_SPACING = .115;
  const WORLD_ITEM_FRONT = .79;

  function isBridgeSafetyZone(z, crossings = state.crossings) {
    return crossings.some(crossing => !crossing.disabled && Math.abs(crossing.z - z) < BRIDGE_OBSTACLE_CLEARANCE);
  }

  function nextWorldItemZ(excludedItem = null) {
    const otherItems = state.worldItems.filter(item => item !== excludedItem);
    const backZ = otherItems.length ? Math.min(...otherItems.map(item => item.z)) : .04;
    return Math.min(-.04, backZ - WORLD_ITEM_SPACING);
  }

  function spaceWorldItems() {
    state.worldItems.forEach((item, index) => {
      item.z = WORLD_ITEM_FRONT - index * WORLD_ITEM_SPACING;
      item.lastGap = item.z - state.playerZ;
    });
  }

  function chooseObstacleLane(z = .04) {
    const valid = state.inGym ? laneValues(5) : safeLanesAtWorld(state.distance - z);
    const roll = Math.random();
    if (roll < .70 && valid.includes(0)) return 0;
    const sides = valid.filter(lane => lane !== 0);
    return sides[Math.floor(Math.random() * sides.length)] || 0;
  }

  function chooseObstacleSubtype(lane = 0) {
    const rocketChance = lane === 0 ? .68 : .38;
    return Math.random() < rocketChance ? "rocket" : "vines";
  }

  function enforceCenterObstacleMinimum(minimum) {
    let centerCount = state.worldItems.filter(item => item.kind === "obstacle" && item.lane === 0).length;
    const eligibleObstacles = state.worldItems.filter(item =>
      item.kind === "obstacle" && item.lane !== 0 && !isBridgeSafetyZone(item.z)
    );
    for (const item of eligibleObstacles) {
      if (centerCount >= minimum) break;
      item.lane = 0;
      centerCount++;
    }

    while (centerCount < minimum) {
      const safeBall = state.worldItems.find(item => item.kind === "ball" && !isBridgeSafetyZone(item.z));
      const sideObstacle = state.worldItems.find(item => item.kind === "obstacle" && item.lane !== 0);
      if (!safeBall || !sideObstacle) break;
      sideObstacle.kind = "ball";
      sideObstacle.ballType = chooseBallType();
      safeBall.kind = "obstacle";
      safeBall.subtype = chooseObstacleSubtype(0);
      safeBall.ballType = null;
      safeBall.lane = 0;
      centerCount++;
    }
  }

  function relocateBridgeObstacles() {
    for (const item of state.worldItems) {
      if (item.kind === "obstacle" && isBridgeSafetyZone(item.z)) {
        item.z = nextWorldItemZ(item);
        item.lastGap = item.z - state.playerZ;
      }
    }
  }

  function clearBridgeSafetyZone() { relocateBridgeObstacles(); }

  function settleToward(current, target, rate, dt) {
    const next = current + (target - current) * (1 - Math.exp(-rate * dt));
    return Math.abs(target - next) < .001 ? target : next;
  }

  function roadGeometry(z) {
    const e = easeZ(z);
    const y = height * .34 + e * height * .72;
    const half = width * (.075 + e * .40);
    return { y, left: width / 2 - half, right: width / 2 + half, half, e };
  }

  function laneX(lane, z) {
    const road = roadGeometry(z);
    const count = activeLaneCount();
    return width / 2 + lane * road.half * (2 / count);
  }

  function seedWorld() {
    const difficulty = DIFFICULTIES[state.difficulty];
    state.crossings = difficulty.bridgeStarts.map(z => ({
      z,
      crossed: false,
      warned: false,
      failed: false,
      disabled: false,
      lastGap: null
    }));
    state.worldItems = [];
    if (difficulty.customCounts) {
      const kinds = [
        ...Array(difficulty.initialObstacleCount).fill("obstacle"),
        ...Array(difficulty.customBallCount).fill("ball")
      ];
      for (let i = kinds.length - 1; i > 0; i--) {
        const swapIndex = Math.floor(Math.random() * (i + 1));
        [kinds[i], kinds[swapIndex]] = [kinds[swapIndex], kinds[i]];
      }
      kinds.forEach((kind, index) => {
        const z = WORLD_ITEM_FRONT - index * WORLD_ITEM_SPACING;
        const lane = kind === "obstacle" ? chooseObstacleLane(z) : randomLane(z);
        state.worldItems.push({
          kind,
          subtype: kind === "obstacle" ? chooseObstacleSubtype(lane) : null,
          ballType: kind === "ball" ? chooseBallType() : null,
          lane,
          z,
          hit: false,
          spin: Math.random() * TAU,
          lastGap: z - state.playerZ
        });
      });
    } else {
      const obstacleSlots = new Set();
      while (obstacleSlots.size < difficulty.initialObstacleCount) {
        obstacleSlots.add(Math.floor(Math.random() * 10));
      }
      for (let i = 0; i < 10; i++) {
        const z = WORLD_ITEM_FRONT - i * WORLD_ITEM_SPACING;
        const obstacle = obstacleSlots.has(i);
        const lane = obstacle ? chooseObstacleLane(z) : randomLane(z);
        state.worldItems.push({
          kind: obstacle ? "obstacle" : "ball",
          subtype: obstacle ? chooseObstacleSubtype(lane) : null,
          ballType: obstacle ? null : chooseBallType(),
          lane,
          z,
          hit: false,
          spin: Math.random() * TAU,
          lastGap: z - state.playerZ
        });
      }
    }
    spaceWorldItems();
    relocateBridgeObstacles();
    enforceCenterObstacleMinimum(difficulty.centerObstacleMinimum);

    // Keep the road shoulders open. The painted meadow supplies landscape
    // depth without moving trees or props that make the road feel elevated.
    state.scenery = [];

    state.creatures = [];
    const encounterCount = Math.min(difficulty.encounterCount, state.routeLength);
    const encounterGap = encounterCount > 1 ? .60 / (encounterCount - 1) : 0;
    for (let i = 0; i < encounterCount; i++) {
      spawnCreature(.10 + i * encounterGap, i % 2 ? 1 : -1);
    }

  }

  function chooseEncounter(options) {
    const legendary = options.filter(creature => creature.legendary);
    const iconic = options.filter(creature => creature.iconic && !creature.legendary);
    const classic = options.filter(creature => creature.dex <= 151 && !creature.legendary && !creature.iconic);
    const later = options.filter(creature => creature.dex > 151 && !creature.legendary);
    const roll = Math.random();
    let pool;
    if (roll < .12 && legendary.length) pool = legendary;
    else if (roll < .42 && iconic.length) pool = iconic;
    else if (roll < .80 && classic.length) pool = classic;
    else pool = later.length ? later : options;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function spawnCreature(z = .08, side = Math.random() > .5 ? 1 : -1) {
    if (state.sightingsSpawned >= state.routeLength) return false;
    const caughtTypes = new Set(state.creatures.map(c => c.type));
    const options = creatureRoster.filter(c => !caughtTypes.has(c.type));
    const base = chooseEncounter(options.length ? options : creatureRoster);
    getPokemonImage(base);
    const distanceRoll = Math.random();
    // Requested route mix: 40% near, 25% medium, 20% far, 15% very far.
    const fieldDistance = distanceRoll < .40
      ? randomBetween(.14, .18)
      : distanceRoll < .65
        ? randomBetween(.24, .32)
        : distanceRoll < .85
          ? randomBetween(.39, .48)
          : randomBetween(.55, .66);
    const offset = .20 + (fieldDistance - .14) / .52 * .46 + randomBetween(-.025, .025);
    state.creatures.push({
      ...base,
      id: `${base.type}-${Math.random().toString(36).slice(2)}`,
      side,
      z,
      offset: Math.max(.20, Math.min(.68, offset)),
      fieldDistance,
      bob: Math.random() * TAU,
      caught: false,
      screenX: 0,
      screenY: 0,
      screenR: 0
    });
    state.sightingsSpawned++;
    return true;
  }

  function spawnGymCreature(z = randomBetween(.20, .64)) {
    const visibleTypes = new Set([...state.creatures, ...state.gymCreatures].map(creature => creature.type));
    const options = creatureRoster.filter(creature => !visibleTypes.has(creature.type));
    const base = chooseEncounter(options.length ? options : creatureRoster);
    getPokemonImage(base);
    const lane = laneValues(5)[Math.floor(Math.random() * 5)];
    state.gymCreatures.push({
      ...base,
      id: `gym-${base.type}-${Math.random().toString(36).slice(2)}`,
      arena: true,
      lane,
      z,
      fieldDistance: .10 + Math.abs(lane) * .07,
      bob: Math.random() * TAU,
      life: randomBetween(0, 4),
      caught: false,
      screenX: 0,
      screenY: 0,
      screenR: 0
    });
  }

  function resetGymObstacle(item, index = 0) {
    item.kind = "obstacle";
    item.lane = laneValues(5)[Math.floor(Math.random() * 5)];
    item.z = -.02 - index * .16 - randomBetween(.02, .12);
    item.lastGap = item.z - state.playerZ;
    item.hit = false;
    item.subtype = chooseObstacleSubtype(item.lane);
  }

  function activateGymGate(index) {
    state.gymGateActive = true;
    state.gymGateIndex = index;
    state.gymGateZ = .035;
    state.gymGateLastGap = state.gymGateZ - state.playerZ;
    for (const item of state.worldItems) {
      if (Math.abs(item.z - state.gymGateZ) < .22) {
        item.z = nextWorldItemZ(item);
        item.lane = item.kind === "obstacle" ? chooseObstacleLane(item.z) : randomLane(item.z);
        item.lastGap = item.z - state.playerZ;
      }
    }
    showToast("GYM ARENA AHEAD");
    updateHUD();
  }

  function enterGym() {
    if (state.inGym || state.mode !== "playing") return;
    state.inGym = true;
    state.gymsEntered = Math.max(state.gymsEntered, state.gymGateIndex + 1);
    state.gymGateActive = false;
    state.gymTime = 0;
    state.lane = 0;
    state.visualLane = 0;
    state.playerZ = .87;
    state.visualZ = .87;
    state.selected = null;
    state.thrown = null;
    state.throwing = false;
    state.forwardBoost = 0;
    state.gymCreatures = [];
    state.gymObstacles = Array.from({ length: 6 }, () => ({}));
    state.gymObstacles.forEach((item, index) => resetGymObstacle(item, index));
    [0.24, 0.44, 0.64].forEach(z => spawnGymCreature(z));
    ui.gymExitButton.classList.remove("hidden");
    showToast(`GYM ${state.gymsEntered} OF 3 • CATCH AND DODGE`);
    updateHUD();
  }

  function exitGym() {
    if (!state.inGym || state.mode !== "playing") return;
    if (state.throwing) {
      showToast("FINISH THE THROW FIRST");
      return;
    }
    state.inGym = false;
    state.lane = 0;
    state.visualLane = 0;
    state.playerZ = .89;
    state.visualZ = .89;
    state.selected = null;
    state.thrown = null;
    state.gymCreatures = [];
    state.gymObstacles = [];
    for (const item of state.worldItems) {
      const valid = safeLanesAtWorld(state.distance - item.z);
      if (!valid.includes(item.lane)) item.lane = valid[Math.floor(Math.random() * valid.length)] || 0;
    }
    ui.gymExitButton.classList.add("hidden");
    showToast("BACK ON THE ROUTE");
    updateHUD();
  }

  function resetGame() {
    const difficulty = DIFFICULTIES[state.difficulty];
    Object.assign(state, {
      mode: "playing", lane: 0, visualLane: 0, playerZ: .89, visualZ: .89,
      health: 3, balls: { ...difficulty.startingInventory }, ballType: "poke", caught: 0, speed: difficulty.speed,
      roadSeed: Math.random() * 10000,
      distance: 0, routeLength: difficulty.routeLength, sightingsSpawned: 0, sightingsResolved: 0,
      finishLineActive: false, finishLineZ: .04, finishLineLastGap: null,
      finishTime: 0, finishWon: false, animTime: 0, forwardBoost: 0, selected: null, thrown: null, flash: 0, shake: 0,
      invulnerable: 0, particles: [], pointer: null, gestureHandled: false, gestureCandidate: null,
      ballGestureStart: null, ballGestureCurrent: null, ballGestureHandled: false,
      riverFall: false, fallSide: 0, riverFallTime: 0, throwing: false, dragCurrent: null,
      inGym: false, gymsEntered: 0, gymSchedule: [
        Math.max(4, Math.round(difficulty.routeLength * .25)),
        Math.max(8, Math.round(difficulty.routeLength * .50)),
        Math.max(12, Math.round(difficulty.routeLength * .75))
      ], gymGateIndex: 0, gymGateActive: false, gymGateZ: .04, gymGateLastGap: null,
      gymCreatures: [], gymObstacles: [], gymTime: 0, fallReason: null
    });
    ui.gymExitButton.classList.add("hidden");
    state.ballType = lowestAvailableBall();
    seedWorld();
    updateHUD();
    hideAllOverlays();
    showToast(`${difficulty.label} MODE • CATCH 10`);
  }

  function hideAllOverlays() {
    [ui.start, ui.pause, ui.win, ui.effort, ui.over].forEach(el => {
      el.classList.add("hidden");
      el.setAttribute("aria-hidden", "true");
    });
  }

  function showMenu() {
    state.mode = "intro";
    state.selected = null;
    state.ballType = lowestAvailableBall();
    state.thrown = null;
    state.throwing = false;
    state.pointer = null;
    state.gestureCandidate = null;
    state.ballGestureStart = null;
    state.ballGestureCurrent = null;
    state.riverFall = false;
    state.fallSide = 0;
    state.riverFallTime = 0;
    state.inGym = false;
    state.gymGateActive = false;
    ui.gymExitButton.classList.add("hidden");
    hideAllOverlays();
    ui.start.classList.remove("hidden");
    ui.start.setAttribute("aria-hidden", "false");
    randomizeTitlePokemon();
    setCustomControlsVisible(state.difficulty === "custom");
    ui.difficultyDescription.textContent = DIFFICULTIES[state.difficulty].description;
    updateHUD();
  }

  function updateHUD() {
    const ball = BALL_TYPES[state.ballType];
    const ballCount = state.balls[state.ballType] || 0;
    ui.caught.textContent = state.caught;
    ui.balls.textContent = ballCount;
    ui.ballTypeName.textContent = ball.label;
    ui.throwLabel.textContent = `${ball.label} • SWIPE ↑`;
    for (const type of BALL_ORDER) {
      ui.ballIcon.classList.toggle(`ball-${type}`, type === state.ballType);
      ui.throwBall.classList.toggle(`ball-${type}`, type === state.ballType);
    }
    ui.ballInventory.setAttribute("aria-label", `${ball.fullLabel}: ${ballCount}`);
    ui.throwPad.setAttribute("aria-label", `Tap to switch ball type; swipe upward to throw ${ball.fullLabel}`);
    ui.progress.style.width = `${Math.min(100, state.caught * 10)}%`;
    ui.hearts.forEach((heart, index) => heart.classList.toggle("lost", index >= state.health));
    const distance = state.selected ? creatureRangeDistance(state.selected) : Infinity;
    const inRange = !!state.selected && distance <= ball.range;
    const ready = inRange && ballCount > 0 && state.mode === "playing" && !state.throwing;
    ui.throwPad.classList.toggle("ready", !!ready);
    ui.throwPad.classList.toggle("too-far", !!state.selected && !inRange);
    ui.throwPad.classList.toggle("empty", ballCount <= 0);
    ui.targetChip.classList.toggle("show", !!state.selected);
    ui.targetChip.classList.toggle("too-far", !!state.selected && !inRange);
    ui.targetChip.classList.toggle("in-range", !!state.selected && inRange);
    if (state.selected) {
      ui.targetName.textContent = `${state.selected.legendary ? "★ LEGENDARY • " : ""}${state.selected.name}`;
      ui.targetStatus.textContent = ballCount <= 0
        ? `NO ${ball.label} BALLS • TAP TO SWITCH`
        : inRange ? `${ball.label} • IN RANGE` : `${ball.label} • MOVE CLOSER`;
    }
    ui.game.dataset.playerDepth = state.playerZ.toFixed(2);
    ui.game.dataset.playerLane = String(state.lane);
    ui.game.dataset.forwardBoost = state.forwardBoost.toFixed(2);
    ui.game.dataset.ballType = state.ballType;
    ui.game.dataset.ballCount = String(ballCount);
    ui.game.dataset.targetInRange = String(inRange);
    ui.game.dataset.difficulty = state.difficulty;
    ui.game.dataset.routeSpeed = state.speed.toFixed(3);
    ui.game.dataset.encounterCount = String(DIFFICULTIES[state.difficulty].encounterCount);
    ui.game.dataset.routeLength = String(state.routeLength);
    ui.game.dataset.sightingsSpawned = String(state.sightingsSpawned);
    ui.game.dataset.sightingsResolved = String(state.sightingsResolved);
    ui.game.dataset.bridgeCount = String(DIFFICULTIES[state.difficulty].bridgeStarts.length);
    ui.game.dataset.obstacleRate = DIFFICULTIES[state.difficulty].obstacleRate.toFixed(2);
    ui.game.dataset.obstacleCount = String(state.worldItems.filter(item => item.kind === "obstacle").length);
    ui.game.dataset.centerObstacleCount = String(state.worldItems.filter(item => item.kind === "obstacle" && item.lane === 0).length);
    ui.game.dataset.pickupCount = String(state.worldItems.filter(item => item.kind === "ball").length);
    ui.game.dataset.unsafeBridgeObstacles = String(state.worldItems.filter(item => item.kind === "obstacle" && isBridgeSafetyZone(item.z)).length);
    ui.game.dataset.finishLineActive = String(state.finishLineActive);
    ui.game.dataset.laneCount = String(activeLaneCount());
    ui.game.dataset.inGym = String(state.inGym);
    ui.game.dataset.gymsEntered = String(state.gymsEntered);
    ui.game.dataset.gymSchedule = state.gymSchedule.join(",");
    ui.game.dataset.gymGateActive = String(state.gymGateActive);
    ui.game.dataset.currentLanes = (state.inGym ? laneValues(5) : availableLanesAtWorld(state.distance - state.playerZ)).join(",");
  }

  function creatureRangeDistance(creature) {
    // Give the throw a short longitudinal timing window. Previously the exact
    // Euclidean distance made even nearby Pokémon fall out of range too fast.
    const forwardDistance = Math.max(0, Math.abs(state.playerZ - creature.z) - .065);
    if (creature.arena) {
      const laneDistance = Math.abs(state.lane - creature.lane) * .105;
      return Math.hypot(forwardDistance, .10 + laneDistance);
    }
    const laneAdjustment = -Math.max(-2, Math.min(2, state.lane * creature.side)) * .035;
    const lateralDistance = Math.max(.08, creature.fieldDistance + laneAdjustment);
    return Math.hypot(forwardDistance, lateralDistance);
  }

  function cycleBallType() {
    if (state.mode !== "playing" || state.throwing) return;
    const current = BALL_ORDER.indexOf(state.ballType);
    state.ballType = BALL_ORDER[(current + 1) % BALL_ORDER.length];
    updateHUD();
    const ball = BALL_TYPES[state.ballType];
    showToast(`${ball.fullLabel} • ${state.balls[state.ballType] || 0} LEFT`);
  }

  function lowestAvailableBall() {
    return BALL_ORDER.find(type => (state.balls[type] || 0) > 0) || "poke";
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    ui.toast.textContent = message;
    ui.toast.classList.add("show");
    toastTimer = setTimeout(() => ui.toast.classList.remove("show"), 1500);
  }

  function moveLane(direction) {
    if (state.mode !== "playing" || state.throwing || state.riverFall) return;
    const nextLane = state.lane + direction;
    const laneLimit = Math.floor(activeLaneCount() / 2);
    if (nextLane < -laneLimit || nextLane > laneLimit) {
      if (state.inGym) {
        showToast("ARENA EDGE");
        return;
      }
      hitRiver("side", direction);
      return;
    }
    state.lane = nextLane;
    if (!state.inGym && !availableLanesAtWorld(state.distance - state.playerZ).includes(state.lane)) {
      hitRiver("gap", Math.sign(state.lane) || direction);
      return;
    }
    updateHUD();
  }

  function moveDepth(direction) {
    if (state.mode !== "playing" || state.throwing || state.riverFall) return;
    state.playerZ = Math.max(.62, Math.min(.93, state.playerZ + direction * .085));
    if (!state.inGym && !availableLanesAtWorld(state.distance - state.playerZ).includes(state.lane)) {
      hitRiver("gap", Math.sign(state.lane));
      return;
    }
    if (direction < 0) state.forwardBoost = Math.min(1.45, state.forwardBoost + .78);
    else state.forwardBoost = Math.max(0, state.forwardBoost - .25);
    updateHUD();
  }

  function trainerScreenPosition() {
    const road = roadGeometry(state.visualZ);
    return { x: laneX(state.visualLane, state.visualZ), y: road.y - height * .012, road };
  }

  function togglePause(forceResume = false) {
    if (state.mode === "playing" && !forceResume) {
      state.mode = "paused";
      ui.pause.classList.remove("hidden");
      ui.pause.setAttribute("aria-hidden", "false");
    } else if (state.mode === "paused") {
      state.mode = "playing";
      ui.pause.classList.add("hidden");
      ui.pause.setAttribute("aria-hidden", "true");
      state.lastTime = performance.now();
    }
  }

  function hitObstacle() {
    if (state.invulnerable > 0) return;
    state.health--;
    state.invulnerable = 1.25;
    state.shake = .38;
    state.flash = .35;
    const player = trainerScreenPosition();
    burst(player.x, player.y - 40, "#f3d08b", 14);
    updateHUD();
    if (state.health <= 0) {
      setTimeout(() => endGame(false, "obstacle"), 350);
    } else {
      showToast(`${state.health} HEART${state.health === 1 ? "" : "S"} LEFT`);
    }
  }

  function hitRiver(source = "bridge", side = 0) {
    if (state.mode !== "playing" || state.riverFall) return;
    state.riverFall = true;
    state.fallSide = source === "side" || source === "gap" ? side : 0;
    state.fallReason = source;
    state.riverFallTime = 0;
    if (state.fallSide) state.lane = state.fallSide * 1.7;
    state.flash = .5;
    state.shake = .45;
    const player = trainerScreenPosition();
    burst(player.x, player.y - 20, "#8de7f1", 30);
    updateHUD();
    showToast(source === "gap" ? "THE LANE ENDED" : source === "side" ? "YOU FELL OFF THE ROAD" : "YOU MISSED THE BRIDGE");
    const reason = source === "gap" ? "roadGap" : source === "side" ? "riverSide" : "river";
    setTimeout(() => endGame(false, reason), source === "bridge" ? 260 : 430);
  }

  function collectBall(item) {
    item.hit = true;
    const type = item.ballType || "poke";
    state.balls[type] = (state.balls[type] || 0) + 1;
    burst(laneX(item.lane, item.z), roadGeometry(item.z).y, BALL_TYPES[type].pickupColor, 10);
    showToast(`${BALL_TYPES[type].fullLabel} +1`);
    updateHUD();
  }

  function selectCreature(creature) {
    if (state.mode !== "playing" || creature.caught) return;
    if (state.caught >= 10) {
      showToast("TEAM COMPLETE • REACH THE FINISH");
      return;
    }
    state.selected = creature;
    state.ballType = lowestAvailableBall();
    updateHUD();
    showToast(creature.legendary ? `LEGENDARY ${creature.name.toUpperCase()}!` : `${creature.name.toUpperCase()} SPOTTED!`);
  }

  function throwAtSelected() {
    if (state.mode !== "playing" || state.thrown || state.riverFall) return;
    if (!state.selected) {
      showToast("TAP A WILD POKÉMON FIRST");
      return;
    }
    const ball = BALL_TYPES[state.ballType];
    const count = state.balls[state.ballType] || 0;
    if (count <= 0) {
      showToast(`NO ${ball.fullLabel}S • TAP TO SWITCH`);
      return;
    }
    const distance = creatureRangeDistance(state.selected);
    if (distance > ball.range) {
      showToast(`${ball.fullLabel} IS OUT OF RANGE`);
      return;
    }
    const target = state.selected;
    state.balls[state.ballType]--;
    const player = trainerScreenPosition();
    state.thrown = { target, ballType: state.ballType, t: 0, startX: player.x, startY: player.y - 65 };
    state.throwing = true;
    updateHUD();
  }

  function finishCatch(target) {
    target.caught = true;
    burst(target.screenX, target.screenY, "#ffd52d", 24);
    state.caught = Math.min(10, state.caught + 1);
    state.selected = null;
    state.thrown = null;
    state.throwing = false;
    state.ballType = lowestAvailableBall();
    updateHUD();
    if (state.caught >= 10) {
      showToast("TEAM COMPLETE!");
      endGame(true, "caught");
      return;
    }
    const gymCleared = target.arena && state.gymCreatures.every(creature => creature === target || creature.caught);
    showToast(gymCleared ? "GYM CLEARED • EXIT WHEN READY" : `${target.name.toUpperCase()} CAUGHT!`);
  }

  function endGame(won, reason = "obstacle") {
    if (state.mode === "won" || state.mode === "effort" || state.mode === "over") return;
    if (state.mode === "finishing" && reason !== "finish") return;
    const effort = !won && reason === "finish";
    state.mode = won ? "won" : effort ? "effort" : "over";
    ui.gymExitButton.classList.add("hidden");
    const screen = won ? ui.win : effort ? ui.effort : ui.over;
    ui.finalCaught.textContent = state.caught;
    ui.effortCaught.textContent = state.caught;
    if (!won && !effort) {
      const riverLoss = reason === "river" || reason === "riverSide";
      ui.overTitle.textContent = reason === "roadGap" ? "Off the trail!" : riverLoss ? "Swept away!" : "Nice try, Trainer.";
      ui.overReason.innerHTML = reason === "river"
        ? `The bridge was in the center lane. You caught <strong>${state.caught}</strong> Pokémon.`
        : reason === "riverSide"
          ? `You stepped beyond the road into the riverside. You caught <strong>${state.caught}</strong> Pokémon.`
          : reason === "roadGap"
            ? `That lane ended beneath you. You caught <strong>${state.caught}</strong> Pokémon.`
          : `You caught <strong>${state.caught}</strong> Pokémon this run.`;
    }
    screen.classList.remove("hidden");
    screen.setAttribute("aria-hidden", "false");
  }

  function burst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * TAU;
      const speed = randomBetween(35, 130);
      state.particles.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 20,
        life: randomBetween(.45, .9), maxLife: .9, color, size: randomBetween(2, 7)
      });
    }
  }

  function activateFinishLine() {
    state.finishLineActive = true;
    state.finishLineZ = .04;
    state.finishLineLastGap = state.finishLineZ - state.playerZ;
    for (const item of state.worldItems) {
      if (Math.abs(item.z - state.finishLineZ) < .18) {
        item.z = nextWorldItemZ(item);
        item.lastGap = item.z - state.playerZ;
      }
    }
    ui.game.dataset.finishLineActive = "true";
    showToast("FINISH LINE AHEAD");
  }

  function beginFinishSequence() {
    if (state.mode !== "playing") return;
    if (state.thrown) finishCatch(state.thrown.target);
    if (state.mode !== "playing") return;
    state.mode = "finishing";
    state.finishTime = 0;
    state.finishWon = state.caught >= 10;
    state.selected = null;
    state.thrown = null;
    state.throwing = false;
    state.forwardBoost = 0;
    updateHUD();
  }

  function updateParticles(dt) {
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const particle = state.particles[i];
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 180 * dt;
      if (particle.life <= 0) state.particles.splice(i, 1);
    }
  }

  function updateGym(dt) {
    state.gymTime += dt;
    state.animTime += dt;
    state.forwardBoost = Math.max(0, state.forwardBoost - dt * 1.65);
    state.visualLane = settleToward(state.visualLane, state.lane, 11, dt);
    state.visualZ = settleToward(state.visualZ, state.playerZ, 11, dt);
    state.invulnerable = Math.max(0, state.invulnerable - dt);
    state.flash = Math.max(0, state.flash - dt);
    state.shake = Math.max(0, state.shake - dt);

    const arenaSpeed = .078 * (1 + state.forwardBoost * .25);
    for (let index = 0; index < state.gymObstacles.length; index++) {
      const item = state.gymObstacles[index];
      item.z += arenaSpeed * dt;
      const gap = item.z - state.playerZ;
      const previousGap = item.lastGap == null ? gap : item.lastGap;
      const crossedTrainerLine = previousGap < 0 && gap >= 0;
      item.lastGap = gap;
      if (!item.hit && crossedTrainerLine && item.lane === state.lane) {
        item.hit = true;
        hitObstacle();
      }
      if (item.z > 1.08) resetGymObstacle(item, index);
    }

    for (let index = state.gymCreatures.length - 1; index >= 0; index--) {
      const creature = state.gymCreatures[index];
      creature.bob += dt * 2.7;
      creature.life += dt;
      if (creature.caught) state.gymCreatures.splice(index, 1);
    }

    if (state.thrown) {
      state.thrown.t += dt * 1.8;
      if (state.thrown.t >= 1) finishCatch(state.thrown.target);
    }
    updateParticles(dt);
    ui.game.dataset.selectedDepth = state.selected ? state.selected.z.toFixed(3) : "none";
  }

  function update(dt) {
    if (state.mode === "finishing") {
      state.finishTime += dt;
      if (state.finishTime >= .85) endGame(state.finishWon, "finish");
      return;
    }
    if (state.mode !== "playing") return;
    if (state.inGym) {
      updateGym(dt);
      return;
    }
    state.forwardBoost = Math.max(0, state.forwardBoost - dt * 1.65);
    const travelSpeed = state.speed * (1 + state.forwardBoost);
    state.distance += travelSpeed * dt;
    state.animTime += dt;
    if (state.riverFall) state.riverFallTime += dt;
    state.visualLane = settleToward(state.visualLane, state.lane, 10, dt);
    state.visualZ = settleToward(state.visualZ, state.playerZ, 11, dt);
    state.invulnerable = Math.max(0, state.invulnerable - dt);
    state.flash = Math.max(0, state.flash - dt);
    state.shake = Math.max(0, state.shake - dt);

    if (!state.gymGateActive && state.gymsEntered < 3 && state.sightingsResolved >= state.gymSchedule[state.gymsEntered]) {
      activateGymGate(state.gymsEntered);
    }

    if (!state.finishLineActive && !state.gymGateActive && state.sightingsResolved >= state.routeLength) {
      const startIsClear = !state.crossings.some(crossing => !crossing.disabled && Math.abs(crossing.z - .04) < .22);
      if (startIsClear) activateFinishLine();
    }

    for (const item of state.worldItems) {
      item.z += travelSpeed * dt;
      item.spin += dt * 3;
      const gap = item.z - state.playerZ;
      const previousGap = item.lastGap == null ? gap : item.lastGap;
      const crossedTrainerLine = previousGap < 0 && gap >= 0;
      item.lastGap = gap;
      if (!item.hit && crossedTrainerLine && item.lane === state.lane) {
        if (item.kind === "ball") collectBall(item);
        else { item.hit = true; hitObstacle(); }
      }
      if (item.z > 1.1) {
        item.z = nextWorldItemZ(item);
        item.hit = false;
        const difficulty = DIFFICULTIES[state.difficulty];
        if (!difficulty.customCounts) {
          const wantsObstacle = Math.random() < difficulty.obstacleRate;
          item.kind = wantsObstacle ? "obstacle" : "ball";
        }
        item.lane = item.kind === "obstacle" ? chooseObstacleLane(item.z) : randomLane(item.z);
        item.subtype = item.kind === "obstacle" ? chooseObstacleSubtype(item.lane) : null;
        item.ballType = item.kind === "ball" ? chooseBallType() : null;
        item.lastGap = item.z - state.playerZ;
      }
    }

    for (const item of state.scenery) {
      item.z += travelSpeed * dt;
      if (item.z > 1.08) {
        item.z = randomBetween(.01, .06);
        item.side = Math.random() > .5 ? 1 : -1;
        item.offset = randomBetween(.12, .45);
      }
    }

    for (const crossing of state.crossings) {
      if (crossing.disabled) continue;
      crossing.z += travelSpeed * dt;
      const gap = crossing.z - state.playerZ;
      const previousGap = crossing.lastGap === null ? gap : crossing.lastGap;
      const crossedRiverLine = previousGap < 0 && gap >= 0;
      crossing.lastGap = gap;
      if (!crossing.warned && gap > -.24 && gap < -.08) {
        crossing.warned = true;
        showToast("CENTER LANE — BRIDGE AHEAD");
      }
      // Resolve once at the river's visual centerline. Sweeping between the
      // previous and current frame prevents skips without causing late hits.
      if (!crossing.failed && !crossing.crossed && crossedRiverLine) {
        crossing.crossed = true;
        if (state.lane !== 0) {
          crossing.failed = true;
          hitRiver();
        }
      }
      if (crossing.z > 1.12) {
        if (state.finishLineActive) {
          crossing.disabled = true;
          continue;
        }
        crossing.z = .025;
        crossing.crossed = false;
        crossing.warned = false;
        crossing.failed = false;
        crossing.lastGap = crossing.z - state.playerZ;
        clearBridgeSafetyZone(crossing);
      }
    }

    if (!availableLanesAtWorld(state.distance - state.playerZ).includes(state.lane)) {
      hitRiver("gap", Math.sign(state.lane));
      return;
    }

    for (const creature of state.creatures) {
      creature.bob += dt * 2.4;
      creature.z += travelSpeed * dt;
      if (creature.z > 1.04 || creature.caught) {
        if (state.selected === creature) {
          state.selected = null;
          state.ballType = lowestAvailableBall();
        }
        const idx = state.creatures.indexOf(creature);
        state.creatures.splice(idx, 1);
        state.sightingsResolved = Math.min(state.routeLength, state.sightingsResolved + 1);
        spawnCreature(randomBetween(.025, .08));
        updateHUD();
        break;
      }
    }
    ui.game.dataset.selectedDepth = state.selected ? state.selected.z.toFixed(3) : "none";

    if (state.thrown) {
      state.thrown.t += dt * 1.8;
      if (state.thrown.t >= 1) {
        finishCatch(state.thrown.target);
        if (state.mode !== "playing") return;
      }
    }

    if (state.finishLineActive) {
      state.finishLineZ += travelSpeed * dt;
      const finishGap = state.finishLineZ - state.playerZ;
      const previousFinishGap = state.finishLineLastGap == null ? finishGap : state.finishLineLastGap;
      state.finishLineLastGap = finishGap;
      if (previousFinishGap < 0 && finishGap >= 0) {
        beginFinishSequence();
        return;
      }
    }

    if (state.gymGateActive) {
      state.gymGateZ += travelSpeed * dt;
      const gymGap = state.gymGateZ - state.playerZ;
      const previousGymGap = state.gymGateLastGap == null ? gymGap : state.gymGateLastGap;
      state.gymGateLastGap = gymGap;
      if (previousGymGap < 0 && gymGap >= 0) {
        enterGym();
        return;
      }
    }

    updateParticles(dt);
  }

  function roundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }

  function drawBackground() {
    const horizon = height * .35;
    if (meadowBackdrop.complete && meadowBackdrop.naturalWidth) {
      const sourceWidth = meadowBackdrop.naturalWidth;
      const sourceHeight = meadowBackdrop.naturalHeight;
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const cropWidth = width / scale;
      const cropHeight = height / scale;
      const laneDrift = state.visualLane * Math.min(18, Math.max(0, (sourceWidth - cropWidth) * .04));
      const breezeDrift = Math.sin(state.animTime * .06) * Math.min(8, Math.max(0, (sourceWidth - cropWidth) * .015));
      const sourceX = Math.max(0, Math.min(sourceWidth - cropWidth, (sourceWidth - cropWidth) / 2 + laneDrift + breezeDrift));
      const sourceY = Math.max(0, Math.min(sourceHeight - cropHeight, (sourceHeight - cropHeight) * .28));
      ctx.drawImage(meadowBackdrop, sourceX, sourceY, cropWidth, cropHeight, 0, 0, width, height);

      const depthTint = ctx.createLinearGradient(0, horizon * .75, 0, height);
      depthTint.addColorStop(0, "rgba(33,84,65,0)");
      depthTint.addColorStop(.48, "rgba(46,100,57,.05)");
      depthTint.addColorStop(1, "rgba(24,72,48,.22)");
      ctx.fillStyle = depthTint;
      ctx.fillRect(0, 0, width, height);
    } else {
      const sky = ctx.createLinearGradient(0, 0, 0, horizon * 1.2);
      sky.addColorStop(0, "#75aabd");
      sky.addColorStop(.62, "#b8d2cf");
      sky.addColorStop(1, "#dae2d2");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, horizon + 8);

      ctx.fillStyle = "rgba(255,226,151,.72)";
      ctx.beginPath();
      ctx.arc(width * .82, height * .13, Math.min(width, height) * .068, 0, TAU);
      ctx.fill();
      drawCloud(width * .15, height * .12, 1.1);
      drawCloud(width * .67, height * .21, .7);
      drawCloud(width * .42, height * .08, .55);

      ctx.fillStyle = "#54795c";
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      for (let x = 0; x <= width; x += 80) {
        const y = horizon - 28 - Math.sin(x * .009) * 25 - Math.cos(x * .021) * 18;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, horizon + 20);
      ctx.closePath();
      ctx.fill();

      const grass = ctx.createLinearGradient(0, horizon, 0, height);
      grass.addColorStop(0, "#88a969");
      grass.addColorStop(.55, "#668c54");
      grass.addColorStop(1, "#496f43");
      ctx.fillStyle = grass;
      ctx.fillRect(0, horizon, width, height - horizon);
    }

    drawFieldTiles(horizon);
    drawRoad();
    drawAmbientSky();
  }

  function drawFieldTiles(horizon) {
    ctx.save();
    const drift = (state.distance * 85) % 120;
    ctx.fillStyle = "rgba(176,188,111,.23)";
    ctx.beginPath(); ctx.moveTo(0,horizon+42); ctx.lineTo(width*.27,horizon+4); ctx.lineTo(width*.17,height); ctx.lineTo(0,height); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(42,103,62,.18)";
    ctx.beginPath(); ctx.moveTo(width,horizon+55); ctx.lineTo(width*.73,horizon+9); ctx.lineTo(width*.86,height); ctx.lineTo(width,height); ctx.closePath(); ctx.fill();

    ctx.strokeStyle = "rgba(205,193,145,.42)";
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(5, width * .007);
    ctx.beginPath();
    ctx.moveTo(-30, horizon + 135 + drift * .2);
    ctx.bezierCurveTo(width*.08, horizon+80, width*.15, horizon+170, width*.24, horizon+112);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width+30, horizon + 175 - drift * .15);
    ctx.bezierCurveTo(width*.91, horizon+105, width*.83, horizon+205, width*.76, horizon+126);
    ctx.stroke();

    ctx.fillStyle = "rgba(48,121,72,.09)";
    for (let i = 0; i < 6; i++) {
      const x = ((i * 263 + drift * 2) % (width + 180)) - 90;
      const y = horizon + 90 + (i % 3) * 145;
      ctx.beginPath(); ctx.ellipse(x, y, 85 + (i%2)*35, 24, -.18, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  function drawAmbientSky() {
    ctx.save();
    ctx.strokeStyle = "rgba(39,85,92,.42)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const x = ((i * 290 + state.animTime * (7 + i)) % (width + 120)) - 60;
      const y = height * (.16 + (i % 3) * .045);
      const flap = Math.sin(state.animTime * 4 + i) * 3;
      ctx.beginPath();
      ctx.quadraticCurveTo(x + 6, y - 5 - flap, x + 12, y);
      ctx.quadraticCurveTo(x + 18, y - 5 + flap, x + 24, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawAmbientLeaves() {
    for (let i = 0; i < 14; i++) {
      const phase = state.animTime * (.35 + (i%3)*.08) + i * 1.71;
      const side = i % 2 ? 1 : -1;
      const x = width/2 + side * (width * (.30 + (i%4)*.055)) + Math.sin(phase) * 24;
      const y = height * (.35 + (i%7)*.085) + Math.cos(phase*.73) * 18;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(phase);
      ctx.fillStyle = i % 3 ? "rgba(80,162,70,.6)" : "rgba(238,188,72,.55)";
      ctx.beginPath(); ctx.ellipse(0, 0, 5, 2.5, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
  }

  function drawCloud(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255,255,255,.74)";
    ctx.beginPath();
    ctx.arc(-28, 5, 20, 0, TAU);
    ctx.arc(-5, -3, 28, 0, TAU);
    ctx.arc(25, 7, 19, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawRoad() {
    const count = DIFFICULTIES[state.difficulty].laneCount || 3;
    const lanes = laneValues(count);
    const slices = 72;
    ctx.save();
    ctx.lineJoin = "round";

    for (let index = 0; index < slices; index++) {
      const z0 = index / slices;
      const z1 = (index + 1.15) / slices;
      const midZ = (z0 + z1) / 2;
      const available = availableLanesAtWorld(state.distance - midZ);
      const road0 = roadGeometry(z0);
      const road1 = roadGeometry(z1);
      const cell0 = road0.half * 2 / count;
      const cell1 = road1.half * 2 / count;
      const warmth = Math.round(218 - midZ * 58);
      const green = Math.round(207 - midZ * 80);
      const blue = Math.round(164 - midZ * 83);

      for (const lane of lanes.filter(candidate => !available.includes(candidate))) {
        const center0 = width / 2 + lane * cell0;
        const center1 = width / 2 + lane * cell1;
        ctx.fillStyle = `rgba(${Math.round(86 - midZ * 25)},${Math.round(138 - midZ * 35)},${Math.round(77 - midZ * 19)},.94)`;
        ctx.beginPath();
        ctx.moveTo(center0 - cell0 * .49, road0.y);
        ctx.lineTo(center0 + cell0 * .49, road0.y);
        ctx.lineTo(center1 + cell1 * .49, road1.y + 1);
        ctx.lineTo(center1 - cell1 * .49, road1.y + 1);
        ctx.closePath();
        ctx.fill();
      }

      for (const lane of available) {
        const center0 = width / 2 + lane * cell0;
        const center1 = width / 2 + lane * cell1;
        ctx.fillStyle = `rgba(${warmth},${green},${blue},${.79 + midZ * .16})`;
        ctx.beginPath();
        ctx.moveTo(center0 - cell0 * .505, road0.y);
        ctx.lineTo(center0 + cell0 * .505, road0.y);
        ctx.lineTo(center1 + cell1 * .505, road1.y + 1);
        ctx.lineTo(center1 - cell1 * .505, road1.y + 1);
        ctx.closePath();
        ctx.fill();

        const laneIndex = lanes.indexOf(lane);
        const leftNeighbor = lanes[laneIndex - 1];
        const rightNeighbor = lanes[laneIndex + 1];
        ctx.strokeStyle = "rgba(100,83,58,.30)";
        ctx.lineWidth = 1 + midZ * 2.5;
        if (leftNeighbor !== undefined && !available.includes(leftNeighbor)) {
          ctx.beginPath(); ctx.moveTo(center0 - cell0 / 2, road0.y); ctx.lineTo(center1 - cell1 / 2, road1.y); ctx.stroke();
        }
        if (rightNeighbor !== undefined && !available.includes(rightNeighbor)) {
          ctx.beginPath(); ctx.moveTo(center0 + cell0 / 2, road0.y); ctx.lineTo(center1 + cell1 / 2, road1.y); ctx.stroke();
        }
      }

      const dashPhase = Math.abs(Math.floor((state.distance - midZ) / .052));
      if (dashPhase % 2 === 0) {
        ctx.strokeStyle = "rgba(244,235,203,.48)";
        ctx.lineWidth = 1 + midZ * 4;
        for (let laneIndex = 0; laneIndex < lanes.length - 1; laneIndex++) {
          const leftLane = lanes[laneIndex];
          const rightLane = lanes[laneIndex + 1];
          if (!available.includes(leftLane) || !available.includes(rightLane)) continue;
          const boundary0 = width / 2 + (leftLane + .5) * cell0;
          const boundary1 = width / 2 + (leftLane + .5) * cell1;
          ctx.beginPath(); ctx.moveTo(boundary0, road0.y); ctx.lineTo(boundary1, road1.y); ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = .12;
    ctx.strokeStyle = "#70533b";
    for (let index = 0; index < 13; index++) {
      const z = (index / 13 + state.distance * .45) % 1;
      const road = roadGeometry(z);
      const available = availableLanesAtWorld(state.distance - z);
      for (const lane of available) {
        const cell = road.half * 2 / count;
        const center = width / 2 + lane * cell;
        ctx.lineWidth = 1 + z * 2;
        ctx.beginPath(); ctx.moveTo(center - cell * .34, road.y); ctx.lineTo(center + cell * .34, road.y); ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawGymGate() {
    if (!state.gymGateActive || state.gymGateZ < .01 || state.gymGateZ > 1.06) return;
    const road = roadGeometry(state.gymGateZ);
    const span = road.half * .94;
    const pillarHeight = 34 + road.e * 170;
    const pillarWidth = 5 + road.e * 17;
    const top = road.y - pillarHeight;
    const glow = ctx.createRadialGradient(width / 2, road.y - pillarHeight * .42, 2, width / 2, road.y - pillarHeight * .42, span);
    glow.addColorStop(0, "rgba(102,224,255,.34)");
    glow.addColorStop(1, "rgba(102,224,255,0)");
    ctx.save();
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.ellipse(width / 2, road.y - pillarHeight * .38, span, pillarHeight * .68, 0, 0, TAU); ctx.fill();

    const pillar = ctx.createLinearGradient(0, top, 0, road.y);
    pillar.addColorStop(0, "#f7f5ee");
    pillar.addColorStop(.46, "#5b86a7");
    pillar.addColorStop(1, "#173f60");
    ctx.fillStyle = pillar;
    roundedRect(width / 2 - span - pillarWidth / 2, top, pillarWidth, pillarHeight, pillarWidth / 2); ctx.fill();
    roundedRect(width / 2 + span - pillarWidth / 2, top, pillarWidth, pillarHeight, pillarWidth / 2); ctx.fill();

    const bannerHeight = 13 + road.e * 34;
    ctx.fillStyle = "#173f60";
    roundedRect(width / 2 - span, top - bannerHeight * .15, span * 2, bannerHeight, Math.max(3, bannerHeight * .3)); ctx.fill();
    ctx.strokeStyle = "rgba(105,226,255,.82)";
    ctx.lineWidth = Math.max(1.5, road.e * 5);
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.font = `900 ${Math.max(8, 9 + road.e * 21)}px Nunito, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`GYM ${state.gymGateIndex + 1}`, width / 2, top + bannerHeight * .36);
    ctx.restore();
  }

  function drawArenaBackground() {
    const horizon = height * .30;
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#102f58");
    sky.addColorStop(.30, "#235b83");
    sky.addColorStop(.305, "#dcebf0");
    sky.addColorStop(1, "#2e6f79");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(9,31,58,.88)";
    ctx.beginPath();
    ctx.moveTo(0, horizon * .72);
    ctx.quadraticCurveTo(width / 2, horizon * 1.48, width, horizon * .72);
    ctx.lineTo(width, horizon * 1.22);
    ctx.quadraticCurveTo(width / 2, horizon * 1.72, 0, horizon * 1.22);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(240,248,250,.88)";
    for (let index = 0; index < 9; index++) {
      const x = width * (.08 + index * .105);
      ctx.beginPath(); ctx.arc(x, horizon * .93 + Math.sin(index) * 5, Math.max(2, width * .004), 0, TAU); ctx.fill();
    }

    const floor = ctx.createLinearGradient(0, horizon, 0, height);
    floor.addColorStop(0, "#83b9bb");
    floor.addColorStop(.58, "#4d9498");
    floor.addColorStop(1, "#286c73");
    ctx.fillStyle = floor;
    ctx.beginPath();
    ctx.moveTo(width * .39, horizon);
    ctx.lineTo(width * .61, horizon);
    ctx.lineTo(width * 1.02, height);
    ctx.lineTo(-width * .02, height);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(222,249,244,.42)";
    ctx.lineWidth = 2;
    for (let lane = -2; lane <= 2; lane++) {
      const far = roadGeometry(.01);
      const near = roadGeometry(1);
      const cellFar = far.half * 2 / 5;
      const cellNear = near.half * 2 / 5;
      const boundary = lane - .5;
      if (lane === -2) continue;
      ctx.beginPath();
      ctx.moveTo(width / 2 + boundary * cellFar, far.y);
      ctx.lineTo(width / 2 + boundary * cellNear, near.y);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(220,249,244,.22)";
    for (let index = 1; index < 8; index++) {
      const z = index / 8;
      const road = roadGeometry(z);
      ctx.lineWidth = 1 + z * 2;
      ctx.beginPath(); ctx.moveTo(road.left, road.y); ctx.lineTo(road.right, road.y); ctx.stroke();
    }

    ctx.save();
    ctx.translate(width / 2, height * .17);
    ctx.fillStyle = "rgba(7,25,49,.78)";
    roundedRect(-76, -24, 152, 48, 12); ctx.fill();
    ctx.strokeStyle = "rgba(104,228,255,.7)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 12px Nunito, sans-serif";
    ctx.fillText(`GYM ${state.gymsEntered} / 3`, 0, -5);
    ctx.fillStyle = "#8eeaff";
    ctx.font = "900 8px Nunito, sans-serif";
    ctx.fillText("CATCH • DODGE • EXIT ANY TIME", 0, 10);
    ctx.restore();
  }

  function drawGymCreature(creature) {
    const image = getPokemonImage(creature);
    if (!image.complete || !image.naturalWidth) {
      creature.screenR = 0;
      return;
    }
    const road = roadGeometry(creature.z);
    const heightScale = Math.max(.68, Math.min(1.75, Math.pow(creature.heightM / .7, .62)));
    const scale = (.16 + road.e * .72) * heightScale;
    const hover = 22 + road.e * 42 + Math.sin(creature.bob) * (5 + road.e * 6);
    const x = laneX(creature.lane, creature.z) + Math.sin(creature.bob * .72) * (3 + road.e * 6);
    const y = road.y - hover;
    creature.screenX = x;
    creature.screenY = y - 45 * scale;
    creature.screenR = Math.max(48, 55 * scale + 22);

    ctx.save();
    ctx.globalAlpha = .24;
    ctx.fillStyle = "#0a4054";
    ctx.beginPath(); ctx.ellipse(x, road.y + 2, 34 * scale, 9 * scale, 0, 0, TAU); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    const selected = state.selected === creature;
    ctx.strokeStyle = selected ? "#6ef08a" : "rgba(235,252,255,.78)";
    ctx.lineWidth = (selected ? 5 : 2.5) / scale;
    ctx.setLineDash(selected ? [] : [8 / scale, 7 / scale]);
    ctx.beginPath(); ctx.arc(0, -47, 53 + Math.sin(creature.bob * 1.4) * 3, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);
    if (selected) {
      ctx.fillStyle = "rgba(95,235,134,.16)";
      ctx.beginPath(); ctx.arc(0, -47, 54, 0, TAU); ctx.fill();
    }
    ctx.shadowColor = creature.legendary ? "rgba(255,213,80,.62)" : "rgba(8,32,55,.38)";
    ctx.shadowBlur = creature.legendary ? 20 : 11;
    ctx.drawImage(image, -57, -107, 114, 114);
    ctx.restore();

    ctx.save();
    ctx.font = `900 ${Math.max(9, Math.min(14, 8 + scale * 5))}px Nunito, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = `${creature.legendary ? "★ " : ""}${creature.name}`;
    const labelWidth = ctx.measureText(label).width + 18;
    ctx.fillStyle = selected ? "rgba(25,132,72,.92)" : "rgba(9,38,65,.82)";
    roundedRect(x - labelWidth / 2, y + 1, labelWidth, 23, 12); ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText(label, x, y + 13);
    ctx.restore();
  }

  function drawGymObstacles() {
    const sorted = [...state.gymObstacles].sort((a, b) => a.z - b.z);
    for (const item of sorted) {
      if (item.hit || item.z < .01 || item.z > 1.08) continue;
      const road = roadGeometry(item.z);
      drawObstacle(item, laneX(item.lane, item.z), road.y, .12 + road.e * 1.14);
    }
  }

  function drawCrossing(crossing) {
    if (crossing.z < 0 || crossing.z > 1.08) return;
    const road = roadGeometry(crossing.z);
    const thickness = 10 + road.e * 92;
    const bank = 4 + road.e * 14;
    const top = road.y - thickness / 2;
    const bottom = road.y + thickness / 2;
    const ripple = Math.sin(state.animTime * 1.6 + crossing.z * 9) * (1 + road.e * 4);

    ctx.save();
    const bankFill = ctx.createLinearGradient(0, top-bank, 0, bottom+bank);
    bankFill.addColorStop(0,"#59664d"); bankFill.addColorStop(.18,"#7b765f"); bankFill.addColorStop(.82,"#696653"); bankFill.addColorStop(1,"#465642");
    ctx.fillStyle=bankFill;
    ctx.beginPath(); ctx.moveTo(0,top-bank);ctx.quadraticCurveTo(width*.28,top-bank+ripple,width*.5,top-bank);ctx.quadraticCurveTo(width*.73,top-bank-ripple,width,top-bank);ctx.lineTo(width,bottom+bank);ctx.quadraticCurveTo(width*.72,bottom+bank-ripple,width*.5,bottom+bank);ctx.quadraticCurveTo(width*.26,bottom+bank+ripple,0,bottom+bank);ctx.closePath();ctx.fill();

    const water = ctx.createLinearGradient(0,top,0,bottom);
    water.addColorStop(0,"#315c69");water.addColorStop(.45,"#3f8391");water.addColorStop(1,"#244e60");
    ctx.fillStyle=water;
    ctx.beginPath(); ctx.moveTo(0,top);ctx.quadraticCurveTo(width*.25,top+ripple,width*.5,top);ctx.quadraticCurveTo(width*.75,top-ripple,width,top);ctx.lineTo(width,bottom);ctx.quadraticCurveTo(width*.76,bottom-ripple,width*.5,bottom);ctx.quadraticCurveTo(width*.24,bottom+ripple,0,bottom);ctx.closePath();ctx.fill();

    ctx.strokeStyle="rgba(205,235,226,.34)";ctx.lineWidth=Math.max(1,road.e*3);
    for(let i=1;i<=3;i++){
      const yy=top+(thickness*i/4)+Math.sin(state.animTime*2+i)*road.e*3;
      ctx.beginPath();ctx.moveTo(0,yy);ctx.bezierCurveTo(width*.28,yy+4,width*.66,yy-5,width,yy+2);ctx.stroke();
    }

    const zTop=Math.max(.001,crossing.z-.037);
    const zBottom=Math.min(1.05,crossing.z+.037);
    const bridgeTop=roadGeometry(zTop);
    const bridgeBottom=roadGeometry(zBottom);
    const topHalf=bridgeTop.half*.285;
    const bottomHalf=bridgeBottom.half*.285;
    const bridgeWood=ctx.createLinearGradient(0,top,0,bottom);
    bridgeWood.addColorStop(0,"#8c6a43");bridgeWood.addColorStop(.5,"#b48a55");bridgeWood.addColorStop(1,"#6d4d31");
    ctx.fillStyle=bridgeWood;
    ctx.beginPath();ctx.moveTo(width/2-topHalf,top-bank*.25);ctx.lineTo(width/2+topHalf,top-bank*.25);ctx.lineTo(width/2+bottomHalf,bottom+bank*.25);ctx.lineTo(width/2-bottomHalf,bottom+bank*.25);ctx.closePath();ctx.fill();

    ctx.strokeStyle="rgba(54,39,28,.62)";ctx.lineWidth=Math.max(1,road.e*2.5);
    for(let i=1;i<7;i++){
      const t=i/7; const yy=top+(bottom-top)*t; const half=topHalf+(bottomHalf-topHalf)*t;
      ctx.beginPath();ctx.moveTo(width/2-half,yy);ctx.lineTo(width/2+half,yy);ctx.stroke();
    }
    ctx.strokeStyle="#44372d";ctx.lineWidth=Math.max(2,road.e*5);
    ctx.beginPath();ctx.moveTo(width/2-topHalf,top);ctx.lineTo(width/2-bottomHalf,bottom);ctx.moveTo(width/2+topHalf,top);ctx.lineTo(width/2+bottomHalf,bottom);ctx.stroke();

    const postSize=3+road.e*7;
    ctx.fillStyle="#49392b";
    for(const px of [width/2-topHalf,width/2+topHalf,width/2-bottomHalf,width/2+bottomHalf]){
      ctx.beginPath();ctx.arc(px,px===width/2-topHalf||px===width/2+topHalf?top:bottom,postSize,0,TAU);ctx.fill();
    }
    ctx.restore();
  }

  function drawCrossings() {
    [...state.crossings].filter(crossing => !crossing.disabled).sort((a,b)=>a.z-b.z).forEach(drawCrossing);
  }

  function drawFinishLine() {
    if (!state.finishLineActive || state.finishLineZ < .01 || state.finishLineZ > 1.06) return;
    const zFar = Math.max(.001, state.finishLineZ - .026);
    const zNear = Math.min(1.06, state.finishLineZ + .026);
    const far = roadGeometry(zFar);
    const near = roadGeometry(zNear);
    const columns = 8;
    const rows = 2;

    ctx.save();
    for (let row = 0; row < rows; row++) {
      const t0 = row / rows;
      const t1 = (row + 1) / rows;
      const y0 = far.y + (near.y - far.y) * t0;
      const y1 = far.y + (near.y - far.y) * t1;
      const half0 = far.half + (near.half - far.half) * t0;
      const half1 = far.half + (near.half - far.half) * t1;
      for (let column = 0; column < columns; column++) {
        const c0 = column / columns;
        const c1 = (column + 1) / columns;
        ctx.fillStyle = (row + column) % 2 ? "#f8f4e8" : "#183945";
        ctx.beginPath();
        ctx.moveTo(width / 2 - half0 + half0 * 2 * c0, y0);
        ctx.lineTo(width / 2 - half0 + half0 * 2 * c1, y0);
        ctx.lineTo(width / 2 - half1 + half1 * 2 * c1, y1);
        ctx.lineTo(width / 2 - half1 + half1 * 2 * c0, y1);
        ctx.closePath();
        ctx.fill();
      }
    }

    const road = roadGeometry(state.finishLineZ);
    const postX = road.half * .88;
    const postHeight = 38 + road.e * 128;
    const postWidth = 3 + road.e * 8;
    const bannerHeight = 12 + road.e * 27;
    ctx.fillStyle = "#183945";
    ctx.fillRect(width / 2 - postX - postWidth / 2, road.y - postHeight, postWidth, postHeight);
    ctx.fillRect(width / 2 + postX - postWidth / 2, road.y - postHeight, postWidth, postHeight);
    ctx.fillStyle = "#f7f1df";
    roundedRect(width / 2 - postX, road.y - postHeight, postX * 2, bannerHeight, Math.max(2, road.e * 6));
    ctx.fill();
    ctx.fillStyle = "#183945";
    ctx.font = `900 ${Math.max(7, 8 + road.e * 18)}px Nunito, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FINISH", width / 2, road.y - postHeight + bannerHeight / 2);
    ctx.restore();
  }

  function drawScenery(item) {
    const road = roadGeometry(item.z);
    const x = item.side < 0 ? road.left - width * item.offset * (.2 + road.e) : road.right + width * item.offset * (.2 + road.e);
    const scale = .15 + road.e * 1.35;
    const y = road.y;
    ctx.save();
    ctx.globalAlpha = .48 + road.e * .52;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (item.type === "tree") {
      ctx.fillStyle = "rgba(25,42,28,.32)";
      ctx.beginPath(); ctx.ellipse(16, 3, 50, 11, -.12, 0, TAU); ctx.fill();
      const trunk = ctx.createLinearGradient(-10, 0, 10, 0);
      trunk.addColorStop(0, "#49362a"); trunk.addColorStop(.45, "#816044"); trunk.addColorStop(.72, "#684936"); trunk.addColorStop(1, "#352820");
      ctx.fillStyle = trunk;
      ctx.beginPath();
      ctx.moveTo(-9,2); ctx.bezierCurveTo(-12,-26,-7,-55,-3,-78); ctx.lineTo(11,-78); ctx.bezierCurveTo(8,-48,14,-24,10,2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#59422f"; ctx.lineWidth = 7; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0,-57); ctx.lineTo(-25,-78); ctx.moveTo(4,-63); ctx.lineTo(27,-88); ctx.stroke();

      if (item.variant % 2) {
        const pine = ctx.createLinearGradient(-35,-130,35,-38);
        pine.addColorStop(0,"#78906b"); pine.addColorStop(.42,"#3f6a4d"); pine.addColorStop(1,"#244837");
        ctx.fillStyle = pine;
        for (const [top,bottom,half] of [[-139,-78,36],[-116,-53,48],[-89,-28,57]]) {
          ctx.beginPath(); ctx.moveTo(0,top); ctx.bezierCurveTo(-10,top+25,-half+8,bottom-12,-half,bottom); ctx.quadraticCurveTo(0,bottom-9,half,bottom); ctx.bezierCurveTo(half-8,bottom-12,10,top+25,0,top); ctx.fill();
        }
      } else {
        const crowns = [[-18,-91,38,27,-.25],[19,-96,43,31,.22],[-7,-123,36,28,.08],[-36,-70,31,24,-.38],[37,-68,33,25,.35]];
        for (const [cx,cy,rx,ry,rot] of crowns) {
          const leaf = ctx.createRadialGradient(cx-rx*.3,cy-ry*.45,2,cx,cy,rx);
          leaf.addColorStop(0,"#839b65"); leaf.addColorStop(.52,"#50784e"); leaf.addColorStop(1,"#294e39");
          ctx.fillStyle=leaf; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,rot,0,TAU); ctx.fill();
        }
      }
      ctx.fillStyle = "rgba(216,230,183,.16)";
      ctx.beginPath(); ctx.ellipse(-25,-111,14,7,-.35,0,TAU); ctx.fill();
    } else if (item.type === "grass") {
      const sway = Math.sin(state.animTime * 2.2 + item.variant) * 5;
      ctx.strokeStyle = "#277f47";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(i*6, 1); ctx.quadraticCurveTo(i*6+sway*.4, -16-i%2*4, i*7+sway, -31-Math.abs(i)*2); ctx.stroke();
      }
      ctx.fillStyle = "rgba(44,104,52,.18)"; ctx.beginPath(); ctx.ellipse(5,3,31,7,0,0,TAU); ctx.fill();
    } else if (item.type === "flower") {
      ctx.fillStyle = "rgba(30,59,36,.2)"; ctx.beginPath(); ctx.ellipse(5,1,17,5,0,0,TAU); ctx.fill();
      ctx.strokeStyle = "#348d49"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-25); ctx.stroke();
      ctx.fillStyle = ["#fff4bc", "#ed6b88", "#a886e8", "#ffffff"][item.variant];
      for (let a = 0; a < 5; a++) { ctx.beginPath(); ctx.arc(Math.cos(a*TAU/5)*9, -25 + Math.sin(a*TAU/5)*9, 7, 0, TAU); ctx.fill(); }
      ctx.fillStyle = "#ffd52d"; ctx.beginPath(); ctx.arc(0,-25,5,0,TAU); ctx.fill();
    } else if (item.type === "bench") {
      ctx.fillStyle = "rgba(30,59,36,.2)"; ctx.beginPath(); ctx.ellipse(10,3,48,10,0,0,TAU); ctx.fill();
      ctx.fillStyle = "#60412b"; ctx.fillRect(-34,-6,7,22); ctx.fillRect(27,-6,7,22);
      const wood = ctx.createLinearGradient(0,-43,0,2); wood.addColorStop(0,"#d69152"); wood.addColorStop(1,"#8d5733");
      ctx.fillStyle = wood; roundedRect(-45,-42,90,16,5); ctx.fill(); roundedRect(-43,-20,86,14,4); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.23)"; roundedRect(-39,-39,72,4,2); ctx.fill();
    } else if (item.type === "lamp") {
      ctx.fillStyle = "rgba(30,59,36,.18)"; ctx.beginPath(); ctx.ellipse(8,3,28,7,0,0,TAU); ctx.fill();
      const pole = ctx.createLinearGradient(-5,0,6,0); pole.addColorStop(0,"#315a66"); pole.addColorStop(.5,"#8fb8bd"); pole.addColorStop(1,"#264852");
      ctx.fillStyle = pole; ctx.fillRect(-5,-88,10,90);
      ctx.fillStyle = "#315a66"; roundedRect(-15,-96,30,12,5); ctx.fill();
      ctx.shadowColor = "rgba(255,240,151,.75)"; ctx.shadowBlur = 18;
      ctx.fillStyle = "#fff4ad"; ctx.beginPath(); ctx.arc(0,-101,10,0,TAU); ctx.fill(); ctx.shadowColor="transparent";
    } else if (item.type === "fence") {
      ctx.fillStyle = "rgba(30,59,36,.17)"; ctx.beginPath(); ctx.ellipse(8,3,60,9,0,0,TAU); ctx.fill();
      ctx.fillStyle = "#c8a06a";
      for (const px of [-45,0,45]) { roundedRect(px-5,-47,10,50,3); ctx.fill(); }
      const rail = ctx.createLinearGradient(0,-34,0,-14); rail.addColorStop(0,"#e7c18a"); rail.addColorStop(1,"#a97949");
      ctx.fillStyle = rail; roundedRect(-53,-39,106,10,4); ctx.fill(); roundedRect(-53,-19,106,10,4); ctx.fill();
    } else if (item.type === "pokestop") {
      const stopBlue = "#45bfea";
      ctx.fillStyle = "rgba(20,80,96,.2)"; ctx.beginPath(); ctx.ellipse(7,3,36,9,0,0,TAU); ctx.fill();
      ctx.strokeStyle = "rgba(98,220,250,.35)"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0,-53,32 + Math.sin(state.animTime*2+item.variant)*3,0,TAU); ctx.stroke();
      ctx.fillStyle = "#3486a8"; roundedRect(-6,-62,12,64,5); ctx.fill();
      ctx.fillStyle = stopBlue; ctx.beginPath(); ctx.arc(0,-62,16,0,TAU); ctx.fill();
      ctx.strokeStyle = "white"; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(0,-62,9,0,TAU); ctx.stroke();
      ctx.save(); ctx.translate(0,-91); ctx.rotate(state.animTime*1.35 + item.variant);
      ctx.fillStyle = "#69d7f3"; ctx.fillRect(-16,-16,32,32);
      ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.fillRect(-12,-12,20,7); ctx.restore();
    } else if (item.type === "gym") {
      const gymColor = item.variant % 2 ? "#e96668" : "#4f86ed";
      ctx.fillStyle = "rgba(25,67,73,.18)"; ctx.beginPath(); ctx.ellipse(9,4,58,14,0,0,TAU); ctx.fill();
      ctx.fillStyle = "#6b8790"; roundedRect(-8,-74,16,76,6); ctx.fill();
      ctx.fillStyle = gymColor; ctx.beginPath(); ctx.ellipse(0,-76,46,18,0,0,TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.78)"; ctx.beginPath(); ctx.ellipse(0,-80,27,9,0,0,TAU); ctx.fill();
      ctx.fillStyle = gymColor; ctx.beginPath(); ctx.arc(0,-104,19,0,TAU); ctx.fill();
      ctx.strokeStyle="white";ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,-104,10,0,TAU);ctx.stroke();
      ctx.save(); ctx.translate(0,-128); ctx.rotate(state.animTime*.75);
      ctx.fillStyle="rgba(92,218,244,.8)"; ctx.beginPath(); for(let i=0;i<6;i++){const a=i*TAU/6;ctx.lineTo(Math.cos(a)*17,Math.sin(a)*17);} ctx.closePath();ctx.fill();ctx.restore();
    } else if (item.type === "building") {
      ctx.fillStyle = "rgba(29,40,30,.28)"; ctx.beginPath(); ctx.ellipse(17,4,70,15,-.03,0,TAU); ctx.fill();
      ctx.fillStyle = "#817767"; ctx.beginPath(); ctx.moveTo(45,-73);ctx.lineTo(61,-63);ctx.lineTo(61,-3);ctx.lineTo(45,2);ctx.closePath();ctx.fill();
      const plaster = ctx.createLinearGradient(-45,-70,45,0); plaster.addColorStop(0,"#d3c6a7");plaster.addColorStop(1,"#a99b7f");
      ctx.fillStyle=plaster; roundedRect(-47,-72,94,74,3);ctx.fill();
      ctx.fillStyle="#776c5b"; for(let i=0;i<6;i++){ctx.fillRect(-46+i*16,-8+(i%2)*2,14,8);}
      const roof = ctx.createLinearGradient(0,-122,0,-65); roof.addColorStop(0,item.variant%2?"#506759":"#66584b");roof.addColorStop(1,"#302f2b");
      ctx.fillStyle=roof;ctx.beginPath();ctx.moveTo(-59,-68);ctx.lineTo(-7,-118);ctx.lineTo(9,-118);ctx.lineTo(60,-68);ctx.lineTo(49,-61);ctx.lineTo(0,-105);ctx.lineTo(-49,-61);ctx.closePath();ctx.fill();
      ctx.fillStyle="#40372f";ctx.fillRect(25,-112,13,27);ctx.fillStyle="#8d8070";ctx.fillRect(23,-115,17,6);
      ctx.fillStyle="#5e4431";ctx.fillRect(-42,-66,7,68);ctx.fillRect(35,-66,7,68);ctx.fillRect(-45,-40,90,6);
      ctx.fillStyle="#8fb2aa";ctx.fillRect(-29,-57,22,20);ctx.fillStyle="rgba(232,239,205,.55)";ctx.fillRect(-26,-54,6,14);
      ctx.fillStyle="#594333";ctx.fillRect(10,-34,21,36);ctx.fillStyle="#c4a369";ctx.beginPath();ctx.arc(26,-17,2.5,0,TAU);ctx.fill();
    } else if (item.type === "sign") {
      ctx.fillStyle = "rgba(30,59,36,.2)"; ctx.beginPath(); ctx.ellipse(8,2,33,8,0,0,TAU); ctx.fill();
      const post = ctx.createLinearGradient(-5,0,5,0); post.addColorStop(0,"#56361f"); post.addColorStop(.55,"#9d7047"); post.addColorStop(1,"#4b2e1c");
      ctx.fillStyle = post; ctx.fillRect(-5,-50,10,52);
      ctx.fillStyle = "#f5e1a7"; roundedRect(-42,-75,84,32,5); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.4)"; roundedRect(-36,-70,68,5,2); ctx.fill();
      ctx.fillStyle = "#705033"; ctx.beginPath(); ctx.moveTo(17,-66); ctx.lineTo(30,-59); ctx.lineTo(17,-52); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function drawPokeball(x, y, radius, rotation = 0, type = "poke") {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.shadowColor = "rgba(15,54,63,.25)";
    ctx.shadowBlur = radius * .45;
    ctx.shadowOffsetY = radius * .28;
    const topColors = { poke: "#ed4747", great: "#3978ca", ultra: "#252d37", master: "#8759b5" };
    ctx.fillStyle = topColors[type] || topColors.poke;
    ctx.beginPath(); ctx.arc(0, 0, radius, Math.PI, 0); ctx.lineTo(-radius, 0); ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI); ctx.lineTo(-radius, 0); ctx.fill();
    ctx.shadowColor = "transparent";
    if (type === "great") {
      ctx.fillStyle = "#ef4d50";
      ctx.beginPath(); ctx.arc(-radius * .42, -radius * .48, radius * .16, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(radius * .42, -radius * .48, radius * .16, 0, TAU); ctx.fill();
    } else if (type === "ultra") {
      ctx.fillStyle = "#f3ce37";
      ctx.beginPath(); ctx.moveTo(-radius * .72, -radius * .68); ctx.lineTo(-radius * .38, -radius * .92); ctx.lineTo(-radius * .08, 0); ctx.lineTo(-radius * .34, 0); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(radius * .72, -radius * .68); ctx.lineTo(radius * .38, -radius * .92); ctx.lineTo(radius * .08, 0); ctx.lineTo(radius * .34, 0); ctx.closePath(); ctx.fill();
    } else if (type === "master") {
      ctx.fillStyle = "#ef8cbd";
      ctx.beginPath(); ctx.arc(-radius * .46, -radius * .47, radius * .18, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(radius * .46, -radius * .47, radius * .18, 0, TAU); ctx.fill();
      if (radius > 9) {
        ctx.fillStyle = "white";
        ctx.font = `900 ${Math.max(7, radius * .48)}px Nunito`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("M", 0, -radius * .46);
      }
    }
    ctx.fillStyle = "#183945"; ctx.fillRect(-radius, -radius * .12, radius * 2, radius * .24);
    ctx.fillStyle = "white"; ctx.strokeStyle = "#183945"; ctx.lineWidth = Math.max(2, radius * .15);
    ctx.beginPath(); ctx.arc(0, 0, radius * .27, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function drawObstacle(item, x, y, scale) {
    ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
    ctx.fillStyle = "rgba(28,49,35,.28)";
    ctx.beginPath(); ctx.ellipse(3, 7, 47, 12, 0, 0, TAU); ctx.fill();
    ctx.shadowColor = "rgba(30,40,31,.32)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 7;
    if (item.subtype === "rocket") {
      const pulse = .72 + Math.sin(state.animTime * 7 + item.spin) * .28;
      ctx.fillStyle = "#252d31";
      roundedRect(-43, -50, 10, 58, 4); ctx.fill();
      roundedRect(33, -50, 10, 58, 4); ctx.fill();
      ctx.fillStyle = "#14191c";
      ctx.beginPath(); ctx.ellipse(-38, 7, 14, 5, 0, 0, TAU); ctx.ellipse(38, 7, 14, 5, 0, 0, TAU); ctx.fill();

      const panel = ctx.createLinearGradient(0, -52, 0, 1);
      panel.addColorStop(0, "#4c555b"); panel.addColorStop(.48, "#252b30"); panel.addColorStop(1, "#111619");
      ctx.fillStyle = panel;
      roundedRect(-50, -48, 100, 43, 8); ctx.fill();
      ctx.strokeStyle = "#0a0d0f"; ctx.lineWidth = 3; ctx.stroke();
      ctx.save();
      roundedRect(-47, -45, 94, 37, 6); ctx.clip();
      ctx.fillStyle = "#d92f3f";
      for (let stripeX = -72; stripeX < 70; stripeX += 30) {
        ctx.beginPath(); ctx.moveTo(stripeX, -6); ctx.lineTo(stripeX + 17, -6); ctx.lineTo(stripeX + 49, -47); ctx.lineTo(stripeX + 32, -47); ctx.closePath(); ctx.fill();
      }
      ctx.restore();

      ctx.shadowColor = "rgba(235,52,68,.55)"; ctx.shadowBlur = 8 * pulse;
      ctx.fillStyle = `rgba(255,72,82,${pulse})`;
      for (const lightX of [-37, 37]) { ctx.beginPath(); ctx.arc(lightX, -54, 5, 0, TAU); ctx.fill(); }
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "rgba(245,245,238,.96)";
      ctx.beginPath(); ctx.arc(0, -27, 17, 0, TAU); ctx.fill();
      ctx.fillStyle = "#d72f40";
      ctx.font = "900 25px Arial, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("R", 0, -26);
      ctx.fillStyle = "rgba(255,255,255,.18)";
      roundedRect(-44, -44, 88, 5, 2); ctx.fill();
    } else {
      const sway = Math.sin(state.animTime * 2.4 + item.spin) * 3;
      ctx.shadowColor = "rgba(24,55,27,.42)"; ctx.shadowBlur = 8;
      ctx.lineCap = "round";
      const vines = [
        [-45, 2, -28, -36, 4, -12, 38, -33],
        [-39, -3, -12, -15, 14, -44, 47, -5],
        [-28, 4, -6, -35, 22, -2, 39, -24],
        [-49, -14, -21, -29, 10, -5, 48, -18]
      ];
      vines.forEach((points, index) => {
        const vine = ctx.createLinearGradient(-45, 0, 45, -40);
        vine.addColorStop(0, index % 2 ? "#214e31" : "#315f38");
        vine.addColorStop(.5, "#568247");
        vine.addColorStop(1, "#183f2c");
        ctx.strokeStyle = vine;
        ctx.lineWidth = 8 - index * .7;
        ctx.beginPath();
        ctx.moveTo(points[0], points[1]);
        ctx.bezierCurveTo(points[2] + sway, points[3], points[4] - sway, points[5], points[6], points[7]);
        ctx.stroke();
      });
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "#dfe8ba";
      for (let i = 0; i < 9; i++) {
        const thornX = -37 + i * 9;
        const thornY = -10 - Math.abs(Math.sin(i * 1.7)) * 20;
        const direction = i % 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(thornX, thornY);
        ctx.lineTo(thornX + direction * 8, thornY - 8);
        ctx.lineTo(thornX + direction * 3, thornY + 4);
        ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = "#5f8d4b";
      for (let i = 0; i < 6; i++) {
        const leafX = -34 + i * 14;
        const leafY = -19 - (i % 2) * 12;
        ctx.beginPath(); ctx.ellipse(leafX, leafY, 10, 5, (i % 2 ? .45 : -.45) + sway * .015, 0, TAU); ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawWorldItems() {
    const sorted = [...state.worldItems].sort((a,b) => a.z - b.z);
    for (const item of sorted) {
      if (item.hit || item.z < .01 || item.z > 1.08) continue;
      const road = roadGeometry(item.z);
      const x = laneX(item.lane, item.z);
      const scale = .12 + road.e * 1.14;
      if (item.kind === "ball") drawPokeball(x, road.y - 18 * scale, 18 * scale, item.spin, item.ballType || "poke");
      else drawObstacle(item, x, road.y, scale);
    }
  }

  function drawCreature(creature) {
    const image = getPokemonImage(creature);
    if (!image.complete || !image.naturalWidth) {
      creature.screenR = 0;
      return;
    }
    const road = roadGeometry(creature.z);
    const heightScale = Math.max(.68, Math.min(1.9, Math.pow(creature.heightM / .7, .68)));
    const scale = (.17 + road.e * 1.00) * heightScale;
    const rawX = creature.side < 0 ? road.left - width * creature.offset * (.38 + road.e * 1.10) : road.right + width * creature.offset * (.38 + road.e * 1.10);
    const x = Math.max(52, Math.min(width - 52, rawX));
    const wiggle = Math.sin(creature.bob * 1.35);
    const bounce = Math.abs(Math.sin(creature.bob)) * (2 + road.e * 5);
    const y = road.y - bounce;
    const poseX = x + wiggle * (2 + road.e * 4);
    creature.screenX = poseX;
    creature.screenY = y - 47 * scale;
    creature.screenR = Math.max(54, 56 * scale + 30);

    ctx.save();
    ctx.globalAlpha = .18 + road.e * .14;
    ctx.fillStyle = "#234d35";
    ctx.beginPath();
    ctx.ellipse(poseX + 5 * scale, road.y + 2, 38 * scale, 10 * scale * (1 - bounce*.025), 0, 0, TAU);
    ctx.fill();
    ctx.restore();

    if (creature.legendary) {
      const auraY = y - 47 * scale;
      const auraRadius = 66 * scale + Math.sin(creature.bob * 1.7) * 4;
      const aura = ctx.createRadialGradient(poseX, auraY, auraRadius * .18, poseX, auraY, auraRadius);
      aura.addColorStop(0, "rgba(255,239,151,.22)");
      aura.addColorStop(.65, "rgba(255,204,76,.10)");
      aura.addColorStop(1, "rgba(255,204,76,0)");
      ctx.fillStyle = aura;
      ctx.beginPath(); ctx.arc(poseX, auraY, auraRadius, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,226,111,.9)";
      for (let i = 0; i < 3; i++) {
        const angle = creature.bob * .7 + i * TAU / 3;
        ctx.beginPath();
        ctx.arc(poseX + Math.cos(angle) * auraRadius, auraY + Math.sin(angle) * auraRadius * .62, 2.4 + road.e * 1.8, 0, TAU);
        ctx.fill();
      }
    }

    ctx.save();
    ctx.translate(poseX, y);
    ctx.rotate(wiggle * .035);
    ctx.scale(scale, scale);
    const selected = state.selected === creature;
    const pulse = 4 + Math.sin(creature.bob * 1.7) * 3;
    ctx.strokeStyle = selected ? "#52d66f" : creature.legendary ? "#ffd85c" : "rgba(255,255,255,.84)";
    ctx.lineWidth = (selected ? 5 : 2.5) / scale;
    ctx.setLineDash(selected ? [] : [8 / scale, 7 / scale]);
    ctx.beginPath(); ctx.arc(0, -47, 53 + pulse, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    if (selected) {
      ctx.fillStyle = "rgba(82,214,111,.18)";
      ctx.beginPath(); ctx.arc(0, -47, 54, 0, TAU); ctx.fill();
    }

    ctx.shadowColor = creature.legendary ? "rgba(255,199,61,.62)" : "rgba(20,55,46,.28)";
    ctx.shadowBlur = creature.legendary ? 20 : 11;
    ctx.shadowOffsetY = 6;
    ctx.drawImage(image, -57, -107, 114, 114);
    ctx.shadowColor = "transparent";
    ctx.restore();

    if (creature.z > .20 && creature.z < .97) {
      ctx.save();
      ctx.font = `900 ${Math.max(9, Math.min(14, 8 + scale * 5))}px Nunito, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const displayName = `${creature.legendary ? "★ " : ""}${creature.name}`;
      const labelWidth = ctx.measureText(displayName).width + 20;
      const labelX = Math.max(labelWidth / 2 + 6, Math.min(width - labelWidth / 2 - 6, poseX));
      ctx.fillStyle = creature.legendary ? "rgba(112,77,14,.94)" : selected ? "rgba(31,139,69,.92)" : "rgba(17,48,59,.78)";
      roundedRect(labelX - labelWidth / 2, y + 2, labelWidth, 24, 12); ctx.fill();
      ctx.fillStyle = creature.legendary ? "#fff1a8" : "white";
      ctx.fillText(displayName, labelX, y + 14);
      ctx.restore();
    }
  }

  function drawCreatureShape(type, color) {
    ctx.shadowColor = "rgba(25,61,47,.25)"; ctx.shadowBlur = 9; ctx.shadowOffsetY = 7;
    ctx.fillStyle = color;
    if (type === "pikachu") {
      ctx.save();
      ctx.rotate(-.2); ctx.fillRect(-29,-100,15,62); ctx.rotate(.4); ctx.fillRect(14,-106,15,66); ctx.restore();
      ctx.fillStyle = "#2c3432"; ctx.save(); ctx.rotate(-.2); ctx.fillRect(-29,-100,15,23); ctx.restore(); ctx.save(); ctx.rotate(.2); ctx.fillRect(14,-106,15,23); ctx.restore();
      ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0,-43,35,44,0,0,TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0,-76,34,0,TAU); ctx.fill();
      ctx.fillStyle = "#ef5550"; ctx.beginPath(); ctx.arc(-26,-71,8,0,TAU); ctx.arc(26,-71,8,0,TAU); ctx.fill();
      drawFace();
      ctx.strokeStyle = color; ctx.lineWidth = 13; ctx.lineJoin = "miter"; ctx.beginPath(); ctx.moveTo(28,-40); ctx.lineTo(50,-64); ctx.lineTo(44,-42); ctx.lineTo(63,-27); ctx.stroke();
    } else if (type === "bulbasaur") {
      ctx.beginPath(); ctx.ellipse(0,-28,45,31,0,0,TAU); ctx.fill(); ctx.beginPath(); ctx.arc(-8,-59,34,0,TAU); ctx.fill();
      ctx.fillStyle = "#3b8c68"; ctx.beginPath(); ctx.moveTo(-28,-77); ctx.lineTo(-21,-108); ctx.lineTo(-5,-83); ctx.lineTo(12,-112); ctx.lineTo(26,-78); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#31775f"; for (const [x,y] of [[-27,-48],[14,-55],[25,-27]]) { ctx.beginPath(); ctx.arc(x,y,6,0,TAU); ctx.fill(); }
      drawFace(-7,-63);
    } else if (type === "charmander") {
      ctx.beginPath(); ctx.ellipse(0,-35,31,43,0,0,TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0,-76,31,0,TAU); ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(25,-34); ctx.quadraticCurveTo(59,-27,50,-64); ctx.stroke();
      ctx.fillStyle = "#ffd32f"; ctx.beginPath(); ctx.moveTo(50,-58); ctx.quadraticCurveTo(36,-78,53,-96); ctx.quadraticCurveTo(72,-75,50,-58); ctx.fill();
      ctx.fillStyle = "#f2c68c"; ctx.beginPath(); ctx.ellipse(0,-31,18,27,0,0,TAU); ctx.fill(); drawFace();
    } else if (type === "squirtle") {
      ctx.fillStyle = "#9b633b"; ctx.beginPath(); ctx.ellipse(0,-35,34,40,0,0,TAU); ctx.fill();
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0,-77,32,0,TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-27,-20,11,23,.3,0,TAU); ctx.ellipse(27,-20,11,23,-.3,0,TAU); ctx.fill();
      ctx.fillStyle = "#f4da9c"; ctx.beginPath(); ctx.ellipse(0,-35,24,31,0,0,TAU); ctx.fill(); drawFace();
      ctx.strokeStyle = color; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(40,-34,19,-1.2,2.3); ctx.stroke();
    } else if (type === "jigglypuff") {
      ctx.beginPath(); ctx.arc(0,-48,43,0,TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-28,-77); ctx.lineTo(-20,-108); ctx.lineTo(-4,-84); ctx.fill(); ctx.beginPath(); ctx.moveTo(28,-77); ctx.lineTo(23,-106); ctx.lineTo(8,-84); ctx.fill();
      ctx.strokeStyle = "#d589aa"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-3,-82,13,.2,5.6); ctx.stroke(); drawFace();
    } else if (type === "eevee" || type === "meowth") {
      ctx.beginPath(); ctx.ellipse(0,-38,34,40,0,0,TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0,-76,32,0,TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-27,-91); ctx.lineTo(-22,-125); ctx.lineTo(-4,-99); ctx.fill(); ctx.beginPath(); ctx.moveTo(27,-91); ctx.lineTo(22,-125); ctx.lineTo(4,-99); ctx.fill();
      if (type === "eevee") { ctx.fillStyle = "#f1d09c"; for(let a=0;a<7;a++){ctx.beginPath();ctx.arc(Math.cos(a*.9)*26,-53+Math.sin(a*.9)*15,13,0,TAU);ctx.fill();} }
      else { ctx.fillStyle="#d4ac45"; ctx.beginPath(); ctx.ellipse(0,-99,6,13,0,0,TAU); ctx.fill(); }
      drawFace();
    } else if (type === "psyduck") {
      ctx.beginPath(); ctx.ellipse(0,-38,38,44,0,0,TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0,-79,34,0,TAU); ctx.fill();
      ctx.fillStyle="#e9b76b"; ctx.beginPath(); ctx.ellipse(0,-68,25,12,0,0,TAU); ctx.fill();
      ctx.strokeStyle="#463f35"; ctx.lineWidth=3; for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*5,-109);ctx.lineTo(i*10,-125);ctx.stroke();} drawFace(0,-84);
    } else if (type === "snorlax") {
      ctx.beginPath(); ctx.ellipse(0,-43,52,57,0,0,TAU); ctx.fill();
      ctx.fillStyle="#e9dfb7"; ctx.beginPath(); ctx.ellipse(0,-36,39,43,0,0,TAU); ctx.fill(); ctx.beginPath(); ctx.arc(0,-87,31,0,TAU); ctx.fill();
      ctx.fillStyle=color; ctx.beginPath();ctx.moveTo(-27,-102);ctx.lineTo(-23,-125);ctx.lineTo(-7,-108);ctx.fill();ctx.beginPath();ctx.moveTo(27,-102);ctx.lineTo(23,-125);ctx.lineTo(7,-108);ctx.fill();
      ctx.strokeStyle="#253b3b";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-18,-87);ctx.lineTo(-6,-84);ctx.moveTo(18,-87);ctx.lineTo(6,-84);ctx.stroke();
    } else {
      ctx.fillStyle="#fff7df"; ctx.beginPath(); ctx.ellipse(0,-41,34,46,0,0,TAU); ctx.fill();
      ctx.fillStyle="#e64f4f"; ctx.beginPath();ctx.moveTo(-28,-39);ctx.lineTo(-7,-24);ctx.lineTo(-16,-52);ctx.fill();
      ctx.fillStyle="#4a87d4";ctx.beginPath();ctx.moveTo(25,-48);ctx.lineTo(8,-31);ctx.lineTo(25,-24);ctx.fill();
      ctx.fillStyle="#efd35c";ctx.beginPath();ctx.arc(0,-79,28,0,TAU);ctx.fill(); drawFace();
    }
    ctx.shadowColor = "transparent";
  }

  function drawFace(dx = 0, dy = -80) {
    ctx.fillStyle = "#24383c";
    ctx.beginPath(); ctx.ellipse(dx - 12, dy, 4, 7, 0, 0, TAU); ctx.ellipse(dx + 12, dy, 4, 7, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#24383c"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(dx, dy + 11, 7, .25, Math.PI - .25); ctx.stroke();
  }

  function drawFinishTrainer(player, scale) {
    const image = trainerBackPose;
    const imageHeight = 194 * scale;
    const imageWidth = imageHeight * (image.naturalWidth / image.naturalHeight);

    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.fillStyle = "rgba(33,65,48,.24)";
    ctx.beginPath();
    ctx.ellipse(0, 4, imageWidth * .3, 10 * scale, 0, 0, TAU);
    ctx.fill();
    ctx.shadowColor = "rgba(12,45,54,.34)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;
    ctx.drawImage(image, -imageWidth / 2, -imageHeight, imageWidth, imageHeight);
    ctx.restore();
  }

  function drawTrainer() {
    const player = trainerScreenPosition();
    const x = player.x;
    const y = player.y;
    const fallProgress = state.riverFall ? Math.min(1, state.riverFallTime / .43) : 0;
    const fallTilt = state.fallSide * fallProgress * .42;
    const fallDrop = fallProgress * 22;
    const depthScale = .62 + player.road.e * .48;
    const s = Math.max(.66, Math.min(1.12, height / 760)) * depthScale;
    if (state.mode === "finishing" && trainerBackPose.complete && trainerBackPose.naturalWidth) {
      drawFinishTrainer(player, s);
      return;
    }
    const walkRate = 5.2 + state.forwardBoost * 1.6;
    const frameFloat = state.animTime * walkRate;
    const frame = Math.floor(frameFloat) % 4;
    const nextFrame = (frame + 1) % 4;
    const frameProgress = frameFloat - Math.floor(frameFloat);
    const blendProgress = Math.max(0, Math.min(1, (frameProgress - .12) / .76));
    const frameBlend = blendProgress * blendProgress * (3 - 2 * blendProgress);
    const walkPhase = frameFloat * TAU / 4;
    const run = Math.sin(walkPhase);
    const bodyBob = (1 - Math.cos(walkPhase * 2)) * .45 * s;
    if (trainerWalkSheet.complete && trainerWalkSheet.naturalWidth) {
      const cellWidth = trainerWalkSheet.naturalWidth / 2;
      const cellHeight = trainerWalkSheet.naturalHeight / 2;
      const imageHeight = 192 * s;
      const imageWidth = imageHeight * (cellWidth / cellHeight);
      ctx.save();
      ctx.translate(x, y - bodyBob + fallDrop);
      ctx.rotate(fallTilt);
      const baseAlpha = state.invulnerable > 0 && Math.floor(state.invulnerable * 12) % 2 ? .38 : 1;
      ctx.fillStyle = "rgba(33,65,48,.24)";
      ctx.beginPath();
      ctx.ellipse(0, 4 + bodyBob, imageWidth * (.285 + Math.cos(walkPhase * 2) * .008), 10 * s, 0, 0, TAU);
      ctx.fill();
      ctx.shadowColor = "rgba(12,45,54,.34)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;

      const drawWalkFrame = (frameIndex, alpha) => {
        const anchor = trainerFrameAnchors[frameIndex];
        ctx.globalAlpha = baseAlpha * alpha;
        ctx.drawImage(
          trainerWalkSheet,
          (frameIndex % 2) * cellWidth,
          Math.floor(frameIndex / 2) * cellHeight,
          cellWidth,
          cellHeight,
          -imageWidth * anchor.centerX,
          -imageHeight * anchor.bottom,
          imageWidth,
          imageHeight
        );
      };
      drawWalkFrame(frame, 1 - frameBlend);
      if (frameBlend > 0) drawWalkFrame(nextFrame, frameBlend);
      ctx.restore();
      return;
    }
    ctx.save(); ctx.translate(x, y + fallDrop); ctx.rotate(fallTilt); ctx.scale(s,s);
    if (state.invulnerable > 0 && Math.floor(state.invulnerable * 12) % 2) ctx.globalAlpha = .38;
    ctx.fillStyle="rgba(33,65,48,.22)";ctx.beginPath();ctx.ellipse(0,8,39,11,0,0,TAU);ctx.fill();
    ctx.strokeStyle="#284b61";ctx.lineWidth=13;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(-8,-36);ctx.lineTo(-14+run*4,0);ctx.stroke();ctx.beginPath();ctx.moveTo(8,-36);ctx.lineTo(15-run*4,0);ctx.stroke();
    ctx.fillStyle="#f4f0e6";ctx.beginPath();ctx.ellipse(-15+run*4,3,13,6,0,0,TAU);ctx.ellipse(16-run*4,3,13,6,0,0,TAU);ctx.fill();
    ctx.fillStyle="#ef4e4d"; roundedRect(-29,-93,58,59,16);ctx.fill();
    ctx.fillStyle="#315f85";roundedRect(-24,-86,48,53,14);ctx.fill();ctx.fillStyle="#ffcf43";ctx.fillRect(-17,-83,34,8);
    ctx.strokeStyle="#efc7a2";ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(-25,-79);ctx.lineTo(-37-run*4,-49);ctx.stroke();ctx.beginPath();ctx.moveTo(25,-79);ctx.lineTo(37+run*4,-49);ctx.stroke();
    ctx.fillStyle="#efc7a2";ctx.beginPath();ctx.arc(0,-111,25,0,TAU);ctx.fill();
    ctx.fillStyle="#302d37";ctx.beginPath();ctx.arc(0,-118,25,Math.PI,TAU);ctx.fill();
    ctx.fillStyle="#e84445";ctx.beginPath();ctx.arc(0,-124,27,Math.PI,TAU);ctx.fill();ctx.fillRect(-27,-124,54,7);ctx.fillStyle="white";ctx.fillRect(-4,-150,9,27);
    ctx.restore();
  }

  function drawThrow() {
    if (!state.thrown) return;
    const t = Math.min(1, state.thrown.t);
    const target = state.thrown.target;
    const arc = Math.sin(t * Math.PI) * height * .18;
    const x = state.thrown.startX + (target.screenX - state.thrown.startX) * t;
    const y = state.thrown.startY + (target.screenY - state.thrown.startY) * t - arc;
    drawPokeball(x, y, 13 + Math.sin(t*Math.PI)*4, t * 12, state.thrown.ballType);
  }

  function drawParticles() {
    for (const p of state.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,TAU);ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawDragGuide() {
    if (!state.ballGestureStart || !state.ballGestureCurrent || state.ballGestureHandled || state.thrown) return;
    ctx.save();
    ctx.strokeStyle="rgba(255,255,255,.8)";ctx.lineWidth=3;ctx.setLineDash([8,8]);
    ctx.beginPath();ctx.moveTo(state.ballGestureStart.x,state.ballGestureStart.y);ctx.lineTo(state.ballGestureCurrent.x,state.ballGestureCurrent.y);ctx.stroke();
    ctx.restore();
  }

  function render() {
    ctx.save();
    if (state.shake > 0) ctx.translate(randomBetween(-8,8)*state.shake/.38, randomBetween(-5,5)*state.shake/.38);
    if (state.inGym) {
      drawArenaBackground();
      [...state.gymCreatures].sort((a,b)=>a.z-b.z).forEach(drawGymCreature);
      drawGymObstacles();
    } else {
      drawBackground();
      drawFinishLine();
      drawGymGate();
      [...state.creatures].sort((a,b)=>a.z-b.z).forEach(drawCreature);
      drawWorldItems();
    }
    drawTrainer();
    drawThrow();
    drawParticles();
    drawDragGuide();
    if (state.flash > 0) {ctx.globalAlpha=state.flash*.8;ctx.fillStyle="#ff5454";ctx.fillRect(0,0,width,height);ctx.globalAlpha=1;}
    ctx.restore();
  }

  function loop(now) {
    const dt = Math.min(.035, (now - (state.lastTime || now)) / 1000);
    state.lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  function canvasPoint(event) {
    return { x: event.clientX, y: event.clientY };
  }

  function findCreatureAt(point) {
    const creatures = state.inGym ? state.gymCreatures : state.creatures;
    return [...creatures].reverse().find(c => !c.caught && c.z > .10 && c.z < .99 && Math.hypot(point.x-c.screenX,point.y-c.screenY) < c.screenR);
  }

  canvas.addEventListener("pointerdown", event => {
    if (state.mode !== "playing") return;
    event.preventDefault();
    const p = canvasPoint(event);
    let creature = findCreatureAt(p);
    if (!state.inGym && !creature && (p.x < width * .38 || p.x > width * .62)) {
      const side = p.x < width / 2 ? -1 : 1;
      creature = [...state.creatures]
        .filter(candidate => !candidate.caught && candidate.side === side && candidate.z > .10 && candidate.z < .99)
        .sort((a, b) => Math.hypot(p.x - a.screenX, p.y - a.screenY) - Math.hypot(p.x - b.screenX, p.y - b.screenY))[0];
    }
    state.pointer = p;
    state.gestureHandled = false;
    state.gestureCandidate = creature || null;
    if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", event => {
    if (!state.pointer || state.gestureHandled || state.mode !== "playing") return;
    const current = canvasPoint(event);
    const dx = current.x - state.pointer.x;
    const dy = current.y - state.pointer.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
    state.gestureHandled = true;
    state.gestureCandidate = null;
    if (Math.abs(dx) > Math.abs(dy)) moveLane(dx > 0 ? 1 : -1);
    else moveDepth(dy < 0 ? -1 : 1);
  });

  function finishCanvasGesture(event) {
    if (!state.pointer || state.mode !== "playing") return;
    const end = canvasPoint(event);
    const dx = end.x - state.pointer.x;
    const dy = end.y - state.pointer.y;
    const travel = Math.hypot(dx, dy);
    if (!state.gestureHandled && travel < 24 && state.gestureCandidate) {
      selectCreature(state.gestureCandidate);
    } else if (!state.gestureHandled && Math.max(Math.abs(dx), Math.abs(dy)) >= 28) {
      if (Math.abs(dx) > Math.abs(dy)) moveLane(dx > 0 ? 1 : -1);
      else moveDepth(dy < 0 ? -1 : 1);
    }
    state.pointer = null;
    state.gestureHandled = false;
    state.gestureCandidate = null;
  }

  canvas.addEventListener("pointerup", finishCanvasGesture);
  canvas.addEventListener("pointercancel", () => {
    state.pointer = null;
    state.gestureHandled = false;
    state.gestureCandidate = null;
  });

  ui.throwPad.addEventListener("pointerdown", event => {
    event.preventDefault();
    event.stopPropagation();
    if (state.mode !== "playing" || state.throwing || state.riverFall) return;
    if (ui.throwPad.setPointerCapture) ui.throwPad.setPointerCapture(event.pointerId);
    state.ballGestureStart = canvasPoint(event);
    state.ballGestureCurrent = state.ballGestureStart;
    state.ballGestureHandled = false;
    ui.throwPad.classList.add("dragging");
  });

  ui.throwPad.addEventListener("pointermove", event => {
    if (!state.ballGestureStart || state.ballGestureHandled) return;
    event.preventDefault();
    state.ballGestureCurrent = canvasPoint(event);
    const dx = state.ballGestureCurrent.x - state.ballGestureStart.x;
    const upward = state.ballGestureStart.y - state.ballGestureCurrent.y;
    if (upward > 34 && upward > Math.abs(dx) * .75) {
      state.ballGestureHandled = true;
      ui.throwPad.classList.remove("dragging");
      state.ballGestureStart = null;
      state.ballGestureCurrent = null;
      throwAtSelected();
    }
  });

  function finishBallGesture(event) {
    if (!state.ballGestureStart) return;
    const end = canvasPoint(event);
    const dx = end.x - state.ballGestureStart.x;
    const dy = end.y - state.ballGestureStart.y;
    const upward = -dy;
    const travel = Math.hypot(dx, dy);
    ui.throwPad.classList.remove("dragging");
    state.ballGestureStart = null;
    state.ballGestureCurrent = null;
    if (state.ballGestureHandled) {
      state.ballGestureHandled = false;
      return;
    }
    if (travel < 16) cycleBallType();
    else if (upward > 28 && upward > Math.abs(dx) * .75) throwAtSelected();
    else showToast("SWIPE THE BALL UP TO THROW");
  }

  ui.throwPad.addEventListener("pointerup", finishBallGesture);
  window.addEventListener("pointerup", finishBallGesture);
  ui.throwPad.addEventListener("pointercancel", () => {
    ui.throwPad.classList.remove("dragging");
    state.ballGestureStart = null;
    state.ballGestureCurrent = null;
    state.ballGestureHandled = false;
  });

  window.addEventListener("keydown", event => {
    if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space","KeyA","KeyD","KeyW","KeyS"].includes(event.code)) event.preventDefault();
    if (event.code === "ArrowLeft" || event.code === "KeyA") moveLane(-1);
    if (event.code === "ArrowRight" || event.code === "KeyD") moveLane(1);
    if (event.code === "ArrowUp" || event.code === "KeyW") moveDepth(-1);
    if (event.code === "ArrowDown" || event.code === "KeyS") moveDepth(1);
    if (event.code === "Space") {
      if (!state.selected) {
        const activeCreatures = state.inGym ? state.gymCreatures : state.creatures;
        const nearest = [...activeCreatures].filter(c=>c.z>.2&&c.z<.9).sort((a,b)=>b.z-a.z)[0];
        if (nearest) selectCreature(nearest);
      } else throwAtSelected();
    }
    if (event.code === "Escape" || event.code === "KeyP") togglePause();
  });

  ui.startButton.addEventListener("click", resetGame);
  ui.difficultyButtons.forEach(button => button.addEventListener("click", () => {
    const difficulty = button.dataset.difficulty;
    if (!DIFFICULTIES[difficulty]) return;
    state.difficulty = difficulty;
    ui.difficultyButtons.forEach(option => option.setAttribute("aria-pressed", String(option === button)));
    ui.difficultyDescription.textContent = DIFFICULTIES[difficulty].description;
    setCustomControlsVisible(difficulty === "custom");
    updateHUD();
  }));
  [ui.customSpeed, ui.customObstacles, ui.customBalls, ui.customPokemon, ui.customRouteLength].forEach(input => {
    input.addEventListener("input", updateCustomDifficulty);
  });
  ui.resumeButton.addEventListener("click", () => togglePause(true));
  ui.pauseButton.addEventListener("click", () => togglePause());
  ui.gymExitButton.addEventListener("click", exitGym);
  ui.menuButtons.forEach(button => button.addEventListener("click", showMenu));
  document.querySelectorAll(".restart-button").forEach(button => button.addEventListener("click", resetGame));
  window.addEventListener("resize", resize);
  window.addEventListener("blur", () => { if (state.mode === "playing") togglePause(); });

  updateCustomDifficulty();
  randomizeTitlePokemon();
  setCustomControlsVisible(false);
  resize();
  seedWorld();
  updateHUD();
  requestAnimationFrame(loop);
})();
