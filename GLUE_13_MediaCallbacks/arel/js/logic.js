/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Nicolas King
 */
arel.sceneReady(function()
{
	//arel.Debug.activate();
	arel.Debug.deactivateArelLogStream();
	
	arel.Events.setListener(arel.Scene.getObject("playMovie"),
							function(obj, type, params)
							{
								if(type && type === arel.Events.Object.ONTOUCHSTARTED)
								{
									arel.Scene.removeObjects();
									arel.Events.removeListener(arel.Scene);
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
			if(type && type == "VIDEO_CLOSED")
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
			if(type && type == "onsoundplaybackcomplete")
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
			if(type && type == "WEBSITE_CLOSED")
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