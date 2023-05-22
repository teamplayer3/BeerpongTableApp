declare type u8 = number
declare type u16 = number
declare type u32 = number
declare type u64 = number
declare type u128 = number
declare type usize = number
declare type i8 = number
declare type i16 = number
declare type i32 = number
declare type i64 = number
declare type i128 = number
declare type isize = number

export type Color = { r: u8, g: u8, b: u8 }
export type ColorVariant = { tag: "Color", value: Color } | { tag: "Gradient", value: Gradient }
export type Gradient = { from: Color, to: Color }
export type IndexVariant = { tag: "Index", value: u16 } | { tag: "Range", value: { start: u16, end: u16 } } | { tag: "List", value: u16[] } | { tag: "EveryN", value: { range: { start: u16, end: u16 }, n: u16 } } | { tag: "EveryOdd", value: { range: { start: u16, end: u16 }, n: u16 } } | { tag: "EveryEven", value: { range: { start: u16, end: u16 }, n: u16 } }
export type ModuleSide = { tag: "Both" } | { tag: "Main" } | { tag: "Secondary" }
export type MultiPart = { module: ModuleSide, index: IndexVariant, color: ColorVariant }
export type Operation = { tag: "set_part_color", value: SetPartColor } | { tag: "animate_part" }
export type Packet = { operation: Operation }
export type Part = { tag: "Led", value: { module: ModuleSide, index: u16, color: Color } } | { tag: "Pot", value: MultiPart } | { tag: "Module", value: { module: ModuleSide, color: Color } } | { tag: "SideBack", value: MultiPart } | { tag: "SideFront", value: MultiPart }
export type SetPartColor = { part: Part }

export type Type = "Color" | "ColorVariant" | "Gradient" | "IndexVariant" | "ModuleSide" | "MultiPart" | "Operation" | "Packet" | "Part" | "SetPartColor"
declare type ValueType<T extends Type> = T extends "Color" ? Color : T extends "ColorVariant" ? ColorVariant : T extends "Gradient" ? Gradient : T extends "IndexVariant" ? IndexVariant : T extends "ModuleSide" ? ModuleSide : T extends "MultiPart" ? MultiPart : T extends "Operation" ? Operation : T extends "Packet" ? Packet : T extends "Part" ? Part : T extends "SetPartColor" ? SetPartColor : void

export function serialize<T extends Type>(type: T, value: ValueType<T>): u8[]
export function deserialize<T extends Type>(type: T, bytes: u8[]): ValueType<T>
