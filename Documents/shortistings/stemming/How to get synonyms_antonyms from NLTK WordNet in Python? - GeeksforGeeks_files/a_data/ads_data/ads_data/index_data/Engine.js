////////////////////////////////////////////////////////////////////////////////////// VARS
var canvasInteractive, 
	canvasService,
	canvasLogo,
	canvasButton,
	canvasPattern,
	canvasMain,
	w, h;

var imagesToLoad = 
	{
		logo:     "gfx/Logo.jpg",
		motto:    "gfx/Motto.png",
		button:   "gfx/Button.jpg",
		pattern:  "gfx/Pattern.png",
		water:    "gfx/Water.jpg",
		wave:     "gfx/Wave.png",
		smoke:    "gfx/Smoke.png",
		exp:      "gfx/Explosion.png",
		fire:     "gfx/Fire.png",
		splash:   "gfx/Splash.png",
		sky:      "gfx/Sky.jpg",
		ship:     "gfx/Ship.png",
		packshot: "gfx/Packshot.jpg",
		island:   "gfx/Island.jpg",
		icon:     "gfx/Icon.jpg"
 	};
	
var img_cam = {},
	img_logo = {},
	img_pack = {},
	img_ship = {},
	img_sky = {},
	img_water = {},
	img_wave = {},
	img_smoke = {},
	img_exp = {},
	img_fire = {},
	img_splash = {},
	img_island = {},
	img_aim = {},
	img_ico = {},
	img_plate = {},
	img_darker = {},
	mousePos = {},
	img_age = {};

var horizLine = 356;
var waterMapArray = [];

var overFl = false;

var bannerState = "interaction"; // "result", "packshot"

var plTxtNum = 1;

//
var allowFl = true;

//
var autoplayFl = false;
var interactFl = false;
var restartFl = false;
var autoplayTmr = 0;
var autoplayTmrMax = 60 * 10;
var restartTmrMax = 60 * 10;

////////////////////////////////////////////////////////////////////////////////////// FUNCTIONS
function start()
{
	canvasInteractive = document.querySelector("#Interactive");
	canvasService     = document.querySelector("#Service");
	canvasLogo        = document.querySelector("#Logo");
	canvasButton      = document.querySelector("#Button");
	canvasPattern     = document.querySelector("#Pattern");
	canvasMain        = document.querySelector("#Main");

	//
	w = canvasInteractive.width; 
	h = canvasInteractive.height;

	//
	loadImages(imagesToLoad, function(imagesLoaded)
	{
		img_logo.pic          = imagesLoaded.logo;
		img_logo.motto        = imagesLoaded.motto;
		//
		Button.ctx            = canvasButton.getContext('2d');
		Button.pic            = imagesLoaded.button;
		//
		Pattern.pic           = imagesLoaded.pattern;
		Pattern.ctx           = canvasPattern.getContext('2d');		
		//
		img_age.canvas        = canvasLogo;
		//
		img_pack.canvas       = canvasMain;
		img_pack.pic          = imagesLoaded.packshot;
		//
		img_ship.canvas       = canvasMain;
		img_ship.pic          = imagesLoaded.ship;
		//
		img_sky.canvas        = canvasMain;
		img_sky.pic           = imagesLoaded.sky;
		//
		img_water.canvas      = canvasMain;
		img_water.pic         = imagesLoaded.water;
		//
		img_wave.pic          = imagesLoaded.wave;
		//
		img_smoke.canvas      = canvasMain;
		img_smoke.pic         = imagesLoaded.smoke;
		//
		img_island.canvas     = canvasMain;
		img_island.pic        = imagesLoaded.island;
		//
		img_aim.canvas        = canvasMain;
		//
		img_ico.canvas        = canvasInteractive;
		img_ico.pic           = imagesLoaded.icon;
		//
		img_plate.canvas      = canvasService;
		img_plate.pic         = imagesLoaded.pattern;
		//
		img_fire.pic          = imagesLoaded.fire;	
		img_exp.pic           = imagesLoaded.exp;
		img_splash.pic        = imagesLoaded.splash;
		//
		img_darker.canvas     = canvasMain;
		//
		init();		
		//
		requestID = window.requestAnimationFrame(update);
	});
}

