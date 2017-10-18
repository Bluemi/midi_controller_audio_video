console.log("hello world");

function onMidiMessage(event)
{
	console.log(
		event.target.name,
		event.data,
		event.receivedTime);
}

function midiSuccess(midi)
{
	console.log("Midi Success :D");

	let inputs = midi.inputs;
	for (var input of inputs.values()) {
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
