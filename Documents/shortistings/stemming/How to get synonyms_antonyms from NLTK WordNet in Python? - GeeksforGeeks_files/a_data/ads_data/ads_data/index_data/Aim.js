var amplY = 18;
//
var aSpeed = 2 * Math.PI / 180;
//
function drawAim(picObj)
{
	var ctx = picObj.canvas.getContext('2d');
	//
	ctx.save();
	ctx.translate(picObj.x, picObj.y + amplY * Math.sin(picObj.ang));
	//
	var r1 = w / 2;
	var r2 = Math.sqrt(w*w + h*h) + 20;
	//
	if(picObj.alpha > 0.99)
	{
		picObj.alpha = 1;
	}
	else if(picObj.alpha < 0.01)
	{
		picObj.alpha = 0;
	}
	//
	var g = ctx.createRadialGradient(0, 0, r1, 0, 0, r2);
	g.addColorStop(0,   "rgba(0, 0, 0, 0)");
	g.addColorStop(0.04, "rgba(0, 0, 0, " + 0.6 * picObj.alpha  + ")");
	ctx.fillStyle = g;
	//
	ctx.beginPath();
	ctx.fillRect(- r2, - r2, r2 * 2, r2 * 2);
	//
	ctx.beginPath();
	ctx.moveTo( - 6 * r1 / 7, 0);
	ctx.lineTo( - r1 / 7, 0);
	ctx.moveTo( 6 * r1 / 7, 0);
	ctx.lineTo( r1 / 7, 0);
	//
	var i = 0;
	//
	for(i = 0; i < 3; i++)
	{
		ctx.moveTo( - 6 * r1 / 7 + i * r1 / 3.5,           0);
		ctx.lineTo( - 6 * r1 / 7 + i * r1 / 3.5,         -10);
		ctx.moveTo(   6 * r1 / 7 - i * r1 / 3.5,           0);
		ctx.lineTo(   6 * r1 / 7 - i * r1 / 3.5,         -10);
		ctx.moveTo( - 6 * r1 / 7 + i * r1 / 3.5 + r1 / 7,  0);
		ctx.lineTo( - 6 * r1 / 7 + i * r1 / 3.5 + r1 / 7, -5);
		ctx.moveTo(   6 * r1 / 7 - i * r1 / 3.5 - r1 / 7,  0);
		ctx.lineTo(   6 * r1 / 7 - i * r1 / 3.5 - r1 / 7, -5);
	}
	//
	ctx.strokeStyle = "rgba(255, 255, 255, " + picObj.alpha + ")";
	ctx.lineWidth = 1;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.stroke();
	//
	if(picObj.alpha2 > 0.99)
	{
		picObj.alpha2 = 1;
	}
	else if(picObj.alpha2 < 0.01)
	{
		picObj.alpha2 = 0;
	}
	//
	ctx.beginPath();
	ctx.arc(0, 0, 10, radian(20), radian(70));
	if(img_cam.isShoot === true)
	{
		ctx.strokeStyle = "rgba(255, 50, 15, " + picObj.alpha2 + ")";
	}
	else
	{
		ctx.strokeStyle = "rgba(35, 225, 10, " + picObj.alpha2 + ")";
	}
	ctx.lineWidth = 2;
	ctx.stroke();
	//
	ctx.beginPath();
	ctx.arc(0, 0, 10, radian(110), radian(160));
	if(img_cam.isShoot === true)
	{
		ctx.strokeStyle = "rgba(255, 50, 15, " + picObj.alpha2 + ")";
	}
	else
	{
		ctx.strokeStyle = "rgba(35, 225, 10, " + picObj.alpha2 + ")";
	}
	ctx.lineWidth = 2;
	ctx.stroke();
	//
	ctx.beginPath();
	ctx.arc(0, 0, 10, radian(200), radian(250));
	if(img_cam.isShoot === true)
	{
		ctx.strokeStyle = "rgba(255, 50, 15, " + picObj.alpha2 + ")";
	}
	else
	{
		ctx.strokeStyle = "rgba(35, 225, 10, " + picObj.alpha2 + ")";
	}
	ctx.lineWidth = 2;
	ctx.stroke();
	//
	ctx.beginPath();
	ctx.arc(0, 0, 10, radian(290), radian(340));
	if(img_cam.isShoot === true)
	{
		ctx.strokeStyle = "rgba(255, 50, 15, " + picObj.alpha2 + ")";
	}
	else
	{
		ctx.strokeStyle = "rgba(35, 225, 10, " + picObj.alpha2 + ")";
	}
	ctx.lineWidth = 2;
	ctx.stroke();
	//
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(-4, 4);
	ctx.moveTo(0, 0);
	ctx.lineTo(4, 4);
	ctx.strokeStyle = "rgba(255, 255, 255, " + 0.7 * picObj.alpha2 + ")";
	ctx.lineWidth = 2;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.stroke();
	//
	ctx.restore();
	//
	picObj.ang += aSpeed;
}