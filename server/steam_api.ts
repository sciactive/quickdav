import ffi from "ffi-napi";
import ref, { Pointer as TypedPointer, UnderlyingType } from "ref-napi";
import refStructDi, { StructObject } from "ref-struct-di";
import refArrayDi, { TypedArray } from "ref-array-di";
import refUnionDi from "ref-union-di";
const Struct = refStructDi(ref);
const Union = refUnionDi(ref);
const ArrayType = refArrayDi(ref);
const Pointer = ref.refType;
export function dlopen(libPath: string) {
  return ffi.Library(libPath, {});
}
