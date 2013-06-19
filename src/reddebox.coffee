(($) ->
  $.fn.reddebox = (opts)->  
    elems = @

    @off('click.reddebox').on 'click.reddebox', (e)->
      new $.reddebox @, elems, opts
      e.preventDefault()
      return

  $.reddebox = (el, elems, opts) ->
    settings =
      overlayOpacity: 0.5
      classWrapper: ""
      useThisLink: true
      clickSubstrate: false # close by clicking on the substrate
      imageArray: []
      activeIndex: 0

    $.extend(settings, opts)
    imageArray = $.map settings.imageArray, (n)->
      $('<a />').attr('href', n).get(0)

    @jQueryMatchedObj = $.merge( $.merge([], elems) , imageArray)

    unless settings.useThisLink
      @jQueryMatchedObj = $.grep @jQueryMatchedObj, (n)->
        el != n

    @maxLength = @jQueryMatchedObj.length
    @settings = settings
    @setInterface el
    return @

  $.reddebox:: =

    _setActiveIndex: (el)->
      if $.isFunction(@settings.activeIndex)
        @activeIndex = @settings.activeIndex.call()
      else
        @activeIndex = $.map( @jQueryMatchedObj, (n, i) ->
          if n == el 
            i
        )[0] || 0

    remove: ->
      $('#redde-overlay, #redde-box').remove()
      return

    vis: (el)-> el.css 'visibility', 'visible'

    hid: (el)-> el.css 'visibility', 'hidden'

    updateNavi: ->
      @vis @container.find('i.redde-next, i.redde-prev')
      if @activeIndex is 0
        @hid $('i.redde-prev') 
      if @activeIndex is @maxLength-1
        @hid $('i.redde-next')
      @_setTitle()

    _setTitle: ->
      if title = @jQueryMatchedObj[@activeIndex].title
        @vis @container.find("div.redde-desc").html(title)
      else
        @hid @container.find("div.redde-desc").empty()
      return

    showImage: ->
      self = @
      @updateNavi()
      href = $(@jQueryMatchedObj[@activeIndex]).attr("href")
      if /\.(jpg|jpeg|gif|png)$/i.test(href)
        img = new Image()
        img.onload = ->
          self._printElLoad $(@).fadeTo(0, 0).get(0)
          return
        img.src = href
      else
        @_printElLoad "<iframe src='#{href}' frameborder='0' />"
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
    
    _cssClassWrapper: -> 
      unless @settings.classWrapper
        ""
      else
        " class='#{@settings.classWrapper}'"

    setInterface: (linkActive) ->
      @_setActiveIndex(linkActive)

      html = """
            <div id="redde-overlay"></div>
            <div id="redde-box"#{@._cssClassWrapper()}>
              <div id="redde-container">
                <div id="wrap-redde-container"></div>
                <i class="redde-prev"></i>
                <i class="redde-close"></i>
                <i class="redde-next"></i> 
                <div class="redde-desc"></div>
              </div>
            </div>
            """
      $html = $(html).appendTo 'body'

      @container = $html.find("#redde-container").on 'click', (e)->
        e.stopPropagation()

      $html.filter('#redde-overlay').fadeTo 400, @settings.overlayOpacity

      self = @

      $html.filter('#redde-box').fadeTo 400, 1.0, ->
        $(@).click(self.remove) if self.settings.clickSubstrate
        return

      @showImage()

      @container.find("i").click (e) ->
        if $(@).hasClass 'redde-next'
          self.container.stop true, true
          ++self.activeIndex
          self.showImage()
        else if $(@).hasClass 'redde-prev'
          self.container.stop true, true
          --self.activeIndex
          self.showImage()
        else if $(@).hasClass 'redde-close'
          self.remove()
        e.stopPropagation()
        return

      return   

  return
) jQuery