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
    // Not a bad test to run on collection methods.
    var reddebox = new $.reddebox(this.links.get(0), this.links, this.settings);
    strictEqual(reddebox.activeIndex, 0, "Индекс первой картинки 0");
  });

  test('Последняя картинка активна', 1, function() {
    // Not a bad test to run on collection methods.
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

}(jQuery));
