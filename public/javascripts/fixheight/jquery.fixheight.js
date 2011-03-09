/**
 * ELIXON FIXHEIGHT
 * Project Homepage: http://www.webdevelopers.eu/jquery/fixheight
 *
 * LICENSE
 *   http://www.webdevelopers.eu/jquery/fixheight/license
 *   Commons Attribution-NonCommercial 3.0
 *
 *   Get a commercial license at
 *   http://www.webdevelopers.eu/jquery/fixheight/buy 
 *
 * DEMO
 *    http://www.webdevelopers.eu/jquery/fixheight/demo 
 * 
 * DOCUMENTATION
 *    http://www.webdevelopers.eu/jquery/fixheight/documentation
 *    
 * @project    Elixon CMS, http://www.webdevelopers.eu/
 * @package    JQuery
 * @subpackage FixHeight
 * @author     Daniel Sevcik <sevcik@webdevelopers.eu>
 * @version    1.0.2
 * @copyright  2011 Daniel Sevcik
 * @revision   $Revision: 4677 $
 * @changed    $Date: 2011-02-09 12:37:34 +0100 (Wed, 09 Feb 2011) $
 * @access     public
 */
(function($) {
	$.fn.fixHeight=function() {
		var row=0;
		function fhResize(siblings, maxSize) {
			if (!siblings.length) return siblings;
			row++;
			var col=1;
			return siblings.height(maxSize)
				.attr('class', function(idx, old) {return old.replace(/(^| )fh(Col|Row)[0-9]+( |$)/, ' ');}) // Remove old classes if any
				.addClass(function() {return 'fhRow' + row + ' fhCol' + col++;});
		}

		this.each(function() {
				var offset=0, maxSize=0, siblings=$(), row=0;
				$(this).children().height('auto').each(function() {
						var $this=$(this);
						if (offset != $this.position().top) {
							fhResize(siblings, maxSize);
							maxSize=$this.height();
							offset=$this.position().top;
							siblings=$();
						} else {
							if (maxSize < $this.height()) maxSize=$this.height();
						}
						siblings=siblings.add($this);
					});
				fhResize(siblings, maxSize); // remainder/last row
			});
		return this;
	}
})(jQuery);
