ViewLadybug_gamePage.self = null;
ViewLadybug_gamePage.C_ANIM_ENERGY_HELP = 1001;

ViewLadybug_gamePage.C_STATE_NOT_SET = 0;
ViewLadybug_gamePage.C_STATE_SHOWING_HELP = 1;
ViewLadybug_gamePage.C_STATE_PLAYING = 2;
ViewLadybug_gamePage.C_STATE_DIYING = 3;
ViewLadybug_gamePage.C_STATE_FINISHLINE_ANIMATION = 4;
ViewLadybug_gamePage.C_STATE_FADING_FROM_DYING = 5;
ViewLadybug_gamePage.C_STATE_FADING_FROM_LEVEL_COMPLETE = 6;

function ViewLadybug_gamePage(_id, _viewManager) 
{ 
    // Internal not touchable variables.
	ViewLadybug_gamePage.self = this;
	this.m_id = _id;
	this.m_viewManager = _viewManager; 

    // Page variables.
    this.m_spriteFactory = this.m_viewManager.getDataContext().m_spriteFactory; 
    this.m_gameState = ViewLadybug_gamePage.C_STATE_NOT_SET;
    this.m_ladybug = this.m_viewManager.getDataContext().m_ladybug;
    this.m_arrSprites = new Array();
    this.m_skyHeight = this.m_viewManager.m_canvasEx.m_canvas.height * 4;

    this.m_playingTime = 0;
    this.m_startPlayingTime = 0;
    this.m_performTimerUpdate = false;

    this.m_flowers = new Array();

    // Config help animation.
    this.m_helpAnimation = new Animation();
    this.m_helpAnimation.initWith(this, ViewLadybug_gamePage.C_ANIM_ENERGY_HELP, 0, 0);
    this.m_helpAnimation.setInfiniteLoop(true);
    addAnimationFrame(this.m_viewManager, this.m_helpAnimation, 'callout_energy_1.png',  15);
    addAnimationFrame(this.m_viewManager, this.m_helpAnimation, 'callout_energy_2.png',  15);

    // Fade effect.
    this.m_fade = new Fade();
    this.m_fade.initWith(10, "black");
    this.m_fade.setWaitStepsBeforeEnd(15);
};

ViewLadybug_gamePage.prototype.getPageName = function ()
{   
    return "ViewLadybug_gamePage";
}

ViewLadybug_gamePage.prototype.initialize = function ()
{   
    // Start help animation.
    this.m_gameState = ViewLadybug_gamePage.C_STATE_SHOWING_HELP;
    this.m_helpAnimation.setPosition(
        this.m_viewManager.m_canvasEx.m_canvas.width / 1.4, 
        this.m_viewManager.m_canvasEx.m_canvas.height - 140);
    this.m_helpAnimation.reset();
    this.m_helpAnimation.start();
}

ViewLadybug_gamePage.prototype.onEnterPage = function ()
{
    // Create entire map.
    this.createLevel();

    // Set index of random generator to his initial position
    // because if player died and start again the level the index
    // keep creasing.
    chResetRandomPISeed();

    // Set fade to initial position.
    this.m_fade.reset();

    // Hero is alive.
    this.m_ladybug.reset();
    this.m_ladybug.forceAnimation_STAND();
    this.m_ladybug.setAutoflight(true);
    this.m_ladybug.m_cx = this.m_viewManager.m_canvasEx.m_canvas.width / 2;
    this.m_ladybug.m_cy = 80;

    // Reset level.
    this.m_arrSprites.forEach(e => e.reset());

    // Reset timer.
    this.initTimer();
};

ViewLadybug_gamePage.prototype.handleInputs = function ()
{
    if (this.m_gameState === ViewLadybug_gamePage.C_STATE_PLAYING ||
        this.m_gameState === ViewLadybug_gamePage.C_STATE_SHOWING_HELP)
    {
        this.m_ladybug.handleInputs();

        if (this.m_ladybug.someInputHappen() === true)
        {
            if (this.m_performTimerUpdate === false)
            {
                this.initTimer();
                this.m_performTimerUpdate = true;
            }

            if (this.m_gameState === ViewLadybug_gamePage.C_STATE_SHOWING_HELP)
            {
                this.m_gameState = ViewLadybug_gamePage.C_STATE_PLAYING;
            }
        }
    }
};

