(($) ->
  $.fn.reddebox = ->
    settings = $.extend
      overlayOpacity: 0.5
      classWrapper: ""
      useThisLink: true
      imageArray: []
      activeImage: 0
    , settings
    
    elems = @

    @off('click.reddebox').on('click.reddebox', (e)->
      new $.reddebox @, elems, settings
      e.preventDefault()
      return
    )

  $.reddebox = (el, elems, settings) ->
    arr = $.map settings.activeImage, (n)->
      $('<a />').attr('href', n)[0]

    if settings.useThisLink
      @jQueryMatchedObj = $.merge $.merge([], elems), arr
    else
      @jQueryMatchedObj = arr

    @activeIndex = $.map( elems, (n, i) ->
      if n == el 
        i
    )[0] || 0

    @setInterface el, settings
    return

  $.reddebox:: =
    removeReddeBox: ->
      $('#redde-overlay, #redde-box').remove()
      return

    setActiveIndex: (linkActiveHref) ->
      i = @jQueryMatchedObj.length

      while i--
        if @jQueryMatchedObj[i].href is linkActiveHref
          @activeIndex = i
          break
      return

    updateNavi: (linkActive) ->
      maxLength = @jQueryMatchedObj.length
      @setActiveIndex linkActive.attr 'href'
      @container.find('a.redde-next, a.redde-prev').css 'visibility', 'visible'
      if @activeIndex is 0
        $('a.redde-prev').css 'visibility', 'hidden'
      if @activeIndex is maxLength-1
        $('a.redde-next').css 'visibility', 'hidden'
      if linkActive.attr 'title'
        @container.find("div.redde-desc").html(linkActive.attr("title")).css "visibility", "visible"
      else
        @container.find("div.redde-desc").empty().css "visibility", "hidden"
      return

    showImage: (me)->
      self = @
      @updateNavi me
      if /\.(jpg|jpeg|gif|png)$/i.test($(me).attr("href"))
        $('<img />').attr('src', me.attr('href')).fadeTo(0, 0).load ->
          self._printElLoad @
          return
      else
        @_printElLoad "<iframe src='#{me.attr("href")}' frameborder='0' width='640' height='480' />"
      return

    _printElLoad: (el) ->
      @printEl = el
      @setCenter()
      return

    setCenter: ->
      el = $(@printEl).appendTo(@container.find("#wrap-redde-container").empty())
      w = el.width()
      h = el.height()
      
      @container.addClass("resize-show-photo").stop(false, false).animate(
        width: w
        height: h
        # -1 - поправка на border
        "margin-left": -w / 2 - 1
        "margin-top": -h / 2 - 1
        top: "50%"
        left: "50%"
      , 400, ->
        $(@).removeClass "resize-show-photo"
        if $.isFunction($.fn.draggable)
          $(@).draggable stop: ->
            obj = {}
            x1 = parseInt($(@).css("left"), 10)
            y1 = parseInt($(@).css("top"), 10)
            xy2 = $(@).offsetParent()
            x2 = parseInt(xy2.width(), 10)
            y2 = parseInt(xy2.height(), 10)
            if x2 > w
              if x1 < 0
                obj.left = 0
              else obj.left = x2  if x1 > x2
            else
              if x2 / 2 - x1 > w / 2
                obj.left = (x2 - w) / 2
              else obj.left = (x2 + w) / 2  if x1 - x2 / 2 > w / 2
            if y2 > h
              if y1 < 0
                obj.top = 0
              else obj.top = y2  if y1 > y2
            else
              if y2 / 2 - y1 > h / 2
                obj.top = (y2 - h) / 2
              else obj.top = (y2 + h) / 2  if y1 - y2 / 2 > h / 2
            $(@).animate obj
            return
          return

      ).find("img").fadeTo 0, 1.0

    setInterface: (linkActive, settings) ->
      cssClassWrapper = (if (settings.classWrapper) then " class=\"" + settings.classWrapper + "\"" else "")

      cont = """
            <div id="redde-overlay"></div>
            <div id="redde-box" #{cssClassWrapper}>
              <div id="redde-container">
                <div id="wrap-redde-container"></div>
                <a href="#" class="redde-prev"></a>
                <a href="#" class="redde-close"></a>
                <a href="#" class="redde-next"></a> 
                <div class="redde-desc"></div>
              </div>
            </div>
            """
      $('body').append cont

      @container = $("#redde-container")

      $('#redde-overlay').fadeTo 400, settings.overlayOpacity

      self = @

      $('#redde-box').fadeTo 400, 1.0, ->
        $(@).bind 'click', (e) ->
          if e.target == @
            self.removeReddeBox()
          return
        return

      unless settings.imageArray.length
        @showImage $(linkActive)
      else
        if settings.activeImage
          @activeIndex = settings.activeImage
        @showImage $(@jQueryMatchedObj[@activeIndex])

      @container.find("a").click (e) ->
        switch @className
          when "redde-next", "redde-prev"
            self.container.stop true, true
            delta = (if @className is "redde-prev" then -1 else 1)
            if self.jQueryMatchedObj[self.activeIndex + delta] isnt `undefined`
              self.activeIndex = self.activeIndex + delta
              self.showImage $(self.jQueryMatchedObj[self.activeIndex])
          when "redde-close"
            self.removeReddeBox()
            break
        e.preventDefault()
        return

      return




      

  return
) jQuery