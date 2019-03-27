var font = '\'webFont\', \'Arial Narrow\', sans-serif';

var againText  = "TRY AGAIN";
var icoText    = 3;
var tpText1    = "SINK THE ENEMY!";
var tpText2_1  = "GREAT SHOOTING!";
var tpText2_2  = "NOW IT’S TIME FOR A REAL BATTLE!";
var tpText3_1  = "ENEMY NOT DESTROYED";
var tpText3_2  = "WHY NOT UPGRADE YOUR SKILLS?";

////////////////////////////////////////////////////
//
function drawIcoText(ctx)
{
	ctx.font = 'bold 14pt '+ font;	
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";	
	//
	ctx.shadowColor = "rgb(255, 255, 255)";
	ctx.shadowBlur = 2;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	//
	ctx.fillStyle = "rgb(95, 115, 125)";
	//
	ctx.fillText(icoText, 28, 64);
}

//
function drawTPText(ctx, txtNum)
{
	if(txtNum === 1)
	{
		ctx.font = 'bold 16pt ' + font;
		ctx.fillText(tpText1, 0, 0);
	}
	else if(txtNum === 2)
	{
		ctx.font = 'bold 16pt ' + font;
		ctx.fillText(tpText2_1, 0, -10);
		ctx.font = 'bold 11pt ' + font;
		ctx.fillText(tpText2_2, 0,  12);
	}
	else
	{
		ctx.font = 'bold 15pt ' + font;
		ctx.fillText(tpText3_1, 0, -10);
		ctx.font = 'bold 11pt ' + font;
		ctx.fillText(tpText3_2, 0,  12);
	}
}