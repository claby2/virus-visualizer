let statBar = document.getElementById("statBar");

let totalCases = document.getElementById("totalCases");
let totalDeaths = document.getElementById("totalDeaths");
let totalRecovered = document.getElementById("totalRecovered");
let activeCases = document.getElementById("activeCases");

let input = document.getElementById("input");

let infectBar = document.createElement("div");

let statDiv = document.createElement("statDiv");

infectBar.classList.add("infectBar");

statBar.appendChild(infectBar);

var healthyPopulation = 90;
var infectedPopulation = 1;
var stillPopulation = 9;

var people = [];
var DIAMETER = 15;
var SIZE = 100;
var SPEED = 0.5;
var INFECTED = [255,0,0];
var HEALTHY = [255,255,255];
var STILL = HEALTHY;
var LIFETIME = 1000;
var caseCount = 0;

resetDimensions()

function statusCount(){
    let healthy = 0;
    let infected = 0;
    let still = 0;

    for(let i = 0; i < people.length; i++){
        if(people[i].state === INFECTED){
            infected++;
        } else if(!people[i].still){
            healthy++;
        } else {
            still++;
        }
    }

    return [healthy, infected, still];
}

let canvas = ((s)=>{

    class Person {
        constructor(state, still){
            this.still = still;
            this.time = 0;
            this.state = state;
            this.x = Math.random()*WIDTH;
            this.y = Math.random()*HEIGHT;
            this.diameter = DIAMETER;
            if(!this.still){
                this.speedx = (Math.floor(Math.random()*2) === 1 ? 1 : -1) * SPEED;
                this.speedy = (Math.floor(Math.random()*2) === 1 ? 1 : -1) * SPEED;
            } else {
                this.speedx = 0;
                this.speedy = 0;
            }
        }
    
        move(){
            if(this.state === INFECTED) {
                this.time += 1;
            }
            if(!this.still){
    
                if(this.speedx > 0){
                    this.speedx = SPEED;
                    this.speedx += Math.random()*3;
                } else {
                    this.speedx = -SPEED;
                    this.speedx -= Math.random()*3;
                }
                if(this.speedy > 0){
                    this.speedy = SPEED;
                    this.speedy += Math.random()*3;
                } else {
                    this.speedy = -SPEED;
                    this.speedy -= Math.random()*3;
                }
                this.x += this.speedx;
                this.y += this.speedy;
            }
            if(this.x + (this.diameter/2) > WIDTH || this.x - (this.diameter/2)< 0){
                this.speedx = -this.speedx;
            }
            if(this.y + (this.diameter/2) > HEIGHT || this.y - (this.diameter/2)< 0){
                this.speedy = -this.speedy;
            }
        }
    
        swapVector(){
            this.speedx = -this.speedx;
            this.speedy = -this.speedy;
        }
    
        intersect(other){
            if(s.dist(this.x, this.y, other.x, other.y) < this.diameter){
                if(!this.still && !other.still){
                    this.swapVector();
                }
                if(this.state === INFECTED && other.still){
                    other.speedx = this.speedx;
                    other.speedy = this.speedy;
                } else if(this.still && other.state === INFECTED){
                    this.speedx = other.speedx;
                    this.speedy = other.speedy;
                }
    
                if(this.state === INFECTED && other.state !== INFECTED){
                    caseCount++;
                    other.state = INFECTED;
                } else if(this.state !== INFECTED && other.state === INFECTED){
                    caseCount++;
                    this.state = INFECTED;
                }
            }
        }
    
        display(){
            s.fill(s.color(this.state))
            s.ellipse(this.x, this.y, this.diameter, this.diameter);
        }
    }
    
    function setPopulation(healthy, infected, still){
        for(let i = 0; i < healthy; i++){
            p = new Person(HEALTHY, false);
            people.push(p);
        }
    
        for(let i = 0; i < infected; i++){
            caseCount++;
            p = new Person(INFECTED, false);
            people.push(p);
        }
    
        for(let i = 0; i < still; i++){
            p = new Person(STILL, true);
            people.push(p);
        }
    }

    s.setup = ()=>{
        let x = s.createCanvas(WIDTH,HEIGHT);
        x.parent('canvasHolder')
        setPopulation(healthyPopulation, infectedPopulation, stillPopulation);
    };

    s.draw = ()=>{
        s.background(0);

        for(let i = 0; i < people.length; i++){
            if(people[i].state === INFECTED && people[i].time > LIFETIME && people.indexOf(people[i]) > -1){
                people.splice(people.indexOf(people[i]), 1);
            } else {
                people[i].move();
                people[i].display();
                for(let j = 0; j < people.length; j++){
                    if(i != j){
                        people[i].intersect(people[j]);
                    }
                }
            }
        }

        infectBar.style.width = statusCount()[1]*(WIDTH/SIZE) + "px";

        totalCases.innerText = caseCount;
        totalDeaths.innerText = (SIZE-people.length);
        activeCases.innerText = statusCount()[1];
    };
});

