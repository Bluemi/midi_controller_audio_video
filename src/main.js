let context;
let buffers = [];

window.addEventListener('load', init, false);
function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
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
	  buffers.push(buffer);
    }, function(e) {alert("error: " + e)});
  }
  request.send();
}


function playSound(buffer) {
	var source = context.createBufferSource(); // creates a sound source
	source.buffer = buffer;	                   // tell the source which sound to play
	source.connect(context.destination);       // connect the source to the context's destination (the speakers)
	source.start(context.currentTime + 1, 0); 
}											   // note: on older systems, may have to use deprecated noteOn(time);

function onButtonSnare() {
	playSound(buffers[0]);
}

function onButtonKick() {
	playSound(buffers[1]);
}

function onButtonHiHat() {
	playSound(buffers[2]);
}

loadSampleBuffer("./res/Snare.mp3");
loadSampleBuffer("./res/Kick.mp3");
loadSampleBuffer("./res/HiHat_open.mp3");

// console.log("hello world");

// function onMidiMessage(event)
// {
//     document.getElementById('midiMsg').value = event.target.name + " " + event.data + " " + event.receivedTime;
//     console.log(event.receivedTime);
// }

// function midiSuccess(midi)
// {
// 	console.log("Midi Success :D");

// 	let inputs = midi.inputs;
// 	for (let input of inputs.values()) {
// 		input.onmidimessage = onMidiMessage;
// 	}
// }

// function midiFailure(midi)
// {
// 	console.log("Midi Failure :(");
// }

// if (navigator.requestMIDIAccess) {
// 	navigator.requestMIDIAccess().then(midiSuccess, midiFailure);
// }
// else
// {
// 	midiFailure();
// }
