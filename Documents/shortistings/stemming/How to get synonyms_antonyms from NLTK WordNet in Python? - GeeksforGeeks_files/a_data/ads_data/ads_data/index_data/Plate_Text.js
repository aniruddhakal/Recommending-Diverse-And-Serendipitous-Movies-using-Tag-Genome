// 
function drawPlate(ptObj, num)
{
	var sizes = new Array(0, 0.35, 0.65, 1);
	var finAlpha = 0.5;
	var delta = 50;
	//
	var ctx = ptObj.canvas.getContext('2d');
	//
	ctx.save();
	ctx.translate(ptObj.x, ptObj.y - 1);
	//
	ctx.beginPath();
	ctx.rect(0, 0, w, ptObj.height + delta);
	//
	var plateGrad = ctx.createLinearGradient(0, 0, w, 0);
    plateGrad.addColorStop(sizes[0], "rgba(175, 30, 20, " + finAlpha + ")");
    plateGrad.addColorStop(sizes[1], "rgb(175, 30, 20)");
    plateGrad.addColorStop(sizes[2], "rgb(175, 30, 20)");
    plateGrad.addColorStop(sizes[3], "rgba(175, 30, 20, " + finAlpha + ")");
    ctx.fillStyle = plateGrad;
    ctx.fill();
    //
    var pattern = ctx.createPattern(ptObj.pic, 'repeat');
	ctx.fillStyle = pattern;
    //
	ctx.globalCompositeOperation = "source-in";
	ctx.beginPath();
	ctx.globalAlpha = 0.35;
	ctx.fillRect(0, 0, w, ptObj.height + delta);
	//
	ctx.globalAlpha = 1;
	ctx.globalCompositeOperation = "destination-over";
	ctx.beginPath();
	ctx.rect(0, 0, w, ptObj.height + delta);
	ctx.fillStyle = plateGrad;
    ctx.fill();
    //
    ctx.globalCompositeOperation = "source-over";
    //
    var plateGrad2 = ctx.createLinearGradient(0, 0, w, 0);
    plateGrad2.addColorStop(sizes[0], "rgba(185, 90, 20, " + finAlpha + ")");
    plateGrad2.addColorStop(sizes[1], "rgb(185, 90, 20)");
    plateGrad2.addColorStop(sizes[2], "rgb(185, 90, 20)");
    plateGrad2.addColorStop(sizes[3], "rgba(185, 90, 20, " + finAlpha + ")");
    ctx.fillStyle = plateGrad2;
    ctx.fillRect(0, 0, w, 1);
    //
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillStyle = "rgb(255, 255, 255)";
	//
	ctx.shadowColor = "rgba(20, 5, 0, 0.75)";
	ctx.shadowBlur = 2;
	ctx.shadowOffsetY = 1;
	//
	ctx.translate(w / 2, ptObj.height / 2);	
	//
	drawTPText(ctx, num);	
	//
	ctx.restore();
}