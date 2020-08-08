var __loggerControl;

CHLIB_C_STROKE_WIDTH_LINE = 1;
CHLIB_C_STROKE_WIDTH_CIRCLE = 2;
CHLIB_C_STROKE_WIDTH_RECTANGLE = 1;
CHLIB_PI_SEED = "3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198";
CHLIB_LAST_PI_SEED_INDEX = 0;

// INFO Helpers
// ***************************************
function getFPSByTime(_milis)
{
	return C_FPS_MS * _milis / 1000;
}

function msglog(_text)
{
	if (C_DEBUG_MODE == true && C_LOG == true)
	{
		console.log(_text);

		if (typeof __loggerControl === 'undefined')
		{
			__loggerControl = document.getElementById('mytextarea_id');
		}

		if (typeof __loggerControl !== 'undefined' && __loggerControl !== null)
		{
			__loggerControl.value = __loggerControl.value + _text  + "\n";
			__loggerControl.scrollTop = __loggerControl.scrollHeight;
			__loggerControl.style.display = 'block';	
		}
	}
}

function __log(e, data)
{
	console.log(e);
    log.innerHTML += "\n" + e + " " + (data || '');
}

// TEXT Helpers
// ***************************************
function renderText(context, _cenX, _cenY, _text, _font, _fillColor)
{
	context.save();
	context.font = _font;
	context.fillStyle = _fillColor;
	context.fillText(_text, _cenX, _cenY);
	context.restore();
}

function renderTextCentered(context, _cenX, _cenY, _text, _font, _fillColor)
{
	var middleWidth = chMeasureText(context, _text, _font) / 2;
	
	context.save();
	context.font = _font;
	context.fillStyle = _fillColor;
	context.fillText(_text, _cenX - middleWidth, _cenY);
	context.restore();
}

function writeMessage(_context, message, _posX, _posY, _size, _fontName, _fontColor, _backColor, _debug_mode) 
{
	if (_debug_mode == true)
	{
		var font = _size + "pt " + _fontName;
		var textWidth = chMeasureText(_context, message, font);

		renderRectangle(_context, _posX, _posY - _size, textWidth, _size * 1.5, _backColor, null, null, 1);
		_context.font = font;
		_context.fillStyle = _fontColor;
		_context.fillText(message, _posX, _posY);
	}
}

function chMeasureText(context, _text, _font)
{
	var result = 0;
	
	context.save();
	context.font = _font;
	result = context.measureText(_text).width;
	context.restore();
	
	return result;
}

function chLeftPad(_textToPad, _fillChar, _size)
{
	return String(_fillChar.repeat(_size) + _textToPad).slice(-_size);
}

// PRIMITIVE DRAW Helpers
// ***************************************
function renderCircle(context, _cenX, _cenY, _radious, _fillColor, _strokeColor, _strokeWidth, _alpha)
{
	context.save();
	context.beginPath();

	context.lineWidth = _strokeWidth;
	context.globalAlpha = _alpha;
	context.arc(_cenX, _cenY, _radious, 0, 2 * Math.PI, false);
	
	if (_fillColor != null)
	{
		context.fillStyle = _fillColor;
		context.fill();
	}

	if (_strokeColor != null)
	{
		context.strokeStyle = _strokeColor;
		context.stroke();
	}

	context.restore();
}

function renderRectangle(context, _x1, _y1, _w, _h, _fillColor, _strokeColor, _strokeWidth, _alpha)
{
	context.save();
	context.beginPath();
	
	context.lineWidth = _strokeWidth;
	context.globalAlpha = _alpha;
	context.rect(_x1, _y1, _w, _h);

	if (_fillColor != null)
	{
		context.fillStyle = _fillColor;
		context.fill();
	}

	if (_strokeColor != null)
	{
		context.strokeStyle = _strokeColor;
		context.stroke();
	}
	
	context.restore();
}

