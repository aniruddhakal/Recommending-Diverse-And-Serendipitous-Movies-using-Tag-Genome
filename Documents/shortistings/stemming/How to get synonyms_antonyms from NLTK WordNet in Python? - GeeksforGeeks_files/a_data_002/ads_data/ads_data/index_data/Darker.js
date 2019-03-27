/* -------------------------------------------------------------------------------------
--------------                        WARGAMING.NET                       --------------
----------------------------------------------------------------------------------------
--------------                 © 2017 ALL RIGHTS RESERVED                 --------------
--------------------------------------------------------------------------------------*/

function drawDarker(dObj)
{
	var ctx = dObj.canvas.getContext("2d");
	//
	ctx.clearRect(0, 0, w, h);
	//
	var grd=ctx.createRadialGradient(w/2,h/2,15,w/2,h/2,w/2);
	grd.addColorStop(0,"rgba("+darkerImg.color+", "+darkerImg.color+", "+darkerImg.color+", " + Math.round(dObj.alpha*100)/100 + ")");
	grd.addColorStop(1,"rgba("+darkerImg.color+", "+darkerImg.color+", "+darkerImg.color+", " + Math.round(dObj.alpha*1.2*100)/100 + ")");	
	ctx.fillStyle=grd;
	ctx.fillRect(cam.lCut, cam.tCut, w-cam.lCut-cam.rCut, h-cam.bCut-cam.tCut);
	
	
	//ctx.fillStyle = "rgba(0, 0, 0, " + dObj.alpha + ")";
	//ctx.fillRect(0, 0, w, h);
}
