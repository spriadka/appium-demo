/**
 * Created by spriadka on 11/25/16.
 */
require('colors');
var Using = require('../helpers').Using;
var chai = require('chai');
chai.expect();
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
var wd = require('wd');
var Asserter = wd.Asserter;

chaiAsPromised.transferPromiseness = wd.transferPromiseness;

describe('LoginTests', function () {
    this.timeout(20000);
    var asserters = wd.asserters;
    var serverConfig = {
        hostName: '0.0.0.0',
        port: 4723
    };
    var appiumConfig = {
        platformName: 'Android',
        platformVersion: '6.0',
        deviceName: 'Nexus 5',
        app: '/home/spriadka/raincatcher-mobile-temp/spriadka-RAINCATCH-321-WFM-Demo-Mobile-App/platforms/android/ant-build/MainActivity-debug.apk'
    };
    var browser;
    before(function (done) {
        browser = wd.promiseChainRemote(serverConfig);
        browser.on('status', function (info) {
            console.log(info.cyan);
        });
        browser.on('command', function (eventType, command, response) {
            console.log(' > ' + eventType.cyan, command, (response || '').grey);
        });
        browser.on('http', function (meth, path, data) {
            console.log(' > ' + meth.magenta, path, (data || '').grey);
        });
        return browser
            .init(appiumConfig)
            .nodeify(done);
    });

    // tagging chai assertion errors for retry
    // var assertionError = function (err) {
    //     // throw error and tag as retriable to poll again
    //     // console.log(">>>>>>>> IN ERROR", err);
    //     err.retriable = err instanceof chai.AssertionError;
    //     // err.retriable = true;
    //     console.log(">>>>>>>> IN ERROR", err.retriable);
    //     throw err;
    // };

// simple asserter, just making sure that the element (or browser)
// text is non-empty and returning the text.
// It will be called until the promise is resolved with a defined value.
    var customTextNonEmpty = new Asserter(
        function callMeAgain(target) { // browser or el
            return target
                .hasElement(Using.tagName, 'md-progress-circular').then(function (res) {
                    var self = this;
                    self.res = res;
                    console.log(">>>>>>>> IN THEN", res);
                    if (self.res) {
                        console.log('>>>>>', self.res);
                        err = new chai.AssertionError();
                        err.retriable = true;
                        throw err;
                    } else {
                        console.log('>>>>>', self.res);
                        return self.res;
                    }
                });
        }
    );


    /*
     function newAssertedPromise(browser, using, value) {
     setTimeout(function (using, value) {
     browser.hasElement(using, value, function (err, result) {
     if (err) {
     throw new Error(err);
     }
     if (!result) {
     return browser;
     }
     else {
     newAssertedPromise(browser, using, value)
     }
     })
     }, 500, using, value);
     // console.log(">>>>>>>>>>>>>  ", promised);
     }

     var doesNotExistAsserter = function(target,using,value){
     return new Asserter(function(browser){
     return new Promise(function () {
     newAssertedPromise(browser, using, value);
     });
     });
     };
     */

    beforeEach(function (done) {
        return browser
            .context("WEBVIEW_com.redhat.demo.wfm")
            .waitFor(customTextNonEmpty, 5000, 500)
            .nodeify(done);
    });
    afterEach(function (done) {
        return browser
            .quit()
            .nodeify(done);
    });
    it('Should connect', function (done) {
        return browser
            .element(Using.id, 'username')
            .type('trever')
            .element(Using.id, 'password')
            .type('demo')
            .nodeify(done);
    });
});