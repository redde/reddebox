/*! Reddebox - v0.1.0 - 2013-06-11
* http://gitlab.redde.ru/reddebox
* Copyright (c) 2013 Konstantin Gorozhankin; Licensed MIT */
(function() {
  (function($) {
    $.fn.reddebox = function() {
      var elems, settings;

      settings = $.extend({
        overlayOpacity: 0.5,
        classWrapper: "",
        fWidth: 640,
        fHeight: 480,
        useThisLink: true,
        imageArray: [],
        activeImage: 0
      }, settings);
      elems = this;
      return this.off('click.reddebox').on('click.reddebox', function(e) {
        new $.reddebox(this, elems, settings);
        e.preventDefault();
      });
    };
    $.reddebox = function(el, elems, settings) {
      var arr;

      arr = $.map(settings.activeImage, function(n) {
        return $('<a />').attr('href', n)[0];
      });
      if (settings.useThisLink) {
        this.jQueryMatchedObj = $.merge($.merge([], elems), arr);
      } else {
        this.jQueryMatchedObj = arr;
      }
      this.activeIndex = $.map(elems, function(n, i) {
        if (n === el) {
          return i;
        }
      })[0] || 0;
      this.settings = settings;
      this.setInterface(el);
      return this;
    };
    $.reddebox.prototype = {
      removeReddeBox: function() {
        $('#redde-overlay, #redde-box').remove();
      },
      setActiveIndex: function(linkActiveHref) {
        var i;

        i = this.jQueryMatchedObj.length;
        while (i--) {
          if (this.jQueryMatchedObj[i].href === linkActiveHref) {
            this.activeIndex = i;
            break;
          }
        }
      },
      updateNavi: function(linkActive) {
        var maxLength;

        maxLength = this.jQueryMatchedObj.length;
        this.setActiveIndex(linkActive.attr('href'));
        this.container.find('a.redde-next, a.redde-prev').css('visibility', 'visible');
        if (this.activeIndex === 0) {
          $('a.redde-prev').css('visibility', 'hidden');
        }
        if (this.activeIndex === maxLength - 1) {
          $('a.redde-next').css('visibility', 'hidden');
        }
        if (linkActive.attr('title')) {
          this.container.find("div.redde-desc").html(linkActive.attr("title")).css("visibility", "visible");
        } else {
          this.container.find("div.redde-desc").empty().css("visibility", "hidden");
        }
      },
      showImage: function(me) {
        var img, self;

        self = this;
        this.updateNavi(me);
        if (/\.(jpg|jpeg|gif|png)$/i.test($(me).attr("href"))) {
          img = new Image();
          img.onload = function() {
            self._printElLoad($(this).fadeTo(0, 0).get(0));
          };
          img.src = me.attr('href');
        } else {
          this._printElLoad("<iframe src='" + (me.attr("href")) + "' frameborder='0' width='" + this.settings.fWidth + "' height='" + this.settings.fHeight + "' />");
        }
      },
      _printElLoad: function(el) {
        this.printEl = el;
        this.setCenter();
      },
      setCenter: function() {
        var el, h, w;

        el = $(this.printEl).appendTo(this.container.find("#wrap-redde-container").empty());
        w = el.width();
        h = el.height();
        return this.container.addClass("resize-show-photo").stop(false, false).animate({
          width: w,
          height: h,
          "margin-left": -w / 2 - 1,
          "margin-top": -h / 2 - 1,
          top: "50%",
          left: "50%"
        }, 400, function() {
          $(this).removeClass("resize-show-photo");
          if ($.isFunction($.fn.draggable)) {
            $(this).draggable({
              stop: function() {
                var obj, x1, x2, xy2, y1, y2;

                obj = {};
                x1 = parseInt($(this).css("left"), 10);
                y1 = parseInt($(this).css("top"), 10);
                xy2 = $(this).offsetParent();
                x2 = parseInt(xy2.width(), 10);
                y2 = parseInt(xy2.height(), 10);
                if (x2 > w) {
                  if (x1 < 0) {
                    obj.left = 0;
                  } else {
                    if (x1 > x2) {
                      obj.left = x2;
                    }
                  }
                } else {
                  if (x2 / 2 - x1 > w / 2) {
                    obj.left = (x2 - w) / 2;
                  } else {
                    if (x1 - x2 / 2 > w / 2) {
                      obj.left = (x2 + w) / 2;
                    }
                  }
                }
                if (y2 > h) {
                  if (y1 < 0) {
                    obj.top = 0;
                  } else {
                    if (y1 > y2) {
                      obj.top = y2;
                    }
                  }
                } else {
                  if (y2 / 2 - y1 > h / 2) {
                    obj.top = (y2 - h) / 2;
                  } else {
                    if (y1 - y2 / 2 > h / 2) {
                      obj.top = (y2 + h) / 2;
                    }
                  }
                }
                $(this).animate(obj);
              }
            });
          }
        }).find("img").fadeTo(0, 1.0);
      },
      setInterface: function(linkActive) {
        var cont, cssClassWrapper, self;

        cssClassWrapper = (this.settings.classWrapper ? " class='" + this.settings.classWrapper + "'" : "");
        cont = "<div id=\"redde-overlay\"></div>\n<div id=\"redde-box\" " + cssClassWrapper + ">\n  <div id=\"redde-container\">\n    <div id=\"wrap-redde-container\"></div>\n    <a href=\"#\" class=\"redde-prev\"></a>\n    <a href=\"#\" class=\"redde-close\"></a>\n    <a href=\"#\" class=\"redde-next\"></a> \n    <div class=\"redde-desc\"></div>\n  </div>\n</div>";
        $('body').append(cont);
        this.container = $("#redde-container");
        $('#redde-overlay').fadeTo(400, this.settings.overlayOpacity);
        self = this;
        $('#redde-box').fadeTo(400, 1.0, function() {
          $(this).bind('click', function(e) {
            if (e.target === this) {
              self.removeReddeBox();
            }
          });
        });
        if (!this.settings.imageArray.length) {
          this.showImage($(linkActive));
        } else {
          if (this.settings.activeImage) {
            this.activeIndex = this.settings.activeImage;
          }
          this.showImage($(this.jQueryMatchedObj[this.activeIndex]));
        }
        this.container.find("a").click(function(e) {
          var delta;

          switch (this.className) {
            case "redde-next":
            case "redde-prev":
              self.container.stop(true, true);
              delta = (this.className === "redde-prev" ? -1 : 1);
              if (self.jQueryMatchedObj[self.activeIndex + delta] !== undefined) {
                self.activeIndex = self.activeIndex + delta;
                self.showImage($(self.jQueryMatchedObj[self.activeIndex]));
              }
              break;
            case "redde-close":
              self.removeReddeBox();
              break;
          }
          e.preventDefault();
        });
      }
    };
  })(jQuery);

}).call(this);
