// Class Animation
function Animation () 
{
	Animation.prototype.initWith = function (_parent, _animationId, _x, _y)
	{
		this.m_parent = _parent;
		this.m_animationId = _animationId;

		this.m_x = _x; 
		this.m_y = _y; 
		this.m_flip = 1;

		this.m_pivotX = 0;
		this.m_pivotY = 0;
		
		this.m_frameCounter = 0;

		this.m_currentFrame = 0;
		this.m_arrFrames = new Array();
		this.m_frameInc = 0;
		
		this.m_onStartFrameEvent = null;
		this.m_onEndFrameEvent = null;
		this.m_onEndAnimationEvent = null;
		this.m_infiniteLoop = false;
		this.m_loopCounter = 0;
		this.m_loops = 0;

		this.m_rc = new ChRect();
	}

	Animation.prototype.handleInputs = function () 
	{ 
	}
	
	Animation.prototype.implementGameLogic = function () 
	{
		var fireEndFrameEvent = false;
		var fireEndAnimationEvent = false;

		if (this.m_arrFrames[this.m_currentFrame].m_duration != 0)
		{
			if (this.hasEnded() === true)
			{ 
				if (this.m_loops > 0 && this.m_loopCounter > 0)
					this.m_loopCounter++;
				
				if (this.m_infiniteLoop === true)
				{
					this.reset();
					this.start();
				}
				else
				{
					this.m_frameInc = 1;
					this.m_frameCounter = 0;
					this.m_currentFrame = 0;
				}
			}
	
			if (this.m_frameCounter >= this.m_arrFrames[this.m_currentFrame].m_duration )
			{
				this.m_frameCounter = 0;
				this.m_currentFrame = this.m_currentFrame + 1;

				if (this.m_currentFrame >= this.m_arrFrames.length)
				{
					this.m_currentFrame = this.m_arrFrames.length - 1; 
					this.m_frameInc = 0;

					if (this.m_loops === 0 || (this.m_loopCounter > 0 && this.m_loopCounter > this.m_loops))
					{
						this.m_loopCounter = 0;
						fireEndAnimationEvent = true;
					}
				}

				fireEndFrameEvent = true;
			}

			if (this.m_frameCounter === 0 && this.m_frameInc === 1)
			{
				if (this.m_onStartFrameEvent !== null)
					this.m_onStartFrameEvent(this.m_parent);
			}

			if (fireEndFrameEvent === true)
			{
				if (this.m_onEndFrameEvent !== null)
					this.m_onEndFrameEvent(this.m_parent);
			}

			if (fireEndAnimationEvent === true)
			{
				if (this.m_onEndAnimationEvent !== null)
					this.m_onEndAnimationEvent(this.m_parent);
			}

			this.m_frameCounter = this.m_frameCounter + this.m_frameInc;
		}
	}
	
	Animation.prototype.render = function (_canvas, _context)
	{
		clipImage(_canvas, _context, 
			this.m_arrFrames[this.m_currentFrame].m_resource,
			this.m_arrFrames[this.m_currentFrame].m_x1, this.m_arrFrames[this.m_currentFrame].m_y1,
			this.m_arrFrames[this.m_currentFrame].m_w, this.m_arrFrames[this.m_currentFrame].m_h, 
			this.m_x, this.m_y,
			this.m_arrFrames[this.m_currentFrame].m_w, this.m_arrFrames[this.m_currentFrame].m_h,
			1, this.m_flip); 
	}

	Animation.prototype.render = function (_canvas, _context, _angle, _alpha, _scale)
	{
		drawImage( 	_canvas,
					_context, 
					this.m_arrFrames[this.m_currentFrame].m_resource, 
					this.m_x, this.m_y, 
					_angle, _alpha, _scale, 0, 0, this.m_flip);

	}

	Animation.prototype.collisionRectangle = function () 
	{
		return collisionRectangleScaled(1);
	}

	Animation.prototype.collisionRectangleScaled = function (_scale) 
	{
		var midRad = 0;
		
		var middleWidth = this.m_arrFrames[this.m_currentFrame].m_w * _scale / 2;
		var middleHeight = this.m_arrFrames[this.m_currentFrame].m_h * _scale / 2;

		this.m_rc.m_x1 = this.m_x - middleWidth;
		this.m_rc.m_y1 = this.m_y - middleHeight;
		
		if (this.m_flip > 0)
		{
			this.m_rc.m_x2 = this.m_x + middleWidth;
			this.m_rc.m_y2 = this.m_y + middleHeight;
		}
		else
		{
			this.m_rc.m_x2 = this.m_x - middleWidth;
			this.m_rc.m_y2 = this.m_y + middleHeight;
		}
		return this.m_rc; 
	}
	
	Animation.prototype.fLog = function () 
	{ 
		var logText = "Animation: " +
		"m_x=" + this.m_x + ", " + 
		"m_y=" + this.m_y + "; ";		
		return logText;
	}  

	// ------------------------------------------
	// Behaviour
	// ------------------------------------------
	Animation.prototype.move = function (_canvas, _context) 
	{ 

	}

	Animation.prototype.setOnChangeFrameListener = function (_callbackStart, _callbackEnd) 
	{ 
		this.m_onStartFrameEvent = _callbackStart;
		this.m_onEndFrameEvent = _callbackEnd;
	}

	Animation.prototype.setOnEndAnimationEvent = function (_callbackEndAnimation) 
	{ 
		this.m_onEndAnimationEvent = _callbackEndAnimation;
	}

	Animation.prototype.setInfiniteLoop = function (_value) 
	{ 
		this.m_infiniteLoop = _value;
	}

	Animation.prototype.setLoops = function (_value) 
	{ 
		this.m_loops = _value;
	}

	// ------------------------------------------
	// User actions
	// ------------------------------------------
	Animation.prototype.start = function()
	{
		this.m_frameInc = 1;
		this.m_loopCounter = 1;
	}

	Animation.prototype.stop = function()
	{
		this.m_frameInc = 0;
	}

	Animation.prototype.resetFrameCounter = function()
	{
		this.m_frameCounter = 0;
	}

	Animation.prototype.reset = function()
	{
		this.m_frameInc = 0;
		this.m_frameCounter = 0;
		this.m_currentFrame = 0;
		this.m_loopCounter = 0;
	}

	Animation.prototype.isStopped = function()
	{
		return (this.m_frameInc == 0);
	}

	Animation.prototype.hasEnded = function()
	{
		return (this.m_currentFrame === this.m_arrFrames.length - 1 && this.m_frameInc === 0);
	}

	Animation.prototype.dissolve = function(_disolvePrower)
	{ 
	}
	
	Animation.prototype.createFrame = function(_resource, _x1, _y1, _x2, _y2, _offsetX, _offsetY, _incX, _incY, _duration)
	{
		var pObj = new chAnimationFrame();
		pObj.initWith(_resource, _x1, _y1, _x2, _y2, _offsetX, _offsetY, _incX, _incY, _duration);
		this.m_arrFrames.push(pObj);
		this.recalcPivot();
	}
	
	Animation.prototype.recalcPivot = function()
	{
		this.m_pivotX = 0;
		this.m_pivotY = 0;
		var validFramesX = 0;
		var validFramesY = 0;
		
		for (var i = this.m_arrFrames.length - 1; i >= 0; i--) 
		{
			// Avoid empty frames makes the pivot change its position when we calculate average.
			if (this.m_arrFrames[i].m_w > 0)
			{
				this.m_pivotX = this.m_pivotX + this.m_arrFrames[i].m_w;
				validFramesX++;
			}
			
			if (this.m_arrFrames[i].m_h > 0)
			{
				this.m_pivotY = this.m_pivotY + this.m_arrFrames[i].m_h;
				validFramesY++;
			}
		}
		
		if (validFramesX > 0)
			this.m_pivotX = Math.round(this.m_pivotX / 2 / validFramesX, 0);
		
		if (validFramesY > 0)
			this.m_pivotY = Math.round(this.m_pivotY / 2 / validFramesY, 0);
	}
	
	Animation.prototype.setPosition = function(_x, _y, _flip)
	{
		this.m_x = _x - (this.m_arrFrames[this.m_currentFrame].m_w / 2) + this.m_arrFrames[this.m_currentFrame].m_offsetX;// - this.m_pivotX;
		this.m_y = _y - (this.m_arrFrames[this.m_currentFrame].m_h / 2) + this.m_arrFrames[this.m_currentFrame].m_offsetY;// - this.m_pivotY;	
		this.m_flip = _flip;
		
		if (_flip === -1)
		{
			this.m_x = _x + (this.m_arrFrames[this.m_currentFrame].m_w / 2) - this.m_arrFrames[this.m_currentFrame].m_offsetX;
		}
	}

	Animation.prototype.setPosition = function(_x, _y)
	{
		this.m_x = _x;
		this.m_y = _y;
	}

	Animation.prototype.flipHorizontal = function(_value)
	{
		if (_value === true)
		{
			this.m_flip = -1;
		}
		else
		{
			this.m_flip = 1;
		}
	}
}
	
