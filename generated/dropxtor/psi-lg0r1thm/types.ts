/* Auto-generated TypeScript code */
/* WARNING: Do not modify this file directly. It is generated from ABI definitions. */

type __TnIrNode =
  | { readonly op: "zero" }
  | { readonly op: "const"; readonly value: bigint }
  | { readonly op: "field"; readonly param: string }
  | {
      readonly op: "add";
      readonly left: __TnIrNode;
      readonly right: __TnIrNode;
    }
  | {
      readonly op: "mul";
      readonly left: __TnIrNode;
      readonly right: __TnIrNode;
    }
  | {
      readonly op: "align";
      readonly alignment: number;
      readonly node: __TnIrNode;
    }
  | {
      readonly op: "switch";
      readonly tag: string;
      readonly cases: readonly { readonly value: number; readonly node: __TnIrNode }[];
      readonly default?: __TnIrNode;
    }
  | {
      readonly op: "call";
      readonly typeName: string;
      readonly args: readonly { readonly name: string; readonly source: string }[];
    }
  | {
      readonly op: "sumOverArray";
      readonly count: __TnIrNode;
      readonly elementTypeName: string;
      readonly fieldName: string;
    };

type __TnIrContext = {
  params: Record<string, bigint>;
  buffer?: Uint8Array;
  typeName?: string;
};

type __TnValidateResult = {
  ok: boolean;
  code?: string;
  consumed?: bigint;
  params?: Record<string, bigint>;
};
type __TnEvalResult =
  | { ok: true; value: bigint }
  | { ok: false; code: string };
type __TnBuilderLike = { build(): Uint8Array };
type __TnStructFieldInput =
  | Uint8Array
  | __TnBuilderLike
  | { buffer?: Uint8Array }
  | { asUint8Array?: () => Uint8Array }
  | { bytes?: () => Uint8Array };
type __TnVariantDescriptor = {
  readonly name: string;
  readonly tag: number;
  readonly payloadSize: number | null;
  readonly payloadType?: string;
  readonly createPayloadBuilder?: () => unknown | null;
};
type __TnVariantSelectorResult<Parent> = {
  select(
    name: string
  ): { writePayload(payload: Uint8Array | __TnBuilderLike): { finish(): Parent } };
  finish(): Parent;
};
type __TnFamWriterResult<Parent> = {
  write(payload: Uint8Array | __TnBuilderLike): { finish(): Parent };
  finish(): Parent;
};
type __TnConsole = { warn?: (...args: unknown[]) => void };

const __tnWarnings = new Set<string>();
const __tnHasNativeBigInt = typeof BigInt === "function";
const __tnHasBigIntDataView =
  typeof DataView !== "undefined" &&
  typeof DataView.prototype.getBigInt64 === "function" &&
  typeof DataView.prototype.getBigUint64 === "function" &&
  typeof DataView.prototype.setBigInt64 === "function" &&
  typeof DataView.prototype.setBigUint64 === "function";
const __tnConsole: __TnConsole | undefined =
  typeof globalThis !== "undefined"
    ? (globalThis as { console?: __TnConsole }).console
    : undefined;

function __tnLogWarn(message: string): void {
  if (__tnConsole && typeof __tnConsole.warn === "function") {
    __tnConsole.warn(message);
  }
}

function __tnWarnOnce(message: string): void {
  if (!__tnWarnings.has(message)) {
    __tnWarnings.add(message);
    __tnLogWarn(message);
  }
}

function __tnResolveBuilderInput(
  input: Uint8Array | __TnBuilderLike,
  context: string
): Uint8Array {
  if (input instanceof Uint8Array) {
    return new Uint8Array(input);
  }
  if (input && typeof (input as __TnBuilderLike).build === "function") {
    const built = (input as __TnBuilderLike).build();
    if (!(built instanceof Uint8Array)) {
      throw new Error(`${context}: builder did not return Uint8Array`);
    }
    return new Uint8Array(built);
  }
  throw new Error(`${context}: expected Uint8Array or builder`);
}

function __tnResolveStructFieldInput(
  input: __TnStructFieldInput,
  context: string
): Uint8Array {
  if (
    input instanceof Uint8Array ||
    (input && typeof (input as __TnBuilderLike).build === "function")
  ) {
    return __tnResolveBuilderInput(input as Uint8Array | __TnBuilderLike, context);
  }
  if (input && typeof (input as { asUint8Array?: () => Uint8Array }).asUint8Array === "function") {
    const bytes = (input as { asUint8Array: () => Uint8Array }).asUint8Array();
    return new Uint8Array(bytes);
  }
  if (input && typeof (input as { bytes?: () => Uint8Array }).bytes === "function") {
    const bytes = (input as { bytes: () => Uint8Array }).bytes();
    return new Uint8Array(bytes);
  }
  if (input && (input as { buffer?: unknown }).buffer instanceof Uint8Array) {
    return new Uint8Array((input as { buffer: Uint8Array }).buffer);
  }
  throw new Error(`${context}: expected Uint8Array, builder, or view-like value`);
}

function __tnMaybeCallBuilder(ctor: unknown): unknown | null {
  if (!ctor) {
    return null;
  }
  const builderFn = (ctor as { builder?: () => unknown }).builder;
  return typeof builderFn === "function" ? builderFn() : null;
}

function __tnCreateVariantSelector<Parent, Descriptor extends __TnVariantDescriptor>(
  parent: Parent,
  descriptors: readonly Descriptor[],
  assign: (descriptor: Descriptor, payload: Uint8Array) => void
): __TnVariantSelectorResult<Parent> {
  return {
    select(name: string) {
      const descriptor = descriptors.find((variant) => variant.name === name);
      if (!descriptor) {
        throw new Error(`Unknown variant '${name}'`);
      }
      return {
        writePayload(payload: Uint8Array | __TnBuilderLike) {
          const bytes = __tnResolveBuilderInput(
            payload,
            `variant ${descriptor.name}`
          );
          if (
            descriptor.payloadSize !== null &&
            bytes.length !== descriptor.payloadSize
          ) {
            throw new Error(
              `Payload for ${descriptor.name} must be ${descriptor.payloadSize} bytes`
            );
          }
          assign(descriptor, bytes);
          return {
            finish(): Parent {
              return parent;
            },
          };
        },
      };
    },
    finish(): Parent {
      return parent;
    },
  };
}

function __tnCreateFamWriter<Parent>(
  parent: Parent,
  fieldName: string,
  assign: (bytes: Uint8Array) => void
): __TnFamWriterResult<Parent> {
  let hasWritten = false;
  return {
    write(payload: Uint8Array | __TnBuilderLike) {
      const bytes = __tnResolveBuilderInput(
        payload,
        `flexible array '${fieldName}'`
      );
      const copy = new Uint8Array(bytes);
      assign(copy);
      hasWritten = true;
      return {
        finish(): Parent {
          return parent;
        },
      };
    },
    finish(): Parent {
      if (!hasWritten) {
        throw new Error(
          `flexible array '${fieldName}' requires write() before finish()`
        );
      }
      return parent;
    },
  };
}

const __tnMask32 = __tnHasNativeBigInt
  ? (BigInt(1) << BigInt(32)) - BigInt(1)
  : 0xffffffff;
const __tnSignBit32 = __tnHasNativeBigInt
  ? BigInt(1) << BigInt(31)
  : 0x80000000;

function __tnToBigInt(value: number | bigint): bigint {
  if (__tnHasNativeBigInt) {
    return typeof value === "bigint" ? value : BigInt(value);
  }
  if (typeof value === "bigint") return value;
  if (!Number.isFinite(value)) {
    throw new Error("IR runtime received non-finite numeric input");
  }
  if (!Number.isSafeInteger(value)) {
    __tnWarnOnce(
      `[thru-net] Precision loss while polyfilling BigInt (value=${value})`
    );
  }
  return (value as unknown) as bigint;
}

function __tnBigIntToNumber(value: bigint, context: string): number {
  if (__tnHasNativeBigInt) {
    const converted = Number(value);
    if (!Number.isFinite(converted)) {
      throw new Error(`${context} overflowed Number range`);
    }
    return converted;
  }
  return value as unknown as number;
}

function __tnBigIntEquals(lhs: bigint, rhs: bigint): boolean {
  if (__tnHasNativeBigInt) return lhs === rhs;
  return (lhs as unknown as number) === (rhs as unknown as number);
}

function __tnBigIntGreaterThan(lhs: bigint, rhs: bigint): boolean {
  if (__tnHasNativeBigInt) return lhs > rhs;
  return (lhs as unknown as number) > (rhs as unknown as number);
}