function rendercollisionRectangle(context, _rect, _borderColor)
{
	renderRectangle(
		context, 
		_rect.m_x1, 
		_rect.m_y1, 
		_rect.m_x2 - _rect.m_x1, 
		_rect.m_y2 - _rect.m_y1, 
		null, 
		_borderColor, 
		CHLIB_C_STROKE_WIDTH_RECTANGLE, 
		1);
}

function renderLine(context, _x1, _y1, _x2, _y2, _fillColor, _alpha, _width)
{
	context.save();
	context.beginPath();
	context.strokeStyle = _fillColor;
	context.lineWidth = _width;
	context.globalAlpha = _alpha;

    context.moveTo(_x1,_y1);
    context.lineTo(_x2,_y2);
	context.stroke();
	context.restore();
}

function drawImageFromObj(_object)
{
	this.drawImage(	_object.canvas, 
					_object.context, 
					_object.image,
					_object.screenX, 
					_object.screenY,
					_object.rotation,
					_object.alpha,
					_object.scale,
					0,
					0,
					_object.flip);
}

function drawImage(_canvas, _context, _bitmap, _x, _y, _rotationAngle, _percent, _scale, _px, _py, _flip) 
{
	_context.save();

	_context.globalAlpha = _percent;

	var w = _bitmap.width / 2;
	var h = _bitmap.height / 2;

	// translate context to center of canvas.	
    _context.translate( _x , _y );
    _context.translate( _px , _py );

    // rotate 45 degrees clockwise.
    _context.rotate(graToRad(360-_rotationAngle));

    _context.scale( _scale * _flip, _scale);

	// translate back context to center of canvas.
    _context.translate( -_px , -_py );
    _context.translate(	-_x , -_y );
	
	// Make pivot as center of image.
	_context.drawImage(_bitmap, _x - w, _y - h);

	_context.restore();
}

function clipImage(_canvas, _context, _bitmap, _sx, _sy, _sw, _sh, _x, _y, _w, _h, _percent) 
{
	_context.save();
	_context.globalAlpha = _percent;

	_context.drawImage(_bitmap, _sx, _sy, _sw, _sh, _x * C_PIXEL_SIZE , _y * C_PIXEL_SIZE, _w * C_PIXEL_SIZE, _h * C_PIXEL_SIZE);
	
	if (C_DEBUG_SHOW_LINES == true)
		renderRectangle(_context, _x * C_PIXEL_SIZE , _y * C_PIXEL_SIZE, _w * C_PIXEL_SIZE, _h * C_PIXEL_SIZE, 'red');

	_context.restore();
}

function rgbaToColor(_r, _g, _b, _a) 
{
	 _r = _r % 256;
	 _g = _g % 256;
	 _b = _b % 256;
	var result = 'rgba(' + _r.toString() + "," + _g.toString() + "," + _b.toString() + "," + _a.toString()+")";
	return result;
}

// MATH Helpers
// ***************************************
function graToRad(grados)
{
	return grados * Math.PI / 180;
}

function radToGra(radians)
{
	return 180 * radians / Math.PI;
}

function sinOf(_ro, _tita) 
{
	return Math.sin(graToRad(_tita % 360) ) * (_ro);
}

function cosOf(_ro, _tita) 
{
	return Math.cos(graToRad(_tita % 360) ) * (_ro);
}

function chRandom(_max) 
{ 
	return Math.floor(Math.random() * _max);
}

function chRandomPISeed(_max)
{
	var digit = parseInt(CHLIB_PI_SEED.substring(CHLIB_LAST_PI_SEED_INDEX, CHLIB_LAST_PI_SEED_INDEX + 1));
	var returnValue = Math.floor(digit / 9 * _max);
	
	CHLIB_LAST_PI_SEED_INDEX = CHLIB_LAST_PI_SEED_INDEX + 1;
	CHLIB_LAST_PI_SEED_INDEX = CHLIB_LAST_PI_SEED_INDEX % CHLIB_PI_SEED.length;

	return returnValue;	
}

function chResetRandomPISeed()
{
	CHLIB_LAST_PI_SEED_INDEX = 0;
}


function getCenter(_totalSize, _objSize)
{
	return (_totalSize - _objSize) / 2;
}

