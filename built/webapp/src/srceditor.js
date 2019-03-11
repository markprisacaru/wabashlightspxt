"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Editor = /** @class */ (function () {
    function Editor(parent) {
        this.parent = parent;
        this.isVisible = false;
        this.changeCallback = function () { };
        this.isReady = false;
    }
    Editor.prototype.setVisible = function (v) {
        this.isVisible = v;
    };
    /*******************************
     Methods called before loadFile
      this.editor may be undefined
      Always check that this.editor exists
    *******************************/
    Editor.prototype.acceptsFile = function (file) {
        return false;
    };
    Editor.prototype.getViewState = function () {
        return {};
    };
    Editor.prototype.getCurrentSource = function () {
        return this.currSource;
    };
    Editor.prototype.getId = function () {
        return "editor";
    };
    Editor.prototype.displayOuter = function () {
        return (React.createElement("div", { className: 'full-abs', key: this.getId(), id: this.getId(), style: { display: this.isVisible ? "block" : "none" } }, this.display()));
    };
    Editor.prototype.display = function () {
        return null;
    };
    Editor.prototype.beforeCompile = function () { };
    Editor.prototype.prepare = function () {
        this.isReady = true;
    };
    Editor.prototype.resize = function (e) { };
    Editor.prototype.snapshotState = function () {
        return null;
    };
    Editor.prototype.unloadFileAsync = function () { return Promise.resolve(); };
    Editor.prototype.isIncomplete = function () {
        return false;
    };
    Editor.prototype.hasHistory = function () { return true; };
    Editor.prototype.hasUndo = function () { return true; };
    Editor.prototype.hasRedo = function () { return true; };
    Editor.prototype.undo = function () { };
    Editor.prototype.redo = function () { };
    Editor.prototype.zoomIn = function () { };
    Editor.prototype.zoomOut = function () { };
    Editor.prototype.setScale = function (scale) { };
    Editor.prototype.closeFlyout = function () { };
    /*******************************
     loadFile
    *******************************/
    Editor.prototype.loadFileAsync = function (file, hc) {
        this.currSource = file.content;
        this.setDiagnostics(file, this.snapshotState());
        return Promise.resolve();
    };
    /*******************************
     Methods called after loadFile
      this.editor != undefined
    *******************************/
    Editor.prototype.domUpdate = function () { };
    Editor.prototype.setDiagnostics = function (file, snapshot) { };
    Editor.prototype.setViewState = function (view) { };
    Editor.prototype.saveToTypeScript = function () {
        return Promise.resolve('');
    };
    Editor.prototype.highlightStatement = function (stmt, brk) { return false; };
    Editor.prototype.clearHighlightedStatements = function () { };
    Editor.prototype.setHighContrast = function (hc) { };
    Editor.prototype.hasEditorToolbar = function () {
        return true;
    };
    Editor.prototype.filterToolbox = function (filters, showCategories) {
    };
    Editor.prototype.insertBreakpoint = function () {
    };
    return Editor;
}());
exports.Editor = Editor;
