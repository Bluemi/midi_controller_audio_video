console.log("main.js")

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
	activeSampleId = 1
}

function kick() {
	let source = context.createBufferSource();
	source.buffer = bufferManager.kick
	source.connect(context.destination);
	source.start(context.currentTime);
	activeSampleId = 2
}

function hihat() {
	let source = context.createBufferSource();
	source.buffer = bufferManager.hihat_open;
	source.connect(context.destination);
	source.start(context.currentTime);
	activeSampleId = 3
}
