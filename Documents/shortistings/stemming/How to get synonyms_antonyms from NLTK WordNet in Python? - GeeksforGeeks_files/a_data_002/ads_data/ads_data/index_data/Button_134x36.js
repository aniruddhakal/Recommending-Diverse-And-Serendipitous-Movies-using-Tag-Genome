/* -------------------------------------------------------------------------------------
--------------                        WARGAMING.NET                       --------------
----------------------------------------------------------------------------------------
--------------                 © 2017 ALL RIGHTS RESERVED                 --------------
----------------------------------------------------------------------------------------
--------------                        VERSION: 1.20                       --------------
--------------------------------------------------------------------------------------*/

var Button = {}
Button.ang = 0;
Button.alpha = 0;
Button.isOver = false;
Button.clickable = true;
Button.ownCanvas = false;
Button.rotation = 0;
Button.dy = 60;

Button.width = 134;
Button.height = 36;

Button.shape = new createjs.Shape();
Button.shape.graphics.c().s().p("AkcOfQmxhRlEBRQjlBBjlhBIAAgzIAAgDIAA8pMAu2AAAIAAcpIAAADIAAAzQl/hRm2BRQj1AijxAAQjvAAjtgig");
Button.vWaves = new Array();
Button.gWaves = new Array();

var drawButton = function(ctx) {
	//if(Button.ownCanvas)
	//{
	//	ctx.clearRect(0, 0, w, h);
	//}
	
	ctx.save();
	ctx.translate(Button.x,Button.y);
	ctx.scale(Button.scale,Button.scale);
	ctx.rotate(Button.rotation)
	ctx.globalAlpha = Button.alpha;

	/*ctx.shadowColor = "black";
	ctx.shadowBlur = 10;
	ctx.shadowOffsetY = 2;*/
	//ctx.fillStyle = "#000000";
	//ctx.fillRect(-120, -36, 240, 36+18);
	
	ctx.translate(0, -64);

	ctx.beginPath();
	ctx.rect(-75,20,150, 70);
	ctx.clip();
	ctx.translate(0, 64 + Button.dy);
	ctx.rotate(Button.rotation)
	
	//ctx.fillStyle = "red";
	//ctx.fillRect(-Button.width/2, -Button.height/2, Button.width, Button.height);
	//ctx.shadowColor = "transparent";
		
	/*
	ctx.shadowColor = "#8E1A0D";
	ctx.shadowBlur = 0; 
	ctx.shadowOffsetX = 1;
	ctx.shadowOffsetY = 1;*/
	ctx.shadowColor = "rgba(0,0,0,0.6)";
	ctx.shadowBlur = 8;
	ctx.shadowOffsetY = 1;
	ctx.drawImage(images.Button, -67, -18);
	ctx.shadowColor = "transparent";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillStyle = "#FFFFFF";
	
	//drawButtonText1_En
	ctx.font = "bold 11pt "+font;
	ctx.fillText("PLAY FOR FREE", 0, 0);
//	
	ctx.restore();
	ctx.save();
	ctx.translate(Button.x,Button.y);
	ctx.scale(Button.scale,Button.scale);
	for(var i = 0; i < Button.vWaves.length; i++)
	{
		var wave = Button.vWaves[i];
		ctx.save();
			ctx.translate(wave.x, wave.y+Button.dy);
			ctx.scale(wave.scaleX, wave.scaleY);
			ctx.globalAlpha = wave.alpha;
			ctx.drawImage(images.ButtonWave, -15, 0);
		ctx.restore();
	}
	for(var i = 0; i < Button.gWaves.length; i++)
	{
		var wave = Button.gWaves[i];
		ctx.save();
			ctx.translate(wave.x, wave.y);
			ctx.rotate(radian(90));
			
			ctx.scale(wave.scaleX, wave.scaleY);			
			ctx.globalAlpha = wave.alpha;			
			ctx.drawImage(images.ButtonWave, -15, -30);			
		ctx.restore();
	}
	ctx.restore();
};

