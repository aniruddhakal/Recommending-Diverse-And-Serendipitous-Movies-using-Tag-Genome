/* -------------------------------------------------------------------------------------
--------------                        WARGAMING.NET                       --------------
----------------------------------------------------------------------------------------
--------------                 © 2017 ALL RIGHTS RESERVED                 --------------
--------------------------------------------------------------------------------------*/
var bulletArray = new Array();
var splashArray = new Array();

function redButtonClick()
{
	var add = aimImg.y - cam.y - waterImg.y * cam.scale;
	//if(add < 0){add = 0}
	
	if(add < -150){add = -150}
	if(add > 150){add = 150}
	var addHeight = 30 - Math.abs(add)/5;
	addHeight *= cam.scale;
	//console.log(addHeight)
	addBullet(w/2-100, aimImg.y+200*cam.scale, aimImg.x-2, aimImg.y, w/2 + (aimImg.x - w/2)/2 - 30, aimImg.y - addHeight*5, add, false);
	addBullet(w/2+100, aimImg.y+200*cam.scale, aimImg.x+2, aimImg.y, w/2 + (aimImg.x - w/2)/2 + 30, aimImg.y - addHeight*5, add, false);
	camShake();
	
	aimImg.r1 = 100;
	TweenMax.killTweensOf(aimImg, {r1:true});
	TweenMax.to(aimImg, 1.6, {r1: 75,  ease:Expo.easeOut});
	bulletIcon.count --;
	aimImg.reload = 80;
	
	shellsAnim();
}



function addShipShot1()
{	
	addExp(cam.x + cam.dx + (shipImg.x + shipImg.dx - 36) * cam.scale, cam.y + cam.dy + shipImg.y * cam.scale,0.2*cam.scale,gunExpArray,0,0,0);
	addBullet(w/2 + 240, 10, cam.x + cam.dx + (shipImg.x + shipImg.dx - 36) * cam.scale, cam.y + cam.dy + shipImg.y * cam.scale, cam.x + cam.dx + (shipImg.x + shipImg.dx - 36) * cam.scale + 10, h/2 - 70, 0, true);
	TweenMax.delayedCall(0.8, function(){
		TweenMax.to(shipIconImg, 0.2, {hp: 0.75,  ease:Power3.easeOut});
		shipIconImg.text = "1125";
		addCrack(w/2 + 240, -10, 0.82, 1);
		drawCrack();
		camShake();
	});
}

function addShipShot2()
{	
	addExp(cam.x + cam.dx + (shipImg.x + shipImg.dx - 36) * cam.scale, cam.y + cam.dy + shipImg.y * cam.scale,0.2*cam.scale,gunExpArray,0,0,0);
	addBullet(w/2 - 270, h/2 - 40, cam.x + cam.dx + (shipImg.x + shipImg.dx - 36) * cam.scale, cam.y + cam.dy + shipImg.y * cam.scale, cam.x + cam.dx + (shipImg.x + shipImg.dx - 36) * cam.scale - 80, h/2 - 70, 0, true);
	TweenMax.delayedCall(0.8, function(){
		TweenMax.to(shipIconImg, 0.2, {hp: 0.25,  ease:Power3.easeOut});
		shipIconImg.text = "375";		
		addCrack(w/2 - 270, h/2 - 40, 0.68, 0.6);
		drawCrack();
		camShake();
	});
}

function addShipShot3()
{	
	addExp(cam.x + cam.dx + (shipImg.x + shipImg.dx - 36) * cam.scale, cam.y + cam.dy + shipImg.y * cam.scale,0.2*cam.scale,gunExpArray,0,0,0);
	addBullet(w/2-20, h/2+112, cam.x + cam.dx + (shipImg.x + shipImg.dx - 36) * cam.scale, cam.y + cam.dy + shipImg.y * cam.scale, w/2-12, h/2-120, 0, true);
	TweenMax.delayedCall(0.74, function(){
		TweenMax.to(shipIconImg, 0.2, {hp: 0.5,  ease:Power3.easeOut});
		shipIconImg.text = "744";
		addCrack(w/2-20, h/2+40, 0.8, 1);
		drawCrack();
		addExp(w/2-36, h/2+120, 1.9, frontExpArray,0,0,0);
		glitchImg.addColor = 2;
		TweenMax.to(glitchImg, 1.6, {addColor: 0,  ease:Power2.easeOut});
		camShake();
	});
}

