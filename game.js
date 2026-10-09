/**
 * Butt Smacker - Main Game Engine
 * Handles 3x3 hole grid, butt emergence, smacking physics,
 * poop particle simulation, screen splats, combo tracking,
 * and 100-second countdown.
 */

// SVG markup for the cartoon butt
const BUTT_SVG_TEMPLATE = `
<svg class="butt-svg" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Skin gradient -->
    <radialGradient id="buttSkinGradient" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ffb8b8" />
      <stop offset="70%" stop-color="#ff7675" />
      <stop offset="100%" stop-color="#d63031" />
    </radialGradient>
    <!-- Golden skin gradient for special variant -->
    <radialGradient id="goldenSkinGradient" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ffeaa7" />
      <stop offset="65%" stop-color="#fdcb6e" />
      <stop offset="100%" stop-color="#e17055" />
    </radialGradient>
    <!-- Rosy cheek blush -->
    <radialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff7675" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#ff7675" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Butt Body Base -->
  <g class="butt-body">
    <!-- Left Cheek -->
    <path class="cheek-left" d="M80 120 C 50 130 15 110 15 70 C 15 30 50 25 80 50 Z" 
          fill="url(#buttSkinGradient)" stroke="#2d3436" stroke-width="4" stroke-linejoin="round" />
    
    <!-- Right Cheek -->
    <path class="cheek-right" d="M80 120 C 110 130 145 110 145 70 C 145 30 110 25 80 50 Z" 
          fill="url(#buttSkinGradient)" stroke="#2d3436" stroke-width="4" stroke-linejoin="round" />

    <!-- Rosy blush on cheeks -->
    <ellipse cx="45" cy="72" rx="16" ry="12" fill="url(#blushGradient)" />
    <ellipse cx="115" cy="72" rx="16" ry="12" fill="url(#blushGradient)" />

    <!-- Center Cleft Line -->
    <path d="M80 48 Q79 85 80 122" stroke="#b71540" stroke-width="3.5" stroke-linecap="round" />

    <!-- Cute peach glint / highlights -->
    <path d="M38 45 C42 38 52 35 60 38" stroke="white" stroke-width="4" stroke-linecap="round" opacity="0.75" />
    <path d="M122 45 C118 38 108 35 100 38" stroke="white" stroke-width="4" stroke-linecap="round" opacity="0.75" />

    <!-- Red Handprint Slap Mark (revealed when hit) -->
    <g class="slap-mark">
      <ellipse cx="106" cy="76" rx="15" ry="14" fill="#d63031" opacity="0.8" />
      <!-- Finger marks -->
      <path d="M96 64 Q94 50 96 46" stroke="#d63031" stroke-width="5" stroke-linecap="round" opacity="0.85" />
      <path d="M103 61 Q103 45 105 40" stroke="#d63031" stroke-width="5.5" stroke-linecap="round" opacity="0.85" />
      <path d="M111 62 Q113 46 116 42" stroke="#d63031" stroke-width="5" stroke-linecap="round" opacity="0.85" />
      <path d="M118 66 Q122 52 126 49" stroke="#d63031" stroke-width="4.5" stroke-linecap="round" opacity="0.85" />
      <path d="M92 78 Q84 75 80 72" stroke="#d63031" stroke-width="4.5" stroke-linecap="round" opacity="0.85" />
    </g>
  </g>
</svg>
`;

// Cartoon Hand Cursor SVG
const HAND_SVG = `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Cartoon Open Slapping Hand -->
  <g id="hand-glove">
    <!-- Glove cuff -->
    <path d="M25 85 L55 95 L65 75 L35 65 Z" fill="#e84118" stroke="#2f3542" stroke-width="3" />
    <!-- Palm -->
    <path d="M32 70 C24 55 25 35 45 35 C55 35 65 42 70 55 C74 65 65 80 48 78 Z" 
          fill="#fffa65" stroke="#2f3542" stroke-width="3.5" stroke-linejoin="round" />
    <!-- Thumb -->
    <path d="M26 58 C14 55 12 42 22 38 C30 35 34 45 35 52 Z" 
          fill="#fff200" stroke="#2f3542" stroke-width="3" />
    <!-- Index Finger -->
    <path d="M42 36 C42 20 50 12 56 14 C62 16 60 28 58 36 Z" 
          fill="#fff200" stroke="#2f3542" stroke-width="3" />
    <!-- Middle Finger -->
    <path d="M54 36 C56 16 64 10 71 12 C77 14 74 26 70 38 Z" 
          fill="#fff200" stroke="#2f3542" stroke-width="3" />
    <!-- Ring Finger -->
    <path d="M66 38 C70 20 78 16 83 20 C88 24 84 34 78 44 Z" 
          fill="#fff200" stroke="#2f3542" stroke-width="3" />
    <!-- Pinky Finger -->
    <path d="M74 46 C80 34 88 32 92 37 C96 42 90 52 82 58 Z" 
          fill="#fff200" stroke="#2f3542" stroke-width="3" />
    <!-- Palm lines & creases -->
    <path d="M42 54 Q54 62 64 56" stroke="#f39c12" stroke-width="2.5" stroke-linecap="round" />
    <path d="M38 64 Q48 70 58 66" stroke="#f39c12" stroke-width="2" stroke-linecap="round" />
    <!-- Motion slap lines -->
    <path d="M78 8 Q86 16 90 26" stroke="#ff4757" stroke-width="3" stroke-linecap="round" />
    <path d="M88 4 Q98 14 102 24" stroke="#ffa502" stroke-width="2.5" stroke-linecap="round" />
  </g>
</svg>
`;

