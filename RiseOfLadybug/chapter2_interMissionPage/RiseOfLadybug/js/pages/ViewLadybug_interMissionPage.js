ViewLadybug_interMissionPage.self = null;

ViewLadybug_interMissionPage.C_STATE_NOT_SET = 0;
ViewLadybug_interMissionPage.C_STATE_ANIMATION = 1;
ViewLadybug_interMissionPage.C_STATE_FADING = 6;

function ViewLadybug_interMissionPage(_id, _viewManager) 
{ 
    // Internal not touchable variables.
	ViewLadybug_interMissionPage.self = this;
	this.m_id = _id;
	this.m_viewManager = _viewManager; 

    // Page variables
    this.m_gameState = ViewLadybug_interMissionPage.C_STATE_NOT_SET;
    this.m_skyHeight = this.m_viewManager.m_canvasEx.m_canvas.width * 4;

    this.m_fade = new Fade();
    this.m_fade.initWith(10, "black");
    this.m_fade.setWaitStepsBeforeEnd(15);

    this.m_flowers = new Array();
    this.m_stillAnimating = true;

    this.m_imageFlower = null;
    this.m_imageBranch = null;
    this.m_imageThumb = null;
};

ViewLadybug_interMissionPage.prototype.getPageName = function ()
{   
    return "ViewLadybug_interMissionPage";
}

ViewLadybug_interMissionPage.prototype.initialize = function ()
{   
    // Start help animation.
    this.m_gameState = ViewLadybug_interMissionPage.C_STATE_ANIMATION;

    // Generate random flowers.
    for (var i = 0; i < 8; i++)
    {
        this.m_flowers.push
        (
            {
                angleCounter: 0,
                frecuency: chRandomPISeed(5) + 5,
                amplitude: chRandomPISeed(20) + 10
            }
        );

        // The flower number 5 is used to slow down all animation.
        if (i === 5)
        {
            this.m_flowers[i].frecuency = 5;
        }
    }
}

ViewLadybug_interMissionPage.prototype.onEnterPage = function ()
{
    this.m_gameState = ViewLadybug_interMissionPage.C_STATE_ANIMATION;

    var imageName = "cherrytree_flower_" + this.m_viewManager.getDataContext().currentLevel().image + ".png";
    this.m_imageFlower =  this.m_viewManager.getBitmapManagerInstance().getImageByName(imageName);

    imageName = "cherrytree_thumb_" + this.m_viewManager.getDataContext().currentLevel().image + ".png";
    this.m_imageThumb =  this.m_viewManager.getBitmapManagerInstance().getImageByName(imageName);

    imageName = "cherrytree_branch_" + this.m_viewManager.getDataContext().currentLevel().image + ".png";
    this.m_imageBranch =  this.m_viewManager.getBitmapManagerInstance().getImageByName(imageName);

    this.m_flowers.forEach(e => {e.angleCounter = this.m_imageFlower.height * -1;});

    this.m_stillAnimating = true;

    this.m_fade.reset();
};

ViewLadybug_interMissionPage.prototype.handleInputs = function ()
{
    if ( this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_UP) ||
         this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_DOWN) ||
         this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_RIGHT) ||
         this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_LEFT) ||
         this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT))
    {
        this.m_gameState = ViewLadybug_interMissionPage.C_STATE_FADING;
    }
};

ViewLadybug_interMissionPage.prototype.implementGameLogic = function ()
{
    this.m_stillAnimating = false;

    // Increment angle counter for all flowers and
    // check if all flowers are beyond bottom of the screen.
    this.m_flowers.forEach(e => 
    {
        e.angleCounter += e.frecuency;
    
        if (e.angleCounter < this.m_viewManager.m_canvasEx.m_canvas.height * 1.25)
        {
            this.m_stillAnimating = true;
        }
    });

    if (this.m_stillAnimating === false)
    {
        this.m_gameState = ViewLadybug_interMissionPage.C_STATE_FADING;
    }

    if (this.m_gameState === ViewLadybug_interMissionPage.C_STATE_FADING)
    {
        this.m_fade.implementGameLogic();

        if (this.m_fade.isEnded() === true)
        {
            if (this.m_viewManager.getDataContext().levelsRemainig() !== 0)
            {
                this.m_viewManager.getDataContext().nextLevel();
            }
            else
            {
                // This will have sense when gamePage will be done.
                viewMngr.getDataContext().allLevelsFinished();

                viewMngr.getDataContext().setContextToANewGame();
            }
            viewMngr.navigateTo(ViewLadybug_context.C_PAGE_MENU);
        }
    }
};

