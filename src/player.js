const INTERVAL = 0.2;
const OFFSET = 0.1;

class Player {
	constructor(context, samples) {
        this.context = context;
        this.bufferManager = {};
        this.tracks = {};
        this.samples = samples;
        this.activeSample = "";
        this.loopInterval = 0;
        this.irHall = 0;
        this.yPos = 0;

        for (let i in samples) {
        	if (samples.hasOwnProperty(i)) {
                let sample = samples[i];
                this.loadSampleBuffer("res/samples/" + sample.title + ".mp3", sample.title);
            }
		}

        // load irHall
        let request = new XMLHttpRequest();
        request.open('GET', "res/effects/irHall.ogg", true);
        request.responseType = 'arraybuffer';

        let _player = this;

        // Decode asynchronously
        request.onload = function() {
            _player.context.decodeAudioData(request.response, function(buffer) {
                _player.irHall = buffer;

            }, function(e) {alert("error: " + e)});
        };
        request.send();
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

	create_audio_nodes() {
        for (let k in this.tracks) {
            let track = this.tracks[k];
			// initiate source
			track.sources = [];
			for (let t in track.ticks) {
				let source = this.context.createBufferSource();
				source.buffer = track.buffer;
				track.sources.push(source);
			}

			// Delay -------------------------------------------------
			// create
			let delay_size = this.context.createGain();
			let delay = this.context.createDelay();
			let delay_value = this.context.createGain();

			// settings
			delay_size.gain.value = 0.4; // size
			delay.delayTime.value = 0.3; // time
			delay_value.gain.value = 0.5; // mix

			// connect
			delay_size.connect(delay);
			delay.connect(delay_size);
			delay.connect(delay_value);
			delay_value.connect(this.context.destination);

			// Biquad Filter -----------------------------------------
			// create
			let gainNode = this.context.createGain();
			let biquadFilter = this.context.createBiquadFilter();

			// settings
			biquadFilter.type = "lowpass"; // type
			biquadFilter.frequency.value = 5000; // frequency
			biquadFilter.gain.value = 1; // gain value
			gainNode.gain.value = 0.3; // mix

			// connect
			biquadFilter.connect(gainNode);
			gainNode.connect(this.context.destination);

			// Reverb --------------------------------------------
			// create
			let reverb = this.context.createConvolver();
			reverb.buffer = this.irHall;
			let reverb_gain = this.context.createGain();

			// settings
			reverb_gain.gain.value = 0.5; // mix

			reverb.connect(reverb_gain);
			reverb_gain.connect(this.context.destination);

			// connect sources
			for (let s in track.sources) {
				let src = track.sources[s];

				// Delay
				src.connect(delay_size);

				// Dry
				src.connect(this.context.destination);

				// Biquad Filter
				src.connect(biquadFilter);

				// Reverb
				src.connect(reverb);
			}
        }
	}

    // todo add a single playSample function
    playSample(sampleName) {
        let source = this.context.createBufferSource();
        source.buffer = this.bufferManager[sampleName];
        source.connect(this.context.destination);
        let sample = this.samples.find(function(s) {
            if (s.title === sampleName)
                return s;
        });
        source.start(this.context.currentTime + sample.delay);
        this.activeSample = sampleName;
        $("#add-button").prop("disabled", false);
        Player.hideAllVids();
        let vid = $("#vid-" + sampleName);
        vid.show();
        vid = document.getElementById('vid-' + sampleName);
        vid.currentTime = 0;
        vid.play();
    }

    play() {
        let t = this.context.currentTime + OFFSET;
		this.create_audio_nodes();
        for (let k in this.tracks) {
            let track = this.tracks[k];
            for (let tick = 0; tick < track.ticks.length; tick++) {
				// start track
                if (track.ticks[tick] > 0) {
                    track.sources[tick].start(t + tick*INTERVAL);
                }
            }
        }
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
