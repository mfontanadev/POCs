Ladybug.self = null;

Ladybug.C_LADYBUG_ANGLE_INCREMENT = 10;
Ladybug.C_LADYBUG_WALK_INCREMENT = 5;
Ladybug.C_LADYBUG_SETTING_H_THRUST = 0.25;
Ladybug.C_LADYBUG_SETTING_MAX_THRUST = 5;
Ladybug.C_LADYBUG_SETTING_TORQUE = 6;
Ladybug.C_LADYBUG_MAX_SLIDE = 4;
Ladybug.C_LADYBUG_SCALE = 0.15;

Ladybug.C_ANIM_NOT_SET = -1;
Ladybug.C_ANIM_STAND = 0;
Ladybug.C_ANIM_WALKING = 1;
Ladybug.C_ANIM_ROTATING_RIGHT = 2;
Ladybug.C_ANIM_ROTATING_LEFT = 3;
Ladybug.C_ANIM_OPENING = 4;
Ladybug.C_ANIM_CLOSING = 5;
Ladybug.C_ANIM_FLYING = 6;
Ladybug.C_ANIM_DYING = 7;
Ladybug.C_ANIM_FINISHLINE = 8;

Ladybug.C_FLYING_STEP_INCREMENT = 5;

Ladybug.C_MAX_ENERGY = 30000;           // settend to a FPS = 30, if FPS change, timer will be faster.
Ladybug.C_FLYING_ENERGY_LOSS = -10;     // in conjuntion with C_MAX_ENERGY it takes 100 seconds to reach 0

Ladybug.C_STATE_NOT_SET = 0;                //
Ladybug.C_STATE_ALIVE = 1;                  //
Ladybug.C_STATE_DIED = 2;                   //
Ladybug.C_STATE_END_FINISHLINE_ANIM = 3;    //

