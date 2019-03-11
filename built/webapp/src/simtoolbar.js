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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var data = require("./data");
var sui = require("./sui");
var SimulatorToolbar = /** @class */ (function (_super) {
    __extends(SimulatorToolbar, _super);
    function SimulatorToolbar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.toggleTrace = _this.toggleTrace.bind(_this);
        _this.toggleMute = _this.toggleMute.bind(_this);
        _this.restartSimulator = _this.restartSimulator.bind(_this);
        _this.openInstructions = _this.openInstructions.bind(_this);
        _this.startStopSimulator = _this.startStopSimulator.bind(_this);
        _this.toggleSimulatorFullscreen = _this.toggleSimulatorFullscreen.bind(_this);
        _this.toggleSimulatorCollapse = _this.toggleSimulatorCollapse.bind(_this);
        _this.takeScreenshot = _this.takeScreenshot.bind(_this);
        return _this;
    }
    SimulatorToolbar.prototype.openInstructions = function () {
        pxt.tickEvent("simulator.make", undefined, { interactiveConsent: true });
        this.props.parent.openInstructions();
    };
    SimulatorToolbar.prototype.startStopSimulator = function () {
        pxt.tickEvent('simulator.startstop', undefined, { interactiveConsent: true });
        this.props.parent.startStopSimulator(true);
    };
    SimulatorToolbar.prototype.restartSimulator = function () {
        pxt.tickEvent('simulator.restart', undefined, { interactiveConsent: true });
        this.props.parent.restartSimulator();
    };
    SimulatorToolbar.prototype.toggleTrace = function () {
        pxt.tickEvent("simulator.trace", undefined, { interactiveConsent: true });
        this.props.parent.toggleTrace();
    };
    SimulatorToolbar.prototype.toggleDebug = function () {
        pxt.tickEvent("simulator.debug", undefined, { interactiveConsent: true });
        this.props.parent.toggleDebugging();
    };
    SimulatorToolbar.prototype.toggleMute = function () {
        pxt.tickEvent("simulator.mute", { view: 'computer', muteTo: '' + !this.props.parent.state.mute }, { interactiveConsent: true });
        this.props.parent.toggleMute();
    };
    SimulatorToolbar.prototype.toggleSimulatorFullscreen = function () {
        pxt.tickEvent("simulator.fullscreen", { view: 'computer', fullScreenTo: '' + !this.props.parent.state.fullscreen }, { interactiveConsent: true });
        this.props.parent.toggleSimulatorFullscreen();
    };
    SimulatorToolbar.prototype.toggleSimulatorCollapse = function () {
        pxt.tickEvent("simulator.toggleCollapse", { view: 'computer', collapsedTo: '' + !this.props.parent.state.collapseEditorTools }, { interactiveConsent: true });
        this.props.parent.toggleSimulatorCollapse();
    };
    SimulatorToolbar.prototype.takeScreenshot = function () {
        pxt.tickEvent("simulator.takescreenshot", { view: 'computer', collapsedTo: '' + !this.props.parent.state.collapseEditorTools }, { interactiveConsent: true });
        this.props.parent.downloadScreenshotAsync().done();
    };
    SimulatorToolbar.prototype.renderCore = function () {
        var parentState = this.props.parent.state;
        if (!parentState.currFile)
            return React.createElement("div", null);
        var targetTheme = pxt.appTarget.appTheme;
        var simOpts = pxt.appTarget.simulator;
        var sandbox = pxt.shell.isSandboxMode();
        var make = !sandbox && parentState.showParts && targetTheme.instructions;
        var simState = parentState.simState;
        var isRunning = simState == pxt.editor.SimState.Running;
        var isStarting = simState == pxt.editor.SimState.Starting;
        var isFullscreen = parentState.fullscreen;
        var isMuted = parentState.mute;
        var inTutorial = !!parentState.tutorialOptions && !!parentState.tutorialOptions.tutorial;
        var run = true; // !compileBtn || !pxt.appTarget.simulator.autoRun || !isBlocks;
        var restart = run && !simOpts.hideRestart;
        var trace = !!targetTheme.enableTrace;
        var tracing = this.props.parent.state.tracing;
        var traceTooltip = tracing ? lf("Disable Slow-Mo") : lf("Slow-Mo");
        var debugging = parentState.debugging;
        var fullscreen = run && !inTutorial && !simOpts.hideFullscreen && !sandbox;
        var audio = run && !inTutorial && targetTheme.hasAudio;
        var isHeadless = simOpts.headless;
        var collapse = !!targetTheme.pairingButton;
        var screenshot = !!targetTheme.simScreenshot;
        var screenshotClass = !!parentState.screenshoting ? "loading" : "";
        if (isHeadless)
            return React.createElement("div", null);
        var runTooltip = [lf("Start the simulator"), lf("Starting the simulator"), lf("Stop the simulator")][simState];
        var makeTooltip = lf("Open assembly instructions");
        var restartTooltip = lf("Restart the simulator");
        var fullscreenTooltip = isFullscreen ? lf("Exit fullscreen mode") : lf("Launch in fullscreen");
        var muteTooltip = isMuted ? lf("Unmute audio") : lf("Mute audio");
        var collapseTooltip = lf("Hide the simulator");
        var screenshotTooltip = targetTheme.simScreenshotKey ? lf("Take Screenshot (shortcut {0})", targetTheme.simScreenshotKey) : lf("Take Screenshot");
        return React.createElement("aside", { className: "ui item grid centered simtoolbar" + (sandbox ? "" : " portrait hide"), role: "complementary", "aria-label": lf("Simulator toolbar") },
            React.createElement("div", { className: "ui icon tiny buttons", style: { padding: "0" } },
                make ? React.createElement(sui.Button, { disabled: debugging, icon: 'configure', className: "secondary", title: makeTooltip, onClick: this.openInstructions }) : undefined,
                run ? React.createElement(sui.Button, { disabled: debugging || isStarting, key: 'runbtn', className: "play-button " + (isRunning ? "stop" : "play"), icon: isRunning ? "stop" : "play green", title: runTooltip, onClick: this.startStopSimulator }) : undefined,
                restart ? React.createElement(sui.Button, { disabled: debugging || isStarting, key: 'restartbtn', className: "restart-button", icon: "refresh", title: restartTooltip, onClick: this.restartSimulator }) : undefined,
                trace ? React.createElement(sui.Button, { key: 'trace', className: "trace-button " + (tracing ? 'orange' : ''), icon: "xicon turtle", title: traceTooltip, onClick: this.toggleTrace }) : undefined),
            React.createElement("div", { className: "ui icon tiny buttons", style: { padding: "0" } }, audio ? React.createElement(sui.Button, { key: 'mutebtn', className: "mute-button " + (isMuted ? 'red' : ''), icon: "" + (isMuted ? 'volume off' : 'volume up'), title: muteTooltip, onClick: this.toggleMute }) : undefined),
            React.createElement("div", { className: "ui icon tiny buttons", style: { padding: "0" } },
                screenshot ? React.createElement(sui.Button, { disabled: !isRunning, key: 'screenshotbtn', className: "screenshot-button " + screenshotClass, icon: "icon camera left", title: screenshotTooltip, onClick: this.takeScreenshot }) : undefined,
                collapse && !isFullscreen ? React.createElement(sui.Button, { key: 'collapsebtn', className: "collapse-button", icon: "icon toggle left", title: collapseTooltip, onClick: this.toggleSimulatorCollapse }) : undefined,
                fullscreen ? React.createElement(sui.Button, { key: 'fullscreenbtn', className: "fullscreen-button", icon: "xicon " + (isFullscreen ? 'fullscreencollapse' : 'fullscreen'), title: fullscreenTooltip, onClick: this.toggleSimulatorFullscreen }) : undefined));
    };
    return SimulatorToolbar;
}(data.Component));
exports.SimulatorToolbar = SimulatorToolbar;