function addShipShot4()
{	
	addExp(cam.x + cam.dx + (shipImg.x + shipImg.dx - 36) * cam.scale, cam.y + cam.dy + shipImg.y * cam.scale,0.2*cam.scale,gunExpArray,0,0,0);
	addBullet(w/2 - 10, h/2+70, cam.x + cam.dx + (shipImg.x + shipImg.dx - 36) * cam.scale, cam.y + cam.dy + shipImg.y * cam.scale, w/2-15, h/2-160, 0, true);
	TweenMax.delayedCall(0.74, function(){
		TweenMax.to(shipIconImg, 0.2, {hp: 0.0,  ease:Power3.easeOut});
		shipIconImg.text = "0";
		addCrack(w/2 - 10, h/2, 1, 0.5);
		drawCrack();
		addExp(w/2+30, h/2+100, 1.9, frontExpArray,0,0,0);
		glitchImg.addColor = 2;
		TweenMax.to(glitchImg, 1.6, {addColor: 0,  ease:Power2.easeOut});
		isInteractive = false;
		TweenMax.killDelayedCallsTo(textPlate2Frame2);
		textPlate2.hide();
		TweenMax.delayedCall(1.3, toResult);
		camShake();
	});
}

function addBullet(sx,sy,fx,fy,cx,cy, speed, enemy)
{
	var bullet = {};
	bullet.x = sx;
	bullet.y = sy;
	bullet.ssx = sx;
	bullet.sx = sx;	
	bullet.sy = sy;
	bullet.fx = fx;
	bullet.fy = fy;
	bullet.cx = cx;
	bullet.cy = cy;
	bullet.mult = fx - sx;
	bullet.enemy = enemy;
	if(bullet.enemy)
	{
		bullet.scale = 0;
		bullet.dist = 0.97;
		TweenMax.to(bullet, 0.8, {dist: -0.1, ease:Power1.easeIn});
		
	}
	else
	{
		bullet.scale = 36;
		bullet.dist = 0;
		TweenMax.to(bullet, (150-speed)/150+0.2, {dist: 1, ease:Power2.easeOut});
	}
	
	
	bullet.alpha = 4;
	bullet.hitting = false;
	bullet.tracerArray = new Array();	
	
	
	//bull.speed = 0.5;
	bulletArray.push(bullet);
}

function addBulletTracer(bullet)
{
		var tracer = {};
		//tracer.speed = -(Math.random()*0.01+0.003);
		//tracer.dist = -0.3/9*i;
		tracer.x = bullet.x;
		tracer.y = bullet.y;	
		calculCurv(bullet, bullet.dist-0.02);
		//ctx.lineTo(bullet.x, bullet.y);
		tracer.dAng = Math.random()*0.03 - 0.015;
		tracer.scale = bullet.scale*0.06;
		tracer.sScale = Math.random()*0.4+0.6;
		//console.log(tracer.y - bullet.y)
		tracer.rotation = Math.atan2(tracer.y - bullet.y, tracer.x - bullet.x)+radian(90);//Math.random()*6;
		bullet.tracerArray.push(tracer);
		tracer.alpha = 1+Math.random()*0.5;
}

function calculCurv(obj, dist)
{
	var dx1;
	var dx2;
	var dy1;
	var dy2;
	dx1 = obj.sx+(obj.cx-obj.sx)*dist;
	dx2 = obj.cx+(obj.fx-obj.cx)*dist;
	dy1 = obj.sy+(obj.cy-obj.sy)*dist;
	dy2 = obj.cy+(obj.fy-obj.cy)*dist;
	obj.x = dx1+(dx2-dx1)*dist;
	obj.y = dy1+(dy2-dy1)*dist;
	//return {x:dx1+(dx2-dx1)*dist, y:dy1+(dy2-dy1)*dist};
}



