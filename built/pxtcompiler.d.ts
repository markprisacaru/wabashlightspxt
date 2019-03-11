/// <reference path="pxtlib.d.ts" />
/// <reference path="../localtypings/pxtarget.d.ts" />
/// <reference path="../localtypings/pxtpackage.d.ts" />
/// <reference path="typescriptServices.d.ts" />
declare namespace pxt {
    function simshim(prog: ts.Program, pathParse: any): pxt.Map<string>;
}
declare namespace ts.pxtc {
    /**
     * Traverses the AST and injects information about function calls into the expression
     * nodes. The decompiler consumes this information later
     *
     * @param program The TypeScript Program representing the code to compile
     * @param entryPoint The name of the source file to annotate the AST of
     * @param compileTarget The compilation of the target
     */
    function annotate(program: Program, entryPoint: string, compileTarget: CompileTarget): void;
}
declare namespace ts.pxtc {
    interface BitSizeInfo {
        size: number;
        needsSignExt?: boolean;
        immLimit: number;
    }
    function asmStringLiteral(s: string): string;
    abstract class AssemblerSnippets {
        nop(): string;
        reg_gets_imm(reg: string, imm: number): string;
        proc_setup(numlocals: number, main?: boolean): string;
        push_fixed(reg: string[]): string;
        push_local(reg: string): string;
        push_locals(n: number): string;
        pop_fixed(reg: string[]): string;
        pop_locals(n: number): string;
        proc_return(): string;
        debugger_stmt(lbl: string): string;
        debugger_bkpt(lbl: string): string;
        debugger_proc(lbl: string): string;
        unconditional_branch(lbl: string): string;
        beq(lbl: string): string;
        bne(lbl: string): string;
        cmp(reg1: string, reg: string): string;
        cmp_zero(reg1: string): string;
        arithmetic(): string;
        load_reg_src_off(reg: string, src: string, off: string, word?: boolean, store?: boolean, inf?: BitSizeInfo): string;
        rt_call(name: string, r0: string, r1: string): string;
        call_lbl(lbl: string, saveStack?: boolean): string;
        call_reg(reg: string): string;
        vcall(mapMethod: string, isSet: boolean, vtableShift: number): string;
        prologue_vtable(arg_index: number, vtableShift: number): string;
        helper_prologue(): string;
        helper_epilogue(): string;
        pop_clean(pops: boolean[]): string;
        load_ptr_full(lbl: string, reg: string): string;
        emit_int(v: number, reg: string): string;
        obj_header(vt: string): string;
        string_literal(lbl: string, strLit: string): string;
        hex_literal(lbl: string, data: string): string;
        method_call(procid: ir.ProcId, topExpr: ir.Expr): string;
    }
    function numBytes(n: number): number;
    class ProctoAssembler {
        private t;
        private bin;
        private resText;
        private exprStack;
        private calls;
        private proc;
        private baseStackSize;
        private labelledHelpers;
        constructor(t: AssemblerSnippets, bin: Binary, proc: ir.Procedure);
        emitHelpers(): void;
        private write;
        private redirectOutput(f);
        private stackSize();
        private stackAlignmentNeeded(offset?);
        getAssembly(): string;
        private work();
        private mkLbl(root);
        private dumpStack();
        private terminate(expr);
        private validateJmpStack(lbl, off?);
        private emitJmp(jmp);
        private clearStack(fast?);
        private withRef(name, isRef);
        private emitExprInto(e, reg);
        private bitSizeInfo(b);
        private emitExpr(e);
        private emitFieldAccess(e, store?);
        private emitClassCall(procid);
        private ifaceCallCore(numargs, getset, noObjlit?);
        private emitIfaceCall(procid, numargs, getset?);
        private checkSubtype(info, failLbl?, r2?);
        private loadVTable(decr?, r2?);
        private emitInstanceOf(info, tp);
        private emitSharedDef(e);
        private clearArgs(nonRefs, refs);
        private builtInClassNo(typeNo);
        private emitRtCall(topExpr, genCall?);
        private alignedCall(name, cmt?, off?, saveStack?);
        private emitLabelledHelper(lbl, generate);
        private emitHelper(asm, baseName?);
        private pushToExprStack(a);
        private pushArg(a);
        private loadFromExprStack(r, a, off?, store?);
        private pushDummy();
        private alignExprStack(numargs);
        private emitFieldMethods();
        private emitArrayMethod(op, isBuffer);
        private emitArrayMethods();
        private emitLambdaTrampoline();
        private emitProcCall(topExpr);
        private lambdaCall(numargs);
        private emitStore(trg, src);
        private cellref(cell);
        private emitLambdaWrapper(isMain);
        private emitCallRaw(name);
    }
}
declare namespace ts.pxtc {
    function isBuiltinSimOp(name: string): boolean;
    function shimToJs(shimName: string): string;
    function jsEmit(bin: Binary): void;
}
declare namespace ts.pxtc {
    const thumbCmpMap: pxt.Map<string>;
    class ThumbSnippets extends AssemblerSnippets {
        stackAligned(): boolean;
        pushLR(): "push {lr}" | "push {lr, r5}  ; r5 for align";
        popPC(): "pop {pc}" | "pop {pc, r5}  ; r5 for align";
        nop(): string;
        mov(trg: string, dst: string): string;
        helper_ret(): string;
        reg_gets_imm(reg: string, imm: number): string;
        push_fixed(regs: string[]): string;
        pop_fixed(regs: string[]): string;
        proc_setup(numlocals: number, main?: boolean): string;
        proc_return(): string;
        debugger_stmt(lbl: string): string;
        debugger_bkpt(lbl: string): string;
        debugger_proc(lbl: string): string;
        push_local(reg: string): string;
        push_locals(n: number): string;
        pop_locals(n: number): string;
        unconditional_branch(lbl: string): string;
        beq(lbl: string): string;
        bne(lbl: string): string;
        cmp(reg1: string, reg2: string): string;
        cmp_zero(reg1: string): string;
        load_reg_src_off(reg: string, src: string, off: string, word?: boolean, store?: boolean, inf?: BitSizeInfo): string;
        rt_call(name: string, r0: string, r1: string): string;
        alignedCall(lbl: string, stackAlign: number): string;
        call_lbl(lbl: string, saveStack?: boolean, stackAlign?: number): string;
        call_reg(reg: string): string;
        vcall(mapMethod: string, isSet: boolean, vtableShift: number): string;
        prologue_vtable(arg_top_index: number, vtableShift: number): string;
        helper_prologue(): string;
        helper_epilogue(): string;
        load_ptr_full(lbl: string, reg: string): string;
        load_vtable(trg: string, src: string): string;
        lambda_init(): string;
        saveThreadStack(): "" | "mov r7, sp\n    str r7, [r6, #4]\n";
        restoreThreadStack(): "" | "movs r7, #0\n    str r7, [r6, #4]\n";
        callCPPPush(lbl: string): string;
        callCPP(lbl: string, stackAlign?: number): string;
        inline_decr(idx: number): string;
        arithmetic(): string;
        emit_int(v: number, reg: string): string;
    }
}
declare namespace ts.pxtc.decompiler {
    enum DecompileParamKeys {
        DecompileLiterals = "decompileLiterals",
        TaggedTemplate = "taggedTemplate",
        DecompileIndirectFixedInstances = "decompileIndirectFixedInstances",
    }
    const FILE_TOO_LARGE_CODE = 9266;
    interface RenameLocation {
        name: string;
        diff: number;
        span: ts.TextSpan;
    }
    class RenameMap {
        private renames;
        constructor(renames: RenameLocation[]);
        getRenamesInSpan(start: number, end: number): RenameLocation[];
        getRenameForPosition(position: number): RenameLocation;
    }
    /**
     * Uses the language service to ensure that there are no duplicate variable
     * names in the given file. All variables in Blockly are global, so this is
     * necessary to prevent local variables from colliding.
     */
    function buildRenameMap(p: Program, s: SourceFile): RenameMap;
    interface DecompileBlocksOptions {
        snippetMode?: boolean;
        alwaysEmitOnStart?: boolean;
        errorOnGreyBlocks?: boolean;
        useNewFunctions?: boolean;
        includeGreyBlockMessages?: boolean;
    }
    function decompileToBlocks(blocksInfo: pxtc.BlocksInfo, file: ts.SourceFile, options: DecompileBlocksOptions, renameMap?: RenameMap): pxtc.CompileResult;
}
declare namespace ts.pxtc.thumb {
    class ThumbProcessor extends pxtc.assembler.AbstractProcessor {
        constructor();
        toFnPtr(v: number, baseOff: number, lbl: string): number;
        wordSize(): number;
        is32bit(i: assembler.Instruction): boolean;
        postProcessAbsAddress(f: assembler.File, v: number): number;
        emit32(v0: number, v: number, actual: string): pxtc.assembler.EmitResult;
        expandLdlit(f: assembler.File): void;
        getAddressFromLabel(f: assembler.File, i: assembler.Instruction, s: string, wordAligned?: boolean): number;
        isPop(opcode: number): boolean;
        isPush(opcode: number): boolean;
        isAddSP(opcode: number): boolean;
        isSubSP(opcode: number): boolean;
        peephole(ln: pxtc.assembler.Line, lnNext: pxtc.assembler.Line, lnNext2: pxtc.assembler.Line): void;
        registerNo(actual: string): number;
        testAssembler(): void;
    }
}
declare namespace ts.pxtc.ir {
    enum EK {
        None = 0,
        NumberLiteral = 1,
        PointerLiteral = 2,
        RuntimeCall = 3,
        ProcCall = 4,
        SharedRef = 5,
        SharedDef = 6,
        FieldAccess = 7,
        Store = 8,
        CellRef = 9,
        Incr = 10,
        Decr = 11,
        Sequence = 12,
        JmpValue = 13,
        Nop = 14,
        InstanceOf = 15,
    }
    class Node {
        private _id;
        isExpr(): this is Expr;
        isStmt(): this is Stmt;
        getId(): number;
    }
    interface ConvInfo {
        argIdx: number;
        method: string;
        returnsRef?: boolean;
        refTag?: pxt.BuiltInType;
    }
    interface MaskInfo {
        refMask: number;
        conversions?: ConvInfo[];
    }
    class Expr extends Node {
        exprKind: EK;
        args: Expr[];
        data: any;
        jsInfo: string;
        totalUses: number;
        currUses: number;
        irCurrUses: number;
        callingConvention: CallingConvention;
        mask: MaskInfo;
        isStringLiteral: boolean;
        constructor(exprKind: EK, args: Expr[], data: any);
        static clone(e: Expr): Expr;
        isExpr(): boolean;
        isPure(): boolean;
        isLiteral(): boolean;
        isStateless(): boolean;
        sharingInfo(): string;
        toString(): string;
        canUpdateCells(): boolean;
    }
    enum SK {
        None = 0,
        Expr = 1,
        Label = 2,
        Jmp = 3,
        StackEmpty = 4,
        Breakpoint = 5,
    }
    enum JmpMode {
        Always = 1,
        IfZero = 2,
        IfNotZero = 3,
        IfJmpValEq = 4,
        IfLambda = 5,
    }
    class Stmt extends Node {
        stmtKind: SK;
        expr: Expr;
        lblName: string;
        lbl: Stmt;
        lblNumUses: number;
        lblStackSize: number;
        jmpMode: JmpMode;
        lblId: number;
        breakpointInfo: Breakpoint;
        stmtNo: number;
        findIdx: number;
        terminateExpr: Expr;
        constructor(stmtKind: SK, expr: Expr);
        isStmt(): boolean;
        toString(): string;
    }
    class Cell {
        index: number;
        def: Declaration;
        info: VariableAddInfo;
        isarg: boolean;
        iscap: boolean;
        _isLocal: boolean;
        _isGlobal: boolean;
        _debugType: string;
        bitSize: BitSize;
        constructor(index: number, def: Declaration, info: VariableAddInfo);
        getName(): string;
        getDebugInfo(): CellInfo;
        toString(): string;
        uniqueName(): string;
        isLocal(): boolean;
        isGlobal(): boolean;
        loadCore(): Expr;
        load(): Expr;
        refCountingHandledHere(): boolean;
        isByRefLocal(): boolean;
        storeDirect(src: Expr): Expr;
        storeByRef(src: Expr): Expr;
        readonly isTemporary: boolean;
    }
    class UnnamedCell extends Cell {
        index: number;
        owningProc: Procedure;
        private static unnamedCellCounter;
        private uid;
        constructor(index: number, owningProc: Procedure);
        getName(): string;
        uniqueName(): string;
        isByRefLocal(): boolean;
        readonly isTemporary: boolean;
    }
    interface ProcId {
        proc: Procedure;
        virtualIndex: number;
        ifaceIndex: number;
        mapMethod?: string;
        classInfo?: ClassInfo;
        isThis?: boolean;
    }
    interface ProcQuery {
        action: ts.FunctionLikeDeclaration;
    }
    class Procedure extends Node {
        numArgs: number;
        info: FunctionAddInfo;
        seqNo: number;
        isRoot: boolean;
        locals: Cell[];
        captured: Cell[];
        args: Cell[];
        parent: Procedure;
        debugInfo: ProcDebugInfo;
        fillDebugInfo: (th: assembler.File) => void;
        classInfo: ClassInfo;
        perfCounterName: string;
        perfCounterNo: number;
        body: Stmt[];
        lblNo: number;
        action: ts.FunctionLikeDeclaration;
        reset(): void;
        vtLabel(): string;
        label(): string;
        matches(id: ProcQuery): boolean;
        toString(): string;
        emit(stmt: Stmt): void;
        emitExpr(expr: Expr): void;
        mkLabel(name: string): Stmt;
        emitLbl(lbl: Stmt): void;
        emitLblDirect(lblName: string): void;
        getFullName(): string;
        getName(): string;
        mkLocal(def: Declaration, info: VariableAddInfo): Cell;
        mkLocalUnnamed(): UnnamedCell;
        localIndex(l: Declaration, noargs?: boolean): Cell;
        stackEmpty(): void;
        emitClrIfRef(p: Cell): void;
        emitClrs(finlbl: ir.Stmt, retval: ir.Expr): void;
        emitJmpZ(trg: string | Stmt, expr: Expr): void;
        emitJmp(trg: string | Stmt, expr?: Expr, mode?: JmpMode, terminate?: Expr): void;
        resolve(): void;
    }
    function iterExpr(e: Expr, f: (v: Expr) => void): void;
    function stmt(kind: SK, expr: Expr): Stmt;
    function op(kind: EK, args: Expr[], data?: any): Expr;
    function numlit(v: number | boolean): Expr;
    function sharedNoIncr(expr: Expr): Expr;
    function shared(expr: Expr): Expr;
    function ptrlit(lbl: string, jsInfo: string): Expr;
    function rtcall(name: string, args: Expr[], mask?: number): Expr;
    function rtcallMask(name: string, mask: number, callingConv: CallingConvention, args: Expr[]): Expr;
    function flattenArgs(topExpr: ir.Expr): {
        precomp: Expr[];
        flattened: Expr[];
    };
}
declare namespace ts.pxtc {
    const taggedUndefined = 0;
    const taggedNull: number;
    const taggedFalse: number;
    const taggedNaN: number;
    const taggedTrue: number;
    const thumbArithmeticInstr: pxt.Map<boolean>;
    const numberArithmeticInstr: pxt.Map<boolean>;
    const SK: typeof SyntaxKind;
    const numReservedGlobals = 1;
    interface FieldWithAddInfo extends NamedDeclaration {
    }
    type EmittableAsCall = FunctionLikeDeclaration | SignatureDeclaration | ObjectLiteralElementLike | PropertySignature | ModuleDeclaration | ParameterDeclaration | PropertyDeclaration;
    function getNodeId(n: Node): number;
    function stringKind(n: Node): any;
    function isThumb(): boolean;
    function sizeOfBitSize(b: BitSize): 1 | 4 | 2;
    function isBitSizeSigned(b: BitSize): boolean;
    function setCellProps(l: ir.Cell): void;
    function isStatic(node: Declaration): boolean;
    function isObjectType(t: Type): t is ObjectType;
    interface CallInfo {
        decl: Declaration;
        qName: string;
        args: Expression[];
        isExpression: boolean;
        isAutoCreate?: boolean;
    }
    interface ITableEntry {
        name: string;
        idx: number;
        info: number;
        proc: ir.Procedure;
        setProc?: ir.Procedure;
    }
    interface ClassInfo {
        id: string;
        derivedClasses?: ClassInfo[];
        classNo?: number;
        lastSubtypeNo?: number;
        baseClassInfo: ClassInfo;
        decl: ClassDeclaration;
        allfields: FieldWithAddInfo[];
        methods: FunctionLikeDeclaration[];
        attrs: CommentAttrs;
        isUsed?: boolean;
        vtable?: ir.Procedure[];
        itable?: ITableEntry[];
        ctor?: ir.Procedure;
        toStringMethod?: ir.Procedure;
    }
    interface BinaryExpressionInfo {
        leftType: string;
        rightType: string;
    }
    let target: CompileTarget;
    function getComments(node: Node): string;
    function parseCommentsOnSymbol(symbol: Symbol): CommentAttrs;
    function parseComments(node0: Node): CommentAttrs;
    function getName(node: Node & {
        name?: any;
    }): string;
    function checkType(t: Type): Type;
    function getDeclName(node: Declaration): string;
    function getFunctionLabel(node: FunctionLikeDeclaration): string;
    interface FieldAccessInfo {
        idx: number;
        name: string;
        isRef: boolean;
        shimName: string;
        classInfo: ClassInfo;
        needsCheck: boolean;
    }
    type VarOrParam = VariableDeclaration | ParameterDeclaration | PropertyDeclaration | BindingElement;
    type TypedDecl = Declaration & {
        type?: TypeNode;
    };
    interface VariableAddInfo {
        captured?: boolean;
        written?: boolean;
    }
    interface FunctionAddInfo {
        capturedVars: VarOrParam[];
        decl: EmittableAsCall;
        location?: ir.Cell;
        thisParameter?: ParameterDeclaration;
        virtualParent?: FunctionAddInfo;
        virtualInstances?: FunctionAddInfo[];
        virtualIndex?: number;
        isUsed?: boolean;
        parentClassInfo?: ClassInfo;
        usedAsValue?: boolean;
        usedAsIface?: boolean;
    }
    function compileBinary(program: Program, host: CompilerHost, opts: CompileOptions, res: CompileResult, entryPoint: string): EmitResult;
    function isStringType(t: Type): boolean;
    class Binary {
        procs: ir.Procedure[];
        globals: ir.Cell[];
        globalsWords: number;
        nonPtrGlobals: number;
        finalPass: boolean;
        target: CompileTarget;
        writeFile: (fn: string, cont: string) => void;
        res: CompileResult;
        options: CompileOptions;
        usedClassInfos: ClassInfo[];
        sourceHash: string;
        checksumBlock: number[];
        numStmts: number;
        commSize: number;
        packedSource: string;
        itEntries: number;
        itFullEntries: number;
        numMethods: number;
        numVirtMethods: number;
        ifaceMembers: string[];
        strings: pxt.Map<string>;
        hexlits: pxt.Map<string>;
        doubles: pxt.Map<string>;
        otherLiterals: string[];
        codeHelpers: pxt.Map<string>;
        lblNo: number;
        reset(): void;
        addProc(proc: ir.Procedure): void;
        private emitLabelled(v, hash, lblpref);
        emitDouble(v: number): string;
        emitString(s: string): string;
        emitHexLiteral(s: string): string;
        setPerfCounters(systemPerfCounters: string[]): string[];
    }
    function isCtorField(p: ParameterDeclaration): boolean;
}
declare namespace ts.pxtc {
    interface CompileResult {
        ast?: Program;
    }
    function getTsCompilerOptions(opts: CompileOptions): CompilerOptions;
    function nodeLocationInfo(node: ts.Node): LocationInfo;
    function patchUpDiagnostics(diags: ReadonlyArray<Diagnostic>, ignoreFileResolutionErorrs?: boolean): KsDiagnostic[];
    function compile(opts: CompileOptions): CompileResult;
    function decompile(opts: CompileOptions, fileName: string, includeGreyBlockMessages?: boolean, bannedCategories?: string[]): CompileResult;
    function getTSProgram(opts: CompileOptions, old?: ts.Program): Program;
}
declare namespace pxt.elf {
    interface Info {
        template: Uint8Array;
        imageMemStart: number;
        imageFileStart: number;
        phOffset: number;
    }
    function parse(buf: Uint8Array): Info;
    function patch(info: Info, program: Uint8Array): Uint8Array;
}
declare namespace ts.pxtc {
    function toStr(v: any): string;
    function format(input: string, pos: number): {
        formatted: string;
        pos: number;
    };
}
declare namespace ts.pxtc {
    namespace hex {
        let bytecodeStartAddrPadded: number;
        let asmTotalSource: string;
        const defaultPageSize = 1024;
        let commBase: number;
        function hexDump(bytes: ArrayLike<number>, startOffset?: number): string;
        function setupInlineAssembly(opts: CompileOptions): void;
        function flashCodeAlign(opts: CompileTarget): number;
        function encodeVTPtr(ptr: number, opts: CompileOptions): number;
        function setupFor(opts: CompileTarget, extInfo: ExtensionInfo, hexinfo: pxtc.HexInfo): void;
        function validateShim(funname: string, shimName: string, attrs: CommentAttrs, hasRet: boolean, argIsNumber: boolean[]): void;
        function lookupFunc(name: string): FuncInfo;
        function lookupFunctionAddr(name: string): number;
        function hexTemplateHash(): string;
        function hexPrelude(): string;
        function patchHex(bin: Binary, buf: number[], shortForm: boolean, useuf2: boolean): string[];
    }
    function asmline(s: string): string;
    function firstMethodOffset(): number;
    const vtLookups = 3;
    function vtableToAsm(info: ClassInfo, opts: CompileOptions, bin: Binary): string;
    function processorInlineAssemble(target: CompileTarget, src: string): number[];
    function assemble(target: CompileTarget, bin: Binary, src: string): {
        src: string;
        buf: number[];
        thumbFile: assembler.File;
    };
    function processorEmit(bin: Binary, opts: CompileOptions, cres: CompileResult): void;
    let validateShim: typeof hex.validateShim;
    function f4EncodeImg(w: number, h: number, bpp: number, getPix: (x: number, y: number) => number): string;
}
declare namespace ts.pxtc {
    function plainTsc(dir: string): Program;
}
declare namespace ts.pxtc {
    const placeholderChar = "◊";
    const defaultImgLit = "\n. . . . .\n. . . . .\n. . # . .\n. . . . .\n. . . . .\n";
    function renderCall(apiInfo: pxtc.ApisInfo, si: SymbolInfo): string;
    function renderParameters(apis: pxtc.ApisInfo, si: SymbolInfo, cursorMarker?: string): string;
    interface GenDocsOptions {
        package?: boolean;
        locs?: boolean;
        docs?: boolean;
    }
    function genDocs(pkg: string, apiInfo: ApisInfo, options?: GenDocsOptions): pxt.Map<string>;
    function getApiInfo(opts: CompileOptions, program: Program, legacyOnly?: boolean): ApisInfo;
    function getFullName(typechecker: TypeChecker, symbol: Symbol): string;
    function fillCompletionEntries(program: Program, symbols: Symbol[], r: CompletionInfo, apiInfo: ApisInfo): void;
}
declare namespace ts.pxtc.service {
    function performOperation(op: string, arg: OpArg): any;
    function getSnippet(n: ts.SignatureDeclaration, attrs?: CommentAttrs): string;
}