//
function init()
{
	img_cam.isShoot = false;
	img_cam.camDY = 0;
	//
	img_logo.x = w / 2;
	img_logo.y = 80;
	img_logo.scale = 1;
	img_logo.alpha = 1;
	img_logo.ctx = canvasLogo.getContext('2d');
	drawLogo (img_logo.ctx, img_logo);
	//
	Button.x = w / 2;
	Button.y = h - 66;
	//
	Pattern.bPattern.height = 50;
	Pattern.tPattern.alpha = 0.9;
	Pattern.bPattern.alpha = 0.9;
	drawPatternElements();
	drawPattern(Pattern.ctx);
	//
	img_age.alpha = 1;
	//drawAge(img_age);
	//
	img_pack.alpha = 1;
	img_pack.scale = 1;
	img_pack.x = 0;
	img_pack.y = 0;
	//
	img_sky.x = w / 2;
	img_sky.y = horizLine;
	img_sky.alpha = 1;
	img_sky.scale = 1 / 1.5;
	//
	img_water.x = 0;
	img_water.y = horizLine;
	img_water.scale = 1;
	//
	img_ship.x = 8.5 - 70;
	img_ship.y = 5;
	img_ship.scale = 1 / 1.5;
	drawDestroyShip();
	//
	img_island.x = -25;
	img_island.y = 12;
	img_island.scale = 1 / 1.5;
	//
	if(mousePos)
	{
		img_aim.x = mousePos.x;
		img_aim.y = mousePos.y;
	}
	else
	{
		img_aim.x = w / 2;
		img_aim.y = h / 2;
	}
	img_aim.alpha  = 0;
	img_aim.alpha2 = 0;
	img_aim.ang = 0;
	//
	img_ico.x = 260 + 110;
	img_ico.y = 528;
	//
	img_plate.x = 0;
	img_plate.y = h + 1;
	img_plate.height = 66;
	//
	img_wave.ang = 0;
	//
	img_darker.alpha = 1;
	TweenMax.to(img_darker, 1.2, {alpha:0});
	//
	setAgainPlate();
	//
	if(overFl === false)
	{
		TweenMax.to(img_plate, 0.6, {y: h - img_plate.height, ease:Power1.easeIn, delay:0.4});
		//
		autoplayFl = true;
	}
	else
	{
		mOver(null);
	}
	//
	var ph = 1.1;
	drawWaterSlice(30,0,1);
	//
	for(var i = 0; i < 5; i++)
	{
		ph *= 1.4;
		drawWaterSlice(22 * ph, 30 * ph - 30, ph);		
	}
	//
	canvasInteractive.addEventListener('mouseover', mOver, false);
	canvasInteractive.addEventListener('mouseout', mOut, false);
	canvasInteractive.addEventListener('mousemove', mMove, false);
	canvasInteractive.addEventListener('click', mClick, false);
}

//
function update(time)
{
	clearAll();
	//
	var ctx = canvasMain.getContext("2d");
	//
	if(bannerState === "interaction" || bannerState === "result")
	{
		ctx.save();
		//
		ctx.translate(w / 2, horizLine + img_cam.camDY);
		//
		ctx.scale(img_water.scale, img_water.scale);
		ctx.globalAlpha = img_water.alpha;
		//
		drawSky(img_sky);
		//
		drawWater(img_water);
		//
		if(shipLifes === 1)
		{
			img_ship.x += shipSpeed;
		}
		else if(shipLifes < 1 && shipLifes > 0.4)
		{
			img_ship.x += shipSpeed / 1.2;
		}
		else
		{
			img_ship.x += shipSpeed / 1.5;
		}
		//
		drawShip(img_ship);
		//
		drawExp(canvasMain.getContext("2d"));
		//
		drawIsland(img_island);
		//
		ctx.restore();
		//
		drawExpSplash(canvasMain.getContext("2d"));
		//
		drawAim(img_aim);
		//
		drawIcon(img_ico);
		//
		drawPlate(img_plate, plTxtNum);
		//
		for(var i = 0; i < bullArray.length; i++)
		{
			if(bullArray[i].is === 0)
			{
				if(hitTestShip(bullArray[i].fx, bullArray[i].fy) === true)
				{
					shipLifes -= 1 / 11;
					//
					var hl = {};
					hl.x = bullArray[i].fx - w / 2;
					hl.y = bullArray[i].fy - horizLine - img_cam.camDY;
					hl.rad = 2 + Math.random() * 2;
					holes.push(hl);
				}
				//
				bullArray.splice(i,1);
			}
			else
			{
				drawBullet(bullArray[i]);
			}
		}
		//
		for(var i = 0; i < bullTraceArray.length; i++)
		{
			if(bullTraceArray[i].alpha <= 0)
			{
				bullTraceArray.splice(i,1);
			}
			else
			{
				drawBulletTracer(bullTraceArray[i]);
			}
		}
		//
		if(autoplayFl === true || interactFl === true)
		{
			checkFinBullet();
		}
	}
	else if(bannerState === "packshot")
	{
		ctx.save();
		//
		ctx.translate(w / 2, horizLine);
		//
		ctx.drawImage(img_pack.pic, - w / 2, - horizLine);
		//
		ctx.restore();
	}
	//
	drawDarker(img_darker);
	//
	if((autoplayFl === true || interactFl === true) && (icoText != 0 || shipLifes > 0))
	{
		autoplayTmr ++;
		//
		if(interactFl === true)
		{
			var koef = autoplayTmr / autoplayTmrMax;
			//
			var ctx2 = canvasInteractive.getContext("2d");
			ctx2.save();
			ctx2.translate(1, h - 3);
			ctx2.beginPath();
			ctx2.rect(0, 0, (w - 2) * koef, 2);
			ctx2.fillStyle = "red";
			ctx2.fill();
			ctx2.restore();
		}
		//
		if(autoplayTmr === autoplayTmrMax)
		{
			if(autoplayFl === true)
			{
				autoplayFl = false;
				goAutoplayScenario();
			}
			else if(interactFl === true)
			{
				goPackshot();
			}
			//
			interactFl = false;
		}
	}

	//
	if(restartFl === true)
	{
		autoplayTmr ++;
		
		//
		if(autoplayTmr === restartTmrMax)
		{
			restartFl = false;
			//
			restartBanner();
			//
			hideAgainPlate();
		}
	}

	//
	requestID = window.requestAnimationFrame(update);
}

