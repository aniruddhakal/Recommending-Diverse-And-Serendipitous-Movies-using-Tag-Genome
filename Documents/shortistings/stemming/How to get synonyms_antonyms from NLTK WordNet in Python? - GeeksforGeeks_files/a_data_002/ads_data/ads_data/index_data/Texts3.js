/* -------------------------------------------------------------------------------------
--------------                        WARGAMING.NET                       --------------
----------------------------------------------------------------------------------------
--------------                 © 2017 ALL RIGHTS RESERVED                 --------------
--------------------------------------------------------------------------------------*/

var textFrame1 = 
[
	"YOU DID IT!",
	"ONE MORE?"
];
var textFrame2 = 
[
	"EPIC FAIL.",
	"YOU NEED MORE TRAINING!"
];
var textFrame3 = 
[
	"FIRE",
	"AT THE ENEMY!"
];

var textFrame4 = 
[
	"COME ON,",
	"AIM!"
];  

function setStrings()
{	
	textPlate.textArray = new Array();	
	textPlate.animText = new Array();
	
	textPlate2.textArray = new Array();	
	textPlate2.animText = new Array();	
	
	textPlate.frame1 = new stringFrame(textPlate, textFrame1, 'bold 20pt '+font, 31);
	textPlate.frame2 = new stringFrame(textPlate, textFrame2, 'bold 20pt '+font, 31);	

	textPlate2.frame1 = new stringFrame(textPlate2, textFrame3, 'bold 23pt '+font, 32);
	textPlate2.frame2 = new stringFrame(textPlate2, textFrame4, 'bold 23pt '+font, 32);	
}

function drawButtonText1(ctx)
{
	
}