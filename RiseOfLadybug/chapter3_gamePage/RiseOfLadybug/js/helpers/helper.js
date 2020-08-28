function addAnimationFrame(_viewManager, _animation, _imageName, _duration) 
{
    var tmpResource =_viewManager.getBitmapManagerInstance().getImageByName(_imageName);
    _animation.createFrame(tmpResource, 0, 0, tmpResource.width, tmpResource.height, 0, 0, 0, 0, _duration);
}    

function renderSky(_viewManager, _skyHeight, _offset) 
{
    var cw = _viewManager.m_canvasEx.m_canvas.width;
    var ch = _viewManager.m_canvasEx.m_canvas.height;

    _viewManager.m_canvasEx.m_context.save();
    var grd = _viewManager.m_canvasEx.m_context.createLinearGradient(0, ((_skyHeight + ch) * -1) + _offset, 0, ch + _offset);

    grd.addColorStop(0, rgbaToColor(3, 12, 18, 1));
    grd.addColorStop(0.1, rgbaToColor(0, 0, 64, 1));
    grd.addColorStop(0.2, rgbaToColor(33, 122, 180, 1));
    grd.addColorStop(1, rgbaToColor(219, 248, 243, 1));

    // Fill with gradient
    _viewManager.m_canvasEx.m_context.fillStyle = grd;
    _viewManager.m_canvasEx.m_context.fillRect(0, 0, cw, ch)

    // Restore 
    _viewManager.m_canvasEx.m_context.restore();
}    

function drawImageFromSprite(_sprite)
{
    drawImage(	_sprite.m_canvas, 
                _sprite.m_context, 
                _sprite.m_image,
                _sprite.m_screenX, 
                _sprite.m_screenY,
                _sprite.m_rotation,
                _sprite.m_alpha,
                _sprite.m_scale,
                0,
                0,
                _sprite.m_flip);
}
