/* -------------------------------------------------------------------------------------
--------------                        WARGAMING.NET                       --------------
----------------------------------------------------------------------------------------
--------------                 © 2017 ALL RIGHTS RESERVED                 --------------
----------------------------------------------------------------------------------------
--------------                        VERSION: 1.02                       --------------
--------------------------------------------------------------------------------------*/
function newTextPlate(x, y, scale, maxWidth, alpha, width, height)
{
	this.draw = drawTextPlate;
	this.show = showText;
	this.hide = hideText;
	this.showTextPlate = showTextPlate;
	this.hideTextPlate = hideTextPlate;
	this.set = setText;
	this.textArray = new Array();
	this.animText = new Array();
	this.textAlign = "center";
	
	x = typeof x !== 'undefined' ? x : 0;
	y = typeof y !== 'undefined' ? y : 0;
	scale = typeof scale !== 'undefined' ? scale : 1;
	maxWidth = typeof maxWidth !== 'undefined' ? maxWidth : 250;
	alpha = typeof alpha !== 'undefined' ? alpha : 1;
	width = typeof width !== 'undefined' ? width : w;
	height = typeof height !== 'undefined' ? height : 200;	
	this.x = x;
	this.y = y;
	this.sy = y;
	this.sx = x;
	this.scale = scale;
	this.maxWidth = maxWidth;
	this.alpha = alpha;
	this.width = width;
	this.height = height;	
	this.ang = 0;	
}



function drawTextPlate(ctx)
{	

	this.ang += 0.06;
	ctx.save();
		ctx.translate(this.x, this.y);
		/*if(this.bg)
		{
			ctx.globalAlpha = this.bgAlpha;
			ctx.drawImage(this.bg, -this.bg.width/2, -this.bg.height/2);
			ctx.globalAlpha = 1;
		}*/
		ctx.scale(this.scale, this.scale);
		ctx.fillStyle = "#ffffff";		
		ctx.textBaseline = "middle";
		ctx.textAlign = this.textAlign;	
		
		//ctx.shadowColor = "rgba(0,0,0,1)";
		//ctx.shadowBlur = 4;
		//ctx.shadowOffsetY = 0;
		for(var i =0; i<this.animText.length;i++)
		{
			
			ctx.fillStyle = "rgba("+this.animText[i].color+", "+trueAlpha(this.animText[i].alpha)+")";		
		
			ctx.font = this.animText[i].font;	
		
			var scale = 1;	
		
			if(ctx.measureText(this.animText[i].text.replace("$", "").replace("%", "")).width > this.animText[i].maxWidth)
			{	
				//scale = this.animText[i].maxWidth / ctx.measureText(this.animText[i].text).width;	
				scale = this.animText[i].maxWidth / ctx.measureText(this.animText[i].text.replace("$", "").replace("%", "")).width;	
				
			}				
			ctx.save();
			ctx.translate(0, this.animText[i].y);			
			ctx.scale(scale*this.animText[i].scale,scale*this.animText[i].scale);	
			ctx.shadowColor = "rgba(0,0,0,1)";
	ctx.shadowBlur = 3;
			
			ctx.strokeStyle = "rgba(0,0,0,"+trueAlpha(this.animText[i].alpha)+")";
			ctx.lineWidth = 2;
			ctx.strokeText(this.animText[i].text, this.animText[i].x, 0);
			ctx.fillText(this.animText[i].text, this.animText[i].x, 0);
			
			
			//ctx.fillText(this.animText[i].text, this.animText[i].x / scale, 0);			
			ctx.shadowColor = "transparent";	
			ctx.restore();
			
		}
	ctx.restore();
}

function setText(frame)
{
	var textPlate = this;
	textPlate.animText = new Array();		
	var textArray = new Array();
	for(var i=frame.startIndex; i<frame.length+frame.startIndex;i++)
	{
		textArray.push(i);
	}		
	for(var i=0;i<textArray.length;i++)
	{
		textPlate.textArray[textArray[i]].alpha = 1;
		textPlate.textArray[textArray[i]].x = textPlate.textArray[textArray[i]].sx;		
		textPlate.animText.push(textPlate.textArray[textArray[i]]);
	}		
	
}