// Realistic & Comedic Fly SVG
const FLY_SVG = `
<svg class="fly-svg" viewBox="0 0 40 40">
  <!-- Legs -->
  <path d="M14 20 L5 14 M14 24 L4 26 M14 28 L6 34" stroke="#111" stroke-width="2" stroke-linecap="round"/>
  <path d="M26 20 L35 14 M26 24 L36 26 M26 28 L34 34" stroke="#111" stroke-width="2" stroke-linecap="round"/>
  
  <!-- Left Wing -->
  <g class="fly-wing-left">
    <ellipse cx="12" cy="11" rx="7" ry="13" transform="rotate(-30 12 11)" fill="rgba(225, 245, 255, 0.78)" stroke="#57606f" stroke-width="1"/>
    <path d="M12 22 Q10 13 14 5" stroke="rgba(116, 125, 140, 0.6)" stroke-width="0.8" fill="none"/>
  </g>
  
  <!-- Right Wing -->
  <g class="fly-wing-right">
    <ellipse cx="28" cy="11" rx="7" ry="13" transform="rotate(30 28 11)" fill="rgba(225, 245, 255, 0.78)" stroke="#57606f" stroke-width="1"/>
    <path d="M28 22 Q30 13 26 5" stroke="rgba(116, 125, 140, 0.6)" stroke-width="0.8" fill="none"/>
  </g>

  <!-- Fly Body -->
  <!-- Abdomen -->
  <ellipse cx="20" cy="26" rx="6" ry="9" fill="#1e272e" stroke="#050505" stroke-width="1.2"/>
  <path d="M15 23 Q20 25 25 23 M15 27 Q20 29 25 27 M16 31 Q20 33 24 31" stroke="#353b48" stroke-width="1.2"/>
  
  <!-- Thorax with metallic sheen -->
  <ellipse cx="20" cy="17" rx="6.5" ry="6" fill="#1b2a24" stroke="#050505" stroke-width="1.2"/>
  <ellipse cx="19" cy="16" rx="3.5" ry="3" fill="#2ed573" opacity="0.35"/>
  
  <!-- Head & Red Compound Eyes -->
  <circle cx="20" cy="10" r="4.5" fill="#1e272e"/>
  <ellipse cx="16.5" cy="9.5" rx="2.5" ry="3" fill="#eb2f06"/>
  <ellipse cx="23.5" cy="9.5" rx="2.5" ry="3" fill="#eb2f06"/>
  <circle cx="16" cy="8.5" r="0.8" fill="#fff" opacity="0.85"/>
  <circle cx="23" cy="8.5" r="0.8" fill="#fff" opacity="0.85"/>
</svg>
`;

