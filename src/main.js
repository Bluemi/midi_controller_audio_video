let context;
let samples = [new Sample("clap", 0.25), new Sample("crash1", 0.75), new Sample("crash2", 0.5), new Sample("cymbal",0.1),
    new Sample("hihat",0), new Sample("kick1",0), new Sample("kick2", 1.1), new Sample("ride",0), new Sample("snare1",0),
        new Sample("snare2",0.5), new Sample("snare3",0), new Sample("special", 0.85), new Sample("tom1",0.1), new Sample("tom2",0.5)];
let yPos = 0;
let player;
let guiManager;

window.addEventListener('load', init, false);
function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
        player = new Player(context, samples);
        DashUtils.addVideos(samples);
        guiManager = new GuiManager(player);
        for (let i in samples) {
            player.loadSampleBuffer("res/samples/" + samples[i].title + ".mp3", samples[i].title);
        }
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
			addButton.prop("disabled", true);
            Player.hideAllVids();
		}
	});

    for (let j = 0; j < 14; j++) {
        let rand = GuiManager.getRandomLightColor();
        $(".sample-container .addableSample #"+j).css("background-color", rand);
	}
});
