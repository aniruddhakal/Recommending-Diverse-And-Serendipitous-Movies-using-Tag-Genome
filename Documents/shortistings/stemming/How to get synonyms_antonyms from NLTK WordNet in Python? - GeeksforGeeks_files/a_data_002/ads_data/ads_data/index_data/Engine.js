/* -------------------------------------------------------------------------------------
--------------                        WARGAMING.NET                       --------------
----------------------------------------------------------------------------------------
--------------                 AUTHOR: ALEXEY SERGIENYA                   --------------
----------------------------------------------------------------------------------------
--------------                 © 2017 ALL RIGHTS RESERVED                 --------------
--------------------------------------------------------------------------------------*/



/* -------------------------------------------------------------------------------------
----------------------------------     VARIABLES     -----------------------------------
--------------------------------------------------------------------------------------*/

var canvasInteractive,
	canvasButton,
	canvasDarker,	
	canvasMain,
	w, h;

var imagesToLoad = 
	{  
		Button		: "images/Button.png",	
		Logo        : "images/Logo.png",	
		pattern   	: "images/pattern.png",		
		water		: "images/water.jpg",
		islands		: "images/islands.jpg",
		sky			: "images/sky.jpg",
		ship		: "images/ship.png",
		dCrack		: "images/dCrack.jpg",
		nCrack		: "images/nCrack.png",
		wSmoke		: "images/wSmoke.png",
		smoke	 	: "images/smoke.png",
		sparks      : "images/sparks.jpg",	
		explosion   : "images/explosion.png",
		shipText    : "images/shipText.png",
		bulletIcon  : "images/bulletIcon.png",
		map			: "images/map.jpg",
		packshot	: "images/packshot.png",
		fPena		: "images/fPena.png",
		pena		: "images/pena.png",
		tSplash		: "images/tSplash.png",
		bSplash		: "images/bSplash.png",
		shells		: "images/shells.png",
		ButtonWave	: "images/ButtonWave.png",
		//tCrack		: "images/tCrack.png",
		//tCrack		: "images/tCrack.png",
		//hCrack		: "images/hCrack.png",
		//glass		: "images/glass.png"
		
		
	
		
 	};
	
var logoImg         = {},
	festImg         = {},
	flareImg		= {},
	tankImg			= {},
	aimImg			= {},
	shellsImg		= {},
	cam             = {},
	lensImg			= {},
	bgImg			= {},
	glitchImg		= {},	
	waterImg 		= {},
	skyImg			= {},
	shipImg			= {},
	pShipImg		= {},
	shipIconImg		= {},
	bulletIcon		= {},
	islandImg1		= {},
	islandImg2		= {},
	crackImg		= {},
	expImg          = {},
	darkerImg       = {};
var images = {};
var isInteractive = false;
var isPacksoht = false;
var overFl = false;
var mousePos = {};
var frame = 0;
var autoPlayTimer = 0;
var cjs = createjs;	
var textPlate = new newTextPlate();
var textPlate2 = new newTextPlate();
var bgObjectsArray = new Array();
var smokeTimer = 0;
var smokeArray = new Array();
var crackArray = new Array();
var gunExpArray = new Array();
var shipExpArray = new Array();
var frontExpArray = new Array();
var isStopAnim = false;
var agePlate = false;

/* -------------------------------------------------------------------------------------
----------------------------------     FUNCTIONS     ----------------------------------- 
--------------------------------------------------------------------------------------*/


/* -------------------------------     START BANNER  ---------------------------------*/
function start()
{
	canvasInteractive = document.querySelector("#Interactive");
	canvasDarker      = document.querySelector("#Darker");
	canvasButton	  = document.querySelector("#Button");
	canvasMain        = document.querySelector("#Main");
	if(document.querySelector("#age"))
	{
		//document.querySelector("#age").style.fontFamily = font;
		agePlate = document.querySelector("#age");
	}
	

	//
	w = canvasInteractive.width; 
	h = canvasInteractive.height;		

	//
	loadImages(imagesToLoad, function(imagesLoaded)
	{
		Pattern.pic = imagesLoaded.pattern;
		//
		darkerImg.canvas = canvasDarker;
		//			
		Button.pic = imagesLoaded.Button;		
		waterImg.pic = imagesLoaded.water;
		expImg.smoke =  imagesLoaded.smoke;			
		expImg.exp =  imagesLoaded.explosion;
		expImg.sparks =  imagesLoaded.sparks;
		logoImg.pic = imagesLoaded.Logo;
		
		
	
		//		
		init();
	});
	
	
	
}