// Valid angles are beetwen 0 and 360
function chNormalizeAngle(_angle)
{
	var result = _angle % 360;
				
	if (result < 0 )
		result = 360 + result; 
		
	return result;
}

// ARRAY Helpers
// ***************************************
function emptyArray(_array)
{
	if (_array != null && _array.length > 0)
	{
		_array.splice(0, _array.length);	
	}
}

// ***************************************
// collision Helpers
// ***************************************
function collisionPointRect(_x, _y, _sx, _sy, _r)
{
	var bResult = false;

	_x = _x / _sx;
	_y = _y / _sy;
	
	if (_x > _r.m_x1 && _x < _r.m_x2 && 
		_y > _r.m_y1 && _y < _r.m_y2)
	{						
		bResult = true;
	}
	
	return bResult;
}

function collisionPointRectAlpha(_x, _y, _r, _image, _sx, _sy, _flip, _outputForDebug)
{
	var bResult = false;
	
	if (_flip === 1)
		_dx = _x - _r.m_x1;
	else
		_dx = _r.m_x2 - _x;

	_dy = _r.m_y2 - _y;
	
	_outputForDebug.x = _dx;
	_outputForDebug.y = _dy;

	var ctx = _image.getContext('2d'); 
	var imgData = ctx.getImageData(_dx / _sx, _dy / _sy, 1, 1);
	var pix = imgData.data;

	bResult = (pix[3] !== 0); 
	if (bResult === true)
		_outputForDebug.c = "red";
	else
		_outputForDebug.c = "yellow";

	//msglog("_dx,dy=" + _dx +  "," + _dy);
	//msglog("pixc=" + pix[3]);

	return bResult;
}

//THANKS TO: http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
function collisionRectRect(_ax1, _ay1, _ax2, _ay2, _bx1, _by1, _bx2, _by2)
{
	// Explicacion para el eje x (el eje y es lo mismo)
	// Si la distancia entre los extremos de los rectangulos es menor a la suma de los anchos, entonces se solapan.
 
 	var t = 0;
	
	// En caso que vengan invertidos los vertices, hacer que siempre
	// la esquina superior izquierda sea el comienzo del rectangulo.
	if (_ax1 > _ax2) {t = _ax1; _ax1 = _ax2; _ax2 = t;}
	if (_ay1 > _ay2) {t = _ay1; _ay1 = _ay2; _ay2 = t;}
	if (_bx1 > _bx2) {t = _bx1; _bx1 = _bx2; _bx2 = t;}
	if (_by1 > _by2) {t = _by1; _by1 = _by2; _by2 = t;}
	
	var r1w = Math.abs(_ax2 - _ax1);
	var r2w = Math.abs(_bx2 - _bx1);
	var r1h = Math.abs(_ay2 - _ay1);
	var r2h = Math.abs(_by2 - _by1);
	
	var xmin = _ax1;
	var xmax = _bx2;
	var ymin = _ay1;
	var ymax = _by2;

	if (_ax1 >= _bx1) xmin = _bx1;
	if (_ax2 >= _bx2) xmax = _ax2;
	if (_ay1 >= _by1) ymin = _by1;
	if (_ay2 >= _by2) ymax = _ay2;
		
	var dx = Math.abs(xmin - xmax);
    var dy = Math.abs(ymin - ymax);

    return (dx <= (r1w + r2w) && dy <= (r1h + r2h));
}

function updateRectangleWithScale(_image, _cx, _cy, _scale, _outputRectangle)
{
	var centerX = _image.width * 0.5 * _scale;
	var centerY = _image.height * 0.5 * _scale;

	_outputRectangle.m_x1 = _cx - centerX;
	_outputRectangle.m_y1 = _cy - centerY;
	_outputRectangle.m_x2 = _cx + centerX;
	_outputRectangle.m_y2 = _cy + centerY;
}

