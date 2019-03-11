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
var ReactDOM = require("react-dom");
var data = require("./data");
var sui = require("./sui");
var sounds = require("./sounds");
var core = require("./core");
var md = require("./marked");
var compiler = require("./compiler");
/**
 * We'll run this step when we first start the tutorial to figure out what blocks are used so we can
 * filter the toolbox.
 */
function getUsedBlocksAsync(tutorialId, tutorialmd) {
    var code = pxt.tutorial.bundleTutorialCode(tutorialmd);
    return Promise.resolve()
        .then(function () {
        if (code == '')
            return Promise.resolve({});
        var usedBlocks = {};
        return compiler.getBlocksAsync()
            .then(function (blocksInfo) { return compiler.decompileSnippetAsync(code, blocksInfo); })
            .then(function (blocksXml) {
            if (blocksXml) {
                var headless = pxt.blocks.loadWorkspaceXml(blocksXml);
                var allblocks = headless.getAllBlocks();
                for (var bi = 0; bi < allblocks.length; ++bi) {
                    var blk = allblocks[bi];
                    usedBlocks[blk.type] = 1;
                }
                return usedBlocks;
            }
            else {
                throw new Error("Empty blocksXml, failed to decompile");
            }
        }).catch(function () {
            pxt.log("Failed to decompile tutorial: " + tutorialId);
            throw new Error("Failed to decompile tutorial: " + tutorialId);
        });
    });
}
exports.getUsedBlocksAsync = getUsedBlocksAsync;
var TutorialMenuItem = /** @class */ (function (_super) {
    __extends(TutorialMenuItem, _super);
    function TutorialMenuItem(props) {
        var _this = _super.call(this, props) || this;
        _this.openTutorialStep = _this.openTutorialStep.bind(_this);
        return _this;
    }
    TutorialMenuItem.prototype.openTutorialStep = function (step) {
        var options = this.props.parent.state.tutorialOptions;
        options.tutorialStep = step;
        pxt.tickEvent("tutorial.step", { tutorial: options.tutorial, step: step }, { interactiveConsent: true });
        this.props.parent.setTutorialStep(step);
    };
    TutorialMenuItem.prototype.renderCore = function () {
        var _this = this;
        var _a = this.props.parent.state.tutorialOptions, tutorialReady = _a.tutorialReady, tutorialStepInfo = _a.tutorialStepInfo, tutorialStep = _a.tutorialStep;
        var currentStep = tutorialStep;
        if (!tutorialReady)
            return React.createElement("div", null);
        function intermediateClassName(index) {
            if (tutorialStepInfo.length < 8 // always show first 8
                || index == 0 // always show first
                || index == tutorialStepInfo.length - 1 // always show last
                || Math.abs(index - currentStep) < 2 // 1 around current step
            )
                return "";
            return "mobile hide";
        }
        return React.createElement("div", { className: "ui item" },
            React.createElement("div", { className: "ui item tutorial-menuitem", role: "menubar" }, tutorialStepInfo.map(function (step, index) {
                return (index == currentStep) ?
                    React.createElement("span", { className: "step-label", key: 'tutorialStep' + index },
                        React.createElement(TutorialMenuItemLink, { index: index, className: "ui circular label " + (currentStep == index ? 'blue selected' : 'inverted') + " " + (!tutorialReady ? 'disabled' : ''), ariaLabel: lf("Tutorial step {0}. This is the current step", index + 1), onClick: _this.openTutorialStep }, index + 1)) :
                    React.createElement("span", { className: "ui step-label " + intermediateClassName(index), key: 'tutorialStep' + index, "data-tooltip": "" + (index + 1), "data-inverted": "", "data-position": "bottom center" },
                        React.createElement(TutorialMenuItemLink, { index: index, className: "ui empty circular label " + (!tutorialReady ? 'disabled' : '') + " clear", ariaLabel: lf("Tutorial step {0}", index + 1), onClick: _this.openTutorialStep }));
            })));
    };
    return TutorialMenuItem;
}(data.Component));
exports.TutorialMenuItem = TutorialMenuItem;
var TutorialMenuItemLink = /** @class */ (function (_super) {
    __extends(TutorialMenuItemLink, _super);
    function TutorialMenuItemLink() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleClick = function () {
            _this.props.onClick(_this.props.index);
        };
        return _this;
    }
    TutorialMenuItemLink.prototype.renderCore = function () {
        var _a = this.props, className = _a.className, ariaLabel = _a.ariaLabel, index = _a.index;
        return React.createElement("a", { className: className, role: "menuitem", "aria-label": ariaLabel, tabIndex: 0, onClick: this.handleClick, onKeyDown: sui.fireClickOnEnter }, this.props.children);
    };
    return TutorialMenuItemLink;
}(data.Component));
exports.TutorialMenuItemLink = TutorialMenuItemLink;
var TutorialHint = /** @class */ (function (_super) {
    __extends(TutorialHint, _super);
    function TutorialHint(props) {
        return _super.call(this, props) || this;
    }
    TutorialHint.prototype.showHint = function () {
        this.setState({ visible: true });
    };
    TutorialHint.prototype.renderCore = function () {
        var _this = this;
        var visible = this.state.visible;
        var options = this.props.parent.state.tutorialOptions;
        var tutorialReady = options.tutorialReady, tutorialStepInfo = options.tutorialStepInfo, tutorialStep = options.tutorialStep, tutorialName = options.tutorialName;
        if (!tutorialReady)
            return React.createElement("div", null);
        var step = tutorialStepInfo[tutorialStep];
        var tutorialHint = step.contentMd;
        var tutorialFullscreen = step.fullscreen;
        var tutorialUnplugged = !!step.unplugged && tutorialStep < tutorialStepInfo.length - 1;
        var header = tutorialFullscreen ? tutorialName : lf("Hint");
        var hide = function () { return _this.setState({ visible: false }); };
        var next = function () {
            hide();
            var nextStep = tutorialStep + 1;
            options.tutorialStep = nextStep;
            pxt.tickEvent("tutorial.hint.next", { tutorial: options.tutorial, step: nextStep });
            _this.props.parent.setTutorialStep(nextStep);
        };
        var isRtl = pxt.Util.isUserLanguageRtl();
        var actions = [{
                label: lf("Ok"),
                onclick: tutorialUnplugged ? next : hide,
                icon: 'check',
                className: 'green'
            }];
        return React.createElement(sui.Modal, { isOpen: visible, className: "hintdialog", closeIcon: true, header: header, buttons: actions, onClose: tutorialUnplugged ? next : hide, dimmer: true, longer: true, closeOnDimmerClick: true, closeOnDocumentClick: true, closeOnEscape: true },
            React.createElement(md.MarkedContent, { markdown: tutorialHint, parent: this.props.parent }));
    };
    return TutorialHint;
}(data.Component));
exports.TutorialHint = TutorialHint;
var TutorialCard = /** @class */ (function (_super) {
    __extends(TutorialCard, _super);
    function TutorialCard(props) {
        var _this = _super.call(this, props) || this;
        _this.closeLightboxOnEscape = function (e) {
            var charCode = core.keyCodeFromEvent(e);
            if (charCode === 27) {
                _this.closeLightbox();
            }
        };
        _this.state = {};
        _this.showHint = _this.showHint.bind(_this);
        _this.closeLightbox = _this.closeLightbox.bind(_this);
        _this.tutorialCardKeyDown = _this.tutorialCardKeyDown.bind(_this);
        _this.okButtonKeyDown = _this.okButtonKeyDown.bind(_this);
        _this.previousTutorialStep = _this.previousTutorialStep.bind(_this);
        _this.nextTutorialStep = _this.nextTutorialStep.bind(_this);
        _this.finishTutorial = _this.finishTutorial.bind(_this);
        return _this;
    }
    TutorialCard.prototype.previousTutorialStep = function () {
        var options = this.props.parent.state.tutorialOptions;
        var currentStep = options.tutorialStep;
        var previousStep = currentStep - 1;
        options.tutorialStep = previousStep;
        pxt.tickEvent("tutorial.previous", { tutorial: options.tutorial, step: previousStep }, { interactiveConsent: true });
        this.props.parent.setTutorialStep(previousStep);
    };
    TutorialCard.prototype.nextTutorialStep = function () {
        var options = this.props.parent.state.tutorialOptions;
        var currentStep = options.tutorialStep;
        var nextStep = currentStep + 1;
        options.tutorialStep = nextStep;
        pxt.tickEvent("tutorial.next", { tutorial: options.tutorial, step: nextStep }, { interactiveConsent: true });
        this.props.parent.setTutorialStep(nextStep);
    };
    TutorialCard.prototype.finishTutorial = function () {
        this.closeLightbox();
        this.props.parent.completeTutorial();
    };
    TutorialCard.prototype.setPopout = function () {
        this.setState({ popout: true });
    };
    TutorialCard.prototype.closeLightbox = function () {
        sounds.tutorialNext();
        document.documentElement.removeEventListener("keydown", this.closeLightboxOnEscape);
        // Hide lightbox
        this.props.parent.hideLightbox();
        this.setState({ popout: false });
    };
    TutorialCard.prototype.componentWillUpdate = function () {
        document.documentElement.addEventListener("keydown", this.closeLightboxOnEscape);
    };
    TutorialCard.prototype.tutorialCardKeyDown = function (e) {
        var charCode = core.keyCodeFromEvent(e);
        if (charCode == core.TAB_KEY) {
            e.preventDefault();
            var tutorialOkRef = this.refs["tutorialok"];
            var okButton = ReactDOM.findDOMNode(tutorialOkRef);
            okButton.focus();
        }
    };
    TutorialCard.prototype.okButtonKeyDown = function (e) {
        var charCode = core.keyCodeFromEvent(e);
        if (charCode == core.TAB_KEY) {
            e.preventDefault();
            var tutorialCard = this.refs['tutorialmessage'];
            tutorialCard.focus();
        }
    };
    TutorialCard.prototype.componentDidUpdate = function (prevProps, prevState) {
        var tutorialCard = this.refs['tutorialmessage'];
        var tutorialOkRef = this.refs["tutorialok"];
        var okButton = ReactDOM.findDOMNode(tutorialOkRef);
        if (prevState.popout != this.state.popout && this.state.popout) {
            // Setup focus trap around the tutorial card and the ok button
            tutorialCard.addEventListener('keydown', this.tutorialCardKeyDown);
            okButton.addEventListener('keydown', this.okButtonKeyDown);
            tutorialCard.focus();
        }
        else if (prevState.popout != this.state.popout && !this.state.popout) {
            // Unregister event handlers
            tutorialCard.removeEventListener('keydown', this.tutorialCardKeyDown);
            okButton.removeEventListener('keydown', this.okButtonKeyDown);
            tutorialCard.focus();
        }
    };
    TutorialCard.prototype.componentWillUnmount = function () {
        // Clear the markdown cache when we unmount
        md.MarkedContent.clearBlockSnippetCache();
    };
    TutorialCard.prototype.hasHint = function () {
        var options = this.props.parent.state.tutorialOptions;
        var tutorialReady = options.tutorialReady, tutorialStepInfo = options.tutorialStepInfo, tutorialStep = options.tutorialStep;
        if (!tutorialReady)
            return false;
        return tutorialStepInfo[tutorialStep].hasHint;
    };
    TutorialCard.prototype.showHint = function () {
        if (!this.hasHint())
            return;
        this.closeLightbox();
        this.props.parent.showTutorialHint();
    };
    TutorialCard.prototype.renderCore = function () {
        var options = this.props.parent.state.tutorialOptions;
        var tutorialReady = options.tutorialReady, tutorialStepInfo = options.tutorialStepInfo, tutorialStep = options.tutorialStep;
        if (!tutorialReady)
            return React.createElement("div", null);
        var tutorialCardContent = tutorialStepInfo[tutorialStep].headerContentMd;
        var tutorialAriaLabel = '';
        var currentStep = tutorialStep;
        var maxSteps = tutorialStepInfo.length;
        var hasPrevious = tutorialReady && currentStep != 0;
        var hasNext = tutorialReady && currentStep != maxSteps - 1;
        var hasFinish = currentStep == maxSteps - 1;
        var hasHint = this.hasHint();
        if (hasHint) {
            tutorialAriaLabel += lf("Press Space or Enter to show a hint.");
        }
        var isRtl = pxt.Util.isUserLanguageRtl();
        return React.createElement("div", { id: "tutorialcard", className: "ui " + (tutorialReady ? 'tutorialReady' : '') },
            React.createElement("div", { className: 'ui buttons' },
                hasPrevious ? React.createElement(sui.Button, { icon: (isRtl ? 'right' : 'left') + " chevron", className: "prevbutton left attached green " + (!hasPrevious ? 'disabled' : ''), text: lf("Back"), textClass: "landscape only", ariaLabel: lf("Go to the previous step of the tutorial."), onClick: this.previousTutorialStep, onKeyDown: sui.fireClickOnEnter }) : undefined,
                React.createElement("div", { className: "ui segment attached tutorialsegment" },
                    React.createElement("div", { role: "button", className: 'avatar-image', onClick: this.showHint, onKeyDown: sui.fireClickOnEnter }),
                    hasHint ? React.createElement(sui.Button, { className: "mini blue hintbutton hidelightbox", text: lf("Hint"), tabIndex: -1, onClick: this.showHint, onKeyDown: sui.fireClickOnEnter }) : undefined,
                    React.createElement("div", { ref: "tutorialmessage", className: "tutorialmessage", role: "alert", "aria-label": tutorialAriaLabel, tabIndex: hasHint ? 0 : -1, onClick: this.showHint, onKeyDown: sui.fireClickOnEnter },
                        React.createElement("div", { className: "content" },
                            React.createElement(md.MarkedContent, { markdown: tutorialCardContent, parent: this.props.parent }))),
                    React.createElement(sui.Button, { ref: "tutorialok", id: "tutorialOkButton", className: "large green okbutton showlightbox", text: lf("Ok"), onClick: this.closeLightbox, onKeyDown: sui.fireClickOnEnter })),
                hasNext ? React.createElement(sui.Button, { icon: (isRtl ? 'left' : 'right') + " chevron", rightIcon: true, className: "nextbutton right attached green " + (!hasNext ? 'disabled' : ''), text: lf("Next"), textClass: "landscape only", ariaLabel: lf("Go to the next step of the tutorial."), onClick: this.nextTutorialStep, onKeyDown: sui.fireClickOnEnter }) : undefined,
                hasFinish ? React.createElement(sui.Button, { icon: "left checkmark", className: "orange right attached " + (!tutorialReady ? 'disabled' : ''), text: lf("Finish"), ariaLabel: lf("Finish the tutorial."), onClick: this.finishTutorial, onKeyDown: sui.fireClickOnEnter }) : undefined));
    };
    return TutorialCard;
}(data.Component));
exports.TutorialCard = TutorialCard;
