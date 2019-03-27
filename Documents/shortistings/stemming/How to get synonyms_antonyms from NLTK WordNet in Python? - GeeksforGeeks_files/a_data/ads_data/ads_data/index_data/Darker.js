// DRAW FULL BANNER RECTANGLE DARKER
function drawDarker(dObj)
{
	var ctx = dObj.canvas.getContext("2d");
	//
	ctx.save();
	//
	if(dObj.alpha > 0.99)
	{
		dObj.alpha = 1;
	}
	else if(dObj.alpha < 0.01)
	{
		dObj.alpha = 0;
	}
	//
	ctx.fillStyle = "rgba(0, 0, 0, " + dObj.alpha + ")";
	ctx.fillRect(0, 0, w, h);
	//
	ctx.restore();
}