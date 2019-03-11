"use strict";
/// <reference path="../../built/pxtlib.d.ts" />
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var data = require("./data");
var sui = require("./sui");
var tutorial = require("./tutorial");
var container = require("./container");
var greenscreen = require("./greenscreen");
var core = require("./core");
// common menu items -- do not remove
// lf("About")
// lf("Getting started")
// lf("Buy")
// lf("Blocks")
// lf("JavaScript")
// lf("Examples")
// lf("Tutorials")
// lf("Projects")
// lf("Reference")
// lf("Support")
// lf("Hardware")
function openTutorial(parent, path) {
    pxt.tickEvent("docs", { path: path }, { interactiveConsent: true });
    parent.startTutorial(path);
}
function openDocs(parent, path) {
    pxt.tickEvent("docs", { path: path }, { interactiveConsent: true });
    parent.setSideDoc(path);
}
function renderDocItems(parent, cls) {
    var targetTheme = pxt.appTarget.appTheme;
    return targetTheme.docMenu.map(function (m) {
        return m.tutorial ? React.createElement(DocsMenuItem, { key: "docsmenututorial" + m.path, role: "menuitem", ariaLabel: pxt.Util.rlf(m.name), text: pxt.Util.rlf(m.name), className: "ui " + cls, parent: parent, path: m.path, onItemClick: openTutorial })
            : !/^\//.test(m.path) ? React.createElement("a", { key: "docsmenulink" + m.path, role: "menuitem", "aria-label": m.name, title: m.name, className: "ui item link " + cls, href: m.path, target: "docs" }, pxt.Util.rlf(m.name))
                : React.createElement(DocsMenuItem, { key: "docsmenu" + m.path, role: "menuitem", ariaLabel: pxt.Util.rlf(m.name), text: pxt.Util.rlf(m.name), className: "ui " + cls, parent: parent, path: m.path, onItemClick: openDocs });
    });
}
var DocsMenu = /** @class */ (function (_super) {
    __extends(DocsMenu, _super);
    function DocsMenu(props) {
        return _super.call(this, props) || this;
    }
    DocsMenu.prototype.lookUpByPath = function (path) {
        var _this = this;
        if (!this.docMenuCache) {
            this.docMenuCache = {};
            // Populate the cache
            var targetTheme = pxt.appTarget.appTheme;
            targetTheme.docMenu.forEach(function (m) {
                _this.docMenuCache[m.path] = m;
            });
        }
        return this.docMenuCache[path];
    };
    DocsMenu.prototype.doDocEntryAction = function (parent, m) {
        if (m.tutorial) {
            return function () { openTutorial(parent, m.path); };
        }
        else if (!/^\//.test(m.path) && !m.popout) {
            return function () { window.open(m.path, "docs"); };
        }
        else if (m.popout) {
            return function () { window.open("" + pxt.appTarget.appTheme.homeUrl + m.path, "docs"); };
        }
        else {
            return function () { openDocs(parent, m.path); };
        }
    };
    DocsMenu.prototype.renderCore = function () {
        var _this = this;
        var parent = this.props.parent;
        var targetTheme = pxt.appTarget.appTheme;
        var options = targetTheme.docMenu.map(function (m) {
            return {
                key: "docsmenu" + m.path,
                content: pxt.Util.rlf(m.name),
                role: "menuitem",
                'aria-label': pxt.Util.rlf(m.name),
                onClick: _this.doDocEntryAction(parent, m),
                value: m.path,
                onKeyDown: function () {
                    console.log("Key DOWN");
                }
            };
        });
        var onChange = function (e, data) {
            var m = _this.lookUpByPath(data.value);
            _this.doDocEntryAction(parent, m)();
        };
        return React.createElement(sui.DropdownMenu, { role: "menuitem", icon: "help circle large", className: "item mobile hide help-dropdown-menuitem", textClass: "landscape only", title: lf("Help") }, renderDocItems(this.props.parent, ""));
    };
    return DocsMenu;
}(data.PureComponent));
exports.DocsMenu = DocsMenu;
var DocsMenuItem = /** @class */ (function (_super) {
    __extends(DocsMenuItem, _super);
    function DocsMenuItem(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }
    DocsMenuItem.prototype.handleClick = function () {
        var _a = this.props, onItemClick = _a.onItemClick, parent = _a.parent, path = _a.path;
        onItemClick(parent, path);
    };
    DocsMenuItem.prototype.renderCore = function () {
        var _a = this.props, onClick = _a.onClick, onItemClick = _a.onItemClick, parent = _a.parent, path = _a.path, rest = __rest(_a, ["onClick", "onItemClick", "parent", "path"]);
        return React.createElement(sui.Item, __assign({}, rest, { onClick: this.handleClick }));
    };
    return DocsMenuItem;
}(sui.StatelessUIElement));
var SettingsMenu = /** @class */ (function (_super) {
    __extends(SettingsMenu, _super);
    function SettingsMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.openSettings = _this.openSettings.bind(_this);
        _this.showPackageDialog = _this.showPackageDialog.bind(_this);
        _this.showBoardDialog = _this.showBoardDialog.bind(_this);
        _this.removeProject = _this.removeProject.bind(_this);
        _this.saveProject = _this.saveProject.bind(_this);
        _this.toggleCollapse = _this.toggleCollapse.bind(_this);
        _this.showReportAbuse = _this.showReportAbuse.bind(_this);
        _this.showLanguagePicker = _this.showLanguagePicker.bind(_this);
        _this.toggleHighContrast = _this.toggleHighContrast.bind(_this);
        _this.toggleGreenScreen = _this.toggleGreenScreen.bind(_this);
        _this.showResetDialog = _this.showResetDialog.bind(_this);
        _this.showShareDialog = _this.showShareDialog.bind(_this);
        _this.pair = _this.pair.bind(_this);
        _this.pairBluetooth = _this.pairBluetooth.bind(_this);
        _this.showAboutDialog = _this.showAboutDialog.bind(_this);
        _this.print = _this.print.bind(_this);
        return _this;
    }
    SettingsMenu.prototype.showShareDialog = function () {
        pxt.tickEvent("menu.share", undefined, { interactiveConsent: true });
        this.props.parent.showShareDialog();
    };
    SettingsMenu.prototype.openSettings = function () {
        pxt.tickEvent("menu.settings", undefined, { interactiveConsent: true });
        this.props.parent.openSettings();
    };
    SettingsMenu.prototype.showPackageDialog = function () {
        pxt.tickEvent("menu.addpackage", undefined, { interactiveConsent: true });
        this.props.parent.showPackageDialog();
    };
    SettingsMenu.prototype.showBoardDialog = function () {
        pxt.tickEvent("menu.changeboard", undefined, { interactiveConsent: true });
        if (pxt.hasHwVariants())
            this.props.parent.showChooseHwDialog();
        else
            this.props.parent.showBoardDialogAsync(undefined, true).done();
    };
    SettingsMenu.prototype.saveProject = function () {
        pxt.tickEvent("menu.saveproject", undefined, { interactiveConsent: true });
        this.props.parent.saveAndCompile();
    };
    SettingsMenu.prototype.removeProject = function () {
        pxt.tickEvent("menu.removeproject", undefined, { interactiveConsent: true });
        this.props.parent.removeProject();
    };
    SettingsMenu.prototype.toggleCollapse = function () {
        pxt.tickEvent("menu.toggleSim", undefined, { interactiveConsent: true });
        this.props.parent.toggleSimulatorCollapse();
    };
    SettingsMenu.prototype.showReportAbuse = function () {
        pxt.tickEvent("menu.reportabuse", undefined, { interactiveConsent: true });
        this.props.parent.showReportAbuse();
    };
    SettingsMenu.prototype.showLanguagePicker = function () {
        pxt.tickEvent("menu.langpicker", undefined, { interactiveConsent: true });
        this.props.parent.showLanguagePicker();
    };
    SettingsMenu.prototype.toggleHighContrast = function () {
        pxt.tickEvent("menu.togglecontrast", undefined, { interactiveConsent: true });
        this.props.parent.toggleHighContrast();
    };
    SettingsMenu.prototype.toggleGreenScreen = function () {
        pxt.tickEvent("menu.togglegreenscreen", undefined, { interactiveConsent: true });
        this.props.parent.toggleGreenScreen();
    };
    SettingsMenu.prototype.showResetDialog = function () {
        pxt.tickEvent("menu.reset", undefined, { interactiveConsent: true });
        pxt.tickEvent("reset"); // Deprecated, will Feb 2018.
        this.props.parent.showResetDialog();
    };
    SettingsMenu.prototype.pair = function () {
        pxt.tickEvent("menu.pair");
        this.props.parent.pair();
    };
    SettingsMenu.prototype.pairBluetooth = function () {
        pxt.tickEvent("menu.pair.bluetooth");
        core.showLoading("webblepair", lf("Pairing Bluetooth device..."));
        pxt.webBluetooth.pairAsync()
            .then(function () { return core.hideLoading("webblepair"); });
    };
    SettingsMenu.prototype.showAboutDialog = function () {
        pxt.tickEvent("menu.about");
        this.props.parent.showAboutDialog();
    };
    SettingsMenu.prototype.print = function () {
        this.props.parent.printCode();
    };
    SettingsMenu.prototype.componentWillReceiveProps = function (nextProps) {
        var newState = {};
        if (nextProps.highContrast != undefined) {
            newState.highContrast = nextProps.highContrast;
        }
        if (nextProps.greenScreen !== undefined) {
            newState.greenScreen = nextProps.greenScreen;
        }
        if (Object.keys(newState).length > 0)
            this.setState(newState);
    };
    SettingsMenu.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
        return this.state.highContrast != nextState.highContrast
            || this.state.greenScreen != nextState.greenScreen;
    };
    SettingsMenu.prototype.renderCore = function () {
        var _a = this.state, highContrast = _a.highContrast, greenScreen = _a.greenScreen;
        var targetTheme = pxt.appTarget.appTheme;
        var packages = pxt.appTarget.cloud && !!pxt.appTarget.cloud.packages;
        var boards = pxt.appTarget.simulator && !!pxt.appTarget.simulator.dynamicBoardDefinition;
        var reportAbuse = pxt.appTarget.cloud && pxt.appTarget.cloud.sharing && pxt.appTarget.cloud.importing;
        var readOnly = pxt.shell.isReadOnly();
        var isController = pxt.shell.isControllerMode();
        var disableFileAccessinMaciOs = targetTheme.disableFileAccessinMaciOs && (pxt.BrowserUtils.isIOS() || pxt.BrowserUtils.isMac());
        var showSave = !readOnly && !isController && !!targetTheme.saveInMenu && !disableFileAccessinMaciOs;
        var showSimCollapse = !readOnly && !isController && !!targetTheme.simCollapseInMenu;
        var showGreenScreen = (targetTheme.greenScreen || /greenscreen=1/i.test(window.location.href))
            && greenscreen.isSupported();
        return React.createElement(sui.DropdownMenu, { role: "menuitem", icon: 'setting large', title: lf("More..."), className: "item icon more-dropdown-menuitem" },
            React.createElement(sui.Item, { role: "menuitem", icon: "options", text: lf("Project Settings"), onClick: this.openSettings }),
            packages ? React.createElement(sui.Item, { role: "menuitem", icon: "disk outline", text: lf("Extensions"), onClick: this.showPackageDialog }) : undefined,
            boards ? React.createElement(sui.Item, { role: "menuitem", icon: "microchip", text: lf("Change Board"), onClick: this.showBoardDialog }) : undefined,
            targetTheme.print ? React.createElement(sui.Item, { role: "menuitem", icon: "print", text: lf("Print..."), onClick: this.print }) : undefined,
            showSave ? React.createElement(sui.Item, { role: "menuitem", icon: "save", text: lf("Save Project"), onClick: this.saveProject }) : undefined,
            !isController ? React.createElement(sui.Item, { role: "menuitem", icon: "trash", text: lf("Delete Project"), onClick: this.removeProject }) : undefined,
            showSimCollapse ? React.createElement(sui.Item, { role: "menuitem", icon: 'toggle right', text: lf("Toggle the simulator"), onClick: this.toggleCollapse }) : undefined,
            reportAbuse ? React.createElement(sui.Item, { role: "menuitem", icon: "warning circle", text: lf("Report Abuse..."), onClick: this.showReportAbuse }) : undefined,
            React.createElement("div", { className: "ui divider" }),
            targetTheme.selectLanguage ? React.createElement(sui.Item, { icon: 'xicon globe', role: "menuitem", text: lf("Language"), onClick: this.showLanguagePicker }) : undefined,
            targetTheme.highContrast ? React.createElement(sui.Item, { role: "menuitem", text: highContrast ? lf("High Contrast Off") : lf("High Contrast On"), onClick: this.toggleHighContrast }) : undefined,
            showGreenScreen ? React.createElement(sui.Item, { role: "menuitem", text: greenScreen ? lf("Green Screen Off") : lf("Green Screen On"), onClick: this.toggleGreenScreen }) : undefined,
            !isController ? React.createElement(sui.Item, { role: "menuitem", icon: 'sign out', text: lf("Reset"), onClick: this.showResetDialog }) : undefined,
            pxt.usb.isEnabled ? React.createElement(sui.Item, { role: "menuitem", icon: 'usb', text: lf("Pair device"), onClick: this.pair }) : undefined,
            pxt.webBluetooth.isAvailable() ? React.createElement(sui.Item, { role: "menuitem", icon: 'bluetooth', text: lf("Pair Bluetooth"), onClick: this.pairBluetooth }) : undefined,
            React.createElement("div", { className: "ui mobile only divider" }),
            renderDocItems(this.props.parent, "mobile only"),
            React.createElement("div", { className: "ui divider" }),
            React.createElement(sui.Item, { role: "menuitem", text: lf("About..."), onClick: this.showAboutDialog }),
            targetTheme.feedbackUrl ? React.createElement("a", { className: "ui item", href: targetTheme.feedbackUrl, role: "menuitem", title: lf("Give Feedback"), target: "_blank", rel: "noopener noreferrer" }, lf("Give Feedback")) : undefined);
    };
    return SettingsMenu;
}(data.Component));
exports.SettingsMenu = SettingsMenu;
var MainMenu = /** @class */ (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.brandIconClick = _this.brandIconClick.bind(_this);
        _this.orgIconClick = _this.orgIconClick.bind(_this);
        _this.goHome = _this.goHome.bind(_this);
        _this.showShareDialog = _this.showShareDialog.bind(_this);
        _this.launchFullEditor = _this.launchFullEditor.bind(_this);
        _this.openSimView = _this.openSimView.bind(_this);
        _this.openBlocks = _this.openBlocks.bind(_this);
        _this.openJavaScript = _this.openJavaScript.bind(_this);
        _this.exitTutorial = _this.exitTutorial.bind(_this);
        _this.showReportAbuse = _this.showReportAbuse.bind(_this);
        return _this;
    }
    MainMenu.prototype.brandIconClick = function () {
        var hasHome = !pxt.shell.isControllerMode();
        if (!hasHome)
            return;
        pxt.tickEvent("menu.brand", undefined, { interactiveConsent: true });
        this.props.parent.showExitAndSaveDialog();
    };
    MainMenu.prototype.orgIconClick = function () {
        pxt.tickEvent("menu.org", undefined, { interactiveConsent: true });
    };
    MainMenu.prototype.goHome = function () {
        pxt.tickEvent("menu.home", undefined, { interactiveConsent: true });
        this.props.parent.showExitAndSaveDialog();
    };
    MainMenu.prototype.showShareDialog = function () {
        pxt.tickEvent("menu.share", undefined, { interactiveConsent: true });
        this.props.parent.showShareDialog();
    };
    MainMenu.prototype.launchFullEditor = function () {
        pxt.tickEvent("sandbox.openfulleditor", undefined, { interactiveConsent: true });
        this.props.parent.launchFullEditor();
    };
    MainMenu.prototype.openSimView = function () {
        pxt.tickEvent("menu.simView", undefined, { interactiveConsent: true });
        this.props.parent.openSimView();
    };
    MainMenu.prototype.openBlocks = function () {
        pxt.tickEvent("menu.blocks", undefined, { interactiveConsent: true });
        this.props.parent.openBlocks();
    };
    MainMenu.prototype.openJavaScript = function () {
        pxt.tickEvent("menu.javascript", undefined, { interactiveConsent: true });
        this.props.parent.openJavaScript();
    };
    MainMenu.prototype.exitTutorial = function () {
        pxt.tickEvent("menu.exitTutorial", undefined, { interactiveConsent: true });
        this.props.parent.exitTutorial();
    };
    MainMenu.prototype.showReportAbuse = function () {
        pxt.tickEvent("tutorial.reportabuse", undefined, { interactiveConsent: true });
        this.props.parent.showReportAbuse();
    };
    MainMenu.prototype.renderCore = function () {
        var _a = this.props.parent.state, home = _a.home, header = _a.header, highContrast = _a.highContrast, greenScreen = _a.greenScreen, simState = _a.simState;
        if (home)
            return React.createElement("div", null); // Don't render if we're on the home screen
        var targetTheme = pxt.appTarget.appTheme;
        var isController = pxt.shell.isControllerMode();
        var homeEnabled = !isController;
        var sandbox = pxt.shell.isSandboxMode();
        var tutorialOptions = this.props.parent.state.tutorialOptions;
        var inTutorial = !!tutorialOptions && !!tutorialOptions.tutorial;
        var tutorialReportId = tutorialOptions && tutorialOptions.tutorialReportId;
        var docMenu = targetTheme.docMenu && targetTheme.docMenu.length && !sandbox && !inTutorial;
        var isRunning = simState == pxt.editor.SimState.Running;
        var hc = !!this.props.parent.state.highContrast;
        var showShare = !inTutorial && header && pxt.appTarget.cloud && pxt.appTarget.cloud.sharing && !isController;
        var logo = (hc ? targetTheme.highContrastLogo : undefined) || targetTheme.logo;
        var portraitLogo = (hc ? targetTheme.highContrastPortraitLogo : undefined) || targetTheme.portraitLogo;
        var rightLogo = sandbox ? targetTheme.portraitLogo : targetTheme.rightLogo;
        var logoWide = !!targetTheme.logoWide;
        var portraitLogoSize = logoWide ? "small" : "mini";
        var simActive = this.props.parent.isEmbedSimActive();
        var blockActive = this.props.parent.isBlocksActive();
        var javascriptActive = this.props.parent.isJavaScriptActive();
        var runTooltip = isRunning ? lf("Stop the simulator") : lf("Start the simulator");
        /* tslint:disable:react-a11y-anchors */
        return React.createElement("div", { id: "mainmenu", className: "ui borderless fixed " + (targetTheme.invertedMenu ? "inverted" : '') + " menu", role: "menubar", "aria-label": lf("Main menu") },
            !sandbox ? React.createElement("div", { className: "left menu" },
                targetTheme.hideMenubarLogo ? undefined :
                    React.createElement("a", { href: isController ? targetTheme.logoUrl : undefined, "aria-label": lf("{0} Logo", targetTheme.boardName), role: "menuitem", target: "blank", rel: "noopener", className: "ui item logo brand", tabIndex: 0, onClick: this.brandIconClick, onKeyDown: sui.fireClickOnEnter },
                        logo || portraitLogo
                            ? React.createElement("img", { className: "ui logo " + (logo ? " portrait hide" : ''), src: logo || portraitLogo, alt: lf("{0} Logo", targetTheme.boardName) })
                            : React.createElement("span", { className: "name" }, targetTheme.boardName),
                        portraitLogo ? (React.createElement("img", { className: "ui " + portraitLogoSize + " image portrait only", src: portraitLogo, alt: lf("{0} Logo", targetTheme.boardName) })) : null),
                targetTheme.betaUrl ? React.createElement("a", { href: "" + targetTheme.betaUrl, className: "ui red mini corner top left attached label betalabel", role: "menuitem" }, lf("Beta")) : undefined,
                !inTutorial && homeEnabled ? React.createElement(sui.Item, { className: "icon openproject", role: "menuitem", textClass: "landscape only", icon: "home large", ariaLabel: lf("Home screen"), text: lf("Home"), onClick: this.goHome }) : null,
                showShare ? React.createElement(sui.Item, { className: "icon shareproject", role: "menuitem", textClass: "widedesktop only", ariaLabel: lf("Share Project"), text: lf("Share"), icon: "share alternate large", onClick: this.showShareDialog }) : null,
                inTutorial ? React.createElement(sui.Item, { className: "tutorialname", tabIndex: -1, textClass: "landscape only", text: tutorialOptions.tutorialName }) : null) : React.createElement("div", { className: "left menu" },
                React.createElement("span", { id: "logo", className: "ui item logo" },
                    React.createElement("img", { className: "ui mini image", src: rightLogo, tabIndex: 0, onClick: this.launchFullEditor, onKeyDown: sui.fireClickOnEnter, alt: targetTheme.boardName + " Logo" }))),
            !inTutorial && !targetTheme.blocksOnly ? React.createElement("div", { className: "ui item link editor-menuitem" },
                React.createElement("div", { className: "ui grid padded" },
                    sandbox ? React.createElement(sui.Item, { className: "sim-menuitem", role: "menuitem", textClass: "landscape only", text: lf("Simulator"), icon: simActive && isRunning ? "stop" : "play", active: simActive, onClick: this.openSimView, title: !simActive ? lf("Show Simulator") : runTooltip }) : undefined,
                    React.createElement(sui.Item, { className: "blocks-menuitem", role: "menuitem", textClass: "landscape only", text: lf("Blocks"), icon: "xicon blocks", active: blockActive, onClick: this.openBlocks, title: lf("Convert code to Blocks") }),
                    React.createElement(sui.Item, { className: "javascript-menuitem", role: "menuitem", textClass: "landscape only", text: lf("JavaScript"), icon: "xicon js", active: javascriptActive, onClick: this.openJavaScript, title: lf("Convert code to JavaScript") }),
                    React.createElement("div", { className: "ui item toggle" }))) : undefined,
            inTutorial ? React.createElement(tutorial.TutorialMenuItem, { parent: this.props.parent }) : undefined,
            React.createElement("div", { className: "right menu" },
                docMenu ? React.createElement(container.DocsMenu, { parent: this.props.parent }) : undefined,
                sandbox || inTutorial ? undefined : React.createElement(container.SettingsMenu, { parent: this.props.parent, highContrast: highContrast, greenScreen: greenScreen }),
                sandbox && !targetTheme.hideEmbedEdit ? React.createElement(sui.Item, { role: "menuitem", icon: "external", textClass: "mobile hide", text: lf("Edit"), onClick: this.launchFullEditor }) : undefined,
                inTutorial && tutorialReportId ? React.createElement(sui.ButtonMenuItem, { className: "report-tutorial-btn", role: "menuitem", icon: "warning circle", text: lf("Report Abuse"), textClass: "landscape only", onClick: this.showReportAbuse }) : undefined,
                inTutorial ? React.createElement(sui.ButtonMenuItem, { className: "exit-tutorial-btn", role: "menuitem", icon: "external", text: lf("Exit tutorial"), textClass: "landscape only", onClick: this.exitTutorial }) : undefined,
                !sandbox ? React.createElement("a", { href: targetTheme.organizationUrl, "aria-label": lf("{0} Logo", targetTheme.organization), role: "menuitem", target: "blank", rel: "noopener", className: "ui item logo organization", onClick: this.orgIconClick },
                    targetTheme.organizationWideLogo || targetTheme.organizationLogo
                        ? React.createElement("img", { className: "ui logo " + (targetTheme.organizationWideLogo ? " portrait hide" : ''), src: targetTheme.organizationWideLogo || targetTheme.organizationLogo, alt: lf("{0} Logo", targetTheme.organization) })
                        : React.createElement("span", { className: "name" }, targetTheme.organization),
                    targetTheme.organizationLogo ? (React.createElement("img", { className: 'ui mini image portrait only', src: targetTheme.organizationLogo, alt: lf("{0} Logo", targetTheme.organization) })) : null) : undefined));
        /* tslint:enable:react-a11y-anchors */
    };
    return MainMenu;
}(data.Component));
exports.MainMenu = MainMenu;
var SideDocs = /** @class */ (function (_super) {
    __extends(SideDocs, _super);
    function SideDocs(props) {
        var _this = _super.call(this, props) || this;
        _this.openingSideDoc = false;
        _this.state = {};
        _this.toggleVisibility = _this.toggleVisibility.bind(_this);
        _this.popOut = _this.popOut.bind(_this);
        return _this;
    }
    SideDocs.notify = function (message) {
        var sd = document.getElementById("sidedocsframe");
        if (sd && sd.contentWindow)
            sd.contentWindow.postMessage(message, "*");
    };
    SideDocs.prototype.setPath = function (path, blocksEditor) {
        this.openingSideDoc = true;
        var docsUrl = pxt.webConfig.docsUrl || '/--docs';
        var mode = blocksEditor ? "blocks" : "js";
        var url = docsUrl + "#doc:" + path + ":" + mode + ":" + pxt.Util.localeInfo();
        this.setUrl(url);
    };
    SideDocs.prototype.setMarkdown = function (md) {
        var docsUrl = pxt.webConfig.docsUrl || '/--docs';
        // always render blocks by default when sending custom markdown
        // to side bar
        var mode = "blocks"; // this.props.parent.isBlocksEditor() ? "blocks" : "js";
        var url = docsUrl + "#md:" + encodeURIComponent(md) + ":" + mode + ":" + pxt.Util.localeInfo();
        this.setUrl(url);
    };
    SideDocs.prototype.setUrl = function (url) {
        this.props.parent.setState({ sideDocsLoadUrl: url, sideDocsCollapsed: false });
    };
    SideDocs.prototype.collapse = function () {
        this.props.parent.setState({ sideDocsCollapsed: true });
    };
    SideDocs.prototype.popOut = function () {
        SideDocs.notify({
            type: "popout"
        });
    };
    SideDocs.prototype.toggleVisibility = function () {
        var state = this.props.parent.state;
        this.props.parent.setState({ sideDocsCollapsed: !state.sideDocsCollapsed });
        document.getElementById("sidedocstoggle").focus();
    };
    SideDocs.prototype.componentDidUpdate = function () {
        this.props.parent.editor.resize();
        var sidedocstoggle = document.getElementById("sidedocstoggle");
        if (this.openingSideDoc && sidedocstoggle) {
            sidedocstoggle.focus();
            this.openingSideDoc = false;
        }
    };
    SideDocs.prototype.componentWillReceiveProps = function (nextProps) {
        var newState = {};
        if (nextProps.sideDocsCollapsed != undefined) {
            newState.sideDocsCollapsed = nextProps.sideDocsCollapsed;
        }
        if (nextProps.docsUrl != undefined) {
            newState.docsUrl = nextProps.docsUrl;
        }
        if (Object.keys(newState).length > 0)
            this.setState(newState);
    };
    SideDocs.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
        return this.state.sideDocsCollapsed != nextState.sideDocsCollapsed
            || this.state.docsUrl != nextState.docsUrl;
    };
    SideDocs.prototype.renderCore = function () {
        var _a = this.state, sideDocsCollapsed = _a.sideDocsCollapsed, docsUrl = _a.docsUrl;
        if (!docsUrl)
            return null;
        /* tslint:disable:react-iframe-missing-sandbox */
        return React.createElement("div", null,
            React.createElement("button", { id: "sidedocstoggle", role: "button", "aria-label": sideDocsCollapsed ? lf("Expand the side documentation") : lf("Collapse the side documentation"), className: "ui icon button", onClick: this.toggleVisibility },
                React.createElement(sui.Icon, { icon: "icon large inverted " + (sideDocsCollapsed ? 'book' : 'chevron right') }),
                sideDocsCollapsed ? React.createElement(sui.Icon, { icon: "large inverted chevron left hover" }) : undefined),
            React.createElement("div", { id: "sidedocs" },
                React.createElement("div", { id: "sidedocsframe-wrapper" },
                    React.createElement("iframe", { id: "sidedocsframe", src: docsUrl, title: lf("Documentation"), "aria-atomic": "true", "aria-live": "assertive", sandbox: "allow-scripts allow-same-origin allow-forms allow-popups" })),
                React.createElement("div", { className: "ui app hide", id: "sidedocsbar" },
                    React.createElement("a", { className: "ui icon link", role: "button", tabIndex: 0, "data-content": lf("Open documentation in new tab"), "aria-label": lf("Open documentation in new tab"), onClick: this.popOut, onKeyDown: sui.fireClickOnEnter },
                        React.createElement(sui.Icon, { icon: "external" })))));
        /* tslint:enable:react-iframe-missing-sandbox */
    };
    return SideDocs;
}(data.Component));
exports.SideDocs = SideDocs;
var SandboxFooter = /** @class */ (function (_super) {
    __extends(SandboxFooter, _super);
    function SandboxFooter(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.compile = _this.compile.bind(_this);
        return _this;
    }
    SandboxFooter.prototype.compile = function () {
        pxt.tickEvent("sandboxfooter.compile", undefined, { interactiveConsent: true });
        this.props.parent.compile();
    };
    SandboxFooter.prototype.renderCore = function () {
        var targetTheme = pxt.appTarget.appTheme;
        var compileTooltip = lf("Download your code to the {0}", targetTheme.boardName);
        /* tslint:disable:react-a11y-anchors */
        return React.createElement("div", { className: "ui horizontal small divided link list sandboxfooter" },
            targetTheme.organizationUrl && targetTheme.organization ? React.createElement("a", { className: "item", target: "_blank", rel: "noopener noreferrer", href: targetTheme.organizationUrl }, targetTheme.organization) : undefined,
            React.createElement("a", { target: "_blank", className: "item", href: targetTheme.termsOfUseUrl, rel: "noopener noreferrer" }, lf("Terms of Use")),
            React.createElement("a", { target: "_blank", className: "item", href: targetTheme.privacyUrl, rel: "noopener noreferrer" }, lf("Privacy")),
            React.createElement("span", { className: "item" },
                React.createElement("a", { role: "button", className: "ui thin portrait only", title: compileTooltip, onClick: this.compile },
                    React.createElement(sui.Icon, { icon: "icon " + (pxt.appTarget.appTheme.downloadIcon || 'download') }),
                    pxt.appTarget.appTheme.useUploadMessage ? lf("Upload") : lf("Download"))));
        /* tslint:enable:react-a11y-anchors */
    };
    return SandboxFooter;
}(data.PureComponent));
exports.SandboxFooter = SandboxFooter;
