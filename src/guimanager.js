class GuiManager {
	constructor(player, samples) {
		this.yPos = 0;
		this.player = player;
		this.samples = samples;
	}

	addSamplePanel() {
		for (let i in this.samples) {
		    if (this.samples.hasOwnProperty(i)) {
                let sample = this.samples[i];
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

	addTrackPanelColumn(addButton) {
		const player = this.player;
		for (let i = 0; i < Track.numberOfTicks; i++) {
			let tick = $(`<div class="sample" id="cell-${this.yPos}-${i}"></div>`);
			tick.data("yPos", this.yPos);
			tick.data("xPos", i);
			tick.data("enabled", false);
			$("#loop-panel").append(tick);
			$("#cell-" + this.yPos + "-" + i).click(onCellClick);

			// find sample with player.activeSample as name
			let sample = samples.find(s => s.title === player.activeSample);

            function onCellClick() {
                $(this).data("enabled", !$(this).data("enabled"));
                if ($(this).data("enabled")) {
                    $(this).css({background: sample.color})
                } else {
                    $(this).css({background: "#f1f1f1"})
                }
                player.enableTick($(this).data("yPos"), $(this).data("xPos"));
            }
        }
		let removeButton = $("<div id=\"remove-button\" class=\"track-info-button\"><p class=\"track-info-button-content\">x</p></div>");
		removeButton.data("yPos", this.yPos);
		removeButton.click(function() {

			const y = $(this).data("yPos");

			player.removeTrack(y);

			// remove samples
			$("[id^='cell-" + y + "-']").remove();

			// remove effects
			$(".effect").filter(function(index, element) { return $(element).data("yPos") === y; }).remove();

			// remove track panel
			$(this).parent().remove();
		});

        let trackInfo = $("<div class=\"track-info\"></div>");
        trackInfo.append(removeButton);
		$("#track-panel").append(trackInfo);

		// mute button
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

        trackInfo.append(muteButton);

		// solo button
		let soloButton = $("<div id=\"solo-button\" class=\"track-info-button\"><p class=\"track-info-button-content\">s</p></div>");
		soloButton.data("yPos", this.yPos);
		soloButton.data("solod", false);
		soloButton.click(function() {
			let t = $(this);
			player.soloTrack(t.data("yPos"));
			let solod = !t.data("solod");
			if (solod) {
				t.css({ background: "#bbbbbb" });
			} else {
				t.css({ background: "#999999" });
			}
			t.data("solod", solod);
		});

        trackInfo.append(soloButton);

		// effects
		for (let i = 0; i < 3; i++) {
            let effect = $("<div class=\"effect\"></div>");
            effect.data("yPos", this.yPos);
            effect.data("x", i);
			effect.data("value", 0);
			effect.click(function() {
				const y = $(this).data("yPos");
				const x = $(this).data("x");

				let value = $(this).data("value");

				// manage enabling
				value = (value + 1) % 4;

				effect_clicked(y, x, value / 3);

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
