/*
 * reddebox
 * http://gitlab.redde.ru/reddebox
 *
 * Copyright (c) 2013 Konstantin Gorozhankin
 * Licensed under the MIT license.
 */

(function($) {
  
  $.fn.reddebox = function(settings) {
    settings = jQuery.extend({
      overlayOpacity:     0.5, 
      classWrapper:           "", 
      useThisLink:           true, // включить в набор текущий линк или линки
      imageArray:       [], 
      activeImage:      0
    }, settings);

    var elems = this;
          
    return this.unbind('click.reddebox').bind("click.reddebox", function(e){
      new $.reddebox(this, elems, settings);
      e.preventDefault();
    });
  };
  
  $.reddebox = function(el, elems, settings) {
    var arr = $.map(settings.imageArray, function(n){
      return $("<a />").attr("href", n)[0];
    });

    if (settings.useThisLink) {
      this.jQueryMatchedObj = $.merge($.merge([], elems), arr);
    } else {
      this.jQueryMatchedObj = arr;
    }
    
    this.activeIndex = $.map(elems, function(n, i){
      if (n === el) {
        return i;
      }
    })[0] || 0;
    
    this.setInterface(el, settings);
  };
  
  $.reddebox.prototype = {
    removeReddeBox: function() {
      $("#redde-overlay, #redde-box").remove();
    }, 

    setActiveIndex: function(linkActiveHref) {
      for(var i = this.jQueryMatchedObj.length; i--;) {
        if (this.jQueryMatchedObj[i].href === linkActiveHref) {
          this.activeIndex = i;
          break;
        }
      }
    }, 

    updateNavi: function(linkActive) {
      var maxLength = this.jQueryMatchedObj.length;
      this.setActiveIndex(linkActive.attr("href"));
      this.container.find("a.redde-next, a.redde-prev").css("visibility", "visible"); 
      if (this.activeIndex === 0) {
        $("a.redde-prev").css("visibility", "hidden");  
      }
      if (this.activeIndex === maxLength-1) {
        $("a.redde-next").css("visibility", "hidden");
      }
      if (linkActive.attr("title")) {
        this.container.find("div.redde-desc").html(linkActive.attr("title")).css("visibility", "visible");
      } else {
        this.container.find("div.redde-desc").empty().css("visibility", "hidden");
      }
    }, 

    showImage: function(me) {
      var self = this;
      this.updateNavi(me);
      if (/\.(jpg|jpeg|gif|png)$/i.test($(me).attr("href"))) {
        $("<img />").attr("src", me.attr("href")).fadeTo(0, 0).load(function(){
          //alert("test")
          $("#redde-container #wrap-redde-container").html(this);
          self.setCenter.call(self, $(this));
        });
      } else {
        this.container.find("#wrap-redde-container").html('<iframe src="'+ me.attr("href") +'" frameborder="0" width="640" height="480" />');
        self.setCenter.call(self, this.container.find("iframe"));
      }
    }, 

    setCenter: function(el) {
      var w = el.width(), h = el.height();
      this.container.addClass("resize-show-photo").stop(false, false).animate({
        width: w, height: h, "margin-left": -w/2-1, // -1 - поправка на border
        "margin-top": -h/2-1, top: "50%", left: "50%"
      }, 400, function(){
        $(this).removeClass("resize-show-photo");
        if ($.isFunction($.fn.draggable)) {
          $(this).draggable({
            stop: function(){             
              var obj = {}, 
                  x1 = parseInt($(this).css("left"), 10), 
                  y1 = parseInt($(this).css("top"), 10), 
                  xy2 = $(this).offsetParent(), 
                  x2 = parseInt(xy2.width(), 10), 
                  y2 = parseInt(xy2.height(), 10);

              if (x2 > w) {
                if (x1 < 0) {
                  obj.left = 0;
                } else if (x1 > x2) {
                  obj.left = x2;
                }
              } else {
                if (x2/2-x1 > w/2) {
                  obj.left = (x2-w)/2;
                } else if (x1-x2/2 > w/2) {
                  obj.left = (x2+w)/2;
                }             
              }
              
              if (y2 > h) {
                if (y1 < 0) {
                  obj.top = 0;
                } else if (y1 > y2) {
                  obj.top = y2;
                }              
              } else {
                if (y2/2-y1 > h/2) {
                  obj.top = (y2-h)/2;
                } else if (y1-y2/2 > h/2) {
                  obj.top = (y2+h)/2;
                }                  
              }
              
              $(this).animate(obj);
            }
          });
        }
      }).find("img").fadeTo(0, 1.0);
    }, 

    setInterface: function(linkActive, settings) {
      if (settings.classWrapper) {
        settings.classWrapper = ' class="' + settings.classWrapper + '"';
      }
      var navigation = 
        '<a href="#" class="redde-prev"></a>' + 
        '<a href="#" class="redde-close"></a>' +
        '<a href="#" class="redde-next"></a>' + 
        '<div class="redde-desc"></div>';
      var cont = 
        '<div id="redde-overlay"></div>' +
        '<div id="redde-box"' + settings.classWrapper + '>' + 
          '<div id="redde-container"><div id="wrap-redde-container"></div>' + navigation + '</div>' +
        '</div>';
      $("body").append(cont);
      this.container = $("#redde-container"); // обертка
      $("#redde-overlay").fadeTo(400, settings.overlayOpacity);
      var self = this;
      
      $("#redde-box").fadeTo(400, 1.0, function(){ //закрываем лайтбокс при клике на подложку
        $(this).bind("click", function(e){
          if (e.target === this) {
            self.removeReddeBox();
          }
        });
      });
      
      if (!settings.imageArray.length) {
        this.showImage($(linkActive));
      } else {
        if (settings.activeImage) {
          this.activeIndex = settings.activeImage;
        }
        this.showImage($(this.jQueryMatchedObj[this.activeIndex])); 
      }

      this.container.find("a").click(function(e){
        switch (this.className) {
          case "redde-next": 
          case "redde-prev": 
          {
            self.container.stop(true, true);
            var delta = this.className === "redde-prev" ? -1 : 1;
            if (self.jQueryMatchedObj[self.activeIndex+delta] !== undefined) {
              self.activeIndex = self.activeIndex+delta;
              self.showImage($(self.jQueryMatchedObj[self.activeIndex]));
            }
          }
          break;
          case "redde-close": {
            self.removeReddeBox();
            break;            
          }                    
        }
        e.preventDefault();
      });       
    }   
  };
})(jQuery); // Call and execute the function immediately passing the jQuery object
