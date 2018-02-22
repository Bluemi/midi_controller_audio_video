let context;
let yPos = 0;
let player;

window.addEventListener('load', init, false);
function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
	player = new Player(context);
	player.loadSampleBuffer("./res/Snare.mp3", "snare");
	player.loadSampleBuffer("./res/Kick.mp3", "kick");
	player.loadSampleBuffer("./res/HiHat_open.mp3", "hihat_open");
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
}

function addGui(addButton) {
	for (var i = 0; i < 16; i++) {
		var sample= $("<div class=\"sample\" id=\"cell-" + yPos + "-" + i + "\"></div>")
		sample.data("yPos", yPos);
		sample.data("xPos", i);
		sample.data("enabled", false);
		$("#loop-panel").append(sample);
		$("#cell-" + yPos + "-" + i).click(function() {
			$(this).data("enabled", ! $(this).data("enabled"));
			if ($(this).data("enabled")) {
				$(this).css({ background: "red"})
			} else {
				$(this).css({ background: "white"})
			}
			player.enableTick($(this).data("yPos"), $(this).data("xPos"));
		});
	}
	var removeButton = $("<button id=\"remove-button\" class=\"remove-button\">x</button>")
	removeButton.data("yPos", yPos)
	removeButton.click(function() {

		var y = $(this).data("yPos")

		player.removeTrack(y)

		// remove samples
		$("[id^='cell-" + y + "-']").remove();

		// remove effects
		$(".effect").filter(function(index, element) { return $(element).data("yPos") == y; }).remove()

		// remove track panel
		$(this).parent().remove();
	});

	var trackPanel = $("<div class=\"track-info\"></div>")
	trackPanel.append(removeButton)
	$("#track-panel").append(trackPanel)
	for (var i = 0; i < 3; i++) {
		var effect = $("<div class=\"effect\"></div>")
		effect.data("yPos", yPos)
		$("#effect-panel").append(effect)
	}
	yPos++
	addButton.prop("disabled", true)
}

// add gui elements
$(document).ready(function() {
	$("#add-button").click(function() {
		player.addTrack()
		addGui($(this));
	});

	yPos = 0

	$(".addableSampleButton").focusout(function() {
		let addButton = $("#add-button")
		if (! addButton.is(":hover")) {
			addButton.prop("disabled", true)
		}
	});

    for (var j = 0; j < 14; j++) {
        var rand = getRandomLightColor();
        $(".sample-container .addableSample #"+j).css("background-color", rand);
	}
});

/*function getRandomColor()
{
    var color = Math.floor(Math.random() * Math.pow(256, 3)).toString(16);
    while(color.length < 6) {
        color = "0" + color;
    }
    return "#" + color;
}*/

function getRandomLightColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}
