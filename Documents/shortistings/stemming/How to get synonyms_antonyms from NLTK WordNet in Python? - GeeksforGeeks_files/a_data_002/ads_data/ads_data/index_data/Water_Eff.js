var gr = 1.61803398875;

function drawWaterElements()
{

	waterImg.waves = new Array();
	waterImg.waveNumber = 3;
	var sH = 22;
	var wH = sH;		
	var wY = 0;
	var dAng = 0;
	for(var i=0; i<waterImg.waveNumber;i++)
	{
		dAng+=45;
		var dy = wH+(sH/2*Math.pow(gr, i));			
		drawWaterSlice(wH,wY,dAng,Math.pow(gr, i));	
		//console.log(wH)
		wY = wH;			
		wH += dy;	
		
		
	}	
	var nCanvas = document.createElement("CANVAS");	
	nCanvas.width = w;
	nCanvas.height = 20;
	var ctx = nCanvas.getContext('2d');
	var tpgr = ctx.createLinearGradient(0, 0, 0, 20);
	tpgr.addColorStop(0, "rgba(255, 247, 219, 0)");	
	tpgr.addColorStop(0.5, "rgba(255, 247, 219, 0.6)");		
	//tpgr.addColorStop(0.7, "rgba(220, 170, 150, 1)");	
	tpgr.addColorStop(1, "rgba(255, 247, 219, 0)");	
	ctx.fillStyle = tpgr;
	ctx.fillRect(0,0,w,20);	
	waterImg.horizon = nCanvas;
	
	/*var nCanvas = document.createElement("CANVAS");	
	nCanvas.width = 200;
	nCanvas.height = 200;
	var ctx = nCanvas.getContext('2d');	
	ctx.translate(100, 100);
	var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
	g.addColorStop(0,   "rgba(104, 160, 202, 0.4)");
	g.addColorStop(1, "rgba(104, 160, 202, 0)");
	ctx.fillStyle = g;		
	ctx.fillRect(-100,-100,200,200);	
	waterImg.blik = nCanvas;*/
	//canvasInteractive.getContext("2d").drawImage(nCanvas,0,0)
}
var num = 0;
function drawWaterSlice(wH,wY,dAng,amp)
{	
	var nCanvas = document.createElement("CANVAS");	
	
	var mult = (Math.ceil(w / waterImg.scale / waterImg.pic.width))+1;	

	var wW = waterImg.pic.width*mult;		
	var nH = wH+40;
	nCanvas.width = wW;
	nCanvas.height = nH;	
	var wCanvas = document.createElement("CANVAS");	
	wCanvas.width = waterImg.pic.width;
	wCanvas.height = waterImg.pic.height;
	var ctx = wCanvas.getContext('2d');
	var tpgr = ctx.createLinearGradient(0, 0, 0, wH);
	if(waterImg.waves.length==0)
	{	
		tpgr.addColorStop(0, "rgba(0, 0, 0, 1)");			
	}
	else
	{
		tpgr.addColorStop(0, "rgba(0, 0, 0, 0)");	
	}
	tpgr.addColorStop(0.36, "rgba(250, 0, 0, 1)");		
	tpgr.addColorStop(0.7, "rgba(0, 0, 0, 1)");	
	tpgr.addColorStop(1, "rgba(0, 0, 0, 1)");	
	ctx.fillStyle = tpgr;
	ctx.fillRect(0,0,wW,nH);
	
	ctx.globalCompositeOperation = "source-in";		
	ctx.drawImage(waterImg.pic,0,-wY);
	
	var ctx = nCanvas.getContext('2d');
	//ctx.globalCompositeOperation = "source-over";
	
	for(var i=0; i<mult; i++)
	{
		//ctx.drawImage(waterImg.pic,waterImg.pic.width*i,-wY);
		//console.log(waterImg.pic.width*i)
		ctx.drawImage(wCanvas,waterImg.pic.width*i,0);
	}	
	
	//ctx.fillStyle = "#ff0000";	
	//ctx.fillRect(0,0,wW,1)
	//ctx.fillRect(wW/2,0,1,600)		
	num++;
	var obj = {};
	obj.x = 0;
	obj.y = wY;	
	obj.dy = 0;
	obj.alpha = 1;
	obj.scale = 1;
	obj.pic = nCanvas;	
	obj.ang = 0;
	obj.dAng = dAng;
	obj.amp = amp/Math.pow(gr, waterImg.waveNumber-1);
	obj.dx = 0;
	//console.log(obj.amp)
	obj.num = num;
	obj.width = wW;
	obj.picWidth = waterImg.pic.width;	
	var a =  JSON.stringify(obj);
	var obj2 = {};	
	obj2 =  JSON.parse(a);
	obj2.ang = 90;
	obj2.pic = nCanvas;
	obj.secondWave = obj2;
	//if(num<2)
	{
	waterImg.waves.push(obj);
	//waterImg.waves.push(obj2);
	}
	
}



