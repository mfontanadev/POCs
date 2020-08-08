ViewLadybug_menuPage.self = null;
ViewLadybug_menuPage.C_ANIM_HELP = 1000;

ViewLadybug_menuPage.C_STATE_NOT_SET = 0;
ViewLadybug_menuPage.C_STATE_SHOWING_HELP = 1;
ViewLadybug_menuPage.C_STATE_PLAYING = 2;
ViewLadybug_menuPage.C_STATE_FADING = 3;

function ViewLadybug_menuPage(_id, _viewManager) 
{ 
    // Internal not touchable variables.
	ViewLadybug_menuPage.self = this;
	this.m_id = _id;
	this.m_viewManager = _viewManager; 

    // Page variables
    this.m_spriteFactory = this.m_viewManager.getDataContext().m_spriteFactory; 
    this.m_gameState = ViewLadybug_menuPage.C_STATE_NOT_SET;
	this.m_ladybug = this.m_viewManager.getDataContext().m_ladybug;
    this.m_arrSprites = new Array();
    this.m_skyHeight = this.m_viewManager.m_canvasEx.m_canvas.width * 4;

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

    this.m_fade = new Fade();
    this.m_fade.initWith(20, "black");

    this.m_woodSignSprite = null;

};

ViewLadybug_menuPage.prototype.getPageName = function ()
{   
    return "ViewLadybug_menuPage";
}

ViewLadybug_menuPage.prototype.initialize = function ()
{   
    this.m_gameState = ViewLadybug_menuPage.C_STATE_SHOWING_HELP;

    // Create screen.
    this.m_arrSprites.push(this.m_spriteFactory.createTextTitleSprite());
    this.m_arrSprites.push(this.m_spriteFactory.createGrassSprite());
    this.m_arrSprites.push(this.m_spriteFactory.createLogSprite(true));
    this.m_woodSignSprite = this.m_spriteFactory.createWoodSignSprite(); 
  
    // Start help animation.
    this.m_helpAnimation.setPosition(
        this.m_viewManager.m_canvasEx.m_canvas.width / 1.4,
        this.m_viewManager.m_canvasEx.m_canvas.height / 1.8);
    this.m_helpAnimation.reset();
    this.m_helpAnimation.start();

    viewMngr.getDataContext().setContextToANewGame();
}

ViewLadybug_menuPage.prototype.onEnterPage = function ()
{
    this.m_fade.reset();

    // Hero is alive.
    this.m_ladybug.reset();
    this.m_ladybug.forceAnimation_STAND();

    this.m_ladybug.m_cx = this.m_viewManager.m_canvasEx.m_canvas.width / 2;
    this.m_ladybug.m_cy = this.m_viewManager.m_canvasEx.m_canvas.height / 2.8;
    this.m_ladybug.setAutoflight(true);
};

ViewLadybug_menuPage.prototype.handleInputs = function ()
{
    if (this.m_gameState !== ViewLadybug_menuPage.C_STATE_FADING)
    {
        this.m_ladybug.handleInputs();
        
        if (this.m_ladybug.someInputHappen() === true)
            this.m_gameState = ViewLadybug_menuPage.C_STATE_PLAYING;
    }
};

ViewLadybug_menuPage.prototype.implementGameLogic = function ()
{
    if (this.m_gameState === ViewLadybug_menuPage.C_STATE_SHOWING_HELP)
    {
        this.m_helpAnimation.implementGameLogic();
    }

    this.implementSpritesLogic();

    // Avoid decreasing energy and avoid scroll.
    this.m_ladybug.applyEnergy(100);
    this.m_ladybug.setOffsetY(0);
    this.m_ladybug.implementGameLogic();

    if (this.m_gameState === ViewLadybug_menuPage.C_STATE_FADING)
    {
        this.m_fade.implementGameLogic();

        if (this.m_fade.isEnded() === true)
        {
            // Navigate to game page.
            viewMngr.navigateTo(ViewLadybug_context.C_PAGE_INTER_MISSION);
        }
    }
};

