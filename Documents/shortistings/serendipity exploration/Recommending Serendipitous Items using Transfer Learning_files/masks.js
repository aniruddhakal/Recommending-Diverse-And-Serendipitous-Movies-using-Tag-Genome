/*ADOBE SYSTEMS INCORPORATED
Copyright 2012 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
var KT_focusedEl=null;
KT_validateSingle=function(_966,_967){
var _968=_966.charCodeAt(0);
switch(_967){
case "9":
if(_968<58&&_968>47){
return true;
}
break;
case "A":
if((_968<91&&_968>64)||(_968<123&&_968>96)){
return true;
}
break;
case "X":
if((_968<91&&_968>64)||(_968<123&&_968>96)||(_968<58&&_968>47)){
return true;
}
break;
case "?":
return true;
break;
default:
return true;
break;
}
};
KT_maskDefaultValue=function(_969){
switch(_969){
case "9":
return "0";
break;
case "A":
return "a";
break;
case "X":
return "0";
break;
case "?":
return "0";
break;
default:
return "0";
break;
}
};
KT_isSpecialChar=function(_96a){
if(_96a=="9"||_96a=="A"||_96a=="X"||_96a=="?"){
return true;
}else{
return false;
}
};
mask_onValueChanged=function(){
if((typeof window.getSelection=="undefined"&&typeof document.selection=="undefined")){
return;
}
if(KT_focusedEl==null||KT_focusedEl.mask==null||KT_focusedEl.mask==""){
return;
}
var mask=KT_focusedEl.mask;
var val=KT_focusedEl.value;
var i=0;
var _96e=false;
if(val==KT_focusedEl.oldText){
return;
}
if(val.length>mask.length){
val=val.substr(0,mask.length);
_96e=true;
}
for(;i<mask.length;i++){
if(val.charCodeAt(i).toString()!="NaN"){
if(KT_isSpecialChar(mask.charAt(i))){
if(KT_validateSingle(val.charAt(i),mask.charAt(i))){
continue;
}else{
val=KT_focusedEl.oldText;
i=mask.length;
break;
}
}else{
if(val.charAt(i)!=mask.charAt(i)){
if(i==val.length-1){
var _96f=val.substr(val.length-1,val.length);
val=val.substr(0,val.length-1)+mask.charAt(i)+_96f;
_96e=true;
continue;
}else{
val=KT_focusedEl.oldText;
i=mask.length;
}
break;
}
}
}else{
if(val.length<KT_focusedEl.oldText.length){
break;
}
for(;i<mask.length;i++){
if(!KT_isSpecialChar(mask.charAt(i))){
val+=mask.charAt(i);
_96e=true;
}else{
break;
}
}
break;
}
}
if(val.length>mask.length){
val=val.substr(0,mask.length);
_96e=true;
}
if(KT_focusedEl.value!=val){
KT_focusedEl.value=val;
}
KT_focusedEl.oldText=val;
if(_96e){
}
};
mask_parseFirstTime=function(_970,mask){
var _972="";
var _973="";
cond=1;
imask=0;
ival=0;
cnt=0;
while(cond==1){
cond=1;
if(!KT_isSpecialChar(mask.charAt(imask))){
if(_970.charCodeAt(ival).toString()!="NaN"){
if(mask.charAt(imask)==_970.charAt(ival)){
imask++;
ival++;
}else{
_970=_970.substr(0,ival)+mask.charAt(imask)+_970.substr(ival,_970.length);
imask=0;
ival=0;
cond=1;
}
}else{
_970+=KT_maskDefaultValue(mask.charAt(imask));
}
}else{
imask++;
ival++;
}
if(imask>=mask.length||ival>=_970.length){
cond=0;
}
}
for(i=0;i<mask.length;i++){
if(KT_isSpecialChar(mask.charAt(i))){
_972+=mask.charAt(i);
if(_970.charCodeAt(i).toString()!="NaN"){
_973+=_970.charAt(i);
}else{
_973+=KT_maskDefaultValue(mask.charAt(i));
}
}
}
oldvalue=_970;
_970=_973;
var _974="";
for(i=0;i<_972.length;i++){
if(!KT_validateSingle(_970.charAt(i),_972.charAt(i))){
_974+=KT_maskDefaultValue(_972.charAt(i));
}else{
_974+=_970.charAt(i);
}
}
var _975="";
var j=0;
for(i=0;i<mask.length;i++){
if(KT_isSpecialChar(mask.charAt(i))){
_975+=_974.charAt(j++);
}else{
_975+=mask.charAt(i);
}
}
return _975;
};
mask_onSetFocus=function(obj,mask){
if((typeof window.getSelection=="undefined"&&typeof document.selection=="undefined")){
return;
}
if(typeof obj.mask=="undefined"){
ret="";
if(obj.value!=""){
ret=mask_parseFirstTime(obj.value,mask);
}
obj.value=ret;
obj.mask=mask;
}
KT_focusedEl=obj;
if(typeof KT_focusedEl.oldText=="undefined"){
KT_focusedEl.oldText=obj.value;
mask_onValueChanged();
}
};
mask_onKillFocus=function(){
if((typeof window.getSelection=="undefined"&&typeof document.selection=="undefined")){
return;
}
mask_onValueChanged();
KT_focusedEl=null;
};
