(function(opts_){var f=this,g=/^[\w+/_-]+[=]{0,2}$/,h=null,k=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&
!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},l=function(a,b){function c(){}c.prototype=b.prototype;a.h=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.g=function(a,c,m){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)}};var n=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,n);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};l(n,Error);n.prototype.name="CustomError";var p=function(a,b){a=a.split("%s");for(var c="",e=a.length-1,d=0;d<e;d++)c+=a[d]+(d<b.length?b[d]:"%s");n.call(this,c+a[e])};l(p,n);p.prototype.name="AssertionError";var q=function(a,b,c){if(!a){var e="Assertion failed";if(b){e+=": "+b;var d=Array.prototype.slice.call(arguments,2)}throw new p(""+e,d||[]);}},r=function(a,b){throw new p("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var t=function(a,b){var c=(c=a&&a.ownerDocument)&&(c.defaultView||c.parentWindow)||f;if("undefined"!=typeof c[b]&&"undefined"!=typeof c.Location&&"undefined"!=typeof c.Element){var e=typeof a;q(a&&(a instanceof c[b]||!(a instanceof c.Location||a instanceof c.Element)),"Argument is not a %s (or a non-Element, non-Location mock); got: %s",b,"object"==e&&null!=a||"function"==e?a.constructor.displayName||a.constructor.name||Object.prototype.toString.call(a):void 0===a?"undefined":null===a?"null":typeof a)}};var w=function(a,b){this.b=a===u&&b||"";this.c=v};w.prototype.toString=function(){return"Const{"+this.b+"}"};var x=function(a){if(a instanceof w&&a.constructor===w&&a.c===v)return a.b;r("expected object of type Const, got '"+a+"'");return"type_error:Const"},v={},u={};var A=function(){this.a="";this.f=y};A.prototype.toString=function(){return"TrustedResourceUrl{"+this.a+"}"};
var B=function(a){if(a instanceof A&&a.constructor===A&&a.f===y)return a.a;r("expected object of type TrustedResourceUrl, got '"+a+"' of type "+k(a));return"type_error:TrustedResourceUrl"},F=function(a,b){var c=x(a);if(!C.test(c))throw Error("Invalid TrustedResourceUrl format: "+c);a=c.replace(D,function(a,d){if(!Object.prototype.hasOwnProperty.call(b,d))throw Error('Found marker, "'+d+'", in format string, "'+c+'", but no valid label mapping found in args: '+JSON.stringify(b));a=b[d];return a instanceof
w?x(a):encodeURIComponent(String(a))});return E(a)},D=/%{(\w+)}/g,C=/^(?:https:)?\/\/[0-9a-z.:[\]-]+\/|^\/[^\/\\]|^about:blank#/i,G=/^([^?#]*)(\?[^#]*)?(#[\s\S]*)?/,I=function(a){var b=aa;a=F(ba,a);a=B(a);a=G.exec(a);var c=a[3]||"";return E(a[1]+H("?",a[2]||"",b)+H("#",c,void 0))},y={},E=function(a){var b=new A;b.a=a;return b},H=function(a,b,c){if(null==c)return b;if("string"==typeof c)return c?a+encodeURIComponent(c):"";for(var e in c){var d=c[e];d="array"==k(d)?d:[d];for(var m=0;m<d.length;m++){var z=
d[m];null!=z&&(b||(b=a),b+=(b.length>a.length?"&":"")+encodeURIComponent(e)+"="+encodeURIComponent(String(z)))}}return b};var ca=new w(u,"https://www.google.com/cse/static/style/look/%{versionDir}%{versionSlash}%{theme}.css"),J=new w(u,"https://www.google.com/cse/static/element/%{versionDir}%{versionSlash}default+%{lang}.css"),ba=new w(u,"https://www.google.com/cse/static/element/%{versionDir}%{versionSlash}cse_element__%{lang}.js"),K=new w(u,"/");window.__gcse=window.__gcse||{};window.__gcse.ct=(new Date).getTime();
window.__gcse.scb=function(){var a=window.__gcse;L()||delete opts_.rawCss;google.search.cse.element.init(opts_)&&("explicit"!=a.parsetags?"complete"==document.readyState||"interactive"==document.readyState?(google.search.cse.element.go(),a.callback&&a.callback()):google.setOnLoadCallback(function(){google.search.cse.element.go();a.callback&&a.callback()},!0):a.callback&&a.callback())};function L(){return!(window.__gcse&&window.__gcse.plainStyle)}
function M(a){var b=document.createElement("link");b.type="text/css";t(b,"HTMLLinkElement");b.rel="stylesheet";q(a instanceof A,'URL must be TrustedResourceUrl because "rel" contains "stylesheet"');b.href=B(a);return b};var N,aa=opts_.usqp?{usqp:opts_.usqp}:{},O=opts_.language.toLowerCase();N=opts_.cselibVersion?I({versionDir:opts_.cselibVersion,versionSlash:K,lang:O}):I({versionDir:"",versionSlash:"",lang:O});var P=window.__gcse.scb,Q=document.createElement("script");t(Q,"HTMLScriptElement");Q.src=B(N);var R;if(null===h){var S;a:{var T=f.document,U=T.querySelector&&T.querySelector("script[nonce]");if(U){var V=U.nonce||U.getAttribute("nonce");if(V&&g.test(V)){S=V;break a}}S=null}h=S||""}
(R=h)&&Q.setAttribute("nonce",R);Q.type="text/javascript";P&&(Q.onload=P);document.getElementsByTagName("head")[0].appendChild(Q);
if(L()){document.getElementsByTagName("head")[0].appendChild(M(opts_.cselibVersion?F(J,{versionDir:opts_.cselibVersion,versionSlash:K,lang:opts_.language}):F(J,{versionDir:"",versionSlash:"",lang:opts_.language})));var W,X=opts_.uiOptions.cssThemeVersion||(opts_.uiOptions.forceV2LookAndFeel?2:void 0),Y=opts_.theme.toLowerCase(),Z=X?"v"+X:Y.match(/v2_/g)?"v2":"",da=Y.replace("v2_","");W=F(ca,{versionDir:Z,versionSlash:Z?K:"",theme:da});document.getElementsByTagName("head")[0].appendChild(M(W))};
})({
  "cx": "009682134359037907028:tj6eafkv_be",
  "language": "en",
  "theme": "V2_DEFAULT",
  "uiOptions": {
    "resultsUrl": "",
    "enableAutoComplete": true,
    "enableImageSearch": false,
    "imageSearchLayout": "popup",
    "resultSetSize": "filtered_cse",
    "enableOrderBy": true,
    "orderByOptions": [{
      "label": "Relevance",
      "key": ""
    }, {
      "label": "Date",
      "key": "date"
    }],
    "overlayResults": true,
    "enableMobileLayout": false,
    "numTopRefinements": -1,
    "enableSpeech": false,
    "forceV2LookAndFeel": true,
    "hideElementBranding": false,
    "cssThemeVersion": 3,
    "mobileLayout": "enabled",
    "isSafeSearchActive": false
  },
  "protocol": "https",
  "rawCss": ".gsc-control-cse{font-family:arial, sans-serif}.gsc-control-cse .gsc-table-result{font-family:arial, sans-serif}.gsc-control-cse{border-color:#FFFFFF;background-color:#FFFFFF}input.gsc-input,.gsc-input-box,.gsc-input-box-hover,.gsc-input-box-focus{border-color:#6AA84F}.gsc-search-button-v2,.gsc-search-button-v2:hover,.gsc-search-button-v2:focus{border-color:#000000;background-color:#6AA84F;background-image:none;filter:none}.gsc-search-button-v2 svg{fill:#FFFFFF}.gsc-tabHeader.gsc-tabhActive,.gsc-refinementHeader.gsc-refinementhActive{color:#CCCCCC;border-color:#CCCCCC;background-color:#FFFFFF}.gsc-tabHeader.gsc-tabhInactive,.gsc-refinementHeader.gsc-refinementhInactive{color:#CCCCCC;border-color:#CCCCCC;background-color:#FFFFFF}.gsc-webResult.gsc-result,.gsc-results .gsc-imageResult{border-color:#FFFFFF;background-color:#FFFFFF}.gsc-webResult.gsc-result:hover,.gsc-imageResult:hover{border-color:#FFFFFF;background-color:#FFFFFF}.gs-webResult.gs-result a.gs-title:link,.gs-webResult.gs-result a.gs-title:link b,.gs-imageResult a.gs-title:link,.gs-imageResult a.gs-title:link b{color:#006600}.gs-webResult.gs-result a.gs-title:visited,.gs-webResult.gs-result a.gs-title:visited b,.gs-imageResult a.gs-title:visited,.gs-imageResult a.gs-title:visited b{color:#EC4E20}.gs-webResult.gs-result a.gs-title:hover,.gs-webResult.gs-result a.gs-title:hover b,.gs-imageResult a.gs-title:hover,.gs-imageResult a.gs-title:hover b{color:#CA7700}.gs-webResult.gs-result a.gs-title:active,.gs-webResult.gs-result a.gs-title:active b,.gs-imageResult a.gs-title:active,.gs-imageResult a.gs-title:active b{color:#006600}.gsc-cursor-page{color:#006600}a.gsc-trailing-more-results:link{color:#006600}.gs-webResult .gs-snippet,.gs-imageResult .gs-snippet,.gs-fileFormatType{color:#000000}.gs-webResult div.gs-visibleUrl,.gs-imageResult div.gs-visibleUrl{color:#008000}.gs-webResult div.gs-visibleUrl-short{color:#008000}.gs-webResult div.gs-visibleUrl-short{display:none}.gs-webResult div.gs-visibleUrl-long{display:block}.gs-promotion div.gs-visibleUrl-short{display:none}.gs-promotion div.gs-visibleUrl-long{display:block}.gsc-cursor-box{border-color:#FFFFFF}.gsc-results .gsc-cursor-box .gsc-cursor-page{border-color:#CCCCCC;background-color:#FFFFFF;color:#CCCCCC}.gsc-results .gsc-cursor-box .gsc-cursor-current-page{border-color:#CCCCCC;background-color:#FFFFFF;color:#CCCCCC}.gsc-webResult.gsc-result.gsc-promotion{border-color:#336699;background-color:#FFFFFF}.gsc-completion-title{color:#006600}.gsc-completion-snippet{color:#000000}.gs-promotion a.gs-title:link,.gs-promotion a.gs-title:link *,.gs-promotion .gs-snippet a:link{color:#006600}.gs-promotion a.gs-title:visited,.gs-promotion a.gs-title:visited *,.gs-promotion .gs-snippet a:visited{color:#EC4E20}.gs-promotion a.gs-title:hover,.gs-promotion a.gs-title:hover *,.gs-promotion .gs-snippet a:hover{color:#CA7700}.gs-promotion a.gs-title:active,.gs-promotion a.gs-title:active *,.gs-promotion .gs-snippet a:active{color:#006600}.gs-promotion .gs-snippet,.gs-promotion .gs-title .gs-promotion-title-right,.gs-promotion .gs-title .gs-promotion-title-right *{color:#000000}.gs-promotion .gs-visibleUrl,.gs-promotion .gs-visibleUrl-short{color:#008000}.gcsc-find-more-on-google{color:#006600}.gcsc-find-more-on-google-magnifier{fill:#006600}",
  "cse_token": "AKaTTZjBAiuGpf8ZAskJD8S-2pOm:1553094418787",
  "isHostedPage": false,
  "exp": ["csqr"],
  "cselibVersion": "af400e744a60d2b3",
  "usqp": "CAI\u003d"
});