function drawBullet(ctx)
{
	for(i=0;i<bulletArray.length;i++)
	{
		var bullet = bulletArray[i];
		//bulletArray[i].dist += (1-bulletArray[i].dist)/30*bulletArray[i].speed;
		if(bullet.enemy)
		{
			bullet.scale += (36-bullet.scale)/50;
		}
		else
		{
			bullet.scale += (0-bullet.scale)/20;
		}
		
		bullet.alpha += (0-bullet.alpha)/80;
		//bullet.sx+=1.5;
		calculCurv(bullet, bullet.dist);
		
		//bullet.sx = bullet.ssx + bullet.dist*bullet.mult*0.7;
		//bullet.cx = bullet.sx + (bullet.fx - bullet.sx)/2;
		
		ctx.lineWidth = 2;		
		ctx.strokeStyle = "#ffd08c";
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(bullet.sx, bullet.sy);		
		ctx.quadraticCurveTo( bullet.cx, bullet.cy, bullet.fx, bullet.fy);			
		//ctx.stroke();		
		ctx.closePath();
		//ctx.fillStyle = "#ffaf9c";
	//	ctx.fillRect(bullet.x, bullet.y, 10,10);
			

	
		
		
		for(var t = bullet.tracerArray.length-1; t >= 0; t--)
		{
			var tracer = bullet.tracerArray[t];
			
			tracer.alpha -= 0.03;
			tracer.rotation += tracer.dAng;
			tracer.scale += tracer.scale/70;
			//calculCurv(bullet, bullet.dist+tracer.dist);
			ctx.save();
				ctx.translate(tracer.x, tracer.y);
				ctx.scale(tracer.scale*tracer.sScale*cam.scale, tracer.scale*tracer.sScale*cam.scale);
				ctx.rotate(tracer.rotation);
				//ctx.fillStyle = "#ffffff";
				//ctx.fillRect(-2, -2, 4,4);
				ctx.globalAlpha = trueAlpha(tracer.alpha)*0.5;
				ctx.drawImage(images.wSmoke,-8,-8);
			ctx.restore();
			if(tracer.alpha < 0.02)
			{
				bullet.tracerArray.splice(t, 1);				
				//t++;
			}
			if(t==0)
			{
			//console.log(tracer.scale*tracer.sScale)
			}
		}
		
		if(bullet.dist < 0.98 && bullet.dist > -0.01)
		{
			ctx.strokeStyle = "#ffd08c";
			ctx.lineWidth = bullet.scale*0.5*cam.scale;		
			ctx.beginPath();
			ctx.moveTo(bullet.x, bullet.y);
			calculCurv(bullet, bullet.dist-0.01);
			ctx.lineTo(bullet.x, bullet.y);
			ctx.stroke();
			addBulletTracer(bullet);
		}
		
		
		if(bullet.dist > 0.99 && bullet.hitting == false)
		{		
			bullet.hitting = true;
			//bulletArray.splice(i,1);
			//i--;
			var hitting = false;
			if(islandHitTest1(bullet.x, bullet.y))
			{
				hitting = true;				
				addExp(bullet.x,bullet.y,0.3*cam.scale,gunExpArray,0,0,0);
			}
			if(islandHitTest2(bullet.x, bullet.y))
			{
				hitting = true;				
				addExp(bullet.x,bullet.y,0.3*cam.scale,gunExpArray,0,0,0);
			}
			if(shipHitTest(bullet.x, bullet.y) && !hitting)
			{
				hitting = true;				
			/*	var point = {};
				point.x = (bullet.x - cam.x)/cam.scale - (shipImg.x+shipImg.dx)/shipImg.scale + 134;
				point.y = (bullet.y - cam.y)/cam.scale - (shipImg.y)/shipImg.scale + 73;
				shipImg.hitPoints.push(point);
				drawHitPoints();*/
				
				
				shipImg.hitCount++;
				if(shipImg.hitCount > 0)
				{
					shipImg.destroy = true;
					if(isInteractive)
					{					
						isInteractive = false;
						//toPackshot();
						shipExpAnim();
						TweenMax.killDelayedCallsTo(textPlate2Frame2);
						textPlate2.hide();
						TweenMax.delayedCall(1, toResult);						
					}
					addExp(bullet.x,bullet.y,0.2*cam.scale,gunExpArray,0,0,1);
					
				}
				else
				{					
					addExp(bullet.x,bullet.y,0.2*cam.scale,gunExpArray,0,0,1);
				}
				
			}
			if(bullet.y > cam.y + waterImg.y * cam.scale && !hitting)
			{
			
				var sScale = aimImg.y - cam.y - waterImg.y * cam.scale;
				//sScale *= cam.scale;
			
				addSplash(bullet.x, bullet.y, bullet.scale*0.14, 1);
				TweenMax.delayedCall(0.1, addSplash, [bullet.x , bullet.y+2, bullet.scale*0.14, -1]);
				//addSplash(bullet.x, bullet.y, bullet.scale*0.2, -1);
			}
		}
		
		/*if(bullet.dist < -0.05)
		{
			bulletArray.splice(i,1);
			i--;
		}*/
		
		
		
	}
}

