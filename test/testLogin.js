/**
 * Created by spriadka on 11/25/16.
 */
require('colors');
var Using = require('../helpers').Using;
var chai = require('chai');
var assert = chai.assert;
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
        app: '/home/spriadka/raincatcher-mobile-temp/spriadka-RAINCATCH-321-WFM-Demo-Mobile-App/platforms/android/ant-build/MainActivity-debug.apk',
        udid: '00ee4bbc5ac3194a'
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
        return done();
    });

    var elementExistsAsserter = function(target,using,value) {
        return new Asserter(
            function (target) { // browser or el
                return target
                    .hasElement(using, value).then(function (res) {
                            assert.equal(false, res);
                            return res;
                        }
                    )
                    .catch(function (err) {
                        err.retriable = true;
                        throw err;
                    })
            });
    }

    beforeEach(function (done) {
        return browser
            .init(appiumConfig)
            .context("WEBVIEW_com.redhat.demo.wfm")
            .waitFor(elementExistsAsserter(browser,Using.tagName,'md-progress-circular'), 5000, 500)
            .nodeify(done);
    });
    afterEach(function (done) {
        return browser
            .quit()
            .nodeify(done);
    });
    it('Should log in correct user', function (done) {
        return browser
            .url()
            .element(Using.id, 'username')
            .type('trever')
            .element(Using.id, 'password')
            .type('demo')
            .element(Using.cssSelector,'button.md-raised.md-primary.md-hue-2.md-button.md-ink-ripple')
            .tap()
            .nodeify(done);
    });
    it('Should load workflows',function(done){
        return browser
            .element(Using.id, 'username')
            .type('trever')
            .element(Using.id, 'password')
            .type('demo')
            .element(Using.cssSelector,'button.md-raised.md-primary.md-hue-2.md-button.md-ink-ripple')
            .tap()
            .waitForElement(Using.className,'md-toolbar-tools',asserters.isDisplayed)
            .sleep(5000)
            .nodeify(done);
    })
});