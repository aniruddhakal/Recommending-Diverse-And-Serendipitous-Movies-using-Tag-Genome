var myCSS;
   ////fonts.googleapis.com/css?family=Roboto+Condensed:400,700&subset=cyrillic
   ////fonts.googleapis.com/css?family=Roboto+Condensed:700,400&subset=latin,latin-ext
   ////fonts.googleapis.com/css?family=Itim&subset=thai
   ////fonts.googleapis.com/css?family=Roboto+Condensed:400,700&subset=latin,greek,greek-ext,latin-ext
   var url = '//fonts.googleapis.com/css?family=Roboto+Condensed:700,400&subset=latin,latin-ext';
   var proto = 'https:';
   if (window.location.protocol != "https:")
   {
	proto  = 'http:';
   }
   var XHR = window.XDomainRequest || window.XMLHttpRequest
	var xhr = new XHR(); 

	xhr.open("GET", proto+url, true);
	xhr.onload = function() {
            myCSS = xhr.responseText.replace(/font-family: 'Roboto Condensed';/g,"font-family: 'webFont';");
			var css = myCSS,
			head = document.head || document.getElementsByTagName('head')[0],
			style = document.createElement('style');

		style.type = 'text/css';
			if (style.styleSheet)
			{
			  style.styleSheet.cssText = css;
			} else 
			{
			  style.appendChild(document.createTextNode(css));
			}
		
		head.appendChild(style);		
        }
        xhr.onerror = function() {
        console.log("Fonts error")
        }
		xhr.send()
