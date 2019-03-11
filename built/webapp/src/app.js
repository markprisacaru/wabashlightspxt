"use strict";
/// <reference path="../../localtypings/pxtpackage.d.ts"/>
/// <reference path="../../built/pxtlib.d.ts"/>
/// <reference path="../../built/pxtblocks.d.ts"/>
/// <reference path="../../built/pxtsim.d.ts"/>
/// <reference path="../../built/pxtwinrt.d.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var workspace = require("./workspace");
var cloudsync = require("./cloudsync");
var data = require("./data");
var pkg = require("./package");
var core = require("./core");
var sui = require("./sui");
var simulator = require("./simulator");
var compiler = require("./compiler");
var cmds = require("./cmds");
var appcache = require("./appcache");
var screenshot = require("./screenshot");
var hidbridge = require("./hidbridge");
var share = require("./share");
var lang = require("./lang");
var accessibility = require("./accessibility");
var tutorial = require("./tutorial");
var editortoolbar = require("./editortoolbar");
var simtoolbar = require("./simtoolbar");
var dialogs = require("./dialogs");
var debug = require("./debugger");
var filelist = require("./filelist");
var container = require("./container");
var scriptsearch = require("./scriptsearch");
var projects = require("./projects");
var scriptmanager = require("./scriptmanager");
var extensions = require("./extensions");
var sounds = require("./sounds");
var make = require("./make");
var blocklyToolbox = require("./blocksSnippets");
var monacoToolbox = require("./monacoSnippets");
var greenscreen = require("./greenscreen");
var socketbridge = require("./socketbridge");
var monaco = require("./monaco");
var pxtjson = require("./pxtjson");
var serial = require("./serial");
var blocks = require("./blocks");
var serialindicator = require("./serialindicator");
var draganddrop = require("./draganddrop");
var notification = require("./notification");
var electron = require("./electron");
var Cloud = pxt.Cloud;
var Util = pxt.Util;
pxsim.util.injectPolyphils();
var theEditor;
var pendingEditorRequests;
function getEditorAsync() {
    if (theEditor)
        return Promise.resolve(theEditor);
    if (!pendingEditorRequests)
        pendingEditorRequests = [];
    return new Promise(function (resolve) {
        pendingEditorRequests.push(resolve);
    });
}
function setEditor(editor) {
    theEditor = editor;
    if (pendingEditorRequests) {
        while (pendingEditorRequests.length) {
            var resolve = pendingEditorRequests.shift();
            resolve(editor);
        }
        pendingEditorRequests = undefined;
    }
}
var ProjectView = /** @class */ (function (_super) {
    __extends(ProjectView, _super);
    function ProjectView(props) {
        var _this = _super.call(this, props) || this;
        _this.allEditors = [];
        _this.screenshotHandlers = [];
        _this.autoRunBlocksSimulator = pxtc.Util.debounce(function () {
            if (Util.now() - _this.lastChangeTime < 1000)
                return;
            if (!_this.state.active)
                return;
            _this.runSimulator({ debug: !!_this.state.debugging, background: true });
        }, 1000, true);
        _this.autoRunSimulator = pxtc.Util.debounce(function () {
            if (Util.now() - _this.lastChangeTime < 1000)
                return;
            if (!_this.state.active)
                return;
            _this.runSimulator({ debug: !!_this.state.debugging, background: true });
        }, 2000, true);
        _this._slowTypeCheck = 0;
        _this.typecheck = pxtc.Util.debounce(function () {
            if (_this.editor.isIncomplete())
                return;
            var start = Util.now();
            var state = _this.editor.snapshotState();
            compiler.typecheckAsync()
                .done(function (resp) {
                var end = Util.now();
                // if typecheck is slow (>10s)
                // and it happened more than 2 times,
                // it's a slow machine, go into light mode
                if (!pxt.options.light && end - start > 10000 && _this._slowTypeCheck++ > 1) {
                    pxt.tickEvent("light.typecheck");
                    pxt.options.light = true;
                }
                _this.editor.setDiagnostics(_this.editorFile, state);
                data.invalidate("open-pkg-meta:" + pkg.mainEditorPkg().getPkgId());
                if (_this.state.autoRun) {
                    var output = pkg.mainEditorPkg().outputPkg.files["output.txt"];
                    if (output && !output.numDiagnosticsOverride
                        && _this.state.autoRun) {
                        if (_this.editor == _this.blocksEditor)
                            _this.autoRunBlocksSimulator();
                        else
                            _this.autoRunSimulator();
                    }
                }
                _this.maybeShowPackageErrors();
            });
        }, 1000, false);
        _this.markdownChangeHandler = Util.debounce(function () {
            if (_this.state.currFile && /\.md$/i.test(_this.state.currFile.name))
                _this.setSideMarkdown(_this.editor.getCurrentSource());
        }, 4000, false);
        _this.editorChangeHandler = Util.debounce(function () {
            if (!_this.editor.isIncomplete()) {
                _this.saveFileAsync().done(); // don't wait till save is done
                _this.typecheck();
            }
            _this.markdownChangeHandler();
        }, 500, false);
        _this.updatingEditorFile = false;
        ///////////////////////////////////////////////////////////
        ////////////             Import               /////////////
        ///////////////////////////////////////////////////////////
        _this.hexFileImporters = [{
                id: "default",
                canImport: function (data) { return data.meta.cloudId == "ks/" + pxt.appTarget.id || data.meta.cloudId == pxt.CLOUD_ID + pxt.appTarget.id // match on targetid
                    || (Util.startsWith(data.meta.cloudId, pxt.CLOUD_ID + pxt.appTarget.id)); } // trying to load white-label file into main target
                ,
                importAsync: function (project, data) {
                    var h = {
                        target: pxt.appTarget.id,
                        targetVersion: data.meta.targetVersions ? data.meta.targetVersions.target : undefined,
                        editor: data.meta.editor,
                        name: data.meta.name,
                        meta: {},
                        pubId: "",
                        pubCurrent: false
                    };
                    var files = JSON.parse(data.source);
                    // we cannot load the workspace until we've loaded the project
                    return workspace.installAsync(h, files)
                        .then(function (hd) { return _this.loadHeaderAsync(hd, null); });
                }
            }];
        _this.resourceImporters = [
            new serial.ResourceImporter()
        ];
        _this.checkWebUSBVariant = true;
        // Close on escape
        _this.closeOnEscape = function (e) {
            var charCode = core.keyCodeFromEvent(e);
            if (charCode !== core.ESC_KEY)
                return;
            e.preventDefault();
            _this.toggleSimulatorFullscreen();
        };
        _this.debouncedSaveProjectName = Util.debounce(function () {
            _this.saveProjectNameAsync().done();
        }, 2000, false);
        ///////////////////////////////////////////////////////////
        ////////////         Script Manager           /////////////
        ///////////////////////////////////////////////////////////
        _this.handleScriptManagerDialogClose = function () {
            // When the script manager dialog closes, we want to refresh our projects list in case anything has changed
            _this.home.forceUpdate();
        };
        ///////////////////////////////////////////////////////////
        ////////////             REFS                 /////////////
        ///////////////////////////////////////////////////////////
        _this.handleHomeRef = function (c) {
            _this.home = c;
        };
        _this.handleScriptSearchRef = function (c) {
            _this.scriptSearch = c;
        };
        _this.handleExtensionRef = function (c) {
            _this.extensions = c;
        };
        _this.handleScriptManagerDialogRef = function (c) {
            _this.scriptManagerDialog = c;
        };
        _this.handleImportDialogRef = function (c) {
            _this.importDialog = c;
        };
        _this.handleExitAndSaveDialogRef = function (c) {
            _this.exitAndSaveDialog = c;
        };
        _this.handleShareEditorRef = function (c) {
            _this.shareEditor = c;
        };
        _this.handleLanguagePickerRef = function (c) {
            _this.languagePicker = c;
        };
        _this.handleChooseHwDialogRef = function (c) {
            _this.chooseHwDialog = c;
        };
        document.title = pxt.appTarget.title || pxt.appTarget.name;
        _this.reload = false; //set to true in case of reset of the project where we are going to reload the page.
        _this.settings = JSON.parse(pxt.storage.getLocal("editorSettings") || "{}");
        var shouldShowHomeScreen = _this.shouldShowHomeScreen();
        var isSandbox = pxt.shell.isSandboxMode() || pxt.shell.isReadOnly();
        var isHighContrast = /hc=(\w+)/.test(window.location.href);
        if (isHighContrast)
            core.setHighContrast(true);
        var simcfg = pxt.appTarget.simulator;
        _this.state = {
            showFiles: false,
            home: shouldShowHomeScreen,
            active: document.visibilityState == 'visible' || pxt.BrowserUtils.isElectron() || pxt.winrt.isWinRT() || pxt.appTarget.appTheme.dontSuspendOnVisibility,
            // don't start collapsed in mobile since we can go fullscreen now
            collapseEditorTools: simcfg.headless,
            highContrast: isHighContrast,
            simState: pxt.editor.SimState.Stopped,
            autoRun: true // always start simulator by default
        };
        if (!_this.settings.editorFontSize)
            _this.settings.editorFontSize = /mobile/i.test(navigator.userAgent) ? 15 : 19;
        if (!_this.settings.fileHistory)
            _this.settings.fileHistory = [];
        if (shouldShowHomeScreen)
            _this.homeLoaded();
        _this.hwDebug = _this.hwDebug.bind(_this);
        _this.hideLightbox = _this.hideLightbox.bind(_this);
        _this.openSimSerial = _this.openSimSerial.bind(_this);
        _this.openDeviceSerial = _this.openDeviceSerial.bind(_this);
        _this.toggleGreenScreen = _this.toggleGreenScreen.bind(_this);
        _this.toggleSimulatorFullscreen = _this.toggleSimulatorFullscreen.bind(_this);
        _this.initScreenshots();
        return _this;
    }
    ProjectView.prototype.initScreenshots = function () {
        var _this = this;
        window.addEventListener('message', function (ev) {
            var msg = ev.data;
            if (!msg || !_this.state.header)
                return;
            if (msg.type == "screenshot") {
                var scmsg = msg;
                if (!scmsg.data)
                    return;
                var handler = _this.screenshotHandlers[_this.screenshotHandlers.length - 1];
                if (handler)
                    handler(scmsg);
                else {
                    var pngString = pxt.BrowserUtils.imageDataToPNG(scmsg.data);
                    if (pxt.appTarget.compile.saveAsPNG)
                        _this.encodeProjectAsPNGAsync(pngString, false).done();
                    screenshot.saveAsync(_this.state.header, pngString)
                        .done(function () { pxt.debug('screenshot saved'); });
                }
            }
            else if (msg.type == "recorder") {
                var scmsg = msg;
                var handler = _this.screenshotHandlers[_this.screenshotHandlers.length - 1];
                if (handler)
                    handler({
                        event: scmsg.action
                    });
            }
        }, false);
    };
    ProjectView.prototype.shouldShowHomeScreen = function () {
        var hash = parseHash();
        var isSandbox = pxt.shell.isSandboxMode() || pxt.shell.isReadOnly();
        // Only show the start screen if there are no initial projects requested
        // (e.g. from the URL hash or from WinRT activation arguments)
        var skipStartScreen = pxt.appTarget.appTheme.allowParentController
            || pxt.shell.isControllerMode()
            || window.location.hash == "#editor";
        return !isSandbox && !skipStartScreen && !isProjectRelatedHash(hash);
    };
    ProjectView.prototype.updateVisibility = function () {
        var _this = this;
        if (pxt.BrowserUtils.isElectron() || pxt.winrt.isWinRT() || pxt.appTarget.appTheme.dontSuspendOnVisibility) {
            // Don't suspend when inside apps
            return;
        }
        var active = document.visibilityState == 'visible';
        pxt.debug("page visibility: " + active);
        this.setState({ active: active });
        if (!active && this.state.autoRun) {
            if (simulator.driver.state == pxsim.SimulatorState.Running) {
                this.suspendSimulator();
                this.setState({ resumeOnVisibility: true });
            }
            this.saveFileAsync().done();
        }
        else {
            if (workspace.isSessionOutdated()) {
                pxt.debug('workspace changed, reloading...');
                var id_1 = this.state.header ? this.state.header.id : '';
                workspace.initAsync()
                    .done(function () { return !_this.state.home && id_1 ? _this.loadHeaderAsync(workspace.getHeader(id_1), _this.state.editorState) : Promise.resolve(); });
            }
            else if (this.state.resumeOnVisibility) {
                this.setState({ resumeOnVisibility: false });
                // We did a save when the page was hidden, no need to save again.
                this.runSimulator();
            }
        }
    };
    ProjectView.prototype.saveSettings = function () {
        if (this.reload) {
            return;
        }
        var f = this.editorFile;
        if (f && f.epkg.getTopHeader() && this.editor.hasHistory()) {
            this.pushFileHistory(f.epkg.getTopHeader().id, f.getName(), this.editor.getViewState());
        }
        pxt.storage.setLocal("editorSettings", JSON.stringify(this.settings));
    };
    ProjectView.prototype.pushFileHistory = function (id, name, pos) {
        var sett = this.settings;
        var n = {
            id: id,
            name: name,
            pos: pos
        };
        sett.fileHistory = sett.fileHistory.filter(function (e) { return e.id != n.id || e.name != n.name; });
        while (sett.fileHistory.length > 100)
            sett.fileHistory.pop();
        sett.fileHistory.unshift(n);
    };
    ProjectView.prototype.openProjectInLegacyEditor = function (majorVersion) {
        var _this = this;
        if (!this.editorFile || !this.editorFile.epkg || !this.editorFile.epkg.getTopHeader())
            return Promise.resolve();
        var header = this.editorFile.epkg.getTopHeader();
        pxt.tickEvent("update.openLegacyEditor", { version: header.targetVersion });
        return workspace.copyProjectToLegacyEditor(header, majorVersion)
            .then(function (newHeader) {
            // Push an entry to the history so that the project loads when we change the URL. The editor
            // will ignore non-existent entries so this shouldn't affect any versions except the one
            // we choose
            _this.pushFileHistory(newHeader.id, _this.editorFile.getName(), _this.editor.getViewState());
            pxt.storage.setLocal("editorSettings", JSON.stringify(_this.settings));
            var appTheme = pxt.appTarget.appTheme;
            if (appTheme && appTheme.editorVersionPaths && appTheme.editorVersionPaths[majorVersion]) {
                var newPath = appTheme.editorVersionPaths[majorVersion];
                window.location.href = pxt.Util.pathJoin(window.location.origin, newPath + "#editor");
            }
            else {
                window.location.href = pxt.Util.pathJoin(window.location.origin, "v" + header.targetVersion + "#editor");
            }
        })
            .catch(function (e) {
            core.warningNotification(lf("Importing to older editor version only supported in web browsers"));
        });
    };
    ProjectView.prototype.componentDidUpdate = function () {
        this.saveSettings();
        this.editor.domUpdate();
        simulator.setState(this.state.header ? this.state.header.editor : '', this.state.tutorialOptions && !!this.state.tutorialOptions.tutorial);
        this.editor.resize();
        if (this.editor && this.editor.isReady) {
            this.updateEditorFile();
        }
    };
    ProjectView.prototype.fireResize = function () {
        if (document.createEvent) {
            var event_1 = document.createEvent('Event');
            event_1.initEvent('resize', true, true);
            window.dispatchEvent(event_1);
        }
        else {
            document.fireEvent('onresize');
        }
    };
    ProjectView.prototype.updateEditorLogo = function (left, rgba) {
        if (pxt.appTarget.appTheme.hideMenuBar) {
            var editorLogo = document.getElementById('editorlogo');
            if (editorLogo) {
                editorLogo.style.left = left + "px";
                editorLogo.style.display = 'block';
                editorLogo.style.background = rgba || '';
                return editorLogo.offsetHeight;
            }
        }
        return 0;
    };
    ProjectView.prototype.saveFileAsync = function () {
        var _this = this;
        if (!this.editorFile)
            return Promise.resolve();
        return this.saveTypeScriptAsync()
            .then(function () {
            var txt = _this.editor.getCurrentSource();
            if (txt != _this.editorFile.content)
                simulator.setDirty();
            if (_this.editor.isIncomplete())
                return Promise.resolve();
            return _this.editorFile.setContentAsync(txt);
        });
    };
    ProjectView.prototype.isEmbedSimActive = function () {
        return this.state.embedSimView;
    };
    ProjectView.prototype.isBlocksActive = function () {
        return !this.state.embedSimView && this.editor == this.blocksEditor
            && this.editorFile && this.editorFile.name == "main.blocks";
    };
    ProjectView.prototype.isJavaScriptActive = function () {
        return !this.state.embedSimView && this.editor == this.textEditor
            && this.editorFile && this.editorFile.name == "main.ts";
    };
    ProjectView.prototype.isAnyEditeableJavaScriptOrPackageActive = function () {
        return this.editor == this.textEditor
            && this.editorFile && !this.editorFile.isReadonly() && /(\.ts|pxt.json)$/.test(this.editorFile.name);
    };
    ProjectView.prototype.openJavaScript = function (giveFocusOnLoading) {
        if (giveFocusOnLoading === void 0) { giveFocusOnLoading = true; }
        if (this.updatingEditorFile)
            return; // already transitioning
        if (this.isJavaScriptActive()) {
            if (this.state.embedSimView) {
                this.setState({ embedSimView: false });
            }
            if (giveFocusOnLoading) {
                this.textEditor.editor.focus();
            }
            return;
        }
        if (this.textEditor) {
            this.textEditor.giveFocusOnLoading = giveFocusOnLoading;
        }
        if (this.isBlocksActive()) {
            this.blocksEditor.openTypeScript();
        }
        else
            this.setFile(pkg.mainEditorPkg().files["main.ts"]);
    };
    ProjectView.prototype.openBlocks = function () {
        var _this = this;
        if (this.updatingEditorFile)
            return; // already transitioning
        if (this.isBlocksActive()) {
            if (this.state.embedSimView)
                this.setState({ embedSimView: false });
            return;
        }
        if (this.isJavaScriptActive() || (this.shouldTryDecompile && !this.state.embedSimView))
            this.textEditor.openBlocks();
        else if (this.isAnyEditeableJavaScriptOrPackageActive()) {
            this.saveFileAsync().then(function () { return _this.textEditor.openBlocks(); });
        }
        else {
            var header = this.state.header;
            // Check to see if the last edit happened in monaco
            if (header && header.editor === pxt.JAVASCRIPT_PROJECT_NAME) {
                this.textEditor.openBlocks();
            }
            else {
                this.setFile(pkg.mainEditorPkg().files["main.blocks"]);
            }
        }
        this.shouldTryDecompile = false;
    };
    ProjectView.prototype.openSettings = function () {
        this.setFile(pkg.mainEditorPkg().lookupFile("this/pxt.json"));
    };
    ProjectView.prototype.openSimSerial = function () {
        this.openSerial(true);
    };
    ProjectView.prototype.openDeviceSerial = function () {
        this.openSerial(false);
    };
    ProjectView.prototype.openSerial = function (isSim) {
        if (!pxt.appTarget.serial || !pxt.appTarget.serial.useEditor)
            return; // not supported in this editor
        if (this.editor == this.serialEditor && this.serialEditor.isSim == isSim)
            return; // already showing
        var mainEditorPkg = pkg.mainEditorPkg();
        if (!mainEditorPkg)
            return; // no project loaded
        if (!mainEditorPkg.lookupFile("this/" + pxt.SERIAL_EDITOR_FILE)) {
            mainEditorPkg.setFile(pxt.SERIAL_EDITOR_FILE, "serial\n", true);
        }
        this.serialEditor.setSim(isSim);
        var event = "serial." + (isSim ? "simulator" : "device") + "EditorOpened";
        pxt.tickEvent(event);
        this.setFile(mainEditorPkg.lookupFile("this/" + pxt.SERIAL_EDITOR_FILE));
    };
    ProjectView.prototype.openPreviousEditor = function () {
        var hasBlocks = !!pkg.mainEditorPkg().files["main.blocks"];
        if (this.prevEditorId == "monacoEditor" || !hasBlocks) {
            this.openJavaScript(false);
        }
        else {
            this.openBlocks();
        }
    };
    ProjectView.prototype.openTypeScriptAsync = function () {
        return this.saveTypeScriptAsync(true);
    };
    ProjectView.prototype.openSimView = function () {
        if (this.state.embedSimView) {
            this.startStopSimulator();
        }
        else {
            this.setState({ embedSimView: true });
            this.startSimulator();
        }
    };
    ProjectView.prototype.typecheckNow = function () {
        this.saveFileAsync().done(); // don't wait for saving to backend store to finish before typechecking
        this.typecheck();
    };
    ProjectView.prototype.showPackageErrorsOnNextTypecheck = function () {
        this.setState({ suppressPackageWarning: false });
    };
    ProjectView.prototype.maybeShowPackageErrors = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        // Only show in blocks or main.ts
        if (this.state.currFile) {
            var fn = this.state.currFile.name;
            if (!pkg.File.blocksFileNameRx.test(fn) && fn !== "main.ts")
                return false;
        }
        if (!this.state.suppressPackageWarning || force) {
            this.setState({ suppressPackageWarning: true });
            var badPackages = compiler.getPackagesWithErrors();
            if (badPackages.length) {
                var h = this.state.header;
                var currentVersion = pxt.semver.parse(pxt.appTarget.versions.target);
                var headerVersion_1 = pxt.semver.parse(h.targetVersion);
                var openHandler = void 0;
                if (workspace.isBrowserWorkspace() && currentVersion.major !== headerVersion_1.major) {
                    openHandler = function () {
                        _this.openProjectInLegacyEditor(headerVersion_1.major);
                    };
                }
                dialogs.showPackageErrorDialogAsync(badPackages, compiler.updatePackagesAsync, openHandler)
                    .then(function (projectOpen) {
                    if (projectOpen) {
                        _this.reloadHeaderAsync();
                    }
                    else if (!force) {
                        _this.openHome();
                    }
                });
                return true;
            }
        }
        return false;
    };
    ProjectView.prototype.initEditors = function () {
        var _this = this;
        this.textEditor = new monaco.Editor(this);
        this.pxtJsonEditor = new pxtjson.Editor(this);
        this.serialEditor = new serial.Editor(this);
        this.blocksEditor = new blocks.Editor(this);
        var changeHandler = function () {
            if (_this.editorFile) {
                if (_this.editorFile.inSyncWithEditor)
                    pxt.tickActivity("edit", "edit." + _this.editor.getId().replace(/Editor$/, ''));
                _this.editorFile.markDirty();
            }
            _this.lastChangeTime = Util.now();
            if (_this.state.simState != pxt.editor.SimState.Stopped
                && pxt.appTarget.simulator && pxt.appTarget.simulator.stopOnChange)
                _this.stopSimulator();
            _this.editorChangeHandler();
        };
        this.allEditors = [this.pxtJsonEditor, this.blocksEditor, this.serialEditor, this.textEditor];
        this.allEditors.forEach(function (e) { return e.changeCallback = changeHandler; });
        this.editor = this.allEditors[this.allEditors.length - 1];
    };
    ProjectView.prototype.componentWillMount = function () {
        this.initEditors();
        this.initDragAndDrop();
    };
    ProjectView.prototype.componentDidMount = function () {
        var _this = this;
        this.allEditors.forEach(function (e) { return e.prepare(); });
        var restartingSim = false;
        simulator.init(document.getElementById("boardview"), {
            orphanException: function (brk) {
                // TODO: start debugging session
                // TODO: user friendly error message
                core.warningNotification(lf("Program Error: {0}", brk.exceptionMessage));
            },
            highlightStatement: function (stmt, brk) {
                if (_this.editor)
                    return _this.editor.highlightStatement(stmt, brk);
                return false;
            },
            restartSimulator: function () { return _this.restartSimulator(); },
            onStateChanged: function (state) {
                switch (state) {
                    case pxsim.SimulatorState.Paused:
                    case pxsim.SimulatorState.Unloaded:
                    case pxsim.SimulatorState.Suspended:
                    case pxsim.SimulatorState.Stopped:
                        _this.setState({ simState: pxt.editor.SimState.Stopped });
                        break;
                    case pxsim.SimulatorState.Running:
                        _this.setState({ simState: pxt.editor.SimState.Running });
                        break;
                }
            },
            editor: this.state.header ? this.state.header.editor : ''
        });
        this.forceUpdate(); // we now have editors prepared
    };
    // Add an error guard for the entire application
    ProjectView.prototype.componentDidCatch = function (error, info) {
        try {
            core.killLoadingQueue();
            pxsim.U.remove(document.getElementById('loading'));
            this.setState({ hasError: true });
            // Log critical error
            pxt.tickEvent('pxt.criticalerror', { error: error, info: info });
            // Reload the page in 2 seconds
            var lastCriticalError = pxt.storage.getLocal("lastcriticalerror") ?
                Date.parse(pxt.storage.getLocal("lastcriticalerror")) : Date.now();
            // don't refresh if we refreshed in the last minute
            if (!lastCriticalError || (!isNaN(lastCriticalError) && Date.now() - lastCriticalError > 60 * 1000)) {
                pxt.storage.setLocal("lastcriticalerror", new Date().toISOString());
                setTimeout(function () {
                    location.reload();
                }, 2000);
            }
        }
        catch (e) {
        }
    };
    ProjectView.prototype.pickEditorFor = function (f) {
        return this.allEditors.filter(function (e) { return e.acceptsFile(f); })[0];
    };
    ProjectView.prototype.updateEditorFile = function (editorOverride) {
        var _this = this;
        if (editorOverride === void 0) { editorOverride = null; }
        if (!this.state.active)
            return undefined;
        if (this.state.currFile == this.editorFile && !editorOverride)
            return undefined;
        if (this.updatingEditorFile)
            return undefined;
        this.updatingEditorFile = true;
        var simRunning = this.state.simState != pxt.editor.SimState.Stopped;
        if (!this.state.currFile.virtual) {
            this.stopSimulator();
            if (simRunning || this.state.autoRun) {
                simulator.driver.setStarting();
                this.setState({ simState: pxt.editor.SimState.Starting });
            }
        }
        this.saveSettings();
        var hc = this.state.highContrast;
        // save file before change
        return this.saveFileAsync()
            .then(function () {
            _this.editorFile = _this.state.currFile; // TODO
            var previousEditor = _this.editor;
            _this.prevEditorId = previousEditor.getId();
            _this.editor = editorOverride || _this.pickEditorFor(_this.editorFile);
            _this.allEditors.forEach(function (e) { return e.setVisible(e == _this.editor); });
            return previousEditor ? previousEditor.unloadFileAsync() : Promise.resolve();
        })
            .then(function () { return _this.editor.loadFileAsync(_this.editorFile, hc); })
            .then(function () {
            _this.saveFileAsync().done(); // make sure state is up to date
            if (_this.editor == _this.textEditor || _this.editor == _this.blocksEditor)
                _this.typecheck();
            var e = _this.settings.fileHistory.filter(function (e) { return e.id == _this.state.header.id && e.name == _this.editorFile.getName(); })[0];
            if (e)
                _this.editor.setViewState(e.pos);
            container.SideDocs.notify({
                type: "fileloaded",
                name: _this.editorFile.getName(),
                locale: pxt.Util.localeInfo()
            });
            if (_this.state.showBlocks && _this.editor == _this.textEditor)
                _this.textEditor.openBlocks();
        }).finally(function () {
            _this.forceUpdate();
            _this.updatingEditorFile = false;
            // if auto-run is not enable, restart the sim
            // otherwise, autorun will launch it again
            if (!_this.state.currFile.virtual && simRunning && !_this.state.autoRun)
                _this.startSimulator();
        });
    };
    /**
     * Sets the file that is currently being edited. Warning: Do not call
     * setFile() on any `.blocks` file directly. Instead, use openBlocks()
     * which will decompile if necessary.
     * @param fn
     */
    ProjectView.prototype.setFile = function (fn) {
        if (!fn)
            return;
        if (fn.name === "main.ts") {
            this.shouldTryDecompile = true;
        }
        var header = this.state.header;
        if (header) {
            var pkgId = fn.epkg && fn.epkg.getPkgId();
            if (pkgId === "this") {
                // Update the last-used editor if opening a user file
                if (this.isBlocksFile(fn.name)) {
                    header.editor = pxt.BLOCKS_PROJECT_NAME;
                    header.pubCurrent = false;
                }
                else if (this.isTypescriptFile(fn.name)) {
                    header.editor = pxt.JAVASCRIPT_PROJECT_NAME;
                    header.pubCurrent = false;
                }
            }
        }
        this.setState({
            currFile: fn,
            showBlocks: false,
            embedSimView: false
        });
        //this.fireResize();
    };
    ProjectView.prototype.setSideFile = function (fn) {
        var fileName = fn.name;
        var currFile = this.state.currFile.name;
        if (fileName != currFile && pkg.File.blocksFileNameRx.test(fileName)) {
            // Going from ts -> blocks
            pxt.tickEvent("sidebar.showBlocks");
            this.openBlocks();
        }
        else {
            if (this.isTextEditor() || this.isPxtJsonEditor()) {
                this.textEditor.giveFocusOnLoading = false;
            }
            this.setFile(fn);
        }
    };
    ProjectView.prototype.removeFile = function (fn, skipConfirm) {
        var _this = this;
        if (skipConfirm === void 0) { skipConfirm = false; }
        var removeIt = function () {
            pkg.mainEditorPkg().removeFileAsync(fn.name)
                .then(function () { return pkg.mainEditorPkg().saveFilesAsync(true); })
                .then(function () { return _this.reloadHeaderAsync(); })
                .done();
        };
        if (skipConfirm) {
            removeIt();
            return;
        }
        core.confirmAsync({
            header: lf("Remove {0}", fn.name),
            body: lf("You are about to remove a file from your project. You can't undo this. Are you sure?"),
            agreeClass: "red",
            agreeIcon: "trash",
            agreeLbl: lf("Remove it"),
        }).done(function (res) {
            if (res)
                removeIt();
        });
    };
    ProjectView.prototype.updateFileAsync = function (name, content, open) {
        var _this = this;
        var p = pkg.mainEditorPkg();
        p.setFile(name, content);
        return p.updateConfigAsync(function (cfg) { return cfg.files.indexOf(name) < 0 ? cfg.files.push(name) : 0; })
            .then(function () {
            if (open)
                _this.setFile(p.lookupFile("this/" + name));
            return p.savePkgAsync();
        })
            .then(function () { return _this.reloadHeaderAsync(); });
    };
    ProjectView.prototype.setSideMarkdown = function (md) {
        var sd = this.refs["sidedoc"];
        if (!sd)
            return;
        sd.setMarkdown(md);
    };
    ProjectView.prototype.setSideDoc = function (path, blocksEditor) {
        if (blocksEditor === void 0) { blocksEditor = true; }
        var sd = this.refs["sidedoc"];
        if (!sd)
            return;
        if (path) {
            sd.setPath(path, blocksEditor);
        }
        else
            sd.collapse();
    };
    ProjectView.prototype.setTutorialStep = function (step) {
        // save and typecheck
        this.typecheckNow();
        // Notify tutorial content pane
        var tc = this.refs["tutorialcard"];
        if (!tc)
            return;
        if (step > -1) {
            tc.setPopout();
            var tutorialOptions = this.state.tutorialOptions;
            tutorialOptions.tutorialStep = step;
            this.setState({ tutorialOptions: tutorialOptions });
            var fullscreen = tutorialOptions.tutorialStepInfo[step].fullscreen;
            if (fullscreen)
                this.showTutorialHint();
            else
                this.showLightbox();
            // Hide flyouts and popouts
            this.editor.closeFlyout();
        }
    };
    ProjectView.prototype.handleMessage = function (msg) {
        var _this = this;
        switch (msg.type) {
            case "popoutcomplete":
                this.setState({ sideDocsCollapsed: true, sideDocsLoadUrl: '' });
                break;
            case "tutorial":
                var t = msg;
                switch (t.subtype) {
                    case 'loaded':
                        var tt = msg;
                        if (tt.toolboxSubset && Object.keys(tt.toolboxSubset).length > 0) {
                            this.setState({
                                editorState: {
                                    searchBar: false,
                                    filters: { blocks: tt.toolboxSubset, defaultState: pxt.editor.FilterState.Hidden }
                                }
                            });
                            this.editor.filterToolbox(tt.toolboxSubset, tt.showCategories);
                        }
                        var tutorialOptions = this.state.tutorialOptions;
                        tutorialOptions.tutorialReady = true;
                        tutorialOptions.tutorialStepInfo = tt.stepInfo;
                        this.setState({ tutorialOptions: tutorialOptions });
                        var fullscreen = tutorialOptions.tutorialStepInfo[0].fullscreen;
                        if (fullscreen)
                            this.showTutorialHint();
                        else {
                            this.showLightbox();
                        }
                        core.hideLoading("tutorial");
                        break;
                    case 'error':
                        var te = msg;
                        pxt.reportException(te.message);
                        core.errorNotification(lf("We're having trouble loading this tutorial, please try again later."));
                        this.setState({ tutorialOptions: undefined });
                        // Delete the project created for this tutorial
                        var curr = pkg.mainEditorPkg().header;
                        curr.isDeleted = true;
                        workspace.saveAsync(curr, {})
                            .then(function () {
                            _this.openHome();
                        }).finally(function () { return core.hideLoading("tutorial"); });
                        break;
                }
                break;
        }
    };
    ///////////////////////////////////////////////////////////
    ////////////           Load header            /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.reloadHeaderAsync = function () {
        return this.loadHeaderAsync(this.state.header, this.state.editorState);
    };
    ProjectView.prototype.tryCheckTargetVersionAsync = function (targetVersion) {
        var _this = this;
        var htv = targetVersion || "0.0.0";
        // a legacy script does not have a version -- or has a major version less
        // than the current version
        var legacyProject = pxt.semver.majorCmp(htv, pxt.appTarget.versions.target) < 0;
        if (legacyProject)
            pxt.tickEvent("patch.load.legacy", { targetVersion: htv });
        // version check, you should not load a script from 1 major version above.
        if (pxt.semver.majorCmp(htv, pxt.appTarget.versions.target) > 0) {
            // the script is a major version ahead, need to redirect
            pxt.tickEvent("patch.load.future", { targetVersion: htv });
            var buttons = [];
            if (pxt.appTarget && pxt.appTarget.appTheme && pxt.appTarget.appTheme.homeUrl)
                buttons.push({
                    label: lf("Get latest"),
                    icon: "external alternate",
                    url: pxt.appTarget.appTheme.homeUrl
                });
            return core.dialogAsync({
                header: lf("Oops, this project is too new!"),
                body: lf("This project was created in a newer version of this editor. Please try again in that editor."),
                disagreeLbl: lf("Ok"),
                buttons: buttons
            })
                .then(function () { return _this.openHome(); });
        }
        return undefined;
    };
    ProjectView.prototype.loadHeaderAsync = function (h, editorState, inTutorial) {
        var _this = this;
        if (!h)
            return Promise.resolve();
        var checkAsync = this.tryCheckTargetVersionAsync(h.targetVersion);
        if (checkAsync)
            return checkAsync.then(function () { return _this.openHome(); });
        pxt.debug("loading " + h.id + " (pxt v" + h.targetVersion + ")");
        this.stopSimulator(true);
        if (pxt.appTarget.simulator && pxt.appTarget.simulator.aspectRatio)
            simulator.driver.preload(pxt.appTarget.simulator.aspectRatio);
        this.clearSerial();
        this.setState({ autoRun: true }); // always start simulator once at least
        // Merge current and new state but only if the new state members are undefined
        var oldEditorState = this.state.editorState;
        if (oldEditorState && editorState) {
            if (editorState.filters === undefined)
                editorState.filters = oldEditorState.filters;
            if (editorState.hasCategories === undefined)
                editorState.hasCategories = oldEditorState.hasCategories;
            if (editorState.searchBar === undefined)
                editorState.searchBar = oldEditorState.searchBar;
        }
        return (h.backupRef ? workspace.restoreFromBackupAsync(h) : Promise.resolve())
            .then(function () { return pkg.loadPkgAsync(h.id); })
            .then(function () {
            if (!_this.state || _this.state.header != h) {
                _this.showPackageErrorsOnNextTypecheck();
            }
            simulator.setDirty();
            return compiler.newProjectAsync();
        }).then(function () { return compiler.applyUpgradesAsync(); })
            .then(function () {
            var e = _this.settings.fileHistory.filter(function (e) { return e.id == h.id; })[0];
            var main = pkg.getEditorPkg(pkg.mainPkg);
            var file = main.getMainFile();
            if (e)
                file = main.lookupFile(e.name) || file;
            if ((!e && h.editor == pxt.JAVASCRIPT_PROJECT_NAME && !pkg.File.tsFileNameRx.test(file.getName()) && file.getVirtualFileName()))
                file = main.lookupFile("this/" + file.getVirtualFileName()) || file;
            if (pkg.File.blocksFileNameRx.test(file.getName()) && file.getVirtualFileName()) {
                if (!file.content)
                    file = main.lookupFile("this/" + file.getVirtualFileName()) || file;
            }
            if (file.name === "main.ts") {
                _this.shouldTryDecompile = true;
            }
            _this.setState({
                home: false,
                showFiles: h.githubId ? true : false,
                editorState: editorState,
                tutorialOptions: inTutorial ? _this.state.tutorialOptions : undefined,
                header: h,
                projectName: h.name,
                currFile: file,
                sideDocsLoadUrl: '',
                debugging: false
            });
            pkg.getEditorPkg(pkg.mainPkg).onupdate = function () {
                _this.loadHeaderAsync(h, _this.state.editorState).done();
            };
            pkg.mainPkg.getCompileOptionsAsync()
                .catch(function (e) {
                if (e instanceof pxt.cpp.PkgConflictError) {
                    var confl = e;
                    var remove = function (lib) { return ({
                        label: lf("Remove {0}", lib.id),
                        class: "pink",
                        icon: "trash",
                        onclick: function () {
                            core.showLoading("removedep", lf("Removing {0}...", lib.id));
                            pkg.mainEditorPkg().removeDepAsync(lib.id)
                                .then(function () { return _this.reloadHeaderAsync(); })
                                .finally(function () { return core.hideLoading("removedep"); });
                        }
                    }); };
                    core.dialogAsync({
                        hideCancel: true,
                        buttons: [
                            remove(confl.pkg1),
                            remove(confl.pkg0)
                        ],
                        header: lf("Extensions cannot be used together"),
                        body: lf("Extensions '{0}' and '{1}' cannot be used together, because they use incompatible settings ({2}).", confl.pkg1.id, confl.pkg0.id, confl.settingName)
                    });
                }
            })
                .done();
            var preferredEditor = _this.pickEditorFor(file);
            var readme = main.lookupFile("this/README.md");
            // no auto-popup when editing packages locally
            if (!h.githubId && readme && readme.content && readme.content.trim())
                _this.setSideMarkdown(readme.content);
            else if (pkg.mainPkg && pkg.mainPkg.config && pkg.mainPkg.config.documentation)
                _this.setSideDoc(pkg.mainPkg.config.documentation, preferredEditor == _this.blocksEditor);
            // update recentUse on the header
            return workspace.saveAsync(h);
        }).finally(function () {
            // Editor is loaded
            pxt.BrowserUtils.changeHash("#editor", true);
            document.getElementById("root").focus(); // Clear the focus.
            _this.editorLoaded();
        });
    };
    ProjectView.prototype.removeProject = function () {
        var _this = this;
        if (!pkg.mainEditorPkg().header)
            return;
        core.confirmDelete(pkg.mainEditorPkg().header.name, function () {
            var curr = pkg.mainEditorPkg().header;
            curr.isDeleted = true;
            return workspace.saveAsync(curr, {})
                .then(function () { return _this.openHome(); });
        });
    };
    ProjectView.prototype.isHexFile = function (filename) {
        return /\.(hex|uf2)$/i.test(filename);
    };
    ProjectView.prototype.isBlocksFile = function (filename) {
        return /\.blocks$/i.test(filename);
    };
    ProjectView.prototype.isTypescriptFile = function (filename) {
        return /\.ts$/i.test(filename);
    };
    ProjectView.prototype.isProjectFile = function (filename) {
        return /\.(pxt|mkcd|mkcd-\w+)$/i.test(filename);
    };
    ProjectView.prototype.isPNGFile = function (filename) {
        return pxt.appTarget.compile.saveAsPNG && /\.png$/i.test(filename);
    };
    ProjectView.prototype.isAssetFile = function (filename) {
        var exts = pxt.appTarget.runtime ? pxt.appTarget.runtime.assetExtensions : null;
        if (exts) {
            var ext = filename.replace(/.*\./, "").toLowerCase();
            return exts.indexOf(ext) >= 0;
        }
        return false;
    };
    ProjectView.prototype.importProjectCoreAsync = function (buf) {
        var _this = this;
        return (buf[0] == '{'.charCodeAt(0) ?
            Promise.resolve(pxt.U.uint8ArrayToString(buf)) :
            pxt.lzmaDecompressAsync(buf))
            .then(function (contents) {
            var data = JSON.parse(contents);
            _this.importHex(data);
        }).catch(function (e) {
            core.warningNotification(lf("Sorry, we could not import this project."));
            _this.openHome();
        });
    };
    ProjectView.prototype.importHexFile = function (file) {
        var _this = this;
        if (!file)
            return;
        pxt.cpp.unpackSourceFromHexFileAsync(file)
            .done(function (data) { return _this.importHex(data); });
    };
    ProjectView.prototype.importBlocksFiles = function (file) {
        var _this = this;
        if (!file)
            return;
        ts.pxtc.Util.fileReadAsTextAsync(file)
            .done(function (contents) {
            _this.newProject({
                filesOverride: { "main.blocks": contents, "main.ts": "  " },
                name: file.name.replace(/\.blocks$/i, '') || lf("Untitled")
            });
        });
    };
    ProjectView.prototype.importTypescriptFile = function (file) {
        var _this = this;
        if (!file)
            return;
        ts.pxtc.Util.fileReadAsTextAsync(file)
            .done(function (contents) {
            _this.newProject({
                filesOverride: { "main.blocks": '', "main.ts": contents || "  " },
                name: file.name.replace(/\.ts$/i, '') || lf("Untitled")
            });
        });
    };
    ProjectView.prototype.importProjectFile = function (file) {
        var _this = this;
        if (!file)
            return;
        ts.pxtc.Util.fileReadAsBufferAsync(file)
            .then(function (buf) { return _this.importProjectCoreAsync(buf); });
    };
    ProjectView.prototype.importPNGFile = function (file) {
        var _this = this;
        if (!file)
            return;
        ts.pxtc.Util.fileReadAsBufferAsync(file)
            .then(function (buf) { return screenshot.decodeBlobAsync("data:image/png;base64," +
            btoa(pxt.Util.uint8ArrayToString(buf))); })
            .then(function (buf) { return _this.importProjectCoreAsync(buf); });
    };
    ProjectView.prototype.importAssetFile = function (file) {
        ts.pxtc.Util.fileReadAsBufferAsync(file)
            .then(function (buf) {
            var basename = file.name.replace(/.*[\/\\]/, "");
            return pkg.mainEditorPkg().saveAssetAsync(basename, buf);
        })
            .done();
    };
    ProjectView.prototype.importHex = function (data, createNewIfFailed) {
        var _this = this;
        if (createNewIfFailed === void 0) { createNewIfFailed = false; }
        var targetId = pxt.appTarget.id;
        if (!data || !data.meta) {
            if (data && data[pxt.CONFIG_NAME]) {
                data = cloudsync.reconstructMeta(data);
            }
            else {
                core.warningNotification(lf("Sorry, we could not recognize this file."));
                if (createNewIfFailed)
                    this.openHome();
                return;
            }
        }
        if (typeof data.source == "object") {
            data.source = JSON.stringify(data.source);
        }
        // intercept newer files early
        if (this.hexFileImporters.some(function (fi) { return fi.id == "default" && fi.canImport(data); })) {
            var checkAsync = this.tryCheckTargetVersionAsync(data.meta.targetVersions && data.meta.targetVersions.target);
            if (checkAsync) {
                checkAsync.done(function () {
                    if (createNewIfFailed)
                        _this.newProject();
                });
                return;
            }
        }
        var importer = this.hexFileImporters.filter(function (fi) { return fi.canImport(data); })[0];
        if (importer) {
            pxt.tickEvent("import." + importer.id);
            core.hideDialog();
            core.showLoading("importhex", lf("loading project..."));
            importer.importAsync(this, data)
                .done(function () { return core.hideLoading("importhex"); }, function (e) {
                pxt.reportException(e, { importer: importer.id });
                core.hideLoading("importhex");
                core.errorNotification(lf("Oops, something went wrong when importing your project"));
                if (createNewIfFailed)
                    _this.openHome();
            });
        }
        else {
            core.warningNotification(lf("Sorry, we could not import this project."));
            pxt.tickEvent("warning.importfailed");
            if (createNewIfFailed)
                this.openHome();
        }
    };
    ProjectView.prototype.importProjectAsync = function (project, editorState) {
        var _this = this;
        var h = project.header;
        if (!h) {
            h = {
                target: pxt.appTarget.id,
                targetVersion: undefined,
                editor: pxt.BLOCKS_PROJECT_NAME,
                name: lf("Untitled"),
                meta: {},
                pubId: "",
                pubCurrent: false
            };
        }
        return workspace.installAsync(h, project.text)
            .then(function (hd) { return _this.loadHeaderAsync(hd, editorState); });
    };
    ProjectView.prototype.initDragAndDrop = function () {
        var _this = this;
        draganddrop.setupDragAndDrop(document.body, function (file) { return file.size < 1000000 && _this.isHexFile(file.name) || _this.isBlocksFile(file.name); }, function (files) {
            if (files) {
                pxt.tickEvent("dragandrop.open");
                _this.importFile(files[0]);
            }
        });
    };
    ProjectView.prototype.importFile = function (file) {
        if (!file || pxt.shell.isReadOnly())
            return;
        if (this.isHexFile(file.name)) {
            this.importHexFile(file);
        }
        else if (this.isBlocksFile(file.name)) {
            this.importBlocksFiles(file);
        }
        else if (this.isTypescriptFile(file.name)) {
            this.importTypescriptFile(file);
        }
        else if (this.isProjectFile(file.name)) {
            this.importProjectFile(file);
        }
        else if (this.isAssetFile(file.name)) {
            // assets need to go before PNG source import below, since target might want PNG assets
            this.importAssetFile(file);
        }
        else if (this.isPNGFile(file.name)) {
            this.importPNGFile(file);
        }
        else {
            var importer = this.resourceImporters.filter(function (fi) { return fi.canImport(file); })[0];
            if (importer) {
                importer.importAsync(this, file).done();
            }
            else {
                core.warningNotification(lf("Oops, don't know how to load this file!"));
            }
        }
    };
    ProjectView.prototype.importProjectFromFileAsync = function (buf) {
        var _this = this;
        return pxt.lzmaDecompressAsync(buf)
            .then(function (project) {
            var hexFile = JSON.parse(project);
            return _this.importHex(hexFile);
        }).catch(function () {
            return _this.newProject();
        });
    };
    ///////////////////////////////////////////////////////////
    ////////////           Export                 /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.exportProjectToFileAsync = function () {
        var mpkg = pkg.mainPkg;
        return mpkg.compressToFileAsync(this.getPreferredEditor());
    };
    ProjectView.prototype.exportAsync = function () {
        pxt.debug("exporting project");
        return this.exportProjectToFileAsync()
            .then(function (buf) {
            return ts.pxtc.encodeBase64(Util.uint8ArrayToString(buf));
        });
    };
    ProjectView.prototype.downloadScreenshotAsync = function () {
        if (pxt.appTarget.compile.saveAsPNG)
            return this.saveProjectAsPNGAsync(false);
        else
            return this.requestScreenshotAsync()
                .then(function (img) { return pxt.BrowserUtils.browserDownloadDataUri(img, pkg.genFileName(".png")); });
    };
    ProjectView.prototype.pushScreenshotHandler = function (handler) {
        this.screenshotHandlers.push(handler);
    };
    ProjectView.prototype.popScreenshotHandler = function () {
        this.screenshotHandlers.pop();
    };
    ProjectView.prototype.requestScreenshotAsync = function () {
        var _this = this;
        if (this.requestScreenshotPromise)
            return this.requestScreenshotPromise;
        // make sure simulator is ready
        this.setState({ screenshoting: true });
        simulator.driver.postMessage({ type: "screenshot" });
        return this.requestScreenshotPromise = new Promise(function (resolve, reject) {
            _this.pushScreenshotHandler(function (msg) { return resolve(pxt.BrowserUtils.imageDataToPNG(msg.data)); });
        }).timeout(1000) // simulator might be stopped or in bad shape
            .catch(function (e) {
            pxt.tickEvent('screenshot.timeout');
            return undefined;
        })
            .finally(function () {
            _this.popScreenshotHandler();
            _this.requestScreenshotPromise = undefined;
            _this.setState({ screenshoting: false });
        });
    };
    ProjectView.prototype.encodeProjectAsPNGAsync = function (sc, showDialog) {
        var _this = this;
        return this.exportProjectToFileAsync()
            .then(function (blob) { return screenshot.encodeBlobAsync(_this.state.header.name, sc, blob); })
            .then(function (img) {
            var fn = pkg.genFileName(".png");
            pxt.BrowserUtils.browserDownloadDataUri(img, fn);
            if (!showDialog)
                return Promise.resolve();
            return core.dialogAsync({
                header: lf("Project Saved!"),
                disagreeLbl: lf("Got it!"),
                disagreeClass: "green",
                hasCloseIcon: false,
                jsx: React.createElement("div", { className: "ui items" },
                    React.createElement("div", { className: "item" },
                        React.createElement("div", { className: "ui small image" },
                            React.createElement("a", { download: fn, className: "ui link", href: img },
                                React.createElement("img", { src: img, alt: lf("Project cartridge"), title: lf("Click to download again") }))),
                        React.createElement("div", { className: "content" },
                            React.createElement("div", { className: "description" },
                                React.createElement("p", null,
                                    lf("Your project is saved in this image."),
                                    lf("Import or drag it into the editor to reload it."))))))
            });
        });
    };
    ProjectView.prototype.saveProjectAsPNGAsync = function (showDialog) {
        var _this = this;
        return this.requestScreenshotAsync()
            .then(function (img) { return _this.encodeProjectAsPNGAsync(img, showDialog); });
    };
    ProjectView.prototype.saveProjectToFileAsync = function () {
        var mpkg = pkg.mainPkg;
        if (saveAsBlocks()) {
            pxt.BrowserUtils.browserDownloadText(mpkg.readFile("main.blocks"), pkg.genFileName(".blocks"), 'application/xml');
            return Promise.resolve();
            ;
        }
        if (pxt.commands.saveProjectAsync) {
            core.infoNotification(lf("Saving..."));
            return mpkg.saveToJsonAsync(this.getPreferredEditor())
                .then(function (project) { return pxt.commands.saveProjectAsync(project); });
        }
        if (pxt.appTarget.compile.saveAsPNG)
            return this.saveProjectAsPNGAsync(true);
        else
            return this.exportProjectToFileAsync()
                .then(function (buf) {
                var fn = pkg.genFileName(".mkcd");
                pxt.BrowserUtils.browserDownloadUInt8Array(buf, fn, 'application/octet-stream');
            });
    };
    ProjectView.prototype.commitAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var repo, info, commitId, prURL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 10, 11]);
                        repo = this.state.header.githubId;
                        return [4 /*yield*/, dialogs.showCommitDialogAsync(repo)];
                    case 1:
                        info = _a.sent();
                        if (!info)
                            return [2 /*return*/];
                        return [4 /*yield*/, workspace.commitAsync(this.state.header, info.msg)];
                    case 2:
                        commitId = _a.sent();
                        if (!commitId) return [3 /*break*/, 6];
                        return [4 /*yield*/, workspace.prAsync(this.state.header, commitId, info.msg)];
                    case 3:
                        prURL = _a.sent();
                        return [4 /*yield*/, dialogs.showPRDialogAsync(repo, prURL)
                            // when the dialog finishes, we pull again - it's possible the user
                            // has resolved the conflict in the meantime
                        ];
                    case 4:
                        _a.sent();
                        // when the dialog finishes, we pull again - it's possible the user
                        // has resolved the conflict in the meantime
                        return [4 /*yield*/, workspace.pullAsync(this.state.header)
                            // skip bump in this case - we don't know if it was merged
                        ];
                    case 5:
                        // when the dialog finishes, we pull again - it's possible the user
                        // has resolved the conflict in the meantime
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!info.bump) return [3 /*break*/, 8];
                        return [4 /*yield*/, workspace.bumpAsync(this.state.header)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [4 /*yield*/, this.reloadHeaderAsync()];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        core.hideLoading("loadingheader");
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    ProjectView.prototype.pushPullAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var needsHide, status_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        core.showLoading("loadingheader", lf("syncing with github..."));
                        needsHide = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 9, 10]);
                        return [4 /*yield*/, workspace.pullAsync(this.state.header)
                                .catch(core.handleNetworkError)];
                    case 2:
                        status_1 = _b.sent();
                        _a = status_1;
                        switch (_a) {
                            case workspace.PullStatus.NoSourceControl: return [3 /*break*/, 3];
                            case workspace.PullStatus.UpToDate: return [3 /*break*/, 3];
                            case workspace.PullStatus.NeedsCommit: return [3 /*break*/, 4];
                            case workspace.PullStatus.GotChanges: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 8];
                    case 3: return [3 /*break*/, 8];
                    case 4:
                        needsHide = false;
                        return [4 /*yield*/, this.commitAsync()];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.reloadHeaderAsync()];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        if (needsHide)
                            core.hideLoading("loadingheader");
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ///////////////////////////////////////////////////////////
    ////////////             Home                 /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.openHome = function () {
        var hasHome = !pxt.shell.isControllerMode();
        if (!hasHome)
            return;
        this.stopSimulator(true); // don't keep simulator around
        if (this.editor)
            this.editor.unloadFileAsync();
        // clear the hash
        pxt.BrowserUtils.changeHash("", true);
        this.setState({ home: true, tracing: undefined, fullscreen: undefined, tutorialOptions: undefined, editorState: undefined });
        this.allEditors.forEach(function (e) { return e.setVisible(false); });
        this.homeLoaded();
        this.showPackageErrorsOnNextTypecheck();
        workspace.syncAsync().done();
    };
    ProjectView.prototype.homeLoaded = function () {
        pxt.tickEvent('app.home');
    };
    ProjectView.prototype.editorLoaded = function () {
        pxt.tickEvent('app.editor');
    };
    ProjectView.prototype.reloadEditor = function () {
        if (this.state.home)
            location.hash = "#reload";
        location.reload();
    };
    ProjectView.prototype.getPreferredEditor = function () {
        return this.editor == this.blocksEditor ? pxt.BLOCKS_PROJECT_NAME : pxt.JAVASCRIPT_PROJECT_NAME;
    };
    ///////////////////////////////////////////////////////////
    ////////////           Extentions             /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.openExtension = function (extension, url, consentRequired) {
        pxt.tickEvent("app.openextension", { extension: extension });
        this.extensions.showExtension(extension, url, consentRequired);
    };
    ProjectView.prototype.handleExtensionRequest = function (request) {
        this.extensions.handleExtensionRequest(request);
    };
    ///////////////////////////////////////////////////////////
    ////////////           Workspace              /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.newEmptyProject = function (name, documentation) {
        this.newProject({
            filesOverride: { "main.blocks": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"></xml>" },
            name: name,
            documentation: documentation
        });
    };
    ProjectView.prototype.newProject = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        pxt.tickEvent("app.newproject");
        core.showLoading("newproject", lf("creating new project..."));
        this.createProjectAsync(options)
            .then(function () { return _this.autoChooseBoardAsync(); })
            .then(function () { return Promise.delay(500); })
            .finally(function () { return core.hideLoading("newproject"); });
    };
    ProjectView.prototype.createProjectAsync = function (options) {
        var _this = this;
        this.setSideDoc(undefined);
        if (!options.prj)
            options.prj = pxt.appTarget.blocksprj;
        var cfg = pxt.U.clone(options.prj.config);
        cfg.name = options.name || lf("Untitled");
        cfg.documentation = options.documentation;
        var files = Util.clone(options.prj.files);
        if (options.filesOverride)
            Util.jsonCopyFrom(files, options.filesOverride);
        if (options.dependencies)
            Util.jsonMergeFrom(cfg.dependencies, options.dependencies);
        if (options.tsOnly) {
            cfg.files = cfg.files.filter(function (f) { return f != "main.blocks"; });
            delete files["main.blocks"];
        }
        files["pxt.json"] = JSON.stringify(cfg, null, 4) + "\n";
        return workspace.installAsync({
            name: cfg.name,
            meta: {},
            editor: options.prj.id,
            pubId: "",
            pubCurrent: false,
            target: pxt.appTarget.id,
            targetVersion: pxt.appTarget.versions.target,
            temporary: options.temporary
        }, files)
            .then(function (hd) { return _this.loadHeaderAsync(hd, { filters: options.filters }, options.inTutorial); });
    };
    // in multiboard targets, allow use to pick a different board
    // after the project is loaded
    // this could be done prior to the project creation too
    ProjectView.prototype.autoChooseBoardAsync = function (features) {
        if (pxt.appTarget.appTheme.chooseBoardOnNewProject
            && pxt.appTarget.simulator
            && !!pxt.appTarget.simulator.dynamicBoardDefinition)
            return this.showBoardDialogAsync(features, false);
        return Promise.resolve();
    };
    ProjectView.prototype.importExampleAsync = function (options) {
        var _this = this;
        var name = options.name, path = options.path, loadBlocks = options.loadBlocks, prj = options.prj;
        core.showLoading("changingcode", lf("loading..."));
        var features;
        return pxt.gallery.loadExampleAsync(name.toLowerCase(), path)
            .then(function (example) {
            if (!example)
                return Promise.resolve();
            var opts = example;
            if (prj)
                opts.prj = prj;
            features = example.features;
            if (loadBlocks) {
                return _this.createProjectAsync(opts)
                    .then(function () {
                    return compiler.getBlocksAsync()
                        .then(function (blocksInfo) { return compiler.decompileAsync("main.ts", blocksInfo); })
                        .then(function (resp) {
                        pxt.debug("example decompilation: " + resp.success);
                        if (resp.success) {
                            _this.overrideBlocksFile(resp.outfiles["main.blocks"]);
                        }
                    });
                });
            }
            else {
                opts.tsOnly = true;
                return _this.createProjectAsync(opts)
                    .then(function () { return Promise.delay(500); });
            }
        })
            .then(function () { return _this.autoChooseBoardAsync(features); })
            .finally(function () { return core.hideLoading("changingcode"); });
    };
    ProjectView.prototype.switchTypeScript = function () {
        var mainPkg = pkg.mainEditorPkg();
        var tsName = this.editorFile.getVirtualFileName();
        var f = mainPkg.files[tsName];
        this.setFile(f);
    };
    ProjectView.prototype.saveBlocksToTypeScriptAsync = function () {
        return this.blocksEditor.saveToTypeScript();
    };
    ProjectView.prototype.saveTypeScriptAsync = function (open) {
        var _this = this;
        if (open === void 0) { open = false; }
        if (!this.editor || !this.state.currFile || this.editorFile.epkg != pkg.mainEditorPkg() || this.reload)
            return Promise.resolve();
        var promise = Promise.resolve().then(function () {
            return open ? _this.textEditor.loadMonacoAsync() : Promise.resolve();
        }).then(function () {
            return _this.editor.saveToTypeScript().then(function (src) {
                if (!src)
                    return Promise.resolve();
                // format before saving
                // if (open) src = pxtc.format(src, 0).formatted;
                var mainPkg = pkg.mainEditorPkg();
                var tsName = _this.editorFile.getVirtualFileName();
                Util.assert(tsName != _this.editorFile.name);
                return mainPkg.setContentAsync(tsName, src).then(function () {
                    if (open) {
                        var f = mainPkg.files[tsName];
                        _this.setFile(f);
                    }
                });
            });
        });
        if (open) {
            return core.showLoadingAsync("switchtojs", lf("switching to JavaScript..."), promise, 0);
        }
        else {
            return promise;
        }
    };
    ProjectView.prototype.resetWorkspace = function () {
        var _this = this;
        this.reload = true;
        window.location.hash = "#reload";
        return workspace.resetAsync()
            .done(function () { return _this.reloadEditor(); }, function () { return _this.reloadEditor(); });
    };
    ProjectView.prototype.pair = function () {
        var prePairAsync = pxt.commands.webUsbPairDialogAsync
            ? pxt.commands.webUsbPairDialogAsync(core.confirmAsync)
            : Promise.resolve(1);
        return prePairAsync.then(function (res) {
            if (res) {
                return pxt.usb.pairAsync()
                    .then(function () {
                    core.infoNotification(lf("Device paired! Try downloading now."));
                }, function (err) {
                    core.errorNotification(lf("Failed to pair the device: {0}", err.message));
                });
            }
            return Promise.resolve();
        });
    };
    ///////////////////////////////////////////////////////////
    ////////////             Compile              /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.saveAndCompile = function () {
        var _this = this;
        if (!this.state.header)
            return undefined;
        this.setState({ isSaving: true });
        return (this.state.projectName !== lf("Untitled")
            ? Promise.resolve(true) : this.showRenameProjectDialogAsync())
            .then(function (success) {
            if (!success) {
                // User cancelled
                _this.setState({ isSaving: false });
                return Promise.resolve();
            }
            return _this.saveProjectNameAsync()
                .then(function () { return _this.saveFileAsync(); })
                .then(function () {
                if (!pxt.appTarget.compile.hasHex || pxt.appTarget.compile.useMkcd || pxt.appTarget.compile.saveAsPNG || saveAsBlocks()) {
                    _this.saveProjectToFileAsync()
                        .finally(function () {
                        _this.setState({ isSaving: false });
                    })
                        .done();
                }
                else {
                    _this.compile(true);
                }
            });
        });
    };
    ProjectView.prototype.checkForHwVariant = function () {
        var _this = this;
        if (pxt.hwVariant || !pxt.hasHwVariants())
            return false; // already set
        var variants = pxt.getHwVariants();
        if (variants.length == 0)
            return false;
        var pairAsync = function () { return cmds.showWebUSBPairingInstructionsAsync(null)
            .then(function () {
            _this.checkForHwVariant();
        }, function (err) {
            _this.checkWebUSBVariant = false;
            _this.checkForHwVariant();
        }); };
        if (pxt.usb.isEnabled && this.checkWebUSBVariant) {
            hidbridge.initAsync(true)
                .then(function (wr) {
                if (wr.familyID) {
                    for (var _i = 0, variants_1 = variants; _i < variants_1.length; _i++) {
                        var v = variants_1[_i];
                        var compile = pxt.U.clone(pxt.appTarget.compile);
                        if (v.compileServiceVariant) {
                            var c2 = pxt.appTarget.variants[v.compileServiceVariant];
                            if (c2.compile)
                                pxt.U.jsonCopyFrom(compile, c2.compile);
                        }
                        if (parseInt(compile.uf2Family) === wr.familyID) {
                            pxt.setHwVariant(v.name);
                            _this.reloadHeaderAsync()
                                .then(function () { return _this.compile(); });
                            return;
                        }
                    }
                }
                _this.checkWebUSBVariant = false;
                _this.checkForHwVariant();
            }, pairAsync);
            return true;
        }
        this.showChooseHwDialog();
        return true;
    };
    ProjectView.prototype.beforeCompile = function () { };
    ProjectView.prototype.compile = function (saveOnly) {
        var _this = this;
        if (saveOnly === void 0) { saveOnly = false; }
        pxt.tickEvent("compile");
        pxt.debug('compiling...');
        if (this.checkForHwVariant())
            return;
        if (pxt.appTarget.compile.saveAsPNG && pxt.hasHwVariants() && !pxt.hwVariant) {
            this.saveAndCompile();
            return;
        }
        this.beforeCompile();
        var userContextWindow = undefined;
        if (!pxt.appTarget.compile.useModulator && pxt.BrowserUtils.isBrowserDownloadInSameWindow() && !pxt.BrowserUtils.isBrowserDownloadWithinUserContext())
            userContextWindow = window.open("");
        if (this.state.compiling) {
            pxt.tickEvent("compile.double");
            return;
        }
        var simRestart = this.state.simState != pxt.editor.SimState.Stopped;
        this.setState({ compiling: true });
        this.clearSerial();
        this.editor.beforeCompile();
        if (simRestart)
            this.stopSimulator();
        var state = this.editor.snapshotState();
        compiler.compileAsync({ native: true, forceEmit: true, preferredEditor: this.getPreferredEditor() })
            .then(function (resp) {
            _this.editor.setDiagnostics(_this.editorFile, state);
            var fn = pxt.outputName();
            if (!resp.outfiles[fn]) {
                pxt.tickEvent("compile.noemit");
                core.warningNotification(lf("Compilation failed, please check your code for errors."));
                return Promise.resolve(null);
            }
            resp.saveOnly = saveOnly;
            resp.userContextWindow = userContextWindow;
            resp.downloadFileBaseName = pkg.genFileName("");
            resp.confirmAsync = core.confirmAsync;
            var h = _this.state.header;
            if (h)
                resp.headerId = h.id;
            if (pxt.commands.patchCompileResultAsync)
                return pxt.commands.patchCompileResultAsync(resp).then(function () { return resp; });
            else
                return resp;
        }).then(function (resp) {
            if (!resp)
                return Promise.resolve();
            if (saveOnly) {
                return pxt.commands.saveOnlyAsync(resp);
            }
            if (!resp.success) {
                if (!_this.maybeShowPackageErrors(true)) {
                    core.confirmAsync({
                        header: lf("Compilation failed"),
                        body: lf("Ooops, looks like there are errors in your program."),
                        hideAgree: true,
                        disagreeLbl: lf("Close")
                    });
                }
            }
            return pxt.commands.deployCoreAsync(resp, {
                reportDeviceNotFoundAsync: function (docPath, compileResult) { return _this.showDeviceNotFoundDialogAsync(docPath, compileResult); },
                reportError: function (e) { return core.errorNotification(e); },
                showNotification: function (msg) { return core.infoNotification(msg); }
            })
                .catch(function (e) {
                if (e.notifyUser) {
                    core.warningNotification(e.message);
                }
                else {
                    var errorText = pxt.appTarget.appTheme.useUploadMessage ? lf("Upload failed, please try again.") : lf("Download failed, please try again.");
                    core.warningNotification(errorText);
                }
                pxt.reportException(e);
                if (userContextWindow)
                    try {
                        userContextWindow.close();
                    }
                    catch (e) { }
            });
        }).catch(function (e) {
            pxt.reportException(e);
            core.errorNotification(lf("Compilation failed, please contact support."));
            if (userContextWindow)
                try {
                    userContextWindow.close();
                }
                catch (e) { }
        }).finally(function () {
            _this.setState({ compiling: false, isSaving: false });
            if (simRestart)
                _this.runSimulator();
        })
            .done();
    };
    ProjectView.prototype.showDeviceNotFoundDialogAsync = function (docPath, resp) {
        pxt.tickEvent("compile.devicenotfound");
        var ext = pxt.outputName().replace(/[^.]*/, "");
        var fn = pkg.genFileName(ext);
        return core.dialogAsync({
            header: lf("Oops, we couldn't find your {0}", pxt.appTarget.appTheme.boardName),
            body: lf("Please make sure your {0} is connected and try again.", pxt.appTarget.appTheme.boardName),
            buttons: [
                {
                    label: lf("Troubleshoot"),
                    className: "focused",
                    icon: "help",
                    url: docPath,
                    onclick: function () {
                        pxt.tickEvent("compile.devicenotfound.troubleshoot");
                    }
                },
                resp ? {
                    label: fn,
                    icon: "download",
                    className: "lightgrey",
                    onclick: function () {
                        pxt.tickEvent("compile.devicenotfound.download");
                        return pxt.commands.saveOnlyAsync(resp);
                    }
                } : undefined
            ],
            hideCancel: true,
            hasCloseIcon: true
        });
    };
    ProjectView.prototype.overrideTypescriptFile = function (text) {
        if (this.textEditor)
            this.textEditor.overrideFile(text);
    };
    ProjectView.prototype.overrideBlocksFile = function (text) {
        if (this.blocksEditor)
            this.blocksEditor.overrideFile(text);
    };
    ///////////////////////////////////////////////////////////
    ////////////             Simulator            /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.startStopSimulator = function (clickTrigger) {
        switch (this.state.simState) {
            case pxt.editor.SimState.Starting:
                // button smashing, do nothing
                break;
            case pxt.editor.SimState.Running:
                this.stopSimulator(false, clickTrigger);
                break;
            default:
                this.maybeShowPackageErrors(true);
                this.startSimulator(undefined, clickTrigger);
                break;
        }
    };
    ProjectView.prototype.toggleTrace = function (intervalSpeed) {
        if (this.state.tracing) {
            this.editor.clearHighlightedStatements();
            simulator.setTraceInterval(0);
        }
        else {
            simulator.setTraceInterval(intervalSpeed != undefined ? intervalSpeed : simulator.SLOW_TRACE_INTERVAL);
        }
        this.setState({ tracing: !this.state.tracing });
        this.restartSimulator();
    };
    ProjectView.prototype.setTrace = function (enabled, intervalSpeed) {
        if (this.state.tracing !== enabled) {
            this.toggleTrace(intervalSpeed);
        }
        else if (this.state.tracing) {
            simulator.setTraceInterval(intervalSpeed != undefined ? intervalSpeed : simulator.SLOW_TRACE_INTERVAL);
            this.restartSimulator();
        }
    };
    ProjectView.prototype.proxySimulatorMessage = function (content) {
        simulator.proxy({
            type: "custom",
            content: content
        });
    };
    ProjectView.prototype.toggleSimulatorCollapse = function () {
        var state = this.state;
        if (state.simState == pxt.editor.SimState.Stopped && state.collapseEditorTools)
            this.startStopSimulator();
        if (state.collapseEditorTools) {
            this.expandSimulator();
        }
        else {
            this.collapseSimulator();
        }
    };
    ProjectView.prototype.expandSimulator = function () {
        if (pxt.appTarget.simulator.headless) {
            simulator.unhide();
        }
        else {
            this.startSimulator();
        }
        this.setState({ collapseEditorTools: false });
    };
    ProjectView.prototype.collapseSimulator = function () {
        var _this = this;
        simulator.hide(function () {
            _this.setState({ collapseEditorTools: true });
        });
    };
    ProjectView.prototype.toggleSimulatorFullscreen = function () {
        if (!this.state.fullscreen) {
            document.addEventListener('keydown', this.closeOnEscape);
        }
        else {
            document.removeEventListener('keydown', this.closeOnEscape);
        }
        this.closeFlyout();
        this.setState({ fullscreen: !this.state.fullscreen });
    };
    ProjectView.prototype.closeFlyout = function () {
        this.editor.closeFlyout();
    };
    ProjectView.prototype.toggleMute = function () {
        simulator.mute(!this.state.mute);
        this.setState({ mute: !this.state.mute });
    };
    ProjectView.prototype.openInstructions = function () {
        var _this = this;
        var running = this.state.simState != pxt.editor.SimState.Stopped;
        if (running)
            this.stopSimulator();
        make.makeAsync()
            .finally(function () {
            if (running)
                _this.startSimulator();
        });
    };
    ProjectView.prototype.printCode = function () {
        var p = pkg.mainEditorPkg();
        var files = p.getAllFiles();
        // render in sidedocs
        var docsUrl = pxt.webConfig.docsUrl || '/--docs';
        var mode = theEditor.isBlocksActive() ? "blocks" : "typescript";
        window.localStorage["printjob"] = JSON.stringify(files);
        var url = docsUrl + "#print:job:" + mode + ":" + pxt.Util.localeInfo();
        core.dialogAsync({
            header: lf("Print Code"),
            hasCloseIcon: true,
            hideCancel: true,
            size: "large",
            jsx: 
            /* tslint:disable:react-iframe-missing-sandbox */
            React.createElement("div", { className: "ui container" },
                React.createElement("div", { id: "printcontainer", style: { 'position': 'relative', 'height': 0, 'paddingBottom': '40%', 'overflow': 'hidden' } },
                    React.createElement("iframe", { frameBorder: "0", sandbox: "allow-popups allow-forms allow-scripts allow-same-origin allow-modals", style: { 'position': 'absolute', 'top': 0, 'left': 0, 'width': '100%', 'height': '100%' }, src: url })))
            /* tslint:enable:react-iframe-missing-sandbox */
        }).done(function (r) {
        });
    };
    ProjectView.prototype.clearSerial = function () {
        this.serialEditor.clear();
        var simIndicator = this.refs["simIndicator"];
        var devIndicator = this.refs["devIndicator"];
        if (simIndicator)
            simIndicator.clear();
        if (devIndicator)
            devIndicator.clear();
    };
    ProjectView.prototype.shouldStartSimulator = function () {
        switch (this.state.simState) {
            case pxt.editor.SimState.Starting:
            case pxt.editor.SimState.Running:
                return false; // already reunning
        }
        var hasHome = !pxt.shell.isControllerMode();
        if (!hasHome)
            return true;
        return !this.state.home;
    };
    ProjectView.prototype.isSimulatorRunning = function () {
        return this.state.simState == pxt.editor.SimState.Running;
    };
    ProjectView.prototype.restartSimulator = function (debug) {
        if (this.state.simState == pxt.editor.SimState.Stopped
            || simulator.driver.isDebug() != !!debug)
            this.startSimulator(debug);
        else {
            simulator.driver.restart(); // fast restart
        }
    };
    ProjectView.prototype.startSimulator = function (debug, clickTrigger) {
        var _this = this;
        pxt.tickEvent('simulator.start');
        pxt.debug("start sim (autorun " + this.state.autoRun + ")");
        if (!this.shouldStartSimulator()) {
            pxt.log("Ignoring call to start simulator, either already running or we shouldn't start.");
            return Promise.resolve();
        }
        return this.saveFileAsync()
            .then(function () { return _this.runSimulator({ debug: debug, clickTrigger: clickTrigger }); });
    };
    ProjectView.prototype.stopSimulator = function (unload, clickTrigger) {
        pxt.tickEvent('simulator.stop');
        pxt.debug("stop sim (autorun " + this.state.autoRun + ")");
        if (this.runToken) {
            this.runToken.cancel();
            this.runToken = null;
        }
        simulator.stop(unload);
        var autoRun = this.state.autoRun && !clickTrigger; // if user pressed stop, don't restart
        this.setState({ simState: pxt.editor.SimState.Stopped, autoRun: autoRun });
    };
    ProjectView.prototype.suspendSimulator = function () {
        pxt.tickEvent('simulator.suspend');
        if (this.runToken) {
            this.runToken.cancel();
            this.runToken = null;
        }
        simulator.suspend();
    };
    ProjectView.prototype.runSimulator = function (opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        pxt.debug("run sim (autorun " + this.state.autoRun + ")");
        if (this.runToken)
            this.runToken.cancel();
        var cancellationToken = new pxt.Util.CancellationToken();
        this.runToken = cancellationToken;
        cancellationToken.startOperation();
        return (function () {
            var editorId = _this.editor ? _this.editor.getId().replace(/Editor$/, '') : "unknown";
            if (opts.background) {
                pxt.tickActivity("autorun", "autorun." + editorId);
                if (localStorage.getItem("noAutoRun"))
                    return Promise.resolve();
            }
            else
                pxt.tickEvent(opts.debug ? "debug" : "run", { editor: editorId });
            if (!opts.background)
                _this.editor.beforeCompile();
            if (_this.state.tracing)
                opts.trace = true;
            simulator.stop(false, true);
            var simAutoRun = pxt.appTarget.simulator && (pxt.options.light
                ? !!pxt.appTarget.simulator.autoRunLight
                : !!pxt.appTarget.simulator.autoRun);
            var autoRun = (_this.state.autoRun || !!opts.clickTrigger) && simAutoRun;
            _this.setState({ simState: pxt.editor.SimState.Starting, autoRun: autoRun });
            var state = _this.editor.snapshotState();
            return compiler.compileAsync(opts)
                .then(function (resp) {
                if (cancellationToken.isCancelled())
                    return;
                _this.clearSerial();
                _this.editor.setDiagnostics(_this.editorFile, state);
                if (resp.outfiles[pxtc.BINARY_JS]) {
                    if (!cancellationToken.isCancelled()) {
                        simulator.run(pkg.mainPkg, opts.debug, resp, _this.state.mute, _this.state.highContrast, pxt.options.light, opts.clickTrigger);
                        if (!cancellationToken.isCancelled()) {
                            // running state is set by the simulator once the iframe is loaded
                            _this.setState({ showParts: simulator.driver.runOptions.parts.length > 0 });
                        }
                        else {
                            simulator.stop();
                            _this.setState({ simState: pxt.editor.SimState.Stopped });
                        }
                    }
                }
                else if (!opts.background) {
                    core.warningNotification(lf("Oops, we could not run this project. Please check your code for errors."));
                }
            })
                .finally(function () {
                if (!cancellationToken.isCancelled())
                    cancellationToken.resolveCancel();
                cancellationToken = null;
            });
        })();
    };
    ///////////////////////////////////////////////////////////
    ////////////             Debugging            /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.simDebug = function () {
        pxt.tickEvent("menu.debug.sim");
        this.stopSimulator();
        this.runSimulator({ debug: true });
    };
    ProjectView.prototype.hwDebug = function () {
        pxt.tickEvent("menu.debug.hw");
        var start = Promise.resolve();
        if (this.state.simState != pxt.editor.SimState.Running || !simulator.driver.runOptions.debug)
            start = this.runSimulator({ debug: true });
        return start.then(function () {
            simulator.driver.setHwDebugger({
                postMessage: function (msg) {
                    pxt.HWDBG.handleMessage(msg);
                }
            });
            pxt.HWDBG.postMessage = function (msg) { return simulator.driver.handleHwDebuggerMsg(msg); };
            return Promise.join(compiler.compileAsync({ debug: true, native: true }), hidbridge.initAsync()).then(function (vals) { return pxt.HWDBG.startDebugAsync(vals[0], vals[1]); });
        });
    };
    ProjectView.prototype.toggleDebugging = function () {
        var state = !this.state.debugging;
        this.setState({ debugging: state, tracing: false });
        this.restartSimulator(state);
    };
    ProjectView.prototype.dbgPauseResume = function () {
        simulator.dbgPauseResume();
    };
    ProjectView.prototype.dbgStepOver = function () {
        simulator.dbgStepOver();
    };
    ProjectView.prototype.dbgStepInto = function () {
        simulator.dbgStepInto();
    };
    ProjectView.prototype.dbgInsertBreakpoint = function () {
        this.editor.insertBreakpoint();
    };
    ProjectView.prototype.editText = function () {
        var _this = this;
        if (this.editor != this.textEditor) {
            this.updateEditorFile(this.textEditor).then(function () {
                _this.textEditor.editor.focus();
            });
            this.forceUpdate();
        }
    };
    ProjectView.prototype.showScriptManager = function () {
        this.scriptManagerDialog.show();
    };
    ProjectView.prototype.importProjectDialog = function () {
        this.importDialog.show();
    };
    ProjectView.prototype.renderBlocksAsync = function (req) {
        return compiler.getBlocksAsync()
            .then(function (blocksInfo) { return compiler.decompileSnippetAsync(req.ts, blocksInfo); })
            .then(function (resp) {
            var svg = pxt.blocks.render(resp, {
                snippetMode: true,
                layout: pxt.blocks.BlockLayout.Align,
                splitSvg: false
            });
            // TODO: what if svg is undefined? handle that scenario
            var viewBox = svg.getAttribute("viewBox").split(/\s+/).map(function (d) { return parseInt(d); });
            return {
                svg: svg,
                xml: pxt.blocks.layout.blocklyToSvgAsync(svg, viewBox[0], viewBox[1], viewBox[2], viewBox[3])
            };
        });
    };
    ProjectView.prototype.launchFullEditor = function () {
        Util.assert(pxt.shell.isSandboxMode());
        var editUrl = pxt.appTarget.appTheme.embedUrl;
        if (!/\/$/.test(editUrl))
            editUrl += '/';
        var mpkg = pkg.mainPkg;
        var epkg = pkg.getEditorPkg(mpkg);
        if (pxt.shell.isReadOnly()) {
            if (epkg.header.pubId) { }
            editUrl += "#pub:" + epkg.header.pubId;
            window.open(editUrl, '_blank');
        }
        else
            this.exportAsync()
                .done(function (fileContent) {
                pxt.tickEvent("sandbox.openfulleditor");
                editUrl += "#project:" + fileContent;
                window.open(editUrl, '_blank');
            });
    };
    ProjectView.prototype.anonymousPublishAsync = function (screenshotUri) {
        var _this = this;
        pxt.tickEvent("publish");
        this.setState({ publishing: true });
        var mpkg = pkg.mainPkg;
        var epkg = pkg.getEditorPkg(mpkg);
        return this.saveProjectNameAsync()
            .then(function () { return _this.saveFileAsync(); })
            .then(function () { return mpkg.filesToBePublishedAsync(true); })
            .then(function (files) {
            if (epkg.header.pubCurrent)
                return Promise.resolve(epkg.header.pubId);
            var meta = {
                description: mpkg.config.description,
            };
            var blocksSize = _this.blocksEditor.contentSize();
            if (blocksSize) {
                meta.blocksHeight = blocksSize.height;
                meta.blocksWidth = blocksSize.width;
            }
            return workspace.anonymousPublishAsync(epkg.header, files, meta, screenshotUri)
                .then(function (inf) { return inf.id; });
        }).finally(function () {
            _this.setState({ publishing: false });
        })
            .catch(function (e) {
            core.errorNotification(e.message);
            throw e;
        });
    };
    ProjectView.prototype.updateHeaderName = function (name) {
        this.setState({
            projectName: name
        });
        this.debouncedSaveProjectName();
    };
    ProjectView.prototype.saveProjectNameAsync = function () {
        if (!this.state.projectName || !this.state.header)
            return Promise.resolve();
        try {
            return this.updateHeaderNameAsync(this.state.projectName);
        }
        catch (e) {
            pxt.reportException(e);
            return Promise.resolve();
        }
    };
    ProjectView.prototype.updateHeaderNameAsync = function (name) {
        var _this = this;
        // nothing to do?
        if (pkg.mainPkg.config.name == name)
            return Promise.resolve();
        //Save the name in the target MainPackage as well
        pkg.mainPkg.config.name = name;
        pxt.debug('saving project name to ' + name);
        var f = pkg.mainEditorPkg().lookupFile("this/" + pxt.CONFIG_NAME);
        var config = JSON.parse(f.content);
        config.name = name;
        return f.setContentAsync(JSON.stringify(config, null, 4) + "\n")
            .then(function () {
            if (_this.state.header)
                _this.setState({
                    projectName: name
                });
        });
    };
    ProjectView.prototype.isTextEditor = function () {
        return this.editor == this.textEditor;
    };
    ProjectView.prototype.isPxtJsonEditor = function () {
        return this.editor == this.pxtJsonEditor;
    };
    ProjectView.prototype.isBlocksEditor = function () {
        return this.editor == this.blocksEditor;
    };
    ProjectView.prototype.loadBlocklyAsync = function () {
        return this.blocksEditor.loadBlocklyAsync();
    };
    ///////////////////////////////////////////////////////////
    ////////////             Dialogs              /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.showReportAbuse = function () {
        var pubId = (this.state.tutorialOptions && this.state.tutorialOptions.tutorialReportId)
            || (this.state.header && this.state.header.pubCurrent && this.state.header.pubId);
        dialogs.showReportAbuseAsync(pubId);
    };
    ProjectView.prototype.showAboutDialog = function () {
        dialogs.showAboutDialogAsync(this);
    };
    ProjectView.prototype.showShareDialog = function () {
        var header = this.state.header;
        if (header)
            this.shareEditor.show(header);
    };
    ProjectView.prototype.showLanguagePicker = function () {
        this.languagePicker.show();
    };
    ProjectView.prototype.showImportUrlDialog = function () {
        dialogs.showImportUrlDialogAsync()
            .then(function (id) {
            if (id) {
                if (pxt.github.isGithubId(id))
                    importGithubProject(id);
                else
                    loadHeaderBySharedId(id);
            }
        }, function (e) {
            core.errorNotification(lf("Sorry, the project url looks invalid."));
        })
            .done();
    };
    ProjectView.prototype.showImportGithubDialog = function () {
        dialogs.showImportGithubDialogAsync().done(function (url) {
            if (url === "NEW") {
                dialogs.showCreateGithubRepoDialogAsync()
                    .then(function (url) {
                    if (url)
                        importGithubProject(url);
                });
            }
            else if (!pxt.github.isGithubId(url)) {
                core.errorNotification(lf("Sorry, the project url looks invalid."));
            }
            else {
                importGithubProject(url);
            }
        });
    };
    ProjectView.prototype.showImportFileDialog = function () {
        var _this = this;
        dialogs.showImportFileDialogAsync().done(function (res) {
            if (res) {
                pxt.tickEvent("app.open.file");
                _this.importFile(res);
            }
        });
    };
    ProjectView.prototype.showResetDialog = function () {
        var _this = this;
        dialogs.showResetDialogAsync().done(function (r) {
            if (!r)
                return Promise.resolve();
            return Promise.resolve()
                .then(function () {
                return pxt.winrt.releaseAllDevicesAsync();
            })
                .then(function () {
                return _this.resetWorkspace();
            });
        });
    };
    ProjectView.prototype.showExitAndSaveDialog = function () {
        if (this.state.projectName !== lf("Untitled")) {
            this.openHome();
        }
        else {
            this.exitAndSaveDialog.show();
        }
    };
    ProjectView.prototype.showPackageDialog = function () {
        this.scriptSearch.showExtensions();
    };
    ProjectView.prototype.showBoardDialogAsync = function (features, closeIcon) {
        return this.scriptSearch.showBoardsAsync(features, closeIcon);
    };
    ProjectView.prototype.showModalDialogAsync = function (options) {
        return core.dialogAsync({
            header: options.header,
            body: options.body,
            hideCancel: true,
            hasCloseIcon: true,
            buttons: options.buttons
        });
    };
    ProjectView.prototype.showExperimentsDialog = function () {
        this.scriptSearch.showExperiments();
    };
    ProjectView.prototype.showChooseHwDialog = function () {
        if (this.chooseHwDialog)
            this.chooseHwDialog.show();
    };
    ProjectView.prototype.showRenameProjectDialogAsync = function () {
        var _this = this;
        if (!this.state.header)
            return Promise.resolve(false);
        var opts = {
            header: lf("Rename your project"),
            agreeLbl: lf("Save"),
            agreeClass: "green",
            placeholder: lf("Enter your project name here")
        };
        return core.promptAsync(opts).then(function (res) {
            if (res === null)
                return Promise.resolve(false); // null means cancelled, empty string means ok (but no value entered)
            return new Promise(function (resolve, reject) {
                _this.setState({ projectName: res }, function () { return resolve(); });
            }).then(function () { return _this.saveProjectNameAsync(); })
                .then(function () { return true; });
        });
    };
    ///////////////////////////////////////////////////////////
    ////////////             Tutorials            /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.startTutorial = function (tutorialId, tutorialTitle) {
        pxt.tickEvent("tutorial.start");
        // Check for Internet access
        if (!pxt.Cloud.isNavigatorOnline()) {
            core.errorNotification(lf("No Internet access, please connect and try again."));
        }
        else {
            this.startTutorialAsync(tutorialId, tutorialTitle);
        }
    };
    ProjectView.prototype.startTutorialAsync = function (tutorialId, tutorialTitle) {
        var _this = this;
        core.hideDialog();
        core.showLoading("tutorial", lf("starting tutorial..."));
        sounds.initTutorial(); // pre load sounds
        var scriptId = pxt.Cloud.parseScriptId(tutorialId);
        var ghid = pxt.github.parseRepoId(tutorialId);
        var reportId = undefined;
        var tutorialmd;
        var title;
        var autoChooseBoard = true;
        var dependencies = {};
        var features = undefined;
        var p;
        if (/^\//.test(tutorialId)) {
            title = tutorialTitle || tutorialId.split('/').reverse()[0].replace('-', ' '); // drop any kind of sub-paths
            p = pxt.Cloud.markdownAsync(tutorialId)
                .then(function (md) {
                if (md) {
                    dependencies = pxt.gallery.parsePackagesFromMarkdown(md);
                    features = pxt.gallery.parseFeaturesFromMarkdown(md);
                    autoChooseBoard = true;
                }
                return md;
            });
        }
        else if (scriptId) {
            pxt.tickEvent("tutorial.shared");
            p = workspace.downloadFilesByIdAsync(scriptId)
                .then(function (files) {
                var pxtJson = JSON.parse(files["pxt.json"]);
                dependencies = pxtJson.dependencies || {};
                title = pxtJson.name || lf("Untitled");
                autoChooseBoard = false;
                reportId = scriptId;
                return files["README.md"];
            });
        }
        else if (!!ghid) {
            p = pxt.packagesConfigAsync()
                .then(function (config) {
                var status = pxt.github.repoStatus(ghid, config);
                switch (status) {
                    case pxt.github.GitRepoStatus.Banned:
                        throw lf("This tutorial has been banned.");
                    //case pxt.github.GitRepoStatus.Approved:
                    default:
                        reportId = "https://github.com/" + ghid.fullName;
                        break;
                }
                return pxt.github.downloadPackageAsync(ghid.fullName, config);
            })
                .then(function (gh) {
                var pxtJson = JSON.parse(gh.files["pxt.json"]);
                dependencies = pxtJson.dependencies || {};
                title = pxtJson.name || lf("Untitled");
                autoChooseBoard = false;
                return gh.files["README.md"];
            });
        }
        else {
            p = Promise.resolve(undefined);
        }
        return p.then(function (md) {
            if (!md)
                throw new Error("tutorial not found");
            tutorialmd = md;
            return _this.createProjectAsync({
                name: title,
                inTutorial: true,
                dependencies: dependencies
            }).then(function () { return autoChooseBoard ? _this.autoChooseBoardAsync(features) : Promise.resolve(); });
        })
            .then(function () {
            _this.setState({
                tutorialOptions: {
                    tutorial: tutorialId,
                    tutorialName: title,
                    tutorialReportId: reportId
                },
                tracing: undefined
            });
            var stepInfo = pxt.tutorial.parseTutorialSteps(tutorialId, tutorialmd);
            return tutorial.getUsedBlocksAsync(tutorialId, tutorialmd)
                .then(function (usedBlocks) {
                var editorState = {
                    searchBar: false
                };
                if (usedBlocks && Object.keys(usedBlocks).length > 0) {
                    editorState.filters = {
                        blocks: usedBlocks,
                        defaultState: pxt.editor.FilterState.Hidden
                    };
                }
                _this.setState({
                    editorState: editorState,
                    tutorialOptions: {
                        tutorial: tutorialId,
                        tutorialName: title,
                        tutorialReportId: reportId,
                        tutorialStep: 0,
                        tutorialReady: true,
                        tutorialStepInfo: stepInfo
                    }
                });
                _this.editor.filterToolbox(usedBlocks, true);
                var fullscreen = stepInfo[0].fullscreen;
                if (fullscreen)
                    _this.showTutorialHint();
                else
                    _this.showLightbox();
            })
                .catch(function (e) {
                // Failed to decompile
                pxt.tickEvent('tutorial.faileddecompile', { tutorialId: tutorialId });
                core.errorNotification(lf("Oops, an error occured as we were loading the tutorial."));
                // Reset state (delete the current project and exit the tutorial)
                _this.exitTutorial(true);
            });
        }).catch(function (e) {
            core.handleNetworkError(e);
        }).finally(function () { return core.hideLoading("tutorial"); });
    };
    ProjectView.prototype.completeTutorial = function () {
        var _this = this;
        pxt.tickEvent("tutorial.complete");
        core.showLoading("leavingtutorial", lf("leaving tutorial..."));
        if (pxt.BrowserUtils.isIE()) {
            // For some reason, going from a tutorial straight to the editor in
            // IE causes the JavaScript runtime to go bad. In order to work around
            // the issue we go to the homescreen instead of the to the editor. See
            // https://github.com/Microsoft/pxt-microbit/issues/1249 for more info.
            this.exitTutorial();
        }
        else {
            this.exitTutorialAsync()
                .then(function () {
                var curr = pkg.mainEditorPkg().header;
                return _this.loadHeaderAsync(curr);
            }).finally(function () { return core.hideLoading("leavingtutorial"); });
        }
    };
    ProjectView.prototype.exitTutorial = function (removeProject) {
        var _this = this;
        pxt.tickEvent("tutorial.exit");
        core.showLoading("leavingtutorial", lf("leaving tutorial..."));
        this.exitTutorialAsync(removeProject)
            .finally(function () {
            core.hideLoading("leavingtutorial");
            _this.openHome();
        });
    };
    ProjectView.prototype.exitTutorialAsync = function (removeProject) {
        var _this = this;
        var curr = pkg.mainEditorPkg().header;
        curr.isDeleted = removeProject;
        var files = pkg.mainEditorPkg().getAllFiles();
        return workspace.saveAsync(curr, files)
            .then(function () { return Promise.delay(500); })
            .finally(function () {
            _this.setState({ tutorialOptions: undefined, tracing: undefined, editorState: undefined });
            core.resetFocus();
        });
    };
    ProjectView.prototype.showTutorialHint = function () {
        var th = this.refs["tutorialhint"];
        th.showHint();
        var options = this.state.tutorialOptions;
        pxt.tickEvent("tutorial.showhint", { tutorial: options.tutorial, step: options.tutorialStep });
    };
    ///////////////////////////////////////////////////////////
    ////////////         High contrast            /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.toggleHighContrast = function () {
        var _this = this;
        var highContrastOn = !this.state.highContrast;
        pxt.tickEvent("app.highcontrast", { on: highContrastOn ? 1 : 0 });
        this.setState({ highContrast: highContrastOn }, function () {
            if (!!_this.state.header) {
                _this.restartSimulator();
            }
        });
        core.setHighContrast(highContrastOn);
        if (this.editor && this.editor.isReady) {
            this.editor.setHighContrast(highContrastOn);
        }
    };
    ProjectView.prototype.toggleGreenScreen = function () {
        var greenScreenOn = !this.state.greenScreen;
        pxt.tickEvent("app.greenscreen", { on: greenScreenOn ? 1 : 0 });
        this.setState({ greenScreen: greenScreenOn });
    };
    ProjectView.prototype.setBannerVisible = function (b) {
        this.setState({ bannerVisible: b });
    };
    ///////////////////////////////////////////////////////////
    ////////////             Light Box            /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.hideLightbox = function () {
        this.setState({ lightbox: false });
    };
    ProjectView.prototype.showLightbox = function () {
        this.setState({ lightbox: true });
    };
    ///////////////////////////////////////////////////////////
    ////////////             RENDER               /////////////
    ///////////////////////////////////////////////////////////
    ProjectView.prototype.renderCore = function () {
        setEditor(this);
        //  ${targetTheme.accentColor ? "inverted accent " : ''}
        var targetTheme = pxt.appTarget.appTheme;
        var simOpts = pxt.appTarget.simulator;
        var sharingEnabled = pxt.appTarget.cloud && pxt.appTarget.cloud.sharing && !pxt.shell.isControllerMode();
        var sandbox = pxt.shell.isSandboxMode();
        var isBlocks = !this.editor.isVisible || this.getPreferredEditor() == pxt.BLOCKS_PROJECT_NAME;
        var sideDocs = !(sandbox || targetTheme.hideSideDocs);
        var tutorialOptions = this.state.tutorialOptions;
        var inTutorial = !!tutorialOptions && !!tutorialOptions.tutorial;
        var inHome = this.state.home && !sandbox;
        var inEditor = !!this.state.header && !inHome;
        var _a = this.state, lightbox = _a.lightbox, greenScreen = _a.greenScreen;
        var simDebug = !!targetTheme.debugger;
        var hideMenuBar = targetTheme.hideMenuBar, hideEditorToolbar = targetTheme.hideEditorToolbar, transparentEditorToolbar = targetTheme.transparentEditorToolbar;
        var isHeadless = simOpts && simOpts.headless;
        var selectLanguage = targetTheme.selectLanguage;
        var showEditorToolbar = inEditor && !hideEditorToolbar && this.editor.hasEditorToolbar();
        var useSerialEditor = pxt.appTarget.serial && !!pxt.appTarget.serial.useEditor;
        var showSideDoc = sideDocs && this.state.sideDocsLoadUrl && !this.state.sideDocsCollapsed;
        var shouldHideEditorFloats = (this.state.hideEditorFloats || this.state.collapseEditorTools) && (!inTutorial || isHeadless);
        var shouldCollapseEditorTools = this.state.collapseEditorTools && (!inTutorial || isHeadless);
        var logoWide = !!targetTheme.logoWide;
        var hwDialog = !sandbox && pxt.hasHwVariants();
        var isApp = cmds.isNativeHost() || pxt.winrt.isWinRT() || pxt.BrowserUtils.isElectron();
        var rootClassList = [
            "ui",
            lightbox ? 'dimmable dimmed' : 'dimmable',
            shouldHideEditorFloats ? " hideEditorFloats" : '',
            shouldCollapseEditorTools ? " collapsedEditorTools" : '',
            transparentEditorToolbar ? " transparentEditorTools" : '',
            this.state.fullscreen ? 'fullscreensim' : '',
            this.state.highContrast ? 'hc' : '',
            showSideDoc ? 'sideDocs' : '',
            pxt.shell.layoutTypeClass(),
            inHome ? 'inHome' : '',
            inTutorial ? 'tutorial' : '',
            pxt.options.light ? 'light' : '',
            pxt.BrowserUtils.isTouchEnabled() ? 'has-touch' : '',
            hideMenuBar ? 'hideMenuBar' : '',
            !showEditorToolbar || transparentEditorToolbar ? 'hideEditorToolbar' : '',
            this.state.bannerVisible ? "notificationBannerVisible" : "",
            this.state.debugging ? "debugging" : "",
            sandbox && this.isEmbedSimActive() ? 'simView' : '',
            isApp ? "app" : "",
            greenScreen ? "greenscreen" : "",
            logoWide ? "logo-wide" : "",
            'full-abs'
        ];
        var rootClasses = sui.cx(rootClassList);
        if (this.state.hasError) {
            return React.createElement("div", { id: "root", className: "ui middle aligned center aligned grid", style: { height: '100%', alignItems: 'center' } },
                React.createElement("div", { className: "ui raised segment inverted purple" },
                    React.createElement("h2", null, lf("Oops")),
                    lf("We detected a problem and we will reload the editor in a few seconds..")));
        }
        return (React.createElement("div", { id: 'root', className: rootClasses },
            greenScreen ? React.createElement(greenscreen.WebCam, { close: this.toggleGreenScreen }) : undefined,
            hideMenuBar || inHome ? undefined :
                React.createElement("header", { className: "menubar", role: "banner" },
                    inEditor ? React.createElement(accessibility.EditorAccessibilityMenu, { parent: this, highContrast: this.state.highContrast }) : undefined,
                    React.createElement(notification.NotificationBanner, { parent: this }),
                    React.createElement(container.MainMenu, { parent: this })),
            inTutorial ? React.createElement("div", { id: "maineditor", className: sandbox ? "sandbox" : "", role: "main" },
                React.createElement(tutorial.TutorialCard, { ref: "tutorialcard", parent: this })) : undefined,
            React.createElement("div", { id: "simulator" },
                simDebug ? React.createElement(debug.DebuggerToolbar, { parent: this }) : undefined,
                React.createElement("div", { id: "filelist", className: "ui items" },
                    React.createElement("div", { id: "boardview", className: "ui vertical editorFloat", role: "region", "aria-label": lf("Simulator") }),
                    React.createElement(simtoolbar.SimulatorToolbar, { parent: this }),
                    React.createElement("div", { className: "ui item portrait hide hidefullscreen" }, pxt.options.debug ? React.createElement(sui.Button, { key: 'hwdebugbtn', className: 'teal', icon: "xicon chip", text: "Dev Debug", onClick: this.hwDebug }) : ''),
                    useSerialEditor ?
                        React.createElement("div", { id: "serialPreview", className: "ui editorFloat portrait hide hidefullscreen" },
                            React.createElement(serialindicator.SerialIndicator, { ref: "simIndicator", isSim: true, onClick: this.openSimSerial }),
                            React.createElement(serialindicator.SerialIndicator, { ref: "devIndicator", isSim: false, onClick: this.openDeviceSerial })) : undefined,
                    sandbox || isBlocks || this.editor == this.serialEditor ? undefined : React.createElement(filelist.FileList, { parent: this }),
                    React.createElement("div", { id: "filelistOverlay", role: "button", title: lf("Open in fullscreen"), onClick: this.toggleSimulatorFullscreen }))),
            React.createElement("div", { id: "maineditor", className: sandbox ? "sandbox" : "", role: "main", "aria-hidden": inHome }, this.allEditors.map(function (e) { return e.displayOuter(); })),
            inHome ? React.createElement("div", { id: "homescreen", className: "full-abs" },
                React.createElement("div", { className: "ui home projectsdialog" },
                    React.createElement("header", { className: "menubar", role: "banner" },
                        React.createElement(accessibility.HomeAccessibilityMenu, { parent: this, highContrast: this.state.highContrast }),
                        React.createElement(projects.ProjectsMenu, { parent: this })),
                    React.createElement(projects.Projects, { parent: this, ref: this.handleHomeRef }))) : undefined,
            inTutorial ? React.createElement(tutorial.TutorialHint, { ref: "tutorialhint", parent: this }) : undefined,
            showEditorToolbar ? React.createElement("div", { id: "editortools", role: "complementary", "aria-label": lf("Editor toolbar") },
                React.createElement(editortoolbar.EditorToolbar, { ref: "editortools", parent: this })) : undefined,
            sideDocs ? React.createElement(container.SideDocs, { ref: "sidedoc", parent: this, sideDocsCollapsed: this.state.sideDocsCollapsed, docsUrl: this.state.sideDocsLoadUrl }) : undefined,
            sandbox ? undefined : React.createElement(scriptsearch.ScriptSearch, { parent: this, ref: this.handleScriptSearchRef }),
            sandbox ? undefined : React.createElement(extensions.Extensions, { parent: this, ref: this.handleExtensionRef }),
            inHome ? React.createElement(projects.ImportDialog, { parent: this, ref: this.handleImportDialogRef }) : undefined,
            inHome && targetTheme.scriptManager ? React.createElement(scriptmanager.ScriptManagerDialog, { parent: this, ref: this.handleScriptManagerDialogRef, onClose: this.handleScriptManagerDialogClose }) : undefined,
            sandbox ? undefined : React.createElement(projects.ExitAndSaveDialog, { parent: this, ref: this.handleExitAndSaveDialogRef }),
            hwDialog ? React.createElement(projects.ChooseHwDialog, { parent: this, ref: this.handleChooseHwDialogRef }) : undefined,
            sandbox || !sharingEnabled ? undefined : React.createElement(share.ShareEditor, { parent: this, ref: this.handleShareEditorRef, loading: this.state.publishing }),
            selectLanguage ? React.createElement(lang.LanguagePicker, { parent: this, ref: this.handleLanguagePickerRef }) : undefined,
            sandbox ? React.createElement(container.SandboxFooter, { parent: this }) : undefined,
            hideMenuBar ? React.createElement("div", { id: "editorlogo" },
                React.createElement("a", { className: "poweredbylogo" })) : undefined,
            lightbox ? React.createElement(sui.Dimmer, { isOpen: true, active: lightbox, portalClassName: 'tutorial', className: 'ui modal', shouldFocusAfterRender: false, closable: true, onClose: this.hideLightbox }) : undefined));
    };
    return ProjectView;
}(data.Component));
exports.ProjectView = ProjectView;
function render() {
    ReactDOM.render(React.createElement(ProjectView, null), sui.appElement);
}
function getEditor() {
    return theEditor;
}
function initLogin() {
    cloudsync.loginCheck();
    {
        var qs = core.parseQueryString((location.hash || "#").slice(1).replace(/%23access_token/, "access_token"));
        if (qs["access_token"]) {
            var ex = pxt.storage.getLocal("oauthState");
            var tp = pxt.storage.getLocal("oauthType");
            if (ex && ex == qs["state"]) {
                pxt.storage.removeLocal("oauthState");
                pxt.storage.removeLocal("oauthType");
                if (tp == "github")
                    pxt.storage.setLocal("githubtoken", qs["access_token"]);
            }
            location.hash = location.hash.replace(/(%23)?[\#\&\?]*access_token.*/, "");
        }
        Cloud.accessToken = pxt.storage.getLocal("access_token") || "";
    }
    {
        var qs = core.parseQueryString((location.hash || "#").slice(1).replace(/%local_token/, "local_token"));
        if (qs["local_token"]) {
            pxt.storage.setLocal("local_token", qs["local_token"]);
            location.hash = location.hash.replace(/(%23)?[\#\&\?]*local_token.*/, "");
        }
        Cloud.localToken = pxt.storage.getLocal("local_token") || "";
    }
}
function initSerial() {
    var isHF2WinRTSerial = pxt.appTarget.serial && pxt.appTarget.serial.useHF2 && pxt.winrt.isWinRT();
    var isValidLocalhostSerial = pxt.appTarget.serial && pxt.BrowserUtils.isLocalHost() && !!Cloud.localToken;
    if (!isHF2WinRTSerial && !isValidLocalhostSerial && !pxt.usb.isEnabled)
        return;
    if (hidbridge.shouldUse() || pxt.usb.isEnabled) {
        hidbridge.configureHidSerial(function (buf, isErr) {
            var data = Util.fromUTF8(Util.uint8ArrayToString(buf));
            //pxt.debug('serial: ' + data)
            window.postMessage({
                type: 'serial',
                id: 'n/a',
                data: data
            }, "*");
        });
        return;
    }
    pxt.debug('initializing serial pipe');
    var ws = new WebSocket("ws://localhost:" + pxt.options.wsPort + "/" + Cloud.localToken + "/serial");
    var serialBuffers = {};
    ws.onopen = function (ev) {
        pxt.debug('serial: socket opened');
    };
    ws.onclose = function (ev) {
        pxt.debug('serial: socket closed');
    };
    ws.onerror = function (ev) {
        pxt.debug('serial: error');
    };
    ws.onmessage = function (ev) {
        try {
            var msg = JSON.parse(ev.data);
            if (msg && msg.type == "serial") {
                //pxt.debug('serial: ' + msg.data)
                pxt.Util.bufferSerial(serialBuffers, msg.data, msg.id);
            }
        }
        catch (e) {
            pxt.debug('unknown message: ' + ev.data);
        }
    };
}
function getsrc() {
    pxt.log(theEditor.editor.getCurrentSource());
}
function enableAnalytics() {
    pxt.analytics.enable();
    pxt.editor.enableControllerAnalytics();
    var stats = {};
    if (typeof window !== "undefined") {
        var screen_1 = window.screen;
        stats["screen.width"] = screen_1.width;
        stats["screen.height"] = screen_1.height;
        stats["screen.availwidth"] = screen_1.availWidth;
        stats["screen.availheight"] = screen_1.availHeight;
        stats["screen.innerWidth"] = window.innerWidth;
        stats["screen.innerHeight"] = window.innerHeight;
        stats["screen.devicepixelratio"] = pxt.BrowserUtils.devicePixelRatio();
    }
    pxt.tickEvent("editor.loaded", stats);
}
function showIcons() {
    var usedIcons = [
        "cancel", "certificate", "checkmark", "cloud", "cloud upload", "copy", "disk outline", "download",
        "dropdown", "edit", "file outline", "find", "folder", "folder open", "help circle",
        "keyboard", "lock", "play", "puzzle", "search", "setting", "settings",
        "share alternate", "sign in", "sign out", "square", "stop", "translate", "trash", "undo", "upload",
        "user", "wizard", "configure", "align left"
    ];
    core.confirmAsync({
        header: "Icons",
        htmlBody: usedIcons.map(function (s) { return "<i style='font-size:2em' class=\"ui icon " + s + "\"></i>&nbsp;" + s + "&nbsp; "; }).join("\n")
    });
}
function assembleCurrent() {
    compiler.compileAsync({ native: true })
        .then(function () { return compiler.assembleAsync(getEditor().editorFile.content); })
        .then(function (v) {
        var nums = v.words;
        pxt.debug("[" + nums.map(function (n) { return "0x" + n.toString(16); }).join(",") + "]");
    });
}
function log(v) {
    console.log(v);
}
// This is for usage from JS console
var myexports = {
    workspace: workspace,
    require: require,
    core: core,
    getEditor: getEditor,
    monaco: monaco,
    blocks: blocks,
    compiler: compiler,
    pkg: pkg,
    getsrc: getsrc,
    sim: simulator,
    apiAsync: core.apiAsync,
    showIcons: showIcons,
    assembleCurrent: assembleCurrent,
    log: log,
    cloudsync: cloudsync
};
window.E = myexports;
function parseHash() {
    var hashM = /^#(\w+)(:([:\.\/\-\+\=\w]+))?$/.exec(window.location.hash);
    if (hashM) {
        return { cmd: hashM[1], arg: hashM[3] || '' };
    }
    return { cmd: '', arg: '' };
}
function handleHash(hash, loading) {
    if (!hash)
        return false;
    var editor = theEditor;
    if (!editor)
        return false;
    if (isProjectRelatedHash(hash))
        editor.setState({ home: false });
    switch (hash.cmd) {
        case "doc":
            pxt.tickEvent("hash.doc");
            editor.setSideDoc(hash.arg, editor.editor === editor.blocksEditor);
            break;
        case "follow":
            pxt.tickEvent("hash.follow");
            editor.newEmptyProject(undefined, hash.arg);
            return true;
        case "newproject":// shortcut to create a new blocks proj
            pxt.tickEvent("hash.newproject");
            editor.newEmptyProject();
            pxt.BrowserUtils.changeHash("");
            return true;
        case "newjavascript":// shortcut to create a new JS proj
            pxt.tickEvent("hash.newjavascript");
            editor.newProject({
                prj: pxt.appTarget.blocksprj,
                filesOverride: {
                    "main.blocks": ""
                }
            });
            pxt.BrowserUtils.changeHash("");
            return true;
        case "gettingstarted":
            pxt.tickEvent("hash.gettingstarted");
            editor.newProject();
            pxt.BrowserUtils.changeHash("");
            return true;
        case "tutorial":// shortcut to a tutorial. eg: #tutorial:tutorials/getting-started
            pxt.tickEvent("hash.tutorial");
            editor.startTutorial(hash.arg);
            pxt.BrowserUtils.changeHash("");
            return true;
        case "home":// shortcut to home
            pxt.tickEvent("hash.home");
            editor.openHome();
            pxt.BrowserUtils.changeHash("");
            return true;
        case "sandbox":
        case "pub":
        case "edit":// load a published proj, eg: #pub:27750-32291-62442-22749
            pxt.tickEvent("hash." + hash.cmd);
            pxt.BrowserUtils.changeHash("");
            loadHeaderBySharedId(hash.arg);
            return true;
        case "sandboxproject":
        case "project":
            pxt.tickEvent("hash." + hash.cmd);
            var fileContents = Util.stringToUint8Array(atob(hash.arg));
            pxt.BrowserUtils.changeHash("");
            core.showLoading("loadingproject", lf("loading project..."));
            editor.importProjectFromFileAsync(fileContents)
                .finally(function () { return core.hideLoading("loadingproject"); });
            return true;
        case "reload":// need to reload last project - handled later in the load process
            if (loading)
                pxt.BrowserUtils.changeHash("");
            return false;
    }
    return false;
}
// Determines whether the hash argument affects the starting project
function isProjectRelatedHash(hash) {
    if (!hash) {
        return false;
    }
    switch (hash.cmd) {
        case "follow":
        case "newproject":
        case "newjavascript":
        // case "gettingstarted": // This should be true, #gettingstarted hash handling is not yet implemented
        case "tutorial":
        case "projects":
        case "sandbox":
        case "pub":
        case "edit":
        case "sandboxproject":
        case "project":
            return true;
        default:
            return false;
    }
}
function importGithubProject(id) {
    return __awaiter(this, void 0, void 0, function () {
        var hd, text, ok, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    core.showLoading("loadingheader", lf("importing github project..."));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, 11, 12]);
                    return [4 /*yield*/, workspace.importGithubAsync(id)];
                case 2:
                    hd = _a.sent();
                    return [4 /*yield*/, workspace.getTextAsync(hd.id)];
                case 3:
                    text = _a.sent();
                    if (!((text[pxt.CONFIG_NAME] || "{}").length < 20)) return [3 /*break*/, 8];
                    return [4 /*yield*/, core.confirmAsync({
                            header: lf("Initialize MakeCode extension?"),
                            body: lf("We didn't find a valid pxt.json file in the repository. Would you like to create it and supporting files?"),
                            agreeLbl: lf("Initialize!")
                        })];
                case 4:
                    ok = _a.sent();
                    if (!!ok) return [3 /*break*/, 6];
                    hd.isDeleted = true;
                    return [4 /*yield*/, workspace.saveAsync(hd)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
                case 6: return [4 /*yield*/, workspace.initializeGithubRepoAsync(hd, id)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [4 /*yield*/, theEditor.loadHeaderAsync(hd, null)];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 12];
                case 10:
                    e_1 = _a.sent();
                    core.handleNetworkError(e_1);
                    return [3 /*break*/, 12];
                case 11:
                    core.hideLoading("loadingheader");
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function loadHeaderBySharedId(id) {
    var existing = workspace.getHeaders()
        .filter(function (h) { return h.pubCurrent && h.pubId == id; })[0];
    core.showLoading("loadingheader", lf("loading project..."));
    (existing
        ? theEditor.loadHeaderAsync(existing, null)
        : workspace.installByIdAsync(id)
            .then(function (hd) { return theEditor.loadHeaderAsync(hd, null); }))
        .catch(core.handleNetworkError)
        .finally(function () { return core.hideLoading("loadingheader"); });
}
var handleHashChange = function (e) {
    handleHash(parseHash(), false);
};
function initHashchange() {
    window.addEventListener("hashchange", handleHashChange);
}
function clearHashChange() {
    window.removeEventListener("hashchange", handleHashChange);
}
function saveAsBlocks() {
    try {
        return /saveblocks=1/.test(window.location.href) && !!pkg.mainPkg.readFile("main.blocks");
    }
    catch (e) {
        return false;
    }
}
function initExtensionsAsync() {
    if (!pxt.appTarget.appTheme || !pxt.appTarget.appTheme.extendEditor)
        return Promise.resolve();
    pxt.debug('loading editor extensions...');
    var opts = {
        blocklyToolbox: blocklyToolbox.getToolboxDefinition(),
        monacoToolbox: monacoToolbox.getToolboxDefinition(),
        projectView: theEditor
    };
    return pxt.BrowserUtils.loadScriptAsync("editor.js")
        .then(function () { return pxt.editor.initExtensionsAsync(opts); })
        .then(function (res) {
        if (res.hexFileImporters) {
            res.hexFileImporters.forEach(function (fi) {
                pxt.debug("\tadded hex importer " + fi.id);
                theEditor.hexFileImporters.push(fi);
            });
        }
        if (res.resourceImporters) {
            res.resourceImporters.forEach(function (fi) {
                pxt.debug("\tadded resource importer " + fi.id);
                theEditor.resourceImporters.push(fi);
            });
        }
        if (res.deployCoreAsync) {
            pxt.debug("\tadded custom deploy core async");
            pxt.commands.deployCoreAsync = res.deployCoreAsync;
        }
        if (res.saveOnlyAsync) {
            pxt.debug("\tadded custom save only async");
            pxt.commands.saveOnlyAsync = res.saveOnlyAsync;
        }
        if (res.saveProjectAsync) {
            pxt.debug("\tadded custom save project async");
            pxt.commands.saveProjectAsync = res.saveProjectAsync;
        }
        if (res.showUploadInstructionsAsync) {
            pxt.debug("\tadded custom upload instructions async");
            pxt.commands.showUploadInstructionsAsync = res.showUploadInstructionsAsync;
        }
        if (res.patchCompileResultAsync) {
            pxt.debug("\tadded build patch");
            pxt.commands.patchCompileResultAsync = res.patchCompileResultAsync;
        }
        if (res.beforeCompile) {
            theEditor.beforeCompile = res.beforeCompile;
        }
        if (res.toolboxOptions) {
            if (res.toolboxOptions.blocklyToolbox) {
                blocklyToolbox.overrideToolbox(res.toolboxOptions.blocklyToolbox);
            }
            if (res.toolboxOptions.monacoToolbox) {
                monacoToolbox.overrideToolbox(res.toolboxOptions.monacoToolbox);
            }
        }
        if (res.blocklyPatch) {
            pxt.blocks.extensionBlocklyPatch = res.blocklyPatch;
        }
        if (res.webUsbPairDialogAsync) {
            pxt.commands.webUsbPairDialogAsync = res.webUsbPairDialogAsync;
        }
    });
}
pxt.winrt.captureInitialActivation();
document.addEventListener("DOMContentLoaded", function () {
    pxt.setupWebConfig(window.pxtConfig);
    var config = pxt.webConfig;
    pxt.options.debug = /dbg=1/i.test(window.location.href);
    pxt.options.light = /light=1/i.test(window.location.href) || pxt.BrowserUtils.isARM() || pxt.BrowserUtils.isIE();
    if (pxt.options.light) {
        pxsim.U.addClass(document.body, 'light');
    }
    var wsPortMatch = /wsport=(\d+)/i.exec(window.location.href);
    if (wsPortMatch) {
        pxt.options.wsPort = parseInt(wsPortMatch[1]) || 3233;
        pxt.BrowserUtils.changeHash(window.location.hash.replace(wsPortMatch[0], ""));
    }
    else {
        pxt.options.wsPort = 3233;
    }
    pkg.setupAppTarget(window.pxtTargetBundle);
    enableAnalytics();
    if (!pxt.BrowserUtils.isBrowserSupported() && !/skipbrowsercheck=1/i.exec(window.location.href)) {
        pxt.tickEvent("unsupported");
        window.location.href = "/browsers";
        core.showLoading("browsernotsupported", lf("Sorry, this browser is not supported."));
        return;
    }
    initLogin();
    var hash = parseHash();
    var appCacheUpdated = function () {
        try {
            // Prevent us from stripping out the hash before the reload is complete
            clearHashChange();
            // On embedded pages, preserve the loaded project
            if (pxt.BrowserUtils.isIFrame() && (hash.cmd === "pub" || hash.cmd === "sandbox")) {
                location.hash = "#" + hash.cmd + ":" + hash.arg;
            }
            else if (theEditor
                && !theEditor.home.state.visible
                && theEditor.state && theEditor.state.header && !theEditor.state.header.isDeleted) {
                location.hash = "#reload";
            }
            location.reload();
        }
        catch (e) {
            pxt.reportException(e);
            location.reload();
        }
    };
    appcache.init(appCacheUpdated);
    pxt.hex.showLoading = function (msg) { return core.showLoading("hexcloudcompiler", msg); };
    pxt.hex.hideLoading = function () { return core.hideLoading("hexcloudcompiler"); };
    pxt.docs.requireMarked = function () { return require("marked"); };
    var importHex = function (hex, createNewIfFailed) {
        if (createNewIfFailed === void 0) { createNewIfFailed = false; }
        return theEditor.importHex(hex, createNewIfFailed);
    };
    var hm = /^(https:\/\/[^/]+)/.exec(window.location.href);
    if (hm)
        Cloud.apiRoot = hm[1] + "/api/";
    var query = core.parseQueryString(window.location.href);
    if (query["hw"])
        pxt.setHwVariant(query["hw"]);
    pxt.setCompileSwitches(query["compiler"] || query["compile"]);
    pxt.github.token = pxt.storage.getLocal("githubtoken");
    var isSandbox = pxt.shell.isSandboxMode() || pxt.shell.isReadOnly();
    var isController = pxt.shell.isControllerMode();
    var theme = pxt.appTarget.appTheme;
    if (query["ws"])
        workspace.setupWorkspace(query["ws"]);
    else if ((theme.allowParentController || isController) && pxt.BrowserUtils.isIFrame())
        workspace.setupWorkspace("iframe");
    else if (isSandbox)
        workspace.setupWorkspace("mem");
    else if (pxt.winrt.isWinRT())
        workspace.setupWorkspace("uwp");
    else if (pxt.BrowserUtils.isIpcRenderer() && pxt.BrowserUtils.isSafari())
        workspace.setupWorkspace("idb");
    else if (pxt.BrowserUtils.isLocalHost() || pxt.BrowserUtils.isPxtElectron())
        workspace.setupWorkspace("fs");
    Promise.resolve()
        .then(function () {
        var mlang = /(live)?(force)?lang=([a-z]{2,}(-[A-Z]+)?)/i.exec(window.location.href);
        if (mlang && window.location.hash.indexOf(mlang[0]) >= 0) {
            pxt.BrowserUtils.changeHash(window.location.hash.replace(mlang[0], ""));
        }
        var useLang = mlang ? mlang[3] : (lang.getCookieLang() || theme.defaultLocale || navigator.userLanguage || navigator.language);
        var live = !theme.disableLiveTranslations || (mlang && !!mlang[1]);
        var force = !!mlang && !!mlang[2];
        return Util.updateLocalizationAsync(pxt.appTarget.id, config.commitCdnUrl, useLang, pxt.appTarget.versions.pxtCrowdinBranch, pxt.appTarget.versions.targetCrowdinBranch, live, force)
            .then(function () {
            if (pxt.Util.isLocaleEnabled(useLang)) {
                lang.setCookieLang(useLang);
                lang.setInitialLang(useLang);
            }
            else {
                pxt.tickEvent("unavailablelocale." + useLang + (force ? ".force" : ""));
            }
            pxt.tickEvent("locale." + pxt.Util.userLanguage() + (live ? ".live" : ""));
            // Download sim translations and save them in the sim
            return Util.downloadSimulatorLocalizationAsync(pxt.appTarget.id, config.commitCdnUrl, useLang, pxt.appTarget.versions.pxtCrowdinBranch, pxt.appTarget.versions.targetCrowdinBranch, live, force);
        }).then(function (simStrings) {
            if (simStrings)
                simulator.setTranslations(simStrings);
        });
    })
        .then(function () {
        pxt.BrowserUtils.initTheme();
        pxt.editor.experiments.syncTheme();
        cmds.init();
        // editor messages need to be enabled early, in case workspace provider is IFrame
        if (theme.allowParentController
            || theme.allowPackageExtensions
            || theme.allowSimulatorTelemetry
            || pxt.shell.isControllerMode())
            pxt.editor.bindEditorMessages(getEditorAsync);
        return workspace.initAsync();
    })
        .then(function (state) {
        render(); // this sets theEditor
        if (state)
            theEditor.setState({ editorState: state });
        initSerial();
        initHashchange();
        socketbridge.tryInit();
        return initExtensionsAsync();
    })
        .then(function () {
        electron.initElectron(theEditor);
        return pxt.winrt.initAsync(importHex);
    })
        .then(function () { return pxt.winrt.hasActivationProjectAsync(); })
        .then(function (hasWinRTProject) {
        var ent = theEditor.settings.fileHistory.filter(function (e) { return !!workspace.getHeader(e.id); })[0];
        var hd = workspace.getHeaders()[0];
        if (ent)
            hd = workspace.getHeader(ent.id);
        if (theEditor.shouldShowHomeScreen() && !hasWinRTProject) {
            return Promise.resolve();
        }
        else {
            // Hide the home screen
            theEditor.setState({ home: false });
        }
        if (hash.cmd && handleHash(hash, true)) {
            return Promise.resolve();
        }
        if (hasWinRTProject) {
            return pxt.winrt.loadActivationProject();
        }
        // default handlers
        if (hd)
            return theEditor.loadHeaderAsync(hd, theEditor.state.editorState);
        else
            theEditor.newProject();
        return Promise.resolve();
    })
        .then(function () {
        pxsim.U.remove(document.getElementById('loading'));
        return workspace.loadedAsync();
    })
        .done();
    document.addEventListener("visibilitychange", function (ev) {
        if (theEditor)
            theEditor.updateVisibility();
    });
    window.addEventListener("unload", function (ev) {
        if (theEditor)
            theEditor.saveSettings();
    });
    window.addEventListener("resize", function (ev) {
        if (theEditor && theEditor.editor) {
            theEditor.editor.resize(ev);
            // The order WKWebView resize events on IOS is weird, resize again to be sure
            if (pxt.BrowserUtils.isIOS()) {
                setTimeout(function () {
                    theEditor.editor.resize(ev);
                }, 1000);
            }
        }
    }, false);
    var ipcRenderer = window.ipcRenderer;
    if (ipcRenderer)
        ipcRenderer.on('responseFromApp', function (event, message) {
            // IPC renderer sends a string, we need to convert to an object to send to the simulator iframe
            try {
                simulator.driver.postMessage(JSON.parse(message));
            }
            catch (e) {
            }
        });
    window.addEventListener("message", function (ev) {
        var m = ev.data;
        if (!m) {
            return;
        }
        if (ev.data.__proxy == "parent") {
            pxt.debug("received parent proxy message" + ev.data);
            delete ev.data.__proxy;
            var ipcRenderer_1 = window.ipcRenderer;
            if (ipcRenderer_1)
                ipcRenderer_1.sendToHost("sendToApp", ev.data);
            else if (window.parent && window != window.parent)
                window.parent.postMessage(ev.data, "*");
            return;
        }
        if (m.type == "tutorial" || m.type == "popoutcomplete") {
            if (theEditor && theEditor.editor)
                theEditor.handleMessage(m);
            return;
        }
        if (m.type === "sidedocready" && pxt.BrowserUtils.isLocalHost() && Cloud.localToken) {
            container.SideDocs.notify({
                type: "localtoken",
                localToken: Cloud.localToken
            });
            return;
        }
        if (m.type == "importfile") {
            var msg = m;
            if (theEditor)
                theEditor.importFile(new File(msg.parts, msg.filename));
            return;
        }
    }, false);
});
