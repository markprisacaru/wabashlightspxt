"use strict";
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
var ReactDOM = require("react-dom");
var sui = require("./sui");
var data = require("./data");
var simulator = require("./simulator");
var DebuggerVariables = /** @class */ (function (_super) {
    __extends(DebuggerVariables, _super);
    function DebuggerVariables(props) {
        var _this = _super.call(this, props) || this;
        _this.nextVariables = {};
        _this.state = {
            variables: {}
        };
        return _this;
    }
    DebuggerVariables.prototype.clear = function () {
        this.nextVariables = {};
        this.setState({ variables: {} });
    };
    DebuggerVariables.prototype.set = function (name, value) {
        this.nextVariables[name] = value;
    };
    DebuggerVariables.renderValue = function (v) {
        var sv = '';
        var type = typeof v;
        switch (type) {
            case "undefined":
                sv = "undefined";
                break;
            case "number":
                sv = v + "";
                break;
            case "boolean":
                sv = v + "";
                break;
            case "string":
                sv = JSON.stringify(v);
                break;
            case "object":
                if (v == null)
                    sv = "null";
                else if (v.text)
                    sv = v.text;
                else if (v.id && v.preview)
                    return v.preview;
                else if (v.id !== undefined)
                    sv = "(object)";
                else
                    sv = "(unknown)";
                break;
        }
        return DebuggerVariables.capLength(sv);
    };
    DebuggerVariables.capLength = function (varstr) {
        var remaining = DebuggerVariables.MAX_VARIABLE_CHARS - 3; // acount for ...
        var hasQuotes = false;
        if (varstr.indexOf('"') == 0) {
            remaining -= 2;
            hasQuotes = true;
            varstr = varstr.substring(1, varstr.length - 1);
        }
        if (varstr.length > remaining)
            varstr = varstr.substring(0, remaining) + '...';
        if (hasQuotes) {
            varstr = '"' + varstr + '"';
        }
        return varstr;
    };
    DebuggerVariables.prototype.update = function (frozen) {
        var _this = this;
        if (frozen === void 0) { frozen = false; }
        var variables = this.state.variables;
        Object.keys(this.nextVariables).forEach(function (k) {
            var v = _this.nextVariables[k];
            variables[k] = {
                value: v,
                prevValue: v && !v.id && variables[k] && v !== variables[k].value ?
                    variables[k].value : undefined
            };
        });
        this.setState({ variables: variables, frozen: frozen });
        this.nextVariables = {};
    };
    DebuggerVariables.prototype.toggle = function (v) {
        var _this = this;
        if (v.children) {
            delete v.children;
            this.setState({ variables: this.state.variables });
        }
        else {
            if (!v.value.id)
                return;
            simulator.driver.variablesAsync(v.value.id)
                .then(function (msg) {
                if (msg) {
                    v.children = pxt.Util.mapMap(msg.variables || {}, function (k, v) {
                        return {
                            value: msg.variables[k]
                        };
                    });
                    _this.setState({ variables: _this.state.variables });
                }
            });
        }
    };
    DebuggerVariables.prototype.renderVariables = function (variables, parent) {
        var _this = this;
        var varcolor = pxt.toolbox.getNamespaceColor('variables');
        var r = [];
        Object.keys(variables).forEach(function (variable) {
            var v = variables[variable];
            var onClick = v.value && v.value.id ? function () { return _this.toggle(v); } : undefined;
            r.push(React.createElement("div", { key: (parent || "") + variable, className: "item" },
                React.createElement("div", { role: "listitem", className: "ui label image variable " + (v.prevValue !== undefined ? "changed" : ""), style: { backgroundColor: varcolor }, onClick: onClick },
                    React.createElement("span", { className: "varname" }, variable),
                    React.createElement("div", { className: "detail" },
                        React.createElement("span", { className: "varval" }, DebuggerVariables.renderValue(v.value)),
                        React.createElement("span", { className: "previousval" }, v.prevValue !== undefined ? "" + DebuggerVariables.renderValue(v.prevValue) : '')))));
            if (v.children)
                r = r.concat(_this.renderVariables(v.children, variable));
        });
        return r;
    };
    DebuggerVariables.prototype.renderCore = function () {
        var _a = this.state, variables = _a.variables, frozen = _a.frozen;
        return Object.keys(variables).length == 0 ? React.createElement("div", null) :
            React.createElement("div", { className: "ui segment debugvariables " + (frozen ? "frozen" : "") },
                React.createElement("div", { className: "ui middle aligned list" }, this.renderVariables(variables)));
    };
    DebuggerVariables.MAX_VARIABLE_CHARS = 20;
    return DebuggerVariables;
}(data.Component));
exports.DebuggerVariables = DebuggerVariables;
var DebuggerToolbar = /** @class */ (function (_super) {
    __extends(DebuggerToolbar, _super);
    function DebuggerToolbar(props) {
        var _this = _super.call(this, props) || this;
        _this.cachedMaxWidth = 0;
        _this.state = {};
        _this.toolbarHandleDown = _this.toolbarHandleDown.bind(_this);
        _this.restartSimulator = _this.restartSimulator.bind(_this);
        _this.dbgPauseResume = _this.dbgPauseResume.bind(_this);
        _this.dbgInsertBreakpoint = _this.dbgInsertBreakpoint.bind(_this);
        _this.dbgStepOver = _this.dbgStepOver.bind(_this);
        _this.dbgStepInto = _this.dbgStepInto.bind(_this);
        _this.dbgStepOut = _this.dbgStepOut.bind(_this);
        return _this;
    }
    DebuggerToolbar.prototype.restartSimulator = function () {
        pxt.tickEvent('debugger.restart', undefined, { interactiveConsent: true });
        this.props.parent.restartSimulator(true);
    };
    DebuggerToolbar.prototype.exitDebugging = function () {
        pxt.tickEvent('debugger.exit', undefined, { interactiveConsent: true });
        this.props.parent.toggleDebugging();
    };
    DebuggerToolbar.prototype.dbgPauseResume = function () {
        pxt.tickEvent('debugger.pauseresume', undefined, { interactiveConsent: true });
        this.props.parent.dbgPauseResume();
    };
    DebuggerToolbar.prototype.dbgInsertBreakpoint = function () {
        pxt.tickEvent('debugger.breakpoint', undefined, { interactiveConsent: true });
        this.props.parent.dbgInsertBreakpoint();
    };
    DebuggerToolbar.prototype.dbgStepOver = function () {
        pxt.tickEvent('debugger.stepover', undefined, { interactiveConsent: true });
        this.props.parent.dbgStepOver();
    };
    DebuggerToolbar.prototype.dbgStepInto = function () {
        pxt.tickEvent('debugger.stepinto', undefined, { interactiveConsent: true });
        this.props.parent.dbgStepInto();
    };
    DebuggerToolbar.prototype.dbgStepOut = function () {
        pxt.tickEvent('debugger.stepout', undefined, { interactiveConsent: true });
        simulator.dbgStepOut();
    };
    DebuggerToolbar.prototype.componentDidUpdate = function (props, state) {
        if (this.state.isDragging && !state.isDragging) {
            document.addEventListener('mousemove', this.toolbarHandleMove.bind(this));
            document.addEventListener('mouseup', this.toolbarHandleUp.bind(this));
        }
        else if (!this.state.isDragging && state.isDragging) {
            document.removeEventListener('mousemove', this.toolbarHandleMove.bind(this));
            document.removeEventListener('mouseup', this.toolbarHandleUp.bind(this));
        }
        // Center the component if it hasn't been initialized yet
        if (state.xPos == undefined && props.parent.state.debugging) {
            this.centerToolbar();
            window.addEventListener('resize', this.centerToolbar.bind(this));
        }
    };
    DebuggerToolbar.prototype.componentWillUnmount = function () {
        document.removeEventListener('mousemove', this.toolbarHandleMove.bind(this));
        document.removeEventListener('mouseup', this.toolbarHandleUp.bind(this));
        window.removeEventListener('resize', this.centerToolbar.bind(this));
    };
    DebuggerToolbar.prototype.toolbarHandleDown = function (e) {
        if (e.button !== 0)
            return;
        var menuDOM = this.getMenuDom();
        var menuWidth = menuDOM && menuDOM.clientWidth || 0;
        this.cachedMaxWidth = window.innerWidth - menuWidth;
        this.setState({
            isDragging: true,
            xPos: Math.min(e.pageX, this.cachedMaxWidth)
        });
        e.stopPropagation();
        e.preventDefault();
    };
    DebuggerToolbar.prototype.toolbarHandleMove = function (e) {
        if (!this.state.isDragging)
            return;
        this.setState({
            isDragging: true,
            xPos: Math.min(e.pageX, this.cachedMaxWidth)
        });
        e.stopPropagation();
        e.preventDefault();
    };
    DebuggerToolbar.prototype.toolbarHandleUp = function (e) {
        this.setState({ isDragging: false });
        e.stopPropagation();
        e.preventDefault();
    };
    DebuggerToolbar.prototype.getMenuDom = function () {
        var node = ReactDOM.findDOMNode(this);
        return node && node.firstElementChild;
    };
    DebuggerToolbar.prototype.centerToolbar = function () {
        // Center the toolbar in the middle of the editor view (blocks / JS)
        var menuDOM = this.getMenuDom();
        var width = menuDOM && menuDOM.clientWidth;
        var mainEditor = document.getElementById('maineditor');
        var simWidth = window.innerWidth - mainEditor.clientWidth;
        this.setState({ xPos: simWidth + (mainEditor.clientWidth - width) / 2 });
    };
    DebuggerToolbar.prototype.renderCore = function () {
        var xPos = this.state.xPos;
        var parentState = this.props.parent.state;
        var simOpts = pxt.appTarget.simulator;
        var simState = parentState.simState;
        var isRunning = simState == pxt.editor.SimState.Running;
        var isDebugging = parentState.debugging;
        if (!isDebugging)
            return React.createElement("div", null);
        var isDebuggerRunning = simulator.driver && simulator.driver.state == pxsim.SimulatorState.Running;
        var advancedDebugging = this.props.parent.isJavaScriptActive();
        var isValidDebugFile = advancedDebugging || this.props.parent.isBlocksActive();
        if (!isValidDebugFile)
            return React.createElement("div", null);
        var restartTooltip = lf("Restart debugging");
        var dbgPauseResumeTooltip = isRunning ? lf("Pause execution") : lf("Continue execution");
        var dbgStepIntoTooltip = lf("Step into");
        var dbgStepOverTooltip = lf("Step over");
        var dbgStepOutTooltip = lf("Step out");
        return React.createElement("aside", { className: "debugtoolbar", style: { left: xPos }, role: "complementary", "aria-label": lf("Debugger toolbar") }, !isDebugging ? undefined :
            React.createElement("div", { className: "ui compact borderless menu icon" },
                React.createElement("div", { role: "button", className: "ui item link dbg-btn dbg-handle", key: 'toolbarhandle', title: lf("Debugger buttons"), onMouseDown: this.toolbarHandleDown },
                    React.createElement(sui.Icon, { key: 'iconkey', icon: "icon ellipsis vertical" }),
                    React.createElement(sui.Icon, { key: 'iconkey2', icon: "xicon bug" })),
                React.createElement(sui.Item, { key: 'dbgpauseresume', className: "dbg-btn dbg-pause-resume " + (isDebuggerRunning ? "pause" : "play"), icon: "" + (isDebuggerRunning ? "pause blue" : "step forward green"), title: dbgPauseResumeTooltip, onClick: this.dbgPauseResume }),
                React.createElement(sui.Item, { key: 'dbgbreakpoint', className: "dbg-btn dbg-breakpoint", icon: "circle red", title: lf("Insert debugger breakpoint"), onClick: this.dbgInsertBreakpoint }),
                !advancedDebugging ? React.createElement(sui.Item, { key: 'dbgstep', className: "dbg-btn dbg-step", icon: "arrow right " + (isDebuggerRunning ? "disabled" : "blue"), title: dbgStepIntoTooltip, onClick: this.dbgStepInto }) : undefined,
                advancedDebugging ? React.createElement(sui.Item, { key: 'dbgstepover', className: "dbg-btn dbg-step-over", icon: "xicon stepover " + (isDebuggerRunning ? "disabled" : "blue"), title: dbgStepOverTooltip, onClick: this.dbgStepOver }) : undefined,
                advancedDebugging ? React.createElement(sui.Item, { key: 'dbgstepinto', className: "dbg-btn dbg-step-into", icon: "xicon stepinto " + (isDebuggerRunning ? "disabled" : ""), title: dbgStepIntoTooltip, onClick: this.dbgStepInto }) : undefined,
                advancedDebugging ? React.createElement(sui.Item, { key: 'dbgstepout', className: "dbg-btn dbg-step-out", icon: "xicon stepout " + (isDebuggerRunning ? "disabled" : ""), title: dbgStepOutTooltip, onClick: this.dbgStepOut }) : undefined,
                React.createElement(sui.Item, { key: 'dbgrestart', className: "dbg-btn dbg-restart right", icon: "refresh green", title: restartTooltip, onClick: this.restartSimulator })));
    };
    return DebuggerToolbar;
}(data.Component));
exports.DebuggerToolbar = DebuggerToolbar;
