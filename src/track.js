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
    	}
}

Track.numberOfTicks = 16;
