// Class JoystickManager:
//    Shows control buttons on top layer for mobile devices.

// +---------------------------
// +                          + 
// +    U                     +
// +  L   R        A  B  C    +
// +    D                     +
// +                          + 
// +---------------------------

var C_BUTTON_RIGHT = 1;
var C_BUTTON_UP = 2;
var C_BUTTON_LEFT = 4;
var C_BUTTON_DOWN = 8;

var C_BUTTON_A = 16;	// Jump
var C_BUTTON_B = 32;	// Protect
var C_BUTTON_C = 64;	// Punch

var C_BUTTON_SHOW = -1;	

JoystickManager.self = null;

function JoystickManager()
{
	JoystickManager.self = this;
	
	JoystickManager.prototype.initDefault = function ()
	{
		this.m_showJoystickButtonHitted = 0;
		this.m_pressedButton = 0;
		this.m_buttons = [];
		this.m_canvasEx = null;	

		this.C_BUTTON_SIZE = 20;

		this.C_BUTTON_RIGHT_KEY = C_KEY_RIGHT;
		this.C_BUTTON_UP_KEY = C_KEY_UP;
		this.C_BUTTON_LEFT_KEY = C_KEY_LEFT;
		this.C_BUTTON_DOWN_KEY = C_KEY_DOWN;
		
		this.C_BUTTON_A_KEY = C_KEY_CHAR_J;
		this.C_BUTTON_B_KEY = C_KEY_CHAR_K;
		this.C_BUTTON_C_KEY = C_KEY_CHAR_L;

		C_DEBUG_SHOW_JOYSTICK = isMobile();
	}
	
	JoystickManager.prototype.initWith = function (_canvasEx, _buttonSize, bRight, _bUp, _bLeft, _bDown, _bA, _bB, _bC)
	{
		this.C_BUTTON_SIZE = _buttonSize;

		this.C_BUTTON_RIGHT_KEY = bRight;
		this.C_BUTTON_UP_KEY = _bUp;
		this.C_BUTTON_LEFT_KEY = _bLeft;
		this.C_BUTTON_DOWN_KEY = _bDown;
		
		this.C_BUTTON_A_KEY = _bA;
		this.C_BUTTON_B_KEY = _bB;
		this.C_BUTTON_C_KEY = _bC;

		this.m_canvasEx = _canvasEx;
		var button = null;
		var horizon = (this.m_canvasEx.m_canvas.height * 0.90);
		var newSize = this.C_BUTTON_SIZE * 2;
		
		button = new chButton(); 
		button.initWith(newSize * 3,horizon, C_BUTTON_RIGHT, 	this.C_BUTTON_SIZE, rgbaToColor(128,128,128, .5), this.C_BUTTON_RIGHT_KEY);
		this.m_buttons.push(button);

		button = new chButton(); 
		button.initWith(newSize * 2,horizon - newSize, C_BUTTON_UP, this.C_BUTTON_SIZE, rgbaToColor(128,128,128, .5), this.C_BUTTON_UP_KEY);
		this.m_buttons.push(button);

		button = new chButton(); 
		button.initWith(newSize * 1,horizon , C_BUTTON_LEFT, this.C_BUTTON_SIZE, rgbaToColor(128,128,128, .5), this.C_BUTTON_LEFT_KEY);
		this.m_buttons.push(button);

		button = new chButton(); 
		button.initWith(newSize * 2,horizon + newSize, C_BUTTON_DOWN, this.C_BUTTON_SIZE, rgbaToColor(128,128,128, .5), this.C_BUTTON_DOWN_KEY);
		this.m_buttons.push(button);

		button = new chButton(); 
		button.initWith(this.m_canvasEx.m_canvas.width - newSize * 3, horizon, C_BUTTON_A, this.C_BUTTON_SIZE, rgbaToColor(255,0,0, .5), this.C_BUTTON_A_KEY);
		this.m_buttons.push(button);

		button = new chButton(); 
		button.initWith(this.m_canvasEx.m_canvas.width - newSize * 2, horizon, C_BUTTON_B, 	this.C_BUTTON_SIZE, rgbaToColor(0,255,0, .5), this.C_BUTTON_B_KEY);
		this.m_buttons.push(button);

		button = new chButton(); 
		button.initWith(this.m_canvasEx.m_canvas.width - newSize * 1, horizon, C_BUTTON_C, 	this.C_BUTTON_SIZE, rgbaToColor(0,0,255, .5), this.C_BUTTON_C_KEY);
		this.m_buttons.push(button);

		button = new chButton(); 
		button.initWith(this.m_canvasEx.m_canvas.width / 2, this.m_canvasEx.m_canvas.height / 2, this.C_BUTTON_SHOW, this.C_BUTTON_SIZE * 5, rgbaToColor(0,0,255, .5), 0);
		this.m_buttons.push(button);
	}
	
	JoystickManager.prototype.implementGameLogic = function (_keyboardMngr, _mouseMngr)
	{
		//var mouseActive = (_mouseMngr.m_bitmapManager !== 'undefined' && _mouseMngr !== null);
		var mouseActive = _mouseMngr.m_mouseClick;

		this.m_pressedButton = 0;
		for (var i = 0; i < this.m_buttons.length - 1; i++) 
		{
			if (mouseActive == true)
			{
				if (this.m_buttons[i].collision(_mouseMngr.m_mousePosX, _mouseMngr.m_mousePosY, 1, 1))
				{
					this.m_pressedButton = this.m_pressedButton | this.m_buttons[i].m_type;
					_keyboardMngr.keyDown(this.m_buttons[i].m_keyScanCode);	
					this.m_buttons[i].m_pressed = true;
				}
			}
			else
			{
				if (this.m_buttons[i].m_pressed == true)
				{
					this.m_buttons[i].m_pressed = false;
					_keyboardMngr.keyUp(this.m_buttons[i].m_keyScanCode);	
				}
			}
		}

		// If we hit three times the show button then change status.
		var centerButtonIndex = this.m_buttons.length - 1;
		if (mouseActive == true)
		{
			if (this.m_buttons[centerButtonIndex].collision(_mouseMngr.m_mousePosX, _mouseMngr.m_mousePosY, 1, 1))
			{
				this.m_pressedButton = this.m_pressedButton | this.m_buttons[centerButtonIndex].m_type;
				this.m_buttons[centerButtonIndex].m_pressed = true;
			}
		}
		else
		{
			if (this.m_buttons[centerButtonIndex].m_pressed == true)
			{
				this.m_buttons[centerButtonIndex].m_pressed = false;
				this.m_showJoystickButtonHitted++;
				if (this.m_showJoystickButtonHitted === 3)
				{
					this.m_showJoystickButtonHitted = 0;
					C_DEBUG_SHOW_JOYSTICK = !C_DEBUG_SHOW_JOYSTICK;
				}
			}
		}
	}

	JoystickManager.prototype.isPressed = function (_buttonId)
	{
		return (this.m_pressedButton & _buttonId);
	}
	
	JoystickManager.prototype.render = function ()
	{
		if (C_DEBUG_SHOW_JOYSTICK === true)
		{
			// The -1 value avoid render show button.
			for (var i = 0; i < this.m_buttons.length - 1; i++) 
			{
				renderCircle(this.m_canvasEx.m_context, 
							this.m_buttons[i].m_x,  this.m_buttons[i].m_y, 
							this.m_buttons[i].m_size, this.m_buttons[i].m_color, null, null, 1);
			}
		}
	}

	JoystickManager.prototype.fLog = function () 
	{ 
		var logText = "chKeyboard: " + "; "; 
		
		return logText;
	}  

	JoystickManager.prototype.buttonDown = function (_scanCode) 
	{ 
	}  

	JoystickManager.prototype.buttonUp = function (_scanCode) 
	{ 
	}  
	
	JoystickManager.prototype.disableButtonDownAWhile = function (_scanCode, _waitMilis) 
	{ 
	}  

	JoystickManager.prototype.reset = function () 
	{ 
	}  

	this.initDefault();
}

function chButton() 
{ 
	chButton.prototype.initWith = function (_x, _y, _type, _size, _color, _scanCode)
	{
		this.m_x = _x ;
		this.m_y = _y ;
		this.m_type = _type;
		this.m_size = _size;
		this.m_color = _color;
		this.m_keyScanCode = _scanCode;
		this.m_pressed = false;
	}

	chButton.prototype.collision = function (_x, _y, _scX, _scY)
	{
		var dx = ((this.m_x * _scX) - _x);
		var dy = ((this.m_y * _scY) - _y);
		var d = Math.sqrt(dx * dx + dy * dy);
	
		if (d <= this.m_size)
			return true;
		else
			return false;
	}
}