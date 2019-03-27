﻿/* -------------------------------------------------------------------------------------
--------------                        WARGAMING.NET                       --------------
----------------------------------------------------------------------------------------
--------------                 © 2017 ALL RIGHTS RESERVED                 --------------
----------------------------------------------------------------------------------------
--------------                        VERSION: 2.15                       --------------
----------------------------------------------------------------------------------------
------  Roboto-Condensed*: (c) Christian Robertson. Apache License, version 2.0  -------
----------------------------------------------------------------------------------------
Cormorant-Garamond*:
Copyright (c) 2015, Christian Thalmann and the Cormorant Project Authors (github.com/CatharsisFonts/Cormorant)
This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at: http://scripts.sil.org/OFL
--------------------------------------------------------------------------------------*/

// REPLACE window.onLoad FUNCTION TO loadFonts() IN Engine.js
// CHANGE webFont.currentFont IN LINE 101
var webFont = {};

var fontItem = {};
fontItem.url = '//fonts.googleapis.com/css?family=Roboto+Condensed:400,700&subset=cyrillic';
fontItem.name = 'Roboto Condensed';
fontItem.font = "'webFont', 'Arial Narrow', sans-serif";
fontItem.testStrings = {'webFont': '\u0418\u0413\u0420\u0410\u0422\u042c\u0046\u004f\u0052'};
webFont.cyrillic = fontItem;

fontItem = {};
fontItem.url = '//fonts.googleapis.com/css?family=Roboto+Condensed:700,400&subset=latin,latin-ext';
fontItem.name = 'Roboto Condensed';
fontItem.font = "'webFont', 'Arial Narrow', sans-serif";
webFont.latin = fontItem;

fontItem = {};
fontItem.url = '//fonts.googleapis.com/css?family=Roboto+Condensed:400,700&subset=latin,greek,greek-ext,latin-ext';
fontItem.name = 'Roboto Condensed';
fontItem.font = "'webFont', 'Arial Narrow', sans-serif";
fontItem.testStrings = {'webFont': '\u03a0\u0391\u0399\u039e\u0395\u0394\u03a9\u03a1\u0395\u0391\u039d'};
webFont.greek = fontItem;

fontItem = {};
fontItem.url = '//fonts.googleapis.com/css?family=Roboto+Condensed:400,700&subset=latin-ext,vietnamese';
fontItem.name = 'Roboto Condensed';
fontItem.font = "'webFont', 'Arial Narrow', sans-serif";
fontItem.testStrings = {'webFont': '\u0043\u0048\u01a0\u0049\u004d\u0049\u1ec4\u004e\u0050\u0048\u00cd'};
webFont.vietnamese = fontItem;

fontItem = {};
fontItem.url = '//fonts.googleapis.com/css?family=Itim&subset=thai';
fontItem.name = 'Itim';
fontItem.font = "'webFont', 'Arial Narrow', sans-serif";
fontItem.testStrings = {'webFont': '\u0e40\u0e25\u0e48\u0e19\u0e1f\u0e23\u0050\u004c'};
webFont.thai = fontItem;

fontItem = {};
fontItem.url = '//fonts.googleapis.com/css?family=Mada';
fontItem.name = 'Mada';
fontItem.font = "'webFont', 'Arial Narrow', sans-serif";
fontItem.testStrings = {'webFont': '\u0645\u062c\u0627\u0646\u064b\u0042\u0065'};
webFont.arabic = fontItem;

fontItem = {};
fontItem.url = '';
fontItem.name = '';
fontItem.font = "'Malgun Gothic', '애플고딕', 'AppleGothic', '맑은 고딕', 'Dotum, 돋움', 'DotumChe', '돋움체', 'Gulim', '굴림', 'New Gulim', '새굴림', sans-serif";
webFont.korean = fontItem;

fontItem = {};
fontItem.url = '';
fontItem.name = '';
fontItem.font = "'メイリオ', 'Microsoft YaHei', 'STXihei', '华文细黑', sans-serif";
webFont.japanese = fontItem;

fontItem = {};
fontItem.url = '';
fontItem.name = '';
fontItem.font = "'Microsoft YaHei', '微软雅黑', 'STXihei', '华文细黑', sans-serif";	
webFont.chinese = fontItem;

var fontItem = {};
fontItem.url = '//fonts.googleapis.com/css?family=Cormorant+Garamond:400,700&subset=latin-ext';
fontItem.name = 'Cormorant Garamond';
fontItem.font = "'webFont', 'Times New Roman', serif";
fontItem.testStrings = {'webFont': '\u0418\u0413\u0420\u0410\u0422\u042c\u0046\u004f\u0052'};
webFont.twa_latin = fontItem;

