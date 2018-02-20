$(document).ready(function() {
	$("#add-button").click(function() {
		for (var i = 0; i < 16; i++) {
			$("#loop-panel").append("<div class=\"sample\"></div>")
		}
		$("#track-panel").append("<div class=\"track-info\"><button id=\"remove-button\" class=\"remove-button\">x</button></div>")
		for (var i = 0; i < 3; i++) {
			$("#effect-panel").append("<div class=\"effect\"></div>")
		}
	});
});
