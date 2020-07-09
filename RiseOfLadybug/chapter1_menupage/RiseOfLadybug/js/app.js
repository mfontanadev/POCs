// Super global object to access all views flows and its data.
var viewMngr = null;

window.onload = function()
{
	var controller = new ViewLadybug_controller();
	controller.initViewManager();
};