ViewLadybug_gamePage.prototype.implementGameLogic = function ()
{
    // Only show help when state machine is in C_STATE_SHOWING_HELP
    if (this.m_gameState === ViewLadybug_gamePage.C_STATE_SHOWING_HELP)
    {
        this.m_helpAnimation.implementGameLogic();
    }

    this.m_ladybug.implementGameLogic();

    this.implementSpritesLogic();

    if (this.m_gameState === ViewLadybug_gamePage.C_STATE_PLAYING)
    {
        if (this.m_performTimerUpdate === true)
            this.updatePlayingTime();

        this.checkWinOrDeathCondition();
    }

    // If end level animation is finished then start fade animation.
    if (this.m_gameState === ViewLadybug_gamePage.C_STATE_FINISHLINE_ANIMATION && 
        this.m_ladybug.hasEndedFinishLineAnimation() === true)
    {
        this.m_gameState = ViewLadybug_gamePage.C_STATE_FADING_FROM_LEVEL_COMPLETE;
    }

    // Check if fade has finished. There are two cases for this
    // 1-When player die a fade effect start.
    // 2-When player win the level a fade effect start.
    if (this.m_gameState === ViewLadybug_gamePage.C_STATE_FADING_FROM_DYING ||
        this.m_gameState === ViewLadybug_gamePage.C_STATE_FADING_FROM_LEVEL_COMPLETE)
    {
        this.m_fade.implementGameLogic();

        if (this.m_fade.isEnded() === true)
        {
            if (this.m_gameState === ViewLadybug_gamePage.C_STATE_FADING_FROM_DYING)
            {
                this.m_gameState = ViewLadybug_gamePage.C_STATE_PLAYING;
                viewMngr.navigateTo(ViewLadybug_context.C_PAGE_FLYING);
            }
            else if (this.m_gameState === ViewLadybug_gamePage.C_STATE_FADING_FROM_LEVEL_COMPLETE)
            {
                this.m_gameState = ViewLadybug_gamePage.C_STATE_PLAYING;

                viewMngr.getDataContext().m_totalTime += this.m_playingTime;
                if (this.m_viewManager.getDataContext().levelsRemainig() !== 0)
                {
                    this.m_viewManager.getDataContext().nextLevel();
                    viewMngr.navigateTo(ViewLadybug_context.C_PAGE_INTER_MISSION);
                }
                else
                {
                    viewMngr.getDataContext().allLevelsFinished();
                    viewMngr.navigateTo(ViewLadybug_context.C_PAGE_CREDITS);
                }
            }
        }
    }
};

ViewLadybug_gamePage.prototype.checkWinOrDeathCondition = function ()
{
    // Win condition
    if (this.getAltitudePercent() >= 100 &&
        this.m_ladybug.isAnimation_DYING() === false) 
    {
        var sndId = this.m_viewManager.getSoundManagerInstance().getIdByName("finish.wav");
        this.m_viewManager.getSoundManagerInstance().play(sndId, false);

        this.m_gameState = ViewLadybug_gamePage.C_STATE_FINISHLINE_ANIMATION;
        this.m_ladybug.forceAnimation_FINISHLINE();
    }

    // Death condition.
    if (this.m_ladybug.isAlive() === false)
    {
        this.m_gameState = ViewLadybug_gamePage.C_STATE_FADING_FROM_DYING;
    }
}