function showButton()
{
	Button.alpha = 1;
	Button.scale = 1;
	Button.dy = 140;
	Button.isOver = false;
	Button.outComp = true;	
	Button.rotation = 0.2;
	setButtonMouse();
	//TweenMax.from(Button, 0.8, {scale:1, alpha:0, ease: Bounce.easeOut, onUpdate:onUpdateButton, onUpdateParams:[Button.ctx]});
	TweenMax.to(Button, 1.5, {dy:0, ease: Back.easeOut, onUpdate:onUpdateButton, onUpdateParams:[Button.ctx]});
	TweenMax.to(Button, 1.9, {delay:0.2, rotation:0, ease: Back.easeOut});
	
	Button.vWaves = new Array();
	for(var i = 0; i < 10; i++)
	{
		var wave = {};
		wave.x = -Button.width/2+Math.random()*10-5;
		wave.y = -Button.height/2-10;
		wave.scaleX = 0.4*randomMinus()+Math.random()*0.4;
		wave.scaleY = 0.2;
		wave.alpha = 0;
		var delay = Math.random()*0.5;
		TweenMax.to(wave, 0.2, {delay: delay, alpha:0.7, ease: Power0.easeOut});
		TweenMax.to(wave, 1.4, {delay: delay, scaleY:1+Math.random()*3, y: wave.y+120,  ease: Power0.easeOut});
		TweenMax.to(wave, 0.3, {delay: delay+1.1, alpha:0,  ease: Power2.easeOut});
		Button.vWaves.push(wave);
	}
	
	for(var i = 0; i < 6; i++)
	{
		var wave = {};
		wave.x = Math.random()*20+10;
		wave.y = -Button.height/2-10;
		wave.scaleX = 0.6*randomMinus()+Math.random()*0.4;
		wave.scaleY = 0.2;
		wave.alpha = 0;
		var delay = Math.random()*0.6+0.1;
		TweenMax.to(wave, 0.2, {delay: delay, alpha:0.7, ease: Power0.easeOut});
		TweenMax.to(wave, 1.4, {delay: delay, scaleY:1+Math.random()*3, y: wave.y+120,  ease: Power0.easeOut});
		TweenMax.to(wave, 0.3, {delay: delay+1.1, alpha:0,  ease: Power2.easeOut});
		Button.vWaves.push(wave);
	}
	
	for(var i = 0; i < 6; i++)
	{
		var wave = {};
		wave.x = Button.width/2+Math.random()*10-5;
		wave.y = -Button.height/2-10;
		wave.scaleX = 0.4*randomMinus()+Math.random()*0.2;
		wave.scaleY = 0.2;
		wave.alpha = 0;
		var delay = Math.random()*0.6+0.3;
		TweenMax.to(wave, 0.2, {delay: delay, alpha:0.7, ease: Power0.easeOut});
		TweenMax.to(wave, 1.4, {delay: delay, scaleY:1+Math.random()*3, y: wave.y+120,  ease: Power0.easeOut});
		TweenMax.to(wave, 0.3, {delay: delay+1.1, alpha:0,  ease: Power2.easeOut});
		Button.vWaves.push(wave);
	}
	
	for(var i = 0; i < 6; i++)
	{
		var wave = {};
		wave.x = Math.random()*40;
		wave.x = -Button.width/2 + Button.width/10*i+20;
		wave.y = 16+Math.random()*6;
		wave.alpha = 0;
		wave.minus = randomMinus();
		//wave.minus = -1;
		wave.scaleX = 0.1;
		wave.scaleY = 0.1*wave.minus;
		wave.sScale = Math.random()*0.5+0.4;
		var delay = Math.random()*0.5;
		//delay = i/10;
		TweenMax.to(wave, 0.2, {delay: delay, alpha:Math.random()*0.2+0.6, ease: Power0.easeOut});
		TweenMax.to(wave, 0.8+Math.random()*0.4, {delay: delay, scaleX :wave.sScale*0.6, scaleY:wave.sScale*1*wave.minus,  ease: Back.easeOut});
		TweenMax.to(wave, 1.6, {delay: delay+0.1, x :wave.x + (Math.random()*40+16)*wave.minus, y: wave.y + wave.sScale*6,  ease: Power0.easeOut});
		TweenMax.to(wave, 0.2, {delay: delay+1.6, alpha:0, scaleX:wave.sScale*0.4, scaleX:wave.sScale*0.4, ease: Power0.easeOut});
		Button.gWaves.push(wave);
		
	}
}

function setButtonMouse()
{
	//canvasInteractive.addEventListener('mousemove', buttonMove, false);
	//canvasInteractive.addEventListener('mouseout', buttonOut, false);	
	canvasInteractive.addEventListener('click', buttonClick, false);	
	if(Button.glowCounter < Button.glowMax)
	{
		showGlow();
	}	
}

function showGlow()
{	
	Button.glowCounter++;
	Button.glowAng =  -Math.PI/2;
	TweenMax.to(Button, 2, {glowAng:3*Math.PI/2, ease:Power1.easeOut});	
	if(Button.glowCounter < Button.glowMax)
	{
		TweenMax.delayedCall(5, showGlow);
	}	
}

function buttonClick(evt)
{
	mousePos = getMousePos(evt);
	if(hitTestButton(mousePos)==true&&Button.clickable==true)
	{
        //tl.seek("fin");
		//setURL();
	}
}

function buttonMove(evt)
{
	mousePos = getMousePos(evt);
	if(Button.isOver==false&&hitTestButton(mousePos)==true)
	{
		Button.isOver = true;				
		buttonOver();
	}	
	if(Button.isOver==true&&hitTestButton(mousePos)==false)
	{
		Button.isOver = false;					
		buttonOut();
	}
}

function hitTestButton(mousePos)
{
	var leftBorder = Button.x - 134*Button.scale/2;
	var topBorder = Button.y - 36*Button.scale/2;
	if(mousePos.x > leftBorder && mousePos.x < (leftBorder + 134*Button.scale) && mousePos.y > topBorder && mousePos.y < topBorder + 36*Button.scale)
	{		
		return true;
	}
	else
	{	
		return false;	
	}		
}

function hideButton()
{
	TweenMax.killTweensOf(Button);
	TweenMax.to(Button, 0.2, {alpha:0, scale:0.8, ease:Power1.easeOut, onUpdate:onUpdateButton, onUpdateParams:[Button.ctx]});
	canvasInteractive.removeEventListener('mousemove', buttonMove, false);
	canvasInteractive.removeEventListener('mouseout', buttonOut, false);	
	canvasInteractive.removeEventListener('click', buttonClick, false);
	Button.isOver = false;
}

function buttonOver(e)
{		
	Button.outComp = true;
	TweenMax.to(Button, 0.2, {scale:1.14, ease: Back.easeOut, onUpdate:onUpdateButton, onUpdateParams:[Button.ctx]});				
}
function buttonOut(e)
{	
	if(Button.outComp==true)
	{
		Button.outComp = false;
		TweenMax.to(Button, 0.2, {scale:1, ease: Back.easeOut, onUpdate:onUpdateButton, onUpdateParams:[Button.ctx], onComplete:function (){Button.outComp = true;}});
	}
}

function onUpdateButton(ctx)
{
	
}
