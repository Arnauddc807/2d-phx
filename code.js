class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(vec) {
        this.x += vec.x
        this.y += vec.y
        return new Vector(this.x, this.y)
    }
    mult(a) {
        this.x *= a
        this.y *= a
        return new Vector(this.x, this.y)
    }
    div(a) {
        this.x /= a
        this.y /= a
        return new Vector(this.x, this.y)
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


    }

    drawCircle() {
        m.fillStyle = this.c
        m.beginPath()
        m.arc(this.position.x, this.position.y, this.r, 0, 2*Math.PI)
        m.fill()
    }

    simulate(dt = 2) {
        //integrate physics
        //linear 
        this.forces = new Vector(horizontal, vertical)
        this.acceleration = this.forces.div(this.mass).mult(dt)
        this.velocity.add(this.acceleration).mult(dt)
        this.position.add(this.velocity).mult(dt)
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

}



//start program
m = document.getElementById("canvas").getContext('2d')

c1 = new Circle(400, 400, 25, "blue")
c2 = new Circle(300, 400, 20, "green")

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



//physics loop
function update() {
    //clear the screen
    m.fillStyle = "black"
    m.fillRect(0, 0, 800, 800)

    //draw frame
    InputHandler()
    c1.simulate()
    c2.simulate()
    c1.drawCircle()
    c2.drawCircle()
    //draw to the screen
    requestAnimationFrame(update)
}

update();
