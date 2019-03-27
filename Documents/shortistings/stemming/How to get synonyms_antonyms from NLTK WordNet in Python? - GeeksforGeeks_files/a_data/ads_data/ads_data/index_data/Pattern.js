var Pattern = {};
Pattern.tPattern = {};
Pattern.bPattern = {};
Pattern.bPattern.height = 210;
Pattern.tPattern.alpha = 0;
Pattern.bPattern.alpha = 0;


function drawPattern(ctx)
{
	ctx.clearRect(0, 0, w, h);	
	ctx.globalAlpha = Pattern.tPattern.alpha;
	ctx.drawImage(Pattern.tPattern.pic,0,-20);	
	ctx.globalAlpha = Pattern.bPattern.alpha;
	ctx.drawImage(Pattern.bPattern.pic,0,0);	
}

function drawTopGradient()
{
	var nCanvas = document.createElement("CANVAS");		
	nCanvas.width = w;
	nCanvas.height = h;		
	var ctx = nCanvas.getContext('2d');	
	ctx.translate(-18,0);
	g=ctx.createLinearGradient(64,22+60,40,114+60);
	g.addColorStop(0,"rgba(0, 30, 40, 0.8)");
	g.addColorStop(0.6,"rgba(0, 30, 40, 0.5)");
	g.addColorStop(1,"rgba(0, 30, 40, 0)");
	ctx.fillStyle = g;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	ctx.beginPath();
	ctx.moveTo(168,161+60);
	ctx.lineTo(168,0);
	ctx.lineTo(0,0);
	ctx.lineTo(0,161+60);
	ctx.lineTo(168,161+60);
	ctx.closePath();
	ctx.fill();
	g=ctx.createLinearGradient(272,22+60,296,114+60);
	g.addColorStop(0,"rgba(0, 30, 40, 0.8)");
	g.addColorStop(0.6,"rgba(0, 30, 40, 0.5)");
	g.addColorStop(1,"rgba(0, 30, 40, 0)");
	ctx.fillStyle = g;
	ctx.strokeStyle = "rgba(0, 0, 0, 0)";
	ctx.beginPath();
	ctx.moveTo(336,161+60);
	ctx.lineTo(336,0);
	ctx.lineTo(168,0);
	ctx.lineTo(168,161+60);
	ctx.lineTo(336,161+60);
	ctx.closePath();
	ctx.fill();
	Pattern.topGradient = nCanvas;
}

function drawPatternElements()
{	
	drawTopGradient();
	
	var nCanvas = document.createElement("CANVAS");		
	nCanvas.width = w;
	nCanvas.height = h;		
	var ctx = nCanvas.getContext('2d');		
	ctx.drawImage(Pattern.topGradient,0,0);	
	var iPattern = ctx.createPattern(Pattern.pic, 'repeat');
	ctx.fillStyle = iPattern;
	ctx.fillRect(0,0,w,h);
	ctx.globalCompositeOperation = "source-in";	
	ctx.drawImage(Pattern.topGradient,0,0);		
	ctx.globalCompositeOperation = "source-over";	
	Pattern.tPattern.pic = nCanvas;	
	
	//////////////////////////////////////////////////////////
	var nCanvas = document.createElement("CANVAS");		
	nCanvas.width = w;
	nCanvas.height = h;	
	ctx = nCanvas.getContext('2d');			

	tpgr = ctx.createLinearGradient(0, parseInt(h-Pattern.bPattern.height), 0, h);
	tpgr.addColorStop(0, "rgba(0, 30, 40, 0)");
	tpgr.addColorStop(0.4, "rgba(0, 30, 40, 0.6)");	
	tpgr.addColorStop(1, "rgba(0, 30, 40, 1)");		
		
	
	ctx.fillStyle=tpgr;
	ctx.fillRect(0,0,w,h);	
	
	iPattern = ctx.createPattern(Pattern.pic, 'repeat');
	ctx.fillStyle = iPattern;
	ctx.fillRect(0,0,w,h);
	ctx.globalCompositeOperation = "source-in";
	ctx.fillStyle = tpgr;
	ctx.fillRect(0,0,w,h);	
	ctx.globalCompositeOperation = "source-over";			
	Pattern.bPattern.pic = nCanvas;
	
}

