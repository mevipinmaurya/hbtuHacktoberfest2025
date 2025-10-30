const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// HIGH SCORE SYSTEM
const HIGHSCORE_KEYS = {
    easy: 'underwaterExplorer_highscore_easy',
    medium: 'underwaterExplorer_highscore_medium',
    hard: 'underwaterExplorer_highscore_hard'
};

function getHighScore(difficulty) {
    const saved = localStorage.getItem(HIGHSCORE_KEYS[difficulty]);
    return saved ? parseInt(saved) : 0;
}

function setHighScore(difficulty, score) {
    const currentHigh = getHighScore(difficulty);
    if (score > currentHigh) {
        localStorage.setItem(HIGHSCORE_KEYS[difficulty], score.toString());
        return true; // New high score!
    }
    return false;
}

function updateHighScoreDisplay() {
    document.getElementById('highscoreEasy').textContent = getHighScore('easy');
    document.getElementById('highscoreMedium').textContent = getHighScore('medium');
    document.getElementById('highscoreHard').textContent = getHighScore('hard');
}

// Initialize high score display on page load
updateHighScoreDisplay();

// Game state
let gameRunning = false;
let score = 0;
let lives = 3;
let pearlsCollected = 0;
let animationFrame = 0;
let difficulty = 'medium';
let difficultySettings = {};

// Difficulty configurations
const difficulties = {
    easy: {
        lives: 5,
        diverSpeed: 4,
        boostSpeed: 8,
        enemySpeed: 0.7,
        enemySpawnRate: 150,
        collectibleSpawnRate: 80,
        maxSharks: 2,
        maxJellyfish: 3,
        maxPearls: 10,
        maxTreasures: 5
    },
    medium: {
        lives: 3,
        diverSpeed: 5,
        boostSpeed: 10,
        enemySpeed: 1,
        enemySpawnRate: 100,
        collectibleSpawnRate: 100,
        maxSharks: 4,
        maxJellyfish: 5,
        maxPearls: 8,
        maxTreasures: 3
    },
    hard: {
        lives: 2,
        diverSpeed: 6,
        boostSpeed: 12,
        enemySpeed: 1.5,
        enemySpawnRate: 70,
        collectibleSpawnRate: 130,
        maxSharks: 6,
        maxJellyfish: 7,
        maxPearls: 6,
        maxTreasures: 2
    }
};

const diver = {
    x: 150,
    y: canvas.height / 2,
    width: 40,
    height: 60,
    speed: 5,
    boostSpeed: 10,
    autoScrollSpeed: 3,
    vy: 0,
    vx: 0,
    isBoosting: false,
    color: '#ff9800'
};

let bubbles = [];
let fish = [];
let corals = [];
let pearls = [];
let treasures = [];
let sharks = [];
let jellyfish = [];
let particles = [];
let backgroundOffset = 0;

const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    difficultySettings = difficulties[difficulty];
    lives = difficultySettings.lives;
    diver.speed = difficultySettings.diverSpeed;
    diver.boostSpeed = difficultySettings.boostSpeed;
    
    document.getElementById('menuScreen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('gameInfo').style.display = 'block';
    document.getElementById('instructions').style.display = 'block';
    document.getElementById('difficulty').textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    gameRunning = true;
    init();
    gameLoop();
}

