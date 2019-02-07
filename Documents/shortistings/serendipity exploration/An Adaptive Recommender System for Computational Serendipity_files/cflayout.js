/*ADOBE SYSTEMS INCORPORATED
Copyright 2012 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Layout){
ColdFusion.Layout={};
}
var ACCORDION_TITLE_ICON_CSS_TEMPLATE=".{0} { background-image:url({1}); }";
if(!ColdFusion.MapVsAccordion){
ColdFusion.MapVsAccordion={};
}
ColdFusion.Layout.initializeTabLayout=function(id,_6b2,_6b3,_6b4,_6b5){
Ext.QuickTips.init();
var _6b6;
if(_6b3){
_6b6={renderTo:id,height:_6b3};
}else{
_6b6={renderTo:id,autoHeight:true};
}
if(_6b4&&_6b4!="undefined"){
_6b6.width=_6b4;
}else{
_6b6.autoWidth=true;
}
if(_6b2){
_6b6.tabPosition="bottom";
}else{
_6b6.enableTabScroll=true;
}
_6b6.plain=!_6b5;
var _6b7=new Ext.tab.Panel(_6b6);
ColdFusion.objectCache[id]=_6b7;
return _6b7;
};
ColdFusion.Layout.getTabLayout=function(_6b8){
var _6b9=ColdFusion.objectCache[_6b8];
if(!_6b9||!(_6b9 instanceof Ext.TabPanel)){
ColdFusion.handleError(null,"layout.gettablayout.notfound","widget",[_6b8],null,null,true);
}
return _6b9;
};
ColdFusion.Layout.onTabActivate=function(tab){
tab._cf_visible=true;
if(tab._cf_dirtyview){
var _6bb=ColdFusion.bindHandlerCache[tab.contentEl];
if(_6bb){
_6bb();
}
tab._cf_dirtyview=false;
}
};
ColdFusion.Layout.onTabDeactivate=function(tab){
tab._cf_visible=false;
if(tab._cf_refreshOnActivate){
tab._cf_dirtyview=true;
}
};
ColdFusion.Layout.onTabClose=function(tab){
tab._cf_visible=false;
};
ColdFusion.Layout.addTab=function(_6be,_6bf,name,_6c1,_6c2,_6c3,_6c4,_6c5,_6c6){
if(_6c2!=null&&_6c2.length==0){
_6c2=null;
}
var _6c7=_6be.initialConfig.autoHeight;
if(typeof _6c7=="undefined"){
_6c7=false;
}
var _6c8=new Ext.Panel({title:_6c1,contentEl:_6bf,_cf_body:_6bf,id:name,closable:_6c3,tabTip:_6c2,autoScroll:_6c6,autoShow:true,autoHeight:_6c7});
var tab=_6be.add(_6c8);
if(_6c5){
_6c8.setDisabled(true);
}
tab._cf_visible=false;
tab._cf_dirtyview=true;
tab._cf_refreshOnActivate=_6c4;
tab.addListener("activate",ColdFusion.Layout.onTabActivate);
tab.addListener("deactivate",ColdFusion.Layout.onTabDeactivate);
tab.addListener("close",ColdFusion.Layout.onTabClose);
ColdFusion.objectCache[name]=tab;
var _6ca=tab.height;
if(_6ca&&_6ca>1){
var _6cb=document.getElementById(_6bf);
_6cb.style.height=_6ca;
}
};
ColdFusion.Layout.enableTab=function(_6cc,_6cd){
var _6ce=ColdFusion.objectCache[_6cc];
var _6cf=ColdFusion.objectCache[_6cd];
if(_6ce&&(_6ce instanceof Ext.TabPanel)&&_6cf){
_6cf.setDisabled(false);
ColdFusion.Log.info("layout.enabletab.enabled","widget",[_6cd,_6cc]);
}else{
ColdFusion.handleError(null,"layout.enabletab.notfound","widget",[_6cc],null,null,true);
}
};
ColdFusion.Layout.disableTab=function(_6d0,_6d1){
var _6d2=ColdFusion.objectCache[_6d0];
var _6d3=ColdFusion.objectCache[_6d1];
if(_6d2&&(_6d2 instanceof Ext.TabPanel)&&_6d3){
_6d3.setDisabled(true);
ColdFusion.Log.info("layout.disabletab.disabled","widget",[_6d1,_6d0]);
}else{
ColdFusion.handleError(null,"layout.disabletab.notfound","widget",[_6d0],null,null,true);
}
};
ColdFusion.Layout.selectTab=function(_6d4,_6d5){
var _6d6=ColdFusion.objectCache[_6d4];
var tab=ColdFusion.objectCache[_6d5];
if(_6d6&&(_6d6 instanceof Ext.TabPanel)&&tab){
_6d6.setActiveTab(tab);
ColdFusion.Log.info("layout.selecttab.selected","widget",[_6d5,_6d4]);
}else{
ColdFusion.handleError(null,"layout.selecttab.notfound","widget",[_6d4],null,null,true);
}
};
ColdFusion.Layout.hideTab=function(_6d8,_6d9){
var _6da=ColdFusion.objectCache[_6d8];
if(_6da&&(_6da instanceof Ext.TabPanel)){
var _6db=ColdFusion.objectCache[_6d9];
var _6dc=false;
if(_6db){
if(_6da.getActiveTab()&&_6da.getActiveTab().getId()==_6d9){
var i;
for(i=0;i<_6da.items.length;i++){
var _6de=_6da.getComponent(i);
if(_6de.hidden==false){
_6dc=true;
_6de.show();
break;
}
}
if(_6dc==false){
document.getElementById(_6d9).style.display="none";
}
}
_6db.tab.hide();
ColdFusion.Log.info("layout.hidetab.hide","widget",[_6d9,_6d8]);
}
}else{
ColdFusion.handleError(null,"layout.hidetab.notfound","widget",[_6d8],null,null,true);
}
};
ColdFusion.Layout.showTab=function(_6df,_6e0){
var _6e1=ColdFusion.objectCache[_6df];
var _6e2=ColdFusion.objectCache[_6e0];
if(_6e1&&(_6e1 instanceof Ext.TabPanel)&&_6e2){
_6e2.tab.show();
ColdFusion.Log.info("layout.showtab.show","widget",[_6e0,_6df]);
}else{
ColdFusion.handleError(null,"layout.showtab.notfound","widget",[_6df],null,null,true);
}
};
ColdFusion.Layout.disableSourceBind=function(_6e3){
var _6e4=ColdFusion.objectCache[_6e3];
if(_6e4==null||_6e4=="undefined"){
ColdFusion.handleError(null,"layout.disableSourceBind.notfound","widget",[_6e3],null,null,true);
}
_6e4._cf_dirtyview=false;
};
ColdFusion.Layout.enableSourceBind=function(_6e5){
var _6e6=ColdFusion.objectCache[_6e5];
if(_6e6==null||_6e6=="undefined"){
ColdFusion.handleError(null,"layout.enableSourceBind.notfound","widget",[_6e5],null,null,true);
}
_6e6._cf_dirtyview=true;
};
ColdFusion.Layout.createTab=function(_6e7,_6e8,_6e9,_6ea,_6eb){
var _6ec=ColdFusion.objectCache[_6e7];
var _6ed=_6e8;
if(_6e7&&typeof (_6e7)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidname","widget",null,null,null,true);
return;
}
if(!_6e7||ColdFusion.trim(_6e7)==""){
ColdFusion.handleError(null,"layout.createtab.emptyname","widget",null,null,null,true);
return;
}
if(_6e8&&typeof (_6e8)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidareaname","widget",null,null,null,true);
return;
}
if(!_6e8||ColdFusion.trim(_6e8)==""){
ColdFusion.handleError(null,"layout.createtab.emptyareaname","widget",null,null,null,true);
return;
}
if(_6e9&&typeof (_6e9)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidtitle","widget",null,null,null,true);
return;
}
if(!_6e9||ColdFusion.trim(_6e9)==""){
ColdFusion.handleError(null,"layout.createtab.emptytitle","widget",null,null,null,true);
return;
}
if(_6ea&&typeof (_6ea)!="string"){
ColdFusion.handleError(null,"layout.createtab.invalidurl","widget",null,null,null,true);
return;
}
if(!_6ea||ColdFusion.trim(_6ea)==""){
ColdFusion.handleError(null,"layout.createtab.emptyurl","widget",null,null,null,true);
return;
}
_6e8="cf_layoutarea"+_6e8;
if(_6ec&&(_6ec instanceof Ext.TabPanel)){
var _6ee=null;
var ele=document.getElementById(_6e8);
if(ele!=null){
ColdFusion.handleError(null,"layout.createtab.duplicateel","widget",[_6e8],null,null,true);
return;
}
var _6f0=false;
var _6f1=false;
var _6f2=false;
var _6f3=false;
var _6f4=false;
var _6f5=null;
if((_6ec.items.length<=0)){
_6f2=true;
}
if(_6eb!=null){
if(typeof (_6eb)!="object"){
ColdFusion.handleError(null,"layout.createtab.invalidconfig","widget",null,null,null,true);
return;
}
if(typeof (_6eb.closable)!="undefined"&&_6eb.closable==true){
_6f0=true;
}
if(typeof (_6eb.disabled)!="undefined"&&_6eb.disabled==true){
_6f1=true;
}
if(typeof (_6eb.selected)!="undefined"&&_6eb.selected==true){
_6f2=true;
}
if(typeof (_6eb.inithide)!="undefined"&&_6eb.inithide==true){
_6f3=true;
}
if(typeof (_6eb.tabtip)!="undefined"&&_6eb.tabtip!=null){
_6f5=_6eb.tabtip;
}
}
var _6f6=document.getElementById(_6e7);
if(_6f6){
var _6f7=document.getElementById(_6e7);
var _6f8=document.createElement("div");
_6f8.id=_6e8;
_6f8.className="ytab";
if(_6eb!=null&&typeof (_6eb.align)!="undefined"){
_6f8.align=_6eb.align;
}
var _6f9="";
if(_6ec.tabheight){
_6f9="height:"+_6ec.tabheight+";";
}
if(_6eb!=null&&typeof (_6eb.style)!="undefined"){
var _6fa=new String(_6eb.style);
_6fa=_6fa.toLowerCase();
_6f9=_6f9+_6fa;
}
if(_6eb!=null&&typeof (_6eb.overflow)!="undefined"){
var _6fb=new String(_6eb.overflow);
_6fb=_6fb.toLowerCase();
if(_6fb!="visible"&&_6fb!="auto"&&_6fb!="scroll"&&_6fb!="hidden"){
ColdFusion.handleError(null,"layout.createtab.invalidoverflow","widget",null,null,null,true);
return;
}
if(_6fb.toLocaleLowerCase()==="hidden"){
_6f4=false;
}
_6f9=_6f9+"overflow:"+_6fb+";";
}else{
_6f9=_6f9+"; overflow:auto;";
}
_6f8.style.cssText=_6f9;
_6f7.appendChild(_6f8);
}
ColdFusion.Layout.addTab(_6ec,_6e8,_6ed,_6e9,_6f5,_6f0,false,_6f1,_6f4);
ColdFusion.Log.info("layout.createtab.success","http",[_6e8,_6e7]);
if(_6f2==true){
ColdFusion.Layout.selectTab(_6e7,_6ed);
}
if(_6f3==true){
ColdFusion.Layout.hideTab(_6e7,_6ed);
}
if(_6ea!=null&&typeof (_6ea)!="undefined"&&_6ea!=""){
if(_6ea.indexOf("?")!=-1){
_6ea=_6ea+"&";
}else{
_6ea=_6ea+"?";
}
var _6fc;
var _6fd;
if(_6eb){
_6fc=_6eb.callbackHandler;
_6fd=_6eb.errorHandler;
}
ColdFusion.Ajax.replaceHTML(_6e8,_6ea,"GET",null,_6fc,_6fd);
}
}else{
ColdFusion.handleError(null,"layout.createtab.notfound","widget",[_6e7],null,null,true);
}
};
ColdFusion.Layout.getBorderLayout=function(_6fe){
var _6ff=ColdFusion.objectCache[_6fe];
if(!_6ff){
ColdFusion.handleError(null,"layout.getborderlayout.notfound","widget",[_6fe],null,null,true);
}
return _6ff;
};
ColdFusion.Layout.showArea=function(_700,_701){
var _702=ColdFusion.Layout.convertPositionToDirection(_701);
var _703=ColdFusion.objectCache[_700];
var _704;
if(_703){
var _705=_703.items;
for(var i=0;i<_705.getCount();i++){
var _707=_705.items[i];
if(_707 instanceof Ext.Panel&&_707.region==_702){
_704=_707;
break;
}
}
if(_704){
_704.show();
_704.expand();
ColdFusion.Log.info("layout.showarea.shown","widget",[_701,_700]);
}else{
ColdFusion.handleError(null,"layout.showarea.areanotfound","widget",[_701],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.showarea.notfound","widget",[_700],null,null,true);
}
};
ColdFusion.Layout.hideArea=function(_708,_709){
var _70a=ColdFusion.Layout.convertPositionToDirection(_709);
var _70b=ColdFusion.objectCache[_708];
var _70c;
if(_70b){
var _70d=_70b.items;
for(var i=0;i<_70d.getCount();i++){
var _70f=_70d.items[i];
if(_70f instanceof Ext.Panel&&_70f.region==_70a){
_70c=_70f;
break;
}
}
if(_70c){
_70c.hide();
ColdFusion.Log.info("layout.hidearea.hidden","widget",[_709,_708]);
}else{
ColdFusion.handleError(null,"layout.hidearea.areanotfound","widget",[_709],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.hidearea.notfound","widget",[_708],null,null,true);
}
};
ColdFusion.Layout.collapseArea=function(_710,_711){
var _712=ColdFusion.Layout.convertPositionToDirection(_711);
var _713=ColdFusion.objectCache[_710];
var _714;
if(_713){
var _715=_713.items;
for(var i=0;i<_715.getCount();i++){
var _717=_715.items[i];
if(_717 instanceof Ext.Panel&&_717.region==_712){
_714=_717;
break;
}
}
if(_714){
_714.collapse();
ColdFusion.Log.info("layout.collpasearea.collapsed","widget",[_711,_710]);
}else{
ColdFusion.handleError(null,"layout.collpasearea.areanotfound","widget",[_711],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.collpasearea.notfound","widget",[_711],null,null,true);
}
};
ColdFusion.Layout.expandArea=function(_718,_719){
var _71a=ColdFusion.Layout.convertPositionToDirection(_719);
var _71b=ColdFusion.objectCache[_718];
var _71c;
if(_71b){
var _71d=_71b.items;
for(var i=0;i<_71d.getCount();i++){
var _71f=_71d.items[i];
if(_71f instanceof Ext.Panel&&_71f.region==_71a){
_71c=_71f;
break;
}
}
if(_71c){
_71c.expand();
ColdFusion.Log.info("layout.expandarea.expanded","widget",[_719,_718]);
}else{
ColdFusion.handleError(null,"layout.expandarea.areanotfound","widget",[_719],null,null,true);
}
}else{
ColdFusion.handleError(null,"layout.expandarea.notfound","widget",[_719],null,null,true);
}
};
ColdFusion.Layout.printObject=function(obj){
var str="";
for(key in obj){
str=str+"  "+key+"=";
value=obj[key];
if(typeof (value)==Object){
value=$G.printObject(value);
}
str+=value;
}
return str;
};
ColdFusion.Layout.InitAccordion=function(_722,_723,_724,_725,_726,_727,_728,_729){
var _72a=false;
if(_724.toUpperCase()=="LEFT"){
_72a=true;
}
if(_727==null||typeof (_727)=="undefined"){
_726=false;
}
var _72b={activeOnTop:_723,collapseFirst:_72a,titleCollapse:_725,fill:_726};
var _72c={renderTo:_722,layoutConfig:_72b,items:_729,layout:"accordion"};
if(_727==null||typeof (_727)=="undefined"){
_72c.autoHeight=true;
_72c.height=600;
}else{
_72c.height=_727;
}
_72c.flex=1;
if(_728==null||typeof (_728)=="undefined"){
_72c.autoWidth=true;
}else{
_72c.width=_728;
}
_72c.align="stretch";
var _72d=new Ext.Panel(_72c);
ColdFusion.objectCache[_722]=_72d;
ColdFusion.Log.info("layout.accordion.initialized","widget",[_722]);
return _72d;
};
ColdFusion.Layout.InitAccordionChildPanel=function(_72e,_72f,_730,_731,_732,_733,_734,_735){
if(_730==null||typeof (_730)==undefined||_730.length==0){
_730="  ";
}
var _736={contentEl:_72e,id:_72f,title:_730,collapsible:_731,closable:_732,autoScroll:_733,_cf_body:_72e};
if(_734&&typeof _734=="string"){
_736.iconCls=_734;
}
var _737=new Ext.Panel(_736);
_737._cf_visible=false;
_737._cf_dirtyview=true;
_737._cf_refreshOnActivate=_735;
_737.on("expand",ColdFusion.Layout.onAccordionPanelExpand,this);
_737.on("collapse",ColdFusion.Layout.onAccordionPanelCollapse,this);
_737.on("hide",ColdFusion.Layout.onAccordionPanelHide,this);
_737.on("show",ColdFusion.Layout.onAccordionPanelExpand,this);
ColdFusion.objectCache[_72f]=_737;
ColdFusion.Log.info("layout.accordion.childinitialized","widget",[_72f]);
return _737;
};
ColdFusion.Layout.getAccordionLayout=function(_738){
var _739=ColdFusion.objectCache[_738];
if(!_739||!(_739 instanceof Ext.Panel)){
ColdFusion.handleError(null,"layout.getaccordionlayout.notfound","widget",[_738],null,null,true);
}
return _739;
};
ColdFusion.Layout.onAccordionPanelExpand=function(_73a){
_73a._cf_visible=true;
if(_73a._cf_dirtyview){
var _73b=ColdFusion.bindHandlerCache[_73a.contentEl];
if(_73b){
_73b();
}
_73a._cf_dirtyview=false;
}
var el=Ext.get(_73a.contentEl);
el.move("left",1);
el.move("right",1);
var _73d=ColdFusion.MapVsAccordion[_73a._cf_body];
if(_73d!=undefined){
var _73e=$MAP.getMapPanelObject(_73d);
if(_73e!=undefined){
if(_73e.initShow===true){
$MAP.show(_73d);
}
}
}
};
ColdFusion.Layout.onAccordionPanelCollapse=function(_73f){
_73f._cf_visible=false;
if(_73f._cf_refreshOnActivate){
_73f._cf_dirtyview=true;
}
};
ColdFusion.Layout.onAccordionPanelHide=function(_740){
_740._cf_visible=false;
};
ColdFusion.Layout.hideAccordion=function(_741,_742){
var _743=ColdFusion.objectCache[_741];
var _744=ColdFusion.objectCache[_742];
if(!_743||!_743 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.hideaccordion.layoutnotfound","widget",[_741],null,null,true);
}
if(!_744||!_744 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.hideaccordion.panelnotfound","widget",[_742],null,null,true);
}
_744.hide();
ColdFusion.Log.info("layout.hideaccordion.hidden","widget",[_742,_741]);
};
ColdFusion.Layout.showAccordion=function(_745,_746){
var _747=ColdFusion.objectCache[_745];
var _748=ColdFusion.objectCache[_746];
if(!_747||!_747 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.showaccordion.layoutnotfound","widget",[_745],null,null,true);
}
if(!_748||!_748 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.showaccordion.panelnotfound","widget",[_746],null,null,true);
}
_748.show();
ColdFusion.Log.info("layout.showaccordion.shown","widget",[_746,_745]);
};
ColdFusion.Layout.expandAccordion=function(_749,_74a){
var _74b=ColdFusion.objectCache[_749];
var _74c=ColdFusion.objectCache[_74a];
if(!_74b||!_74b instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.expandaccordion.layoutnotfound","widget",[_749],null,null,true);
}
if(!_74c||!_74c instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.expandaccordion.panelnotfound","widget",[_74a],null,null,true);
}
_74c.expand();
ColdFusion.Log.info("layout.expandaccordion.expanded","widget",[_74a,_749]);
};
ColdFusion.Layout.selectAccordion=function(_74d,_74e){
return ColdFusion.Layout.expandAccordion(_74d,_74e);
};
ColdFusion.Layout.collapseAccordion=function(_74f,_750){
var _751=ColdFusion.objectCache[_74f];
var _752=ColdFusion.objectCache[_750];
if(!_751||!_751 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.collapseaccordion.layoutnotfound","widget",[_74f],null,null,true);
}
if(!_752||!_752 instanceof Ext.Panel){
ColdFusion.handleError(null,"layout.collapseaccordion.panelnotfound","widget",[_750],null,null,true);
}
_752.collapse();
ColdFusion.Log.info("layout.collapseaccordion.collapsed","widget",[_750,_74f]);
};
ColdFusion.Layout.createAccordionPanel=function(_753,_754,_755,url,_757){
var _758=ColdFusion.objectCache[_753];
var _759=_754;
if(_753&&typeof (_753)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidname","widget",[_753],null,null,true);
return;
}
if(!_753||ColdFusion.trim(_753)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.emptyname","widget",[_753],null,null,true);
return;
}
if(_754&&typeof (_754)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidaccordionpanelname","widget",[_754],null,null,true);
return;
}
if(!_754||ColdFusion.trim(_754)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.emptyaccordionpanelname","widget",[_754],null,null,true);
return;
}
if(_755&&typeof (_755)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidtitle","widget",[_754],null,null,true);
return;
}
if(!_755||ColdFusion.trim(_755)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidtitle","widget",[_754],null,null,true);
return;
}
if(url&&typeof (url)!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidurl","widget",[_754],null,null,true);
return;
}
if(!url||ColdFusion.trim(url)==""){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidurl","widget",[_754],null,null,true);
return;
}
_754="cf_layoutarea"+_759;
if(_758&&(_758 instanceof Ext.Panel)){
var _75a=null;
var ele=document.getElementById(_754);
if(ele!=null){
ColdFusion.handleError(null,"layout.createaccordionpanel.duplicateel","widget",[_754],null,null,true);
return;
}
var _75c=true;
var _75d;
var _75e=false;
var _75f=null;
if(_757!=null){
if(typeof (_757)!="object"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidconfig","widget",[_754],null,null,true);
return;
}
}
if(_757&&typeof (_757.selected)!="undefined"&&_757.selected==true){
_75e=true;
}
if(_757&&_757.titleicon){
if(typeof _757.titleicon!="string"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidtitleicon","widget",[_754],null,null,true);
return;
}
var _760=Ext.String.format(ACCORDION_TITLE_ICON_CSS_TEMPLATE,_754,_757.titleicon);
Ext.util.CSS.createStyleSheet(_760,_754+"_cf_icon");
_75f=_754;
}
var _761=_758.layoutConfig;
var _762=true;
if(_761&&typeof _761.fill!="undefined"){
_762=_761.fill;
}
if(_757!=null&&typeof (_757.overflow)!="undefined"){
var _75d=new String(_757.overflow);
_75d=_75d.toLowerCase();
if(_75d!="visible"&&_75d!="auto"&&_75d!="scroll"&&_75d!="hidden"){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidoverflow","widget",[_754],null,null,true);
return;
}
if(!_762&&(_75d=="auto"||_75d=="scroll")){
ColdFusion.handleError(null,"layout.createaccordionpanel.invalidoverflowforfillheight","widget",[_754],null,null,true);
return;
}
if(_75d=="hidden"){
_75c=false;
}
}else{
_75d="auto";
_75c=true;
}
var _763=document.getElementById(_753);
if(_763){
var _764=document.getElementById(_753);
var _765=document.createElement("div");
_765.id=_754;
if(_757!=null&&typeof (_757.align)!="undefined"){
_765.align=_757.align;
}
var _766="";
if(_758.height){
_766="height:"+_758.height+";";
}
if(_757!=null&&typeof (_757.style)!="undefined"){
var _767=new String(_757.style);
_767=_767.toLowerCase();
_766=_766+_767;
}
_766=_766+"overflow:"+_75d+";";
_765.style.cssText=_766;
_764.appendChild(_765);
}
var _768=true;
var _769=true;
itemobj=ColdFusion.Layout.InitAccordionChildPanel(_754,_759,_755,_769,_768,_75c,_75f,false);
_758.add(itemobj);
if(url!=null&&typeof (url)!="undefined"&&url!=""){
if(url.indexOf("?")!=-1){
url=url+"&";
}else{
url=url+"?";
}
var _76a;
var _76b;
if(_757){
_76a=_757.callbackHandler;
_76b=_757.errorHandler;
}
ColdFusion.Ajax.replaceHTML(_754,url,"GET",null,_76a,_76b);
}
_758.doLayout();
if(_75e){
ColdFusion.Layout.expandAccordion(_753,_759);
}
ColdFusion.Log.info("layout.createaccordionpanel.created","widget",[_754]);
}else{
ColdFusion.handleError(null,"layout.createaccordionpanel.layoutnotfound","widget",[_753],null,null,true);
}
};
ColdFusion.Layout.initViewport=function(_76c,item){
var _76e=new Array();
_76e[0]=item;
var _76f={items:_76e,layout:"fit",name:_76c};
var _770=new Ext.Viewport(_76f);
return _770;
};
ColdFusion.Layout.convertPositionToDirection=function(_771){
if(_771.toUpperCase()=="LEFT"){
return "west";
}else{
if(_771.toUpperCase()=="RIGHT"){
return "east";
}else{
if(_771.toUpperCase()=="CENTER"){
return "center";
}else{
if(_771.toUpperCase()=="BOTTOM"){
return "south";
}else{
if(_771.toUpperCase()=="TOP"){
return "north";
}
}
}
}
}
};
ColdFusion.Layout.addMapInAccordionMapping=function(_772,map){
ColdFusion.MapVsAccordion[_772]=map;
};
