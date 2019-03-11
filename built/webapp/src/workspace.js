"use strict";
/// <reference path="../../built/pxtlib.d.ts" />
/// <reference path="../../built/pxteditor.d.ts" />
/// <reference path="../../built/pxtwinrt.d.ts" />
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
var db = require("./db");
var core = require("./core");
var data = require("./data");
var cloudworkspace = require("./browserworkspace");
var fileworkspace = require("./fileworkspace");
var memoryworkspace = require("./memoryworkspace");
var iframeworkspace = require("./iframeworkspace");
var cloudsync = require("./cloudsync");
var indexedDBWorkspace = require("./idbworkspace");
var compiler = require("./compiler");
var U = pxt.Util;
var Cloud = pxt.Cloud;
// Avoid importing entire crypto-js
/* tslint:disable:no-submodule-imports */
var sha1 = require("crypto-js/sha1");
var allScripts = [];
var headerQ = new U.PromiseQueue();
var impl;
var implType;
function lookup(id) {
    return allScripts.filter(function (x) { return x.header.id == id || x.header.path == id; })[0];
}
function gitsha(data) {
    return (sha1("blob " + U.toUTF8(data).length + "\u0000" + data) + "");
}
exports.gitsha = gitsha;
function copyProjectToLegacyEditor(header, majorVersion) {
    if (!isBrowserWorkspace()) {
        return Promise.reject("Copy operation only works in browser workspace");
    }
    return cloudworkspace.copyProjectToLegacyEditor(header, majorVersion);
}
exports.copyProjectToLegacyEditor = copyProjectToLegacyEditor;
function setupWorkspace(id) {
    U.assert(!impl, "workspace set twice");
    pxt.log("workspace: " + id);
    implType = id;
    switch (id) {
        case "fs":
        case "file":
            impl = fileworkspace.provider;
            break;
        case "mem":
        case "memory":
            impl = memoryworkspace.provider;
            break;
        case "iframe":
            impl = iframeworkspace.provider;
            break;
        case "uwp":
            fileworkspace.setApiAsync(pxt.winrt.workspace.fileApiAsync);
            impl = pxt.winrt.workspace.getProvider(fileworkspace.provider);
            break;
        case "idb":
            impl = indexedDBWorkspace.provider;
            break;
        case "cloud":
        case "browser":
        default:
            impl = cloudworkspace.provider;
            break;
    }
}
exports.setupWorkspace = setupWorkspace;
function getHeaders(withDeleted) {
    if (withDeleted === void 0) { withDeleted = false; }
    checkSession();
    var r = allScripts.map(function (e) { return e.header; }).filter(function (h) { return (withDeleted || !h.isDeleted) && !h.isBackup; });
    r.sort(function (a, b) { return b.recentUse - a.recentUse; });
    return r;
}
exports.getHeaders = getHeaders;
function makeBackupAsync(h, text) {
    var h2 = U.flatClone(h);
    h2.id = U.guidGen();
    delete h2._rev;
    delete h2._id;
    h2.isBackup = true;
    return importAsync(h2, text)
        .then(function () {
        h.backupRef = h2.id;
        return saveAsync(h2);
    })
        .then(function () { return h2; });
}
exports.makeBackupAsync = makeBackupAsync;
function restoreFromBackupAsync(h) {
    if (!h.backupRef || h.isDeleted)
        return Promise.resolve();
    var refId = h.backupRef;
    return getTextAsync(refId)
        .then(function (files) {
        delete h.backupRef;
        return saveAsync(h, files);
    })
        .then(function () {
        var backup = getHeader(refId);
        backup.isDeleted = true;
        return saveAsync(backup);
    })
        .catch(function () {
        delete h.backupRef;
        return saveAsync(h);
    });
}
exports.restoreFromBackupAsync = restoreFromBackupAsync;
function cleanupBackupsAsync() {
    checkSession();
    var allHeaders = allScripts.map(function (e) { return e.header; });
    var refMap = {};
    // Figure out which scripts have backups
    allHeaders.filter(function (h) { return h.backupRef; }).forEach(function (h) { return refMap[h.backupRef] = true; });
    // Delete the backups that don't have any scripts referencing them
    return Promise.all(allHeaders.filter(function (h) { return (h.isBackup && !refMap[h.id]); }).map(function (h) {
        h.isDeleted = true;
        return saveAsync(h);
    }));
}
exports.cleanupBackupsAsync = cleanupBackupsAsync;
function getHeader(id) {
    checkSession();
    var e = lookup(id);
    if (e && !e.header.isDeleted)
        return e.header;
    return null;
}
exports.getHeader = getHeader;
var sessionID;
function isSessionOutdated() {
    return pxt.storage.getLocal('pxt_workspace_session_id') != sessionID;
}
exports.isSessionOutdated = isSessionOutdated;
function checkSession() {
    if (isSessionOutdated()) {
        pxt.Util.assert(false, "trying to access outdated session");
    }
}
function initAsync() {
    if (!impl)
        impl = cloudworkspace.provider;
    // generate new workspace session id to avoid races with other tabs
    sessionID = ts.pxtc.Util.guidGen();
    pxt.storage.setLocal('pxt_workspace_session_id', sessionID);
    pxt.debug("workspace session: " + sessionID);
    allScripts = [];
    return syncAsync()
        .then(function (state) { return cleanupBackupsAsync().then(function () { return state; }); });
}
exports.initAsync = initAsync;
function getTextAsync(id) {
    checkSession();
    var e = lookup(id);
    if (!e)
        return Promise.resolve(null);
    if (e.text)
        return Promise.resolve(e.text);
    return headerQ.enqueue(id, function () { return impl.getAsync(e.header)
        .then(function (resp) {
        if (!e.text) {
            // otherwise we were beaten to it
            e.text = fixupFileNames(resp.text);
        }
        e.version = resp.version;
        return e.text;
    }); });
}
exports.getTextAsync = getTextAsync;
// https://github.com/Microsoft/pxt-backend/blob/master/docs/sharing.md#anonymous-publishing
function anonymousPublishAsync(h, text, meta, screenshotUri) {
    var saveId = {};
    h.saveId = saveId;
    var thumbnailBuffer;
    var thumbnailMimeType;
    if (screenshotUri) {
        var m = /^data:(image\/(png|gif));base64,([a-zA-Z0-9+/]+=*)$/.exec(screenshotUri);
        if (m) {
            thumbnailBuffer = m[3];
            thumbnailMimeType = m[1];
        }
    }
    var stext = JSON.stringify(text, null, 2) + "\n";
    var scrReq = {
        name: h.name,
        target: h.target,
        targetVersion: h.targetVersion,
        description: meta.description || lf("Made with ❤️ in {0}.", pxt.appTarget.title || pxt.appTarget.name),
        editor: h.editor,
        text: text,
        meta: {
            versions: pxt.appTarget.versions,
            blocksHeight: meta.blocksHeight,
            blocksWidth: meta.blocksWidth
        },
        thumbnailBuffer: thumbnailBuffer,
        thumbnailMimeType: thumbnailMimeType
    };
    pxt.debug("publishing script; " + stext.length + " bytes");
    return Cloud.privatePostAsync("scripts", scrReq, /* forceLiveEndpoint */ true)
        .then(function (inf) {
        if (inf.shortid)
            inf.id = inf.shortid;
        h.pubId = inf.shortid;
        h.pubCurrent = h.saveId === saveId;
        h.meta = inf.meta;
        pxt.debug("published; id /" + h.pubId);
        return saveAsync(h)
            .then(function () { return inf; });
    });
}
exports.anonymousPublishAsync = anonymousPublishAsync;
function fixupVersionAsync(e) {
    if (e.version !== undefined)
        return Promise.resolve();
    return impl.getAsync(e.header)
        .then(function (resp) {
        e.version = resp.version;
    });
}
function saveAsync(h, text, isCloud) {
    checkSession();
    U.assert(h.target == pxt.appTarget.id);
    if (h.temporary)
        return Promise.resolve();
    var e = lookup(h.id);
    U.assert(e.header === h);
    if (!isCloud)
        h.recentUse = U.nowSeconds();
    if (text || h.isDeleted) {
        if (text)
            e.text = text;
        if (!isCloud) {
            h.pubCurrent = false;
            h.blobCurrent = false;
            h.modificationTime = U.nowSeconds();
            h.targetVersion = h.targetVersion || "0.0.0";
        }
        h.saveId = null;
        // update version on save
    }
    // perma-delete
    if (h.isDeleted && h.blobVersion == "DELETED") {
        var idx = allScripts.indexOf(e);
        U.assert(idx >= 0);
        allScripts.splice(idx, 1);
        return headerQ.enqueue(h.id, function () {
            return fixupVersionAsync(e).then(function () {
                return impl.deleteAsync ? impl.deleteAsync(h, e.version) : impl.setAsync(h, e.version, {});
            });
        });
    }
    // check if we have dynamic boards, store board info for home page rendering
    if (text && pxt.appTarget.simulator && pxt.appTarget.simulator.dynamicBoardDefinition) {
        var pxtjson = JSON.parse(text["pxt.json"] || "{}");
        if (pxtjson && pxtjson.dependencies)
            h.board = Object.keys(pxtjson.dependencies)
                .filter(function (p) { return !!pxt.bundledSvg(p); })[0];
    }
    return headerQ.enqueue(h.id, function () {
        return fixupVersionAsync(e).then(function () {
            return impl.setAsync(h, e.version, text ? e.text : null)
                .then(function (ver) {
                if (text)
                    e.version = ver;
                if (text || h.isDeleted) {
                    h.pubCurrent = false;
                    h.blobCurrent = false;
                    h.saveId = null;
                    data.invalidate("text:" + h.id);
                }
                data.invalidate("header:" + h.id);
                data.invalidate("header:*");
            });
        });
    });
}
exports.saveAsync = saveAsync;
function computePath(h) {
    var path = h.name.replace(/[^a-zA-Z0-9]+/g, " ").trim().replace(/ /g, "-");
    if (!path)
        path = "Untitled"; // do not translate
    if (lookup(path)) {
        var n = 2;
        while (lookup(path + "-" + n))
            n++;
        path += "-" + n;
    }
    return path;
}
function importAsync(h, text, isCloud) {
    if (isCloud === void 0) { isCloud = false; }
    h.path = computePath(h);
    var e = {
        header: h,
        text: text,
        version: null
    };
    allScripts.push(e);
    return saveAsync(h, text, isCloud);
}
exports.importAsync = importAsync;
function installAsync(h0, text) {
    checkSession();
    U.assert(h0.target == pxt.appTarget.id);
    var h = h0;
    h.id = ts.pxtc.Util.guidGen();
    h.recentUse = U.nowSeconds();
    h.modificationTime = h.recentUse;
    return importAsync(h, text)
        .then(function () { return h; });
}
exports.installAsync = installAsync;
function duplicateAsync(h, text, rename) {
    var e = lookup(h.id);
    U.assert(e.header === h);
    var h2 = U.flatClone(h);
    e.header = h2;
    h.id = U.guidGen();
    if (rename) {
        h.name = createDuplicateName(h);
        var cfg = JSON.parse(text[pxt.CONFIG_NAME]);
        cfg.name = h.name;
        text[pxt.CONFIG_NAME] = JSON.stringify(cfg, null, 4);
    }
    delete h._rev;
    delete h._id;
    return importAsync(h, text)
        .then(function () { return h; });
}
exports.duplicateAsync = duplicateAsync;
function createDuplicateName(h) {
    var reducedName = h.name.indexOf("#") > -1 ?
        h.name.substring(0, h.name.lastIndexOf('#')).trim() : h.name;
    var names = U.toDictionary(allScripts.filter(function (e) { return !e.header.isDeleted; }), function (e) { return e.header.name; });
    var n = 2;
    while (names.hasOwnProperty(reducedName + " #" + n))
        n++;
    return reducedName + " #" + n;
}
exports.createDuplicateName = createDuplicateName;
function saveScreenshotAsync(h, data, icon) {
    checkSession();
    return impl.saveScreenshotAsync
        ? impl.saveScreenshotAsync(h, data, icon)
        : Promise.resolve();
}
exports.saveScreenshotAsync = saveScreenshotAsync;
function fixupFileNames(txt) {
    if (!txt)
        return txt;
    ["kind.json", "yelm.json"].forEach(function (oldName) {
        if (!txt[pxt.CONFIG_NAME] && txt[oldName]) {
            txt[pxt.CONFIG_NAME] = txt[oldName];
            delete txt[oldName];
        }
    });
    return txt;
}
exports.fixupFileNames = fixupFileNames;
var scriptDlQ = new U.PromiseQueue();
var scripts = new db.Table("script"); // cache for published scripts
//let scriptCache:any = {}
function getPublishedScriptAsync(id) {
    checkSession();
    //if (scriptCache.hasOwnProperty(id)) return Promise.resolve(scriptCache[id])
    if (pxt.github.isGithubId(id))
        id = pxt.github.noramlizeRepoId(id);
    var eid = encodeURIComponent(id);
    return pxt.packagesConfigAsync()
        .then(function (config) { return scriptDlQ.enqueue(id, function () { return scripts.getAsync(eid)
        .then(function (v) { return v.files; }, function (e) {
        return (pxt.github.isGithubId(id) ?
            pxt.github.downloadPackageAsync(id, config).then(function (v) { return v.files; }) :
            Cloud.downloadScriptFilesAsync(id))
            .catch(core.handleNetworkError)
            .then(function (files) { return scripts.setAsync({ id: eid, files: files })
            .then(function () {
            //return (scriptCache[id] = files)
            return files;
        }); });
    })
        .then(fixupFileNames); }); });
}
exports.getPublishedScriptAsync = getPublishedScriptAsync;
var PullStatus;
(function (PullStatus) {
    PullStatus[PullStatus["NoSourceControl"] = 0] = "NoSourceControl";
    PullStatus[PullStatus["UpToDate"] = 1] = "UpToDate";
    PullStatus[PullStatus["GotChanges"] = 2] = "GotChanges";
    PullStatus[PullStatus["NeedsCommit"] = 3] = "NeedsCommit";
})(PullStatus = exports.PullStatus || (exports.PullStatus = {}));
var GIT_JSON = pxt.github.GIT_JSON;
function pullAsync(hd) {
    return __awaiter(this, void 0, void 0, function () {
        var files, gitjsontext, gitjson, parsed, sha, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTextAsync(hd.id)];
                case 1:
                    files = _a.sent();
                    return [4 /*yield*/, recomputeHeaderFlagsAsync(hd, files)];
                case 2:
                    _a.sent();
                    gitjsontext = files[GIT_JSON];
                    if (!gitjsontext)
                        return [2 /*return*/, PullStatus.NoSourceControl];
                    if (!hd.githubCurrent)
                        return [2 /*return*/, PullStatus.NeedsCommit];
                    gitjson = JSON.parse(gitjsontext);
                    parsed = pxt.github.parseRepoId(gitjson.repo);
                    return [4 /*yield*/, pxt.github.getRefAsync(parsed.fullName, parsed.tag)];
                case 3:
                    sha = _a.sent();
                    if (sha == gitjson.commit.sha)
                        return [2 /*return*/, PullStatus.UpToDate];
                    return [4 /*yield*/, githubUpdateToAsync(hd, gitjson.repo, sha, files)];
                case 4:
                    res = _a.sent();
                    return [2 /*return*/, PullStatus.GotChanges];
            }
        });
    });
}
exports.pullAsync = pullAsync;
function prAsync(hd, commitId, msg) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, url, headCommit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parsed = pxt.github.parseRepoId(hd.githubId);
                    return [4 /*yield*/, pxt.github.createPRAsync(parsed.fullName, parsed.tag, commitId, msg)
                        // force user back to master - we will instruct them to merge PR in github.com website
                        // and sync here to get the changes
                    ];
                case 1:
                    url = _a.sent();
                    return [4 /*yield*/, pxt.github.getRefAsync(parsed.fullName, parsed.tag)];
                case 2:
                    headCommit = _a.sent();
                    return [4 /*yield*/, githubUpdateToAsync(hd, hd.githubId, headCommit, {})];
                case 3:
                    _a.sent();
                    return [2 /*return*/, url];
            }
        });
    });
}
exports.prAsync = prAsync;
function bumpAsync(hd) {
    return __awaiter(this, void 0, void 0, function () {
        var files, cfg, v;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTextAsync(hd.id)];
                case 1:
                    files = _a.sent();
                    cfg = JSON.parse(files[pxt.CONFIG_NAME]);
                    v = pxt.semver.parse(cfg.version);
                    v.patch++;
                    cfg.version = pxt.semver.stringify(v);
                    files[pxt.CONFIG_NAME] = JSON.stringify(cfg, null, 4);
                    return [4 /*yield*/, saveAsync(hd, files)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, commitAsync(hd, cfg.version, "v" + cfg.version)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.bumpAsync = bumpAsync;
function commitAsync(hd, msg, tag, filenames) {
    if (tag === void 0) { tag = ""; }
    if (filenames === void 0) { filenames = null; }
    return __awaiter(this, void 0, void 0, function () {
        var files, gitjsontext, gitjson, parsed, cfg, treeUpdate, _loop_1, _i, filenames_1, path, treeId, commit, commitId, ok, newCommit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTextAsync(hd.id)];
                case 1:
                    files = _a.sent();
                    gitjsontext = files[GIT_JSON];
                    if (!gitjsontext)
                        U.userError(lf("Not a git extension."));
                    gitjson = JSON.parse(gitjsontext);
                    parsed = pxt.github.parseRepoId(gitjson.repo);
                    cfg = JSON.parse(files[pxt.CONFIG_NAME]);
                    treeUpdate = {
                        base_tree: gitjson.commit.tree.sha,
                        tree: []
                    };
                    if (!filenames)
                        filenames = pxt.allPkgFiles(cfg);
                    _loop_1 = function (path) {
                        var sha, ex, res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (path == GIT_JSON)
                                        return [2 /*return*/, "continue"];
                                    sha = gitsha(files[path]);
                                    ex = gitjson.commit.tree.tree.filter(function (e) { return e.path == path; })[0];
                                    if (!(!ex || ex.sha != sha)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, pxt.github.createObjectAsync(parsed.fullName, "blob", {
                                            content: files[path],
                                            encoding: "utf-8"
                                        })];
                                case 1:
                                    res = _a.sent();
                                    U.assert(res == sha);
                                    treeUpdate.tree.push({
                                        "path": path,
                                        "mode": "100644",
                                        "type": "blob",
                                        "sha": sha,
                                        "url": undefined
                                    });
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, filenames_1 = filenames;
                    _a.label = 2;
                case 2:
                    if (!(_i < filenames_1.length)) return [3 /*break*/, 5];
                    path = filenames_1[_i];
                    return [5 /*yield**/, _loop_1(path)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (treeUpdate.tree.length == 0)
                        U.userError(lf("Nothing to commit!"));
                    return [4 /*yield*/, pxt.github.createObjectAsync(parsed.fullName, "tree", treeUpdate)];
                case 6:
                    treeId = _a.sent();
                    commit = {
                        message: msg,
                        parents: [gitjson.commit.sha],
                        tree: treeId
                    };
                    return [4 /*yield*/, pxt.github.createObjectAsync(parsed.fullName, "commit", commit)];
                case 7:
                    commitId = _a.sent();
                    return [4 /*yield*/, pxt.github.fastForwardAsync(parsed.fullName, parsed.tag, commitId)];
                case 8:
                    ok = _a.sent();
                    newCommit = commitId;
                    if (!!ok) return [3 /*break*/, 10];
                    return [4 /*yield*/, pxt.github.mergeAsync(parsed.fullName, parsed.tag, commitId)];
                case 9:
                    newCommit = _a.sent();
                    _a.label = 10;
                case 10:
                    if (!(newCommit == null)) return [3 /*break*/, 11];
                    return [2 /*return*/, commitId];
                case 11: return [4 /*yield*/, githubUpdateToAsync(hd, gitjson.repo, newCommit, files, tag)];
                case 12:
                    _a.sent();
                    if (!tag) return [3 /*break*/, 14];
                    return [4 /*yield*/, pxt.github.createTagAsync(parsed.fullName, tag, newCommit)];
                case 13:
                    _a.sent();
                    _a.label = 14;
                case 14: return [2 /*return*/, ""];
            }
        });
    });
}
exports.commitAsync = commitAsync;
function githubUpdateToAsync(hd, repoid, commitid, files, tag) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var parsed, commit, gitjson, downloadAsync, cfg, _i, _a, fn;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parsed = pxt.github.parseRepoId(repoid);
                    return [4 /*yield*/, pxt.github.getCommitAsync(parsed.fullName, commitid)];
                case 1:
                    commit = _b.sent();
                    gitjson = JSON.parse(files[GIT_JSON] || "{}");
                    if (!gitjson.commit) {
                        gitjson = {
                            repo: repoid,
                            commit: null
                        };
                    }
                    downloadAsync = function (path) { return __awaiter(_this, void 0, void 0, function () {
                        var treeEnt, text;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    treeEnt = commit.tree.tree.filter(function (e) { return e.path == path; })[0];
                                    if (!treeEnt) {
                                        files[path] = "";
                                        return [2 /*return*/];
                                    }
                                    if (files[path] && gitsha(files[path]) == treeEnt.sha)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, pxt.github.downloadTextAsync(parsed.fullName, commitid, path)];
                                case 1:
                                    text = _a.sent();
                                    files[path] = text;
                                    if (gitsha(files[path]) != treeEnt.sha)
                                        U.userError(lf("Corrupt SHA1 on download of '{0}'.", path));
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, downloadAsync(pxt.CONFIG_NAME)];
                case 2:
                    _b.sent();
                    cfg = JSON.parse(files[pxt.CONFIG_NAME] || "{}");
                    _i = 0, _a = pxt.allPkgFiles(cfg).slice(1);
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    fn = _a[_i];
                    return [4 /*yield*/, downloadAsync(fn)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    if (!cfg.name) {
                        cfg.name = parsed.fullName.replace(/[^\w\-]/g, "");
                        files[pxt.CONFIG_NAME] = JSON.stringify(cfg, null, 4);
                    }
                    commit.tag = tag;
                    gitjson.commit = commit;
                    files[GIT_JSON] = JSON.stringify(gitjson, null, 4);
                    if (!!hd) return [3 /*break*/, 8];
                    return [4 /*yield*/, installAsync({
                            name: cfg.name,
                            githubId: repoid,
                            pubId: "",
                            pubCurrent: false,
                            meta: {},
                            editor: "tsprj",
                            target: pxt.appTarget.id,
                            targetVersion: pxt.appTarget.versions.target,
                        }, files)];
                case 7:
                    hd = _b.sent();
                    return [3 /*break*/, 10];
                case 8:
                    hd.name = cfg.name;
                    return [4 /*yield*/, saveAsync(hd, files)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [2 /*return*/, hd];
            }
        });
    });
}
// to be called after loading header in a editor
function recomputeHeaderFlagsAsync(h, files) {
    return __awaiter(this, void 0, void 0, function () {
        var gitjson, _loop_2, _i, _a, k, state_1;
        return __generator(this, function (_b) {
            h.githubCurrent = false;
            gitjson = JSON.parse(files[GIT_JSON] || "{}");
            h.githubId = gitjson.repo;
            if (!h.githubId)
                return [2 /*return*/];
            if (!gitjson.commit || !gitjson.commit.tree)
                return [2 /*return*/];
            _loop_2 = function (k) {
                if (k == GIT_JSON)
                    return "continue";
                var treeEnt = gitjson.commit.tree.tree.filter(function (e) { return e.path == k; })[0];
                if (!treeEnt || treeEnt.type != "blob")
                    return { value: void 0 };
                if (files[k] && treeEnt.sha != gitsha(files[k]))
                    return { value: void 0 };
            };
            for (_i = 0, _a = Object.keys(files); _i < _a.length; _i++) {
                k = _a[_i];
                state_1 = _loop_2(k);
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
            }
            h.githubCurrent = true;
            return [2 /*return*/];
        });
    });
}
exports.recomputeHeaderFlagsAsync = recomputeHeaderFlagsAsync;
function initializeGithubRepoAsync(hd, repoid) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, name, files, currFiles, allfiles, _i, _a, k;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parsed = pxt.github.parseRepoId(repoid);
                    name = parsed.fullName.replace(/.*\//, "");
                    files = pxt.packageFiles(name);
                    pxt.packageFilesFixup(files, true);
                    return [4 /*yield*/, getTextAsync(hd.id)];
                case 1:
                    currFiles = _b.sent();
                    U.jsonMergeFrom(currFiles, files);
                    return [4 /*yield*/, saveAsync(hd, currFiles)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, commitAsync(hd, "Auto-initialized.", "", Object.keys(currFiles))
                        // remove files not in the package (only in git)
                    ];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, getTextAsync(hd.id)];
                case 4:
                    // remove files not in the package (only in git)
                    currFiles = _b.sent();
                    allfiles = pxt.allPkgFiles(JSON.parse(currFiles[pxt.CONFIG_NAME]));
                    for (_i = 0, _a = Object.keys(currFiles); _i < _a.length; _i++) {
                        k = _a[_i];
                        if (k == GIT_JSON)
                            continue;
                        if (allfiles.indexOf(k) < 0)
                            delete currFiles[k];
                    }
                    return [4 /*yield*/, saveAsync(hd, currFiles)];
                case 5:
                    _b.sent();
                    return [2 /*return*/, hd];
            }
        });
    });
}
exports.initializeGithubRepoAsync = initializeGithubRepoAsync;
function importGithubAsync(id) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, sha, repoid, isEmpty, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parsed = pxt.github.parseRepoId(id);
                    sha = "";
                    repoid = pxt.github.noramlizeRepoId(id).replace(/^github:/, "");
                    isEmpty = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 8]);
                    return [4 /*yield*/, pxt.github.getRefAsync(parsed.fullName, parsed.tag)];
                case 2:
                    sha = _a.sent();
                    return [3 /*break*/, 8];
                case 3:
                    e_1 = _a.sent();
                    if (!(e_1.statusCode == 409)) return [3 /*break*/, 6];
                    // this means repo is completely empty; put something in there
                    return [4 /*yield*/, pxt.github.putFileAsync(parsed.fullName, ".gitignore", "# Initial\n")];
                case 4:
                    // this means repo is completely empty; put something in there
                    _a.sent();
                    isEmpty = true;
                    return [4 /*yield*/, pxt.github.getRefAsync(parsed.fullName, parsed.tag)];
                case 5:
                    sha = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    if (e_1.statusCode == 404)
                        U.userError(lf("No such repository or branch."));
                    _a.label = 7;
                case 7: return [3 /*break*/, 8];
                case 8: return [4 /*yield*/, githubUpdateToAsync(null, repoid, sha, {})
                        .then(function (hd) {
                        if (isEmpty)
                            return initializeGithubRepoAsync(hd, repoid);
                        return hd;
                    })];
                case 9: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.importGithubAsync = importGithubAsync;
