ViewLadybug_menuPage.self = null;
ViewLadybug_menuPage.C_ANIM_HELP = 1000;

function ViewLadybug_menuPage(_id, _viewManager) 
{ 
    // Internal not touchable variables.
	ViewLadybug_menuPage.self = this;
	this.m_id = _id;
	this.m_viewManager = _viewManager; 

    // Page variables
	this.m_ladybug = this.m_viewManager.getDataContext().m_ladybug;
    this.m_arrSprites = new Array();
    this.m_skyHeight = this.m_viewManager.m_canvasEx.m_canvas.width * 4;

    this.m_showHelp = true;
    this.m_helpAnimation = new Animation();
    this.m_helpAnimation.initWith(this, ViewLadybug_menuPage.C_ANIM_HELP, 0, 0);
    this.m_helpAnimation.setInfiniteLoop(true);
    addAnimationFrame(this.m_viewManager, this.m_helpAnimation, 'callout_keys_help1.png',  5);
    addAnimationFrame(this.m_viewManager, this.m_helpAnimation, 'callout_keys_help2.png',  5);
    addAnimationFrame(this.m_viewManager, this.m_helpAnimation, 'callout_keys_help1.png',  5);
    addAnimationFrame(this.m_viewManager, this.m_helpAnimation, 'callout_keys_help3.png',  5);
    addAnimationFrame(this.m_viewManager, this.m_helpAnimation, 'callout_keys_help1.png',  5);
    addAnimationFrame(this.m_viewManager, this.m_helpAnimation, 'callout_keys_help4.png',  5);
    addAnimationFrame(this.m_viewManager, this.m_helpAnimation, 'callout_keys_help1.png',  5);
    addAnimationFrame(this.m_viewManager, this.m_helpAnimation, 'callout_keys_help5.png',  5);
};

ViewLadybug_menuPage.prototype.getPageName = function ()
{   
    return "ViewLadybug_menuPage";
}

ViewLadybug_menuPage.prototype.initialize = function ()
{   
    console.log(this.getPageName());

    // Create screen.
    addSprite(this.m_viewManager, this.m_arrSprites, 0.50, this.m_viewManager.m_canvasEx.m_canvas.height * 0.80, 0.8, false, false, 0, false, "text_title.png");
    addSprite(this.m_viewManager, this.m_arrSprites, 0.50, 0, 1.0, false, false, 0, false, "grass.png");
    addSprite(this.m_viewManager, this.m_arrSprites, 0.50, 0, 0.3, false, false, 0, true, "log_play.png");
  
    // Start help animation.
    this.m_showHelp = true;
    this.m_helpAnimation.setPosition(
    this.m_viewManager.m_canvasEx.m_canvas.width / 1.4,
    this.m_viewManager.m_canvasEx.m_canvas.height / 2.1);
    this.m_helpAnimation.reset();
    this.m_helpAnimation.start();

    // Internal, not touch.
    this.createControls();
}

ViewLadybug_menuPage.prototype.createControls = function ()
{
};

ViewLadybug_menuPage.prototype.onEnterPage = function ()
{
    // Hero is alive.
    this.m_ladybug.m_cx = this.m_viewManager.m_canvasEx.m_canvas.width / 2;
    this.m_ladybug.m_cy = this.m_viewManager.m_canvasEx.m_canvas.height / 2.3;
    this.m_ladybug.setAutoflight(true);
};

ViewLadybug_menuPage.prototype.handleInputs = function ()
{
    this.m_ladybug.handleInputs();
    
    if (this.m_ladybug.someInputHappen() === true)
        this.m_showHelp = false;
};

ViewLadybug_menuPage.prototype.implementGameLogic = function ()
{
    this.m_helpAnimation.implementGameLogic();
    
    this.implementSpritesLogic();

    // Avoid decreasing energy and avoid scroll.
    this.m_ladybug.applyEnergy(100);
    this.m_ladybug.setOffsetY(0);
    this.m_ladybug.implementGameLogic();
};

ViewLadybug_menuPage.prototype.render = function ()
{
    this.renderSky();

    // Draw all sprites in collection of sprites.
    var rectTmp = new ChRect();
    this.m_arrSprites.forEach
    (e => 
    {
        drawImageFromObj(e)

        // Transform world rectangle to screen rectangle.
        rectangleMoveTo(e.collisionRectangle, e.screenX, e.screenY, rectTmp);

        //rendercollisionRectangle(e.canvas, e.context, rectTmp, 'blue');
    });

    // At first input help must be hidden.
    if (this.m_showHelp === true)
    {
        this.m_helpAnimation.render(
            this.m_viewManager.m_canvasEx.m_canvas, 
            this.m_viewManager.m_canvasEx.m_context,
            0, 1, 0.6);
    }

    this.m_ladybug.render();

    this.renderControls();

    this.drawTitle();
};

ViewLadybug_menuPage.prototype.renderControls = function ()
{
};

ViewLadybug_menuPage.prototype.btnBack_controller = function (_e, _sender)
{
};

ViewLadybug_menuPage.prototype.onLeavePage = function ()
{
    this.m_ladybug.endClosingAnimationEvent(this.m_ladybug); 
};

// ****************************************
// Custom page functions.
// ****************************************
ViewLadybug_menuPage.prototype.implementSpritesLogic = function ()
{
    this.m_ladybug.m_insideWalkingZone = false;

    this.m_arrSprites.forEach(e => 
    {
        // Transform from world to screen, translate offset of world canvas.height.
        // Then update collision rectangle according to the new position.
        e.screenX = e.worldX;
        e.screenY = this.m_viewManager.m_canvasEx.m_canvas.height - e.worldY;
        updateRectangleWithScale(e.image, e.worldX, e.worldY, e.scale, e.collisionRectangle);

        // If ladybug collide with sprites, check if it will be injured or care. 
        if (this.m_ladybug.checkCollision(e.collisionRectangle) === true)
        {
            this.m_ladybug.applyBranchCollision(e.energy_change)
            
            // If ladybug is over some walkable sprite (no matter which) 
            // stop flying and start walk animation.
            if (e.isAWalkingZone === true)
                this.m_ladybug.m_insideWalkingZone = true;
        }
    });

    // Transition to game page.
    if (this.m_ladybug.isInWalkingZone() === true && 
        this.m_ladybug.isAnimation_STAND() === true)
    {
        // Navigate to game page.
    }
}

ViewLadybug_menuPage.prototype.renderSky = function ()
{
    var cw = this.m_viewManager.m_canvasEx.m_canvas.width;
    var ch = this.m_viewManager.m_canvasEx.m_canvas.height;

    this.m_viewManager.m_canvasEx.m_context.save();
    var grd = this.m_viewManager.m_canvasEx.m_context.createLinearGradient(0, ((this.m_skyHeight + ch) * -1), 0, ch);

    grd.addColorStop(0, rgbaToColor(3, 12, 18, 1));
    grd.addColorStop(0.1, rgbaToColor(0, 0, 64, 1));
    grd.addColorStop(0.2, rgbaToColor(33, 122, 180, 1));
    grd.addColorStop(1, rgbaToColor(219, 248, 243, 1));

    // Fill with gradient
    this.m_viewManager.m_canvasEx.m_context.fillStyle = grd;
    this.m_viewManager.m_canvasEx.m_context.fillRect(0, 0, cw, ch)

    // Restore 
    this.m_viewManager.m_canvasEx.m_context.restore();
}


ViewLadybug_menuPage.prototype.drawTitle = function ()
{
}

