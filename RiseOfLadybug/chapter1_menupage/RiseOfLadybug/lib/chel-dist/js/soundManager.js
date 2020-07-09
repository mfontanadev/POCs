// Class SoundManager:
//    Load and manage sounds. 

SoundManager.self = null;

function SoundManager()
{
	SoundManager.self = this;

	SoundManager.prototype.initDefault = function() 
	{
		msglog('INIT SOUND:initDefault');
		
		SoundManager.self = this;

		this.m_items = new Array();
		this.m_filenames = new Array();

		this.m_idProgressBar = null;
		this.m_progressBarMessage = "";

		this.m_onLoadedCallback = null;

		this.m_managerAvailable = false;
		this.m_firstInit = false;
	};

	SoundManager.prototype.initializaSoundPlugin = function() 
	{
		this.m_managerAvailable = createjs.Sound.initializeDefaultPlugins();

		if (this.m_managerAvailable === false)
		{
			msglog('INIT SOUND initializaSoundPlugin: ERROR.');
        }
        else
        {
			msglog('INIT SOUND initializaSoundPlugin: OK');
        }
	};

	SoundManager.prototype.initWith = function (_filenames, _callback, _progressBar)
	{
		msglog('INIT SOUND:initWith');

		SoundManager.self = this;
	
		this.initDefault();

		this.setFilenamesArray(_filenames);
        this.m_idProgressBar = _progressBar;
		this.m_onLoadedCallback = null;
	};

	SoundManager.prototype.setProgressBar = function (_idProgressBar)
	{
		this.m_idProgressBar = _idProgressBar;
	};

	SoundManager.prototype.setProgressBarMessage = function (_progressBarMessage)
	{
		this.m_progressBarMessage = _progressBarMessage;
	};

	SoundManager.prototype.setFilenamesArray = function (_filenames)
	{
		this.m_filenames = _filenames;

		// Default sounds
		this.m_filenames.push({src:"/lib/nosound.wav", id:-1});
		this.m_filenames.push({src:"/lib/soundtest.mp3", id:-2});
	};

	SoundManager.prototype.setOnLoadedEventListener = function (_callback)
	{
		this.m_onLoadedCallback = _callback;
	};

	SoundManager.prototype.getLoadedEventListener = function ()
	{
		return this.m_onLoadedCallback;
	};

	SoundManager.prototype.performAsynchLoad = function ()
	{
		this.performAsynchLoadBase
		(
			this.m_filenames,
			this.m_onLoadedCallback,
			SoundManager.self
		);
	};

	SoundManager.prototype.performAsynchLoadBase = function(arr, _callback, _owner)
	{
		msglog('SoundManager START LOADING');

		var timeoutRunning = true;

		var loadedResourceCount = 0;
		
		SoundManager.self.m_items = (typeof arr != "object") ? [arr] : arr;

		if (SoundManager.self.m_items.length === 0 || _owner.m_managerAvailable === false)
		{
			_owner.m_managerAvailable = false;
			exitLoading();
		}
		else
		{
			function updateProgressBar()
			{
				loadedResourceCount++;

				if (SoundManager.self.m_items.length > 0)
				{
					var percent = (Math.floor((loadedResourceCount / SoundManager.self.m_items.length) * 100));
					if ( (typeof _owner.m_idProgressBar !== 'undefined') && (_owner.m_idProgressBar !== null) )
	                {
	                    chUpdadeInfoControlTextCanvas(_owner.m_idProgressBar, "Loading sounds: " + percent + "%");
	                }
				}
				
				if (loadedResourceCount === SoundManager.self.m_items.length)
				{
					msglog('SoundManager END LOADING');
					exitLoading();
				}
			};
			
			// Set timeout to avoid loading process tilt.
			window.setTimeout(loadingTimeout, 1000 * 10);

			// Iterate all filenames and perform load process.
			try
			{
				createjs.Sound.alternateExtensions = ["mp3"];	// add other extensions to try loading if the src file extension is not supported
				createjs.Sound.addEventListener("fileload", onLoad);
				createjs.Sound.registerSounds(SoundManager.self.m_items);
			}
			catch (e)
			{
				msglog('SoundManager ERROR. Exception = ' + e);
	            onError(null);
			}

			function onLoad(event)
			{
				msglog('SoundManager resource loaded:' + event.src);
				updateProgressBar();
			};

			function onError(event)
			{
				msglog('ERROR: SoundManager resource loaded:' + event.src);
				_owner.m_managerAvailable = false;
				updateProgressBar();
			};

			function loadingTimeout()
			{
				if (timeoutRunning === true)
				{
					msglog('SoundManager TIMEOUT');
					_owner.m_managerAvailable = false;
					exitLoading();
				}
			}
		}

		function exitLoading()
		{
			timeoutRunning = false;
			_owner.progressBarVisibility(false);
			_callback();
		}
	};

	SoundManager.prototype.getIdByName = function(_name, _wholeWord)
	{ 
		var result = -1;

		if (this.m_managerAvailable === true)
		{
			if (_wholeWord === true)
			{
				for (var i = 0; i < this.m_items.length; i++) 
				{
					if ( this.m_items[i].src === _name)
						result = this.m_items[i].id;
				}
			}
			else
			{
				for (var i = 0; i < this.m_items.length; i++) 
				{
					if ( this.m_items[i].src.indexOf(_name) != -1)
						result = this.m_items[i].id;
				}
			}
		}
		return result;
	}

	SoundManager.prototype.progressBarVisibility = function(_visible)
	{ 
		if (typeof SoundManager.self.m_idProgressBar !== 'undefined' && 
			SoundManager.self.m_idProgressBar !== null)
		{
			SoundManager.self.m_idProgressBar._visible = _visible;
		}
	};

	SoundManager.prototype.getSound = function (_index) 
	{
		if (_index >= 0 && _index < this.m_items.length)
			return this.m_items[_index];
		else
			return null;
	};
	
	SoundManager.prototype.getSoundByName = function (_name) 
	{
		return this.getSound(this.getIdByName(_name));
	};


	// Trick to apple devices. Play a muted sound after user clic to enable sounds.
	SoundManager.prototype.initFirstSound = function(_id) 
	{
		if (this.m_firstInit === false)
		{
			this.m_firstInit = true;
			this.play(-1);
		}
	};

	SoundManager.prototype.playSoundTest = function(_id) 
	{
		this.play(-2);
	};

	SoundManager.prototype.play = function(_id, _infitineLoop) 
	{
		if (this.m_managerAvailable === true)
		{
			var loop = 0;
			if (_infitineLoop === true)
			{
				loop = -1;
			}
			
			//Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
            var instance = createjs.Sound.play(_id, createjs.Sound.INTERRUPT_ANY, 0, 0, loop, 1);

            if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) 
			{
				msglog("play sound fail id=" + _id);
				return; 
			}

			instance.addEventListener ("complete", function(instance) 
			{
				//msglog("audio complete");
			});

			return instance;
		}
	};

	SoundManager.prototype.playSoundByName = function(_name) 
	{
		var soundId = this.getSoundByName(_name);
		this.play(soundId);
	}

	SoundManager.prototype.stop = function(_id) 
	{
		if (this.m_managerAvailable === true)
		{
			createjs.Sound.stop(_id);
		}
	};

	SoundManager.prototype.playSoundByName = function(_name) 
	{
		var soundId = this.getSoundByName(_name);
		this.stop(soundId);
	}

	this.initDefault();
	this.initializaSoundPlugin();
}