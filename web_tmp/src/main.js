console.log("main.js")

let context;

let bufferManager = {};

window.addEventListener('load', init, false);
function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
		loadSampleBuffer("./res/Snare.mp3");

    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
}

function loadSampleBuffer(url) {
	let request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			bufferManager.sample = buffer;

		}, function(e) {alert("error: " + e)});
	};
	request.send();
}	// note: on older systems, may have to use deprecated noteOn(time);

/*loadSampleBuffer("./res/Kick.mp3");*/
/*loadSampleBuffer("./res/HiHat_open.mp3");*/


function snare() {
	console.log("snare")
	let source = context.createBufferSource();
	source.buffer = bufferManager.sample;
	source.connect(context.destination);
	source.start(context.currentTime);
}

function kick() {
	console.log("snare")
	let source = context.createBufferSource();
	source.buffer = bufferManager.sample;
	source.connect(context.destination);
	source.start(context.currentTime);
}

function hihat() {
	console.log("snare")
	let source = context.createBufferSource();
	source.buffer = bufferManager.sample;
	source.connect(context.destination);
	source.start(context.currentTime);
}
