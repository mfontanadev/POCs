// This class stores all pages related to the parent view.
ViewLadybug_context.self = null;

// pages CONSTANTS
ViewLadybug_context.C_PAGE_MENU = 0;
ViewLadybug_context.C_PAGE_INTER_MISSION = 2;

function ViewLadybug_context() 
{ 
	ViewLadybug_context.self = this;

	ViewLadybug_context.prototype.initDefault = function() 
	{
		msglog('INIT CONTEXT:initDefault');
			
		ViewLadybug_context.self = this;

		this.m_viewManager = null;
	
		this.m_ladybug = null;
	};
		
	ViewLadybug_context.prototype.initialize = function (_viewManger)
	{
		msglog('INIT APP CONTEXT:initializeData');

		ViewLadybug_context.self = this;
		
		this.initDefault();

		// Data that is shared between all pages.
		this.m_viewManager = _viewManger;

        this.m_ladybug = new Ladybug();
		this.m_ladybug.initWithType(this.m_viewManager, Ladybug.C_LADYBUG_TYPE_WISHMASTER);
		this.m_currentLevelIndex = 0;

		this.m_spriteFactory = new SpriteFactory();
		this.m_spriteFactory.init(this.m_viewManager);
		this.m_totalTime = 0;
		this.m_bestTime = 0;
	};

	ViewLadybug_context.prototype.createpages = function ()
	{
		// Create page objetcs and hold them in parent view.
		var result = new Array();

		result.push(new ViewLadybug_menuPage(ViewLadybug_context.C_PAGE_MENU, this.m_viewManager));
		result.push(new ViewLadybug_interMissionPage(ViewLadybug_context.C_PAGE_INTER_MISSION, this.m_viewManager));
       
		return result;
	};

	ViewLadybug_context.prototype.setContextToANewGame = function ()
	{
		this.m_totalTime = 0;
		this.m_currentLevelIndex = 0;
	};

	ViewLadybug_context.prototype.getLevelsDefinition = function ()
	{
		return global_levels_definition;
	};

	ViewLadybug_context.prototype.currentLevel = function ()
	{
		return global_levels_definition[this.m_currentLevelIndex];
	};

	ViewLadybug_context.prototype.levelsRemainig = function ()
	{
		return (global_levels_definition.length - 1) - this.m_currentLevelIndex; 
	}

	ViewLadybug_context.prototype.nextLevel = function ()
	{
		if (this.levelsRemainig() !== 0)
		{
			this.m_currentLevelIndex++;
		}
	};

	ViewLadybug_context.prototype.getTimeToString = function (_time)
	{
		var seconds = Math.floor((_time / 1000)) % 60;
		var minutes = Math.floor(((_time / 1000) / 60)) % 60;
		return chLeftPad(minutes.toString(), "0", 2) + ":" + chLeftPad(seconds.toString(), "0", 2); 
	};

	ViewLadybug_context.prototype.getEnergyPercent = function (_energy)
	{
	    return Math.floor(_energy / Ladybug.C_MAX_ENERGY * 100);
	}  

	ViewLadybug_context.prototype.allLevelsFinished = function ()
	{
		if (this.isGuinnessTime() === true)
			this.m_bestTime = this.m_totalTime;
	}  

	ViewLadybug_context.prototype.isGuinnessTime = function ()
	{
		return (this.m_totalTime < this.m_bestTime || this.m_bestTime === 0);
	}

	this.initDefault();
};

