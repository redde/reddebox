describe("reddebox", function() {
  var frag;
  beforeEach(function(){
    frag = $(readFixtures('images.html'))
  });

  it("reddebox доступен в объете jquery", function(){
    expect($.fn.reddebox).toBeDefined();
  });

  it('method chaining', function(){
    expect(frag.reddebox()).toBe(frag)
  });

});

describe("Bar", function() {
  var frag, links, reddebox;
  beforeEach(function(){
    frag = $(readFixtures('reddebox.html'));
    links = frag.find('a');
  });

  afterEach(function(){
    reddebox.remove()
  });

  it('activeIndex', function(){
    reddebox = new $.reddebox(links.get(1), links, {overlayOpacity: 1});
    expect(reddebox.activeIndex).toBe(1)
  });

  it('class-wrapper', function(){
    reddebox = new $.reddebox(links.get(0), links, {classWrapper: 'test-class'});
    expect($("#redde-box")).toHaveClass('test-class')
  });

  it('dont have class-wrapper', function(){
    reddebox = new $.reddebox(links.get(0), links);
    expect($("#redde-box").attr('class')).toBeUndefined()
  });

});

describe('useThisLink', function(){
  var reddebox, link;

  beforeEach(function(){
    link = $('<a/>').attr({
      href: 'test.html'
    });
  });

  afterEach(function(){
    reddebox.remove()
  });

  it('default', function(){
    reddebox = new $.reddebox(link.get(0), link, {
      imageArray: ['i/004.jpg', 'i/016.jpg']
    });
    expect(reddebox.jQueryMatchedObj.length).toBe(3)
  });  

  it('false', function(){
    reddebox = new $.reddebox(link.get(0), link, {
      useThisLink: false,
      imageArray: ['i/004.jpg', 'i/016.jpg']
    });
    expect(reddebox.jQueryMatchedObj.length).toBe(2)
  });

  it('random', function(){
    var r = Math.round(Math.random()*9+0.5)-1
    reddebox = new $.reddebox(link.get(0), link, {
      activeIndex: function(){
        return r
      },
      imageArray: ['i/004.jpg', 'i/016.jpg', 'i/004.jpg', 'i/016.jpg', 'i/004.jpg', 'i/016.jpg', 'i/004.jpg', 'i/016.jpg', 'i/004.jpg', 'i/016.jpg']
    });
    expect(reddebox.activeIndex).toBe(r)
  });

});