function __tnPopcount(value: number | bigint): number {
  let v =
    typeof value === "bigint"
      ? Number(value & BigInt(0xffffffff))
      : Number(value) >>> 0;
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  return (((v + (v >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
}

function __tnRaiseIrError(code: string, message: string): never {
  const err = new Error(message);
  (err as { code?: string }).code = code;
  throw err;
}

function __tnCheckedAdd(lhs: bigint, rhs: bigint): bigint {
  if (__tnHasNativeBigInt) {
    const result = (lhs as bigint) + (rhs as bigint);
    if (result < BigInt(0)) {
      __tnRaiseIrError(
        "tn.ir.overflow",
        "IR runtime detected negative size via addition"
      );
    }
    return result;
  }
  const left = lhs as unknown as number;
  const right = rhs as unknown as number;
  const sum = left + right;
  if (sum < 0 || !Number.isFinite(sum)) {
    __tnRaiseIrError(
      "tn.ir.overflow",
      "IR runtime detected invalid addition result"
    );
  }
  if (!Number.isSafeInteger(sum)) {
    __tnWarnOnce("[thru-net] Precision loss while polyfilling BigInt addition");
  }
  return (sum as unknown) as bigint;
}

function __tnCheckedMul(lhs: bigint, rhs: bigint): bigint {
  if (__tnHasNativeBigInt) {
    const result = (lhs as bigint) * (rhs as bigint);
    if (result < BigInt(0)) {
      __tnRaiseIrError(
        "tn.ir.overflow",
        "IR runtime detected negative size via multiplication"
      );
    }
    return result;
  }
  const left = lhs as unknown as number;
  const right = rhs as unknown as number;
  const product = left * right;
  if (product < 0 || !Number.isFinite(product)) {
    __tnRaiseIrError(
      "tn.ir.overflow",
      "IR runtime detected invalid multiplication result"
    );
  }
  if (!Number.isSafeInteger(product)) {
    __tnWarnOnce(
      "[thru-net] Precision loss while polyfilling BigInt multiplication"
    );
  }
  return (product as unknown) as bigint;
}

function __tnAlign(value: bigint, alignment: number): bigint {
  if (alignment <= 1) return value;
  const alignBig = __tnToBigInt(alignment);
  if (__tnHasNativeBigInt) {
    const remainder = value % alignBig;
    if (__tnBigIntEquals(remainder, __tnToBigInt(0))) {
      return value;
    }
    const delta = alignBig - remainder;
    return __tnCheckedAdd(value, delta);
  }
  const current = __tnBigIntToNumber(value, "IR align");
  const alignNum = alignment >>> 0;
  const remainder = current % alignNum;
  const next = remainder === 0 ? current : current + (alignNum - remainder);
  return __tnToBigInt(next);
}

function __tnSplitUint64(value: bigint): { high: number; low: number } {
  if (__tnHasNativeBigInt) {
    const low = Number(value & (__tnMask32 as bigint));
    const high = Number((value >> BigInt(32)) & (__tnMask32 as bigint));
    return { high, low };
  }
  const num = __tnBigIntToNumber(value, "DataView.setBigUint64");
  const low = num >>> 0;
  const high = Math.floor(num / 4294967296) >>> 0;
  return { high, low };
}

function __tnSplitInt64(value: bigint): { high: number; low: number } {
  if (__tnHasNativeBigInt) {
    const low = Number(value & (__tnMask32 as bigint));
    let high = Number((value >> BigInt(32)) & (__tnMask32 as bigint));
    if ((BigInt(high) & (__tnSignBit32 as bigint)) !== BigInt(0)) {
      high -= 0x100000000;
    }
    return { high, low };
  }
  const num = __tnBigIntToNumber(value, "DataView.setBigInt64");
  const low = num >>> 0;
  const high = Math.floor(num / 4294967296);
  return { high, low };
}

function __tnPolyfillReadUint64(
  view: DataView,
  offset: number,
  littleEndian: boolean
): bigint {
  const low = littleEndian
    ? view.getUint32(offset, true)
    : view.getUint32(offset + 4, false);
  const high = littleEndian
    ? view.getUint32(offset + 4, true)
    : view.getUint32(offset, false);
  if (__tnHasNativeBigInt) {
    return (BigInt(high) << BigInt(32)) | BigInt(low);
  }
  const value = high * 4294967296 + low;
  if (!Number.isSafeInteger(value)) {
    __tnWarnOnce(
      "[thru-net] Precision loss while polyfilling DataView.getBigUint64"
    );
  }
  return (value as unknown) as bigint;
}

function __tnPolyfillReadInt64(
  view: DataView,
  offset: number,
  littleEndian: boolean
): bigint {
  const low = littleEndian
    ? view.getUint32(offset, true)
    : view.getUint32(offset + 4, false);
  const high = littleEndian
    ? view.getInt32(offset + 4, true)
    : view.getInt32(offset, false);
  if (__tnHasNativeBigInt) {
    return (BigInt(high) << BigInt(32)) | BigInt(low);
  }
  const value = high * 4294967296 + low;
  if (!Number.isSafeInteger(value)) {
    __tnWarnOnce(
      "[thru-net] Precision loss while polyfilling DataView.getBigInt64"
    );
  }
  return (value as unknown) as bigint;
}

function __tnPolyfillWriteUint64(
  view: DataView,
  offset: number,
  value: bigint,
  littleEndian: boolean
): void {
  const parts = __tnSplitUint64(value);
  if (littleEndian) {
    view.setUint32(offset, parts.low, true);
    view.setUint32(offset + 4, parts.high, true);
  } else {
    view.setUint32(offset, parts.high, false);
    view.setUint32(offset + 4, parts.low, false);
  }
}

function __tnPolyfillWriteInt64(
  view: DataView,
  offset: number,
  value: bigint,
  littleEndian: boolean
): void {
  const parts = __tnSplitInt64(value);
  if (littleEndian) {
    view.setUint32(offset, parts.low >>> 0, true);
    view.setInt32(offset + 4, parts.high | 0, true);
  } else {
    view.setInt32(offset, parts.high | 0, false);
    view.setUint32(offset + 4, parts.low >>> 0, false);
  }
}

if (typeof DataView !== "undefined" && !__tnHasBigIntDataView) {
  const proto = DataView.prototype as unknown as Record<string, unknown>;
  if (typeof proto.getBigUint64 !== "function") {
    (proto as any).getBigUint64 = function (
      offset: number,
      littleEndian?: boolean
    ): bigint {
      __tnWarnOnce(
        "[thru-net] Polyfilling DataView.getBigUint64; precision may be lost"
      );
      return __tnPolyfillReadUint64(this, offset, !!littleEndian);
    };
  }
  if (typeof proto.getBigInt64 !== "function") {
    (proto as any).getBigInt64 = function (
      offset: number,
      littleEndian?: boolean
    ): bigint {
      __tnWarnOnce(
        "[thru-net] Polyfilling DataView.getBigInt64; precision may be lost"
      );
      return __tnPolyfillReadInt64(this, offset, !!littleEndian);
    };
  }
  if (typeof proto.setBigUint64 !== "function") {
    (proto as any).setBigUint64 = function (
      offset: number,
      value: bigint,
      littleEndian?: boolean
    ): void {
      __tnWarnOnce(
        "[thru-net] Polyfilling DataView.setBigUint64; precision may be lost"
      );
      __tnPolyfillWriteUint64(this, offset, value, !!littleEndian);
    };
  }
  if (typeof proto.setBigInt64 !== "function") {
    (proto as any).setBigInt64 = function (
      offset: number,
      value: bigint,
      littleEndian?: boolean
    ): void {
      __tnWarnOnce(
        "[thru-net] Polyfilling DataView.setBigInt64; precision may be lost"
      );
      __tnPolyfillWriteInt64(this, offset, value, !!littleEndian);
    };
  }
  if (!__tnHasNativeBigInt) {
    __tnWarnOnce(
      "[thru-net] BigInt is unavailable; falling back to lossy 64-bit polyfill"
    );
  }
}

const __tnFootprintRegistry: Record<
  string,
  (params: Record<string, bigint>) => bigint
> = {};
const __tnValidateRegistry: Record<
  string,
  (buffer: Uint8Array, params: Record<string, bigint>) => __TnValidateResult
> = {};
const __tnDynamicValidateRegistry: Record<
  string,
  (buffer: Uint8Array) => __TnValidateResult
> = {};

function __tnRegisterFootprint(
  typeName: string,
  fn: (params: Record<string, bigint>) => bigint
): void {
  __tnFootprintRegistry[typeName] = fn;
}

function __tnRegisterValidate(
  typeName: string,
  fn: (buffer: Uint8Array, params: Record<string, bigint>) => __TnValidateResult
): void {
  __tnValidateRegistry[typeName] = fn;
}

function __tnRegisterDynamicValidate(
  typeName: string,
  fn: (buffer: Uint8Array) => __TnValidateResult
): void {
  __tnDynamicValidateRegistry[typeName] = fn;
}

function __tnInvokeFootprint(
  typeName: string,
  params: Record<string, bigint>
): bigint {
  const fn = __tnFootprintRegistry[typeName];
  if (!fn) throw new Error(`IR runtime missing footprint for ${typeName}`);
  return fn(params);
}

function __tnInvokeValidate(
  typeName: string,
  buffer: Uint8Array,
  params: Record<string, bigint>
): __TnValidateResult {
  const fn = __tnValidateRegistry[typeName];
  if (!fn) throw new Error(`IR runtime missing validate helper for ${typeName}`);
  return fn(buffer, params);
}

function __tnInvokeDynamicValidate(
  typeName: string,
  buffer: Uint8Array
): __TnValidateResult {
  const fn = __tnDynamicValidateRegistry[typeName];
  if (!fn) throw new Error(`IR runtime missing dynamic validate helper for ${typeName}`);
  return fn(buffer);
}

function __tnEvalFootprint(node: __TnIrNode, ctx: __TnIrContext): bigint {
  return __tnEvalIrNode(node, ctx, __tnToBigInt(0));
}

function __tnTryEvalFootprint(
  node: __TnIrNode,
  ctx: __TnIrContext
): __TnEvalResult {
  return __tnTryEvalIr(node, ctx);
}

function __tnTryEvalIr(
  node: __TnIrNode,
  ctx: __TnIrContext
): __TnEvalResult {
  try {
    return { ok: true, value: __tnEvalIrNode(node, ctx, __tnToBigInt(0)) };
  } catch (err) {
    return { ok: false, code: __tnNormalizeIrError(err) };
  }
}

function __tnIsEvalError(result: __TnEvalResult): result is { ok: false; code: string } {
  return result.ok === false;
}

function __tnValidateIrTree(
  ir: { readonly typeName: string; readonly root: __TnIrNode },
  buffer: Uint8Array,
  params: Record<string, bigint>
): __TnValidateResult {
  const evalResult = __tnTryEvalIr(ir.root, {
    params,
    buffer,
    typeName: ir.typeName,
  });
  if (__tnIsEvalError(evalResult)) {
    return { ok: false, code: evalResult.code };
  }
  const required = evalResult.value;
  const available = __tnToBigInt(buffer.length);
  if (__tnBigIntGreaterThan(required, available)) {
    return { ok: false, code: "tn.buffer_too_small", consumed: required };
  }
  return { ok: true, consumed: required };
}

function __tnEvalIrNode(
  node: __TnIrNode,
  ctx: __TnIrContext,
  baseOffset: bigint
): bigint {
  switch (node.op) {
    case "zero":
      return __tnToBigInt(0);
    case "const":
      return node.value;
    case "field": {
      const val = ctx.params[node.param];
      if (val === undefined) {
        const prefix = ctx.typeName ? `${ctx.typeName}: ` : "";
        __tnRaiseIrError(
          "tn.ir.missing_param",
          `${prefix}Missing IR parameter '${node.param}'`
        );
      }
      return val;
    }
    case "add":
      {
        const left = __tnEvalIrNode(node.left, ctx, baseOffset);
        const right = __tnEvalIrNode(
          node.right,
          ctx,
          __tnCheckedAdd(baseOffset, left)
        );
        return __tnCheckedAdd(left, right);
      }
    case "mul":
      return __tnCheckedMul(
        __tnEvalIrNode(node.left, ctx, baseOffset),
        __tnEvalIrNode(node.right, ctx, baseOffset)
      );
    case "align":
      return __tnAlign(__tnEvalIrNode(node.node, ctx, baseOffset), node.alignment);
    case "switch": {
      const tagVal = ctx.params[node.tag];
      if (tagVal === undefined) {
        const prefix = ctx.typeName ? `${ctx.typeName}: ` : "";
        __tnRaiseIrError(
          "tn.ir.missing_param",
          `${prefix}Missing IR switch tag '${node.tag}'`
        );
      }
      const tagNumber = Number(tagVal);
      for (const caseNode of node.cases) {
        if (caseNode.value === tagNumber) {
          return __tnEvalIrNode(caseNode.node, ctx, baseOffset);
        }
      }
      if (node.default) return __tnEvalIrNode(node.default, ctx, baseOffset);
      __tnRaiseIrError(
        "tn.ir.invalid_tag",
        `Unhandled IR switch value ${tagNumber} for '${node.tag}'`
      );
    }
    case "call": {
      const nestedParams: Record<string, bigint> = Object.create(null);
      for (const arg of node.args) {
        const val = ctx.params[arg.source];
        if (val === undefined) {
          const prefix = ctx.typeName ? `${ctx.typeName}: ` : "";
          __tnRaiseIrError(
            "tn.ir.missing_param",
            `${prefix}Missing IR parameter '${arg.source}' for nested call`
          );
        }
        nestedParams[arg.name] = val;
      }
      if (ctx.buffer) {
        const nestedOffset = __tnBigIntToNumber(baseOffset, "IR nested offset");
        const nestedResult = __tnInvokeValidate(
          node.typeName,
          ctx.buffer.subarray(nestedOffset),
          nestedParams
        );
        if (!nestedResult.ok) {
          const nestedCode =
            nestedResult.code ?? `tn.ir.runtime_error: ${node.typeName}`;
          const prefixed = nestedCode.startsWith("tn.")
            ? nestedCode
            : `tn.ir.runtime_error: ${node.typeName} -> ${nestedCode}`;
          __tnRaiseIrError(
            prefixed,
            `Nested validator ${node.typeName} failed`
          );
        }
        if (nestedResult.consumed !== undefined) {
          return nestedResult.consumed;
        }
      }
      return __tnInvokeFootprint(node.typeName, nestedParams);
    }
    case "sumOverArray": {
      if (!ctx.buffer) {
        __tnRaiseIrError(
          "tn.ir.missing_buffer",
          `Jagged array '${node.fieldName}' requires buffer-backed validation`
        );
      }
      const count = __tnBigIntToNumber(
        __tnEvalIrNode(node.count, ctx, baseOffset),
        `Jagged array '${node.fieldName}' count`
      );
      let cursor = __tnBigIntToNumber(baseOffset, "IR jagged array offset");
      let total = __tnToBigInt(0);
      for (let i = 0; i < count; i++) {
        const result = __tnInvokeDynamicValidate(
          node.elementTypeName,
          ctx.buffer.subarray(cursor)
        );
        if (!result.ok || result.consumed === undefined) {
          const code = result.code ?? "tn.ir.runtime_error";
          __tnRaiseIrError(
            code,
            `Jagged array '${node.fieldName}' element ${i} failed validation`
          );
        }
        cursor += __tnBigIntToNumber(result.consumed, "IR jagged element size");
        total = __tnCheckedAdd(total, result.consumed);
      }
      return total;
    }
    default:
      __tnRaiseIrError(
        "tn.ir.runtime_error",
        `Unsupported IR node ${(node as { op: string }).op}`
      );
  }
}

function __tnNormalizeIrError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const maybeCode = (err as { code?: string }).code;
    if (typeof maybeCode === "string" && maybeCode.length > 0) {
      return maybeCode;
    }
  }
  const message =
    err && typeof err === "object" && "message" in err
      ? String((err as { message?: unknown }).message ?? "")
      : typeof err === "string"
      ? err
      : "";
  if (message.includes("Missing IR parameter")) return "tn.ir.missing_param";
  if (message.includes("Unhandled IR switch value")) return "tn.ir.invalid_tag";
  if (
    message.includes("invalid") ||
    message.includes("overflow") ||
    message.includes("negative size")
  ) {
    return "tn.ir.overflow";
  }
  if (message.length > 0) return `tn.ir.runtime_error: ${message}`;
  return "tn.ir.runtime_error";
}

/* ----- TYPE DEFINITION FOR BlsVerifyPayload ----- */

const __tn_ir_BlsVerifyPayload = {
  typeName: "BlsVerifyPayload",
  root: { op: "align", alignment: 1, node: { op: "add", left: { op: "add", left: { op: "add", left: { op: "align", alignment: 1, node: { op: "const", value: 96n } }, right: { op: "align", alignment: 1, node: { op: "const", value: 96n } } }, right: { op: "align", alignment: 2, node: { op: "const", value: 2n } } }, right: { op: "align", alignment: 1, node: { op: "mul", left: { op: "field", param: "message.msg_len" }, right: { op: "const", value: 1n } } } } }
} as const;

export class BlsVerifyPayload {
  private view: DataView;
  private __tnFieldContext: Record<string, number | bigint> | null = null;
  private __tnParams: BlsVerifyPayload.Params;

  private constructor(private buffer: Uint8Array, params?: BlsVerifyPayload.Params, fieldContext?: Record<string, number | bigint>) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.__tnFieldContext = fieldContext ?? null;
    if (params) {
      this.__tnParams = params;
    } else {
      const derived = BlsVerifyPayload.__tnExtractParams(this.view, buffer);
      if (!derived) {
        throw new Error("BlsVerifyPayload: failed to derive dynamic parameters");
      }
      this.__tnParams = derived.params;
    }
  }

  static __tnCreateView(buffer: Uint8Array, opts?: { params?: BlsVerifyPayload.Params, fieldContext?: Record<string, number | bigint> }): BlsVerifyPayload {
    if (!buffer || buffer.length === undefined) throw new Error("BlsVerifyPayload.__tnCreateView requires a Uint8Array");
    let params = opts?.params ?? null;
    if (!params) {
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      const derived = BlsVerifyPayload.__tnExtractParams(view, buffer);
      if (!derived) throw new Error("BlsVerifyPayload.__tnCreateView: failed to derive params");
      params = derived.params;
    }
    const instance = new BlsVerifyPayload(new Uint8Array(buffer), params, opts?.fieldContext);
    return instance;
  }

  dynamicParams(): BlsVerifyPayload.Params {
    return this.__tnParams;
  }

  withFieldContext(context: Record<string, number | bigint>): this {
    this.__tnFieldContext = context;
    return this;
  }

  private __tnResolveFieldRef(path: string): number {
    const getterName = `get_${path.replace(/[.]/g, '_')}`;
    const getter = (this as any)[getterName];
    if (typeof getter === "function") {
      const value = getter.call(this);
      return typeof value === "bigint" ? __tnBigIntToNumber(value, "BlsVerifyPayload::__tnResolveFieldRef") : value;
    }
    if (this.__tnFieldContext && Object.prototype.hasOwnProperty.call(this.__tnFieldContext, path)) {
      const contextValue = this.__tnFieldContext[path];
      return typeof contextValue === "bigint" ? __tnBigIntToNumber(contextValue, "BlsVerifyPayload::__tnResolveFieldRef") : contextValue;
    }
    throw new Error("BlsVerifyPayload: field reference '" + path + "' is not available; provide fieldContext when creating this view");
  }

  static builder(): BlsVerifyPayloadBuilder {
    return new BlsVerifyPayloadBuilder();
  }

  static fromBuilder(builder: BlsVerifyPayloadBuilder): BlsVerifyPayload | null {
    const buffer = builder.build();
    const params = builder.dynamicParams();
    return BlsVerifyPayload.from_array(buffer, { params });
  }

  static readonly flexibleArrayWriters = Object.freeze([
    { field: "message", method: "message", sizeField: "msg_len", paramKey: "msg_len", elementSize: 1 },
  ] as const);

  private static __tnExtractParams(view: DataView, buffer: Uint8Array): { params: BlsVerifyPayload.Params; derived: Record<string, bigint> | null } | null {
    if (buffer.length < 194) {
      return null;
    }
    const __tnParam_message_msg_len = __tnToBigInt(view.getUint16(192, true));
    const __tnExtractedParams = BlsVerifyPayload.Params.fromValues({
      message_msg_len: __tnParam_message_msg_len,
    });
    return { params: __tnExtractedParams, derived: null };
  }

  get_pubkey(): number[] {
    const offset = 0;
    const result: number[] = [];
    for (let i = 0; i < 96; i++) {
      result.push(this.view.getUint8((offset + i * 1)));
    }
    return result;
  }

  set_pubkey(value: number[]): void {
    const offset = 0;
    if (value.length !== 96) {
      throw new Error('Array length must be 96');
    }
    for (let i = 0; i < 96; i++) {
      this.view.setUint8((offset + i * 1), value[i]);
    }
  }

  get pubkey(): number[] {
    return this.get_pubkey();
  }

  set pubkey(value: number[]) {
    this.set_pubkey(value);
  }

  get_signature(): number[] {
    const offset = 96;
    const result: number[] = [];
    for (let i = 0; i < 96; i++) {
      result.push(this.view.getUint8((offset + i * 1)));
    }
    return result;
  }

  set_signature(value: number[]): void {
    const offset = 96;
    if (value.length !== 96) {
      throw new Error('Array length must be 96');
    }
    for (let i = 0; i < 96; i++) {
      this.view.setUint8((offset + i * 1), value[i]);
    }
  }

  get signature(): number[] {
    return this.get_signature();
  }

  set signature(value: number[]) {
    this.set_signature(value);
  }

  get_msg_len(): number {
    const offset = 192;
    return this.view.getUint16(offset, true); /* little-endian */
  }

  set_msg_len(value: number): void {
    const offset = 192;
    this.view.setUint16(offset, value, true); /* little-endian */
  }

  get msg_len(): number {
    return this.get_msg_len();
  }

  set msg_len(value: number) {
    this.set_msg_len(value);
  }

  get_message_length(): number {
    return this.__tnResolveFieldRef("msg_len");
  }

  get_message_at(index: number): number {
    const offset = 194;
    return this.view.getUint8(offset + index * 1);
  }

  get_message(): number[] {
    const len = this.get_message_length();
    const result: number[] = [];
    for (let i = 0; i < len; i++) {
      result.push(this.get_message_at(i));
    }
    return result;
  }

  set_message_at(index: number, value: number): void {
    const offset = 194;
    this.view.setUint8((offset + index * 1), value);
  }

  set_message(value: number[]): void {
    const len = Math.min(this.get_message_length(), value.length);
    for (let i = 0; i < len; i++) {
      this.set_message_at(i, value[i]);
    }
  }

  get message(): number[] {
    return this.get_message();
  }

  set message(value: number[]) {
    this.set_message(value);
  }
  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_BlsVerifyPayload.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_BlsVerifyPayload, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(message_msg_len: number | bigint): bigint {
    const params = BlsVerifyPayload.Params.fromValues({
      message_msg_len: message_msg_len,
    });
    return this.footprintIrFromParams(params);
  }

  private static __tnPackParams(params: BlsVerifyPayload.Params): Record<string, bigint> {
    const record: Record<string, bigint> = Object.create(null);
    record["message.msg_len"] = params.message_msg_len;
    return record;
  }

  static footprintIrFromParams(params: BlsVerifyPayload.Params): bigint {
    const __tnParams = this.__tnPackParams(params);
    return this.__tnFootprintInternal(__tnParams);
  }

  static footprintFromParams(params: BlsVerifyPayload.Params): number {
    const irResult = this.footprintIrFromParams(params);
    const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for BlsVerifyPayload');
    return __tnBigIntToNumber(irResult, 'BlsVerifyPayload::footprintFromParams');
  }

  static footprintFromValues(input: { message_msg_len: number | bigint }): number {
    const params = BlsVerifyPayload.params(input);
    return this.footprintFromParams(params);
  }

  static footprint(params: BlsVerifyPayload.Params): number {
    return this.footprintFromParams(params);
  }

  static validate(buffer: Uint8Array, opts?: { params?: BlsVerifyPayload.Params }): { ok: boolean; code?: string; consumed?: number; params?: BlsVerifyPayload.Params } {
    if (!buffer || buffer.length === undefined) {
      return { ok: false, code: "tn.invalid_buffer" };
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const extracted = this.__tnExtractParams(view, buffer);
      if (!extracted) return { ok: false, code: "tn.param_extraction_failed" };
      params = extracted.params;
    }
    const __tnParamsRec = this.__tnPackParams(params);
    const irResult = this.__tnValidateInternal(buffer, __tnParamsRec);
    if (!irResult.ok) {
      return { ok: false, code: irResult.code, consumed: irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'BlsVerifyPayload::validate') : undefined, params };
    }
    const consumed = irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'BlsVerifyPayload::validate') : undefined;
    return { ok: true, consumed, params };
  }

  static from_array(buffer: Uint8Array, opts?: { params?: BlsVerifyPayload.Params }): BlsVerifyPayload | null {
    if (!buffer || buffer.length === undefined) {
      return null;
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const derived = this.__tnExtractParams(view, buffer);
      if (!derived) return null;
      params = derived.params;
    }
    const validation = this.validate(buffer, { params });
    if (!validation.ok) {
      return null;
    }
    const cached = validation.params ?? params;
    const state = new BlsVerifyPayload(buffer, cached);
    return state;
  }


}

