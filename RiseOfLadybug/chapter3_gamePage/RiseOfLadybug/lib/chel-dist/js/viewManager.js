ViewManager.self = null;

function ViewManager(_document, _window) 
{ 
	ViewManager.self = this;

	this.m_document = _document;
	this.m_window = _window;
	this.m_canvasEx = null;

	// Internal workflow
	this.m_appState = 0;
	this.m_refresh = true;

	// Auxiliar features 
	this.m_lblInfoControl = null;
	this.progressBarEnabled = false;
	this.m_hostname = getCurrentHostname(_window);
	console.log("HOST:" + this.m_hostname);
	
	// Frequency controler.
	this.m_startTime = 0;
	this.m_renderTime = -1;

	// Managers
	this.m_bitmapManager = null;
	this.m_keyboardManager = null;
	this.m_soundManager = null;
	this.m_mouseManager = null;
	this.m_fontManager = null;
	this.m_joystickManager = null;

	// Life cicle
	this.m_pages = new Array();
	this.m_currentPage = null;

	// Group global data.
	this.m_dataContext = null;

	this.m_counterFPS = 0;
	this.m_messageByTick = ""; 
	this.m_messageByCycle = "";

	this.redefinitionOfRequestAnimFrame();
}

// Redefinition of window.requestAnimFrame to apply fallback with setTimeout;
ViewManager.prototype.redefinitionOfRequestAnimFrame = function ()
{
	if (typeof this.m_window !== 'undefined' && this.m_window !== null)
	{
		this.m_window.requestAnimFrame = 
		(
			function(callback)
			{
				return 	ViewManager.self.m_window.requestAnimationFrame ||
						ViewManager.self.m_window.webkitRequestAnimationFrame ||
						ViewManager.self.m_window.mozRequestAnimationFrame ||
						ViewManager.self.m_window.oRequestAnimationFrame ||
						ViewManager.self.m_window.msRequestAnimationFrame ||
						function(callback)
						{
						  window.setTimeout(callback, 1);
						};
			}
		)
		();
	}
}

ViewManager.prototype.getBitmapManagerInstance = function ()
{
	if (this.isBitmapManagerCreated() === false)
	{
		this.m_bitmapManager = new BitmapManager();
	}

	return this.m_bitmapManager; 
};

ViewManager.prototype.isBitmapManagerCreated = function ()
{
	return (typeof this.m_bitmapManager !== 'undefined' && this.m_bitmapManager !== null);
}

ViewManager.prototype.loadBitmaps = function ()
{
	if (this.isBitmapManagerCreated() === true)
	{
		if (typeof this.m_lblInfoControl !== 'undefined' && this.m_lblInfoControl !== null)
		{
			this.m_bitmapManager.progressBarVisibility(this.progressBarEnabled);
			this.m_bitmapManager.performAsynchLoad(); 
		}
	}
};

ViewManager.prototype.getSoundManagerInstance = function ()
{
	if (this.isSoundManagerCreated() === false)
	{
		this.m_soundManager = new SoundManager();
	}

	return this.m_soundManager; 
};

ViewManager.prototype.isSoundManagerCreated = function ()
{
	return (typeof this.m_soundManager !== 'undefined' && this.m_soundManager !== null);
}

ViewManager.prototype.loadSounds = function ()
{
	if (this.isSoundManagerCreated() === true)
	{
		if (typeof this.m_lblInfoControl !== 'undefined' && this.m_lblInfoControl !== null)
		{
			this.m_soundManager.progressBarVisibility(this.progressBarEnabled);
			this.m_soundManager.performAsynchLoad(); 
		}
	}
};

ViewManager.prototype.performFullResourcesLoad = function (_callback)
{
	var _this = this;

	// 
	function triggerBitmapLoad()
	{
		if (_this.isBitmapManagerCreated() === true)
		{
			_this.m_bitmapManager.setOnLoadedEventListener
			(
				function()
				{
					triggerSoundLoad();
				}
			)

			_this.loadBitmaps();
		}
		else
		{
			_callback();
		}
	};

	// 
	function triggerSoundLoad()
	{
		if (_this.isSoundManagerCreated() === true)
		{
			_this.m_soundManager.setOnLoadedEventListener
			(
				function()
				{
					_callback();
				}
			)

			_this.loadSounds();
		}
		else
		{
			_callback();
		}
	};

	// Try to load Bitmaps in first place and then Sounds.
	// If Bitmaps are not initialized try to load Sounds.
	if (this.isBitmapManagerCreated() === true)
	{
		triggerBitmapLoad();
	}
	else
	{
		triggerSoundLoad();
	}
};

ViewManager.prototype.setContext = function (_appDataContext)
{
	this.m_appDataContext = _appDataContext;
};