let graph = (s)=>{

    s.setup = ()=>{
        let x = s.createCanvas(WIDTH,HEIGHT/2);
        x.parent('graphHolder')
        s.background(0);
        s.noStroke();
        s.fill(255, 255, 255);
        s.textSize(32);
        s.text('Active Cases', 10, 30);
        posy = 0;
        posx = 0;
        s.fill(s.color([255,0,0]));
        s.rect(0, HEIGHT/2 - SIZE*((HEIGHT/3)/SIZE), WIDTH, 1);
        s.fill(s.color([255,255,255]))
    };

    s.draw = ()=>{
        posy = HEIGHT/2 - statusCount()[1]*((HEIGHT/3)/SIZE);
        posx += 1;
        s.rect(posx, posy, 1, HEIGHT-posy);
    };

};

let cv = new p5(canvas);
let gp = new p5(graph);


// Streamlined Input

let simulateButton = document.getElementById("simulateButton");

let lifetimeSlider = document.getElementById("lifetimeSlider");
let healthySlider = document.getElementById("healthySlider");
let stillSlider = document.getElementById("stillSlider");
let infectedSlider = document.getElementById("infectedSlider");

let lifetimeCounter = document.getElementById("lifetimeCounter");
let healthyCounter = document.getElementById("healthyCounter");
let stillCounter = document.getElementById("stillCounter");
let infectedCounter = document.getElementById("infectedCounter");

lifetimeSlider.value = LIFETIME;
healthySlider.value = healthyPopulation;
stillSlider.value = stillPopulation;
infectedSlider.value = infectedPopulation;

lifetimeCounter.innerText = LIFETIME;
healthyCounter.innerText = healthyPopulation;
stillCounter.innerText = stillPopulation;
infectedCounter.innerText = infectedPopulation;

function updateSliderValue(n, e) {
    document.getElementById(e).innerText = n; 
}

function resetDimensions(){
    WIDTH = (window.innerWidth - 200)/2;
    HEIGHT = WIDTH;
    statBar.style.width = WIDTH;
    posx = 0;
    posy = HEIGHT/2;
    if(window.innerWidth <= 1300){
        input.style.marginTop = "10px";
    } else {
        input.style.marginTop = (HEIGHT/2) + "px";
    }
}

function reset() {
    LIFETIME = parseInt(lifetimeSlider.value);
    healthyPopulation = parseInt(healthySlider.value);
    stillPopulation = parseInt(stillSlider.value);
    infectedPopulation = parseInt(infectedSlider.value);

    cv.remove();
    gp.remove();

    people = [];
    SIZE = healthyPopulation + stillPopulation + infectedPopulation;
    caseCount = 0;

    cv = new p5(canvas);
    gp = new p5(graph);
}

simulateButton.addEventListener("click", ()=>{
    reset()
})

window.addEventListener("resize", ()=>{
    resetDimensions()
    reset()
})