var fontItem = {};
fontItem.url = '//fonts.googleapis.com/css?family=Cormorant+Garamond:400,700&subset=cyrillic,cyrillic-ext';
fontItem.name = 'Cormorant Garamond';
fontItem.font = "'webFont', 'Times New Roman', serif";
fontItem.testStrings = {'webFont': '\u0418\u0413\u0420\u0410\u0422\u042c\u0046\u004f\u0052'};
webFont.twa_cyrillic = fontItem;

var fontItem = {};
fontItem.url = '//fonts.googleapis.com/css?family=Cormorant+Garamond:400,700&subset=vietnamese';
fontItem.name = 'Cormorant Garamond';
fontItem.font = "'webFont', 'Times New Roman', serif";
fontItem.testStrings = {'webFont': '\u0043\u0048\u01a0\u0049\u004d\u0049\u1ec4\u004e\u0050\u0048\u00cd'};
webFont.twa_vietnamese = fontItem;

// AVAILABLE OPTIONS: cyrillic, latin, greek, vietnamese, thai, arabic, korean, japanese, chinese, twa_latin, twa_cyrillic, twa_vietnamese
webFont.currentFont = webFont.latin; 

var font = webFont.currentFont.font;

//Дополнительный шрифт
var addFonts = new Array();
/*
fontItem = {};
fontItem.url = '//fonts.googleapis.com/css?family=Roboto+Slab&amp;subset=cyrillic';
fontItem.name = 'Roboto Slab';	//Оригинальное название 
fontItem.font = '\'webFont2\', \'Arial Narrow\', sans-serif';	//font
fontItem.wfName = "webFont2";	//Название дополнительного шрифта в css
fontItem.testStrings = {'webFont2': '\u0417\u041b\u0418\u0428\u042c\u0421\u042f\u003f'}; //Проверочный текст сконвертить можно тут: https://www.branah.com/unicode-converter
webFont.newFont = fontItem;

var addFonts = [webFont.newFont]; //Тут перечисляем дополнительные шрифты
var font2 = webFont.newFont.font;	//Задаем вторую переменную*/

