// canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// bricks
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: randomBrickStatus()};
    }
}

function randomBrickStatus() {
    return Math.floor(Math.random() * 3) + 1;
}

// speed indicator
const speedIndicator = document.getElementById("speedIndicator");

// start point
let x = canvas.width / 2;
let y = canvas.height - 30;

// moving
let speed = 2;
let dx = speed;
let dy = -speed;

// ball
let ballRadius = 10;

// paddle
const paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2; // start position
let paddleSpeed = 7;

// controls
let rightPressed = false;
let leftPressed = false;

// score
let score = 0;
let lives = 3;

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status > 0) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColorFromStatus(bricks[c][r].status);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function brickColorFromStatus(status) {
    switch (status) {
        case 1:
            return "#f8795b";
        case 2:
            return "#02b6e0";
        case 3:
            return "rgba(0,176,125,0.75)";
        default:
            return "#000000";
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#006794";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    speedIndicator.innerHTML = "Level => " + speed;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBricks();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();

    x += dx;
    y += dy;

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) { // hit the ceiling
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            // TODO emit a bouncing sound
            // TODO temporarily increase speed
            dy = -dy;
        } else {
            // TODO emit a loser sound
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed) {
        paddleX += paddleSpeed;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= paddleSpeed;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    requestAnimationFrame(draw);
}

// keyboard controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// mouse controls
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// collision detection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status > 0) {
                if (
                    x > b.x &&
                    x < b.x + brickWidth &&
                    y > b.y &&
                    y < b.y + brickHeight
                ) {
                    dy = -dy; // ball bounces on brick
                    b.status -= 1;
                    score = b.status === 0 ? score + 1 : score;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("Winner!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#dd004d";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#dd9000";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

draw();