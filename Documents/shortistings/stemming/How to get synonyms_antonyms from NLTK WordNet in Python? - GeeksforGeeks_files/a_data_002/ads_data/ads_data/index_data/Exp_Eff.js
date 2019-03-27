/* -------------------------------------------------------------------------------------
--------------                        WARGAMING.NET                       --------------
----------------------------------------------------------------------------------------
--------------                 © 2017 ALL RIGHTS RESERVED                 --------------
--------------------------------------------------------------------------------------*/

function drawExpElemets()
{
	var nCanvas = document.createElement("CANVAS");		
	var w = 100;		
	var h = 92;		
	nCanvas.width = w;
	nCanvas.height = h;	
	var ctx = nCanvas.getContext('2d');	
	ctx.drawImage(expImg.exp,0,0);
	try
	{
		var buffer = ctx.getImageData(0, 0, w, h),
		data = buffer.data,
		len = data.length,
		i = 0,
		c = {r:-200, g: -170, b: -170, a:6};
		
		for(i=0; i < len; i += 4) 
		{
			data[i] = data[i] + c.r;
			data[i + 1] = data[i + 1] + c.g;
			data[i + 2] = data[i + 2] + c.b;
			data[i + 3] = data[i + 3] + c.a;
		}
		ctx.putImageData(buffer, 0, 0);		
		var buffer = ctx.getImageData(0, 0, w, h),
		data = buffer.data,
		len = data.length,
		i = 0,
		c = {r:30, g: 20, b: 10, a:0};		
		for(i=0; i < len; i += 4) 
		{
			data[i] = data[i] + c.r;
			data[i + 1] = data[i + 1] + c.g;
			data[i + 2] = data[i + 2] + c.b;
			data[i + 3] = data[i + 3] + c.a;
		}
	ctx.putImageData(buffer, 0, 0);
	}catch(e){}		
	expImg.bExp = nCanvas;	
	
	var nCanvas = document.createElement("CANVAS");		
	var w = 100;		
	var h = 92;		
	nCanvas.width = w;
	nCanvas.height = h;	
	var ctx = nCanvas.getContext('2d');	
	ctx.globalAlpha = 1;
	ctx.drawImage(expImg.exp,0,0);

	try{
		var buffer = ctx.getImageData(0, 0, w, h),
		data = buffer.data,
		len = data.length,
		i = 0,
		c = {r:120, g:80, b: 80, a:10};	
		for(i=0; i < len; i += 4)
		{
			data[i] = data[i] + c.r;
			data[i + 1] = data[i + 1] + c.g;
			data[i + 2] = data[i + 2] + c.b;
			data[i + 3] = data[i + 3] + c.a;
		}
	ctx.putImageData(buffer, 0, 0);
	}catch(e)
	{
	}		
	expImg.light = nCanvas;
	
	nCanvas = document.createElement("CANVAS");			
	nCanvas.width = 40;
	nCanvas.height = 40;	
	var ctx = nCanvas.getContext('2d');	
	ctx.drawImage(expImg.smoke,0,0);
	try{
		var buffer = ctx.getImageData(0, 0, 40, 40),
		data = buffer.data,
		len = data.length,
		i = 0,
		c = {r:220, g:220, b: 220, a:-10};	
		for(i=0; i < len; i += 4)
		{
			data[i] = data[i] + c.r;
			data[i + 1] = data[i + 1] + c.g;
			data[i + 2] = data[i + 2] + c.b;
			data[i + 3] = data[i + 3] + c.a;
		}
	ctx.putImageData(buffer, 0, 0);
	}catch(e)
	{
	}		
	expImg.smokeWhite = nCanvas;
	
	////
	var pic = expImg.sparks;
	var nCanvas = document.createElement("CANVAS");
	nCanvas.width = pic.width;
	nCanvas.height = pic.height;
	var ctx = nCanvas.getContext("2d");

	var selectedR = 0;
	var selectedG = 0;
	var selectedB = 0;
	var toler = 1000;

	ctx.drawImage(pic, 0, 0);
	try
	{
		var imageData = ctx.getImageData(0, 0, nCanvas.width, nCanvas.height);
		var data = imageData.data;
		var start = {
		red: selectedR,
		green: selectedG,
		blue: selectedB
		};
		for(var i = 0, n = data.length; i < n; i += 4)
		{
			var diff = Math.abs(data[i] - data[0]) + Math.abs(data[i+1] - data[1]) + Math.abs(data[i+2] - data[2]);
			data[i + 3] = (diff*diff)/toler;
		}
		ctx.putImageData(imageData, 0, 0);
	}
	catch(e)
	{
		
	}
	//console.log(newPic)
	expImg.sparksT = nCanvas;
	//canvasInteractive.getContext("2d").drawImage(nCanvas,0,0);
	
}