//
function goAutoplayScenario()
{
	document.getElementById("Interactive").style.cursor = "auto";
	//
	img_aim.x = w / 2;
	img_aim.y = horizLine - 12;
	//
	TweenMax.killTweensOf(img_water);
	TweenMax.killTweensOf(img_aim);
	TweenMax.killTweensOf(img_ico);
	TweenMax.killTweensOf(img_plate);
	//
	TweenMax.to(img_water, 0.8, {scale: 1.5, ease:Power3.easeInOut           });
	TweenMax.to(img_aim,   0.8, {alpha:   1, ease:Power3.easeInOut           });
	TweenMax.to(img_aim,   0.4, {alpha2:  1                                  });
	TweenMax.to(img_ico,   0.8, {x:     260, ease:Power3.easeInOut, delay:0.2});
	TweenMax.to(img_plate, 0.6, {y:   h + 1, ease:Power2.easeOut             });
	//
	TweenMax.delayedCall(1.2, mClick, [null]);
	TweenMax.to(img_ico, 0.8, {x: 260 + 110, ease:Power3.easeInOut, delay:1.5});
	//
	TweenMax.to(img_darker, 1.0, {alpha:1, ease:Power2.easeIn,   delay:1.5, onComplete:function()
		{
			bannerState = "packshot";
			//
			document.getElementById("Interactive").style.cursor = "pointer";
			//
			autoplayTmr = 0;
			restartFl = true;
		}});
	TweenMax.to(img_darker, 0.8, {alpha:0, ease:Power2.easeOut,   delay:2.6});
	TweenMax.delayedCall(3.2, showButton);
	TweenMax.delayedCall(3.4, setAgainPlate);
	TweenMax.delayedCall(3.5, showAgainPlate);
	//
	allowFl = false;
}

//
function goPackshot()
{
	document.getElementById("Interactive").style.cursor = "auto";
	//
	TweenMax.killTweensOf(img_ico);
	TweenMax.killTweensOf(img_plate);
	//
	TweenMax.to(img_plate, 0.6, {y:   h + 1, ease:Power2.easeOut});
	TweenMax.to(img_ico, 0.8, {x: 260 + 110, ease:Power3.easeInOut});
	//
	TweenMax.to(img_darker, 1.0, {alpha:1, ease:Power2.easeIn, onComplete:function()
		{
			bannerState = "packshot";
			//
			document.getElementById("Interactive").style.cursor = "pointer";
			//
			autoplayTmr = 0;
			restartFl = true;
		}});
	TweenMax.to(img_darker, 0.8, {alpha:0, ease:Power2.easeOut,   delay:1.0});
	TweenMax.delayedCall(1.7, showButton);
	//TweenMax.delayedCall(1.9, setAgainPlate);
	TweenMax.delayedCall(2.0, showAgainPlate);
	//
	allowFl = false;
}