function drawWater(ctx)
{
//waterImg.speedX = (mousePos.x-w/2)/20;
//waterImg.speedZ = -(mousePos.y-h/2)/20;
//console.log(waterImg.speedX+"  "+waterImg.speedZ)



	for(var i=0;i<waterImg.waves.length;i++)
	{	
		var www = waterImg.waves[i];
		calculWave(www);
		calculWave(www.secondWave);
		www.dAng += (waterImg.speedZ*(www.amp))/2;
		www.dAng = Math.round(www.dAng)%360;
		
		
		
		if(i!=0)
		{
			www.dy = Math.cos(radian(www.dAng*2))*Math.sqrt(www.amp)*4;
			www.dy = roundValue(www.dy);
			www.secondWave.dy = www.dy;
		}
		if(www.ang>www.secondWave.ang)
		{
			drawWave(ctx, www);
			drawWave(ctx, www.secondWave);
		}
		else
		{
			drawWave(ctx, www.secondWave);
			drawWave(ctx, www);
		}
		
	}
		
	ctx.fillStyle = "#00ff00";	
	//ctx.fillRect(-w/2,0,w,2);
	var hh=20;
	for(var i=0; i<4;i++)
	{
	var dy =hh+(10*Math.pow(gr, i));	
	
	//ctx.fillRect(-w/2,hh,w/2,1);
	hh+=dy;	
	}
		
}

function calculWave(www)
		{
			www.x += waterImg.speedX*www.amp;
			if(www.x + www.dx > www.picWidth/2)
			{
				www.x -= www.picWidth;
			}
			
			if(www.x + www.dx < -www.picWidth/2)
			{
				www.x += www.picWidth;
			}
			www.ang += (waterImg.speedZ*(www.amp));
			if(www.ang>180)
			{
				www.ang-=180;
				www.dx = Math.random()*www.picWidth-www.picWidth/2;			
			}
			if(www.ang<0)
			{
				www.ang+=180;
				www.dx = Math.random()*www.picWidth-www.picWidth/2;				
			}
			
			www.alpha = Math.abs(Math.sin(radian((www.ang))));
			www.scale  = 1+www.amp-(Math.sin(radian((www.ang)/2)))*www.amp;	
		
			www.x = roundValue(www.x);		
			www.dx = roundValue(www.dx);
			www.alpha = roundValue(www.alpha);
			www.scale = roundValue(www.scale);
			www.ang = roundValue(www.ang);
			www.dAng = roundValue(www.dAng);	
		}

function drawWave(ctx, www)
{
	/*www.x = Math.round(www.x*100)/100;
	www.alpha = Math.round(www.alpha*100)/100;
	www.scale = Math.round(www.scale*100)/100;
	www.dy = Math.round(www.dy*100)/100;*/
	/**/
			
	ctx.save();
		ctx.translate(waterImg.x,www.y+www.dy+waterImg.y/waterImg.scale);				
		ctx.scale(www.scale,www.scale);				
		ctx.globalAlpha = www.alpha;
		ctx.drawImage(www.pic,-www.width/2 + www.x + www.dx,0);				
	ctx.restore();
}

function roundValue(val)
{

	return Math.round(val*1000)/1000;

}
