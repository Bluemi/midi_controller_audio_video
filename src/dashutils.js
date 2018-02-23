class DashUtils {
    static addVideos(sampleNames) {
        for (let i in sampleNames) {
            let sampleName = sampleNames[i];
            let mediaPlayer = dashjs.MediaPlayer().create();
            mediaPlayer.getDebug().setLogToBrowserConsole(false);
            let vid = $("<video autoplay hidden muted loop class='mpd-video' id='vid-" + sampleName + "'/>");
            $("#visualisation-screen").append(vid);
            mediaPlayer.initialize(document.querySelector("#vid-" + sampleName),
                DashUtils.sampleNameToPath(sampleName), true);
        }
    }

    static sampleNameToPath(sampleName) {
        return DashUtils.videoDir + sampleName + "/" + sampleName + ".mpd";
    }
}
DashUtils.videoDir = "res/vids/";