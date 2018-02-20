$(document).ready(function() {
	$("#my-button").click(function() {
		for (var i = 0; i < 16; i++) {
			$(".frame-container").append("<div class=\"sample\"></div>")
		}
    });
});
