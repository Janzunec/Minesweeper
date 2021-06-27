'use strict';

// Setting default values for every space
const resetBtn = document.querySelector('.reset');
const flagBtn = document.querySelector('.flag');
const spaceEl = document.querySelectorAll('.space');
const time = document.querySelector('.numbers');
const easy = document.querySelector('.easy');
const medium = document.querySelector('.medium');
const hard = document.querySelector('.hard');
const bombsNum = document.querySelector('.numbers1');
const timeEl = document.querySelector('.numbers');
let timerCheck = 0;
let gameOver = false;
let flagging = false;
let winner = false;
let bombsLimit = 20;
let difficultyMins = 5;
let freeSpaces = 80;

// Generating bombs
const field = [];

const generateBomb = function () {
	let number;
	let bombs = 0;

	for (let index = 0; index < 100; index++) {
		field[index] = false;
	}
	for (let i = 0; i < 100; i++) {
		number = Math.trunc(Math.random() * 10 + 1);
		// console.log(number);
		if (bombsLimit <= 20) {
			if ((number > 8 || number === 4) && bombs < bombsLimit) {
				field[i] = true;
				bombs++;
			} else {
				field[i] = false;
			}
		} else {
			if ((number > 8 || number < 3) && bombs < bombsLimit) {
				field[i] = true;
				bombs++;
			} else {
				field[i] = false;
			}
		}
	}
};
generateBomb();

// Function for a 10 minute countdown
function countdown(elementName, minutes, seconds) {
	var element, endTime, hours, mins, msLeft, time;

	function twoDigits(n) {
		return n <= 9 ? '0' + n : n;
	}

	function updateTimer() {
		if (!gameOver && !winner) {
			msLeft = endTime - +new Date();
			if (msLeft < 1000) {
				element.classList.add('blink');
				element.innerHTML = '00:00';
				gameOver = true;
				showBombs();
				resetBtn.innerHTML = '😵';
			} else {
				time = new Date(msLeft);
				hours = time.getUTCHours();
				mins = time.getUTCMinutes();
				element.innerHTML =
					(hours ? hours + ':' + twoDigits(mins) : mins) +
					':' +
					twoDigits(time.getUTCSeconds());
				setTimeout(updateTimer, time.getUTCMilliseconds() + 100);
			}
		} else {
		}
	}

	element = document.querySelector(elementName);
	endTime = +new Date() + 1000 * (60 * minutes + seconds) + 500;
	updateTimer();
}
// Function that shows all bombs after you hit a bomb
const showBombs = function () {
	for (let index = 0; index < 100; index++) {
		if (field[index]) {
			spaceEl[index].classList.remove('flagged');
			spaceEl[index].innerHTML = '<i class="fas fa-bomb"></i>';
		}
	}
};

// Function for checking bombs around the space
const checkBombs = function (index) {
	let bombsAround = 0;
	let sIndex = index.toString();
	let secondNumber = Number(sIndex[1]);
	// console.log(sIndex[1]);
	if (field[index - 11] && index % 10 !== 0) bombsAround++;
	if (field[index - 10]) bombsAround++;
	if (field[index - 9] && secondNumber !== 9 && index > 9) bombsAround++;
	if (field[index + 11] && secondNumber !== 9 && index !== 9) bombsAround++;
	if (field[index + 10]) bombsAround++;
	if (field[index + 9] && index % 10 !== 0) bombsAround++;
	if (field[index + 1] && secondNumber !== 9 && index !== 9) bombsAround++;
	if (field[index - 1] && index % 10 !== 0) bombsAround++;
	if (field[index]) {
		showBombs();
		spaceEl[index].innerHTML = '<i class="fas fa-bomb"></i>';
		spaceEl[index].classList.add('bomb');
		resetBtn.innerHTML = '😵';
		gameOver = true;
	} else if (bombsAround === 0) {
		spaceEl[index].innerHTML = '';
		spaceEl[index].classList.add('clicked');
		return bombsAround;
	} else {
		spaceEl[index].innerHTML = bombsAround;
		spaceEl[index].classList.remove('flagged');
		spaceEl[index].classList.add('clicked');
		switch (bombsAround) {
			case 1:
				spaceEl[index].style.color = 'blue';
				break;
			case 2:
				spaceEl[index].style.color = 'green';
				break;
			case 3:
				spaceEl[index].style.color = 'red';
				break;
			case 4:
				spaceEl[index].style.color = 'darkblue';
				break;
			case 5:
				spaceEl[index].style.color = 'darkred';
				break;
			case 6:
				spaceEl[index].style.color = 'cyan';
				break;
			case 7:
				spaceEl[index].style.color = 'black';
				break;
			case 8:
				spaceEl[index].style.color = 'grey';
				break;
			default:
				break;
		}
		// console.log(bombsAround);
		return bombsAround;
	}
};

