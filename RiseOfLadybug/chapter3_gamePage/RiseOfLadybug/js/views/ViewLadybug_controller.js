// This class is the container for pages ViewLadybug_ types.
ViewLadybug_controller.self = null;

function ViewLadybug_controller() 
{ 
	ViewLadybug_controller.self = this;

	ViewLadybug_controller.prototype.initViewManager = function() 
	{
		document.title = Globals.C_APPLICATION_TITLE_AND_VERSION;

		// Create main view helper.
		viewMngr = new ViewManager(document, window);
		viewMngr.initCanvasById('idCanvas', false);
		viewMngr.enableProgressBarWhenLoadingResources(CanvasControl.C_THEME_TYPE_GREEN, 256, 38, "Tahoma Black", 16, "#FF0000");
	
		// Enable using bitmaps
		var bitmapManager = viewMngr.getBitmapManagerInstance();
		bitmapManager.setProgressBar(viewMngr.getProgressBar());
		bitmapManager.setProgressBarMessage("Loading bitmpas");
		bitmapManager.setFilenamesArray(global_bitmap_definition);
		bitmapManager.setAlphaCollition(document);
	
		// Enable using sounds
		var soundManager = viewMngr.getSoundManagerInstance();
		soundManager.setProgressBar(viewMngr.getProgressBar());
		soundManager.setProgressBarMessage("Loading sounds");
		soundManager.setFilenamesArray(global_sound_definition);
	
		// Do this after Canvas and Sound were created.
		viewMngr.initializeMouseManager();
	
		// Initialize keyboard functionality
		viewMngr.initializeKeyboardManager(true);

		// Initialize joystick functionality
		viewMngr.initializeJoystickManager(
			Globals.C_BUTTON_SIZE,
			Globals.C_BUTTON_RIGHT_KEY,
			Globals.C_BUTTON_UP_KEY,
			Globals.C_BUTTON_LEFT_KEY,
			Globals.C_BUTTON_DOWN_KEY,
			Globals.C_BUTTON_A_KEY,
			Globals.C_BUTTON_B_KEY,
			Globals.C_BUTTON_C_KEY
		);

		// Initialize default font functionality
		viewMngr.initializeFontManager(
			global_font_primary_definition.fontFile,  
			0,
			0,
			global_font_primary_definition.fontMap,
			global_font_primary_definition.fontCoords,
			global_font_primary_definition.fontPaddingX);
	
		// Load all resources and trigger (loaded or not) aplication setup. 
		viewMngr.performFullResourcesLoad(this.initViewManagerContext);
	};

	ViewLadybug_controller.prototype.initViewManagerContext = function() 
	{
		viewMngr.getProgressBar()._visible = false;

		msglog("--------------------------------appInitContext--------------------------------");
		msglog("bitmap manager available:" + viewMngr.m_bitmapManager.m_managerAvailable);
		msglog("sound manager available:" + viewMngr.m_soundManager.m_managerAvailable);
	
		var dataContext = new ViewLadybug_context();
		viewMngr.initializeDataContext(dataContext);
		viewMngr.initializepages();
	
		// Start animation loop.
		//viewMngr.navigateTo(ViewLadybug_context.C_PAGE_MENU);
		viewMngr.navigateTo(ViewLadybug_context.C_PAGE_MENU);
		viewMngr.animationCycle();	
	};
};

