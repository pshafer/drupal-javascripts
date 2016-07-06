/**
 * The stickBlock jQuery was insprired by StickyMojo (https://mojotech.github.io/stickymojo/)
 *
 * This differs from stickyMojo in the fact that we can call out individual blocks in a sidebar region
 * to be stick, other blocks that are not selected to be sticky will disappear when the sticky blocks are fixed.
 *
 * This library was adapted to work in drupal and is only really good for blocks that are in a side bar region.
 */
(function( $ ) {
    $.fn.extend({
       stickyBlock: function(options) {

           if(this.length === 0 ){
               return this;
           }

           // initialize the settings
           var settings = $.extend({
               'footerID': '#site-footer',
               'breakPoint': 800,
               'scrollTopOffset': 15,
               'scrollLimit': 0,
               'scrollGroupHeight': 0
           }, options);

           // this array will be used to store
           // the block elements and properties
           // that should be sticky
           var stickyBlocks = [];

           // bind some events to the window
           $(window).bind({
               'load': stick,
               'scroll': stick,
               'resize': stick
           });


           return this.each(function() {
               var fixedSiblingOffset = 0;
               settings.scrollGroupHeight += settings.scrollTopOffset;
               settings.scrollGroupHeight += $(this).height();

               if($(this).offset().top > settings.scrollLimit){
                   settings.scrollLimit = $(this).offset().top;
               }


               var block = {
                   'el': $(this),
                   'parentTop': $(this).parent().offset().top,
                   'top' : $(this).offset().top,
                   'topOffset': 0,
                   'width': $(this).width(),
                   'height': $(this).height(),
                   'window': $(window),
               };

                $(this).prevAll('.block-sticky').each(function(){
                    fixedSiblingOffset += settings.scrollTopOffset;
                    fixedSiblingOffset += $(this).height();
                });

               if(fixedSiblingOffset === 0){
                   block.startSticky = block.top;
                   block.topOffset = settings.scrollTopOffset;
               }else{
                   block.startSticky = block.parentTop;
                   block.topOffset = fixedSiblingOffset + settings.scrollTopOffset;
               }

               stickyBlocks.push(block);
           });


           function stick(){
               var limits = computeLimits();
               var hitBreakpoint = $(window).width() <= settings.breakPoint;

               // if the window width is < break point then remove the stickiness from the fixed blocks
               if(hitBreakpoint){
                   $.each(stickyBlocks, function(index, block) {
                       block.el.css({
                           "position": '',
                           "width": '',
                           "top": '',
                           "background": ''
                       });
                   });
               }else {
                   // otherwise we need to determine the position for each
                   // fixed block in their region
                   $.each(stickyBlocks, function(index, block) {
                       var limits = computeLimits();

                       // the difference of the maxScrollLimit and the top of the page at the scroll window
                       //
                       // if this number > 0 then the fixed blocks should still be fixed
                       // if this number <= then set the blocks positions to absolute and assign their top position from the top of the footer
                       //
                       var diff = limits.maxScrollLimit - limits.scrollTop;

                       // so just to be safe set the width of the fixed blocks to the width of their parent container
                       block.el.css({
                          'width': block.el.parent().width()
                       });

                       if(limits.scrollTop > settings.scrollLimit) {
                            if(diff >= 0) {
                                block.el.css({
                                    "position": "fixed",
                                    "top": block.topOffset + "px",
                                    "background": "white"
                                });
                            }else{
                                var blockPos = limits.footerTop - (settings.scrollGroupHeight - block.topOffset) - settings.scrollTopOffset;
                                block.el.css({
                                    "position": "absolute",
                                    "top" :  blockPos + "px"
                                });
                            }

                       }else {

                           block.el.css({
                               "position": '',
                               "width": '',
                               "top": ''
                           });
                       }
                   });
               }
           }

           /**
            * Returns json object with the following values
            *
            * maxScrollLimit - distance from the top of the footer to the top of the calculated scrollGroupHeight + offset padding
            * scrollTop - the current position of the top of the page at the top of the scroll window
            * footerTop - the top position of the footer section
            *
            * @returns {{maxScrollLimit: number, scrollTop: number, footerTop: number}}
            */
           function computeLimits(){
               return {
                   'maxScrollLimit': $(settings.footerID).offset().top - settings.scrollTopOffset - settings.scrollGroupHeight,
                   'scrollTop': $(window).scrollTop(),
                   'footerTop': $(settings.footerID).offset().top
               };
           }
       }
    });
})(jQuery);