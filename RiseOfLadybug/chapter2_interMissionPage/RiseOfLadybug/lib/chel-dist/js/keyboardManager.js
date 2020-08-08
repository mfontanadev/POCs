// Class KeyboardManager:
//    Perform callback on key press.

KeyboardManager.self = null;

function KeyboardManager()
{
	KeyboardManager.self = this;

	KeyboardManager.prototype.initDefault = function ()
	{
		msglog('INIT KEYBOARD:initDefault');
		
		KeyboardManager.self = this;

		this.m_arrKeys = [];
		this.m_arrWait = [];
		this.m_eventPropagation = true;

		this.m_managerAvailable = true;

		this.m_eventListenersAdded = false;

		this.reset();
	};

	KeyboardManager.prototype.initWithDefaultCallbaks = function (_eventPropagation)
	{
		msglog('INIT KEYBOARD:initWithDefaultCallbaks');
		
		KeyboardManager.self = this;

		this.initDefault();

		this.m_eventPropagation = _eventPropagation;

		if (this.m_eventListenersAdded === false)
		{
			document.onkeydown = function(event) 
			{
				KeyboardManager.self.keyDown(event.keyCode);

				return KeyboardManager.self.m_eventPropagation;
			};
			
			document.onkeyup = function(event) 
			{
				KeyboardManager.self.keyUp(event.keyCode);

				return KeyboardManager.self.m_eventPropagation;
			}
		}
	};

	KeyboardManager.prototype.implementGameLogic = function ()
	{
		for (var i = 0; i < 256; i++) 
		{
			if (this.m_arrWait[i] > 0)
			{
				this.m_arrWait[i] = this.m_arrWait[i] - 1;
			
				if (this.m_arrWait[i] <= 0)
				{
					this.m_arrWait[i] = 0;
					this.m_arrKeys[i] = 0;
				}
			}
		}
	};

	KeyboardManager.prototype.keyDown = function (_scanCode) 
	{ 
		if (this.m_arrKeys[_scanCode] != -1 && this.m_arrKeys[_scanCode] != -2)
			this.m_arrKeys[_scanCode] = 1;
		
		this.processDebugOptions(_scanCode);
	};
	
	KeyboardManager.prototype.processDebugOptions = function (_scanCode) 
	{
        if (_scanCode == C_KEY_F9  && this.isKeyDown(C_KEY_SHIFT) === false)
        {
            C_LOG = !C_LOG;
            console.log("C_LOG=" + C_LOG);
        }

		if (_scanCode == C_KEY_F9 && this.isKeyDown(C_KEY_SHIFT) === true)
		{
			C_DEBUG_SHOW_LINES = !C_DEBUG_SHOW_LINES;
			C_RENDER_COLLISION_RECT = !C_RENDER_COLLISION_RECT;
            console.log("C_DEBUG_SHOW_LINES=" + C_DEBUG_SHOW_LINES);
            console.log("C_RENDER_COLLISION_RECT=" + C_RENDER_COLLISION_RECT);
		}

		if (_scanCode == C_KEY_F10)
		{
			C_DEBUG_SHOW_JOYSTICK = !C_DEBUG_SHOW_JOYSTICK;
            console.log("C_DEBUG_SHOW_JOYSTICK=" + C_DEBUG_SHOW_JOYSTICK);
		}
	};
	
	KeyboardManager.prototype.keyUp = function (_scanCode) 
	{ 
		if (this.m_arrKeys[_scanCode] != -1)
			this.m_arrKeys[_scanCode] = 0;
	};
	
	KeyboardManager.prototype.isKeyDown = function (_scanCode) 
	{
		return this.m_arrKeys[_scanCode] == 1;
	};

	KeyboardManager.prototype.disableKeyDownAWhile = function (_scanCode, _waitMilis) 
	{ 
		this.m_arrKeys[_scanCode] = -1;
		if (_waitMilis <= C_FPS_RENDER)
			this.m_arrWait[_scanCode] = 1;
		else
			this.m_arrWait[_scanCode] = Math.round(_waitMilis / C_FPS_RENDER, 0);
	};

	KeyboardManager.prototype.disableUntilKeyUp = function (_scanCode) 
	{ 
		this.m_arrKeys[_scanCode] = -2;
	};

	KeyboardManager.prototype.reset = function () 
	{ 
		for (var i = 0; i < 256; i++) 
		{
			this.m_arrKeys[i] = 0;
			this.m_arrWait[i] = 0;
		}
	};

	KeyboardManager.prototype.showKeyboardMatrix = function (_context) 
	{
		// Render KEYBOARD
		var x = 0;
		var y = 0;
		for (var i = 0; i < 256; i++) 
		{
			x = (i % 32) * 8 + 6;
			y = Math.floor(i / 32) * 8 + 24; 

			if (this.isKeyDown(i))
				renderCircle(_context, x, y, 4, "#000000", null, 0, 0.5);
			else
				renderCircle(_context, x, y, 4, "#000000", null, 0, 0.2);
		}
	}

	this.initDefault();
}