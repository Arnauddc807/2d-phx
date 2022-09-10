class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y)
    }
    sub(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y)
    }
    mult(a) {
        return new Vector(this.x * a, this.y * a)
    }
    div(a) {
        return new Vector(this.x / a, this.y / a)
    }
    size() {
      return Math.sqrt(this.x*this.x + this.y*this.y)
    }
    unit() {
      if (this.size() == 0) {return new Vector (0, 0)}
      return new Vector(this.x/this.size(), this.y/this.size())
    }
    dot(vec) {
      return (this.x*vec.x + this.y*vec.y)
    }
} 

class Circle {
    constructor(x, y, r, c) {
        this.r = r
        this.c = c

        this.mass = (Math.PI * this.r * this.r)/100
        this.forces = new Vector(0, 0)
        this.acceleration = new Vector(0, 0)
        this.velocity = new Vector(0, 0)
        this.position = new Vector(x, y)

        this.player = false
    }

    drawCircle() {
        m.fillStyle = this.c
        m.beginPath()
        //m.arc(this.position.x, this.position.y, this.r, 0, 2*Math.PI)
        m.arc(this.position.x, this.position.y, this.r, 0, 2*Math.PI)
        m.fill()
    }

    simulate(dt = 2) {
        //integrate physics
        //linear 
        
        this.acceleration = this.forces.div(this.mass).mult(dt)
        this.velocity = this.velocity.add(this.acceleration).mult(1-friction)
        if (this.acceleration.size == 0 && this.velocity.size < 0.1) {this.velocity = new Vector(0, 0)}      
        this.position = this.position.add(this.velocity.mult(dt))
	      this.position.x = ((this.position.x % 800) + 800) % 800
	      this.position.y = ((this.position.y % 800) + 800) % 800
        this.forces = new Vector(0, 0)


        //((x % n) + n) % n          MODULO BUG
        /*angular
        this.angAcc = this.torque / this.inertia
        this.angle_vel += this.angAcc * dt
        this.angle += this.angle_vel * dt
        this.torque = 0
        */
    }

    user_input() {
    this.forces = new Vector(horizontal, vertical)
    }

}

//get keypresses down
document.addEventListener("keydown", (e) => {  
    switch(e.keyCode) {
        case 37:    //Left
            leftHeld = true
            break
        case 38:    //Up
            upHeld = true
            break
        case 39:    //Right
            rightHeld = true
            break
        case 40:    //Down
            downHeld = true
            break
    }    
})

//get keypresses up
document.addEventListener("keyup", (e) => {
    switch(e.keyCode) {
        case 37:    //Left
            leftHeld = false
            break
        case 38:    //Up
            upHeld = false
            break
        case 39:    //Right
            rightHeld = false
            break
        case 40:    //Down
            downHeld = false
            break
    }
})

//input overlay
function Hud() {
  m.strokeStyle = "white"
  m.lineWidth = 3
  m.beginPath()
  m.arc(hud.position.x, hud.position.y, hud.r, 0, 2*Math.PI)
  m.stroke()

  m.beginPath();
  m.moveTo(hud.position.x, hud.position.y);
  m.lineTo(hud.position.x+BALLS[0].velocity.x, hud.position.y+BALLS[0].velocity.y);
  m.strokeStyle = "red";
  m.stroke();

}

function collision_detection(c1, c2) {
  if (c1.position.sub(c2.position).size() <= c1.r + c2.r) {
    return true
  }
  return false
}

function penetration(c1, c2) {

  dist = c1.position.sub(c2.position)
  dept = c1.r + c2.r - dist.size()
  res = dist.unit()

  c1.position = c1.position.add(res)
  c2.position = c2.position.add(res.mult(-1))
}

function response(c1, c2) {
  normal = c1.position.sub(c2.position).unit()
  relVelocity = c1.velocity.sub(c2.velocity)
  sepVelocity = relVelocity.dot(normal) * elasticity / (c1.mass + c2.mass)
  sepVelocityVec = normal.mult(-sepVelocity)

  c1.velocity = c1.velocity.add(sepVelocityVec.mult(c2.mass))
  c2.velocity = c2.velocity.add(sepVelocityVec.mult(-1).mult(c1.mass))
}

//keyboard input
function InputHandler() {
    horizontal = 0
    vertical = 0
    /*
    FUTURE CODE
    steering = 0
    throttle = 0
    brakes = 0
    if (leftHeld) { steering = -1} 
    if (rightHeld) { steering = 1} 
    if (upHeld) { throttle = 1 } 
    if (downHeld) { brakes = 1 } 
    */
   if (leftHeld) {horizontal = -1}
   if (rightHeld) {horizontal = 1}
   if (upHeld) {vertical = -1}
   if (downHeld) {vertical = 1}

}

function TotalEnergy() {
  result = 0
  for (let i = 0; i < BALLS.length; i++) {
    result += BALLS[i].velocity.size()
  }
  m.font = "20px Arial";
  m.fillStyle = "white";
  rounded = Math.round(result*100)/100
  m.fillText("TOTAL ENERGY: "+ rounded, 25, 725);
  return result
}

//start program
let m = document.getElementById("canvas").getContext('2d')
let friction = 0.005
let elasticity = 0.99
let BALLS = []
BALLS.push(new Circle(400, 700, 50, "blue"))
//BALLS.push(new Circle(300, 400, 25, "green"))
//BALLS.push(new Circle(700, 400, 25, "orange"))
//BALLS.push(new Circle(500, 500, 25, "yellow"))
BALLS[0].player = true
let hud = new Circle(700, 700, 30, "white")


for (let i = 0; i < 7; i++) {
  for (let j = 0; j < 7; j++)
    BALLS.push(new Circle(i*100+50, j*100+50, 25, "pink"))
}

//keyboard controls
let leftHeld = false
let rightHeld = false
let upHeld = false
let downHeld = false

/*
//vehicle controls
FUTURE CODE
let steering = 0 //-1 is left 0 is center 1 is right
let throttle = 0 //0 is coasting, 1 is full throttle
let brakes = 0 //0 is no brakes, 1 is full brakes
*/
let horizontal = 0 // -1 is left 1 is right
let vertical = 0 // -1 is up 1 is down


//physics loop
function update() {
    //clear the screen
    m.fillStyle = "black"
    m.fillRect(0, 0, 800, 800)

    //draw frame
    InputHandler()



    //c1.debug()
    //c2.simulate()


    BALLS.forEach((b, i) => {
      if (b.player) { b.user_input() }
      b.simulate()
      b.drawCircle()
      for (let j = i+1; j < BALLS.length; j++) {
        if (collision_detection(BALLS[i], BALLS[j])) {
          penetration(BALLS[i], BALLS[j])
          response(BALLS[i], BALLS[j])
        }
      }
    })

    Hud()
    TotalEnergy()

    //draw to the screen
    requestAnimationFrame(update)
}

update();