// Massive, view-blocking poop splat SVG templates
const SPLAT_SVG_TEMPLATES = [
  // 1. Heavy mud puddle with long gooey drips creeping down
  `
  <svg viewBox="0 0 160 180" width="100%" height="100%">
    <defs>
      <radialGradient id="splatGrad1" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#4a2810"/>
        <stop offset="70%" stop-color="#351a05"/>
        <stop offset="100%" stop-color="#231002"/>
      </radialGradient>
    </defs>
    <path d="M80 30 C110 20 135 45 130 75 C145 95 130 120 115 125 C120 145 105 170 95 175 C85 180 80 155 78 135 C65 160 55 165 48 150 C40 135 50 120 40 115 C20 110 15 80 35 60 C30 40 55 25 80 30 Z" 
          fill="url(#splatGrad1)" opacity="0.96"/>
    <path d="M92 135 Q96 155 94 175 Q90 185 88 175 Q90 155 90 135 Z" fill="#2d1504"/>
    <path d="M52 125 Q48 145 50 160 Q54 165 56 155 Q54 140 56 125 Z" fill="#2d1504"/>
    <path d="M118 115 Q125 135 122 145 Q118 148 116 138 Q118 125 116 115 Z" fill="#351a05"/>
    <ellipse cx="65" cy="55" rx="14" ry="7" fill="rgba(255,255,255,0.22)" transform="rotate(-20 65 55)"/>
    <circle cx="105" cy="70" r="5" fill="rgba(255,255,255,0.18)"/>
    <circle cx="22" cy="40" r="6" fill="#3a1c06"/>
    <circle cx="140" cy="50" r="7" fill="#4a2810"/>
    <circle cx="138" cy="115" r="5" fill="#351a05"/>
    <circle cx="32" cy="140" r="5" fill="#2d1504"/>
  </svg>
  `,

  // 2. Wide explosive mud splatter with tentacles
  `
  <svg viewBox="0 0 180 180" width="100%" height="100%">
    <defs>
      <radialGradient id="splatGrad2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#583112"/>
        <stop offset="65%" stop-color="#3d2008"/>
        <stop offset="100%" stop-color="#241103"/>
      </radialGradient>
    </defs>
    <path d="M90 25 Q115 10 120 40 Q150 35 145 65 Q175 75 160 100 Q175 125 145 135 Q140 165 115 155 Q95 180 80 155 Q55 170 50 140 Q20 145 30 115 Q10 95 30 75 Q15 50 45 45 Q55 15 90 25 Z" 
          fill="url(#splatGrad2)" opacity="0.95"/>
    <path d="M78 145 Q75 165 77 180 Q81 185 83 172 Q82 155 82 145 Z" fill="#241103"/>
    <path d="M112 145 Q118 162 115 174 Q111 176 110 165 Q110 150 110 145 Z" fill="#241103"/>
    <circle cx="90" cy="90" r="38" fill="#2b1405"/>
    <ellipse cx="80" cy="80" rx="18" ry="9" fill="rgba(255,255,255,0.2)" transform="rotate(-15 80 80)"/>
    <circle cx="165" cy="55" r="6" fill="#4a2810"/>
    <circle cx="160" cy="145" r="7" fill="#3d2008"/>
    <circle cx="20" cy="130" r="5" fill="#3d2008"/>
    <circle cx="15" cy="65" r="6" fill="#241103"/>
  </svg>
  `,

  // 3. Thick gooey swirling sludge with comic poop emoji
  `
  <svg viewBox="0 0 170 170" width="100%" height="100%">
    <defs>
      <radialGradient id="splatGrad3" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stop-color="#5c3416"/>
        <stop offset="70%" stop-color="#381b06"/>
        <stop offset="100%" stop-color="#1f0e03"/>
      </radialGradient>
    </defs>
    <path d="M85 20 Q120 15 135 45 Q165 65 150 100 Q160 135 125 150 Q95 170 65 155 Q35 160 25 125 Q10 95 30 65 Q25 35 55 25 Q70 10 85 20 Z" 
          fill="url(#splatGrad3)" opacity="0.97"/>
    <path d="M95 145 Q98 165 96 178 Q92 180 91 168 Q92 152 93 145 Z" fill="#1f0e03"/>
    <path d="M60 140 Q55 158 58 170 Q62 172 63 162 Q61 148 62 140 Z" fill="#1f0e03"/>
    <circle cx="85" cy="85" r="42" fill="#2b1405"/>
    <ellipse cx="75" cy="72" rx="20" ry="10" fill="rgba(255,255,255,0.22)" transform="rotate(-15 75 72)"/>
    <text x="85" y="98" font-size="44" text-anchor="middle" dominant-baseline="middle" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))">💩</text>
  </svg>
  `
];

class ButtGame {
  constructor() {
    this.TOTAL_TIME = 100; // 100-second countdown
    this.timeLeft = this.TOTAL_TIME;
    this.score = 0;
    this.totalClicks = 0;
    this.hits = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.timerInterval = null;
    this.holes = []; // Array of 9 hole elements & state

    // High score from localStorage
    this.highScore = parseInt(localStorage.getItem('butt_smacker_highscore') || '0', 10);

    // Canvas & particles
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animFrameId = null;

    // DOM references
    this.appEl = document.getElementById('game-app');
    this.lawnEl = document.getElementById('lawn-container');
    this.hudScore = document.getElementById('hud-score');
    this.hudTimer = document.getElementById('hud-timer');
    this.timerFill = document.getElementById('timer-progress-fill');
    this.comboBadge = document.getElementById('combo-badge');
    this.playerHand = document.getElementById('player-hand');
    this.screenSplats = document.getElementById('screen-splats');
    this.screenFlies = document.getElementById('screen-flies');

    // Splats & Flies State
    this.activeSplats = [];
    this.flies = [];
    this.splatCounter = 0;
    this.flyCounter = 0;

    // Overlays
    this.startScreen = document.getElementById('start-screen');
    this.gameOverScreen = document.getElementById('game-over-screen');

    this.init();
  }

  init() {
    this.setupHandCursor();
    this.buildGrid();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.bindEvents();
    this.startParticleLoop();

    // Display initial high scores
    const startHighscoreEl = document.getElementById('start-highscore');
    if (startHighscoreEl) {
      startHighscoreEl.textContent = this.highScore;
    }
  }

  setupHandCursor() {
    if (this.playerHand) {
      this.playerHand.innerHTML = HAND_SVG;
    }
  }

