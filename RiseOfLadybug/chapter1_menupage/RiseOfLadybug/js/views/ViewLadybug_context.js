// This class stores all pages related to the parent view.
ViewLadybug_context.self = null;

// pages CONSTANTS
ViewLadybug_context.C_PAGE_MENU = 0;

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
	};

	ViewLadybug_context.prototype.createpages = function ()
	{
		// Create page objetcs and hold them in parent view.
		var result = new Array();

		result.push(new ViewLadybug_menuPage(ViewLadybug_context.C_PAGE_MENU, this.m_viewManager));
       
		return result;
	};

	this.initDefault();
};

