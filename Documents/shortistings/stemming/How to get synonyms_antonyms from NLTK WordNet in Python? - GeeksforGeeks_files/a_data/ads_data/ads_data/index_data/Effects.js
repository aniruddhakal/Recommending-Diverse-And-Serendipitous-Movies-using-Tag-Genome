var bullArray = [];
var bullTraceArray = [];
//
function addBullet(start_x, start_y, fin_x, fin_y)
{
	var bullObj = {};
	bullObj.sx = start_x;
	bullObj.sy = start_y;
	bullObj.fx = fin_x;
	bullObj.fy = fin_y;
	bullObj.is = 1;
	bullObj.alpha = 1;
	bullObj.tr_alpha = 1;
	bullObj.bullTrCount = 0;
	bullObj.bullTrCountMax = 2;
	bullObj.canvas = canvasMain;
	bullArray.push(bullObj);
}

//
function addBulletTracer(start_x, start_y, _alpha)
{
	var bullTrObj = {};
	bullTrObj.x = start_x;
	bullTrObj.y = start_y;
	bullTrObj.alpha = _alpha;
	bullTrObj.aSpd = 0.0001;
	bullTrObj.canvas = canvasMain;
	bullTraceArray.push(bullTrObj);
}

//
function drawBullet(bullObj)
{
	var mainScale = img_water.scale / 1.5;
	//
	bullObj.tr_alpha *= 0.985;
	//
	//bullObj.bullTrCount ++;
	//if(bullObj.bullTrCount >= bullObj.bullTrCountMax)
	//{
		//bullObj.bullTrCount = 0;
		addBulletTracer(bullObj.sx -2 + Math.random() * 4, bullObj.sy, bullObj.tr_alpha);
	//}
	//
	var ctx = bullObj.canvas.getContext('2d');
	//
	ctx.save();
	//
	var dX = bullObj.fx - bullObj.sx;
	var dY = bullObj.fy - bullObj.sy;
	//
	var xSpeed;
	var ySpeed;
	//
	if(Math.abs(dX) > 3 && Math.abs(dY) > 3)
	{
		xSpeed = dX / 20;
		bullObj.sx += xSpeed;
		//
		ySpeed = dY / 10;
		bullObj.sy += ySpeed;
	}
	//
	if(Math.abs(dX) < 3 && Math.abs(dY) > 3)
	{
		ySpeed = dY / 10;
		bullObj.sy += ySpeed;
	}
	//
	if(Math.abs(dX) > 3 && Math.abs(dY) < 3)
	{
		xSpeed = dX / 20;
		bullObj.sx += xSpeed;
	}
	//
	if(Math.abs(dX) < 3 && Math.abs(dY) < 3)
	{
		bullObj.is = 0;
		//
		if(bullObj.fy > horizLine + img_ship.y - 2)
		{
			if(bullObj.fx < 30 && bullObj.fy < horizLine + img_island.y - 1)
			{
				//
			}
			else
			{
				var splashScaleKoef = (bullObj.fy - horizLine) / (h - horizLine);
				addExpSplash(bullObj.fx, bullObj.fy, 1.2 + splashScaleKoef * 2);
			}
		}
	}
	//
	ctx.translate(bullObj.sx, bullObj.sy);

	//
	ctx.beginPath();
	ctx.fillStyle = "rgba(255, 220, 20, 0.95)";
	ctx.arc(0, 0, 3 * bullObj.tr_alpha, 0, 2 * Math.PI, false);
	ctx.fill();
	//
	ctx.restore();
}

//
function drawBulletTracer(bullTracer)
{
	var ctx = bullTracer.canvas.getContext('2d');
	//
	ctx.save();
	//
	if(bullTracer.alpha > bullTracer.aSpd)
	{
		bullTracer.alpha -= bullTracer.aSpd;
	}
	else
	{
		bullTracer.alpha = 0;
	}
	//
	bullTracer.aSpd *= 1.12;
	ctx.globalAlpha = bullTracer.alpha;
	//
	ctx.translate(bullTracer.x, bullTracer.y);
	//
	var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 4 * bullTracer.alpha);
	g.addColorStop(0, "rgba(250, 250, 210, 0.35)");
	g.addColorStop(1, "rgba(250, 250, 210, 0)");
	//
	ctx.beginPath();
	ctx.fillStyle = g;
	ctx.arc(0, 0, 4 * bullTracer.alpha, 0, 2 * Math.PI, false);
	ctx.fill();
	//
	bullTracer.scale *= 0.992;
	//
	ctx.restore();
}

