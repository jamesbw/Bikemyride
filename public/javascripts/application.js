// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults


	//Change ui state on hover

	$(function(){		
		$(".ui-state-default").hover(function(){
			$(this).addClass("ui-state-hover");
		}, function(){
			$(this).removeClass("ui-state-hover");
		});
	});
