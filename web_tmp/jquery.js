$(document).ready(function() {
	$("#addButton").click(function() {
		for (var i = 0; i < 16; i++) {
			$("#loop-panel").append("<div class=\"sample\"></div>")
		}
		for (var i = 0; i < 4; i++) {
			$("#track-panel").append("<div class=\"sample\"></div>")
		}

		for (var i = 0; i < 4; i++) {
			$("#effect-panel").append("<div class=\"sample\"></div>")
		}
	});
});
