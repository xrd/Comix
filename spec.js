// spec.js
describe('angularjs homepage', function() {
  it('should have a title', function() {
    browser.get('http://comix.127.0.0.1.xip.io/index.html');
      expect(browser.getTitle()).toEqual('The unicorn in me');
//      element(by.css('cx-frame').isElementPresent().then(function(v){ 
//          console.log( "Got it!" );
//      }));
  });
});
