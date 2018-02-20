$(document).ready(function() {
	$("#my-button").click(function() {
		for (var i = 0; i < 16; i++) {
			$(".frame-container").append("<div class=\"sample\"></div>")
		}
    });
    for (var j = 0; j < 14; j++){
        // var back = ["#ff0000","blue","gray"];
        var rand = getRandomLightColor();
        $(".sample-container .addableSample #"+j).css("background-color", rand);
	}
});

/*function getRandomColor()
{
    var color = Math.floor(Math.random() * Math.pow(256, 3)).toString(16);
    while(color.length < 6) {
        color = "0" + color;
    }
    return "#" + color;
}*/

function getRandomLightColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}