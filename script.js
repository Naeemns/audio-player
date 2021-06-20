const container = document.querySelector("#container");
const containerControls = document.querySelector("#container-controls");
const audio = document.querySelector("#audio");
const playButton = document.querySelector("#play-button");
const icon = document.querySelector(".fa-play");
const spinner = document.querySelector(".fa-spinner");
const audioCurrentTime = document.querySelector("#current-time");
const audioDuration = document.querySelector("#duration-time");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isPlaying = false;
let originalFill;
let previousPercentage = 0;

// Storing the positions of rectangle bars;
const array = randomCoordinatesGenerator();
const offset = (container.clientWidth - 1000) / 2;

const tags = [{
        text: "Introduction",
        fill: "green",
        x: 182.5,
        y: 350,
        rectWidth: 100,
        rectHeight: 25,
        lineTo: {
            x: 182.5,
            y: 210
        }
    },
    {
        text: "one_six",
        fill: "crimson",
        x: 352.5,
        y: 350,
        rectWidth: 100,
        rectHeight: 25,
        lineTo: {
            x: 352.5,
            y: 180
        }
    },
    {
        text: "Profile",
        fill: "blue",
        x: 652.5,
        y: 350,
        rectWidth: 100,
        rectHeight: 25,
        lineTo: {
            x: 652.5,
            y: 240
        }
    },
    {
        text: "RapportBuilding - Empathy",
        fill: "brown",
        x: 752.5,
        y: 350,
        rectWidth: 155,
        rectHeight: 25,
        lineTo: {
            x: 752.5,
            y: 210
        }
    },
    {
        text: "RapportBuilding - Energy",
        fill: "black",
        x: 852.5,
        y: 350,
        rectWidth: 150,
        rectHeight: 25,
        lineTo: {
            x: 852.5,
            y: 180
        }
    }
]


setTimeout(() => {
    spinner.style.visibility = "hidden";
    containerControls.style.visibility = "visible";
    canvas.style.visibility = "visible";
}, 1000);

ctx.translate(0, -150);

function draw() {
    for (let i = 0; i < array.length; i++) {
        ctx.fillStyle = "white";
        ctx.fillRect(array[i][0], array[i][1], 5, array[i][2]);
    }
    originalFill = ctx.fillStyle;
    drawTags();
    ctx.globalCompositeOperation = "desination-over";
}

draw();

function drawTags() {
    ctx.lineWidth = 1;
    for (let i = 0; i < tags.length; i++) {
        ctx.fillStyle = tags[i].fill;
        ctx.strokeStyle = tags[i].fill;
        ctx.font = "13px serif";
        ctx.beginPath();
        ctx.arc(tags[i].x, tags[i].y, 6, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.moveTo(tags[i].x, tags[i].y);
        ctx.lineTo(tags[i].lineTo.x, tags[i].lineTo.y);
        ctx.stroke();
        ctx.moveTo(tags[i].lineTo.x - (tags[i].rectWidth / 2), tags[i].lineTo.y);
        ctx.fillRect(tags[i].lineTo.x - (tags[i].rectWidth / 2), tags[i].lineTo.y, tags[i].rectWidth, tags[i].rectHeight);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tags[i].text, tags[i].lineTo.x, tags[i].lineTo.y + (tags[i].rectHeight / 2))
        if (i + 1 != tags.length) {
            ctx.moveTo(tags[i + 1].x, tags[i + 1].y);
        }
    }
}

function randomCoordinatesGenerator() {
    let x = 0;
    let array = [];
    for (let i = 0; i < 100; i++) {
        let randomNumber = getRandomInt(-150, 150);
        // Making sure that the bar length is above 30px
        while ((randomNumber > -30 && randomNumber <= 0) || (randomNumber < 30 && randomNumber >= 0)) {
            randomNumber = getRandomInt(-150, 150);
        }
        let y = randomNumber < 0 ? canvas.clientHeight - randomNumber - (-randomNumber / 2) : canvas.clientHeight - randomNumber;
        // Pushing the x, y coordinates and height of the rectangle bar
        array.push([x, y, randomNumber])
        // Moving x coordinate by width of current bar + distance between two bars (5+5)
        x += 5 + 5;
    }
    return array;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function drawNewCanvas(percentage) {
    // Clearing the previous bars and drawing initial bars
    for (let i = 0; i <= previousPercentage; i++) {
        ctx.globalCompositeOperation = "desination-over";
        ctx.fillStyle = originalFill;
        ctx.clearRect(array[i][0], array[i][1], 5, array[i][2]);
        ctx.fillRect(array[i][0], array[i][1], 5, array[i][2]);
    }

    // Clearing the initial bars and drawing colored bars
    for (let i = 0; i <= percentage; i++) {
        ctx.fillStyle = "#850018";
        ctx.globalCompositeOperation = "desination-over";
        ctx.clearRect(array[i][0], array[i][1], 5, array[i][2]);
        ctx.fillRect(array[i][0], array[i][1], 5, array[i][2]);
    }

    previousPercentage = percentage;
}

// Event listeners
canvas.addEventListener("click", (e) => {
    if (!isPlaying) return;
    let {
        clientX
    } = e;
    let {
        duration
    } = audio;
    let percentage = (clientX - offset) / 10;
    audio.currentTime = ((clientX - offset) / 1000) * duration;
    drawNewCanvas(percentage)
})

// Clicking on play or pause button
playButton.addEventListener("click", () => {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        icon.classList.replace("fa-pause", "fa-play");
    } else {
        audio.play();
        isPlaying = true;
        icon.classList.replace("fa-play", "fa-pause");
    }
})

// When there is update in the time
audio.addEventListener("timeupdate", () => {
    let {
        duration,
        currentTime
    } = audio;
    let percentage = (currentTime / duration) * 100;
    if (duration === currentTime) {
        isPlaying = false;
        icon.classList.replace("fa-pause", "fa-play");
    }
    drawNewCanvas(percentage);
})