function downloadFilesByIdAsync(id) {
    return Cloud.privateGetAsync(id, /* forceLiveEndpoint */ true)
        .then(function (scr) { return getPublishedScriptAsync(scr.id); });
}
exports.downloadFilesByIdAsync = downloadFilesByIdAsync;
function installByIdAsync(id) {
    return Cloud.privateGetAsync(id, /* forceLiveEndpoint */ true)
        .then(function (scr) {
        return getPublishedScriptAsync(scr.id)
            .then(function (files) { return installAsync({
            name: scr.name,
            pubId: id,
            pubCurrent: true,
            meta: scr.meta,
            editor: scr.editor,
            target: scr.target,
            targetVersion: scr.targetVersion || (scr.meta && scr.meta.versions && scr.meta.versions.target)
        }, files); });
    });
}
exports.installByIdAsync = installByIdAsync;
function saveToCloudAsync(h) {
    checkSession();
    return cloudsync.saveToCloudAsync(h);
}
exports.saveToCloudAsync = saveToCloudAsync;
function syncAsync() {
    checkSession();
    return impl.listAsync()
        .catch(function (e) {
        // There might be a problem with the native databases. Switch to memory for this session so the user can at
        // least use the editor.
        pxt.tickEvent("workspace.syncerror", { ws: implType });
        pxt.log("Workspace error, switching to memory workspace");
        impl = memoryworkspace.provider;
        return impl.listAsync();
    })
        .then(function (headers) {
        var existing = U.toDictionary(allScripts || [], function (h) { return h.header.id; });
        allScripts = [];
        for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
            var hd = headers_1[_i];
            var ex = existing[hd.id];
            if (ex) {
                U.jsonCopyFrom(ex.header, hd);
                //ex.text = null
                //ex.version = null
            }
            else {
                ex = {
                    header: hd,
                    text: undefined,
                    version: undefined,
                };
            }
            allScripts.push(ex);
        }
        data.invalidate("header:");
        data.invalidate("text:");
        cloudsync.syncAsync().done(); // sync in background
    })
        .then(function () { return impl.getSyncState ? impl.getSyncState() : null; });
}
exports.syncAsync = syncAsync;
function resetAsync() {
    checkSession();
    allScripts = [];
    return impl.resetAsync()
        .then(cloudsync.resetAsync)
        .then(db.destroyAsync)
        .then(function () {
        pxt.storage.clearLocal();
        data.clearCache();
        // keep local token (localhost and electron) on reset
        if (Cloud.localToken)
            pxt.storage.setLocal("local_token", Cloud.localToken);
    });
}
exports.resetAsync = resetAsync;
function loadedAsync() {
    checkSession();
    if (impl.loadedAsync)
        return impl.loadedAsync();
    return Promise.resolve();
}
exports.loadedAsync = loadedAsync;
function saveAssetAsync(id, filename, data) {
    if (impl.saveAssetAsync)
        return impl.saveAssetAsync(id, filename, data);
    else
        return Promise.reject(new Error(lf("Assets not supported here.")));
}
exports.saveAssetAsync = saveAssetAsync;
function listAssetsAsync(id) {
    if (impl.listAssetsAsync)
        return impl.listAssetsAsync(id);
    return Promise.resolve([]);
}
exports.listAssetsAsync = listAssetsAsync;
function isBrowserWorkspace() {
    return impl === cloudworkspace.provider;
}
exports.isBrowserWorkspace = isBrowserWorkspace;
function fireEvent(ev) {
    if (impl.fireEvent)
        return impl.fireEvent(ev);
    // otherwise, NOP
}
exports.fireEvent = fireEvent;
/*
    header:<guid>   - one header
    header:*        - all headers
*/
data.mountVirtualApi("header", {
    getSync: function (p) {
        p = data.stripProtocol(p);
        if (p == "*")
            return getHeaders();
        return getHeader(p);
    },
});
/*
    headers:SEARCH   - search headers
*/
data.mountVirtualApi("headers", {
    getAsync: function (p) {
        p = data.stripProtocol(p);
        var headers = getHeaders();
        if (!p)
            return Promise.resolve(headers);
        return compiler.projectSearchAsync({ term: p, headers: headers })
            .then(function (searchResults) { return searchResults; })
            .then(function (searchResults) {
            var searchResultsMap = U.toDictionary(searchResults || [], function (h) { return h.id; });
            return headers.filter(function (h) { return searchResultsMap[h.id]; });
        });
    },
    expirationTime: function (p) { return 5 * 1000; },
    onInvalidated: function () {
        compiler.projectSearchClear();
    }
});
/*
    text:<guid>            - all files
    text:<guid>/<filename> - one file
*/
data.mountVirtualApi("text", {
    getAsync: function (p) {
        var m = /^[\w\-]+:([^\/]+)(\/(.*))?/.exec(p);
        return getTextAsync(m[1])
            .then(function (files) {
            if (m[3])
                return files[m[3]];
            else
                return files;
        });
    },
});
