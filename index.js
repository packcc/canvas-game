const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreID = document.querySelector("#scoreID")
const endScore = document.querySelector("#endScore")
const startGameBtn = document.querySelector("#startGameBtn")
const modalEL = document.querySelector("#modalEL")

class Player {
    constructor(x,y,radius,color,level) {
        this.x = x
        this.y = y

        this.radius = radius
        this.color = color

        this.level = level
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const friction = 0.99

class Particle {
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }
}
const x = canvas.width / 2
const y = canvas.height / 2


function init() {
    player = new Player(x,y,10, 'white', 0)
    projectiles = []
    enemies = []
    particles = []
    console.log(player)
    score = 0
    scoreID.innerHTML = score
    endScore.innerHTML = score
}





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
        console.log('Enemy: ' + enemies)
    }, 1000)
}

let animationID
let score = 0

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
                    console.log('removed from screen')
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
                                  
                } else {          
                     // increase score
                    score += 250
                    scoreID.innerHTML = score          
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0) 
                }
                
            }
            
        })
    })
}

addEventListener('click', (event) => { 
    // console.log(event.clientX, event.clientY)
     const angle = Math.atan2(event.clientY - canvas.height /2, event.clientX - canvas.width /2)
     console.log(angle)
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

