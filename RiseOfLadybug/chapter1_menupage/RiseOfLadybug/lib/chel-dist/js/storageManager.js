// Thanks to: http://people.w3.org/mike/localstorage.html
function StorageManager () 
{ 
	StorageManager.prototype.initWith = function (_localSroteNameSpace)
	{
		this.m_arrImages = [];
		this.m_localStoreNameSpace = '';
		this.m_bLocalStoreInitialized = false;

		// Initialize
		this.m_localStoreNameSpace = _localSroteNameSpace;
		this.m_bLocalStoreInitialized  = (this.m_localStoreNameSpace.length > 0);
	};
	
	StorageManager.prototype.fillArray = function (_key, _targetArray) 
	{
		return this.fillArray_base(_key, _targetArray, ',');
	};
	
	// Get value from storage node and split by separator char in array.
	StorageManager.prototype.fillArray_base = function (_key, _targetArray, _splitChar) 
	{
		var result = false;
		var tmpValue = this.getItem(_key);
		
		if (tmpValue != null && _targetArray != null)
		{
			emptyArray(_targetArray);
			var splitted = tmpValue.split(_splitChar);
			
			for (var i = 0; i < splitted.length; i++)
				_targetArray.push(splitted[i]);
		}
	
		return result;
	};
	
	StorageManager.prototype.getItem = function (_key) 
	{
		if (this.m_bLocalStoreInitialized == true)
			return localStorage.getItem(this.m_localStoreNameSpace + "." + _key);
		else
			return null;
	};

	StorageManager.prototype.setValue = function (_key, _value) 
	{
		if (this.m_bLocalStoreInitialized == true)
		{
			localStorage.setItem(this.m_localStoreNameSpace + "." + _key, _value);
		}
	};
	
	StorageManager.prototype.clear = function () 
	{
		if (this.m_bLocalStoreInitialized == true)
		{
			localStorage.clear();
		}
	};
	
	StorageManager.prototype.showAll = function () 
	{
		if (this.m_bLocalStoreInitialized == true)
		{
			msglog(' ');
			msglog('----------------------------------------');
			msglog('Storage namespace:' + this.m_localStoreNameSpace);
		 
		   for (var i=0; i <= localStorage.length-1; i++)
		   {
			 var key = localStorage.key(i);
			 var value = localStorage.getItem(key);
			 msglog('   key:' + key + ', value:' + value);
		   }
 			msglog(' ');
		}
	}
}

