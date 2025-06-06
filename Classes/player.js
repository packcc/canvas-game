const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

export class Player {
    constructor(x,y,radius,color,level,health) {
        this.x = x
        this.y = y

        this.radius = radius
        this.color = color

        this.level = level
        this.health = health
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}