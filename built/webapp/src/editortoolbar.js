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
var EditorToolbar = /** @class */ (function (_super) {
    __extends(EditorToolbar, _super);
    function EditorToolbar(props) {
        var _this = _super.call(this, props) || this;
        _this.saveProjectName = _this.saveProjectName.bind(_this);
        _this.compile = _this.compile.bind(_this);
        _this.saveFile = _this.saveFile.bind(_this);
        _this.undo = _this.undo.bind(_this);
        _this.redo = _this.redo.bind(_this);
        _this.zoomIn = _this.zoomIn.bind(_this);
        _this.zoomOut = _this.zoomOut.bind(_this);
        _this.startStopSimulator = _this.startStopSimulator.bind(_this);
        _this.restartSimulator = _this.restartSimulator.bind(_this);
        _this.toggleTrace = _this.toggleTrace.bind(_this);
        _this.toggleDebugging = _this.toggleDebugging.bind(_this);
        _this.toggleCollapse = _this.toggleCollapse.bind(_this);
        return _this;
    }
    EditorToolbar.prototype.saveProjectName = function (name, view) {
        pxt.tickEvent("editortools.projectrename", { view: view }, { interactiveConsent: true });
        this.props.parent.updateHeaderName(name);
    };
    EditorToolbar.prototype.compile = function (view) {
        pxt.tickEvent("editortools.download", { view: view, collapsed: this.getCollapsedState() }, { interactiveConsent: true });
        this.props.parent.compile();
    };
    EditorToolbar.prototype.saveFile = function (view) {
        pxt.tickEvent("editortools.save", { view: view, collapsed: this.getCollapsedState() }, { interactiveConsent: true });
        this.props.parent.saveAndCompile();
    };
    EditorToolbar.prototype.undo = function (view) {
        pxt.tickEvent("editortools.undo", { view: view, collapsed: this.getCollapsedState() }, { interactiveConsent: true });
        this.props.parent.editor.undo();
    };
    EditorToolbar.prototype.redo = function (view) {
        pxt.tickEvent("editortools.redo", { view: view, collapsed: this.getCollapsedState() }, { interactiveConsent: true });
        this.props.parent.editor.redo();
    };
    EditorToolbar.prototype.zoomIn = function (view) {
        pxt.tickEvent("editortools.zoomIn", { view: view, collapsed: this.getCollapsedState() }, { interactiveConsent: true });
        this.props.parent.editor.zoomIn();
    };
    EditorToolbar.prototype.zoomOut = function (view) {
        pxt.tickEvent("editortools.zoomOut", { view: view, collapsed: this.getCollapsedState() }, { interactiveConsent: true });
        this.props.parent.editor.zoomOut();
    };
    EditorToolbar.prototype.startStopSimulator = function (view) {
        pxt.tickEvent("editortools.startStopSimulator", { view: view, collapsed: this.getCollapsedState(), headless: this.getHeadlessState() }, { interactiveConsent: true });
        this.props.parent.startStopSimulator(true);
    };
    EditorToolbar.prototype.restartSimulator = function (view) {
        pxt.tickEvent("editortools.restart", { view: view, collapsed: this.getCollapsedState(), headless: this.getHeadlessState() }, { interactiveConsent: true });
        this.props.parent.restartSimulator();
    };
    EditorToolbar.prototype.toggleTrace = function (view) {
        pxt.tickEvent("editortools.trace", { view: view, collapsed: this.getCollapsedState(), headless: this.getHeadlessState() }, { interactiveConsent: true });
        this.props.parent.toggleTrace();
    };
    EditorToolbar.prototype.toggleDebugging = function (view) {
        pxt.tickEvent("editortools.debug", { view: view, collapsed: this.getCollapsedState(), headless: this.getHeadlessState() }, { interactiveConsent: true });
        this.props.parent.toggleDebugging();
    };
    EditorToolbar.prototype.toggleCollapse = function (view) {
        pxt.tickEvent("editortools.toggleCollapse", { view: view, collapsedTo: '' + !this.props.parent.state.collapseEditorTools }, { interactiveConsent: true });
        this.props.parent.toggleSimulatorCollapse();
    };
    EditorToolbar.prototype.getCollapsedState = function () {
        return '' + this.props.parent.state.collapseEditorTools;
    };
    EditorToolbar.prototype.getHeadlessState = function () {
        return pxt.appTarget.simulator.headless ? "true" : "false";
    };
    EditorToolbar.prototype.renderCore = function () {
        var _a = this.props.parent.state, home = _a.home, tutorialOptions = _a.tutorialOptions, hideEditorFloats = _a.hideEditorFloats, collapseEditorTools = _a.collapseEditorTools, projectName = _a.projectName, compiling = _a.compiling, isSaving = _a.isSaving, simState = _a.simState;
        if (home)
            return React.createElement("div", null); // Don't render if we're in the home screen
        var targetTheme = pxt.appTarget.appTheme;
        var sandbox = pxt.shell.isSandboxMode();
        var isController = pxt.shell.isControllerMode();
        var readOnly = pxt.shell.isReadOnly();
        var tutorial = tutorialOptions ? tutorialOptions.tutorial : false;
        var simOpts = pxt.appTarget.simulator;
        var headless = simOpts.headless;
        var collapsed = (hideEditorFloats || collapseEditorTools) && (!tutorial || headless);
        var isEditor = this.props.parent.isBlocksEditor() || this.props.parent.isTextEditor();
        if (!isEditor)
            return React.createElement("div", null);
        var disableFileAccessinMaciOs = targetTheme.disableFileAccessinMaciOs && (pxt.BrowserUtils.isIOS() || pxt.BrowserUtils.isMac());
        var showSave = !readOnly && !isController && !targetTheme.saveInMenu && !tutorial && !disableFileAccessinMaciOs;
        var compile = pxt.appTarget.compile;
        var compileBtn = compile.hasHex || compile.saveAsPNG || compile.useUF2;
        var compileTooltip = lf("Download your code to the {0}", targetTheme.boardName);
        var compileLoading = !!compiling;
        var running = simState == pxt.editor.SimState.Running;
        var starting = simState == pxt.editor.SimState.Starting;
        var runTooltip = [lf("Start the simulator"), lf("Starting the simulator"), lf("Stop the simulator")][simState || 0];
        var restartTooltip = lf("Restart the simulator");
        var collapseTooltip = collapsed ? lf("Show the simulator") : lf("Hide the simulator");
        var pairingButton = !!targetTheme.pairingButton;
        var hasUndo = this.props.parent.editor.hasUndo();
        var hasRedo = this.props.parent.editor.hasRedo();
        var showCollapsed = !tutorial && !sandbox && !targetTheme.simCollapseInMenu;
        var showProjectRename = !tutorial && !readOnly && !isController && !targetTheme.hideProjectRename;
        var showUndoRedo = !tutorial && !readOnly;
        var showZoomControls = true;
        var run = !targetTheme.bigRunButton;
        var restart = run && !simOpts.hideRestart;
        var trace = !!targetTheme.enableTrace;
        var tracing = this.props.parent.state.tracing;
        var traceTooltip = tracing ? lf("Disable Slow-Mo") : lf("Slow-Mo");
        var debug = !!targetTheme.debugger && !readOnly;
        var debugging = this.props.parent.state.debugging;
        var debugTooltip = debugging ? lf("Disable Debugging") : lf("Debugging");
        var downloadIcon = pxt.appTarget.appTheme.downloadIcon || "download";
        var downloadText = pxt.appTarget.appTheme.useUploadMessage ? lf("Upload") : lf("Download");
        var bigRunButtonTooltip = [lf("Stop"), lf("Starting"), lf("Run Code in Game")][simState || 0];
        var downloadButtonClasses = "";
        var saveButtonClasses = "";
        if (isSaving) {
            downloadButtonClasses = "disabled";
            saveButtonClasses = "loading disabled";
        }
        else if (compileLoading) {
            downloadButtonClasses = "loading disabled";
            saveButtonClasses = "disabled";
        }
        var isRtl = pxt.Util.isUserLanguageRtl();
        return React.createElement("div", { className: "ui equal width grid right aligned padded" },
            React.createElement("div", { className: "column mobile only" }, collapsed ?
                React.createElement("div", { className: "ui grid" },
                    !targetTheme.bigRunButton ? React.createElement("div", { className: "left aligned column six wide" },
                        React.createElement("div", { className: "ui icon small buttons" },
                            showCollapsed ? React.createElement(EditorToolbarButton, { icon: "" + (collapsed ? 'toggle up' : 'toggle down'), className: "collapse-button " + (collapsed ? 'collapsed' : '') + " " + (hideEditorFloats ? 'disabled' : ''), ariaLabel: lf("{0}, {1}", collapseTooltip, hideEditorFloats ? lf("Disabled") : ""), title: collapseTooltip, onButtonClick: this.toggleCollapse, view: 'mobile' }) : undefined,
                            headless && run ? React.createElement(EditorToolbarButton, { className: "play-button " + (running ? "stop" : "play"), key: 'runmenubtn', disabled: starting, icon: running ? "stop" : "play", title: runTooltip, onButtonClick: this.startStopSimulator, view: 'mobile' }) : undefined,
                            headless && restart ? React.createElement(EditorToolbarButton, { key: 'restartbtn', className: "restart-button", icon: "refresh", title: restartTooltip, onButtonClick: this.restartSimulator, view: 'mobile' }) : undefined,
                            headless && trace ? React.createElement(EditorToolbarButton, { key: 'tracebtn', className: "trace-button " + (tracing ? 'orange' : ''), icon: "xicon turtle", title: traceTooltip, onButtonClick: this.toggleTrace, view: 'mobile' }) : undefined,
                            headless && debug ? React.createElement(EditorToolbarButton, { key: 'debugbtn', className: "debug-button " + (debugging ? 'orange' : ''), icon: "xicon bug", title: debugTooltip, onButtonClick: this.toggleDebugging, view: 'mobile' }) : undefined,
                            compileBtn ? React.createElement(EditorToolbarButton, { className: "primary download-button download-button-full " + downloadButtonClasses, icon: downloadIcon, title: compileTooltip, ariaLabel: lf("Download your code"), onButtonClick: this.compile, view: 'mobile' }) : undefined)) : undefined,
                    React.createElement("div", { className: "column right aligned " + (targetTheme.bigRunButton ? 'sixteen' : 'ten') + " wide" },
                        !readOnly ?
                            React.createElement("div", { className: "ui icon small buttons" },
                                showSave ? React.createElement(EditorToolbarButton, { icon: 'save', className: "editortools-btn save-editortools-btn " + saveButtonClasses, title: lf("Save"), ariaLabel: lf("Save the project"), onButtonClick: this.saveFile, view: 'mobile' }) : undefined,
                                showUndoRedo ? React.createElement(EditorToolbarButton, { icon: 'xicon undo', className: "editortools-btn undo-editortools-btn} " + (!hasUndo ? 'disabled' : ''), ariaLabel: lf("{0}, {1}", lf("Undo"), !hasUndo ? lf("Disabled") : ""), title: lf("Undo"), onButtonClick: this.undo, view: 'mobile' }) : undefined) : undefined,
                        showZoomControls ?
                            React.createElement("div", { className: "ui icon small buttons" },
                                React.createElement(EditorToolbarButton, { icon: 'minus circle', className: "editortools-btn zoomout-editortools-btn", title: lf("Zoom Out"), onButtonClick: this.zoomOut, view: 'mobile' }),
                                React.createElement(EditorToolbarButton, { icon: 'plus circle', className: "editortools-btn zoomin-editortools-btn", title: lf("Zoom In"), onButtonClick: this.zoomIn, view: 'mobile' })) : undefined,
                        targetTheme.bigRunButton ?
                            React.createElement("div", { className: "big-play-button-wrapper" },
                                React.createElement(EditorToolbarButton, { role: "menuitem", className: "big-play-button play-button " + (running ? "stop" : "play"), key: 'runmenubtn', disabled: starting, icon: running ? "stop" : "play", title: bigRunButtonTooltip, onButtonClick: this.startStopSimulator, view: 'mobile' })) : undefined)) :
                React.createElement("div", { className: "ui equal width grid" },
                    React.createElement("div", { className: "left aligned two wide column" },
                        React.createElement("div", { className: "ui vertical icon small buttons" },
                            run ? React.createElement(EditorToolbarButton, { className: "play-button " + (running ? "stop" : "play"), key: 'runmenubtn', disabled: starting, icon: running ? "stop" : "play", title: runTooltip, onButtonClick: this.startStopSimulator, view: 'mobile' }) : undefined,
                            restart ? React.createElement(EditorToolbarButton, { key: 'restartbtn', className: "restart-button", icon: "refresh", title: restartTooltip, onButtonClick: this.restartSimulator, view: 'mobile' }) : undefined),
                        showCollapsed ?
                            React.createElement("div", { className: "row", style: { paddingTop: "1rem" } },
                                React.createElement("div", { className: "ui vertical icon small buttons" },
                                    React.createElement(EditorToolbarButton, { icon: "" + (collapsed ? 'toggle up' : 'toggle down'), className: "collapse-button " + (collapsed ? 'collapsed' : ''), title: collapseTooltip, ariaLabel: lf("{0}, {1}", collapseTooltip, collapsed ? lf("Collapsed") : "Expanded"), onButtonClick: this.toggleCollapse, view: 'mobile' }))) : undefined),
                    React.createElement("div", { className: "three wide column" }),
                    React.createElement("div", { className: "column" },
                        React.createElement("div", { className: "ui grid" },
                            readOnly || !showUndoRedo ? undefined :
                                React.createElement("div", { className: "row" },
                                    React.createElement("div", { className: "column" },
                                        React.createElement("div", { className: "ui icon large buttons" },
                                            React.createElement(EditorToolbarButton, { icon: 'xicon undo', className: "editortools-btn undo-editortools-btn " + (!hasUndo ? 'disabled' : ''), ariaLabel: lf("{0}, {1}", lf("Undo"), !hasUndo ? lf("Disabled") : ""), title: lf("Undo"), onButtonClick: this.undo, view: 'mobile' })))),
                            React.createElement("div", { className: "row", style: readOnly || !showUndoRedo ? undefined : { paddingTop: 0 } },
                                React.createElement("div", { className: "column" },
                                    React.createElement("div", { className: "ui icon large buttons" },
                                        trace ? React.createElement(EditorToolbarButton, { key: 'tracebtn', className: "trace-button " + (tracing ? 'orange' : ''), icon: "xicon turtle", title: traceTooltip, onButtonClick: this.toggleTrace, view: 'mobile' }) : undefined,
                                        debug ? React.createElement(EditorToolbarButton, { key: 'debugbtn', className: "debug-button " + (debugging ? 'orange' : ''), icon: "xicon bug", title: debugTooltip, onButtonClick: this.toggleDebugging, view: 'mobile' }) : undefined,
                                        compileBtn ? React.createElement(EditorToolbarButton, { className: "primary download-button download-button-full " + downloadButtonClasses, icon: downloadIcon, title: compileTooltip, onButtonClick: this.compile, view: 'mobile' }) : undefined))))))),
            React.createElement("div", { className: "column tablet only" }, collapsed ?
                React.createElement("div", { className: "ui grid seven column" },
                    headless ?
                        React.createElement("div", { className: "left aligned six wide column" },
                            React.createElement("div", { className: "ui icon buttons" },
                                showCollapsed ? React.createElement(EditorToolbarButton, { icon: "" + (collapsed ? 'toggle up' : 'toggle down'), className: "collapse-button " + (collapsed ? 'collapsed' : '') + " " + (hideEditorFloats ? 'disabled' : ''), ariaLabel: lf("{0}, {1}", collapseTooltip, hideEditorFloats ? lf("Disabled") : ""), title: collapseTooltip, onButtonClick: this.toggleCollapse, view: 'tablet' }) : undefined,
                                run ? React.createElement(EditorToolbarButton, { role: "menuitem", className: "play-button " + (running ? "stop" : "play"), key: 'runmenubtn', disabled: starting, icon: running ? "stop" : "play", title: runTooltip, onButtonClick: this.startStopSimulator, view: 'tablet' }) : undefined,
                                restart ? React.createElement(EditorToolbarButton, { key: 'restartbtn', className: "restart-button", icon: "refresh", title: restartTooltip, onButtonClick: this.restartSimulator, view: 'tablet' }) : undefined,
                                trace ? React.createElement(EditorToolbarButton, { key: 'tracebtn', className: "trace-button " + (tracing ? 'orange' : ''), icon: "xicon turtle", title: traceTooltip, onButtonClick: this.toggleTrace, view: 'tablet' }) : undefined,
                                debug ? React.createElement(EditorToolbarButton, { key: 'debug', className: "debug-button " + (debugging ? 'orange' : ''), icon: "xicon bug", title: debugTooltip, onButtonClick: this.toggleDebugging, view: 'tablet' }) : undefined,
                                compileBtn ? React.createElement(EditorToolbarButton, { className: "primary download-button download-button-full " + downloadButtonClasses, icon: downloadIcon, title: compileTooltip, onButtonClick: this.compile, view: 'tablet' }) : undefined)) :
                        React.createElement("div", { className: "left aligned six wide column" },
                            React.createElement("div", { className: "ui icon buttons" },
                                showCollapsed ? React.createElement(EditorToolbarButton, { icon: "" + (collapsed ? 'toggle up' : 'toggle down'), className: "collapse-button " + (collapsed ? 'collapsed' : '') + " " + (hideEditorFloats ? 'disabled' : ''), ariaLabel: lf("{0}, {1}", collapseTooltip, hideEditorFloats ? lf("Disabled") : ""), title: collapseTooltip, onButtonClick: this.toggleCollapse, view: 'tablet' }) : undefined,
                                compileBtn ? React.createElement(EditorToolbarButton, { className: "primary download-button download-button-full " + downloadButtonClasses, icon: downloadIcon, text: downloadText, title: compileTooltip, onButtonClick: this.compile, view: 'tablet' }) : undefined)),
                    showSave ? React.createElement("div", { className: "column four wide" },
                        React.createElement(EditorToolbarButton, { icon: 'save', className: "small editortools-btn save-editortools-btn " + saveButtonClasses, title: lf("Save"), ariaLabel: lf("Save the project"), onButtonClick: this.saveFile, view: 'tablet' })) : undefined,
                    React.createElement("div", { className: "column " + (showSave ? 'six' : 'ten') + " wide right aligned" },
                        showUndoRedo ?
                            React.createElement("div", { className: "ui icon small buttons" },
                                React.createElement(EditorToolbarButton, { icon: 'xicon undo', className: "editortools-btn undo-editortools-btn " + (!hasUndo ? 'disabled' : ''), ariaLabel: lf("{0}, {1}", lf("Undo"), !hasUndo ? lf("Disabled") : ""), title: lf("Undo"), onButtonClick: this.undo, view: 'tablet' }),
                                React.createElement(EditorToolbarButton, { icon: 'xicon redo', className: "editortools-btn redo-editortools-btn " + (!hasRedo ? 'disabled' : ''), ariaLabel: lf("{0}, {1}", lf("Red"), !hasRedo ? lf("Disabled") : ""), title: lf("Redo"), onButtonClick: this.redo, view: 'tablet' })) : undefined,
                        showZoomControls ?
                            React.createElement("div", { className: "ui icon small buttons" },
                                React.createElement(EditorToolbarButton, { icon: 'minus circle', className: "editortools-btn zoomout-editortools-btn", title: lf("Zoom Out"), onButtonClick: this.zoomOut, view: 'tablet' }),
                                React.createElement(EditorToolbarButton, { icon: 'plus circle', className: "editortools-btn zoomin-editortools-btn", title: lf("Zoom In"), onButtonClick: this.zoomIn, view: 'tablet' })) : undefined,
                        targetTheme.bigRunButton ?
                            React.createElement("div", { className: "big-play-button-wrapper" },
                                React.createElement(EditorToolbarButton, { role: "menuitem", className: "big-play-button play-button " + (running ? "stop" : "play"), key: 'runmenubtn', disabled: starting, icon: running ? "stop" : "play", title: bigRunButtonTooltip, onButtonClick: this.startStopSimulator, view: 'tablet' })) : undefined))
                : React.createElement("div", { className: "ui grid" },
                    React.createElement("div", { className: "left aligned two wide column" },
                        React.createElement("div", { className: "ui vertical icon small buttons" },
                            run ? React.createElement(EditorToolbarButton, { role: "menuitem", className: "play-button " + (running ? "stop" : "play"), key: 'runmenubtn', disabled: starting, icon: running ? "stop" : "play", title: runTooltip, onButtonClick: this.startStopSimulator, view: 'tablet' }) : undefined,
                            restart ? React.createElement(EditorToolbarButton, { key: 'restartbtn', className: "restart-button", icon: "refresh", title: restartTooltip, onButtonClick: this.restartSimulator, view: 'tablet' }) : undefined),
                        showCollapsed ?
                            React.createElement("div", { className: "row", style: { paddingTop: "1rem" } },
                                React.createElement("div", { className: "ui vertical icon small buttons" },
                                    React.createElement(EditorToolbarButton, { icon: "" + (collapsed ? 'toggle up' : 'toggle down'), className: "collapse-button " + (collapsed ? 'collapsed' : ''), title: collapseTooltip, ariaLabel: lf("{0}, {1}", collapseTooltip, collapsed ? lf("Collapsed") : "Expanded"), onButtonClick: this.toggleCollapse, view: 'tablet' }))) : undefined),
                    React.createElement("div", { className: "three wide column" }),
                    React.createElement("div", { className: "five wide column" },
                        React.createElement("div", { className: "ui grid right aligned" },
                            compileBtn ? React.createElement("div", { className: "row" },
                                React.createElement("div", { className: "column" },
                                    React.createElement(EditorToolbarButton, { role: "menuitem", className: "primary large fluid download-button download-button-full " + downloadButtonClasses, icon: downloadIcon, text: downloadText, title: compileTooltip, onButtonClick: this.compile, view: 'tablet' }))) : undefined,
                            showProjectRename ?
                                React.createElement("div", { className: "row", style: compileBtn ? { paddingTop: 0 } : {} },
                                    React.createElement("div", { className: "column" },
                                        React.createElement("div", { className: "ui item large right " + (showSave ? "labeled" : "") + " fluid input projectname-input projectname-tablet", title: lf("Pick a name for your project") },
                                            React.createElement("label", { htmlFor: "fileNameInput1", id: "fileNameInputLabel1", className: "accessible-hidden" }, lf("Type a name for your project")),
                                            React.createElement(EditorToolbarSaveInput, { id: "fileNameInput1", type: "text", "aria-labelledby": "fileNameInputLabel1", placeholder: lf("Pick a name..."), value: projectName || '', onChangeValue: this.saveProjectName, view: 'tablet' }),
                                            showSave ? React.createElement(EditorToolbarButton, { icon: 'save', className: "large right attached editortools-btn save-editortools-btn " + saveButtonClasses, title: lf("Save"), ariaLabel: lf("Save the project"), onButtonClick: this.saveFile, view: 'tablet' }) : undefined))) : undefined)),
                    React.createElement("div", { className: "six wide column right aligned" },
                        React.createElement("div", { className: "ui grid right aligned" },
                            showUndoRedo || showZoomControls ?
                                React.createElement("div", { className: "row" },
                                    React.createElement("div", { className: "column" },
                                        showUndoRedo ?
                                            React.createElement("div", { className: "ui icon large buttons" },
                                                React.createElement(EditorToolbarButton, { icon: 'xicon undo', className: "editortools-btn undo-editortools-btn} " + (!hasUndo ? 'disabled' : ''), title: lf("Undo"), ariaLabel: lf("{0}, {1}", lf("Undo"), !hasUndo ? lf("Disabled") : ""), onButtonClick: this.undo, view: 'tablet' }),
                                                React.createElement(EditorToolbarButton, { icon: 'xicon redo', className: "editortools-btn redo-editortools-btn} " + (!hasRedo ? 'disabled' : ''), title: lf("Redo"), ariaLabel: lf("{0}, {1}", lf("Redo"), !hasRedo ? lf("Disabled") : ""), onButtonClick: this.redo, view: 'tablet' })) : undefined,
                                        showZoomControls ?
                                            React.createElement("div", { className: "ui icon large buttons" },
                                                React.createElement(EditorToolbarButton, { icon: 'minus circle', className: "editortools-btn zoomout-editortools-btn", title: lf("Zoom Out"), onButtonClick: this.zoomOut, view: 'tablet' }),
                                                React.createElement(EditorToolbarButton, { icon: 'plus circle', className: "editortools-btn zoomin-editortools-btn", title: lf("Zoom In"), onButtonClick: this.zoomIn, view: 'tablet' })) : undefined)) : undefined,
                            React.createElement("div", { className: "row", style: showUndoRedo || showZoomControls ? { paddingTop: 0 } : {} },
                                React.createElement("div", { className: "column" },
                                    trace ? React.createElement(EditorToolbarButton, { key: 'tracebtn', className: "large trace-button " + (tracing ? 'orange' : ''), icon: "xicon turtle", title: traceTooltip, onButtonClick: this.toggleTrace, view: 'tablet' }) : undefined,
                                    debug ? React.createElement(EditorToolbarButton, { key: 'debugbtn', className: "large debug-button " + (debugging ? 'orange' : ''), icon: "xicon bug", title: debugTooltip, onButtonClick: this.toggleDebugging, view: 'tablet' }) : undefined)))))),
            React.createElement("div", { className: "column computer only" },
                React.createElement("div", { className: "ui grid equal width" },
                    React.createElement("div", { id: "downloadArea", className: "ui column items" }, headless ?
                        React.createElement("div", { className: "ui item" },
                            React.createElement("div", { className: "ui icon large buttons" },
                                showCollapsed ? React.createElement(EditorToolbarButton, { icon: "" + (collapseEditorTools ? 'toggle ' + (isRtl ? 'left' : 'right') : 'toggle ' + (isRtl ? 'right' : 'left')), className: "large collapse-button " + (collapsed ? 'collapsed' : ''), title: collapseTooltip, onButtonClick: this.toggleCollapse, view: 'computer' }) : undefined,
                                run ? React.createElement(EditorToolbarButton, { role: "menuitem", className: "large play-button " + (running ? "stop" : "play"), key: 'runmenubtn', disabled: starting, icon: running ? "stop" : "play", title: runTooltip, onButtonClick: this.startStopSimulator, view: 'computer' }) : undefined,
                                restart ? React.createElement(EditorToolbarButton, { key: 'restartbtn', className: "large restart-button", icon: "refresh", title: restartTooltip, onButtonClick: this.restartSimulator, view: 'computer' }) : undefined,
                                trace ? React.createElement(EditorToolbarButton, { key: 'tracebtn', className: "large trace-button " + (tracing ? 'orange' : ''), icon: "xicon turtle", title: traceTooltip, onButtonClick: this.toggleTrace, view: 'computer' }) : undefined,
                                debug ? React.createElement(EditorToolbarButton, { key: 'debugbtn', className: "large debug-button " + (debugging ? 'orange' : ''), icon: "xicon bug", title: debugTooltip, onButtonClick: this.toggleDebugging, view: 'computer' }) : undefined,
                                compileBtn ? React.createElement(EditorToolbarButton, { icon: downloadIcon, className: "primary large download-button " + downloadButtonClasses, title: compileTooltip, onButtonClick: this.compile, view: 'computer' }) : undefined)) :
                        React.createElement("div", { className: "ui item" },
                            showCollapsed && !pairingButton ? React.createElement(EditorToolbarButton, { icon: "toggle " + (collapseEditorTools ? (isRtl ? 'left' : 'right') : (isRtl ? 'right' : 'left')), className: "large collapse-button " + (collapsed ? 'collapsed' : ''), title: collapseTooltip, onButtonClick: this.toggleCollapse, view: 'computer' }) : undefined,
                            debug ? React.createElement(EditorToolbarButton, { key: 'debugbtn', icon: "xicon bug", className: "large debug-button " + (debugging ? 'orange' : ''), title: debugTooltip, onButtonClick: this.toggleDebugging, view: 'computer' }) : undefined,
                            compileBtn ? React.createElement(EditorToolbarButton, { icon: downloadIcon, className: "primary huge fluid download-button " + downloadButtonClasses, text: downloadText, title: compileTooltip, onButtonClick: this.compile, view: 'computer' }) : undefined)),
                    showProjectRename ?
                        React.createElement("div", { className: "column left aligned" },
                            React.createElement("div", { className: "ui right " + (showSave ? "labeled" : "") + " input projectname-input projectname-computer", title: lf("Pick a name for your project") },
                                React.createElement("label", { htmlFor: "fileNameInput2", id: "fileNameInputLabel2", className: "accessible-hidden" }, lf("Type a name for your project")),
                                React.createElement(EditorToolbarSaveInput, { id: "fileNameInput2", view: 'computer', type: "text", "aria-labelledby": "fileNameInputLabel2", placeholder: lf("Pick a name..."), value: projectName || '', onChangeValue: this.saveProjectName }),
                                showSave ? React.createElement(EditorToolbarButton, { icon: 'save', className: "small right attached editortools-btn save-editortools-btn " + saveButtonClasses, title: lf("Save"), ariaLabel: lf("Save the project"), onButtonClick: this.saveFile, view: 'computer' }) : undefined)) : undefined,
                    React.createElement("div", { className: "column right aligned" },
                        showUndoRedo ?
                            React.createElement("div", { className: "ui icon small buttons" },
                                React.createElement(EditorToolbarButton, { icon: 'xicon undo', className: "editortools-btn undo-editortools-btn " + (!hasUndo ? 'disabled' : ''), ariaLabel: lf("{0}, {1}", lf("Undo"), !hasUndo ? lf("Disabled") : ""), title: lf("Undo"), onButtonClick: this.undo, view: 'computer' }),
                                React.createElement(EditorToolbarButton, { icon: 'xicon redo', className: "editortools-btn redo-editortools-btn " + (!hasRedo ? 'disabled' : ''), ariaLabel: lf("{0}, {1}", lf("Redo"), !hasRedo ? lf("Disabled") : ""), title: lf("Redo"), onButtonClick: this.redo, view: 'computer' })) : undefined,
                        showZoomControls ?
                            React.createElement("div", { className: "ui icon small buttons" },
                                React.createElement(EditorToolbarButton, { icon: 'minus circle', className: "editortools-btn zoomout-editortools-btn", title: lf("Zoom Out"), onButtonClick: this.zoomOut, view: 'computer' }),
                                React.createElement(EditorToolbarButton, { icon: 'plus circle', className: "editortools-btn zoomin-editortools-btn", title: lf("Zoom In"), onButtonClick: this.zoomIn, view: 'computer' })) : undefined,
                        targetTheme.bigRunButton ?
                            React.createElement("div", { className: "big-play-button-wrapper" },
                                React.createElement(EditorToolbarButton, { role: "menuitem", className: "big-play-button play-button " + (running ? "stop" : "play"), key: 'runmenubtn', disabled: starting, icon: running ? "stop" : "play", title: bigRunButtonTooltip, onButtonClick: this.startStopSimulator, view: 'computer' })) : undefined))));
    };
    return EditorToolbar;
}(data.Component));
exports.EditorToolbar = EditorToolbar;
var EditorToolbarButton = /** @class */ (function (_super) {
    __extends(EditorToolbarButton, _super);
    function EditorToolbarButton(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }
    EditorToolbarButton.prototype.handleClick = function () {
        var _a = this.props, onButtonClick = _a.onButtonClick, view = _a.view;
        onButtonClick(view);
    };
    EditorToolbarButton.prototype.renderCore = function () {
        var _a = this.props, onClick = _a.onClick, onButtonClick = _a.onButtonClick, rest = __rest(_a, ["onClick", "onButtonClick"]);
        return React.createElement(sui.Button, __assign({}, rest, { onClick: this.handleClick }));
    };
    return EditorToolbarButton;
}(sui.StatelessUIElement));
var EditorToolbarSaveInput = /** @class */ (function (_super) {
    __extends(EditorToolbarSaveInput, _super);
    function EditorToolbarSaveInput(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }
    EditorToolbarSaveInput.prototype.handleChange = function (e) {
        var _a = this.props, onChangeValue = _a.onChangeValue, view = _a.view;
        onChangeValue(e.target.value, view);
    };
    EditorToolbarSaveInput.prototype.renderCore = function () {
        var _a = this.props, onChange = _a.onChange, onChangeValue = _a.onChangeValue, view = _a.view, rest = __rest(_a, ["onChange", "onChangeValue", "view"]);
        return React.createElement("input", __assign({ onChange: this.handleChange, autoComplete: "off", autoCorrect: "off", autoCapitalize: "off", spellCheck: false }, rest));
    };
    return EditorToolbarSaveInput;
}(sui.StatelessUIElement));
