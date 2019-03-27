function drawIsland(picObj)
{
	var ctx = picObj.canvas.getContext('2d');
	//
	ctx.save();
	ctx.translate( - w / 2 + picObj.x, picObj.y);
	//
	ctx.scale(1 / 1.5, 1 / 1.5);
	//
	ctx.beginPath();
	//
	ctx.moveTo(-145,-66.48);
	ctx.lineTo(-142.347,-72.12);
	ctx.lineTo(-139.612,-72.12);
	ctx.lineTo(-138.586,-75.709);
	ctx.lineTo(-135.681,-76.906);
	ctx.lineTo(-132.947,-78.785);
	ctx.lineTo(-132.028,-88.141);
	ctx.lineTo(-131.067,-89.895);
	ctx.lineTo(-130.287,-93.601);
	ctx.lineTo(-127.834,-95.025);
	ctx.lineTo(-127.359,-97.398);
	ctx.lineTo(-125.935,-96.212);
	ctx.lineTo(-122.5,-94.625);
	ctx.lineTo(-120.875,-95.125);
	ctx.lineTo(-117.25,-99.25);
	ctx.lineTo(-116.282,-101.039);
	ctx.lineTo(-112.625,-113.625);
	ctx.lineTo(-110.584,-115.203);
	ctx.lineTo(-108.686,-118.764);
	ctx.lineTo(-105.75,-121.625);
	ctx.lineTo(-98.125,-121.625);
	ctx.lineTo(-93.125,-125.125);
	ctx.lineTo(-86,-125.125);
	ctx.lineTo(-83.875,-122.875);
	ctx.lineTo(-81,-122.875);
	ctx.lineTo(-77.875,-125.125);
	ctx.lineTo(-69.125,-125.125);
	ctx.lineTo(-67.75,-126.5);
	ctx.lineTo(-66.125,-125.625);
	ctx.lineTo(-63.875,-126.5);
	ctx.lineTo(-59.625,-126.5);
	ctx.lineTo(-57.75,-124.875);
	ctx.lineTo(-56,-124.75);
	ctx.lineTo(-54.25,-126.5);
	ctx.lineTo(-52,-124.625);
	ctx.lineTo(-45.875,-124.75);
	ctx.lineTo(-44.25,-126.5);
	ctx.lineTo(-42.625,-125.875);
	ctx.lineTo(-40.25,-125.5);
	ctx.lineTo(-38.75,-126.5);
	ctx.lineTo(-36.25,-126.5);
	ctx.lineTo(-34.375,-125.375);
	ctx.lineTo(-31,-124.625);
	ctx.lineTo(-21,-115.625);
	ctx.lineTo(-19.75,-113.75);
	ctx.lineTo(-16,-114);
	ctx.lineTo(-15.125,-115.125);
	ctx.lineTo(-11,-115.125);
	ctx.lineTo(-8.5,-112.75);
	ctx.lineTo(-7,-112.5);
	ctx.lineTo(-1.75,-108);
	ctx.lineTo(1.5,-108.25);
	ctx.lineTo(3.5,-110.375);
	ctx.lineTo(5.375,-110.625);
	ctx.lineTo(6.75,-109.375);
	ctx.lineTo(9.25,-109.625);
	ctx.lineTo(10.125,-111);
	ctx.lineTo(12.875,-109.625);
	ctx.lineTo(17,-108.625);
	ctx.lineTo(17,-106.375);
	ctx.lineTo(21.25,-105.5);
	ctx.lineTo(25.625,-101.25);
	ctx.lineTo(25.625,-98.75);
	ctx.lineTo(27.625,-97.125);
	ctx.lineTo(27.625,-93);
	ctx.lineTo(28.75,-92.25);
	ctx.lineTo(29.375,-89.875);
	ctx.lineTo(35,-89.625);
	ctx.lineTo(36.625,-88);
	ctx.lineTo(37.375,-86.25);
	ctx.lineTo(39.125,-83.625);
	ctx.lineTo(41.75,-83.375);
	ctx.lineTo(43.75,-80.375);
	ctx.lineTo(46.125,-79.375);
	ctx.lineTo(49.625,-73.375);
	ctx.lineTo(49.625,-68.125);
	ctx.lineTo(48.75,-66.48);
	ctx.lineTo(49,-59.625);
	ctx.lineTo(52.875,-57.5);
	ctx.lineTo(55.625,-59.25);
	ctx.lineTo(57,-57.5);
	ctx.lineTo(58.875,-59);
	ctx.lineTo(61.75,-55.625);
	ctx.lineTo(66.625,-55.625);
	ctx.lineTo(69.75,-53.625);
	ctx.lineTo(73.125,-51.875);
	ctx.lineTo(77,-49);
	ctx.lineTo(79.75,-48.125);
	ctx.lineTo(84.5,-44.5);
	ctx.lineTo(87.75,-44.5);
	ctx.lineTo(91.875,-42.625);
	ctx.lineTo(94.25,-40);
	ctx.lineTo(98.375,-40);
	ctx.lineTo(100.625,-37.75);
	ctx.lineTo(104.5,-37.75);
	ctx.lineTo(108,-35.625);
	ctx.lineTo(112,-34.5);
	ctx.lineTo(117.25,-30.875);
	ctx.lineTo(119.75,-30.125);
	ctx.lineTo(120.75,-28.375);
	ctx.lineTo(122.375,-29.625);
	ctx.lineTo(124.125,-28.375);
	ctx.lineTo(127,-26.625);
	ctx.lineTo(131.625,-21.25);
	ctx.lineTo(133.375,-17.75);
	ctx.lineTo(134.5,-15.625);
	ctx.lineTo(135.875,-17.25);
	ctx.lineTo(138,-14.75);
	ctx.lineTo(140.75,-11.25);
	ctx.lineTo(141.375,-9);
	ctx.lineTo(145,-5.75);
	ctx.lineTo(145,0);
	ctx.lineTo(-145,0);
	ctx.lineTo(-145,-66.48);
	ctx.closePath();
	//
	ctx.translate(-145, -128);
	//
	var pattern = ctx.createPattern(picObj.pic, 'repeat');
	ctx.fillStyle = pattern;
	ctx.fill();
	//
	var g = ctx.createLinearGradient(0, 0, 0, 15);
	g.addColorStop(0,"rgba(0, 20, 2, 0.4)");
	g.addColorStop(1,"rgba(0, 40, 6, 0)");
	//
	ctx.translate(145, 128);
	//
	ctx.beginPath();
	ctx.moveTo(143,15);
	ctx.lineTo(-145,15);
	ctx.lineTo(-145,0);
	ctx.lineTo(145,0);
	ctx.lineTo(143,15);
	ctx.closePath();
	//
	ctx.fillStyle = g;
	ctx.fill();

	///// WAVE
	wCtx.clearRect(0, 0, 450, 8);
	wCtx.save();
	wCtx.translate(waveX - img_wave.pic.width, 0);
	//
	var	tpgr = wCtx.createLinearGradient(- waveX + img_wave.pic.width + 450, 0, - waveX + img_wave.pic.width, 28);
	tpgr.addColorStop(0.6, "rgba(0, 0, 0, 0.7)");	
	tpgr.addColorStop(0.8,   "rgba(0, 0, 0, 0)");			
	wCtx.fillStyle = tpgr;
	wCtx.beginPath();
	wCtx.rect(- waveX + img_wave.pic.width, 0, 450, 8);
	wCtx.fill();
	wCtx.globalCompositeOperation = "source-in";
	var iPattern = wCtx.createPattern(img_wave.pic, 'repeat-x');	
	wCtx.fillStyle = iPattern;
	wCtx.fillRect(- waveX + img_wave.pic.width, 0, 450, 8);
	var wavePic = nCanvas;
	wCtx.restore();
	//
	img_wave.ang += radian(1);
	img_wave.ang = img_wave.ang % Math.PI;
	//
	ctx.drawImage(wavePic, picObj.x - 280, -4 + 1 * Math.sin(img_wave.ang));

	//
	ctx.restore();
}