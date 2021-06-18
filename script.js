const audio = document.getElementById("audio");
const playButton = document.getElementById("play-button");
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d");
let isPlaying = false;
let array = randomGenerator();
var originalFill;
let previousPercentage = 0;


// ctx.translate(0, -250);


function drawNewCanvas(percentage) {
    console.log(percentage)
    for (let i = 0; i < previousPercentage; i++) {
        ctx.fillStyle = originalFill;
        ctx.fillRect(array[i][0], array[i][1], 5, array[i][2]);
    }

    for (let i = 0; i < percentage; i++) {
        ctx.fillStyle = "black";
        ctx.fillRect(array[i][0], array[i][1], 5, array[i][2]);
    }
    previousPercentage = percentage;
}

function draw() {
    for (let i = 0; i < array.length; i++) {
        ctx.fillStyle = "#b9b9b9";
        ctx.fillRect(array[i][0], array[i][1], 5, array[i][2]);
    }
    originalFill = ctx.fillStyle
}

draw();


function randomGenerator() {
    let x = 10;
    let array = [];
    for (let i = 0; i < 100; i++) {
        let randomNumber = getRandomInt(50, 250);
        array.push([x, canvas.clientHeight - randomNumber, randomNumber])
        x += 5 + 5;
    }
    return array;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

canvas.addEventListener("click", (e) => {
    if (!isPlaying) return;
    let {
        clientX
    } = e;
    let {
        duration
    } = audio;
    let percentage = Math.floor(clientX / 10);
    audio.currentTime = Math.floor((clientX / 1000) * duration);
    drawNewCanvas(percentage)
})


playButton.addEventListener("click", () => {
    if (isPlaying) {
        audio.pause();
        // moveCanvas();
        isPlaying = false;
    } else {
        audio.play();
        isPlaying = true;
    }
})


audio.addEventListener("timeupdate", () => {
    let {
        duration,
        currentTime
    } = audio;
    let percentage = Math.floor((currentTime / duration) * 100);
    if (duration === currentTime) {
        isPlaying = false
    };
    drawNewCanvas(percentage);
})