$(document).ready(function() {
	$("#add-button").click(function() {
		for (var i = 0; i < 16; i++) {
			$("#loop-panel").append("<div class=\"sample\" id=\"cell-" + yPos + "-" + i + "\"></div>")
			$("#cell-" + yPos + "-" + i).click(function() {
				console.log("hey " + $(this).attr('id'))
				$(this).css({ background: "red"})
			});
		}
		var removeButton = $("<button id=\"remove-button\" class=\"remove-button\">x</button>")
		//removeButton.yPos = yPos;
		removeButton.data("yPos", yPos)
		removeButton.click(function() {

			var y = $(this).data("yPos")

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
			effect.data("yPos", yPos)
			$("#effect-panel").append(effect)
		}
		yPos++
	});

	yPos = 0
});