/* -------------------------------     INIT BANNER   ---------------------------------*/
function init()
{
	// OBJECTS INIT		
	
	darkerImg.color = 0;
	darkerImg.alpha = 1;
	drawDarker(darkerImg);
	TweenMax.to(darkerImg, 1.4, {alpha: 0, ease:Power1.easeOut, onUpdate:drawDarker, onUpdateParams:[darkerImg]});		
	transparentBlack(images.dCrack, "dCrack");
	drawCrackElements();
	waterImg.scale = 0.7;
	drawWaterElements();
	drawIslandElements();
	drawExpElemets();
	drawPatternElements();
	initShip();
	// LISTENERS
	canvasInteractive.addEventListener('click', mClick, false);
	canvasInteractive.addEventListener('mousemove', mMove, false);
	canvasInteractive.addEventListener('mouseover', mOver, false);
	canvasInteractive.addEventListener('mouseout', mOut, false);
	canvasInteractive.addEventListener('mousedown', mDown, false);
	window.addEventListener('mouseup', mUp, false);
	var visibilityChange = "visibilitychange";
	// VISIBILITY
	if (typeof document.hidden !== "undefined")
	{
		hidden = "hidden";
		visibilityChange = "visibilitychange";
	} else if (typeof document.msHidden !== "undefined") 
	{
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") 
	{
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
	}	
	document.addEventListener(visibilityChange, canvasWidthChange, false);
	//	
	setStartPos();	
	TweenMax.ticker.addEventListener("tick", update);
}


function setStartPos()
{
	canvasInteractive.style.cursor = 'auto';	
	
	Button.sx = w-86;	
	Button.sy = h/2;
	Button.x = Button.sx;
	Button.y = Button.sy;
	Button.clickable = false;
	Button.ownCanvas = false;
	Button.ctx = canvasButton.getContext("2d");	

	logoImg.x = 60;
	logoImg.y = h/2;
	logoImg.scale = 1;
	logoImg.alpha = 1;
	logoImg.center = true;
	
	glitchImg.time = 0;
	glitchImg.x = 0;
	glitchImg.y = 0;
	glitchImg.width = canvasMain.width;
	glitchImg.height = canvasMain.height;
	glitchImg.speed = 0.02;	
	crackImg.canvas = document.createElement("CANVAS");
	crackImg.canvas.width = w;
	crackImg.canvas.height = h;
	initWebGL(crackImg.canvas);
	initTextures(canvasMain);	
	glitchImg.force = 0;
	glitchImg.addColor = 0;
	
	waterImg.x = 0;
	waterImg.y = -15;		
	waterImg.speedX = 0.6;
	waterImg.speedZ = 0;
	waterImg.scale = 0.7;
	
	islandImg1.x = -130;
	islandImg1.y = waterImg.y+10;
	islandImg1.scale = 0.86;
	
	islandImg2.x = 140;
	islandImg2.y = waterImg.y+10;
	islandImg2.scale = 0.86;	
	
	shipImg.x = 140;
	shipImg.y = waterImg.y + 4;
	shipImg.scale = 0.78;
	shipImg.dx = 0;
	shipImg.speed = -0.16;
	shipImg.shape = new cjs.Shape();
	shipImg.shape.graphics.c().s().p("AvZD8IgBiDIAiAtID2gLIDUgbIB2gsIAihUICJg1IAsi8IAcgKIAFDOIA2BzIgDhHIBnAAIgBBfIAoAHIBAhCICIglIAjj0IAZABIAlFMIJkB0IANAxg");	
	shipImg.smokeTimer = 0;
	shipImg.hitCount = 0;
	shipImg.destroy = false;
	shipImg.penaArray = new Array();	
	shipImg.smokeArray = new Array();	
	
	pShipImg.x = -20;
	pShipImg.y = 35;
	pShipImg.sy = pShipImg.y;
	pShipImg.scale = 0.9;
	pShipImg.ang = 0;	
	pShipImg.dAng = 0.01;
	pShipImg.fWavesArray = new Array();
	for (var i = 0; i < 4; i++) {
		wave = {};
		wave.x = 114;
		wave.y = 6;
		wave.scale = 1.0;
		wave.alpha = 0;
		wave.ang = -0.3;
		pShipImg.fWavesArray.push(wave);
	}
	pShipImg.penaArray = new Array();	
	
	pena = {};
	pena.x = 140;
	pena.y = 6;
	pena.scaleX = 0.9;
	pena.scaleY = -1;
	pena.rotation = radian(180.3);
	pShipImg.penaArray.push(pena);
	
	pena = {};
	pena.x = 30;
	pena.y = 0;
	pena.scaleX = 1.1;
	pena.scaleY = -0.8;
	pena.rotation = radian(180.7);
	pShipImg.penaArray.push(pena);
	
	pena = {};
	pena.x = -40;
	pena.y = -2;
	pena.scaleX = 0.9;
	pena.scaleY = -0.7;
	pena.rotation = radian(180.7);
	pShipImg.penaArray.push(pena);	
	
	skyImg.x = 300;
	skyImg.y = -15;
	skyImg.dx = 100;
	skyImg.scale = 0.9;
	skyImg.speed = 0.1;	
	
	cam.x = w/2;
	cam.y = h/2;
	cam.dx = 0;
	cam.dy = 0;
	cam.ddx = 0;
	cam.ddy = 0;
	cam.amp = 1;
	cam.ang =0;
	cam.sScale = 1;
	cam.scale = 1;
	cam.rotate = 0;
	cam.dScale = 0;
	cam.lCut = 0;
	cam.rCut = 0;
	cam.tCut = 0;
	cam.bCut = 0;
	/*if(agePlate)
	{		
		TweenMax.to("#age", 0, {left:cam.lCut+"px", ease:Power1.easeOut});
	}*/
	
	shipIconImg.x = w/2 - 184;
	shipIconImg.y = h/2 + 12;
	shipIconImg.scale = 0.9;
	shipIconImg.hp = 1;
	shipIconImg.shape = new cjs.Shape();
	shipIconImg.shape.graphics.c().s().p("ApeCZIhHhqIBqAPIBOAAIArgbIA0AAIAPgQIA4gBIAAAPQgSAFAJAMIAcgBIACgdIAUAAIARAaIAVAAIAIgNIAPAAIANgNIAHADIAHAMIAJgBIAbguIAagSIARABIAMgXIAAgQIgDgPIAIhFIAKAAIAHA8IAVAAIAAA9IgLATIAAAfIArABIAUAOIA0AAIAHADIALgFIATAAIAEgKIARALQARADAHgNIAJgNIACgXIAhgTQASgBAEALIAAAfIATAYIAPgBIgNgUIAMgLIALAAQANAJAFgJQAGgGgMgMIAAhSIAQADIAAAoQAhgCALAgIADAfIAmAFIAdgGIAfANIAYAAIASATIDnAAIhqB1gAFrAmIAJAJIAIgMIgJgIgAhlgXIAEAGIACgHIgCgNg");
	shipIconImg.text = "1500";
	
	bulletIcon.x = w/2 + 160;
	bulletIcon.y =  h/2 + 8;
	bulletIcon.sy = 0;
	bulletIcon.scale = 1;
	bulletIcon.alpha = 0;
	bulletIcon.mapAlpha = 1;
	bulletIcon.count = 6;
	
	mousePos.x = w/2;
	mousePos.y = h/2-cam.bCut/2;
	aimImg.x = w/2;
	aimImg.y = h/2-cam.bCut/2;
	aimImg.sx = aimImg.x;
	aimImg.sy = aimImg.y;
	aimImg.fx = aimImg.x;
	aimImg.fy = aimImg.y;
	aimImg.scale = 1;
	aimImg.color = "#00ff00";
	aimImg.radius = 12;
	aimImg.dRadius = 0;
	aimImg.rotate = 0;
	aimImg.alpha = 1;
	aimImg.ang = 0; 
	aimImg.darkerAlpha = 0;
	aimImg.enable = false;
	aimImg.r1 = 75;
	aimImg.r2 = 400;
	aimImg.isHit = false;
	aimImg.reload = 0;
	
	shellsImg.x = 0;
	shellsImg.y = 0;
	shellsImg.scale = 0.8;
	shellsImg.shells = new Array();
	
	for(var i = 0; i < 6; i++)
	{
		var shell = {};
		shell.x = -4*9 + i*9;
		shell.sx = shell.x;
		shell.y = 0;
		shell.idx = 0;
		shell.alpha = 1;
		shellsImg.shells.push(shell);
	}
	shellsImg.shells[0].alpha = 0;
	shellsImg.shells[1].alpha = 0;
	
	textPlate.height = 40;
	textPlate.width = w;
	textPlate.x = w/2;
	textPlate.sy = h/2-cam.bCut/2;
	textPlate.y = textPlate.sy;
	textPlate.maxWidth = 260;
	textPlate.color = "255,255,255";
	textPlate.bgAlpha = 0;
	
	textPlate2.height = 40;
	textPlate2.width = w;
	textPlate2.x = w-100;
	textPlate2.sy = h/2-cam.bCut/2;
	textPlate2.y = textPlate2.sy;
	textPlate2.maxWidth = 140;
	textPlate2.color = "255,255,255";
	textPlate2.bgAlpha = 0;
	textPlate2.textAlign = "center";
	
	crackImg.nCanvas = 	document.createElement("CANVAS");
	crackImg.nCanvas.width = w;
	crackImg.nCanvas.height = h;
	crackImg.nCTX = crackImg.nCanvas.getContext("2d");
	
	crackImg.dCanvas = 	document.createElement("CANVAS");
	crackImg.dCanvas.width = w;
	crackImg.dCanvas.height = h;
	crackImg.dCTX = crackImg.dCanvas.getContext("2d");
	
	crackImg.tCanvas = 	document.createElement("CANVAS");
	crackImg.tCanvas.width = w;
	crackImg.tCanvas.height = h;
	crackImg.tCTX = crackImg.tCanvas.getContext("2d");
	
	crackImg.dtCanvas = 	document.createElement("CANVAS");
	crackImg.dtCanvas.width = w;
	crackImg.dtCanvas.height = h;
	crackImg.dtCTX = crackImg.dtCanvas.getContext("2d");
	
	Pattern.tPattern.alpha = 1;
	Pattern.bPattern.alpha = 1;	
	
	setStrings();
	animate();	
	isInteractive = false;
	isStopAnim = false;
	isPacksoht = false;
	//toFrame2();
}


/* -------------------------------   UPDATE BANNER   ---------------------------------*/


function update()
{	
	cam.ang += 0.5;		
	cam.dx = Math.sin(cam.ang)*Math.sin(cam.ang/2)*cam.amp;
	cam.dy = Math.sin(cam.ang*0.8+5)*Math.sin(cam.ang/1.8)*cam.amp;	
	
	var ctx = canvasMain.getContext("2d");
	//ctx.clearRect(0,0,w,h);
	//ctx.fillRect(0,0,w,h)
	//ctx.drawImage(images.bg, -300 + Math.sin(cam.ang/60)*150, 0);
	ctx.save();
		ctx.translate(cam.x+cam.dx+cam.ddx, cam.y+cam.dy+cam.ddy);
		ctx.scale(cam.scale+cam.dScale, cam.scale+cam.dScale);
		ctx.rotate(cam.rotate);
		skyImg.dx += skyImg.speed;
		if(skyImg.dx > images.sky.width){skyImg.dx-=images.sky.width;}
		if(skyImg.dx < 0){skyImg.dx+=images.sky.width;}
		ctx.save();
			ctx.translate(skyImg.x - cam.x, skyImg.y);
			ctx.scale(skyImg.scale, skyImg.scale);
			ctx.drawImage(images.sky, skyImg.dx, -images.sky.height);
			ctx.drawImage(images.sky, skyImg.dx -images.sky.width + 1, -images.sky.height);
			//ctx.drawImage(images.sky, skyImg.dx + images.sky.width - 1, -images.sky.height);
		ctx.restore();
		ctx.save();
			ctx.scale(waterImg.scale, waterImg.scale);		
			drawWater(ctx);
			ctx.scale(1/waterImg.scale, 1/waterImg.scale);					
			ctx.drawImage(waterImg.horizon,-w/2,-10+waterImg.y*waterImg.scale);				
		ctx.restore();
		if(!isPacksoht)
		{
			drawShip(ctx);		
			drawExp(ctx, shipExpArray);
			drawIsland(ctx, islandImg1);		
			drawIsland(ctx, islandImg2);	
		}
		else
		{
			drawPackshotShip(ctx);
		}
	ctx.restore();	
	
	drawSplash(ctx);
	drawExp(ctx, gunExpArray);	
	drawBullet(ctx);
		
	
	drawPattern(ctx);
	
	
	
	
	if(webGlSupported==true)
	{
		drawGlitch();		
		//ctx = Button.ctx;
		ctx.drawImage(crackImg.canvas, 0, 0);
	}	
	
	ctx.drawImage(crackImg.dtCanvas,0,0);		
	if(!isPacksoht)
	{
		drawAimImg(ctx);	
		drawShells(ctx);	
	}
	//TEXTBG
	ctx.fillStyle = "rgba(10,20,30,"+trueAlpha(textPlate.bgAlpha)+")";
	ctx.fillRect(cam.lCut, cam.tCut, w - cam.lCut - cam.rCut, h - cam.tCut - cam.bCut);		
	
	
	drawButton(ctx);
	drawLogo(ctx, logoImg);		
	
	drawExp(ctx, frontExpArray);
	textPlate.draw(ctx);
	textPlate2.draw(ctx);
	if(isInteractive && aimImg.reload < 0)
	{
		redButtonClick();
	}
	
	if(Button.isOver)
		{	
			canvasInteractive.style.cursor = 'pointer';
		}
		else
		{
			canvasInteractive.style.cursor = 'auto';
		}	
}

function drawShells(ctx)
{
	
	shellsImg.x = aimImg.x;
	shellsImg.y = aimImg.y;
	ctx.save();
		ctx.translate(shellsImg.x, shellsImg.y+20);
		
		ctx.scale(shellsImg.scale, shellsImg.scale);	
	
		for(var i = 0; i < shellsImg.shells.length; i++)
		{		
			
			var shell = shellsImg.shells[i];
			ctx.save();
				ctx.translate(shell.x, shell.y);
				ctx.globalAlpha = trueAlpha(shell.alpha*aimImg.darkerAlpha);
				ctx.drawImage(images.shells, shell.idx, 0, 9, 25, 0, 0, 9, 25);			
			ctx.restore();
		}
	ctx.restore();
	
}


function shellsAnim()
{
	shellsImg.shells[4].idx = 9;
	shellsImg.shells[5].idx = 9;
	
	for(var i = 0; i < shellsImg.shells.length; i++)
	{
		var shell = shellsImg.shells[i];
		TweenMax.to(shell, 0.7, {delay: 0.3, x:shell.x+18,  ease:Power3.easeOut});	
	}
	TweenMax.to(shellsImg.shells[4], 0.7, {delay: 0.3, alpha:0,  ease:Power3.easeOut});
	TweenMax.to(shellsImg.shells[5], 0.7, {delay: 0.3, alpha:0,  ease:Power3.easeOut});
	
	TweenMax.to(shellsImg.shells[0], 0.7, {delay: 0.3, alpha:1,  ease:Power3.easeOut});
	TweenMax.to(shellsImg.shells[1], 0.7, {delay: 0.3, alpha:1,  ease:Power3.easeOut});
	TweenMax.delayedCall(1, resetShells);
	
}

function resetShells()
{
	shellsImg.shells[0].alpha = 0;
	shellsImg.shells[1].alpha = 0;
	
	shellsImg.shells[4].alpha = 1;
	shellsImg.shells[5].alpha = 1;
	shellsImg.shells[4].idx = 0;
	shellsImg.shells[5].idx = 0;
	
	for(var i = 0; i < shellsImg.shells.length; i++)
	{
		var shell = shellsImg.shells[i];
		TweenMax.killTweensOf(shell);
		shell.x = shell.sx;			
	}
}

function drawCrack()
{
	var ctx = crackImg.tCTX;
	ctx.clearRect(0,0,w,h);
	for(var i = 0; i < crackArray.length; i++)
	{
		var crack = crackArray[i];
		ctx.save();
			ctx.translate(crack.x, crack.y);
			ctx.scale(crack.scale, crack.scale);
			ctx.rotate(crack.rotation);
			ctx.drawImage(images.tCrack, -128, -144);
		ctx.restore();
	}
	var ctx = crackImg.dCTX;
	ctx.clearRect(0,0,w,h);	
	for(var i = 0; i < crackArray.length; i++)
	{
		var crack = crackArray[i];
		ctx.save();
			ctx.translate(crack.x, crack.y);
			ctx.scale(crack.scale, crack.scale);
			ctx.rotate(crack.rotation);
			ctx.globalAlpha = 0.74;
			ctx.drawImage(images.dCrack, -128, -144);
		ctx.restore();
	}	
	var ctx = crackImg.dtCTX;
	ctx.clearRect(0,0,w,h);	
	ctx.save();
		ctx.drawImage(crackImg.tCanvas,0,0);
		ctx.globalCompositeOperation = "source-out";
		ctx.drawImage(crackImg.dCanvas,0,0);
	ctx.restore();
	var ctx = crackImg.nCTX;
	ctx.fillStyle = "rgb(127,127,255)";	
	ctx.fillRect(0,0,w,h);
	for(var i = 0; i < crackArray.length; i++)
	{
		var crack = crackArray[i];
		ctx.save();
			ctx.translate(crack.x, crack.y);
			ctx.scale(crack.scale, crack.scale);
			ctx.rotate(crack.rotation);
			ctx.drawImage(images.nCrack, -128, -144);
		ctx.restore();
	}
	for(var i = 0; i < crackArray.length; i++)
	{
		var crack = crackArray[i];
		ctx.save();
			ctx.translate(crack.x, crack.y);
			ctx.scale(crack.scale, crack.scale);
			ctx.rotate(crack.rotation);
			ctx.drawImage(images.hCrack, -128, -144);
		ctx.restore();
	}
	for(var i = 0; i < crackArray.length; i++)
	{
		var crack = crackArray[i];
		ctx.save();
			ctx.translate(crack.x, crack.y);
			ctx.scale(crack.scale, crack.scale);
			ctx.rotate(crack.rotation);
			ctx.drawImage(images.tCrack, -128, -144);
		ctx.restore();
	}

}

function addCrack(x,y,scale,rotation)
{
	var crack = {};
	crack.x = x;
	crack.y = y;
	crack.scale = scale;
	crack.rotation = rotation;
	crackArray.push(crack);
}

/* -------------------------------   ANIMATE BANNER   ---------------------------------*/
function animate() 
{
	cam.amp = 0;
	waterImg.scale = 0.8;
	drawCrack();	
	TweenMax.delayedCall(1.4, overAnim);
	TweenMax.delayedCall(2, addShipShot1);
	TweenMax.delayedCall(8, addShipShot2);
	TweenMax.delayedCall(15, addShipShot4);	
	TweenMax.delayedCall(2, function(){textPlate2.show(textPlate2.frame1);});
	TweenMax.delayedCall(8, textPlate2Frame2);	
}

function textPlate2Frame2()
{
	textPlate2.show(textPlate2.frame2);
}

function overAnim()
{
	TweenMax.fromTo(waterImg, 1.7, { speedZ: -28 }, { speedZ: 0, scale:0.9, ease: Expo.easeOut });
	TweenMax.to(islandImg1, 1.9, {scale: 1, x:-200, ease:Power4.easeOut});
	TweenMax.to(islandImg2, 1.9, {scale: 1, x:200, ease:Power4.easeOut});
	TweenMax.to(shipImg, 1.9, {scale: 1, x:156, ease:Power4.easeOut});
	TweenMax.to(skyImg, 1.9, {scale: 0.96,  ease:Power4.easeOut});
	TweenMax.from(aimImg, 0.4, {r1:300, ease:Power3.easeOut});
	TweenMax.to(bulletIcon, 0.4, {mapAlpha:0, sy:-30, alpha:1, ease:Power3.easeInOut});	
	showAimImg();
	TweenMax.delayedCall(1, function(){isInteractive = true;});
	
}

function toResult()
{
	TweenMax.killDelayedCallsTo(addShipShot1);
	TweenMax.killDelayedCallsTo(addShipShot2);
	TweenMax.killDelayedCallsTo(addShipShot3);
	TweenMax.killDelayedCallsTo(addShipShot4);
	TweenMax.killDelayedCallsTo(toResult);	
	textPlate.showTextPlate();
	if(shipImg.destroy)
	{
		textPlate.show(textPlate.frame1);
	}
	else
	{
		textPlate.show(textPlate.frame2);
	}
	TweenMax.delayedCall(2.6, toPacksoht);
}

function toPacksoht()
{
	textPlate.hide();
	//textPlate.hideTextPlate();
	TweenMax.staggerFrom(pShipImg.fWavesArray, 1, {scale:0, y:"-=0", x:"+=15", ang:0.3, alpha:2.4, ease:Linear.easeOut, repeat:-1}, 1/(pShipImg.fWavesArray.length-1));
  //  TweenMax.staggerTo(pShipImg.fWavesArray, 1, {alpha:0, ease:Power2.easeIn, repeat:-1}, 1/(pShipImg.fWavesArray.length-1));
	
	//TweenMax.staggerFrom(pShipImg.penaArray, 1, {scale:0, y:30, x:"+=15", alpha:0.6, ease:Linear.easeOut, repeat:-1}, 1/pShipImg.penaArray.length);
	
  
	
	TweenMax.to(textPlate, 0.4, {bgAlpha: 1, ease:Power1.easeIn,  onComplete: function()
	{
		TweenMax.to(textPlate, 0.7, {bgAlpha: 0, ease:Power1.easeOut});
		cam.y = h/2+7;
		cam.scale = 1.8;
		TweenMax.to(cam, 0.8, {scale: 1, ease:Power3.easeOut});
		//TweenMax.to(cam, 0.3, {tCut: 0, lCut: 0, rCut: 0, bCut: 0, ease:Power3.easeOut});
		/*if(agePlate)
		{		
			TweenMax.to("#age", 0.3, {left:"0px", ease:Power3.easeOut});
		}*/
		skyImg.speed = -0.1;
		skyImg.scale = 0.9;
		skyImg.dx = images.sky.width;
		skyImg.y = 15;
		skyImg.x = 0;
		waterImg.speedX = -0.9;
		waterImg.speedZ = 1.2;
		waterImg.y = 15;
		
		gunExpArray = new Array();
		shipExpArray = new Array();
		frontExpArray = new Array();
		
		isPacksoht = true;
		crackArray = new Array();
		drawCrack();
		
		TweenMax.to(Pattern.bPattern, 2, {delay:0.3, alpha:0.9, ease:Sine.easeOut});
		TweenMax.to(Pattern.tPattern, 2, {delay:0.3, alpha:0.9, ease:Sine.easeOut});		
	
		showButton();
		//TweenMax.to(Button, 0.4, {delay:1.6, y:Button.sy - 4, ease:Sine.easeOut});
		
		
		TweenMax.delayedCall(5, stopAnim);	
		
	
	}});
}

function stopAnim()
{
	TweenMax.killTweensOf(pShipImg.fWavesArray);
	waterImg.speedX = 0;
	waterImg.speedZ = 0;
	skyImg.speed = 0;
	pShipImg.dAng = 0;
	isStopAnim = true;
}

function camShake()
{	
	TweenMax.killTweensOf(cam, {ddy:true});	
	cam.ddy = 0;
	//CustomWiggle.create("shakeWiggle", {wiggles:4, timingEase: Circ.easeIn,  amplitudeEase:  Power1.easeOut});
	TweenMax.to(cam, 0.06, {ddy:6, ease:Power1.easeOut}); 	
	TweenMax.to(cam, 1, {delay:0.06, ddy:0, ease:Elastic.easeOut}); 	
}


function camScale()
{
	//cam.y = 4;
	
	TweenMax.killTweensOf(cam, {scale:true});	
	TweenMax.to(cam, 0.04, {scale: 0.97, ease:Power2.easeOut});
	TweenMax.to(cam, 1, {delay:0.04, scale: 1,  ease:Elastic.easeOut});	
}




function restartBanner ()
{
	hideButton ();
	//hideAgainPlate();
	//textPlate.hideTextPlate();

	
	
	//TweenMax.to(cam, 0.4, {delay:1, tCut: 0, lCut: 24, rCut: 24, bCut: 36, ease:Power3.easeOut});
	/*if(agePlate)
	{		
		TweenMax.to("#age",  0.4, {delay:1, left:"24px", ease:Power3.easeOut});
	}*/
	TweenMax.to(darkerImg, 1.4, {alpha: 1, ease:Power1.easeIn, onUpdate:drawDarker, onUpdateParams:[darkerImg], onComplete: function()
	{
		TweenMax.killAll();
		darkerImg.alpha = 1;			
		TweenMax.to(darkerImg, 1.4, {alpha: 0, ease:Power1.easeOut, onUpdate:drawDarker, onUpdateParams:[darkerImg]});						
		autoPlayTimer = 0;		
		//isInteractive = true;		
		setStartPos();
	}});
}




/* -------------------------------------------------------------------------------------
----------------------------------      SERVICE      ----------------------------------- 
--------------------------------------------------------------------------------------*/

function transparentBlack(pic, newPic)
{
	var nCanvas = document.createElement("CANVAS");
	nCanvas.width = pic.width;
	nCanvas.height = pic.height;
	var ctx = nCanvas.getContext("2d");

	var selectedR = 30;
	var selectedG = 60;
	var selectedB = 30;
	var toler = 300;

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
		c = {r:110, g:130, b:110, a:0};	
		for(i=0; i < data.length; i += 4)
		{
			data[i] = data[i] + c.r;
			data[i + 1] = data[i + 1] + c.g;
			data[i + 2] = data[i + 2] + c.b;
			data[i + 3] = data[i + 3] + c.a;
		}
		ctx.putImageData(imageData, 0, 0);
	}
	catch(e)
	{
		
	}
	//console.log(newPic)
	images[newPic] = nCanvas;
	//canvasInteractive.getContext("2d").globalAlpha = 0.7;
	//canvasInteractive.getContext("2d").drawImage(nCanvas,0,0);
}