export namespace BlsVerifyPayload {
  export type Params = {
    /** ABI path: message.msg_len */
    readonly message_msg_len: bigint;
  };

  export const ParamKeys = Object.freeze({
    message_msg_len: "message.msg_len",
  } as const);

  export const Params = {
    fromValues(input: { message_msg_len: number | bigint }): Params {
      return {
        message_msg_len: __tnToBigInt(input.message_msg_len),
      };
    },
    fromBuilder(source: { dynamicParams(): Params } | { params: Params } | Params): Params {
      if ((source as { dynamicParams?: () => Params }).dynamicParams) {
        return (source as { dynamicParams(): Params }).dynamicParams();
      }
      if ((source as { params?: Params }).params) {
        return (source as { params: Params }).params;
      }
      return source as Params;
    }
  };

  export function params(input: { message_msg_len: number | bigint }): Params {
    return Params.fromValues(input);
  }
}

export class BlsVerifyPayloadBuilder {
  private buffer: Uint8Array;
  private view: DataView;
  private __tnCachedParams: BlsVerifyPayload.Params | null = null;
  private __tnLastBuffer: Uint8Array | null = null;
  private __tnLastParams: BlsVerifyPayload.Params | null = null;
  private __tnFam_message: Uint8Array | null = null;
  private __tnFam_messageCount: number | null = null;
  private __tnFamWriter_message?: __TnFamWriterResult<BlsVerifyPayloadBuilder>;

  constructor() {
    this.buffer = new Uint8Array(194);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  private __tnInvalidate(): void {
    this.__tnCachedParams = null;
    this.__tnLastBuffer = null;
    this.__tnLastParams = null;
  }

  set_pubkey(values: number[]): this {
    if (values.length !== 96) throw new Error("pubkey expects 96 elements");
    for (let i = 0; i < values.length; i++) {
      const byteOffset = 0 + i * 1;
      this.view.setUint8(byteOffset, values[i]);
    }
    this.__tnInvalidate();
    return this;
  }

  set_signature(values: number[]): this {
    if (values.length !== 96) throw new Error("signature expects 96 elements");
    for (let i = 0; i < values.length; i++) {
      const byteOffset = 96 + i * 1;
      this.view.setUint8(byteOffset, values[i]);
    }
    this.__tnInvalidate();
    return this;
  }

  set_msg_len(value: number): this {
    this.view.setUint16(192, value, true);
    this.__tnInvalidate();
    return this;
  }

  message(): __TnFamWriterResult<BlsVerifyPayloadBuilder> {
    if (!this.__tnFamWriter_message) {
      this.__tnFamWriter_message = __tnCreateFamWriter(this, "message", (payload) => {
        const bytes = new Uint8Array(payload);
        const elementCount = bytes.length;
        this.__tnFam_message = bytes;
        this.__tnFam_messageCount = elementCount;
        this.set_msg_len(elementCount);
        this.__tnInvalidate();
      });
    }
    return this.__tnFamWriter_message!;
  }

  build(): Uint8Array {
    const params = this.__tnComputeParams();
    const size = BlsVerifyPayload.footprintFromParams(params);
    const buffer = new Uint8Array(size);
    this.__tnWriteInto(buffer);
    this.__tnValidateOrThrow(buffer, params);
    return buffer;
  }

  buildInto(target: Uint8Array, offset = 0): Uint8Array {
    const params = this.__tnComputeParams();
    const size = BlsVerifyPayload.footprintFromParams(params);
    if (target.length - offset < size) throw new Error("BlsVerifyPayloadBuilder: target buffer too small");
    const slice = target.subarray(offset, offset + size);
    this.__tnWriteInto(slice);
    this.__tnValidateOrThrow(slice, params);
    return target;
  }

  finish(): BlsVerifyPayload {
    const buffer = this.build();
    const params = this.__tnLastParams ?? this.__tnComputeParams();
    const view = BlsVerifyPayload.from_array(buffer, { params });
    if (!view) throw new Error("BlsVerifyPayloadBuilder: failed to finalize view");
    return view;
  }

  finishView(): BlsVerifyPayload {
    return this.finish();
  }

  dynamicParams(): BlsVerifyPayload.Params {
    return this.__tnComputeParams();
  }

  private __tnComputeParams(): BlsVerifyPayload.Params {
    if (this.__tnCachedParams) return this.__tnCachedParams;
    const params = BlsVerifyPayload.Params.fromValues({
      message_msg_len: (() => { if (this.__tnFam_messageCount === null) throw new Error("BlsVerifyPayloadBuilder: field 'message' must be written before computing params"); return __tnToBigInt(this.__tnFam_messageCount); })(),
    });
    this.__tnCachedParams = params;
    return params;
  }

  private __tnWriteInto(target: Uint8Array): void {
    target.set(this.buffer, 0);
    let cursor = this.buffer.length;
    const __tnLocal_message_bytes = this.__tnFam_message;
    if (!__tnLocal_message_bytes) throw new Error("BlsVerifyPayloadBuilder: field 'message' must be written before build");
    target.set(__tnLocal_message_bytes, cursor);
    cursor += __tnLocal_message_bytes.length;
  }

  private __tnValidateOrThrow(buffer: Uint8Array, params: BlsVerifyPayload.Params): void {
    const result = BlsVerifyPayload.validate(buffer, { params });
    if (!result.ok) {
      throw new Error(`${ BlsVerifyPayload }Builder: builder produced invalid buffer (code=${result.code ?? "unknown"})`);
    }
    this.__tnLastParams = result.params ?? params;
    this.__tnLastBuffer = buffer;
  }
}

__tnRegisterFootprint("BlsVerifyPayload", (params) => BlsVerifyPayload.__tnInvokeFootprint(params));
__tnRegisterValidate("BlsVerifyPayload", (buffer, params) => BlsVerifyPayload.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("BlsVerifyPayload", (buffer) => { const result = BlsVerifyPayload.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });

/* ----- TYPE DEFINITION FOR EventPayload ----- */

const __tn_ir_EventPayload = {
  typeName: "EventPayload",
  root: { op: "align", alignment: 1, node: { op: "add", left: { op: "add", left: { op: "align", alignment: 1, node: { op: "const", value: 1n } }, right: { op: "align", alignment: 2, node: { op: "const", value: 2n } } }, right: { op: "align", alignment: 1, node: { op: "mul", left: { op: "field", param: "data.data_len" }, right: { op: "const", value: 1n } } } } }
} as const;

export class EventPayload {
  private view: DataView;
  private __tnFieldContext: Record<string, number | bigint> | null = null;
  private __tnParams: EventPayload.Params;

  private constructor(private buffer: Uint8Array, params?: EventPayload.Params, fieldContext?: Record<string, number | bigint>) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.__tnFieldContext = fieldContext ?? null;
    if (params) {
      this.__tnParams = params;
    } else {
      const derived = EventPayload.__tnExtractParams(this.view, buffer);
      if (!derived) {
        throw new Error("EventPayload: failed to derive dynamic parameters");
      }
      this.__tnParams = derived.params;
    }
  }

  static __tnCreateView(buffer: Uint8Array, opts?: { params?: EventPayload.Params, fieldContext?: Record<string, number | bigint> }): EventPayload {
    if (!buffer || buffer.length === undefined) throw new Error("EventPayload.__tnCreateView requires a Uint8Array");
    let params = opts?.params ?? null;
    if (!params) {
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      const derived = EventPayload.__tnExtractParams(view, buffer);
      if (!derived) throw new Error("EventPayload.__tnCreateView: failed to derive params");
      params = derived.params;
    }
    const instance = new EventPayload(new Uint8Array(buffer), params, opts?.fieldContext);
    return instance;
  }

  dynamicParams(): EventPayload.Params {
    return this.__tnParams;
  }

  withFieldContext(context: Record<string, number | bigint>): this {
    this.__tnFieldContext = context;
    return this;
  }

  private __tnResolveFieldRef(path: string): number {
    const getterName = `get_${path.replace(/[.]/g, '_')}`;
    const getter = (this as any)[getterName];
    if (typeof getter === "function") {
      const value = getter.call(this);
      return typeof value === "bigint" ? __tnBigIntToNumber(value, "EventPayload::__tnResolveFieldRef") : value;
    }
    if (this.__tnFieldContext && Object.prototype.hasOwnProperty.call(this.__tnFieldContext, path)) {
      const contextValue = this.__tnFieldContext[path];
      return typeof contextValue === "bigint" ? __tnBigIntToNumber(contextValue, "EventPayload::__tnResolveFieldRef") : contextValue;
    }
    throw new Error("EventPayload: field reference '" + path + "' is not available; provide fieldContext when creating this view");
  }

  static builder(): EventPayloadBuilder {
    return new EventPayloadBuilder();
  }

  static fromBuilder(builder: EventPayloadBuilder): EventPayload | null {
    const buffer = builder.build();
    const params = builder.dynamicParams();
    return EventPayload.from_array(buffer, { params });
  }

  static readonly flexibleArrayWriters = Object.freeze([
    { field: "data", method: "data", sizeField: "data_len", paramKey: "data_len", elementSize: 1 },
  ] as const);

  private static __tnExtractParams(view: DataView, buffer: Uint8Array): { params: EventPayload.Params; derived: Record<string, bigint> | null } | null {
    if (buffer.length < 3) {
      return null;
    }
    const __tnParam_data_data_len = __tnToBigInt(view.getUint16(1, true));
    const __tnExtractedParams = EventPayload.Params.fromValues({
      data_data_len: __tnParam_data_data_len,
    });
    return { params: __tnExtractedParams, derived: null };
  }

  get_event_type(): number {
    const offset = 0;
    return this.view.getUint8(offset);
  }

  set_event_type(value: number): void {
    const offset = 0;
    this.view.setUint8(offset, value);
  }

  get event_type(): number {
    return this.get_event_type();
  }

  set event_type(value: number) {
    this.set_event_type(value);
  }

  get_data_len(): number {
    const offset = 1;
    return this.view.getUint16(offset, true); /* little-endian */
  }

  set_data_len(value: number): void {
    const offset = 1;
    this.view.setUint16(offset, value, true); /* little-endian */
  }

  get data_len(): number {
    return this.get_data_len();
  }

  set data_len(value: number) {
    this.set_data_len(value);
  }

  get_data_length(): number {
    return this.__tnResolveFieldRef("data_len");
  }

  get_data_at(index: number): number {
    const offset = 3;
    return this.view.getUint8(offset + index * 1);
  }

  get_data(): number[] {
    const len = this.get_data_length();
    const result: number[] = [];
    for (let i = 0; i < len; i++) {
      result.push(this.get_data_at(i));
    }
    return result;
  }

  set_data_at(index: number, value: number): void {
    const offset = 3;
    this.view.setUint8((offset + index * 1), value);
  }

  set_data(value: number[]): void {
    const len = Math.min(this.get_data_length(), value.length);
    for (let i = 0; i < len; i++) {
      this.set_data_at(i, value[i]);
    }
  }

  get data(): number[] {
    return this.get_data();
  }

  set data(value: number[]) {
    this.set_data(value);
  }
  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_EventPayload.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_EventPayload, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(data_data_len: number | bigint): bigint {
    const params = EventPayload.Params.fromValues({
      data_data_len: data_data_len,
    });
    return this.footprintIrFromParams(params);
  }

  private static __tnPackParams(params: EventPayload.Params): Record<string, bigint> {
    const record: Record<string, bigint> = Object.create(null);
    record["data.data_len"] = params.data_data_len;
    return record;
  }

  static footprintIrFromParams(params: EventPayload.Params): bigint {
    const __tnParams = this.__tnPackParams(params);
    return this.__tnFootprintInternal(__tnParams);
  }

  static footprintFromParams(params: EventPayload.Params): number {
    const irResult = this.footprintIrFromParams(params);
    const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for EventPayload');
    return __tnBigIntToNumber(irResult, 'EventPayload::footprintFromParams');
  }

  static footprintFromValues(input: { data_data_len: number | bigint }): number {
    const params = EventPayload.params(input);
    return this.footprintFromParams(params);
  }

  static footprint(params: EventPayload.Params): number {
    return this.footprintFromParams(params);
  }

  static validate(buffer: Uint8Array, opts?: { params?: EventPayload.Params }): { ok: boolean; code?: string; consumed?: number; params?: EventPayload.Params } {
    if (!buffer || buffer.length === undefined) {
      return { ok: false, code: "tn.invalid_buffer" };
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const extracted = this.__tnExtractParams(view, buffer);
      if (!extracted) return { ok: false, code: "tn.param_extraction_failed" };
      params = extracted.params;
    }
    const __tnParamsRec = this.__tnPackParams(params);
    const irResult = this.__tnValidateInternal(buffer, __tnParamsRec);
    if (!irResult.ok) {
      return { ok: false, code: irResult.code, consumed: irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'EventPayload::validate') : undefined, params };
    }
    const consumed = irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'EventPayload::validate') : undefined;
    return { ok: true, consumed, params };
  }

  static from_array(buffer: Uint8Array, opts?: { params?: EventPayload.Params }): EventPayload | null {
    if (!buffer || buffer.length === undefined) {
      return null;
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const derived = this.__tnExtractParams(view, buffer);
      if (!derived) return null;
      params = derived.params;
    }
    const validation = this.validate(buffer, { params });
    if (!validation.ok) {
      return null;
    }
    const cached = validation.params ?? params;
    const state = new EventPayload(buffer, cached);
    return state;
  }


}

export namespace EventPayload {
  export type Params = {
    /** ABI path: data.data_len */
    readonly data_data_len: bigint;
  };

  export const ParamKeys = Object.freeze({
    data_data_len: "data.data_len",
  } as const);

  export const Params = {
    fromValues(input: { data_data_len: number | bigint }): Params {
      return {
        data_data_len: __tnToBigInt(input.data_data_len),
      };
    },
    fromBuilder(source: { dynamicParams(): Params } | { params: Params } | Params): Params {
      if ((source as { dynamicParams?: () => Params }).dynamicParams) {
        return (source as { dynamicParams(): Params }).dynamicParams();
      }
      if ((source as { params?: Params }).params) {
        return (source as { params: Params }).params;
      }
      return source as Params;
    }
  };

  export function params(input: { data_data_len: number | bigint }): Params {
    return Params.fromValues(input);
  }
}

export class EventPayloadBuilder {
  private buffer: Uint8Array;
  private view: DataView;
  private __tnCachedParams: EventPayload.Params | null = null;
  private __tnLastBuffer: Uint8Array | null = null;
  private __tnLastParams: EventPayload.Params | null = null;
  private __tnFam_data: Uint8Array | null = null;
  private __tnFam_dataCount: number | null = null;
  private __tnFamWriter_data?: __TnFamWriterResult<EventPayloadBuilder>;

