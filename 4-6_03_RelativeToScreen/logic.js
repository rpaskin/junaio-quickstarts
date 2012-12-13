arel.sceneReady(function()
{
	//Just for Debuging purposes
	//arel.Debug.activate();
	//arel.Debug.deactivateArelLogStream();
	
	//Create the ammunition display
	var ammunition = arel.Object.Model3D.createFromImage("ammo", "bullet3.jpg");
	//Set the ScreenAnchor to Top-Right
	ammunition.setScreenAnchor(arel.Constants.ANCHOR_TR);
	//Add the new Object to the Scene
	arel.Scene.addObject(ammunition);
});

//This function will be triggered if the user is pressing the Shoot Button
function shoot()
{
	//Get the object with the object-id blaster
	var object = arel.Scene.getObject("blaster");
	//Start the shoot animation without loop
	object.startAnimation("fire", false);
	
	//Reduce the bullet display
	var bulletDisplay = arel.Scene.getObject("ammo");
	var bulletTex = bulletDisplay.getTexture();
	
	if(bulletTex == "bullet3.jpg")
	{
		bulletDisplay.setTexture("bullet2.jpg");
	}
	else if(bulletTex == "bullet2.jpg")
	{
		bulletDisplay.setTexture("bullet1.jpg");
	}
	else if(bulletTex == "bullet1.jpg")
	{
		bulletDisplay.setTexture("bullet3.jpg");
	}
	
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