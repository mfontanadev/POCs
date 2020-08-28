function SpriteFactory()
{
    SpriteFactory.prototype.init = function (_viewManager) 
    {
        this.m_viewManager = _viewManager;
    };

    SpriteFactory.prototype.createWoodSignSprite = function () 
    {
        var itemSprite = new Sprite();
        itemSprite.m_name = "wood_sign.png";
        itemSprite.m_image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.m_name);
        itemSprite.m_x = this.m_viewManager.m_canvasEx.m_canvas.width * 0.20;
        itemSprite.m_y = 0;
        itemSprite.m_worldX = itemSprite.m_x;
        itemSprite.m_worldY = itemSprite.m_image.height * 0.4 / 2;
        itemSprite.m_scale = 0.45;
        itemSprite.m_flip = 1;
        itemSprite.m_collisionRectangle = new ChRect();
        itemSprite.m_isAWalkingZone = false;
        
        updateRectangleWithScale(itemSprite.m_image, itemSprite.m_worldX, itemSprite.m_worldY, itemSprite.m_scale, itemSprite.m_collisionRectangle);
    
        this.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createLogSprite = function (_withPlayStamp) 
    {
        var itemSprite = new Sprite();
        if (_withPlayStamp === true)
            itemSprite.m_name = "log_play.png";
        else
            itemSprite.m_name = "log.png";

        itemSprite.m_image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.m_name);
        itemSprite.m_x = this.m_viewManager.m_canvasEx.m_canvas.width * 0.50;
        itemSprite.m_worldX = itemSprite.m_x;
        itemSprite.m_worldY = itemSprite.m_y;
        itemSprite.m_scale = 0.3;
        itemSprite.m_flip = 1;
        itemSprite.m_collisionRectangle = new ChRect();
        itemSprite.m_isAWalkingZone = true;
        
        updateRectangleWithScale(itemSprite.m_image, itemSprite.m_worldX, itemSprite.m_worldY, itemSprite.m_scale, itemSprite.m_collisionRectangle);
    
        this.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createGrassSprite = function () 
    {
        var itemSprite = new Sprite();
        itemSprite.m_name = "grass.png";
        itemSprite.m_image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.m_name);
        itemSprite.m_x = this.m_viewManager.m_canvasEx.m_canvas.width * 0.50;
        itemSprite.m_worldX = itemSprite.m_x;
        itemSprite.m_worldY = itemSprite.m_y;
        itemSprite.m_collisionRectangle = new ChRect();
        
        updateRectangleWithScale(itemSprite.m_image, itemSprite.m_worldX, itemSprite.m_worldY, itemSprite.m_scale, itemSprite.m_collisionRectangle);
    
        this.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createTextTitleSprite = function () 
    {
        var itemSprite = new Sprite();
        itemSprite.m_name = "text_title.png";
        itemSprite.m_image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.m_name);
        itemSprite.m_x = this.m_viewManager.m_canvasEx.m_canvas.width * 0.50;
        itemSprite.m_y = this.m_viewManager.m_canvasEx.m_canvas.height * 0.88;
        itemSprite.m_worldX = itemSprite.m_x;
        itemSprite.m_worldY = itemSprite.m_y;
        itemSprite.m_scale = 0.8;
        itemSprite.m_collisionRectangle = new ChRect();
        
        updateRectangleWithScale(itemSprite.m_image, itemSprite.m_worldX, itemSprite.m_worldY, itemSprite.m_scale, itemSprite.m_collisionRectangle);
    
        this.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createFinishLineSprite = function (_posY) 
    {
        var itemSprite = new Sprite();
        itemSprite.m_name = "finish_line.png";
        itemSprite.m_image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.m_name);
        itemSprite.m_x = this.m_viewManager.m_canvasEx.m_canvas.width / 2;
        itemSprite.m_y = _posY;
        itemSprite.m_worldX = itemSprite.m_x;
        itemSprite.m_worldY = itemSprite.m_y;
        itemSprite.m_scale = 1;
        itemSprite.m_collisionRectangle = new ChRect();
        
        updateRectangleWithScale(itemSprite.m_image, itemSprite.m_worldX, itemSprite.m_worldY, itemSprite.m_scale, itemSprite.m_collisionRectangle);
    
        this.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createBranchSprite = function (_widthPercent, _y, _flip) 
    {
        var itemSprite = new Sprite();
        itemSprite.m_name = "cherrytree_branch_" + this.m_viewManager.getDataContext().currentLevel().image + ".png";
        itemSprite.m_image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.m_name);
        itemSprite.m_x = this.m_viewManager.m_canvasEx.m_canvas.width * _widthPercent;
        itemSprite.m_y = _y;
        itemSprite.m_worldX = itemSprite.m_x;
        itemSprite.m_worldY = itemSprite.m_y;
        itemSprite.m_flip = _flip;
        itemSprite.m_collisionRectangle = new ChRect();
        itemSprite.m_applyWind = true;
        itemSprite.m_windForce = this.calculateWindForce(itemSprite, 20);
        itemSprite.m_windVelocity = chRandomPISeed(4) + 1;
        itemSprite.m_energy_change = this.m_viewManager.getDataContext().currentLevel().branchEnergy;
        itemSprite.m_isBranch = true;
        
        updateRectangleWithScale(itemSprite.m_image, itemSprite.m_worldX, itemSprite.m_worldY, itemSprite.m_scale, itemSprite.m_collisionRectangle);
    
        this.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createLeaveSprite = function (_widthPercent, _y, _flip) 
    {
        var itemSprite = new Sprite();
        itemSprite.m_name = "cherrytree_fruit_bk.png";
        itemSprite.m_image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.m_name);
        itemSprite.m_x = this.m_viewManager.m_canvasEx.m_canvas.width * _widthPercent;
        itemSprite.m_y = _y;
        itemSprite.m_worldX = itemSprite.m_x;
        itemSprite.m_worldY = itemSprite.m_y;
        itemSprite.m_scale = 0.2;
        itemSprite.m_flip = _flip;
        itemSprite.m_collisionRectangle = new ChRect();
        itemSprite.m_energy_change = 0;
        
        updateRectangleWithScale(itemSprite.m_image, itemSprite.m_worldX, itemSprite.m_worldY, itemSprite.m_scale, itemSprite.m_collisionRectangle);
    
        this.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createFruitSprite = function (_widthPercent, _y, _flip) 
    {
        var itemSprite = new Sprite();
        itemSprite.m_name = "cherrytree_fruit_fr.png";
        itemSprite.m_image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.m_name);
        itemSprite.m_x = this.m_viewManager.m_canvasEx.m_canvas.width * _widthPercent;
        itemSprite.m_y = _y;
        itemSprite.m_worldX = itemSprite.m_x;
        itemSprite.m_worldY = itemSprite.m_y;
        itemSprite.m_scale = 0.2;
        itemSprite.m_flip = _flip;
        itemSprite.m_collisionRectangle = new ChRect();

        itemSprite.m_energy_change = 1500;
        itemSprite.m_isFruit = true;
        //itemSprite.m_isAWalkingZone = true;
        
        updateRectangleWithScale(itemSprite.m_image, itemSprite.m_worldX, itemSprite.m_worldY, itemSprite.m_scale, itemSprite.m_collisionRectangle);
    
        this.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createFallingFlowerSprite = function (_imageName, _widthPercent, _y) 
    {
        var itemSprite = new Sprite();
        itemSprite.m_name = "cherrytree_flower_" + _imageName + ".png";
        itemSprite.m_image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.m_name);
        itemSprite.m_x = this.m_viewManager.m_canvasEx.m_canvas.width * _widthPercent;
        itemSprite.m_y = _y;
        itemSprite.m_worldX = itemSprite.m_x;
        itemSprite.m_worldY = itemSprite.m_y;
        itemSprite.m_scale = 0.7;
        itemSprite.m_collisionRectangle = new ChRect();
        itemSprite.m_energy_change = this.m_viewManager.getDataContext().currentLevel().fallingFlowerEnergy;
        itemSprite.m_isFallingFlower = true;
        itemSprite.m_frecuency = chRandomPISeed(5) + this.m_viewManager.getDataContext().currentLevel().fallingFlowerFrecuency;
        itemSprite.m_amplitude = chRandomPISeed(20) + 10;
            
        updateRectangleWithScale(itemSprite.m_image, itemSprite.m_worldX, itemSprite.m_worldY, itemSprite.m_scale, itemSprite.m_collisionRectangle);
    
        this.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.calculateWindForce = function (_sprite, _randomPert) 
    {
        var halfImage = _sprite.m_image.width * 0.50 * _sprite.m_scale;
        var pert = (((100 - _randomPert) + chRandomPISeed(_randomPert)) / 100);
        
        return halfImage * pert;
    }

    SpriteFactory.prototype.setObjectCanvasAndContext = function (_itemSprite)
    {
        _itemSprite.m_canvas = this.m_viewManager.m_canvasEx.m_canvas;
        _itemSprite.m_context = this.m_viewManager.m_canvasEx.m_context;
    };
};



