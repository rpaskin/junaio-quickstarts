// if the scene is ready start your javascript
arel.sceneReady(function() {

	setEventListener();
});

// this object represents all the functionality and parameter of the lego man:
Model = function() {

	this.model;

	// defines one step
	this.stepLength = 80;
	this.delayInMs = 50;

	// defines a bounding box in which you can move the model
	this.maxDistanceX = 10000;
	this.maxDistanceY = 100000;

	// the available animation from the md2 model
	this.idleAnimation = "idle";
	this.moveAnimation = "run_cycle";

	// defines wheter the model is allowed to move or not
	// this will be triggered by this.moveModel() and this.stopModel()
	this.isMoving = false;

	// loads the model from the scene and starts the moving animation
	this.loadModel = function() {
		this.model = arel.Scene.getObject("1");
		this.model.startAnimation(this.idleAnimation, true)
	}

	// this will be triggered by the jQuery onTouchEnd event
	this.stopModel = function() {
		this.isMoving = false
		this.model.startAnimation(this.idleAnimation, true);
	}

	// 
	this.moveModel = function(direction) {
		// starts the animation
		this.isMoving = true;
		this.model.startAnimation(this.moveAnimation, true);

		// turns the model into the right direction and starts the moving
		if (direction == "left") {
			var orientation = new arel.Rotation();
			orientation
					.setFromEulerAngleRadians((new arel.Vector3D(1.57, 0, 0)));
			this.model.setRotation(orientation);
			this.moving(direction);
		}

		// turns the model into the right direction and starts the moving
		if (direction == "right") {
			var orientation = new arel.Rotation();
			orientation.setFromEulerAngleRadians((new arel.Vector3D(1.57, 0,
					3.14)));
			this.model.setRotation(orientation);
			this.moving(direction);
		}

		// turns the model into the right direction and starts the moving
		if (direction == "down") {
			var orientation = new arel.Rotation();
			orientation.setFromEulerAngleRadians((new arel.Vector3D(1.57, 0,
					1.57)));
			this.model.setRotation(orientation);
			this.moving(direction);
		}

		// turns the model into the right direction and starts the moving
		if (direction == "top") {
			var orientation = new arel.Rotation();
			orientation.setFromEulerAngleRadians((new arel.Vector3D(1.57, 0,
					-1.57)));
			this.model.setRotation(orientation);
			this.moving(direction);
		}
	}

	// this method is called recursively with the direction
	// the direction parameter can be one out of "left", "right", "top" and
	// "down"
	this.moving = function(direction) {
		var me = this;

		if (this.isMoving) {

			if (direction == "left") {
				me.moveLeft();
			}
			if (direction == "right") {
				me.moveRight();
			}
			if (direction == "top") {
				me.moveTop();
			}
			if (direction == "down") {
				me.moveDown();
			}

			setTimeout(function() {
				me.moving(direction);
			}, me.delayInMs);
		}
	}

	// will be called to move the model 1 step to the left (on the x-axis)
	this.moveLeft = function() {
		var position = this.model.getTranslation();
		var newX = position.getX() - this.stepLength;

		if (newX < this.maxDistanceX && newX > -this.maxDistanceX) {
			position.setX(newX);
			this.model.setTranslation(position);
			return true;
		} else {
			// can be used to trigger an event if the model reaches
			// the boundary
			return false;
		}
	}

	// will be called to move the model 1 step to the right (on the x-axis)
	this.moveRight = function() {
		var position = this.model.getTranslation();
		var newX = position.getX() + this.stepLength;

		if (newX < this.maxDistanceX && newX > -this.maxDistanceX) {
			position.setX(newX);
			this.model.setTranslation(position);
			return true;
		} else {
			// can be used to trigger an event if the model reaches
			// the boundary
			return false;
		}
	}

	// will be called to move the model 1 step to the top (on the y-axis)
	this.moveTop = function() {
		var position = this.model.getTranslation();
		var newY = position.getY() + this.stepLength;

		if (newY < this.maxDistanceY && newY > 0) {
			position.setY(newY);
			this.model.setTranslation(position);
			return true;
		} else {
			// can be used to trigger an event if the model reaches
			// the boundary
			return false;
		}
	}

	// will be called to move the model 1 step to the bottom (on the y-axis)
	this.moveDown = function() {
		var position = this.model.getTranslation();
		var newY = position.getY() - this.stepLength;

		if (newY < this.maxDistanceY && newY > 0) {
			position.setY(newY);
			this.model.setTranslation(position);
			return true;
		} else {
			// can be used to trigger an event if the model reaches
			// the boundary
			return false;
		}
	}

}

// this part adds the javascript functionality to the HTML5 elements of the
// controls
// also the model will be initialized
function setEventListener() {
	var model = new Model();
	model.loadModel();

	// left button
	$("#left").bind("touchstart", function() {
		model.moveModel("left");
	});

	$("#left").bind("touchend", function() {
		model.stopModel();
	});

	// right button
	$("#right").bind("touchstart", function() {
		model.moveModel("right");
	});

	$("#right").bind("touchend", function() {
		model.stopModel();
	});

	// top button
	$("#top").bind("touchstart", function() {
		model.moveModel("top");
	});

	$("#top").bind("touchend", function() {
		model.stopModel();
	});

	// down button
	$("#down").bind("touchstart", function() {
		model.moveModel("down");
	});

	$("#down").bind("touchend", function() {
		model.stopModel();
	});

}
