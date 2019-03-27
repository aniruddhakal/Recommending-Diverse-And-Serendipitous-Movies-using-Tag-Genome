var shipSpeed = 0.4;
var shipLifes = 1;

//
var waveX = 0;
var dWX = 1.2;
var nCanvas = document.createElement("CANVAS");		
nCanvas.width = 450;
nCanvas.height = 8;		
var wCtx = nCanvas.getContext('2d');

//
var fireArray = [];
var holes = [];
//
function drawShip(picObj)
{
	var ctx = picObj.canvas.getContext('2d');
	//
	ctx.save();
	//
	ctx.scale(1 / 1.5, 1 / 1.5);

	///// SMOKE
	smokeCount ++;
	//
	if(smokeCount === smokeCountMax)
	{
		smokeCount = 0;
		addSmoke(img_ship.x - 100, -36, 0.5, 0.5, 0.8);
		addSmoke(img_ship.x - 158, -36, 0.5, 0.5, 0.8);
		//
		if(shipLifes < 0.6)
		{
			addSmoke(img_ship.x - Math.random() * img_ship.pic.width / 2 - img_ship.pic.width / 4 + 60, -10, 0.3, 0.4, 0.4);
			addSmoke(img_ship.x - Math.random() * img_ship.pic.width / 2 - img_ship.pic.width / 4 + 60, -10, 0.3, 0.4, 0.4);
		}
		//
		if(shipLifes < 0.2)
		{
			addSmoke(img_ship.x - Math.random() * img_ship.pic.width / 2 - img_ship.pic.width / 4 + 60, -10, 0.3, 0.4, 0.4);
			addSmoke(img_ship.x - Math.random() * img_ship.pic.width / 2 - img_ship.pic.width / 4 + 60, -10, 0.3, 0.4, 0.4);
		}
	}

	//
	for(var j = 0; j < smokes.length; j ++)
	{
		var sLen = smokes.length;
		//
		smokes[j].update(img_smoke , j);
		//
		if(sLen > smokes.length)
		{
			j --;
		}
	}

	///// SHADOW
	var g = ctx.createLinearGradient(- w / 2 + picObj.x- picObj.pic.width, picObj.y,- w / 2 + picObj.x - picObj.pic.width, picObj.y + 8);
	g.addColorStop(1,"rgba(0, 6, 40, 0)");
	g.addColorStop(0,"rgba(0, 2, 20, 0.4)");
	ctx.fillStyle = g;
	ctx.beginPath();
	ctx.moveTo(- w / 2 + picObj.x- picObj.pic.width / 2,       picObj.y);
	ctx.lineTo(- w / 2 + picObj.x- picObj.pic.width / 2 + 391, picObj.y);
	ctx.lineTo(- w / 2 + picObj.x- picObj.pic.width / 2 + 389, picObj.y + 8);
	ctx.lineTo(- w / 2 + picObj.x- picObj.pic.width / 2,       picObj.y + 8);
	ctx.lineTo(- w / 2 + picObj.x- picObj.pic.width / 2,       picObj.y +  0);
	ctx.closePath();
	ctx.fill();
	
	///// SHIP
	ctx.drawImage(picObj.pic, - w / 2 + picObj.x - picObj.pic.width / 2, picObj.y - picObj.pic.height);
	ctx.globalAlpha = (1 - shipLifes) * 0.6;
	ctx.drawImage(picObj.destroyPic, - w / 2 + picObj.x - picObj.pic.width / 2, picObj.y - picObj.pic.height);
	ctx.globalAlpha = 1;

	///// LIFES
	ctx.beginPath();
	//
	if(img_aim.alpha > 0.99)
	{
		img_aim.alpha = 1;
	}
	else if(img_aim.alpha < 0.01)
	{
		img_aim.alpha = 0;
	}
	//
	ctx.fillStyle   = "rgba(255, 50, 15, " + img_aim.alpha + ")";
	ctx.strokeStyle = "rgba( 10, 13, 16, " + img_aim.alpha + ")";
	//
	if(shipLifes < 0)
	{
		shipLifes = 0;
	}
	//
	ctx.beginPath();
	ctx.rect(picObj.x - picObj.pic.width / 2 + 30, - picObj.pic.height + 10, 67 * shipLifes, 5);
    ctx.fill();
    //
    ctx.beginPath();
    ctx.rect(picObj.x - picObj.pic.width / 2 + 30, - picObj.pic.height + 10, 67, 5);
    ctx.stroke();

    ///// HOLES
	for(var j = 0; j < holes.length; j ++)
	{
		var g = ctx.createRadialGradient(holes[j].x, holes[j].y, 0, holes[j].x, holes[j].y, holes[j].rad);
		g.addColorStop(0, "rgba(255, 20, 0, 0.55)");
		g.addColorStop(0.35, "rgba(33, 14, 0, 0.35)");
		g.addColorStop(1, "rgba(155, 66, 20, 0)");
		ctx.beginPath();
		ctx.fillStyle = g;
		ctx.arc(holes[j].x, holes[j].y, holes[j].rad, 0, 2 * Math.PI, false);
		ctx.fill();
		//
		if(shipLifes === 1)
		{
			holes[j].x += shipSpeed;
		}
		else if(shipLifes < 1 && shipLifes > 0.4)
		{
			holes[j].x += shipSpeed / 1.2;
		}
		else
		{
			holes[j].x += shipSpeed / 1.5;
		}
	}

    ///// WAVE
	waveX -= dWX;
	waveX = waveX % img_wave.pic.width;
	//
	wCtx.clearRect(0, 0, 450, 8);
	wCtx.save();
	wCtx.translate(waveX - img_wave.pic.width, 0);
	//
	var	tpgr = wCtx.createLinearGradient(- waveX + img_wave.pic.width + 450, 0, - waveX + img_wave.pic.width, 28);
	tpgr.addColorStop(0.7, "rgba(0, 0, 0, 0.7)");	
	tpgr.addColorStop(0.9,   "rgba(0, 0, 0, 0)");			
	wCtx.fillStyle = tpgr;
	wCtx.beginPath();
	wCtx.rect(- waveX + img_wave.pic.width, 0, 450, 8);
	wCtx.fill();
	wCtx.globalCompositeOperation = "source-in";
	var iPattern = wCtx.createPattern(img_wave.pic, 'repeat-x');	
	wCtx.fillStyle = iPattern;
	wCtx.fillRect(- waveX + img_wave.pic.width, 0, 450, 8);
	var wavePic = nCanvas;
	wCtx.restore();
	//
	img_wave.ang += radian(0.5);
	img_wave.ang = img_wave.ang % Math.PI;
	//
	ctx.drawImage(wavePic, - w / 2 + picObj.x - 255, 0 + 2 * Math.sin(img_wave.ang));

	///////////FIRE
	if(shipLifes < 1)
	{
		addFire(img_ship.x - Math.random() * img_ship.pic.width / 2 - img_ship.pic.width / 4 + 60, -10 + Math.random() * 8, 0.8 * (1 - shipLifes), 0.4 * (1 - shipLifes));
		//
		for(i = 0; i < fireArray.length; i++)
		{
			fireArray[i].y -= fireArray[i].sScale / 2;
			fireArray[i].x -= fireArray[i].sScale / 4;
			fireArray[i].dScale += (fireArray[i].sScale-fireArray[i].dScale) / 8;
			fireArray[i].scale  -= 0.016;
			fireArray[i].alpha  += (0 - fireArray[i].alpha) / 30;
			//
			ctx.save();
			ctx.translate(fireArray[i].x, fireArray[i].y);
			ctx.scale(fireArray[i].scale + fireArray[i].dScale, fireArray[i].scale + fireArray[i].dScale);			
			ctx.rotate(fireArray[i].rotate);		
			ctx.globalAlpha = fireArray[i].alpha;
			ctx.drawImage(img_fire.pic, -7, -10);
			ctx.restore();

			//
			if(fireArray[i].alpha < 0.02)
			{
				fireArray.splice(i,1);
				i--;
			}
		}
	}
	//
	ctx.restore();
}

