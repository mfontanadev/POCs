ViewLadybug_creditsPage.self = null;

ViewLadybug_creditsPage.C_STATE_NOT_SET = 0;
ViewLadybug_creditsPage.C_STATE_ANIMATION = 1;
ViewLadybug_creditsPage.C_STATE_FADING = 6;

function ViewLadybug_creditsPage(_id, _viewManager) 
{ 
    // Internal not touchable variables.
	ViewLadybug_creditsPage.self = this;
	this.m_id = _id;
	this.m_viewManager = _viewManager; 

    // Page variables
    this.m_gameState = ViewLadybug_creditsPage.C_STATE_NOT_SET;
    this.m_skyHeight = this.m_viewManager.m_canvasEx.m_canvas.width * 4;
    this.m_spriteFactory = this.m_viewManager.getDataContext().m_spriteFactory; 
    this.m_arrSprites = new Array();

    this.m_fade = new Fade();
    this.m_fade.initWith(10, "black");

    this.m_altitude = 0;
};

ViewLadybug_creditsPage.prototype.getPageName = function ()
{   
    return "ViewLadybug_creditsPage";
}

ViewLadybug_creditsPage.prototype.initialize = function ()
{   
    // Start help animation.
    this.m_gameState = ViewLadybug_creditsPage.C_STATE_ANIMATION;
}

ViewLadybug_creditsPage.prototype.onEnterPage = function ()
{
    this.m_gameState = ViewLadybug_creditsPage.C_STATE_ANIMATION;

    this.m_altitude = 0;

    // Create entire map.
    this.createLevel();

    this.m_fade.reset();
};

ViewLadybug_creditsPage.prototype.handleInputs = function ()
{
    if ( this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_UP) ||
         this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_DOWN) ||
         this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_RIGHT) ||
         this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_LEFT) ||
         this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT))
    {
        this.m_gameState = ViewLadybug_creditsPage.C_STATE_FADING;
    }
};

ViewLadybug_creditsPage.prototype.implementGameLogic = function ()
{
    this.m_altitude = this.m_altitude + 4;

    this.implementSpritesLogic();

    if (this.m_gameState === ViewLadybug_creditsPage.C_STATE_ANIMATION &&
        this.m_altitude >= this.m_skyHeight)
    {
        this.m_gameState = ViewLadybug_creditsPage.C_STATE_FADING;
    }

    if (this.m_gameState === ViewLadybug_creditsPage.C_STATE_FADING)
    {
        this.m_fade.implementGameLogic();

        if (this.m_fade.isEnded() === true)
        {
            viewMngr.navigateTo(ViewLadybug_context.C_PAGE_MENU);
        }
    }
};

ViewLadybug_creditsPage.prototype.render = function ()
{
    // Clear background to black.
    renderRectangle(
        this.m_viewManager.m_canvasEx.m_context, 
        0, 
        0, 
        this.m_viewManager.m_canvasEx.m_canvas.width, 
        this.m_viewManager.m_canvasEx.m_canvas.height, 
        "black", 0, 0, 1)

    renderSky(this.m_viewManager, this.m_skyHeight, this.m_altitude);

    // Draw all sprites in the array.
    var rectTmp = new ChRect();
    this.m_arrSprites.forEach(e => 
    {
        e.render();
        
        if (C_RENDER_COLLISION_RECT === true)
            e.renderCollitionRectangle();
    });
        
    // Render level number and level name.
    this.drawInfo();

    // Only render fade if we are in the current state.
    if (this.m_gameState === ViewLadybug_creditsPage.C_STATE_FADING)
    {
        this.m_fade.render(
            this.m_viewManager.m_canvasEx.m_canvas, 
            this.m_viewManager.m_canvasEx.m_context);
    }
};

ViewLadybug_creditsPage.prototype.onLeavePage = function ()
{
};

// ****************************************
// Custom page functions.
// ****************************************
ViewLadybug_creditsPage.prototype.createLevel = function ()
{
    emptyArray(this.m_arrSprites);

    // Logic for auto generate the level. 
    var totalHeight = this.m_viewManager.m_canvasEx.m_canvas.height * 1.1;
    var deltaOffset = 0;
    var sprite = null;

    // Stack images until reach sky limit.
    while (totalHeight < this.m_skyHeight)
    {
        deltaOffset = 0.5;
       
        sprite = this.m_spriteFactory.createFallingFlowerSprite(
            this.m_viewManager.getDataContext().getLevelsDefinition()[0].image, 
            0.5, 
            totalHeight);
        this.m_arrSprites.push(sprite);

        totalHeight = totalHeight + 300;
    }
}

ViewLadybug_creditsPage.prototype.implementSpritesLogic = function ()
{
    this.m_arrSprites.forEach(e => 
    {
        e.transformWorldToScreen(   this.m_viewManager.m_canvasEx.m_canvas.width, 
                                    this.m_viewManager.m_canvasEx.m_canvas.height);
        e.rotation = e.rotation + 1;
        e.m_screenY = e.m_screenY + this.m_altitude;
    });
}

ViewLadybug_creditsPage.prototype.drawInfo = function ()
{
    var fm = this.m_viewManager.getFontManagerInstance();
    var cv = this.m_viewManager.m_canvasEx.m_canvas;
    var cx = this.m_viewManager.m_canvasEx.m_context;
    
    var posY = 0; 
    var text = "";
    var spriteIndex = 0;

    // Line 1: thanks.
    text = "THANK YOU";
    posY = this.m_arrSprites[spriteIndex].m_screenY - this.m_arrSprites[spriteIndex].m_image.height / 2;
    fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.5)), posY, null, 0.5, 0.5); 
    spriteIndex++;

    // Line 2: total time.
    text = this.m_viewManager.getDataContext().getTimeToString(this.m_viewManager.getDataContext().m_totalTime);
    posY = this.m_arrSprites[spriteIndex].m_screenY - this.m_arrSprites[spriteIndex].m_image.height / 2;
    fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 1)), posY, null, 1, 1); 
    spriteIndex++;

    text = "LADYBUG TIME WAS";
    posY = posY - fm.getCharHeightScaled(" ", 1) * 2.5;
    fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.5)), posY, null, 0.5, 0.5); 

    // Line 3: show Guinness time.
    if (this.m_viewManager.getDataContext().isGuinnessTime() === true)
    {
        text = "CONGRATULATIONS";
        posY = this.m_arrSprites[spriteIndex].m_screenY - this.m_arrSprites[spriteIndex].m_image.height / 2;
        fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.5)), posY, null, 0.5, 0.5); 

        text = "BEST TIME";
        posY = posY - fm.getCharHeightScaled(" ", 0.4) * 2.5;
        fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.4)), posY, null, 0.4, 0.4); 
    
        spriteIndex++;
    }

    // Line 4: show credits.
    text = "MFONTANADEV";
    posY = this.m_arrSprites[spriteIndex].m_screenY - this.m_arrSprites[spriteIndex].m_image.height / 2;
    fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.5)), posY, null, 0.5, 0.5); 

    text = "PROGRAMMER AND ALL";
    posY = posY - fm.getCharHeightScaled(" ", 0.4) * 2.5;
    fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.4)), posY, null, 0.4, 0.4); 
}
