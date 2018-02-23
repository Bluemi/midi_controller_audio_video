const INTERVAL = 0.2;
const OFFSET = 0.1;

class Player {
	constructor(context, sampleNames) {
        this.context = context;
        this.sampleNames = sampleNames;
		this.bufferManager = {};
		this.tracks = {};
		this.activeSample = "";
		this.loopInterval = 0;
		this.yPos = 0;
	}

    static idToSample(id) {
        switch (id) {
            case 1:
                return "snare";
            case 2:
                return "kick";
            case 3:
                return "hihat_open";
            default:
                return "";

        }
    }

	loadSampleBuffer(url, name) {
		let request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		let _player = this;

		// Decode asynchronously
		request.onload = function() {
			_player.context.decodeAudioData(request.response, function(buffer) {
				_player.bufferManager[name] = buffer;

			}, function(e) {alert("error: " + e)});
		};
		request.send();
	}	// note: on older systems, may have to use deprecated noteOn(time);

    addTrack() {
        this.tracks[this.yPos] = new Track(this.activeSample, this.bufferManager[this.activeSample]);
		this.activeSample = "";
        this.yPos++;
    }

    removeTrack(y) {
        delete this.tracks[y]
    }

	enableTick(y, x) {
		this.tracks[y].ticks[x] = !this.tracks[y].ticks[x];
	}

    play() {
        let t = this.context.currentTime + OFFSET;
        for (let k in this.tracks) {
            let track = this.tracks[k];
            for (let tick = 0; tick < track.ticks.length; tick++) {
				// initiate source
                let source = this.context.createBufferSource();
                source.buffer = track.buffer;

				// dry
                source.connect(this.context.destination);

				// Delay -------------------------------------------------
				// delay size
				let delay_size = this.context.createGain();
				delay_size.gain.value = 0.4;

				// delay
				let delay = this.context.createDelay();
				delay.delayTime.value = 0.4;

				// delay value
				let delay_value = this.context.createGain();
				delay_value.gain.value = 0.0;

				// connect delay
				source.connect(delay_size);
				delay_size.connect(delay);
				delay.connect(delay_size);
				delay.connect(delay_value);
				delay_value.connect(this.context.destination);

				// Biquad Filter -----------------------------------------
				let analyser = this.context.createAnalyser();
				let gainNode = this.context.createGain();
				let biquadFilter = this.context.createBiquadFilter();
				//let convolver = this.context.createConvolver();

				// connect
				source.connect(analyser);
				analyser.connect(biquadFilter);
				biquadFilter.connect(gainNode);
				gainNode.connect(this.context.destination);

				biquadFilter.type = "lowpass";
				biquadFilter.frequency.value = 5000;
				biquadFilter.gain.value = 1;

				gainNode.gain.value = 0.0;

				// Reverb ------------------------------------------------
				let reverb_gain = this.context.createGain();
				let reverb = this.context.createConvolver();

				// connect
				source.connect(reverb_gain);
				reverb_gain.connect(reverb);
				reverb.connect(this.context.destination);

				reverb_gain.gain.value = 10.0;
				//reverb.normalize = false;

				// start track
                if (track.ticks[tick] > 0) {
                    source.start(t + tick*INTERVAL);
                }
            }
        }
    }

    // todo add a single playSample function
    playSample(sampleName) {
        let source = this.context.createBufferSource();
        source.buffer = this.bufferManager[sampleName];
        source.connect(this.context.destination);
        source.start(this.context.currentTime);
        this.activeSample = sampleName;
        $("#add-button").prop("disabled", false);
        Player.hideAllVids();
        $("#vid-" + sampleName).show();
    }

    static hideAllVids() {
        $("[id^='vid-']").hide();
    }

    loop() {
		this.play();

		// wait for loop
		let loopTime = 0;
		for (let j = 0; j < Track.numberOfTicks; j++) {
			loopTime += INTERVAL;
		}
		let that = this;
		this.loopInterval = setInterval(function() { that.play() }, loopTime * 1000)
	}

	stop() {
		clearInterval(this.loopInterval);
	}
}