  constructor() {
    this.buffer = new Uint8Array(3);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  private __tnInvalidate(): void {
    this.__tnCachedParams = null;
    this.__tnLastBuffer = null;
    this.__tnLastParams = null;
  }

  set_event_type(value: number): this {
    this.view.setUint8(0, value);
    this.__tnInvalidate();
    return this;
  }

  set_data_len(value: number): this {
    this.view.setUint16(1, value, true);
    this.__tnInvalidate();
    return this;
  }

  data(): __TnFamWriterResult<EventPayloadBuilder> {
    if (!this.__tnFamWriter_data) {
      this.__tnFamWriter_data = __tnCreateFamWriter(this, "data", (payload) => {
        const bytes = new Uint8Array(payload);
        const elementCount = bytes.length;
        this.__tnFam_data = bytes;
        this.__tnFam_dataCount = elementCount;
        this.set_data_len(elementCount);
        this.__tnInvalidate();
      });
    }
    return this.__tnFamWriter_data!;
  }

  build(): Uint8Array {
    const params = this.__tnComputeParams();
    const size = EventPayload.footprintFromParams(params);
    const buffer = new Uint8Array(size);
    this.__tnWriteInto(buffer);
    this.__tnValidateOrThrow(buffer, params);
    return buffer;
  }

  buildInto(target: Uint8Array, offset = 0): Uint8Array {
    const params = this.__tnComputeParams();
    const size = EventPayload.footprintFromParams(params);
    if (target.length - offset < size) throw new Error("EventPayloadBuilder: target buffer too small");
    const slice = target.subarray(offset, offset + size);
    this.__tnWriteInto(slice);
    this.__tnValidateOrThrow(slice, params);
    return target;
  }

  finish(): EventPayload {
    const buffer = this.build();
    const params = this.__tnLastParams ?? this.__tnComputeParams();
    const view = EventPayload.from_array(buffer, { params });
    if (!view) throw new Error("EventPayloadBuilder: failed to finalize view");
    return view;
  }

  finishView(): EventPayload {
    return this.finish();
  }

  dynamicParams(): EventPayload.Params {
    return this.__tnComputeParams();
  }

  private __tnComputeParams(): EventPayload.Params {
    if (this.__tnCachedParams) return this.__tnCachedParams;
    const params = EventPayload.Params.fromValues({
      data_data_len: (() => { if (this.__tnFam_dataCount === null) throw new Error("EventPayloadBuilder: field 'data' must be written before computing params"); return __tnToBigInt(this.__tnFam_dataCount); })(),
    });
    this.__tnCachedParams = params;
    return params;
  }

  private __tnWriteInto(target: Uint8Array): void {
    target.set(this.buffer, 0);
    let cursor = this.buffer.length;
    const __tnLocal_data_bytes = this.__tnFam_data;
    if (!__tnLocal_data_bytes) throw new Error("EventPayloadBuilder: field 'data' must be written before build");
    target.set(__tnLocal_data_bytes, cursor);
    cursor += __tnLocal_data_bytes.length;
  }

  private __tnValidateOrThrow(buffer: Uint8Array, params: EventPayload.Params): void {
    const result = EventPayload.validate(buffer, { params });
    if (!result.ok) {
      throw new Error(`${ EventPayload }Builder: builder produced invalid buffer (code=${result.code ?? "unknown"})`);
    }
    this.__tnLastParams = result.params ?? params;
    this.__tnLastBuffer = buffer;
  }
}

__tnRegisterFootprint("EventPayload", (params) => EventPayload.__tnInvokeFootprint(params));
__tnRegisterValidate("EventPayload", (buffer, params) => EventPayload.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("EventPayload", (buffer) => { const result = EventPayload.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });

/* ----- TYPE DEFINITION FOR Instruction ----- */

const __tn_ir_Instruction = {
  typeName: "Instruction",
  root: { op: "align", alignment: 1, node: { op: "add", left: { op: "add", left: { op: "align", alignment: 1, node: { op: "const", value: 1n } }, right: { op: "align", alignment: 2, node: { op: "const", value: 2n } } }, right: { op: "align", alignment: 1, node: { op: "mul", left: { op: "field", param: "data.data_len" }, right: { op: "const", value: 1n } } } } }
} as const;

export class Instruction {
  private view: DataView;
  private __tnFieldContext: Record<string, number | bigint> | null = null;
  private __tnParams: Instruction.Params;

  private constructor(private buffer: Uint8Array, params?: Instruction.Params, fieldContext?: Record<string, number | bigint>) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.__tnFieldContext = fieldContext ?? null;
    if (params) {
      this.__tnParams = params;
    } else {
      const derived = Instruction.__tnExtractParams(this.view, buffer);
      if (!derived) {
        throw new Error("Instruction: failed to derive dynamic parameters");
      }
      this.__tnParams = derived.params;
    }
  }

  static __tnCreateView(buffer: Uint8Array, opts?: { params?: Instruction.Params, fieldContext?: Record<string, number | bigint> }): Instruction {
    if (!buffer || buffer.length === undefined) throw new Error("Instruction.__tnCreateView requires a Uint8Array");
    let params = opts?.params ?? null;
    if (!params) {
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      const derived = Instruction.__tnExtractParams(view, buffer);
      if (!derived) throw new Error("Instruction.__tnCreateView: failed to derive params");
      params = derived.params;
    }
    const instance = new Instruction(new Uint8Array(buffer), params, opts?.fieldContext);
    return instance;
  }

  dynamicParams(): Instruction.Params {
    return this.__tnParams;
  }

  withFieldContext(context: Record<string, number | bigint>): this {
    this.__tnFieldContext = context;
    return this;
  }

  private __tnResolveFieldRef(path: string): number {
    const getterName = `get_${path.replace(/[.]/g, '_')}`;
    const getter = (this as any)[getterName];
    if (typeof getter === "function") {
      const value = getter.call(this);
      return typeof value === "bigint" ? __tnBigIntToNumber(value, "Instruction::__tnResolveFieldRef") : value;
    }
    if (this.__tnFieldContext && Object.prototype.hasOwnProperty.call(this.__tnFieldContext, path)) {
      const contextValue = this.__tnFieldContext[path];
      return typeof contextValue === "bigint" ? __tnBigIntToNumber(contextValue, "Instruction::__tnResolveFieldRef") : contextValue;
    }
    throw new Error("Instruction: field reference '" + path + "' is not available; provide fieldContext when creating this view");
  }

  static builder(): InstructionBuilder {
    return new InstructionBuilder();
  }

  static fromBuilder(builder: InstructionBuilder): Instruction | null {
    const buffer = builder.build();
    const params = builder.dynamicParams();
    return Instruction.from_array(buffer, { params });
  }

  static readonly flexibleArrayWriters = Object.freeze([
    { field: "data", method: "data", sizeField: "data_len", paramKey: "data_len", elementSize: 1 },
  ] as const);

  private static __tnExtractParams(view: DataView, buffer: Uint8Array): { params: Instruction.Params; derived: Record<string, bigint> | null } | null {
    if (buffer.length < 3) {
      return null;
    }
    const __tnParam_data_data_len = __tnToBigInt(view.getUint16(1, true));
    const __tnExtractedParams = Instruction.Params.fromValues({
      data_data_len: __tnParam_data_data_len,
    });
    return { params: __tnExtractedParams, derived: null };
  }

  get_tag(): number {
    const offset = 0;
    return this.view.getUint8(offset);
  }

  set_tag(value: number): void {
    const offset = 0;
    this.view.setUint8(offset, value);
  }

  get tag(): number {
    return this.get_tag();
  }

  set tag(value: number) {
    this.set_tag(value);
  }

  get_data_len(): number {
    const offset = 1;
    return this.view.getUint16(offset, true); /* little-endian */
  }

  set_data_len(value: number): void {
    const offset = 1;
    this.view.setUint16(offset, value, true); /* little-endian */
  }

  get data_len(): number {
    return this.get_data_len();
  }

  set data_len(value: number) {
    this.set_data_len(value);
  }

  get_data_length(): number {
    return this.__tnResolveFieldRef("data_len");
  }

  get_data_at(index: number): number {
    const offset = 3;
    return this.view.getUint8(offset + index * 1);
  }

  get_data(): number[] {
    const len = this.get_data_length();
    const result: number[] = [];
    for (let i = 0; i < len; i++) {
      result.push(this.get_data_at(i));
    }
    return result;
  }

  set_data_at(index: number, value: number): void {
    const offset = 3;
    this.view.setUint8((offset + index * 1), value);
  }

  set_data(value: number[]): void {
    const len = Math.min(this.get_data_length(), value.length);
    for (let i = 0; i < len; i++) {
      this.set_data_at(i, value[i]);
    }
  }

  get data(): number[] {
    return this.get_data();
  }

  set data(value: number[]) {
    this.set_data(value);
  }
  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_Instruction.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_Instruction, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(data_data_len: number | bigint): bigint {
    const params = Instruction.Params.fromValues({
      data_data_len: data_data_len,
    });
    return this.footprintIrFromParams(params);
  }

  private static __tnPackParams(params: Instruction.Params): Record<string, bigint> {
    const record: Record<string, bigint> = Object.create(null);
    record["data.data_len"] = params.data_data_len;
    return record;
  }

  static footprintIrFromParams(params: Instruction.Params): bigint {
    const __tnParams = this.__tnPackParams(params);
    return this.__tnFootprintInternal(__tnParams);
  }

  static footprintFromParams(params: Instruction.Params): number {
    const irResult = this.footprintIrFromParams(params);
    const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for Instruction');
    return __tnBigIntToNumber(irResult, 'Instruction::footprintFromParams');
  }

  static footprintFromValues(input: { data_data_len: number | bigint }): number {
    const params = Instruction.params(input);
    return this.footprintFromParams(params);
  }

  static footprint(params: Instruction.Params): number {
    return this.footprintFromParams(params);
  }

  static validate(buffer: Uint8Array, opts?: { params?: Instruction.Params }): { ok: boolean; code?: string; consumed?: number; params?: Instruction.Params } {
    if (!buffer || buffer.length === undefined) {
      return { ok: false, code: "tn.invalid_buffer" };
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const extracted = this.__tnExtractParams(view, buffer);
      if (!extracted) return { ok: false, code: "tn.param_extraction_failed" };
      params = extracted.params;
    }
    const __tnParamsRec = this.__tnPackParams(params);
    const irResult = this.__tnValidateInternal(buffer, __tnParamsRec);
    if (!irResult.ok) {
      return { ok: false, code: irResult.code, consumed: irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'Instruction::validate') : undefined, params };
    }
    const consumed = irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'Instruction::validate') : undefined;
    return { ok: true, consumed, params };
  }

  static from_array(buffer: Uint8Array, opts?: { params?: Instruction.Params }): Instruction | null {
    if (!buffer || buffer.length === undefined) {
      return null;
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const derived = this.__tnExtractParams(view, buffer);
      if (!derived) return null;
      params = derived.params;
    }
    const validation = this.validate(buffer, { params });
    if (!validation.ok) {
      return null;
    }
    const cached = validation.params ?? params;
    const state = new Instruction(buffer, cached);
    return state;
  }


}

export namespace Instruction {
  export type Params = {
    /** ABI path: data.data_len */
    readonly data_data_len: bigint;
  };

  export const ParamKeys = Object.freeze({
    data_data_len: "data.data_len",
  } as const);

  export const Params = {
    fromValues(input: { data_data_len: number | bigint }): Params {
      return {
        data_data_len: __tnToBigInt(input.data_data_len),
      };
    },
    fromBuilder(source: { dynamicParams(): Params } | { params: Params } | Params): Params {
      if ((source as { dynamicParams?: () => Params }).dynamicParams) {
        return (source as { dynamicParams(): Params }).dynamicParams();
      }
      if ((source as { params?: Params }).params) {
        return (source as { params: Params }).params;
      }
      return source as Params;
    }
  };

  export function params(input: { data_data_len: number | bigint }): Params {
    return Params.fromValues(input);
  }
}

export class InstructionBuilder {
  private buffer: Uint8Array;
  private view: DataView;
  private __tnCachedParams: Instruction.Params | null = null;
  private __tnLastBuffer: Uint8Array | null = null;
  private __tnLastParams: Instruction.Params | null = null;
  private __tnFam_data: Uint8Array | null = null;
  private __tnFam_dataCount: number | null = null;
  private __tnFamWriter_data?: __TnFamWriterResult<InstructionBuilder>;

  constructor() {
    this.buffer = new Uint8Array(3);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  private __tnInvalidate(): void {
    this.__tnCachedParams = null;
    this.__tnLastBuffer = null;
    this.__tnLastParams = null;
  }

  set_tag(value: number): this {
    this.view.setUint8(0, value);
    this.__tnInvalidate();
    return this;
  }

  set_data_len(value: number): this {
    this.view.setUint16(1, value, true);
    this.__tnInvalidate();
    return this;
  }

  data(): __TnFamWriterResult<InstructionBuilder> {
    if (!this.__tnFamWriter_data) {
      this.__tnFamWriter_data = __tnCreateFamWriter(this, "data", (payload) => {
        const bytes = new Uint8Array(payload);
        const elementCount = bytes.length;
        this.__tnFam_data = bytes;
        this.__tnFam_dataCount = elementCount;
        this.set_data_len(elementCount);
        this.__tnInvalidate();
      });
    }
    return this.__tnFamWriter_data!;
  }

  build(): Uint8Array {
    const params = this.__tnComputeParams();
    const size = Instruction.footprintFromParams(params);
    const buffer = new Uint8Array(size);
    this.__tnWriteInto(buffer);
    this.__tnValidateOrThrow(buffer, params);
    return buffer;
  }

  buildInto(target: Uint8Array, offset = 0): Uint8Array {
    const params = this.__tnComputeParams();
    const size = Instruction.footprintFromParams(params);
    if (target.length - offset < size) throw new Error("InstructionBuilder: target buffer too small");
    const slice = target.subarray(offset, offset + size);
    this.__tnWriteInto(slice);
    this.__tnValidateOrThrow(slice, params);
    return target;
  }

  finish(): Instruction {
    const buffer = this.build();
    const params = this.__tnLastParams ?? this.__tnComputeParams();
    const view = Instruction.from_array(buffer, { params });
    if (!view) throw new Error("InstructionBuilder: failed to finalize view");
    return view;
  }

  finishView(): Instruction {
    return this.finish();
  }

  dynamicParams(): Instruction.Params {
    return this.__tnComputeParams();
  }

  private __tnComputeParams(): Instruction.Params {
    if (this.__tnCachedParams) return this.__tnCachedParams;
    const params = Instruction.Params.fromValues({
      data_data_len: (() => { if (this.__tnFam_dataCount === null) throw new Error("InstructionBuilder: field 'data' must be written before computing params"); return __tnToBigInt(this.__tnFam_dataCount); })(),
    });
    this.__tnCachedParams = params;
    return params;
  }

  private __tnWriteInto(target: Uint8Array): void {
    target.set(this.buffer, 0);
    let cursor = this.buffer.length;
    const __tnLocal_data_bytes = this.__tnFam_data;
    if (!__tnLocal_data_bytes) throw new Error("InstructionBuilder: field 'data' must be written before build");
    target.set(__tnLocal_data_bytes, cursor);
    cursor += __tnLocal_data_bytes.length;
  }

  private __tnValidateOrThrow(buffer: Uint8Array, params: Instruction.Params): void {
    const result = Instruction.validate(buffer, { params });
    if (!result.ok) {
      throw new Error(`${ Instruction }Builder: builder produced invalid buffer (code=${result.code ?? "unknown"})`);
    }
    this.__tnLastParams = result.params ?? params;
    this.__tnLastBuffer = buffer;
  }
}

__tnRegisterFootprint("Instruction", (params) => Instruction.__tnInvokeFootprint(params));
__tnRegisterValidate("Instruction", (buffer, params) => Instruction.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("Instruction", (buffer) => { const result = Instruction.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });

/* ----- TYPE DEFINITION FOR KvGetPayload ----- */

const __tn_ir_KvGetPayload = {
  typeName: "KvGetPayload",
  root: { op: "align", alignment: 1, node: { op: "add", left: { op: "align", alignment: 1, node: { op: "const", value: 1n } }, right: { op: "align", alignment: 1, node: { op: "mul", left: { op: "field", param: "key.key_len" }, right: { op: "const", value: 1n } } } } }
} as const;

export class KvGetPayload {
  private view: DataView;
  private __tnFieldContext: Record<string, number | bigint> | null = null;
  private __tnParams: KvGetPayload.Params;

  private constructor(private buffer: Uint8Array, params?: KvGetPayload.Params, fieldContext?: Record<string, number | bigint>) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.__tnFieldContext = fieldContext ?? null;
    if (params) {
      this.__tnParams = params;
    } else {
      const derived = KvGetPayload.__tnExtractParams(this.view, buffer);
      if (!derived) {
        throw new Error("KvGetPayload: failed to derive dynamic parameters");
      }
      this.__tnParams = derived.params;
    }
  }

  static __tnCreateView(buffer: Uint8Array, opts?: { params?: KvGetPayload.Params, fieldContext?: Record<string, number | bigint> }): KvGetPayload {
    if (!buffer || buffer.length === undefined) throw new Error("KvGetPayload.__tnCreateView requires a Uint8Array");
    let params = opts?.params ?? null;
    if (!params) {
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      const derived = KvGetPayload.__tnExtractParams(view, buffer);
      if (!derived) throw new Error("KvGetPayload.__tnCreateView: failed to derive params");
      params = derived.params;
    }
    const instance = new KvGetPayload(new Uint8Array(buffer), params, opts?.fieldContext);
    return instance;
  }

  dynamicParams(): KvGetPayload.Params {
    return this.__tnParams;
  }

  withFieldContext(context: Record<string, number | bigint>): this {
    this.__tnFieldContext = context;
    return this;
  }

  private __tnResolveFieldRef(path: string): number {
    const getterName = `get_${path.replace(/[.]/g, '_')}`;
    const getter = (this as any)[getterName];
    if (typeof getter === "function") {
      const value = getter.call(this);
      return typeof value === "bigint" ? __tnBigIntToNumber(value, "KvGetPayload::__tnResolveFieldRef") : value;
    }
    if (this.__tnFieldContext && Object.prototype.hasOwnProperty.call(this.__tnFieldContext, path)) {
      const contextValue = this.__tnFieldContext[path];
      return typeof contextValue === "bigint" ? __tnBigIntToNumber(contextValue, "KvGetPayload::__tnResolveFieldRef") : contextValue;
    }
    throw new Error("KvGetPayload: field reference '" + path + "' is not available; provide fieldContext when creating this view");
  }

  static builder(): KvGetPayloadBuilder {
    return new KvGetPayloadBuilder();
  }

  static fromBuilder(builder: KvGetPayloadBuilder): KvGetPayload | null {
    const buffer = builder.build();
    const params = builder.dynamicParams();
    return KvGetPayload.from_array(buffer, { params });
  }

  static readonly flexibleArrayWriters = Object.freeze([
    { field: "key", method: "key", sizeField: "key_len", paramKey: "key_len", elementSize: 1 },
  ] as const);

  private static __tnExtractParams(view: DataView, buffer: Uint8Array): { params: KvGetPayload.Params; derived: Record<string, bigint> | null } | null {
    if (buffer.length < 1) {
      return null;
    }
    const __tnParam_key_key_len = __tnToBigInt(view.getUint8(0));
    const __tnExtractedParams = KvGetPayload.Params.fromValues({
      key_key_len: __tnParam_key_key_len,
    });
    return { params: __tnExtractedParams, derived: null };
  }

  get_key_len(): number {
    const offset = 0;
    return this.view.getUint8(offset);
  }

  set_key_len(value: number): void {
    const offset = 0;
    this.view.setUint8(offset, value);
  }

  get key_len(): number {
    return this.get_key_len();
  }

  set key_len(value: number) {
    this.set_key_len(value);
  }

  get_key_length(): number {
    return this.__tnResolveFieldRef("key_len");
  }

  get_key_at(index: number): number {
    const offset = 1;
    return this.view.getUint8(offset + index * 1);
  }

  get_key(): number[] {
    const len = this.get_key_length();
    const result: number[] = [];
    for (let i = 0; i < len; i++) {
      result.push(this.get_key_at(i));
    }
    return result;
  }

  set_key_at(index: number, value: number): void {
    const offset = 1;
    this.view.setUint8((offset + index * 1), value);
  }

  set_key(value: number[]): void {
    const len = Math.min(this.get_key_length(), value.length);
    for (let i = 0; i < len; i++) {
      this.set_key_at(i, value[i]);
    }
  }

  get key(): number[] {
    return this.get_key();
  }

  set key(value: number[]) {
    this.set_key(value);
  }
  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_KvGetPayload.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_KvGetPayload, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(key_key_len: number | bigint): bigint {
    const params = KvGetPayload.Params.fromValues({
      key_key_len: key_key_len,
    });
    return this.footprintIrFromParams(params);
  }

  private static __tnPackParams(params: KvGetPayload.Params): Record<string, bigint> {
    const record: Record<string, bigint> = Object.create(null);
    record["key.key_len"] = params.key_key_len;
    return record;
  }

  static footprintIrFromParams(params: KvGetPayload.Params): bigint {
    const __tnParams = this.__tnPackParams(params);
    return this.__tnFootprintInternal(__tnParams);
  }

  static footprintFromParams(params: KvGetPayload.Params): number {
    const irResult = this.footprintIrFromParams(params);
    const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for KvGetPayload');
    return __tnBigIntToNumber(irResult, 'KvGetPayload::footprintFromParams');
  }

  static footprintFromValues(input: { key_key_len: number | bigint }): number {
    const params = KvGetPayload.params(input);
    return this.footprintFromParams(params);
  }

  static footprint(params: KvGetPayload.Params): number {
    return this.footprintFromParams(params);
  }

  static validate(buffer: Uint8Array, opts?: { params?: KvGetPayload.Params }): { ok: boolean; code?: string; consumed?: number; params?: KvGetPayload.Params } {
    if (!buffer || buffer.length === undefined) {
      return { ok: false, code: "tn.invalid_buffer" };
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const extracted = this.__tnExtractParams(view, buffer);
      if (!extracted) return { ok: false, code: "tn.param_extraction_failed" };
      params = extracted.params;
    }
    const __tnParamsRec = this.__tnPackParams(params);
    const irResult = this.__tnValidateInternal(buffer, __tnParamsRec);
    if (!irResult.ok) {
      return { ok: false, code: irResult.code, consumed: irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'KvGetPayload::validate') : undefined, params };
    }
    const consumed = irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'KvGetPayload::validate') : undefined;
    return { ok: true, consumed, params };
  }

  static from_array(buffer: Uint8Array, opts?: { params?: KvGetPayload.Params }): KvGetPayload | null {
    if (!buffer || buffer.length === undefined) {
      return null;
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const derived = this.__tnExtractParams(view, buffer);
      if (!derived) return null;
      params = derived.params;
    }
    const validation = this.validate(buffer, { params });
    if (!validation.ok) {
      return null;
    }
    const cached = validation.params ?? params;
    const state = new KvGetPayload(buffer, cached);
    return state;
  }


}

