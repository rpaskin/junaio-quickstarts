arel.sceneReady(function()
{
	//Just for Debuging purposes
	//arel.Debug.activate();
	//arel.Debug.deactivateArelLogStream();
	
	//Create the ammunition display
	var ammunition1 = arel.Object.Model3D.createFromImage("ammo1", "bullet.png");
	//Set the ScreenAnchor to Top-Right
	ammunition1.setScreenAnchor(arel.Constants.ANCHOR_TR);
	ammunition1.setTranslation(new arel.Vector3D(0,-40,0));
	//Add the new Object to the Scene
	arel.Scene.addObject(ammunition1);
	
	var ammunition2 = arel.Object.Model3D.createFromImage("ammo2", "bullet.png");
	//Set the ScreenAnchor to Top-Right
	ammunition2.setScreenAnchor(arel.Constants.ANCHOR_TR);
	ammunition2.setTranslation(new arel.Vector3D(-20,-40,0));
	//Add the new Object to the Scene
	arel.Scene.addObject(ammunition2);
	
	var ammunition3 = arel.Object.Model3D.createFromImage("ammo3", "bullet.png");
	//Set the ScreenAnchor to Top-Right
	ammunition3.setScreenAnchor(arel.Constants.ANCHOR_TR);
	ammunition3.setTranslation(new arel.Vector3D(-40,-40,0));
	//Add the new Object to the Scene
	arel.Scene.addObject(ammunition3);
});

var shots = 3;
//This function will be triggered if the user is pressing the Shoot Button
function shoot()
{
	//Get the object with the object-id blaster
	var object = arel.Scene.getObject("blaster");
	//Start the shoot animation without loop
	object.startAnimation("fire", false);
	
	//Reduce the bullet display
	if(shots >= 1)
	{
		var bullet = arel.Scene.getObject("ammo"+shots);
		bullet.setTransparency(1);
		shots--;
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