arel.sceneReady(function()
{
	//Just for Debuging purposes
	//arel.Debug.activate();
	//arel.Debug.deactivateArelLogStream();
});

//This function will be triggered if the user is pressing the Shoot Button
function shoot()
{
	//Get the object with the object-id blaster
	var object = arel.Scene.getObject("blaster");
	//Start the shoot animation without loop
	object.startAnimation("fire", false);
	
	/*
	  	To move the "Fadenkreuz" (engl. crosshair)use one of the constants
	  	
	   	arel.Constants.ANCHOR_TL
        arel.Constants.ANCHOR_TC
        arel.Constants.ANCHOR_TR
        arel.Constants.ANCHOR_CL
        arel.Constants.ANCHOR_CC
        arel.Constants.ANCHOR_CR
        arel.Constants.ANCHOR_BL
        arel.Constants.ANCHOR_BC
        arel.Constants.ANCHOR_BR
        
        and this function
        
        object.setScreenAnchor();
	 */
};