export namespace KvGetPayload {
  export type Params = {
    /** ABI path: key.key_len */
    readonly key_key_len: bigint;
  };

  export const ParamKeys = Object.freeze({
    key_key_len: "key.key_len",
  } as const);

  export const Params = {
    fromValues(input: { key_key_len: number | bigint }): Params {
      return {
        key_key_len: __tnToBigInt(input.key_key_len),
      };
    },
    fromBuilder(source: { dynamicParams(): Params } | { params: Params } | Params): Params {
      if ((source as { dynamicParams?: () => Params }).dynamicParams) {
        return (source as { dynamicParams(): Params }).dynamicParams();
      }
      if ((source as { params?: Params }).params) {
        return (source as { params: Params }).params;
      }
      return source as Params;
    }
  };

  export function params(input: { key_key_len: number | bigint }): Params {
    return Params.fromValues(input);
  }
}

export class KvGetPayloadBuilder {
  private buffer: Uint8Array;
  private view: DataView;
  private __tnCachedParams: KvGetPayload.Params | null = null;
  private __tnLastBuffer: Uint8Array | null = null;
  private __tnLastParams: KvGetPayload.Params | null = null;
  private __tnFam_key: Uint8Array | null = null;
  private __tnFam_keyCount: number | null = null;
  private __tnFamWriter_key?: __TnFamWriterResult<KvGetPayloadBuilder>;

  constructor() {
    this.buffer = new Uint8Array(1);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  private __tnInvalidate(): void {
    this.__tnCachedParams = null;
    this.__tnLastBuffer = null;
    this.__tnLastParams = null;
  }

  set_key_len(value: number): this {
    this.view.setUint8(0, value);
    this.__tnInvalidate();
    return this;
  }

  key(): __TnFamWriterResult<KvGetPayloadBuilder> {
    if (!this.__tnFamWriter_key) {
      this.__tnFamWriter_key = __tnCreateFamWriter(this, "key", (payload) => {
        const bytes = new Uint8Array(payload);
        const elementCount = bytes.length;
        this.__tnFam_key = bytes;
        this.__tnFam_keyCount = elementCount;
        this.set_key_len(elementCount);
        this.__tnInvalidate();
      });
    }
    return this.__tnFamWriter_key!;
  }

  build(): Uint8Array {
    const params = this.__tnComputeParams();
    const size = KvGetPayload.footprintFromParams(params);
    const buffer = new Uint8Array(size);
    this.__tnWriteInto(buffer);
    this.__tnValidateOrThrow(buffer, params);
    return buffer;
  }

  buildInto(target: Uint8Array, offset = 0): Uint8Array {
    const params = this.__tnComputeParams();
    const size = KvGetPayload.footprintFromParams(params);
    if (target.length - offset < size) throw new Error("KvGetPayloadBuilder: target buffer too small");
    const slice = target.subarray(offset, offset + size);
    this.__tnWriteInto(slice);
    this.__tnValidateOrThrow(slice, params);
    return target;
  }

  finish(): KvGetPayload {
    const buffer = this.build();
    const params = this.__tnLastParams ?? this.__tnComputeParams();
    const view = KvGetPayload.from_array(buffer, { params });
    if (!view) throw new Error("KvGetPayloadBuilder: failed to finalize view");
    return view;
  }

  finishView(): KvGetPayload {
    return this.finish();
  }

  dynamicParams(): KvGetPayload.Params {
    return this.__tnComputeParams();
  }

  private __tnComputeParams(): KvGetPayload.Params {
    if (this.__tnCachedParams) return this.__tnCachedParams;
    const params = KvGetPayload.Params.fromValues({
      key_key_len: (() => { if (this.__tnFam_keyCount === null) throw new Error("KvGetPayloadBuilder: field 'key' must be written before computing params"); return __tnToBigInt(this.__tnFam_keyCount); })(),
    });
    this.__tnCachedParams = params;
    return params;
  }

  private __tnWriteInto(target: Uint8Array): void {
    target.set(this.buffer, 0);
    let cursor = this.buffer.length;
    const __tnLocal_key_bytes = this.__tnFam_key;
    if (!__tnLocal_key_bytes) throw new Error("KvGetPayloadBuilder: field 'key' must be written before build");
    target.set(__tnLocal_key_bytes, cursor);
    cursor += __tnLocal_key_bytes.length;
  }

  private __tnValidateOrThrow(buffer: Uint8Array, params: KvGetPayload.Params): void {
    const result = KvGetPayload.validate(buffer, { params });
    if (!result.ok) {
      throw new Error(`${ KvGetPayload }Builder: builder produced invalid buffer (code=${result.code ?? "unknown"})`);
    }
    this.__tnLastParams = result.params ?? params;
    this.__tnLastBuffer = buffer;
  }
}

__tnRegisterFootprint("KvGetPayload", (params) => KvGetPayload.__tnInvokeFootprint(params));
__tnRegisterValidate("KvGetPayload", (buffer, params) => KvGetPayload.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("KvGetPayload", (buffer) => { const result = KvGetPayload.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });

/* ----- TYPE DEFINITION FOR KvSetPayload ----- */

const __tn_ir_KvSetPayload = {
  typeName: "KvSetPayload",
  root: { op: "align", alignment: 1, node: { op: "add", left: { op: "add", left: { op: "add", left: { op: "align", alignment: 1, node: { op: "const", value: 1n } }, right: { op: "align", alignment: 1, node: { op: "mul", left: { op: "field", param: "key.key_len" }, right: { op: "const", value: 1n } } } }, right: { op: "align", alignment: 2, node: { op: "const", value: 2n } } }, right: { op: "align", alignment: 1, node: { op: "mul", left: { op: "field", param: "val.val_len" }, right: { op: "const", value: 1n } } } } }
} as const;

export class KvSetPayload {
  private view: DataView;
  private __tnFieldContext: Record<string, number | bigint> | null = null;
  private __tnParams: KvSetPayload.Params;

  private constructor(private buffer: Uint8Array, params?: KvSetPayload.Params, fieldContext?: Record<string, number | bigint>) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.__tnFieldContext = fieldContext ?? null;
    if (params) {
      this.__tnParams = params;
    } else {
      const derived = KvSetPayload.__tnExtractParams(this.view, buffer);
      if (!derived) {
        throw new Error("KvSetPayload: failed to derive dynamic parameters");
      }
      this.__tnParams = derived.params;
    }
  }

  static __tnCreateView(buffer: Uint8Array, opts?: { params?: KvSetPayload.Params, fieldContext?: Record<string, number | bigint> }): KvSetPayload {
    if (!buffer || buffer.length === undefined) throw new Error("KvSetPayload.__tnCreateView requires a Uint8Array");
    let params = opts?.params ?? null;
    if (!params) {
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      const derived = KvSetPayload.__tnExtractParams(view, buffer);
      if (!derived) throw new Error("KvSetPayload.__tnCreateView: failed to derive params");
      params = derived.params;
    }
    const instance = new KvSetPayload(new Uint8Array(buffer), params, opts?.fieldContext);
    return instance;
  }

  dynamicParams(): KvSetPayload.Params {
    return this.__tnParams;
  }

  withFieldContext(context: Record<string, number | bigint>): this {
    this.__tnFieldContext = context;
    return this;
  }

  private __tnResolveFieldRef(path: string): number {
    const getterName = `get_${path.replace(/[.]/g, '_')}`;
    const getter = (this as any)[getterName];
    if (typeof getter === "function") {
      const value = getter.call(this);
      return typeof value === "bigint" ? __tnBigIntToNumber(value, "KvSetPayload::__tnResolveFieldRef") : value;
    }
    if (this.__tnFieldContext && Object.prototype.hasOwnProperty.call(this.__tnFieldContext, path)) {
      const contextValue = this.__tnFieldContext[path];
      return typeof contextValue === "bigint" ? __tnBigIntToNumber(contextValue, "KvSetPayload::__tnResolveFieldRef") : contextValue;
    }
    throw new Error("KvSetPayload: field reference '" + path + "' is not available; provide fieldContext when creating this view");
  }

  static builder(): KvSetPayloadBuilder {
    return new KvSetPayloadBuilder();
  }

  static fromBuilder(builder: KvSetPayloadBuilder): KvSetPayload | null {
    const buffer = builder.build();
    const params = builder.dynamicParams();
    return KvSetPayload.from_array(buffer, { params });
  }

  static readonly flexibleArrayWriters = Object.freeze([
    { field: "key", method: "key", sizeField: "key_len", paramKey: "key_len", elementSize: 1 },
    { field: "val", method: "val", sizeField: "val_len", paramKey: "val_len", elementSize: 1 },
  ] as const);

  static __tnComputeSequentialLayout(view: DataView, buffer: Uint8Array): { params: Record<string, bigint> | null; offsets: Record<string, number> | null; derived: Record<string, bigint> | null } | null {
    const offsets: Record<string, number> = Object.create(null);
    const __tnLength = buffer.length;
    let __tnParamSeq_val_val_len: bigint | null = null;
    let __tnFieldValue_key_len: number | null = null;
    let __tnFieldValue_val_len: number | null = null;
    let __tnCursorMutable = 0;
    if (__tnCursorMutable + 1 > __tnLength) return null;
    const __tnRead_key_len = view.getUint8(__tnCursorMutable);
    __tnFieldValue_key_len = __tnRead_key_len;
    __tnCursorMutable += 1;
    if (__tnFieldValue_key_len === null) return null;
    const __tnArrayCount_key = Math.trunc(Number(__tnFieldValue_key_len));
    if (!Number.isFinite(__tnArrayCount_key) || __tnArrayCount_key < 0) return null;
    const __tnArrayBytes_key = __tnArrayCount_key * 1;
    if (__tnCursorMutable + __tnArrayBytes_key > __tnLength) return null;
    __tnCursorMutable += __tnArrayBytes_key;
    offsets["val_len"] = __tnCursorMutable;
    if (__tnCursorMutable + 2 > __tnLength) return null;
    const __tnRead_val_len = view.getUint16(__tnCursorMutable, true);
    __tnFieldValue_val_len = __tnRead_val_len;
    __tnParamSeq_val_val_len = __tnToBigInt(__tnRead_val_len);
    __tnCursorMutable += 2;
    if (__tnFieldValue_val_len === null) return null;
    const __tnArrayCount_val = Math.trunc(Number(__tnFieldValue_val_len));
    if (!Number.isFinite(__tnArrayCount_val) || __tnArrayCount_val < 0) return null;
    const __tnArrayBytes_val = __tnArrayCount_val * 1;
    offsets["val"] = __tnCursorMutable;
    if (__tnCursorMutable + __tnArrayBytes_val > __tnLength) return null;
    __tnCursorMutable += __tnArrayBytes_val;
    const params: Record<string, bigint> = Object.create(null);
    if (__tnParamSeq_val_val_len === null) return null;
    params["val_val_len"] = __tnParamSeq_val_val_len as bigint;
    return { params, offsets: offsets, derived: null };
  }

  private static __tnExtractParams(view: DataView, buffer: Uint8Array): { params: KvSetPayload.Params; derived: Record<string, bigint> | null } | null {
    if (buffer.length < 1) {
      return null;
    }
    const __tnParam_key_key_len = __tnToBigInt(view.getUint8(0));
    const __tnLayout = KvSetPayload.__tnComputeSequentialLayout(view, buffer);
    if (!__tnLayout || !__tnLayout.params) return null;
    const __tnSeqParams = __tnLayout.params;
    const __tnParamSeq_val_val_len = __tnSeqParams["val_val_len"];
    if (__tnParamSeq_val_val_len === undefined) return null;
    const __tnExtractedParams = KvSetPayload.Params.fromValues({
      key_key_len: __tnParam_key_key_len,
      val_val_len: __tnParamSeq_val_val_len as bigint,
    });
    return { params: __tnExtractedParams, derived: null };
  }

  /* Dynamic offsets are derived once per view; mutating length fields later does not invalidate this cache. */
  private __tnDynamicOffsetCache: Record<string, number> | null = null;
  private __tnGetDynamicOffset(field: string): number {
    if (!this.__tnDynamicOffsetCache) {
      this.__tnDynamicOffsetCache = this.__tnComputeDynamicOffsets();
    }
    const offset = this.__tnDynamicOffsetCache[field];
    if (offset === undefined) {
      throw new Error("KvSetPayload: field '" + field + "' does not have a dynamic offset");
    }
    return offset;
  }

  private __tnComputeDynamicOffsets(): Record<string, number> {
    const layout = KvSetPayload.__tnComputeSequentialLayout(this.view, this.buffer);
    if (!layout || !layout.offsets) {
      throw new Error("KvSetPayload: failed to compute dynamic offsets");
    }
    return layout.offsets;
  }

  get_key_len(): number {
    const offset = 0;
    return this.view.getUint8(offset);
  }

  set_key_len(value: number): void {
    const offset = 0;
    this.view.setUint8(offset, value);
  }

  get key_len(): number {
    return this.get_key_len();
  }

  set key_len(value: number) {
    this.set_key_len(value);
  }

  get_key_length(): number {
    return this.__tnResolveFieldRef("key_len");
  }

  get_key_at(index: number): number {
    const offset = 1;
    return this.view.getUint8(offset + index * 1);
  }

  get_key(): number[] {
    const len = this.get_key_length();
    const result: number[] = [];
    for (let i = 0; i < len; i++) {
      result.push(this.get_key_at(i));
    }
    return result;
  }

  set_key_at(index: number, value: number): void {
    const offset = 1;
    this.view.setUint8((offset + index * 1), value);
  }

  set_key(value: number[]): void {
    const len = Math.min(this.get_key_length(), value.length);
    for (let i = 0; i < len; i++) {
      this.set_key_at(i, value[i]);
    }
  }

  get key(): number[] {
    return this.get_key();
  }

  set key(value: number[]) {
    this.set_key(value);
  }

  get_val_len(): number {
    const offset = this.__tnGetDynamicOffset("val_len");
    return this.view.getUint16(offset, true); /* little-endian */
  }

  set_val_len(value: number): void {
    const offset = this.__tnGetDynamicOffset("val_len");
    this.view.setUint16(offset, value, true); /* little-endian */
  }

  get val_len(): number {
    return this.get_val_len();
  }

  set val_len(value: number) {
    this.set_val_len(value);
  }

  get_val_length(): number {
    return this.__tnResolveFieldRef("val_len");
  }

  get_val_at(index: number): number {
    const offset = this.__tnGetDynamicOffset("val");
    return this.view.getUint8(offset + index * 1);
  }

  get_val(): number[] {
    const len = this.get_val_length();
    const result: number[] = [];
    for (let i = 0; i < len; i++) {
      result.push(this.get_val_at(i));
    }
    return result;
  }

  set_val_at(index: number, value: number): void {
    const offset = this.__tnGetDynamicOffset("val");
    this.view.setUint8((offset + index * 1), value);
  }

  set_val(value: number[]): void {
    const len = Math.min(this.get_val_length(), value.length);
    for (let i = 0; i < len; i++) {
      this.set_val_at(i, value[i]);
    }
  }

  get val(): number[] {
    return this.get_val();
  }

  set val(value: number[]) {
    this.set_val(value);
  }
  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_KvSetPayload.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_KvSetPayload, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(key_key_len: number | bigint, val_val_len: number | bigint): bigint {
    const params = KvSetPayload.Params.fromValues({
      key_key_len: key_key_len,
      val_val_len: val_val_len,
    });
    return this.footprintIrFromParams(params);
  }

  private static __tnPackParams(params: KvSetPayload.Params): Record<string, bigint> {
    const record: Record<string, bigint> = Object.create(null);
    record["key.key_len"] = params.key_key_len;
    record["val.val_len"] = params.val_val_len;
    return record;
  }

  static footprintIrFromParams(params: KvSetPayload.Params): bigint {
    const __tnParams = this.__tnPackParams(params);
    return this.__tnFootprintInternal(__tnParams);
  }

  static footprintFromParams(params: KvSetPayload.Params): number {
    const irResult = this.footprintIrFromParams(params);
    const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for KvSetPayload');
    return __tnBigIntToNumber(irResult, 'KvSetPayload::footprintFromParams');
  }

  static footprintFromValues(input: { key_key_len: number | bigint, val_val_len: number | bigint }): number {
    const params = KvSetPayload.params(input);
    return this.footprintFromParams(params);
  }

  static footprint(params: KvSetPayload.Params): number {
    return this.footprintFromParams(params);
  }

  static validate(buffer: Uint8Array, opts?: { params?: KvSetPayload.Params }): { ok: boolean; code?: string; consumed?: number; params?: KvSetPayload.Params } {
    if (!buffer || buffer.length === undefined) {
      return { ok: false, code: "tn.invalid_buffer" };
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const extracted = this.__tnExtractParams(view, buffer);
      if (!extracted) return { ok: false, code: "tn.param_extraction_failed" };
      params = extracted.params;
    }
    const __tnParamsRec = this.__tnPackParams(params);
    const irResult = this.__tnValidateInternal(buffer, __tnParamsRec);
    if (!irResult.ok) {
      return { ok: false, code: irResult.code, consumed: irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'KvSetPayload::validate') : undefined, params };
    }
    const consumed = irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'KvSetPayload::validate') : undefined;
    return { ok: true, consumed, params };
  }

  static from_array(buffer: Uint8Array, opts?: { params?: KvSetPayload.Params }): KvSetPayload | null {
    if (!buffer || buffer.length === undefined) {
      return null;
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const derived = this.__tnExtractParams(view, buffer);
      if (!derived) return null;
      params = derived.params;
    }
    const validation = this.validate(buffer, { params });
    if (!validation.ok) {
      return null;
    }
    const cached = validation.params ?? params;
    const state = new KvSetPayload(buffer, cached);
    return state;
  }


}

