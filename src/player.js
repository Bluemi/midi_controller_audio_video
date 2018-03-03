const INTERVAL = 0.2;
const OFFSET = 0.1;

class Player {
	constructor(context, samples, analyser) {
        this.context = context;
        this.samples = samples;
        this.analyser = analyser;
        this.bufferManager = {};
        this.tracks = {};
        this.activeSample = "";
        this.loopInterval = 0;
        this.irHall = 0;
        this.yPos = 0;
        this.isVideoPlaying = false;

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

	effect_clicked(y, x) {
		this.tracks[y].effect_clicked(x);
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

			// Volume ------------------------------------------------
			// create
			let volume = this.context.createGain();
			track.volumeNode = volume;

			// settings
			volume.gain.value = track.volume;

			// connect
			volume.connect(this.analyser);

			// Delay -------------------------------------------------
			// create
			let delay_size = 0;
			if (track.effect_state[0] > 0) {
				delay_size = this.context.createGain();
				let delay = this.context.createDelay();
				let delay_value = this.context.createGain();

				// settings
				delay_size.gain.value = track.effect_state[0] * 0.25; // size
				delay.delayTime.value = 0.3; // time
				delay_value.gain.value = 0.2 + track.effect_state[0] * 0.1; // mix

				// connect
				delay_size.connect(delay);
				delay.connect(delay_size);
				delay.connect(delay_value);
				delay_value.connect(volume);
			}

			// Biquad Filter -----------------------------------------
			// create
			let biquadFilter = 0;
			if (track.effect_state[1] > 0) {
				let gainNode = this.context.createGain();
				biquadFilter = this.context.createBiquadFilter();

				// settings
				biquadFilter.type = "lowpass"; // type
				biquadFilter.frequency.value = 1000 + track.effect_state[1] * 1000; // frequency
				biquadFilter.gain.value = 1; // gain value
				gainNode.gain.value = 0.8; // mix

				// connect
				biquadFilter.connect(gainNode);
				gainNode.connect(volume);
			}

			// Reverb --------------------------------------------
			// create
			let reverb = 0;
			if (track.effect_state[2] > 0) {
				reverb = this.context.createConvolver();
				reverb.buffer = this.irHall;
				let reverb_gain = this.context.createGain();

				// settings
				reverb_gain.gain.value = 0.25 * track.effect_state[2]; // mix

				reverb.connect(reverb_gain);
				reverb_gain.connect(volume);
			}

			// connect sources
			for (let s in track.sources) {
				let src = track.sources[s];

				// Dry
				src.connect(volume);

				// Delay
				if (track.effect_state[0] > 0) {
					src.connect(delay_size);
				}

				// Biquad Filter
				if (track.effect_state[1] > 0) {
					src.connect(biquadFilter);
				}

				// Reverb
				if (track.effect_state[2] > 0) {
					src.connect(reverb);
				}
			}
        }
	}

	playSample(sampleName) {
        this.isVideoPlaying = true;
        $("#my-canvas").hide();
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

        vid.onended = function (e) {
            $(vid).hide();
            $("#my-canvas").show();
            this.isVideoPlaying = false;
        }
    }

    play() {
	    if (!this.isVideoPlaying)
	        $("#my-canvas").show();
        let t = this.context.currentTime + OFFSET;
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
			if (track.muted) {
				continue;
			}
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

        this.highlightTicks();
    }

    visualizeAudio() {
        let canvas = document.getElementById('my-canvas');
        let context = canvas.getContext('2d');

        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);

        function draw() {
            let drawVisual = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            context.fillStyle = 'rgb(200, 200, 200)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.lineWidth = 2;
            context.strokeStyle = 'rgb(0, 0, 0)';

            context.beginPath();
            let sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;
            for(let i = 0; i < bufferLength; i++) {

                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                if(i === 0) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }

                x += sliceWidth;
            }
            context.lineTo(canvas.width, canvas.height/2);
            context.stroke();
        }

        draw();
	}

    highlightTicks() {
		for (let i = 0; i < Track.numberOfTicks; i++) {
			setTimeout(function () {
                $(".sample").css("border", "");
				$("[id^=cell-][id$=-" + i+ "]").css("border", "2px solid green");
				if (i-1 === Track.numberOfTicks)
                    $("#my-canvas").hide();
            }, (i * INTERVAL + OFFSET) * 1000);
        }
        setTimeout(function () {
            $(".sample").css("border", "");
        }, (Track.numberOfTicks * INTERVAL + OFFSET) * 1000);
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

	muteTrack(y) {
		this.tracks[y].mute();
	}

	soloTrack(y) {
		this.tracks[y].solo();
	}
}
