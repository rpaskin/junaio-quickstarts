
var objectIsAdded=false;

arel.sceneReady(function()
	{
        //arel.Debug.activate();
        arel.Debug.deactivateArelLogStream();
	});

function onButtonPushed()
{
    if( objectIsAdded )
    {
        arel.GestureHandler.removeObject( "1" );
        objectIsAdded = false;
        document.getElementById("thebutton").innerText = "Enable";
    }
    else
    {
        arel.GestureHandler.addObject( "1" );
        objectIsAdded = true;
        document.getElementById("thebutton").innerText = "Disable";

        arel.Events.setListener(arel.GestureHandler, function(type, groupID, objects){
            gestureHandler(type, groupID, objects);
        });

    }
};

function gestureHandler(type, groupID, objects)
{
    if(type == "translating_start")
    {
        document.getElementById('info').innerHTML = "Translation";
    }
    else if(type == "translating_end")
    {
        document.getElementById('info').innerHTML = "";
    }
    else if(type == "scaling_start")
    {
        document.getElementById('info').innerHTML = "Scaling";
    }
    else if(type == "scaling_end")
    {
        document.getElementById('info').innerHTML = "";
    }
    else if(type == "rotating_start")
    {
        document.getElementById('info').innerHTML = "Rotating";
    }
    else if(type == "rotating_end")
    {
        document.getElementById('info').innerHTML = "";
    }
};