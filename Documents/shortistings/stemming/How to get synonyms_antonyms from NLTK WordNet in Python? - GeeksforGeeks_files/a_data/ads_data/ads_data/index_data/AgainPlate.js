var againPlate = {};
var ctxAgain;

//
function setAgainPlate()
{
	var againCanvas = document.createElement('canvas');
	againCanvas.id = "AgainPlate";
	againCanvas.width = w;
	againCanvas.height = h;
	againCanvas.style.zIndex = 50;
	againCanvas.style.position = "absolute";
	againCanvas.style.left = 0;
	againCanvas.style.top = 0;
	//
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(againCanvas);
	//
	againCanvas = document.querySelector("#AgainPlate");
	//
	ctxAgain = againCanvas.getContext('2d');
	//
	againPlate.x = w/2;
	againPlate.sy = h;
	againPlate.y = againPlate.sy;
	againPlate.isOver = false;
	againPlate.alpha = 0.6;
	
}

//
function hideAgainPlate()
{
	TweenLite.to(againPlate, 0.4, {y: h,  ease:Power2.easeOut, onUpdate:drawAgainPate});
	//
	canvasInteractive.removeEventListener('mousemove', againHitTest, false);
	canvasInteractive.removeEventListener('click', againClick, false);
	canvasInteractive.removeEventListener('mouseout', againOut, false);
}

//
function showAgainPlate()
{
	againPlate.isOver = false;	
	againPlate.alpha = 0.6;
	//
	TweenLite.to(againPlate, 0.4, {y: h-19,  ease:Power2.easeOut, onUpdate:drawAgainPate});
	canvasInteractive.addEventListener('mousemove', againHitTest, false);
	canvasInteractive.addEventListener('click', againClick, false);
	canvasInteractive.addEventListener('mouseout', againOut, false);
}

//
function againClick(evt)
{
	//mousePos = getMousePos(evt);
	//
	if(mousePos.y>againPlate.y&&mousePos.x>againPlate.x-168&&mousePos.x<againPlate.x+168)
	{
		TweenLite.killDelayedCallsTo(restartBanner);
		restartBanner();
		hideAgainPlate();
	}
}

//
function againHitTest(evt)
{
	//mousePos = getMousePos(evt);
	//
	if(mousePos.y>againPlate.y&&againPlate.isOver==false&&mousePos.x>againPlate.x-168&&mousePos.x<againPlate.x+168)
	{				
		againOver();				
	}
	//
	if(mousePos.y<againPlate.y&&againPlate.isOver==true||mousePos.x<againPlate.x-168||mousePos.x>againPlate.x+168)
	{				
		againOut();				
	}
}

//
function againOver()
{
	againPlate.isOver=true;
	//
	document.getElementById("Interactive").style.cursor = "auto";	
	//
	TweenLite.killTweensOf(againPlate);				
	TweenLite.to(againPlate, 0.4, {y:h - 22, alpha:0.9, ease:Elastic.easeOut, onUpdate:drawAgainPate});
}

//
function againOut()
{
	againPlate.isOver=false;
	//
	document.getElementById("Interactive").style.cursor = "pointer";
	//
	TweenLite.killTweensOf(againPlate);
	TweenLite.to(againPlate, 0.2, {y:h - 19, alpha:0.6, ease: Power2.easeOut, onUpdate:drawAgainPate});
}

//
function drawAgainPate()
{
	var ctx = ctxAgain;
	ctx.clearRect(0,0,w,h);
	ctx.save();
	ctx.translate(againPlate.x,againPlate.y);
	ctx.globalAlpha = againPlate.alpha;
	var plateGrad = ctx.createLinearGradient(-140,0,140,0);
	plateGrad.addColorStop(0, "rgba(140, 140, 140, 0)");
	plateGrad.addColorStop(0.33, "rgba(140, 140, 140, 1)");
	plateGrad.addColorStop(0.66, "rgba(140, 140, 140, 1)");
	plateGrad.addColorStop(1, "rgba(140, 140, 140, 0)");
	ctx.fillStyle = plateGrad;		
	ctx.fillRect(-w/2,0,w + 40,34);	
	ctx.font = 'bold 8pt '+font;			
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";		
	ctx.fillStyle = "#ffffff";
	ctx.fillText(againText, 0, 10);		
	ctx.restore();
}