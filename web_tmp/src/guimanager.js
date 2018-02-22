class GuiManager {
	constructor() {
		this.yPos = 0;
	}

	addTrackGui(addButton) {
		for (let i = 0; i < 16; i++) {
			let sample= $("<div class=\"sample\" id=\"cell-" + this.yPos + "-" + i + "\"></div>")
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
				enableTick($(this).data("yPos"), $(this).data("xPos"));
			});
		}
		let removeButton = $("<button id=\"remove-button\" class=\"remove-button\">x</button>")
		removeButton.data("yPos", this.yPos)
		removeButton.click(function() {

			let y = $(this).data("yPos")

			removeTrack(y)

			// remove samples
			$("[id^='cell-" + y + "-']").remove();

			// remove effects
			$(".effect").filter(function(index, element) { return $(element).data("yPos") == y; }).remove()

			// remove track panel
			$(this).parent().remove();
		});

		var trackPanel = $("<div class=\"track-info\"></div>")
		trackPanel.append(removeButton)
		$("#track-panel").append(trackPanel)
		for (var i = 0; i < 3; i++) {
			var effect = $("<div class=\"effect\"></div>")
			effect.data("yPos", this.yPos)
			$("#effect-panel").append(effect)
		}
		this.yPos++
		addButton.prop("disabled", true)
	}

	getRandomLightColor() {
		var letters = '789ABCD'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * letters.length)];
		}
		return color;
	}
}
