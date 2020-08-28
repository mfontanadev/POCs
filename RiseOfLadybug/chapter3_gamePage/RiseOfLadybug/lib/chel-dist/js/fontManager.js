// Class FontManager:
//    Get an image with clipped font images and draw on canvas.

FontManager.self = null;

function FontManager() 
{ 
	FontManager.self = this;
	
	FontManager.prototype.initDefault = function ()
	{
		this.m_fontDef = '.,;:[]=-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ* ?';
		this.m_size_width = 16;
		this.m_size_height = 16;
		this.m_fontImage = "";
		this.m_fontCoords = null;
		this.m_paddingX = 0;
	}

	FontManager.prototype.drawText = function(_canvas, _context, _text, _x, _y,  _backgroundColor)
	{
		this.drawTextBase(_canvas, _context, _text, _x, _y,  _backgroundColor, false, 1, 1)
	}
	
	FontManager.prototype.drawTextScaled = function(_canvas, _context, _text, _x, _y,  _backgroundColor, _sx, _sy)
	{
		this.drawTextBase(_canvas, _context, _text, _x, _y,  _backgroundColor, false, _sx, _sy)
	}
	
	FontManager.prototype.drawTextBase = function(_canvas, _context, _text, _x, _y,  _backgroundColor, _smallSize, _sx, _sy)
	{
		var imgOffset = -1;
		var tmpBitmapID = this.m_fontImage;
		
		var width = 0;
		var height = 0;
		var acumX = 0;

		for (var i = 0; i < _text.length; i++)
		{
			imgOffset = this.m_fontDef.indexOf(_text.charAt(i));
			if (imgOffset != -1)
			{
				width = this.m_fontCoords[imgOffset].w;
				height = this.m_fontCoords[imgOffset].h;

				this.drawCharWithColor(
				_canvas, 
				_context, 
				this.m_bitmapManager.getImageByName(tmpBitmapID), 
				this.m_fontCoords[imgOffset].x, 
				this.m_fontCoords[imgOffset].y,
				width, 
				height,
				_x + acumX,
				_y - height * _sy,
				width * _sx,
				height * _sy,
				_backgroundColor);

				acumX += (width + this.m_paddingX) * _sx;
			}
		}
	}
	
	FontManager.prototype.drawCharWithColor = function(_canvas, _context, _bitmap, _sx, _sy, _sw, _sh, _x, _y, _w, _h, _percent,  _backgroundColor) 
	{
		_context.save();

		renderRectangle(_context, _x, _y, _w, _h, _backgroundColor, null, null, _percent);

		_context.drawImage(_bitmap, _sx, _sy, _sw-1, _sh-1, _x, _y, _w-1, _h-1);
		_context.restore();
	}

	FontManager.prototype.setWidthAndHeight = function(_sizeWidth, _sizeHeight) 
	{
		this.m_size_width = _sizeWidth;
		this.m_size_height = _sizeHeight;		
	}

	FontManager.prototype.setFontImage = function(_bitmapManager, _fontImage) 
	{
		this.m_bitmapManager = _bitmapManager;
		this.m_fontImage = _fontImage;
	}

	FontManager.prototype.setFontMap = function(_fontMap) 
	{
		if (_fontMap.length > 0)
			this.m_fontDef = _fontMap;
	}

	FontManager.prototype.setFontCoords = function(_fontCoords) 
	{
		this.m_fontCoords = _fontCoords;
	}

	FontManager.prototype.setFontPaddingX = function(_paddingX) 
	{
		this.m_paddingX = _paddingX;
	}

	FontManager.prototype.getTextWidth = function(_text) 
	{
		return _text.length * this.m_size_width;
	}

	FontManager.prototype.getTextHeight = function() 
	{
		return this.m_size_width;
	}

	FontManager.prototype.getTextWidthScaled = function(_text, _sx) 
	{
		var imgOffset = -1;
		var acumX = 0;

		for (var i = 0; i < _text.length; i++)
		{
			imgOffset = this.m_fontDef.indexOf(_text.charAt(i));
			if (imgOffset != -1)
				acumX += (this.m_fontCoords[imgOffset].w + this.m_paddingX) * _sx;
		}

		return acumX;
	}

	FontManager.prototype.getCharHeightScaled = function(_char, _sx) 
	{
		var imgOffset = -1;
		var returnValue = 0;

		imgOffset = this.m_fontDef.indexOf(_char);
		if (imgOffset != -1)
			returnValue = this.m_fontCoords[imgOffset].h * _sx;

		return returnValue; 
	}

	this.initDefault();
}

