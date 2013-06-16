describe('Frame sizes', function(){
  var link, reddebox;

  beforeEach(function(){
    link = $('<a/>').attr({
      href: '/ajax.html'
    });
  });

  afterEach(function(){
    reddebox.remove()
  });

  it("frame width and height should be 640 and 480(default)", function(){
    reddebox = new $.reddebox(link.get(0), link);
    expect($('iframe').width()).toBe(640)
    expect($('iframe').height()).toBe(480)
  });

  it("frame width and height should be 600 and 600(set)", function(){
    loadStyleFixtures('frame.css');
    reddebox = new $.reddebox(link.get(0), link);
    expect($('iframe').width()).toBe(600)
    expect($('iframe').height()).toBe(600)
  });

  it("frame width and height should be 400 and 400(set with css class wrapper)", function(){
    loadStyleFixtures('frame.css');
    reddebox = new $.reddebox(link.get(0), link, {classWrapper: 'square400'});
    expect($('iframe').width()).toBe(400)
    expect($('iframe').height()).toBe(400)
  });
});