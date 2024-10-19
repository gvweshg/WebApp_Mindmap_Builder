//***************************************************************************************//
//
//	Draw node curve lines
//	Created By Giryong Jong. 1/5/2015
//
//***************************************************************************************//

var classCurve		= function()
{ 
	var main		= this;

	main.parent 	= null;

	main.color 		= "black";
	main.width 		= 10;

	main.init 		= function(parent)
	{
		main.parent = parent;
	}

	main.drawCurve 	 	= function(canvas, pos1, pos2)
	{
		var context 	= canvas.getContext("2d");
		var parent 		= $(canvas).parent();

		var cLeft 		= Math.min(pos1.x, pos2.x);
		var cTop 		= Math.min(pos1.y, pos2.y);

		var cWidth 		= Math.abs(pos1.x - pos2.x);
		var cHeight 	= Math.abs(pos1.y - pos2.y) + main.width;

		var x0 			= pos1.x - cLeft;
		var x1 			= x0 + (pos2.x - pos1.x) / 3;
		var x2 			= x0 + (pos2.x - pos1.x) / 3 * 2;
		var x3 			= pos2.x - cLeft;

		var y0 			= pos1.y > pos2.y ? cHeight - main.width / 2  : main.width / 2;
		var y1 			= y0;
		var y2 			= pos2.y > pos1.y ? cHeight - main.width / 2  : main.width / 2;
		var y3 			= y2;

		$(canvas).css({"top"  	: cTop  - parent.position().top });
		$(canvas).css({"left" 	: cLeft - parent.position().left});

		$(canvas).css({"width"  : cWidth});
		$(canvas).css({"height" : cHeight});

		$(canvas).attr("width", cWidth);
		$(canvas).attr("height",cHeight);

		context.clearRect(0, 0, cWidth, cHeight);
		context.beginPath();
		context.moveTo(x0, y0);
		context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
		context.lineWidth 	= main.width;
		context.strokeStyle = main.color;
		context.stroke();
	}

	main.cloneCurve 	= function(canvas)
	{
		var srcCanvas 	= document.getElementById("creator-canvas");
		var tarCanvas 	= document.getElementById("tmp-canv");

		var srcContext 	= srcCanvas.getContext("2d");
		var tarContext 	= tarCanvas.getContext("2d");

		var clsWidth 	= $("#creator-canvas").width();
		var clsHeight 	= $("#creator-canvas").height();

		tarContext.drawImage(srcCanvas, 0, 0);
		srcContext.clearRect(0, 0, clsWidth, clsHeight);
	}

	main.getRandomColor  = function()
	{
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';

		for (var i = 0; i < 6; i++ )
		{
			color += letters[Math.floor(Math.random() * 16)];
		}

		return color;
	}
}