function drawCutImage(ctx, pic, obj)
{
	ctx.save();
		ctx.translate(obj.x, obj.y);
		ctx.scale(obj.scale, obj.scale);
		ctx.rotate(obj.rotation);
		ctx.globalAlpha = obj.alpha;
		ctx.drawImage(pic, obj.box[0], obj.box[1], obj.box[2], obj.box[3], -obj.box[4], -obj.box[5], obj.box[2], obj.box[3]);
	ctx.restore();
}

function drawShape(ctx, parent, shape)
{
	if(parent.alpha >0)
	{	
		ctx.save();
			ctx.translate(parent.x,parent.y);					
			if(parent.hasOwnProperty('scaleX'))
			{
				ctx.scale(parent.scaleX,parent.scaleY);
			}
			else
			{
				ctx.scale(parent.scale,parent.scale);
			}
			
			ctx.rotate(parent.rotation);			
			ctx.translate(parent.offsetX,parent.offsetY);
			ctx.globalAlpha = parent.alpha;			
			ctx.translate(shape.offsetX,shape.offsetY);	
			ctx.rotate(shape.rotation);
			ctx.translate(shape.x,shape.y);			
			shape.draw(ctx);			
		ctx.restore();	
	}
}

function trueAlpha (alpha)
{
	if(alpha>1)
	{
		return 1;
	}
	else if(alpha<0)
	{
		return 0;
	}
	else
	{
		return Math.round(alpha*100)/100;
	}
}