ViewLadybug_interMissionPage.prototype.render = function ()
{
    // Clear background to black.
    renderRectangle(
        this.m_viewManager.m_canvasEx.m_context, 
        0, 
        0, 
        this.m_viewManager.m_canvasEx.m_canvas.width, 
        this.m_viewManager.m_canvasEx.m_canvas.height, 
        "black", 0, 0, 1)

    //this.renderSky();

    // Render level number and level name.
    this.drawInfo();

    // Render flowers.
    var posX = 0;
    var sin = 0;
    var column = 0;
    var rotation = 0;
    this.m_flowers.forEach( e =>
    {
        column++;
        sin = sinOf(e.amplitude, e.angleCounter);
        posX = (this.m_viewManager.m_canvasEx.m_canvas.width / this.m_flowers.length) * column;
        posX += sin;

        drawImage(
            this.m_viewManager.m_canvasEx.m_canvas, 
            this.m_viewManager.m_canvasEx.m_context, 
            this.m_imageFlower,
            posX,
            e.angleCounter,
            sin, 1, 0.5, 0, 0, 1);

    });

    // Anly render fade if we are in the current state.
    if (this.m_gameState === ViewLadybug_interMissionPage.C_STATE_FADING)
    {
        this.m_fade.render(
            this.m_viewManager.m_canvasEx.m_canvas, 
            this.m_viewManager.m_canvasEx.m_context);
    }
};

ViewLadybug_interMissionPage.prototype.onLeavePage = function ()
{
};

// ****************************************
// Custom page functions.
// ****************************************
ViewLadybug_interMissionPage.prototype.drawInfo = function ()
{
    var dc = this.m_viewManager.getDataContext();
    var fm = this.m_viewManager.getFontManagerInstance();
    var cv = this.m_viewManager.m_canvasEx.m_canvas;
    var cx = this.m_viewManager.m_canvasEx.m_context;

    // Level number.
    var text = "LEVEL " + (dc.currentLevel().id + 1);
    fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 1)), cv.height * 0.15, null, 1, 1); 

    var text = "Tot. TIME=" + dc.getTimeToString(dc.m_totalTime);
    fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.4)), cv.height * 0.20, null, 0.4, 0.4); 

    // Render cherry tree type thumbail.
    drawImage(
        this.m_viewManager.m_canvasEx.m_canvas, 
        this.m_viewManager.m_canvasEx.m_context, 
        this.m_imageThumb,
        this.m_viewManager.m_canvasEx.m_canvas.width / 2,
        this.m_viewManager.m_canvasEx.m_canvas.height * 0.35,
        0, 1, 0.7, 0, 0, 1);

    // Cherry tree type.
    //var text = "CHERRY TREE";
    //fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.3)), cv.height * 0.30, null, 0.3, 0.3); 
    
    // Cherry tree type name.
    text = dc.currentLevel().name.toUpperCase();
    fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.3)), cv.height * 0.50, null, 0.3, 0.3); 



    drawImage(
        this.m_viewManager.m_canvasEx.m_canvas, 
        this.m_viewManager.m_canvasEx.m_context, 
        this.m_imageBranch,
        this.m_viewManager.m_canvasEx.m_canvas.width * 0.5,
        this.m_viewManager.m_canvasEx.m_canvas.height * 0.65,
        0, 1, 0.7, 0, 0, 1);
    text = "=" + dc.getEnergyPercent(dc.currentLevel().branchEnergy).toString() + " ENERGY";
    fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.3)), cv.height * 0.75, null, 0.3, 0.3); 

    drawImage(
        this.m_viewManager.m_canvasEx.m_canvas, 
        this.m_viewManager.m_canvasEx.m_context, 
        this.m_imageFlower,
        this.m_viewManager.m_canvasEx.m_canvas.width * 0.5,
        this.m_viewManager.m_canvasEx.m_canvas.height * 0.85,
        0, 1, 0.5, 0, 0, 1);

    text = "=" + dc.getEnergyPercent(dc.currentLevel().fallingFlowerEnergy).toString() + " ENERGY";
    fm.drawTextScaled(cv, cx, text, getCenter(cv.width, fm.getTextWidthScaled(text, 0.3)), cv.height * 0.95, null, 0.3, 0.3); 
}
