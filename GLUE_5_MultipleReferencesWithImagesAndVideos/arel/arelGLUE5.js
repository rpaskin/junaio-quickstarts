var timerIDTrackingInfo = undefined;

arel.sceneReady(function()
{
	//Just for Debuging purposes
	//arel.Debug.activate();
	//arel.Debug.deactivateArelLogStream();
	
	//set a listener to tracking to get information about when the image is tracked
	arel.Events.setListener(arel.Scene, function(type, param){trackingHandler(type, param);});
});

function trackingHandler(type, param)
{
	//check if there is tracking information available
	if(param[0] !== undefined)
	{
		//if the pattern is found, start one of the two movies /with or without alpha transparency)
		if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
		{
			if(param[0].getCoordinateSystemID() == 1)
				arel.Scene.getObject("movie").startMovieTexture();
			else if(param[0].getCoordinateSystemID() == 3)
				arel.Scene.getObject("movieTransparent").startMovieTexture();
		}
		//if the pattern is lost, pause one of the two movies /with or without alpha transparency)
		else if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
		{
			//pause the movies
			if(param[0].getCoordinateSystemID() == 1)
				arel.Scene.getObject("movie").pauseMovieTexture();
			else if(param[0].getCoordinateSystemID() == 3)
				arel.Scene.getObject("movieTransparent").pauseMovieTexture();			
		}
	}
};