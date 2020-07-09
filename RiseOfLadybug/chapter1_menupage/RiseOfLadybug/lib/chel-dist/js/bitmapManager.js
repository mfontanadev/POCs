// Class BitmapManager:
//    Load and manage images.

BitmapManager.self = null;

function BitmapManagerItem () 
{ 
	this.m_originalBitmap = null;
	this.m_bitmap = null;
	this.m_canvas = null;
	this.m_itemIndex = -1;
}

function BitmapManager () 
{ 
	BitmapManager.self = this;

	BitmapManager.prototype.initDefault = function ()
	{
		msglog('INIT BITMAPS:initDefault');

		BitmapManager.self = this;

		this.m_items = new Array();
		this.m_filenames = new Array();

		this.m_idProgressBar = null;
		this.m_progressBarMessage = "";

		this.m_onLoadedCallback = null;
		this.m_onFilterCallback = null;
		this.m_document = null;

		this.m_managerAvailable = true;
	}

	BitmapManager.prototype.initWith = function (_filenames, _callback, _progressBar)
	{
		msglog('INIT BITMAPS:initWith');

		BitmapManager.self = this;
	
		this.initDefault();

		this.setFilenamesArray(_filenames);
        this.m_idProgressBar = _progressBar;
		this.m_onLoadedCallback = null;
	};

	BitmapManager.prototype.setProgressBar = function (_idProgressBar)
	{
		this.m_idProgressBar = _idProgressBar;
	};

	BitmapManager.prototype.setProgressBarMessage = function (_progressBarMessage)
	{
		this.m_progressBarMessage = _progressBarMessage;
	};

	BitmapManager.prototype.setFilenamesArray = function (_filenames)
	{
		this.m_filenames = _filenames;
	};

	BitmapManager.prototype.setOnLoadedEventListener = function (_callback)
	{
		this.m_onLoadedCallback = _callback;
	};

	BitmapManager.prototype.getLoadedEventListener = function ()
	{
		return this.m_onLoadedCallback;
	};

	BitmapManager.prototype.setBitmapFilter = function (_document, _filterCallback)
	{
		this.m_onFilterCallback = _filterCallback;
		this.m_document = _document; 
	};

	BitmapManager.prototype.performAsynchLoad = function ()
	{
		this.performAsynchLoadBase
		(
			this.m_filenames,
			this.m_onLoadedCallback,
			BitmapManager.self
		);
	};
	
	BitmapManager.prototype.performAsynchLoadBase = function(arr, _callback, _owner)
	{
		msglog('BitmapManager START LOADING');

		var timeoutRunning = true;
		var loadedResourceCount = 0;
		var arr = (typeof arr != "object") ? [arr] : arr;

		if (arr.length === 0 || _owner.m_managerAvailable === false)
		{
			_owner.m_managerAvailable = false;
			exitLoading();
		}
		else
		{
			function updateProgressBar()
			{
				loadedResourceCount++;

				if (arr.length > 0)
				{
					var percent = (Math.floor((loadedResourceCount / arr.length) * 100));
					if ( (typeof _owner.m_idProgressBar !== 'undefined') && (_owner.m_idProgressBar !== null) )
	                {
	                    chUpdadeInfoControlTextCanvas(_owner.m_idProgressBar, "Loading bitmaps: " + percent + "%");
	                }
				}
				
				if (loadedResourceCount === arr.length)
				{
					msglog('BitmapManager END LOADING');
					exitLoading();
				}
			}
			
			// Set timeout to avoid loading process tilt.
			window.setTimeout(loadingTimeout, 1000 * 10);

			//var newImage = null;
			var newImage = null;
			for (var i=0; i < arr.length; i++)
			{
				newItem = new BitmapManagerItem();
				newItem.m_originalBitmap = new Image();
				newItem.m_originalBitmap.src = arr[i];
				// Use alt property to keep image index.
				newItem.m_originalBitmap.alt = i;		
				BitmapManager.self.m_items.push(newItem);
				
				newItem.m_originalBitmap.onload = function(_event)
				{
					itemIndex = this.alt;
					item = BitmapManager.self.m_items[itemIndex];

					msglog('BitmapManager resource loaded:' + this.src + ", itemIndex=" + itemIndex);

					item.m_itemIndex = itemIndex;
					if (BitmapManager.self.m_onFilterCallback != null)
					{
						item.m_bitmap = BitmapManager.self.m_onFilterCallback(BitmapManager.self.m_document, item);
					}
					else
					{
						item.m_bitmap = item.m_originalBitmap; 
					}

					updateProgressBar();
				};
				
				newItem.m_originalBitmap.onerror=function()
				{
					msglog('ERROR: BitmapManager resource loaded:' + this.src);
					_owner.m_managerAvailable = false;
					updateProgressBar();
				}
			}

			function loadingTimeout()
			{
				if (timeoutRunning === true)
				{
					msglog('BitmapManager TIMEOUT');
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
	
	BitmapManager.prototype.getIdByName = function (_name, _wholeWord) 
	{
		var result = -1;

		if (this.m_managerAvailable === true)
		{
			if (_wholeWord === true)
			{
				for (var i=0; i < this.m_filenames.length; i++)
				{
					if (this.m_filenames[i] === _name)
					{
						result = i;
						break;
					}
				}	
			}
			else
			{
				for (var i=0; i < this.m_filenames.length; i++)
				{
					if (this.m_filenames[i].indexOf(_name) != -1)
					{
						result = i;
						break;
					}
				}	
			}	
		}

		return result;
	};

	BitmapManager.prototype.progressBarVisibility = function(_visible)
	{ 
		if (typeof BitmapManager.self.m_idProgressBar !== 'undefined' && 
			BitmapManager.self.m_idProgressBar !== null)
			{
				BitmapManager.self.m_idProgressBar._visible = _visible;
			}
	};
	
	BitmapManager.prototype.getImage = function (_index) 
	{
		if (_index >= 0 && _index < this.m_items.length)
			return this.m_items[_index].m_bitmap;
		else
			return null;
	};

	BitmapManager.prototype.getOriginalImage = function (_index) 
	{
		if (_index >= 0 && _index < this.m_items.length)
			return this.m_items[_index].m_originalBitmap;
		else
			return null;
	};

	BitmapManager.prototype.getImageByName = function (_name) 
	{
		return this.getImage(this.getIdByName(_name));
	};

	BitmapManager.prototype.getOriginalImageByName = function (_name) 
	{
		return this.getOriginalImage(this.getIdByName(_name));
	};

	BitmapManager.prototype.applyFilterToImage = function (_name, _document, _callbackFilter) 
	{
		var result = null;
		var imageId = -1;

		imageId = this.getIdByName(_name);
		if (imageId !== -1) 	
		{			
			item = this.m_items[imageId]; 
			item.m_bitmap = _callbackFilter(_document, item);
			result = item.m_bitmap;
		}

		return result;
	};

	this.initDefault();
}