//
function checkFinBullet()
{
	if(bullArray.length === 1)
	{
		img_cam.isShoot = false;
		//
		if(overFl === false)
		{
			mOut(null);
		}
		//
		if(icoText === 0 && shipLifes > 0)
		{
			bannerState = "result";
			//
			img_plate.height = 98;
			plTxtNum = 3;
			//
			goResult();
		}
		//
		if(shipLifes <= 0)
		{
			bannerState = "result";
			//
			img_plate.height = 66;
			plTxtNum = 2;
			//
									  addExp(  img_ship.x - Math.random() * img_ship.pic.width / 3 - img_ship.pic.width / 3 + 70, -10 + Math.random() * 5, 0.5 + Math.random() * 0.3);
			TweenMax.delayedCall(0.1, addExp, [img_ship.x - Math.random() * img_ship.pic.width / 3 - img_ship.pic.width / 3 + 70, -10 + Math.random() * 5, 0.5 + Math.random() * 0.3]);
			TweenMax.delayedCall(0.3, addExp, [img_ship.x - Math.random() * img_ship.pic.width / 3 - img_ship.pic.width / 3 + 70, -10 + Math.random() * 5, 0.5 + Math.random() * 0.3]);
			TweenMax.delayedCall(0.5, addExp, [img_ship.x - Math.random() * img_ship.pic.width / 3 - img_ship.pic.width / 3 + 70, -10 + Math.random() * 5, 0.5 + Math.random() * 0.3]);
			TweenMax.delayedCall(0.6, addExp, [img_ship.x - Math.random() * img_ship.pic.width / 3 - img_ship.pic.width / 3 + 70, -10 + Math.random() * 5, 0.5 + Math.random() * 0.3]);
			TweenMax.delayedCall(0.9, addExp, [img_ship.x - Math.random() * img_ship.pic.width / 3 - img_ship.pic.width / 3 + 70, -10 + Math.random() * 5, 0.5 + Math.random() * 0.3]);
			//
			goResult();
		}
	}
}

//
var smokes = [];
var smokeName = 0;
var smokeCount = 0;
var smokeCountMax = 6;

// Smoke Class
function Smoke (xPos, yPos, sName, _scale, _alpha, _speed)
{
	this._x = xPos + 2 * Math.random() - 1;
	this._y = yPos + 6 * Math.random() - 3;

	//
	var scale = _scale + 0.2 * Math.random();
	this._xScale = scale;
	this._yScale = scale;

	//
	this._alpha = _alpha + 0.3 * Math.random();

	//
	this._name = sName;

	//
	this._sSpeed = _speed + 0.3 * Math.random();

	//
	this._ang = 360 * Math.random();
}

//
Smoke.prototype.update = function(sObj, num)
{
	this._sSpeed *= 0.998;
	//
	this._x -= this._sSpeed / 3;
	this._y -= this._sSpeed;
	//
	if(this._xScale < 1.4)
	{
		this._xScale *= (1.011 + 0.03 * Math.random());
		this._yScale *= (1.011 + 0.03 * Math.random());
	}
	//
	this._alpha -= 0.004 + 0.004 * Math.random();
	//
	if(this._alpha < 0)
	{
		smokes.splice(num, 1);
	}
	else
	{
		this._draw(sObj);
	}
}

// Name
Smoke.prototype.getName = function()
{
	return this._name;
}

//
Smoke.prototype._draw = function(sObj)
{
	var ctx = sObj.canvas.getContext("2d");
	//
	ctx.save();
	ctx.translate(this._x, this._y);
	ctx.rotate(radian(this._ang));
	ctx.scale(this._xScale, this._yScale);
	ctx.globalAlpha = this._alpha;
	//
	ctx.fillStyle = "red";
	//ctx.fillRect(- sObj.pic.width / 2, - sObj.pic.height / 2, sObj.pic.width, sObj.pic.height)
	ctx.drawImage(sObj.pic, - sObj.pic.width / 2,  - sObj.pic.height / 2, sObj.pic.width, sObj.pic.height);
	//
	ctx.restore();
}

//
function addSmoke(xPos, yPos, scale, alpha, speed)
{
	var smoke = new Smoke(xPos, yPos, smokeName, scale, alpha, speed);
	//
	smokes.push(smoke);
	//
	smokeName ++;
	//
	if(smokeName === 100)
	{
		smokeName = 0;
	}
}

