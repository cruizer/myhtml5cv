document.addEventListener("DOMContentLoaded", function() {
            var showmeScroll = document.getElementsByClassName("showme");
            showmeScroll[0].scrollIntoView();

            var scrollTimer = -1;
            var elementToAnimate = document.getElementsByClassName("cv-objectives-detailed")[0];
           

			var animate = function(configuration) {
				var start = new Date;
				var startPoint = configuration.startPoint();
				var target = configuration.target();

				var play = setInterval(function(){
					var timePassed = new Date - start;
					var progress = timePassed / configuration.duration;
					elementToAnimate.onscroll = null;

					if (progress > 1) progress = 1;
					
					var delta = configuration.delta(progress);
					configuration.draw(delta, target, startPoint);

					if (progress == 1) {
						clearInterval(play);
						console.log(elementToAnimate.scrollLeft);
						setTimeout(function() {
							elementToAnimate.onscroll = elementScroll;
						},50);
					}

				}, configuration.frameRate || 10);
			}

			var configuration = {
				duration: 300,
				startPoint: function() {
					return elementToAnimate.scrollLeft;
				},
				target: function() {
					if (elementToAnimate.scrollLeft < 234 ) {
						return 0;
					}
					else if (elementToAnimate.scrollLeft >= 234 && elementToAnimate.scrollLeft <= 744) {
						return 448;
					}
					else if (elementToAnimate.scrollLeft > 600) {
						return 868;
					}
				},
				delta: function(progress){
					return 1 - Math.sin(Math.acos(progress))
				},
				draw: function(delta, target, startPoint){
					elementToAnimate.scrollLeft =  startPoint + ( target - startPoint ) * delta;
				}
			}

			var scrollFinished = function() {
				animate(configuration);
			}

			var elementScroll = function() {
				//console.log("scroll, scrollLeftPosi: "+elementToAnimate.scrollLeft);
				if (scrollTimer != -1) clearTimeout(scrollTimer);
				scrollTimer = window.setTimeout(scrollFinished, 50);

			}

			elementToAnimate.onscroll = elementScroll;

        });