function rectangleMoveTo(_inputRectangle, _cx, _cy, _outputRectangle)
{
	var centerX = _inputRectangle.getCenterX();
	var centerY = _inputRectangle.getCenterY();

	_outputRectangle.m_x1 = _inputRectangle.m_x1 + (_cx - centerX);
	_outputRectangle.m_y1 = _inputRectangle.m_y1 + (_cy - centerY);
	_outputRectangle.m_x2 = _inputRectangle.m_x2 + (_cx - centerX);
	_outputRectangle.m_y2 = _inputRectangle.m_y2 + (_cy - centerY);
}

// CANVAS Helpers
// ***************************************
function ChRect ()
{ 
	ChRect.prototype.initWith = function (_x1, _y1, _x2, _y2)
	{
		this.m_x1 = _x1;
		this.m_y1 = _y1;
		this.m_x2 = _x2;
		this.m_y2 = _y2;
	};
	
	ChRect.prototype.fLog = function ()
	{ 
		var logText = "Point: " +
		"m_x=" + this.m_x + ", " +
		"m_y=" + this.m_y + ", " + 
		"m_z=" + this.m_z + ", " + 
		"m_t=" + this.m_t + "; "; 
		
		return logText;
	};
	
	ChRect.prototype.width = function ()
	{
		return Math.abs(this.m_x2 - this.m_x1);
	};

	ChRect.prototype.height = function ()
	{
		return Math.abs(this.m_y2 - this.m_y1);
	};
	
	ChRect.prototype.getCenterX = function ()
	{
		var middle = this.width() / 2;
		
		if (this.m_x1 <= this.m_x2)
			return this.m_x1 + middle;
		else
			return this.m_x2 + middle;
	};

	ChRect.prototype.getCenterY = function ()
	{
		var middle = this.height() / 2;
		
		if (this.m_y1 <= this.m_y2)
			return this.m_y1 + middle;
		else
			return this.m_y2 + middle;
	}
}

