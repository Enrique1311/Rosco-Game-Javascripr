const d = document,
	$gameCircle = d.querySelector(".game-circle"),
	$startScreen = d.querySelector(".start-screen"),
	$gameScreen = d.querySelector(".game-screen"),
	$timer = d.querySelector(".timer"),
	$passBtn = d.querySelector(".pass-btn");

const questionsAmount = 26;
let data = [];
let currentQuestion = -1,
	correctsAnswers = 0,
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
			$startScreen.style.display = "none";
			$gameScreen.style.display = "block";
			createRosco();
			writeQuestions();
			startTimer();
		}
	});
}
startBtn();

// Game timer ************************************************

function startTimer() {
	const gameTime = 20;

	let timeLeft = gameTime;
	let countdown = setInterval(() => {
		timeLeft--;
		$timer.innerHTML = timeLeft;

		if (timeLeft === 0) {
			clearInterval(countdown);
			setTimeout(() => {
				alert("Game over!");
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
	}
}

function getAnswer() {
	let $answer = d.querySelector(".answer");

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
		correctsAnswers++;
		questionsState[currentQuestion] = 1;
		let letter = data[currentQuestion].id;
		d.getElementById(letter).classList.remove("active-letter");
		d.getElementById(letter).classList.add("correct-answered");
	} else {
		questionsState[currentQuestion] = 1;
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
