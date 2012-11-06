/**
 * @version beta
 * 
 */
/** @private */ var arelTEST = false;	

//(
//	function(window, undefined)
//	{
		/** @class main object arel
		  */
		var arel = 
		{		
			/** @private */
			readyCallback : undefined,
			
			/** @private */
			sceneReadyCallback : undefined,
			
			/** @private */
			readyCalled : false,
			
			/** @private */
			sceneReadyCalled : false,
			
			/** @private */
			isReady : false,
			
			/** @private */
			sceneIsReady : false,
			
			/** @private */
			commandQueue : [],
			
			/** @private */
			commandCachePerObject : {},
			
			/** @private */
			callbackMethodIterator: 0,
			
			/** @private */
			objectIdIterator: 0,
			
			/**
			 * Dummy interface for plugins 
			 *
			 * @class Dummy Interface for Plugins
			 */
			Plugin :
			{
				//to be extended by developers
			},
			
			/** @private */
			Config :
			{
				/** @private */
				OBJECT_INTERFACE_CATEGORY : "object",
				
				/** @private */
				OBJECT_POI : "poi",
				/** @private */
				OBJECT_MODEL3D : "3d",
				/** @private */
				OBJECT_IMAGE3D : "image3d",
				/** @private */
				OBJECT_MOVIE3D : "movie3d",
				
				/** @private */
				OBJECT_STATE_LOADING: "loading",
				
				/** @private */
				OBJECT_STATE_READY: "ready",
				
				/** @private */
				SCENE_CATEGORY : "scene",
				/**
				 *  @private
				 */
				COMMAND_DELIMITER : ";"
			},
			/**
			 * Debugging class, which will automatically generate a view on your GUI to see debugging information 
			 *
			 * @class Debugging information
			 */
			Debug :
			{
				/** @private */
				active : false,
				
				/** @private */
				ready : false,
				
				/** @private */
				activeBrowser : false,
				
				/** @private */
				stream: true,
				
				/** @private */
				LOG : "log",
				
				/** @private */
				ERROR : "error",
				
				/**@private */
				LOGSTREAM: "logstream",
				
				/** @private */
				debugContainer : undefined,
				
				/** @private */
				debugContainerID : "arelDebugConsole",
				
				/**
				 * Activate the Debugger
				 */
				activate : function()
				{
					if(!arel.Debug.ready)
					{
						arel.Debug.active = true;
						
						arel.Debug.debugContainer = document.createElement('div');
						arel.Debug.debugContainer.id = arel.Debug.debugContainerID;
						arel.Debug.debugContainer.setAttribute("style", "font-family: Helvetica, Arial, sans-serif; margin: 0; font-size: .7em; position: absolute; top: 5px; left: 0px; z-index: 1000; width: 90%; height: 20%; background-color: white; overflow: scroll; padding: 5px;");
						
						var container = document.createElement('div');
						var txt = document.createTextNode("AREL Debug console");
						container.setAttribute("style", "font-weight: bold; padding: 0px 0px 10px 0px");
						container.appendChild(txt);
						
						arel.Debug.debugContainer.appendChild(container);						
					
					
						//the element is attached to the body, once arel is ready -> see arel.readyforexecution
						if(arel.isReady)
						{
							arel.Debug.setDebugContainer();
						}
					}
				},
				
				/**
				 * @private
				 */
				setDebugContainer : function()
				{
					if(!arel.Debug.ready)
					{
						document.body.appendChild(arel.Debug.debugContainer);
						arel.Debug.ready = true;
					}								
				},
				
				/**
				 * Deactivate the Debugger
				 */
				deactivate : function()
				{
					arel.Debug.active = false;
					arel.Debug.ready = false;
					
					//remove the element
					var parent = document.getElementById(arel.Debug.debugContainerID).parentNode;
					var debugConsole = document.getElementById(arel.Debug.debugContainerID);
					parent.removeChild(debugConsole);					
				},
				
				/**
				 * Activate the arel log stream. Make sure the debugger is activated. This will return some general information on 
				 * what is happening in the background to double check functionality.
				 */
				activateArelLogStream : function()
				{
					arel.Debug.stream = true;
				},
				
				/**
				 * Deactivate the arel log stream. 
				 */
				deactivateArelLogStream : function()
				{
					arel.Debug.stream = false;
				},
				
				/** @private */
				logStream : function(_msg)
				{
					if(arel.Debug.active && arel.Debug.stream && arel.sceneIsReady)
					{
						arel.Debug.out(_msg, arel.Debug.LOGSTREAM);
					}
				},
				
				/**
				 * log a given information
				 * @param {String} toBeLogged Information to be shown in the Debug window
				 */
				log : function(_object)
				{
					var string = JSON.stringify(_object);
										
					arel.Debug.out("Log: " + string, arel.Debug.LOG);
				},
				
				/**
				 * log a given information and mark it as error
				 * @param {String} toBeLogged Information to be shown in the Debug window
				 */
				error : function(_object)
				{
					try
					{
						var string = JSON.stringify(_object);
						var addInfo = "";
						
						//does not work on iPhone
						/*if(_error !== undefined)
						{
							addInfo	= " (file: " + _error.fileName.replace(/^.*[\\\/]/, '') + ", line: " + _error.lineNumber + ", message: " + _error.message + ")";
						}*/
						
						arel.Debug.out("Error" + addInfo + ": " + string, arel.Debug.ERROR);
					}
					catch(e)
					{
						arel.Debug.out("Error: " + e, arel.Debug.ERROR);
					}
				},
				/**
				 * @private
				 */
				out : function(_string, type)
				{
					if(arel.Debug.debugContainer !== undefined && document.getElementById(arel.Debug.debugContainerID) !== null)
					{
						var container = document.createElement('div');
					
						if(type === arel.Debug.LOG)
						{
							container.setAttribute("style", "color: #333");
						}
						else if(type === arel.Debug.LOGSTREAM)
						{
							container.setAttribute("style", "font-style: italic");
						}
						else if(type === arel.Debug.ERROR)
						{
							container.setAttribute("style", "color: #f33");
						}
						
						var txt = document.createTextNode(_string);
						container.appendChild(txt);
						document.getElementById(arel.Debug.debugContainerID).insertBefore(container, document.getElementById(arel.Debug.debugContainerID).firstChild);
					}
				}				
			},
			/**
			 * Define different tracking types
			 *
			 * @class Tracking
			 */
			Tracking :
			{
				/**
				 * The coordinateSystem is currently tracking. This can be used to determine a coordinateSystem as detected.
				 * @constant
				 *  
				 */
				STATE_TRACKING : "tracking",
				
				/**
				 * The coordinateSystem is currently not tracking, however the attached models are still visible due to smoothing.
				 * @constant
				 *  
				 */
				STATE_EXTRAPOLATED : "extrapolated",
				
				/**
				 * The coordinateSystem is currently not tracking. This can be used to determine a coordinateSystem as lost.
				 * @constant
				 *  
				 */
				STATE_NOTTRACKING : "not_tracking",
				
				/**
				 * Tracking type GPS
				 * @constant
				 *  
				 */
				GPS : "GPS",
				
				/**
				 * Tracking type LLA Marker
				 * @constant
				 *  
				 */
				LLA_MARKER : "LLA",
				
				/**
				 * Tracking type Barcode and QR Codes
				 * @constant
				 *  
				 */
				BARCODE_QR : "Code",
				
				/**
				 * Tracking type Markerless 3D Tracking
				 * @constant
				 *  
				 */
				MARKERLESS_3D : "ML3D",
				
				/**
				 * Tracking type Markerless 2D Tracking aka Imagetracking
				 * @constant
				 *  
				 */
				MARKERLESS_2D : "ML2D",
				
				/**
				 * Tracking type ID Marker tracking
				 * @constant
				 *  
				 */
				MARKER : "Marker",
				
				/**
				 * Tracking type Other fallback
				 * @constant
				 *  
				 */
				OTHER : "other"
								
				//if something is added check in arel.Scene.setTrackingConfiguration that this is also not allowed if necessary 
				
			},
			/** @private */ 
			Error :
			{
				/** @private */ 
				write : function(_msg)
				{
					if(arel.Debug.active)
					{
						arel.Debug.error(_msg);
						return false;
					}
					else if(arelTEST)
					{
						return "ERROR: " + _msg;						
					}			
					else
					{
						alert("ERROR: " + _msg);
						return false;
					}
				}
			},	
			/** @private */
			SceneCache :
			{
				id : undefined
			},
			
			//by http://forums.digitalpoint.com/showthread.php?t=146094
			/** @private */
			include : function(filename)
			{
			    var head = document.getElementsByTagName('head')[0];
		
			    var script = document.createElement('script');
			    script.src = filename;
			    script.type = 'text/javascript';			    		
			    head.appendChild(script);
			},	
			
			/**
			 * Attach a function call when AREL is ready to go
			 * @param {function} startCallback Method to be called, once all arel JS is loaded
			 * @param {Boolean} activateDebugging Set to true, if the debugging console should be used
			 * @param {Boolean} useInBrowser Set to true if the command is used in the Browser first
			 */
			ready : function(startCallback, activateDebugging, useInBrowser)
			{
				if(useInBrowser)
				{
					arel.Debug.activeBrowser = true;	
				}
				
				if(activateDebugging)
				{
					arel.Debug.activate();	
					arel.Debug.logStream("AREL is ready for execution.")
				}
								
				arel.readyCallback = startCallback;
				
				if(arel.isReady)
				{
					if(typeof(arel.readyCallback) === "function" && arel.readyCalled === false)
					{
						arel.readyCalled = true;	
						arel.readyCallback();
						arel.ClientInterface.arelReady();									
					}
				}				
			},
			
			/**
			 * Attach a function call when the scene is ready
			 * @param {function} startCallback Method to be called, once all objects are loaded and the scene is ready
			 * @param {Boolean} activateDebugging Set to true, if the debugging console should be used
			 * @param {Boolean} useInBrowser Set to true if the command is used in the Browser first
			 */
			sceneReady : function(startCallback, activateDebugging, useInBrowser)
			{
				if(useInBrowser)
				{
					arel.Debug.activeBrowser = true;	
					arel.Debug.logStream("Scene is ready.")
				}
				
				if(activateDebugging)
				{
					arel.Debug.activate();					
				}

				arel.sceneReadyCallback = startCallback;
				
				if(arel.sceneIsReady)
				{
					if(typeof(arel.sceneReadyCallback) === "function" && arel.sceneReadyCalled === false)
					{
						//just in case the arel ready has not been called, call it here
						//this will not be sent to the client anymore, since the client triggers the scene ready
						if(arel.readyCalled === false)
						{
							arel.readyCalled = true;	
							arel.readyCallback();							
						}
						
						arel.sceneReadyCalled = true;	
						arel.sceneReadyCallback({'id' : arel.SceneCache.id});															
					}
				}				
			},
			/** @private */
			sceneIsReadyForExecution : function()
			{
				if(typeof(arel.sceneReadyCallback) === "function" && arel.sceneReadyCalled === false)
				{
					arel.sceneReadyCalled = true;	
					arel.sceneReadyCallback({'id' : arel.SceneCache.id});	
				}
				
				arel.sceneIsReady = true;
			},
			/** @private */
			readyforexecution : function(startCallback)
			{
				//append the debugging containter, if debugging is wished -> just in case it was not attached when the call was made
				if(arel.Debug.active)
				{
					arel.Debug.setDebugContainer();
				}
					
				if(typeof(arel.readyCallback) === "function" && arel.readyCalled === false)
				{
					arel.readyCallback();
					arel.readyCalled = true;														
				}
				
				if(!arel.isReady)
				{
					arel.ClientInterface.arelReady();
				
					//set arel ready
					arel.isReady = true;
				};				
			},
			/** @private */
			flush : function()
			{
				var out = "";
				
				if(arel.commandQueue.length > 0)
				{
					out = arel.commandQueue.join(arel.Config.COMMAND_DELIMITER);
					arel.commandQueue = [];					
				}
				
				if(typeof Android !== "undefined") {
					Android.flush(out);
				}
								
				//send it to the client
				return out;
			}	
			
		};
		
		//from http://phrogz.net/js/classes/OOPinJS2.html
		//throws error: javax.script.ScriptException: sun.org.mozilla.javascript.internal.EvaluatorException: Cannot add a property to a sealed object: arelInheritFrom. when testing?!
		/*Function.prototype.arelInheritFrom = function( parentClassOrObject ){ 
			if ( parentClassOrObject.constructor == Function ) 
			{ 
				//Normal Inheritance 
				this.prototype = new parentClassOrObject;
				this.prototype.constructor = this;
				this.prototype.parent = parentClassOrObject.prototype;
			} 
			else 
			{ 
				//Pure Virtual Inheritance 
				this.prototype = parentClassOrObject;
				this.prototype.constructor = this;
				this.prototype.parent = parentClassOrObject;
			} 
			return this;
		}*/ 
		
		//client communication
/** @author Frank Angermann
 *  @version beta
 *  @class The Object Cache
 *  @private
 */
arel.ObjectCache = 
{	
	/**
	 * Array to store the Objects.
	 * @private
	 */			
	aObjects:				[],
					
	//expects an array with Objects, as key -> attribute, value -> value OR
	//an array with arel.Objects
	/**
	 * Array to store the Objects. This will remove all currently existing objects first
	 * Expects an Array with - Example:
	 * [Object1, Object2, ...]
	 * POI (e.g. Object1):
	 * 
	 *	{"type": "poi", "id": 1, "title": "This is a POI", "location": {"lat": 49.123324234, "lng": 11.34545657, "alt": 0, "acc": 100}, "iconPath": "http://www.myIcon.com/someIcon.png", 
	 *		"thumbnailPath": "http://www.thumbnails.com/?id=sdf&test=icon", "popup": {
	 *		"bgColor": "#000000", text: "This is the coolest POI you have ever seen, there will never be anything cooler!\nWell \"this\"." , "thumbnail": "http://www.myIcon.com/someIcon.png", 
	 *		"closeButton": true, "distance": true, 
	 * 		"buttons": [
	 *	 		["Login", "url", "http://www.junaio.com/login.php"], ["Cool Image", "image", "http://www.junaio.com/publisherDownload/image.png"]]}}
	 *	
	 * 
	 * Model3D (e.g.Object2):
	 * 
	 *	{"type": "3d", "id": 2, "coordinateSystemID": 1, "transparency": 122, "renderorderposition": 1, "picking": true, "title": "POI2", "location": {"lat": 49.123324234, "lng": 11.34545657, "alt": 0, "acc": 200}, "iconPath": "http://www.myIcon.com/someIcon.png", 
	 *	"thumbnailPath": "http://www.thumbnails.com/?id=sdf&test=icon", "billboard": false, "translation": {"x": 0, "y": 0, "z": -1500}, "model": "/resources/mainModel.md2_enc", "texture": "/resources/theTexture.png", 
	 *	"rotation": "0,0,90", "scale": "4,3,3", "popup": {
	 *	"bgColor": "#123456", "text": "This is the coolest POI you have ever seen, there will never be anything cooler!\nWell \"this\". ", thumbnail: "http://www.myIcon.com/someIcon.png", 
	 *	buttons: [
	 *		["Login", "url", "http://www.junaio.com/login.php"], ["Cool Image", "image", "http://www.junaio.com/publisherDownload/image.png"]]}}
	 *	
	 * 
	 *  Also see the file (method addObject for all parameters). 
	 *  @param {array} ObjectArray Array of objects
	 * @private
	 */	 
	setObjects:				function(_aObjects)
							{
								//remove the old Objects
								this.removeObjects();
								
								//overriding is not possible, so we check whether the passed element is an array with elements of type Object
								for(var i in _aObjects)
								{
									if (typeof(_aObjects[i]) !== "function")
									{
										this.addObject(_aObjects[i]);
									}
								}																
							},
	/**
	 * Sets a single object (see examples above). Just not in an array ;)
	 * @param {array|jsObject} objectInformation array with object information to store as a arel.Object.Object3d or arel.POI
	 */		
	addObject:				function(_object)
							{
								//overriding is not possible, so we check whether the passed element is am instance Object
								if(_object instanceof arel.Object)
								{
									//set the state of the object still to loading
									_object.setState(arel.Config.OBJECT_STATE_LOADING);
									
									//add it to the cache array
									if(_object.getID() !== undefined)
									{
										this.aObjects[_object.getID()] = _object;
									
										return true;
									}
									else
									{
										return arel.Error.write("Object is missing an ID.");
									}
								}
								else if(typeof(_object) !== "function")
								{
									var object = undefined;
									
									if(_object.hasOwnProperty('type'))
									{
										if(_object.type === arel.Config.OBJECT_POI)
										{
											object = new arel.Object.POI();
										}
										else if(_object.type === arel.Config.OBJECT_MODEL3D)
										{
											object = new arel.Object.Model3D();
										}
										else if(_object.type === arel.Config.OBJECT_MOVIE3D)
										{
											object = arel.Object.Model3D.createFromMovie();
											
										}
										else if(_object.type === arel.Config.OBJECT_IMAGE3D)
										{
											object = arel.Object.Model3D.createFromImage();
										}
										else
										{
											return arel.Error.write("ERROR: Unknown object category");
										}
										
										//parse the object
										object.create(_object);
										
										if(object.getID() !== undefined)
										{
											//set the state of the object still to loading
											object.setState(arel.Config.OBJECT_STATE_LOADING);
											
											//add it to the cache array
											this.aObjects[object.getID()] = object;
											
											return true;
										}
										else
										{
											return arel.Error.write("Object is missing an ID.");
										}
									}
									else
									{
										return arel.Error.write("An object category must be given.");
									}
								}
															
							},	
	/**
	 * Returns all Objects currently rendered in the scene
	 * @return {array} array with arel.Object.Object3d and/or arel.POI
	 * @private
	 */			
	getObjects:				function()
							{
								//the elements of the object have to be put in a new object to avoid "passing by coordinateSystem"
								//this way it is a new object, which is independent from the this.aObjects
								var aObjectsPassed = [];
								
								for(var i in this.aObjects)
								{
									if (typeof(this.aObjects[i]) !== "function")
									{
										aObjectsPassed[i] = this.aObjects[i];
									}
								}
								
								return aObjectsPassed;
							},
	/**
	 * Returns a single Object specified by its ID
	 * @param {string} ObjectID Alphanummeric Object ID
	 * @return {arel.Object.Object3d|arel.POI} Object requested
	 * @private
	 */
	getObject:				function(id)
							{
								if(this.aObjects[id] !== undefined && this.aObjects[id] instanceof arel.Object)
								{
									return this.aObjects[id];
								}
								else
								{
									return false;
								}
							},
	/**
	 *  Clear all Objects from the cache
	 *  @private
	 */
	removeObjects: 			function()
							{
								this.aObjects = [];
							},
	/**
	 * Remove a single Object specified by its ID
	 * @param {string} ObjectID Alphanummeric Object ID
	 * @private
	 */
	removeObject: 			function(_id)
							{
								delete this.aObjects[_id];
							},
	/**
	 * Check if an Object exists in the Cache
	 * @param {string} ObjectID Alphanummeric Object ID
	 * @return {boolean} True if Object exists, false otherwise
	 * @private
	 */
	objectExists: 			function(_id)
							{
								if(this.aObjects[_id] instanceof arel.Object)
								{
									return true;
								}
								else
								{
									return false;
								}
							},
	/**
	 * Change the state of an object to ready
	 * @param {string} ObjectID Alphanummeric Object ID
	 * @private
	 */
	setObjectStateToReady: 	function(_id)
							{
								this.aObjects[_id].setState(arel.Config.OBJECT_STATE_READY);
							}			
};/** 
 *	@author Frank Angermann
 *  @version beta
 * 
 *  @class "Static Class" to provide the interface to the clients via the arel protocoll
 *  @see arel.ClientInterface.scene
 *  @see arel.ClientInterface.media
 *  @see arel.ClientInterface.object
 *  @see arel.ClientInterface.navigation
 *  @private	  
 */ 
