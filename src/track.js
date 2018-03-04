class Track {
	constructor(title, buffer) {
        	this.title = title;
			this.ticks = [];
			this.sample = {};
			for (let i = 0; i < Track.numberOfTicks; i++) {
				this.ticks.push(false);
			}
        	this.buffer = buffer;
			this.sources = [];
			this.effect_state = [0, 0, 0];
			this.muted = false;
			this.solod = false;

			this.volume = 1;
			this.volumeNode = undefined;

			this.delaySizeNode = undefined;
			this.delaySize = 0;
			this.delayValueNode = undefined;
			this.delayValue = 0;
			this.biquadFilterNode = undefined;
			this.biquadFilterFrequency = 0;
			this.reverbGainNode = undefined;
			this.reverbGain = 0;
    	}

	effect_clicked(x, value) {
		//console.log("effect_clicked(): x = " + x + "; value = " + value);
		if (value == 0) {
			this.effect_state[x] = 0;
			switch (x) {
				// Delay
				case 0:
					this.setDelaySize(0);
					this.setDelayValue(0);
					break;
				// BiquadFilter
				case 1:
					this.setBiquadFilterFrequency(20000);
					break;
				// Hall
				case 2:
					this.setReverbValue(0);
					break;
				default:
					console.log("unknown x: " + x);
					break;
			}
		} else {
			this.effect_state[x] = 1;
			switch (x) {
				// Delay
				case 0:
					this.setDelaySize(value * 0.75);
					this.setDelayValue(0.2 + value*0.6);
					break;
				// BiquadFilter
				case 1:
					this.setBiquadFilterFrequency(value * 1000);
					break;
				// Hall
				case 2:
					this.setReverbValue(value * 0.03);
					break;
				default:
					console.log("unknown x: " + x);
					break;
			}
		}
	}

	mute() {
		this.muted = !this.muted;
	}

	solo() {
		this.solod = !this.solod;
	}

	setVolume(value) {
		this.volume = value;
		if (! ((typeof this.volumeNode) === "undefined")) {
			this.volumeNode.gain.value = value;
		}
	}

	setDelaySize(value) {
		this.delaySize = value;
		if (! ((typeof this.delaySizeNode) === "undefined")) {
			this.delaySizeNode.gain.value = value;
		} else {
			console.log("NOOOO");
		}
	}

	setDelayValue(value) {
		this.delayValue = value;
		if (! ((typeof this.delayValueNode) === "undefined")) {
			this.delayValueNode.gain.value = value;
		}
	}

	setBiquadFilterFrequency(value) {
		this.biquadFilterFrequency = value;
		if (! ((typeof this.biquadFilterNode) === "undefined")) {
			this.biquadFilterNode.frequency.value = value;
		}
	}

	setReverbValue(value) {
		this.reverbGain = value;
		if (! ((typeof this.reverbGainNode) === "undefined")) {
			this.reverbGainNode.gain.value = value;
		}
	}
}

Track.numberOfTicks = 16;