//
function goResult(param)
{
	document.getElementById("Interactive").style.cursor = "auto";
	//
	TweenMax.killTweensOf(img_water);
	TweenMax.killTweensOf(img_aim);
	TweenMax.killTweensOf(img_ico);
	TweenMax.killTweensOf(img_plate);
	//
	TweenMax.to(img_water, 0.8, {scale:    1,           ease:Power3.easeInOut, delay:0.2});
	TweenMax.to(img_aim,   0.8, {alpha:    0,           ease:Power3.easeInOut, delay:0.2});
	TweenMax.to(img_aim,   0.4, {alpha2:   0,                                  delay:0.2});
	TweenMax.to(img_ico,   0.8, {x: 260 + 110,           ease:Power3.easeInOut           });
	//
	TweenMax.to(img_plate, 0.6, {y: h - img_plate.height, ease:Power2.easeOut,   delay:0.4});
	TweenMax.to(img_plate, 0.6, {y: h + 1, ease:Power2.easeOut,   delay:3.1});
	//
	TweenMax.to(img_darker, 1.0, {alpha:1, ease:Power2.easeIn,   delay:3.5, onComplete:function()
		{
			bannerState = "packshot";
			//
			document.getElementById("Interactive").style.cursor = "pointer";
			//
			autoplayTmr = 0;
			restartFl = true;
		}});
	TweenMax.to(img_darker, 0.8, {alpha:0, ease:Power2.easeOut,   delay:4.6});
	TweenMax.delayedCall(5.2, showButton);
	//TweenMax.delayedCall(5.4, setAgainPlate);
	TweenMax.delayedCall(5.5, showAgainPlate);
	//
	allowFl = false;
	autoplayFl = false;
	interactFl = false;
	autoplayTmr = 0;
}

//
function restartBanner()
{
	hideButton();
	TweenMax.to(img_darker, 1.0, {alpha:1, ease:Power2.easeIn, onComplete:function()
		{
			TweenMax.to(img_darker, 0.8, {alpha:0, ease:Power2.easeOut});
			//
			bannerState = "interaction";
			//
			waterMapArray = [];
			bullArray = [];
			bullTraceArray = [];
			smokes = [];
			fireArray = [];
			expSplashArray = [];
			expArray = [];
			holes = [];
			//
			smokeName = 0;
			smokeCount = 0;
			plTxtNum = 1;
			icoText = 3;
			shipLifes = 1;
			waveX = 0;
			//
			autoplayTmr = 0;
			allowFl = true;
			restartFl = false;
			//
			canvasInteractive.removeEventListener('mouseover', mOver, false);
			canvasInteractive.removeEventListener('mouseout', mOut, false);
			canvasInteractive.removeEventListener('mousemove', mMove, false);
			canvasInteractive.removeEventListener('click', mClick, false);
			//
			init();
		}});
}

//
function mOver(evt)
{
	overFl = true;

	//
	if(bannerState === "interaction" && allowFl === true) /// && (autoplayFl === true || interactFl === true))
	{
		document.getElementById("Interactive").style.cursor = "none";
		//
		TweenMax.killTweensOf(img_water);
		TweenMax.killTweensOf(img_aim);
		TweenMax.killTweensOf(img_ico);
		TweenMax.killTweensOf(img_plate);
		//
		TweenMax.to(img_water, 0.8, {scale: 1.5, ease:Power3.easeInOut           });
		TweenMax.to(img_aim,   0.8, {alpha:   1, ease:Power3.easeInOut           });
		TweenMax.to(img_aim,   0.4, {alpha2:  1                                  });
		TweenMax.to(img_ico,   0.8, {x:     260, ease:Power3.easeInOut, delay:0.2});
		TweenMax.to(img_plate, 0.6, {y:   h + 1, ease:Power2.easeOut             });
		//
		autoplayFl = false;
		//
		if(interactFl === false)
		{
			interactFl = true;
			autoplayTmr = 0;
		}
	}
	//
	checkMouseStyle();
}

