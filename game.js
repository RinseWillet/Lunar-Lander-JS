var canvas = document.getElementById("game");
var width = 1200;
var height = 800;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext("2d");

//zwaartekracht variabele
var gravity = -0.1;

//sterren
var stars = [];
for (var i = 0; i < 500; i++) {
    stars[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.sqrt(Math.random() * 2),
        alpha: 1,
        decreasing: true,
        dRatio: Math.random() * 0.05,
    }
}

//achtergrond tekenen
function drawBackground() {

    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);

    for (var i = 0; i < stars.length; i++) {
        var plotStar = stars[i];
        context.beginPath();
        context.arc(plotStar.x, plotStar.y, plotStar.radius, 10, 2 * Math.PI);


        if (plotStar.decreasing == true) {
            plotStar.alpha -= plotStar.dRatio;
            if (plotStar.alpha < 0.1) {
                plotStar.decreasing = false;
            }
        }
        else if (plotStar.decreasing == false) {
            plotStar.alpha += plotStar.dRatio;
            if (plotStar.alpha > 0.95) {
                plotStar.decreasing = true;
            }
        }

        context.fillStyle = "rgba(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ", " + plotStar.alpha + ")";
        context.fill();
        context.strokeStyle = "rgba(255, 255, 255, " + plotStar.alpha + ")";
        context.stroke();
        context.closePath();
    }
    

}




//sterren tekenen
// function drawStars() 
//     {
//         context.save();
//         context.fillStyle = "#111"
//         context.fillRect(0, 0, canvas.width, canvas.height);
//         for (var i = 0; i < stars.length; i++) {
//           var star = stars[i];
//           context.beginPath();
//           context.arc(star.x, star.y, star.radius, 0, 2*Math.PI);
//           context.closePath();
//           context.fillStyle = "rgba(255, 255, 255, " + star.alpha + ")";
//           if (star.decreasing == true)
//           {
//             star.alpha -=dRatio;
//             if (star.alpha < 0.1)
//             { star.decreasing = false; }
//           }
//           else
//           {
//             star.alpha += dRatio;
//             if (star.alpha > 0.95)
//             { star.decreasing = true; }
//           }
//           context.fill();
//         }
//         context.restore();
//     }

//eigenschappen ruimteschip
var spaceship =
{
    color: "red",
    width: 8,
    height: 22,
    //startpositie
    position:
    {
        x: 20,
        y: 20
    },
    //snelheid
    velocity:
    {
        x: 2,
        y: 0
    },
    angle: Math.PI / 45,
    engineOn: false,
    thrust: -0.25,
    rotatingLeft: false,
    rotatingRight: false,
    crashed: false
}

//teken het ruimteschip
function drawSpaceship() {
    context.save();
    context.beginPath();
    context.translate(spaceship.position.x, spaceship.position.y);
    context.rotate(spaceship.angle);
    context.beginPath();
    context.moveTo(spaceship.width.x, spaceship.height);
    context.lineTo(spaceship.width.x + 20, spaceship.height + 100);
    context.lineTo(spaceship.width.x + 70, spaceship.height + 100);
    context.stroke();
    context.rect(spaceship.width * -0.5, spaceship.height * -0.5, spaceship.width, spaceship.height);
    context.fillStyle = spaceship.color;
    context.fill();
    context.closePath();

    //vlammen aan als motor aan
    if (spaceship.engineOn) {
        context.beginPath();
        context.moveTo(spaceship.width * -0.5, spaceship.height * 0.5);
        context.lineTo(spaceship.width * 0.5, spaceship.height * 0.5);
        context.lineTo(0, spaceship.height * 0.5 + Math.random() * 10);
        context.lineTo(spaceship.width * -0.5, spaceship.height * 0.5);
        context.closePath();
        context.fillStyle = "orange";
        context.fill();
    }
    context.restore();
}





// aanpassen ruimteschip beweging
function updateSpaceship() {

    //snelheid veranderd de positie

    spaceship.position.x += spaceship.velocity.x;
    spaceship.position.y += spaceship.velocity.y;

    //draaien ruimteschip

    //naar rechts

    if (spaceship.rotatingRight) {
        spaceship.angle += Math.PI / 180;
    }

    //naar links

    else if (spaceship.rotatingLeft) {
        spaceship.angle -= Math.PI / 180;
    }

    //aanpassen met gas aan, maakt gebruik vd hoek van het schip.

    if (spaceship.engineOn) {
        spaceship.velocity.x += spaceship.thrust * Math.sin(-spaceship.angle);
        spaceship.velocity.y += spaceship.thrust * Math.cos(spaceship.angle);

    }

    // verticale snelheids vector wordt verminderd door de zwaartekracht
    spaceship.velocity.y -= gravity;

    //de onderkant scherm raken
    if (spaceship.position.y > 800) {
        alert("you crashed buddie");
        spaceship.position.x = 20;
        spaceship.position.y = 20;
        spaceship.velocity.x = 2;
        spaceship.velocity.y = 0;
        //spaceship.angle = Math.PI/45,

    }
}

function draw() {
    //wissen scherm
    context.clearRect(0, 0, canvas.width, canvas.height);

    //tekenen achtergrond
    drawBackground()


    // tekenen ruimteschip
    drawSpaceship();
    updateSpaceship();
    requestAnimationFrame(draw);

    //tekenen sterren
    //drawStars();
}

//besturing

function keyLetGo(event) {
    console.log(spaceship);
    switch (event.keyCode) {
        case 37: spaceship.rotatingLeft = false; //loslaten linker pijltje
            break;
        case 39: spaceship.rotatingRight = false; //loslaten  rechter pijltje
            break;
        case 38: spaceship.engineOn = false; //pijltje omhoog  loslaten - gas los!
            break;
    }
}

document.addEventListener('keyup', keyLetGo);

function keyPressed(event) {
    console.log(spaceship);
    switch (event.keyCode) {
        case 37: spaceship.rotatingLeft = true; //intoetsen linker pijltje
            break;
        case 39: spaceship.rotatingRight = true; //intoetsen rechter pijltje
            break;
        case 38: spaceship.engineOn = true; //pijltje omhoog - gas geven!
            break;
    }
}

document.addEventListener('keydown', keyPressed);

draw();
