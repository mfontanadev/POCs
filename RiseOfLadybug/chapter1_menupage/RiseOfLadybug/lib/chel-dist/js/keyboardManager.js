// Class KeyboardManager:
//    Perform callback on key press.

KeyboardManager.self = null;

// Constants for jeyboard
var C_DIR_RIGHT = 1;
var C_DIR_UP = 2;
var C_DIR_LEFT = 4;
var C_DIR_DOWN = 8;

var C_KEY_RIGHT = 39;
var C_KEY_UP = 38;
var C_KEY_LEFT = 37;
var C_KEY_DOWN = 40;
var C_KEY_RETURN = 13;
var C_KEY_SPACE = 32;
var C_KEY_SHIFT = 16;
var C_KEY_CTRL = 17;
var C_KEY_ALT = 18;
var C_KEY_DELETE = 46;
var C_KEY_BACKSPACE = 8;
var C_KEY_INSERT = 45;

var C_KEY_CHAR_A = 65;
var C_KEY_CHAR_S = 83;
var C_KEY_CHAR_D = 68;
var C_KEY_CHAR_W = 87;

var C_KEY_CHAR_F = 70;
var C_KEY_CHAR_G = 71;
var C_KEY_CHAR_H = 72;

var C_KEY_CHAR_J = 74;
var C_KEY_CHAR_K = 75;
var C_KEY_CHAR_L = 76;

var C_KEY_CHAR_C = 67;

var C_KEY_F1 = 112;
var C_KEY_F2 = 113;
var C_KEY_F3 = 114;
var C_KEY_F4 = 115;
var C_KEY_F5 = 116;
var C_KEY_F6 = 117;
var C_KEY_F7 = 118;
var C_KEY_F8 = 119;
var C_KEY_F9 = 120;
var C_KEY_F10 = 121;
var C_KEY_F11 = 122;
var C_KEY_F12 = 123;

var C_KEY_NUMBER_0 = 48;
var C_KEY_NUMBER_1 = 49;
var C_KEY_NUMBER_2 = 50;
var C_KEY_NUMBER_3 = 51;
var C_KEY_NUMBER_4 = 52;
var C_KEY_NUMBER_5 = 53;
var C_KEY_NUMBER_6 = 54;
var C_KEY_NUMBER_7 = 55;
var C_KEY_NUMBER_8 = 56;
var C_KEY_NUMBER_9 = 57;

var C_KEY_COLON = 188;
var C_KEY_DOT = 190;
var C_KEY_ADD = 187;
var C_KEY_MINUS = 189;

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

	KeyboardManager.prototype.showKeyboardMatrix = function (_canvas, _context) 
	{
		// Render KEYBOARD
		var x = 0;
		var y = 0;
		for (var i = 0; i < 256; i++) 
		{
			x = (i % 32) * 8 + 6;
			y = Math.floor(i / 32) * 8 + 24; 

			if (this.isKeyDown(i))
				renderCircle(_canvas, _context, x, y, 4, "#000000", null, 0, 0.5);
			else
				renderCircle(_canvas, _context, x, y, 4, "#000000", null, 0, 0.2);
		}
	}

	this.initDefault();
}