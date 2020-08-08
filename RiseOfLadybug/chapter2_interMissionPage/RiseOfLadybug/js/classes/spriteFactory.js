function SpriteFactory()
{
    SpriteFactory.prototype.init = function (_viewManager) 
    {
        this.m_viewManager = _viewManager;
    };

    SpriteFactory.prototype.createWoodSignSprite = function () 
    {
        var itemSprite = Object.create(Sprite);
        itemSprite.name = "wood_sign.png";
        itemSprite.image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.name);
        itemSprite.x = this.m_viewManager.m_canvasEx.m_canvas.width * 0.20;
        itemSprite.y = 0;
        itemSprite.worldX = itemSprite.x;
        itemSprite.worldY = itemSprite.image.height * 0.4 / 2;
        itemSprite.scale = 0.45;
        itemSprite.flip = 1;
        itemSprite.collisionRectangle = new ChRect();
        itemSprite.isAWalkingZone = false;
        
        updateRectangleWithScale(itemSprite.image, itemSprite.worldX, itemSprite.worldY, itemSprite.scale, itemSprite.collisionRectangle);
    
        this.m_viewManager.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createLogSprite = function (_withPlayStamp) 
    {
        var itemSprite = Object.create(Sprite);
        if (_withPlayStamp === true)
            itemSprite.name = "log_play.png";
        else
            itemSprite.name = "log.png";

        itemSprite.image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.name);
        itemSprite.x = this.m_viewManager.m_canvasEx.m_canvas.width * 0.50;
        itemSprite.worldX = itemSprite.x;
        itemSprite.worldY = itemSprite.y;
        itemSprite.scale = 0.3;
        itemSprite.flip = 1;
        itemSprite.collisionRectangle = new ChRect();
        itemSprite.isAWalkingZone = true;
        
        updateRectangleWithScale(itemSprite.image, itemSprite.worldX, itemSprite.worldY, itemSprite.scale, itemSprite.collisionRectangle);
    
        this.m_viewManager.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createGrassSprite = function () 
    {
        var itemSprite = Object.create(Sprite);
        itemSprite.name = "grass.png";
        itemSprite.image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.name);
        itemSprite.x = this.m_viewManager.m_canvasEx.m_canvas.width * 0.50;
        itemSprite.worldX = itemSprite.x;
        itemSprite.worldY = itemSprite.y;
        itemSprite.collisionRectangle = new ChRect();
        
        updateRectangleWithScale(itemSprite.image, itemSprite.worldX, itemSprite.worldY, itemSprite.scale, itemSprite.collisionRectangle);
    
        this.m_viewManager.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createTextTitleSprite = function () 
    {
        var itemSprite = Object.create(Sprite);
        itemSprite.name = "text_title.png";
        itemSprite.image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.name);
        itemSprite.x = this.m_viewManager.m_canvasEx.m_canvas.width * 0.50;
        itemSprite.y = this.m_viewManager.m_canvasEx.m_canvas.height * 0.88;
        itemSprite.worldX = itemSprite.x;
        itemSprite.worldY = itemSprite.y;
        itemSprite.scale = 0.8;
        itemSprite.collisionRectangle = new ChRect();
        
        updateRectangleWithScale(itemSprite.image, itemSprite.worldX, itemSprite.worldY, itemSprite.scale, itemSprite.collisionRectangle);
    
        this.m_viewManager.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };


    SpriteFactory.prototype.createBranchSprite = function (_widthPercent, _y, _flip) 
    {
        var itemSprite = Object.create(Sprite);
        itemSprite.name = "cherrytree_branch_" + this.m_viewManager.getDataContext().currentLevel().image + ".png";
        itemSprite.image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.name);
        itemSprite.x = this.m_viewManager.m_canvasEx.m_canvas.width * _widthPercent;
        itemSprite.y = _y;
        itemSprite.worldX = itemSprite.x;
        itemSprite.worldY = itemSprite.y;
        itemSprite.flip = _flip;
        itemSprite.collisionRectangle = new ChRect();
        itemSprite.applyWind = true;
        itemSprite.windForce = this.calculateWindForce(itemSprite, 20);
        itemSprite.windVelocity = chRandomPISeed(4) + 1;
        itemSprite.energy_change = this.m_viewManager.getDataContext().currentLevel().branchEnergy;
        itemSprite.isBranch = true;
        
        updateRectangleWithScale(itemSprite.image, itemSprite.worldX, itemSprite.worldY, itemSprite.scale, itemSprite.collisionRectangle);
    
        this.m_viewManager.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.createFallingFlowerSprite = function (_imageName, _widthPercent, _y) 
    {
        var itemSprite = Object.create(Sprite);
        itemSprite.name = "cherrytree_flower_" + _imageName + ".png";
        itemSprite.image = this.m_viewManager.getBitmapManagerInstance().getImageByName(itemSprite.name);
        itemSprite.x = this.m_viewManager.m_canvasEx.m_canvas.width * _widthPercent;
        itemSprite.y = _y;
        itemSprite.worldX = itemSprite.x;
        itemSprite.worldY = itemSprite.y;
        itemSprite.scale = 0.7;
        itemSprite.collisionRectangle = new ChRect();
        itemSprite.energy_change = this.m_viewManager.getDataContext().currentLevel().fallingFlowerEnergy;
        itemSprite.isFallingFlower = true;
        itemSprite.frecuency = chRandomPISeed(5) + this.m_viewManager.getDataContext().currentLevel().fallingFlowerFrecuency;
        itemSprite.amplitude = chRandomPISeed(20) + 10;
            
        updateRectangleWithScale(itemSprite.image, itemSprite.worldX, itemSprite.worldY, itemSprite.scale, itemSprite.collisionRectangle);
    
        this.m_viewManager.setObjectCanvasAndContext(itemSprite);
    
        return itemSprite;
    };

    SpriteFactory.prototype.calculateWindForce = function (_sprite, _randomPert) 
    {
        var halfImage = _sprite.image.width * 0.50 * _sprite.scale;
        var pert = (((100 - _randomPert) + chRandomPISeed(_randomPert)) / 100);
        
        return halfImage * pert;
    }

};



