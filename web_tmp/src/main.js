let context;
let bufferManager = {};
let activeSampleId = 0;
let yPos = 0;
let tracks = {};
let numberOfTicks = 16;
let loopVar;
let guiManager = new GuiManager();

const INTERVAL = 0.2;
const OFFSET = 0.1;

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
}

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

function enableTick(y, x) {
	console.log(y)
	console.log(tracks)
	tracks[y].ticks[x] = !tracks[y].ticks[x];
}

function removeTrack(y) {
	delete tracks[y]
}

function idToSample(id) {
	switch (id) {
		case 1:
			return "snare";
		case 2:
			return "kick";
		case 3:
			return "hihat_open";
		default:
			return "";

	}
}

function addTrack() {
	let sample = idToSample(activeSampleId)
	tracks[yPos] = new Track(sample, bufferManager[sample])
	yPos++;
	activeSampleId = 0;
}

function loop() {
	play();

	// wait for loop
	let loopTime = 0;
	for (let j = 0; j < numberOfTicks; j++) {
		loopTime += INTERVAL;
	}
	loopVar = window.setInterval(play, loopTime * 1000)
}

function play() {
	let t = context.currentTime + OFFSET;
	for (let k in tracks) {
		track = tracks[k]
		for (let tick = 0; tick < track.ticks.length; tick++) {
			let source = context.createBufferSource();
			source.buffer = track.buffer;
			source.connect(context.destination);
			if (track.ticks[tick] > 0) {
				source.start(t + tick*INTERVAL);
			}
		}
	}
}

// add gui elements
$(document).ready(function() {
	$("#add-button").click(function() {
		addTrack()
		guiManager.addTrackGui($(this));
	});

	yPos = 0

	$(".addableSampleButton").focusout(function() {
		let addButton = $("#add-button")
		if (! addButton.is(":hover")) {
			addButton.prop("disabled", true)
		}
	});

    for (let j = 0; j < 14; j++) {
        let rand = guiManager.getRandomLightColor();
        $(".sample-container .addableSample #"+j).css("background-color", rand);
	}
});

function stop() {
	clearInterval(loopVar);
}