function Ladybug()
{
    this.m_viewManager = null;

    this.m_type = 0;
    this.m_cx = 0;
    this.m_cy = 0;
    this.m_rc = new ChRect();

    this.m_state = Ladybug.C_STATE_ALIVE;
    this.m_angle = 90;
    this.m_alpha = 1;
    this.m_scale = Ladybug.C_LADYBUG_SCALE;
    this.m_rotationDirection = 1;
    this.m_offsetY = 0;

    this.m_currentAnimationId = Ladybug.C_ANIM_NOT_SET;
    this.m_arrAnimations = new Array();

    this.m_walkingVelocity = Ladybug.C_LADYBUG_WALK_INCREMENT;

    this.m_velocity =
    {
        x: 0,
        y: 0,
        angle: 0
    }

    this.m_output = {
        x: 0,
        y: 0,
        c: "yellow"
    }

    this.m_keyboard =
    {
        up: false,
        down: false,
        left: false,
        right: false,
        button1: false,
        return: false,
        clickOnLadybug: false
    }

    this.m_insideWalkingZone = false;
    this.m_autoflight = false;
    this.m_energy = Ladybug.C_MAX_ENERGY;
    
    Ladybug.prototype.initWithType = function (_viewManager, _ladyBugType) 
    {
        this.m_viewManager = _viewManager;
        this.m_nodeType = _ladyBugType;

        this.m_cx = 0;
        this.m_cy = 0;
        this.m_offsetY = 0;
        
        this.setAnimations();

        this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
    };

    // ****************************************
    // Animation configuration
    // ****************************************
    Ladybug.prototype.setAnimations = function () 
    {
        var animation = null;

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_STAND, 0, 0);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_WALKING, 0, 0);
        animation.setOnChangeFrameListener(this.startFrameWalkEvent, null);
        animation.setOnEndAnimationEvent(this.endWalkAnimationEvent);
        this.addAnimationFrame(animation, 'ladybug_walk_left.png',  1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.addAnimationFrame(animation, 'ladybug_walk_right.png', 1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_ROTATING_RIGHT, 0, 0);
        animation.setOnChangeFrameListener(this.startFrameRotatingRigthEvent, null);
        animation.setOnEndAnimationEvent(this.endRotatingAnimationEvent);
        this.addAnimationFrame(animation, 'ladybug_walk_right.png',  1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_ROTATING_LEFT, 0, 0);
        animation.setOnChangeFrameListener(this.startFrameRotatingLeftEvent, null);
        animation.setOnEndAnimationEvent(this.endRotatingAnimationEvent);
        this.addAnimationFrame(animation, 'ladybug_walk_left.png',  1);
        this.addAnimationFrame(animation, 'ladybug_normal.png',     1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_OPENING, 0, 0);
        this.addAnimationFrame(animation, 'ladybug_open_1.png', 1);
        this.addAnimationFrame(animation, 'ladybug_open_2.png', 1);
        this.addAnimationFrame(animation, 'ladybug_open_3.png', 1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_CLOSING, 0, 0);
        animation.setOnEndAnimationEvent(this.endClosingAnimationEvent);
        this.addAnimationFrame(animation, 'ladybug_open_3.png', 1);
        this.addAnimationFrame(animation, 'ladybug_open_2.png', 1);
        this.addAnimationFrame(animation, 'ladybug_open_1.png', 1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_FLYING, 0, 0);
        animation.setInfiniteLoop(true);
        this.addAnimationFrame(animation, 'ladybug_flying_1.png', 1);
        this.addAnimationFrame(animation, 'ladybug_flying_2.png', 1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_DYING, 0, 0);
        animation.setLoops(16);
        animation.setOnChangeFrameListener(this.startDyingFrameWalkEvent, null);
        animation.setOnEndAnimationEvent(this.endDyingAnimationEvent);
        this.addAnimationFrame(animation, 'ladybug_flying_1.png', 1);
        this.addAnimationFrame(animation, 'ladybug_flying_2.png', 1);
        this.m_arrAnimations.push(animation);

        animation = new Animation();
        animation.initWith(this, Ladybug.C_ANIM_FINISHLINE, 0, 0);
        animation.setLoops(10);
        animation.setOnChangeFrameListener(this.startFinishLineFrameWalkEvent, null);
        animation.setOnEndAnimationEvent(this.endFinishLineAnimationEvent);
        this.addAnimationFrame(animation, 'ladybug_flying_1.png', 1);
        this.addAnimationFrame(animation, 'ladybug_flying_2.png', 1);
        this.m_arrAnimations.push(animation);

    };

    Ladybug.prototype.startFrameWalkEvent = function (_parent) 
    {
        // Direction, calculate deltaX and deltaY depending of walking angle.
        var velocityRatio = 1;
        var incX = cosOf(Ladybug.C_LADYBUG_WALK_INCREMENT * velocityRatio, _parent.m_angle);
        var incY = sinOf(Ladybug.C_LADYBUG_WALK_INCREMENT * velocityRatio, _parent.m_angle);

        if (_parent.isAValidMovement() === true)
        {
            _parent.m_cx = _parent.m_cx + incX; 
            _parent.m_cy = _parent.m_cy + incY; 

            _parent.validatePositionLimit();
        }
    }    

    Ladybug.prototype.isAValidMovement = function (_incX, _incY) 
    {
        var result = true;

        return result; 
    }

    Ladybug.prototype.startFrameRotatingRigthEvent = function (_parent) 
    {
        _parent.setAngle(_parent.m_angle - Ladybug.C_LADYBUG_ANGLE_INCREMENT); 
    }    

    Ladybug.prototype.startFrameRotatingLeftEvent = function (_parent) 
    {
        _parent.setAngle(_parent.m_angle + Ladybug.C_LADYBUG_ANGLE_INCREMENT); 
    }   

    Ladybug.prototype.endRotatingAnimationEvent = function (_parent) 
    {
        _parent.forceAnimation_STAND();
    }    

    Ladybug.prototype.endWalkAnimationEvent = function (_parent) 
    {
        _parent.forceAnimation_STAND();
    }    

    Ladybug.prototype.endClosingAnimationEvent = function (_parent) 
    {
        var sndId = _parent.m_viewManager.getSoundManagerInstance().getIdByName("wings.mp3");
        _parent.m_viewManager.getSoundManagerInstance().stop(sndId);
        _parent.forceAnimation_STAND();
    }

    Ladybug.prototype.startDyingFrameWalkEvent = function (_parent) 
    {
        _parent.setAngle(_parent.m_angle + 45); 
        _parent.setScale(_parent.m_scale * 0.95); 
    }

    Ladybug.prototype.endDyingAnimationEvent = function (_parent) 
    {
        _parent.m_state = Ladybug.C_STATE_DIED;
        _parent.stopAnimation_DYING();

        var sndId = _parent.m_viewManager.getSoundManagerInstance().getIdByName("wings.mp3");
        _parent.m_viewManager.getSoundManagerInstance().stop(sndId);
    }

    Ladybug.prototype.startFinishLineFrameWalkEvent = function (_parent) 
    {
        _parent.setScale(_parent.m_scale * 0.95); 
        _parent.m_velocity.y = _parent.m_viewManager.m_canvasEx.m_canvas.height / 2 / this.m_loops;
    }

    Ladybug.prototype.endFinishLineAnimationEvent = function (_parent) 
    {
        _parent.m_state = Ladybug.C_STATE_END_FINISHLINE_ANIM;
        _parent.stopAnimation_FINISHLINE();
    }

    Ladybug.prototype.addAnimationFrame = function (_animation, _imageName, _duration) 
    {
        var tmpResource = this.m_viewManager.getBitmapManagerInstance().getImageByName(_imageName);

        _animation.createFrame(tmpResource, 0, 0, tmpResource.width, tmpResource.height, 0, 0, 0, 0, _duration);
    }    

    // ****************************************
    // Main cicle: handle|s, implementGameLogic, render
    // ****************************************
    Ladybug.prototype.handleInputs = function () 
    {
        this.m_keyboard.up = this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_UP);
        this.m_keyboard.down = this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_DOWN);
        this.m_keyboard.right = this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_RIGHT);
        this.m_keyboard.left = this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_LEFT);

        if (this.m_keyboard.right === true && this.m_keyboard.left === true)
        {
            this.m_keyboard.right = false;
            this.m_keyboard.left = false;      
        }
        
        this.m_keyboard.button1 = this.m_viewManager.getKeyboardManagerInstance().isKeyDown(C_KEY_SHIFT);

        var mouse = this.m_viewManager.getMouseManagerInstance();
        var isMouseOnLadyBug = collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, 1, 1, this.collisionRectangle()); 
        
        this.m_keyboard.clickOnLadybug = mouse.triggerClic(isMouseOnLadyBug);
    };

    Ladybug.prototype.implementGameLogic = function () 
    {
        if (this.isAnimation_DYING() === false)
        {
            if (this.getEnergyPercent() <= 0 && this.isAnimation_FINISHLINE() === false)
            {
                var sndId = this.m_viewManager.getSoundManagerInstance().getIdByName("die.wav");
                this.m_viewManager.getSoundManagerInstance().play(sndId, false);
    
                this.startAnimation(Ladybug.C_ANIM_DYING);
            }
            this.moveLogic();
        }

        this.m_arrAnimations[this.m_currentAnimationId].implementGameLogic();

        // Shaking effect if collitioning with same branch.
        var px = this.m_cx;
        var py = this.m_viewManager.m_canvasEx.m_canvas.height - this.m_cy;

        // Set animation frame position.
        this.m_arrAnimations[this.m_currentAnimationId].setPosition(px, py);
    
        if (this.isAnimation_FLYING() === true)
            this.applyEnergy(Ladybug.C_FLYING_ENERGY_LOSS)
    };

    Ladybug.prototype.render = function () 
    {   
        if (this.isAlive() === false)
            return;

        this.m_arrAnimations[this.m_currentAnimationId].render(
            this.m_viewManager.m_canvasEx.m_canvas, 
            this.m_viewManager.m_canvasEx.m_context,
            this.m_angle - 90, this.m_alpha, this.m_scale);
        
        if (C_LOG === true)
        {
            message = 'Velocity (' + this.m_velocity.x + ',' + this.m_velocity.y + ")"; 
            writeMessage(this.m_viewManager.m_canvasEx.m_context, message, 4, 128, 9, "Calibri", "red", C_DEBUG_MODE);
        }

        if (C_RENDER_COLLISION_RECT === true)
        {
            rendercollisionRectangle(this.m_viewManager.m_canvasEx.m_context, this.collisionRectangle(), 'magenta')
        }
    };

    // ****************************************
    // Movement logic
    // ****************************************
    Ladybug.prototype.moveLogic = function ()
    {   
        if (this.isInWalkingZone() === false)
        {
            this.m_keyboard.button1 = true;
        }

        if (this.isAnimation_STAND() === true)
        {
            this.moveLogicStand();
        }
        else if (this.isAnimation_FLYING() === true)
        {
            this.moveLogicFlying();
        }
        else if (this.isAnimation_OPENING() === true)
        {
            this.moveLogicOpening();
        }

        this.updatePosition();
    }

    Ladybug.prototype.updatePosition = function ()
    {   
        // Update x, y, angle values.
        this.m_cx = this.m_cx + this.m_velocity.x;
        this.m_cy = this.m_cy + this.m_velocity.y;

        if (this.m_currentAnimationId === Ladybug.C_ANIM_FLYING)
        {
            var slideEffect = 0;
            var slideVelocity = this.m_velocity.x;

            if (slideVelocity > Ladybug.C_LADYBUG_MAX_SLIDE)
            {
                slideVelocity = Ladybug.C_LADYBUG_MAX_SLIDE;
            }
            else if (slideVelocity < -1 * Ladybug.C_LADYBUG_MAX_SLIDE)
            {
                slideVelocity = -1 * Ladybug.C_LADYBUG_MAX_SLIDE;
            }

            slideEffect = (slideVelocity * Ladybug.C_LADYBUG_SETTING_TORQUE);
            this.m_angle = this.m_velocity.angle - slideEffect;
        }

        this.validatePositionLimit();
    }

    // If ladybug is outside the screen then perform actions to fix that.
    Ladybug.prototype.validatePositionLimit = function ()
    {
        if (this.m_cx < 0)
            this.m_cx = 0;
        
        if (this.m_cy < 0)
            this.m_cy = 0;
        
        if (this.m_cx > this.m_viewManager.m_canvasEx.m_canvas.width)
            this.m_cx = this.m_viewManager.m_canvasEx.m_canvas.width;

        if (this.m_currentAnimationId === Ladybug.C_ANIM_FLYING)
        {
            var deltaOffset = this.m_cy - (this.m_viewManager.m_canvasEx.m_canvas.height / 2);
            if (deltaOffset > 0)
            {
                this.m_cy = this.m_viewManager.m_canvasEx.m_canvas.height / 2;
                this.m_offsetY = this.m_offsetY + deltaOffset;
            }
        }
    }
    
    Ladybug.prototype.moveLogicStand = function ()
    {   
        if (this.m_keyboard.button1 === true)
        {
            this.openElytras();
        }
        
        if (this.m_keyboard.left === true)
        {
            this.rotateLeft();
        }
        else if (this.m_keyboard.right === true)
        {
            this.rotateRight();
        }
        else if (this.m_keyboard.up === true)
        {
            this.moveUp();
        }
    }

    Ladybug.prototype.isInWalkingZone = function ()
    {
        if (this.m_autoflight === false)
        {
            return true;
        }
        else 
        {
            return this.m_insideWalkingZone;
        }
    }

    Ladybug.prototype.moveLogicFlying = function ()
    {   
        if (this.m_keyboard.left === true)
        {
            this.flyLeft();
        }
        else if (this.m_keyboard.right === true)
        {
            this.flyRight();
        }
        else
        {
            this.horizontalCompensation();
        }

        if (this.m_keyboard.up === true)
        {
            this.flyUp();
        }
        else if (this.m_keyboard.down === true)
        {
            this.flyDown();
        }
        else
        {
            this.verticalCompensation();
        }

        if (this.m_keyboard.button1 === false)
        {
            this.closeElytras();

            this.m_velocity.x = 0;
            this.m_velocity.y = 0;
            this.m_angle = this.m_velocity.angle;   
            this.m_velocity.inverse_x = false;
            this.m_velocity.inverse_y = false;
        }
        else
        {
            this.angleCompensation();
        }
    }

    Ladybug.prototype.moveLogicOpening = function ()
    {   
        if (this.m_keyboard.button1 === true)
        {
            this.flyingAnimation();
        }
        else
        {
            this.closeElytras();
        }
    }

    Ladybug.prototype.flyLeft = function () 
    {
        this.m_velocity.x = this.m_velocity.x - Ladybug.C_LADYBUG_SETTING_H_THRUST;           
    };

    Ladybug.prototype.flyRight = function () 
    {
        this.m_velocity.x = this.m_velocity.x + Ladybug.C_LADYBUG_SETTING_H_THRUST;           
    };

    Ladybug.prototype.horizontalCompensation = function () 
    {
        this.m_velocity.x = this.m_velocity.x * 0.95;
        if (Math.abs(this.m_velocity.x) < 0.25)
            this.m_velocity.x = 0;

        if (this.m_velocity.x < -Ladybug.C_LADYBUG_SETTING_MAX_THRUST)
            this.m_velocity.x = -Ladybug.C_LADYBUG_SETTING_MAX_THRUST;
        
        if (this.m_velocity.x > Ladybug.C_LADYBUG_SETTING_MAX_THRUST)
            this.m_velocity.x = Ladybug.C_LADYBUG_SETTING_MAX_THRUST;
    }

    Ladybug.prototype.angleCompensation = function () 
    {
        if (Math.abs(this.m_velocity.angle - 90) <= 10)
        {
            this.m_velocity.angle = 90;
        }
        else
        {
            this.m_velocity.angle = this.m_velocity.angle - ((this.m_velocity.angle - 90) / 2);    
        }
    }

    Ladybug.prototype.flyUp = function () 
    {
        this.m_velocity.y = this.m_velocity.y + Ladybug.C_LADYBUG_SETTING_H_THRUST;           
        if (this.m_velocity.y > Ladybug.C_LADYBUG_SETTING_MAX_THRUST * 2)
            this.m_velocity.y = Ladybug.C_LADYBUG_SETTING_MAX_THRUST * 2;
    };

    Ladybug.prototype.flyDown = function () 
    {
        this.m_velocity.y = this.m_velocity.y - Ladybug.C_LADYBUG_SETTING_H_THRUST;           
        if (this.m_velocity.y < -Ladybug.C_LADYBUG_SETTING_MAX_THRUST * 2)
            this.m_velocity.y = -Ladybug.C_LADYBUG_SETTING_MAX_THRUST * 2;
    };

    Ladybug.prototype.verticalCompensation = function () 
    {
        this.m_velocity.y = this.m_velocity.y * 0.95;
        if (Math.abs(this.m_velocity.y) < 0.25)
            this.m_velocity.y = 0;

        if (this.m_velocity.y < -Ladybug.C_LADYBUG_SETTING_MAX_THRUST)
            this.m_velocity.y = -Ladybug.C_LADYBUG_SETTING_MAX_THRUST;
        
        if (this.m_velocity.y > Ladybug.C_LADYBUG_SETTING_MAX_THRUST)
            this.m_velocity.y = Ladybug.C_LADYBUG_SETTING_MAX_THRUST;
    }

    Ladybug.prototype.rotateLeft = function () 
    {
        if (this.isAnimation_STAND() === true || this.m_currentAnimationId === Ladybug.C_ANIM_ROTATING_LEFT)
        {
            this.startAnimation(Ladybug.C_ANIM_ROTATING_LEFT);
        }
    };

    Ladybug.prototype.rotateRight = function () 
    {
        if (this.isAnimation_STAND() === true || this.m_currentAnimationId === Ladybug.C_ANIM_ROTATING_RIGHT)
        {
            this.startAnimation(Ladybug.C_ANIM_ROTATING_RIGHT);
        }
    };

    Ladybug.prototype.moveUp = function () 
    {
        if (this.isAnimation_STAND() === true || this.m_currentAnimationId === Ladybug.C_ANIM_WALKING)
        {
            this.startAnimation(Ladybug.C_ANIM_WALKING);
        }
    };

    Ladybug.prototype.openElytras = function () 
    {
        if (this.isAnimation_STAND() === true)
        {
            this.startAnimation(Ladybug.C_ANIM_OPENING);       
        }
    };

    Ladybug.prototype.flyingAnimation = function () 
    {
        if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)
        {
            //var sndId = this.m_viewManager.getSoundManagerInstance().getIdByName("wings.mp3");
            //this.m_viewManager.getSoundManagerInstance().play(sndId, true);

            this.m_velocity.angle = this.m_angle;   

            this.startAnimation(Ladybug.C_ANIM_FLYING);       
        }
    }

    Ladybug.prototype.closeElytras = function () 
    {
        this.startAnimation(Ladybug.C_ANIM_CLOSING);       
    }

    Ladybug.prototype.forceAnimation_STAND = function () 
    {
        this.m_currentAnimationId = Ladybug.C_ANIM_STAND;
        this.m_arrAnimations[this.m_currentAnimationId].reset();  
    };

    Ladybug.prototype.stopAnimation_DYING = function () 
    {
        this.m_currentAnimationId = Ladybug.C_ANIM_DYING;
        this.m_arrAnimations[this.m_currentAnimationId].reset();  
    };

    Ladybug.prototype.stopAnimation_FINISHLINE = function () 
    {
        this.m_currentAnimationId = Ladybug.C_ANIM_FINISHLINE;
        this.m_arrAnimations[this.m_currentAnimationId].reset();  
    };

    Ladybug.prototype.forceAnimation_FINISHLINE = function () 
    {
        this.m_currentAnimationId = Ladybug.C_ANIM_FINISHLINE;
        this.m_arrAnimations[this.m_currentAnimationId].start();  
    };

    // ****************************************
    // User interface.
    // ****************************************
    Ladybug.prototype.isAnimation_STAND = function () 
    {
        return (this.m_currentAnimationId === Ladybug.C_ANIM_STAND);
    };

    Ladybug.prototype.isAnimation_OPENING = function () 
    {
        return (this.m_currentAnimationId === Ladybug.C_ANIM_OPENING);
    };

    Ladybug.prototype.isAnimation_FLYING = function ()
    {
        return (this.m_currentAnimationId === Ladybug.C_ANIM_FLYING);
    };

    Ladybug.prototype.isAnimation_DYING = function ()
    {
        return (this.m_currentAnimationId === Ladybug.C_ANIM_DYING);
    };

    Ladybug.prototype.isAnimation_FINISHLINE = function ()
    {
        return (this.m_currentAnimationId === Ladybug.C_ANIM_FINISHLINE);
    };

    Ladybug.prototype.setAngle = function (_angle) 
    {
        this.m_angle = _angle % 360;
    };

    Ladybug.prototype.setScale = function (_scale) 
    {
        this.m_scale = _scale;
    };

    Ladybug.prototype.setAutoflight = function (_value) 
    {
        this.m_autoflight = _value;
    };
    
    // ****************************************
    // Default animated object helpers
    // ****************************************
    Ladybug.prototype.startAnimation = function (_animationId) 
    {
        if (this.m_arrAnimations[this.m_currentAnimationId].hasEnded() === true)
        {
            this.m_currentAnimationId = _animationId;
            this.m_arrAnimations[this.m_currentAnimationId].reset();
            this.m_arrAnimations[this.m_currentAnimationId].start();
        }
    };

    Ladybug.prototype.reset = function () 
    {
        this.m_cx = 0;
        this.m_cy = 0;
    
        this.m_state = Ladybug.C_STATE_ALIVE;
        this.m_scale = Ladybug.C_LADYBUG_SCALE;
        this.m_alpha = 1;
        this.m_angle = 90;
        this.m_rotationDirection = 1;
        this.m_offsetY = 0;
    
        this.m_currentAnimationId = Ladybug.C_ANIM_NOT_SET;
    
        this.m_velocity =
        {
            x: 0,
            y: 0,
            angle: 0
        }
    
        this.m_keyboard =
        {
            up: false,
            down: false,
            left: false,
            right: false,
            button1: false,
            return: false,
            clickOnLadybug: false
        }
    
        this.m_insideWalkingZone = false;
        this.m_autoflight = false;
        this.m_energy = Ladybug.C_MAX_ENERGY;
    };

    Ladybug.prototype.dump = function () 
    {
    };

    // Perform a double check collition logic to acoid time consuming.
    // First:   check if center of ladybug is inside a given rectangle
    //
    // Second:  if first check was true, then read pixel from image and
    //          check if it is distinct to alpha color. (this is time consuming)
    Ladybug.prototype.checkCollisionAlpha = function (_collisionRectangle, _image, _sx, _sy, _flip) 
    {
        var returnValue = collisionPointRect(this.m_cx, this.getWorldY(), 1, 1, _collisionRectangle);

        if (returnValue === true)
        {
            returnValue = collisionPointRectAlpha(this.m_cx, this.getWorldY(), _collisionRectangle, _image, _sx, _sy, _flip, this.m_output);
        }

        return returnValue;
    }

    Ladybug.prototype.checkCollision = function (_collisionRectangle) 
    {
        return collisionPointRect(this.m_cx, this.getWorldY(), 1, 1, _collisionRectangle); 
    }

    Ladybug.prototype.collisionRectangle = function () 
    {
        if (this.m_currentAnimationId !== Ladybug.C_ANIM_NOT_SET)
        {
            this.m_rc = this.m_arrAnimations[this.m_currentAnimationId].collisionRectangleScaled(this.m_scale);
        }

        return this.m_rc; 
    }

    Ladybug.prototype.getWidth = function () 
    {
        return this.collisionRectangle().width();
    }    

    Ladybug.prototype.getHeight = function () 
    {
        return this.collisionRectangle().height();
    }    

    Ladybug.prototype.getWidthWithoutTransparencySpace = function () 
    {
        // 0.407 (percent of ladybug in the entire image) = 226 (ladybug in the center) / 555 (total width)
        return this.collisionRectangle().width() * 0.407;
    }    

    Ladybug.prototype.getHeightWithoutTransparencySpace = function () 
    {
        // 0.682 (percent of ladybug in the entire image) = 176 (ladybug in the center) / 379 (total width)
        return this.collisionRectangle().height() * 0.682;
    }  

    Ladybug.prototype.getWorldY = function () 
    {
        return this.m_offsetY + this.m_cy;
    }  

    Ladybug.prototype.getOffsetY = function () 
    {
        return this.m_offsetY;
    }  

    Ladybug.prototype.setOffsetY = function (_value) 
    {
        this.m_offsetY = _value;
    }  

    Ladybug.prototype.getScreenX = function (_value) 
    {
        return this.m_cx;
    }

    Ladybug.prototype.getScreenY = function (_value) 
    {
        return this.m_viewManager.m_canvasEx.m_canvas.height - this.m_cy;
    }

    Ladybug.prototype.getEnergyPercent = function () 
    {
        return Math.floor(this.m_energy / Ladybug.C_MAX_ENERGY * 100);
    }  

    Ladybug.prototype.applyEnergy = function (_energyChange) 
    {
        this.m_energy += _energyChange;
    
        if (this.m_energy > Ladybug.C_MAX_ENERGY)
            this.m_energy = Ladybug.C_MAX_ENERGY;

        if (this.m_energy < 0)
            this.m_energy = 0;
    }  

    Ladybug.prototype.applySpriteCollision = function(_energyChange)
    {
        this.applyEnergy(_energyChange);       
    }

    Ladybug.prototype.isAlive = function()
    {
        return this.m_state === Ladybug.C_STATE_ALIVE;
    }

    Ladybug.prototype.hasEndedFinishLineAnimation = function()
    {
        return this.m_state === Ladybug.C_STATE_END_FINISHLINE_ANIM;
    }

    Ladybug.prototype.someInputHappen = function()
    {
        return  this.m_keyboard.up || 
                this.m_keyboard.down ||
                this.m_keyboard.right || 
                this.m_keyboard.left ||
                this.m_keyboard.button1 ||
                this.m_keyboard.clickOnLadybug;
    }

    Ladybug.prototype.setAlpha = function(_value)
    {
        this.m_alpha = _value;
    }
};



