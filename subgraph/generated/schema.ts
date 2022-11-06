// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Deposit extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Deposit entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Deposit must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Deposit", id.toString(), this);
    }
  }

  static load(id: string): Deposit | null {
    return changetype<Deposit | null>(store.get("Deposit", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get userAddress(): Bytes {
    let value = this.get("userAddress");
    return value!.toBytes();
  }

  set userAddress(value: Bytes) {
    this.set("userAddress", Value.fromBytes(value));
  }

  get usdcProvided(): BigInt {
    let value = this.get("usdcProvided");
    return value!.toBigInt();
  }

  set usdcProvided(value: BigInt) {
    this.set("usdcProvided", Value.fromBigInt(value));
  }

  get tokensMinted(): BigInt {
    let value = this.get("tokensMinted");
    return value!.toBigInt();
  }

  set tokensMinted(value: BigInt) {
    this.set("tokensMinted", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class Withdrawal extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Withdrawal entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Withdrawal must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Withdrawal", id.toString(), this);
    }
  }

  static load(id: string): Withdrawal | null {
    return changetype<Withdrawal | null>(store.get("Withdrawal", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get userAddress(): Bytes {
    let value = this.get("userAddress");
    return value!.toBytes();
  }

  set userAddress(value: Bytes) {
    this.set("userAddress", Value.fromBytes(value));
  }

  get usdcWithdrawn(): BigInt {
    let value = this.get("usdcWithdrawn");
    return value!.toBigInt();
  }

  set usdcWithdrawn(value: BigInt) {
    this.set("usdcWithdrawn", Value.fromBigInt(value));
  }

  get tokensBurnt(): BigInt {
    let value = this.get("tokensBurnt");
    return value!.toBigInt();
  }

  set tokensBurnt(value: BigInt) {
    this.set("tokensBurnt", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class Position extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Position entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Position must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Position", id.toBytes().toHexString(), this);
    }
  }

  static load(id: Bytes): Position | null {
    return changetype<Position | null>(store.get("Position", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    return value!.toBytes();
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get userAddress(): Bytes {
    let value = this.get("userAddress");
    return value!.toBytes();
  }

  set userAddress(value: Bytes) {
    this.set("userAddress", Value.fromBytes(value));
  }

  get usdcProvided(): BigInt {
    let value = this.get("usdcProvided");
    return value!.toBigInt();
  }

  set usdcProvided(value: BigInt) {
    this.set("usdcProvided", Value.fromBigInt(value));
  }

  get usdcWithdrawn(): BigInt {
    let value = this.get("usdcWithdrawn");
    return value!.toBigInt();
  }

  set usdcWithdrawn(value: BigInt) {
    this.set("usdcWithdrawn", Value.fromBigInt(value));
  }

  get aspanBalance(): BigInt {
    let value = this.get("aspanBalance");
    return value!.toBigInt();
  }

  set aspanBalance(value: BigInt) {
    this.set("aspanBalance", Value.fromBigInt(value));
  }

  get active(): boolean {
    let value = this.get("active");
    return value!.toBoolean();
  }

  set active(value: boolean) {
    this.set("active", Value.fromBoolean(value));
  }
}
