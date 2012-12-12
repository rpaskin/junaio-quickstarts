var objectIsAdded=false;

arel.sceneReady(function()
{
    ///Just for Debuging purposes
	//arel.Debug.activate();
	//arel.Debug.deactivateArelLogStream();
});

//This function will check the user click and if the gesture handling is activated or not
function onButtonPushed()
{
    if( objectIsAdded )
    {
        arel.GestureHandler.removeObject( "1" );
        objectIsAdded = false;
        document.getElementById("thebutton").innerText = "Enable gestures";
    }
    else
    {
    	//This function will add your object with the id "1" to the gesture handler
    	//This will acitvate the gesture handling for your object
        arel.GestureHandler.addObject( "1" );
        objectIsAdded = true;
        document.getElementById("thebutton").innerText = "Disable gestures";

        //Add an EventListener to get the gesture events
        arel.Events.setListener(arel.GestureHandler, function(type, groupID, objects){
            gestureHandler(type, groupID, objects);
        });

    }
};

//Reacte on user gestures
//This function will just show which gesture is done at the moment
function gestureHandler(type, groupID, objects)
{
    if(type == "translating_start")
    {
        document.getElementById('info').innerHTML = "Translation";
    }
    else if(type == "translating_end")
    {
        document.getElementById('info').innerHTML = "&nbsp;";
    }
    else if(type == "scaling_start")
    {
        document.getElementById('info').innerHTML = "Scaling";
    }
    else if(type == "scaling_end")
    {
        document.getElementById('info').innerHTML = "&nbsp;";
    }
    else if(type == "rotating_start")
    {
        document.getElementById('info').innerHTML = "Rotating";
    }
    else if(type == "rotating_end")
    {
        document.getElementById('info').innerHTML = "&nbsp;";
    }
};