let bombsTopLeft;

// Function that cheks bombs around every space around clicked space
const spacesAround = function (index) {
	let sIndex = index.toString();
	let secondNumber = Number(sIndex[1]);

	spaceEl[index].innerHTML = '';
	spaceEl[index].classList.add('clicked');

	if (index % 10 !== 0 && index >= 10) {
		const topLeft = index - 11;
		checkBombs(topLeft);
		// let bombsTopLeft = checkBombs(topLeft);
		// if (bombsTopLeft === 0) spacesAround(topLeft);
	}
	if (index >= 10) {
		const top = index - 10;
		checkBombs(top);
		// let bombsTop = checkBombs(top);
		// if (bombsTop === 0) spacesAround(top);
	}
	if (secondNumber !== 9 && index >= 10) {
		const topRight = index - 9;
		checkBombs(topRight);
		// let bombsTopRight = checkBombs(topRight);
		// if (bombsTopRight === 0) spacesAround(topRight);
	}
	if (secondNumber !== 9 && index < 90 && index !== 9) {
		const bottomRight = index + 11;
		checkBombs(bottomRight);
		// let bombsBottomRight = checkBombs(bottomRight);
		// if (bombsBottomRight === 0) spacesAround(bottomRight);
	}
	if (index < 90) {
		const bottom = index + 10;
		checkBombs(bottom);
		// let bombsBottom = checkBombs(bottom);
		// if (bombsBottom === 0) spacesAround(bottom);
	}
	if (index % 10 !== 0 && index < 90) {
		const bottomLeft = index + 9;
		checkBombs(bottomLeft);
		// let bombsBottomLeft = checkBombs(bottomLeft);
		// if (bombsBottomLeft === 0) spacesAround(bottomLeft);
	}
	if (secondNumber !== 9 && index !== 9) {
		const right = index + 1;
		checkBombs(right);
		// let bombsRight = checkBombs(right);
		// if (bombsRight === 0) spacesAround(right);
	}
	if (index % 10 !== 0) {
		const left = index - 1;
		checkBombs(left);
		// let bombsLeft = checkBombs(left);
		// if (bombsLeft === 0) spacesAround(left);
	}
};
// Function that checks if the person has won
const checkWinner = function () {
	const spacesSolved = document.querySelectorAll('.clicked').length;
	console.log(spacesSolved);
	if (spacesSolved === freeSpaces) {
		resetBtn.innerHTML = '😎';
		showBombs();
		winner = true;
	}
};

// Click event
spaceEl.forEach((element) => {
	element.addEventListener('click', () => {
		if (!gameOver && !flagging && !winner) {
			// Getting an index of HTML element
			const index = [...element.parentElement.children].indexOf(element);
			let sIndex = index.toString();
			let secondNumber = Number(sIndex[1]);
			const bombsAroundSpace = checkBombs(index);

			if (bombsAroundSpace === 0) {
				spacesAround(index);
			}
			// Starting countdown at the first click
			timerCheck === 0 ? countdown('.numbers', difficultyMins, 0) : '';
			timerCheck += 1;
			checkWinner();
		} else if (flagging === true && !gameOver && !winner) {
			if (element.innerHTML === '') {
				element.innerHTML = '🚩';
				element.classList.add('flagged');
			}
		}
	});
});

// Function that resets the game
const reset = function () {
	gameOver = true;
	gameOver = false;
	winner = false;
	generateBomb();
	timerCheck = 0;
	time.innerHTML = '10:00';
	for (let index = 0; index < 100; index++) {
		spaceEl[index].classList.remove('clicked');
		spaceEl[index].classList.remove('bomb');
		spaceEl[index].innerHTML = '';
		spaceEl[index].style.color = 'black';
	}
	resetBtn.innerHTML = '😃';
	time.classList.remove('blink');
};

// Reset button event
resetBtn.addEventListener('click', reset);

// Choosing difficulty
easy.addEventListener('click', () => {
	bombsLimit = 10;
	difficultyMins = 10;
	freeSpaces = 90;
	reset();
	bombsNum.innerHTML = '010';
	timeEl.innerHTML = '10:00';
});

medium.addEventListener('click', () => {
	bombsLimit = 20;
	freeSpaces = 80;
	difficultyMins = 5;
	reset();
	bombsNum.innerHTML = '020';
	timeEl.innerHTML = '5:00';
});

hard.addEventListener('click', () => {
	bombsLimit = 30;
	freeSpaces = 70;
	difficultyMins = 3;
	reset();
	bombsNum.innerHTML = '030';
	timeEl.innerHTML = '3:00';
});

flagBtn.addEventListener('click', () => {
	if (flagging) {
		flagBtn.classList.remove('flagging');
		flagging = false;
	} else {
		flagging = true;
		flagBtn.classList.add('flagging');
	}
});
