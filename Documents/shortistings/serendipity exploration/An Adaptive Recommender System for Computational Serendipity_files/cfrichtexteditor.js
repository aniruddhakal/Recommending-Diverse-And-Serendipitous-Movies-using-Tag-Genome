/*ADOBE SYSTEMS INCORPORATED
Copyright 2012 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
ColdFusion.RichText||(ColdFusion.RichText={});
ColdFusion.RichText.editorState={};
ColdFusion.RichText.buffer=null;
ColdFusion.RichText.registerAfterSet=function(_3d1){
if(ColdFusion.RichText.editorState[_3d1]){
var _3d2=function(){
ColdFusion.RichText.fireChangeEvent(_3d1);
};
var _3d3=CKEDITOR.instances[_3d1];
_3d3.on("OnAfterSetHTML",_3d2);
}else{
setTimeout("ColdFusion.RichText.registerAfterSet('"+_3d1+"')",1000);
}
};
ColdFusion.RichText.getEditorObject=function(_3d4){
if(!_3d4){
ColdFusion.handleError(null,"richtext.geteditorobject.missingtextareaname","widget",null,null,null,true);
return;
}
var _3d5=ColdFusion.objectCache[_3d4];
if(_3d5==null||CKEDITOR.editor.prototype.isPrototypeOf(_3d5)==false){
ColdFusion.handleError(null,"richtext.geteditorobject.notfound","widget",[_3d4],null,null,true);
return;
}
return CKEDITOR.instances[_3d5.richtextid];
};
ColdFusion.RichText.setValue=function(_3d6,_3d7){
if(ColdFusion.RichText.editorState[_3d6]){
var _3d8=CKEDITOR.instances[_3d6];
_3d8.setData(_3d7);
_3d8.fire("onAfterSetHTML");
}else{
setTimeout("ColdFusion.RichText.setValue(\""+_3d6+"\",\""+_3d7+"\")",1000);
}
};
ColdFusion.RichText.getValue=function(_3d9){
if(ColdFusion.RichText.editorState[_3d9]){
return CKEDITOR.instances[_3d9].getData();
}else{
ColdFusion.Log.error("richtext.initialize.getvalue.notready","widget",[_3d9]);
return null;
}
};
ColdFusion.RichText.fireChangeEvent=function(_3da){
var _3db=ColdFusion.objectCache[_3da];
ColdFusion.Log.info("richtext.firechangeevent.firechange","widget",[_3db._cf_name]);
var _3dc=document.getElementById(_3da);
if(_3dc){
if(_3dc.fireEvent){
_3dc.fireEvent("onchange");
}
if(document.createEvent){
var evt=document.createEvent("HTMLEvents");
if(evt.initEvent){
evt.initEvent("change",true,true);
}
if(_3dc.dispatchEvent){
_3dc.dispatchEvent(evt);
}
}
}
ColdFusion.Event.callBindHandlers(_3da,null,"change");
};
ColdFusion.RichText.editor_onfocus=function(e){
document.getElementById(e.editor.id+"_top").style.display="block";
};
ColdFusion.RichText.editor_onblur=function(e){
document.getElementById(e.editor.id+"_top").style.display="none";
};
ColdFusion.RichText.setChangeBuffer=function(e){
ColdFusion.RichText.buffer=CKEDITOR.instances[e.editor.name].getData();
};
ColdFusion.RichText.resetChangeBuffer=function(e){
if(ColdFusion.RichText.buffer!=CKEDITOR.instances[e.editor.name].getData()){
ColdFusion.RichText.fireChangeEvent(e.editor.name);
}
ColdFusion.RichText.buffer=null;
};
var parameters={};
CKEDITOR.on("instanceCreated",function(e){
var _3e3=e.editor.name;
if(parameters[_3e3].Id){
ColdFusion.RichText.editorState[parameters[_3e3].Id]=false;
e.editor.richtextid=parameters[_3e3].Id;
ColdFusion.objectCache[parameters[_3e3].Id]=e.editor;
}
if(parameters[_3e3].Name){
e.editor._cf_name=parameters[_3e3].Name;
ColdFusion.objectCache[parameters[_3e3].Name]=e.editor;
}
if(parameters[_3e3].Val){
e.editor.Value=parameters[_3e3].Val;
}
e.editor._cf_setValue=function(_3e4){
ColdFusion.RichText.setValue(_3e3,_3e4);
};
e.editor._cf_getAttribute=function(){
return ColdFusion.RichText.getValue(_3e3);
};
e.editor._cf_register=function(_3e5,_3e6,_3e7){
var _3e8=document.getElementById(_3e3);
if(_3e8){
ColdFusion.Event.addListener(_3e8,_3e5,_3e6,_3e7);
}
};
});
ColdFusion.RichText.initialize=function(Id,Name,Val,_3ec,_3ed,_3ee,_3ef,_3f0,_3f1,Skin,_3f3,_3f4,_3f5,_3f6,_3f7){
parameters[Id]={};
parameters[Id].Id=Id;
parameters[Id].Name=Name;
parameters[Id].Val=Val;
var _3f8=function(evt){
if(_3f3==true){
evt.editor.on("focus",ColdFusion.RichText.editor_onfocus);
evt.editor.on("blur",ColdFusion.RichText.editor_onblur);
document.getElementById(evt.editor.id+"_top").style.display="none";
}
evt.editor.on("focus",ColdFusion.RichText.setChangeBuffer);
evt.editor.on("blur",ColdFusion.RichText.resetChangeBuffer);
ColdFusion.RichText.editorState[evt.editor.name]=true;
if(ColdFusion.RichText.OnComplete){
ColdFusion.RichText.OnComplete(evt.editor);
}
};
var _3fa={on:{"instanceReady":_3f8}};
_3fa["toolbar"]="Default";
if(_3ee!=null){
_3fa["height"]=_3ee;
}
if(_3ed!=null){
_3fa["width"]=_3ed;
}
if(_3ef!=null){
_3fa["font_names"]=_3ef;
}
if(_3f0!=null){
_3fa["fontSize_sizes"]=_3f0;
}
if(_3f1!=null){
_3fa["format_tags"]=_3f1;
}
if(Skin!=null){
_3fa["skin"]=Skin;
}
if(_3f3==true){
_3fa["toolbarCanCollapse"]=false;
}
if(_3f4!=null){
_3fa["toolbar"]=_3f4;
}
var _3fb=CKEDITOR.replace(Id,_3fa);
};
