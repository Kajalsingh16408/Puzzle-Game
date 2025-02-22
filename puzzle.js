const puzzleContainer = document.getElementById('puzzle-container');
const timerDisplay = document.getElementById('timer');
const levelDisplay = document.getElementById('level');
const replayBtn = document.getElementById('replay-btn');
const nextLevelBtn = document.getElementById('next-level-btn');

let level = 1;
let timeLimit = 60;
let timer;
const levelImages = [
    "https://wallup.net/wp-content/uploads/2016/02/18/252889-flowers-black-simple_background-simple-nature.jpg",
    "https://c8.alamy.com/comp/RF64KP/contour-childrens-bunny-simple-drawing-animal-RF64KP.jpg",
    "https://images.template.net/98328/simple-butterfly-wallpaper-jursk.jpg"
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer() {
    let time = timeLimit;
    timerDisplay.textContent = time;
    clearInterval(timer);
    timer = setInterval(() => {
        time--;
        timerDisplay.textContent = time;
        if (time <= 0) {
            clearInterval(timer);
            alert("⏰ Time's up! Try again.");
            showReplayButton();
        }
    }, 1000);
}

function showReplayButton() {
    replayBtn.style.display = 'inline-block';
    nextLevelBtn.style.display = 'none';
}

function showNextLevelButton() {
    nextLevelBtn.style.display = 'inline-block';
    replayBtn.style.display = 'none';
}

function createPuzzle() {
    puzzleContainer.innerHTML = "";
    const positions = shuffle([...Array(9).keys()]);
    positions.forEach((pos, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (pos !== 8) {
            tile.style.backgroundImage = `url(${levelImages[level - 1]}?w=300&h=300)`;
            const row = Math.floor(pos / 3);
            const col = pos % 3;
            tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
        } else {
            tile.classList.add('empty');
        }
        tile.addEventListener('click', () => moveTile(index));
        puzzleContainer.appendChild(tile);
    });
}

function moveTile(clickedIndex) {
    const tiles = Array.from(puzzleContainer.children);
    const emptyIndex = tiles.findIndex(tile => tile.classList.contains('empty'));

    const validMoves = [
        emptyIndex - 1, emptyIndex + 1,
        emptyIndex - 3, emptyIndex + 3
    ];

    if (validMoves.includes(clickedIndex)) {
        [tiles[emptyIndex].className, tiles[clickedIndex].className] = [tiles[clickedIndex].className, tiles[emptyIndex].className];
        [tiles[emptyIndex].style.backgroundImage, tiles[clickedIndex].style.backgroundImage] = [tiles[clickedIndex].style.backgroundImage, tiles[emptyIndex].style.backgroundImage];
        [tiles[emptyIndex].style.backgroundPosition, tiles[clickedIndex].style.backgroundPosition] = [tiles[clickedIndex].style.backgroundPosition, tiles[emptyIndex].style.backgroundPosition];

        if (checkWin()) {
            clearInterval(timer);
            alert("🎉 You completed the puzzle!");
            showNextLevelButton();
        }
    }
}

function checkWin() {
    const tiles = Array.from(puzzleContainer.children);
    return tiles.every((tile, i) => !tile.style.backgroundImage || i === Array.from(tiles).findIndex(t => t.classList.contains('empty')));
}

function startGame() {
    levelDisplay.textContent = level;
    timeLimit = 180 - (level - 1) * 5; // Decrease time with each level
    startTimer();
    createPuzzle();
    replayBtn.style.display = 'none';
    nextLevelBtn.style.display = 'none';
}

replayBtn.addEventListener('click', startGame);
nextLevelBtn.addEventListener('click', () => {
    level++;
    if (level > levelImages.length) {
        alert("🏆 Congratulations! You've completed all levels!");
        level = 1;
    }
    startGame();
});

startGame();
