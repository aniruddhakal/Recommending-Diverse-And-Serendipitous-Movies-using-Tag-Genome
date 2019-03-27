
var wavesImg = {};
function initShip()
{
	wavesImg.penaCanvas = document.createElement("CANVAS");	
	wavesImg.penaCanvas.width = 270;
	wavesImg.penaCanvas.height = 100;
	wavesImg.penaCTX  = wavesImg.penaCanvas.getContext("2d");
	wavesImg.penaArray = new Array();
	wavesImg.penaArray.push(new newPena(0, 50, radian(-90), 0.8, 0, 1.4));
	wavesImg.penaArray.push(new newPena(0, 50, radian(-90), 0.8, 60, 1.4));		
	wavesImg.penaArray.push(new newPena(0, 50, radian(-90), 0.8, 90, 1.4));		
	
	shipImg.destroyMask = document.createElement("CANVAS");
	shipImg.destroyMask.width = images.ship.width;
	shipImg.destroyMask.height = 49;
	var ctx = shipImg.destroyMask.getContext("2d");
	var g = ctx.createRadialGradient(16, -8, 5, 16, -8, 26);
	g.addColorStop(0,   "rgba(0, 0, 0, 1)");
	g.addColorStop(1, "rgba(0, 0, 0, 0)");
	ctx.fillStyle = g;
	ctx.scale(1, 1);
	ctx.drawImage(images.ship, 0, 0);	
	ctx.globalCompositeOperation = 'source-in';
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";	
	ctx.fillRect(0, 0, images.ship.width, images.ship.height);		
	ctx.globalCompositeOperation = 'source-over';
	
	//canvasInteractive.getContext("2d").drawImage(shipImg.destroyMask, 0, 0);
}
/*
function drawHitPoints()
{
	var ctx = shipImg.destroyMask.getContext("2d");
	ctx.clearRect(0, 0, images.Ship.width, images.Ship.height);
	for(var i = 0; i < shipImg.hitPoints.length; i++)
	{
		var point = shipImg.hitPoints[i];
		ctx.save();			
			var g = ctx.createRadialGradient(point.x, point.y, 5, point.x, point.y, 26);
			g.addColorStop(0,   "rgba(0, 0, 0, 1)");
			g.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, images.Ship.width, images.Ship.height)
		ctx.restore();
	}
	ctx.globalCompositeOperation = 'source-in';
	ctx.drawImage(images.dShip, 0, 0);		
	ctx.globalCompositeOperation = 'source-over';
}*/


function drawShip(ctx)
{
	shipImg.dx += shipImg.speed;
	ctx.save();
		ctx.translate(shipImg.x + shipImg.dx, shipImg.y);
		ctx.scale(shipImg.scale, shipImg.scale);
		
		shipImg.smokeTimer ++;
		if(!shipImg.destroy)
		{
			if(shipImg.smokeTimer % 6 == 0)
			{
				shipImg.smokeTimer = 0;
				addSmoke(-5, -18, 0.6, shipImg.smokeArray);			
			}
		}
		else
		{
			if(shipImg.smokeTimer == 3)
			{
				addSmoke(10+Math.random()*30, -2, 0.9, shipImg.smokeArray);	
			}
			if(shipImg.smokeTimer % 6 == 0)
			{
				shipImg.smokeTimer = 0;
				addSmoke(-70+Math.random()*40, -2, 0.9, shipImg.smokeArray);			
			}
		}
		for(var i = 0; i < shipImg.smokeArray.length; i++)
		{
			var smoke = shipImg.smokeArray[i];
			smoke.x += 1 - smoke.mult/2;
			smoke.y -= 0.5 * smoke.mult;
			smoke.mult += (smoke.sMult - smoke.mult)/40;
			smoke.scale += (smoke.sScale-smoke.scale)/6;
			smoke.sScale += 0.008;
			smoke.alpha -= 0.01;
			ctx.save();
				ctx.translate(smoke.x, smoke.y);
				ctx.scale(smoke.scale, smoke.scale);
				ctx.rotate(smoke.rotation);
				ctx.globalAlpha = trueAlpha(smoke.alpha);
				ctx.drawImage(expImg.smoke, -20, -20);
			ctx.restore();
			if(smoke.alpha < 0.01)
			{
				shipImg.smokeArray.splice(i, 1);
				i--;
			}
		}		
		
		ctx.drawImage(images.ship, -104, -49);
		if(shipImg.destroy)
		{
			ctx.drawImage(shipImg.destroyMask, -104, -49);
		}
	ctx.restore();
}

function shipHitTest(x, y)
{
	var ctx = canvasMain.getContext('2d');
	
	ctx.save();
		ctx.translate(cam.x+cam.dx, cam.y+cam.dy);
		ctx.scale(cam.scale+cam.dScale, cam.scale+cam.dScale);
		ctx.rotate(cam.rotate);
		
		ctx.save();
			ctx.translate(shipImg.x + shipImg.dx, shipImg.y);
			ctx.scale(shipImg.scale, shipImg.scale);
			ctx.translate(-2, -22);			
			shipImg.shape.draw(ctx);					
		ctx.restore();
	//	ctx.fillStyle = "#000000";
	//	ctx.fill();
	ctx.restore();
	if(ctx.isPointInPath(x, y))
		{				
			return true;
		}
		else
		{
			return false;
		}
}