arel.ClientInterface =
{
	/** 
	 * define the protocol to be used
	 * @private */
	protocol: "arel://",
			
	/** 
	 * Scene Interface
	 * @class Does the interface scene stuff
	 * @private */				
	scene:
	{
		/** 
		 * =="scene"
		 * @constant
		 * @private */
		sceneTerm: "scene",
		
		/** 
		 * Add a single Object<br /><br />
		 * 
		 * e.g. <br />arel://scene/addObject/?thumbnailPath=http%3a%2f%2fwasgeht.co.uk%2f%3fhier%3dthumb&location=34%2c56%2c2&title=my%20Second%20POI&popupDistance=false&popupText=Das%20wird%20der%20PopupText.&iconPath=http%3a%2f%2fwww.meinIcon.de%2ficon.png&popupCloseButton=true&popupThumbnail=http%3a%2f%2fwww.junaio.com%2fthumbnail.png&popupButtonName0=name1&popupButtonValue0=value1&popupButtonName1=name2&popupButtonType0=type1&popupButtonType1=type2&popupButtonValue1=value2&category=text&popupBgColor=%23789876&id=poi23";
		 * @see arel.Object.toParameter
		 * @function
		 * @private 
		 */	
		addObject: function(_object)
		{
			//debug stream
			arel.Debug.logStream("Object added to Scene: " + _object.getID());
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/addObject/" + _object.toParameter();
			return arel.ClientInterface.out(request);
		},	
		
		/** 
		 * Clear all Objects<br /><br />
		 * arel://scene/removeObjects/
		 * 
		 * @private 
		 */
		removeObjects : function()
		{
			//debug stream
			arel.Debug.logStream("All objects removed.");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/removeObjects/";
			return arel.ClientInterface.out(request);
		},
		/** 
		 * Remove single Object<br /><br />
		 * e.g.<br />arel://scene/removeObject/?id=poi2
		 * @private 
		 */
		removeObject : function(_id)
		{
			//debug stream
			arel.Debug.logStream("Single object removed: " + _id);
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/removeObject/?id=" + _id;
			return arel.ClientInterface.out(request);
		},
		
		/** Get Scene ID<br /><br />
		 * e.g. <br />arel://scene/getID/?callbackid=123156186463513<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with an integer attached<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, 145215);
		 * 
		 * @private */
		getID : function(_callbackID)
		{
			//debug stream
			arel.Debug.logStream("asking for scene ID");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/getID/?callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);			
		},
		
		/** 
		 * switch to Scene<br /><br />
		 * e.g. <br />arel://scene/switchChannel/?id=100258
		 * @private */
		switchChannel : function(_sceneID, _params)
		{
			//debug stream
			arel.Debug.logStream("Switching Channel to " + _sceneID);
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/switchChannel/?id=" + _sceneID + _params;
			return arel.ClientInterface.out(request);
		},
		/** 
		 * switch Tracking<br /><br />
		 * e.g. <br />arel://scene/setTrackingConfiguration/?tracking=GPS<br />
		 * arel://scene/setTrackingConfiguration/?tracking=LLA<br />
		 * arel://scene/setTrackingConfiguration/?tracking=BarQR<br />
		 * arel://scene/setTrackingConfiguration/?tracking=http%3a%2f%2fwasgeht.co.uk%2f%3fhier%3dthumb%26test%3deiTest
		 * @private */
		setTrackingConfiguration : function(_tracking)
		{
			//debug stream
			arel.Debug.logStream("Changing Tracking Configuration to " + _tracking);
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/setTrackingConfiguration/?tracking=" + encodeURIComponent(_tracking);
			return arel.ClientInterface.out(request);
		},
		
		/** Start the Camera<br /><br />
		 * e.g. <br />arel://scene/startCamera
		 * @private */
		startCamera : function()
		{
			//debug stream
			arel.Debug.logStream("Starting camera.");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/startCamera";
			return arel.ClientInterface.out(request);
		},
		/** Stop the Camera<br /><br />
		 * e.g. <br />arel://scene/stopCamera
		 * @private */
		stopCamera : function()
		{
			//debug stream
			arel.Debug.logStream("Stopping camera.");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/stopCamera";
			return arel.ClientInterface.out(request);
		},
		
		/** Start the Camera<br /><br />
		 * e.g. <br />arel://scene/startTorch
		 * @private */
		startTorch : function()
		{
			//debug stream
			arel.Debug.logStream("Starting camera.");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/startTorch";
			return arel.ClientInterface.out(request);
		},
		/** Stop the Camera<br /><br />
		 * e.g. <br />arel://scene/stopTorch
		 * @private */
		stopTorch : function()
		{
			//debug stream
			arel.Debug.logStream("Stopping camera.");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/stopTorch";
			return arel.ClientInterface.out(request);
		},
		/** 
		 * Trigger a server call<br /><br />
		 * arel://scene/triggerServerSearch/<br />
		 * arel://scene/triggerServerSearch/?sendScreenshot=true<br />
		 * arel://scene/triggerServerSearch/?filter_something=wow<br />
		 * @private */
		triggerServerCall : function(params)
		{
			//debug stream
			arel.Debug.logStream("Triggering Server call.");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/triggerServerCall/" + params;
			return arel.ClientInterface.out(request);
		},
				
		/** Get Sensor values of LLA + accuracy<br /><br />
		 * e.g. <br />arel://scene/setLocation/?l=48.1,11.5,100<br /><br />
		 * 
		 * @private */
		setLocation : function(_params)
		{
			//debug stream
			arel.Debug.logStream("Setting LLA location to " + _params);
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/setLocation/" + _params;
			return arel.ClientInterface.out(request);			
		},
		
		/** Get Sensor values of LLA + accuracy<br /><br />
		 * e.g. <br />arel://scene/getLocation/?callbackid=123156186463513<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with an arel.LLA attached<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, new arel.LLA(48.1, 11.5, 0, 15));
		 * 
		 * @private */
		getLocation : function(_callbackID)
		{
			//debug stream
			arel.Debug.logStream("Requesting location.");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/getLocation/?callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);			
		},
		
		/** Get Screensot <br /><br />
		 * e.g. <br />arel://scene/getScreenshot/?callbackid=123156186463513&includeRender=true&bboxX=200&bboxY=500<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with an arel.Image attached<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, new arel.Image(_imagebuffer, _width, _height, _originUpperLeft));<br />
		 * arel.CallbackInterface.callCallbackFunction(123156186463513, new arel.Image("sfnslfn4ewo84rosf[..]", 150, 500, true));
		 * @private */
		getScreenshot : function(_paramString)
		{
			//debug stream
			arel.Debug.logStream("Requesting screenshot.");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/getScreenshot/" + _paramString;
			return arel.ClientInterface.out(request);			
		},
		
		/** Get Compass Rotation<br /><br />
		 * e.g. <br />arel://scene/getCompassRotation/?callbackid=123156186463513<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with an arel.Vector3D attached<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, 120);
		 * 
		 * @private */
		getCompassRotation : function(_callbackID)
		{
			//debug stream
			arel.Debug.logStream("Requesting compass rotation.");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/getCompassRotation/?callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		},
		
		/** Get Tracking Values<br /><br />
		 * e.g. <br />arel://scene/getTrackingValues/?callbackid=123156186463513<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with an arel.TrackingValues attached<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, new arel.TrackingValues(0,0,0,0,0,0,1,100,1));
		 * @private
		 * 
		 */
		getTrackingValues : function(_callbackID)
		{
			//debug stream
			arel.Debug.logStream("Requesting tracking values.");
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/getTrackingValues/?callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		},
		
		/** Get the id of the object hit<br /><br />
		 * e.g. <br />arel://scene/getObjectFromScreenCoordinates/?callbackid=123156186463513&X=[0..1]&Y=[0..1]<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with a string (poi ID) attached<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, "POI_ID");
		 * @private
		 */
		getObjectFromScreenCoordinates : function(coordString, _callbackID)
		{
			//debug stream
			arel.Debug.logStream("Requesting Object from screencoordinate " + coordString);
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/getObjectFromScreenCoordinates/" + coordString + "&callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		},
		
		/** Get 3D position of the intersection between the coordinateSystems's xy plane and the ray from the screen coordinate<br /><br />
		 * e.g. <br />arel://scene/get3DPositionFromScreenCoordinates/?callbackid=123156186463513&x=[0..1]&y=[0..1]<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with a arel.Vector3D attached<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, new arel.Vector3D(20, 50, 0));
		 * @private
		 */
		get3DPositionFromScreenCoordinates : function(coordString, _coordinateSystemID, _callbackID)
		{
			//debug stream
			arel.Debug.logStream("Requesting 3D coordinates for coordinate system " + _coordinateSystemID + " at screen location " + coordString);
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/get3DPositionFromScreenCoordinates/" + coordString.toUpperCase() + "&coordinateSystemID=" + _coordinateSystemID + "&callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		},
		
		/** Get 3D position of the intersection between the coordinateSystems's xy plane and the ray from the screen coordinate<br /><br />
		 * e.g. <br />arel://scene/getScreenCoordinatesFrom3DPosition/?callbackid=123156186463513&x=[0..1]&y=[0..1]&z=[0..1]<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with a arel.Vector2D attached<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, new arel.Vector2D(20, 50));
		 * @private
		 */
		getScreenCoordinatesFrom3DPosition : function(coordString, _coordinateSystemID, _callbackID)
		{
			//debug stream
			arel.Debug.logStream("Requesting 2D coordinates for coordinate system " + _coordinateSystemID + " at 3D position " + coordString);
			
			var request = arel.ClientInterface.protocol + this.sceneTerm + "/getScreenCoordinatesFrom3DPosition/" + coordString.toUpperCase() + "&coordinateSystemID=" + _coordinateSystemID + "&callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		}
	},
	/** 
	 * Interface for Objects
	 * @class Does the interface object stuff
	 * @private */
	object:
	{
		/**
		 * =="object"
		 *
		 * @private */
		objectTerm: "object",
		
		/** 
		 * update the renderer if a change on the object was done<br /><br />
		 * e.g. <br />arel://object/setEnableBillboard/?id=123&value=true<br />
		 *  arel://Object/setScale/?id=xy&scaleX=&scaleY=&scaleZ=<br />
		 *	arel://Object/setRotation/?id=xy&rotX=&rotY=&rotZ=&rotType=<br />
		 *	arel://Object/setTranslation/?id=xy&transX=&transY=&transZ=<br />
		 *  arel://Object/setLocation/?id=xy&lat=&lng=&alt=<br />
		 *  arel://Object/setScreenCoordinates/?id=xy&onScreenX=&onScreenY=<br />
		 *  arel://object/setOccluding/?id=123&value=true<br />
		 *  arel://object/setMovie/?id=123&value=someMovie.3g2<br />
		 *  arel://object/setModel/?id=123&value=someMovie.3g2<br />
		 *  arel://object/setTexture/?id=123&value=someMovie.3g2<br />
		 *  arel://Object/setTitle/?id=xy&value=<br />
		 *  arel://Object/setIcon/?id=xy&value=<br />
		 *  arel://Object/setThumbnail/?id=xy&value=<br />
		 *  arel://Object/setPopUp/?id=xy&popupBgColor=&popupText=&popupCloseButton=&popupDistance=&popupThumbnail=&popupButtonName0=&popupButtonType0=&popupButtonValue0=<br />
		 *  arel://Object/setCoordinateSystemID/?id=xy&value=<br />
		 *  arel://Object/setTransparency/?id=xy&value=<br />
		 *  arel://Object/setRenderOrderPosition/?id=xy&value=<br />
		 *  arel://Object/setPickingEnabled/?id=xy&value=<br />
		 *  arel://Object/setMaxDistance/?id=xy&value=<br />
		 *  arel://Object/setMinDistance/?id=xy&value=<br />
		 *  arel://Object/setMinAccuracy/?id=xy&value=<br />
		 *  arel://object/setVisibility/?id=123&radar=true&maplist=true&liveview=true
		 *  (for multiple buttons, multiple popupbuttonName, value and types will be send)<br />
		 *
		 * @private */		
		edit: function(id, handler, _addparams)
		{
			//debug stream
			arel.Debug.logStream("Edit object " + id + "; set" + handler);
			
			var request = arel.ClientInterface.protocol + this.objectTerm + "/set" + handler + "/?id=" + id + _addparams;
			return arel.ClientInterface.handleObjectRequest(id, request);
		},
		
		/** 
		 * Start an object's animation (only valid for md2 models)<br /><br />
		 * e.g. <br />arel://object/startAnimation/?id=123&animationname=frame&looped=true
		 * @private */
		startAnimation: function(id, _params)
		{
			//debug stream
			arel.Debug.logStream("Start animation of Object " + id);
			
			var request = arel.ClientInterface.protocol + this.objectTerm + "/startAnimation/" + _params;
			return arel.ClientInterface.handleObjectRequest(id, request);
		},
		
		/** 
		 * Stop an object's animation (only valid for md2 models)<br /><br />
		 * e.g. <br />arel://object/stopAnimation/?id=123
		 * @private */
		stopAnimation: function(id, _params)
		{
			//debug stream
			arel.Debug.logStream("stop animation of Object " + id);
			
			var request = arel.ClientInterface.protocol + this.objectTerm + "/stopAnimation/" + _params;
			return arel.ClientInterface.handleObjectRequest(id, request);
		},
		
		/** 
		 * Pause the currently playing animation of the 3D model (only valid for md2 models)<br /><br />
		 * e.g. <br />arel://object/pauseAnimation/?id=123
		 * @private */
		pauseAnimation: function(id, _params)
		{
			//debug stream
			arel.Debug.logStream("Pause animation of Object " + id);
			
			var request = arel.ClientInterface.protocol + this.objectTerm + "/pauseAnimation/" + _params;
			return arel.ClientInterface.handleObjectRequest(id, request);
		},
		
		/** 
		 * Start an object's movie texture (if applicable)<br /><br />
		 * e.g. <br />arel://object/startMovieTexture/?id=123&loop=true
		 * @private */
		startMovieTexture: function(id, _params)
		{
			//debug stream
			arel.Debug.logStream("Start movie texture of Object " + id);
			
			var request = arel.ClientInterface.protocol + this.objectTerm + "/startMovieTexture/" + _params;
			return arel.ClientInterface.handleObjectRequest(id, request);
		},
		
		/** 
		 * Start an object's movie texture (if applicable)<br /><br />
		 * e.g. <br />arel://object/startAnimation/?id=123
		 * @private */
		pauseMovieTexture: function(id, _params)
		{
			//debug stream
			arel.Debug.logStream("Pause movie texture of Object " + id);
			
			var request = arel.ClientInterface.protocol + this.objectTerm + "/pauseMovieTexture/" + _params;
			return arel.ClientInterface.handleObjectRequest(id, request);
		},
		
		/** 
		 * Start an object's movie texture (if applicable)<br /><br />
		 * e.g. <br />arel://object/startAnimation/?id=123
		 * @private */
		stopMovieTexture: function(id, _params)
		{
			//debug stream
			arel.Debug.logStream("Stop movie texture of Object " + id);
			
			var request = arel.ClientInterface.protocol + this.objectTerm + "/stopMovieTexture/" + _params;
			return arel.ClientInterface.handleObjectRequest(id, request);
		},
		
		/** Check if this Object is currently in the view of the user. Only if the Object is rendered, it can be considered to be in the current field of view.<br /><br />
		 * e.g. <br />aarel://object/isRendered/?callbackid=123123&id=sdfsdf<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with a Boolean attached<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction("123123", true);
		 * 
		 * @private */
		getIsRendered : function(paramString)
		{
			//debug stream
			arel.Debug.logStream("Requesting if object is rendered.");
			
			var request = arel.ClientInterface.protocol + this.objectTerm + "/isRendered/" + paramString;
			return arel.ClientInterface.out(request);			
		}		
	},
	
	/** 
	 * Navigation stuff
	 * @class Does the interface navigation stuff
	 * @private */
	navigate:
	{
		/** 
		 * =="navigate"
		 * @private */
		navigateTerm : "navigate",
		
		/** 
		 * Route on Google maps<br />
		 * <br />
		 * e.g.<br />	 
		 * arel://navigate/routeToOnGoogleMaps/?id=2_poi<br />
		 * arel://navigate/routeToOnGoogleMaps/?l=48.1234433%2c11.1234433%2c0<br />		  
		 * arel://navigate/routeToOnGoogleMaps/?title=My%20Home&l=48.1234433%2c11.1234433%2c0
		 * @private */
		routeToOnGoogleMaps : function(_params)
		{
			//debug stream
			arel.Debug.logStream("Route on Google maps");
			
			var request = arel.ClientInterface.protocol + this.navigateTerm + "/routeToOnGoogleMaps/" + _params;
			return arel.ClientInterface.out(request);
		}
	},
	/**
	 * media stuff
	 * @class Does the interface media stuff
	 * @private
	 */
	media:
	{
		/** 
		 * =="media"
		 * @private */
		mediaTerm : "media",
		
		/** 
		 * Work with website<br /><br />
		 * e.g.<br />
		 * arel://media/website/?action=open&external=false&url=http%3a%2f%2fwww.junaio.com<br />
		  * @private */
		website: function(_params)
		{
			//debug stream
			arel.Debug.logStream("Handling url " + _params);
			
			var request = arel.ClientInterface.protocol + this.mediaTerm + "/website/" + _params;
			return arel.ClientInterface.out(request);
		},
		
		/** 
		 * Work with sound<br /><br />
		 * e.g.<br />
		 * arel://media/sound/?fullscreen=false&action=play&url=http%3a%2f%2fwww.junaio.com%2fsomeMP3.mp3<br />
		 * arel://media/sound/?action=pause<br />
		 * arel://media/sound/?action=stop
		 * @private */
		sound: function(_params)
		{
			//debug stream
			arel.Debug.logStream("Handling sound " + _params);
			
			var request = arel.ClientInterface.protocol + this.mediaTerm + "/sound/" + _params;
			return arel.ClientInterface.out(request);
		},
		
		/** 
		 * Work with Images<br /><br />
		 * e.g.<br />
		 * arel://media/image/?action=open&url=http%3a%2f%2fwww.junaio.com%2fsomeImage.jpg<br />
		 * @private */
		image: function(_params)
		{
			//debug stream
			arel.Debug.logStream("Handling image " + _params);
			
			var request = arel.ClientInterface.protocol + this.mediaTerm + "/image/" + _params;
			return arel.ClientInterface.out(request);
		},
		
		/** 
		 * Work with video<br /><br />
		 * e.g.<br />
		 * arel://media/video/?action=open&url=http%3a%2f%2fwww.junaio.com%2fsomeMP4.mp4<br />		 
		 * @private */
		video: function(_params)
		{
			//debug stream
			arel.Debug.logStream("Handling fullscreen video " + _params);
			
			var request = arel.ClientInterface.protocol + this.mediaTerm + "/video/" + _params;
			return arel.ClientInterface.out(request);
		},
		
		/**
		 * Work with vibration <br /><br />
		 * e.g.<br />
		 * arel://media/vibrate
		 * @private 
		 */
		vibrate: function()
		{
			//debug stream
			arel.Debug.logStream("Handling vibration alert");
			
			var request = arel.ClientInterface.protocol + this.mediaTerm + "/vibrate";
			return arel.ClientInterface.out(request);
		}
		
	},
	
	/** 
	 * junaio internal stuff
	 * @class junaio internal information
	 * @private */
	junaio:
	{
		/** 
		 * =="junaio"
		 * @constant
		 * @private */
		junaioTerm: "junaio",
		
		/** authenticate the user<br /><br />
		 * e.g. <br />arel://junaio/authenticate/?callbackid=123156186463513<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with an object for user and md5 password to come back<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, { "user": "Stefan", "passwordMD5" : "3434590refg90dug094e9u509dsj" });
		 * @private
		 */
		authenticate : function(_callbackID)
		{
			var request = arel.ClientInterface.protocol + this.junaioTerm + "/authenticate/?callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		},
		
		/** signup command for the user<br /><br />
		 * e.g. <br />arel://junaio/signup/?callbackid=123156186463513<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with an object for user and md5 password to come back<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, { "user": "Stefan", "passwordMD5" : "3434590refg90dug094e9u509dsj" });
		 * @private
		 */
		signup : function(_callbackID)
		{
			var request = arel.ClientInterface.protocol + this.junaioTerm + "/signup/?callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		},
		
		/** login command for the user<br /><br />
		 * e.g. <br />arel://junaio/login/?callbackid=123156186463513<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with an object for user and md5 password to come back<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, { "user": "Stefan", "passwordMD5" : "3434590refg90dug094e9u509dsj" });
		 * @private
		 */
		login : function(_callbackID)
		{
			var request = arel.ClientInterface.protocol + this.junaioTerm + "/login/?callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		},
		
		/** logout command the user<br /><br />
		 * e.g. <br />arel://junaio/authenticate/?callbackid=123156186463513<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with a boolean confirming the logout (or not)<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, true);
		 * @private
		 */
		logout : function(_callbackID)
		{
			var request = arel.ClientInterface.protocol + this.junaioTerm + "/logout/?callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		},
		
		/** get the users history<br /><br />
		 * e.g. <br />arel://junaio/getHistory/?callbackid=123156186463513<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with an array of channel IDs<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, [4796, 7769, 102569, 112589]);
		 * @private
		 */
		getHistory : function(_callbackID)
		{
			var request = arel.ClientInterface.protocol + this.junaioTerm + "/getHistory/?callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		},
		
		/** get the users history<br /><br />
		 * e.g. <br />arel://junaio/manageFavorites/?action=add&id=12354<br />
		 * arel://junaio/manageFavorites/?action=remove&id=12354<br /><br />
		 * @private
		 */
		manageFavorites : function(_params)
		{
			var request = arel.ClientInterface.protocol + this.junaioTerm + "/manageFavorites/" + _params;
			return arel.ClientInterface.out(request);
		},
		
		/** get the users history<br /><br />
		 * e.g. <br />arel://junaio/getFavorites/?callbackid=123156186463513<br /><br />
		 * 
		 * This expects to make a call to the CallbackInterface with an array of channel IDs<br />
		 * e.g. arel.CallbackInterface.callCallbackFunction(123156186463513, [4796, 7769, 102569, 112589]);
		 * @private
		 */
		getFavorites : function(_callbackID)
		{
			var request = arel.ClientInterface.protocol + this.junaioTerm + "/getFavorites/?callbackid=" + _callbackID;
			return arel.ClientInterface.out(request);
		}
	},	
	
	/** 
	 * arel is completely loaded
	 * @private */
	arelReady: function()
	{
		var request = arel.ClientInterface.protocol + "arelReady/";
		return arel.ClientInterface.out(request);		
	},

	/**
	 * For objects, it needs to be decided, whether to queue the command as long as the model is not arel.Config.OBJECT_STATE_READY or if it can be passed already
	 * @private
	 */
	handleObjectRequest : function(id, _request)
	{
		//if this object is ready already, just send it out (queue and let the client know there is something waiting)
		if(arel.ObjectCache.getObject(id).getState() === arel.Config.OBJECT_STATE_READY)
		{
			return arel.ClientInterface.out(_request);	
		}
		else //the object is not ready yet, cache the command
		{
			if(arel.commandCachePerObject[id] === undefined)
			{
				arel.commandCachePerObject[id] = [_request];
			}
			else
			{
				arel.commandCachePerObject[id].push(_request);
			}
			
			return "Command stacked for " + id;
		}
	},
	
	/**
	 * With each arel.Events.Object.ONREADY we will check if there are any commands for an object cached and queue them if necessary
	 * @private
	 */
	queueCachedObjectRequests : function(id)
	{
		if(arel.commandCachePerObject[id] !== undefined)
		{
			for(var i in arel.commandCachePerObject[id])
			{
				if (typeof(arel.commandCachePerObject[id][i]) !== "function")
				{
					return arel.ClientInterface.out(arel.commandCachePerObject[id][i]);
				}
			}
			
			delete arel.commandCachePerObject[id];
		}						
	},
	
	/** 
	 * Queue all the commands and let the client know that something is queued up
	 * @private */
	out: function(_request)
	{
		if(arel.Debug.activeBrowser)
		{
			console.debug(_request);
		}			
		else if(arelTEST)
		{
			return _request;
		}
		else 
		{
			arel.commandQueue.push(_request);
			
			//one default request, so the client knows he can get something
			window.location = "arel://requestsPending";			
		}
	}	
};		
		//additional
/** Parser 
 * @private */
arel.Parser =
{
	/** @private */
	parseLocation : function(_location)
	{
		var lla = new arel.LLA();
		
		if(_location.lat !== undefined)
		{
			if(this.validateLatitude(_location.lat))
			{
				lla.setLatitude(_location.lat);
			}
			else
			{
				return arel.Error.write("Invalid Location");
			}
		}
		
		if(_location.lng !== undefined)
		{
			if(this.validateLongitude(_location.lng))
			{
				lla.setLongitude(_location.lng);
			}
			else
			{
				return arel.Error.write("Invalid Location");
			}
		}
		
		if(_location.lng !== undefined)
		{
			lla.setAltitude(_location.alt);
		} else {
			lla.setAltitude(0);
		}
		
		if(_location.acc !== undefined)
		{
			lla.setAccuracy(_location.acc);
		}
		
		return lla;
	},
	/** @private */
	parseRotation : function(_rotation)
	{
		return new arel.Rotation(_rotation.q1, _rotation.q2, _rotation.q3, _rotation.q4);
		/*var rotation = new arel.Rotation();
		
		if(_rotation.type !== undefined && _rotation.type !== undefined)
		{
			rotation.setRotationType(_rotation.type);
		} else {
			rotation.setRotationType(new arel.Rotation().RADIANS);
		}
		
		if(_rotation.hook !== undefined && _rotation.hook !== undefined && (rotation.getRotationType() === arel.Config.ROTATION_TYPE_POINTTO || rotation.getRotationType() === arel.Config.ROTATION_TYPE_GRAVITY))
		{
			rotation.setRotationValues(_rotation.hook);
		}
		else if(_rotation.hook !== undefined)
		{
			return arel.Error.write("Rotation hook is only allowed with arel.Rotation.GRAVITY OR arel.Rotation.POINTTO");
			return false;
		}
		
		if(_rotation.x !== undefined && _rotation.y !== undefined && _rotation.z !== undefined && (rotation.getRotationType() === arel.Config.ROTATION_TYPE_DEGREE || rotation.getRotationType() === arel.Config.ROTATION_TYPE_RADIANS))
		{
			rotation.setRotationValues(new arel.Vector3D(_rotation.x, _rotation.y, _rotation.z));
		}
		else if(_rotation.x === undefined || _rotation.y === undefined || _rotation.z === undefined)
		{
			return arel.Error.write("Invalid rotation given");
			return false;
		}
				
		return rotation;*/
	},
	/** @private */
	parseScale : function(_scale)
	{
		var scale = new arel.Vector3D();
		
		if(_scale.x !== undefined && _scale.y !== undefined && _scale.z !== undefined)
		{
			scale = new arel.Vector3D(_scale.x, _scale.y, _scale.z);
		}
		else 
		{
			return arel.Error.write("Invalid scale given");
		}
		
		return scale;
	},
	/** @private */
	parseTranslation : function(_translation)
	{
		var translation = new arel.Vector3D();
		
		if(_translation.x !== undefined && _translation.y !== undefined && _translation.z !== undefined)
		{
			translation = new arel.Vector3D(_translation.x, _translation.y, _translation.z);
		}
		else 
		{
			return arel.Error.write("Invalid translation given");
		}
		
		return translation;
	},
	/** @private */
	parseOnScreen : function(_onScreen)
	{
		var onScreen = new arel.Vector2D();
		
		if(_onScreen.x !== undefined && _onScreen.y !== undefined)
		{
			onScreen = new arel.Vector3D(_onScreen.x, _onScreen.y, _onScreen.z);
		}
		else 
		{
			return arel.Error.write("Invalid onScreen given");
		}
		
		return onScreen;
	},
	
	/** @private */
	parsePopUp : function(_popup, _location)
	{
		var description = undefined;
		var aButtons = [];
		
		if(_popup.description)
		{
			description = decodeURIComponent(_popup.description);
		}
		
		if(_popup.buttons && _popup.buttons.length > 0)
		{		
			for(var i in _popup.buttons)
			{
				if(typeof(_popup.buttons[i]) !== "function")	
				{
					aButtons[aButtons.length] = new arel.PopupButton(decodeURIComponent(_popup.buttons[i][0]), decodeURIComponent(_popup.buttons[i][1]), decodeURIComponent(_popup.buttons[i][2]));
				}
			}					
		}
		
		var popup = new arel.Popup(
				{
					buttons: aButtons,
					description: description					
				});
		
		return popup;
	},
	
	/** @private */
	parseParameters : function(_parmaters)
	{
		var decodedParameters = {};
		
		if(_parmaters)
		{
			for(var i in _parmaters)
			{
				if(typeof(_parmaters[i]) !== "function")	
				{
					decodedParameters[decodeURIComponent(i)] = decodeURIComponent(_parmaters[i]);
				}
			}
		}
		
		return decodedParameters;
	},
	/** @private */
	validateLatitude : function(_lat)
	{
		if(_lat < -90 || _lat > 90)
		{
			return false;
		}
		else
		{	
			return true;
		}
	},
	/** @private */
	validateLongitude : function(_lon)
	{
		if(_lon < -180 || _lon > 180)
		{
			return false;
		}
		else
		{	
			return true;
		}
	}	
};/** @author Frank Angermann
 *  @version beta
 *  @class Utility class for arel. Some extra methods that might come in handy 
 *  
 */

arel.Util =  
{
	/** @private */
	toParameter : function(aParams, succeedingParameters)
	{
		var paramString = "";
		var count = 0;
		
		for(var i in aParams)
		{
			//make sure no prototype functions are being passed
			if(typeof(aParams[i]) !== "function" && aParams[i] !== undefined) 
			{
				if(count === 0 && !succeedingParameters)
				{
					paramString += "?" + i + "=" + encodeURIComponent(aParams[i]);
				}
				else
				{
					paramString += "&" + i + "=" + encodeURIComponent(aParams[i]);
				}
				
				count++;
			}
		}
		
		return paramString;
	},
	
	/** @private */
	clamp : function(value, low, high)
	{
		return Math.min(Math.max(value, low), high);
	},
	
	/** @private */
	vec3DToDeg : function(vec3D)
	{
		var x = vec3D.getX() * 180 / Math.PI;
		var y = vec3D.getY() * 180 / Math.PI;
		var z = vec3D.getZ() * 180 / Math.PI;
		
		return new arel.Vector3D(x, y, z);
	},
	
	/** @private */
	vec3DToRad : function(vec3D)
	{
		var x = vec3D.getX() * Math.PI / 180;
		var y = vec3D.getY() * Math.PI / 180;
		var z = vec3D.getZ() * Math.PI / 180;
		
		return new arel.Vector3D(x, y, z);
	},
		
	/** @private */
	numberOfArelObjects : function(array)
	{
		var amount = 0;
		
		for(var i in array)
		{
			if(array[i] instanceof arel.Object)
			{
				amount++;
			}				
		}	
		
		return amount;	
	},
	
	/**
	 * Calculate the distance between two geo positions in meter
	 * @param {arel.LLA} lla1 LLA coordinate of start position
	 * @param {arel.LLA} lla2 LLA coordinate of ending position 
	 */
	getDistanceBetweenLocationsInMeter : function(lla1, lla2)
	{
		if(!(lla1 instanceof arel.LLA) || !(lla2 instanceof arel.LLA))
		{
			return arel.Error.write("lla1 and lla2 must be of type arel.LLA");
		}
		
		var latitude1 = lla1.getLatitude();
		var longitude1 = lla1.getLongitude();
		var latitude2 = lla2.getLatitude();
		var longitude2 = lla2.getLongitude();
		
		var deg2RadNumber = Math.PI / 180;
		var earthRadius = 6371009; 

		var latitudeDistance = (latitude1 - latitude2) * deg2RadNumber;
        var longitudeDistance = (longitude1 - longitude2) * deg2RadNumber;                                      
        var a = Math.pow(Math.sin(latitudeDistance / 2.0), 2) +  Math.cos(latitude1 * deg2RadNumber) * Math.cos(latitude2 * deg2RadNumber) * Math.pow(Math.sin(longitudeDistance / 2.0), 2);
		var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));                                               
				
		return earthRadius * c;
	}
};		
		//include more files:
/** @author Frank Angermann
 *  @version beta
 *  @class The abstract interface for Objects to be used with junaio. This interface may not be instanciated. Use {@link arel.Object.Model3D} and {@link arel.Object.POI}
 */
arel.Object = function()
{
	this.CATEGORY = arel.Config.OBJECT_INTERFACE_CATEGORY;
	
	//params
	/** @private */ this.id = undefined;
	/** @private */ this.title = undefined;
	/** @private */ this.popup = undefined;
	/** @private */ this.location = undefined;
	/** @private */ this.iconPath = undefined;
	/** @private */ this.thumbnailPath = undefined;
	/** @private */ this.minaccuracy = undefined;
	/** @private */ this.maxdistance = undefined;
	/** @private */ this.mindistance = undefined;
	/** @private */ this.state = undefined;
	/** @private */ this.parameters = undefined;
	/** @private */ this.visibility = undefined;
		
	//setters and getters
	/**
	 * Set Object ID.
	 * @param {string} objectID alphanummeric string defining the Object ID.
	 */
	this.setID = function(_id) {this.id = _id;};
	/**
	 * Get Object ID.
	 * @return {string} ID of the Object
	 */
	this.getID = function() {return this.id;};
	
	/**
	 * Set Object Title.
	 * @param {string} title Title of the Object
	 */
	this.setTitle = function(_title) {
		
		this.title = _title;
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "Title", _title, arel.Util.toParameter({"value": _title}, true));
		
	};
	/**
	 * Get Object Title.
	 * @param {string} Title of the Object
	 */
	this.getTitle = function() {return this.title;};
	
	/**
	 * Set Object Popup information.
	 * @param {arel.Popup} popup information for the Object information box
	 */
	this.setPopup = function(_popup) {
		
		this.popup = _popup;
		
		var ppParams = this.popup.toParameterObject();					
		return arel.Scene.updateObject(this.id, "Popup", this.popup, arel.Util.toParameter(ppParams, true));
		
	};
	/**
	 * Get Object Popup information.
	 * @return {arel.Popup} information for the Object information box 
	 */
	this.getPopup = function() {return this.popup;};
	
	/**
	 * Set Object Location information (location-based Scenes only).
	 * @param {arel.LLA} location coordination of the Object as latitude, longitude, altitude
	 */
	this.setLocation = function(_location) {
		
		if(!(_location instanceof arel.LLA))
		{
			return arel.Error.write("_location must be of type arel.LLA");
		}
		
		this.location = _location;
		
		//update the information in the scene if the Object exists in the scene
		var lParams = this.location.toParameterObject();					
		return arel.Scene.updateObject(this.id, "Location", _location, arel.Util.toParameter(lParams, true));
	};
	/**
	 * Get Object Location information (location-based Scenes only).
	 * @return {arel.LLA} coordination of the Object as latitude, longitude, altitude
	 */
	this.getLocation = function() {return this.location; };
	
	/**
	 * Set Object icon path for the image as being displayed in the MapView (location-based Scenes only).
	 * @param {string} iconPath path where to retrieve the map icon from
	 */
	this.setIcon = function(_iconPath) {
		
		this.iconPath = _iconPath;
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "Icon", _iconPath, arel.Util.toParameter({"value": encodeURIComponent(_iconPath)}, true));
	};
	/**
	 * Get Object icon path for the image as being displayed in the MapView (location-based Scenes only).
	 * @return {string} path where to retrieve the map icon from
	 */
	this.getIcon = function() {return this.iconPath;};
	
	/**
	 * Set Object thumbnail path for the image as being displayed in the ListView (location-based Scenes only).
	 * @param {string} thumbnailPath path where to retrieve the list thumb from
	 */
	this.setThumbnail = function(_thumbnailPath) {
		
		this.thumbnailPath = _thumbnailPath;
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "Thumbnail", _thumbnailPath, arel.Util.toParameter({"value": encodeURIComponent(_thumbnailPath)}, true));
	};
	/**
	 * Get Object thumbnail path for the image as being displayed in the ListView (location-based Scenes only).
	 * @return {string} path where to retrieve the list thumb from
	 */
	this.getThumbnail = function() {return this.thumbnailPath;};
	
	/**
	 * Set the minimum accuracy of the sensors to display the Object (location-based Scenes only).
	 * @param {int} minaccuracy Value in m (set 1 for displaying an Object only if a LLA Marker is scanned)  
	 */
	this.setMinAccuracy = function(_minaccuracy) {
		
		this.minaccuracy = _minaccuracy;
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "MinAccuracy", _minaccuracy, arel.Util.toParameter({"value": _minaccuracy}, true));	
	};
	/**
	 * Get the minimum accuracy of the sensors to display the Object (location-based Scenes only).
	 * @return {int} Value in m (will be 1 for displaying an Object only if a LLA Marker is scanned)  
	 */
	this.getMinAccuracy = function() {return this.minaccuracy;};
	
	/**
	 * Set the maximum distance to the Object to display it (location-based Scenes only).OBJECT_STATE_LOADING
	 * @param {int} maxdistance Value in m  
	 */
	this.setMaxDistance = function(_maxdistance) {
		
		this.maxdistance = _maxdistance;
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "MaxDistance", _maxdistance, arel.Util.toParameter({"value": _maxdistance}, true));		
	};
	/**
	 * Get the maximum distance to the Object to display it (location-based Scenes only).
	 * @return {int} maxdistance Value in m  
	 */
	this.getMaxDistance = function() {return this.maxdistance;};
	
	/**
	 * Set the maximum distance to the Object to display it (location-based Scenes only).
	 * @param {int} _mindistance mindistance Value in m  
	 */
	this.setMinDistance = function(_mindistance) {
		
		this.mindistance = _mindistance;
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "MinDistance", _mindistance, arel.Util.toParameter({"value": _mindistance}, true));			
	};
	/**
	 * Get the maximum distance to the Object to display it (location-based Scenes only).
	 * @return {int} mindistance Value in m  
	 */
	this.getMinDistance = function() {return this.mindistance;};
	
	/**
	 * Set the state of the model (arel.Config.OBJECT_STATE_LOADING | arel.config.OBJECT_STATE_READY)
	 * @param {string} _state state the model is in - loading or ready  
	 * @private
	 */
	this.setState = function(_state) {this.state = _state;};
	/**
	 * Get the state of the model (arel.Config.OBJECT_STATE_LOADING | arel.config.OBJECT_STATE_READY)
	 * @return {string} state the model is in - loading or ready  
	 * 
	 */
	this.getState = function() {return this.state;};
	
	/**
	 * use this method to determine whether an object can be picked or not (clicked)
	 * @param {array} visibility information of the Object {"liveview": bool, "maplist": bool, "radar": bool}  
	 */
	this.getVisibility = function() {return this.visibility;};
	
	/**
	 * Set the visibility for an Object for MapView, ListView, LiveView and Radar. For GLUE, only LiveView is supported.
	 * @param {boolean} _liveview set true if the Object should be shown in Live View, false if hidden, undefined is unchanged
	 * @param {boolean} _maplist set true if the Object should be shown on the Map and in the List, false if hidden, undefined is unchanged
	 * @param {boolean} _radar set true if the Object should be shown on the radar, false if hidden, undefined is unchanged
	 */
	this.setVisibility = function(_liveview, _maplist, _radar)
	{
		var params = [];
		
		if(_liveview !== undefined)
		{
			this.visibility.liveview = _liveview;
			
			if(_liveview)
			{
				params.liveview = "true";				
			}
			else
			{
				params.liveview = "false";
			}
		}
		
		if(_maplist !== undefined)
		{
			this.visibility.maplist = _maplist;
			
			if(_maplist)
			{
				params.maplist = "true";
			}
			else
			{
				params.maplist = "false";
			}
		}	
		
		if(_radar !== undefined)
		{
			this.visibility.radar = _radar;
			
			if(_radar)
			{
				params.radar = "true";
			}
			else
			{
				params.radar = "false";
			}
		}	
		
		//call undefined, otherwise the object is incorrectly reset
		return arel.Scene.updateObject(this.id, "Visibility", undefined, arel.Util.toParameter(params, true));
			
	};
	
	/** Get all parameters for the object
	 * @return {Object} object with KEY => VALUE 
	 */
	
	this.getParameters = function()
	{
		return this.parameters;
	}
	
	/** Get a certain parameter for the object
	 * @param {String} key the value belonging to the key 
	 * @return {String} value
	 */
	this.getParameter = function(key)
	{
		return this.parameters[key];
	}
	
	/**
	 * Use this method to set parameters for an object
	 * @param {Object} _parameters parameters of an object e.g. {"test" : 1, "url": "www.junaio.com"}
	 */
	this.setParameters = function(_parameters) {
		
		this.parameters = _parameters;
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "Parameters", _parameters, arel.Util.toParameter(_parameters, true));
	};
	
	/**
	 * Check if this Object is currently in the view of the user. Only if the Object is rendered, it can be considered to be in the current field of view.
	 * @param {function} _callback a callback function receiving the value as Boolean value
	 * @param {Object} caller the object this shall be referenced to in the callback function -> optional
	 */
	this.isRendered = function(_callback, caller) {
		
		//register the callback
		var callbackID = arel.CallbackInterface.addCallbackFunction(_callback, caller);
				
		if(!callbackID) {
			return arel.Error.write("invalid callback given.");
		}
		
		//make the call to the client
		return arel.ClientInterface.object.getIsRendered(arel.Util.toParameter({"id" : this.id, "callbackid" : callbackID}));
	};
	
	/** Create an object based on the information given 
	 * @private */
	this.create = function(_object)
	{
		if(_object.hasOwnProperty('id'))
		{
			this.id = _object.id;
		}
				
		if(_object.hasOwnProperty('title'))
		{
			this.title = decodeURIComponent(_object.title);
		}
				
		if(_object.hasOwnProperty('location'))
		{
			this.location = arel.Parser.parseLocation(_object.location);
		}
		
		if(_object.hasOwnProperty('iconPath'))
		{
			this.iconPath = _object.iconPath;
		}
		
		if(_object.hasOwnProperty('thumbnailPath'))
		{
			this.thumbnailPath = _object.thumbnailPath;
		}
			
		if(_object.hasOwnProperty('minaccuracy'))
		{
			this.minaccuracy = _object.minaccuracy;
		}
			
		if(_object.hasOwnProperty('maxdistance'))
		{
			this.maxdistance = _object.maxdistance;
		}
		
		if(_object.hasOwnProperty('mindistance'))
		{
			this.mindistance = _object.mindistance;
		}
		
		if(_object.hasOwnProperty('popup'))
		{
			this.popup = arel.Parser.parsePopUp(_object.popup, this.location);
		}
		
		if(_object.hasOwnProperty('parameters'))
		{
			this.parameters = arel.Parser.parseParameters(_object.parameters);
		}
		
		if(_object.hasOwnProperty('visibility'))
		{
			this.visibility = _object.visibility;			
		}
		
		//this is available for 3D Models only!
		if(_object.category !== arel.Config.OBJECT_POI) 
		{
			if(_object.hasOwnProperty('billboard'))
			{
				this.billboard = _object.billboard;
			}
			
			if(_object.hasOwnProperty('onscreen'))
			{
				this.onscreen = arel.Parser.parseOnScreen(_object.onscreen);
			}
			
			if(_object.hasOwnProperty('rotation'))
			{
				this.rotation = arel.Parser.parseRotation(_object.rotation);
			}
			
			if(_object.hasOwnProperty('translation'))
			{
				this.translation = arel.Parser.parseTranslation(_object.translation);
			}
						
			if(_object.hasOwnProperty('scale'))
			{
				this.scale = arel.Parser.parseScale(_object.scale);
			}
			
			if(_object.hasOwnProperty('occlusion'))
			{
				this.occlusion = _object.occlusion;
			}
			
			if(_object.hasOwnProperty('coordinateSystemID'))
			{
				this.coordinateSystemID = _object.coordinateSystemID;
			}
			
			if(_object.hasOwnProperty('model'))
			{
				this.model = _object.model;
			}
			
			if(_object.hasOwnProperty('texture'))
			{
				this.texture = _object.texture;
			}
			
			if(_object.hasOwnProperty('movie'))
			{
				this.movie = _object.movie;
			}
			
			if(_object.hasOwnProperty('transparency'))
			{
				this.transparency = _object.transparency;
			}
			
			if(_object.hasOwnProperty('renderorderposition'))
			{
				this.renderorderposition = _object.renderorderposition;
			}
			
			if(_object.hasOwnProperty('picking'))
			{
				this.picking = _object.picking;
			}
		}
	};
	
	/** Get Parameters to be passed to the arel.ClientInterface 
	 * @private */
	this.toParameter = function()
	{
		var aParams = [];
		var key = undefined;
		
		if(this.TYPE)
		{
			aParams.type = this.TYPE ;
		}
			
		if(this.id)
		{
			aParams.id = this.id;
		}
		
		if(this.title)
		{
			aParams.title = this.title;
		}
		
		if(this.location)
		{
			var lParams = this.location.toParameterObject();
			for(key in lParams)
			{
				if(typeof(lParams[key]) !== "function" && lParams[key] !== undefined) {
					aParams[key] = lParams[key];
				}
			}
		}
		
		if(this.iconPath)
		{
			aParams.iconPath = this.iconPath;
		}
			
		if(this.thumbnailPath)
		{
			aParams.thumbnailPath = this.thumbnailPath;
		}
			
		if(this.maxdistance)
		{
			aParams.maxdistance = this.maxdistance;
		}
		
		if(this.mindistance)
		{
			aParams.mindistance = this.mindistance;
		}	
			
		if(this.minaccuracy)
		{
			aParams.minaccuracy = this.minaccuracy;
		}		
			
		if(this.popup)
		{
			var ppParams = this.popup.toParameterObject();
			for(key in ppParams)
			{
				if(typeof(ppParams[key]) !== "function" && ppParams[key] !== undefined) {
					aParams[key] = ppParams[key];
				}
			}
		}
		
		if(this.parameters !== undefined)
		{
			for(var j in this.parameters)
			{
				if (typeof(this.parameters[j]) !== "function")
				{
					aParams['parameter_' + j] = this.parameters[j];
				}
			}
		}
		
		//check if visibility is empty or not
		var visibilityEmpty = true;
		for(var prop in this.visibility) {
	        if(this.visibility.hasOwnProperty(prop))
	        {
	        	visibilityEmpty = false;
	            break;
			}
	    }

		if(!visibilityEmpty)
		{
			for(var j in this.visibility)
			{
				if (typeof(this.visibility[j]) !== "function")
				{
					aParams['visibility_' + j] = this.visibility[j];
				}
			}
		}
		
		//only consider this parameters if it is a 3D object, otherwise, save the time
		if(this.TYPE !== arel.Config.OBJECT_POI)
		{
			if(this.billboard !== undefined)
			{
				aParams.billboard = this.billboard;
			}
			
			if(this.onscreen)
			{
				var osParams = this.onscreen.toParameterObject("onScreen");
				for(key in osParams)
				{
					if(typeof(osParams[key]) !== "function" && osParams[key] !== undefined) {
						aParams[key] = osParams[key];
					}
				}
			}
				
			if(this.translation && !this.translation.isNULL())
			{
				var tParams = this.translation.toParameterObject("trans");
				for(key in tParams)
				{
					if(typeof(tParams[key]) !== "function" && tParams[key] !== undefined) {
						aParams[key] = tParams[key];
					}
				}
			}
				
			if(this.rotation && !this.rotation.isNULL())
			{
				var rParams = this.rotation.toParameterObject("rot");
				for(key in rParams)
				{
					if(typeof(rParams[key]) !== "function" && rParams[key] !== undefined) {
						aParams[key] = rParams[key];
					}
				}
			}
				
			if(this.scale)
			{
				var sParams = this.scale.toParameterObject("scale");
				for(key in sParams)
				{
					if(typeof(sParams[key]) !== "function" && sParams[key] !== undefined) {
						aParams[key] = sParams[key];
					}
				}
			}
			
			if(this.occlusion !== undefined && this.occlusion)
			{
				aParams.occlusion = this.occlusion;
			}
			
			if(this.coordinateSystemID)
			{
				aParams.coordinateSystemID = this.coordinateSystemID;
			}
			
			if(this.model)
			{
				aParams.model = this.model;
			}
			
			if(this.texture)
			{
				aParams.texture = this.texture;
			}
			
			if(this.movie)
			{
				aParams.movie = this.movie;
			}	
			
			if(this.transparency !== undefined && this.transparency > 0)
			{
				aParams.transparency = this.transparency;
			}
			
			if(this.renderorderposition !== undefined)
			{
				aParams.renderorderposition = this.renderorderposition;
			}
			
			if(this.picking !== undefined && !this.picking)
			{
				aParams.pickable = this.picking;
			}			
		}
		return arel.Util.toParameter(aParams);
	};
	
	/** calls toParameter 
	 * @private */
	this.toString = function()
	{
		return this.toParameter();
	};
};/** @author Frank Angermann
 *  @version beta
 *  @class Creates the Pop up (information box) for an object 
 */
