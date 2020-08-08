// Class Fade
function Fade () 
{
	Fade.prototype.initWith = function (_steps, _color)
	{
		this.m_steps = _steps; 
		this.m_color = _color;
		this.m_waitStepsBeforeEnd = 0;
		this.m_waitStepsBeforeStart = 0;

		this.reset();
	}

	Fade.prototype.handleInputs = function () 
	{ 
	}
	
	Fade.prototype.implementGameLogic = function () 
	{
		if (this.m_fadeEnded === true)
			return;
			
		if (this.m_waitStepsBeforeStart > 0 && 
			this.m_waitStepsBeforeStartCounter < this.m_waitStepsBeforeStart)
		{
			this.m_waitStepsBeforeStartCounter++;
		}

		if (this.m_waitStepsBeforeStartCounter >= this.m_waitStepsBeforeStart)
		{
			if (this.m_currentStep < this.m_steps)
			{
				this.m_currentStep++;
				this.m_alpha = this.m_currentStep / this.m_steps;
			}
			else
			{
				if (this.m_waitStepsBeforeEnd > 0)
				{
					this.m_waitStepsBeforeEndCounter++;
				}

				if (this.m_waitStepsBeforeEndCounter >= this.m_waitStepsBeforeEnd)
					this.m_fadeEnded = true;
			}
		}
	}
	
	Fade.prototype.render = function (_canvas, _context)
	{

		renderRectangle(
			_context, 
			0, 
			0, 
			_canvas.width, 
			_canvas.height, 
			this.m_color, 0, 0, this.m_alpha)

	}

	Fade.prototype.isEnded = function ()
	{
		return this.m_fadeEnded === true;
	}

	Fade.prototype.setWaitStepsBeforeEnd = function (_waitStepsBeforeEndCounter)
	{
		this.m_waitStepsBeforeEnd = _waitStepsBeforeEndCounter;
	}

	Fade.prototype.setWaitStepsBeforeStart = function (_waitStepsBeforeStartCounter)
	{
		this.m_waitStepsBeforeStart = _waitStepsBeforeStartCounter;
	}

	Fade.prototype.reset = function ()
	{
		this.m_currentStep = 0;
		this.m_fadeEnded = false;
		this.m_alpha = 0;
		this.m_waitStepsBeforeEndCounter = 0;
		this.m_waitStepsBeforeStartCounter = 0;
	}
}
