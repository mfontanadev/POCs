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
		this.m_fontSmallImage = "";
	}

	FontManager.prototype.drawText = function(_canvas, _context, _text, _x, _y,  _backgroundColor)
	{
		this.drawTextBase(_canvas, _context, _text, _x, _y,  _backgroundColor, false, 1, 1)
	}
	
	FontManager.prototype.drawTextSmall = function(_canvas, _context, _text, _x, _y,  _backgroundColor)
	{
		this.drawTextBase(_canvas, _context, _text, _x, _y,  _backgroundColor, true, 1, 1)
	}

	FontManager.prototype.drawTextScaled = function(_canvas, _context, _text, _x, _y,  _backgroundColor, _sx, _sy)
	{
		this.drawTextBase(_canvas, _context, _text, _x, _y,  _backgroundColor, false, _sx, _sy)
	}
	
	FontManager.prototype.drawTextBase = function(_canvas, _context, _text, _x, _y,  _backgroundColor, _smallSize, _sx, _sy)
	{
		var imgOffset = -1;
		var charIndex = '';
		var sizeFactor = 0;
		var tmpBitmapID = this.m_fontImage;
		
		if (_smallSize == true)
		{
			sizeFactor = 1;
			tmpBitmapID = this.m_fontSmallImage;
		}
		
		var tmpFontSizeW = this.m_size_width >> sizeFactor;
		var tmpFontSizeH = this.m_size_height >> sizeFactor;

		var tmpFontSizeWTarget = tmpFontSizeW * _sx;
		var tmpFontSizeHTarget = tmpFontSizeH * _sy;

		for (var i = 0; i < _text.length; i++)
		{
			imgOffset = this.m_fontDef.indexOf(_text.charAt(i));
			if (imgOffset != -1)
			{
				this.drawCharWithColor(
				_canvas, 
				_context, 
				this.m_bitmapManager.getImageByName(tmpBitmapID), 
				1 + (tmpFontSizeW * imgOffset),
				1,
				tmpFontSizeW,
				tmpFontSizeH,
				_x + (i * tmpFontSizeWTarget),
				_y,
				tmpFontSizeWTarget,
				tmpFontSizeHTarget,
				_backgroundColor);
			}
		}
	}
	
	FontManager.prototype.drawCharWithColor = function(_canvas, _context, _bitmap, _sx, _sy, _sw, _sh, _x, _y, _w, _h, _percent,  _backgroundColor) 
	{
		_context.save();

		renderRectangle(_canvas, _context, _x, _y, _w, _h, _backgroundColor, null, null, _percent);

		_context.drawImage(_bitmap, _sx, _sy, _sw-1, _sh-1, _x, _y, _w-1, _h-1);
		_context.restore();
	}

	FontManager.prototype.setWidthAndHeight = function(_sizeWidth, _sizeHeight) 
	{
		this.m_size_width = _sizeWidth;
		this.m_size_height = _sizeHeight;		
	}

	FontManager.prototype.setFontImages = function(_bitmapManager, _fontImage, _fontSmallImage) 
	{
		this.m_bitmapManager = _bitmapManager;
		this.m_fontImage = _fontImage;
		this.m_fontSmallImage = _fontSmallImage;		
	}

	FontManager.prototype.setFontMap = function(_fontMap) 
	{
		if (_fontMap.length > 0)
			this.m_fontDef = _fontMap;
	}

	FontManager.prototype.getTextWidth = function(_text) 
	{
		return _text.length * this.m_size_width;
	}

	FontManager.prototype.getTextWidthScaled = function(_text, _sx) 
	{
		return _text.length * this.m_size_width * _sx;
	}

	this.initDefault();
}

