/*ADOBE SYSTEMS INCORPORATED
Copyright 2012 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
function cfinit(){
if(!window.ColdFusion){
ColdFusion={};
var $C=ColdFusion;
if(!$C.Ajax){
$C.Ajax={};
}
var $A=$C.Ajax;
if(!$C.AjaxProxy){
$C.AjaxProxy={};
}
var $X=$C.AjaxProxy;
if(!$C.Bind){
$C.Bind={};
}
var $B=$C.Bind;
if(!$C.Event){
$C.Event={};
}
var $E=$C.Event;
if(!$C.Log){
$C.Log={};
}
var $L=$C.Log;
if(!$C.Util){
$C.Util={};
}
var $U=$C.Util;
if(!$C.DOM){
$C.DOM={};
}
var $D=$C.DOM;
if(!$C.Spry){
$C.Spry={};
}
var $S=$C.Spry;
if(!$C.Pod){
$C.Pod={};
}
var $P=$C.Pod;
if(!$C.objectCache){
$C.objectCache={};
}
if(!$C.required){
$C.required={};
}
if(!$C.importedTags){
$C.importedTags=[];
}
if(!$C.requestCounter){
$C.requestCounter=0;
}
if(!$C.bindHandlerCache){
$C.bindHandlerCache={};
}
window._cf_loadingtexthtml="<div style=\"text-align: center;\">"+window._cf_loadingtexthtml+"&nbsp;"+CFMessage["loading"]+"</div>";
$C.globalErrorHandler=function(_63c,_63d){
if($L.isAvailable){
$L.error(_63c,_63d);
}
if($C.userGlobalErrorHandler){
$C.userGlobalErrorHandler(_63c);
}
if(!$L.isAvailable&&!$C.userGlobalErrorHandler){
alert(_63c+CFMessage["globalErrorHandler.alert"]);
}
};
$C.handleError=function(_63e,_63f,_640,_641,_642,_643,_644,_645){
var msg=$L.format(_63f,_641);
if(_63e){
$L.error(msg,"http");
if(!_642){
_642=-1;
}
if(!_643){
_643=msg;
}
_63e(_642,_643,_645);
}else{
if(_644){
$L.error(msg,"http");
throw msg;
}else{
$C.globalErrorHandler(msg,_640);
}
}
};
$C.setGlobalErrorHandler=function(_647){
$C.userGlobalErrorHandler=_647;
};
$A.createXMLHttpRequest=function(){
try{
return new XMLHttpRequest();
}
catch(e){
}
var _648=["Microsoft.XMLHTTP","MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP"];
for(var i=0;i<_648.length;i++){
try{
return new ActiveXObject(_648[i]);
}
catch(e){
}
}
return false;
};
$A.isRequestError=function(req){
return ((req.status!=0&&req.status!=200)||req.getResponseHeader("server-error"));
};
$A.sendMessage=function(url,_64c,_64d,_64e,_64f,_650,_651){
var req=$A.createXMLHttpRequest();
if(!_64c){
_64c="GET";
}
if(_64e&&_64f){
req.onreadystatechange=function(){
$A.callback(req,_64f,_650);
};
}
if(_64d){
_64d+="&_cf_nodebug=true&_cf_nocache=true";
}else{
_64d="_cf_nodebug=true&_cf_nocache=true";
}
if(window._cf_clientid){
_64d+="&_cf_clientid="+_cf_clientid;
}
if(_64c=="GET"){
if(_64d){
_64d+="&_cf_rc="+($C.requestCounter++);
if(url.indexOf("?")==-1){
url+="?"+_64d;
}else{
url+="&"+_64d;
}
}
$L.info("ajax.sendmessage.get","http",[url]);
req.open(_64c,url,_64e);
req.send(null);
}else{
$L.info("ajax.sendmessage.post","http",[url,_64d]);
req.open(_64c,url,_64e);
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
if(_64d){
req.send(_64d);
}else{
req.send(null);
}
}
if(!_64e){
while(req.readyState!=4){
}
if($A.isRequestError(req)){
$C.handleError(null,"ajax.sendmessage.error","http",[req.status,req.statusText],req.status,req.statusText,_651);
}else{
return req;
}
}
};
$A.callback=function(req,_654,_655){
if(req.readyState!=4){
return;
}
req.onreadystatechange=new Function;
_654(req,_655);
};
$A.submitForm=function(_656,url,_658,_659,_65a,_65b){
var _65c=$C.getFormQueryString(_656);
if(_65c==-1){
$C.handleError(_659,"ajax.submitform.formnotfound","http",[_656],-1,null,true);
return;
}
if(!_65a){
_65a="POST";
}
_65b=!(_65b===false);
var _65d=function(req){
$A.submitForm.callback(req,_656,_658,_659);
};
$L.info("ajax.submitform.submitting","http",[_656]);
var _65f=$A.sendMessage(url,_65a,_65c,_65b,_65d);
if(!_65b){
$L.info("ajax.submitform.success","http",[_656]);
return _65f.responseText;
}
};
$A.submitForm.callback=function(req,_661,_662,_663){
if($A.isRequestError(req)){
$C.handleError(_663,"ajax.submitform.error","http",[req.status,_661,req.statusText],req.status,req.statusText);
}else{
$L.info("ajax.submitform.success","http",[_661]);
if(_662){
_662(req.responseText);
}
}
};
$C.empty=function(){
};
$C.setSubmitClicked=function(_664,_665){
var el=$D.getElement(_665,_664);
el.cfinputbutton=true;
$C.setClickedProperty=function(){
el.clicked=true;
};
$E.addListener(el,"click",$C.setClickedProperty);
};
$C.getFormQueryString=function(_667,_668){
var _669;
if(typeof _667=="string"){
_669=(document.getElementById(_667)||document.forms[_667]);
}else{
if(typeof _667=="object"){
_669=_667;
}
}
if(!_669||null==_669.elements){
return -1;
}
var _66a,elementName,elementValue,elementDisabled;
var _66b=false;
var _66c=(_668)?{}:"";
for(var i=0;i<_669.elements.length;i++){
_66a=_669.elements[i];
elementDisabled=_66a.disabled;
elementName=_66a.name;
elementValue=_66a.value;
if(!elementDisabled&&elementName){
switch(_66a.type){
case "select-one":
case "select-multiple":
for(var j=0;j<_66a.options.length;j++){
if(_66a.options[j].selected){
if(window.ActiveXObject){
_66c=$C.getFormQueryString.processFormData(_66c,_668,elementName,_66a.options[j].attributes["value"].specified?_66a.options[j].value:_66a.options[j].text);
}else{
_66c=$C.getFormQueryString.processFormData(_66c,_668,elementName,_66a.options[j].hasAttribute("value")?_66a.options[j].value:_66a.options[j].text);
}
}
}
break;
case "radio":
case "checkbox":
if(_66a.checked){
_66c=$C.getFormQueryString.processFormData(_66c,_668,elementName,elementValue);
}
break;
case "file":
case undefined:
case "reset":
break;
case "button":
_66c=$C.getFormQueryString.processFormData(_66c,_668,elementName,elementValue);
break;
case "submit":
if(_66a.cfinputbutton){
if(_66b==false&&_66a.clicked){
_66c=$C.getFormQueryString.processFormData(_66c,_668,elementName,elementValue);
_66b=true;
}
}else{
_66c=$C.getFormQueryString.processFormData(_66c,_668,elementName,elementValue);
}
break;
case "textarea":
var _66f;
if(window.FCKeditorAPI&&(_66f=$C.objectCache[elementName])&&_66f.richtextid){
var _670=FCKeditorAPI.GetInstance(_66f.richtextid);
if(_670){
elementValue=_670.GetXHTML();
}
}
_66c=$C.getFormQueryString.processFormData(_66c,_668,elementName,elementValue);
break;
default:
_66c=$C.getFormQueryString.processFormData(_66c,_668,elementName,elementValue);
break;
}
}
}
if(!_668){
_66c=_66c.substr(0,_66c.length-1);
}
return _66c;
};
$C.getFormQueryString.processFormData=function(_671,_672,_673,_674){
if(_672){
if(_671[_673]){
_671[_673]+=","+_674;
}else{
_671[_673]=_674;
}
}else{
_671+=encodeURIComponent(_673)+"="+encodeURIComponent(_674)+"&";
}
return _671;
};
$A.importTag=function(_675){
$C.importedTags.push(_675);
};
$A.checkImportedTag=function(_676){
var _677=false;
for(var i=0;i<$C.importedTags.length;i++){
if($C.importedTags[i]==_676){
_677=true;
break;
}
}
if(!_677){
$C.handleError(null,"ajax.checkimportedtag.error","widget",[_676]);
}
};
$C.getElementValue=function(_679,_67a,_67b){
if(!_679){
$C.handleError(null,"getelementvalue.noelementname","bind",null,null,null,true);
return;
}
if(!_67b){
_67b="value";
}
var _67c=$B.getBindElementValue(_679,_67a,_67b);
if(typeof (_67c)=="undefined"){
_67c=null;
}
if(_67c==null){
$C.handleError(null,"getelementvalue.elnotfound","bind",[_679,_67b],null,null,true);
return;
}
return _67c;
};
$B.getBindElementValue=function(_67d,_67e,_67f,_680,_681){
var _682="";
if(window[_67d]){
var _683=eval(_67d);
if(_683&&_683._cf_getAttribute){
_682=_683._cf_getAttribute(_67f);
return _682;
}
}
var _684=$C.objectCache[_67d];
if(_684&&_684._cf_getAttribute){
_682=_684._cf_getAttribute(_67f);
return _682;
}
var el=$D.getElement(_67d,_67e);
var _686=(el&&((!el.length&&el.length!=0)||(el.length&&el.length>0)||el.tagName=="SELECT"));
if(!_686&&!_681){
$C.handleError(null,"bind.getbindelementvalue.elnotfound","bind",[_67d]);
return null;
}
if(el.tagName!="SELECT"){
if(el.length>1){
var _687=true;
for(var i=0;i<el.length;i++){
var _689=(el[i].getAttribute("type")=="radio"||el[i].getAttribute("type")=="checkbox");
if(!_689||(_689&&el[i].checked)){
if(!_687){
_682+=",";
}
_682+=$B.getBindElementValue.extract(el[i],_67f);
_687=false;
}
}
}else{
_682=$B.getBindElementValue.extract(el,_67f);
}
}else{
var _687=true;
for(var i=0;i<el.options.length;i++){
if(el.options[i].selected){
if(!_687){
_682+=",";
}
_682+=$B.getBindElementValue.extract(el.options[i],_67f);
_687=false;
}
}
}
if(typeof (_682)=="object"){
$C.handleError(null,"bind.getbindelementvalue.simplevalrequired","bind",[_67d,_67f]);
return null;
}
if(_680&&$C.required[_67d]&&_682.length==0){
return null;
}
return _682;
};
$B.getBindElementValue.extract=function(el,_68b){
var _68c=el[_68b];
if((_68c==null||typeof (_68c)=="undefined")&&el.getAttribute){
_68c=el.getAttribute(_68b);
}
return _68c;
};
$L.init=function(){
if(window.YAHOO&&YAHOO.widget&&YAHOO.widget.Logger){
YAHOO.widget.Logger.categories=[CFMessage["debug"],CFMessage["info"],CFMessage["error"],CFMessage["window"]];
YAHOO.widget.LogReader.prototype.formatMsg=function(_68d){
var _68e=_68d.category;
return "<p>"+"<span class='"+_68e+"'>"+_68e+"</span>:<i>"+_68d.source+"</i>: "+_68d.msg+"</p>";
};
var _68f=new YAHOO.widget.LogReader(null,{width:"30em",fontSize:"100%"});
_68f.setTitle(CFMessage["log.title"]||"ColdFusion AJAX Logger");
_68f._btnCollapse.value=CFMessage["log.collapse"]||"Collapse";
_68f._btnPause.value=CFMessage["log.pause"]||"Pause";
_68f._btnClear.value=CFMessage["log.clear"]||"Clear";
$L.isAvailable=true;
}
};
$L.log=function(_690,_691,_692,_693){
if(!$L.isAvailable){
return;
}
if(!_692){
_692="global";
}
_692=CFMessage[_692]||_692;
_691=CFMessage[_691]||_691;
_690=$L.format(_690,_693);
YAHOO.log(_690,_691,_692);
};
$L.format=function(code,_695){
var msg=CFMessage[code]||code;
if(_695){
for(i=0;i<_695.length;i++){
if(!_695[i].length){
_695[i]="";
}
var _697="{"+i+"}";
msg=msg.replace(_697,_695[i]);
}
}
return msg;
};
$L.debug=function(_698,_699,_69a){
$L.log(_698,"debug",_699,_69a);
};
$L.info=function(_69b,_69c,_69d){
$L.log(_69b,"info",_69c,_69d);
};
$L.error=function(_69e,_69f,_6a0){
$L.log(_69e,"error",_69f,_6a0);
};
$L.dump=function(_6a1,_6a2){
if($L.isAvailable){
var dump=(/string|number|undefined|boolean/.test(typeof (_6a1))||_6a1==null)?_6a1:recurse(_6a1,typeof _6a1,true);
$L.debug(dump,_6a2);
}
};
$X.invoke=function(_6a4,_6a5,_6a6,_6a7,_6a8){
return $X.invokeInternal(_6a4,_6a5,_6a6,_6a7,_6a8,false,null,null);
};
$X.invokeInternal=function(_6a9,_6aa,_6ab,_6ac,_6ad,_6ae,_6af,_6b0){
var _6b1="method="+_6aa+"&_cf_ajaxproxytoken="+_6ab;
if(_6ae){
_6b1+="&_cfclient="+"true";
var _6b2=$X.JSON.encodeInternal(_6a9._variables,_6ae);
_6b1+="&_variables="+encodeURIComponent(_6b2);
var _6b3=$X.JSON.encodeInternal(_6a9._metadata,_6ae);
_6b1+="&_metadata="+encodeURIComponent(_6b3);
}
var _6b4=_6a9.returnFormat||"json";
_6b1+="&returnFormat="+_6b4;
if(_6a9.queryFormat){
_6b1+="&queryFormat="+_6a9.queryFormat;
}
if(_6a9.formId){
var _6b5=$C.getFormQueryString(_6a9.formId,true);
if(_6ac!=null){
for(prop in _6b5){
_6ac[prop]=_6b5[prop];
}
}else{
_6ac=_6b5;
}
_6a9.formId=null;
}
var _6b6="";
if(_6ac!=null){
_6b6=$X.JSON.encodeInternal(_6ac,_6ae);
_6b1+="&argumentCollection="+encodeURIComponent(_6b6);
}
$L.info("ajaxproxy.invoke.invoking","http",[_6a9.cfcPath,_6aa,_6b6]);
if(_6a9.callHandler){
_6a9.callHandler.call(null,_6a9.callHandlerParams,_6a9.cfcPath,_6b1);
return;
}
var _6b7;
var _6b8=_6a9.async;
if(_6af!=null){
_6b8=true;
_6b7=function(req){
$X.callbackOp(req,_6a9,_6ad,_6af,_6b0);
};
}else{
if(_6a9.async){
_6b7=function(req){
$X.callback(req,_6a9,_6ad);
};
}
}
var req=$A.sendMessage(_6a9.cfcPath,_6a9.httpMethod,_6b1,_6b8,_6b7,null,true);
if(!_6b8){
return $X.processResponse(req,_6a9);
}
};
$X.callback=function(req,_6bd,_6be){
if($A.isRequestError(req)){
$C.handleError(_6bd.errorHandler,"ajaxproxy.invoke.error","http",[req.status,_6bd.cfcPath,req.statusText],req.status,req.statusText,false,_6be);
}else{
if(_6bd.callbackHandler){
var _6bf=$X.processResponse(req,_6bd);
_6bd.callbackHandler(_6bf,_6be);
}
}
};
$X.callbackOp=function(req,_6c1,_6c2,_6c3,_6c4){
if($A.isRequestError(req)){
var _6c5=_6c1.errorHandler;
if(_6c4!=null){
_6c5=_6c4;
}
$C.handleError(_6c5,"ajaxproxy.invoke.error","http",[req.status,_6c1.cfcPath,req.statusText],req.status,req.statusText,false,_6c2);
}else{
if(_6c3){
var _6c6=$X.processResponse(req,_6c1);
_6c3(_6c6,_6c2);
}
}
};
$X.processResponse=function(req,_6c8){
var _6c9=true;
for(var i=0;i<req.responseText.length;i++){
var c=req.responseText.charAt(i);
_6c9=(c==" "||c=="\n"||c=="\t"||c=="\r");
if(!_6c9){
break;
}
}
var _6cc=(req.responseXML&&req.responseXML.childNodes.length>0);
var _6cd=_6cc?"[XML Document]":req.responseText;
$L.info("ajaxproxy.invoke.response","http",[_6cd]);
var _6ce;
var _6cf=_6c8.returnFormat||"json";
if(_6cf=="json"){
try{
_6ce=_6c9?null:$X.JSON.decode(req.responseText);
}
catch(e){
if(typeof _6c8._metadata!=="undefined"&&_6c8._metadata.servercfc&&typeof req.responseText==="string"){
_6ce=req.responseText;
}else{
throw e;
}
}
}else{
_6ce=_6cc?req.responseXML:(_6c9?null:req.responseText);
}
return _6ce;
};
$X.init=function(_6d0,_6d1,_6d2){
if(typeof _6d2==="undefined"){
_6d2=false;
}
var _6d3=_6d1;
if(!_6d2){
var _6d4=_6d1.split(".");
var ns=self;
for(i=0;i<_6d4.length-1;i++){
if(_6d4[i].length){
ns[_6d4[i]]=ns[_6d4[i]]||{};
ns=ns[_6d4[i]];
}
}
var _6d6=_6d4[_6d4.length-1];
if(ns[_6d6]){
return ns[_6d6];
}
ns[_6d6]=function(){
this.httpMethod="GET";
this.async=false;
this.callbackHandler=null;
this.errorHandler=null;
this.formId=null;
};
_6d3=ns[_6d6].prototype;
}else{
_6d3.httpMethod="GET";
_6d3.async=false;
_6d3.callbackHandler=null;
_6d3.errorHandler=null;
_6d3.formId=null;
}
_6d3.cfcPath=_6d0;
_6d3.setHTTPMethod=function(_6d7){
if(_6d7){
_6d7=_6d7.toUpperCase();
}
if(_6d7!="GET"&&_6d7!="POST"){
$C.handleError(null,"ajaxproxy.sethttpmethod.invalidmethod","http",[_6d7],null,null,true);
}
this.httpMethod=_6d7;
};
_6d3.setSyncMode=function(){
this.async=false;
};
_6d3.setAsyncMode=function(){
this.async=true;
};
_6d3.setCallbackHandler=function(fn){
this.callbackHandler=fn;
this.setAsyncMode();
};
_6d3.setErrorHandler=function(fn){
this.errorHandler=fn;
this.setAsyncMode();
};
_6d3.setForm=function(fn){
this.formId=fn;
};
_6d3.setQueryFormat=function(_6db){
if(_6db){
_6db=_6db.toLowerCase();
}
if(!_6db||(_6db!="column"&&_6db!="row"&&_6db!="struct")){
$C.handleError(null,"ajaxproxy.setqueryformat.invalidformat","http",[_6db],null,null,true);
}
this.queryFormat=_6db;
};
_6d3.setReturnFormat=function(_6dc){
if(_6dc){
_6dc=_6dc.toLowerCase();
}
if(!_6dc||(_6dc!="plain"&&_6dc!="json"&&_6dc!="wddx")){
$C.handleError(null,"ajaxproxy.setreturnformat.invalidformat","http",[_6dc],null,null,true);
}
this.returnFormat=_6dc;
};
$L.info("ajaxproxy.init.created","http",[_6d0]);
if(_6d2){
return _6d3;
}else{
return ns[_6d6];
}
};
$U.isWhitespace=function(s){
var _6de=true;
for(var i=0;i<s.length;i++){
var c=s.charAt(i);
_6de=(c==" "||c=="\n"||c=="\t"||c=="\r");
if(!_6de){
break;
}
}
return _6de;
};
$U.getFirstNonWhitespaceIndex=function(s){
var _6e2=true;
for(var i=0;i<s.length;i++){
var c=s.charAt(i);
_6e2=(c==" "||c=="\n"||c=="\t"||c=="\r");
if(!_6e2){
break;
}
}
return i;
};
$C.trim=function(_6e5){
return _6e5.replace(/^\s+|\s+$/g,"");
};
$U.isInteger=function(n){
var _6e7=true;
if(typeof (n)=="number"){
_6e7=(n>=0);
}else{
for(i=0;i<n.length;i++){
if($U.isInteger.numberChars.indexOf(n.charAt(i))==-1){
_6e7=false;
break;
}
}
}
return _6e7;
};
$U.isInteger.numberChars="0123456789";
$U.isArray=function(a){
return (typeof (a.length)=="number"&&!a.toUpperCase);
};
$U.isBoolean=function(b){
if(b===true||b===false){
return true;
}else{
if(b.toLowerCase){
b=b.toLowerCase();
return (b==$U.isBoolean.trueChars||b==$U.isBoolean.falseChars);
}else{
return false;
}
}
};
$U.isBoolean.trueChars="true";
$U.isBoolean.falseChars="false";
$U.castBoolean=function(b){
if(b===true){
return true;
}else{
if(b===false){
return false;
}else{
if(b.toLowerCase){
b=b.toLowerCase();
if(b==$U.isBoolean.trueChars){
return true;
}else{
if(b==$U.isBoolean.falseChars){
return false;
}else{
return false;
}
}
}else{
return false;
}
}
}
};
$U.checkQuery=function(o){
var _6ec=null;
if(o&&o.COLUMNS&&$U.isArray(o.COLUMNS)&&o.DATA&&$U.isArray(o.DATA)&&(o.DATA.length==0||(o.DATA.length>0&&$U.isArray(o.DATA[0])))){
_6ec="row";
}else{
if(o&&o.COLUMNS&&$U.isArray(o.COLUMNS)&&o.ROWCOUNT&&$U.isInteger(o.ROWCOUNT)&&o.DATA){
_6ec="col";
for(var i=0;i<o.COLUMNS.length;i++){
var _6ee=o.DATA[o.COLUMNS[i]];
if(!_6ee||!$U.isArray(_6ee)){
_6ec=null;
break;
}
}
}
}
return _6ec;
};
$X.JSON=new function(){
var _6ef={}.hasOwnProperty?true:false;
var _6f0=/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;
var pad=function(n){
return n<10?"0"+n:n;
};
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};
var _6f4=function(s){
if(/["\\\x00-\x1f]/.test(s)){
return "\""+s.replace(/([\x00-\x1f\\"])/g,function(a,b){
var c=m[b];
if(c){
return c;
}
c=b.charCodeAt();
return "\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
})+"\"";
}
return "\""+s+"\"";
};
var _6f9=function(o){
var a=["["],b,i,l=o.length,v;
for(i=0;i<l;i+=1){
v=o[i];
switch(typeof v){
case "undefined":
case "function":
case "unknown":
break;
default:
if(b){
a.push(",");
}
a.push(v===null?"null":$X.JSON.encode(v));
b=true;
}
}
a.push("]");
return a.join("");
};
var _6fc=function(o){
return "\""+o.getFullYear()+"-"+pad(o.getMonth()+1)+"-"+pad(o.getDate())+"T"+pad(o.getHours())+":"+pad(o.getMinutes())+":"+pad(o.getSeconds())+"\"";
};
this.encode=function(o){
return this.encodeInternal(o,false);
};
this.encodeInternal=function(o,cfc){
if(typeof o=="undefined"||o===null){
return "null";
}else{
if(o instanceof Array){
return _6f9(o);
}else{
if(o instanceof Date){
if(cfc){
return this.encodeInternal({_date_:o.getTime()},cfc);
}
return _6fc(o);
}else{
if(typeof o=="string"){
return _6f4(o);
}else{
if(typeof o=="number"){
return isFinite(o)?String(o):"null";
}else{
if(typeof o=="boolean"){
return String(o);
}else{
if(cfc&&typeof o=="object"&&typeof o._metadata!=="undefined"){
return "{\"_metadata\":"+this.encodeInternal(o._metadata,false)+",\"_variables\":"+this.encodeInternal(o._variables,cfc)+"}";
}else{
var a=["{"],b,i,v;
for(var i in o){
if(!_6ef||o.hasOwnProperty(i)){
v=o[i];
switch(typeof v){
case "undefined":
case "function":
case "unknown":
break;
default:
if(b){
a.push(",");
}
a.push(this.encodeInternal(i,cfc),":",v===null?"null":this.encodeInternal(v,cfc));
b=true;
}
}
}
a.push("}");
return a.join("");
}
}
}
}
}
}
}
};
this.decode=function(json){
if(typeof json=="object"){
return json;
}
if($U.isWhitespace(json)){
return null;
}
var _704=$U.getFirstNonWhitespaceIndex(json);
if(_704>0){
json=json.slice(_704);
}
if(window._cf_jsonprefix&&json.indexOf(_cf_jsonprefix)==0){
json=json.slice(_cf_jsonprefix.length);
}
try{
if(_6f0.test(json)){
return eval("("+json+")");
}
}
catch(e){
}
throw new SyntaxError("parseJSON");
};
}();
if(!$C.JSON){
$C.JSON={};
}
$C.JSON.encode=$X.JSON.encode;
$C.JSON.encodeInternal=$X.JSON.encodeInternal;
$C.JSON.decode=$X.JSON.decode;
$C.navigate=function(url,_706,_707,_708,_709,_70a){
if(url==null){
$C.handleError(_708,"navigate.urlrequired","widget");
return;
}
if(_709){
_709=_709.toUpperCase();
if(_709!="GET"&&_709!="POST"){
$C.handleError(null,"navigate.invalidhttpmethod","http",[_709],null,null,true);
}
}else{
_709="GET";
}
var _70b;
if(_70a){
_70b=$C.getFormQueryString(_70a);
if(_70b==-1){
$C.handleError(null,"navigate.formnotfound","http",[_70a],null,null,true);
}
}
if(_706==null){
if(_70b){
if(url.indexOf("?")==-1){
url+="?"+_70b;
}else{
url+="&"+_70b;
}
}
$L.info("navigate.towindow","widget",[url]);
window.location.replace(url);
return;
}
$L.info("navigate.tocontainer","widget",[url,_706]);
var obj=$C.objectCache[_706];
if(obj!=null){
if(typeof (obj._cf_body)!="undefined"&&obj._cf_body!=null){
_706=obj._cf_body;
}
}
$A.replaceHTML(_706,url,_709,_70b,_707,_708);
};
$A.checkForm=function(_70d,_70e,_70f,_710,_711){
var _712=_70e.call(null,_70d);
if(_712==false){
return false;
}
var _713=$C.getFormQueryString(_70d);
$L.info("ajax.submitform.submitting","http",[_70d.name]);
$A.replaceHTML(_70f,_70d.action,_70d.method,_713,_710,_711);
return false;
};
$A.replaceHTML=function(_714,url,_716,_717,_718,_719){
var _71a=document.getElementById(_714);
if(!_71a){
$C.handleError(_719,"ajax.replacehtml.elnotfound","http",[_714]);
return;
}
var _71b="_cf_containerId="+encodeURIComponent(_714);
_717=(_717)?_717+"&"+_71b:_71b;
$L.info("ajax.replacehtml.replacing","http",[_714,url,_717]);
if(_cf_loadingtexthtml){
try{
_71a.innerHTML=_cf_loadingtexthtml;
}
catch(e){
}
}
var _71c=function(req,_71e){
var _71f=false;
if($A.isRequestError(req)){
$C.handleError(_719,"ajax.replacehtml.error","http",[req.status,_71e.id,req.statusText],req.status,req.statusText);
_71f=true;
}
var _720=new $E.CustomEvent("onReplaceHTML",_71e);
var _721=new $E.CustomEvent("onReplaceHTMLUser",_71e);
$E.loadEvents[_71e.id]={system:_720,user:_721};
if(req.responseText.search(/<script/i)!=-1){
try{
_71e.innerHTML="";
}
catch(e){
}
$A.replaceHTML.processResponseText(req.responseText,_71e,_719);
}else{
try{
_71e.innerHTML=req.responseText;
$A.updateLayouttab(_71e);
}
catch(e){
}
}
$E.loadEvents[_71e.id]=null;
_720.fire();
_720.unsubscribe();
_721.fire();
_721.unsubscribe();
$L.info("ajax.replacehtml.success","http",[_71e.id]);
if(_718&&!_71f){
_718();
}
};
try{
$A.sendMessage(url,_716,_717,true,_71c,_71a);
}
catch(e){
try{
_71a.innerHTML=$L.format(CFMessage["ajax.replacehtml.connectionerrordisplay"],[url,e]);
}
catch(e){
}
$C.handleError(_719,"ajax.replacehtml.connectionerror","http",[_714,url,e]);
}
};
$A.replaceHTML.processResponseText=function(text,_723,_724){
var pos=0;
var _726=0;
var _727=0;
_723._cf_innerHTML="";
while(pos<text.length){
var _728=text.indexOf("<s",pos);
if(_728==-1){
_728=text.indexOf("<S",pos);
}
if(_728==-1){
break;
}
pos=_728;
var _729=true;
var _72a=$A.replaceHTML.processResponseText.scriptTagChars;
for(var i=1;i<_72a.length;i++){
var _72c=pos+i+1;
if(_72c>text.length){
break;
}
var _72d=text.charAt(_72c);
if(_72a[i][0]!=_72d&&_72a[i][1]!=_72d){
pos+=i+1;
_729=false;
break;
}
}
if(!_729){
continue;
}
var _72e=text.substring(_726,pos);
if(_72e){
_723._cf_innerHTML+=_72e;
}
var _72f=text.indexOf(">",pos)+1;
if(_72f==0){
pos++;
continue;
}else{
pos+=7;
}
var _730=_72f;
while(_730<text.length&&_730!=-1){
_730=text.indexOf("</s",_730);
if(_730==-1){
_730=text.indexOf("</S",_730);
}
if(_730!=-1){
_729=true;
for(var i=1;i<_72a.length;i++){
var _72c=_730+2+i;
if(_72c>text.length){
break;
}
var _72d=text.charAt(_72c);
if(_72a[i][0]!=_72d&&_72a[i][1]!=_72d){
_730=_72c;
_729=false;
break;
}
}
if(_729){
break;
}
}
}
if(_730!=-1){
var _731=text.substring(_72f,_730);
var _732=_731.indexOf("<!--");
if(_732!=-1){
_731=_731.substring(_732+4);
}
var _733=_731.lastIndexOf("//-->");
if(_733!=-1){
_731=_731.substring(0,_733-1);
}
if(_731.indexOf("document.write")!=-1||_731.indexOf("CF_RunContent")!=-1){
if(_731.indexOf("CF_RunContent")!=-1){
_731=_731.replace("CF_RunContent","document.write");
}
_731="var _cfDomNode = document.getElementById('"+_723.id+"'); var _cfBuffer='';"+"if (!document._cf_write)"+"{document._cf_write = document.write;"+"document.write = function(str){if (_cfBuffer!=null){_cfBuffer+=str;}else{document._cf_write(str);}};};"+_731+";_cfDomNode._cf_innerHTML += _cfBuffer; _cfBuffer=null;";
}
try{
eval(_731);
}
catch(ex){
$C.handleError(_724,"ajax.replacehtml.jserror","http",[_723.id,ex]);
}
}
_728=text.indexOf(">",_730)+1;
if(_728==0){
_727=_730+1;
break;
}
_727=_728;
pos=_728;
_726=_728;
}
if(_727<text.length-1){
var _72e=text.substring(_727,text.length);
if(_72e){
_723._cf_innerHTML+=_72e;
}
}
try{
_723.innerHTML=_723._cf_innerHTML;
$A.updateLayouttab(_723);
}
catch(e){
}
_723._cf_innerHTML="";
};
$A.updateLayouttab=function(_734){
var _735=_734.id;
if(_735.length>13&&_735.indexOf("cf_layoutarea")==0){
var s=_735.substr(13,_735.length);
var cmp=Ext.getCmp(s);
var _738=_734.innerHTML;
if(cmp){
cmp.update("<div id="+_734.id+">"+_734.innerHTML+"</div>");
}
var _739=document.getElementById(_735);
if(_739){
_739.innerHTML=_738;
}
}
};
$A.replaceHTML.processResponseText.scriptTagChars=[["s","S"],["c","C"],["r","R"],["i","I"],["p","P"],["t","T"]];
$D.getElement=function(_73a,_73b){
var _73c=function(_73d){
return (_73d.name==_73a||_73d.id==_73a);
};
var _73e=$D.getElementsBy(_73c,null,_73b);
if(_73e.length==1){
return _73e[0];
}else{
return _73e;
}
};
$D.getElementsBy=function(_73f,tag,root){
tag=tag||"*";
var _742=[];
if(root){
root=$D.get(root);
if(!root){
return _742;
}
}else{
root=document;
}
var _743=root.getElementsByTagName(tag);
if(!_743.length&&(tag=="*"&&root.all)){
_743=root.all;
}
for(var i=0,len=_743.length;i<len;++i){
if(_73f(_743[i])){
_742[_742.length]=_743[i];
}
}
return _742;
};
$D.get=function(el){
if(!el){
return null;
}
if(typeof el!="string"&&!(el instanceof Array)){
return el;
}
if(typeof el=="string"){
return document.getElementById(el);
}else{
var _746=[];
for(var i=0,len=el.length;i<len;++i){
_746[_746.length]=$D.get(el[i]);
}
return _746;
}
return null;
};
$E.loadEvents={};
$E.CustomEvent=function(_748,_749){
return {name:_748,domNode:_749,subs:[],subscribe:function(func,_74b){
var dup=false;
for(var i=0;i<this.subs.length;i++){
var sub=this.subs[i];
if(sub.f==func&&sub.p==_74b){
dup=true;
break;
}
}
if(!dup){
this.subs.push({f:func,p:_74b});
}
},fire:function(){
for(var i=0;i<this.subs.length;i++){
var sub=this.subs[i];
sub.f.call(null,this,sub.p);
}
},unsubscribe:function(){
this.subscribers=[];
}};
};
$E.windowLoadImpEvent=new $E.CustomEvent("cfWindowLoadImp");
$E.windowLoadEvent=new $E.CustomEvent("cfWindowLoad");
$E.windowLoadUserEvent=new $E.CustomEvent("cfWindowLoadUser");
$E.listeners=[];
$E.addListener=function(el,ev,fn,_754){
var l={el:el,ev:ev,fn:fn,params:_754};
$E.listeners.push(l);
var _756=function(e){
if(!e){
var e=window.event;
}
fn.call(null,e,_754);
};
if(el.addEventListener){
el.addEventListener(ev,_756,false);
return true;
}else{
if(el.attachEvent){
el.attachEvent("on"+ev,_756);
return true;
}else{
return false;
}
}
};
$E.isListener=function(el,ev,fn,_75b){
var _75c=false;
var ls=$E.listeners;
for(var i=0;i<ls.length;i++){
if(ls[i].el==el&&ls[i].ev==ev&&ls[i].fn==fn&&ls[i].params==_75b){
_75c=true;
break;
}
}
return _75c;
};
$E.callBindHandlers=function(id,_760,ev){
var el=document.getElementById(id);
if(!el){
return;
}
var ls=$E.listeners;
for(var i=0;i<ls.length;i++){
if(ls[i].el==el&&ls[i].ev==ev&&ls[i].fn._cf_bindhandler){
ls[i].fn.call(null,null,ls[i].params);
}
}
};
$E.registerOnLoad=function(func,_766,_767,user){
if($E.registerOnLoad.windowLoaded){
if(_766&&_766._cf_containerId&&$E.loadEvents[_766._cf_containerId]){
if(user){
$E.loadEvents[_766._cf_containerId].user.subscribe(func,_766);
}else{
$E.loadEvents[_766._cf_containerId].system.subscribe(func,_766);
}
}else{
func.call(null,null,_766);
}
}else{
if(user){
$E.windowLoadUserEvent.subscribe(func,_766);
}else{
if(_767){
$E.windowLoadImpEvent.subscribe(func,_766);
}else{
$E.windowLoadEvent.subscribe(func,_766);
}
}
}
};
$E.registerOnLoad.windowLoaded=false;
$E.onWindowLoad=function(fn){
if(window.addEventListener){
window.addEventListener("load",fn,false);
}else{
if(window.attachEvent){
window.attachEvent("onload",fn);
}else{
if(document.getElementById){
window.onload=fn;
}
}
}
};
$C.addSpanToDom=function(){
var _76a=document.createElement("span");
document.body.insertBefore(_76a,document.body.firstChild);
};
$E.windowLoadHandler=function(e){
if(window.Ext){
Ext.BLANK_IMAGE_URL=_cf_ajaxscriptsrc+"/resources/ext/images/default/s.gif";
}
$C.addSpanToDom();
$L.init();
$E.registerOnLoad.windowLoaded=true;
$E.windowLoadImpEvent.fire();
$E.windowLoadImpEvent.unsubscribe();
$E.windowLoadEvent.fire();
$E.windowLoadEvent.unsubscribe();
if(window.Ext){
Ext.onReady(function(){
$E.windowLoadUserEvent.fire();
});
}else{
$E.windowLoadUserEvent.fire();
}
$E.windowLoadUserEvent.unsubscribe();
};
$E.onWindowLoad($E.windowLoadHandler);
$B.register=function(_76c,_76d,_76e,_76f){
for(var i=0;i<_76c.length;i++){
var _771=_76c[i][0];
var _772=_76c[i][1];
var _773=_76c[i][2];
if(window[_771]){
var _774=eval(_771);
if(_774&&_774._cf_register){
_774._cf_register(_773,_76e,_76d);
continue;
}
}
var _775=$C.objectCache[_771];
if(_775&&_775._cf_register){
_775._cf_register(_773,_76e,_76d);
continue;
}
var _776=$D.getElement(_771,_772);
var _777=(_776&&((!_776.length&&_776.length!=0)||(_776.length&&_776.length>0)||_776.tagName=="SELECT"));
if(!_777){
$C.handleError(null,"bind.register.elnotfound","bind",[_771]);
}
if(_776.length>1&&!_776.options){
for(var j=0;j<_776.length;j++){
$B.register.addListener(_776[j],_773,_76e,_76d);
}
}else{
$B.register.addListener(_776,_773,_76e,_76d);
}
}
if(!$C.bindHandlerCache[_76d.bindTo]&&typeof (_76d.bindTo)=="string"){
$C.bindHandlerCache[_76d.bindTo]=function(){
_76e.call(null,null,_76d);
};
}
if(_76f){
_76e.call(null,null,_76d);
}
};
$B.register.addListener=function(_779,_77a,_77b,_77c){
if(!$E.isListener(_779,_77a,_77b,_77c)){
$E.addListener(_779,_77a,_77b,_77c);
}
};
$B.assignValue=function(_77d,_77e,_77f,_780){
if(!_77d){
return;
}
if(_77d.call){
_77d.call(null,_77f,_780);
return;
}
var _781=$C.objectCache[_77d];
if(_781&&_781._cf_setValue){
_781._cf_setValue(_77f);
return;
}
var _782=document.getElementById(_77d);
if(!_782){
$C.handleError(null,"bind.assignvalue.elnotfound","bind",[_77d]);
}
if(_782.tagName=="SELECT"){
var _783=$U.checkQuery(_77f);
var _784=$C.objectCache[_77d];
if(_783){
if(!_784||(_784&&(!_784.valueCol||!_784.displayCol))){
$C.handleError(null,"bind.assignvalue.selboxmissingvaldisplay","bind",[_77d]);
return;
}
}else{
if(typeof (_77f.length)=="number"&&!_77f.toUpperCase){
if(_77f.length>0&&(typeof (_77f[0].length)!="number"||_77f[0].toUpperCase)){
$C.handleError(null,"bind.assignvalue.selboxerror","bind",[_77d]);
return;
}
}else{
$C.handleError(null,"bind.assignvalue.selboxerror","bind",[_77d]);
return;
}
}
_782.options.length=0;
var _785;
var _786=false;
if(_784){
_785=_784.selected;
if(_785&&_785.length>0){
_786=true;
}
}
if(!_783){
for(var i=0;i<_77f.length;i++){
var opt=new Option(_77f[i][1],_77f[i][0]);
_782.options[i]=opt;
if(_786){
for(var j=0;j<_785.length;j++){
if(_785[j]==opt.value){
opt.selected=true;
}
}
}
}
}else{
if(_783=="col"){
var _78a=_77f.DATA[_784.valueCol];
var _78b=_77f.DATA[_784.displayCol];
if(!_78a||!_78b){
$C.handleError(null,"bind.assignvalue.selboxinvalidvaldisplay","bind",[_77d]);
return;
}
for(var i=0;i<_78a.length;i++){
var opt=new Option(_78b[i],_78a[i]);
_782.options[i]=opt;
if(_786){
for(var j=0;j<_785.length;j++){
if(_785[j]==opt.value){
opt.selected=true;
}
}
}
}
}else{
if(_783=="row"){
var _78c=-1;
var _78d=-1;
for(var i=0;i<_77f.COLUMNS.length;i++){
var col=_77f.COLUMNS[i];
if(col==_784.valueCol){
_78c=i;
}
if(col==_784.displayCol){
_78d=i;
}
if(_78c!=-1&&_78d!=-1){
break;
}
}
if(_78c==-1||_78d==-1){
$C.handleError(null,"bind.assignvalue.selboxinvalidvaldisplay","bind",[_77d]);
return;
}
for(var i=0;i<_77f.DATA.length;i++){
var opt=new Option(_77f.DATA[i][_78d],_77f.DATA[i][_78c]);
_782.options[i]=opt;
if(_786){
for(var j=0;j<_785.length;j++){
if(_785[j]==opt.value){
opt.selected=true;
}
}
}
}
}
}
}
}else{
_782[_77e]=_77f;
}
$E.callBindHandlers(_77d,null,"change");
$L.info("bind.assignvalue.success","bind",[_77f,_77d,_77e]);
};
$B.localBindHandler=function(e,_790){
var _791=document.getElementById(_790.bindTo);
var _792=$B.evaluateBindTemplate(_790,true);
$B.assignValue(_790.bindTo,_790.bindToAttr,_792);
};
$B.localBindHandler._cf_bindhandler=true;
$B.evaluateBindTemplate=function(_793,_794,_795,_796,_797){
var _798=_793.bindExpr;
var _799="";
if(typeof _797=="undefined"){
_797=false;
}
for(var i=0;i<_798.length;i++){
if(typeof (_798[i])=="object"){
var _79b=null;
if(!_798[i].length||typeof _798[i][0]=="object"){
_79b=$X.JSON.encode(_798[i]);
}else{
var _79b=$B.getBindElementValue(_798[i][0],_798[i][1],_798[i][2],_794,_796);
if(_79b==null){
if(_794){
_799="";
break;
}else{
_79b="";
}
}
}
if(_795){
_79b=encodeURIComponent(_79b);
}
_799+=_79b;
}else{
var _79c=_798[i];
if(_797==true&&i>0){
if(typeof (_79c)=="string"&&_79c.indexOf("&")!=0){
_79c=encodeURIComponent(_79c);
}
}
_799+=_79c;
}
}
return _799;
};
$B.jsBindHandler=function(e,_79e){
var _79f=_79e.bindExpr;
var _7a0=new Array();
var _7a1=_79e.callFunction+"(";
for(var i=0;i<_79f.length;i++){
var _7a3;
if(typeof (_79f[i])=="object"){
if(_79f[i].length){
if(typeof _79f[i][0]=="object"){
_7a3=_79f[i];
}else{
_7a3=$B.getBindElementValue(_79f[i][0],_79f[i][1],_79f[i][2],false);
}
}else{
_7a3=_79f[i];
}
}else{
_7a3=_79f[i];
}
if(i!=0){
_7a1+=",";
}
_7a0[i]=_7a3;
_7a1+="'"+_7a3+"'";
}
_7a1+=")";
var _7a4=_79e.callFunction.apply(null,_7a0);
$B.assignValue(_79e.bindTo,_79e.bindToAttr,_7a4,_79e.bindToParams);
};
$B.jsBindHandler._cf_bindhandler=true;
$B.urlBindHandler=function(e,_7a6){
var _7a7=_7a6.bindTo;
if($C.objectCache[_7a7]&&$C.objectCache[_7a7]._cf_visible===false){
$C.objectCache[_7a7]._cf_dirtyview=true;
return;
}
var url=$B.evaluateBindTemplate(_7a6,false,true,false,true);
var _7a9=$U.extractReturnFormat(url);
if(_7a9==null||typeof _7a9=="undefined"){
_7a9="JSON";
}
if(_7a6.bindToAttr||typeof _7a6.bindTo=="undefined"||typeof _7a6.bindTo=="function"){
var _7a6={"bindTo":_7a6.bindTo,"bindToAttr":_7a6.bindToAttr,"bindToParams":_7a6.bindToParams,"errorHandler":_7a6.errorHandler,"url":url,returnFormat:_7a9};
try{
$A.sendMessage(url,"GET",null,true,$B.urlBindHandler.callback,_7a6);
}
catch(e){
$C.handleError(_7a6.errorHandler,"ajax.urlbindhandler.connectionerror","http",[url,e]);
}
}else{
$A.replaceHTML(_7a7,url,null,null,_7a6.callback,_7a6.errorHandler);
}
};
$B.urlBindHandler._cf_bindhandler=true;
$B.urlBindHandler.callback=function(req,_7ab){
if($A.isRequestError(req)){
$C.handleError(_7ab.errorHandler,"bind.urlbindhandler.httperror","http",[req.status,_7ab.url,req.statusText],req.status,req.statusText);
}else{
$L.info("bind.urlbindhandler.response","http",[req.responseText]);
var _7ac;
try{
if(_7ab.returnFormat==null||_7ab.returnFormat==="JSON"){
_7ac=$X.JSON.decode(req.responseText);
}else{
_7ac=req.responseText;
}
}
catch(e){
if(req.responseText!=null&&typeof req.responseText=="string"){
_7ac=req.responseText;
}else{
$C.handleError(_7ab.errorHandler,"bind.urlbindhandler.jsonerror","http",[req.responseText]);
}
}
$B.assignValue(_7ab.bindTo,_7ab.bindToAttr,_7ac,_7ab.bindToParams);
}
};
$A.initSelect=function(_7ad,_7ae,_7af,_7b0){
$C.objectCache[_7ad]={"valueCol":_7ae,"displayCol":_7af,selected:_7b0};
};
$S.setupSpry=function(){
if(typeof (Spry)!="undefined"&&Spry.Data){
Spry.Data.DataSet.prototype._cf_getAttribute=function(_7b1){
var val;
var row=this.getCurrentRow();
if(row){
val=row[_7b1];
}
return val;
};
Spry.Data.DataSet.prototype._cf_register=function(_7b4,_7b5,_7b6){
var obs={bindParams:_7b6};
obs.onCurrentRowChanged=function(){
_7b5.call(null,null,this.bindParams);
};
obs.onDataChanged=function(){
_7b5.call(null,null,this.bindParams);
};
this.addObserver(obs);
};
if(Spry.Debug.trace){
var _7b8=Spry.Debug.trace;
Spry.Debug.trace=function(str){
$L.info(str,"spry");
_7b8(str);
};
}
if(Spry.Debug.reportError){
var _7ba=Spry.Debug.reportError;
Spry.Debug.reportError=function(str){
$L.error(str,"spry");
_7ba(str);
};
}
$L.info("spry.setupcomplete","bind");
}
};
$E.registerOnLoad($S.setupSpry,null,true);
$S.bindHandler=function(_7bc,_7bd){
var url;
var _7bf="_cf_nodebug=true&_cf_nocache=true";
if(window._cf_clientid){
_7bf+="&_cf_clientid="+_cf_clientid;
}
var _7c0=window[_7bd.bindTo];
var _7c1=(typeof (_7c0)=="undefined");
if(_7bd.cfc){
var _7c2={};
var _7c3=_7bd.bindExpr;
for(var i=0;i<_7c3.length;i++){
var _7c5;
if(_7c3[i].length==2){
_7c5=_7c3[i][1];
}else{
_7c5=$B.getBindElementValue(_7c3[i][1],_7c3[i][2],_7c3[i][3],false,_7c1);
}
_7c2[_7c3[i][0]]=_7c5;
}
_7c2=$X.JSON.encode(_7c2);
_7bf+="&method="+_7bd.cfcFunction;
_7bf+="&argumentCollection="+encodeURIComponent(_7c2);
$L.info("spry.bindhandler.loadingcfc","http",[_7bd.bindTo,_7bd.cfc,_7bd.cfcFunction,_7c2]);
url=_7bd.cfc;
}else{
url=$B.evaluateBindTemplate(_7bd,false,true,_7c1);
$L.info("spry.bindhandler.loadingurl","http",[_7bd.bindTo,url]);
}
var _7c6=_7bd.options||{};
if((_7c0&&_7c0._cf_type=="json")||_7bd.dsType=="json"){
_7bf+="&returnformat=json";
}
if(_7c0){
if(_7c0.requestInfo.method=="GET"){
_7c6.method="GET";
if(url.indexOf("?")==-1){
url+="?"+_7bf;
}else{
url+="&"+_7bf;
}
}else{
_7c6.postData=_7bf;
_7c6.method="POST";
_7c0.setURL("");
}
_7c0.setURL(url,_7c6);
_7c0.loadData();
}else{
if(!_7c6.method||_7c6.method=="GET"){
if(url.indexOf("?")==-1){
url+="?"+_7bf;
}else{
url+="&"+_7bf;
}
}else{
_7c6.postData=_7bf;
_7c6.useCache=false;
}
var ds;
if(_7bd.dsType=="xml"){
ds=new Spry.Data.XMLDataSet(url,_7bd.xpath,_7c6);
}else{
ds=new Spry.Data.JSONDataSet(url,_7c6);
ds.preparseFunc=$S.preparseData;
}
ds._cf_type=_7bd.dsType;
var _7c8={onLoadError:function(req){
$C.handleError(_7bd.errorHandler,"spry.bindhandler.error","http",[_7bd.bindTo,req.url,req.requestInfo.postData]);
}};
ds.addObserver(_7c8);
window[_7bd.bindTo]=ds;
}
};
$S.bindHandler._cf_bindhandler=true;
$S.preparseData=function(ds,_7cb){
var _7cc=$U.getFirstNonWhitespaceIndex(_7cb);
if(_7cc>0){
_7cb=_7cb.slice(_7cc);
}
if(window._cf_jsonprefix&&_7cb.indexOf(_cf_jsonprefix)==0){
_7cb=_7cb.slice(_cf_jsonprefix.length);
}
return _7cb;
};
$P.init=function(_7cd){
$L.info("pod.init.creating","widget",[_7cd]);
var _7ce={};
_7ce._cf_body=_7cd+"_body";
$C.objectCache[_7cd]=_7ce;
};
$B.cfcBindHandler=function(e,_7d0){
var _7d1=(_7d0.httpMethod)?_7d0.httpMethod:"GET";
var _7d2={};
var _7d3=_7d0.bindExpr;
for(var i=0;i<_7d3.length;i++){
var _7d5;
if(_7d3[i].length==2){
_7d5=_7d3[i][1];
}else{
_7d5=$B.getBindElementValue(_7d3[i][1],_7d3[i][2],_7d3[i][3],false);
}
_7d2[_7d3[i][0]]=_7d5;
}
var _7d6=function(_7d7,_7d8){
$B.assignValue(_7d8.bindTo,_7d8.bindToAttr,_7d7,_7d8.bindToParams);
};
var _7d9={"bindTo":_7d0.bindTo,"bindToAttr":_7d0.bindToAttr,"bindToParams":_7d0.bindToParams};
var _7da={"async":true,"cfcPath":_7d0.cfc,"httpMethod":_7d1,"callbackHandler":_7d6,"errorHandler":_7d0.errorHandler};
if(_7d0.proxyCallHandler){
_7da.callHandler=_7d0.proxyCallHandler;
_7da.callHandlerParams=_7d0;
}
$X.invoke(_7da,_7d0.cfcFunction,_7d0._cf_ajaxproxytoken,_7d2,_7d9);
};
$B.cfcBindHandler._cf_bindhandler=true;
$U.extractReturnFormat=function(url){
var _7dc;
var _7dd=url.toUpperCase();
var _7de=_7dd.indexOf("RETURNFORMAT");
if(_7de>0){
var _7df=_7dd.indexOf("&",_7de+13);
if(_7df<0){
_7df=_7dd.length;
}
_7dc=_7dd.substring(_7de+13,_7df);
}
return _7dc;
};
$U.replaceAll=function(_7e0,_7e1,_7e2){
var _7e3=_7e0.indexOf(_7e1);
while(_7e3>-1){
_7e0=_7e0.replace(_7e1,_7e2);
_7e3=_7e0.indexOf(_7e1);
}
return _7e0;
};
$U.cloneObject=function(obj){
var _7e5={};
for(key in obj){
var _7e6=obj[key];
if(typeof _7e6=="object"){
_7e6=$U.cloneObject(_7e6);
}
_7e5.key=_7e6;
}
return _7e5;
};
$C.clone=function(obj,_7e8){
if(typeof (obj)!="object"){
return obj;
}
if(obj==null){
return obj;
}
var _7e9=new Object();
for(var i in obj){
if(_7e8===true){
_7e9[i]=$C.clone(obj[i]);
}else{
_7e9[i]=obj[i];
}
}
return _7e9;
};
$C.printObject=function(obj){
var str="";
for(key in obj){
str=str+"  "+key+"=";
value=obj[key];
if(typeof (value)=="object"){
value=$C.printObject(value);
}
str+=value;
}
return str;
};
}
}
cfinit();