ViewManager.prototype.enableProgressBarWhenLoadingResources = function (_theme, _width, _height, _fontFamily, _fontSize, _fontColor)
{
	if (this.m_canvasEx === null)
		return;

   	this.m_lblInfoControl = new CanvasControl();
	this.m_lblInfoControl.initLabelStyle(this.m_canvasEx, 
				getCenter(this.m_canvasEx.m_canvas.width, _width), 
				getCenter(this.m_canvasEx.m_canvas.height, _height), 
				_width, 
				_height, 
				"");
	this.m_lblInfoControl._fontSize = _fontSize;
	this.m_lblInfoControl._fontColor = _fontColor;
	this.m_lblInfoControl._fontFamily = _fontFamily;
	this.m_lblInfoControl.setTheme(_theme);
	this.m_lblInfoControl._visible = true;

	this.progressBarEnabled = true;
};

ViewManager.prototype.getProgressBar = function ()
{
	return this.m_lblInfoControl;
};

ViewManager.prototype.initCanvasById = function (_canvasId, _maxZoom)
{
	this.m_canvasEx = new ChCanvas(this.m_document, this.m_window);

	this.m_canvasEx.setCanvasById(_canvasId);

	if (_maxZoom === true)
	{
			this.m_canvasEx.setResizeMethodToMaxZoom();
	}
	
	this.m_canvasEx.enableOnResizeChange();
	this.m_canvasEx.performResize();
};

ViewManager.prototype.initializeMouseManager = function ()
{
	var result = true;  

	this.getMouseManagerInstance();

	try
	{
		this.m_mouseManager.initWithCanvasAndSound(this.m_canvasEx, this.m_soundManager);
	}
	catch (e)
	{
		msglog('ViewManager ERROR (initializeMouseManager). Exception = ' + e);
		result = false;
	}

	return result;
};

ViewManager.prototype.getMouseManagerInstance = function ()
{
	if (this.isMouseManagerCreated() === false)
	{
		this.m_mouseManager = new MouseManager();
	}

	return this.m_mouseManager; 
};

ViewManager.prototype.isMouseManagerCreated = function ()
{
	return (typeof this.m_mouseManager !== 'undefined' && this.m_mouseManager !== null);
}

ViewManager.prototype.initializeFontManager = function (_fontImage, _fontWidth, _fontHeight, _fontMap, _fontCoords, _fontPaddingX)
{
	var result = true;  

	this.getFontManagerInstance();
		
	try
	{
		this.m_fontManager.setFontImage(
			this.getBitmapManagerInstance(),
			_fontImage);

		this.m_fontManager.setWidthAndHeight(_fontWidth, _fontHeight);

		this.m_fontManager.setFontMap(_fontMap);

		this.m_fontManager.setFontCoords(_fontCoords);

		this.m_fontManager.setFontPaddingX(_fontPaddingX);
	}
	catch (e)
	{
		msglog('ViewManager ERROR (initializeFontManager). Exception = ' + e);
		result = false;
	}
	

	return result;
};

ViewManager.prototype.getFontManagerInstance = function ()
{
	if (this.isFontManagerCreated() === false)
	{
		this.m_fontManager = new FontManager();
	}

	return this.m_fontManager; 
};

ViewManager.prototype.isFontManagerCreated = function ()
{
	return (typeof this.m_fontManager !== 'undefined' && this.m_fontManager !== null);
};

ViewManager.prototype.initializeKeyboardManager = function (_eventPropagation)
{
	var result = true;  

	this.getKeyboardManagerInstance();

	try
	{
		this.m_keyboardManager.initWithDefaultCallbaks(_eventPropagation);
	}
	catch (e)
	{
		msglog('ViewManager ERROR (initializeKeyboardManager). Exception = ' + e);
		result = false;
	}

	return result;
};

ViewManager.prototype.getKeyboardManagerInstance = function ()
{
	if (this.isKeyboardManagerCreated() === false)
	{
		this.m_keyboardManager = new KeyboardManager();
	}

	return this.m_keyboardManager; 
};

ViewManager.prototype.isKeyboardManagerCreated = function ()
{
	return (typeof this.m_keyboardManager !== 'undefined' && this.m_keyboardManager !== null);
};



ViewManager.prototype.initializeJoystickManager = function (_buttonSize, bRight, _bUp, _bLeft, _bDown, _bA, _bB, _bC)
{
	var result = true;  

	this.getJoystickManagerInstance();

	try
	{
		this.m_joystickManager.initWith(this.m_canvasEx, _buttonSize, bRight, _bUp, _bLeft, _bDown, _bA, _bB, _bC);
	}
	catch (e)
	{
		msglog('ViewManager ERROR (initializeJoystickManager). Exception = ' + e);
		result = false;
	}

	return result;
};

ViewManager.prototype.getJoystickManagerInstance = function ()
{
	if (this.isJoystickManagerCreated() === false)
	{
		this.m_joystickManager = new JoystickManager();
	}

	return this.m_joystickManager; 
};

ViewManager.prototype.isJoystickManagerCreated = function ()
{
	return (typeof this.m_joystickManager !== 'undefined' && this.m_joystickManager !== null);
};




ViewManager.prototype.initializeDataContext = function (_dataContext)
{
	if (this.isDataContextCreated() === false)
	{
		this.m_dataContext = _dataContext;
		this.m_dataContext.initialize(this);
	}
};

