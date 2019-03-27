 function aimImgAnim()
 {
	aimImg.rotate = 0;
	aimImg.dRadius = 0;
	TweenMax.to(aimImg, 0.8, {rotate:270,  ease:Power1.easeInOut});
	TweenMax.to(aimImg, 0.8, { dRadius:180,  ease:Power2.easeInOut});
	TweenMax.delayedCall(3,aimImgAnim);
 }

 
 function drawAimImg(ctx)
{
	//shipHitTest(aimImg.x, aimImg.y);
	/*if(shipHitTest(aimImg.x, aimImg.y)&&!islandHitTest(aimImg.x, aimImg.y))
	{
		//aimImg.x += (shipImg.x-aimImg.x+40)/10;
		//aimImg.y += (shipImg.y-16-aimImg.y)/10;
		aimImg.color = "rgba(0,255,0,"+trueAlpha(aimImg.darkerAlpha)+")";		
		aimImg.fx += shipImg.speed*cam.scale;
	}
	else
	{			
		aimImg.color = "rgba(255,0,0,"+trueAlpha(aimImg.darkerAlpha)+")";		
	}*/
	
	
	aimImg.reload --;
	aimImg.color = "rgba(255,0,0,"+trueAlpha(aimImg.darkerAlpha)+")";		
	if(isInteractive && overFl)
	{
		aimImg.x += (mousePos.x-aimImg.x)/10;
		aimImg.y += (mousePos.y-aimImg.y)/10;
	}
	else
	{	
		
		aimImg.fx = cam.x + Math.sin(aimImg.ang * 0.1)*20;
		aimImg.fy = cam.y;
		
		aimImg.x += (aimImg.fx-aimImg.x)/10;
		aimImg.y += (aimImg.fy-aimImg.y)/10;
	}
	
	//drawAimImgDarker(ctx);
	
	ctx.save();
	ctx.translate(aimImg.x, aimImg.y);
	ctx.scale(cam.scale, cam.scale);		
		aimImg.ang+=0.2;
		aimImg.radius = 12+Math.sin(aimImg.ang)*2;
		aimImg.radius = 12;
		aimImg.rotate = 0;
		ctx.strokeStyle = "rgba(255, 0, 0, " + trueAlpha(aimImg.darkerAlpha)  + ")";
		ctx.lineWidth = 2;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		
		//ctx.shadowColor = "rgba(0,0,0,0.4)";
		ctx.shadowBlur = 5; 
		
		ctx.beginPath();
			ctx.moveTo(-8,10);
			ctx.lineTo(0,0);
			ctx.lineTo(8,10);
		//ctx.closePath();
		ctx.stroke();
		
	/*	//
		ctx.beginPath();
		ctx.arc(0, 0, aimImg.radius, radian(20+aimImg.rotate), radian(70+aimImg.rotate));
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(0, 0, aimImg.radius, radian(110+aimImg.rotate), radian(160+aimImg.rotate));
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(0, 0, aimImg.radius, radian(200+aimImg.rotate), radian(250+aimImg.rotate));
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(0, 0, aimImg.radius, radian(290+aimImg.rotate), radian(340+aimImg.rotate));	
		ctx.stroke();*/
		
		if(aimImg.darkerAlpha>0)
		{
			ctx.lineWidth = 2;
			var r1 = aimImg.r1*aimImg.scale;
			var r2 = aimImg.r2;
			
			//aimImg.r1 = r1;
			//aimImg.r2 = r2;
			ctx.strokeStyle = "rgba(0, 0, 0, " + trueAlpha(aimImg.darkerAlpha)  + ")";	
			ctx.beginPath();			
			ctx.arc(0, 0, r1, 0, 2*Math.PI);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo( - r1, 0);
			ctx.lineTo( - r1 + r1*0.24, 0);
			ctx.moveTo( r1, 0);
			ctx.lineTo( r1 - r1*0.24, 0);
			ctx.moveTo( 0, - r1);
			ctx.lineTo( 0, - r1 + r1*0.24);
			ctx.moveTo( 0, r1);
			ctx.lineTo( 0, r1 - r1*0.24);			
			
			ctx.stroke();		
		}
		
		ctx.shadowColor = "transparent";
		aimImg.fingerAng += 0.06;
		ctx.globalAlpha = trueAlpha(aimImg.fingerAlpha*aimImg.darkerAlpha);
		//ctx.drawImage(images.finger, -13, 26);
	ctx.restore();
}



function showAimImg()
{
	aimImg.enable = true;	
	TweenMax.to(aimImg, 1, { darkerAlpha:1, ease:Power2.easeOut});	
	//TweenMax.to(timerImg, 0.6, {y:timerImg.sy-timerImg.height, ease:Power2.easeOut});		
}

function hideAimImg()
{
	aimImg.enable = false;
	TweenMax.to(aimImg, 1, { darkerAlpha:0, ease:Power2.easeOut});	
	//TweenMax.to(timerImg, 0.6, {y:timerImg.sy, ease:Power2.easeOut});	
}