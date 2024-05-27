const d = document,
	$gameCircle = d.querySelector(".game-circle"),
	$startScreen = d.querySelector(".start-screen"),
	$gameScreen = d.querySelector(".game-screen"),
	$resultsScreen = d.querySelector(".results-screen"),
	$timer = d.querySelector(".timer"),
	$passBtn = d.querySelector(".pass-btn"),
	$correctAnsResult = d.querySelector(".correct-ans-result span"),
	$wrongAnsResult = d.querySelector(".wrong-ans-result span"),
	$scoreResult = d.querySelector(".score-result span");
let $answer = d.querySelector(".answer");

const questionsAmount = 26;
const gameTime = 10;
let data = [];
let currentQuestion = -1,
	correctAnswers = 0,
	wrongAnswers = 0,
	currentAnswer = "";

const questionsState = new Array(questionsAmount).fill(0);

// Get Questions ****************************************************************
function getQuestions() {
	fetch("game_db/questions.json")
		.then((res) => (res.ok ? res.json() : Promise.reject(res)))
		.then((res) => {
			data = res.questions;
		})
		.catch((err) => {
			let message = err.statusText || "Ocurrió un error";
		});
}
getQuestions();

// Create Rosco ****************************************************************

function createRosco() {
	for (let i = 1; i <= questionsAmount; i++) {
		const $letterContainer = d.createElement("div");
		$letterContainer.classList.add("rosco-letter-container");
		$letterContainer.textContent = String.fromCharCode(i + 96);
		$letterContainer.id = String.fromCharCode(i + 96).toUpperCase();
		$gameCircle.appendChild($letterContainer);
		$timer.textContent = gameTime;

		const angle = ((i - 1) / questionsAmount) * Math.PI * 2 - Math.PI / 2;
		const x = Math.round(123 + 140 * Math.cos(angle));
		const y = Math.round(123 + 140 * Math.sin(angle));

		$letterContainer.style.left = `${x}px`;
		$letterContainer.style.top = `${y}px`;
	}
}

// Start Screen ************************************************

function startBtn() {
	d.addEventListener("click", (e) => {
		if (e.target.matches(".start-btn") || e.target.matches(".start-btn i")) {
			createRosco();
			startGame();
		}
	});
}
startBtn();

function startGame() {
	$startScreen.style.display = "none";
	$resultsScreen.style.display = "none";
	$gameScreen.style.display = "block";
	writeQuestions();
	startTimer();
}

// Game timer ************************************************

function startTimer() {
	let timeLeft = gameTime;
	let countdown = setInterval(() => {
		timeLeft--;
		$timer.innerHTML = timeLeft;

		if (timeLeft === 0) {
			clearInterval(countdown);
			setTimeout(() => {
				showFinalScreen();
			}, 1000);
		}
	}, 1000);
}

// Write questions ****************************************************************

function writeQuestions() {
	const $currentAnswerLetter = d.querySelector(".current-answer-letter"),
		$currentQuestion = d.querySelector(".current-question");

	currentQuestion++;

	if (currentQuestion >= questionsAmount) {
		currentQuestion = 0;
	}

	if (questionsState.indexOf(0) >= 0) {
		while (questionsState[currentQuestion] == 1) {
			currentQuestion++;
			if (currentQuestion >= questionsAmount) {
				currentQuestion = 0;
			}
		}
		$currentAnswerLetter.textContent = data[currentQuestion].id;
		$currentQuestion.textContent = data[currentQuestion].question;

		let letter = data[currentQuestion].id;
		d.getElementById(letter).classList.add("active-letter");
	} else {
		clearInterval(countdown);
		showFinalScreen();
	}
}

function getAnswer() {
	$answer.addEventListener("keyup", (e) => {
		if (e.keyCode === 13) {
			if ($answer.value == "") {
				alert("Please enter an answer!");
				return;
			} else {
				let answerText = $answer.value.toUpperCase();
				controlAnswer(answerText, $answer);
			}
		}
	});
}
getAnswer();

function controlAnswer(answerText, $answer) {
	if (answerText === data[currentQuestion].answer.toUpperCase()) {
		correctAnswers++;
		questionsState[currentQuestion] = 1;
		let letter = data[currentQuestion].id;
		d.getElementById(letter).classList.remove("active-letter");
		d.getElementById(letter).classList.add("correct-answered");
	} else {
		questionsState[currentQuestion] = 1;
		wrongAnswers++;
		let letter = data[currentQuestion].id;
		d.getElementById(letter).classList.remove("active-letter");
		d.getElementById(letter).classList.add("wrong-answered");
	}
	$answer.value = null;
	writeQuestions();
}

d.addEventListener("click", (e) => {
	if (e.target.matches(".pass-btn")) {
		let letter = data[currentQuestion].id;
		d.getElementById(letter).classList.remove("active-letter");
		writeQuestions();
	}
});

// Final Results Screen ****************************************************************

function showFinalScreen() {
	$correctAnsResult.textContent = correctAnswers;
	$wrongAnsResult.textContent = wrongAnswers;
	$scoreResult.textContent = Math.round(
		(correctAnswers * 100) / questionsAmount
	);

	$gameScreen.style.display = "none";
	$resultsScreen.style.display = "block";
}

// Try Again Button ********************************

d.addEventListener("click", (e) => {
	if (e.target.matches(".try-again-btn")) {
		$roscoLetterContainers = d.querySelectorAll(".rosco-letter-container");
		currentQuestion = -1;
		timeLeft = 0;
		$timer.innerText = gameTime;
		correctAnswers = 0;
		wrongAnswers = 0;
		currentAnswer = "";
		questionsState.fill(0);
		$answer.value = "";
		console.log($roscoLetterContainers);
		for (i = 0; i < $roscoLetterContainers.length; i++) {
			$roscoLetterContainers[i].classList.remove("correct-answered");
			$roscoLetterContainers[i].classList.remove("wrong-answered");
			$roscoLetterContainers[i].classList.remove("active-letter");
		}
		startGame();
	}
});
