let volumeSlider = document.getElementById('volume-slider');
let volumeDisplay = document.getElementById('volume-display');
let audioVolume = volumeSlider.value;

	volumeSlider.addEventListener('input', function() {
	audioVolume = this.value;
	volumeDisplay.innerText = `Volume: ${Math.round(this.value * 100)}%`;
	});

function playBreak() {
	let audio = new Audio("assets/hit.wav");
    audio.volume *= audioVolume;
    audio.play();
}
