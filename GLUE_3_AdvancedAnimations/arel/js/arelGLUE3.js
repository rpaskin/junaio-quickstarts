//has the trooper already appeared in the scene
var trooperHasAppeared = false;

//has the trooper shot
var trooperhasShot = false;

//is the trooper dead
var trooperisDead = false;

//ID of the timer needed for the advanced "what to track" HTML overlay
var timerIDTrackingInfo = undefined;

//the metaio man object
var metaioman = undefined;

//the trooper object
var trooper = undefined;

arel.sceneReady(function()
{
	//set a listener to tracking to get information about when the image is tracked
	arel.Events.setListener(arel.Scene, function(type, param){trackingHandler(type, param);});
	
	//if the user holds the device over the pattern already, when the scene starts, no "what to track" information will be shown
	//so we check if there are valid tracking values returned at this step
	arel.Scene.getTrackingValues(function(trackingValues){receiveTrackingStatus(trackingValues);});	
	
	//get the models
	metaioman = arel.Scene.getObject("mMan");
	trooper = arel.Scene.getObject("lTrooper");
	
	//set a listener on the metaio man
	arel.Events.setListener(metaioman, function(obj, type, params){handleMetaioManEvents(obj, type, params);});
	
	//set a listener on the trooper
	arel.Events.setListener(trooper, function(obj, type, params){handleTrooperEvents(obj, type, params);});	
});

function trackingHandler(type, param)
{
	//check if there is tracking information available
	if(param[0] !== undefined)
	{
		//if the pattern is found, hide the information to hold your phone over the pattern and start the appear information on the trooper (if not done so already)
		if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
		{
			//start the appear animation of the trooper, if the trooper has not appeared before
			if(!trooperHasAppeared)
			{
				trooper.startAnimation("appear");
				//start a sound (the path to the sound is stored in a parameter of the trooper)
				arel.Media.startSound(trooper.getParameter("appearSound"));
				trooperHasAppeared = true;
			}
			
			//fadeout the information
			$('#info').fadeOut("fast");
			
			//if the timer for showing the "no tracking" information is still running, remove it
			if(timerIDTrackingInfo !== undefined)
				clearTimeout(timerIDTrackingInfo);
		}
		//if the pattern is lost tracking, show the information to hold your phone over the pattern
		else if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
		{
			//wait 1 seconds until fading in the "what to track" information
			timerIDTrackingInfo = setTimeout(function(){$('#info').fadeIn("fast");}, 1000);
		}
	}
};

//needed only for the start. If no valid tracking information is returned, show the "what to track" information
function receiveTrackingStatus(trackingValues)
{
	//the user is currently not holding the phone over a valid reference image -> fade in the information what to track
	if(trackingValues[0] === undefined)
		$('#info').fadeIn("fast");
	//if the tracking is valid and the the trooper has not appeared yet, please let him do so
	else if(!trooperHasAppeared)
	{
		//start the apear animation of the trooper
		trooper.startAnimation("appear");
		//start a sound (the path to the sound is stored in a parameter of the trooper)
		arel.Media.startSound(trooper.getParameter("appearSound"));
		trooperHasAppeared = true;
	}
	
};

function handleMetaioManEvents(obj, type, param)
{
	//play around with animations
	if(type && type === arel.Events.Object.ONANIMATIONENDED)
	{
		//based on the animation that has ended, another one is triggered
		//please see the animation flow in the description of the channel (index.php)
		switch(param.animationname)
		{
			case "shock_up":
				obj.startAnimation("idle");
				break;
			case "idle":
				if(trooperhasShot && !trooperisDead)
					obj.startAnimation("close_down");
				break;
			case "close_down":
				trooper.startAnimation("die");
				trooperisDead = true;
				obj.startAnimation("close_up");
				break;
			case "close_up":
				obj.startAnimation("idle", true);
				break;
		}		
	}
};

function handleTrooperEvents(obj, type, param)
{
	//play around with animations
	if(type && type === arel.Events.Object.ONANIMATIONENDED)
	{
		switch(param.animationname)
		{
		//based on the animation that has ended, another one is triggered
		//please see the animation flow in the description of the channel (index.php)
			case "appear": 
				//fadein the metaio man and start the fight when done
				if(!trooperhasShot)
					arel.Plugin.Animation.fadeIn(metaioman, 8, 50, function() {startTheFight();});
				else
				{
					trooperisDead = false;
					startTheFight();
				}
				break;
			case "die":
				//2s after the trooper died, have him appear again to start over
				setTimeout(function(){
					trooper.startAnimation("appear");
					arel.Media.startSound(trooper.getParameter("appearSound"));
				}, 2000);
				break;
		}		
	}
};

function startTheFight()
{
	//let metaio man idle
	metaioman.startAnimation("idle", true);
	
	//let the trooper fire 1s after the metaio man has appeared
	//1 second after the fire, start the animation of the metaio man "shock_up"
	setTimeout(function(){
		trooperhasShot = true;
		trooper.startAnimation("fire");
		setTimeout(function(){
			metaioman.startAnimation("shock_up");
			}, 1000);		
	}, 1000);	
};