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
    var control_click = function(item, right, down) {
      browser.actions()
        .keyDown(protractor.Key.CONTROL)
        .mouseMove(item, {x: right, y: down})
        .click()
        .keyUp(protractor.Key.CONTROL)
        .perform();
    };
    // click osteophyte points
    click_point(canvas, 50, 50);
    click_point(canvas, 100, 50);
    click_point(canvas, 100, 100);
    control_click(canvas, 50, 100);
    browser.sleep(1000);
    // click to define plateau
    click_point(canvas, 200, 50);
    click_point(canvas, 400, 50);
    browser.sleep(1000);
    // click lesion border points
    click_point(canvas, 200, 100);
    click_point(canvas, 400, 100);
    click_point(canvas, 400, 200);
    click_point(canvas, 200,200);
    control_click(canvas, 200, 100);
    browser.sleep(1000);
    // define lesion surface
    click_point(canvas, 200, 100);
    control_click(canvas, 400, 100);
    browser.sleep(1000);
    // define osteochondral interface
    click_point(canvas, 100, 200);
    control_click(canvas, 400, 200);
    browser.sleep(1000);
    // define cartilage surface
    click_point(canvas, 100, 100);
    control_click(canvas, 400, 100);
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/grader/annotate');
    // click on link to results
    //browser.wait(EC.presenceOf(by.xpath('//a[contains(text(), "see results")]')));
    element(by.xpath('//a[contains(text(), "see results")]')).click();
  });
});

describe('Result page test', function(){
  it('checks values in the table', function(){
    //browser.wait(EC.presenceOf(by.css('table.table.table-bordered'))); // wait for table to appear
    browser.sleep(1000); // just to be sure
    element.all(by.xpath('//tr/td')).then(function(entries) {
      var lesionArea = entries[3].getText();
      var width_at_0 = entries[4].getText();
      var width_at_50 = entries[5].getText();
      var width_at_95 = entries[6].getText();
      var max_depth = entries[7].getText();
      var lesion_surface = entries[8].getText();
      var osteophyte_area = entries[9].getText();
      var avg_0 = entries[10].getText();
      var std_0 = entries[11].getText();
      var avg_50 = entries[12].getText();
      var std_50 = entries[13].getText();
      var avg_95 = entries[14].getText();
      var std_95 = entries[15].getText();
      // check values
      expect(lesionArea).toEqual("20000.0");
      expect(width_at_0).toEqual("200.0");
      expect(width_at_50).toEqual("200.0");
      expect(width_at_95).toEqual("200.0");
      expect(max_depth).toEqual("100.0");
      expect(lesion_surface).toEqual("200.0");
      expect(osteophyte_area).toEqual("2500.0");
      expect(avg_0).toEqual("100.0");
      expect(std_0).toEqual("0.0");
      expect(avg_50).toEqual("100.0");
      expect(std_50).toEqual("0.0");
      expect(avg_95).toEqual("100.0");
      expect(std_95).toEqual("0.0");
    });
  });
});