/**
 *  @constructor Create a pop up
 *  @param {arel.popUpAttribute} attributes defined attributes of the pop up
 */
arel.Popup = function(popupAttributes)
{
	/** @private */this.aButtons = [];
	/** @private */this.text = undefined;	
	
	//this.setters and this.getters
	/**
	 * Set available buttons for the popup
	 * @param {array} ButtonArray Array with arel.PopUpButtons definition 
	 */
	this.setButtons = function(_buttons) { this.aButtons = _buttons; };
	/**
	 * Get available buttons for the popup
	 * @return {array} Array with arel.PopUpButtons definition 
	 */ 
	this.getButtons = function() { return this.aButtons; };
	
	/**
	 * Set text to be displayed on the pop up
	 * @param {string} text description text 
	 */
	this.setDescription = function(_text) { this.text = _text; }; 
	/**
	 * Get text to be displayed on the pop up
	 * @return {string} description text 
	 */
	this.getDescription = function() { return this.text; };
		
	/**
	 * Add one button to the pop up
	 * @return {arel.PopUpButton} button Button to be displayed in the pop up 
	 */
	this.addButton = function(_button)
	{
		this.aButtons[this.aButtons.length] = _button;
	};
	
	/** @private */
	this.init = function()
	{
		if(popupAttributes.buttons)
		{
			for(var i in popupAttributes.buttons)
			{
				if(popupAttributes.buttons[i] instanceof arel.PopupButton)
				{
					this.addButton(popupAttributes.buttons[i]);
				}
				else if(popupAttributes.buttons[i].length === 3)
				{
					this.addButton(new arel.PopupButton(popupAttributes.buttons[i][0], popupAttributes.buttons[i][1], popupAttributes.buttons[i][2]));
				}									
			}
		}
		
		if(popupAttributes.description)
		{
			this.setDescription(popupAttributes.description);
		}	
	};
	
	this.toParameterObject = function()
	{
		var aParams = {};
				
		if(this.text)
		{
			aParams.popupDescription = this.text;
		}
			
		var aButtons = this.getButtons();	
		
		if(aButtons !== undefined && aButtons.length > 0)
		{
			for(var i in aButtons)
			{
				if(aButtons[i] instanceof arel.PopupButton)
				{
					aParams['popupButtonName' + i] = aButtons[i].name;
					aParams['popupButtonId' + i] = aButtons[i].id;
					aParams['popupButtonValue' + i] = aButtons[i].value;						
				}	
			}
		}
		
		return aParams;
	}; 
		
	this.init();
};/** @author Frank Angermann
 *  @version beta
 *  @class Creates a Popup Button
 */
