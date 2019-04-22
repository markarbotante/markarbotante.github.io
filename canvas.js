const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Objects
function Star(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: 3
    }
    this.friction = 0.8
    this.gravity = 1
}

Star.prototype.draw = function () {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
}

Star.prototype.update = function () {
    this.draw()

    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction
        this.shatter()
    } else {
        this.velocity.y += this.gravity
    }

    //sides hitter
    if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0) {
        this.velocity.x = -this.velocity.x * this.friction

    }

    this.x += this.velocity.x
    this.y += this.velocity.y

}

Star.prototype.shatter = function () {
    this.radius -= 3
    for (let i = 0; i < 8; i++) {
        miniStars.push(new MiniStar(this.x, this.y, 3))
    }

}

function MiniStar(x, y, radius, color) {
    Star.call(this, x, y, radius, color)
    this.velocity = {
        x: randomIntFromRange(-5, 5),
        y: randomIntFromRange(-15, 35)
    }
    this.friction = 0.8
    this.gravity = 0.8
    this.ttl = 100
    this.opacity = 1
}

MiniStar.prototype.draw = function () {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(0,0,0,${this.opacity})`
    c.shadowColor = '#E3EAEF'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
}

MiniStar.prototype.update = function () {
    this.draw()

    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction
    } else {
        this.velocity.y += this.gravity
    }
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.ttl -= 1
    this.opacity -= 1 / this.ttl
}

function createMountainRange(mountainAmount, height, color) {
    for (let i = 0; i < mountainAmount; i++) {
        const mountainWidth = canvas.width / mountainAmount
        c.beginPath()
        c.moveTo(i * mountainWidth, canvas.height)
        c.lineTo(i * mountainWidth + mountainWidth + 350, canvas.height)
        c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height)
        c.lineTo(i * mountainWidth - 350, canvas.height)
        c.fillStyle = color
        c.fill()
        c.closePath()
    }
}

function createArkMountain(mountainAmount, color) {
    const mountainWidth = canvas.width / mountainAmount
    c.beginPath()
    c.arc(canvas.width / 2, canvas.height/2 , canvas.width / 10, 0, Math.PI*2)
    c.fillStyle = '#272425'
    c.fill()
    c.stroke()
    c.closePath()

    c.beginPath()
    c.arc(canvas.width / 2, canvas.height/2 - 10, canvas.width / 11, 0, Math.PI*2)
    c.fillStyle = color
    c.fill()
    c.stroke()
    c.closePath()

    c.beginPath()
    c.arc(canvas.width / 2, canvas.height/2 -50, canvas.width / 10, 0, Math.PI*2)
    c.fillStyle = '#272425'
    c.fill()
    c.stroke()
    c.closePath()
}

// Implementation
const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, '#031019')
backgroundGradient.addColorStop(1, '#316')
let stars
let miniStars
let backgroundStars
let ticker = 0
let randomSpawnRate = 200
let groundHeight = 50

function init() {
    stars = []
    miniStars = []
    backgroundStars = []
    for (let i = 0; i < 1; i++) {
        stars.push(new Star(canvas.width / 2, 0, 30, 'black'))
    }
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 2
        backgroundStars.push(new Star(x, y, radius, 'black'))
    }
}
// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    backgroundStars.forEach(backgroundStarsObj => {
        backgroundStarsObj.draw()
    })
    c.font = "30px Arial";
    c.strokeText("MSArbotante", 10, 50);
    c.font = "18px Arial";
    c.strokeText("markarbotante@gmail.com", 10, 80);
    c.strokeText("0926 453 0263", 10, 110);

    createArkMountain(1,'white')


    c.fillStyle = 'black'
    c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

    stars.forEach((starsObj, index) => {
        starsObj.update()
        if (starsObj.radius == 0) {
            stars.splice(index, 1)
        }
    })

    miniStars.forEach((miniStarsObj, index) => {
        miniStarsObj.update()
        if (miniStarsObj.ttl == 0) {
            miniStars.splice(index, 1)
        }
    })

    ticker++
    if (ticker % randomSpawnRate == 0) {
        const radius = 18
        const x = Math.max(radius, Math.random() * canvas.width - radius)
        stars.push(new Star(x, -100, radius, 'black'))
        randomSpawnRate = randomIntFromRange(150, 250)
    }
}

init()
animate()