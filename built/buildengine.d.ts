/// <reference path="pxtlib.d.ts" />
/// <reference path="pxtsim.d.ts" />
import Map = pxt.Map;
export interface BuildEngine {
    updateEngineAsync: () => Promise<void>;
    setPlatformAsync: () => Promise<void>;
    buildAsync: () => Promise<void>;
    patchHexInfo: (extInfo: pxtc.ExtensionInfo) => pxtc.HexInfo;
    prepBuildDirAsync: () => Promise<void>;
    buildPath: string;
    appPath: string;
    moduleConfig: string;
    deployAsync?: (r: pxtc.CompileResult) => Promise<void>;
}
export interface TargetRuntime {
    includePath: string;
}
export declare const buildEngines: Map<BuildEngine>;
export declare let thisBuild: BuildEngine;
export declare function setThisBuild(b: BuildEngine): void;
export declare function buildHexAsync(buildEngine: BuildEngine, mainPkg: pxt.MainPackage, extInfo: pxtc.ExtensionInfo, forceBuild: boolean): Promise<void>;
export declare function codalGitAsync(...args: string[]): Promise<void>;
export declare function buildDalConst(buildEngine: BuildEngine, mainPkg: pxt.MainPackage, rebuild?: boolean, create?: boolean): void;