/**
 *  @constructor Init a Popup Button
 *  @param {string} name name of the button to be displayed
 *  @param {string} id Button id
 *  @param {string} path path to the media file or url
 */
arel.PopupButton = function (_name, _id, _value)
{
	/** @private */this.name = undefined;
	/** @private */this.id = undefined;
	/** @private */this.value = undefined;
	
	/** @private */
	this.init = function()
	{
		this.name = _name;
		
		this.id = _id;
		
		this.value = _value;
	};
		
	this.init();
};/**
 *	
 *  @author Frank Angermann
 *  @version beta
 * 
 *  @class define the attributes of the popup
 *	
 */ 
arel.PopupAttributes =
{
	/**
	 * array of {@link arel.PopUpButton}s	
	 * @type Array
	 */
	buttons : undefined,
	
	/**
	 * text to be displayed on the pop up
	 * @type String
	 */
	description : undefined
	
};/* users need to be able to instantiate arel.scene without clearing the ObjectCache */

/** @author Frank Angermann
 *  @version beta	
 *  @constructor Initates a new Scene
 *  @class The arel Scene holds the information about the scenes Objects and options. So if you want to get the Object information from you scene, add, remove or edit any Objects, it will be done via the Instanz of this class.
 *  Also, for switching the tracking or switching the scene, this is your starting Point.
 */ 
	  
