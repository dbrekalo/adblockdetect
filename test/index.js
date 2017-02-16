var assert = require("chai").assert;
var adblockDetect = require("../");

var adblockerMock;
var adblockerMockInterval;

function adblockerMock(implementationCallback, checksAfter) {

    implementationCallback = implementationCallback || function(element) {
        element.style.display = 'none';
    }

    adblockerMockInterval = setInterval(function() {
        var elements = window.document.getElementsByClassName('textAd');
        if (elements.length > 0) {;
            implementationCallback(elements[0]);
        }
    }, checksAfter || 30);

};

afterEach(function() {

    clearInterval(adblockerMockInterval);

});

describe("adblockDetect", function() {

    it('detects when element is removed', function(done) {

        adblockerMock(function(element) {
            element.parentNode.removeChild(element);
        });

        adblockDetect(function(adblockDetected) {
            assert.isTrue(adblockDetected);
            done();
        });

    });

    it('detects when element has no height', function(done) {

        adblockerMock();

        adblockDetect(function(adblockDetected) {
            assert.isTrue(adblockDetected);
            done();
        });

    });

    it('detects when element is not displayed', function(done) {

        adblockerMock(function(element) {
            element.style.display = 'none';
        }, 150);

        adblockDetect(function(adblockDetected) {
            assert.isTrue(adblockDetected);
            done();
        });

    });

    it('detects when element is not visible', function(done) {

        adblockerMock(function(element) {
            element.style.visibility = 'hidden';
        });

        adblockDetect(function(adblockDetected) {
            assert.isTrue(adblockDetected);
            done();
        });

    });

    it('detects with user provided options', function(done) {

        adblockerMock();

        adblockDetect(function(adblockDetected) {
            assert.isTrue(adblockDetected);
            done();
        }, {
            testNodeClasses: 'textAd',
            testNodeStyle: 'position: absolute; bottom: 0; left: -10000px;',
            testInterval: 100,
            testRuns: 3
        });

    });

    it('detects no adblocker installed', function(done) {

        adblockDetect(function(adblockDetected) {
            assert.isFalse(adblockDetected);
            done();
        });

    });

});