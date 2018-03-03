let midiAccess;
let $oldTrackInfoFocus;

document.addEventListener('DOMContentLoaded', (event) => {
    console.log(document.getElementById('result'));

    initMidi();
});

function initMidi() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(
            midiSuccess,
            midiFailure
        );
    } else {
        midiFailure();
    }
}

function midiSuccess(midi) {
    console.log('Midi is working!');

    midiAccess = midi;
    let inputs = midi.inputs;
    for (let input of inputs.values()) {
        input.onmidimessage = onMidiMessage;
    }
}

function midiFailure() {
    console.error('Failure: Midi is not working!');
}

function onMidiMessage(event) {
    let cmd = event.data[0] >> 4;
    let channel = event.data[0] & 0xf;
    let btnID = event.data[1];
    let value = event.data[2];

    switch (btnID) {
        case 16:
            if(value===0) clickNewButton(-1);
            break;
        case 17:
            if(value===0) clickNewButton(1);
            break;
        case 48:
            regulateVolume(value);
            break;
        case 51:
            changeFocusedTrackInfo(value);
            break;
        default:
            break;
    }

        console.log("\n" +
        "New Event (on Channel: "+channel+")==> Type: "+ cmd +
        ", Origin: "+btnID +
        ", Value: "+value);
}

function clickNewButton(direction) {
    let $focused = $(':focus');
    let currentId = Number($focused.attr("id"))+Number(direction);
    let $foundButton = $("#sample-container").find(".addableSample").find("#"+currentId);
    if (!isNaN($foundButton.attr("id"))){
        $focused.blur();
        $foundButton.trigger("click").focus();
    }
}

function regulateVolume(value) {
    if ($oldTrackInfoFocus != null){
        console.log(player.tracks[$oldTrackInfoFocus.index()]);
    }
}


function changeFocusedTrackInfo(value) {
    let max = 128;
    let trackCount = $(".track-info").length;
    let interval = max / trackCount;
    let nth = Number(trackCount - 1) - Math.floor(Number(value) / interval);
    let $trackInfoToFocus = $("#track-panel").children().eq(nth);
    if(!($oldTrackInfoFocus === $trackInfoToFocus)){
        if (!($oldTrackInfoFocus == null)){
            $oldTrackInfoFocus.css("background-color", "#aaa");
        }
        $trackInfoToFocus.css("background-color", "red");
        $oldTrackInfoFocus = $trackInfoToFocus;
    }
}
