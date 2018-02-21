let context;
let bufferManager = {};
let activeSampleId = 0;

window.addEventListener('load', init, false);
function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
		loadSampleBuffer("./res/Snare.mp3", "snare");
		loadSampleBuffer("./res/Kick.mp3", "kick");
		loadSampleBuffer("./res/HiHat_open.mp3", "hihat_open");
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
}

function loadSampleBuffer(url, name) {
	let request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			bufferManager[name] = buffer;

		}, function(e) {alert("error: " + e)});
	};
	request.send();
}	// note: on older systems, may have to use deprecated noteOn(time);

function snare() {
	let source = context.createBufferSource();
	source.buffer = bufferManager.snare;
	source.connect(context.destination);
	source.start(context.currentTime);
	activeSampleId = 1;
	$("#add-button").prop("disabled", false)
}

function kick() {
	let source = context.createBufferSource();
	source.buffer = bufferManager.kick
	source.connect(context.destination);
	source.start(context.currentTime);
	activeSampleId = 2;
	$("#add-button").prop("disabled", false)
}

function hihat() {
	let source = context.createBufferSource();
	source.buffer = bufferManager.hihat_open;
	source.connect(context.destination);
	source.start(context.currentTime);
	activeSampleId = 3;
	$("#add-button").prop("disabled", false)
}

$(document).ready(function() {
	$("#add-button").click(function() { console.log("hey"); });
});

// add gui elements
$(document).ready(function() {
	$("#add-button").click(function() {
		console.log("addbutton click");
		for (var i = 0; i < 16; i++) {
			$("#loop-panel").append("<div class=\"sample\" id=\"cell-" + yPos + "-" + i + "\"></div>")
			$("#cell-" + yPos + "-" + i).click(function() {
				console.log("hey " + $(this).attr('id'))
				$(this).css({ background: "red"})
			});
		}
		var removeButton = $("<button id=\"remove-button\" class=\"remove-button\">x</button>")
		removeButton.data("yPos", yPos)
		removeButton.click(function() {

			var y = $(this).data("yPos")

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
		$(this).prop("disabled", true)
	});

	yPos = 0

	$(".addableSampleButton").focusout(function() {
		activeSampleId = 0;
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
