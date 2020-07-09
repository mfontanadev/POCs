function addSprite(_viewManager, _arrSprites, _widthPercent, _y, _scale, _flip, _applyWind, _energy_change, _isAWalkingZone, _imageName)
{
    var itemSprite = Object.create(Sprite);
    itemSprite.image = _viewManager.getBitmapManagerInstance().getImageByName(_imageName);
    itemSprite.name = _imageName;
    itemSprite.x = _viewManager.m_canvasEx.m_canvas.width * _widthPercent;
    itemSprite.y = _y;
    itemSprite.worldX = itemSprite.x;
    itemSprite.worldY = itemSprite.y;
    itemSprite.scale = _scale;
    itemSprite.flip = (_flip === true) ? -1 : 1;
    itemSprite.collisionRectangle = new ChRect();
    itemSprite.applyWind = _applyWind;
    itemSprite.windAngle = 0;
    itemSprite.windForce = chRandom(itemSprite.image.width * itemSprite.scale / 2.25) + 10;
    itemSprite.windVelocity = chRandom(4) + 1;
    itemSprite.energy_change = _energy_change;
    itemSprite.isAWalkingZone = _isAWalkingZone;

    updateRectangleWithScale(itemSprite.image, itemSprite.worldX, itemSprite.worldY, itemSprite.scale, itemSprite.collisionRectangle);

    _viewManager.setObjectCanvasAndContext(itemSprite);

    _arrSprites.push(itemSprite);

    return itemSprite;
};

function addAnimationFrame(_viewManager, _animation, _imageName, _duration) 
{
    var tmpResource =_viewManager.getBitmapManagerInstance().getImageByName(_imageName);
    _animation.createFrame(tmpResource, 0, 0, tmpResource.width, tmpResource.height, 0, 0, 0, 0, _duration);
}    