// Auxiliar class
function chAnimationFrame () 
{ 
	chAnimationFrame.prototype.initWith = function (_resource, _x1, _y1, _x2, _y2, _offsetX, _offsetY,_incX, _incY,_duration)
	{
		this.m_resource = _resource;

		this.m_x1 = _x1;
		this.m_y1 = _y1;
		this.m_x2 = _x2;
		this.m_y2 = _y2;
		
		this.m_offsetX = _offsetX;
		this.m_offsetY = _offsetY;
		
		this.m_w = this.m_x2 - this.m_x1;
		this.m_h = this.m_y2 - this.m_y1;

		this.m_incX = _incX;
		this.m_incY = _incY;
		
		this.m_duration = _duration;
	}
	
	chAnimationFrame.prototype.fLog = function () 
	{ 
		var logText = "chAnimationFrame: " +
		"m_resource=" + this.m_resource + ", " +
		"m_x1=" + this.m_x1 + ", " +
		"m_y1=" + this.m_y1 + ", " + 
		"m_x2=" + this.m_x2 + ", " + 
		"m_y2=" + this.m_y2 + ", " + 
		"m_offsetX=" + this.m_offsetX + ", " + 
		"m_offsetY=" + this.m_offsetY + ", " + 
		"m_incX=" + this.m_incX + ", " + 
		"m_incY=" + this.m_incY + ", " + 
		"m_duration=" + this.m_duration + "; "; 
		
		return logText;
	}  
}
