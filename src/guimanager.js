class GuiManager {
	constructor(player, samples) {
		this.yPos = 0;
		this.player = player;
		this.samples = samples;
	}

	static addSampleGui() {
		for (let i in samples) {
		    if (samples.hasOwnProperty(i)) {
                let sample = samples[i];
                let div = document.createElement("div");
                div = $(div).addClass("addableSample");
                let input = document.createElement("input");
                input = $(input).attr(
                    { 	id: i,
                        type: "image",
                        src: "res/images/" + sample.title + ".svg",
                        class: "addableSampleButton",
                        onclick: "player.playSample('" + sample.title + "')"
                    });
                div.append(input);
                $("#sample-container").append(div);
            }
        }
	}

	addTrackGui(addButton) {
		const that_player = this.player;
		for (let i = 0; i < 16; i++) {
			let sample= $("<div class=\"sample\" id=\"cell-" + this.yPos + "-" + i + "\"></div>");
			sample.data("yPos", this.yPos);
			sample.data("xPos", i);
			sample.data("enabled", false);
			$("#loop-panel").append(sample);
			$("#cell-" + this.yPos + "-" + i).click(function() {
				$(this).data("enabled", ! $(this).data("enabled"));
				if ($(this).data("enabled")) {
					$(this).css({ background: "red"})
				} else {
					$(this).css({ background: "white"})
				}
				that_player.enableTick($(this).data("yPos"), $(this).data("xPos"));
			});
		}
		let removeButton = $("<div id=\"remove-button\" class=\"track-info-button\"><p class=\"track-info-button-content\">x</p></div>");
		removeButton.data("yPos", this.yPos);
		removeButton.click(function() {

			const y = $(this).data("yPos");

			that_player.removeTrack(y);

			// remove samples
			$("[id^='cell-" + y + "-']").remove();

			// remove effects
			$(".effect").filter(function(index, element) { return $(element).data("yPos") === y; }).remove();

			// remove track panel
			$(this).parent().remove();
		});

		let muteButton = $("<div id=\"mute-button\" class=\"track-info-button\"><p class=\"track-info-button-content\">m</p></div>");
		muteButton.data("yPos", this.yPos);
		muteButton.data("muted", false);
		muteButton.click(function() {
			let t = $(this);
			player.muteTrack(t.data("yPos"));
			let muted = !t.data("muted");
			if (muted) {
				t.css({ background: "#bbbbbb" });
			} else {
				t.css({ background: "#999999" });
			}
			t.data("muted", muted);
		});

        let trackPanel = $("<div class=\"track-info\"></div>");
        trackPanel.append(removeButton);
        trackPanel.append(muteButton);
		$("#track-panel").append(trackPanel);
		for (let i = 0; i < 3; i++) {
            let effect = $("<div class=\"effect\"></div>");
            effect.data("yPos", this.yPos);
            effect.data("x", i);
			effect.data("value", 0);
			effect.click(function() {
				const y = $(this).data("yPos");
				const x = $(this).data("x");
				effect_clicked(y, x);

				let value = $(this).data("value");

				// manage enabling
				value = (value + 1) % 4;
				$(this).data("value", value)
				if (value == 0) {
					$(this).css({ background: "#f1f1f1"});
				} else if (value == 1) {
					$(this).css({ background: "#66ccff"});
				} else if (value == 2) {
					$(this).css({ background: "#3399ff"});
				} else if (value == 3) {
					$(this).css({ background: "#0066ff"});
				}
			});
			$("#effect-panel").append(effect)
		}
		this.yPos++;
		addButton.prop("disabled", true);
		Player.hideAllVids();
	}

	static getRandomLightColor() {
        let letters = '789ABCD'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * letters.length)];
		}
		return color;
	}
}