//
function drawDestroyShip()
{
	var nCanvas = document.createElement("CANVAS");		
	var w = img_ship.pic.width;		
	var h = img_ship.pic.height;		
	nCanvas.width = w;
	nCanvas.height = h;	
	var ctx = nCanvas.getContext('2d');		
	ctx.drawImage(img_ship.pic,0,0);
	ctx.globalCompositeOperation = "source-in";
	ctx.scale(3,1);
	var grd=ctx.createRadialGradient(70,20,5,70,20,110);
	grd.addColorStop(0,"rgba(0, 0, 0, 1)");
	grd.addColorStop(1,"rgba(0, 0, 0, 0)");	
	ctx.fillStyle=grd;	
	ctx.fillRect(0,0,w,h);	
	img_ship.destroyPic = nCanvas;	
}

//
function hitTestShip(bul_x, bul_y)
{
	var isHit = false;
	//
	var shipDX = 9;
	var shipH1 = 11;
	var shipH2 = 18;
	//
	if(bul_x > img_ship.x - img_ship.pic.width / 2 && bul_x < img_ship.x + img_ship.pic.width / 2 && bul_y < horizLine + img_ship.y - 1 && bul_y > horizLine + img_ship.y - shipH2 - 8)
	{
		if(bul_x < 30 && bul_y < horizLine + img_island.y)
		{
			//
		}
		else
		{
			isHit = true;
		}
	}
	//
	return isHit;
}