arel.sceneReady(function()
{
	var fight = new AnimationHandling();
});

function AnimationHandling()
{
	this.metaioman = undefined;
	this.trex = undefined;
	this.shooting = false;
	
	this.init = function()
	{		
		try
		{
			//get the metaio man model reference
			this.metaioman = arel.Scene.getObject("metaioMan");
			
			//get the trex model reference
			this.trex = arel.Scene.getObject("trex");
						
			//set listeners to the metaio man and to the trex
			arel.Events.setListener(this.metaioman, function(obj, type, param){this.handleMetaioManEvents(obj, type, param);}, this);
			arel.Events.setListener(this.trex, function(obj, type, param){this.handleTRexEvents(obj, type, param);}, this);
		}
		catch(e)
		{
			arel.Debug.error("init " + e);
		}
	};
	
	this.handleMetaioManEvents = function(obj, type, param)
	{
		try
		{
			//first, check when the metaio man is done loading, start the idle animation
			if(type && type == arel.Events.Object.ONREADY)
			{
				obj.startAnimation("idle", true);
			}
			//go into attack state when he is clicked (and hold)
			else if(type && type == arel.Events.Object.ONTOUCHSTARTED)
			{
				obj.startAnimation("close_down", false);
				this.shooting = true;
			}
			//stop attacking when releasing
			else if(type && type == arel.Events.Object.ONTOUCHENDED)
			{
				obj.startAnimation("close_up", false);
				this.shooting = false;
			}
			else if(type && type == arel.Events.Object.ONANIMATIONENDED)
			{
				//start a different animation once one has ended
				switch(param.animationname)
				{
					//when the shock down is over, start the shock up
					case "shock_down":
						obj.startAnimation("shock_up", false);
						break;
					case "shock_up":
						obj.startAnimation("idle", true);
						break;
					//we are still atacking
					case "close_down":
						obj.startAnimation("close_idle", true);
						this.trex.startAnimation("frame");
						break;
				}					
			}
		}
		catch(e)
		{
			arel.Debug.error("metaioEvent " + e);
		}
		
	};

	//trex
	this.handleTRexEvents = function(obj, type, param)
	{
		try
		{
			//when clicked start an animation of the trex
			if(type && type == arel.Events.Object.ONTOUCHENDED)
			{
				//start the animation of the trex
				obj.startAnimation("frame", false);
				
				//aftr 500ms, start an animation of the metaio man
				var that = this;
				var timerID = setTimeout(function(){that.metaioman.startAnimation("shock_down", false);}, 500);					
				
			}
		}
		catch(e)
		{
			arel.Debug.error("treEvent " + e);
		}
	}

	this.init();
}