export namespace KvSetPayload {
  export type Params = {
    /** ABI path: key.key_len */
    readonly key_key_len: bigint;
    /** ABI path: val.val_len */
    readonly val_val_len: bigint;
  };

  export const ParamKeys = Object.freeze({
    key_key_len: "key.key_len",
    val_val_len: "val.val_len",
  } as const);

  export const Params = {
    fromValues(input: { key_key_len: number | bigint, val_val_len: number | bigint }): Params {
      return {
        key_key_len: __tnToBigInt(input.key_key_len),
        val_val_len: __tnToBigInt(input.val_val_len),
      };
    },
    fromBuilder(source: { dynamicParams(): Params } | { params: Params } | Params): Params {
      if ((source as { dynamicParams?: () => Params }).dynamicParams) {
        return (source as { dynamicParams(): Params }).dynamicParams();
      }
      if ((source as { params?: Params }).params) {
        return (source as { params: Params }).params;
      }
      return source as Params;
    }
  };

  export function params(input: { key_key_len: number | bigint, val_val_len: number | bigint }): Params {
    return Params.fromValues(input);
  }
}

export class KvSetPayloadBuilder {
  private buffer: Uint8Array;
  private view: DataView;
  private __tnCachedParams: KvSetPayload.Params | null = null;
  private __tnLastBuffer: Uint8Array | null = null;
  private __tnLastParams: KvSetPayload.Params | null = null;
  private __tnFam_key: Uint8Array | null = null;
  private __tnFam_keyCount: number | null = null;
  private __tnFamWriter_key?: __TnFamWriterResult<KvSetPayloadBuilder>;
  private __tnFam_val: Uint8Array | null = null;
  private __tnFam_valCount: number | null = null;
  private __tnFamWriter_val?: __TnFamWriterResult<KvSetPayloadBuilder>;

  constructor() {
    this.buffer = new Uint8Array(1);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  private __tnInvalidate(): void {
    this.__tnCachedParams = null;
    this.__tnLastBuffer = null;
    this.__tnLastParams = null;
  }

  set_key_len(value: number): this {
    this.view.setUint8(0, value);
    this.__tnInvalidate();
    return this;
  }

  key(): __TnFamWriterResult<KvSetPayloadBuilder> {
    if (!this.__tnFamWriter_key) {
      this.__tnFamWriter_key = __tnCreateFamWriter(this, "key", (payload) => {
        const bytes = new Uint8Array(payload);
        const elementCount = bytes.length;
        this.__tnFam_key = bytes;
        this.__tnFam_keyCount = elementCount;
        this.set_key_len(elementCount);
        this.__tnInvalidate();
      });
    }
    return this.__tnFamWriter_key!;
  }

  val(): __TnFamWriterResult<KvSetPayloadBuilder> {
    if (!this.__tnFamWriter_val) {
      this.__tnFamWriter_val = __tnCreateFamWriter(this, "val", (payload) => {
        const bytes = new Uint8Array(payload);
        const elementCount = bytes.length;
        this.__tnFam_val = bytes;
        this.__tnFam_valCount = elementCount;
        this.__tnInvalidate();
      });
    }
    return this.__tnFamWriter_val!;
  }

  build(): Uint8Array {
    const params = this.__tnComputeParams();
    const size = KvSetPayload.footprintFromParams(params);
    const buffer = new Uint8Array(size);
    this.__tnWriteInto(buffer);
    this.__tnValidateOrThrow(buffer, params);
    return buffer;
  }

  buildInto(target: Uint8Array, offset = 0): Uint8Array {
    const params = this.__tnComputeParams();
    const size = KvSetPayload.footprintFromParams(params);
    if (target.length - offset < size) throw new Error("KvSetPayloadBuilder: target buffer too small");
    const slice = target.subarray(offset, offset + size);
    this.__tnWriteInto(slice);
    this.__tnValidateOrThrow(slice, params);
    return target;
  }

  finish(): KvSetPayload {
    const buffer = this.build();
    const params = this.__tnLastParams ?? this.__tnComputeParams();
    const view = KvSetPayload.from_array(buffer, { params });
    if (!view) throw new Error("KvSetPayloadBuilder: failed to finalize view");
    return view;
  }

  finishView(): KvSetPayload {
    return this.finish();
  }

  dynamicParams(): KvSetPayload.Params {
    return this.__tnComputeParams();
  }

  private __tnComputeParams(): KvSetPayload.Params {
    if (this.__tnCachedParams) return this.__tnCachedParams;
    const params = KvSetPayload.Params.fromValues({
      key_key_len: (() => { if (this.__tnFam_keyCount === null) throw new Error("KvSetPayloadBuilder: field 'key' must be written before computing params"); return __tnToBigInt(this.__tnFam_keyCount); })(),
      val_val_len: (() => { if (this.__tnFam_valCount === null) throw new Error("KvSetPayloadBuilder: field 'val' must be written before computing params"); return __tnToBigInt(this.__tnFam_valCount); })(),
    });
    this.__tnCachedParams = params;
    return params;
  }

  private __tnWriteInto(target: Uint8Array): void {
    target.set(this.buffer, 0);
    let cursor = this.buffer.length;
    const view = new DataView(target.buffer, target.byteOffset, target.byteLength);
    const __tnLocal_key_bytes = this.__tnFam_key;
    if (!__tnLocal_key_bytes) throw new Error("KvSetPayloadBuilder: field 'key' must be written before build");
    target.set(__tnLocal_key_bytes, cursor);
    cursor += __tnLocal_key_bytes.length;
    const __tnLocal_val_count = this.__tnFam_valCount;
    if (__tnLocal_val_count === null) throw new Error("KvSetPayloadBuilder: field 'val' must be written before build");
    view.setUint16(cursor, __tnLocal_val_count, true);
    cursor += 2;
    const __tnLocal_val_bytes = this.__tnFam_val;
    if (!__tnLocal_val_bytes) throw new Error("KvSetPayloadBuilder: field 'val' must be written before build");
    target.set(__tnLocal_val_bytes, cursor);
    cursor += __tnLocal_val_bytes.length;
  }

  private __tnValidateOrThrow(buffer: Uint8Array, params: KvSetPayload.Params): void {
    const result = KvSetPayload.validate(buffer, { params });
    if (!result.ok) {
      throw new Error(`${ KvSetPayload }Builder: builder produced invalid buffer (code=${result.code ?? "unknown"})`);
    }
    this.__tnLastParams = result.params ?? params;
    this.__tnLastBuffer = buffer;
  }
}

__tnRegisterFootprint("KvSetPayload", (params) => KvSetPayload.__tnInvokeFootprint(params));
__tnRegisterValidate("KvSetPayload", (buffer, params) => KvSetPayload.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("KvSetPayload", (buffer) => { const result = KvSetPayload.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });

/* ----- TYPE DEFINITION FOR MerklePayload ----- */

const __tn_ir_MerklePayload = {
  typeName: "MerklePayload",
  root: { op: "align", alignment: 1, node: { op: "add", left: { op: "add", left: { op: "align", alignment: 2, node: { op: "const", value: 2n } }, right: { op: "align", alignment: 2, node: { op: "const", value: 2n } } }, right: { op: "align", alignment: 1, node: { op: "mul", left: { op: "field", param: "data.data_len" }, right: { op: "const", value: 1n } } } } }
} as const;

export class MerklePayload {
  private view: DataView;
  private __tnFieldContext: Record<string, number | bigint> | null = null;
  private __tnParams: MerklePayload.Params;

  private constructor(private buffer: Uint8Array, params?: MerklePayload.Params, fieldContext?: Record<string, number | bigint>) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.__tnFieldContext = fieldContext ?? null;
    if (params) {
      this.__tnParams = params;
    } else {
      const derived = MerklePayload.__tnExtractParams(this.view, buffer);
      if (!derived) {
        throw new Error("MerklePayload: failed to derive dynamic parameters");
      }
      this.__tnParams = derived.params;
    }
  }

  static __tnCreateView(buffer: Uint8Array, opts?: { params?: MerklePayload.Params, fieldContext?: Record<string, number | bigint> }): MerklePayload {
    if (!buffer || buffer.length === undefined) throw new Error("MerklePayload.__tnCreateView requires a Uint8Array");
    let params = opts?.params ?? null;
    if (!params) {
      const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      const derived = MerklePayload.__tnExtractParams(view, buffer);
      if (!derived) throw new Error("MerklePayload.__tnCreateView: failed to derive params");
      params = derived.params;
    }
    const instance = new MerklePayload(new Uint8Array(buffer), params, opts?.fieldContext);
    return instance;
  }

  dynamicParams(): MerklePayload.Params {
    return this.__tnParams;
  }

  withFieldContext(context: Record<string, number | bigint>): this {
    this.__tnFieldContext = context;
    return this;
  }

  private __tnResolveFieldRef(path: string): number {
    const getterName = `get_${path.replace(/[.]/g, '_')}`;
    const getter = (this as any)[getterName];
    if (typeof getter === "function") {
      const value = getter.call(this);
      return typeof value === "bigint" ? __tnBigIntToNumber(value, "MerklePayload::__tnResolveFieldRef") : value;
    }
    if (this.__tnFieldContext && Object.prototype.hasOwnProperty.call(this.__tnFieldContext, path)) {
      const contextValue = this.__tnFieldContext[path];
      return typeof contextValue === "bigint" ? __tnBigIntToNumber(contextValue, "MerklePayload::__tnResolveFieldRef") : contextValue;
    }
    throw new Error("MerklePayload: field reference '" + path + "' is not available; provide fieldContext when creating this view");
  }

  static builder(): MerklePayloadBuilder {
    return new MerklePayloadBuilder();
  }

  static fromBuilder(builder: MerklePayloadBuilder): MerklePayload | null {
    const buffer = builder.build();
    const params = builder.dynamicParams();
    return MerklePayload.from_array(buffer, { params });
  }

  static readonly flexibleArrayWriters = Object.freeze([
    { field: "data", method: "data", sizeField: "data_len", paramKey: "data_len", elementSize: 1 },
  ] as const);

  private static __tnExtractParams(view: DataView, buffer: Uint8Array): { params: MerklePayload.Params; derived: Record<string, bigint> | null } | null {
    if (buffer.length < 4) {
      return null;
    }
    const __tnParam_data_data_len = __tnToBigInt(view.getUint16(2, true));
    const __tnExtractedParams = MerklePayload.Params.fromValues({
      data_data_len: __tnParam_data_data_len,
    });
    return { params: __tnExtractedParams, derived: null };
  }

  get_chunk_size(): number {
    const offset = 0;
    return this.view.getUint16(offset, true); /* little-endian */
  }

  set_chunk_size(value: number): void {
    const offset = 0;
    this.view.setUint16(offset, value, true); /* little-endian */
  }

  get chunk_size(): number {
    return this.get_chunk_size();
  }

  set chunk_size(value: number) {
    this.set_chunk_size(value);
  }

  get_data_len(): number {
    const offset = 2;
    return this.view.getUint16(offset, true); /* little-endian */
  }

  set_data_len(value: number): void {
    const offset = 2;
    this.view.setUint16(offset, value, true); /* little-endian */
  }

  get data_len(): number {
    return this.get_data_len();
  }

  set data_len(value: number) {
    this.set_data_len(value);
  }

  get_data_length(): number {
    return this.__tnResolveFieldRef("data_len");
  }

  get_data_at(index: number): number {
    const offset = 4;
    return this.view.getUint8(offset + index * 1);
  }

  get_data(): number[] {
    const len = this.get_data_length();
    const result: number[] = [];
    for (let i = 0; i < len; i++) {
      result.push(this.get_data_at(i));
    }
    return result;
  }

  set_data_at(index: number, value: number): void {
    const offset = 4;
    this.view.setUint8((offset + index * 1), value);
  }

  set_data(value: number[]): void {
    const len = Math.min(this.get_data_length(), value.length);
    for (let i = 0; i < len; i++) {
      this.set_data_at(i, value[i]);
    }
  }

  get data(): number[] {
    return this.get_data();
  }

  set data(value: number[]) {
    this.set_data(value);
  }
  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_MerklePayload.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_MerklePayload, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(data_data_len: number | bigint): bigint {
    const params = MerklePayload.Params.fromValues({
      data_data_len: data_data_len,
    });
    return this.footprintIrFromParams(params);
  }

  private static __tnPackParams(params: MerklePayload.Params): Record<string, bigint> {
    const record: Record<string, bigint> = Object.create(null);
    record["data.data_len"] = params.data_data_len;
    return record;
  }

  static footprintIrFromParams(params: MerklePayload.Params): bigint {
    const __tnParams = this.__tnPackParams(params);
    return this.__tnFootprintInternal(__tnParams);
  }

  static footprintFromParams(params: MerklePayload.Params): number {
    const irResult = this.footprintIrFromParams(params);
    const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for MerklePayload');
    return __tnBigIntToNumber(irResult, 'MerklePayload::footprintFromParams');
  }

  static footprintFromValues(input: { data_data_len: number | bigint }): number {
    const params = MerklePayload.params(input);
    return this.footprintFromParams(params);
  }

  static footprint(params: MerklePayload.Params): number {
    return this.footprintFromParams(params);
  }

  static validate(buffer: Uint8Array, opts?: { params?: MerklePayload.Params }): { ok: boolean; code?: string; consumed?: number; params?: MerklePayload.Params } {
    if (!buffer || buffer.length === undefined) {
      return { ok: false, code: "tn.invalid_buffer" };
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const extracted = this.__tnExtractParams(view, buffer);
      if (!extracted) return { ok: false, code: "tn.param_extraction_failed" };
      params = extracted.params;
    }
    const __tnParamsRec = this.__tnPackParams(params);
    const irResult = this.__tnValidateInternal(buffer, __tnParamsRec);
    if (!irResult.ok) {
      return { ok: false, code: irResult.code, consumed: irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'MerklePayload::validate') : undefined, params };
    }
    const consumed = irResult.consumed ? __tnBigIntToNumber(irResult.consumed, 'MerklePayload::validate') : undefined;
    return { ok: true, consumed, params };
  }