arel.Scene =
{	
	/** @private */
	CATEGORY: arel.Config.SCENE_CATEGORY,
	
	/** @private */
	//options: arel.SceneOptions,
	
	/**
	 * Returns all objects of the scene
	 * @return {Array} arObjectArray Array with arel.Object children
	 */
	getObjects: function()
	{
		return arel.ObjectCache.getObjects();
	},
	
	/**
	 * Get the ID of this scene	 * 
	 */
	getID: function()
	{
		return arel.SceneCache.id;		
	},
	
	/**
	 * Get the ID of this scene	for 
	 * @private
	 */
	getIDFromClient: function()
	{
		//register the callback
		var callbackID = arel.CallbackInterface.addCallbackFunction(_callback, caller);
		
		if(!callbackID) {
			return arel.Error.write("invalid callback given.");
		}
		
		//make the call to the client
		return arel.ClientInterface.scene.getID(callbackID);
	},
	
	/**
	 * Substitute all existing Objects in the scene with the ones being passed.
	 * @param {Array} arObjectArray with arel.Object children
	 */
	setObjects: function(_aObjects)
	{
		//remove all POIs first
		this.removeObjects();
		
		//add the Object internally
		arel.ObjectCache.setObjects(_aObjects);
		
		//get the objects again to avoid double IDs send to the client
		_aObjects = arel.ObjectCache.getObjects();
		
		//TODO: send interface to client (one by one or all together?)
		//currently, I try one by one -> cannot return this information for testing, so we gotta trust it works
		for(var i in _aObjects)
		{
			if(_aObjects[i] instanceof arel.Object)
			{
				arel.ClientInterface.scene.addObject(_aObjects[i]);
			}
		}				
	},
	
	/**
	 * Remove all Objects from this scene
	 */
	removeObjects: function()
	{
		arel.ObjectCache.removeObjects();
		
		//remove all objects from the client
		return arel.ClientInterface.scene.removeObjects();		
	},
	
	/**
	 * Add a single Object to the scene and leave the other ones untouched (unless the POI has the same ID, than one is being updated)
	 * @param {arel.Object} arObject an Object
	 */
	addObject: function(_object)
	{
		//add the Object internally
		if(arel.ObjectCache.addObject(_object))
		{
			//add the Object to the renderer
			return arel.ClientInterface.scene.addObject(_object);
		}
		else
		{
			//something is wrong -> most likely missing ID
			return arel.Error.write("Object could not be added to the scene.");
		}					
	},
	
	/**
	 * Get a Single Object from the Scene
	 * @param {string} arObjectID Object ID of the Object being retrieved
	 * @return {arel.Object} arObject returns the Object with the ID or false if the object does not exist
	 */
	getObject: function(_objectID)
	{
		return arel.ObjectCache.getObject(_objectID);
	},
	
	/**
	 * Remove a single Object from the scene
	 * @param {string|arel.Object} arObjectOrObjectID Object ID or Object to be removed 
	 */
	removeObject: function(_objectOrId)
	{
		var id = undefined;
		
		if(_objectOrId instanceof arel.Object)
		{
			id = _objectOrId.getID();
		}
		else
		{
			id = _objectOrId;
		}		
		
		if(id !== undefined)
		{
			//remove the Object internally
			arel.ObjectCache.removeObject(id);
			
			//remove the Object at the renderer
			return arel.ClientInterface.scene.removeObject(id);
		}
		else
		{	
			return false;
		}
								
	},
	/**
	 * Returns the number of Objects currently existing in the scene
	 * @return {integer} amountOfObjects Amount of Objects 
	 */	
	getNumberOfObjects: function()
	{
		return arel.Util.numberOfArelObjects(arel.ObjectCache.getObjects());
	},
	
	/**
	 * Switches the Scene
	 * @param {integer} sceneID ID of the Scene to switch to
	 * @param {Object} aParams Parameter to be given to the switch (e.g. {filer_poissearch: "hallo", someothervalue: "1"}) 
	 */
	switchChannel: function(_sceneID, aParams)
	{
		var params = "";
		if(aParams !== undefined)
		{
			params = arel.Util.toParameter(aParams, true);
		}
					
		return arel.ClientInterface.scene.switchChannel(_sceneID, params);
	},
	
	/**
	 * Changes the tracking of a Scene
	 * @param {string} tracking Can be a path to a trackingXML or arel.Tracking.GPS (for LB Scenes), arel.Tracking.TRACKING_LLA (for LLA Markers), arel.Tracking.BARCODE_QR (for Barcode/QR Code)
	 */
	setTrackingConfiguration: function(_tracking)
	{
		//can be a path or GPS, LLA, BarQR
		//check it
		if(_tracking !== arel.Tracking.MARKERLESS_3D && _tracking !== arel.Tracking.MARKERLESS_2D && _tracking !== arel.Tracking.MARKER && _tracking !== arel.Tracking.DETECTED && _tracking !== arel.Tracking.LOST)
		{
			return arel.ClientInterface.scene.setTrackingConfiguration(_tracking);
		}
		
		//invalid tracking type given	
		return arel.Error.write("invalid tracking type given.");
	},
	
	/**
	 * Starts the camera
	 */
	startCamera: function()
	{
		return arel.ClientInterface.scene.startCamera();
	},
	
	/**
	 * Stops the camera
	 */
	stopCamera: function()
	{
		return arel.ClientInterface.scene.stopCamera();
	},
	
	/**
	 * Starts the torch
	 */
	startTorch: function()
	{
		return arel.ClientInterface.scene.startTorch();
	},
	
	/**
	 * Stops the torch
	 */
	stopTorch: function()
	{
		return arel.ClientInterface.scene.stopTorch();
	},
	
	/**
	 * Triggers a new pois/search or pois/visualsearch (if camera image is included) request on your server
	 * @param {Boolean} refresh If this parameter is set to true, all Objects currently in the Scene will be removed
	 * @param {Object} params Parameter to be passed to your server. All parameters will have to start with "filter_", otherwise they are disregarded (e.g. {"filter_search": "hotel"})
	 * @param {Boolean} includeCameraImage if true, a current camera image is sent as well, otherwise not. If the camera image is included, a pois/visualsearch call will be made
	 */
	triggerServerCall: function(refresh, params, includeCameraImage)
	{
		var checkParam = params;
		
		if(refresh)
		{
			this.removeObjects();
		}
		
		for(var key in checkParam)
		{
			if(key.indexOf("filter_") === -1)
			{
				delete params[key];
			}
		}
		
		if(includeCameraImage === true)
		{
			params.sendScreenshot = "true";
		}
		
		return arel.ClientInterface.scene.triggerServerCall(arel.Util.toParameter(params));
	},
	
	/**
	 * Override the coordinates on the device. This is valid for LB Scenes only
	 * @param {arel.LLA} _lla the coordinates to be set (accuracy is not being considered can can be left undefined)
	 */
	setLocation: function(_lla)
	{
		//make the call to the client
		return arel.ClientInterface.scene.setLocation(arel.Util.toParameter(_lla.toParameterObject()));		
	},
	
	/**
	 * Get the current geo location of the device. This is valid for LB Scenes only
	 * @param {function} _callback a callback function receiving the value as arel.LLA
	 * @param {Object} caller the object this shall be referenced to in the callback function -> optional
	 */
	getLocation: function(_callback, caller)
	{
		//register the callback
		var callbackID = arel.CallbackInterface.addCallbackFunction(_callback, caller);
		
		if(!callbackID) {
			return arel.Error.write("invalid callback given.");
		}
		
		//make the call to the client
		return arel.ClientInterface.scene.getLocation(callbackID);		
	},
	
	/**
	 * Get the current rotation set by the compass of the device. 
	 * @param {function} _callback a callback function receiving the value as number
	 * @param {Object} caller the object this shall be referenced to in the callback function -> optional
	 */
	getCompassRotation: function(_callback, caller)
	{
		//register the callback
		var callbackID = arel.CallbackInterface.addCallbackFunction(_callback, caller);
		
		if(!callbackID) {
			return arel.Error.write("invalid callback given.");
		}
		
		//make the call to the client
		return arel.ClientInterface.scene.getCompassRotation(callbackID);
	},
	
	/**
	 * Get the tracking values of the currently tracked coordinateSystem. This is valid for GLUE Scenes only.
	 * @param {function} _callback a callback function receiving the value as arel.TrackingValues
	 * @param {Object} caller the object this shall be referenced to in the callback function -> optional
	 */
	getTrackingValues: function(_callback, caller)
	{
		//register the callback
		var callbackID = arel.CallbackInterface.addCallbackFunction(_callback, caller);
		
		if(!callbackID) {
			return arel.Error.write("invalid callback given.");
		}
		
		//make the call to the client
		return arel.ClientInterface.scene.getTrackingValues(callbackID);
	},
	
	/**
	 * Get an the ID of the object that was hit at a certain screen coordinate.
	 * @param {Vector2D} screencoordinate Coordinate of the screen where for an object shall be checked. Coordinates are given between (0,0) lower left and (1,1) upper right corner
	 * @param {function} _callback a callback function receiving the value as arel.Object
	 * @param {Object} caller the object this shall be referenced to in the callback function -> optional
	 */
	getObjectFromScreenCoordinates: function(_coord, _callback, caller)
	{
		if(_coord === undefined || !(_coord instanceof arel.Vector2D)) {
			return arel.Error.write("No screen coordinates given or screen coordinates of wrong type");
		}
		
		var callbackID = arel.CallbackInterface.addCallbackFunction(_callback, caller);
		
		if(!callbackID) {
			return arel.Error.write("invalid callback given.");
		}
		//make the call to the client
		return arel.ClientInterface.scene.getObjectFromScreenCoordinates(arel.Util.toParameter(_coord), callbackID);
	},
	
	/**
	 * Get the 3D coordinates from 2D screen coordinates. The 3D coordinate is taken where the ray through the screen hits the CoordinateSystem's xy plane 
	 * @param {Vector2D} screencoordinate Coordinate of the screen where you want to calculate the intersection with the CoordinateSystem's xy plane. Coordinates are given between (0,0) lower left and (1,1) upper right corner
	 * @param {int} _coordinateSystemID Id of the CoordinateSystem to be checked
	 * @param {function} _callback a callback function receiving the value as arel.Object
	 */
	get3DPositionFromScreenCoordinates: function(_coord, _coordinateSystemID, _callback)
	{
		if(_coord === undefined || !(_coord instanceof arel.Vector2D)) {
			return arel.Error.write("No screen coordinates given or screen coordinates of wrong type");
		}
		
		var callbackID = arel.CallbackInterface.addCallbackFunction(_callback);
		
		if(!callbackID) {
			return arel.Error.write("invalid callback given.");
		}
		
		//make the call to the client
		return arel.ClientInterface.scene.get3DPositionFromScreenCoordinates(arel.Util.toParameter(_coord), _coordinateSystemID, callbackID);
	},
	
	/**
	 * Get the 2D coordinates from a 3D coordinate. 
	 * @param {Vector3D} _coord Coordinate on the screen of a 3D point based on a given coordinateSystem's ID
	 * @param {int} _coordinateSystemID Id of the CoordinateSystem to be checked
	 * @param {function} _callback a callback function receiving the value as arel.Object
	 */
	getScreenCoordinatesFrom3DPosition: function(_coord, _coordinateSystemID, _callback)
	{
		if(_coord === undefined || !(_coord instanceof arel.Vector3D)) {
			return arel.Error.write("No 3d coordinates given or not of type arel.Vector3D");
		}
		
		var callbackID = arel.CallbackInterface.addCallbackFunction(_callback);
		
		if(!callbackID) {
			return arel.Error.write("invalid callback given.");
		}
		
		//make the call to the client
		return arel.ClientInterface.scene.getScreenCoordinatesFrom3DPosition(arel.Util.toParameter(_coord), _coordinateSystemID, callbackID);
	},
	
	/**
	 * checks if the object exists in the scene (ID) and updates if necessary (objectCache and client)
	 * @param {string} _oID objectID
	 * @param {string} _elementHandler defines the to be updated element / area (e.g. setScale/getScale -> _elementHandler = Scale)
	 * @param _param the parameter to update the Object in the cache with
	 * @param {string} paramstopass the parameter to update the according handler with, however correctly parameter encoded so it can be passed on to the client/renderer
	 * @private
	 */
	updateObject: function(objectID, handler, param, paramstopass)
	{
		if(objectID !== undefined)
		{
			if(arel.ObjectCache.objectExists(objectID))
			{
				var obj = this.getObject(objectID);
				
				//!!In order to avoid a never ending loop, the object needs temp a different ID. This ID may not be part of the scene!!
				var keepID = obj.getID();
				obj.setID(new Date().valueOf() + "_" + arel.objectIdIterator);
				
				//iterate the arel object iterator
				arel.objectIdIterator++			
				
				//adjust the parameter
				obj["set" + handler](param);
				
				//go back to the real id
				obj.setID(keepID);
				
				//go directly via the cache, otherwise a call to the renderer would be made
				arel.ObjectCache.addObject(obj);
				
				//set the state of this object to ready
				arel.ObjectCache.setObjectStateToReady(keepID);
				
				//edit the object in the renderer
				return arel.ClientInterface.object.edit(objectID, handler, paramstopass);
			}
		}
	},	
	
	/**
	 * Get a screenshot of the current Scene.
	 * @param {function} _callback a callback function receiving the value as arel.Image
	 * @param {Boolean} _includeRender if true, the openGL Rendering is included in the screenshot, false if only the camera image shall be taken
	 * @param {arel.Vector2D} _maxBBox set a bounding box for the image to fit into. So the image will be scaled in aspect ratio, so it fits the bbox
	 * @param {Object} caller the object this shall be referenced to in the callback function -> optional
	 */
	getScreenshot: function(_callback, _includeRender, _maxBBox, caller)
	{
		//register the callback
		var callbackID = arel.CallbackInterface.addCallbackFunction(_callback, caller);
		
		if(!callbackID) {
			return arel.Error.write("invalid callback given.");
		}
		
		var aParams = {};
		aParams.callbackid = callbackID;
		aParams.includeRender = _includeRender;
		aParams.bboxX = _maxBBox.getX();
		aParams.bboxY = _maxBBox.getY();
				
		//make the call to the client
		return arel.ClientInterface.scene.getScreenshot(arel.Util.toParameter(aParams));		
	},
	
	/**
	 * Check if an object exists
	 * @param {string|arel.Object} arObjectOrObjectID Object ID or Object to be removed
	 * @return {Boolean} true if the object exists, false otherwise 
	 */
	objectExists: function(_objectOrId)
	{
		var objectID = _objectOrId;
		
		if(_objectOrId instanceof arel.Object)
		{
			objectID = _objectOrId.getID();	
		}
		
		return arel.ObjectCache.objectExists(objectID);
	}	
}		//arel.include("js/SceneOptions.js");
		//arel.include("js/CoordinateSystem.js");
/**
 *	
 *  @author Frank Angermann
 *  @version beta
 * 
 *  @class "Static Class" to register Events with junaio
 *	
 */ 