//
function drawWaterSlice(sliceHeight, sliceY, ph)
{
	var nCanvas = document.createElement("CANVAS");		
	var w = img_water.pic.width;
	var h = img_water.pic.height;
	w *= 2;
	nCanvas.width = w;
	nCanvas.height = h;		
	//
	var ctx = nCanvas.getContext('2d');
	ctx.save();
	//
	if(waterMapArray.length > 0)
	{
		var tpgr = ctx.createLinearGradient(0, 0, 0, sliceHeight);
		tpgr.addColorStop(0, "rgba(0, 0, 0, 0)");	
		tpgr.addColorStop(0.4, "rgba(0, 0, 0, 1)");		
		//
		ctx.fillStyle = tpgr;
		ctx.fillRect(0, 3, w, h);
		ctx.globalCompositeOperation = "source-in";
		ctx.translate(0, -sliceY);
	}
	//
	var pattern = ctx.createPattern(img_water.pic, 'repeat-x');
	ctx.fillStyle = pattern;
	ctx.fillRect(0, 0, w, h);	
	//
	var sliceObj  = {};			
	sliceObj.pic = nCanvas;
	sliceObj.x = 0;
	sliceObj.y = sliceY;
	sliceObj.h = sliceHeight;
	sliceObj.k = ph;	
	//
	waterMapArray.push(sliceObj);		
}

//
function drawWater(picObj)
{
	var ctx = picObj.canvas.getContext("2d");
	ctx.save();
	ctx.translate(w / 2, - horizLine);
	//
	for(var i = 0; i < waterMapArray.length; i++)
	{
		waterMapArray[i].x -= waterMapArray[i].k * 0.2 * picObj.scale;
		waterMapArray[i].x  = waterMapArray[i].x % picObj.pic.width;
		ctx.drawImage(waterMapArray[i].pic, waterMapArray[i].x - w, waterMapArray[i].y + picObj.y);		
	}
	//
	ctx.restore();
}

//
function addFire(x, y, scale, alpha)
{
	var obj = {};	
	obj.x = x;
	obj.y = y;
	obj.sScale = scale + Math.random() * 0.8;
	obj.dScale = 0;
	obj.scale = 0;
	obj.alpha = scale;
	obj.rotate = Math.random() * 5;
	fireArray.push(obj);
}

//
var expSplashArray = [];
var expArray = [];

//
function addExpSplash(x,y, scale)
{	
	var obj = {};
	obj.x = x;
	obj.y = y;
	obj.scale = 0.2;
	obj.mScale = scale;
	obj.spd = scale;
	expSplashArray.push(obj);	
}

function addExp(x,y,scale)
{
	var i=0;
	var eObj = {};
	eObj.smokeArray = new Array();
	eObj.fireArray = new Array();
	eObj.sparkArray = new Array();
	eObj.x = x;
	eObj.y = y;
	eObj.scale = scale;
	for(i=0;i<3;i++)
	{
		var obj = {};
		obj.x = 0;
		obj.y = 0;
		obj.scale = 0;
		obj.sScale = 0.6+Math.random()*0.6;
		obj.dScale = 0;
		obj.ang = Math.random()*5;
		obj.sDist =10+Math.random()*10;
		obj.dist = 0;
		obj.alpha = 0.7+Math.random()*0.6;
		eObj.smokeArray.push(obj)
	}
	for(i=0;i<4;i++)
	{
		var obj = {};
		obj.x = 0;
		obj.y = 0;
		obj.scale = 0;
		obj.sScale = 0.4+Math.random()*0.6;
		obj.dScale = 0;
		obj.ang = Math.random()*5;
		obj.sDist =6+Math.random()*10;
		obj.dist = 0;
		obj.speed = 5+Math.random()*8;
		obj.alpha = 1+Math.random();
		eObj.fireArray.push(obj)
	}
	for(i=0;i<30;i++)
	{
		var obj = {};
		obj.ang = -120+Math.random()*60;
		obj.x = 0;
		obj.y = 20;
		obj.fx = 0;
		obj.fy = 20;
		obj.color = parseInt(Math.random()*30)+180;
		obj.scale = 0.4+Math.random()*0.8;
		obj.alpha = 1+Math.random();
		obj.dist = Math.random()*80+20;
		obj.length = 0;
		eObj.sparkArray.push(obj);
	}		
	expArray.push(eObj);
}

function drawExpSplash(ctx)
{
	for(var i=0; i<expSplashArray.length;i++)
	{
		expSplashArray[i].scale  += (2 - expSplashArray[i].scale)  / 10;
		expSplashArray[i].mScale +=    - expSplashArray[i].mScale  / 20;
		expSplashArray[i].x -= 0.5 * expSplashArray[i].spd;
		
		//
		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.translate(expSplashArray[i].x, expSplashArray[i].y);
		ctx.scale(expSplashArray[i].scale * expSplashArray[i].mScale / 2, expSplashArray[i].scale * expSplashArray[i].mScale);
		ctx.drawImage(img_splash.pic, -10, -16);
		ctx.restore();
		
		//
		ctx.save();
		ctx.globalAlpha = 0.3;
		ctx.translate(expSplashArray[i].x, expSplashArray[i].y + 3);
		ctx.scale(expSplashArray[i].scale * expSplashArray[i].mScale * 0.8 / 1.5, expSplashArray[i].scale * expSplashArray[i].mScale * 0.8);
		ctx.drawImage(img_splash.pic,-10, -12);
		ctx.restore();
		
		//
		if(expSplashArray[i].mScale < 0.1)
		{
			expSplashArray.splice(i,1);
			i--;
		}
	}	
}

