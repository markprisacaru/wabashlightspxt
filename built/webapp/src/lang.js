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
var codecard = require("./codecard");
var sui = require("./sui");
var data = require("./data");
var allLanguages = {
    "af": { englishName: "Afrikaans", localizedName: "Afrikaans" },
    "ar": { englishName: "Arabic", localizedName: "العربية" },
    "bg": { englishName: "Bulgarian", localizedName: "български" },
    "ca": { englishName: "Catalan", localizedName: "Català" },
    "cs": { englishName: "Czech", localizedName: "Čeština" },
    "da": { englishName: "Danish", localizedName: "Dansk" },
    "de": { englishName: "German", localizedName: "Deutsch" },
    "el": { englishName: "Greek", localizedName: "Ελληνικά" },
    "en": { englishName: "English", localizedName: "English" },
    "es-ES": { englishName: "Spanish (Spain)", localizedName: "Español (España)" },
    "es-MX": { englishName: "Spanish (Mexico)", localizedName: "Español (México)" },
    "fi": { englishName: "Finnish", localizedName: "Suomi" },
    "fr": { englishName: "French", localizedName: "Français" },
    "fr-CA": { englishName: "French (Canada)", localizedName: "Français (Canada)" },
    "he": { englishName: "Hebrew", localizedName: "עברית" },
    "hr": { englishName: "Croatian", localizedName: "Hrvatski" },
    "hu": { englishName: "Hungarian", localizedName: "Magyar" },
    "hy-AM": { englishName: "Armenian (Armenia)", localizedName: "Հայերէն (Հայաստան)" },
    "id": { englishName: "Indonesian", localizedName: "Bahasa Indonesia" },
    "is": { englishName: "Icelandic", localizedName: "Íslenska" },
    "it": { englishName: "Italian", localizedName: "Italiano" },
    "ja": { englishName: "Japanese", localizedName: "日本語" },
    "ko": { englishName: "Korean", localizedName: "한국어" },
    "lt": { englishName: "Lithuanian", localizedName: "Lietuvių" },
    "nl": { englishName: "Dutch", localizedName: "Nederlands" },
    "no": { englishName: "Norwegian", localizedName: "Norsk" },
    "pl": { englishName: "Polish", localizedName: "Polski" },
    "pt-BR": { englishName: "Portuguese (Brazil)", localizedName: "Português (Brasil)" },
    "pt-PT": { englishName: "Portuguese (Portugal)", localizedName: "Português (Portugal)" },
    "ro": { englishName: "Romanian", localizedName: "Română" },
    "ru": { englishName: "Russian", localizedName: "Русский" },
    "si-LK": { englishName: "Sinhala (Sri Lanka)", localizedName: "සිංහල (ශ්රී ලංකා)" },
    "sk": { englishName: "Slovak", localizedName: "Slovenčina" },
    "sl": { englishName: "Slovenian", localizedName: "Slovenski" },
    "sr": { englishName: "Serbian", localizedName: "Srpski" },
    "sv-SE": { englishName: "Swedish (Sweden)", localizedName: "Svenska (Sverige)" },
    "ta": { englishName: "Tamil", localizedName: "தமிழ்" },
    "tr": { englishName: "Turkish", localizedName: "Türkçe" },
    "uk": { englishName: "Ukrainian", localizedName: "Українська" },
    "vi": { englishName: "Vietnamese", localizedName: "Tiếng việt" },
    "zh-CN": { englishName: "Chinese (Simplified)", localizedName: "简体中文" },
    "zh-TW": { englishName: "Chinese (Traditional)", localizedName: "繁体中文" },
};
var pxtLangCookieId = "PXT_LANG";
var langCookieExpirationDays = 30;
var defaultLanguages = ["en"];
function setInitialLang(lang) {
    exports.initialLang = pxt.Util.normalizeLanguageCode(lang);
}
exports.setInitialLang = setInitialLang;
function getCookieLang() {
    var cookiePropRegex = new RegExp(pxt.Util.escapeForRegex(pxtLangCookieId) + "=(.*?)(?:;|$)");
    var cookieValue = cookiePropRegex.exec(document.cookie);
    return cookieValue && cookieValue[1] || null;
}
exports.getCookieLang = getCookieLang;
function setCookieLang(langId) {
    if (!allLanguages[langId]) {
        return;
    }
    if (langId !== getCookieLang()) {
        pxt.tickEvent("menu.lang.setcookielang." + langId);
        var expiration = new Date();
        expiration.setTime(expiration.getTime() + (langCookieExpirationDays * 24 * 60 * 60 * 1000));
        document.cookie = pxtLangCookieId + "=" + langId + "; expires=" + expiration.toUTCString();
    }
}
exports.setCookieLang = setCookieLang;
var LanguagePicker = /** @class */ (function (_super) {
    __extends(LanguagePicker, _super);
    function LanguagePicker(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            visible: false
        };
        _this.hide = _this.hide.bind(_this);
        _this.changeLanguage = _this.changeLanguage.bind(_this);
        return _this;
    }
    LanguagePicker.prototype.languageList = function () {
        if (pxt.appTarget.appTheme.selectLanguage && pxt.appTarget.appTheme.availableLocales && pxt.appTarget.appTheme.availableLocales.length) {
            return pxt.appTarget.appTheme.availableLocales;
        }
        return defaultLanguages;
    };
    LanguagePicker.prototype.changeLanguage = function (langId) {
        var _this = this;
        if (!allLanguages[langId]) {
            return;
        }
        setCookieLang(langId);
        if (langId !== exports.initialLang) {
            pxt.tickEvent("menu.lang.changelang." + langId);
            pxt.winrt.releaseAllDevicesAsync()
                .then(function () {
                _this.props.parent.reloadEditor();
            })
                .done();
        }
        else {
            pxt.tickEvent("menu.lang.samelang." + langId);
            this.hide();
        }
    };
    LanguagePicker.prototype.hide = function () {
        this.setState({ visible: false });
    };
    LanguagePicker.prototype.show = function () {
        this.setState({ visible: true });
    };
    LanguagePicker.prototype.renderCore = function () {
        var _this = this;
        if (!this.state.visible)
            return React.createElement("div", null);
        var targetTheme = pxt.appTarget.appTheme;
        var languageList = this.languageList();
        var modalSize = languageList.length > 4 ? "large" : "small";
        return (React.createElement(sui.Modal, { isOpen: this.state.visible, size: modalSize, onClose: this.hide, dimmer: true, header: lf("Select Language"), closeIcon: true, allowResetFocus: true, closeOnDimmerClick: true, closeOnDocumentClick: true, closeOnEscape: true },
            React.createElement("div", { className: "group" },
                React.createElement("div", { className: "ui cards centered", role: "listbox" }, languageList.map(function (langId) {
                    return React.createElement(LanguageCard, { key: langId, langId: langId, name: allLanguages[langId].localizedName, ariaLabel: allLanguages[langId].englishName, description: allLanguages[langId].englishName, onClick: _this.changeLanguage });
                }))),
            targetTheme.crowdinProject ?
                React.createElement("p", null,
                    React.createElement("br", null),
                    React.createElement("br", null),
                    React.createElement("a", { href: "https://crowdin.com/project/" + targetTheme.crowdinProject, target: "_blank", rel: "noopener noreferrer", "aria-label": lf("Help us translate") }, lf("Help us translate"))) : undefined));
    };
    return LanguagePicker;
}(data.Component));
exports.LanguagePicker = LanguagePicker;
var LanguageCard = /** @class */ (function (_super) {
    __extends(LanguageCard, _super);
    function LanguageCard(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }
    LanguageCard.prototype.handleClick = function () {
        this.props.onClick(this.props.langId);
    };
    LanguageCard.prototype.renderCore = function () {
        var _a = this.props, name = _a.name, ariaLabel = _a.ariaLabel, description = _a.description;
        return React.createElement(codecard.CodeCardView, { className: "card-selected", name: name, ariaLabel: ariaLabel, role: "link", description: description, onClick: this.handleClick });
    };
    return LanguageCard;
}(sui.StatelessUIElement));
