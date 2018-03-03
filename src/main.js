let context;
let samples;
let player;
let guiManager;
let yPos = 0;
const filePath = "res/samples.json";

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

    JsonUtils.loadJSON(filePath, function (response) {
        // Parse Json string into object
        samples = JSON.parse(response).samples;
        player = new Player(context, samples);
        DashUtils.addVideos(samples);
        guiManager = new GuiManager(player, samples);
        guiManager.addSamplePanel();

        $("#add-button").click(function() {
            guiManager.addTrackPanelColumn($(this));
            player.addTrack();
        });

        for (let i = 0; i < samples.length; i++) {
            let color = GuiManager.getRandomLightColor();
            $("#sample-container").find(".addableSample #"+i).css("background-color", color);
            samples[i].color = color;
        }

        $(".addableSampleButton").focusout(function() {
            let addButton = $("#add-button");
            if (! addButton.is(":hover")) {
                addButton.prop("disabled", true);
                Player.hideAllVids();
            }
        });
    });
}

function effect_clicked(y, x) {
	player.effect_clicked(y, x);
}
