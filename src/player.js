const INTERVAL = 0.2;
const OFFSET = 0.1;
let currentColor = "#333";

class Player {
	constructor(context, samples, analyser) {
        this.context = context;
        this.samples = samples;
        this.analyser = analyser;
        this.bufferManager = {};
        this.tracks = {};
        this.activeSample = "";
        this.loopInterval = 0;
        this.yPos = 0;
		this.static_reverb = context.createConvolver();
		this.lastPlayStartTime = 0;
		this.highlightTickTimeouts = [];
		this.isPlaying = false;

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
				_player.static_reverb.buffer = buffer;
            }, function(e) {alert("error: " + e)});
        };
        request.send();
        this.initializeAudioAnalyzer(context, analyser);
        this.visualizeAudio();
    }

    initializeAudioAnalyzer(context, analyser) {
        this.analyser.connect(context.destination);
        analyser.fftSize = 2048;
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

	effect_clicked(y, x, value) {
		this.tracks[y].effect_clicked(x, value);
	}

    addTrack() {
        this.tracks[this.yPos] = new Track(this.activeSample, this.bufferManager[this.activeSample]);
        this.tracks[this.yPos].sample = samples.find(s => s.title === this.activeSample);
		this.activeSample = "";
        this.yPos++;
    }

    removeTrack(y) {
        delete this.tracks[y]
    }

	enableTick(y, x) {
		let track = this.tracks[y];
		track.ticks[x] = !track.ticks[x];

		// add
		if (track.ticks[x] === true) {
			if (! (this.lastPlayStartTime === 0)) {
				let startTime = this.lastPlayStartTime + x * INTERVAL;
				if (startTime > this.context.currentTime) {
					// create source
					let source = this.context.createBufferSource();
					source.buffer = track.buffer;

					// add to track.sources
					track.sources[x] = source;

					// add to system
					// Dry
					source.connect(track.volumeNode);
					// Delay
					source.connect(track.delaySizeNode);
					// Biquad Filter
					source.connect(track.biquadFilterNode);
					// Reverb
					source.connect(track.reverbGainNode);

                    source.start(startTime);
				}
			}
		} else { // remove
			if (! (this.lastPlayStartTime === 0)) {
				let startTime = this.lastPlayStartTime + x * INTERVAL;
				if (startTime > this.context.currentTime) {
					// stop source
					let source = track.sources[x];
					track.sources[x] = undefined;
					source.stop();
				}
			}
		}
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

			// Volume ------------------------------------------------
			// create
			let volume = this.context.createGain();

			// set track nodes
			track.volumeNode = volume;

			// settings
			if (track.muted) {
				volume.gain.value = 0;
			} else  {
				volume.gain.value = track.volume;
			}

			// connect
			volume.connect(this.analyser);

			// Delay -------------------------------------------------
			// create
			let delay_size = 0;
			delay_size = this.context.createGain();
			let delay = this.context.createDelay();
			let delay_value = this.context.createGain();

			// set track nodes
			track.delaySizeNode = delay_size;
			track.delayValueNode = delay_value;

			// settings
			delay_size.gain.value = track.delaySize; // size
			delay.delayTime.value = 0.3; // time
			delay_value.gain.value = track.delayValue; // mix

			// connect
			delay_size.connect(delay);
			delay.connect(delay_size);
			delay.connect(delay_value);
			delay_value.connect(volume);

			// Biquad Filter -----------------------------------------
			// create
			let biquadFilter = 0;
			let gainNode = this.context.createGain();
			biquadFilter = this.context.createBiquadFilter();

			// set track nodes
			track.biquadFilterNode = biquadFilter;

			// settings
			biquadFilter.type = "lowpass"; // type
			biquadFilter.frequency.value = track.biquadFilterFrequency; // frequency
			biquadFilter.gain.value = 1; // gain value
			gainNode.gain.value = 0.8; // mix

			// connect
			biquadFilter.connect(gainNode);
			gainNode.connect(volume);

			// Reverb --------------------------------------------
			// create
			let reverb_gain = this.context.createGain();

			// settings
			reverb_gain.gain.value = track.reverbGain; // mix

			// set track nodes
			track.reverbGainNode = reverb_gain;

			// connect
			reverb_gain.connect(this.static_reverb);
			this.static_reverb.connect(volume);

			// connect sources
			for (let s in track.sources) {
				let src = track.sources[s];

				// Dry
				src.connect(volume);

				// Delay
				src.connect(delay_size);

				// Biquad Filter
				src.connect(biquadFilter);

				// Reverb
				src.connect(reverb_gain);
			}
        }
	}

	playSample(sampleName) {
        $("#audio-visualization-canvas").hide();
        $("#add-button").addClass("scale-in").removeClass("scale-out");

        let source = this.context.createBufferSource();
        source.buffer = this.bufferManager[sampleName];
        source.connect(this.context.destination);
        let sample = this.samples.find(function(s) {
            if (s.title === sampleName)
                return s;
        });
        source.start(this.context.currentTime + sample.delay);
        this.activeSample = sampleName;
        Player.hideAllVids();
        let vid = $("#vid-" + sampleName);
        vid.show();
        vid = document.getElementById('vid-' + sampleName);
        vid.currentTime = 0;
        vid.play();

        vid.onended = function () {
			$(vid).hide();
            if (!$(".mpd-video").is(":visible"))
                $("#audio-visualization-canvas").show();
        }
    }

	startPlay() {
		if (this.isPlaying) {
			return;
		}
		this.isPlaying = true;
		this.play();
		let _player = this;
        setTimeout(function () {
        	_player.isPlaying = false;
        }, (OFFSET + Track.numberOfTicks * INTERVAL) * 1000);
	}

	startLoop() {
		if (this.isPlaying) {
			return
		}
		this.isPlaying = true;
		this.loop()
	}

    play() {
        let t = this.context.currentTime + OFFSET;
		this.lastPlayStartTime = t;
        this.create_audio_nodes();

		// look for solo tracks
		let has_solo_tracks = false;
        for (let k in this.tracks) {
			if (this.tracks[k].solod) {
				has_solo_tracks = true;
				break;
			}
		}

        for (let k in this.tracks) {
            let track = this.tracks[k];
			if (has_solo_tracks && !track.solod) {
				continue;
			}
            for (let tick = 0; tick < track.ticks.length; tick++) {
				// start track
                if (track.ticks[tick] > 0) {
                    track.sources[tick].start(t + tick * INTERVAL);
                }
            }
        }

        for (let l = 0; l < Track.numberOfTicks; l++) {
            let isNewTick = true;
            for (let m in this.tracks) {
                let track = this.tracks[m];
                setTimeout(function () {
                    if (track.ticks[l] === true) {
                        currentColor = ColorTools.mergeColor(currentColor, track.sample.color);
                        isNewTick = false;
                    } else if (isNewTick === true){
                        currentColor = "#333";
                    }
                }, (OFFSET + l * INTERVAL) * 1000);
            }
        }

        setTimeout(function () {
            currentColor = "#333";
        }, (OFFSET + Track.numberOfTicks * INTERVAL) * 1000);

        this.highlightTicks();
    }

    visualizeAudio() {
        let canvas = document.getElementById('audio-visualization-canvas');
        let context = canvas.getContext('2d');

        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);

        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            context.fillStyle = 'rgb(200, 200, 200)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.lineWidth = 2;
            context.strokeStyle = currentColor;

            context.beginPath();
            let sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {

                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                if (i === 0) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }

                x += sliceWidth;
            }
            context.lineTo(canvas.width, canvas.height / 2);
            context.stroke();
        }

        draw();
	}

    highlightTicks() {
		for (let i = 0; i < Track.numberOfTicks; i++) {
			let timeout = setTimeout(function () {
                $(".sample").css("border", "");
				$("[id^=cell-][id$=-" + i+ "]").css("border", "2px solid #666");
				if (i-1 === Track.numberOfTicks)
                    $("#audio-visualization-canvas").hide();
            }, (i * INTERVAL + OFFSET) * 1000);
			this.highlightTickTimeouts.push(timeout);
        }
        let timeout = setTimeout(function () {
            $(".sample").css("border", "");
			this.highlightTickTimeouts = [];
        }, (Track.numberOfTicks * INTERVAL + OFFSET) * 1000);
    }


    static hideAllVids() {
        $("[id^='vid-']").hide();
    }

    loop() {
		$("#loop-button").addClass("pulse");
	    this.play();

		// wait for loop
		let loopTime = INTERVAL * Track.numberOfTicks;
		let that = this;
		this.loopInterval = setInterval(function() { that.play() }, loopTime * 1000)
	}

	stop() {
        $("#loop-button").removeClass("pulse");
        clearInterval(this.loopInterval);

		for (let i in this.highlightTickTimeouts) {
			let timeout = this.highlightTickTimeouts[i];
			clearTimeout(timeout);
		}

		this.highlightTickTimeouts = [];
		$(".sample").css("border", "");

		// stop audio
		for (let t in this.tracks) {
			let track = this.tracks[t];
			for (let s in track.sources) {
				if (track.ticks[s] === true) {
					let source = track.sources[s];
					source.stop();
				}
			}
		}

		this.isPlaying = false;
	}

	muteTrack(y) {
		this.tracks[y].mute();
	}

	soloTrack(y) {
		this.tracks[y].solo();
	}
}