arel.Events = 
{
	/**@private*/
	DELIMITER: "::",
	
	/**@private*/
	REGEX_MEDIA_REMOVE_SPECIAL_CHARACTERS: /[^a-zA-Z0-9_]+/g,
	
	//event types
	/**
	 * Object keeping scene event identifier
	 * @class Defines possible Scene Events
	 */
	Scene : 
	{
		/** Scene onload event type.<br />
		 *  Event Callback Parameter: {id: ChannelID}
		 *
		 *  @constant
		 */
		ONLOAD : "onload",
	
		/** Scene onready event type <br />
		 *  Event Callback Parameter: {id: ChannelID}
		 * 
		 * @constant
		 */
		ONREADY : "onready",
	
		/** if any change in tracking, for Barcode, QR Code, or any of the tracking techniques occures,
		 * this event will be triggered. <br />
		 * Event Callback Parameter: Array with arel.TrackingValues
		 *
		 * @constant
		 */
		ONTRACKING : "ontracking",
		
		/** if the user moves a certain distance, the event is triggered to provide the update. Location Based Channels only.
		 * Event Callback Parameter: Array with arel.LLA
		 *
		 * @constant
		 */
		ONLOCATIONUPDATE : "onlocationupdate"		
			
	},
	
	/**
	 * Object keeping Object event identifier
	 * @class Defines possible Object Events
	 */
	Object :
	{
		/** arObject on click event type <br />
		 * 
		 * Event Callback Parameter: Emtpy
		 *
		 * @constant
		 */
	 	ONTOUCHSTARTED : "ontouchstart",
		/** arObject on release event type 
		 * <br />
		 * 
		 * Event Callback Parameter: Emtpy
		 *
		 * @constant
		 */
		ONTOUCHENDED : "ontouchend",
		
		/** arObject on load event type 
		 * <br />
		 * 
		 * Event Callback Parameter: AR Object settings
		 *
		 * @constant
		 */
		ONLOAD: "onload",
		
		/** arObject on ready loading event type
		 * <br />
		 * 
		 * Event Callback Parameter: Emtpy
		 *
		 * @constant
		 */
		ONREADY: "onready",
		
		/** arObject on animation end event type 
		 * 
		 * 
		 * Event Callback Parameter: {"animationname": NAME_OF_THE_ANIMATON}
		 *
		 * @constant*/
		ONANIMATIONENDED: "onanimationend",
		
		/** arObject on movie end event type (only for model3D with movie a.k.a. movie texture) 
		 * 
		 * 
		 * Event Callback Parameter: Empty
		 *
		 * @constant*/
		ONMOVIEENDED: "onmovieend"
		
	},
	
	/**
	 * Object keeping Media event identifier
	 * @class Defines possible Media Events
	 */
	Media:
	{
		/** media on close event type
		 * @constant
		 */	
		ONCLOSED : "onclose"
	},
		
	//default scene events to get the scene options onload
	/** @private */
	sceneEvents :	{"scene_onload" : function(){ return arel.Scene.setOptions();}},
	
	/** @private */
	objectEvents:	{},
	/** @private */
	mediaEvents:	{},
	
	/**
	 * Adds a listener to an ARObject, Scene or Media Element.<br /><br />
	 * The callback method receives different parameter based on the element type:<br />
	 * <i>Object: </i> function(arel.Object, eventType, parameter)<br />
	 * <i>Scene: </i> function(eventType, paramter)<br />
	 * <i>Media: </i> function(eventType, mediaURL)
	 * @param {arel.Object|arel.Scene|string} element arObject, Scene or the string to the media file the event should be listening to
	 * @param {function} callback function to be called once the event was triggered
	 * @param {Object} caller the object this shall be referenced to in the callback function -> optional
	 * @return {String} event id
	 */
	setListener : function(element, callback, caller)
	{
		//define an ID
		//unless it is a media file
		var id = undefined;
		if(typeof(element) !== "string")
		{
			id = element.CATEGORY;
		}
		else if(this.getMediaType(element))
		{
			id = this.getMediaType(element);
		}
		
		//"overriding" the method
		//object event
		if(element instanceof arel.Object)
		{
			//debug stream
			arel.Debug.logStream("Setting object listener");
		
			//check if the element has an ID set
			if(element.getID() === undefined)
			{
				return arel.Error.write("Object ID unknown.");
			}
			
			id += this.DELIMITER + element.getID();
			
			//check whether the callback really is a function
			if(typeof(callback) !== "function")
			{
				return arel.Error.write("callback must be a function, but is " + typeof(callback));
			}
			
			//add the event
			this.objectEvents[id] = [callback, caller];						
		}
		//scene event
		else if(element.CATEGORY === arel.Config.SCENE_CATEGORY)
		{	
			//debug stream
			arel.Debug.logStream("Setting scene listener");
		
			//add the event
			//check whether the callback really is a function
			if(typeof(callback) !== "function")
			{
				return arel.Error.write("callback must be a function, but is " + typeof(callback));
			}
			
			//add the event
			this.sceneEvents[id] = [callback, caller];											
		}
		else if(this.getMediaType(element))
		{
			//debug stream
			arel.Debug.logStream("Setting media listener");
		
			var mediaType = this.getMediaType(element);
			
			id += this.DELIMITER + element.replace(this.REGEX_MEDIA_REMOVE_SPECIAL_CHARACTERS,'');
			
			//make the id lower case
			id = id.toLowerCase();
			
			//check whether the callback really is a function
			if(typeof(callback) !== "function")
			{
				return arel.Error.write("callback must be a function, but is " + typeof(callback));				
			}
			
			//add the event
			this.mediaEvents[id] = [callback, caller];			
		}		
		else //unknown element
		{
			return arel.Error.write("Unknown Element type");			
		}
				
		return id;
		
	},	
	
	/**
	 * Remove a listener from an arObject, scene or media type (url, sound, image, video) based on the event ID or element
	 * @param {arel.Object|arel.Scene|string} eventIDOrElement arObject, scene or media URL the event should be removed from or the eventID 
	 */
	removeListener: function(idORElement)
	{
		//if idORElement is a string, it is an event id, otherwise it is an object
		var id = undefined;
		
		if(idORElement instanceof arel.Object) //object
		{
			id = idORElement.CATEGORY + this.DELIMITER + idORElement.getID();
		}
		else if(idORElement.CATEGORY === arel.Config.SCENE_CATEGORY) //scene
		{
			id = idORElement.CATEGORY;
		}
		else if(this.getMediaType(idORElement)) //media
		{
			id = this.getMediaType(idORElement) + this.DELIMITER + idORElement.replace(this.REGEX_MEDIA_REMOVE_SPECIAL_CHARACTERS,'');
		}
		else if(typeof(idORElement) === "string") //id
		{
			id = idORElement;
		}
		else
		{
			return arel.Error.write("no valid event ID or element given");
		}	
		
		//id is element_type_{id} //id only for object
		var aIDComponents = id.split(this.DELIMITER);
		
		//get the type of event (scene, object, url, sound, image, video)
		try
		{
			var idType = aIDComponents[0];
		}
		catch(e)
		{
			return arel.Error.write("An incorrect event ID was passed.");
		}
		
		//remove listener
		if(idType !== undefined && idType === arel.Config.OBJECT_INTERFACE_CATEGORY)
		{
			//debug stream
			arel.Debug.logStream("Removing object listener");
			
			//check if this event exists
			if(this.objectEvents[id] === undefined)
			{
				//those errors are rather annoying
				//return arel.Error.write("Object Event Listener not specified.");
				return false;
			}
			//remove the event
			delete(this.objectEvents[id]);
		}	
		else if(idType !== undefined && idType === arel.Config.SCENE_CATEGORY)
		{	
			//debug stream
			arel.Debug.logStream("Removing scene listener");
			
			//check if this event exists
			if(this.sceneEvents[id] === undefined)
			{
				//those errors are rather annoying
				//return arel.Error.write("Scene Event Listener not specified.");
				return false;
			}
			
			//remove the event
			delete(this.sceneEvents[id]);						
		}
		else if(idType !== undefined && this.validateMediaType(idType))
		{
			//debug stream
			arel.Debug.logStream("Removing media listener");
			
			//make the id lower case
			id = id.toLowerCase();	
		
			//check if this event exists
			if(this.mediaEvents[id] === undefined)
			{
				//those errors are rather annoying
				//return arel.Error.write("Media Event Listener not specified.");
				return false;
			}
			
			//remove the event
			delete(this.mediaEvents[id]);
		}		
		else
		{
			return false;
		}
		
		return true;
	},

	/**
	 * Check if this is a valid media type
	 * @private
	 */
	validateMediaType : function(mediatype)
	{
		if(mediatype === arel.Media.URL || mediatype === arel.Media.SOUND  || mediatype === arel.Media.VIDEO)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	
	/**@private */
	getMediaType : function(filePath)
	{
		if(typeof(filePath) === "string" )
		{
			var path = filePath.toLowerCase();
			
			if(path.indexOf(".mp4") !== -1) //a video
			{
				return arel.Media.VIDEO;
			}
			else if(path.indexOf(".mp3") !== -1) //a sound
			{
				return arel.Media.SOUND;
			}
			else if(path.indexOf(".png") !== -1 || path.indexOf(".jpg") !== -1 || path.indexOf(".jpeg") !== -1 || path.indexOf(".gif") !== -1) //the image
			{
				return arel.Media.WEBSITE;
			}
			else if(path.indexOf("http://") !== -1 || path.indexOf("https://") !== -1) //a website
			{
				return arel.Media.WEBSITE;
			}
			else
			{ 
				return false;
			}
		}
		else
		{
			return false;
		}
	},
	
	/**
	 * Makes the actual call for scene event and media event. The callbackInformation consists of [0] the callback function and [1] the caller (meaning the object, <i>this</i> shall be referring to). If the caller is undefined, we define 
	 * 	<i>this</i> in global scope
	 * @private
	 */
	call : function(callbackInformation, type, paramsORurl)
	{
		//call the eventhandler and pass a scene element
		if(callbackInformation === undefined)
		{
			return false;
		}
	
		if(callbackInformation[0] === undefined || typeof(callbackInformation[0]) !== "function")
		{
			return arel.Error.write("Event callback function undefined or not a function.");
		}
			
		if(callbackInformation[1] !== undefined)
		{			
			callbackInformation[0].call(callbackInformation[1], type, paramsORurl);
		}
		else
		{
			callbackInformation[0](type, paramsORurl);
		}
		
		return true;
	},
			
	/** 
	 * e.g.<br />
	 * arel.Events.callSceneEvent(arel.Events.Scene.ONLOAD, {id: 123456});<br />
	 * arel.Events.callSceneEvent(arel.Events.Scene.ONTRACKING, [arel.TrackingValues(...), arel.TrackingValues(...)]);
	 * @private*/
	callSceneEvent : function(type, params)
	{
		//set the channel ID in the sceneCache
		if(type === arel.Events.Scene.ONREADY || type === arel.Events.Scene.ONLOAD)
		{
			if(params !== undefined && params.id !== undefined)
			{
				arel.SceneCache.id = params.id;
			}
			
			//send the scene is ready callback on default
			if(type === arel.Events.Scene.ONREADY)
			{
				arel.sceneIsReadyForExecution();
			}
		}
		
		//debug stream
		//we plaec it here, so that this is already communicated to the client
		//+ "\nParams: " + JSON.stringify(params)
		arel.Debug.logStream("Scene event received. Type: " + type);
		
		//get the event ID
		var eventId = arel.Config.SCENE_CATEGORY;
				
		//get the callback information and make the call
		return arel.Events.call(this.sceneEvents[eventId], type, params);		
	},
	
	
	//params e.g. holds the name of the animation just ended, started or other information<br /><br />
	/** 
	 * e.g.<br />
	 * arel.Events.callObjectEvent("2", arel.Events.Object.ONTOUCHENDED);<br />
	 * arel.Events.callObjectEvent("poiTest", arel.Events.Object.ONANIMATIONENDED, {"animationend" :"frame"});<br />	 * 
	 * 
	 * @private*/
	callObjectEvent : function(id, type, params)
	{		
		//debug stream
		//"\nParams: " + JSON.stringify(params)
		arel.Debug.logStream("Object event received for object " + id + ". Type: " + type);
				
		var eventId = arel.Config.OBJECT_INTERFACE_CATEGORY + this.DELIMITER + id;
		
		//first check, if we ad this Object to the Objectcache
		if(type === arel.Events.Object.ONLOAD && params !== undefined)
		{
			//the object should be in the parameters
			arel.ObjectCache.addObject(params);
		}
		//second, check if the object is ready -> if so, change the state to ready and check if there is anything that needs to be flushed to the client
		else if(type === arel.Events.Object.ONREADY)
		{
			if(arel.ObjectCache.objectExists(id))
			{
				//set the cached Object state to ready
				arel.ObjectCache.setObjectStateToReady(id);
				
				//check if there are any cached requests for this object to be flushed
				arel.ClientInterface.queueCachedObjectRequests(id);
			}
		}
		
		//get the callback information and make the call
		var callbackInformation = this.objectEvents[eventId];	
		
		//call the eventhandler and pass a scene element
		if(callbackInformation === undefined)
		{
			return false;
		}
	
		if(callbackInformation[0] === undefined || typeof(callbackInformation[0]) !== "function")
		{
			return arel.Error.write("Event callback function undefined or not a function.");
		}
			
		if(callbackInformation[1] !== undefined)
		{			
			callbackInformation[0].call(callbackInformation[1], arel.Scene.getObject(id), type, params);
		}
		else
		{
			callbackInformation[0](arel.Scene.getObject(id), type, params);
		}
		
		return true;		
	},
	
	
	
	/** 
	 * e.g. <br />
	 * arel.Events.callMediaEvent("http://www.junaio.com", arel.Events.Media.ONCLOSED);<br />
	 * arel.Events.callMediaEvent("/resources/movie.mp4", arel.Events.Media.ONCONTINUE);<br />
	 * @private*/
	callMediaEvent : function(url, type)
	{
		//debug stream
		//"\nParams: " + JSON.stringify(params)
		arel.Debug.logStream("Media event received. Type: " + type);
		
		var eventId = this.getMediaType(url) + this.DELIMITER + url.replace(this.REGEX_MEDIA_REMOVE_SPECIAL_CHARACTERS,'');
		
		//make the id lower case
		eventId = eventId.toLowerCase();
		
		//get the callback information and make the call
		return arel.Events.call(this.mediaEvents[eventId], type, url);			
	},
	
	/**
	 * Triggers an event previously specified
	 * @param {arel.Object|arel.Scene|string} eventIDOrElement arObject, scene or media url (path to image, sound, video or website) the event should be removed from or the eventID 
	 * @param {string} eventType Type of the event to be removed (only necessary if no event id is passed, but an arObject, MediaURL or Scene)
	 * @param {object} additionalParameter You can set additional parameter if you like which can be checked for in the callback
	 * 
	 */
	trigger : function(idORElement, type, params)
	{
		var eventID = undefined;
		if(idORElement instanceof arel.Object && type !== undefined)
		{
			eventID = idORElement.CATEGORY  + this.DELIMITER + idORElement.getID();
		}
		else if(idORElement.CATEGORY === arel.Config.SCENE_CATEGORY && type !== undefined)
		{
			eventID = idORElement.CATEGORY;
		}
		else if(this.getMediaType(idORElement) && type !== undefined) //media
		{
			eventID = this.getMediaType(idORElement) + this.DELIMITER + idORElement.replace(this.REGEX_MEDIA_REMOVE_SPECIAL_CHARACTERS,'');
		}
		else if(type !== undefined)
		{
			eventID = idORElement;
		}
		else
		{
			return arel.Error.write("no valid event ID or element given");
		}
				
				
		var aIDComponents = eventID.split(this.DELIMITER);
		
		try
		{
			var idType = aIDComponents[0];
		}
		catch(e)
		{
			return arel.Error.write("An incorrect event listener ID was passed.");
		}
		
		//remove listener
		if(idType !== undefined && idType === arel.Config.OBJECT_INTERFACE_CATEGORY)
		{
			return this.callObjectEvent(aIDComponents[1], type, params);
		}
		else if(idType !== undefined && idType === arel.Config.SCENE_CATEGORY)
		{
			return this.callSceneEvent(type, params);
		}
		else if(idType !== undefined && this.validateMediaType(idType))
		{
			return this.callMediaEvent(aIDComponents[1], type, params);
		}
		else
		{
			return arel.Error.write("IdType is unknown - " + idType);
		}		
	}	
};/** @author Frank Angermann
 *  @version beta
 *  @class Vector3D Object
 *  
 *  The Vector3D is used for Translation, Scale and partly Rotation Values<br /><br /> 
 *  x Translation along x axis in approx. mm (positive x is from the center to the right for GLUE and towards East for location-based Scenes)<br />
 *  y Translation along y axis in approx. mm (positive y is from the center to the top for GLUE and towards North for location-based Scenes)<br /> 
 * 	z Translation along z axis in approx. mm (positive z is from the center "out of the coordinateSystem image" for GLUE and towards bottom for location-based Scenes)<br /><br /> 
 * 
 *  x Scale along x axis<br /> 
 *  y Scale along y axis<br /> 
 * 	z Scale along z axis<br /><br /> 
 *
 * x Rotation around x axis (Euler angle) - unit depends on the rotation type<br /> 
 * y Rotation around y axis (Euler angle) - unit depends on the rotation type<br /> 
 * z Rotation around z axis (Euler angle) - unit depends on the rotation type<br />
 * 
 * @param {float} _x x Value
 * @param {float} _y y Value
 * @param {float} _z z Value 
 */
arel.Vector3D = function(_x, _y, _z)
{
	/** @private */ this.x = _x;
	/** @private */ this.y = _y;
	/** @private */ this.z = _z;
	
	/**
	 * @private
	 */
	this.toString = function()
	{
		return this.x + "," + this.y + "," + this.z;
	};
	
	this.setX = function(_x){this.x = _x;};
	this.setY = function(_y){this.y = _y;};
	this.setZ = function(_z){this.z = _z;};
	
	this.getX = function(){return this.x;};
	this.getY = function(){return this.y;};
	this.getZ = function(){return this.z;};
	
	/** @private */
	this.toParameterObject = function(prefix)
	{
		if(prefix === undefined) {
			prefix = "";
		}
		
		var aParams = {};
		aParams[prefix + "X"] = this.getX();
		aParams[prefix + "Y"] = this.getY();
		aParams[prefix + "Z"] = this.getZ();
		
		return aParams;
	};
	/** @private */
	this.isNULL = function()
	{
		if(!this.getX() && !this.getY() && !this.getZ())
		{
			return true;
		}
			
		if(this.getX() === 0 && this.getY() === 0 && this.getZ() === 0)
		{
			return true;
		}
	};
};

/**
 * Add vector2 to vector 1
 * @param {arel.Vector3D} vec3D1 3D Vector
 * @param {arel.Vector3D} vec3D2 3D Vector
 * @return {arel.Vector3D} 3D Vector
 */
arel.Vector3D.add = function(vec3D1, vec3D2)
{
	var vec = new arel.Vector3D();
	
	vec.setX(vec3D1.getX() + vec3D2.getX());
	vec.setY(vec3D1.getY() + vec3D2.getY());
	vec.setZ(vec3D1.getZ() + vec3D2.getZ());
	
	return vec;
};
  
 /**
 * subtract vector2 from vector 1
 * @param {arel.Vector3D} vec3D1 3D Vector
 * @param {arel.Vector3D} vec3D2 3D Vector
 * @return {arel.Vector3D} 3D Vector
 */
arel.Vector3D.subtract = function(vec3D1, vec3D2)
{
	var vec = new arel.Vector3D();
	
	vec.setX(vec3D1.getX() - vec3D2.getX());
	vec.setY(vec3D1.getY() - vec3D2.getY());
	vec.setZ(vec3D1.getZ() - vec3D2.getZ());
	
	return vec;
};

/** @author Frank Angermann
 *  @version beta
 *  @class Rotation Object. Internal storage format is Quaternions. Can be initialized in with quaternions
 *
 * @param {Number} q1 Quaternion value 1 
 * @param {Number} q2 Quaternion value 2
 * @param {Number} q3 Quaternion value 3
 * @param {Number} q4 Quaternion value 4
 */
arel.Rotation = function(_q1, _q2, _q3, _q4)
{	
	/** @private */
	this.init = function(_q1, _q2, _q3, _q4)
	{
		if(_q1 !== undefined) {
			this.setX(_q1);
		}
		
		if(_q2 !== undefined) {
			this.setY(_q2);
		}
		
		if(_q3 !== undefined) {
			this.setZ(_q3);
		}
		
		if(_q4 !== undefined) {
			this.setW(_q4);
		}		
	};
		
	/**
	 * Returns the Rotation in Axis Angle representation
	 * @return {Object} Object with axis and angle information e.g. {axis: arel.Vetor3D, angle: angleRad}
	 */
	this.getAxisAngle = function()
	{
		//normalize w
		if(this.getW() > 1)
		{
			var magnitude = Math.sqsqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2) + Math.pow(this.getZ(), 2) + Math.pow(this.getW(), 2));
			this.setX(this.getX() / magnitude);
			this.setY(this.getY() / magnitude);
			this.setZ(this.getZ() / magnitude);
			this.setW(this.getW() / magnitude);
		}
		
		//the angle
		var angle = 2.0 * Math.acos(this.getW());
		var scale = Math.sqrt(1 - Math.pow(this.getW(), 2));
		var vector3D = new arel.Vector3D();
		
		if(scale < 0.001)
		{
			//scale can be ignored and avoid devision by 0
			vector3D = new arel.Vector3D(this.getX(), this.getY(), this.getZ());
		}
		else
		{
			vector3D = new arel.Vector3D(this.getX() / scale, this.getY() / scale, this.getZ() / scale);
		}
		
		return {"axis": vector3D, "angle": angle};
		
	};
	
	/**
	 * Creates the Rotation from Axis Angle representation
	 * @param {arel.Vector3D} axis the axis
	 * @param {Number} angle in radians	 * 
	 */
	this.setFromAxisAngle = function(axis, angle)
	{
		var scale = Math.sin(angle / 2);
		this.init(axis.getX() * scale, axis.getY() * scale, axis.getZ() * scale, Math.cos(angle / 2));
	};
	
	/**
	 * Returns the Rotation in Euler representation
	 * @return {arel.Vector3D} Euler rotation values in degrees
	 */
	this.getEulerAngleDegrees = function()
	{
		return arel.Util.vec3DToDeg(this.getEulerAngleRadians());			
	};
	
	/**
	 * Returns the Rotation in Euler representation
	 * @return {arel.Vector3D} Euler rotation values in radians
	 */
	this.getEulerAngleRadians = function()
	{
		var sqw = Math.pow(this.getW(), 2);
		var sqx = Math.pow(this.getX(), 2);
		var sqy = Math.pow(this.getY(), 2);
		var sqz = Math.pow(this.getZ(), 2);
		
		var euler = new arel.Vector3D();
		// heading = rotation about z-axis
		euler.setZ(Math.atan2(2.0 * (this.getX() * this.getY() + this.getZ() * this.getW()) , (sqx - sqy - sqz + sqw)));
	
		// bank = rotation about x-axis
		euler.setX(Math.atan2(2.0 * (this.getY() * this.getZ() + this.getX() * this.getW()), (-sqx - sqy + sqz + sqw)));
	
		// attitude = rotation about y-axis
		euler.setY(Math.asin(arel.Util.clamp(-2.0 * (this.getX() * this.getZ() - this.getY() * this.getW()), -1.0, 1.0)));
		
		return euler;		
	};
	
	/**
	 * Creates the Rotation from Euler representation in Radians (order: x-y-z)
	 * @param {arel.Vector3D} vec3D Euler rotation values in radians
	 */
	this.setFromEulerAngleRadians = function(vec3D)
	{
		var angle;
			
		angle = vec3D.getX() * 0.5;
		var sr = Math.sin(angle);
		var cr = Math.cos(angle);
	
		angle = vec3D.getY() * 0.5;
		var sp = Math.sin(angle);
		var cp = Math.cos(angle);
	
		angle = vec3D.getZ() * 0.5;
		var sy = Math.sin(angle);
		var cy = Math.cos(angle);
	
		var cpcy = cp * cy;
		var spcy = sp * cy;
		var cpsy = cp * sy;
		var spsy = sp * sy;
	
		this.setX(sr * cpcy - cr * spsy);
		this.setY(cr * spcy + sr * cpsy);
		this.setZ(cr * cpsy - sr * spcy);
		this.setW(cr * cpcy + sr * spsy);
		
		//normalize
		if(this.getW() > 1)
		{
			var magnitude = Math.sqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2) + Math.pow(this.getZ(), 2) + Math.pow(this.getW(), 2));
			this.setX(this.getX() / magnitude);
			this.setY(this.getY() / magnitude);
			this.setZ(this.getZ() / magnitude);
			this.setW(this.getW() / magnitude);
		}		
	};
	
	/**
	 * Creates the Rotation from Euler representation in degree (order: x-y-z)
	 * @param {arel.Vector3D} vec3D Euler rotation values in degree
	 */
	this.setFromEulerAngleDegrees = function(vec3D)
	{
		this.setFromEulerAngleRadians(arel.Util.vec3DToRad(vec3D));
	};
	
	/**
	 * Returns the Rotation in Matrix representation
	 * @return {Array} 3x3 rotationMatrix in row-major order
	 */
	this.getMatrix = function()
	{
		var rotationMatrix = [];
		
		var sqw = Math.pow(this.getW(), 2);
		var sqx = Math.pow(this.getX(), 2);
		var sqy = Math.pow(this.getY(), 2);
		var sqz = Math.pow(this.getZ(), 2);
		
		if(Math.abs(sqx + sqy + sqz + sqw - 1.0) > 0.001)
		{
			return arel.Error.write("Quaternion does not have the length == 1");
		}
		
		rotationMatrix[0] = 1.0 - 2.0 * sqy - 2.0 * sqz;
		rotationMatrix[1] = 2.0 * (this.getX() * this.getY() - this.getZ() * this.getW());
		rotationMatrix[2] = 2.0 * (this.getX() * this.getZ() + this.getY() * this.getW());

		rotationMatrix[3] = 2.0 * (this.getX() * this.getY() + this.getZ() * this.getW());
		rotationMatrix[4] = 1.0 - 2.0 * sqx - 2.0 * sqz;
		rotationMatrix[5] = 2.0 * (this.getY() * this.getZ() - this.getX() * this.getW());

		rotationMatrix[6] = 2.0 * (this.getX() * this.getZ() - this.getY() * this.getW());
		rotationMatrix[7] = 2.0 * (this.getX() * this.getW() + this.getY() * this.getZ());
		rotationMatrix[8] = 1.0 - 2.0 * sqx - 2.0 * sqy;	
		
		return rotationMatrix;
	};
	
	/**
	 * Creates an arel.Rotation Object from Matrix (3x3) representation (row major order)
	 * @param {Array} rotationMatrix 3x3 rotationMatrix in row-major order	  
	 */
	this.setFromMatrix = function(rotationMatrix)
	{
		var quaternion = {};
		var trace = 1.0 + rotationMatrix[0] + rotationMatrix[4] + rotationMatrix[8];
		var	qw = undefined;
		var	normalizeFactor = undefined;
	
		if (trace > 0.0001)
		{
			qw = Math.sqrt(trace) * 2.0;
			normalizeFactor = 1.0 / qw;
			quaternion.x = (rotationMatrix[7] - rotationMatrix[5]) * normalizeFactor;
			quaternion.y = (rotationMatrix[2] - rotationMatrix[6]) * normalizeFactor;
			quaternion.z = (rotationMatrix[3] - rotationMatrix[1]) * normalizeFactor;
			quaternion.w = qw * 0.25;
		}
		//If the trace of the matrix is equal to zero, then identify which major diagonal element has the greatest value
		else if ( (rotationMatrix[0] > rotationMatrix[4]) && (rotationMatrix[0] > rotationMatrix[8]) )  
		{
			qw = Math.sqrt(1.0 + rotationMatrix[0] - rotationMatrix[4] - rotationMatrix[8]) * 2.0;
			normalizeFactor = 1.0 / qw;
			quaternion.x = qw * 0.25;
			quaternion.y = (rotationMatrix[1] + rotationMatrix[3]) * normalizeFactor;
			quaternion.z = (rotationMatrix[2] + rotationMatrix[6]) * normalizeFactor;
			quaternion.w = (rotationMatrix[7] - rotationMatrix[5]) * normalizeFactor;
		}
		else if ( rotationMatrix[4] > rotationMatrix[8] )
		{
			qw = Math.sqrt(1.0 + rotationMatrix[4] - rotationMatrix[0] - rotationMatrix[8]) * 2.0;
			normalizeFactor = 1.0 / qw;
			quaternion.x = (rotationMatrix[1] + rotationMatrix[3]) * normalizeFactor;
			quaternion.y = qw * 0.25;
			quaternion.z = (rotationMatrix[5] + rotationMatrix[7]) * normalizeFactor;
			quaternion.w = (rotationMatrix[2] - rotationMatrix[6]) * normalizeFactor;
		}
		else
		{
			qw = Math.sqrt(1.0 + rotationMatrix[8] - rotationMatrix[0] - rotationMatrix[4]) * 2.0;
			normalizeFactor = 1.0 / qw;
			quaternion.x = (rotationMatrix[2] + rotationMatrix[6]) * normalizeFactor;
			quaternion.y = (rotationMatrix[5] + rotationMatrix[7]) * normalizeFactor;
			quaternion.z = qw * 0.25;
			quaternion.w = (rotationMatrix[3] - rotationMatrix[1]) * normalizeFactor;
		}
	
		//normalize quaternion
		normalizeFactor = 1.0 / Math.sqrt(quaternion.x*quaternion.x + quaternion.y*quaternion.y + quaternion.z*quaternion.z + quaternion.w*quaternion.w);
		this.setX(quaternion.x * normalizeFactor);
		this.setY(quaternion.y * normalizeFactor);
		this.setZ(quaternion.z * normalizeFactor);
		this.setW(quaternion.w * normalizeFactor);
	};
	
	/**
	* Returns an inverted copy of this rotation. This inverse corresponds to a rotation in the opposite direction
	*		rotation*rotation.inverse() == no Rotation
	*
	* @return {arel.Rotation} The inverse of the rotation
	*/
	this.inverse = function()
	{
		var rotationAsMatrix = this.getMatrix();
		var invRotationmatrix = [];
		
		invRotationmatrix[0] = rotationAsMatrix[0];
		invRotationmatrix[1] = rotationAsMatrix[3];
		invRotationmatrix[2] = rotationAsMatrix[6];
		invRotationmatrix[3] = rotationAsMatrix[1];
		invRotationmatrix[4] = rotationAsMatrix[4];
		invRotationmatrix[5] = rotationAsMatrix[7];
		invRotationmatrix[6] = rotationAsMatrix[2];
		invRotationmatrix[7] = rotationAsMatrix[5];
		invRotationmatrix[8] = rotationAsMatrix[8];	
		
		var rotation = new arel.Rotation();
		rotation.setFromMatrix(invRotationmatrix);	
		return rotation;
	};
	
	/** @private */
	this.toParameterObject = function()
	{
		var aParams = {};
		aParams.q1 = this.getX();
		aParams.q2 = this.getY();
		aParams.q3 = this.getZ();
		aParams.q4 = this.getW();
		
		return aParams;
	};
	
	/**
	 * @constructor
	 */
	this.init(_q1, _q2, _q3, _q4);
};

