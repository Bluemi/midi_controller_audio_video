let context;
let sampleNames = ["snare", "kick", "hihat"];
let yPos = 0;
let player;
let guiManager;

window.addEventListener('load', init, false);
function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
        player = new Player(context, sampleNames);
        DashUtils.addVideos(sampleNames);
        guiManager = new GuiManager(player);
        player.loadSampleBuffer("./res/Snare.mp3", "snare");
        player.loadSampleBuffer("./res/Kick.mp3", "kick");
        player.loadSampleBuffer("./res/HiHat_open.mp3", "hihat");
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
}

// add gui elements
$(document).ready(function() {
	$("#add-button").click(function() {
		guiManager.addTrackGui($(this));
		player.addTrack()
	});

	yPos = 0;

	$(".addableSampleButton").focusout(function() {
		let addButton = $("#add-button");
		if (! addButton.is(":hover")) {
			addButton.prop("disabled", true)
		}
	});

    for (let j = 0; j < 14; j++) {
        let rand = GuiManager.getRandomLightColor();
        $(".sample-container .addableSample #"+j).css("background-color", rand);
	}
});