function addSplash(x, y, scale, side)
{
	var splash = {};
	splash.x = x;
	splash.y = y;
	splash.dy = 0;
	splash.scale = scale;
	splash.scaleX = 0.16;
	splash.side = side;
	splash.scaleY = 0;
	splash.bScaleY = 1;
	splash.alpha = 1;
	splash.bAlpha = 0.02;
	splash.bScale = 0.0;
	splash.dbScale = 0;
	splashArray.push(splash);
	TweenMax.to(splash, 0.4, {scaleY: 0.7 + Math.random()*0.4, ease:Power2.easeOut});	
	TweenMax.to(splash, 0.5, {delay:0.4 - splash.side/19, scaleY: 0.1, ease:Sine.easeIn});
	TweenMax.to(splash, 0.8, {delay:0.4 - splash.side/19+0.7, alpha: 0, ease:Sine.easeIn});
	TweenMax.to(splash, 0.7, {bScale: 0.3+Math.random()*0.2,  ease:Power2.easeOut});
	TweenMax.to(splash, 0.2, {bAlpha: 1,  ease:Power2.easeOut});
	TweenMax.to(splash, 1, {delay:0.2, bScaleY: 0.5,  ease:Power2.easeIn});
	TweenMax.to(splash, 0.7, {delay:0.4, bAlpha : 0, ease:Power2.easeIn});
	//TweenMax.to(splash, 0.3, {scaleX: 0.6, ease:Power1.easeIn});
}

function drawSplash(ctx)
{
	for(var i = 0; i < splashArray.length; i++)
	{
		var splash = splashArray[i];
		splash.scaleX += 0.01;
	//	splash.dbScale += (0.2 - splash.dbScale)/30;
		ctx.save();
			ctx.translate(splash.x, splash.y+cam.ddy);
			ctx.scale(splash.scale * splash.scaleX * splash.side, splash.scale * splash.scaleY);
			ctx.globalAlpha = trueAlpha(splash.alpha);
			ctx.drawImage(images.tSplash, -45, -116);			
		ctx.restore();
		
	//	splash.dy += splash.scale*0.1;
		ctx.save();
			ctx.translate(splash.x, splash.y + splash.dy-4+cam.ddy);
			ctx.scale((splash.bScale + splash.dbScale)*splash.scale * splash.side, (splash.bScale + splash.dbScale)*splash.scale * splash.bScaleY);
			ctx.globalAlpha = trueAlpha(splash.bAlpha);
			ctx.drawImage(images.bSplash, -77, -70);			
		ctx.restore();
		if(splash.alpha < 0.01)
		{
			splashArray.splice(i, 1);
			i--;
		}
		//}
	}
}