ViewLadybug_menuPage.prototype.render = function ()
{
    renderSky(this.m_viewManager, this.m_skyHeight, this.m_ladybug.getOffsetY());

    // Draw all sprites in collection of sprites.
    var rectTmp = new ChRect();
    this.m_arrSprites.forEach
    (e => 
    {
        drawImageFromObj(e)

        // Transform world rectangle to screen rectangle.
        rectangleMoveTo(e.collisionRectangle, e.screenX, e.screenY, rectTmp);

        if (C_RENDER_COLLISION_RECT === true)
            rendercollisionRectangle(e.context, rectTmp, 'magenta');
    });

    if (this.m_viewManager.getDataContext().m_bestTime > 0)
    {
        drawImageFromObj(this.m_woodSignSprite);
    }

    // Cherry tree type.
    var fm = this.m_viewManager.getFontManagerInstance();
    var cv = this.m_viewManager.m_canvasEx.m_canvas;
    var cx = this.m_viewManager.m_canvasEx.m_context;

    var text = "HELP LADYBUG";
    fm.drawTextScaled(
        cv, 
        cx, 
        text, 
        cv.width / 2 - fm.getTextWidthScaled(text, 0.35) / 2, 
        cv.height * 0.27, 
        null, 
        0.35, 
        0.35); 

    text = "TO DO THE BEST TIME";
    fm.drawTextScaled(
        cv, 
        cx, 
        text, 
        cv.width / 2 - fm.getTextWidthScaled(text, 0.35) / 2, 
        cv.height * 0.33, 
        null, 
        0.35, 
        0.35); 
    
    if (this.m_viewManager.getDataContext().m_bestTime > 0)
    {
        text = "BEST TIME" 
        fm.drawTextScaled(
            cv, 
            cx, 
            text, 
            this.m_woodSignSprite.screenX - fm.getTextWidthScaled(text, 0.33) / 2, 
            this.m_woodSignSprite.screenY - 90, 
            null, 
            0.33, 
            0.33); 

        text = this.m_viewManager.getDataContext().getTimeToString(this.m_viewManager.getDataContext().m_bestTime);
        fm.drawTextScaled(
            cv, 
            cx, 
            text, 
            this.m_woodSignSprite.screenX - fm.getTextWidthScaled(text, 0.55) / 2, 
            this.m_woodSignSprite.screenY - 30, 
            null, 
            0.55, 
            0.55); 

    }

    // At first input help must be hidden.
    if (this.m_gameState === ViewLadybug_menuPage.C_STATE_SHOWING_HELP)
    {
        this.m_helpAnimation.render(
            this.m_viewManager.m_canvasEx.m_canvas, 
            this.m_viewManager.m_canvasEx.m_context,
            0, 1, 0.6);
    }

    this.m_ladybug.render();

    if (this.m_gameState === ViewLadybug_menuPage.C_STATE_FADING)
    {
        this.m_fade.render(
            this.m_viewManager.m_canvasEx.m_canvas, 
            this.m_viewManager.m_canvasEx.m_context);
    }
};

ViewLadybug_menuPage.prototype.onLeavePage = function ()
{
    this.m_gameState = ViewLadybug_menuPage.C_STATE_PLAYING;
    

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
        if (this.m_ladybug.checkCollisionAlpha(e.collisionRectangle, e.image, e.scale, e.scale) === true)
        {
            this.m_ladybug.applyBranchCollision(e.energy_change)
            
            // If ladybug is over some walkable sprite (no matter which) 
            // stop flying and start walk animation.
            if (e.isAWalkingZone === true)
                this.m_ladybug.m_insideWalkingZone = true;
        }
    });

    if (this.m_viewManager.getDataContext().m_bestTime > 0)
    {
        this.m_woodSignSprite.screenX = this.m_woodSignSprite.worldX;
        this.m_woodSignSprite.screenY = this.m_viewManager.m_canvasEx.m_canvas.height - this.m_woodSignSprite.worldY;
    }
    
    // Transition to game page.
    if (this.m_ladybug.isInWalkingZone() === true && 
        this.m_ladybug.isAnimation_STAND() === true)
    {
        this.m_gameState = ViewLadybug_menuPage.C_STATE_FADING;
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


