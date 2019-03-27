/* -------------------------------------------------------------------------------------
--------------                        WARGAMING.NET                       --------------
----------------------------------------------------------------------------------------
--------------                 © 2017 ALL RIGHTS RESERVED                 --------------
--------------------------------------------------------------------------------------*/
var bSparksArray = new Array();
var fSparksArray = new Array();
var sparkFluc = 24;

function addSparks()
{
	
	addSpark(Math.random()*30-15,Math.random()*20+16, 1.3, bSparksArray, images.bSpark);
	addSpark(Math.random()*30-15,Math.random()*20+16, 4.4, bSparksArray, images.bSpark);
	addSpark(Math.random()*100-50,Math.random()*20-16,  1.3, fSparksArray, images.fSpark);
	addSpark(Math.random()*100-50,Math.random()*20-16, 4.4, fSparksArray, images.fSpark);
		
}




function addSpark(x, y, ang, array, pic)
{
	var obj = {};
	obj.x = x;
	obj.y = y;
	obj.scale = 0.5+Math.random()*1.2;
	obj.sAng = ang;
	obj.dAng = 0;
	obj.ddAng = 0;
	obj.dddAng = Math.random()*0.04-0.02;
	obj.dddAng *= 0.4;
	obj.sAng = ang+Math.random()*0.4-0.2;
	obj.sAlpha = 2+Math.random()*3.5;
	obj.alpha = -1;
	obj.speed = 6+Math.random()*4;
	obj.speedAng = 10+Math.random()*30;
	obj.speed *= 0.8;
	obj.speedAng *= 1.3;
	obj.pic = pic;
	//obj.scale *= 1.5;
	obj.turnTime = Math.random()*-30+8;
	array.push(obj);
}

function drawSparks(ctx, array)
{
	for(var i=0; i<array.length;i++)
	{
		var sp = array[i];
		sp.turnTime += 0.3;
		var rr = trueAlpha(sp.turnTime)*-2.5+1;
		sp.alpha += (sp.sAlpha - sp.alpha)/30;
		
		sp.ddAng += (sp.dddAng*rr-sp.ddAng)/sp.speedAng;
		sp.dAng += sp.ddAng;
		//sp.dddAng += Math.sin(sp.speed-3)/900;
		sp.speed *= 0.975;
		sp.speed +=0.02;
		sp.sAlpha -= 0.05;
		sp.x += Math.sin(sp.sAng+Math.sin(sp.dAng)*9)*sp.speed;
		sp.y -= Math.cos(sp.sAng+Math.sin(sp.dAng)*9)*sp.speed;
		sp.ang = sp.sAng;
		ctx.save();
			ctx.translate(sp.x, sp.y);
			ctx.rotate(sp.sAng+Math.sin(sp.dAng)*9) 
			ctx.scale(sp.scale, sp.scale);
			ctx.globalAlpha = trueAlpha(sp.alpha);
			ctx.drawImage(sp.pic , -4, -4);
		ctx.restore();
		if(trueAlpha(sp.sAlpha)==0&&trueAlpha(sp.alpha)==0)
		{
			array.splice(i, 1);
			i--;
		}
	}
}