  static from_array(buffer: Uint8Array, opts?: { params?: MerklePayload.Params }): MerklePayload | null {
    if (!buffer || buffer.length === undefined) {
      return null;
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    let params = opts?.params ?? null;
    if (!params) {
      const derived = this.__tnExtractParams(view, buffer);
      if (!derived) return null;
      params = derived.params;
    }
    const validation = this.validate(buffer, { params });
    if (!validation.ok) {
      return null;
    }
    const cached = validation.params ?? params;
    const state = new MerklePayload(buffer, cached);
    return state;
  }


}

export namespace MerklePayload {
  export type Params = {
    /** ABI path: data.data_len */
    readonly data_data_len: bigint;
  };

  export const ParamKeys = Object.freeze({
    data_data_len: "data.data_len",
  } as const);

  export const Params = {
    fromValues(input: { data_data_len: number | bigint }): Params {
      return {
        data_data_len: __tnToBigInt(input.data_data_len),
      };
    },
    fromBuilder(source: { dynamicParams(): Params } | { params: Params } | Params): Params {
      if ((source as { dynamicParams?: () => Params }).dynamicParams) {
        return (source as { dynamicParams(): Params }).dynamicParams();
      }
      if ((source as { params?: Params }).params) {
        return (source as { params: Params }).params;
      }
      return source as Params;
    }
  };

  export function params(input: { data_data_len: number | bigint }): Params {
    return Params.fromValues(input);
  }
}

export class MerklePayloadBuilder {
  private buffer: Uint8Array;
  private view: DataView;
  private __tnCachedParams: MerklePayload.Params | null = null;
  private __tnLastBuffer: Uint8Array | null = null;
  private __tnLastParams: MerklePayload.Params | null = null;
  private __tnFam_data: Uint8Array | null = null;
  private __tnFam_dataCount: number | null = null;
  private __tnFamWriter_data?: __TnFamWriterResult<MerklePayloadBuilder>;

  constructor() {
    this.buffer = new Uint8Array(4);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  private __tnInvalidate(): void {
    this.__tnCachedParams = null;
    this.__tnLastBuffer = null;
    this.__tnLastParams = null;
  }

  set_chunk_size(value: number): this {
    this.view.setUint16(0, value, true);
    this.__tnInvalidate();
    return this;
  }

  set_data_len(value: number): this {
    this.view.setUint16(2, value, true);
    this.__tnInvalidate();
    return this;
  }

  data(): __TnFamWriterResult<MerklePayloadBuilder> {
    if (!this.__tnFamWriter_data) {
      this.__tnFamWriter_data = __tnCreateFamWriter(this, "data", (payload) => {
        const bytes = new Uint8Array(payload);
        const elementCount = bytes.length;
        this.__tnFam_data = bytes;
        this.__tnFam_dataCount = elementCount;
        this.set_data_len(elementCount);
        this.__tnInvalidate();
      });
    }
    return this.__tnFamWriter_data!;
  }

  build(): Uint8Array {
    const params = this.__tnComputeParams();
    const size = MerklePayload.footprintFromParams(params);
    const buffer = new Uint8Array(size);
    this.__tnWriteInto(buffer);
    this.__tnValidateOrThrow(buffer, params);
    return buffer;
  }

  buildInto(target: Uint8Array, offset = 0): Uint8Array {
    const params = this.__tnComputeParams();
    const size = MerklePayload.footprintFromParams(params);
    if (target.length - offset < size) throw new Error("MerklePayloadBuilder: target buffer too small");
    const slice = target.subarray(offset, offset + size);
    this.__tnWriteInto(slice);
    this.__tnValidateOrThrow(slice, params);
    return target;
  }

  finish(): MerklePayload {
    const buffer = this.build();
    const params = this.__tnLastParams ?? this.__tnComputeParams();
    const view = MerklePayload.from_array(buffer, { params });
    if (!view) throw new Error("MerklePayloadBuilder: failed to finalize view");
    return view;
  }

  finishView(): MerklePayload {
    return this.finish();
  }

  dynamicParams(): MerklePayload.Params {
    return this.__tnComputeParams();
  }

  private __tnComputeParams(): MerklePayload.Params {
    if (this.__tnCachedParams) return this.__tnCachedParams;
    const params = MerklePayload.Params.fromValues({
      data_data_len: (() => { if (this.__tnFam_dataCount === null) throw new Error("MerklePayloadBuilder: field 'data' must be written before computing params"); return __tnToBigInt(this.__tnFam_dataCount); })(),
    });
    this.__tnCachedParams = params;
    return params;
  }

  private __tnWriteInto(target: Uint8Array): void {
    target.set(this.buffer, 0);
    let cursor = this.buffer.length;
    const __tnLocal_data_bytes = this.__tnFam_data;
    if (!__tnLocal_data_bytes) throw new Error("MerklePayloadBuilder: field 'data' must be written before build");
    target.set(__tnLocal_data_bytes, cursor);
    cursor += __tnLocal_data_bytes.length;
  }

  private __tnValidateOrThrow(buffer: Uint8Array, params: MerklePayload.Params): void {
    const result = MerklePayload.validate(buffer, { params });
    if (!result.ok) {
      throw new Error(`${ MerklePayload }Builder: builder produced invalid buffer (code=${result.code ?? "unknown"})`);
    }
    this.__tnLastParams = result.params ?? params;
    this.__tnLastBuffer = buffer;
  }
}

__tnRegisterFootprint("MerklePayload", (params) => MerklePayload.__tnInvokeFootprint(params));
__tnRegisterValidate("MerklePayload", (buffer, params) => MerklePayload.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("MerklePayload", (buffer) => { const result = MerklePayload.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });

/* ----- TYPE DEFINITION FOR PsiError ----- */

const __tn_ir_PsiError = {
  typeName: "PsiError",
  root: { op: "const", value: 1n }
} as const;

export class PsiError {
  private view: DataView;
  private __tnFieldContext: Record<string, number | bigint> | null = null;
  private constructor(private buffer: Uint8Array, private descriptor: __TnVariantDescriptor | null, fieldContext?: Record<string, number | bigint>) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.__tnFieldContext = fieldContext ?? null;
  }

  static __tnCreate(payload: Uint8Array, descriptor: __TnVariantDescriptor | null, fieldContext?: Record<string, number | bigint>): PsiError {
    return new PsiError(new Uint8Array(payload), descriptor, fieldContext);
  }

  bytes(): Uint8Array {
    return new Uint8Array(this.buffer);
  }

  variant(): __TnVariantDescriptor | null {
    return this.descriptor;
  }

  asNoinstructiondata(): PsiError_NoInstructionData_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 1) return null;
    return PsiError_NoInstructionData_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asEmptyhashinput(): PsiError_EmptyHashInput_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 2) return null;
    return PsiError_EmptyHashInput_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asKvpayloadtoosmall(): PsiError_KvPayloadTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 3) return null;
    return PsiError_KvPayloadTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asKvmaxentries(): PsiError_KvMaxEntries_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 4) return null;
    return PsiError_KvMaxEntries_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asKvkeytoolong(): PsiError_KvKeyTooLong_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 5) return null;
    return PsiError_KvKeyTooLong_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asKvvaltoolong(): PsiError_KvValTooLong_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 6) return null;
    return PsiError_KvValTooLong_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asKvpayloadincomplete(): PsiError_KvPayloadIncomplete_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 7) return null;
    return PsiError_KvPayloadIncomplete_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asKvnospace(): PsiError_KvNoSpace_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 8) return null;
    return PsiError_KvNoSpace_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asKvkeymissing(): PsiError_KvKeyMissing_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 9) return null;
    return PsiError_KvKeyMissing_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asKvkeyinvalid(): PsiError_KvKeyInvalid_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 10) return null;
    return PsiError_KvKeyInvalid_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asTransfertoosmall(): PsiError_TransferTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 11) return null;
    return PsiError_TransferTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asTransferfailed(): PsiError_TransferFailed_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 12) return null;
    return PsiError_TransferFailed_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asStoretoosmall(): PsiError_StoreTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 13) return null;
    return PsiError_StoreTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asStoreoutofbounds(): PsiError_StoreOutOfBounds_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 14) return null;
    return PsiError_StoreOutOfBounds_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asReadtoosmall(): PsiError_ReadTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 15) return null;
    return PsiError_ReadTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asReadoutofbounds(): PsiError_ReadOutOfBounds_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 16) return null;
    return PsiError_ReadOutOfBounds_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asMerkletoosmall(): PsiError_MerkleTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 32) return null;
    return PsiError_MerkleTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asMerklechunkinvalid(): PsiError_MerkleChunkInvalid_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 33) return null;
    return PsiError_MerkleChunkInvalid_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asMerklenochunks(): PsiError_MerkleNoChunks_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 34) return null;
    return PsiError_MerkleNoChunks_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asResizetoosmall(): PsiError_ResizeTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 48) return null;
    return PsiError_ResizeTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asResizeinvalid(): PsiError_ResizeInvalid_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 49) return null;
    return PsiError_ResizeInvalid_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asResizefailed(): PsiError_ResizeFailed_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 50) return null;
    return PsiError_ResizeFailed_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asCreatetoosmall(): PsiError_CreateTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 64) return null;
    return PsiError_CreateTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asCreatefailed(): PsiError_CreateFailed_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 65) return null;
    return PsiError_CreateFailed_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asFlagstoosmall(): PsiError_FlagsTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 80) return null;
    return PsiError_FlagsTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asFlagsfailed(): PsiError_FlagsFailed_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 81) return null;
    return PsiError_FlagsFailed_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asInvoketoosmall(): PsiError_InvokeTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 96) return null;
    return PsiError_InvokeTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asInvokefailed(): PsiError_InvokeFailed_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 97) return null;
    return PsiError_InvokeFailed_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asInvokecalleeerror(): PsiError_InvokeCalleeError_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 98) return null;
    return PsiError_InvokeCalleeError_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asBlstoosmall(): PsiError_BlsTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 112) return null;
    return PsiError_BlsTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asAnontoosmall(): PsiError_AnonTooSmall_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 128) return null;
    return PsiError_AnonTooSmall_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asAnonfailed(): PsiError_AnonFailed_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 129) return null;
    return PsiError_AnonFailed_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  asUnknownopcode(): PsiError_UnknownOpcode_Inner | null {
    if (!this.descriptor || this.descriptor.tag !== 255) return null;
    return PsiError_UnknownOpcode_Inner.__tnCreateView(new Uint8Array(this.buffer), { fieldContext: this.__tnFieldContext ?? undefined });
  }

  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_PsiError.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_PsiError, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(): bigint {
    return this.__tnFootprintInternal(Object.create(null));
  }

  static footprint(): number {
    const irResult = this.footprintIr();
      const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) {
      throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for PsiError');
    }
    return __tnBigIntToNumber(irResult, 'PsiError::footprint');
  }

  static validate(buffer: Uint8Array, _opts?: { params?: never }): { ok: boolean; code?: string; consumed?: number } {
    if (buffer.length < 1) return { ok: false, code: "tn.buffer_too_small", consumed: 1 };
    return { ok: true, consumed: 1 };
  }

  static from_array(buffer: Uint8Array): PsiError | null {
    if (buffer.length < 1) {
      return null; /* Buffer too small */
    }

    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const tag = view.getUint8(0); /* Assuming tag at offset 0 */
    const valid_tags = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 32, 33, 34, 48, 49, 50, 64, 65, 80, 81, 96, 97, 98, 112, 128, 129, 255];
    if (!valid_tags.includes(tag)) {
      return null; /* Invalid tag value */
    }

    return new PsiError(buffer);
  }

}