function addExpFire(eObj,obj)
{
	eObj.fireArray.push(obj);
}

function addExp(x,y,scale, expArray, rl, ang, ship)
{
	var i=0;
	var eObj = {};
	eObj.smokeArray = new Array();
	eObj.fireArray = new Array();
	eObj.sparkArray = new Array();	
	eObj.Rays = new Array();
	eObj.raysSmoke = new Array();
	eObj.x = x;
	eObj.y = y;
	eObj.sy = y;
	eObj.ship = ship;
	eObj.scale = scale;
	eObj.lineScale = 0;
	eObj.lineAlpha = 1;
	ang = typeof ang !== 'undefined' ? ang : 0;
	eObj.rotation = ang;
	//SMOKE
	for(i=0;i<1;i++)
	{
		var obj = {};
		obj.x = 0;
		obj.y = 0;
		obj.scale = 0;
		obj.sScale = 2.2+Math.random()*0.3;
		obj.sScale *= 1;
		obj.dScale = 0;
		obj.ang = -1.57+Math.random()*2-1;
		obj.sDist = 16+Math.random()*4;
		obj.dist = 0;
		obj.alpha = 0.7+Math.random()*0.3;
		eObj.smokeArray.push(obj)
	}
	//FIREBALLS
	for(i=0;i<1;i++)
	{
		var obj = {};
		obj.x = 0;
		obj.y = 0;
		obj.scale = 0.2;
		obj.sScale = 0.24+Math.random()*0.2;	
		obj.dScale = 0;
		obj.ang = Math.random()*5;
		obj.pAng = Math.random()*5;
		obj.dAng =obj.pAng+(1.0+Math.random()*0.5)*randomMult(); 
		obj.sDist =3+Math.random()*16;		
		obj.dist = 0;
		obj.speed = 9+Math.random()*3;
		obj.alpha = 16;
		obj.bAlpha = 0;
		obj.bFAlpha = 1.3;
		obj.dy = 0;
		obj.dDy = Math.random()*0.1+0.16;		
		if(i==0)
		{			
			obj.sScale = 0.6;			
			var a =  JSON.stringify(obj);
			a =  JSON.parse(a);
			a.pAng = Math.random()*5;
			a.dAng =a.pAng+(1.0+Math.random()*0.5)*randomMult();		
			a.sScale *= 1.2;
			eObj.fireArray.push(a);
			eObj.fireArray.push(obj);	
			
		}
		else
		{		
			var a =  JSON.stringify(obj);
			a =  JSON.parse(a);
			a.pAng = Math.random()*5;
			a.dAng =a.pAng+(1.0+Math.random()*0.5)*randomMult();
			a.sScale *= 1.2;
			//TweenMax.delayedCall(i/30,addExpFire,[eObj,a]);
			//TweenMax.delayedCall(i/30,addExpFire,[eObj,obj]);
		}
		
	}
	var rAng = Math.random()*80;
	//FIRERAYS
	for(i=0;i<rl;i++)
	{
		var obj = {};		
		obj.sy = 0-Math.random()*16;
		obj.x = 0;
		obj.y = 0;
		obj.timer = Math.round(Math.random()*5) ;
		rAng+=30;
		obj.ang = radian(-90+rAng%90-45);	
		obj.sx = Math.cos(obj.ang)*20;		
		obj.dist = Math.random()*10;
		obj.speed = 1.6+Math.random()*1.6;
		obj.length = 40+Math.random()*80;
		obj.life = 0.8+Math.random()*0.4;
		obj.scale = 0.26;		
		eObj.Rays.push(obj);
	}
	//SPARKS
	for(i=0;i<4;i++)
	{
		var obj = {};
		obj.ang = -1.1+i/1.3;
		obj.sx = 0;
		obj.sy = 0;
		obj.x = obj.sx;
		obj.y = obj.sy;	
		obj.scale = 0.3;		
		obj.alpha = 2;	
		obj.sScale = 0.7+Math.random()*0.3;		
		/*if(scale > 1)
		{
			obj.pic = expImg.sparksT;
		}
		else
		{
			obj.pic = expImg.sparks;
		}*/
		obj.pic = expImg.sparks;
		eObj.sparkArray.push(obj);
	}	
	expArray.push(eObj);	
}

