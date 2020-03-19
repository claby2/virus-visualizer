let statBar = document.getElementById("statBar");

let totalCases = document.getElementById("totalCases");
let totalDeaths = document.getElementById("totalDeaths");
let totalRecovered = document.getElementById("totalRecovered");
let activeCases = document.getElementById("activeCases");
// let infectedCount = document.getElementById("infectedCount");
// let healthyCount = document.getElementById("healthyCount");

let infectBar = document.createElement("div");

let statDiv = document.createElement("statDiv");

infectBar.classList.add("infectBar");

statBar.appendChild(infectBar);

var people = [];
var DIAMETER = 15;
var SIZE = 100;
var SPEED = 0.5;
var INFECTED = [255,0,0];
var HEALTHY = [255,255,255];
var STILL = HEALTHY;
var LIFETIME = 100;

var caseCount = 0;


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

function infectToWidth(){
    let infectCount = 0;

    for(let i = 0; i < people.length; i++){
        if(people[i].state === INFECTED){
            infectCount++;
        }
    }
    return infectCount*(800/SIZE);
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


function setup(){
    canvas = createCanvas(800,800);
    canvas.parent('canvasHolder')
    setPopulation(95, 5, 0);
}

function draw() {
    background(0);

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

    infectBar.style.width = statusCount()[1]*(800/SIZE) + "px";

    totalCases.innerText = " Total Cases " + caseCount;
    totalDeaths.innerText = " Total Deaths " + (SIZE-people.length);
    activeCases.innerText = " Active Cases " + statusCount()[1];
}

class Person {
    constructor(state, still){
        this.still = still;
        this.time = 0;
        this.state = state;
        this.x = random(width);
        this.y = random(height);
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
                this.speedx += Math.random()*5;
            } else {
                this.speedx = -SPEED;
                this.speedx -= Math.random()*5;
            }
            if(this.speedy > 0){
                this.speedy = SPEED;
                this.speedy += Math.random()*5;
            } else {
                this.speedy = -SPEED;
                this.speedy -= Math.random()*5;
            }
            this.x += this.speedx;
            this.y += this.speedy;
        }
        if(this.x > width || this.x < 0){
            this.speedx = -this.speedx;
        }
        if(this.y > height || this.y < 0){
            this.speedy = -this.speedy;
        }
    }

    swapVector(){
        this.speedx = -this.speedx;
        this.speedy = -this.speedy;
    }

    intersect(other){
        if(dist(this.x, this.y, other.x, other.y) < this.diameter){
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
        fill(color(this.state))
        ellipse(this.x, this.y, this.diameter, this.diameter);
    }
}