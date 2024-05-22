const d = document;
const questionsAmount = 26;

const $gameCircle = d.querySelector(".game-circle");

for (let i = 1; i <= questionsAmount; i++) {
	const $letterContainer = d.createElement("div");
	$letterContainer.classList.add("letter-container");
	$letterContainer.textContent = String.fromCharCode(i + 96);
	$letterContainer.id = String.fromCharCode(i + 96);
	$gameCircle.appendChild($letterContainer);

	const angle = ((i - 1) / questionsAmount) * Math.PI * 2 - Math.PI / 2;
	const x = Math.round(123 + 140 * Math.cos(angle));
	const y = Math.round(123 + 140 * Math.sin(angle));

	$letterContainer.style.left = `${x}px`;
	$letterContainer.style.top = `${y}px`;
}

// Start Screen ************************************************

function startBtn() {
	const $startScreen = d.querySelector(".start-screen");
	const $gameScreen = d.querySelector(".game-screen");
	const $timer = d.querySelector(".timer");

	const gameTime = 10;
	// let currentQuestion = -1;
	// let questionsState = [
	// 	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	// 	0,
	// ];

	const startGame = () => {
		let timeLeft = gameTime;
		let countdown = setInterval(() => {
			timeLeft--;
			$timer.innerHTML = timeLeft;

			if (timeLeft === 0) {
				clearInterval(countdown);
			}
		}, 1000);
	};

	const downloadQuestions = () => {
		const $currentAnswerLetter = d.querySelector(".current-answer-letter"),
			$currentQuestion = d.querySelector(".current-question");

		fetch("game_db/questions.json")
			.then((res) => (res.ok ? res.json() : Promise.reject(res)))
			.then((res) => {
				let data = res.questions;
				data.forEach((el, index) => {
					if (index <= data.length) {
						if (el.answered === "false") {
							$currentAnswerLetter.textContent = el.id;
							$currentQuestion.textContent = el.question;
						} else {
						}
					}
				});
			})
			.catch((err) => {
				let message = err.statusText || "Ocurrió un error";
			});

		// currentQuestion++;

		// if (currentQuestion > questionsAmount) {
		// 	currentQuestion = 0;
		// }

		// if (questionsState.indexOf(0) >= 0) {
		// 	while (questionsState[currentQuestion] == 1) {
		// 		currentQuestion++;
		// 		if (currentQuestion >= questionsAmount) {
		// 			currentQuestion = 0;
		// 		}
		// 	}

		// 	$currentAnswerLetter.textContent = data[currentQuestion].id;
		// 	$currentQuestion.textContent = data[currentQuestion].question;
		// 	let letter = data[currentQuestion].id;
		// 	d.getElementById(letter).classList.add("current-question");
		// } else {
		// 	clearInterval(countdown);
		// 	// showResults()
		// }
	};

	d.addEventListener("click", (e) => {
		if (e.target.matches(".start-btn") || e.target.matches(".start-btn i")) {
			$startScreen.style.display = "none";
			$gameScreen.style.display = "block";
			startGame();
			downloadQuestions();
		}
	});
}
startBtn();
