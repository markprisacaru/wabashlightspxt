"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../../built/pxtlib.d.ts"/>
var core = require("./core");
var electron = require("./electron");
var pkg = require("./package");
var hidbridge = require("./hidbridge");
var Cloud = pxt.Cloud;
function browserDownloadAsync(text, name, contentType) {
    pxt.BrowserUtils.browserDownloadBinText(text, name, contentType, undefined, function (e) { return core.errorNotification(lf("saving file failed...")); });
    return Promise.resolve();
}
function browserDownloadDeployCoreAsync(resp) {
    var url = "";
    var ext = pxt.outputName().replace(/[^.]*/, "");
    var out = resp.outfiles[pxt.outputName()];
    var fn = pkg.genFileName(ext);
    var userContext = pxt.BrowserUtils.isBrowserDownloadWithinUserContext();
    if (userContext) {
        url = pxt.BrowserUtils.toDownloadDataUri(pxt.isOutputText() ? ts.pxtc.encodeBase64(out) : out, pxt.appTarget.compile.hexMimeType);
    }
    else if (!pxt.isOutputText()) {
        pxt.debug('saving ' + fn);
        url = pxt.BrowserUtils.browserDownloadBase64(out, fn, "application/x-uf2", resp.userContextWindow, function (e) { return core.errorNotification(lf("saving file failed...")); });
    }
    else {
        pxt.debug('saving ' + fn);
        url = pxt.BrowserUtils.browserDownloadBinText(out, fn, pxt.appTarget.compile.hexMimeType, resp.userContextWindow, function (e) { return core.errorNotification(lf("saving file failed...")); });
    }
    if (!resp.success) {
        return Promise.resolve();
    }
    if (resp.saveOnly && userContext)
        return pxt.commands.showUploadInstructionsAsync(fn, url, core.confirmAsync); // save does the same as download as far iOS is concerned
    if (resp.saveOnly || pxt.BrowserUtils.isBrowserDownloadInSameWindow() && !userContext)
        return Promise.resolve();
    else
        return pxt.commands.showUploadInstructionsAsync(fn, url, core.confirmAsync);
}
exports.browserDownloadDeployCoreAsync = browserDownloadDeployCoreAsync;
function showUploadInstructionsAsync(fn, url, confirmAsync) {
    var boardName = pxt.appTarget.appTheme.boardName || lf("device");
    var boardDriveName = pxt.appTarget.appTheme.driveDisplayName || pxt.appTarget.compile.driveName || "???";
    // https://msdn.microsoft.com/en-us/library/cc848897.aspx
    // "For security reasons, data URIs are restricted to downloaded resources.
    // Data URIs cannot be used for navigation, for scripting, or to populate frame or iframe elements"
    var userDownload = pxt.BrowserUtils.isBrowserDownloadWithinUserContext();
    var downloadAgain = !pxt.BrowserUtils.isIE() && !pxt.BrowserUtils.isEdge();
    var docUrl = pxt.appTarget.appTheme.usbDocs;
    var saveAs = pxt.BrowserUtils.hasSaveAs();
    var ext = pxt.appTarget.compile.useUF2 ? ".uf2" : ".hex";
    var body = userDownload ? lf("Click 'Download' to open the {0} app.", pxt.appTarget.appTheme.boardName) :
        saveAs ? lf("Click 'Save As' and save the {0} file to the {1} drive to transfer the code into your {2}.", ext, boardDriveName, boardName)
            : lf("Move the {0} file to the {1} drive to transfer the code into your {2}.", ext, boardDriveName, boardName);
    var timeout = pxt.BrowserUtils.isBrowserDownloadWithinUserContext() ? 0 : 10000;
    return confirmAsync({
        header: userDownload ? lf("Download ready...") : lf("Download completed..."),
        body: body,
        hasCloseIcon: true,
        hideCancel: true,
        hideAgree: true,
        buttons: [downloadAgain ? {
                label: userDownload ? lf("Download") : fn,
                icon: "download",
                class: "" + (userDownload ? "primary" : "lightgrey"),
                url: url,
                fileName: fn
            } : undefined, docUrl ? {
                label: lf("Help"),
                icon: "help",
                class: "lightgrey",
                url: docUrl
            } : undefined],
        timeout: timeout
    }).then(function () { });
}
function nativeHostPostMessageFunction() {
    var webkit = window.webkit;
    if (webkit
        && webkit.messageHandlers
        && webkit.messageHandlers.host
        && webkit.messageHandlers.host.postMessage)
        return function (msg) { return webkit.messageHandlers.host.postMessage(msg); };
    var android = window.android;
    if (android && android.postMessage)
        return function (msg) { return android.postMessage(JSON.stringify(msg)); };
    return undefined;
}
exports.nativeHostPostMessageFunction = nativeHostPostMessageFunction;
function isNativeHost() {
    return !!nativeHostPostMessageFunction();
}
exports.isNativeHost = isNativeHost;
function nativeHostDeployCoreAsync(resp) {
    pxt.debug("native deploy");
    core.infoNotification(lf("Flashing device..."));
    var out = resp.outfiles[pxt.outputName()];
    var nativePostMessage = nativeHostPostMessageFunction();
    nativePostMessage({
        name: resp.downloadFileBaseName,
        download: out
    });
    return Promise.resolve();
}
function nativeHostSaveCoreAsync(resp) {
    pxt.debug("native save");
    core.infoNotification(lf("Saving file..."));
    var out = resp.outfiles[pxt.outputName()];
    var nativePostMessage = nativeHostPostMessageFunction();
    nativePostMessage({
        name: resp.downloadFileBaseName,
        save: out
    });
    return Promise.resolve();
}
function hidDeployCoreAsync(resp, d) {
    pxt.tickEvent("hid.deploy");
    // error message handled in browser download
    if (!resp.success)
        return browserDownloadDeployCoreAsync(resp);
    core.infoNotification(lf("Downloading..."));
    var f = resp.outfiles[pxtc.BINARY_UF2];
    var blocks = pxtc.UF2.parseFile(pxt.Util.stringToUint8Array(atob(f)));
    return hidbridge.initAsync()
        .then(function (dev) { return dev.reflashAsync(blocks); })
        .catch(function (e) {
        var troubleshootDoc = pxt.appTarget && pxt.appTarget.appTheme && pxt.appTarget.appTheme.appFlashingTroubleshoot;
        if (e.type === "repairbootloader") {
            return pairBootloaderAsync()
                .then(function () { return hidDeployCoreAsync(resp); });
        }
        if (e.type === "devicenotfound" && d.reportDeviceNotFoundAsync && !!troubleshootDoc) {
            pxt.tickEvent("hid.flash.devicenotfound");
            return d.reportDeviceNotFoundAsync(troubleshootDoc, resp);
        }
        else {
            return pxt.commands.saveOnlyAsync(resp);
        }
    });
}
var askPairingCount = 0;
function askWebUSBPairAsync(resp) {
    pxt.tickEvent("webusb.askpair");
    askPairingCount++;
    if (askPairingCount > 3) {
        pxt.tickEvent("webusb.askpaircancel");
        return browserDownloadDeployCoreAsync(resp);
    }
    var boardName = pxt.appTarget.appTheme.boardName || lf("device");
    return core.confirmAsync({
        header: lf("No device detected..."),
        htmlBody: "\n<p><strong>" + lf("Do you want to pair your {0} to the editor?", boardName) + "</strong>\n" + lf("You will get instant downloads and data logging.") + "</p>\n<p class=\"ui font small\">The pairing experience is a one-time process.</p>\n        ",
    }).then(function (r) { return r ? showFirmwareUpdateInstructionsAsync(resp) : browserDownloadDeployCoreAsync(resp); });
}
function pairBootloaderAsync() {
    return core.confirmAsync({
        header: lf("Just one more time..."),
        body: lf("You need to pair the board again, now in bootloader mode. We know..."),
        agreeLbl: lf("Ok, pair!")
    }).then(function (r) { return pxt.usb.pairAsync(); });
}
function showFirmwareUpdateInstructionsAsync(resp) {
    return pxt.targetConfigAsync()
        .then(function (config) {
        var firmwareUrl = (config.firmwareUrls || {})[pxt.appTarget.simulator.boardDefinition ? pxt.appTarget.simulator.boardDefinition.id
            : ""];
        if (!firmwareUrl)
            return showWebUSBPairingInstructionsAsync(resp);
        pxt.tickEvent("webusb.upgradefirmware");
        var boardName = pxt.appTarget.appTheme.boardName || lf("device");
        var driveName = pxt.appTarget.appTheme.driveDisplayName || "DRIVE";
        var htmlBody = "\n    <div class=\"ui three column grid stackable\">\n        <div class=\"column\">\n            <div class=\"ui\">\n                <div class=\"content\">\n                    <div class=\"description\">\n                        <span class=\"ui yellow circular label\">1</span>\n                        <strong>" + lf("Connect {0} to computer with USB cable", boardName) + "</strong>\n                        <br/>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"column\">\n            <div class=\"ui\">\n                <div class=\"content\">\n                    <div class=\"description\">\n                        <span class=\"ui blue circular label\">2</span>\n                        <strong>" + lf("Download the latest firmware") + "</strong>\n                        <br/>\n                        <a href=\"" + firmwareUrl + "\" target=\"_blank\">" + lf("Click here to update to latest firmware") + "</a>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"column\">\n            <div class=\"ui\">\n                <div class=\"content\">\n                    <div class=\"description\">\n                        <span class=\"ui blue circular label\">3</span>\n                        " + lf("Move the .uf2 file to your board") + "\n                        <br/>\n                        " + lf("Locate the downloaded .uf2 file and drag it to the {0} drive", driveName) + "\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>";
        return core.confirmAsync({
            header: lf("Upgrade firmware"),
            htmlBody: htmlBody,
            agreeLbl: lf("Upgraded!")
        })
            .then(function (r) { return r ? showWebUSBPairingInstructionsAsync(resp) : browserDownloadDeployCoreAsync(resp); });
    });
}
function showWebUSBPairingInstructionsAsync(resp) {
    pxt.tickEvent("webusb.pair");
    var boardName = pxt.appTarget.appTheme.boardName || lf("device");
    var htmlBody = "\n    <div class=\"ui three column grid stackable\">\n        <div class=\"column\">\n            <div class=\"ui\">\n                <div class=\"content\">\n                    <div class=\"description\">\n                        <span class=\"ui yellow circular label\">1</span>\n                        <strong>" + lf("Connect {0} to computer with USB cable", boardName) + "</strong>\n                        <br/>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"column\">\n            <div class=\"ui\">\n                <div class=\"content\">\n                    <div class=\"description\">\n                        <span class=\"ui blue circular label\">2</span>\n                        " + lf("Select the device in the pairing dialog") + "\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"column\">\n            <div class=\"ui\">\n                <div class=\"content\">\n                    <div class=\"description\">\n                        <span class=\"ui blue circular label\">3</span>\n                        " + lf("Press \"Connect\"") + "\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>";
    return core.confirmAsync({
        header: lf("Pair your {0}", boardName),
        agreeLbl: lf("Let's pair it!"),
        htmlBody: htmlBody,
    }).then(function (r) {
        if (!r) {
            if (resp)
                return browserDownloadDeployCoreAsync(resp);
            else
                pxt.U.userError(pxt.U.lf("Device not paired"));
        }
        if (!resp)
            return pxt.usb.pairAsync();
        return pxt.usb.pairAsync()
            .then(function () {
            pxt.tickEvent("webusb.pair.success");
            return hidDeployCoreAsync(resp);
        })
            .catch(function (e) { return browserDownloadDeployCoreAsync(resp); });
    });
}
exports.showWebUSBPairingInstructionsAsync = showWebUSBPairingInstructionsAsync;
function webUsbDeployCoreAsync(resp) {
    pxt.tickEvent("webusb.deploy");
    return hidDeployCoreAsync(resp)
        .catch(function (e) { return askWebUSBPairAsync(resp); });
}
function winrtDeployCoreAsync(r, d) {
    return hidDeployCoreAsync(r, d)
        .timeout(20000)
        .catch(function (e) {
        return hidbridge.disconnectWrapperAsync()
            .catch(function (e) {
            // Best effort disconnect; at this point we don't even know the state of the device
            pxt.reportException(e);
        })
            .then(function () {
            return core.confirmAsync({
                header: lf("Something went wrong..."),
                body: lf("Flashing your {0} took too long. Please disconnect your {0} from your computer and try reconnecting it.", pxt.appTarget.appTheme.boardName || lf("device")),
                disagreeLbl: lf("Ok"),
                hideAgree: true
            });
        })
            .then(function () {
            return pxt.commands.saveOnlyAsync(r);
        });
    });
}
function localhostDeployCoreAsync(resp) {
    pxt.debug('local deployment...');
    core.infoNotification(lf("Uploading .hex file..."));
    var deploy = function () { return pxt.Util.requestAsync({
        url: "/api/deploy",
        headers: { "Authorization": Cloud.localToken },
        method: "POST",
        data: resp,
        allowHttpErrors: true // To prevent "Network request failed" warning in case of error. We're not actually doing network requests in localhost scenarios
    }).then(function (r) {
        if (r.statusCode !== 200) {
            core.errorNotification(lf("There was a problem, please try again"));
        }
        else if (r.json["boardCount"] === 0) {
            core.warningNotification(lf("Please connect your {0} to your computer and try again", pxt.appTarget.appTheme.boardName));
        }
    }); };
    return deploy();
}
function init() {
    pxt.onAppTargetChanged = init;
    pxt.commands.browserDownloadAsync = browserDownloadAsync;
    pxt.commands.saveOnlyAsync = browserDownloadDeployCoreAsync;
    pxt.commands.showUploadInstructionsAsync = showUploadInstructionsAsync;
    var forceHexDownload = /forceHexDownload/i.test(window.location.href);
    if (pxt.usb.isAvailable() && pxt.appTarget.compile.webUSB) {
        pxt.debug("enabled webusb");
        pxt.usb.setEnabled(true);
        pxt.HF2.mkPacketIOAsync = pxt.usb.mkPacketIOAsync;
    }
    else {
        pxt.debug("disabled webusb");
        pxt.usb.setEnabled(false);
        pxt.HF2.mkPacketIOAsync = hidbridge.mkBridgeAsync;
    }
    if (isNativeHost()) {
        pxt.debug("deploy/save using webkit host");
        pxt.commands.deployCoreAsync = nativeHostDeployCoreAsync;
        pxt.commands.saveOnlyAsync = nativeHostSaveCoreAsync;
    }
    else if (pxt.usb.isEnabled && pxt.appTarget.compile.useUF2) {
        pxt.commands.deployCoreAsync = webUsbDeployCoreAsync;
    }
    else if (pxt.winrt.isWinRT()) {
        if (pxt.appTarget.serial && pxt.appTarget.serial.useHF2) {
            pxt.winrt.initWinrtHid(function () { return hidbridge.initAsync(true).then(function () { }); }, function () { return hidbridge.disconnectWrapperAsync(); });
            pxt.HF2.mkPacketIOAsync = pxt.winrt.mkPacketIOAsync;
            pxt.commands.deployCoreAsync = winrtDeployCoreAsync;
        }
        else {
            // If we're not using HF2, then the target is using their own deploy logic in extension.ts, so don't use
            // the wrapper callbacks
            pxt.winrt.initWinrtHid(null, null);
            if (pxt.appTarget.serial && pxt.appTarget.serial.rawHID) {
                pxt.HF2.mkPacketIOAsync = pxt.winrt.mkPacketIOAsync;
            }
            pxt.commands.deployCoreAsync = pxt.winrt.driveDeployCoreAsync;
        }
        pxt.commands.browserDownloadAsync = pxt.winrt.browserDownloadAsync;
        pxt.commands.saveOnlyAsync = function (resp) {
            return pxt.winrt.saveOnlyAsync(resp)
                .then(function (saved) {
                if (saved) {
                    core.infoNotification(lf("file saved!"));
                }
            })
                .catch(function (e) { return core.errorNotification(lf("saving file failed...")); });
        };
    }
    else if (pxt.BrowserUtils.isPxtElectron()) {
        pxt.commands.deployCoreAsync = electron.driveDeployAsync;
        pxt.commands.electronDeployAsync = electron.driveDeployAsync;
    }
    else if (hidbridge.shouldUse() && !pxt.appTarget.serial.noDeploy && !forceHexDownload) {
        pxt.commands.deployCoreAsync = hidDeployCoreAsync;
    }
    else if (pxt.BrowserUtils.isLocalHost() && Cloud.localToken && !forceHexDownload) {
        pxt.commands.deployCoreAsync = localhostDeployCoreAsync;
    }
    else {
        pxt.commands.deployCoreAsync = browserDownloadDeployCoreAsync;
    }
}
exports.init = init;