__tnRegisterFootprint("PsiError", (params) => PsiError.__tnInvokeFootprint(params));
__tnRegisterValidate("PsiError", (buffer, params) => PsiError.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("PsiError", (buffer) => { const result = PsiError.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });

/* ----- TYPE DEFINITION FOR PsiState ----- */

const __tn_ir_PsiState = {
  typeName: "PsiState",
  root: { op: "const", value: 20n }
} as const;

export class PsiState {
  private view: DataView;

  private constructor(private buffer: Uint8Array) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  static __tnCreateView(buffer: Uint8Array, opts?: { fieldContext?: Record<string, number | bigint> }): PsiState {
    if (!buffer || buffer.length === undefined) throw new Error("PsiState.__tnCreateView requires a Uint8Array");
    return new PsiState(new Uint8Array(buffer));
  }

  static builder(): PsiStateBuilder {
    return new PsiStateBuilder();
  }

  static fromBuilder(builder: PsiStateBuilder): PsiState | null {
    const buffer = builder.build();
    return PsiState.from_array(buffer);
  }

  get_magic(): bigint {
    const offset = 0;
    return this.view.getBigUint64(offset, true); /* little-endian */
  }

  set_magic(value: bigint): void {
    const offset = 0;
    this.view.setBigUint64(offset, value, true); /* little-endian */
  }

  get magic(): bigint {
    return this.get_magic();
  }

  set magic(value: bigint) {
    this.set_magic(value);
  }

  get_counter(): bigint {
    const offset = 8;
    return this.view.getBigUint64(offset, true); /* little-endian */
  }

  set_counter(value: bigint): void {
    const offset = 8;
    this.view.setBigUint64(offset, value, true); /* little-endian */
  }

  get counter(): bigint {
    return this.get_counter();
  }

  set counter(value: bigint) {
    this.set_counter(value);
  }

  get_kv_count(): number {
    const offset = 16;
    return this.view.getUint16(offset, true); /* little-endian */
  }

  set_kv_count(value: number): void {
    const offset = 16;
    this.view.setUint16(offset, value, true); /* little-endian */
  }

  get kv_count(): number {
    return this.get_kv_count();
  }

  set kv_count(value: number) {
    this.set_kv_count(value);
  }

  get_data_offset(): number {
    const offset = 18;
    return this.view.getUint16(offset, true); /* little-endian */
  }

  set_data_offset(value: number): void {
    const offset = 18;
    this.view.setUint16(offset, value, true); /* little-endian */
  }

  get data_offset(): number {
    return this.get_data_offset();
  }

  set data_offset(value: number) {
    this.set_data_offset(value);
  }

  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_PsiState.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_PsiState, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(): bigint {
    return this.__tnFootprintInternal(Object.create(null));
  }

  static footprint(): number {
    const irResult = this.footprintIr();
      const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) {
      throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for PsiState');
    }
    return __tnBigIntToNumber(irResult, 'PsiState::footprint');
  }

  static validate(buffer: Uint8Array, _opts?: { params?: never }): { ok: boolean; code?: string; consumed?: number } {
    if (buffer.length < 20) return { ok: false, code: "tn.buffer_too_small", consumed: 20 };
    return { ok: true, consumed: 20 };
  }

  static new(magic: bigint, counter: bigint, kv_count: number, data_offset: number): PsiState {
    const buffer = new Uint8Array(20);
    const view = new DataView(buffer.buffer);

    let offset = 0;
    view.setBigUint64(0, magic, true); /* magic (little-endian) */
    view.setBigUint64(8, counter, true); /* counter (little-endian) */
    view.setUint16(16, kv_count, true); /* kv_count (little-endian) */
    view.setUint16(18, data_offset, true); /* data_offset (little-endian) */

    return new PsiState(buffer);
  }

  static from_array(buffer: Uint8Array): PsiState | null {
    if (!buffer || buffer.length === undefined) {
      return null;
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const validation = this.validate(buffer);
    if (!validation.ok) {
      return null;
    }
    return new PsiState(buffer);
  }

}

export class PsiStateBuilder {
  private buffer: Uint8Array;
  private view: DataView;

  constructor() {
    this.buffer = new Uint8Array(20);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  set_magic(value: bigint): this {
    const cast = __tnToBigInt(value);
    this.view.setBigUint64(0, cast, true);
    return this;
  }

  set_counter(value: bigint): this {
    const cast = __tnToBigInt(value);
    this.view.setBigUint64(8, cast, true);
    return this;
  }

  set_kv_count(value: number): this {
    this.view.setUint16(16, value, true);
    return this;
  }

  set_data_offset(value: number): this {
    this.view.setUint16(18, value, true);
    return this;
  }

  build(): Uint8Array {
    return this.buffer.slice();
  }

  buildInto(target: Uint8Array, offset = 0): Uint8Array {
    if (target.length - offset < this.buffer.length) throw new Error("target buffer too small");
    target.set(this.buffer, offset);
    return target;
  }

  finish(): PsiState {
    const view = PsiState.from_array(this.buffer.slice());
    if (!view) throw new Error("failed to build PsiState");
    return view;
  }
}

__tnRegisterFootprint("PsiState", (params) => PsiState.__tnInvokeFootprint(params));
__tnRegisterValidate("PsiState", (buffer, params) => PsiState.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("PsiState", (buffer) => { const result = PsiState.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });

/* ----- TYPE DEFINITION FOR ReadDataPayload ----- */

const __tn_ir_ReadDataPayload = {
  typeName: "ReadDataPayload",
  root: { op: "const", value: 4n }
} as const;

export class ReadDataPayload {
  private view: DataView;

  private constructor(private buffer: Uint8Array) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  static __tnCreateView(buffer: Uint8Array, opts?: { fieldContext?: Record<string, number | bigint> }): ReadDataPayload {
    if (!buffer || buffer.length === undefined) throw new Error("ReadDataPayload.__tnCreateView requires a Uint8Array");
    return new ReadDataPayload(new Uint8Array(buffer));
  }

  static builder(): ReadDataPayloadBuilder {
    return new ReadDataPayloadBuilder();
  }

  static fromBuilder(builder: ReadDataPayloadBuilder): ReadDataPayload | null {
    const buffer = builder.build();
    return ReadDataPayload.from_array(buffer);
  }

  get_offset(): number {
    const offset = 0;
    return this.view.getUint16(offset, true); /* little-endian */
  }

  set_offset(value: number): void {
    const offset = 0;
    this.view.setUint16(offset, value, true); /* little-endian */
  }

  get offset(): number {
    return this.get_offset();
  }

  set offset(value: number) {
    this.set_offset(value);
  }

  get_length(): number {
    const offset = 2;
    return this.view.getUint16(offset, true); /* little-endian */
  }

  set_length(value: number): void {
    const offset = 2;
    this.view.setUint16(offset, value, true); /* little-endian */
  }

  get length(): number {
    return this.get_length();
  }

  set length(value: number) {
    this.set_length(value);
  }

  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_ReadDataPayload.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_ReadDataPayload, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(): bigint {
    return this.__tnFootprintInternal(Object.create(null));
  }

  static footprint(): number {
    const irResult = this.footprintIr();
      const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) {
      throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for ReadDataPayload');
    }
    return __tnBigIntToNumber(irResult, 'ReadDataPayload::footprint');
  }

  static validate(buffer: Uint8Array, _opts?: { params?: never }): { ok: boolean; code?: string; consumed?: number } {
    if (buffer.length < 4) return { ok: false, code: "tn.buffer_too_small", consumed: 4 };
    return { ok: true, consumed: 4 };
  }

  static new(offset: number, length: number): ReadDataPayload {
    const buffer = new Uint8Array(4);
    const view = new DataView(buffer.buffer);

    let offset = 0;
    view.setUint16(0, offset, true); /* offset (little-endian) */
    view.setUint16(2, length, true); /* length (little-endian) */

    return new ReadDataPayload(buffer);
  }

  static from_array(buffer: Uint8Array): ReadDataPayload | null {
    if (!buffer || buffer.length === undefined) {
      return null;
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const validation = this.validate(buffer);
    if (!validation.ok) {
      return null;
    }
    return new ReadDataPayload(buffer);
  }

}

export class ReadDataPayloadBuilder {
  private buffer: Uint8Array;
  private view: DataView;

  constructor() {
    this.buffer = new Uint8Array(4);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  set_offset(value: number): this {
    this.view.setUint16(0, value, true);
    return this;
  }

  set_length(value: number): this {
    this.view.setUint16(2, value, true);
    return this;
  }

  build(): Uint8Array {
    return this.buffer.slice();
  }

  buildInto(target: Uint8Array, offset = 0): Uint8Array {
    if (target.length - offset < this.buffer.length) throw new Error("target buffer too small");
    target.set(this.buffer, offset);
    return target;
  }

  finish(): ReadDataPayload {
    const view = ReadDataPayload.from_array(this.buffer.slice());
    if (!view) throw new Error("failed to build ReadDataPayload");
    return view;
  }
}

__tnRegisterFootprint("ReadDataPayload", (params) => ReadDataPayload.__tnInvokeFootprint(params));
__tnRegisterValidate("ReadDataPayload", (buffer, params) => ReadDataPayload.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("ReadDataPayload", (buffer) => { const result = ReadDataPayload.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });

/* ----- TYPE DEFINITION FOR TransferPayload ----- */

const __tn_ir_TransferPayload = {
  typeName: "TransferPayload",
  root: { op: "const", value: 8n }
} as const;

export class TransferPayload {
  private view: DataView;

  private constructor(private buffer: Uint8Array) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  static __tnCreateView(buffer: Uint8Array, opts?: { fieldContext?: Record<string, number | bigint> }): TransferPayload {
    if (!buffer || buffer.length === undefined) throw new Error("TransferPayload.__tnCreateView requires a Uint8Array");
    return new TransferPayload(new Uint8Array(buffer));
  }

  static builder(): TransferPayloadBuilder {
    return new TransferPayloadBuilder();
  }

  static fromBuilder(builder: TransferPayloadBuilder): TransferPayload | null {
    const buffer = builder.build();
    return TransferPayload.from_array(buffer);
  }

  get_amount(): bigint {
    const offset = 0;
    return this.view.getBigUint64(offset, true); /* little-endian */
  }

  set_amount(value: bigint): void {
    const offset = 0;
    this.view.setBigUint64(offset, value, true); /* little-endian */
  }

  get amount(): bigint {
    return this.get_amount();
  }

  set amount(value: bigint) {
    this.set_amount(value);
  }

  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_TransferPayload.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_TransferPayload, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(): bigint {
    return this.__tnFootprintInternal(Object.create(null));
  }

  static footprint(): number {
    const irResult = this.footprintIr();
      const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) {
      throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for TransferPayload');
    }
    return __tnBigIntToNumber(irResult, 'TransferPayload::footprint');
  }

  static validate(buffer: Uint8Array, _opts?: { params?: never }): { ok: boolean; code?: string; consumed?: number } {
    if (buffer.length < 8) return { ok: false, code: "tn.buffer_too_small", consumed: 8 };
    return { ok: true, consumed: 8 };
  }

  static new(amount: bigint): TransferPayload {
    const buffer = new Uint8Array(8);
    const view = new DataView(buffer.buffer);

    let offset = 0;
    view.setBigUint64(0, amount, true); /* amount (little-endian) */

    return new TransferPayload(buffer);
  }

  static from_array(buffer: Uint8Array): TransferPayload | null {
    if (!buffer || buffer.length === undefined) {
      return null;
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const validation = this.validate(buffer);
    if (!validation.ok) {
      return null;
    }
    return new TransferPayload(buffer);
  }

}

export class TransferPayloadBuilder {
  private buffer: Uint8Array;
  private view: DataView;

  constructor() {
    this.buffer = new Uint8Array(8);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  set_amount(value: bigint): this {
    const cast = __tnToBigInt(value);
    this.view.setBigUint64(0, cast, true);
    return this;
  }

  build(): Uint8Array {
    return this.buffer.slice();
  }

  buildInto(target: Uint8Array, offset = 0): Uint8Array {
    if (target.length - offset < this.buffer.length) throw new Error("target buffer too small");
    target.set(this.buffer, offset);
    return target;
  }

  finish(): TransferPayload {
    const view = TransferPayload.from_array(this.buffer.slice());
    if (!view) throw new Error("failed to build TransferPayload");
    return view;
  }
}

__tnRegisterFootprint("TransferPayload", (params) => TransferPayload.__tnInvokeFootprint(params));
__tnRegisterValidate("TransferPayload", (buffer, params) => TransferPayload.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("TransferPayload", (buffer) => { const result = TransferPayload.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });

/* ----- TYPE DEFINITION FOR VersionInfo ----- */

const __tn_ir_VersionInfo = {
  typeName: "VersionInfo",
  root: { op: "const", value: 3n }
} as const;

export class VersionInfo {
  private view: DataView;

  private constructor(private buffer: Uint8Array) {
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  static __tnCreateView(buffer: Uint8Array, opts?: { fieldContext?: Record<string, number | bigint> }): VersionInfo {
    if (!buffer || buffer.length === undefined) throw new Error("VersionInfo.__tnCreateView requires a Uint8Array");
    return new VersionInfo(new Uint8Array(buffer));
  }

  static builder(): VersionInfoBuilder {
    return new VersionInfoBuilder();
  }

  static fromBuilder(builder: VersionInfoBuilder): VersionInfo | null {
    const buffer = builder.build();
    return VersionInfo.from_array(buffer);
  }

  get_major(): number {
    const offset = 0;
    return this.view.getUint8(offset);
  }

  set_major(value: number): void {
    const offset = 0;
    this.view.setUint8(offset, value);
  }

  get major(): number {
    return this.get_major();
  }

  set major(value: number) {
    this.set_major(value);
  }

  get_minor(): number {
    const offset = 1;
    return this.view.getUint8(offset);
  }

  set_minor(value: number): void {
    const offset = 1;
    this.view.setUint8(offset, value);
  }

  get minor(): number {
    return this.get_minor();
  }

  set minor(value: number) {
    this.set_minor(value);
  }

  get_patch(): number {
    const offset = 2;
    return this.view.getUint8(offset);
  }

  set_patch(value: number): void {
    const offset = 2;
    this.view.setUint8(offset, value);
  }

  get patch(): number {
    return this.get_patch();
  }

  set patch(value: number) {
    this.set_patch(value);
  }

  private static __tnFootprintInternal(__tnParams: Record<string, bigint>): bigint {
    return __tnEvalFootprint(__tn_ir_VersionInfo.root, { params: __tnParams });
  }

  private static __tnValidateInternal(buffer: Uint8Array, __tnParams: Record<string, bigint>): { ok: boolean; code?: string; consumed?: bigint } {
    return __tnValidateIrTree(__tn_ir_VersionInfo, buffer, __tnParams);
  }

  static __tnInvokeFootprint(__tnParams: Record<string, bigint>): bigint {
    return this.__tnFootprintInternal(__tnParams);
  }

  static __tnInvokeValidate(buffer: Uint8Array, __tnParams: Record<string, bigint>): __TnValidateResult {
    return this.__tnValidateInternal(buffer, __tnParams);
  }

  static footprintIr(): bigint {
    return this.__tnFootprintInternal(Object.create(null));
  }

  static footprint(): number {
    const irResult = this.footprintIr();
      const maxSafe = __tnToBigInt(Number.MAX_SAFE_INTEGER);
    if (__tnBigIntGreaterThan(irResult, maxSafe)) {
      throw new Error('footprint exceeds Number.MAX_SAFE_INTEGER for VersionInfo');
    }
    return __tnBigIntToNumber(irResult, 'VersionInfo::footprint');
  }

  static validate(buffer: Uint8Array, _opts?: { params?: never }): { ok: boolean; code?: string; consumed?: number } {
    if (buffer.length < 3) return { ok: false, code: "tn.buffer_too_small", consumed: 3 };
    return { ok: true, consumed: 3 };
  }

  static new(major: number, minor: number, patch: number): VersionInfo {
    const buffer = new Uint8Array(3);
    const view = new DataView(buffer.buffer);

    let offset = 0;
    view.setUint8(0, major); /* major */
    view.setUint8(1, minor); /* minor */
    view.setUint8(2, patch); /* patch */

    return new VersionInfo(buffer);
  }

  static from_array(buffer: Uint8Array): VersionInfo | null {
    if (!buffer || buffer.length === undefined) {
      return null;
    }
    const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const validation = this.validate(buffer);
    if (!validation.ok) {
      return null;
    }
    return new VersionInfo(buffer);
  }

}

export class VersionInfoBuilder {
  private buffer: Uint8Array;
  private view: DataView;

  constructor() {
    this.buffer = new Uint8Array(3);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  set_major(value: number): this {
    this.view.setUint8(0, value);
    return this;
  }

  set_minor(value: number): this {
    this.view.setUint8(1, value);
    return this;
  }

  set_patch(value: number): this {
    this.view.setUint8(2, value);
    return this;
  }

  build(): Uint8Array {
    return this.buffer.slice();
  }

  buildInto(target: Uint8Array, offset = 0): Uint8Array {
    if (target.length - offset < this.buffer.length) throw new Error("target buffer too small");
    target.set(this.buffer, offset);
    return target;
  }

  finish(): VersionInfo {
    const view = VersionInfo.from_array(this.buffer.slice());
    if (!view) throw new Error("failed to build VersionInfo");
    return view;
  }
}

__tnRegisterFootprint("VersionInfo", (params) => VersionInfo.__tnInvokeFootprint(params));
__tnRegisterValidate("VersionInfo", (buffer, params) => VersionInfo.__tnInvokeValidate(buffer, params));
__tnRegisterDynamicValidate("VersionInfo", (buffer) => { const result = VersionInfo.validate(buffer); const params = (result as { params?: Record<string, bigint> }).params; return { ok: result.ok, code: result.code, consumed: result.consumed === undefined ? undefined : __tnToBigInt(result.consumed), params }; });
