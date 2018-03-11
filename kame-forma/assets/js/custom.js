(function($) {
	var $window = $(window),
		$body = $('body'),
		$featured = $('#featured-slider');

	$(document).ready(function() {
		// Search
		var searchField = $("#search-field").ghostHunter({
			results : "#search-results",
			onKeyUp : true,
			onPageLoad : true,
			includepages : true,
			info_template : '<div class="results-info">Posts found: {{amount}}</div>',
			result_template : '<div class="result-item"><div class="result-title"><a href="{{link}}">{{title}}</a></div><div class="result-date">{{pubDate}}</div></div>'
		});

		// Hidden sections
		$('#show-sidebar, #hide-sidebar').on('click', function(e){
			$body.toggleClass('sidebar--opened');
			e.preventDefault();
		});
		$('#show-search, #hide-search').on('click', function(e){
			if ( $body.hasClass('search--opened') ) {
				$body.removeClass('search--opened');
				searchField.clear();
			} else {
				$body.addClass('search--opened');
				setTimeout(function() {
					$("#search-field").focus();
				}, 300);
			}
			e.preventDefault();
		});
		$('#site-overlay').on('click', function(e){
			$body.removeClass('sidebar--opened search--opened');
			searchField.clear();
			e.preventDefault();
		});

		// Featured carousel
		$featured.slick({
			autoplay: true,
			arrows : true,
			dots : false,
			fade : true,
			appendArrows : $('.featured-nav'),
			prevArrow : $('.featured-prev'),
			nextArrow : $('.featured-next')
		});
		$featured.fadeIn(600, function(){
			$featured.parents().removeClass('slider-loading');
		});

		// Back to top button
		$('#top-link').on('click', function(e) {
			$('html, body').animate({'scrollTop': 0});
			e.preventDefault();
		});
		$window.scroll(function () {
			if ( $(this).scrollTop() > 600 ) {
				$body.addClass('is--scrolled');
			} else {
				$body.removeClass('is--scrolled');
			}
		});

		// Responsive videos
		$('.post').fitVids();

		// Images
		if ( $body.hasClass( 'post-template' ) || $body.hasClass( 'page-template' ) ) {
			adjustImages();
		}

		// Grid layout
		if ( $.isFunction( $.fn.masonry ) && $('#post-wrapper').length ) {
			gridLayout.refresh();
		}

		// Instagram feed
		if ( typeof instagram_user_id !== 'undefined' && typeof instagram_access_token !== 'undefined' ) {
			if ( $('#instafeed').length ) {
				var userFeed = new Instafeed({
					get: 'user',
					userId: instagram_user_id,
					accessToken: instagram_access_token,
					limit: 6,
					resolution: 'low_resolution',
					template: '<div class="instagram-item"><a target="_blank" href="{{link}}"><img src="{{image}}" alt="{{caption}}" /></a></div>'
				});
				userFeed.run();
			}
		}
		if (typeof eventList !== 'undefined'){
			if(eventList !== null){
				var events = createEventList(eventList);
				$("#calendar-description").after(events);

                // init Isotope

                var $grid = $('#event-list').isotope({
                    itemSelector: '.event',
                    layoutMode: 'fitRows',
                    masonry: {
                        columnWidth: 100,
                        horizontalOrder: true
                    }
                });

				// bind filter button click
                $('.filters-button-group').on( 'click', 'button', function() {
                    var filterValue = $( this ).attr('data-filter');
                    // use filterFn if matches value
                    $grid.isotope({ filter: filterValue });
                });

				// change is-checked class on buttons
                $('.button-group').each( function( i, buttonGroup ) {
                    var $buttonGroup = $( buttonGroup );
                    $buttonGroup.on( 'click', 'button', function() {
                        $buttonGroup.find('.is-checked').removeClass('is-checked');
                        $( this ).addClass('is-checked');
                    });
                });
			}
		}
		
	});

	$window.on('debouncedresize', onResize);

	var gridLayout = (function() {
		var $container = $('#post-wrapper'),
			$items = $container.children().addClass('post--loaded'),
			initialized = false,
			init = function() {
				$container.imagesLoaded(function() {
					$container.masonry({
						itemSelector: '.post',
						columnWidth: '.post',
						transitionDuration: 0
					});
					setTimeout(function() {
						$container.masonry('layout');
					}, 100);
					showItems($items);
					initialized = true;
				});
			},
			refresh = function() {
				if (!initialized) {
					init();
					return;
				}
				$container.masonry('layout');
			},
			showItems = function($items) {
				$items.each(function(i, obj) {
					var $postInside = $(obj).find('.post-inside');
					animatePost($postInside, i * 100);
				});
			},
			animatePost = function($postInside, delay) {
				setTimeout(function() {
					$postInside.addClass('is--visible');
				}, delay);
			};
		return {
			init: init,
			refresh: refresh
		}
	})();

	function onResize() {
		if ( $body.hasClass( 'post-template' ) || $body.hasClass( 'page-template' ) ) {
			adjustImages();
		}
		if ( $.isFunction( $.fn.masonry ) && $('#post-wrapper').length ) {
			gridLayout.refresh();
		}
	}

	function adjustImages() {
		var $entry = $('.post'),
			$entryContent = $entry.find('.entry-content'),
			entryWidth = $entry.width(),
			entryContentWidth = $entryContent.width(),
			margin = entryContentWidth / 2 - entryWidth / 2;

		$entryContent.find('.alignleft').each(function() {
			$(this).css({ 'margin-left': margin });
		});
		$entryContent.find('.alignright').each(function() {
			var _this = $(this),
				elName = _this.prop('tagName').toLowerCase();
			if ( elName == 'blockquote' ) {
				_this.css({ 'margin-right': margin + 15 });
			} else {
				_this.css({ 'margin-right': margin });
			}
		});
		$entryContent.find('.full-width').each(function() {
			$(this).css({ 'margin-left': margin, 'max-width': 'none', 'width': entryWidth });
		});
	}

	function searchForArray(haystack, needle){
		a = JSON.stringify(haystack);
     	b = JSON.stringify(needle);
	   var c = a.indexOf(b);
	    if(c != -1){
	    	return true;
    	} else {
    		return false;
    	}
	}

	function getDateClasses(month, day, year){
        if(isAppleDevice()){
			var date = new Date(month+'/'+day+'/'+year);
		} else {
			var date = new Date(month+'-'+day+'-'+year);
		}

        var monthyear = 'monthyear-' + (date.getMonth()+1) + '-' + date.getFullYear();
        var day = 'day-' + date.getDate();
        var year = 'year-' + date.getFullYear();

        return monthyear + ' ' + day;
	}

	function getMonthName(monthNum){
        var month = [];
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

        return month[monthNum];

	}

    function isAppleDevice(){
    	var isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    	return isAppleDevice;
    }

	function isDateInPast(month, day, year){

		if(isAppleDevice()){
			var date = new Date(month+'/'+day+'/'+year).setHours(0,0,0,0);
		} else {
			var date = new Date(month+'-'+day+'-'+year).setHours(0,0,0,0);
		}

		var currentDate = new Date().setHours(0,0,0,0);

		if(date >= currentDate) {
			return false;
		} else {
			return true;
		}
	}

	function createFilters(events){

		var monthYears = [];
		

    	$.each(events['event-list'],function(index, value){
    		var timeCheck = value.time != null;

    		if(timeCheck) {
    			var time = value.time[0];
    			var monthYear = [time.year,time.month];
                if(!isDateInPast(time.month, time.day, time.year)){
                    if (!searchForArray(monthYears, monthYear)){
                        monthYears.push(monthYear);
                    }
                }
    		}
    	});

    	var filterArea = '<div id="calendar-filter" class="button-group filters-button-group"><button  class="button is-checked" data-filter="*">All</button>';

    	$.each(monthYears,function(x, y){
    		var date = new Date(y[0], (y[1]-1));
    		var monthName = getMonthName(date.getMonth());
    		var monthyear = 'monthyear-' + (date.getMonth()+1) + '-' + date.getFullYear();
    		var filterButton = '<button class="button" data-filter=".' + monthyear + '">'+ monthName +' '+ date.getFullYear()+ '</button>';
			filterArea += filterButton;
    	});

    	filterArea += '</div>';
    	return filterArea;
	}

    function createEventList(events){
    	var filters = createFilters(events);
		var eventList = '<ul id="event-list">';
        $.each(events['event-list'],function(index, value){
        	var dateClasses = null;
        	var location, time;
        	var locationCheck = value.location != null;
        	var timeCheck = value.time != null;
            if(locationCheck) {
                location = value.location[0];
            }

            if(timeCheck) {
                time = value.time[0];
                dateClasses = getDateClasses(time.month, time.day, time.year);
            }
			if(!isDateInPast(time.month, time.day, time.year)){
	        	var event = '<li class="event ' + dateClasses +'"><div class = "event-inner-wrapper">';
	            if(timeCheck){
	            	var monthName = getMonthName(time.month-1);
	                event += '<div class="event-date">'+monthName+' '+time.day+', '+time.year+'</div>';
	            }
	        	if(value.title != null){
					event += '<div class="event-title">'+value.title+'</div>';
	        	}

	        	if(value.acts != null){
	        		var acts = '<div class="acts">';
	        		var actCount = 0;
	        		var actAmount = value.acts.length;
	    			$.each(value.acts, function(x, y){
						var act = '<a href="'+y.url_1+'" class="act-title">'+y.title+'</a>';
						actCount++;
						if(actCount != actAmount){
							act += ', ';
						}
						acts += act;
						
	    			});
	    			acts += '</div>';
	    			event += acts;
	        	}

	        	if(locationCheck){
					var eventLocation = '<div class="event-location"><div class="location-name">'+location.name+'</div><div class="event-address">';
	        		var addressGiven = (location.address_given == 'true');

	        		if((addressGiven == false) || (addressGiven == null)){
	        			eventLocation += '<div class="address-hint">'+location.address_hint+'</div>';
	        		} else {
	        			eventLocation += '<div class="street">'+location.street+'</div>';
	        			eventLocation += '<div class="city-state">'+location.city+', '+location.state+'</div>';
	        			eventLocation += '<div class="zip">'+location.zipcode+'</div>';
	        		}
	        		eventLocation += '</div></div>';
	    			event += eventLocation;
	        	}

	        	if(timeCheck){
					var schedule = '<div class="time">';

					schedule += '<div class="doors">Doors at '+time.doors+'</div>';
					schedule += '<div class="duration">'+ time.music_start + ' - ' + time.music_end + '</div></div>';
					event += schedule;
	        	}
	        	if(value.cover != null){
	    			event += '<div class="cover">'+value.cover+'</div>';
	        	}
	        	if(value.age_policy != null){
	        		event += '<div class="age-policy">'+value.age_policy+'</div>';
	        	}
	        	if(value.additional_info != null){
	        		event += '<div class="add-info">'+value.additional_info+'</div>';
	        	}
	        	event += '</div></li>';
				eventList += event;
			}

        });
		eventList += '</ul>';
		var calendar;
		if(filters != null){
			calendar = filters;
		}
		calendar += eventList;
		return calendar;
	}	

})(jQuery);
