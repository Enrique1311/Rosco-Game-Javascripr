const d = document;
const questionsAmount = 26;
let currentQuestion = -1;

const questionsState = new Array(questionsAmount).fill(0);

// Download questions ****************************************************************

// function getQuestions() {
// 	fetch("game_db/questions.json")
// 		.then((res) => (res.ok ? res.json() : Promise.reject(res)))
// 		.then((res) => {
// 			let data = res.questions;
// 			return data;
// 		})
// 		.catch((err) => {
// 			let message = err.statusText || "Ocurrió un error";
// 		});
// 	return data;
// }
// getQuestions();

function createRosco() {
	const $gameCircle = d.querySelector(".game-circle");

	for (let i = 1; i <= questionsAmount; i++) {
		const $letterContainer = d.createElement("div");
		$letterContainer.classList.add("rosco-letter-container");
		$letterContainer.textContent = String.fromCharCode(i + 96);
		$letterContainer.id = String.fromCharCode(i + 96).toUpperCase;
		$gameCircle.appendChild($letterContainer);

		const angle = ((i - 1) / questionsAmount) * Math.PI * 2 - Math.PI / 2;
		const x = Math.round(123 + 140 * Math.cos(angle));
		const y = Math.round(123 + 140 * Math.sin(angle));

		$letterContainer.style.left = `${x}px`;
		$letterContainer.style.top = `${y}px`;
	}
}

// Start Screen ************************************************

function startBtn(data) {
	const $startScreen = d.querySelector(".start-screen");
	const $gameScreen = d.querySelector(".game-screen");

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
	const gameTime = 3;
	const $timer = d.querySelector(".timer");

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
		$currentQuestion = d.querySelector(".current-question"),
		$roscoLetterContainer = d.querySelector(".rosco-letter-container");

	fetch("game_db/questions.json")
		.then((res) => (res.ok ? res.json() : Promise.reject(res)))
		.then((res) => {
			let data = res.questions;

			currentQuestion++;

			if (currentQuestion >= questionsAmount) {
				currentQuestion = 0;
			}

			if (questionsState.indexOf(0) >= 0) {
				while (questionsState[currentQuestion] === 1) {
					currentQuestion++;
					if (currentQuestion >= questionsAmount) {
						currentQuestion = 0;
					}
				}
				$currentAnswerLetter.textContent = data[currentQuestion].id;
				$currentQuestion.textContent = data[currentQuestion].question;

				let letter = data[currentQuestion].id;
				$roscoLetterContainer.classList.add("active-letter");
			} else {
				clearInterval(countdown);
			}
		})
		.catch((err) => {
			let message = err.statusText || "Ocurrió un error";
		});
}

// Update questions ****************************************************************

function getQuestions() {
	fetch("game_db/questions.json")
		.then((res) => (res.ok ? res.json() : Promise.reject(res)))
		.then((res) => {
			let data = res.questions;
			return data;
		})
		.catch((err) => {
			let message = err.statusText || "Ocurrió un error";
		});
}

// function getQuestions() {
// 	const $currentAnswerLetter = d.querySelector(".current-answer-letter"),
// 		$currentQuestion = d.querySelector(".current-question");

// 	fetch("game_db/questions.json")
// 		.then((res) => (res.ok ? res.json() : Promise.reject(res)))
// 		.then((res) => {
// 			let data = res.questions;
// 			data.forEach((el, index) => {
// 				if (index <= data.length && el.answered === "false") {
// 					$currentAnswerLetter.textContent = el.id;
// 					$currentQuestion.textContent = el.question;
// 					getAnswer();
// 				}
// 			});
// 		})
// 		.catch((err) => {
// 			let message = err.statusText || "Ocurrió un error";
// 		});
// }

// function getAnswer(el) {
// 	let $answer = d.querySelector(".answer");
// 	$answer.addEventListener("keyup", (e) => {
// 		if (e.keyCode === 13) {
// 			if ($answer.value == "") {
// 				alert("Please enter an answer!");
// 				return;
// 			}
// 			let answerText = $answer.value.toUpperCase();
// 			console.log(el);
// 			if (answerText === el.answer.toUpperCase()) {
// 				alert("Correct answer!");
// 				return;
// 			} else {
// 				alert("Wrong answer!");
// 				return;
// 			}
// 		}
// 	});
// }