ViewLadybug_gamePage.prototype.render = function ()
{
    renderSky(this.m_viewManager, this.m_skyHeight, this.m_ladybug.getOffsetY());

    // Draw all sprites in the array.
    this.m_arrSprites.forEach(e => 
    {
        e.render();

        if (C_RENDER_COLLISION_RECT === true)
            e.renderCollitionRectangle();
    });

    this.m_ladybug.render();
    
    // Energy indicators are on top of sprites and ladybug.
    this.m_arrSprites.forEach(e => 
    {
        e.renderEnergyIndicator(this.m_viewManager);
    });
    
    // Draw score bar.
    this.drawScore();

    // Avoid to show help if we are not in the current state..
    if (this.m_gameState === ViewLadybug_gamePage.C_STATE_SHOWING_HELP)
    {
        this.m_helpAnimation.render(
            this.m_viewManager.m_canvasEx.m_canvas, 
            this.m_viewManager.m_canvasEx.m_context,
            0, 1, 0.6);
    }

    // Anly render fade if we are in the current state.
    if (this.m_gameState === ViewLadybug_gamePage.C_STATE_FADING_FROM_DYING ||
        this.m_gameState === ViewLadybug_gamePage.C_STATE_FADING_FROM_LEVEL_COMPLETE)
    {
        this.m_fade.render(
            this.m_viewManager.m_canvasEx.m_canvas, 
            this.m_viewManager.m_canvasEx.m_context);
    }
};

ViewLadybug_gamePage.prototype.onLeavePage = function ()
{
    this.m_ladybug.endClosingAnimationEvent(this.m_ladybug); 
};

// ****************************************
// Custom page functions.
// ****************************************
ViewLadybug_gamePage.prototype.createLevel = function ()
{
    emptyArray(this.m_arrSprites);

    this.m_arrSprites.push(this.m_spriteFactory.createGrassSprite());
    this.m_arrSprites.push(this.m_spriteFactory.createLogSprite(false));
    this.m_arrSprites.push(this.m_spriteFactory.createFinishLineSprite(this.getFinisLineAltitude()));

    // Logic for auto generate the level. 
    var totalHeight = this.m_viewManager.m_canvasEx.m_canvas.height / 2;
    var deltaOffset = 0;
    var flip = 0;
    var offset = 0;
    var sprite = null;

    // Stack images until reach sky limit.
    while (totalHeight < this.m_skyHeight)
    {
        flip = (chRandomPISeed(100) <= 50) ? 1 : -1;
        deltaOffset = 0;
        if (flip === 1)
            offset = deltaOffset / 100;
        else
            offset = 1 - (deltaOffset / 100);

        // Generate a fruit or a branch depending on probability.
        if (chRandomPISeed(100) <= this.m_viewManager.getDataContext().currentLevel().fruitProb)
        {
            deltaOffset = 10;
            if (flip === 1)
                offset = deltaOffset / 100;
            else
                offset = 1 - (deltaOffset / 100);

            sprite = this.m_spriteFactory.createLeaveSprite(offset, totalHeight, flip, false);
            this.m_arrSprites.push(sprite);

            sprite = this.m_spriteFactory.createFruitSprite(offset, totalHeight, flip, true);
            this.m_arrSprites.push(sprite);
        }
        else
        {
            sprite = this.m_spriteFactory.createBranchSprite(offset, totalHeight, flip);
            this.m_arrSprites.push(sprite);
        }

        // This is the sum of the height of all sprites added. 
        totalHeight = totalHeight + (sprite.m_image.height * sprite.m_scale);

        // Begin adding falling flowers above of the top of screen.
        if (totalHeight > this.m_viewManager.m_canvasEx.m_canvas.height)
        {
            if (chRandomPISeed(100) <= this.m_viewManager.getDataContext().currentLevel().fallingFlowerProb)
            {
                sprite = this.m_spriteFactory.createFallingFlowerSprite(
                    this.m_viewManager.getDataContext().currentLevel().image,
                    0.5, 
                    totalHeight);
                this.m_arrSprites.push(sprite);
            }
        }
    }
}

