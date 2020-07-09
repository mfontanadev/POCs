CanvasControl.C_THEME_TYPE_BLUE = 0;
CanvasControl.C_THEME_TYPE_GREEN = 1;

function CanvasControl () 
{ 
  this.C_CONTROL_TYPE_BUTTON = 1;
  this.C_CONTROL_TYPE_LABEL = 2;
  this.C_CONTROL_TYPE_CHECKBOX = 3;
  this.C_CONTROL_TYPE_INPUT = 4;

  CanvasControl.prototype.initButtonStyle = function (_canvasEx, _x, _y, _width, _height, _value)
  {    
    var self = this;

    // setup the defaults
    self._controlType = self.C_CONTROL_TYPE_BUTTON;
    self.initBaseValues(self, _canvasEx, _x, _y, _width, _height, _value);
    self.initEvents(self);
  };

  CanvasControl.prototype.initLabelStyle = function (_canvasEx, _x, _y, _width, _height, _value)
  {    
    var self = this;

    // setup the defaults
    self._controlType = self.C_CONTROL_TYPE_LABEL;
    self.initBaseValues(self, _canvasEx, _x, _y, _width, _height, _value);
  };

  CanvasControl.prototype.initCheckBoxStyle = function (_canvasEx, _x, _y, _width, _height, _value)
  {    
    var self = this;

    // setup the defaults
    self._controlType = self.C_CONTROL_TYPE_CHECKBOX;
    self.initBaseValues(self, _canvasEx, _x, _y, _width, _height, _value);
    self.initEvents(self);
  };
  
  CanvasControl.prototype.initInputStyle = function (_canvasEx, _x, _y, _width, _height, _value)
  {    
    var self = this;

    // setup the defaults
    self._controlType = self.C_CONTROL_TYPE_INPUT;
    self.initBaseValues(self, _canvasEx, _x, _y, _width, _height, _value);
    self.initEvents(self);
    self.initKeyboardEvents(self);
  };

  CanvasControl.prototype.initBaseValues = function (self, _canvasEx, _x, _y, _width, _height, _value)
  { 
    self._canvasEx = _canvasEx || null;
    self._ctx = self._canvasEx.m_canvas ? self._canvasEx.m_canvas.getContext('2d') : null;
    self._x = _x || 0;
    self._y = _y || 0;
    self._fontSize = 14;
    self._fontFamily = 'Arial';
    self._fontColor = 'gray';
    self._placeholderColor = '#bfbebd';
    self._placeholderText = '';
    self._fontWeight = 'normal';
    self._fontStyle = 'normal';
    self._textJustify = 0;
    self._scale = 1;
    self._alpha = 1;
    self._width = _width || 50;
    self._height = _height || self._fontSize;
    self._recWidth = self._width;
    self._recHeight = self._height;
    self._padding = 0;
    self._borderWidth = 2;
    self._borderColor = '#CCCCCC';
    self._borderRadius = 5;
    self._backgroundColor = '#FFFFFF';
    self._mouseDownColor = '#DADADA';
    self._disabledColor = '#CACACA';    
    self._value = _value || '';
    self._isMouseDown = false;
    self._backgroundCheckedColor = '#EAEAEA';
    self._isChecked = false;
    self._padding = 5;
    self._hasFocus = false;
    self._destroyed = false;
    self._visible = true;
    self._enabled = true;

    self._onClick = null;
    self._onClickParent = null;
    self._lastPosPointerX = 0;
    self._lastPosPointerY = 0;

    self._image = null;
    self._imageLoaded = false;

    self._onSubmit = null;
    self._onkeydown = null;
    self._onkeyup = null;
    self._onkeyUpParent = null;

    self._tag = null;
  };

  CanvasControl.prototype.initEvents = function (self)
  { 
    // setup main canvas events
    if (self._canvasEx.m_canvas) 
    {
      self._canvasEx.m_canvas.addEventListener('mousedown', function(e) 
      {
        e = e || window.event;
        if (self._visible == true && self._enabled == true)
        {
          var pointer = self.mousePos(e, self);
          self.mouseDown(e, self, pointer);
        }
      }, false);

      
      self._canvasEx.m_canvas.addEventListener('mouseup', function(e) 
      {
        e = e || window.event;
        if (self._visible == true && self._enabled == true)
        {
          var pointer = self.mousePos(e, self);
          self.mouseUp(e, self, pointer);
        }
      }, false);

      self._canvasEx.m_canvas.addEventListener('touchstart', function(e) 
      {
        if ((typeof e !== 'undefined'))
        {
          e = e || window.event;
          //e.preventDefault();

          if (self._visible == true && self._enabled == true)
          {
            var pointer = self.touchPos(e, self);
            self.mouseDown(e, self, pointer);
          }
        }
      }, false);

      self._canvasEx.m_canvas.addEventListener('touchend', function(e) 
      {
        if ((typeof e !== 'undefined'))
        {
          e = e || window.event;
          //e.preventDefault();

          if (self._visible == true && self._enabled == true)
          {
            var pointer = self.touchPos(e, self);
            self.mouseUp(e, self, pointer);
          }
        }
      }, true);
    }
  };

  CanvasControl.prototype.initKeyboardEvents = function (self)
{
    self._onSubmit = null;
    self._onkeydown = null;
    self._onkeyup = null;

    // create the hidden input element
    self._hiddenInput = document.createElement('input');
    self._hiddenInput.type = 'text';
    self._hiddenInput.style.position = 'absolute';
    self._hiddenInput.style.opacity = 0;
    self._hiddenInput.style.pointerEvents = 'none';
    self._hiddenInput.style.left = '0px';
    self._hiddenInput.style.top = '0px';
    self._hiddenInput.style.width = self._widt;
    self._hiddenInput.style.height = self._height

    self._hiddenInput.style.zIndex = 0;
    self._hiddenInput.readOnly = false;

    if (self._maxlength) {
      self._hiddenInput.maxLength = self._maxlength;
    }

    document.body.appendChild(self._hiddenInput);
    self._hiddenInput.value = self._value;

    // setup the keydown listener
    self._hiddenInput.addEventListener('keydown', function(e) {
      e = e || window.event;
      var keyCode = e.which;

      if (self._hasFocus && self._visible == true && self._enabled == true) 
      {
        if (keyCode === 13) 
        { // enter key
          e.preventDefault();

          if (self._onSubmit)
            self._onSubmit(e, self);
        } 
      }
    });

    // setup the keyup listener
    self._hiddenInput.addEventListener('keyup', function(e) {
      e = e || window.event;
      
      if (self._hasFocus && self._visible == true && self._enabled == true) 
      {
        // update the canvas input state information from the hidden input
        if (self.textOverflow(self._hiddenInput.value) == false)
        {
          self._value = self._hiddenInput.value;
          self._cursorPos = self._hiddenInput.selectionStart;
          // update selection to hidden input's selection in case user did keyboard-based selection
          self._selection = [self._hiddenInput.selectionStart, self._hiddenInput.selectionEnd];
          self.render();

          if (self._onkeyup)
            self._onkeyup(e, self);
        }
        else
        {
          self._hiddenInput.value = self._value;
          e.preventDefault();
        }
      }
    });

  };

  CanvasControl.prototype.render = function () 
  {
    var self = this;

    if (!self._ctx || self._visible == false) 
      return;

    self._ctx.save();
    self._ctx.globalAlpha = self._alpha;
    self._ctx.strokeStyle = self._borderColor;
    
    // Set background styles
    if (self._enabled == false)
    {
      self._ctx.fillStyle = self._disabledColor;
    }
    else
    {
      if (self._controlType == self.C_CONTROL_TYPE_BUTTON)
      {
        self._ctx.fillStyle = (self._isMouseDown ? self._mouseDownColor : self._backgroundColor);
      }
      else if (self._controlType == self.C_CONTROL_TYPE_CHECKBOX)
      {
        if (self._isMouseDown == false)
        {
          self._ctx.fillStyle = (self._isChecked ? self._backgroundCheckedColor : self._backgroundColor);
        }
        else
        {
          self._ctx.fillStyle = self._mouseDownColor;
        }
      }
      else
        self._ctx.fillStyle = self._backgroundColor;
    }

    // Render background
    var renderBorder = true;
    if (self._themeType === CanvasControl.C_THEME_TYPE_BORDERLESS && self._controlType === self.C_CONTROL_TYPE_BUTTON)
    {
      renderBorder = false
    }

    if (renderBorder === true)
    {
      self._ctx.lineWidth = self._borderWidth;
      self.roundedRect(self._ctx, self._x, self._y, self._width, self._height, self._borderRadius, true, true);
    }

    // Input control has a smaller white second background. 
    if (self._controlType == self.C_CONTROL_TYPE_INPUT)
    {
      if (self._hasFocus == true && self._enabled == true)
      {
        self._ctx.lineWidth = 1;
        self._ctx.strokeStyle = this.rgbaToColor(0, 0, 200, 0.7);
        self.roundedRect(self._ctx, self._x, self._y, self._width, self._height, self._borderRadius, false, true);
        self._ctx.strokeStyle = this.rgbaToColor(0, 0, 200, 0.5);
        self.roundedRect(self._ctx, self._x+1, self._y+1, self._width-2, self._height-2, self._borderRadius, false, true);
      }        
    }
    
    // Draw inner text
    var innerText = self.getText();
    var innterTExtColor = self._fontColor;
    if (innerText === '')
    {
      innerText = self._placeholderText;
      innterTExtColor = self._placeholderColor;
    }

    if (innerText !== '')
    {
      self._ctx.font =  self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
      self._ctx.fillStyle = innterTExtColor;

      var dy =  (self._height / 2) + self.textHeight(self._ctx, innerText  ) / 4;

      if (self._themeType == CanvasControl.C_THEME_TYPE_BORDERLESS)
      {
      	dy = self._height - self._height / 8;
      }

      if (self._controlType == self.C_CONTROL_TYPE_INPUT)
      {
        self.renderTextLeft(self._ctx , self._x, self._y + dy, innerText);
      }
      else
      {
        var dx = (self._width / 2);

        if (self._textJustify == 0)
          self.renderTextCentered(self._ctx , self._x + dx, self._y + dy, innerText);
        else if (self._textJustify == -1)
          self.renderTextLeft(self._ctx , self._x, self._y + dy, innerText);
      }
    }


    if (self._controlType == self.C_CONTROL_TYPE_INPUT)
    {
      // Disabled input control shouldn´t render cursor.
      if (self._hasFocus == true && self._enabled == true)
      {
        self._ctx.strokeStyle = "#000";
        var posCursor = self.cursorPosInPixels(self._value, self._cursorPos);
        self.drawCursor(self._ctx, self._x + self._padding + posCursor, self._y + self._padding, self._height-(self._padding*2) );
      }
    }    

    if (self._controlType == self.C_CONTROL_TYPE_BUTTON ||
      self._controlType == self.C_CONTROL_TYPE_CHECKBOX)
    {
      if (self._imageLoaded == true)
      {
        self.drawImageResized(self);
      }
    }

    self._ctx.restore(); 
  };

  /**
  * Draws a rounded rectangle using the current state of the canvas. 
  * If you omit the last three params, it will draw a rectangle 
  * outline with a 5 pixel border radius 
  * @param {CanvasRenderingContext2D} ctx
  * @param {Number} x The top left x coordinate
  * @param {Number} y The top left y coordinate 
  * @param {Number} width The width of the rectangle 
  * @param {Number} height The height of the rectangle
  * @param {Number} radius The corner radius. Defaults to 5;
  * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
  * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
  */
  CanvasControl.prototype.roundedRect = function (ctx, x, y, width, height, radius, fill, stroke) 
  {
    if (typeof stroke == "undefined" ) {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      ctx.fill();
    }        
  };

  CanvasControl.prototype.drawCursor = function (ctx, x, y, height) 
  {
    ctx.beginPath();
    ctx.lineWidth = 0;
    ctx.moveTo(x + 2, y + this._padding);
    ctx.lineTo(x + 2, y + height - (this._padding));
    ctx.closePath();
    ctx.stroke();
  };

  /**
  * Draws a rounded rectangle using the current state of the canvas. 
  * If you omit the last three params, it will draw a rectangle 
  * outline with a 5 pixel border radius 
  * @param {CanvasRenderingContext2D} ctx
  * @param {Number} cenX The center x coordinate
  * @param {Number} cenY The top left y coordinate 
  * @param {Number} text The text to be drawn 
  */
  CanvasControl.prototype.renderText = function(_ctx, _cenX, _cenY, _text, _dx)
  {
    _ctx.fillText(_text, _cenX + _dx, _cenY);
  };

  CanvasControl.prototype.renderTextCentered = function(_ctx, _cenX, _cenY, _text)
  {
    var dx = (this.textWidth(_ctx, _text) / 2) * -1;
    this.renderText(_ctx, _cenX, _cenY, _text, dx);
  };

  CanvasControl.prototype.renderTextLeft = function(_ctx, _cenX, _cenY, _text)
  {
    var dx = this._padding + 2;
    this.renderText(_ctx, _cenX, _cenY, _text, dx);
  };

  CanvasControl.prototype.textWidth = function(_ctx, _text)
  {
    return _ctx.measureText(_text).width;
  };

  CanvasControl.prototype.textHeight = function(_ctx, _text)
  {
    return this._fontSize * 1.5;
  };

  CanvasControl.prototype.mouseDown = function(e, self, pointer)
  {
    if (self._destroyed == true)
      return;

    x = pointer.x;
    y = pointer.y;
    self._isMouseDown = self.overInput(x, y);

    if (self._hasFocus === true && self._isMouseDown === false)
    {
      self._hasFocus = false;   
    }

    self.render();
  };
  
  CanvasControl.prototype.mouseUp = function(e, self, pointer)
  {
    if (self._destroyed == true)
      return;

    // Can not fire click if mouseUp did not came from previous mouseDown.
    if (self._isMouseDown == false)
    {
      return;
    }

    var x = pointer.x;
    var y = pointer.y;
    self._isMouseDown = false;

    self.render();

    self.click(e, self, pointer);
  };
  
  CanvasControl.prototype.click = function(e, self, pointer)
  {
    //var pointer = self.mousePos(e, self);
    x = pointer.x;
    y = pointer.y;
    
    var isOver = self.overInput(x, y);
    
    recFocus = self._hasFocus;
    self._hasFocus = isOver;

    if (isOver == true)
    {
      if (self._controlType == self.C_CONTROL_TYPE_CHECKBOX)
      {
        self._isChecked = !self._isChecked;  
        self.render();
      }
      else if (self._controlType == self.C_CONTROL_TYPE_INPUT)
      {
        self._hiddenInput.focus();
        self.render();
      }

      if (self._onClick != null)
      {
        self._onClick(e, self);
      }
    }
    else
    {
      if (self._controlType == self.C_CONTROL_TYPE_INPUT && recFocus == true)
      {
        self._hiddenInput.blur();
        self.render();
      }
    }
  };

  CanvasControl.prototype.getText = function()
  {
    return this._value;
  };
  
  CanvasControl.prototype.setText = function(_text)
  {
    this._value = _text;

    if (typeof this._hiddenInput !== 'undefined' && this._hiddenInput != null)
      this._hiddenInput.value = this._value;
  };
  
  CanvasControl.prototype.setPlaceholderText = function(_text)
  {
      if (this._controlType === this.C_CONTROL_TYPE_INPUT)
      {
          this._placeholderText = _text;
      }
  };

   /**
  * Checks if a coordinate point is over the input box.
  * @param  {Number} x x-coordinate position.
  * @param  {Number} y y-coordinate position.
  * @return {Boolean}   True if it is over the input box.
  */
  CanvasControl.prototype.overInput = function(x, y) 
  {
    var self = this,
    xLeft = x >= self._x,
    xRight = x <= self._x + self._width,
    yTop = y >= self._y,
    yBottom = y <= self._y + self._height;

    return xLeft && xRight && yTop && yBottom;
  };

   /**
  * Calculate the mouse position based on the event callback from touch and the elements on the page.
  * @param  {Event} e
  * @return {Object}   x & y values
  */
  CanvasControl.prototype.touchPos = function(e, self) 
  {
    var offsetX = 0;
    var offsetY = 0;

    var rect = self._canvasEx.m_canvas.getBoundingClientRect();
    if ((typeof e.targetTouches[0] !== 'undefined') && (typeof e.targetTouches[0] !== 'undefined'))
    {
      offsetX = e.targetTouches[0].clientX - rect.left;
      offsetY = e.targetTouches[0].clientY - rect.top;
    }
    else if ((typeof e.changedTouches[0] !== 'undefined') && (typeof e.changedTouches[0] !== 'undefined'))
    {
      offsetX = e.changedTouches[0].clientX - rect.left;
      offsetY = e.changedTouches[0].clientY - rect.top;
    }
    else
    {
      offsetX = self._lastPosPointerX;
      offsetY = self._lastPosPointerY;
   }

    if ((typeof self._canvasEx.m_scaleX !== 'undefined') && self._canvasEx.m_scaleX !== null && self._canvasEx.m_scaleX != 0)
      offsetX = offsetX / self._canvasEx.m_scaleX;

    if ((typeof self._canvasEx.m_scaleY !== 'undefined') && self._canvasEx.m_scaleY !== null && self._canvasEx.m_scaleY != 0)
      offsetY = offsetY / self._canvasEx.m_scaleY;

    self._lastPosPointerX = offsetX; 
    self._lastPosPointerY = offsetY;

    return( 
    {
      x: offsetX,
      y: offsetY
    });
  };
  
   /**
  * Calculate the mouse position based on the event callback and the elements on the page.
  * @param  {Event} e
  * @return {Object}   x & y values
  */
  CanvasControl.prototype.mousePos = function(e, self) 
  {
    var rect = self._canvasEx.m_canvas.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    if ((typeof self._canvasEx.m_scaleX !== 'undefined') && self._canvasEx.m_scaleX !== null && self._canvasEx.m_scaleX != 0)
    {
      offsetX = offsetX / self._canvasEx.m_scaleX;
    }

    if ((typeof self._canvasEx.m_scaleY !== 'undefined') && self._canvasEx.m_scaleY !== null && self._canvasEx.m_scaleY != 0)
    {
      offsetY = offsetY / self._canvasEx.m_scaleY;
    }

    self._lastPosPointerX = offsetX; 
    self._lastPosPointerY = offsetY;

    return( 
    {
      x: offsetX,
      y: offsetY
    });
  };

  /**
   * Destroy this input and stop rendering it.
   */
  CanvasControl.prototype.destroy = function() 
   {
    var self = this;

    // remove focus
    if (self._hasFocus) 
    {
      self._isMouseDown = false;
      self._hasFocus = false;
      self._ctx = null;
    }

    // remove the hidden input box
    document.body.removeChild(self._hiddenInput);

    self._destroyed = true;
  };

  /**
   * Gets the pixel with of passed text.
   * @param  {String} text The text to measure.
   * @return {Number}      The measured width.
   */
  CanvasControl.prototype.cursorPosInPixels = function(text, cursorPos) 
   {
    var textClipped = text.substr(0, cursorPos);

    var self = this,
    ctx = self._ctx;

    ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;

    ctx.textAlign = 'left';

    return ctx.measureText(textClipped).width;
  };

  CanvasControl.prototype.textOverflow = function(text) 
  {
    var textPxWidth = this.cursorPosInPixels(text, text.length);

    if (textPxWidth > this._width - this._padding * 2)
      return true;
    else
      return false;

  };

  CanvasControl.prototype.setFocus = function(_focusIn) 
  {
      if (this._hiddenInput !== null)
      {
        this._hasFocus = _focusIn;

        if (_focusIn === true)
        {
          this._hiddenInput.focus();
        }
        else
        {
          this._hiddenInput.blur();
        }
      }
  };

  CanvasControl.prototype.msglog = function(_text) 
  {
  		if (typeof m_textArea != 'undefined' && m_textArea != null)
  			m_textArea.value = m_textArea.value + _text  + "\n";
  };

  CanvasControl.prototype.setTheme = function(_themeType) 
    {
     this._themeType = _themeType;

    if (_themeType == CanvasControl.C_THEME_TYPE_GREEN)
    {
      this._backgroundColor = "#218837";
      this._borderColor = "#93d3a2";

      if (this._controlType == this.C_CONTROL_TYPE_LABEL)
        this._fontColor = '#FFFFFF';
    }

    if (_themeType == CanvasControl.C_THEME_TYPE_BLUE)
    {
      this._backgroundColor = "#007bff";
      this._borderColor = "#7fbdff";

      if (this._controlType == this.C_CONTROL_TYPE_LABEL)
        this._fontColor = '#FFFFFF';
    }

    if (_themeType == CanvasControl.C_THEME_TYPE_BORDERLESS)
    {
      if (this._controlType == this.C_CONTROL_TYPE_LABEL)
      {
        this._borderColor = "rgba(255,255,255,0)";
        this._borderWidth = 0;
        this._fontWeight = "bold";
        this._fontColor = 'rgb(0,0,0)';
        this._textJustify = -1;
      }
    }
  };

  CanvasControl.prototype.setImage = function(_imageName) 
  {
    if (this._controlType == this.C_CONTROL_TYPE_BUTTON || this._controlType == this.C_CONTROL_TYPE_CHECKBOX)
    {
      var self = this;

      this._image = new Image();
      this._image.src = _imageName;
      this._image.onload = function()
      {
        self._imageLoaded = true;
      }
    }
  };

  CanvasControl.prototype.setScale = function(_scale)
  {
    this._scale = _scale;

    this._width = this._recWidth * this._scale;
    this._height = this._recHeight * this._scale;
  };

  CanvasControl.prototype.registerOnClick = function(_parent, _callback)
  {
    this._onClickParent = _parent;
    this._onClick = _callback;
  };

  CanvasControl.prototype.getOnClickParent = function()
  {
      return this._onClickParent;
  };

  CanvasControl.prototype.drawImageResized = function(self) 
  {
   var sw = self._width - 4;
   var sh = self._height - 4;
   var sx = self._x;
   var sy = self._y;
   var w = self._image.width;
   var h = self._image.height;
   var scale = 1.0;

      // Get image scale factor. Fit image to lowest measure.
      if (sh < sw)
      {
        if (sh <= h)
        {
         scale = (sh / h);
         w = w * scale;
         h = h * scale;
       }
     }
     else
     {
      if (sw <= w)
      {
       scale = (sw / w);
       w = w * scale;
       h = h * scale;
     }
   }

      // Recalculate width and height adding 2 pixels of margin.
      var dx = 0;
      var dy = 0; 
      if (self._value === '')
      {
        dx = (sw / 2) - (w / 2);
        dy = (sh / 2) - (h / 2);
      }
      sx = sx + dx + 2;
      sy = sy + dy + 2;

      self._ctx.drawImage(self._image,  0, 0, self._image.width, self._image.height, sx, sy, w, h);
  };

  CanvasControl.prototype.rgbaToColor = function(_r, _g, _b, _a) 
    {
        _r = _r % 256;
        _g = _g % 256;
        _b = _b % 256;
        var result = 'rgba(' + _r.toString() + "," + _g.toString() + "," + _b.toString() + "," + _a.toString()+")";
        return result;
  }

  CanvasControl.prototype.registerOnKeyUpListener = function(_parent, _callback) 
    {
      this._onkeyUpParent = _parent;
      this._onkeyup = _callback;
  }

  CanvasControl.prototype.getOnKeyUpParent = function() 
    {
      return this._onkeyUpParent;
  }
}

