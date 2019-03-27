//
function drawSky(picObj)
{
	var ctx = picObj.canvas.getContext('2d');
	//
	ctx.save();
	//
	ctx.drawImage(picObj.pic, - picObj.pic.width / 2, - picObj.pic.height);
	//
	ctx.restore();
}