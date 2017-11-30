let context;
let tracks = [];

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


class Track{
    constructor(context, title, buffer, ticks){
        this.title = title;
        this.ticks = ticks;
        this.buffer = buffer;
        this.context = context;
        console.log(context);
    }

    play() {
        for (let i = 0; i < this.ticks.length; i++) {
            let source = this.context.createBufferSource();
            source.buffer = this.buffer;
            source.connect(this.context.destination);
            if (this.ticks[i] > 0) {
                source.start(this.context.currentTime+i*0.2);
            }
        }
    }
}

let i = 0;
let ticks_list = [[0,0,1,0,0], [1,0,0,0,1], [0,1,0,1,0]];

function loadSampleBuffer(url) {
  let request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
	  tracks.push(new Track(context, "test"+i, buffer, ticks_list[i]));
	  console.log(i)
	  i++;
    }, function(e) {alert("error: " + e)});
  };
  request.send();
}	// note: on older systems, may have to use deprecated noteOn(time);

loadSampleBuffer("./res/Snare.mp3");
loadSampleBuffer("./res/Kick.mp3");
loadSampleBuffer("./res/HiHat_open.mp3");

function onButtonSnare() {
    for (let i = 0; i < tracks.length; i++) {
        tracks[i].play();
    }
}

function onButtonKick() {
    tracks[1].play();
}

function onButtonHiHat() {
    tracks[2].play();
}
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
