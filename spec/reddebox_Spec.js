describe("Bar", function() {
  it("it is not foo", function(){
    v = false;
    expect(v).toEqual(false);
  })
});

describe("Bar", function() {
  it("it is not foo", function(){
    v = $.reddebox;
    expect($.fn.jquery).toEqual('1.10.1');
  })
})