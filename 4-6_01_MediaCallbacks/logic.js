/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Nicolas King
 */
arel.sceneReady(function()
{
	//Just for Debuging purposes
	//arel.Debug.activate();
	//arel.Debug.deactivateArelLogStream();
	
	//Tell the user which tracking patter he/she should use if the tracking didn't start yet
	arel.Events.setListener(arel.Scene, function(type, param){

		if(param[0] !== undefined)
		{
			//if the pattern is found, hide the information to hold your phone over the pattern
			if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
			{
				$('#info').hide();
			}
			//if the pattern is lost tracking, show the information to hold your phone over the pattern
			else if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
			{
				$('#info').show();
			}
		}
	
	});
	
	//if the user holds the device over the pattern already, when the scene starts
	arel.Scene.getTrackingValues(function(trackingValues){

		if(trackingValues[0] === undefined)
			$('#info').show();
	
	});
	
	//Set a EventListener to the object
	arel.Events.setListener(arel.Scene.getObject("playMovie"),
	function(obj, type, params)
	{
		//Reactes if user startet his/her touch at the obejct
		if(type && type === arel.Events.Object.ONTOUCHSTARTED)
		{
			//Remove all Object from the scene
			arel.Scene.removeObjects();
			//Remove the scene EventListener
			arel.Events.removeListener(arel.Scene);
			//Create instance of the movieTexutre class
			firstStep = new movieTexture();
		}
	}
	);
});

function movieTexture()
{
	this.init = function()
	{
		var that = this;
		//Create new Object with VideoTexture
		try
		{
			var videoObject = new arel.Object.Model3D.createFromMovie("glueMovie", "resources/media/film32.3G2",false);
			videoObject.setScale(new arel.Vector3D(2,2,2));
			arel.Scene.addObject(videoObject);
            videoObject.startMovieTexture(false);
			
			//create ClickMe object for FullScreen
			var clickMeObject = new arel.Object.Model3D.create("clickMe", "resources/models/clickMe.zip","");
			clickMeObject.setScale(new arel.Vector3D(0.02,0.02,0.02));
			clickMeObject.setTranslation(new arel.Vector3D(100,-100,0));
			arel.Scene.addObject(clickMeObject);

			arel.Events.setListener(arel.Scene,function(type, params){that.startSceneHandler(type, params)});
			
			arel.Events.setListener(clickMeObject,
									function(obj, type, params)
									{
										if(type && type === arel.Events.Object.ONTOUCHSTARTED)
										{
											arel.Scene.removeObjects();
											arel.Events.removeListener(videoObject);
											arel.Events.removeListener(arel.Scene);
											arel.Events.removeListener(clickMeObject);
											secondStep = new fullscreenMovie();
										}
									}
									);
		}
		catch(e)
		{
			arel.Debug.error(e);
		}
	}

	//Controle the Tracking for pause or resume the Movie Texture
	this.startSceneHandler = function(type, param)
	{
		try
		{
			if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
			{
				arel.Scene.getObject("glueMovie").startMovieTexture(true);
			}
			else if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
			{
				arel.Scene.getObject("glueMovie").pauseMovieTexture();
			}
		}
		catch(e)
		{
			arel.Debug.error(e);
		}
	}
	
	this.init();
};

//Create a Fullscreen and react on the callback
function fullscreenMovie()
{
	this.init = function()
	{
		var that = this;
		var moviePath = "resources/media/film32.3G2";
		arel.Media.startVideo(moviePath);
		arel.Events.setListener(arel.Media,function(type, params){that.startSceneHandler(type, params)});
	}
	
	this.startSceneHandler = function(type, param)
	{
		try
		{
			if(type && type == arel.Events.Media.VIDEO_CLOSED)
			{
				arel.Scene.removeObjects();
				arel.Events.removeListener(arel.Media);
				thirdStep = new soundFile();
			}
		}
		catch(e)
		{
			arel.Debug.error(e);
		}
	}
	
	this.init();
};

//Start a sound and react on the callback
function soundFile()
{
	this.init = function()
	{
		//create SoundPlay Object
		var that = this;
		var playSoundObject = new arel.Object.Model3D.create("PlaySound", "resources/models/playSound.zip","");
		playSoundObject.setScale(new arel.Vector3D(0.22,0.22,0.22));
		playSoundObject.setTranslation(new arel.Vector3D(0,0,0));
		arel.Scene.addObject(playSoundObject);
		
		arel.Events.setListener(playSoundObject,
								function(obj, type, params)
								{
									if(type && type === arel.Events.Object.ONTOUCHSTARTED)
									{
										arel.Scene.removeObjects();
										arel.Events.removeListener(playSoundObject);
										that.playSound();
									}
								}
								);
	}
	
	this.playSound = function()
	{
		var that = this;
		var soundPath = "resources/media/shortSound.mp3";
		arel.Media.startSound(soundPath);
		try
		{
			arel.Events.setListener(arel.Media,function(type, params){that.startSoundHandler(type, params);});
		}
		catch(e)
		{
			arel.Debug.error(e);
		}
	}
	
	this.startSoundHandler = function(type, param)
	{
		try
		{
			if(type && type == arel.Events.Media.ONSOUNDPLAYBACKCOMPLETE)
			{
				arel.Scene.removeObjects();
				arel.Events.removeListener(arel.Media);
				forthStep = new webSite();
			}
		}
		catch(e)
		{
			arel.Debug.error(e);
		}
	}
	
	this.init();
};

//Open a website and react on the close callback
function webSite()
{
	this.init = function()
	{
		var that = this;
		var websiteObject = new arel.Object.Model3D.create("PlaySound", "resources/models/website.zip","");
		websiteObject.setScale(new arel.Vector3D(0.22,0.22,0.22));
		websiteObject.setTranslation(new arel.Vector3D(0,0,0));
		arel.Scene.addObject(websiteObject);
		
		arel.Events.setListener(websiteObject,
				function(obj, type, params)
				{
					if(type && type === arel.Events.Object.ONTOUCHSTARTED)
					{
						arel.Scene.removeObjects();
						arel.Events.removeListener(websiteObject);
						var url = "resources/landingPage.html";
						arel.Media.openWebsite(url, false);
						arel.Events.setListener(arel.Media,function(type, params){that.startWebsiteHandler(type, params);});
					}
				}
				);
	}
	
	this.startWebsiteHandler = function(type, param)
	{
		try
		{
			if(type && type == arel.Events.Media.WEBSITE_CLOSED)
			{
				arel.Scene.removeObjects();
				arel.Events.removeListener(arel.Media);
				lastStep = new restart();
			}
		}
		catch(e)
		{
			arel.Debug.error(e);
		}
	}
	
	this.init();
};

//Creates a 3D Modell with ontouchstart event for restarting the channel
function restart()
{
	this.init = function()
	{
		//create SoundPlay Object
		var that = this;
		var restartObject = new arel.Object.Model3D.create("RestartChannel", "resources/models/reload.zip","");
		restartObject.setScale(new arel.Vector3D(0.22,0.22,0.22));
		restartObject.setTranslation(new arel.Vector3D(0,0,0));
		arel.Scene.addObject(restartObject);
		
		arel.Events.setListener(restartObject,
								function(obj, type, params)
								{
									if(type && type === arel.Events.Object.ONTOUCHSTARTED)
									{
										arel.Scene.removeObjects();
										arel.Events.removeListener(restartObject);
										arel.Scene.triggerServerCall(false, {"filter_param":"Refresh"}, false);
									}
								}
								);
	}
	
	this.init();
};