ViewLadybug_gamePage.prototype.implementSpritesLogic = function ()
{
    this.m_ladybug.m_insideWalkingZone = false;

    this.m_arrSprites.forEach(e => 
    {
        e.applyWind();

        e.updateFallingFlowerPosition(this.m_ladybug.getWorldY() + this.m_viewManager.m_canvasEx.m_canvas.height / 2);

        e.transformWorldToScreen( this.m_viewManager.m_canvasEx.m_canvas.width, this.m_viewManager.m_canvasEx.m_canvas.height);
        e.m_screenY = e.m_screenY + this.m_ladybug.getOffsetY();

        // Collition logic.
        if (e.m_blinkCounter === 0 && this.m_ladybug.checkCollisionAlpha(e.m_collisionRectangle, e.m_image, e.m_scale, e.m_scale, e.m_flip))
        {
            // If ladybug is over some walkable sprite (no matter which) 
            // stop flying and start walk animation.
            if (e.m_isAWalkingZone === true)
                this.m_ladybug.m_insideWalkingZone = true;

            // If ladybug collide with sprites then add or substract energy. 
            if (this.m_gameState === ViewLadybug_gamePage.C_STATE_PLAYING)
            {
                this.m_ladybug.applySpriteCollision(e.m_energy_change)

                e.triggerEnergyIndicator(this.m_viewManager,
                                         this.m_ladybug.getScreenX(),
                                         this.m_ladybug.getScreenY());
            }
        }

        e.implementBlinkLogic(this.m_ladybug);
    });
}

ViewLadybug_gamePage.prototype.drawScore = function ()
{
    var fm = this.m_viewManager.getFontManagerInstance();
    var cv = this.m_viewManager.m_canvasEx.m_canvas;
    var cx = this.m_viewManager.m_canvasEx.m_context;

    // Altitude
    fm.drawTextScaled(cv, cx, "ALTITUDE", 3, 20, null, 0.3, 0.3); 
    var altitudeText =  chLeftPad(this.getAltitudePercent().toString(), "0", 3);
    fm.drawTextScaled(cv, cx, altitudeText, 3, 55, null, 0.4, 0.4); 

    // Energy
    fm.drawTextScaled(
        cv, 
        cx, 
        "ENERGY", 
        this.m_viewManager.m_canvasEx.m_canvas.width - fm.getTextWidthScaled("ENERGY", 0.3) - 3, 
        20, 
        null, 
        0.3, 
        0.3); 
    
    var energyText = chLeftPad(this.m_ladybug.getEnergyPercent().toString(), "0", 3);
    fm.drawTextScaled(
        cv, 
        cx, 
        energyText, 
        this.m_viewManager.m_canvasEx.m_canvas.width - fm.getTextWidthScaled(energyText, 0.4) - 3, 
        55, 
        null, 
        0.4, 
        0.4);  

    // Time
    fm.drawTextScaled(
        cv, 
        cx, 
        "TIME", 
        (this.m_viewManager.m_canvasEx.m_canvas.width - fm.getTextWidthScaled("TIME", 0.3)) / 2, 
        20, 
        null, 
        0.3, 
        0.3); 
    
    var playingTimeText = this.m_viewManager.getDataContext().getTimeToString(this.m_playingTime);
    fm.drawTextScaled(
        cv, 
        cx, 
        playingTimeText, 
        (this.m_viewManager.m_canvasEx.m_canvas.width - fm.getTextWidthScaled(playingTimeText, 0.4)) / 2, 
        55, 
        null, 
        0.4, 
        0.4);  
}

ViewLadybug_gamePage.prototype.getAltitudePercent = function ()
{   
    var returnValue = Math.floor(this.m_ladybug.getWorldY() / this.getFinisLineAltitude() * 100);

    if (returnValue > 100)
        returnValue = 100;

    return returnValue;
}

ViewLadybug_gamePage.prototype.getFinisLineAltitude = function ()
{   
    return this.m_skyHeight + this.m_viewManager.m_canvasEx.m_canvas.height;
}

ViewLadybug_gamePage.prototype.initTimer = function () 
{
    this.m_startPlayingTime = Date.now();
    this.m_playingTime = 0;
    this.m_performTimerUpdate = false;
}  

ViewLadybug_gamePage.prototype.updatePlayingTime = function () 
{
    this.m_playingTime  = (Date.now() - this.m_startPlayingTime);
}  


