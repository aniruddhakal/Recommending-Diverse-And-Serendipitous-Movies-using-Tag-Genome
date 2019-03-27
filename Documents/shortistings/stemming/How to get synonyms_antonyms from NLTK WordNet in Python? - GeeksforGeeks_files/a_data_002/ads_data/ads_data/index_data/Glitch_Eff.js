var webGlSupported = false;
var webGLCanvas;
var gl;
var cubeVerticesBuffer;
var cubeVerticesTextureCoordBuffer;
var cubeVerticesIndexBuffer;
var cubeImage;
var cubeTexture;
var normalTexture;

var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var textureCoordAttribute;
var perspectiveMatrix;


function drawCrackElements()
{

	var nCanvas = document.createElement("CANVAS");
	nCanvas.width = images.nCrack.width;
	nCanvas.height = images.nCrack.height;
	var ctx = nCanvas.getContext("2d");	
	crackImg.hall = new cjs.Shape();
	crackImg.hall.graphics.f("#7F7FFF").s().p("AAVDVIhOg2IgFgLIgOgFIgUgYIgig3IgfgnIgJgXIgNgJIAEgRIgFgOIAGgQIgJgZIgMgYIAjghIAGgUIATgVIASABIAdgUIAUgFIAhABIAmgPIAXAEIAZAAIBEBQIAHAhIAUA4IAlAuIARAIIAEAwIgYAVIgZADIgkAPIgQASIgNAKIAFAhIgFAhIgpAXg");
	ctx.translate(127.6,145.9);
	crackImg.hall.draw(ctx);
	images.tCrack = nCanvas;
	
	var nCanvas = document.createElement("CANVAS");
	nCanvas.width = images.nCrack.width;
	nCanvas.height = images.nCrack.height;
	var ctx = nCanvas.getContext("2d");
	ctx.drawImage(images.tCrack,0,0);
	crackImg.border = new cjs.Shape();
	crackImg.border.graphics.bf(images.nCrack, null, new cjs.Matrix2D(1,0,0,1,-126.8,-145.6)).s().p("AhMCvIhhh3Ig0imIBvhmIBtgeIA/ANIBVBbIAIAsIBGBnIAFBAIgkAdIg+AeIgKBOIhZAhg");
	ctx.translate(126.8,145.6);
	ctx.globalCompositeOperation = "source-out";
	crackImg.border.draw(ctx);
	images.hCrack = nCanvas;

	//canvasInteractive.getContext("2d").drawImage(nCanvas,0,0);	
}

function initWebGL(canvas) {
  gl = null;
	webGLCanvas = canvas;
	try
	{  
		gl = webGLCanvas.getContext("experimental-webgl",
		{
			premultipliedAlpha: false
		});
	}
	catch(e) {}
	if (gl)
	{
		webGlSupported = true;
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		gl.clearColor(0, 0, 0, 0);
		initShaders();
		initBuffers();
		
    }
	else
	{
		webGlSupported = false;
	}
}

function initBuffers()
{
  cubeVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
  var vertices = [
	-1, -1,  0,
     1, -1,  0,
     1,  1,  0,
    -1,  1,  0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Map the texture onto the cube's faces.

  cubeVerticesTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);

  var textureCoordinates = [
    // Front
    0, 1,
    1, 1,
    1,  0,
    0,  0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

  cubeVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

  var cubeVertexIndices = [
    0,  1,  2,      0,  2,  3
  ] 

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");	
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
  }

  gl.useProgram(shaderProgram);
	
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);

  textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(textureCoordAttribute);
  shaderProgram.mMult = gl.getUniformLocation(shaderProgram, "iGlobalTime");
  gl.enableVertexAttribArray(shaderProgram.mMult); 
  shaderProgram.glitchForce = gl.getUniformLocation(shaderProgram, "glitchForce");
  gl.enableVertexAttribArray(shaderProgram.glitchForce);  
  shaderProgram.iMouse = gl.getUniformLocation(shaderProgram, "iMouse");
  gl.enableVertexAttribArray(shaderProgram.iMouse); 
  shaderProgram.Resolution = gl.getUniformLocation(shaderProgram, "Resolution");
  gl.enableVertexAttribArray(shaderProgram.Resolution);
  shaderProgram.LightColor = gl.getUniformLocation(shaderProgram, "LightColor");
  gl.enableVertexAttribArray(shaderProgram.LightColor);  
  shaderProgram.AmbientColor = gl.getUniformLocation(shaderProgram, "AmbientColor");
  gl.enableVertexAttribArray(shaderProgram.AmbientColor); 
  shaderProgram.Falloff = gl.getUniformLocation(shaderProgram, "Falloff");
  gl.enableVertexAttribArray(shaderProgram.Falloff);
}

function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
 
  if (!shaderScript) {
    return null;
  }

  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }
 

  var shader;

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object

  gl.shaderSource(shader, theSource);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    //alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


function setMatrixUniforms() { 
  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, -1, 1, 1, 1]));
}




function initTextures(pic) {


if (gl)
	{
  cubeTexture = gl.createTexture();  
  handleTextureLoaded(pic, cubeTexture);
  normalTexture = gl.createTexture();
//  handleTextureLoaded(images.normal, normalTexture);
  }
}

function handleTextureLoaded(image, texture) 
{
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);  
}

function drawGlitch()
{	
	gl.clear(gl.COLOR_BUFFER_BIT);	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
	gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
	handleTextureLoaded(canvasMain, cubeTexture);
	handleTextureLoaded(crackImg.nCanvas, normalTexture);
	
	
	gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSamplerNormal"), 1);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, normalTexture);
	
	//gl.uniform2fv(shaderProgram.iMouse, [(mousePos.x - w/2)/w*3 + 0.5,1 - (mousePos.y - h/2)/h*3 - 0.5]); 
	gl.uniform2fv(shaderProgram.iMouse, [Math.sin(glitchImg.time) + 0.5,-0.3]); 
	gl.uniform2fv(shaderProgram.Resolution, [w, h]); 
	gl.uniform4fv(shaderProgram.LightColor, [0.2 + glitchImg.addColor, 0.2 + glitchImg.addColor * 0.3, 0.2, 3]);
	gl.uniform4fv(shaderProgram.AmbientColor, [1, 1, 1, 1]); 
	gl.uniform3fv(shaderProgram.Falloff, [.4*0.2, 3*0.2, 20*0.2]); 
	
	glitchImg.time += glitchImg.speed;
	gl.uniform1fv(shaderProgram.mMult, [glitchImg.time]);
	gl.uniform1fv(shaderProgram.glitchForce, [glitchImg.force]); 

    //gl.activeTexture(gl.TEXTURE1);
	//gl.bindTexture(gl.TEXTURE_2D, cubeTexture);   

	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);


}