(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery#awesome', {
    // This will run before each test in this module.
    setup: function() {
      this.links = $("#qunit-fixture").find("a");
      this.settings = {
        overlayOpacity:     0.5, 
        classWrapper:           "", 
        useThisLink:           true, // включить в набор текущий линк или линки
        imageArray:       [], 
        activeImage:      0
      };
    },

    teardown: function() {
      $("#redde-overlay, #redde-box").remove();
    }
  });

  test('Первая картинка активна', 1, function() {
    var reddebox = new $.reddebox(this.links.get(0), this.links, this.settings);
    strictEqual(reddebox.activeIndex, 0, "Индекс первой картинки 0");
  });

  test('Последняя картинка активна', 1, function() {
    var reddebox = new $.reddebox(this.links.last().get(0), this.links, this.settings);
    strictEqual(reddebox.activeIndex, 2, "Индекс последней картинки 2");
  });

  test('Проверяем все ли картинки получены', 1, function() {
    var reddebox = new $.reddebox(this.links.last().get(0), this.links, this.settings);
    strictEqual(reddebox.jQueryMatchedObj.length, 3, "Доступно три ссылки");
  });

  test('Не включать в набор текущие линки', 1, function() {
    var reddebox = new $.reddebox(this.links.last().get(0), this.links, $.extend(this.settings, {useThisLink: false}));
    strictEqual(reddebox.jQueryMatchedObj.length, 0, "Не должно быть объектов");
  });

  test("Уникальный класс обертки", 1, function(){
    new $.reddebox(this.links.get(0), this.links, $.extend(this.settings, {classWrapper: "unique-wrapper-class"}));
    ok($("#redde-box").hasClass("unique-wrapper-class"));
  });

  test("Определение активного элемена", 1, function(){
    var obj = {
      jQueryMatchedObj: [
        {href: "img1.png"},
        {href: "img2.png"},
        {href: "image.jpg"},
        {href: "testimg.png"}
      ]
    };
    $.reddebox.prototype.setActiveIndex.call(obj, "image.jpg");
    strictEqual(obj.activeIndex, 2, "Активный элемент 2");
  }); 

  asyncTest("Iframe unit", 1, function(){
    var obj = $.extend({}, $.reddebox.prototype, {
      settings: {
        fWidth: 640,
        fHeight: 480
      },
      jQueryMatchedObj: [{
        href: "../ajax.html"
      }],
      updateNavi: function(){},
      setCenter: function(){
        start(); 
        strictEqual($(obj.printEl).get(0).tagName, "IFRAME");
      }
    });
    $.reddebox.prototype.showImage.call(obj, $("<a/>", obj.jQueryMatchedObj[0]));
  });

  asyncTest("Iframe functionality", 1, function(){
    var links = $("<a>", {href: "../ajax.html"});
    var reddebox = new $.reddebox(links.get(0), links, this.settings);
    start();
    strictEqual(reddebox.container.find("#wrap-redde-container").find("iframe").length, 1);
  });

  asyncTest("image", 2, function(){
    var obj = $.extend({}, $.reddebox.prototype, {
      jQueryMatchedObj: [{
        href: "../src/image.jpg"
      }],
      updateNavi: function(){},
      setCenter: function(){
        start();
        strictEqual(obj.printEl.tagName, "IMG");
        strictEqual($("#qunit-fixture").html(obj.printEl).find("img").width(), 800, "Ширина картинки должна определиться как 800 пикселей");
      }
    });
    $.reddebox.prototype.showImage.call(obj, $("<a/>", obj.jQueryMatchedObj[0]));
  });

}(jQuery));