function mDown(e)
{

}


function mUp(e)
{	
	
}



function mOver()
{
	overFl = true;	
	autoPlayTimer = 0;
	
}



function mOut()
{
	overFl = false;	
}

function mMove(evt)
{	
	mousePos = getMousePos(evt);
	if(overFl == false)
	{
		mOver();
	}		
}

// MOUSE CLICK
function mClick(e)
{
	if(isInteractive && aimImg.reload < 0)
	{
		redButtonClick();
	}
	if(isPacksoht && !againPlate.isOver || Button.isOver)
	{
		setURL();
	}
}

// GO TO URL
function setURL()
{
	ExitApi.exit();
}

// GET URL CLICKTAG FOR YANDEX
function getUrlParam(name) 
{
	  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	  results = regex.exec(location.search);
	  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// GET MOUSE COORDINATES
function getMousePos(e)
{
   var rect = canvasInteractive.getBoundingClientRect();
   return {
	  x: e.clientX - rect.left,
	  y: e.clientY - rect.top
   };
}

// LOADING IMAGES
function loadImages(imagesToBeLoaded, drawCallback)
{
	var loadedImages = 0;
	var numberOfImagesToLoad = 0;
	//
	for(var name in imagesToBeLoaded)
	{
		numberOfImagesToLoad++;
	}
	
	for(var name in imagesToBeLoaded)
	{
		images[name] = new Image();
		images[name].crossOrigin='Anonymous';
		images[name].onload = function()
		{
			if(++loadedImages >= numberOfImagesToLoad)
			{
				drawCallback(images);
			}
		};
		//
		images[name].src = imagesToBeLoaded[name];
		for(var bName in base64Images)
        {
            if(name == bName)
            {
                images[name].src = base64Images[bName];
            }
        }   
	}
}

// DISABLING BUG IN CHROME TAB
function canvasWidthChange()
{    
	if(frame < 2)
	{
		canvasMain.width = canvasMain.width + 1;
		canvasMain.width = canvasMain.width - 1;
		if (document[hidden]) 
		{	
			TweenMax.ticker.removeEventListener("tick", update);	
			TweenMax.pauseAll(true, true, false);		
		}
		else
		{
			TweenMax.resumeAll(true, true, false);
			TweenMax.ticker.addEventListener("tick", update);			
		}
	}
}

// CLEAR ANY CANVAS
function clearCanvas(canv)
{
	var ctx = canv.getContext("2d");
	//
	ctx.clearRect(0, 0, w, h);
}

// CLEAR ALL ACTIVE CANVASES
function clearAll()
{
	clearCanvas(canvasMain);
}

// CONVERT DEGREES TO RADIANS
function radian(a)
{
	return a * Math.PI / 180;
}
function randomMinus()
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

/* -------------------------------------------------------------------------------------
----------------------------------      ACTIONS      ----------------------------------- 
--------------------------------------------------------------------------------------*/

//
window.onLoad = loadFonts();