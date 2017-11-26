'use strict';

var path = require('path');

describe('Grader unit tests', function(){
  // ensures that upload page can be reached through links on the home page
  it('tests navigation to upload page', function() {
    browser.get('http://localhost:3001/');
    setTimeout(function(){
      element(by.xpath('//a[contains(text(), "Image Grader")]')).click();
    }, 5000);
    setTimeout(function(){
      element(by.xpath('//a[ui-sref="grader.upload({})"]')).click();
    }, 5000);
    setTimeout(function(){
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/grader/upload');
    }, 5000);
  });
  // ensures that upload process works (requires a test image in the main project directory)
  it('tests upload process', function(){
    browser.get('http://localhost:3001/grader/upload');
    setTimeout( function() {
      element(by.xpath('//input[id="file"]')).sendKeys(path.resolve('./test_image.bmp'));
    }, 5000);
    setTimeout(function(){
      expect(element(by.xpath('//tr[ng-repeat="item in uploader.queue"]//strong')).getText().toBe('test_image.PNG'));
    }, 5000);
  });
});
