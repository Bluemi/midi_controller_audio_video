class DashUtils {
    static addVideos(samples) {
        for (let i in samples) {
            if (samples.hasOwnProperty(i)) {
                let sampleName = samples[i].title;
                let mediaPlayer = dashjs.MediaPlayer().create();
                mediaPlayer.getDebug().setLogToBrowserConsole(false);
                let vid = $("<video autoplay hidden muted class='mpd-video' id='vid-" + sampleName + "'></video>");
                $("#visualisation-screen").append(vid);
                mediaPlayer.initialize(document.querySelector("#vid-" + sampleName),
                    DashUtils.sampleNameToPath(sampleName), true);
            }
        }
    }

    static sampleNameToPath(sampleName) {
        return DashUtils.videoDir + sampleName + "/" + sampleName + ".mpd";
    }
}
DashUtils.videoDir = "res/vids/";