function showText(frame, delay)
{	
	
	var textPlate = this;
	for(var i=0;i<textPlate.animText.length;i++)
	{		
		TweenMax.killTweensOf(textPlate.animText[i]);		
		TweenMax.to(textPlate.animText[i], 0.1,{delay: (textPlate.animText.length-i)/8, x:textPlate.animText[i].sx-100, alpha:0, ease:Circ.easeIn});				
	}
	TweenMax.delayedCall(textPlate.animText.length/8+0.2, function ()
	{
		textPlate.animText.splice(0,textPlate.animText.length);
		textPlate.animText = new Array();		
		textArray = new Array();
		for(var i=frame.startIndex; i<frame.length+frame.startIndex;i++)
		{
			textArray.push(i);
		}		
		for(var i=0;i<textArray.length;i++)
		{
			textPlate.textArray[textArray[i]].alpha = 0;
			textPlate.textArray[textArray[i]].x = textPlate.textArray[textArray[i]].sx;
			textPlate.textArray[textArray[i]].scale = 2.6;
			//console.log(textPlate.textArray[textArray[i]])
			
			TweenMax.to(textPlate.textArray[textArray[i]], 0.2,{delay: i/8, /*x:textPlate.textArray[textArray[i]].sx,*/ scale:1, alpha:1, ease:Circ.easeOut});		
			if(delay)
			{
				TweenMax.to(textPlate.textArray[textArray[i]], 0.1,{delay: (textArray.length-i)/8+delay, /*y:textPlate.textArray[textArray[i]].sx-100,*/ alpha:0, ease:Circ.easeIn});
			}
			textPlate.animText.push(textPlate.textArray[textArray[i]]);
		}		
	});	
}
function hideText()
{
	for(var i=0;i<this.animText.length;i++)
	{		
		TweenMax.killTweensOf(this.animText[i]);		
		TweenMax.to(this.animText[i], 0.1,{delay: (this.animText.length-i)/8,/* x:this.animText[i].sx-100,*/ scale:0, alpha:0, ease:Circ.easeIn});
	}
}
function stringFrame(textPlate, text, font, textHeight)
{
	
	textHeight = typeof textHeight !== 'undefined' ? textHeight : 28;	
	
	this.textArray = text;
	this.textHeight = textHeight;
	this.startIndex = textPlate.textArray.length;
	this.length = text.length;
	this.maxWidth = textPlate.maxWidth;	
	
	for(var i = 0; i < this.textArray.length; i++)
	{
		var textObj = {};
		textObj.scale = 1;		
		textObj.sx = 0;		
		textObj.sy = -this.textHeight * (this.textArray.length-1) / 2 + this.textHeight * i;
		textObj.x = textObj.sx;
		textObj.y = textObj.sy;	
		textObj.alpha = 1;
		textObj.font = font;	
		textObj.text = this.textArray[i];
		textObj.maxWidth = textPlate.maxWidth;	
		textObj.color = textPlate.color;
		textPlate.textArray.push(textObj);
	}	
}
function showTextPlate()
{	
	TweenMax.to(this, 0.3, {bgAlpha: 0.7,  ease:Sine.easeOut});	
}



function hideTextPlate()
{
	TweenMax.to(this, 0.3, {bgAlpha: 0,  ease:Sine.easeOut});	
}




function drawTextPlateElemets(textPlate)
{
	if(!textPlate.bg)
	{
		var nCanvas = document.createElement("CANVAS");			
		nCanvas.width = w;
		nCanvas.height = textPlate.height;	
		var ctx = nCanvas.getContext('2d');
		iPattern = ctx.createPattern(Pattern.pic, 'repeat');
		ctx.fillStyle = iPattern;		
		ctx.fillRect(0, 0, w, textPlate.height);
		ctx.globalCompositeOperation = "source-in";	
		
		var g = ctx.createRadialGradient(w/2+30, -30, 26, w/2+30, -30, 250);
		g.addColorStop(0,   "rgba(0, 0, 0, 0)");
		g.addColorStop(1, "rgba(0, 0, 0, 0.8)");		
		ctx.fillStyle = g;	
		ctx.fillRect(0, 0, w, textPlate.height);
			
		textPlate.pattern = nCanvas;
		
		var nCanvas = document.createElement("CANVAS");			
		nCanvas.width = w;
		nCanvas.height = textPlate.height;	
		var ctx = nCanvas.getContext('2d');
		var g = ctx.createRadialGradient(w/2+30, -30, 26, w/2+30, -30, 250);
		g.addColorStop(0,   "rgba(0, 159, 255, 0.75)");
		g.addColorStop(1, "rgba(0, 159, 255, 0.75)");		
		ctx.fillStyle = g;	
		ctx.fillRect(0, 0, w, textPlate.height);
		//ctx.drawImage(textPlate.pattern, 0, 0);
		var grd = ctx.createLinearGradient(0, 0, w, 0);
		grd.addColorStop(0, "rgba(123, 200, 211, 0.2)");
		grd.addColorStop(0.6, "rgba(123, 200, 211, 0.9)");
		grd.addColorStop(0.9, "rgba(123, 200, 211, 1)");
		grd.addColorStop(1, "rgba(123, 200, 211, 0.4)");			
		ctx.strokeStyle = grd;	
		ctx.moveTo(0, 0);
		ctx.lineTo(w, 0);
		ctx.shadowColor = "rgba(0,0,0,1)";
	ctx.shadowBlur = 3;
		ctx.stroke();
		textPlate.bg = nCanvas;
		//canvasInteractive.getContext('2d').drawImage(nCanvas,0,0)
	}	
}

function drawTextPlateElemets2(textPlate)
{
	if(!textPlate.bg)
	{
		var nCanvas = document.createElement("CANVAS");			
		nCanvas.width = w;
		nCanvas.height = h;	
		var ctx = nCanvas.getContext('2d');
		var grd = ctx.createLinearGradient(0, 0, 0, h);
		grd.addColorStop(0, "rgba(13, 60, 101, 1)");
		grd.addColorStop(0.3, "rgba(7, 39, 68, 1)");
		grd.addColorStop(0.7, "rgba(7, 39, 68, 1)");
		grd.addColorStop(1, "rgba(13, 60, 101, 1)");			
		ctx.fillStyle = grd;
		ctx.fillRect(0,0,w,h)
		textPlate.bg2 = nCanvas;
		//canvasInteractive.getContext('2d').drawImage(nCanvas,0,0)
	}	
}
