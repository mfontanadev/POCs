// Class Sprite; it is like some image but reloaded.

Sprite.C_FRUIT_ENERGY_INDICATOR_DURATION = 40;
Sprite.C_LADYBUG_BLINKING_DURATION = 20;
Sprite.C_BRANCH_ENERGY_INDICATOR_DURATION = 40;

function Sprite() 
{
    this.m_id = 0;
    this.m_canvas = null;
    this.m_context = null;
    
    this.m_image = null;
    this.m_name = "";
    
    this.m_x = 0;
    this.m_y = 0;
    this.m_worldX = 0;
    this.m_worldY = 0;
    this.m_screenX = 0;
    this.m_screenY = 0;
    
    this.m_rotation = 0;
    this.m_alpha = 1;
    this.m_scale = 1;
    this.m_flip = 1;
    
    this.m_collisionRectangle = null;
    
    this.m_applyWind = false;
    this.m_windAngle = 0;   
    this.m_windForce = 0;               // sine function amplitude
    this.m_windVelocity = 0;            // sine function frecuency

    this.m_energy_change = 0;           // if > 0 ladybug will energy; if < 0 ladybug will be dameged.
    this.m_isAWalkingZone = false;
    this.m_isFruit = false;
    this.m_isBranch = false;
    this.m_isFallingFlower = false;
    this.m_blinkCounter = 0;
    this.m_energyIndicatorX = 0;
    this.m_energyIndicatorY = 0;

    this.m_angleCounter = 0;
    this.m_frecuency = 0;
    this.m_amplitude = 0
        
    Sprite.prototype.initWith = function ()
	{
		this.m_parent = _parent;
    }

    Sprite.prototype.reset = function ()
	{
        this.m_windAngle = 0,   
        this.m_alpha = 1;
        this.m_blinkCounter = 0;
        this.m_angleCounter = 0;
        this.m_rotation = 0;
        if (this.m_isFallingFlower === true)
        {
            this.m_worldX = 0;
            this.m_worldY = 0;
        }
    }

    Sprite.prototype.render = function()
	{
		drawImageFromSprite(this);
    }

    Sprite.prototype.renderEnergyIndicator = function(_viewManager)
    {
        if (this.m_blinkCounter > 0)
        {
            var text = _viewManager.getDataContext().getEnergyPercent(this.m_energy_change).toString();

            _viewManager.getFontManagerInstance().drawTextScaled(
                _viewManager.m_canvasEx.m_canvas, 
                _viewManager.m_canvasEx.m_context, 
                text, 
                this.m_energyIndicatorX - _viewManager.getFontManagerInstance().getTextWidthScaled(text, 0.3) / 2, 
                this.m_energyIndicatorY - 10 - (this.m_blinkCounter * 2), 
                null, 
                0.3, 
                0.3);  
        }
    }

    Sprite.prototype.renderCollisionRectangle = function ()
	{
        var rectTmp = new ChRect();

        // Transform world rectangle to screen rectangle.
        rectangleMoveTo(this.m_collisionRectangle, this.m_screenX, this.m_screenY, rectTmp);

        // Render a magenta rectangle.
        rendercollisionRectangle(this.m_context, rectTmp, 'magenta');
    }

    Sprite.prototype.transformWorldToScreen = function (_width, _height)
	{
        updateRectangleWithScale(this.m_image, this.m_worldX, this.m_worldY, this.m_scale, this.m_collisionRectangle);

        // Transform from world to screen, translate offset of world canvas.height.
        // Then update collision rectangle according to the new position.
        this.m_screenX = this.m_worldX;
        this.m_screenY = _height - this.m_worldY;
    }

    Sprite.prototype.applyWind = function ()
    {   
        // Only apply wind to sprites that allow wind.
        if (this.m_applyWind === true)
        {
            this.m_windAngle = this.m_windAngle + this.m_windVelocity;
            this.m_worldX = this.m_x + sinOf(this.m_windForce, this.m_windAngle);
        }
    }

    Sprite.prototype.updateFallingFlowerPosition = function (_offsetY)
    {   
        // If sprite is a falling flower then apply oscillation logic.
        if (this.m_isFallingFlower === true && _offsetY > this.m_worldY)
        {   
            this.m_angleCounter = this.m_angleCounter + this.m_frecuency;
            this.m_worldX = this.m_x + sinOf(this.m_amplitude, this.m_angleCounter);
            this.m_rotation = sinOf(this.m_amplitude, this.m_angleCounter);
            this.m_worldY = this.m_y - this.m_angleCounter / 2;
        }
    }

    Sprite.prototype.triggerEnergyIndicator = function (_viewManager, _x, _y)
    {
        var setBlinkCounter = false;

        if (this.m_isFruit === true)
        {
            var sndId = _viewManager.getSoundManagerInstance().getIdByName("eat.wav");
            _viewManager.getSoundManagerInstance().play(sndId, false);
            setBlinkCounter = true;
        }
        else
        {
            if (this.m_energy_change < 0)
            {
                var sndId = _viewManager.getSoundManagerInstance().getIdByName("hit.wav");
                _viewManager.getSoundManagerInstance().play(sndId, false);
                setBlinkCounter = true;
            }
        }

        // Trigger energy indicator at ladybug position.
        if (setBlinkCounter === true)
        {
            this.m_blinkCounter = 1;
            this.m_energyIndicatorX = _x;
            this.m_energyIndicatorY = _y;
        }
    }

    Sprite.prototype.implementBlinkLogic = function (_ladybug)
    {
        // Blink sprite logic.
        if (this.m_blinkCounter > 0)
        {
            this.m_blinkCounter = this.m_blinkCounter + 1;

            // Fruit blinking effect.
            if (this.m_isFruit === true)
            {
                this.m_alpha = this.m_blinkCounter % 2;
            
                // When reach blink limit, set -1 to never collition againg.
                if (this.m_blinkCounter >= Sprite.C_FRUIT_ENERGY_INDICATOR_DURATION)
                    this.m_blinkCounter = -1;        
            }
            // Branch blinking effect.
            else if (this.m_isBranch || this.m_isFallingFlower)
            {
                // When reach blink limit, stop ladybug blink effect.
                if (this.m_blinkCounter > Sprite.C_LADYBUG_BLINKING_DURATION)
                    _ladybug.setAlpha(1);
                else
                    _ladybug.setAlpha(this.m_blinkCounter % 2);

                // Show energy indicator after a short period over ladybug effect.
                if (this.m_blinkCounter >= Sprite.C_BRANCH_ENERGY_INDICATOR_DURATION)
                    this.m_blinkCounter = 0;
            }
        }
    }
}