  // Generate 9 holes in the lawn
  buildGrid() {
    this.lawnEl.innerHTML = '';
    this.holes = [];

    for (let i = 0; i < 9; i++) {
      const slot = document.createElement('div');
      slot.className = 'hole-slot';
      slot.dataset.index = i;

      // Layer 1: Pit Base
      const holeBase = document.createElement('div');
      holeBase.className = 'hole-base';

      // Layer 2: Butt Wrapper
      const buttWrapper = document.createElement('div');
      buttWrapper.className = 'butt-wrapper';
      buttWrapper.innerHTML = BUTT_SVG_TEMPLATE;

      // Layer 3: Front Rim & Tufts
      const holeFront = document.createElement('div');
      holeFront.className = 'hole-front';

      const tuftLeft = document.createElement('div');
      tuftLeft.className = 'grass-tuft';
      tuftLeft.style.left = '12%';

      const tuftRight = document.createElement('div');
      tuftRight.className = 'grass-tuft';
      tuftRight.style.right = '15%';
      tuftRight.style.transform = 'scaleX(-1) rotate(-15deg)';

      slot.appendChild(holeBase);
      slot.appendChild(buttWrapper);
      slot.appendChild(holeFront);
      slot.appendChild(tuftLeft);
      slot.appendChild(tuftRight);

      this.lawnEl.appendChild(slot);

      this.holes.push({
        index: i,
        slotEl: slot,
        buttEl: buttWrapper,
        isUp: false,
        isHit: false,
        cycleTimer: null,
        isGolden: false
      });
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    // Start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        window.soundController.init();
        this.startGame();
      });
    }

    // Play again button
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.startGame();
      });
    }

    // Audio toggle button
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.soundController.init();
        const isMuted = window.soundController.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
        muteBtn.title = isMuted ? 'Unmute' : 'Mute';
      });
    }

    // Mouse movement: move hand
    window.addEventListener('pointermove', (e) => {
      this.updateHandPosition(e.clientX, e.clientY);
    });

    // Handle smacking clicks / touches across the lawn & holes
    this.lawnEl.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      window.soundController.init();
      this.handlePointerDown(e);
    });

    // Prevent double-tap zoom and context menu on mobile
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  updateHandPosition(x, y) {
    if (this.playerHand) {
      this.playerHand.style.left = `${x}px`;
      this.playerHand.style.top = `${y}px`;
    }
  }

  // Universal smack handler for both mouse and touch
  handlePointerDown(e) {
    if (!this.isPlaying || this.isPaused) return;

    this.totalClicks++;
    const x = e.clientX;
    const y = e.clientY;

    // Move hand directly to pointer (especially useful on mobile touch)
    this.updateHandPosition(x, y);

    // Trigger hand slap animation
    if (this.playerHand) {
      this.playerHand.classList.remove('slapping');
      void this.playerHand.offsetWidth; // Force reflow
      this.playerHand.classList.add('slapping');
    }

    // Trigger haptic vibration on mobile
    if (navigator.vibrate) {
      try {
        navigator.vibrate([25, 20, 35]);
      } catch (err) {}
    }

    // Create impact ripple shockwave
    this.createImpactRipple(x, y);

    // Check if clicked near any active fly to swat it!
    let flySwatted = false;
    for (const fly of this.flies) {
      if (!fly.swatted && !fly.leaving) {
        const dist = Math.hypot(fly.x - x, fly.y - y);
        if (dist < 46) {
          if (Math.random() < 0.4) {
            // Panic dodge!
            fly.state = 'flying';
            fly.el.classList.remove('landed');
            fly.vx = (Math.random() - 0.5) * 22;
            fly.vy = (Math.random() - 0.5) * 22;
            this.showFloatingText(fly.x, fly.y - 15, 'DODGED! 💨', '#ffa502');
          } else {
            // Swatted!
            fly.swatted = true;
            fly.el.classList.add('swatted');
            window.soundController.playFlySwat();
            this.showFloatingText(fly.x, fly.y - 20, '+1 SWAT! 🪰💥', '#2ed573');
            this.score += 1;
            this.hits += 1;
            this.hudScore.textContent = this.score;
            flySwatted = true;
            setTimeout(() => {
              fly.el.remove();
              const idx = this.flies.indexOf(fly);
              if (idx !== -1) this.flies.splice(idx, 1);
            }, 450);
          }
          break;
        }
      }
    }

    // Check if clicked an active butt or its hole slot
    const holeSlot = e.target.closest('.hole-slot');
    let hitFound = false;

    if (holeSlot) {
      const holeIndex = parseInt(holeSlot.dataset.index, 10);
      const hole = this.holes[holeIndex];
      if (hole && hole.isUp && !hole.isHit) {
        this.smackButt(holeIndex, x, y);
        hitFound = true;
      }
    }

    if (!hitFound && !flySwatted) {
      // Missed hit! Empty smack
      this.handleMiss(x, y);
    }
  }

  createImpactRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'impact-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  }

  smackButt(holeIndex, x, y) {
    const hole = this.holes[holeIndex];
    if (!hole || !hole.isUp || hole.isHit) return;

    hole.isHit = true;
    hole.buttEl.classList.add('hit');

    // 1 Point earned per user request!
    let pointVal = 1;
    this.score += pointVal;
    this.hits++;
    this.combo++;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }

    // Play crisp slap and wet squirt sound effects
    window.soundController.playSlap();
    window.soundController.playSquirt();

    // Check combo chime
    if (this.combo >= 5 && this.combo % 5 === 0) {
      window.soundController.playChime(1 + (this.combo / 20));
    }

    // Update Score Display
    this.hudScore.textContent = this.score;

    // Show floating score and comic text
    this.showFloatingText(x, y - 20, `+${pointVal}`, '#ff4757');
    if (this.combo >= 3) {
      const texts = ['SMACK!', 'SPLAT!', 'PERFECT!', 'JUICY!', 'SLAP MASTER!'];
      const text = texts[Math.min(this.combo - 3, texts.length - 1)];
      this.showFloatingText(x + (Math.random() * 40 - 20), y - 60, text, '#ffa502');
    }

    // Update Combo Badge
    this.updateComboUI();

    // Squirt out poop! Particles burst
    const rect = hole.buttEl.getBoundingClientRect();
    const squirtOriginX = rect.left + rect.width * 0.5;
    const squirtOriginY = rect.top + rect.height * 0.6;
    this.spawnPoopExplosion(squirtOriginX, squirtOriginY);

    // Squirt poop directly onto the screen to block the player's view!
    if (Math.random() < 0.8 || this.combo >= 2) {
      this.spawnScreenSplat(squirtOriginX, squirtOriginY);
    }

    // Clear retreat timer and retreat butt after hit reaction, then continue hole cycle
    if (hole.cycleTimer) {
      clearTimeout(hole.cycleTimer);
      hole.cycleTimer = null;
    }
    hole.cycleTimer = setTimeout(() => {
      this.retreatHole(hole);
    }, 280);
  }

  handleMiss(x, y) {
    window.soundController.playWhoosh();
    this.combo = 0;
    this.updateComboUI();
    this.showFloatingText(x, y - 20, 'MISS!', '#a4b0be');
  }

  updateComboUI() {
    if (this.combo >= 2) {
      this.comboBadge.textContent = `COMBO x${this.combo}! 🔥`;
      this.comboBadge.classList.add('active');
    } else {
      this.comboBadge.classList.remove('active');
    }
  }

  showFloatingText(x, y, text, color = '#ff4757') {
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-text';
    floatEl.textContent = text;
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;
    floatEl.style.color = color;
    document.body.appendChild(floatEl);

    setTimeout(() => {
      floatEl.remove();
    }, 850);
  }

  // =========================================================================
  // POOP SQUIRT PARTICLE PHYSICS
  // =========================================================================
  spawnPoopExplosion(originX, originY) {
    const particleCount = 20 + Math.floor(Math.random() * 12);

    for (let i = 0; i < particleCount; i++) {
      // Eject upwards and outwards in a hilarious arc
      const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.6;
      const speed = 7 + Math.random() * 14;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const isEmoji = Math.random() < 0.28; // Poop swirl emoji 💩

      this.particles.push({
        x: originX,
        y: originY,
        vx: vx,
        vy: vy,
        gravity: 0.45,
        friction: 0.985,
        radius: 4 + Math.random() * 8,
        color: ['#5c381c', '#794823', '#4a2810', '#8c531b'][Math.floor(Math.random() * 4)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.018,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        isEmoji: isEmoji,
        emoji: '💩',
        size: 18 + Math.random() * 16
      });
    }
  }

  // Splatter poop directly into the player's field of view to block vision
  spawnScreenSplat(originX, originY) {
    if (!this.screenSplats || !this.lawnEl) return;

    // Target positions biased directly across the 3x3 lawn area
    const lawnRect = this.lawnEl.getBoundingClientRect();
    const targetX = lawnRect.left + (Math.random() * 0.76 + 0.12) * lawnRect.width;
    const targetY = lawnRect.top + (Math.random() * 0.76 + 0.12) * lawnRect.height;

    // Big chunky splat size: 140px to 240px to obstruct the view
    const size = Math.floor(140 + Math.random() * 90);
    const rot = (Math.random() - 0.5) * 50;

    const splatEl = document.createElement('div');
    splatEl.className = 'screen-splat-item';
    splatEl.style.left = `${targetX - size * 0.5}px`;
    splatEl.style.top = `${targetY - size * 0.5}px`;
    splatEl.style.width = `${size}px`;
    splatEl.style.height = `${size}px`;
    splatEl.style.setProperty('--rot', `${rot}deg`);

    // Pick random rich SVG splatter template
    const template = SPLAT_SVG_TEMPLATES[Math.floor(Math.random() * SPLAT_SVG_TEMPLATES.length)];
    splatEl.innerHTML = template;

    this.screenSplats.appendChild(splatEl);

    // Audio: Loud wet impact sound
    window.soundController.playScreenSplat();

    // Subtle screen impact camera shake
    if (this.appEl) {
      this.appEl.classList.remove('lens-hit');
      void this.appEl.offsetWidth;
      this.appEl.classList.add('lens-hit');
    }

    const splatObj = {
      id: ++this.splatCounter,
      el: splatEl,
      x: targetX,
      y: targetY,
      size: size
    };
    this.activeSplats.push(splatObj);

    // Stays for 6.5s before fading away completely
    setTimeout(() => {
      splatEl.remove();
      const idx = this.activeSplats.indexOf(splatObj);
      if (idx !== -1) {
        this.activeSplats.splice(idx, 1);
      }
    }, 6500);
  }

  // =========================================================================
  // BUZZING FLIES SIMULATION (Attracted when there's too much poop)
  // =========================================================================
  updateFlies() {
    if (!this.screenFlies) return;

    // Determine target fly count based on poop on screen:
    // 0-1 splats: 0 flies
    // 2 splats: 1-2 flies
    // 3-4 splats: 3-4 flies
    // 5+ splats: 5-8 buzzing flies swarming!
    const splatCount = this.activeSplats.length;
    let desiredFlies = 0;
    if (this.isPlaying) {
      if (splatCount >= 5) desiredFlies = Math.min(8, splatCount + 1);
      else if (splatCount >= 3) desiredFlies = splatCount;
      else if (splatCount >= 2) desiredFlies = 2;
    }

    // Spawn new flies if needed
    if (this.flies.filter(f => !f.leaving && !f.swatted).length < desiredFlies) {
      this.spawnFly();
    }

    // Mark excess flies to leave
    const activeFlies = this.flies.filter(f => !f.leaving && !f.swatted);
    if (activeFlies.length > desiredFlies) {
      const excess = activeFlies.length - desiredFlies;
      for (let i = 0; i < excess; i++) {
        activeFlies[i].leaving = true;
      }
    }

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Update each fly
    for (let i = this.flies.length - 1; i >= 0; i--) {
      const fly = this.flies[i];

      if (fly.swatted) continue;

      if (fly.leaving) {
        // Fly directly out of screen bounds
        fly.x += fly.vx * 1.5;
        fly.y += fly.vy * 1.5;
        fly.rot = Math.atan2(fly.vy, fly.vx) * 180 / Math.PI + 90;

        if (fly.x < -60 || fly.x > w + 60 || fly.y < -60 || fly.y > h + 60) {
          fly.el.remove();
          this.flies.splice(i, 1);
          continue;
        }
      } else if (fly.state === 'landed') {
        // Perched on a poop splat, twitching and feeding
        fly.landTimer--;
        const twitchRot = fly.rot + (Math.random() - 0.5) * 6;
        fly.el.style.transform = `translate(-50%, -50%) rotate(${twitchRot}deg)`;

        if (fly.landTimer <= 0 || this.activeSplats.length === 0) {
          fly.state = 'flying';
          fly.el.classList.remove('landed');
          const angle = Math.random() * Math.PI * 2;
          const speed = 7 + Math.random() * 6;
          fly.vx = Math.cos(angle) * speed;
          fly.vy = Math.sin(angle) * speed;
        }
      } else {
        // Normal erratic flight
        fly.x += fly.vx;
        fly.y += fly.vy;

        // Periodic erratic direction shifts (every 18-35 frames)
        fly.decisionTimer = (fly.decisionTimer || 0) - 1;
        if (fly.decisionTimer <= 0) {
          fly.decisionTimer = 18 + Math.floor(Math.random() * 22);

          // If there are active splats, 65% chance to steer towards one
          if (this.activeSplats.length > 0 && Math.random() < 0.65) {
            const targetSplat = this.activeSplats[Math.floor(Math.random() * this.activeSplats.length)];
            const dx = targetSplat.x - fly.x;
            const dy = targetSplat.y - fly.y;
            const dist = Math.hypot(dx, dy);
            const speed = 5 + Math.random() * 7;
            if (dist > 10) {
              fly.vx = (dx / dist) * speed + (Math.random() - 0.5) * 4;
              fly.vy = (dy / dist) * speed + (Math.random() - 0.5) * 4;
            }
          } else {
            // Random darting zigzag
            const angle = Math.random() * Math.PI * 2;
            const speed = 5 + Math.random() * 8;
            fly.vx = Math.cos(angle) * speed;
            fly.vy = Math.sin(angle) * speed;
          }
        }

        // Add micro-jitter vibration for chaotic wing-buzzing movement
        fly.x += (Math.random() - 0.5) * 3;
        fly.y += (Math.random() - 0.5) * 3;

        // Boundary reflection
        if (fly.x < 30) fly.vx = Math.abs(fly.vx) + 2;
        if (fly.x > w - 30) fly.vx = -Math.abs(fly.vx) - 2;
        if (fly.y < 60) fly.vy = Math.abs(fly.vy) + 2;
        if (fly.y > h - 40) fly.vy = -Math.abs(fly.vy) - 2;

        fly.rot = Math.atan2(fly.vy, fly.vx) * 180 / Math.PI + 90;

        // Check if close to an active splat to land on it!
        for (const splat of this.activeSplats) {
          const dist = Math.hypot(fly.x - splat.x, fly.y - splat.y);
          if (dist < splat.size * 0.35 && Math.random() < 0.15) {
            fly.state = 'landed';
            fly.landTimer = 50 + Math.floor(Math.random() * 75); // ~1 to 2.5 seconds
            fly.el.classList.add('landed');
            break;
          }
        }
      }

      fly.el.style.left = `${fly.x}px`;
      fly.el.style.top = `${fly.y}px`;
      if (fly.state !== 'landed') {
        fly.el.style.transform = `translate(-50%, -50%) rotate(${fly.rot}deg)`;
      }
    }

    // Sync buzzing sound with live flies count
    const liveBuzzingFlies = this.flies.filter(f => !f.leaving && !f.swatted).length;
    window.soundController.setFlyBuzz(liveBuzzingFlies);
  }

  spawnFly() {
    if (!this.screenFlies) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Spawn from a random screen edge
    const side = Math.floor(Math.random() * 3);
    let startX = -30, startY = 100;
    if (side === 0) { startX = -30; startY = Math.random() * (h - 100) + 60; }
    else if (side === 1) { startX = w + 30; startY = Math.random() * (h - 100) + 60; }
    else { startX = Math.random() * (w - 60) + 30; startY = -30; }

    const flyEl = document.createElement('div');
    flyEl.className = 'fly-entity';
    flyEl.innerHTML = FLY_SVG;
    this.screenFlies.appendChild(flyEl);

    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 6;

    this.flies.push({
      id: ++this.flyCounter,
      el: flyEl,
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: 0,
      state: 'flying',
      landTimer: 0,
      decisionTimer: 0,
      leaving: false,
      swatted: false
    });
  }

  startParticleLoop() {
    const loop = () => {
      this.updateParticles();
      this.drawParticles();
      this.updateFlies();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.rotation += p.rotSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > window.innerHeight + 100) {
        this.particles.splice(i, 1);
      }
    }
  }

  drawParticles() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);

      if (p.isEmoji) {
        this.ctx.font = `${p.size}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(p.emoji, 0, 0);
      } else {
        // Organic splatter droplet
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.radius, p.radius * 0.75, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }

  // =========================================================================
  // BUTT SPAWNING ENGINE
  // =========================================================================
  startGame() {
    this.isPlaying = true;
    this.isPaused = false;
    this.score = 0;
    this.hits = 0;
    this.totalClicks = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.timeLeft = this.TOTAL_TIME;

    // Reset UI
    this.hudScore.textContent = '0';
    this.updateTimerDisplay();
    this.comboBadge.classList.remove('active');

    // Clean up splats and flies
    if (this.screenSplats) this.screenSplats.innerHTML = '';
    this.activeSplats = [];
    if (this.screenFlies) this.screenFlies.innerHTML = '';
    this.flies = [];
    window.soundController.setFlyBuzz(0);

    // Hide overlays
    this.startScreen.classList.remove('active');
    this.gameOverScreen.classList.remove('active');

    // Reset all holes
    this.holes.forEach(hole => this.hideButt(hole));

    // Clear any existing timer interval
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Start 100-Second countdown
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);

    // Launch independent cycle for each hole with staggered initial delay
    this.holes.forEach((hole, idx) => {
      // Stagger each hole so they don't all pop up at once
      const initialDelay = 300 + Math.random() * 2400 + (idx * 160);
      this.startHoleCycle(hole, initialDelay);
    });
  }

  tick() {
    this.timeLeft--;
    this.updateTimerDisplay();

    // Timer sound & urgency warning
    if (this.timeLeft <= 10 && this.timeLeft > 0) {
      window.soundController.playTick(this.timeLeft <= 5);
      this.hudTimer.classList.add('urgent');
    } else {
      this.hudTimer.classList.remove('urgent');
    }

    if (this.timeLeft <= 0) {
      this.endGame();
    }
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    this.hudTimer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const percent = Math.max(0, (this.timeLeft / this.TOTAL_TIME) * 100);
    if (this.timerFill) {
      this.timerFill.style.width = `${percent}%`;
    }
  }

  // =========================================================================
  // INDEPENDENT HOLE LIFECYCLE (Hidden <-> Exposed at random intervals)
  // =========================================================================
  startHoleCycle(hole, customDelay) {
    if (!this.isPlaying) return;

    if (hole.cycleTimer) {
      clearTimeout(hole.cycleTimer);
      hole.cycleTimer = null;
    }

    this.hideButt(hole);

    // Dynamic hidden interval: starts ~1.4s-3.4s, speeds up towards end
    const progress = (this.TOTAL_TIME - this.timeLeft) / this.TOTAL_TIME;
    const minHidden = Math.max(700, 1500 - progress * 700);
    const maxHidden = Math.max(1600, 3500 - progress * 1600);
    const delay = customDelay !== undefined
      ? customDelay
      : minHidden + Math.random() * (maxHidden - minHidden);

    hole.cycleTimer = setTimeout(() => {
      if (!this.isPlaying) return;
      this.exposeHole(hole);
    }, delay);
  }

  exposeHole(hole) {
    if (!this.isPlaying) return;

    hole.isUp = true;
    hole.isHit = false;

    // Golden butt special variant in frantic phase
    const progress = (this.TOTAL_TIME - this.timeLeft) / this.TOTAL_TIME;
    hole.isGolden = (progress > 0.55 && Math.random() < 0.16);
    if (hole.isGolden) {
      hole.buttEl.classList.add('golden');
    } else {
      hole.buttEl.classList.remove('golden');
    }

    hole.buttEl.classList.remove('hit');
    hole.buttEl.classList.add('up');

    // Pop-up emergence sound
    window.soundController.playPop();

    // "Exposed for a short moment before retreating"
    // Short exposure moment: starts at ~750ms-1150ms, drops to ~480ms-750ms in fever time
    const minExposed = Math.max(480, 750 - progress * 240);
    const maxExposed = Math.max(750, 1180 - progress * 380);
    const exposedDuration = minExposed + Math.random() * (maxExposed - minExposed);

    if (hole.cycleTimer) clearTimeout(hole.cycleTimer);
    hole.cycleTimer = setTimeout(() => {
      // If not smacked during this short moment, retreat back into hole
      if (hole.isUp && !hole.isHit) {
        this.retreatHole(hole);
      }
    }, exposedDuration);
  }

  retreatHole(hole) {
    this.hideButt(hole);

    // Continue independent cycle for this hole with a fresh random hidden interval
    if (this.isPlaying) {
      this.startHoleCycle(hole);
    }
  }

  hideButt(hole) {
    hole.isUp = false;
    hole.isHit = false;
    hole.buttEl.classList.remove('up');
    hole.buttEl.classList.remove('hit');
    hole.buttEl.classList.remove('golden');
    if (hole.cycleTimer) {
      clearTimeout(hole.cycleTimer);
      hole.cycleTimer = null;
    }
  }

  // =========================================================================
  // GAME OVER & STATS
  // =========================================================================
  endGame() {
    this.isPlaying = false;
    clearInterval(this.timerInterval);

    // Hide remaining butts and cancel any pending timers
    this.holes.forEach(hole => this.hideButt(hole));

    // Clear splats and flies and silence buzzing sound
    if (this.screenSplats) this.screenSplats.innerHTML = '';
    this.activeSplats = [];
    if (this.screenFlies) this.screenFlies.innerHTML = '';
    this.flies = [];
    window.soundController.setFlyBuzz(0);

    // Play fanfare
    window.soundController.playGameOver();

    // Accuracy calculation
    const accuracy = this.totalClicks > 0 
      ? Math.round((this.hits / this.totalClicks) * 100) 
      : 0;

    // Check high score
    let isNewHigh = false;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('butt_smacker_highscore', this.highScore.toString());
      isNewHigh = true;
    }

    // Rank title determination
    let rankTitle = 'Cheek Chaser 👶';
    if (this.score >= 110) {
      rankTitle = '👑 SUPREME POOP SLAPPER GOD 👑';
    } else if (this.score >= 85) {
      rankTitle = '🏆 Grandmaster Butt Smacker 🏆';
    } else if (this.score >= 60) {
      rankTitle = '🍑 Certified Cheek Champion 🍑';
    } else if (this.score >= 35) {
      rankTitle = '✋ Spank Enthusiast ✋';
    } else if (this.score >= 15) {
      rankTitle = '🏓 Bum Bouncer 🏓';
    }

    // Populate Game Over Modal
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('final-hits').textContent = this.hits;
    document.getElementById('final-accuracy').textContent = `${accuracy}%`;
    document.getElementById('final-max-combo').textContent = this.maxCombo;
    document.getElementById('final-highscore').textContent = this.highScore;

    const rankBadge = document.getElementById('rank-badge');
    if (rankBadge) {
      rankBadge.textContent = rankTitle;
    }

    const newRecordNotice = document.getElementById('new-record-notice');
    if (newRecordNotice) {
      newRecordNotice.style.display = isNewHigh ? 'block' : 'none';
    }

    // Show modal
    setTimeout(() => {
      this.gameOverScreen.classList.add('active');
    }, 450);
  }
}

// Instantiate game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.buttGame = new ButtGame();
});
