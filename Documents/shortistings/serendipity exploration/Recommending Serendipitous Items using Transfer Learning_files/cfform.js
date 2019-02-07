/*ADOBE SYSTEMS INCORPORATED
Copyright 2012 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
var _CF_error_messages=new Array();
var _CF_error_fields=new Object();
var _CF_FirstErrorField=null;
var _CF_submit_status=new Array();
_CF_signalLoad=function(){
_CF_loaded=1;
};
_CF_onError=function(_91b,_91c,_91d,_91e){
if(_CF_error_fields[_91c]==null){
if(_CF_FirstErrorField==null){
_CF_FirstErrorField=_91c;
}
_CF_error_exists=true;
_CF_error_fields[_91c]=_91e;
_CF_error_messages[_CF_error_messages.length]=_91e;
}
};
_CF_onErrorAlert=function(_91f){
var _920="";
for(var i=0;i<_91f.length;i++){
_920+=_91f[i]+"\n";
}
alert(_920);
return false;
};
updateHiddenValue=function(val,form,name){
if(form==null||form==""){
form=0;
}
if(document.forms[form]==null||document.forms[form][name]==null){
return;
}
document.forms[form][name].value=val;
};
_CF_hasValue=function(obj,_926,_927){
if(_926=="TEXT"||_926=="FILE"||_926=="PASSWORD"||_926=="CFTEXTAREA"||_926=="TEXTAREA"||_926=="CFTEXTINPUT"||_926=="DATEFIELD"){
if(obj.value.length==0){
return false;
}else{
if(_927){
str=obj.value.replace(/^\s+/,"").replace(/\s+$/,"");
if(str.length==0){
return false;
}
}
}
return true;
}else{
if(_926=="SELECT"){
for(i=0;i<obj.length;i++){
if(obj.options[i].selected&&obj.options[i].value.length>0){
return true;
}
}
return false;
}else{
if(_926=="SINGLE_VALUE_RADIO"||_926=="SINGLE_VALUE_CHECKBOX"){
if(obj.checked){
return true;
}else{
return false;
}
}else{
if(_926=="RADIO"||_926=="CHECKBOX"){
if(obj.length==undefined&&obj.checked){
return true;
}else{
for(i=0;i<obj.length;i++){
if(obj[i].checked){
return true;
}
}
}
return false;
}else{
if(_926=="CFTREE"){
if(obj["value"].length>0){
return true;
}else{
return false;
}
}else{
if(_926=="RICHTEXT"){
var _928=FCKeditorAPI.GetInstance(obj.id);
var val=_928.GetXHTML();
if(val.length==0){
return false;
}else{
if(_927){
str=val.replace(/^\s+/,"").replace(/\s+$/,"");
if(str.length==0){
return false;
}
}
return true;
}
}else{
return true;
}
}
}
}
}
}
};
_CF_checkdate=function(_92a,_92b){
_92a=_92a.replace(/^\s+/,"").replace(/\s+$/,"");
_92a=_92a=_92a.replace(/{d \'/,"").replace(/'}/,"");
if(_92b){
if(_92a.length==0){
return false;
}
}else{
if(_92a.length==0){
return true;
}
}
if(_92a.length==0){
return true;
}
isplit=_92a.indexOf("/");
splitchr="/";
if(isplit==-1){
isplit=_92a.indexOf(".");
splitchr=".";
}
if(isplit==-1){
isplit=_92a.indexOf("-");
splitchr="-";
}
if(isplit==-1||isplit==_92a.length){
return false;
}
var _92c=_92a.substring(0,isplit);
if(_92c.length==4){
sYear=_92a.substring(0,isplit);
isplit=_92a.indexOf(splitchr,isplit+1);
if(isplit==-1||(isplit+1)==_92a.length){
return false;
}
sMonth=_92a.substring((sYear.length+1),isplit);
sDay=_92a.substring(isplit+1);
}else{
sMonth=_92a.substring(0,isplit);
isplit=_92a.indexOf(splitchr,isplit+1);
if(isplit==-1||(isplit+1)==_92a.length){
return false;
}
sDay=_92a.substring((sMonth.length+1),isplit);
sYear=_92a.substring(isplit+1);
}
if((sDay.length==0)||(sMonth.length==0)||(sYear.length==0)){
return false;
}
if(!_CF_checkinteger(sMonth)){
return false;
}else{
if(!_CF_checkrange(sMonth,1,12)){
return false;
}else{
if(!_CF_checkinteger(sYear)){
return false;
}else{
if(sYear.length!=1&&sYear.length!=2&&sYear.length!=4){
return false;
}else{
if(!_CF_checkrange(sYear,0,9999)){
return false;
}else{
if(!_CF_checkinteger(sDay)){
return false;
}else{
if(!_CF_checkday(sYear,sMonth,sDay)){
return false;
}else{
return true;
}
}
}
}
}
}
}
};
_CF_checkeurodate=function(_92d,_92e){
_92d=_92d.replace(/^\s+/,"").replace(/\s+$/,"");
_92d=_92d=_92d.replace(/{d \'/,"").replace(/'}/,"");
if(_92e){
if(_92d.length==0){
return false;
}
}else{
if(_92d.length==0){
return true;
}
}
isplit=_92d.indexOf("/");
splitchr="/";
if(isplit==-1){
isplit=_92d.indexOf(".");
splitchr=".";
}
if(isplit==-1){
isplit=_92d.indexOf("-");
splitchr="-";
}
if(isplit==-1||isplit==_92d.length){
return false;
}
var _92f=_92d.substring(0,isplit);
if(_92f.length==4){
sYear=_92d.substring(0,isplit);
isplit=_92d.indexOf(splitchr,isplit+1);
if(isplit==-1||(isplit+1)==_92d.length){
return false;
}
sMonth=_92d.substring((sYear.length+1),isplit);
sDay=_92d.substring(isplit+1);
}else{
sDay=_92d.substring(0,isplit);
isplit=_92d.indexOf(splitchr,isplit+1);
if(isplit==-1||(isplit+1)==_92d.length){
return false;
}
sMonth=_92d.substring((sDay.length+1),isplit);
sYear=_92d.substring(isplit+1);
}
if(!_CF_checkinteger(sMonth)){
return false;
}else{
if(!_CF_checkrange(sMonth,1,12)){
return false;
}else{
if(!_CF_checkinteger(sYear)){
return false;
}else{
if(!_CF_checkrange(sYear,0,null)){
return false;
}else{
if(!_CF_checkinteger(sDay)){
return false;
}else{
if(!_CF_checkday(sYear,sMonth,sDay)){
return false;
}else{
return true;
}
}
}
}
}
}
};
_CF_checkday=function(_930,_931,_932){
maxDay=31;
if(_931==4||_931==6||_931==9||_931==11){
maxDay=30;
}else{
if(_931==2){
if(_930%4>0){
maxDay=28;
}else{
if(_930%100==0&&_930%400>0){
maxDay=28;
}else{
maxDay=29;
}
}
}
}
return _CF_checkrange(_932,1,maxDay);
};
_CF_checkinteger=function(_933,_934){
_933=_933.replace(/^\s+/,"").replace(/\s+$/,"");
_933=_933.replace(/[$Â£Â¥â‚¬,~+]?/g,"");
if(_934){
if(_933.length==0){
return false;
}
}else{
if(_933.length==0){
return true;
}
}
var _935=".";
var _936=_933.indexOf(_935);
if(_936==-1){
return _CF_checknumber(_933);
}else{
return false;
}
};
_CF_numberrange=function(_937,_938,_939,_93a){
if(_93a){
if(_937.length==0){
return false;
}
}else{
if(_937.length==0){
return true;
}
}
if(_938!=null){
if(_937<_938){
return false;
}
}
if(_939!=null){
if(_937>_939){
return false;
}
}
return true;
};
_CF_checknumber=function(_93b,_93c){
var _93d=" .+-0123456789";
var _93e=" .0123456789";
var _93f;
var _940=false;
var _941=false;
var _942=false;
_93b=_93b.replace(/^\s+/,"").replace(/\s+$/,"");
_93b=_93b.replace(/[$Â£Â¥â‚¬,~+]?/g,"");
if(_93c){
if(_93b.length==0){
return false;
}
}else{
if(_93b.length==0){
return true;
}
}
_93f=_93d.indexOf(_93b.charAt(0));
if(_93f==1){
_940=true;
}else{
if(_93f<1){
return false;
}
}
for(var i=1;i<_93b.length;i++){
_93f=_93e.indexOf(_93b.charAt(i));
if(_93f<0){
return false;
}else{
if(_93f==1){
if(_940){
return false;
}else{
_940=true;
}
}else{
if(_93f==0){
if(_940||_942){
_941=true;
}
}else{
if(_941){
return false;
}else{
_942=true;
}
}
}
}
}
return true;
};
_CF_checkrange=function(_944,_945,_946,_947){
_944=_944.replace(/^\s+/,"").replace(/\s+$/,"");
if(_947){
if(_944.length==0){
return false;
}
}else{
if(_944.length==0){
return true;
}
}
if(!_CF_checknumber(_944)){
return false;
}else{
return (_CF_numberrange((eval(_944)),_945,_946));
}
return true;
};
_CF_checktime=function(_948,_949){
_948=_948.replace(/^\s+/,"").replace(/\s+$/,"");
_948=_948.replace(/\s+:\s+/,":");
_948=_948=_948.replace(/{t \'/,"").replace(/'}/,"");
if(_949){
if(_948.length==0){
return false;
}
}else{
if(_948.length==0){
return true;
}
}
var _94a=_CF_checkregex(_948,/^((([0-1]?\d)|(2[0-3])):[0-5]?\d)?(:[0-5]?\d)? ?([AP]M|[AP]m|[ap]m|[ap]M)?$/,_949);
return _94a;
};
_CF_checkphone=function(_94b,_94c){
_94b=_94b.replace(/^\s+/,"").replace(/\s+$/,"");
if(_94c){
if(_94b.length==0){
return false;
}
}else{
if(_94b.length==0){
return true;
}
}
if(_94b.length==0){
return true;
}
return _CF_checkregex(_94b,/^(((1))?[ ,\-,\.]?([\\(]?([1-9][0-9]{2})[\\)]?))?[ ,\-,\.]?([^0-1]){1}([0-9]){2}[ ,\-,\.]?([0-9]){4}(( )((x){0,1}([0-9]){1,5}){0,1})?$/,_94c);
};
_CF_checkzip=function(_94d,_94e){
_94d=_94d.replace(/^\s+/,"").replace(/\s+$/,"");
if(_94e){
if(_94d.length==0){
return false;
}
}else{
if(_94d.length==0){
return true;
}
}
return _CF_checkregex(_94d,/^([0-9]){5,5}$|(([0-9]){5,5}(-| ){1}([0-9]){4,4}$)/,_94e);
};
_CF_checkcreditcard=function(_94f,_950){
_94f=_94f.replace(/^\s+/,"").replace(/\s+$/,"");
if(_950){
if(_94f.length==0){
return false;
}
}else{
if(_94f.length==0){
return true;
}
}
if(_94f.length==0){
return true;
}
var _951=" -";
var _952="";
var _953;
for(var i=0;i<_94f.length;i++){
_953=_951.indexOf(_94f.charAt(i));
if(_953<0){
_952+=_94f.substring(i,(i+1));
}
}
if(_952.length<13||_952.length>19){
return false;
}
if(_952.charAt(0)=="+"){
return false;
}
if(!_CF_checkinteger(_952)){
return false;
}
var _955=_952.length%2==1?false:true;
var _956=0;
var _957;
for(var i=0;i<_952.length;i++){
_957=eval(_952.charAt(i));
if(_955){
_957*=2;
_956+=(_957%10);
if((_957/10)>=1){
_956++;
}
_955=false;
}else{
_956+=_957;
_955=true;
}
}
return (_956%10)==0?true:false;
};
_CF_checkssn=function(_958,_959){
_958=_958.replace(/^\s+/,"").replace(/\s+$/,"");
if(_959){
if(_958.length==0){
return false;
}
}else{
if(_958.length==0){
return true;
}
}
return _CF_checkregex(_958,/^[0-9]{3}(-| )[0-9]{2}(-| )[0-9]{4}$/,_959);
};
_CF_checkEmail=function(_95a,_95b){
_95a=_95a.replace(/^\s+/,"").replace(/\s+$/,"");
if(_95b){
if(_95a.length==0){
return false;
}
}else{
if(_95a.length==0){
return true;
}
}
return _CF_checkregex(_95a,/^[a-zA-Z_0-9-'\+~]+(\.[a-zA-Z_0-9-'\+~]+)*@([a-zA-Z_0-9-]+\.)+[a-zA-Z]*$/,_95b);
};
_CF_checkURL=function(_95c,_95d){
_95c=_95c.replace(/^\s+/,"").replace(/\s+$/,"");
if(_95d){
if(_95c.length==0){
return false;
}
}else{
if(_95c.length==0){
return true;
}
}
return _CF_checkregex(_95c.toLowerCase(),/^((http|https|ftp|file)\:\/\/([a-zA-Z0-0]*:[a-zA-Z0-0]*(@))?[a-zA-Z0-9-\.]+(\.[a-zA-Z]{2,3})?(:[a-zA-Z0-9]*)?\/?([a-zA-Z0-9-\._\?\,\'\/\+&amp;%\$#\=~])*)|((mailto)\:[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]*)|((news)\:[a-zA-Z0-9\.]*)$/,_95d);
};
_CF_checkUUID=function(_95e,_95f){
_95e=_95e.replace(/^\s+/,"").replace(/\s+$/,"");
if(_95f){
if(_95e.length==0){
return false;
}
}else{
if(_95e.length==0){
return true;
}
}
return _CF_checkregex(_95e,/[A-Fa-f0-9]{8,8}-[A-Fa-f0-9]{4,4}-[A-Fa-f0-9]{4,4}-[A-Fa-f0-9]{16,16}/,_95f);
};
_CF_checkGUID=function(_960,_961){
_960=_960.replace(/^\s+/,"").replace(/\s+$/,"");
if(_961){
if(_960.length==0){
return false;
}
}else{
if(_960.length==0){
return true;
}
}
return _CF_checkregex(_960,/[A-Fa-f0-9]{8,8}-[A-Fa-f0-9]{4,4}-[A-Fa-f0-9]{4,4}-[A-Fa-f0-9]{4,4}-[A-Fa-f0-9]{12,12}/,_961);
};
_CF_checkBoolean=function(_962,_963){
_962=_962.replace(/^\s+/,"").replace(/\s+$/,"");
if(_963){
if(_962.length==0){
return false;
}
}else{
if(_962.length==0){
return true;
}
}
if(_962.toUpperCase()=="TRUE"||_962.toUpperCase()=="YES"||(_CF_checknumber(_962)&&_962!="0")){
return true;
}else{
if(_962.toUpperCase()=="FALSE"||_962.toUpperCase()=="NO"||_962=="0"){
return true;
}else{
return false;
}
}
};
_CF_setFormParam=function(_964,_965,_966){
var _967="document['"+_964+"']['"+_965+"']";
var obj=eval(_967);
if(obj==undefined){
return false;
}else{
obj.value=_966;
return true;
}
};
_CF_checkregex=function(_969,_96a,_96b){
if(_96b){
if(_969.length==0){
return false;
}
}else{
if(_969.length==0){
return true;
}
}
return _96a.test(_969);
};