//
function mOut(evt)
{
	overFl = false;
	//
	if(img_cam.isShoot === false && bannerState === "interaction" && allowFl === true)
	{
		document.getElementById("Interactive").style.cursor = "auto";
		//
		TweenMax.killTweensOf(img_water);
		TweenMax.killTweensOf(img_aim);
		TweenMax.killTweensOf(img_ico);
		TweenMax.killTweensOf(img_plate);
		//
		TweenMax.to(img_water, 0.8, {scale:    1,           ease:Power3.easeInOut, delay:0.2});
		TweenMax.to(img_aim,   0.8, {alpha:    0,           ease:Power3.easeInOut, delay:0.2});
		TweenMax.to(img_aim,   0.4, {alpha2:   0,                                  delay:0.2});
		TweenMax.to(img_ico,   0.8, {x: 260 + 110,           ease:Power3.easeInOut           });
		TweenMax.to(img_plate, 0.6, {y: h - img_plate.height, ease:Power2.easeOut,   delay:0.4});
	}
}

// mouse move
function mMove(evt)
{
	if(overFl === false)
	{
		mOver(null);
	}
	//
	if(evt)
	{
		mousePos = getMousePos(evt);
		//
		if(allowFl === true)
		{
			img_aim.x = mousePos.x;
			img_aim.y = mousePos.y;
		}
	}
	//
	checkMouseStyle();
}

//
function mClick(evt)
{
	if(img_cam.isShoot === false && bannerState === "interaction" && (allowFl === true || evt === null))
	{
		img_cam.isShoot = true;
		//
		icoText --;
		//
		TweenMax.to(img_cam, 0.2, {camDY: 20, ease:Sine.easeIn});
		TweenMax.to(img_cam, 0.4, {camDY: -9, ease:Sine.easeOut, delay:0.2});
		TweenMax.to(img_cam, 0.2, {camDY: 4, ease:Sine.easeIn, delay:0.6});
		TweenMax.to(img_cam, 0.3, {camDY: 0, ease:Power0.easeNone, delay:0.8});
		//
		addBullet(w / 2 - 350, h + 100, img_aim.x - Math.random() * 10, img_aim.y + amplY * Math.sin(img_aim.ang));
		addBullet(w / 2 + 350, h + 100, img_aim.x + Math.random() * 10, img_aim.y + amplY * Math.sin(img_aim.ang));
		addBullet(w / 2 - 270, h + 100, img_aim.x - Math.random() * 10, img_aim.y + amplY * Math.sin(img_aim.ang));
		addBullet(w / 2 + 270, h + 100, img_aim.x + Math.random() * 10, img_aim.y + amplY * Math.sin(img_aim.ang));
		addBullet(w / 2 - 40,  h + 100, img_aim.x - Math.random() * 5,  img_aim.y + amplY * Math.sin(img_aim.ang));
		addBullet(w / 2 + 40,  h + 100, img_aim.x + Math.random() * 5,  img_aim.y + amplY * Math.sin(img_aim.ang));
	}
	else if (bannerState === "packshot" && againPlate.isOver === false)
	{
		setURL();
	}
}

//
function checkMouseStyle()
{
	if (bannerState === "packshot" && againPlate.isOver === false)
	{
		document.getElementById("Interactive").style.cursor = "pointer";
	}
	else if (bannerState === "packshot" && againPlate.isOver === true)
	{
		document.getElementById("Interactive").style.cursor = "auto";
	}
}

/////////////////////////////////////////////// SERVICE
function getMousePos(evt)
{
   var rect = canvasInteractive.getBoundingClientRect();
   return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
   };
}

//
function loadImages(imagesToBeLoaded, drawCallback)
{
	var imagesLoaded = {};
	var loadedImages = 0;
	var numberOfImagesToLoad = 0;
	//
	for(var name in imagesToBeLoaded)
	{
		numberOfImagesToLoad++;
	}
	
	for(var name in imagesToBeLoaded)
	{
		imagesLoaded[name] = new Image();
		imagesLoaded[name].onload = function()
		{
			if(++loadedImages >= numberOfImagesToLoad)
			{
				drawCallback(imagesLoaded);
			}
		};
		//
		imagesLoaded[name].src = imagesToBeLoaded[name];
	}
}

//
function setURL()
{
	ExitApi.exit();
}

//
function clearAll()
{
	clearCanvas(canvasInteractive);
	clearCanvas(canvasMain);
}

//
function clearCanvas(canv)
{
	var ctx = canv.getContext("2d");
	//
	ctx.clearRect(0, 0, w, h);
}

// Convert To Radians
function radian(a)
{
	return a * Math.PI / 180;
}

////////////////////////////////////////////////////////////////////////////////////// ACTIONS
window.onLoad = start();