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
                div = $(div).addClass("addableSample z-depth-1");
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
		$("#play-button").removeAttr("disabled");
        $("#loop-button").removeAttr("disabled");
        $("#stop-button").removeAttr("disabled");

		const player = this.player;
		for (let i = 0; i < Track.numberOfTicks; i++) {
			let tick = $(`<div class="sample" id="cell-${this.yPos}-${i}"></div>`);
			tick.data("yPos", this.yPos);
			tick.data("xPos", i);
			tick.data("enabled", false);
			tick.css("cursor", "pointer");
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
		let removeButton = $("<div id=\"remove-button\" class=\"track-info-button\"><p class=\"track-info-button-content material-icons blue-grey z-depth-1\">delete</p></div>");
		removeButton.data("yPos", this.yPos);
		removeButton.click(onRemoveClick);

        function onRemoveClick() {

            const y = $(this).data("yPos");

            player.removeTrack(y);

			// remove samples
            $("[id^='cell-" + y + "-']").remove();

			// remove effects
            $(".effect").filter(function (index, element) {
                return $(element).data("yPos") === y;
            }).remove();

			// remove track panel
            $(this).parent().remove();

            if ($(".track-info").length === 0) {
                $("#play-button").attr("disabled", "");
                $("#loop-button").attr("disabled", "");
                $("#stop-button").attr("disabled", "");
			}
        }

        let trackInfo = $("<div class=\"track-info\"></div>");
        trackInfo.data("yPos", this.yPos);
        let max = 0;
        $(".track-info").each(function() {
            max = Math.max(this.id, max);
        });
		trackInfo.attr("id", "track-info-"+this.yPos);
        trackInfo.append(removeButton);
		$("#track-panel").append(trackInfo);

		// mute button
		let muteButton = $("<div id=\"mute-button\" class=\"track-info-button\"><p class=\"track-info-button-content material-icons blue-grey z-depth-1\">volume_up</p></div>");
		muteButton.data("yPos", this.yPos);
		muteButton.data("muted", false);
		muteButton.click(onMuteClick);

        function onMuteClick() {
            let t = $(this);
            player.muteTrack(t.data("yPos"));
            let muted = !t.data("muted");
            if (muted) {
                t.children("p").text("volume_off");
            } else {
                t.children("p").text("volume_up");
            }
            t.data("muted", muted);
        }

        trackInfo.append(muteButton);

		// solo button
		let volumeDisplay = $("<div class=\"track-info-button\"><p class=\"track-info-button-content blue-grey z-depth-1\">100</p></div>");
		volumeDisplay.data("yPos", this.yPos);
        volumeDisplay.attr("id", "volume-display"+this.yPos);
        volumeDisplay.data("solod", false);
        volumeDisplay.click(onVolumeClick);

        function onVolumeClick() {
            let volume = volumeDisplay.text();
            volume = Math.floor(volume/ 10) * 10 + 10;
            volume = volume > 100 ? 10 : volume;

            let y = volumeDisplay.data("yPos");
            player.tracks[y].setVolume(volume / 127);
            volumeDisplay.children("p").text(volume);
        }

        trackInfo.append(volumeDisplay);

		// effects
		for (let i = 0; i < 3; i++) {
            let effect = $("<div class=\"effect\"></div>");
            effect.data("yPos", this.yPos);
            effect.data("x", i);
			effect.data("value", 0);

			let effectName = "";

			switch (i) {
                case 0:
                    effectName = "delay.svg";
                    break;
                case 1:
                    effectName = "biquad-filter.svg";
                    break;
                case 2:
                    effectName = "reverb.svg";
                    break;
            }

            effect.append($('<img>',{src:'res/effects/' + effectName})).css("padding", "2px");

			effect.click(function() {
				const y = $(this).data("yPos");
				const x = $(this).data("x");

				let value = $(this).data("value");

				// manage enabling
				value = (value + 1) % 4;
				effect_clicked(y, x, value / 3);

				$(this).data("value", value);
				if (value === 0) {
					$(this).css({ background: "#f1f1f1"});
				} else if (value === 1) {
					$(this).css({ background: "#66ccff"});
				} else if (value === 2) {
					$(this).css({ background: "#3399ff"});
				} else if (value === 3) {
					$(this).css({ background: "#0066ff"});
				}
			});
			$("#effect-panel").append(effect);
		}
		this.yPos++;
        addButton.removeClass("scale-in").addClass("scale-out");
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
