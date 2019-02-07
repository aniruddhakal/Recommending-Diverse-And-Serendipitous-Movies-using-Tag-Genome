/*ADOBE SYSTEMS INCORPORATED
Copyright 2012 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Window){
ColdFusion.Window={};
}
ColdFusion.Window.windowIdCounter=1;
ColdFusion.Window.TITLE_BGCOLOR_TEMPLATE="WINDOW_DIV_ID .x-window-tc , WINDOW_DIV_ID .x-window-tl, WINDOW_DIV_ID .x-window-tr, WINDOW_DIV_ID .x-window-bc, WINDOW_DIV_ID .x-window-br, WINDOW_DIV_ID"+" .x-window-bl, WINDOW_DIV_ID  .x-window-ml, WINDOW_DIV_ID .x-window-mr { background-image: none; background-color: COLOR_ID; }";
ColdFusion.Window.create=function(_60b,_60c,url,_60e){
if(_60b==null){
ColdFusion.handleError(null,"window.create.nullname","widget",null,null,null,true);
return;
}
if(_60b==""){
ColdFusion.handleError(null,"window.create.emptyname","widget",null,null,null,true);
return;
}
var _60f=ColdFusion.objectCache[_60b];
var _610=false;
if(typeof (_60f)!="undefined"&&_60f!=null){
if(_60f.callfromtag){
ColdFusion.handleError(null,"window.create.duplicatename","widget",[_60b]);
}
if(typeof (_60f.isConfObj)!="undefined"&&_60f.isConfObj==true){
_610=true;
if(_60e!=null&&typeof (_60e.initshow)!="undefined"){
if(_60e.initshow==false){
return;
}
}
}else{
if(!_60e||(_60e&&_60e.initshow!==false)){
ColdFusion.Window.show(_60b);
}
return;
}
}
if(!_60f){
ColdFusion.Log.info("window.create.creating","widget",[_60b]);
}
var _611=ColdFusion.Window.createHTML(_60b,_60c,url,_60e,_610);
var _612=ColdFusion.objectCache[_60b];
if(_612!=null&&typeof (_612.isConfObj)!="undefined"&&_612.isConfObj==true){
return;
}
return ColdFusion.Window.createJSObj(_60b,url,_611);
};
ColdFusion.Window.createHTML=function(_613,_614,url,_616,_617){
var _618=null;
var _619=null;
if(_616&&_616.divid){
_618=document.getElementById(_616.divid);
}
if(_618==null){
_618=document.createElement("div");
_619="cf_window"+ColdFusion.Window.windowIdCounter;
ColdFusion.Window.windowIdCounter++;
_618.id=_619;
_618.className="x-hidden";
}
var _61a=false;
var _61b=null;
if(_616!=null&&typeof (_616.headerstyle)!="undefined"&&_616.headerstyle!=null){
var _61c=new String(_616.headerstyle);
_61c=_61c.toLowerCase();
var _61d=_61c.indexOf("background-color");
if(_61d>=0){
_61a=true;
var _61e=_61c.indexOf(";",_61d+17);
if(_61e<0){
_61e=_61c.length;
}
_61b=_61c.substring(_61d+17,_61e);
}
}
var _61f=document.getElementById(_613+"_title-html");
if(_61a==true&&_61b){
var _620="#"+_616.divid;
var _621="NAME_ID .x-window-tc , NAME_ID .x-window-tl, NAME_ID .x-window-tr, NAME_ID .x-window-bc, NAME_ID .x-window-br, NAME_ID .x-window-bl,NAME_ID .x-window-ml, NAME_ID .x-window-mr { background-image: none; background-color: COLOR_ID; }";
var _622=ColdFusion.Util.replaceAll(ColdFusion.Window.TITLE_BGCOLOR_TEMPLATE,"WINDOW_DIV_ID",_620);
var _622=ColdFusion.Util.replaceAll(_622,"COLOR_ID",_61b);
Ext.util.CSS.createStyleSheet(_622);
}
if(_61f==null){
_61f=document.createElement("div");
_61f.id=_613+"_title-html";
var _623="x-window-header";
_61f.className=_623;
if(_614){
_61f.innerHTML=_614;
}else{
_61f.innerHTML="&nbsp;";
}
}
var _624=document.getElementById(_613+"-body");
if(_624==null){
_624=document.createElement("div");
_624.id=_613+"-body";
_618.appendChild(_624);
}
var _625;
_625=ColdFusion.Window.getUpdatedConfigObj(_616,_613);
if(_616){
_625.header={style:_616.headerstyle};
}
if(typeof (_625)=="undefined"){
_618.innerHTML="";
return;
}
if(_619){
_625.divid=_619;
}
_625.title=_614;
if(typeof (_625.initshow)!="undefined"&&_625.initshow===false){
_625.url=url;
ColdFusion.objectCache[_613]=_625;
ColdFusion.objectCache[_613+"-body"]=_625;
}
_625.items=[{html:_618.innerHTML}];
return _625;
};
ColdFusion.Window.createJSObj=function(_626,url,_628){
var _629;
var _62a=false;
if(typeof (_628.childlayoutid)&&_628.childlayoutid!=null){
_62a=true;
_628.layout="border";
_628.items=ColdFusion.objectCache[_628.childlayoutid];
}else{
var elem=document.getElementById(_626+"-body");
if(elem){
elem.parentNode.removeChild(elem);
}
_628.layout="fit";
}
if(typeof (_628.autoScroll)=="undefined"){
_628.autoScroll=true;
}
if(_628.onShow){
_628._cf_onShow=_628.onShow;
_628.onShow=null;
}
if(_628.onHide){
_628._cf_onHide=_628.onHide;
_628.onHide=null;
}
_629=new Ext.Window(_628);
_629.show();
_629.hide();
_629.cfwindowname=_626;
_629.tempx=_628.tempx;
_629.tempy=_628.tempy;
_629.divid=_628.divid;
if(typeof (_628.headerstyle)!="undefined"&&_628.headerstyle!=null){
var _62c=document.getElementById(_626+"_title");
if(_62c!=null){
_62c.style.cssText="background:none;"+_628.headerstyle;
}
}
if(typeof (_628.bodystyle)!="undefined"&&_628.bodystyle!=null){
var _62d=document.getElementById(_626+"-body");
if(_62d){
var _62e=_62d.parentNode;
}
if(_62e!=null){
_62e.style.cssText=_628.bodystyle;
}
}
_629.isConfObj=false;
_629._cf_body=_626+"-body";
ColdFusion.objectCache[_626]=_629;
if(_62a){
var _62f=_629.getLayout();
var _630=ColdFusion.objectCache[_628.childlayoutid];
}
_629.addListener("beforeclose",ColdFusion.Window.beforeCloseHandler);
var _631=null;
if(typeof (url)!="undefined"&&url!=""){
_631=url;
}
if(_631==null){
if(typeof (_628.initshow)=="undefined"||_628.initshow==true){
_629.addListener("beforeshow",ColdFusion.Window.beforeShowHandler);
ColdFusion.Window.showandhide(_629,_628);
}
return;
}
ColdFusion.objectCache[_626+"-body"]=_629;
if(typeof (_628.callfromtag)=="undefined"){
var _632;
var _633;
_629._cf_visible=false;
_629._cf_dirtyview=true;
_629.addListener("show",ColdFusion.Window.showHandler);
_629.addListener("hide",ColdFusion.Window.hideHandler);
_629.url=_631;
if(_628){
if(typeof (_628.initshow)=="undefined"||_628.initshow==true){
ColdFusion.Window.showandhide(_629,_628);
}
_632=_628.callbackHandler;
_633=_628.errorHandler;
}
}else{
_629.callfromtag=true;
_629._cf_visible=false;
_629._cf_dirtyview=true;
_629.addListener("show",ColdFusion.Window.showHandler);
_629.addListener("beforeshow",ColdFusion.Window.beforeShowHandler);
_629.addListener("hide",ColdFusion.Window.hideHandler);
if(typeof (_628.initshow)=="undefined"||_628.initshow==true){
ColdFusion.Window.showandhide(_629,_628);
}
}
};
ColdFusion.Window.showandhide=function(_634,_635){
if(typeof (_635.tempinitshow)!="undefined"&&_635.tempinitshow==false){
var _636=Ext.Element.get(_634.divid);
if(typeof _636!="undefined"){
_636.show();
}
_636.hide();
}else{
_634.show();
}
};
ColdFusion.Window.destroy=function(_637,_638){
if(_637){
var _639=ColdFusion.Window.getWindowObject(_637);
if(_639){
if(_638===true){
_639.destroy(true);
}else{
_639.destroy();
}
ColdFusion.objectCache[_637]=null;
}
}
};
ColdFusion.Window.resizeHandler=function(_63a,_63b,_63c){
if(typeof (_63a.fixedcenter)!="undefined"&&_63a.fixedcenter==true){
_63a.center();
}
};
ColdFusion.Window.beforeShowHandler=function(_63d){
if(typeof (_63d.fixedcenter)!="undefined"&&_63d.fixedcenter==true){
_63d.center();
}
};
ColdFusion.Window.beforeCloseHandler=function(_63e){
if(_63e.destroyonclose!="undefined"&&_63e.destroyonclose==true){
ColdFusion.objectCache[_63e.cfwindowname]=null;
return true;
}else{
_63e.hide();
return false;
}
};
ColdFusion.Window.showHandler=function(_63f){
_63f._cf_visible=true;
if(_63f._cf_dirtyview){
if(typeof (_63f.callfromtag)=="undefined"){
ColdFusion.Ajax.replaceHTML(_63f._cf_body,_63f.url,"GET",null,_63f.callbackHandler,_63f.errorHandler);
}else{
var _640=ColdFusion.bindHandlerCache[_63f._cf_body];
if(_640){
_640();
}
}
_63f._cf_dirtyview=false;
}
};
ColdFusion.Window.hideHandler=function(_641){
_641._cf_visible=false;
if(_641._cf_refreshOnShow){
_641._cf_dirtyview=true;
}
};
ColdFusion.Window.xPosition=50;
ColdFusion.Window.yPosition=50;
ColdFusion.Window.resetHTML=function(_642){
var _643=document.getElementById(_642);
if(_643){
_643.innerHTML="";
}
};
ColdFusion.Window.getUpdatedConfigObj=function(_644,_645){
var _646={};
if(_644!=null){
if(typeof (_644)!="object"){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidconfig","widget",[_645],null,null,true);
return;
}
for(var key in _644){
if(key=="center"&&ColdFusion.Util.isBoolean(_644["center"])){
_646["fixedcenter"]=_644["center"];
}else{
_646[key]=_644[key];
}
}
}
if(typeof (_646.initshow)!="undefined"){
if(ColdFusion.Util.isBoolean(_646.initshow)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidinitshow","widget",[_645],null,null,true);
return;
}else{
_646.initshow=ColdFusion.Util.castBoolean(_646.initshow);
_646._cf_visible=_646.initshow;
}
}
_646.tempcenter=null;
if(typeof (_646.fixedcenter)!="undefined"){
if(ColdFusion.Util.isBoolean(_646.fixedcenter)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidcenter","widget",[_645],null,null,true);
return;
}else{
_646.fixedcenter=ColdFusion.Util.castBoolean(_646.fixedcenter);
}
}
if(typeof (_646.resizable)!="undefined"){
if(ColdFusion.Util.isBoolean(_646.resizable)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidresizable","widget",[_645],null,null,true);
return;
}else{
_646.resizable=ColdFusion.Util.castBoolean(_646.resizable);
}
}
if(typeof (_646.draggable)!="undefined"){
if(ColdFusion.Util.isBoolean(_646.draggable)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invaliddraggable","widget",[_645],null,null,true);
return;
}else{
_646.draggable=ColdFusion.Util.castBoolean(_646.draggable);
}
}
if(typeof (_646.closable)!="undefined"){
if(ColdFusion.Util.isBoolean(_646.closable)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidclosable","widget",[_645],null,null,true);
return;
}else{
_646.closable=ColdFusion.Util.castBoolean(_646.closable);
}
}
if(typeof (_646.modal)!="undefined"){
if(ColdFusion.Util.isBoolean(_646.modal)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidmodal","widget",[_645],null,null,true);
return;
}else{
_646.modal=ColdFusion.Util.castBoolean(_646.modal);
}
}
if(typeof (_646.refreshonshow)!="undefined"){
if(ColdFusion.Util.isBoolean(_646.refreshonshow)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidrefreshonshow","widget",[_645],null,null,true);
return;
}else{
_646._cf_refreshOnShow=ColdFusion.Util.castBoolean(_646.refreshonshow);
}
}
_646.shadow=true;
if(!_646.height){
_646.height=300;
}else{
if(ColdFusion.Util.isInteger(_646.height)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidheight","widget",[_645],null,null,true);
return;
}
}
if(!_646.width){
_646.width=500;
}else{
if(ColdFusion.Util.isInteger(_646.width)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidwidth","widget",[_645],null,null,true);
return;
}
}
var _648=false;
if(_646.minwidth){
if(ColdFusion.Util.isInteger(_646.minwidth)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidminwidth","widget",[_645],null,null,true);
return;
}
var _649=_646.minwidth;
var _64a=_646.width;
if(typeof (_649)!="number"){
_649=parseInt(_649);
}
if(typeof (_64a)!="number"){
_64a=parseInt(_64a);
}
if(_649>_64a){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidminwidth","widget",[_645],null,null,true);
return;
}
_646.minWidth=_646.minwidth;
_648=true;
}
if(_646.minheight){
if(ColdFusion.Util.isInteger(_646.minheight)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidminheight","widget",[_645],null,null,true);
return;
}
var _64b=_646.minheight;
var _64c=_646.height;
if(typeof (_64b)!="number"){
_64b=parseInt(_64b);
}
if(typeof (_64c)!="number"){
_64c=parseInt(_64c);
}
if(_64b>_64c){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidheightvalue","widget",[_645],null,null,true);
return;
}
_646.minHeight=_646.minheight;
_648=true;
}
if(_646.x){
if(ColdFusion.Util.isInteger(_646.x)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidx","widget",[_645],null,null,true);
return;
}
}
if(_646.y){
if(ColdFusion.Util.isInteger(_646.y)==false){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.invalidy","widget",[_645],null,null,true);
return;
}
}
if(typeof (_646.x)=="undefined"&&(typeof (_646.fixedcenter)=="undefined"||_646.fixedcenter==false)){
_646.x=ColdFusion.Window.xPosition;
ColdFusion.Window.xPosition+=15;
}
if(typeof (_646.y)=="undefined"&&(typeof (_646.fixedcenter)=="undefined"||_646.fixedcenter==false)){
_646.y=ColdFusion.Window.yPosition;
ColdFusion.Window.yPosition+=15;
}
if(typeof (_646.initshow)!="undefined"&&_646.initshow===false){
_646.tempinitshow=false;
if(typeof (_646.fixedcenter)!="undefined"&&_646.fixedcenter===true){
_646.tempcenter=_646.fixedcenter;
_646.fixedcenter=null;
}else{
_646.tempx=_646.x;
_646.tempy=_646.y;
}
_646.x=-10000;
_646.y=-10000;
}
_646.constraintoviewport=true;
_646.initshow=true;
if(_646.resizable!=null&&_646.resizable==false&&_648==true){
ColdFusion.Window.resetHTML(_645);
ColdFusion.handleError(null,"window.getupdatedconfigobject.minhwnotallowed","widget",[_645],null,null,true);
return;
}
_646.collapsible=false;
_646.shadow=true;
_646.isConfObj=true;
return _646;
};
ColdFusion.Window.show=function(_64d){
var _64e=ColdFusion.objectCache[_64d];
if(typeof (_64e)!="undefined"&&_64e!=null){
if(typeof (_64e.isConfObj)!="undefined"&&_64e.isConfObj==true){
_64e.initshow=true;
var _64f=ColdFusion.Window.createHTML(_64d,null,_64e.url,_64e,true);
ColdFusion.Window.createJSObj(_64d,_64e.url,_64f);
}else{
if(_64e.isVisible()==false){
_64e.show();
ColdFusion.Log.info("window.show.shown","widget",[_64d]);
}
if(_64e.tempcenter!=null){
_64e.center();
_64e.tempcenter=null;
}else{
if(_64e.getEl()&&_64e.getEl().getX()>0&&_64e.getEl().getY()>0){
_64e.tempx=null;
_64e.tempy=null;
}else{
if(_64e.tempx!=null&&_64e.tempy!=null){
_64e.setPosition(_64e.tempx,_64e.tempy);
_64e.tempx=null;
_64e.tempy=null;
}else{
var x=_64e.getEl().getX();
var y=_64e.getEl().getY();
_64e.setPosition(x+1,y+1);
_64e.setPosition(x,y);
}
}
}
}
}else{
ColdFusion.handleError(null,"window.show.notfound","widget",[_64d],null,null,true);
}
};
ColdFusion.Window.hide=function(_652){
var _653=ColdFusion.objectCache[_652];
if(_653){
if(_653.isVisible&&_653.isVisible()==true){
_653.hide();
ColdFusion.Log.info("window.hide.hidden","widget",[_652]);
}
}else{
ColdFusion.handleError(null,"window.hide.notfound","widget",[_652],null,null,true);
}
};
ColdFusion.Window.onShow=function(_654,_655){
var _656=ColdFusion.objectCache[_654];
if(typeof (_656)!="undefined"&&_656!=null){
_656._cf_onShow=_655;
if(_656.addListener){
_656.addListener("show",ColdFusion.Window.onShowWrapper);
}
}else{
ColdFusion.handleError(null,"window.onshow.notfound","widget",[_654],null,null,true);
}
};
ColdFusion.Window.onShowWrapper=function(_657){
_657._cf_onShow.call(null,_657.cfwindowname);
};
ColdFusion.Window.onHide=function(_658,_659){
var _65a=ColdFusion.objectCache[_658];
if(typeof (_65a)!="undefined"&&_65a!=null){
_65a._cf_onHide=_659;
if(_65a.addListener){
_65a.addListener("hide",ColdFusion.Window.onHideWrapper);
}
}else{
ColdFusion.handleError(null,"window.onhide.notfound","widget",[_658],null,null,true);
}
};
ColdFusion.Window.onHideWrapper=function(_65b){
_65b._cf_onHide.call(null,_65b.cfwindowname);
};
ColdFusion.Window.getWindowObject=function(_65c){
if(!_65c){
ColdFusion.handleError(null,"window.getwindowobject.emptyname","widget",null,null,null,true);
return;
}
var _65d=ColdFusion.objectCache[_65c];
if(_65d==null||(typeof (_65d.isConfObj)=="undefined"&&Ext.Window.prototype.isPrototypeOf(_65d)==false)){
ColdFusion.handleError(null,"window.getwindowobject.notfound","widget",[_65c],null,null,true);
return;
}
if(typeof (_65d.isConfObj)!="undefined"&&_65d.isConfObj==true){
_65d.initshow=true;
var _65e=ColdFusion.Window.createHTML(_65c,null,_65d.url,_65d,true);
ColdFusion.Window.createJSObj(_65c,_65d.url,_65e);
ColdFusion.Window.hide(_65c);
_65d=ColdFusion.objectCache[_65c];
}
return _65d;
};
