let midiAccess;
let $currentTrackInfoFocus;
let trackCount;
let normalMax = 127;

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
        case 1:
            regulateDelaySize(value);
            break;
        case 2:
            regulateDelayValue(value);
            break;
        case 16:
            if (value === 0) clickNewButton(-1);
            break;
        case 17:
            if (value === 0) clickNewButton(1);
            break;
        case 48:
            changeFocusedTrackInfo(value);
            break;
        case 49:
            regulateVolume(value);
            break;
        case 50:
            regulateBiquadFilterFrequency(value);
            break;
        case 51:
            regulateReverb(value);
            break;
        default:
            break;
    }
/*

    console.log("\n" +
        "New Event (on Channel: " + channel + ")==> Type: " + cmd +
        ", Origin: " + btnID +
        ", Value: " + value);
*/
}

function clickNewButton(direction) {
    let $focused = $(':focus');
    let currentId = Number($focused.attr("id")) + Number(direction);
    let $foundButton = $("#sample-container").find(".addableSample").find("#" + currentId);
    if (!isNaN($foundButton.attr("id"))) {
        $focused.blur();
        $foundButton.trigger("click").focus();
    }
}

function regulateVolume(value) {
    if (!isFocusedTrackInfoExistent()) return;

    let currentTrackIndex = $currentTrackInfoFocus.data("yPos");
    let volume = value / normalMax;
    player.tracks[currentTrackIndex].setVolume(volume);
    $("#volume-display"+currentTrackIndex).find(".track-info-button-content").text(Math.floor(volume*100));
    //$("#volume-display"+currentTrackIndex).append("<input type='image' id='speaker' src='../res/images/speaker/speaker.svg'/>");
}

function changeFocusedTrackInfo(value) {
    let max = 128;
    trackCount = $(".track-info").length;
    let interval = max / trackCount;
    let nth = Number(trackCount - 1) - Math.floor(Number(value) / interval);
    let $newTrackInfoToFocus = $("#track-panel").children().eq(nth);
    if(!($currentTrackInfoFocus === $newTrackInfoToFocus)){
        if (!($currentTrackInfoFocus == null)){
            $currentTrackInfoFocus.css("background-color", "#aaa");
        }
        $newTrackInfoToFocus.css("background-color", "red");
        $currentTrackInfoFocus = $newTrackInfoToFocus;
    }
}

function regulateBiquadFilterFrequency(value) {
    masterEffect(1, (value/normalMax)*1000);
    visualizeEffectByColor(1, value/normalMax);
}

function regulateReverb(value) {
    masterEffect(2, (value/normalMax)*0.03);
    visualizeEffectByColor(2, value/normalMax);
}

function regulateDelaySize(value) {
    //todo: solve visualization problem with size - not visible
    masterEffect(3, value/normalMax)
}

function regulateDelayValue(value) {
    masterEffect(0, value/normalMax);
    visualizeEffectByColor(0, value/normalMax);
}

function isFocusedTrackInfoExistent() {
    return $currentTrackInfoFocus != null && $currentTrackInfoFocus.length > 0;
}

function masterEffect(effectIndex, value) {
    if (!isFocusedTrackInfoExistent()) return;

    let currentTrack = player.tracks[$currentTrackInfoFocus.data("yPos")];

    switch (effectIndex){
        case 0:
            currentTrack.setDelayValue(value);
            break;
        case 1:
            currentTrack.setBiquadFilterFrequency(value);
            break;
        case 2:
            currentTrack.setReverbValue(value);
            break;
        case 3:
            currentTrack.setDelaySize(value);
            break;
        default:
            break;
    }

    visualizeEffectByColor(effectIndex, value);
}

function visualizeEffectByColor(effectIndex, value) {
    if (!isFocusedTrackInfoExistent()) return;

    let index = $currentTrackInfoFocus.data("yPos");
    $('#effect-panel > .effect').each(function () {
        if ($(this).data("yPos") === index && $(this).data("x") === effectIndex) {
            $(this).css("background-color", changeCSSColorHSL(180, value*100, 240));
        }
    });

}

function changeCSSColorHSL(start, percentage, end) {
    let x = percentage / 100,
        y = (end - start) * x,
        z = y + start;

    return 'hsl('+z+', 100%, 50%)';
}
