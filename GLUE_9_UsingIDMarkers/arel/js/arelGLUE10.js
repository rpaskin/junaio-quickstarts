var trooper = undefined;
var marker1Detected = false;
var marker3Detected = false;
var inited = false;
var timerIDMarker1 = undefined;
var timerIDMarker3 = undefined;

arel.sceneReady(function()
{
	//set a listener to tracking to get information about when the image is tracked
	arel.Events.setListener(arel.Scene, function(type, param){trackingHandler(type, param);});
	
	//if the user holds the device over the pattern already, when the scene starts
	arel.Scene.getTrackingValues(function(trackingValues){trackingHandler(trackingValues);});	
	
	//get the trooper
	trooper = arel.Scene.getObject("lTrooper");
	
	//start the default animation
	trooper.startAnimation("walk", true);
	
	//show the info
	$('#info').fadeIn("fast");
});

//this function is called, whenever a scene event occurs
function trackingHandler(type, param)
{
	//check if marker 1 or marker 2 is tracking or not
	if(type && type == arel.Events.Scene.ONTRACKING && param[0] !== undefined)
	{
		//step through all coordinate systems that have sent an event at the same time
		for(var i in param)
		{
			//make sure only valid arel.TrackingValues are considered 
			if(typeof(param[i]) !== "function")	
			{
				//this coordinate system is tracking at the moment
				if(param[i].getState() == arel.Tracking.STATE_TRACKING)
				{
					//ID Marker 1
					if(param[i].getCoordinateSystemID() == 1)
					{
						
						//if it has not been inited yet (first start), mark it to be inited
						//if marker 3 had been inited before, make sure to remove the tracking information
						if(!inited)
						{
							marker1Detected = true;
							
							if(marker3Detected)
							{
								inited = true;
								$('#info').fadeOut("fast");
							}
						}
						//make sure to clear all rotations 
						else
						{
							clearAllTimers();
						}
					}
					//if it has not been inited yet (first start), mark it to be inited
					//if marker 1 had been inited before, make sure to remove the tracking information
					else if(param[i].getCoordinateSystemID() == 3)
					{
						if(!inited)
						{
							marker3Detected = true;
							
							if(marker1Detected)
							{
								inited = true;
								$('#info').fadeOut("fast");
							}
						}
						//make sure to clear all rotations 
						else
						{
							clearAllTimers();							
						}
								
					}
				}
				//we lost tracking of one or more markers
				else if(param[i].getState() == arel.Tracking.STATE_NOTTRACKING)
				{
					//the channel has been inited, meaning ID MArker 1 and 3 have been tracking at least once
					if(inited)
					{
						if(param[i].getCoordinateSystemID() == 1)
						{
							//use the timer, to wait 500ms little before starting the rotation
							timerIDMarker1 = setTimeout(function(){turnModel(-1, 1);}, 500);
						}
						else if(param[i].getCoordinateSystemID() == 3)
						{
							//use the timer, to wait 500ms little before starting the rotation
							timerIDMarker3 = setTimeout(function(){turnModel(1, 3);}, 500);
						}
					}
				}
			}
		}	
	}
};

//based on which marker being tracked, the model is being rotated
function turnModel(direction, cosID)
{
	//turn the model in the "direction"
	//get the old rotation value
	var oldRotation = trooper.getRotation().getEulerAngleDegrees();
	
	//due to conversions between Quaternion and Euler the axis will be switched at a certain point
	if(Math.floor(oldRotation.getX()) != 180)
		oldRotation.setY(oldRotation.getY() + (5 * direction));
	else
		oldRotation.setY(oldRotation.getY() - (5 * direction));
	
	//get the new rotation and apply it to the lego man
	var newRotation = new arel.Rotation();
	newRotation.setFromEulerAngleDegrees(oldRotation);
	trooper.setRotation(newRotation);
	
	//set a timeout to do the same thing again -> this time quicker
	if(cosID == 1)
		timerIDMarker1 = setTimeout(function(){turnModel(direction);}, 50);
	else
		timerIDMarker3 = setTimeout(function(){turnModel(direction);}, 50);
}

function clearAllTimers()
{
	clearTimeout(timerIDMarker1);
	clearTimeout(timerIDMarker3);
}