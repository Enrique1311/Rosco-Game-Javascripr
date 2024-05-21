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

	d.addEventListener("click", (e) => {
		if (e.target.matches(".start-btn") || e.target.matches(".start-btn i")) {
			$startScreen.style.display = "none";
			$gameScreen.style.display = "block";
		}
	});
}
startBtn();