function drawPackshotShip(ctx)
{
	pShipImg.ang += pShipImg.dAng;
	pShipImg.y = pShipImg.sy + Math.sin(pShipImg.ang)*3;
	ctx.save();
		ctx.translate(pShipImg.x, pShipImg.y);
		ctx.scale(pShipImg.scale, pShipImg.scale);
		ctx.drawImage(images.packshot, -160, -140);
		
		
		for(var i = 0; i < pShipImg.penaArray.length; i++)
		{
			var pena = pShipImg.penaArray[i];
			ctx.save();
				ctx.translate(pena.x, pena.y);
				ctx.rotate(pena.rotation);
				ctx.scale(pena.scaleX, pena.scaleY);
				ctx.drawImage(wavesImg.penaCanvas, 0, -50);
			ctx.restore();
		}
		
		for(var i = 0; i < pShipImg.fWavesArray.length; i++)
		{
			drawFWave(ctx, pShipImg.fWavesArray[i]);
		}
		if(!isStopAnim)
		{
			wavesImg.penaCTX.clearRect(0, 0, wavesImg.penaCanvas.width, wavesImg.penaCanvas.height)
			for(var i = 0; i < wavesImg.penaArray.length; i++)
			{
				drawPena(wavesImg.penaCTX, wavesImg.penaArray[i]);
			}
		}
	ctx.restore();
}

function drawFWave(ctx, wave)
{

	ctx.save();
		ctx.translate(wave.x, wave.y);
		ctx.rotate(wave.ang);
		ctx.scale(wave.scale, wave.scale);
		ctx.globalAlpha = trueAlpha(wave.alpha);
		ctx.drawImage(images.fPena, -76, -25);
		
	ctx.restore();
}

function newPena(x, y, rotation, sScale, ang, scaleY)
{
	ang = typeof ang !== 'undefined' ? ang : 0;
	scaleY = typeof scaleY !== 'undefined' ? scaleY : 1;
	this.x = x;
	this.y = y;
	this.sx = x;
	this.sy = y;
	this.dy = 0;
	this.scale = 1.6;	
	this.alpha = 0;	
	this.scaleY = scaleY;
	
	
	this.ang = ang;
	this.sScale = sScale+Math.random()*0.4*sScale;
	this.speed = this.sScale/4;	
	//this.scaleMult = 1+Math.random()*0.4;	
	/*if(Math.random() > 0.5)
	{
		//this.scaleMult = -1;	
	}*/
	this.rotation = rotation;	
}

function drawPena(ctx, pena)
{
	pena.ang += 2;
	if(pena.ang>180)
	{
		pena.ang-=180;	
		pena.x = pena.sx;
		pena.y =  pena.sy;
		pena.dy = 0;
		//pena.scaleMult = 1+Math.random()*0.4;
		if(Math.random() > 0.5)
		{
			//pena.scaleMult = -1;	
		}
		//arr.unshift(arr[2]);
		//arr.splice(arr.length-1,1);		
	}
	pena.x =pena.sx + Math.sin(radian(pena.ang/2))*30-8;
	pena.dy += 0.1;
	
	pena.scale = 0.3+Math.sin(radian(pena.ang/2))*0.9;
	pena.alpha = Math.sin(radian(pena.ang));
	ctx.save();
		ctx.translate(pena.x, pena.y);		
		ctx.rotate(pena.rotation);
		ctx.scale(pena.scale * pena.sScale, pena.scale * pena.sScale * pena.scaleY);
		ctx.globalAlpha = trueAlpha(pena.alpha);
		ctx.drawImage(images.pena,-13,0+pena.dy);
	ctx.restore();
}


function addSmoke(x, y, scale, smokeArray)
{
	var smoke = {};
	smoke.x = x;
	smoke.y = y;
	smoke.mult = 1 + Math.random()*1;
	smoke.sMult = 0.6;
	smoke.rotation = Math.random()*6;
	smoke.scale = 0;
	smoke.sScale = scale * (0.2+Math.random()*0.6);
	smoke.alpha = 0.6+Math.random()*0.4;
	smokeArray.push(smoke);
}

function shipExpAnim()
{
	
	TweenMax.killDelayedCallsTo(addShipShot1);
	TweenMax.killDelayedCallsTo(addShipShot2);
	TweenMax.killDelayedCallsTo(addShipShot3);
	TweenMax.killDelayedCallsTo(addShipShot4);
	hideAimImg();
	
	TweenMax.to(shipImg, 2, {speed: 0, ease:Power1.easeOut});
	
	//point.x = (bullet.x - cam.x)/cam.scale - (shipImg.x+shipImg.dx)/shipImg.scale + 134;
	//point.y = (bullet.y - cam.y)/cam.scale - (shipImg.y)/shipImg.scale + 73;
	
	var x = shipImg.x+shipImg.dx;	
	var y = shipImg.y + 4;	
	addExp(x-50,y,0.6,shipExpArray,2,0,0);	
	TweenMax.delayedCall(0.06, addExp, [x+60,y,0.66,shipExpArray,2,0,0]);	
	TweenMax.delayedCall(0.1, addExp, [x,y,0.86,shipExpArray,3,0,0]);
	
	/*TweenMax.to(islandLImg, 3, {scale: 0.6, y:36, x:-80, ease:Expo.easeOut});
	TweenMax.to(islandRImg, 3, {scale: 0.89, x:190, ease:Expo.easeOut});
	TweenMax.to(skyImg, 3, {scale: 0.86, ease:Expo.easeOut});
	TweenMax.to(shipImg, 3, {scale: 0.6, y:34,  ease:Expo.easeOut});
	TweenMax.fromTo(waterImg, 1.5, { speedZ: 50 }, { speedZ: 0, scale:0.9, ease: Expo.easeOut });*/
	
	
}