function drawExp(ctx)
{
	for(var i=0;i<expArray.length;i++)
	{
		expArray[i].x-= shipSpeed + 0.1;
		expArray[i].y-= 0.2;
		ctx.save();
		ctx.translate(expArray[i].x,expArray[i].y);
		ctx.scale(expArray[i].scale,expArray[i].scale);
		var sArray = expArray[i].smokeArray;
		var fArray = expArray[i].fireArray;
		var sparkArray = expArray[i].sparkArray;
	//	console.log(sArray.length)
		for(var s=0;s<sArray.length;s++)
		{
			sArray[s].scale+=(sArray[s].sScale-sArray[s].scale)/15;
			sArray[s].dScale +=0.01;
			sArray[s].dist+=(sArray[s].sDist-sArray[s].dist)/10;
			sArray[s].x = Math.cos(sArray[s].ang)*sArray[s].dist;
			sArray[s].y = Math.sin(sArray[s].ang)*sArray[s].dist;
			//sArray[s].alpha +=(0-sArray[s].alpha)/50;
			sArray[s].alpha -=0.01;
			ctx.save();			
			ctx.translate(sArray[s].x,sArray[s].y);
			ctx.scale(sArray[s].scale+sArray[s].dScale,sArray[s].scale+sArray[s].dScale);
			ctx.globalAlpha = sArray[s].alpha;
			ctx.rotate(sArray[s].ang);
			ctx.drawImage(img_smoke.pic,-30,-23);
			ctx.restore();
			if(sArray[s].alpha<0.01)
			{
				sArray.splice(s,1);
				s--;
			}
		}
		for(var f=0;f<fArray.length;f++)
		{
			fArray[f].scale+=(fArray[f].sScale-fArray[f].scale)/8;
			fArray[f].dScale +=0.01;
			fArray[f].dist+=(fArray[f].sDist-fArray[f].dist)/10;
			fArray[f].x = Math.cos(fArray[f].ang)*fArray[f].dist;
			fArray[f].y = Math.sin(fArray[f].ang)*fArray[f].dist;
			fArray[f].alpha +=(0-fArray[f].alpha)/fArray[f].speed;
			//fArray[f].ang+=fArray[f].dAng;
			ctx.save();			
			ctx.translate(fArray[f].x,fArray[f].y);
			ctx.scale(fArray[f].scale+fArray[f].dScale,fArray[f].scale+fArray[f].dScale);
			ctx.globalAlpha = fArray[f].alpha;
			ctx.rotate(fArray[f].ang);
			ctx.drawImage(img_exp.pic,-30,-23);
			ctx.restore();
			if(fArray[f].alpha<0.02)
			{
				fArray.splice(f,1);
				f--;
			}
		}
		for(var sp=0;sp<sparkArray.length;sp++)
		{
			ctx.save();
				sparkArray[sp].length = sparkArray[sp].length+(sparkArray[sp].dist-sparkArray[sp].length)/15;
				sparkArray[sp].x = Math.cos(sparkArray[sp].ang*Math.PI/180)*sparkArray[sp].length;
				sparkArray[sp].y = Math.sin(sparkArray[sp].ang*Math.PI/180)*sparkArray[sp].length;
				sparkArray[sp].fy += 0.9*sparkArray[sp].scale;
				sparkArray[sp].fx -= 0.1;
				sparkArray[sp].alpha -=0.04;
				ctx.fillStyle = "rgba(255, " + sparkArray[sp].color +", 60, " + sparkArray[sp].alpha +")"
				ctx.fillRect(sparkArray[sp].x+sparkArray[sp].fx,sparkArray[sp].y+sparkArray[sp].fy,sparkArray[sp].scale,sparkArray[sp].scale);
				if(sparkArray[sp].alpha<0)
				{
					sparkArray.splice(sp,1);
					sp--;
				}
			ctx.restore();
		}
		ctx.restore();
		if(sArray.length==0&&fArray.length==0&&sparkArray.length==0)
		{
			expArray.splice(i,1);
			i--;
		}
	}
	
}
