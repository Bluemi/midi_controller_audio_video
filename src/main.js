console.log("hello world");

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
