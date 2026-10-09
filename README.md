# 🍑 Butt Smacker (屁屁大作战) ✋💩

A standalone, fast-paced arcade game built with pure modern web technologies (HTML5, CSS3, and JavaScript). Completely serverless—just double-click `index.html` to play on any desktop browser or open on your mobile phone!

---

## 🎮 Game Rules & Overview

- **The Field**: 9 holes arranged in a 3×3 grid on a grassy cartoon lawn.
- **The Target**: Each hole independently cycles between hidden and visible at random intervals. A butt is only exposed for a short moment (~0.7s to 1.1s) before retreating underground if you don't smack it in time!
- **The Player**: You are a giant slapping hand! Move and smack exposed butts before they retreat into the ground.
- **The Reaction & Vision Obstruction**: When a butt is smacked, it lets out a hilarious, juicy squirt of poop particles and slams massive splats onto your screen lens that genuinely block your field of view of the holes!
- **Buzzing Flies Swarm**: When too much poop accumulates on the screen, realistic buzzing flies swarm in, jittering, perching on splats, and creating an immersive arcade chaos with procedural 3D buzzing audio. You can even swat them with your slapping hand for bonus points!
- **Splats Lifecycle**: Poop splatters stick to the camera lens, slowly creep downward with realistic gravity drips over ~6.5 seconds, and then dissolve away.
- **Scoring**: Every successful smack earns **1 point** (`+1`). Build consecutive streaks for combo announcements! Swatting flies also earns points!
- **100-Second Countdown**: Race against the clock! As the timer ticks down, butts appear faster and more frequently.
- **Objective**: Land the most hits before time runs out to earn the high score and highest title rank.

---

## ✨ Features

- **100% Serverless & Static**: No Node server, Python server, or build step required. Works directly offline via `file://`.
- **Full Cross-Platform Support**:
  - **Desktop**: Mouse pointer is replaced with a custom animated cartoon slap hand. Click to swing and slap with impact shockwaves.
  - **Mobile**: Touch anywhere to instantly snap the hand and smack with haptic vibration feedback (`navigator.vibrate`).
- **Web Audio API Sound Engine**:
  - Crisp hand slap impact sounds.
  - Juicy cartoon squirt / fart sounds.
  - Upward pop-up boings and whoosh miss sounds.
  - Countdown urgency beeps and game-over fanfare.
  - Zero external MP3 files needed—fully generated procedurally in code!
  - Audio mute/unmute toggle.
- **Physics Particle System**:
  - 60 FPS HTML5 Canvas particle simulation for poop squirts, emojis (`💩`), droplets, and splatters.
  - Screen lens splats: Poop occasionally hits the screen and slowly drips down!
- **Dynamic Difficulty**:
  - Progressive speed ramp: butts pop up quicker and in pairs/trios as time ticks down.
  - Special golden butts appear in the late frantic phase.
- **High Scores & Stats**:
  - Persistent high score saved to browser `localStorage`.
  - Detailed game-over summary: Total Score, Hits Landed, Accuracy %, Max Combo, and Rank Titles (from *Bum Bouncer* up to *Supreme Poop Slapper God*).

---

## 🚀 How to Play

1. Open `index.html` directly in your favorite browser (Chrome, Edge, Safari, Firefox).
2. Click or tap **"START SMACKING"**.
3. Smack as many butts as you can within 100 seconds!