ViewManager.prototype.isDataContextCreated = function ()
{
	return (typeof this.m_dataContext !== 'undefined' && this.m_dataContext !== null);
};

ViewManager.prototype.getDataContext = function ()
{
	return this.m_dataContext;
};

ViewManager.prototype.registerpages = function (_pages)
{
	this.m_pages = _pages; 
};

ViewManager.prototype.isPageArrayCreated = function ()
{
	return (typeof this.m_pages !== 'undefined' && this.m_pages !== null);
};

ViewManager.prototype.getPageByID = function (_id)
{
	var result = null;

	if (this.isPageArrayCreated() === true)
	{
		for (var i = this.m_pages.length - 1; i >= 0; i--) 
		{
			if (this.m_pages[i].m_id === _id)
			{
				result = this.m_pages[i];
				break;
			}
		}
	}

	return result;
};

ViewManager.prototype.setCurrentPageByID = function (_id)
{
	this.m_currentPage = this.getPageByID(_id);
};

ViewManager.prototype.getCurrentPage = function ()
{
	return this.m_currentPage;
};

ViewManager.prototype.isCurrentPageValid = function ()
{
	return (typeof this.m_currentPage !== 'undefined' && this.m_currentPage !== null);
};

ViewManager.prototype.navigateTo = function (_id)
{
	if (this.isCurrentPageValid() === true)
		this.getCurrentPage().onLeavePage();
	
	this.setCurrentPageByID(_id);

	if (this.isCurrentPageValid() === true)
	{
		msglog("ENTER TO: " + this.getCurrentPage().getPageName());
		this.getCurrentPage().onEnterPage();
	}
};

ViewManager.prototype.initializepages = function ()
{
	emptyArray(this.m_pages);

	var pages = this.m_dataContext.createpages();
	this.registerpages(pages);

	for (var i = 0; i < this.m_pages.length; i++) 
	{
		this.m_pages[i].initialize();
	}
};


ViewManager.prototype.animationCycle = function ()
{
	var elapsedTime = (this.m_currentDate - this.m_startTime);
	var timerFrec = (Date.now() - this.m_currentDate);

	// updates
	if (this.updateTimer() === true)
	{
		this.m_counterFPS++;

		// handle inputs
		this.handleInputs();

		// game logic
		this.implementGameLogic();

		// render
		this.render();

		this.m_messageByCycle = "FPS=" + Math.round(1000 / elapsedTime, 2) + ", Cycle (ms)=" + Math.round(elapsedTime, 2);
	}

	// log
	if (C_LOG === true)
	{
		this.m_messageByTick = "Timer (ms)=" + Math.round(timerFrec, 2) + ", ";
		this.m_messageByTick += 'MP=' + Math.round(this.m_mouseManager.m_mousePosX,0) + ',' + Math.round(this.m_mouseManager.m_mousePosY, 0) + "," + this.m_mouseManager.m_mouseClick;
		writeMessage(this.m_canvasEx.m_context, this.m_messageByTick, 4, 16, 12, "Calibri", "white", "black", C_DEBUG_MODE);
		writeMessage(this.m_canvasEx.m_context, this.m_messageByCycle, 4, 32, 12, "Calibri", "white", "black", C_DEBUG_MODE);
	}

	// Request new animation cycle.
	requestAnimFrame
	(
		function() 
		{
			ViewManager.self.animationCycle(); 
		}
	);
};


// Update timer.
ViewManager.prototype.updateTimer = function ()
{
	var result = false;
	this.m_currentDate = Date.now();
	
	if ((this.m_currentDate - this.m_startTime) >= C_FPS_MS)
	{
		this.m_startTime = this.m_currentDate;
		result = true;
	}

	return result;	
}

ViewManager.prototype.handleInputs = function ()
{
	this.getKeyboardManagerInstance().implementGameLogic();
	
	if (this.isJoystickManagerCreated() === true)
	{
		this.getJoystickManagerInstance().implementGameLogic(
			this.getKeyboardManagerInstance(),
			this.getMouseManagerInstance());
	}

	this.getCurrentPage().handleInputs();
};

ViewManager.prototype.implementGameLogic = function ()
{
	this.getCurrentPage().implementGameLogic();
};

ViewManager.prototype.render = function ()
{
	// clear
	if (this.m_refresh === true)
	{
        this.m_canvasEx.m_context.clearRect(0, 0, this.m_canvasEx.m_canvas.width, this.m_canvasEx.m_canvas.height);
        renderRectangle(this.m_canvasEx.m_context, 0,0, this.m_canvasEx.m_canvas.width, this.m_canvasEx.m_canvas.height, null, "#000000", 1, 1);
		this.getCurrentPage().render();

		if (this.isJoystickManagerCreated() === true)
		{
			this.getJoystickManagerInstance().render();	
		}
	}

	this.m_refresh = true;
};

ViewManager.prototype.onRefresh = function ()
{
	this.m_refresh = true;
}