function init() {
    score = 0;
    pearlsCollected = 0;
    animationFrame = 0;
    backgroundOffset = 0;
    diver.x = 150;
    diver.y = canvas.height / 2;
    
    pearls = [];
    treasures = [];
    sharks = [];
    jellyfish = [];
    particles = [];
    
    bubbles = [];
    for (let i = 0; i < 30; i++) {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 2,
            speed: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    fish = [];
    for (let i = 0; i < 15; i++) {
        fish.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: Math.random() * 30 + 20,
            height: Math.random() * 15 + 10,
            speed: Math.random() * 2 + 1,
            color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`,
            direction: Math.random() > 0.5 ? 1 : -1
        });
    }

    corals = [];
    for (let i = 0; i < 8; i++) {
        corals.push({
            x: Math.random() * canvas.width,
            y: canvas.height - Math.random() * 150 - 50,
            width: Math.random() * 40 + 30,
            height: Math.random() * 60 + 40,
            color: `hsl(${Math.random() * 60 + 300}, 60%, 50%)`,
            sway: Math.random() * Math.PI * 2
        });
    }

    spawnCollectibles();
    spawnEnemies();
}

function spawnCollectibles() {
    if (pearls.length < difficultySettings.maxPearls) {
        pearls.push({
            x: canvas.width + Math.random() * 200,
            y: Math.random() * (canvas.height - 100) + 50,
            radius: 12,
            speed: diver.autoScrollSpeed + 0.5,
            pulse: 0
        });
    }

    if (treasures.length < difficultySettings.maxTreasures && Math.random() < 0.01) {
        treasures.push({
            x: canvas.width + Math.random() * 200,
            y: Math.random() * (canvas.height - 100) + 50,
            width: 30,
            height: 25,
            speed: diver.autoScrollSpeed + 0.3,
            sparkle: 0
        });
    }
}

function spawnEnemies() {
    if (sharks.length < difficultySettings.maxSharks) {
        sharks.push({
            x: canvas.width + Math.random() * 300,
            y: Math.random() * (canvas.height - 150) + 50,
            width: 80,
            height: 40,
            speed: diver.autoScrollSpeed + (Math.random() * 2 * difficultySettings.enemySpeed),
            dangerous: true
        });
    }

    if (jellyfish.length < difficultySettings.maxJellyfish) {
        jellyfish.push({
            x: canvas.width + Math.random() * 400,
            y: Math.random() * (canvas.height - 150) + 50,
            width: 35,
            height: 50,
            speed: diver.autoScrollSpeed + (Math.random() * 1 * difficultySettings.enemySpeed),
            float: Math.random() * Math.PI * 2,
            dangerous: true
        });
    }
}

function drawDiver() {
    ctx.save();
    ctx.translate(diver.x, diver.y);
    
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.ellipse(0, 0, diver.height / 2, diver.width / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(15, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(12, -5, 6, 0, Math.PI * 2);
    ctx.fill();

    const flipperMove = Math.sin(animationFrame * 0.2) * 5;
    ctx.fillStyle = '#ff6b00';
    
    ctx.save();
    ctx.rotate((flipperMove * Math.PI) / 180);
    ctx.fillRect(-25, -12, 15, 8);
    ctx.restore();
    
    ctx.save();
    ctx.rotate((-flipperMove * Math.PI) / 180);
    ctx.fillRect(-25, 4, 15, 8);
    ctx.restore();

    if (diver.isBoosting) {
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = `rgba(0, 255, 255, ${0.3 - i * 0.1})`;
            ctx.beginPath();
            ctx.arc(-20 - i * 10, 0, 8 - i * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    if (animationFrame % 20 === 0) {
        particles.push({
            x: diver.x - 25,
            y: diver.y + (Math.random() - 0.5) * 10,
            radius: 4,
            vy: -2,
            vx: -1,
            life: 60,
            type: 'bubble'
        });
    }

    ctx.restore();
}

function drawBubbles() {
    bubbles.forEach(bubble => {
        ctx.fillStyle = `rgba(173, 216, 230, ${bubble.opacity})`;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

function drawFish() {
    fish.forEach(f => {
        ctx.save();
        ctx.translate(f.x, f.y);
        if (f.direction < 0) ctx.scale(-1, 1);

        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, f.width / 2, f.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-f.width / 2, 0);
        ctx.lineTo(-f.width / 2 - 10, -8);
        ctx.lineTo(-f.width / 2 - 10, 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(f.width / 4, -f.height / 4, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    });
}

function drawCorals() {
    corals.forEach(coral => {
        ctx.save();
        ctx.translate(coral.x, coral.y);
        
        const sway = Math.sin(animationFrame * 0.05 + coral.sway) * 5;
        ctx.rotate(sway * Math.PI / 180);

        ctx.fillStyle = coral.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-10, -coral.height / 3, -15, -coral.height / 2, -coral.width / 3, -coral.height);
        ctx.bezierCurveTo(0, -coral.height + 10, 0, -coral.height + 10, coral.width / 3, -coral.height);
        ctx.bezierCurveTo(15, -coral.height / 2, 10, -coral.height / 3, 0, 0);
        ctx.fill();

        ctx.restore();
    });
}

function drawPearls() {
    pearls.forEach(pearl => {
        pearl.pulse += 0.1;
        const pulseSize = Math.sin(pearl.pulse) * 3;
        
        ctx.save();
        ctx.translate(pearl.x, pearl.y);

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pearl.radius + pulseSize + 10);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 182, 193, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 182, 193, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, pearl.radius + pulseSize + 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffb6c1';
        ctx.beginPath();
        ctx.arc(0, 0, pearl.radius + pulseSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(-3, -3, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    });
}

function drawTreasures() {
    treasures.forEach(treasure => {
        treasure.sparkle += 0.1;
        
        ctx.save();
        ctx.translate(treasure.x, treasure.y);

        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-treasure.width / 2, -treasure.height / 2, treasure.width, treasure.height);
        
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-treasure.width / 2, -treasure.height / 2 + 5, treasure.width, 3);
        ctx.fillRect(-treasure.width / 2, treasure.height / 2 - 8, treasure.width, 3);

        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-3, 0, 6, 8);
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        const sparkleIntensity = Math.abs(Math.sin(treasure.sparkle));
        ctx.fillStyle = `rgba(255, 255, 0, ${sparkleIntensity})`;
        ctx.beginPath();
        ctx.arc(treasure.width / 2 + 5, -treasure.height / 2 - 5, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    });
}

function drawSharks() {
    sharks.forEach(shark => {
        ctx.save();
        ctx.translate(shark.x, shark.y);
        ctx.scale(-1, 1);

        ctx.fillStyle = '#5a6c7d';
        ctx.beginPath();
        ctx.ellipse(0, 0, shark.width / 2, shark.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -shark.height / 2);
        ctx.lineTo(-10, -shark.height / 2 - 15);
        ctx.lineTo(10, -shark.height / 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-shark.width / 2, 0);
        ctx.lineTo(-shark.width / 2 - 20, -15);
        ctx.lineTo(-shark.width / 2 - 20, 15);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(shark.width / 3, -shark.height / 4, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(shark.width / 4 - i * 8, 5);
            ctx.lineTo(shark.width / 4 - i * 8 - 3, 12);
            ctx.lineTo(shark.width / 4 - i * 8 + 3, 12);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    });
}

function drawJellyfish() {
    jellyfish.forEach(jelly => {
        jelly.float += 0.05;
        const floatY = Math.sin(jelly.float) * 10;

        ctx.save();
        ctx.translate(jelly.x, jelly.y + floatY);

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, jelly.width);
        gradient.addColorStop(0, 'rgba(255, 105, 180, 0.8)');
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0.4)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, jelly.width / 2, Math.PI, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(138, 43, 226, 0.6)';
        ctx.lineWidth = 2;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 6, jelly.height / 4);
            const tentacleMove = Math.sin(animationFrame * 0.1 + i) * 5;
            ctx.quadraticCurveTo(i * 6 + tentacleMove, jelly.height / 2, i * 6, jelly.height);
            ctx.stroke();
        }

        ctx.restore();
    });
}

function drawParticles() {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.life--;
        p.y += p.vy;
        p.x += p.vx || 0;
        p.radius *= 0.98;

        const alpha = p.life / 60;
        ctx.fillStyle = p.color ? `${p.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}` : `rgba(173, 216, 230, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateDiver() {
    diver.vy = 0;
    diver.vx = 0;
    diver.isBoosting = false;

    if (keys['arrowup'] || keys['w']) diver.vy = -diver.speed;
    if (keys['arrowdown'] || keys['s']) diver.vy = diver.speed;

    if (keys['arrowright'] || keys['d']) {
        diver.vx = diver.boostSpeed;
        diver.isBoosting = true;
    }

    diver.y += diver.vy;
    diver.x += diver.vx;

    diver.y = Math.max(diver.height / 2, Math.min(canvas.height - diver.height / 2, diver.y));
    diver.x = Math.max(50, Math.min(canvas.width - 100, diver.x));
    
    if (!diver.isBoosting && diver.x > 150) {
        diver.x -= 2;
    }
}

function updateBubbles() {
    bubbles.forEach(bubble => {
        bubble.y -= bubble.speed;
        bubble.x += Math.sin(bubble.y * 0.05) * 0.5;
        bubble.x -= diver.autoScrollSpeed * 0.3;

        if (bubble.y < -20) {
            bubble.y = canvas.height + 20;
            bubble.x = Math.random() * canvas.width + canvas.width;
        }
        
        if (bubble.x < -20) {
            bubble.x = canvas.width + 20;
        }
    });
}

function updateFish() {
    fish.forEach(f => {
        f.x += f.speed * f.direction;
        f.x -= diver.autoScrollSpeed * 0.5;

        if (f.x > canvas.width + 50) {
            f.x = -50;
        } else if (f.x < -50) {
            f.x = canvas.width + 50;
        }
    });
}

function updatePearls() {
    pearls = pearls.filter(pearl => {
        pearl.x -= pearl.speed;

        const dx = pearl.x - diver.x;
        const dy = pearl.y - diver.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pearl.radius + diver.width / 2) {
            score += 10;
            pearlsCollected++;
            createCollectEffect(pearl.x, pearl.y, '#ffb6c1');
            return false;
        }

        return pearl.x > -50;
    });
}

function updateTreasures() {
    treasures = treasures.filter(treasure => {
        treasure.x -= treasure.speed;

        if (checkCollision(diver, treasure)) {
            score += 50;
            createCollectEffect(treasure.x, treasure.y, '#FFD700');
            return false;
        }

        return treasure.x > -50;
    });
}

function updateSharks() {
    sharks = sharks.filter(shark => {
        shark.x -= shark.speed;

        if (checkCollision(diver, shark)) {
            lives--;
            createDamageEffect(diver.x, diver.y);
            diver.x = 150;
            diver.y = canvas.height / 2;
            
            if (lives <= 0) {
                endGame();
            }
            return false;
        }

        return shark.x > -100;
    });
}

function updateJellyfish() {
    jellyfish = jellyfish.filter(jelly => {
        jelly.x -= jelly.speed;

        if (checkCollision(diver, jelly)) {
            lives--;
            createDamageEffect(diver.x, diver.y);
            diver.x = 150;
            diver.y = canvas.height / 2;
            
            if (lives <= 0) {
                endGame();
            }
            return false;
        }

        return jelly.x > -50;
    });
}

function updateCorals() {
    corals.forEach(coral => {
        coral.x -= diver.autoScrollSpeed * 0.8;
        
        if (coral.x < -100) {
            coral.x = canvas.width + Math.random() * 200;
        }
    });
}

function checkCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (obj1.width / 2 + obj2.width / 2);
}

function createCollectEffect(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            radius: Math.random() * 3 + 2,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 40,
            color: color
        });
    }
}