function loadFonts()
{   
	var XHR = window.XDomainRequest || window.XMLHttpRequest
	var xhr = new XHR(); 
	var proto = 'https:';
	if (window.location.protocol != "https:")
	{
		proto  = 'https:';
	}
	if(webFont.currentFont.url!='')
	{
		xhr.open("GET", proto + webFont.currentFont.url, true);
	}
	xhr.onload = function()
	{
		var wfName = "webFont";
		if(webFont.currentFont.wfName)
		{
			wfName = webFont.currentFont.wfName;
		}
		var myCSS = xhr.responseText;	
		myCSS = myCSS.replace(new RegExp('font-family: \'' + webFont.currentFont.name + '\';', 'g'),"font-family: '"+wfName+"';");	
		myCSS = myCSS.replace(/local\(.*\),/g,"");
		myCSS = myCSS.replace(/url\(\/\//g, "url(https://");
		head = document.head || document.getElementsByTagName('head')[0],
		style = document.createElement('style');
		style.type = 'text/css';	
		
		if (style.styleSheet)
		{			
			style.styleSheet.cssText = myCSS;
			var sheets = document.styleSheets;
			for(var s = 0, slen = sheets.length; s < slen; s++) {
			  sheets[s].disabled = true;
			  sheets[s].disabled = false;
			}
		}
		else 
		{
			style.appendChild(document.createTextNode(myCSS));
		}
		head.appendChild(style);			
		WebFontConfig = 
		{
			custom: {families: [wfName]},    
			loading: function() {},
			active: function() {toStart();},
			inactive: function() {toStart();},  
		};
		if(webFont.currentFont.testStrings)
		{				
			WebFontConfig.custom.testStrings = webFont.currentFont.testStrings;
		}
		runWFL();
	}

	xhr.onerror = function()
	{
		console.log("Fonts error");
		toStart();
	}
	if(webFont.currentFont.url!='')
	{
		xhr.send();
	}
	else
	{
		toStart();
	}
}

function toStart()
{
	if(addFonts.length == 0)
	{	
		start();
	}
	else
	{
		webFont.currentFont = addFonts[0];
		loadFonts();
		addFonts.splice(0, 1);
	}
}

function runWFL(){
/* Web Font Loader v1.6.26 - (c) Adobe Systems, Google. License: Apache 2.0 */(function(){function k(a,b,c){return a.call.apply(a.bind,arguments)}function aa(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function m(a,b,c){m=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?k:aa;return m.apply(null,arguments)}var q=Date.now||function(){return+new Date};function ba(a,b){this.a=b||a;this.b=this.a.document}var ca=!!window.FontFace;function r(a,b,c,d){b=a.b.createElement(b);if(c)for(var e in c)c.hasOwnProperty(e)&&("style"==e?b.style.cssText=c[e]:b.setAttribute(e,c[e]));d&&b.appendChild(a.b.createTextNode(d));return b}function t(a,b,c){a=a.b.getElementsByTagName(b)[0];a||(a=document.documentElement);a.insertBefore(c,a.lastChild)}function v(a){a.parentNode&&a.parentNode.removeChild(a)}
function w(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e])}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function x(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return!0;return!1}
function da(a,b,c){function d(){h&&e&&f&&(h(g),h=null)}b=r(a,"link",{rel:"stylesheet",href:b,media:"all"});var e=!1,f=!0,g=null,h=c||null;ca?(b.onload=function(){e=!0;d()},b.onerror=function(){e=!0;g=Error("Stylesheet failed to load");d()}):setTimeout(function(){e=!0;d()},0);t(a,"head",b)};function ea(){this.a=0;this.b=null}function fa(a){a.a++;return function(){a.a--;y(a)}}function ga(a,b){a.b=b;y(a)}function y(a){0==a.a&&a.b&&(a.b(),a.b=null)};function z(a){this.a=a||"-"}z.prototype.b=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.a)};function A(a,b){this.b=a;this.c=4;this.a="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.a=c[1],this.c=parseInt(c[2],10))}function ha(a){return B(a)+" "+(a.c+"00")+" 300px "+D(a.b)}function D(a){var b=[];a=a.split(/,\s*/);for(var c=0;c<a.length;c++){var d=a[c].replace(/['"]/g,"");-1!=d.indexOf(" ")||/^\d/.test(d)?b.push("'"+d+"'"):b.push(d)}return b.join(",")}function E(a){return a.a+a.c}function B(a){var b="normal";"o"===a.a?b="oblique":"i"===a.a&&(b="italic");return b};function ia(a,b){this.b=a;this.c=a.a.document.documentElement;this.g=b;this.a=new z("-");this.h=!1!==b.events;this.f=!1!==b.classes}function ja(a){a.f&&w(a.c,[a.a.b("wf","loading")]);F(a,"loading")}function G(a){if(a.f){var b=x(a.c,a.a.b("wf","active")),c=[],d=[a.a.b("wf","loading")];b||c.push(a.a.b("wf","inactive"));w(a.c,c,d)}F(a,"inactive")}function F(a,b,c){if(a.h&&a.g[b])if(c)a.g[b](c.b,E(c));else a.g[b]()};function ka(){this.b={}}function la(a,b,c){var d=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.b[e];f&&d.push(f(b[e],c))}return d};function H(a,b){this.b=a;this.c=b;this.a=r(this.b,"span",{"aria-hidden":"true"},this.c)}function I(a){t(a.b,"body",a.a)}function J(a){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+D(a.b)+";"+("font-style:"+B(a)+";font-weight:"+(a.c+"00")+";")};function K(a,b,c,d,e,f){this.f=a;this.h=b;this.a=d;this.b=c;this.c=e||3E3;this.g=f||void 0}K.prototype.start=function(){var a=this.b.a.document,b=this,c=q(),d=new Promise(function(d,e){function h(){q()-c>=b.c?e():a.fonts.load(ha(b.a),b.g).then(function(a){1<=a.length?d():setTimeout(h,25)},function(){e()})}h()}),e=new Promise(function(a,c){setTimeout(c,b.c)});Promise.race([e,d]).then(function(){b.f(b.a)},function(){b.h(b.a)})};function L(a,b,c,d,e,f,g){this.m=a;this.s=b;this.b=c;this.a=d;this.j=g||"BESbswy";this.c={};this.u=e||3E3;this.l=f||null;this.i=this.h=this.g=this.f=null;this.f=new H(this.b,this.j);this.g=new H(this.b,this.j);this.h=new H(this.b,this.j);this.i=new H(this.b,this.j);a=new A(this.a.b+",serif",E(this.a));a=J(a);this.f.a.style.cssText=a;a=new A(this.a.b+",sans-serif",E(this.a));a=J(a);this.g.a.style.cssText=a;a=new A("serif",E(this.a));a=J(a);this.h.a.style.cssText=a;a=new A("sans-serif",E(this.a));a=
J(a);this.i.a.style.cssText=a;I(this.f);I(this.g);I(this.h);I(this.i)}var M={w:"serif",v:"sans-serif"},N=null;function O(){if(null===N){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);N=!!a&&(536>parseInt(a[1],10)||536===parseInt(a[1],10)&&11>=parseInt(a[2],10))}return N}L.prototype.start=function(){this.c.serif=this.h.a.offsetWidth;this.c["sans-serif"]=this.i.a.offsetWidth;this.o=q();P(this)};
function Q(a,b,c){for(var d in M)if(M.hasOwnProperty(d)&&b===a.c[M[d]]&&c===a.c[M[d]])return!0;return!1}function P(a){var b=a.f.a.offsetWidth,c=a.g.a.offsetWidth,d;(d=b===a.c.serif&&c===a.c["sans-serif"])||(d=O()&&Q(a,b,c));d?q()-a.o>=a.u?O()&&Q(a,b,c)&&(null===a.l||a.l.hasOwnProperty(a.a.b))?R(a,a.m):R(a,a.s):ma(a):R(a,a.m)}function ma(a){setTimeout(m(function(){P(this)},a),50)}function R(a,b){setTimeout(m(function(){v(this.f.a);v(this.g.a);v(this.h.a);v(this.i.a);b(this.a)},a),0)};function S(a,b,c){this.b=a;this.a=b;this.c=0;this.i=this.h=!1;this.j=c}var T=null;S.prototype.f=function(a){var b=this.a;b.f&&w(b.c,[b.a.b("wf",a.b,E(a).toString(),"active")],[b.a.b("wf",a.b,E(a).toString(),"loading"),b.a.b("wf",a.b,E(a).toString(),"inactive")]);F(b,"fontactive",a);this.i=!0;U(this)};
S.prototype.g=function(a){var b=this.a;if(b.f){var c=x(b.c,b.a.b("wf",a.b,E(a).toString(),"active")),d=[],e=[b.a.b("wf",a.b,E(a).toString(),"loading")];c||d.push(b.a.b("wf",a.b,E(a).toString(),"inactive"));w(b.c,d,e)}F(b,"fontinactive",a);U(this)};function U(a){0==--a.c&&a.h&&(a.i?(a=a.a,a.f&&w(a.c,[a.a.b("wf","active")],[a.a.b("wf","loading"),a.a.b("wf","inactive")]),F(a,"active")):G(a.a))};function V(a){this.h=a;this.f=new ka;this.g=0;this.a=this.c=!0}V.prototype.load=function(a){this.b=new ba(this.h,a.context||this.h);this.c=!1!==a.events;this.a=!1!==a.classes;na(this,new ia(this.b,a),a)};
function oa(a,b,c,d,e){var f=0==--a.g;(a.a||a.c)&&setTimeout(function(){var a=e||null,h=d||null||{};if(0===c.length&&f)G(b.a);else{b.c+=c.length;f&&(b.h=f);var l,n=[];for(l=0;l<c.length;l++){var C=c[l],X=h[C.b],p=b.a,u=C;p.f&&w(p.c,[p.a.b("wf",u.b,E(u).toString(),"loading")]);F(p,"fontloading",u);p=null;null===T&&(T=window.FontFace?(u=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent))?42<parseInt(u[1],10):!0:!1);T?p=new K(m(b.f,b),m(b.g,b),b.b,C,b.j,X):p=new L(m(b.f,b),m(b.g,b),b.b,C,b.j,a,
X);n.push(p)}for(l=0;l<n.length;l++)n[l].start()}},0)}function na(a,b,c){var d=[],e=c.timeout;ja(b);var d=la(a.f,c,a.b),f=new S(a.b,b,e);a.g=d.length;b=0;for(c=d.length;b<c;b++)d[b].load(function(b,c,d){oa(a,f,b,c,d)})};function W(a,b){this.b=a;this.a=b}W.prototype.load=function(a){var b,c,d=this.a.urls||[],e=this.a.families||[],f=this.a.testStrings||{},g=new ea;b=0;for(c=d.length;b<c;b++)da(this.b,d[b],fa(g));var h=[];b=0;for(c=e.length;b<c;b++)if(d=e[b].split(":"),d[1])for(var l=d[1].split(","),n=0;n<l.length;n+=1)h.push(new A(d[0],l[n]));else h.push(new A(d[0]));ga(g,function(){a(h,f)})};var Y=new V(window);Y.f.b.custom=function(a,b){return new W(b,a)};var Z={load:m(Y.load,Y)};"function"===typeof define&&define.amd?define(function(){return Z}):"undefined"!==typeof module&&module.exports?module.exports=Z:(window.WebFont=Z,window.WebFontConfig&&Y.load(window.WebFontConfig));}());}