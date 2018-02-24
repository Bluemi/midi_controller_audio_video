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
        guiManager = new GuiManager(player);
        GuiManager.addSampleGui();

        $("#add-button").click(function() {
            guiManager.addTrackGui($(this));
            player.addTrack()
        });

        for (let j = 0; j < 14; j++) {
            let rand = GuiManager.getRandomLightColor();
            $("#sample-container").find(".addableSample #"+j).css("background-color", rand);
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