function createDamageEffect(x, y) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            radius: Math.random() * 4 + 3,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
            color: '#ff0000'
        });
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('pearls').textContent = pearlsCollected;
}

function endGame() {
    gameRunning = false;
    
    // Check and update high score
    const isNewHighScore = setHighScore(difficulty, score);
    const currentHighScore = getHighScore(difficulty);
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalPearls').textContent = pearlsCollected;
    document.getElementById('currentHighscore').textContent = currentHighScore;
    
    // Show new high score message if applicable
    if (isNewHighScore) {
        document.getElementById('newHighscoreMessage').style.display = 'block';
    } else {
        document.getElementById('newHighscoreMessage').style.display = 'none';
    }
    
    document.getElementById('gameOver').style.display = 'block';
    
    // Update high score display on menu
    updateHighScoreDisplay();
}

function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('gameInfo').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('menuScreen').style.display = 'flex';
    gameRunning = false;
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateDiver();
    updateBubbles();
    updateFish();
    updateCorals();
    updatePearls();
    updateTreasures();
    updateSharks();
    updateJellyfish();
    updateUI();

    if (animationFrame % difficultySettings.collectibleSpawnRate === 0) spawnCollectibles();
    if (animationFrame % difficultySettings.enemySpawnRate === 0) spawnEnemies();

    drawBubbles();
    drawCorals();
    drawFish();
    drawPearls();
    drawTreasures();
    drawDiver();
    drawSharks();
    drawJellyfish();
    drawParticles();

    animationFrame++;
    requestAnimationFrame(gameLoop);
}