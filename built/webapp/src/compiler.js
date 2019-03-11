"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pkg = require("./package");
var core = require("./core");
var workspace = require("./workspace");
var U = pxt.Util;
function setDiagnostics(diagnostics) {
    var mainPkg = pkg.mainEditorPkg();
    mainPkg.forEachFile(function (f) { return f.diagnostics = []; });
    var output = "";
    var _loop_1 = function (diagnostic) {
        if (diagnostic.fileName) {
            output += (diagnostic.category == ts.pxtc.DiagnosticCategory.Error ? lf("error") : diagnostic.category == ts.pxtc.DiagnosticCategory.Warning ? lf("warning") : lf("message")) + ": " + diagnostic.fileName + "(" + (diagnostic.line + 1) + "," + (diagnostic.column + 1) + "): ";
            var f_1 = mainPkg.filterFiles(function (f) { return f.getTypeScriptName() == diagnostic.fileName; })[0];
            if (f_1)
                f_1.diagnostics.push(diagnostic);
        }
        var category = ts.pxtc.DiagnosticCategory[diagnostic.category].toLowerCase();
        output += category + " TS" + diagnostic.code + ": " + ts.pxtc.flattenDiagnosticMessageText(diagnostic.messageText, "\n") + "\n";
    };
    for (var _i = 0, diagnostics_1 = diagnostics; _i < diagnostics_1.length; _i++) {
        var diagnostic = diagnostics_1[_i];
        _loop_1(diagnostic);
    }
    if (!output)
        output = U.lf("Everything seems fine!\n");
    var f = mainPkg.outputPkg.setFile("output.txt", output);
    // display total number of errors on the output file
    f.numDiagnosticsOverride = diagnostics.filter(function (d) { return d.category == ts.pxtc.DiagnosticCategory.Error; }).length;
}
var noOpAsync = new Promise(function () { });
function catchUserErrorAndSetDiags(r) {
    return function (v) {
        if (v.isUserError) {
            core.errorNotification(v.message);
            var mainPkg = pkg.mainEditorPkg();
            var f = mainPkg.outputPkg.setFile("output.txt", v.message);
            f.numDiagnosticsOverride = 1;
            return r;
        }
        else
            return Promise.reject(v);
    };
}
function compileAsync(options) {
    if (options === void 0) { options = {}; }
    var trg = pkg.mainPkg.getTargetOptions();
    trg.isNative = options.native;
    trg.preferredEditor = options.preferredEditor;
    return pkg.mainPkg.getCompileOptionsAsync(trg)
        .then(function (opts) {
        if (options.debug) {
            opts.breakpoints = true;
            opts.justMyCode = true;
        }
        if (options.trace) {
            opts.breakpoints = true;
            opts.justMyCode = true;
            opts.trace = true;
        }
        opts.computeUsedSymbols = true;
        if (options.forceEmit)
            opts.forceEmit = true;
        if (/test=1/i.test(window.location.href))
            opts.testMode = true;
        return opts;
    })
        .then(compileCoreAsync)
        .then(function (resp) {
        var outpkg = pkg.mainEditorPkg().outputPkg;
        // keep the assembly file - it is only generated when user hits "Download"
        // and is usually overwritten by the autorun very quickly, so it's impossible to see it
        var prevasm = outpkg.files[pxtc.BINARY_ASM];
        if (prevasm && !resp.outfiles[pxtc.BINARY_ASM]) {
            resp.outfiles[pxtc.BINARY_ASM] = prevasm.content;
        }
        pkg.mainEditorPkg().outputPkg.setFiles(resp.outfiles);
        setDiagnostics(resp.diagnostics);
        return ensureApisInfoAsync()
            .then(function () {
            if (!resp.usedSymbols || !cachedApis)
                return resp;
            for (var _i = 0, _a = Object.keys(resp.usedSymbols); _i < _a.length; _i++) {
                var k = _a[_i];
                resp.usedSymbols[k] = U.lookup(cachedApis.byQName, k);
            }
            return resp;
        });
    })
        .catch(catchUserErrorAndSetDiags(noOpAsync));
}
exports.compileAsync = compileAsync;
function assembleCore(src) {
    return workerOpAsync("assemble", { fileContent: src });
}
function assembleAsync(src) {
    var stackBase = 0x20004000;
    return assembleCore(".startaddr " + (stackBase - 256) + "\n" + src)
        .then(function (r) {
        return assembleCore(".startaddr " + (stackBase - (r.words.length + 1) * 4) + "\n" + src)
            .then(function (rr) {
            U.assert(rr.words.length == r.words.length);
            return rr;
        });
    });
}
exports.assembleAsync = assembleAsync;
function compileCoreAsync(opts) {
    return workerOpAsync("compile", { options: opts });
}
function decompileAsync(fileName, blockInfo, oldWorkspace, blockFile) {
    var trg = pkg.mainPkg.getTargetOptions();
    return pkg.mainPkg.getCompileOptionsAsync(trg)
        .then(function (opts) {
        opts.ast = true;
        opts.testMode = true;
        opts.alwaysDecompileOnStart = pxt.appTarget.runtime && pxt.appTarget.runtime.onStartUnDeletable;
        return decompileCoreAsync(opts, fileName);
    })
        .then(function (resp) {
        // try to patch event locations
        if (resp.success && blockInfo && oldWorkspace && blockFile) {
            var newXml = pxt.blocks.layout.patchBlocksFromOldWorkspace(blockInfo, oldWorkspace, resp.outfiles[blockFile]);
            resp.outfiles[blockFile] = newXml;
        }
        pkg.mainEditorPkg().outputPkg.setFiles(resp.outfiles);
        setDiagnostics(resp.diagnostics);
        return resp;
    });
}
exports.decompileAsync = decompileAsync;
function decompileSnippetAsync(code, blockInfo) {
    var snippetTs = "main.ts";
    var snippetBlocks = "main.blocks";
    var trg = pkg.mainPkg.getTargetOptions();
    return pkg.mainPkg.getCompileOptionsAsync(trg)
        .then(function (opts) {
        opts.fileSystem[snippetTs] = code;
        opts.fileSystem[snippetBlocks] = "";
        if (opts.sourceFiles.indexOf(snippetTs) === -1) {
            opts.sourceFiles.push(snippetTs);
        }
        if (opts.sourceFiles.indexOf(snippetBlocks) === -1) {
            opts.sourceFiles.push(snippetBlocks);
        }
        opts.ast = true;
        return decompileCoreAsync(opts, snippetTs);
    }).then(function (resp) {
        return resp.outfiles[snippetBlocks];
    });
}
exports.decompileSnippetAsync = decompileSnippetAsync;
function decompileCoreAsync(opts, fileName) {
    return workerOpAsync("decompile", { options: opts, fileName: fileName, blocks: blocksOptions() });
}
function workerOpAsync(op, arg) {
    return pxt.worker.getWorker(pxt.webConfig.workerjs).opAsync(op, arg);
}
exports.workerOpAsync = workerOpAsync;
var firstTypecheck;
var cachedApis;
var cachedBlocks;
var refreshApis = false;
function waitForFirstTypecheckAsync() {
    if (firstTypecheck)
        return firstTypecheck;
    else
        return typecheckAsync();
}
function ensureApisInfoAsync() {
    if (refreshApis || !cachedApis)
        return workerOpAsync("apiInfo", {})
            .then(function (apis) {
            if (Object.keys(apis).length === 0)
                return undefined;
            refreshApis = false;
            return ts.pxtc.localizeApisAsync(apis, pkg.mainPkg);
        }).then(function (apis) {
            cachedApis = apis;
        });
    else
        return Promise.resolve();
}
function apiSearchAsync(searchFor) {
    return ensureApisInfoAsync()
        .then(function () {
        searchFor.localizedApis = cachedApis;
        searchFor.localizedStrings = pxt.Util.getLocalizedStrings();
        return workerOpAsync("apiSearch", { search: searchFor, blocks: blocksOptions() });
    });
}
exports.apiSearchAsync = apiSearchAsync;
function projectSearchAsync(searchFor) {
    return ensureApisInfoAsync()
        .then(function () {
        return workerOpAsync("projectSearch", { projectSearch: searchFor });
    });
}
exports.projectSearchAsync = projectSearchAsync;
function projectSearchClear() {
    return ensureApisInfoAsync()
        .then(function () {
        return workerOpAsync("projectSearchClear", {});
    });
}
exports.projectSearchClear = projectSearchClear;
function formatAsync(input, pos) {
    return workerOpAsync("format", { format: { input: input, pos: pos } });
}
exports.formatAsync = formatAsync;
function typecheckAsync() {
    var p = pkg.mainPkg.getCompileOptionsAsync()
        .then(function (opts) {
        opts.testMode = true; // show errors in all top-level code
        return workerOpAsync("setOptions", { options: opts });
    })
        .then(function () { return workerOpAsync("allDiags", {}); })
        .then(setDiagnostics)
        .then(ensureApisInfoAsync)
        .catch(catchUserErrorAndSetDiags(null));
    if (!firstTypecheck)
        firstTypecheck = p;
    return p;
}
exports.typecheckAsync = typecheckAsync;
function getApisInfoAsync() {
    return waitForFirstTypecheckAsync()
        .then(function () { return cachedApis; });
}
exports.getApisInfoAsync = getApisInfoAsync;
function getBlocksAsync() {
    return cachedBlocks
        ? Promise.resolve(cachedBlocks)
        : getApisInfoAsync().then(function (info) {
            cachedBlocks = pxtc.getBlocksInfo(info);
            return cachedBlocks;
        });
}
exports.getBlocksAsync = getBlocksAsync;
function applyUpgradesAsync() {
    var mainPkg = pkg.mainPkg;
    var epkg = pkg.getEditorPkg(mainPkg);
    var pkgVersion = pxt.semver.parse(epkg.header.targetVersion || "0.0.0");
    var trgVersion = pxt.semver.parse(pxt.appTarget.versions.target);
    if (pkgVersion.major === trgVersion.major && pkgVersion.minor === trgVersion.minor) {
        pxt.debug("Skipping project upgrade");
        return Promise.resolve({
            success: true
        });
    }
    var upgradeOp = epkg.header.editor === pxt.JAVASCRIPT_PROJECT_NAME ? upgradeFromTSAsync : upgradeFromBlocksAsync;
    var projectNeverCompiled = false;
    return checkPatchAsync()
        .catch(function () { return projectNeverCompiled = true; })
        .then(upgradeOp)
        .then(function (result) {
        if (!result.success) {
            pxt.tickEvent("upgrade.failed", {
                projectEditor: epkg.header.editor,
                preUpgradeVersion: epkg.header.targetVersion || "unknown",
                errors: JSON.stringify(result.errorCodes),
                projectNeverCompiled: "" + projectNeverCompiled
            });
            pxt.debug("Upgrade failed; bailing out and leaving project as-is");
            return Promise.resolve(result);
        }
        pxt.tickEvent("upgrade.success", {
            projectEditor: epkg.header.editor,
            upgradedEditor: result.editor,
            preUpgradeVersion: epkg.header.targetVersion || "unknown",
            projectNeverCompiled: "" + projectNeverCompiled
        });
        pxt.debug("Upgrade successful!");
        return patchProjectFilesAsync(epkg, result.patchedFiles, result.editor)
            .then(function () { return result; });
    });
}
exports.applyUpgradesAsync = applyUpgradesAsync;
function upgradeFromBlocksAsync() {
    var mainPkg = pkg.mainPkg;
    var project = pkg.getEditorPkg(mainPkg);
    var targetVersion = project.header.targetVersion;
    var fileText = project.files["main.blocks"] ? project.files["main.blocks"].content : "<block type=\"" + ts.pxtc.ON_START_TYPE + "\"></block>";
    var ws;
    var patchedFiles = {};
    pxt.debug("Applying upgrades to blocks");
    return pxt.BrowserUtils.loadBlocklyAsync()
        .then(function () { return getBlocksAsync(); })
        .then(function (info) {
        ws = new Blockly.Workspace();
        var text = pxt.blocks.importXml(targetVersion, fileText, info, true);
        var xml = Blockly.Xml.textToDom(text);
        pxt.blocks.domToWorkspaceNoEvents(xml, ws);
        patchedFiles["main.blocks"] = text;
        return pxt.blocks.compileAsync(ws, info);
    })
        .then(function (res) {
        patchedFiles["main.ts"] = res.source;
        return checkPatchAsync(patchedFiles);
    })
        .then(function () {
        return {
            success: true,
            editor: pxt.BLOCKS_PROJECT_NAME,
            patchedFiles: patchedFiles
        };
    })
        .catch(function () {
        pxt.debug("Block upgrade failed, falling back to TS");
        return upgradeFromTSAsync();
    });
}
function upgradeFromTSAsync() {
    var mainPkg = pkg.mainPkg;
    var project = pkg.getEditorPkg(mainPkg);
    var targetVersion = project.header.targetVersion;
    var patchedFiles = {};
    pxt.Util.values(project.files).filter(isTsFile).forEach(function (file) {
        var patched = pxt.patching.patchJavaScript(targetVersion, file.content);
        if (patched != file.content) {
            patchedFiles[file.name] = patched;
        }
    });
    pxt.debug("Applying upgrades to TypeScript");
    return checkPatchAsync(patchedFiles)
        .then(function () {
        return {
            success: true,
            editor: pxt.JAVASCRIPT_PROJECT_NAME,
            patchedFiles: patchedFiles
        };
    })
        .catch(function (e) {
        return {
            success: false,
            errorCodes: e.errorCodes
        };
    });
}
function checkPatchAsync(patchedFiles) {
    var mainPkg = pkg.mainPkg;
    return mainPkg.getCompileOptionsAsync()
        .then(function (opts) {
        if (patchedFiles) {
            Object.keys(opts.fileSystem).forEach(function (fileName) {
                if (patchedFiles[fileName]) {
                    opts.fileSystem[fileName] = patchedFiles[fileName];
                }
            });
        }
        return compileCoreAsync(opts);
    })
        .then(function (res) {
        if (!res.success) {
            var errorCodes_1 = {};
            if (res.diagnostics) {
                res.diagnostics.forEach(function (d) {
                    var code = "TS" + d.code;
                    errorCodes_1[code] = (errorCodes_1[code] || 0) + 1;
                });
            }
            var error = new Error("Compile failed on updated package");
            error.errorCodes = errorCodes_1;
            return Promise.reject(error);
        }
        return Promise.resolve();
    });
}
function patchProjectFilesAsync(project, patchedFiles, editor) {
    Object.keys(patchedFiles).forEach(function (name) { return project.setFile(name, patchedFiles[name]); });
    project.header.targetVersion = pxt.appTarget.versions.target;
    project.header.editor = editor;
    return project.saveFilesAsync();
}
function isTsFile(file) {
    return pxt.Util.endsWith(file.getName(), ".ts");
}
function updatePackagesAsync(packages, token) {
    var epkg = pkg.mainEditorPkg();
    var backup;
    var completed = 0;
    if (token)
        token.startOperation();
    return workspace.getTextAsync(epkg.header.id)
        .then(function (files) { return workspace.makeBackupAsync(epkg.header, files); })
        .then(function (newHeader) {
        backup = newHeader;
        epkg.header.backupRef = backup.id;
        return workspace.saveAsync(epkg.header);
    })
        .then(function () { return Promise.each(packages, function (p) {
        if (token)
            token.throwIfCancelled();
        return epkg.updateDepAsync(p.getPkgId())
            .then(function () {
            ++completed;
            if (token && !token.isCancelled())
                token.reportProgress(completed, packages.length);
        });
    }); })
        .then(function () { return pkg.loadPkgAsync(epkg.header.id); })
        .then(function () { return newProjectAsync(); })
        .then(function () { return checkPatchAsync(); })
        .then(function () {
        if (token)
            token.throwIfCancelled();
        delete epkg.header.backupRef;
        return workspace.saveAsync(epkg.header);
    })
        .then(function () { /* Success! */ return true; })
        .catch(function () {
        // Something went wrong or we broke the project, so restore the backup
        return workspace.restoreFromBackupAsync(epkg.header)
            .then(function () { return false; });
    })
        .finally(function () {
        // Clean up after
        var cleanupOperation = Promise.resolve();
        if (backup) {
            backup.isDeleted = true;
            cleanupOperation = workspace.saveAsync(backup);
        }
        return cleanupOperation
            .finally(function () {
            if (token)
                token.resolveCancel();
        });
    });
}
exports.updatePackagesAsync = updatePackagesAsync;
function newProjectAsync() {
    firstTypecheck = null;
    cachedApis = null;
    cachedBlocks = null;
    return workerOpAsync("reset", {});
}
exports.newProjectAsync = newProjectAsync;
function getPackagesWithErrors() {
    var badPackages = {};
    var topPkg = pkg.mainEditorPkg();
    if (topPkg) {
        var corePkgs_1 = pxt.Package.corePackages().map(function (pkg) { return pkg.name; });
        topPkg.forEachFile(function (file) {
            if (file.diagnostics && file.diagnostics.length && file.epkg && corePkgs_1.indexOf(file.epkg.getPkgId()) === -1 && !file.epkg.isTopLevel() &&
                file.diagnostics.some(function (d) { return d.category === ts.pxtc.DiagnosticCategory.Error; })) {
                badPackages[file.epkg.getPkgId()] = file.epkg;
            }
        });
    }
    return pxt.Util.values(badPackages);
}
exports.getPackagesWithErrors = getPackagesWithErrors;
function blocksOptions() {
    if (pxt.appTarget && pxt.appTarget.runtime && pxt.appTarget.runtime.bannedCategories && pxt.appTarget.runtime.bannedCategories.length) {
        return { bannedCategories: pxt.appTarget.runtime.bannedCategories };
    }
    return undefined;
}