/** @author Frank Angermann
 *  @version beta
 *  @class Vector4D Object
 * 
 * @param {float} _x x Value
 * @param {float} _y y Value
 * @param {float} _z z Value
 * @param {float} _w w Value 
 */
arel.Vector4D = function(_x, _y, _z, _w)
{
	/** @private */ this.x = _x;
	/** @private */ this.y = _y;
	/** @private */ this.z = _z;
	/** @private */ this.w = _w;
	
	/**
	 * @private
	 */
	this.toString = function()
	{
		return this.x + "," + this.y + "," + this.z + "," + this.w;
	};
	
	/** @private */
	this.isNULL = function()
	{
		if(!this.getX() && !this.getY() && !this.getZ() && !this.getW())
		{
			return true;
		}
			
		if(this.getX() === 0 && this.getY() === 0 && this.getZ() === 0)
		{
			return true;
		}
	};
	
	
	this.setX = function(_x){this.x = _x;};
	this.setY = function(_y){this.y = _y;};
	this.setZ = function(_z){this.z = _z;};
	this.setW = function(_w){this.w = _w;};
	
	this.getX = function(){return this.x;};
	this.getY = function(){return this.y;};
	this.getZ = function(){return this.z;};
	this.getW = function(){return this.w;};
};

/** @author Frank Angermann
 *  @version beta
 *  @class LLA Object
 *  @constructor
 *  @param {Number} latitude Latitude Value (e.g. 48.11223)
 *  @param {Number} longitude Longitude Value (e.g. 11.45456)
 * 	@param {Number} altitude Altitude value in m
 *  @param {Number} accuracy Accuracy value of the current location sensor in m
 */

arel.LLA = function(_lat, _lng, _alt, _acc)
{
	/** @private */this.accuracy = undefined;
	/** @private */
	this.init = function(_lat, _lng, _alt, _acc)
	{
		if(_lat !== undefined) {
			this.setLatitude(_lat);
		}
		
		if(_lng !== undefined) {
			this.setLongitude(_lng);
		}
		
		if(_alt !== undefined) {
			this.setAltitude(_alt);
		}
		
		if(_acc !== undefined) {
			this.accuracy = _acc;
		}		
	};
	/**
	 * Set latitude value
	 * @param {Number} latitude Latitude Value (e.g. 48.11223)
	 */
	this.setLatitude = function(_lat) {this.setX(_lat);};
	/**
	 * Get latitude value
	 * @return {Number} Latitude Value (e.g. 48.11223)
	 */
	this.getLatitude = function() {return this.getX();};
	
	/**
	 * Set longitude value
	 * @param {Number} longitude Longitude Value (e.g. 11.45456)
	 */
	this.setLongitude = function(_lng) {this.setY(_lng);};
	/**
	 * Get longitude value
	 * @return {Number} Longitude Value (e.g. 11.45456)
	 */
	this.getLongitude = function() {return this.getY();};
	
	/**
	 * Set altitude value
	 * @param {Number} altitude Altitude value in m
	 */
	this.setAltitude = function(_alt) {this.setZ(_alt);};
	/**
	 * Get altitude value
	 * @return {Number} Altitude value in m
	 */
	this.getAltitude = function() {return this.getZ();};
	
	/**
	 * Get the accuracy value
	 * @return {Number} Accruacy value of the current location sensor in m
	 */
	this.getAccuracy = function() {return this.accuracy;};	
	
	/**
	 * Set the accuracy value
	 * @return {Number} _acc Accruacy value of the current location sensor in m
	 * @private
	 */
	this.setAccuracy = function(_acc) {this.accuracy = _acc;};	
	
	/** @private */
	this.toParameterObject = function()
	{
		var aParams = {};
		aParams.lat = this.getLatitude();
		aParams.lng = this.getLongitude();
		aParams.alt = this.getAltitude();
		
		return aParams;
	};
	
	/**
	 * @constructor
	 */
	this.init(_lat, _lng, _alt, _acc);
};

/** @author Frank Angermann
 *  @version beta
 *  @class TrackingValues Object
 *  @constructor
 *  @param {float} _tx Translation along x
 *  @param {float} _ty Translation along y
 *  @param {float} _tz Translation along z
 *  @param {float} _q1 Quaternion value 1
 *  @param {float} _q2 Quaternion value 2
 *  @param {float} _q3 Quaternion value 3
 *  @param {float} _q4 Quaternion value 4
 *  @param {float} _qual Quality value of the tracking
 *  @param {int} _coordinateSystemID ID of the coordinateSystem being tracked
 *  @param {String} _type -> tracking type -> see arel.Tracking
 *  @param {String} _state either arel.Tracking.STATE_TRACKING, arel.Tracking.STATE_EXTRAPOLATED or arel.Tracking.STATE_NOTTRACKING
 *  @param {String | arel.LLA} _content textual content in a tracking reference, used for BARCODE and QRCODE
 */
arel.TrackingValues = function(_tx, _ty, _tz, _q1, _q2, _q3, _q4, _qual, _coordinateSystemID, _type, _state, _content)
{
	this.translation = new arel.Vector3D(_tx, _ty, _tz);
	this.rotation = new arel.Rotation(_q1, _q2, _q3, _q4);
	
	/** @private */this.coordinateSystemID = _coordinateSystemID;
	
	/** @private */this.quality = _qual;
	
	/** @private */this.type = _type;
	
	/** @private */this.state = _state;
	
	/** @private */this.content = _content;
	
	/**
	 * Get the state of the tracking (arel.Tracking.STATE_TRACKING or arel.Tracking.STATE_NOTTRACKING)
	 * @return {String} is the tracking found (arel.Tracking.STATE_TRACKING) or lost (arel.Tracking.STATE_NOTTRACKING)
	 */
	this.getState = function() {return this.state;};	
	
	/**
	 * Set translation value
	 * @param {arel.Vector3D} _vec3D Translation Parameter
	 */
	this.setTranslation = function(_vec3D) 
	{
		this.translation = new arel.Vector3D(_vec3D.getX(), _vec3D.getY(), _vec3D.getz());		
	};
	
	/**
	 * Set rotation value
	 * @param {arel.Rotation} _rot arel.Rotation
	 */
	this.setRotation = function(_rot) 
	{
		this.rotation = _rot;		
	};
	/**
	 * Get translation value
	 * @param {arel.Vector3D} Translation Parameter
	 */
	this.getTranslation = function() 
	{
		return this.translation;
	};
	
	/**
	 * Get rotation value
	 * @param {arel.Rotation} Quaternion
	 */
	this.getRotation = function() 
	{
		return this.rotation;
	};
	
	/**
	 * Get the quality value
	 * @return {float} Quality value of the tracking
	 */
	this.getQuality = function() {return this.quality;};
	
	/**
	 * Get the ID of the coordinateSystem currently tracked
	 * @return {int} ID of the coordinateSystem
	 */
	this.getCoordinateSystemID = function() {return this.coordinateSystemID;};	
	
	/**
	 * Get the type of the tracking
	 * @return {String} the tracking type
	 * @see arel.Tracking
	 */
	this.getType = function() {return this.type;};
	
	/**
	 * Get the content of the detected reference. This is only valid for type arel.Tracking.BARCODE_QR or arel.Tracking.LLA_MARKER
	 * @return {String} the content of the barcode, QR code or lla marker
	 */
	this.getContent = function() {return this.content;};
	
};

/** @author Frank Angermann
 *  @version beta
 *  @class Vector2D Object
 *  @constructor
 * 
 *  This is e.g. used for Screencoordinates<br /><br />
 *  x Coordinate on short side of the screen (0 being left on short side of the screen, 1 being right)<br /> 
 *  y Coordinate on long side of the screen (0 being bottom on long side of the screen, 1 being top)
 * 
 *  @param {float} x x Coordinate
 *  @param {float} y y Coordinate
 */
arel.Vector2D = function(_x, _y)
{
	/** @private */this.x = _x;
	/** @private */this.y = _y;
		
	/**
	 * Set X coordinate
	 * @param {float} x x Coordinate
	 */	
	this.setX = function(_x) {this.x = _x;};
	/**
	 * Get X coordinate 
	 * @return {float} x Coordinate 
	 */	
	this.getX = function() {return this.x;};
	
	/**
	 * Set Y coordinate
	 *  @param {float} y y Coordinate 
	 */
	this.setY = function(_y) {this.y = _y;};
	/**
	 * Get Y coordinate
	 *  @return {float} y Coordinate
	 */
	this.getY = function() {return this.y;};
	
	/** @private */
	this.toString = function()
	{
		return this.x + "," + this.y;
	};	
	
	/** @private */
	this.toParameterObject = function(prefix)
	{
		if(prefix === undefined) {
			prefix = "";
		}
		
		var aParams = {};
		aParams[prefix + "X"] = this.getX();
		aParams[prefix + "Y"] = this.getY();
				
		return aParams;
	};
	
	/** @private */
	this.isNULL = function()
	{
		if(!this.getX() && !this.getY())
		{
			return true;
		}
			
		if(this.getX() === 0 && this.getY() === 0)
		{
			return true;
		}
	};	
};


/** @author Frank Angermann
 *  @version beta
 *  @class Image Object
 *  @constructor
 *  @param {string} _imagebuffer base64 encoded jpeg of the image
 *  @param {Integer} _width Width of the image
 * 	@param {Integer} _height Height of the image
 *  @param {Boolean} _originUpperLeft true if the origin is upper left corner, false if lower left
 */

arel.Image = function(_imagebuffer, _width, _height, _originUpperLeft)
{
	/** @private */this.imagebuffer = undefined;
	/** @private */this.width = undefined;
	/** @private */this.height = undefined;
	/** @private */this.originUpperLeft = undefined;
	
	/** @private */
	this.init = function(imagebuffer, width, height, originUpperLeft)
	{
		if(imagebuffer !== undefined) {
			this.imagebuffer = imagebuffer;
		}
		
		if(width !== undefined) {
			this.width = width;
		}
		
		if(height !== undefined) {
			this.height = height;
		}
		
		if(originUpperLeft !== undefined) {
			this.originUpperLeft = originUpperLeft;
		}		
	};
	/**
	 * Set the image as a base64 encoded jpeg
	 * @param {String} _imagebuffer base64 encoded jpeg of the image
	 * @private
	 */
	this.setImageBuffer = function(_imagebuffer) {this.imagebuffer = _imagebuffer;};
	/**
	 * Get the image as a base64 encoded jpeg
	 * @return {String} base64 encoded jpeg of the image
	 */
	this.getImageBuffer = function() {return this.imagebuffer;};
	
	/**
	 * Set the image width value
	 * @param {Integer} _width Width of the image
	 * @private
	 */
	this.setWidth = function(_width) {this.width = _width;};
	/**
	 * Get longitude value
	 * @return {Integer} Width of the image
	 */
	this.getWidth = function() {return this.width;};
	
	/**
	 * Set height of the image
	 * @param {Integer}  _height Height of the image
	 * @private
	 */
	this.setHeight = function(_height) {this.height = _height;};
	/**
	 * Get altitude value
	 * @return {Integer}  Height of the image
	 */
	this.getHeight = function() {return this.height;};
	
	/**
	 * Set, whether the origin is in the upper left (true) or bottom left (false)
	 * @param {Boolean} _originUpperLeft true if the origin is upper left corner, false if lower left
	 * @private
	 */
	this.setOriginUpperLeft = function(_originUpperLeft) {this.originUpperLeft = originUpperLeft;};	
	
	/**
	 * Get, whether the origin is in the upper left (true) or bottom left (false)
	 * @return {Boolean} true if the origin is upper left corner, false if lower left
	 */
	this.isOriginUpperLeft = function() {return this.originUpperLeft;};	
	
	/**
	 * @constructor
	 */
	this.init(_imagebuffer, _width, _height, _originUpperLeft);
};

//arel.LLA.arelInheritFrom(arel.Vector3D);
//arel.Rotation.arelInheritFrom(arel.Vector4D);

arel.LLA.prototype = new arel.Vector3D;
arel.LLA.prototype.constructor = arel.LLA;
arel.LLA.prototype.parent = arel.Vector3D.prototype;

arel.Rotation.prototype = new arel.Vector4D;
arel.Rotation.prototype.constructor = arel.Rotation;
arel.Rotation.prototype.parent = arel.Vector4D.prototype;
		
		//different Object types
/** @author Frank Angermann
 *  @version beta
 *  @class Creates a Default Object to be used with junaio Location Based Channels only! 
 *  @extends arel.Object
 *  @constructor
 */
arel.Object.POI = function()
{
	/**@private*/ this.TYPE = arel.Config.OBJECT_POI;
	
	/**
	 * Get the Object category constant (text)
	 */
	this.getType = function(){return this.TYPE; };
	
	this.init = function()
	{
		this.visibility = {};		
	};
	
	this.init();
};

//arel.Object.POI.arelInheritFrom(arel.Object);

arel.Object.POI.prototype = new arel.Object;
arel.Object.POI.prototype.constructor = arel.Object.POI;
arel.Object.POI.prototype.parent = arel.Object.prototype;
/** @author Frank Angermann
 *  @version beta
 *  @class Creates a 3D Object to be used with junaio GLUE or junaio Location Based Channels 
 *  @extends arel.Object
 * 
 * @param {String} _id object id
 * @param {String} _modelPath path to the model's texture
 * @param {String} _texturePath path to the model's texture
 */

