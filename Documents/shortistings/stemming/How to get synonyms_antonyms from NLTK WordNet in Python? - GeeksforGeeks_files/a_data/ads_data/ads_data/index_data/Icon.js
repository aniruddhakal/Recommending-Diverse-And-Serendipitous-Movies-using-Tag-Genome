function drawIcon(picObj)
{
	var ctx = picObj.canvas.getContext('2d');
	//
	ctx.save();
	ctx.translate(picObj.x, picObj.y + img_cam.camDY / 2);
	//
	ctx.beginPath();
	//
	ctx.moveTo(28,-28);
	ctx.lineTo(-28,-28);
	ctx.lineTo(-28,28);
	ctx.lineTo(-11,28);
	ctx.lineTo(-11,46);
	ctx.lineTo(10.8,46);
	ctx.lineTo(10.8,28);
	ctx.lineTo(28,28);
	ctx.lineTo(28,-28);
	//
	ctx.shadowColor = "rgba(119, 230, 197, 0.75)";
	ctx.shadowBlur = 4;
	ctx.fillStyle = "rgb(119, 230, 197)";
	ctx.fill();
	//
	ctx.beginPath();
	//
	ctx.moveTo(28,-28);
	ctx.lineTo(-28,-28);
	ctx.lineTo(-28,28);
	ctx.lineTo(-11,28);
	ctx.lineTo(-11,46);
	ctx.lineTo(10.8,46);
	ctx.lineTo(10.8,28);
	ctx.lineTo(28,28);
	ctx.lineTo(28,-28);
	//
	ctx.translate(-28, -28);
	//
	var pattern = ctx.createPattern(picObj.pic, 'repeat');
	ctx.fillStyle = pattern;
	ctx.fill();
	//
	drawIcoText(ctx);
	//
	ctx.restore();
}