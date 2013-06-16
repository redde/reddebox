(function() {
  (function($) {
    $.fn.reddebox = function(opts) {
      var elems;

      elems = this;
      return this.off('click.reddebox').on('click.reddebox', function(e) {
        new $.reddebox(this, elems, opts);
        e.preventDefault();
      });
    };
    $.reddebox = function(el, elems, opts) {
      var imageArray, settings;

      settings = {
        overlayOpacity: 0.5,
        classWrapper: "",
        useThisLink: true,
        imageArray: [],
        activeIndex: 0
      };
      $.extend(settings, opts);
      imageArray = $.map(settings.imageArray, function(n) {
        return $('<a />').attr('href', n).get(0);
      });
      this.jQueryMatchedObj = $.merge($.merge([], elems), imageArray);
      if (!settings.useThisLink) {
        this.jQueryMatchedObj = $.grep(this.jQueryMatchedObj, function(n) {
          return el !== n;
        });
      }
      this.maxLength = this.jQueryMatchedObj.length;
      this.settings = settings;
      this.setInterface(el);
      return this;
    };
    $.reddebox.prototype = {
      _setActiveIndex: function(el) {
        if ($.isFunction(this.settings.activeIndex)) {
          return this.activeIndex = this.settings.activeIndex.call();
        } else {
          return this.activeIndex = $.map(this.jQueryMatchedObj, function(n, i) {
            if (n === el) {
              return i;
            }
          })[0] || 0;
        }
      },
      remove: function() {
        $('#redde-overlay, #redde-box').remove();
      },
      vis: function(el) {
        return el.css('visibility', 'visible');
      },
      hid: function(el) {
        return el.css('visibility', 'hidden');
      },
      updateNavi: function() {
        this.vis(this.container.find('i.redde-next, i.redde-prev'));
        if (this.activeIndex === 0) {
          this.hid($('i.redde-prev'));
        }
        if (this.activeIndex === this.maxLength - 1) {
          this.hid($('i.redde-next'));
        }
        return this._setTitle();
      },
      _setTitle: function() {
        var title;

        if (title = this.jQueryMatchedObj[this.activeIndex].title) {
          this.vis(this.container.find("div.redde-desc").html(title));
        } else {
          this.hid(this.container.find("div.redde-desc").empty());
        }
      },
      showImage: function() {
        var href, img, self;

        self = this;
        this.updateNavi();
        href = $(this.jQueryMatchedObj[this.activeIndex]).attr("href");
        if (/\.(jpg|jpeg|gif|png)$/i.test(href)) {
          img = new Image();
          img.onload = function() {
            self._printElLoad($(this).fadeTo(0, 0).get(0));
          };
          img.src = href;
        } else {
          this._printElLoad("<iframe src='" + href + "' frameborder='0' />");
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
      _cssClassWrapper: function() {
        if (!this.settings.classWrapper) {
          return "";
        } else {
          return " class='" + this.settings.classWrapper + "'";
        }
      },
      setInterface: function(linkActive) {
        var $html, html, self;

        this._setActiveIndex(linkActive);
        html = "<div id=\"redde-overlay\"></div>\n<div id=\"redde-box\"" + (this._cssClassWrapper()) + ">\n  <div id=\"redde-container\">\n    <div id=\"wrap-redde-container\"></div>\n    <i class=\"redde-prev\"></i>\n    <i class=\"redde-close\"></i>\n    <i class=\"redde-next\"></i> \n    <div class=\"redde-desc\"></div>\n  </div>\n</div>";
        $html = $(html).appendTo('body');
        this.container = $html.find("#redde-container").on('click', function(e) {
          return e.stopPropagation();
        });
        $html.filter('#redde-overlay').fadeTo(400, this.settings.overlayOpacity);
        self = this;
        $html.filter('#redde-box').fadeTo(400, 1.0, function() {
          $(this).click(self.remove);
        });
        this.showImage();
        this.container.find("i").click(function(e) {
          if ($(this).hasClass('redde-next')) {
            self.container.stop(true, true);
            ++self.activeIndex;
            self.showImage();
          } else if ($(this).hasClass('redde-prev')) {
            self.container.stop(true, true);
            --self.activeIndex;
            self.showImage();
          } else if ($(this).hasClass('redde-close')) {
            self.remove();
          }
          e.stopPropagation();
        });
      }
    };
  })(jQuery);

}).call(this);
