/* -------------------------------------------------------------------------------------
--------------                        WARGAMING.NET                       --------------
----------------------------------------------------------------------------------------
--------------                 © 2017 ALL RIGHTS RESERVED                 --------------
--------------------------------------------------------------------------------------*/

function drawIslandElements()
{
	var nCanvas = document.createElement("CANVAS");	
	nCanvas.width = 190;
	nCanvas.height = 67+10;	
	var ctx = nCanvas.getContext('2d');	
	islandImg1.shape = new cjs.Shape();
	islandImg1.shape.graphics.bf(images.islands, null, new cjs.Matrix2D(1,0,0,1,-96.3,-31.1)).s().p("AugEnIA3g1IANgFIAEgQIAbgTIAyhAIAHgFIADgYQAjg3AzgjIA1gtIAMg4IAqgdIAaATIAfA6IA1gBIAgAOIAwgXIALAJIAsggIA3ABIAWgdIAHgRIAwg8IBrhkIAlgYIAPASIA/ANIASAWIBQAzIAlgHIBFAiIBjAMIBGAkIATAYIgCAdIAiAaIAaAgIA7AVIAQA4ICYBEIAvAfIA1ADICBBjIgRAZg");
	ctx.translate(96.3,31.1);
	ctx.shadowColor = "rgba(255,255,255,0.6)";
	ctx.shadowBlur = 6;
	ctx.shadowOffsetY = 2;
	islandImg1.shape.draw(ctx);
	islandImg1.pic = nCanvas;
	
	var nCanvas = document.createElement("CANVAS");	
	nCanvas.width = 179;
	nCanvas.height = 67+10;	
	var ctx = nCanvas.getContext('2d');	
	islandImg2.shape = new cjs.Shape();
	islandImg2.shape.graphics.bf(images.islands, null, new cjs.Matrix2D(1,0,0,1,-279.5,-43.1)).s().p("AgTCmImZgBInRACIA+gpIBKhhIACg4IAagoIAAgUIAPgRIARAGIAegSIAJARIALgaIAKglIAbgmIAXgIIAKABIAVgRIBEAQQAyA1A1AJICXAAIBdguIBsADIBAAaIAuAkIC1AKIDgBKIArADICdAwIAVAQIBjArIAUAWIAqA7IAXAMIAHAWIsjAMIgBASIhtANg");
	ctx.translate(279.5-190,43.1);
	ctx.shadowColor = "rgba(255,255,255,0.6)";
	ctx.shadowBlur = 6;
	ctx.shadowOffsetY = 2;
	islandImg2.shape.draw(ctx);	
	islandImg2.pic = nCanvas;
	
	islandImg1.shape.graphics._fill = null;	
	islandImg1.shape.graphics._dirty = true;
	islandImg2.shape.graphics._fill = null;	
	islandImg2.shape.graphics._dirty = true;
	
	var nCanvas = document.createElement("CANVAS");	
	nCanvas.width = images.sky.width*2;
	nCanvas.height = images.sky.height;	
	var ctx = nCanvas.getContext('2d');
	ctx.drawImage(images.sky, 0, 0);
	ctx.drawImage(images.sky, images.sky.width, 0);
	images.sky = nCanvas;
	//canvasInteractive.getContext('2d').drawImage(nCanvas,0,80);
}

function drawIsland(ctx, island)
{
	ctx.save();
		ctx.translate(island.x, island.y);
		ctx.scale(island.scale, island.scale);
		ctx.drawImage(island.pic, -island.pic.width/2, -60);
	ctx.restore();
}

function islandHitTest1(x, y)
{
	var ctx = canvasMain.getContext('2d');
	
	ctx.save();
		ctx.translate(cam.x+cam.dx, cam.y+cam.dy);
		ctx.scale(cam.scale+cam.dScale, cam.scale+cam.dScale);
		ctx.rotate(cam.rotate);
		
		ctx.save();
			ctx.translate(islandImg1.x, islandImg1.y);
			ctx.scale(islandImg1.scale, islandImg1.scale);	
			ctx.translate(2, -28);
			islandImg1.shape.draw(ctx);					
		ctx.restore();		
	ctx.restore();
	if(ctx.isPointInPath(x, y))
		{				
			return true;
		}
		else
		{
			return false;
		}
}

function islandHitTest2(x, y)
{
	var ctx = canvasMain.getContext('2d');
	
	ctx.save();
		ctx.translate(cam.x+cam.dx, cam.y+cam.dy);
		ctx.scale(cam.scale+cam.dScale, cam.scale+cam.dScale);
		ctx.rotate(cam.rotate);
		
		ctx.save();
			ctx.translate(islandImg2.x, islandImg2.y);
			ctx.scale(islandImg2.scale, islandImg2.scale);	
			ctx.translate(0, -16);
			islandImg2.shape.draw(ctx);			
		ctx.restore();
	ctx.restore();
	if(ctx.isPointInPath(x, y))
		{				
			return true;
		}
		else
		{
			return false;
		}
}

function drawShipIcon(ctx)
{
	ctx.save();
		ctx.translate(shipIconImg.x, shipIconImg.y);
		ctx.scale(shipIconImg.scale, shipIconImg.scale);
		ctx.save();
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.shadowColor = "black";
			ctx.shadowBlur = 6;			
			shipIconImg.shape.draw(ctx);
			ctx.fill();
			ctx.shadowColor = "transparent";
			
			ctx.beginPath();
			shipIconImg.shape.draw(ctx);
			ctx.clip();
			
			ctx.fillStyle = "rgba(8,220,146,1)";
			ctx.fillRect(-68, -20, 136 * shipIconImg.hp, 40);		
		ctx.restore();	
		
		
		ctx.shadowColor = "black";
		ctx.shadowBlur = 5;		
		ctx.drawImage(images.shipText, -66, 20);		
		ctx.textBaseline = "middle";
		ctx.textAlign = "left";
		ctx.fillStyle = "#FFFFFF";	
		ctx.font = "9pt "+font;
		ctx.fillText("/ 1500", 40, 26);
		ctx.fillStyle = "#00b8ad";		
		ctx.textAlign = "right";
		ctx.fillText(shipIconImg.text+" ", 40, 26);

		
	ctx.restore();
	
}

function drawBulletIcon(ctx)
{
	ctx.save();
		ctx.translate(bulletIcon.x, bulletIcon.y + bulletIcon.sy);
		ctx.scale(bulletIcon.scale, bulletIcon.scale);
		ctx.globalAlpha = trueAlpha(bulletIcon.mapAlpha);
		ctx.drawImage(images.map, -24, -30);
		ctx.translate(0, 30);
		ctx.globalAlpha = trueAlpha(bulletIcon.alpha);
		ctx.shadowColor = "black";
		ctx.shadowBlur = 6;		
		ctx.drawImage(images.bulletIcon, -19, -8);
		ctx.font = "22pt "+ font;
		ctx.textBaseline = "middle";
		ctx.textAlign = "left";
		ctx.fillStyle = "rgba(255,255,255,"+trueAlpha(bulletIcon.alpha)+")";
		ctx.textBaseline = "middle";
		ctx.fillText("x"+bulletIcon.count, 4, 18);
	ctx.restore();
}