// Core objects
function Animation(type, duration, element) {
	// We put a reference to this into the that variable so we can have access to it from the methods
	var that = this;

	// We store the construction paramaters in the object properties
	this.type = type;
	this.duration = duration;
	this.element = element;

	// We initialize the properties we will set during *configure*
	this.target = null;
	this.startPoint = null;
	// Other property init
	this.deltaValue = null;
	this.frameRate = null;
	this.animationStatus = 0;

	// This *configure* method should be called to set up the anim context before *animate* is called
	this.configure = function(params) {
		// Determine from what point (value) we begin the animation from
		that.startPoint = that.element.scrollLeft;
		// If we animate the scrollLeft property calculate the target value
		if (that.type == 'scrollLeft') {
			that.target = that.calculateScrollTarget(params.scroll);
		}
	};
	// This helper method calculates the target scroll value we snap to based on the current position
	this.calculateScrollTarget = function(params) {
		if (that.element.scrollLeft < params.midBreak ) {
			return 0;
		}
		else if (that.element.scrollLeft >= params.midBreak && that.element.scrollLeft <= params.rightBreak) {
			return params.midScroll;
		}
		else if (that.element.scrollLeft > params.rightBreak) {
			return params.rightScroll;
		}
	};
	// The actual animaton is done here
	this.animate = function() {
		// We register the time we started the animation
		var start = new Date;

		// This is the play loop
		var play = setInterval(function(){
			// We calculate the time that has passed since the animation has started
			var timePassed = new Date - start;
			// We calculate our progress
			var progress = timePassed / that.duration;

			// We turn the animationstatus flag to indicate that animation is running
			that.animationStatus = 1;

			// If we reached the end of our progress, make sure we don't pass the endpoint
			if (progress > 1) progress = 1;
			
			// Calculate the actual progress of the animated property		
			that.deltaValue = that.delta(progress);
			that.draw();

			if (progress == 1) {
				clearInterval(play);
				//console.log(elementToAnimate.scrollLeft);
				setTimeout(function() {
					that.animationStatus = 0;
				},50);
			}
		}, that.frameRate || 10);
	};

	this.delta = function(progress){
		return 1 - Math.sin(Math.acos(progress))
	};

	this.draw = function(){
		that.element.scrollLeft =  that.startPoint + ( that.target - that.startPoint ) * that.deltaValue;
	};
}

// DOM manipulation
document.addEventListener("DOMContentLoaded", function() {

			var leftItemLeftMargin = window.getComputedStyle(document.getElementById("left-item"), null).getPropertyValue('margin-left').match(/\d+\.\d+/);
			var leftItemWidth = window.getComputedStyle(document.getElementById("left-item"), null).getPropertyValue('width').match(/\d+\.\d+/);
			
			var midScrollPoint = Math.ceil(+leftItemLeftMargin + +leftItemWidth);
			var midBreakPoint = Math.ceil(midScrollPoint/2);

			var rightScrollPoint = Math.ceil(window.getComputedStyle(document.getElementsByClassName("obj-item-wrapper")[0], null).getPropertyValue('width').match(/\d+\.\d+/) - window.getComputedStyle(document.getElementsByClassName("cv-objectives-detailed")[0], null).getPropertyValue('width').match(/\d+\.\d+/));
			var rightBreakPoint = Math.ceil(rightScrollPoint - midScrollPoint);


			var animConfig = {
				scroll: {
					midScroll: midScrollPoint,
					midBreak: midBreakPoint,
					rightScroll: rightScrollPoint,
					rightBreak: rightBreakPoint
				}
			};

			// This scrolls the "anchor" element into view to center the horizontal scroll
            var showmeScroll = document.getElementsByClassName("showme");
            showmeScroll[0].scrollIntoView();

            var scrollTimer = -1;
            var elementToAnimate = document.getElementsByClassName("cv-objectives-detailed")[0];

            var anim = new Animation('scrollLeft', 300, elementToAnimate);

            
			var scrollFinished = function() {
				anim.configure(animConfig);
				anim.animate();
			}
			
			
			var elementScroll = function() {
				if (anim.animationStatus == 0) {
					//console.log("scroll, scrollLeftPosi: "+elementToAnimate.scrollLeft);
					if (scrollTimer != -1) clearTimeout(scrollTimer);
					scrollTimer = window.setTimeout(scrollFinished, 50);
				}
			}

			elementToAnimate.onscroll = elementScroll;

        });


