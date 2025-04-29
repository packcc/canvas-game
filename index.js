import { Player } from './Classes/player.js'
import { Projectile } from './Classes/projectile.js'
import { Enemy } from './Classes/enemy.js';
import { Particle } from './Classes/particle.js';

const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const ipAddress = getIP()

const x = canvas.width / 2
const y = canvas.height / 2

const scoreID = document.querySelector("#scoreID")
const endScore = document.querySelector("#endScore")
const startGameBtn = document.querySelector("#startGameBtn")
const modalEL = document.querySelector("#modalEL")
const killID = document.querySelector("#killID")
const endScoreEnemies = document.querySelector("#endScoreEnemies")
const ipAddressEl = document.querySelector("#ipAddressEl")

let animationID
let score = 0
let enemiesKilled = 0;
let player

let projectiles = []
let enemies = []
let particles = []


/**
  ___       _ _     _____                 _   _             
 |_ _|_ __ (_) |_  |  ___|   _ _ __   ___| |_(_) ___  _ __  
  | || '_ \| | __| | |_ | | | | '_ \ / __| __| |/ _ \| '_ \ 
  | || | | | | |_  |  _|| |_| | | | | (__| |_| | (_) | | | |
 |___|_| |_|_|\__| |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|
                                                            
*/
function init() {

    player = new Player(x,y,10, 'white', 0,100)
    projectiles = []
    enemies = []
    particles = []
    console.log(player)
    score = 0
    enemiesKilled = 0
    scoreID.innerHTML = score
    endScore.innerHTML = score
    getIP()
}




/**
  ____                               _____                      _           
 / ___| _ __   __ ___      ___ __   | ____|_ __   ___ _ __ ___ (_) ___  ___ 
 \___ \| '_ \ / _` \ \ /\ / / '_ \  |  _| | '_ \ / _ \ '_ ` _ \| |/ _ \/ __|
  ___) | |_) | (_| |\ V  V /| | | | | |___| | | |  __/ | | | | | |  __/\__ \
 |____/| .__/ \__,_| \_/\_/ |_| |_| |_____|_| |_|\___|_| |_| |_|_|\___||___/
       |_|                                                                  
*/
function spawnEnemies(){
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4
        let x
        let y
        if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
        //const y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        y = Math.random() * canvas.height
        }else {
            x = Math.random() * canvas.width
        const y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`

        const angle = Math.atan2(canvas.height /2 - y, canvas.width /2 -x)

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x,y,radius,color,velocity))
        //console.log('Enemy: ' + enemies)
    }, 1000)
}

/**
     _          _                 _         _____                 _   _             
    / \   _ __ (_)_ __ ___   __ _| |_ ___  |  ___|   _ _ __   ___| |_(_) ___  _ __  
   / _ \ | '_ \| | '_ ` _ \ / _` | __/ _ \ | |_ | | | | '_ \ / __| __| |/ _ \| '_ \ 
  / ___ \| | | | | | | | | | (_| | ||  __/ |  _|| |_| | | | | (__| |_| | (_) | | | |
 /_/   \_\_| |_|_|_| |_| |_|\__,_|\__\___| |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|
                                                                                    
*/
/**
   ____      _ _ _     _                 
  / ___|___ | | (_)___(_) ___  _ __  ___ 
 | |   / _ \| | | / __| |/ _ \| '_ \/ __|
 | |__| (_) | | | \__ \ | (_) | | | \__ \
  \____\___/|_|_|_|___/_|\___/|_| |_|___/
                                         
*/


function animate() {
    animationID = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        }else {
        particle.update()
        }
    })

    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update()

        //remove from edges of screen
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                console.log('removing projectile')
            projectiles.splice(projectileIndex, 1)
            }, 0)
        }
    })


    enemies.forEach((enemy, index) => {
        enemy.update()
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        //end game
        if (dist - enemy.radius - player.radius < 1) {
            console.log('end game')
            cancelAnimationFrame(animationID)   
            endScore.innerHTML = score
            endScoreEnemies.innerHTML = enemiesKilled
            getIP()
            ipAddressEl.innerHTML = ipAddress
            modalEL.style.display = 'flex'         
        }

        // when projectiles touch enemy
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist - enemy.radius - projectile.radius < 1) {


               
                //create explosions
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, 
                        {
                            x: (Math.random() - 0.5) * (Math.random() * 8),
                            y: (Math.random() - 0.5) * (Math.random() * 8)
                        }
                    ))
                    
                }
                    //console.log('removed from screen')

                    //enemy hit
                if (enemy.radius - 10 > 5){
                     // increase score
                    score += 100
                    scoreID.innerHTML = score
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                    }, 0) 
                                  
                } else {  //enemy killed        
                     // increase score
                    score += 250
                    enemiesKilled += 1
                    scoreID.innerHTML = score  
                    killID.innerHTML = enemiesKilled        
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0) 

                    console.log("Enemies Killed: " + enemiesKilled)
                }
                
            }
            
        })
    })
}

addEventListener('click', (event) => { 
    // console.log(event.clientX, event.clientY)
     const angle = Math.atan2(event.clientY - canvas.height /2, event.clientX - canvas.width /2)
    // console.log(angle)
     const velocity = {
         x: Math.cos(angle) * 3,
         y: Math.sin(angle) * 3
     }
     projectiles.push(new Projectile(canvas.width /2, canvas.height /2, 5, 'white', 
         velocity))
 })

startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalEL.style.display = 'none'
})

addEventListener('keypress', (event) => {
    if (event.key === 'w')
        console.log('W')
    if (event.key === 'a')
        console.log('A')
    if (event.key === 's')
        console.log('S')
    if (event.key === 'd')
        console.log('D')
})

async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        document.getElementById('ipAddressEl').innerText = `${data.ip}`;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}