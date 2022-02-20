const canvas = document.querySelector("canvas");
const menu = document.querySelector(".menu");
const btn = document.querySelector(".new-game");
const c = canvas.getContext("2d");

menu.onclick = () => {
  console.log("asdfasdf");
};

const CW = (canvas.width = window.innerWidth);
const CH = (canvas.height = window.innerHeight);

const halfCW = CW / 2;
const halfCH = CH / 2;

let game = true;
let projectiles = [];
let enemies = [];
let idAnimation = null;

class Player {
  constructor(x, y, color, radius) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Projectile {
  constructor(x, y, color, radius, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, color, radius, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const player = new Player(halfCW, halfCH, "blue", 30);

function animate() {
  idAnimation = requestAnimationFrame(animate);

  c.clearRect(0, 0, CW, CH);

  player.draw();

  projectiles.forEach((projectile, index) => {
    projectile.update();
    const PX = projectile.x;
    const PY = projectile.y;
    const PR = projectile.radius;
    if (PX - PR > CW || PX + PR < 0 || PY - PR > CH || PY + PR < 0) {
      setTimeout(() => projectiles.splice(index, 1), 0);
    }
  });

  enemies.forEach((enemy, indexEnemy) => {
    enemy.update();
    const distanceEnemyToPlayer = Math.hypot(
      player.x - enemy.x,
      player.y - enemy.y
    );

    if (distanceEnemyToPlayer - enemy.radius - player.radius < 0) {
      game = false;
      cancelAnimationFrame(idAnimation);
      menu.classList.add("menu-active");
    }

    projectiles.forEach((projectile, indexProjectile) => {
      const distanceProjectileToEnemy = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );

      if (distanceProjectileToEnemy - projectile.radius - enemy.radius < 1) {
        setTimeout(() => {
          enemies.splice(indexEnemy, 1);
          projectiles.splice(indexProjectile, 1);
        }, 0);
      }
    });
  });
}

function spawnEnemies() {
  setInterval(() => {
    let startX;
    let startY;
    const radius = Math.random() * (30 - 10) + 10;

    if (Math.random() > 0.5) {
      startX = Math.random() < 0.5 ? 0 - radius : CW + radius;
      startY = Math.random() * CH;
    } else {
      startX = Math.random() * CW;
      startY = Math.random() < 0.5 ? 0 - radius : CH + radius;
    }

    const color = "green";
    const angle = Math.atan2(halfCH - startY, halfCW - startX);
    const speedEnemy = Math.random() * (4 - 1) + 1;
    const velocity = {
      x: Math.cos(angle) * speedEnemy,
      y: Math.sin(angle) * speedEnemy,
    };

    enemies.push(new Enemy(startX, startY, color, radius, velocity));
  }, 1000);
}

canvas.addEventListener("click", (event) => {
  if (game) {
    const angle = Math.atan2(event.clientY - halfCH, event.clientX - halfCW);

    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };

    projectiles.push(new Projectile(halfCW, halfCH, "red", 4, velocity));
  }
});

btn.addEventListener("click", () => {
  menu.classList.remove("menu-active");

  projectiles = [];
  enemies = [];
  game = true;
  animate();
});

setInterval(() => console.log(projectiles), 1000);

animate();
spawnEnemies();
