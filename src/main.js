const samples = [];
const playButtons = [];

function onAddSamples() {
    let selectedFile = document.getElementById('sample').files[0];
    samples.push(addSample(selectedFile, '#waveform'));
}

function onSampleUploaded() {
    let selectedFile = document.getElementById('sample').files[0];
    console.log(selectedFile);
}

function addSample(url, waveId) {
    let element = document.createElement('div');
    document.querySelector(waveId).appendChild(element);

    let waveSurfer = WaveSurfer.create({
        container: element,
        waveColor: 'red',
        progressColor: 'purple',
        hideScrollbar: true
    });

    waveSurfer.loadBlob(url);
    console.log('Sample added');

    let button = document.createElement('button');
    button.innerHTML="Play / Pause";

    button.onclick = function () {
        waveSurfer.playPause();
    }

    document.querySelector(waveId).appendChild(button);

    return waveSurfer;
}

function onMidiMessage(event)
{
    document.getElementById('midiMsg').value = event.target.name + " " + event.data + " " + event.receivedTime;
    console.log(event.receivedTime);
}

function midiSuccess(midi)
{
	console.log("Midi Success :D");

	let inputs = midi.inputs;
	for (let input of inputs.values()) {
		input.onmidimessage = onMidiMessage;
	}
}

function midiFailure(midi)
{
	console.log("Midi Failure :(");
}

if (navigator.requestMIDIAccess) {
	navigator.requestMIDIAccess().then(midiSuccess, midiFailure);
}
else
{
	midiFailure();
}
