arel.Plugin.Animation = {

	fadeIn : function(models, delay, stepsLeft, callback) {
		arel.Plugin.Animation.fading(models, delay, stepsLeft, true, callback);
	},

	fadeOut : function(models, delay, stepsLeft, callback) {
		arel.Plugin.Animation.fading(models, delay, stepsLeft, false, callback);
	},

	fading : function(models, delay, stepsLeft, mode, callback) {

		if (!(models instanceof Array)) {
			var models = [ models ];
		}

		try {

			if (stepsLeft <= 0) {
				if (typeof callback != "undefined") {
					setTimeout(function() {
						callback();
					}, 0)
				}

				return true;
			}

			for ( var i in models) {

				var transparency = models[i].getTransparency();

				if (mode) {
					transparency = (transparency - 0.02).toFixed(2);
					if (transparency < 0.02) {
						transparency = 0.02
					}
				} else {
					transparency = (transparency + 0.02).toFixed(2);
					if (transparency > 1) {
						transparency = 1
					}
				}

				models[i].setTransparency(parseFloat(transparency));
			}

			setTimeout(function() {
				arel.Plugin.Animation.fading(models, delay, stepsLeft - 1,
						mode, callback);
			}, delay);

		} catch (e) {
			arel.Debug.error("fading failed: " + e);
		}
	}
};