function ChCanvas (_document, _window) 
{ 
	ChCanvas.owner = this;					// we need it when functions are called from events.

	this.m_document = _document;
	this.m_window = _window;
	this.m_canvas = null;
	this.m_context = null;

	this.m_scaleX = 1;
	this.m_scaleY = 1;

	this.m_canvasWidth = 0;
	this.m_canvasHeight = 0;
	this.m_resizeMethodToMaxZoom = false;
	this.m_invalidateOnResize = false;		// invalidate perserof resize when user call enableOnResizeChange.

	ChCanvas.prototype.setCanvasById = function (_canvasId)
	{
		if (typeof this.m_document !== 'undefined' && this.m_document != null)
		{
			this.m_canvas = this.m_document.getElementById(_canvasId);
			this.m_context = this.m_canvas.getContext('2d'); 	
		}
	}

	ChCanvas.prototype.initDefaultConstructor = function ()
	{
		if (this.m_canvas !== null)
		{
			this.m_context = this.m_canvas.getContext('2d');

			// do nothing in the event handler except canceling the event
			this.m_canvas.ondragstart = function(e) 
			{
			    if (e && e.preventDefault) { e.preventDefault(); }
			    if (e && e.stopPropagation) { e.stopPropagation(); }
			    return false;
			};

			// do nothing in the event handler except canceling the event
			this.m_canvas.onselectstart = function(e) 
			{
			    if (e && e.preventDefault) { e.preventDefault(); }
			    if (e && e.stopPropagation) { e.stopPropagation(); }
			    return false;
			};
		}
	}

	ChCanvas.prototype.performResize = function ()
	{
		this.m_invalidateOnResize = false;

		// Our canvas must cover full height of screen
		// regardless of the resolution
		if (this.m_window.innerHeight <= this.m_window.innerWidth)
		{
			var height = this.m_window.innerHeight;
			var ratio = (this.m_canvas.width+0)/this.m_canvas.height;
			var width = height * ratio;
			if (width > this.m_canvas.width)
			{
                if (this.m_resizeMethodToMaxZoom === false) {
                    width = this.m_canvas.width;
                    if (height > this.m_canvas.height)
                        height = this.m_canvas.height;
                }
			}

			this.m_canvas.style.width = width+'px';
			this.m_canvas.style.height = height+'px';
			this.m_canvasWidth = width;
			this.m_canvasHeight = height;
			
			this.m_scaleX = this.m_canvasWidth / this.m_canvas.width;
			this.m_scaleY = this.m_canvasHeight / this.m_canvas.height;
		}
		else
		{
			var width = this.m_window.innerWidth;
			var ratio = (this.m_canvas.height+0)/this.m_canvas.width;
			var height = width * ratio;
			if (height > this.m_canvas.height)
			{
                if (this.m_resizeMethodToMaxZoom === false) {
                    height = this.m_canvas.height;
                    if (width > this.m_canvas.width)
                        width = this.m_canvas.width;
                }
			}

			this.m_canvas.style.width = width+'px';
			this.m_canvas.style.height = height+'px';
			this.m_canvasWidth = width;
			this.m_canvasHeight = height;
	
			this.m_scaleX = this.m_canvasWidth / this.m_canvas.width;
			this.m_scaleY = this.m_canvasHeight / this.m_canvas.height;
		}
	
		this.centerCanvasInWindow(this.m_canvasWidth, this.m_canvasHeight);
	}

	ChCanvas.prototype.centerCanvasInWindow = function(_cw, _ch)
	{
		var cw = 0;
		var ch = 0;

		if ((typeof _cw !== 'undefined') && _cw!= null)
			cw = _cw;

		if ((typeof _ch !== 'undefined') && _ch!= null)
			ch = _ch;

		var dx =  (this.m_window.innerWidth > cw) ? (this.m_window.innerWidth / 2 - cw / 2) : 0;
		var dy =  (this.m_window.innerHeight > ch) ? (this.m_window.innerHeight / 2 - ch / 2) : 0;

	    this.m_canvas.style.position = 'absolute';
	    this.m_canvas.style.left = dx + 'px';
	    this.m_canvas.style.top =  dy + 'px';
	}

	ChCanvas.prototype.enableOnResizeChange = function ()
	{
		this.m_invalidateOnResize = true;
		this.m_window.addEventListener('resize', this.onResizeEvent, false);
	}

	// This is a function to perform the avoid resize trick.
	// It`s quite a long to explain.
	ChCanvas.prototype.onResizeEvent = function ()
	{
		_this = ChCanvas.owner;  

		if (_this.m_invalidateOnResize === true)
		{
			_this.m_invalidateOnResize = false;
			return;
		}

		_this.performResize();
	}

	ChCanvas.prototype.setResizeMethodToMaxZoom = function ()
	{
		this.m_resizeMethodToMaxZoom = true;
	}

	ChCanvas.prototype.setResizeMethodToDefault = function ()
	{
		this.m_resizeMethodToMaxZoom = false;
	}

	ChCanvas.prototype.fLog = function () 
	{ 
		var logText = "ChCanvas: " +
		"m_window=" + this.m_window + ", " +
		"m_canvas=" + this.m_canvas + ", " + 
		"m_context=" + this.m_context + ", " + 
		"m_canvasWidth=" + this.m_canvasWidth + ", " + 
		"m_canvasHeight=" + this.m_canvasHeight + "; "; 
		
		return logText;
	};

	this.initDefaultConstructor();
}

function centerCanvasInWindows(_canvas, _cw, _ch)
{
	var cw = 0;
	var ch = 0;

	if ((typeof _cw !== 'undefined') && _cw!= null)
		cw = _cw;

	if ((typeof _ch !== 'undefined') && _ch!= null)
		ch = _ch;

	var dx =  (window.innerWidth > cw) ? (window.innerWidth / 2 - cw / 2) : 0;
	var dy =  (window.innerHeight > ch) ? (window.innerHeight / 2 - ch / 2) : 0;

    _canvas.style.position = 'absolute';
    _canvas.style.left = dx + 'px';
    _canvas.style.top =  dy + 'px';
}

function initResizing() 
{
	initResizingBase(m_canvas, false);
}

function initResizingMaxZoom()
{
    initResizingBase(m_canvas, true);
}

function resizeCanvas(_canvas, _maxZoom) 
{
	initResizingBase(_canvas, _maxZoom);
}

