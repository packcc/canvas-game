const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;


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
const x = canvas.width / 2
const y = canvas.height / 2



const player = new Player(x,y,30, 'blue', 0)
const projectiles = []
const enemies = []



console.log(player);

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
        const color = 'green'
        const angle = Math.atan2(canvas.height /2 - y, canvas.width /2 -x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x,y,radius,color,velocity))
        console.log('Enemy: ' + enemies)
    }, 1000)
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach((projectile) => {
        projectile.update()
    })
    enemies.forEach((enemy, index) => {
        enemy.update()
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist - enemy.radius - projectile.radius < 1) {
                setTimeout(() => {
                    console.log('removed from screen')
                enemies.splice(index, 1)
                projectiles.splice(projectileIndex, 1)
                }, 0)
                
            }
            
        })
    })
}

addEventListener('click', (event) => { 
   // console.log(event.clientX, event.clientY)
    const angle = Math.atan2(event.clientY - canvas.height /2, event.clientX - canvas.width /2)
    console.log(angle)
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(new Projectile(canvas.width /2, canvas.height /2, 5, 'red', 
        velocity))
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

animate()
spawnEnemies()