function randomMult()
{
	if(Math.random()>0.5)
	{
		return 1;
	}
	else
	{
		return -1;
	}
}

function drawExp(ctx, expArray)
{
	for(var i=0;i<expArray.length;i++)
	{		
		ctx.save();	
			//expArray[i].x -= trainImg.speed*14;
			expArray[i].x += shipImg.speed*cam.scale*expArray[i].ship;
			ctx.translate(expArray[i].x,expArray[i].y + cam.ddy);
			ctx.scale(expArray[i].scale,expArray[i].scale);		
			ctx.rotate(expArray[i].rotation)
			var fArray = expArray[i].fireArray;
			var sArray = expArray[i].smokeArray;
			var sparkArray = expArray[i].sparkArray;
			//SMOKE			
			for(var s=0;s<sArray.length;s++)
			{
				sArray[s].scale+=(sArray[s].sScale-sArray[s].scale)/10;
				sArray[s].dScale +=0.008;
				sArray[s].dist+=(sArray[s].sDist-sArray[s].dist)/12;
				sArray[s].x = Math.cos(sArray[s].ang)*sArray[s].dist;
				sArray[s].y = Math.sin(sArray[s].ang)*sArray[s].dist-sArray[s].dScale*40;		
				sArray[s].alpha -=0.008;
				ctx.save();			
					ctx.translate(sArray[s].x,sArray[s].y-10);
					ctx.scale(sArray[s].scale+sArray[s].dScale,sArray[s].scale+sArray[s].dScale);
					ctx.globalAlpha = sArray[s].alpha;				
					ctx.rotate(sArray[s].ang+sArray[s].sScale);
					ctx.drawImage(expImg.smoke,-20,-20);
				ctx.restore();
				if(sArray[s].alpha<0.01)
				{
					sArray.splice(s,1);
					s--;
				}
			}		
			//FIREBALLS
			for(var f=0;f<fArray.length;f++)
			{
				fArray[f].scale+=(fArray[f].sScale-fArray[f].scale)/12;
				fArray[f].dScale +=0.002;
				fArray[f].dist+=(fArray[f].sDist-fArray[f].dist)/12;
				fArray[f].x = Math.cos(fArray[f].ang)*fArray[f].dist*1.2;
				fArray[f].y = Math.sin(fArray[f].ang)*fArray[f].dist/2-8;
				fArray[f].alpha +=(0-fArray[f].alpha)/fArray[f].speed*0.9;
				fArray[f].bAlpha +=(fArray[f].bFAlpha-fArray[f].bAlpha)/25;
				fArray[f].bFAlpha +=(0-fArray[f].bFAlpha)/fArray[f].speed/4;		
				fArray[f].dy -= fArray[f].dDy+(fArray[f].alpha-0.6)/8;
				fArray[f].pAng+=(fArray[f].dAng-fArray[f].pAng)/40;
				ctx.save();			
					ctx.translate(fArray[f].x,fArray[f].y+fArray[f].dy);
					ctx.scale(fArray[f].scale+fArray[f].dScale,fArray[f].scale+fArray[f].dScale);					
					ctx.rotate(fArray[f].pAng);
					ctx.globalAlpha =  trueAlpha(fArray[f].bAlpha);
					ctx.drawImage(expImg.bExp,-50,-46);				
					ctx.globalAlpha = trueAlpha(fArray[f].alpha);
					if(Math.round(fArray[f].alpha*100)/100>1)
					{
					ctx.globalAlpha = 1;	
					}
					ctx.globalCompositeOperation = 'lighter';
					ctx.drawImage(expImg.exp,-50,-46);			
				ctx.restore();
				if(fArray[f].bAlpha<0.02)
				{
					fArray.splice(f,1);
					f--;
				}
			}
			//FIRERAYS
			for(var o = 0; o < expArray[i].Rays.length; o++)
			{
				var Ray = expArray[i].Rays[o];
				Ray.dist += Ray.speed;
				Ray.speed += (0-Ray.speed)/50;	
				Ray.scale += (0-Ray.scale)/50;					
				Ray.sy += 0.8;
				Ray.x = Ray.sx+Math.cos(Ray.ang)*Ray.dist;
				Ray.y = Ray.sy+Math.sin(Ray.ang)*Ray.dist;			
				Ray.life -= 0.01;			
				Ray.timer++;
				if(Ray.timer % 10 == 0)
				{
					Ray.timer = 0;
					var obj = {};
					obj.x = Ray.x+Math.random()*Ray.scale*30;
					obj.y = Ray.y;
					obj.scale = 0.03;
					obj.fScale = 0.01+Math.random()*Ray.scale+Ray.scale;
					obj.rotation = Math.random()*5;
					obj.fAlpha = 4+Ray.scale*14.2;
					obj.bAlpha = 5+Ray.scale+80;
					expArray[i].raysSmoke.push(obj);				
				}
				if(Ray.life < 0)
				{
					expArray[i].Rays.splice(o, 1);
					o--;
				}
			}		
			for(var o = 0; o < expArray[i].raysSmoke.length; o++)
			{
				var smoke = expArray[i].raysSmoke[o];
				smoke.scale += (smoke.fScale-smoke.scale)/20;
				smoke.fAlpha += (0-smoke.fAlpha)/17;
				smoke.bAlpha += (0-smoke.bAlpha)/14;
				smoke.x+=0.02;
				smoke.y-=0.01;				
				ctx.save();
					ctx.translate(smoke.x, smoke.y);
					ctx.scale(smoke.scale,smoke.scale);
					ctx.rotate(smoke.rotation);				
					ctx.globalAlpha = trueAlpha(smoke.bAlpha - 0.1);
					ctx.drawImage(expImg.bExp,-50,-46);		
					//ctx.rotate(smoke.rotation);		
					ctx.globalAlpha = trueAlpha(smoke.fAlpha)+0.06*trueAlpha(smoke.bAlpha);				
					//ctx.drawImage(expImg.exp,-50,-46);
					//ctx.rotate(smoke.rotation);
					//ctx.scale(1.05,1.05);
					//ctx.globalCompositeOperation = 'lighter';
					ctx.drawImage(expImg.light,-50,-46);
				ctx.restore();			
				if(smoke.bAlpha < 0.02)
				{
					expArray[i].raysSmoke.splice(o, 1);
					o--;
				}
			}
			//SPARKS
			for(var sp=0;sp<sparkArray.length;sp++)
			{
				sparkArray[sp].scale+=(sparkArray[sp].sScale-sparkArray[sp].scale)/15;
				sparkArray[sp].alpha+=(0-sparkArray[sp].alpha)/20;		
				ctx.save();			
					ctx.translate(sparkArray[sp].x,sparkArray[sp].y-10);
					ctx.scale(sparkArray[sp].scale,sparkArray[sp].scale);
					ctx.globalAlpha = trueAlpha(sparkArray[sp].alpha);			
					ctx.rotate(sparkArray[sp].ang);
					ctx.globalCompositeOperation = 'lighter';
					ctx.drawImage(sparkArray[sp].pic,-150/2,-149, 150, 149);
				ctx.restore();
			}
			if(fArray.length == 0)
			{
				expArray.splice(i,1);
				i--;
			}			
		ctx.restore();
	}
}
