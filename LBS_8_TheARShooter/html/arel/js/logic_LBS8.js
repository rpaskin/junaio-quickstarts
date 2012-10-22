var shooter;

// if the scene is ready start your javascript
arel.sceneReady(function() {
	
	//add listener to the scene 
	shooter = new Shooter();
});

function Shooter()
{
	this.trooper = undefined;
	this.blaster = undefined;
		
	/*ADVANCED*/
	//make sure that the object was not hit
	this.objectHit = [];
		
	this.init = function()
	{
		try
		{
			//get the trooper and the blaster
			this.trooper = arel.Scene.getObject("legoTrooper");
			this.blaster = arel.Scene.getObject("legoBlaster");
			
			//register object event handler to the trooper
			arel.Events.setListener(this.trooper, function(obj, type, params) {this.handleTrooperEvents(obj, type, params);}, this);
						
			//start the idle animation of the blaster
			this.blaster.startAnimation("idle", true);
			this.trooper.startAnimation("appear");
						
			//set a timer to let the trooper shoot after 3s
			var that = this;
						
			/*ADVANCED*/
			//every 10 seconds add a new trooper at a random position
			setTimeout(function(){that.addNewTrooper();}, 10000);
		}
		catch(e)
		{
			arel.Debug.error("init " + e);
		}
	};
	
	this.handleTrooperEvents = function(obj, type, params)
	{
		/*ADVANCED*/
		//this is only called once the second trooper is loaded
		if(type && type == arel.Events.Object.ONREADY)
		{
			obj.startAnimation("appear");
			setTimeout(function(){that.trooper.startAnimation("fire", false);}, 4000);
		}
		else if(type && type == arel.Events.Object.ONANIMATIONENDED && params.animationname == "appear")
		{	
			var that = this;
			//now that the object has appeared, we can start the shooting
			arel.Events.setListener(this.blaster, function(obj, type, params) {this.handleBlasterEvents(obj, type, params);}, this);
			
			/*ADVANCED*/
			//have the trooper shoot after 4s (unless he is dead)
			//simple: setTimeout(function(){that.trooper.startAnimation("fire", false);}, 4000);
			setTimeout(function(){
				if($.inArray(obj.getID(), that.objectHit) === -1)
					obj.startAnimation("fire", false);}, 4000
			);	
		}
		else if(type && type == arel.Events.Object.ONANIMATIONENDED && params.animationname == "fire")
		{	
			//after the animation is done, wait another second to trigger it again
			setTimeout(function(){obj.startAnimation("fire", false);}, 4000);	
		}	
	};
	
	this.handleBlasterEvents = function(obj, type, params)
	{
		if(type && type == arel.Events.Object.ONTOUCHSTARTED)
		{			
			obj.startAnimation("fire");			
		}
		else if(type && type == arel.Events.Object.ONANIMATIONENDED && params.animationname == "fire")
		{
			//check if the model was hit
			//take the center of the screen
			var screenCoordinates = new arel.Vector2D();
			screenCoordinates.setX(0.5);
			screenCoordinates.setY(0.5);
			
			//check if in the center of the screen, something was hit
			arel.Scene.getObjectFromScreenCoordinates(screenCoordinates, function(objectID){ this.checkObjectHit(objectID); }, this);
			
			//go back to idling
			obj.startAnimation("idle", true);
		}		
	};
	/*ADVANCED*/
	this.addNewTrooper = function()
	{
		//only add a new trooper, if there are less than 5 + blaster + box 
		if(arel.Scene.getNumberOfObjects() < 7)
		{
			var that = this;
			var newTrooper = this.trooper;
			
			//set an ID that is not given yet
			newTrooper.setID(new Date().valueOf() + "_" + arel.Scene.getNumberOfObjects());
			
			//add a random value to the position (-1000 - 1000)
			var randomNumberX = Math.floor((Math.random() * 1500) - 749);
			var randomNumberY = Math.floor((Math.random() * 1500) - 749);
			
			var trans = newTrooper.getTranslation();
			trans.setX(trans.getX() + randomNumberX);
			trans.setY(trans.getY() - randomNumberY);
			newTrooper.setTranslation(trans);
			
			arel.Scene.addObject(newTrooper);
			arel.Events.setListener(newTrooper, function(obj, type, params) {this.handleTrooperEvents(obj, type, params);}, this);
		}
		
		//add another one in 10 seconds
		setTimeout(function(){that.addNewTrooper();}, 10000);
		
	};
	
	this.checkObjectHit = function(objectID)
	{
		//you hit it
		/*ADVANCED*/
		//simple: if(objectID !== "box"
		if(objectID !== "")
		{
			if(objectID !== "box" && $.inArray(objectID, this.objectHit))
			{
				//start the die animation and push the object on the stack of dead objects
				arel.Scene.getObject(objectID).startAnimation("die");
				this.objectHit.push(objectID) ;
				
				//remove this object after 4 seconds
				setTimeout(function(){arel.Scene.removeObject(objectID);}, 4000);
			}
		}		
	};
	
	this.init();
}