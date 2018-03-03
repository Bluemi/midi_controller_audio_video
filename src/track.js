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
    	}

	effect_clicked(x) {
		this.effect_state[x] = (this.effect_state[x] + 1) % 4;
	}

	mute() {
		this.muted = !this.muted;
	}

	solo() {
		this.solod = !this.solod;
	}
}

Track.numberOfTicks = 16;
