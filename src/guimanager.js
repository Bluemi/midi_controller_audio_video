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
		let removeButton = $("<button id=\"remove-button\" class=\"remove-button\">x</button>");
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

        let trackPanel = $("<div class=\"track-info\"></div>");
        let max = 0;
        $(".track-info").each(function() {
            max = Math.max(this.id, max);
        });
		trackPanel.attr("id", "track-info-"+this.yPos);
        trackPanel.append(removeButton);
        $("#track-panel").append(trackPanel);
		for (let i = 0; i < 3; i++) {
            let effect = $("<div class=\"effect\"></div>");
            effect.data("yPos", this.yPos);
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