arel.Object.Model3D = function(_id, _modelPath, _texturePath)
{
	/** @private */ this.TYPE = arel.Config.OBJECT_MODEL3D;
	
	/** @private */ this.onscreen = undefined;
	/** @private */ this.translation = new arel.Vector3D(0,0,0);
	/** @private */ this.rotation = new arel.Rotation(0,0,0);
	/** @private */ this.scale = new arel.Vector3D(1,1,1);
	/** @private */ this.occlusion = false;
	/** @private */ this.model = undefined;
	/** @private */ this.texture = undefined;
	/** @private */ this.movie = undefined;
	/** @private */ this.coordinateSystemID = undefined;
	/** @private */ this.transparency = 0;
	/** @private */ this.renderorderposition = undefined;
	/** @private */ this.picking = true;

	this.init = function(_id, _modelPath, _texturePath)
	{
		if(_id !== undefined)
		{
			this.id = _id;
		}
		
		if(_modelPath !== undefined)
		{
			this.model = _modelPath;
		}
		
		if(_texturePath !== undefined)
		{
			this.texture = _texturePath;
		}
		
		this.visibility = {};		
	};

	/**
	 * Set the Objects relative to screen coordinates (Only if Translation and Location is not set)
	 * @param {arel.Vector2D} _onscreen Position of the 3D Object on the Screen 
	 */
	this.setScreenCoordinates = function(_onscreen) { 
		
		this.onscreen = _onscreen; 
		
		//update the information in the scene if the Object exists in the scene
		var params = this.onscreen.toParameterObject("onScreen");
		return arel.Scene.updateObject(this.id, "OnScreen", _onscreen, arel.Util.toParameter(params, true));	
		
	}; 
	/**
	 * Get the Objects relative to screen coordinates (Only if Translation and Location is not set)
	 * @return {arel.Vector2D} Position of the 3D Object on the Screen 
	 */
	this.getScreenCoordinates = function() { return this.onscreen; }; 
	
	/**
	 * Sets the Objects translation from the point of origin (Only if OnScreen is not set). For location-based Channels the point of origin is at the position of the user. For GLUE Channels i is in the center of the pattern.
	 * @param {arel.Vector3D} translationValues Position of the 3D Object from the point of origin
	 */
	this.setTranslation = function(_translation) { 
		
		if(!(_translation instanceof arel.Vector3D))
		{
			return arel.Error.write("_translation must be of type arel.Vector3D");				
		}
		
		this.translation = _translation; 
		
		//update the information in the scene if the Object exists in the scene
		var params = this.translation.toParameterObject("trans");
		return arel.Scene.updateObject(this.id, "Translation", _translation, arel.Util.toParameter(params, true));
	};
	/**
	 * Get the Objects translation from the point of origin (Only if OnScreen is not set). For location-based Channels the point of origin is at the position of the user. For GLUE Channels i is in the center of the pattern.
	 * @return {arel.Vector3D} Position of the 3D Object from the point of origin
	 */ 
	this.getTranslation = function() { return this.translation; }; 
	
	/**
	 * Set the Objects rotation from the point of origin. Rotation values unit depend on the type given.
	 * @return {arel.Rotation} rotationValue Rotation of the 3D Object.
	 */ 
	this.setRotation = function(_rotation) { 
		
		if(!(_rotation instanceof arel.Rotation))
		{
			return arel.Error.write("_rotation must be of type arel.Rotation");
		}
		
		this.rotation = _rotation; 
		
		//update the information in the scene if the Object exists in the scene
		var params = this.rotation.toParameterObject("rot");
		return arel.Scene.updateObject(this.id, "Rotation", _rotation, arel.Util.toParameter(params, true));
		
	}; 
	/**
	 * Get the Objects rotation from the point of origin. Rotation values unit depend on the type given.
	 * @return {arel.Rotation} Rotation of the 3D Object.
	 */
	this.getRotation = function() { return this.rotation; }; 
	
	/**
	 * Set the Objects scale values along all axis.
	 * @param {arel.Vector3D} scaleValue Scale of the 3D Object along all axis. To scale in "aspect ratio" use the same value for all axis.
	 */ 
	this.setScale = function(_scale) { 
		
		if(!(_scale instanceof arel.Vector3D))
		{
			return arel.Error.write("_scale must be of type arel.Vector3D");
		}
		
		this.scale = _scale; 
		
		//update the information in the scene if the Object exists in the scene
		var params = this.scale.toParameterObject("scale");
		return arel.Scene.updateObject(this.id, "Scale", _scale, arel.Util.toParameter(params, true));
	};
	/**
	 * Get the Objects scale values along all axis.
	 * @return {arel.Vector3D} Scale of the 3D Object along all axis. To scale in "aspect ratio" use the same value for all axis.
	 */  
	this.getScale = function() { return this.scale; }; 
	
	/**
	 * Set the Objects to be an occlusion Object
	 * @param {boolean} enableOcclusion true if Object is supposed to be an occlusion model
	 */ 
	this.setOccluding = function(_occlusion) { 
		
		this.occlusion = _occlusion; 
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "Occluding", _occlusion, arel.Util.toParameter({"value": _occlusion}, true));	
	};
	
	/**
	 * Get whether the Object is an occlusion Object
	 * @return {boolean} true if Object is an occlusion model
	 */  
	this.isOccluding = function() { return this.occlusion; }; 
	
	/**
	 * Get the path to the model file (md2) or zip for obj/md2s
	 *  @see getMovie()
	 *  @see getTexture()
	 * @return {String} model path
	 */  
	this.getModel = function() { return this.model; }; 
	
	/**
	 * Set the path to the model file (md2) or zip for obj/md2s
	 * @see setMovie()
	 * @see setTexture()
	 * @param {String} _modelPath path to the model resource (geometry) as md2 or obj (zipped)
	 */ 
	this.setModel = function(_modelPath) { 
		
		this.model = _modelPath; 
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "Model", _modelPath, arel.Util.toParameter({"value": _modelPath}, true));	
	};
	/**
	 * Get the path to the texture file (jpg/png) which is mapped on the model - can be undefined if zipped obj or md2 used or movie is set
	 * @see getModel()
	 * @see getMovie()
	 * @return {String} texture path
	 */  
	this.getTexture = function() { return this.texture; }; 
	
	/**
	 * Set the path to the texture file (jpg/png) which is mapped on the model - not required if zipped obj or md2 used or movie is set
	 * @see setModel()
	 * @see setTexture()
	 * @param {String} _texturePath path to the model's texture
	 */ 
	this.setTexture = function(_texturePath) { 
		
		this.texture = _texturePath; 
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "Texture", _texturePath, arel.Util.toParameter({"value": _texturePath}, true));	
	};
	/**
	 * Get the path to the movie file(3g2) mapped on the 3D model - can be undefined if zipped obj or md2 used or texture is set
	 * @see getModel()
	 * @see getTexture()
	 * @return {String} movie path
	 */  
	this.getMovie = function() { return this.movie; }; 
	
	/**
	 * Set the path to the movie file (3g2) to be mapped on the model
	 * @see setModel()
	 * @see setTexture()
	 * @see createFromMovie()
	 * @param {String} _moviePath path to a movie that shall be mapped on the 3D model 
	 */ 
	this.setMovie = function(_moviePath) { 
		
		this.movie = _moviePath; 
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "Movie", _moviePath, arel.Util.toParameter({"value": _moviePath}, true));	
	};
	/**
	 * Get the ID of the coordinateSystem the object is currently attached to (only valid feedback for GLUE channels/obejcts)
	 * @return {int} the coordinateSystem ID the object is bound to
	 */  
	this.getCoordinateSystemID = function() { return this.coordinateSystemID; }; 
	
	/**
	 * Set the ID of the coordinateSystem the object is currently attached to (only valid feedback for GLUE channels/obejcts)
	 * @param {int} coordinateSystemID the coordinateSystem ID the object is bound to
	 */ 
	this.setCoordinateSystemID = function(_coordinateSystemID) { 
		
		this.coordinateSystemID = _coordinateSystemID; 
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "CoordinateSystemID", _coordinateSystemID, arel.Util.toParameter({"value": _coordinateSystemID}, true));	
	};
		
	/**
	 * Start an 3D model's animation (only valid for md2 models)
	 * @param {string} animationName Name of the animation to be started
	 * @param {boolean} loop true if the animation shall be looped, false otherwise
	 */
	this.startAnimation = function(animationName, loop)
	{
		var params = {"id": this.id, "animationname":animationName, "loop":loop};
		return arel.ClientInterface.object.startAnimation(this.id, arel.Util.toParameter(params));
	};
	
	/**
	 * Pause the currently playing animation of the 3D model (only valid for md2 models)	 * 
	 */
	this.pauseAnimation = function()
	{
		var params = {"id": this.id};
		return arel.ClientInterface.object.pauseAnimation(this.id, arel.Util.toParameter(params));
	};
	
	/**
	 * Stop a 3D model's animation (only valid for md2 models). 
	 */
	this.stopAnimation = function()
	{
		var params = {"id": this.id};
		return arel.ClientInterface.object.stopAnimation(this.id, arel.Util.toParameter(params));
	};
	
	/**
	 * If an object has a movie texture applied, you can start it with this call
	 * @param {boolean} loop true if the animation shall be looped, false otherwise, default: false
	 */
	this.startMovieTexture = function(loop)
	{
		if(loop === undefined)
			loop = false;
			
		var params = {"id": this.id, "loop": loop};
		return arel.ClientInterface.object.startMovieTexture(this.id, arel.Util.toParameter(params));
	};
	
	/**
	 * If an object has a movie texture applied, you can pause it with this call
	 */
	this.pauseMovieTexture = function()
	{
		var params = {"id": this.id};
		return arel.ClientInterface.object.pauseMovieTexture(this.id, arel.Util.toParameter(params));
	};
	
	/**
	 * If an object has a movie texture applied, you can stop it with this call
	 */
	this.stopMovieTexture = function()
	{
		var params = {"id": this.id};
		return arel.ClientInterface.object.stopMovieTexture(this.id, arel.Util.toParameter(params));
	};
	
	/**
	 * Set the transparency of the 3D model.
	 * @param {float} transparency The transparency value, where 1 corresponds to an invisible model and 0 corresponds to a fully opaque model).
	 */
	this.setTransparency = function(_transparency) {
		
		this.transparency = _transparency;
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "Transparency", _transparency, arel.Util.toParameter({"value": _transparency}, true));
		
	};
	/**
	 * Get the transparency of the 3D model.
	 * @return {float} The transparency value, where 1 corresponds to an invisible model and 0 corresponds to a fully opaque model).
	 */
	this.getTransparency = function() {return this.transparency;};
	
	/**
	 * Set the position where the object will be rendered. The z-Buffer will be ignored. The smaller the number, the earlier it will be drawn (further back in the scene)

	 * @param {int} _renderorderposition set the z-Buffer position of where the object shall be rendered. The "calculated" z-Buffer will be ignored. 
	 */
	this.setRenderOrderPosition = function(_renderorderposition) {
		
		this.renderorderposition = _renderorderposition;
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "RenderOrderPosition", _renderorderposition, arel.Util.toParameter({"value": _renderorderposition}, true));
		
	};
	
	/**
	 * Get the position where the object will be rendered. The z-Buffer will be ignored. The smaller the number, the earlier it will be drawn (further back in the scene)

	 * @return {int} Get the z-Buffer position of where the object shall be rendered. The "calculated" z-Buffer will be ignored. 
	 */
	this.getRenderOrderPosition = function() {return this.renderorderposition;};
	
	/**
	 * use this method to declare whether an object can be picked or not (clicked)
	 * @param {boolean} _picking true to enable picking of this model, false to disable it 
	 */
	this.setPickingEnabled = function(_picking) {
		
		this.picking = _picking;
		
		//update the information in the scene if the Object exists in the scene
		return arel.Scene.updateObject(this.id, "PickingEnabled", _picking, arel.Util.toParameter({"value": _picking}, true));
	};
	/**
	 * use this method to determine whether an object can be picked or not (clicked)
	 * @return {boolean} true if picking is enabled, false otherwise
	 */
	this.isPickingEnabled = function() {return this.picking;};
	
	/**
	 * Get the Object type constant (3d)
	 */
	this.getType = function(){return this.TYPE; };
	
	/**
	 * Set the Object type constant
	 * @private
	 */
	this.setType = function(_type){this.TYPE = _type; };
	
	//call the constructor
	this.init(_id, _modelPath, _texturePath);
};

/** @private */
arel.Object.Model3D.prototype = new arel.Object;
arel.Object.Model3D.prototype.constructor = arel.Object.Model3D;
arel.Object.Model3D.prototype.parent = arel.Object.prototype;
//arel.Object.Model3D.arelInheritFrom(arel.Object);

/**
 * Create an 3D Model based on model and texture (can also only have modelPath if the model is a zipped obj or md2 including the texture) 
 * @param {String} _id object id
 * @param {String} _modelPath path to the model's texture
 * @param {String} _texturePath path to the model's texture
 * @static
 */

arel.Object.Model3D.create = function(_id, _modelPath, _texturePath)
{
	return new arel.Object.Model3D(_id, _modelPath, _texturePath);
};

/**
 * Create an Image 3D Model based on an image provided.
 * @param {String} _id object id
 * @param {String} _imagePath path to the image that shall be rendered
 * @static
 */

arel.Object.Model3D.createFromImage = function(_id, _imagePath)
{
	var imageModel3D = new arel.Object.Model3D(_id, undefined, _imagePath);
	imageModel3D.setType(arel.Config.OBJECT_IMAGE3D);
	
	return imageModel3D;
};

/**
 * Create a Movie 3D Model based on an the movie file provided.
 * @param {String} _id object id
 * @param {String} _moviePath path to the image that shall be rendered
 * @static
 */

arel.Object.Model3D.createFromMovie = function(_id, _moviePath, _alphatransparent)
{
	var movieModel3D = new arel.Object.Model3D(_id);
	movieModel3D.setType(arel.Config.OBJECT_MOVIE3D);
	movieModel3D.setMovie(_moviePath);
	
	return movieModel3D;
};		//arel.include("js/objects/ObjectMovie.js");
		//arel.include("js/objects/ObjectImage.js");
		
		//interaction helper
/** @author Frank Angermann
 *  @version beta
 *  @class The arel.Media class is the interface towards display of images, play back of sound and video and opening websites.
 */ 
arel.Media = 
{
	/** Type URL
	 * @constant
	 */
	WEBSITE: "website",
	
	/** Type sound
	 * @constant
	 */
	SOUND: "sound",
	/** Type Video
	 * @constant
	 */
	VIDEO: "video",
		
	/**
	 * Action type. Define to open website, image or video.
	 * @private
	 * @constant
	 */
	ACTION_OPEN: "open",
	/**
	 * Action type. Define to play sound
	 * @private
	 * @constant
	 */
	ACTION_PLAY: "play",
	/**
	 * Action type. Define to close sound
	 * @private
	 * @constant
	 */
	ACTION_CLOSE: "close",
	
	/**
	 * Action type. Define to pause a sound.
	 * @private
	 * @constant
	 */
	ACTION_PAUSE: "pause",
	
	/**
	 * Open a website in the web view
	 * @param {string} url The url to be opened
	 * @param {boolean|string} external Android only. If set to true, the external browser will be opened, otherwise - and always on iPhone - the internal  
	 */
	openWebsite: function(_url, _external)
	{
		if(!_external || _external === "false")
		{
			_external = "false";
		}
		else
		{
			_external = "true";
		}
			
		return this.handleMedia(this.WEBSITE, _url, this.ACTION_OPEN, _external);
	},
	
	/**
	 * Start a sound to be played. Allowed filetyps are mp3
	 * @param {string} soundPath File path to the mp3 to be played back
	 */
	startSound: function(_soundFilePath)
	{
		return this.handleMedia(this.SOUND, _soundFilePath, this.ACTION_PLAY, undefined);
	},
	
	/*
	 * Pauses the sound that was started before.
	 */
	pauseSound: function()
	{
		return this.handleMedia(this.SOUND, undefined, this.ACTION_PAUSE, undefined);
	},
	
	/**
	 * Stop the sound that was started before.
	 */
	stopSound: function()
	{
		return this.handleMedia(this.SOUND, undefined, this.ACTION_CLOSE, undefined);
	},
	
	/**
	 * Start a video to be played. Allowed filetyps are mp4. the video will be streamed in the fullscreen player.
	 * @param {string} videoPath File path to the mp4 to be played back.
	 */
	startVideo: function(_videoFilePath)
	{
		return this.handleMedia(this.VIDEO, _videoFilePath, this.ACTION_PLAY);
	},
	
	/**
	 * Triggers a vibration alert
	 */
	triggerVibration: function()
	{
		return arel.ClientInterface.media.vibrate();
	},
	/**
	 * 
	 * Method all the helper methods refer to to send the request to the arel.ClientInterface 
	 * @private
	 */
	handleMedia: function (_type, _url, _action, _external)
	{
		var params = [];
		
		if(_url)
		{
			params.url = _url;
		}
		
		if(_external)
		{
			params.external = _external;
		}
					
		if(_action)
		{
			params.action = _action;
		}
			
		if(_type === this.WEBSITE)
		{
			return arel.ClientInterface.media.website(arel.Util.toParameter(params));
		}
		else if(_type === this.VIDEO)
		{
			return arel.ClientInterface.media.video(arel.Util.toParameter(params));
		}
		else if(_type === this.IMAGE)
		{
			return arel.ClientInterface.media.image(arel.Util.toParameter(params));
		}
		else if(_type === this.SOUND)
		{
			return arel.ClientInterface.media.sound(arel.Util.toParameter(params));
		}
		else
		{
			return arel.Error.write("Invalid media type");
		}
	}
};/** @author Frank Angermann
 *  @version beta
 *  @class The arel.navigation class is the interface to navigate users based on user interaction
 */ 
arel.Navigation = 
{
	/**
	 * Route the user to a GPS position specified in an object that is known to the scene.
	 * @param {string|arel.Object} arObjectOrID Object (arel.Object.Object3d or arel.POI) or the id of the object to get the route to via Google Maps
	 */
	routeToObjectOnGoogleMaps: function(objectOrId)
	{
		var id = "";
		var params = []; 
		
		if(objectOrId instanceof arel.Object)
		{
			params.id = objectOrId.getID();
		}
		else
		{
			params.id = objectOrId;
		}
			
		//check if this Object is registered in the Scene
		if(arel.ObjectCache.objectExists(params.id))
		{
			return arel.ClientInterface.navigate.routeToOnGoogleMaps(arel.Util.toParameter(params));
		}
		else
		{
			return arel.Error.write("Invalid location given");
		}
		
	},
	
	/**
	 * Route the user to a GPS position specified with latitude, longitude + a name of the location
	 * @param {float} latitude latitude of the coordinate to route to
	 * @param {float} longitude longitude of the coordinate to route to
	 * @param {float} name name of the position specified
	 */
	routeToGPSOnGoogleMaps: function(lat, lng, name)
	{
		var params = []; 
		
		if(arel.Parser.validateLatitude(lat) && arel.Parser.validateLongitude(lng))
		{	
			params.l = lat + "," + lng + ",0";
			
			if(name !== undefined)
			{
				params.title = name;
			}
							
			return arel.ClientInterface.navigate.routeToOnGoogleMaps(arel.Util.toParameter(params));
		}
		else
		{
			return arel.Error.write("Invalid location given");
		}		
	}
};		
		//callback interface
/**
 *	
 *  @author Frank Angermann
 *  @version beta
 * 
 *  @class "Static Class" to handle callbacks. The client will only get a callback ID and the callback method behind will be stored here
 *  @private 
 *	
 */ 
arel.CallbackInterface = 
{
	//array to store the callbacks
	/** @private */
	callbackHandler:	{},
	
	/**
	 * Stores a callback function
	 * @private 
	 * @param {function} callback function to be called upon return of information from the client
	 * @param {Object} caller the object this shall be referenced to in the callback function -> optional
	 * @return {int} callback ID
	 */
	addCallbackFunction : function(callback, caller)
	{
		if(callback && typeof(callback) === "function")
		{
			//define an ID
			//the id is simply the current time (unixtime based) plus an iterator (the iterator will not be set back, but always goes up)
			//time retrieval from http://www.perturb.org/display/786_Javascript_Unixtime.html
			
			//length of the array is not valid, since due to the "_", an Object is used (no longer an array) and objects do not have a length
			var id = String(new Date().valueOf()) + "_" + arel.callbackMethodIterator;
			arel.callbackMethodIterator++;
					
			this.callbackHandler[id] = [callback, caller];	
			return id;		
		}		
		else //the callback is not a function
		{
			return arel.Error.write("callback needs to be specified.");
		}
	},	
	
	/**
	 * Remove a callback function from the object
	 * @private 
	 * @param {int} callbackID Id of the callback to be removed
	 * @return {Boolean} true if removed, false if not
	 */
	removeCallbackFunction: function(callbackID)
	{
		//check if this callback exists
		if(this.callbackHandler[callbackID] === undefined)
		{
			return arel.Error.write("callback id not specified.");
		}
		
		//remove the event
		delete(this.callbackHandler[callbackID]);
				
		return true;
	},
			
	/** 
	 * e.g.<br />
	 * arel.Events.callCallbackFunction(135312156849, new arel.Vector3D(23.5,11.9,0));
	 * @private
	 * @param {int} callbackID id of the callback function to be called
	 * @param {Object|arel.LLA|arel.Vector3D} params js object with parameters defined or specific types (e.g. arel.LLA, arel.Vector3D, etc)
	 */
	callCallbackFunction : function(callbackID, params)
	{
		//get the callback function
		try
		{
			var callbackInformation = this.callbackHandler[callbackID];
			
			//call the eventhandler and pass a scene element
			if(callbackInformation === undefined)
			{
				return arel.Error.write("Callbackinformation not found.");
			}
		
			if(callbackInformation[0] === undefined || typeof(callbackInformation[0]) !== "function")
			{
				return arel.Error.write("Callback function undefined or not a function.");
			}
				
			if(callbackInformation[1] !== undefined)
			{			
				callbackInformation[0].call(callbackInformation[1], params);
			}
			else
			{
				callbackInformation[0](params);
			}
			
			//debug stream
			arel.Debug.logStream("Incoming callback information from renderer.");
		
			//remove the callback function again
			this.removeCallbackFunction(callbackID);
		} 
		catch(e) 
		{
			return arel.Error.write("Error calling callback." + e);
		}
			
		return true;
	}	
};		
		//junaio specific
		//arel.include("js/Junaio.js");
		
		//check if arel is ready to start
		//taken from jQuery
		// Cleanup functions for the document ready method
		if(!arelTEST)
		{
			if ( document.addEventListener ) {
				/**
				 * @private 
				 */
				DOMContentLoaded = function() {
					document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
					arel.readyforexecution();
				};
			
			} else if ( document.attachEvent ) {
				/**
				 * @private 
				 */
				DOMContentLoaded = function() {
					// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
					if ( document.readyState === "complete" ) {
						document.detachEvent( "onreadystatechange", DOMContentLoaded );
						arel.readyforexecution();
					}
				};
			}
			
			// Mozilla, Opera and webkit nightlies currently support this event
			if ( document.addEventListener ) {
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
				
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", arel.readyforexecution, false );
	
			// If IE event model is used
			} else if ( document.attachEvent ) {
				// ensure firing before onload,
				// maybe late but safe also for iframes
				document.attachEvent("onreadystatechange", DOMContentLoaded);
				
				// A fallback to window.onload, that will always work
				window.attachEvent( "onload", arel.readyforexecution );
			}
		}
		else
		{
			arel.readyforexecution();
		}		
//	}
//)(window)