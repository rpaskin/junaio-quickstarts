arel.sceneReady(function()
{
	//Just for Debuging purposes
	//arel.Debug.activate();
	//arel.Debug.deactivateArelLogStream();
	
	//set a listener to tracking to get information about when the image is tracked
	arel.Events.setListener(arel.Scene, function(type, param){trackingHandler(type, param);});
	
	//if the user holds the device over the pattern already, when the scene starts
	arel.Scene.getTrackingValues(function(trackingValues){receiveTrackingStatus(trackingValues);});
	
	//get the metaio man model reference
	var metaioman = arel.Scene.getObject("1");
	
	//set a listener on the metaio man
	arel.Events.setListener(metaioman, function(obj, type, params){handleMetaioManEvents(obj, type, params);});

    //write the tracking counter from the localstorage into an HTML Div-Container
    if(typeof(Storage)!=="undefined")
    {
        if (!localStorage.glue2LocalCounter)
        {
            localStorage.glue2LocalCounter=1;
        }
        $("#localNumber").html("You tracked the metaio man pattern: "+ localStorage.glue2LocalCounter + " times");
    }
    else
    {
        $("#localNumber").html("Sorry, your browser does not support web storage...");
    }
});

function trackingHandler(type, param)
{
	//check if there is tracking information available
	if(param[0] !== undefined)
	{
		//if the pattern is found, hide the information to hold your phone over the pattern
		if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
		{
			$('#info').hide();

            //Increase the localstorage counter
            if(typeof(Storage)!=="undefined")
            {
                if (localStorage.glue2LocalCounter)
                {
                    localStorage.glue2LocalCounter=Number(localStorage.glue2LocalCounter)+1;
                }
                else
                {
                    localStorage.glue2LocalCounter=1;
                }
                $("#localNumber").html("You tracked the metaio man pattern: "+ localStorage.glue2LocalCounter + " times");
            }
            else
            {
                $("#localNumber").html("Sorry, your browser does not support web storage...");
            }
		}
		//if the pattern is lost tracking, show the information to hold your phone over the pattern
		else if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
		{
			$('#info').show();
		}
	}
};

function receiveTrackingStatus(trackingValues)
{
	if(trackingValues[0] === undefined)
		$('#info').show();
	
};

function handleMetaioManEvents(obj, type, param)
{
	//check if the object has been clicked
	if(type && type === arel.Events.Object.ONTOUCHSTARTED)
	{
		obj.startAnimation("close_down");
	}//or if the animation of the object ended
	else if(type && type === arel.Events.Object.ONANIMATIONENDED && param.animationname == "close_down")
	{
		obj.startAnimation("close_up");
	}
};