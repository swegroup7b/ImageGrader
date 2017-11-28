'use strict';

var path = require('path');
var EC = protractor.ExpectedConditions;

describe('Grader unit tests', function(){
  // ensures that upload page can be reached through links on the home page
  it('tests navigation to upload page', function() {
    browser.get('http://localhost:3001/');
    element(by.css('a.dropdown-toggle.ng-binding.ng-scope')).click();
    element(by.xpath('//a[contains(text(), "New Session")]')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/grader/upload');
  });
  // ensures that upload process works (requires a test image in the main project directory)
  it('tests upload process', function(){
    browser.get('http://localhost:3001/grader/upload');
    element(by.css('input.inputfile')).sendKeys(path.resolve('test_image.bmp'));
    browser.wait(EC.presenceOf(element(by.css('td > strong.ng-binding'))), 5000);
    expect(element(by.css('td > strong.ng-binding')).getText()).toBe('test_image.bmp');
    element(by.css('button.btn.btn-success.btn-s')).click();  // uploads image to be used in next test
  });
  // tests grading process
  it('tests grading interface', function(){
    browser.wait(EC.presenceOf(element(by.css('canvas.annotator'))));
    var canvas = element(by.css('canvas.annotator'));
    // define click function
    var click_point = function(item, right, down){
        browser.actions()
          .mouseMove(item, {x: right, y: down})
          .click()
          .perform();
    };
    // click osteophyte points
    click_point(canvas, 50, 50);
    click_point(canvas, 100, 50);
    click_point(canvas, 100, 100);
    click_point(canvas, 50, 100);
    click_point(canvas, 50, 50);
    // click to define plateau
    click_point(canvas, 200, 50);
    click_point(canvas, 400, 50);
    // click lesion border points
    console.log(element(by.css('div.text-window > h3')).getText());
    expect(element(by.css('div.text-window > h3')).getText()).toBe('3. lesionBorderPoints');
  });
});

describe('Result page test', function(){
  it('checks values in the table', function(){
    browser.wait(EC.presenceOf(by.css('table.table.table-bordered'))); // wait for table to apprear
    var entries = element.all(by.xpath('//tr[ng-repeat="image in pagedItems"]/td'));
    var lesionArea = Number(entries.get(4).getText());
    var width_at_0 = Number(entries.get(5).getText());
    var width_at_50 = Number(entries.get(6).getText());
    var width_at_95 = Number(entries.get(7).getText());
    var max_depth = Number(entries.get(8).getText());
    var lesion_surface = Number(entries.get(9).getText());
    var osteophyte_area = Number(entries.get(10).getText());
    expect(osteophyte_area.toEqual(2500));
  });
});
