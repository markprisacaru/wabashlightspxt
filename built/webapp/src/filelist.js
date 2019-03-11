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
var pkg = require("./package");
var core = require("./core");
var customFile = "custom.ts";
var FileList = /** @class */ (function (_super) {
    __extends(FileList, _super);
    function FileList(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        _this.toggleVisibility = _this.toggleVisibility.bind(_this);
        _this.handleCustomBlocksClick = _this.handleCustomBlocksClick.bind(_this);
        _this.handleButtonKeydown = _this.handleButtonKeydown.bind(_this);
        _this.handleSyncClick = _this.handleSyncClick.bind(_this);
        _this.setFile = _this.setFile.bind(_this);
        _this.removeFile = _this.removeFile.bind(_this);
        _this.removePkg = _this.removePkg.bind(_this);
        _this.updatePkg = _this.updatePkg.bind(_this);
        _this.togglePkg = _this.togglePkg.bind(_this);
        return _this;
    }
    FileList.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        var currentFile = nextProps.parent.state.currFile;
        // Set the current package as expanded
        if (this.state.currentFile != currentFile) {
            var expandedPkg_1 = undefined;
            pkg.allEditorPkgs().forEach(function (p) {
                if (_this.packageContainsFile(p, currentFile)) {
                    expandedPkg_1 = p.getPkgId();
                }
            });
            this.setState({ expandedPkg: expandedPkg_1, currentFile: currentFile });
        }
    };
    FileList.prototype.removePkg = function (p) {
        var _this = this;
        core.confirmAsync({
            header: lf("Remove {0} extension", p.getPkgId()),
            body: lf("You are about to remove an extension from your project. Are you sure?"),
            agreeClass: "red",
            agreeIcon: "trash",
            agreeLbl: lf("Remove it"),
        }).done(function (res) {
            if (res) {
                pkg.mainEditorPkg().removeDepAsync(p.getPkgId())
                    .then(function () { return _this.props.parent.reloadHeaderAsync(); })
                    .done();
            }
        });
    };
    FileList.prototype.setFile = function (f) {
        this.props.parent.setSideFile(f);
    };
    FileList.prototype.removeFile = function (f) {
        this.props.parent.removeFile(f);
    };
    FileList.prototype.updatePkg = function (p) {
        var _this = this;
        pkg.mainEditorPkg().updateDepAsync(p.getPkgId())
            .then(function () { return _this.props.parent.reloadHeaderAsync(); })
            .done();
    };
    FileList.prototype.filesOf = function (pkg) {
        var _this = this;
        var currentFile = this.state.currentFile;
        var deleteFiles = pkg.getPkgId() == "this";
        var parent = this.props.parent;
        return pkg.sortedFiles().map(function (file) {
            var meta = _this.getData("open-meta:" + file.getName());
            return (React.createElement(FileTreeItem, { key: file.getName(), file: file, onItemClick: _this.setFile, onItemRemove: _this.removeFile, isActive: currentFile == file, hasDelete: deleteFiles && /\.blocks$/i.test(file.getName()), className: (currentFile == file ? "active " : "") + (pkg.isTopLevel() ? "" : "nested ") + "item" },
                file.name,
                " ",
                meta.isSaved ? "" : "*",
                /\.ts$/.test(file.name) ? React.createElement(sui.Icon, { icon: "align left" }) : /\.blocks$/.test(file.name) ? React.createElement(sui.Icon, { icon: "puzzle" }) : undefined,
                meta.isReadonly ? React.createElement(sui.Icon, { icon: "lock" }) : null,
                !meta.numErrors ? null : React.createElement("span", { className: 'ui label red' }, meta.numErrors)));
        });
    };
    FileList.prototype.packageOf = function (p) {
        var expandedPkg = this.state.expandedPkg;
        var del = p.getPkgId() != pxt.appTarget.id
            && p.getPkgId() != "built"
            && p.getPkgId() != "assets"
            && p.getPkgId() != pxt.appTarget.corepkg
            && p.getKsPkg().config && !p.getKsPkg().config.core
            && p.getKsPkg().level <= 1;
        var upd = p.getKsPkg() && p.getKsPkg().verProtocol() == "github";
        var meta = this.getData("open-pkg-meta:" + p.getPkgId());
        var version = upd ? p.getKsPkg().verArgument().split('#')[1] : undefined; // extract github tag
        if (version && version.length > 20)
            version = version.substring(0, 7);
        return [React.createElement(PackgeTreeItem, { key: "hd-" + p.getPkgId(), pkg: p, isActive: expandedPkg == p.getPkgId(), onItemClick: this.togglePkg, hasDelete: del, onItemRemove: this.removePkg, version: version, hasRefresh: upd, onItemRefresh: this.updatePkg },
                !meta.numErrors ? null : React.createElement("span", { className: 'ui label red' }, meta.numErrors),
                p.getPkgId(),
                expandedPkg == p.getPkgId() ?
                    React.createElement("div", { role: "group", className: "menu" }, this.filesOf(p)) : undefined)];
    };
    FileList.prototype.packageContainsFile = function (pkg, f) {
        return pkg.sortedFiles().filter(function (file) { return file == f; }).length > 0;
    };
    FileList.prototype.togglePkg = function (p) {
        this.setState({ expandedPkg: this.state.expandedPkg == p.getPkgId() ? undefined : p.getPkgId() });
    };
    FileList.prototype.filesWithHeader = function (p) {
        return p.isTopLevel() ? this.filesOf(p) : this.packageOf(p);
    };
    FileList.prototype.toggleVisibility = function () {
        this.props.parent.setState({ showFiles: !this.props.parent.state.showFiles });
    };
    FileList.prototype.handleSyncClick = function (e) {
        this.props.parent.pushPullAsync();
        e.stopPropagation();
    };
    FileList.prototype.handleCustomBlocksClick = function (e) {
        this.addCustomBlocksFile();
        e.stopPropagation();
    };
    FileList.prototype.handleButtonKeydown = function (e) {
        e.stopPropagation();
    };
    FileList.prototype.addTypeScriptFile = function () {
        var _this = this;
        core.promptAsync({
            header: lf("Add new file?"),
            body: lf("Please provide a name for your new file. The .ts extension will be added automatically. Don't use spaces or special characters.")
        }).then(function (str) {
            str = str || "";
            str = str.trim();
            str = str.replace(/\.[tj]s$/, "");
            str = str.trim();
            if (!str)
                return Promise.resolve();
            if (!/^[\w\-]+$/.test(str)) {
                core.warningNotification(lf("Invalid file name"));
                return Promise.resolve();
            }
            str += ".ts";
            if (pkg.mainEditorPkg().sortedFiles().some(function (f) { return f.name == str; })) {
                core.warningNotification(lf("File already exists"));
                return Promise.resolve();
            }
            return _this.props.parent.updateFileAsync(str, "// Add your code here\n", true);
        }).done();
    };
    FileList.prototype.addCustomBlocksFile = function () {
        var _this = this;
        if (this.props.parent.state.header.githubId || pxt.appTarget.appTheme.addNewTypeScriptFile) {
            this.addTypeScriptFile();
            return;
        }
        core.confirmAsync({
            header: lf("Add custom blocks?"),
            body: lf("A new JavaScript file, custom.ts, will be added to your project. You can define custom functions and blocks in that file.")
        }).then(function (v) {
            if (!v)
                return undefined;
            return _this.props.parent.updateFileAsync(customFile, "\n/**\n * " + lf("Use this file to define custom functions and blocks.") + "\n * " + lf("Read more at {0}", pxt.appTarget.appTheme.homeUrl + 'blocks/custom') + "\n */\n\nenum MyEnum {\n    //% block=\"one\"\n    One,\n    //% block=\"two\"\n    Two\n}\n\n/**\n * " + lf("Custom blocks") + "\n */\n//% weight=100 color=#0fbc11 icon=\"\uF0C3\"\nnamespace custom {\n    /**\n     * TODO: " + lf("describe your function here") + "\n     * @param n " + lf("describe parameter here") + ", eg: 5\n     * @param s " + lf("describe parameter here") + ", eg: \"Hello\"\n     * @param e " + lf("describe parameter here") + "\n     */\n    //% block\n    export function foo(n: number, s: string, e: MyEnum): void {\n        // Add code here\n    }\n\n    /**\n     * TODO: " + lf("describe your function here") + "\n     * @param value " + lf("describe value here") + ", eg: 5\n     */\n    //% block\n    export function fib(value: number): number {\n        return value <= 1 ? value : fib(value -1) + fib(value - 2);\n    }\n}\n", true);
        });
    };
    FileList.prototype.renderCore = function () {
        var _this = this;
        var show = !!this.props.parent.state.showFiles;
        var targetTheme = pxt.appTarget.appTheme;
        var mainPkg = pkg.mainEditorPkg();
        var plus = show && !mainPkg.files[customFile];
        var sync = show && pxt.github.token && !!mainPkg.header.githubId;
        var meta = this.getData("open-pkg-meta:" + mainPkg.getPkgId());
        return React.createElement("div", { role: "tree", className: "ui tiny vertical " + (targetTheme.invertedMenu ? "inverted" : '') + " menu filemenu landscape only hidefullscreen" },
            React.createElement("div", { role: "treeitem", "aria-selected": show, "aria-expanded": show, "aria-label": lf("File explorer toolbar"), key: "projectheader", className: "link item", onClick: this.toggleVisibility, tabIndex: 0, onKeyDown: sui.fireClickOnEnter },
                lf("Explorer"),
                React.createElement(sui.Icon, { icon: "chevron " + (show ? "down" : "right") + " icon" }),
                sync ? React.createElement(sui.Button, { className: "primary label", icon: "github", title: lf("Sync with github"), onClick: this.handleSyncClick, onKeyDown: this.handleButtonKeydown }) : undefined,
                plus ? React.createElement(sui.Button, { className: "primary label", icon: "plus", title: lf("Add custom blocks?"), onClick: this.handleCustomBlocksClick, onKeyDown: this.handleButtonKeydown }) : undefined,
                !meta.numErrors ? null : React.createElement("span", { className: 'ui label red' }, meta.numErrors)),
            show ? pxt.Util.concat(pkg.allEditorPkgs().map(function (p) { return _this.filesWithHeader(p); })) : undefined);
    };
    return FileList;
}(data.Component));
exports.FileList = FileList;
var FileTreeItem = /** @class */ (function (_super) {
    __extends(FileTreeItem, _super);
    function FileTreeItem(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleRemove = _this.handleRemove.bind(_this);
        _this.handleButtonKeydown = _this.handleButtonKeydown.bind(_this);
        return _this;
    }
    FileTreeItem.prototype.handleClick = function (e) {
        this.props.onItemClick(this.props.file);
        e.stopPropagation();
    };
    FileTreeItem.prototype.handleRemove = function (e) {
        this.props.onItemRemove(this.props.file);
        e.stopPropagation();
    };
    FileTreeItem.prototype.handleButtonKeydown = function (e) {
        e.stopPropagation();
    };
    FileTreeItem.prototype.renderCore = function () {
        var _a = this.props, onClick = _a.onClick, onItemClick = _a.onItemClick, onItemRemove = _a.onItemRemove, isActive = _a.isActive, hasDelete = _a.hasDelete, file = _a.file, rest = __rest(_a, ["onClick", "onItemClick", "onItemRemove", "isActive", "hasDelete", "file"]);
        return React.createElement("a", __assign({ onClick: this.handleClick, tabIndex: 0, role: "treeitem", "aria-selected": isActive, "aria-label": isActive ? lf("{0}, it is the current opened file in the JavaScript editor", file.name) : file.name, onKeyDown: sui.fireClickOnEnter }, rest),
            this.props.children,
            hasDelete ? React.createElement(sui.Button, { className: "primary label", icon: "trash", title: lf("Delete file {0}", file.name), onClick: this.handleRemove, onKeyDown: this.handleButtonKeydown }) : '');
    };
    return FileTreeItem;
}(sui.StatelessUIElement));
var PackgeTreeItem = /** @class */ (function (_super) {
    __extends(PackgeTreeItem, _super);
    function PackgeTreeItem(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleRemove = _this.handleRemove.bind(_this);
        _this.handleRefresh = _this.handleRefresh.bind(_this);
        _this.handleButtonKeydown = _this.handleButtonKeydown.bind(_this);
        return _this;
    }
    PackgeTreeItem.prototype.handleClick = function () {
        this.props.onItemClick(this.props.pkg);
    };
    PackgeTreeItem.prototype.handleRefresh = function (e) {
        this.props.onItemRefresh(this.props.pkg);
        e.stopPropagation();
    };
    PackgeTreeItem.prototype.handleRemove = function (e) {
        this.props.onItemRemove(this.props.pkg);
        e.stopPropagation();
    };
    PackgeTreeItem.prototype.handleButtonKeydown = function (e) {
        e.stopPropagation();
    };
    PackgeTreeItem.prototype.renderCore = function () {
        var _a = this.props, onItemClick = _a.onItemClick, onItemRemove = _a.onItemRemove, onItemRefresh = _a.onItemRefresh, version = _a.version, isActive = _a.isActive, hasRefresh = _a.hasRefresh, hasDelete = _a.hasDelete, p = _a.pkg, rest = __rest(_a, ["onItemClick", "onItemRemove", "onItemRefresh", "version", "isActive", "hasRefresh", "hasDelete", "pkg"]);
        return React.createElement("div", __assign({ className: "header link item", role: "treeitem", "aria-selected": isActive, "aria-expanded": isActive, "aria-label": lf("{0}, {1}", p.getPkgId(), isActive ? lf("expanded") : lf("collapsed")), onClick: this.handleClick, tabIndex: 0, onKeyDown: sui.fireClickOnEnter }, rest),
            React.createElement(sui.Icon, { icon: "chevron " + (isActive ? "down" : "right") + " icon" }),
            hasRefresh ? React.createElement(sui.Button, { className: "primary label", icon: "refresh", title: lf("Refresh extension {0}", p.getPkgId()), onClick: this.handleRefresh, onKeyDown: this.handleButtonKeydown, text: version || '' }) : undefined,
            hasDelete ? React.createElement(sui.Button, { className: "primary label", icon: "trash", title: lf("Delete extension {0}", p.getPkgId()), onClick: this.handleRemove, onKeyDown: this.handleButtonKeydown }) : undefined,
            this.props.children);
    };
    return PackgeTreeItem;
}(sui.StatelessUIElement));