function initResizingBase(_paramCanvas, _maxZoom)
{
	var globalCanvas = _paramCanvas;
	var globalCanvasW = _paramCanvas.width;
	var globalCanvasH = _paramCanvas.height;

	globalCanvas.onselectstart = function() { return false; };
	
	function resize() 
	{
		// Our canvas must cover full height of screen
		// regardless of the resolution
		if (window.innerHeight <= window.innerWidth )
		{
			var height = window.innerHeight;
			var ratio = (globalCanvas.width+0)/globalCanvas.height;
			var width = height * ratio;
			if (width > globalCanvas.width)
			{
                if (_maxZoom === false) {
                    width = globalCanvas.width;
                    if (height > globalCanvas.height)
                        height = globalCanvas.height;
                }
			}

			globalCanvas.style.width = width+'px';
			globalCanvas.style.height = height+'px';
			globalCanvasW = width;
			globalCanvasH = height;
			
			m_scaleX = m_canvasWidth / globalCanvas.width;
			m_scaleY = m_canvasHeight / globalCanvas.height;
		}
		else
		{
			var width = window.innerWidth;
			var ratio = (globalCanvas.height+0)/globalCanvas.width;
			var height = width * ratio;
			if (height > globalCanvas.height)
			{
                if (_maxZoom === false) {
                    height = globalCanvas.height;
                    if (width > globalCanvas.width)
                        width = globalCanvas.width;
                }
			}

			globalCanvas.style.width = width+'px';
			globalCanvas.style.height = height+'px';
			globalCanvasW = width;
			globalCanvasH = height;
	
			m_scaleX = m_canvasWidth / globalCanvas.width;
			m_scaleY = m_canvasHeight / globalCanvas.height;
		}

		console.log(globalCanvas);
		console.log("cw,ch:" + m_canvasWidth + "," + m_canvasHeight);

		centerCanvasInWindows(globalCanvas, m_canvasWidth, m_canvasHeight);
	}

	window.addEventListener('load', resize, false);
	window.addEventListener('resize', resize, false);

	// do nothing in the event handler except canceling the event
	globalCanvas.ondragstart = function(e) {
	    if (e && e.preventDefault) { e.preventDefault(); }
	    if (e && e.stopPropagation) { e.stopPropagation(); }
	    return false;
	};

	// do nothing in the event handler except canceling the event
	globalCanvas.onselectstart = function(e) {
	    if (e && e.preventDefault) { e.preventDefault(); }
	    if (e && e.stopPropagation) { e.stopPropagation(); }
	    return false;
	};

	resize();
}

function chUpdadeInfoControlTextCanvas(_control, _text) 
{ 
	if (typeof _control !== 'undefined' && _control !==null) 
	{
		_control.setText(_text);
		_control.render();
	}
}

// SOCKET Helpers
// ***************************************
function getCurrentHostname(_window) 
{
	var myHost = "localhost";

	if (typeof _window !== 'undefined' && _window !== null)
	{
		myHost = window.location.hostname;
	}

	if (myHost === "localhost")
		myHost = myHost + ":" + C_DEFAULT_PORT;
	else if (myHost.substring(0,7) == "192.168")
		myHost = myHost + ":" + C_DEFAULT_PORT;

	return myHost;
}

function callWebService(_type, _servicePath, _callbackError, _callbackSuccess)
{
	msglog("CallWebService request:" + _servicePath);

	$.ajax({
	   url: '//' + viewMngr.m_hostname + '/' + _servicePath,
	   error: function() 
	   {
	     	msglog("CallWebService: error");
	   		if (typeof _callbackError !== 'undefined')
	   			_callbackError("ERROR");
	   },
	   success: function(data) 
	   {
	   		msglog("CallWebService response:" + data);
	   		if (typeof _callbackSuccess !== 'undefined')
	   			_callbackSuccess(data);
	   },
	   type: _type
	});
}

// Platform Helpers
function isMobile()
{ 
	return ('ontouchstart' in window || navigator.msMaxTouchPoints);
}




