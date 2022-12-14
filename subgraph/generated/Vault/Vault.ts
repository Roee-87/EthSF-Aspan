// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Deposit extends ethereum.Event {
  get params(): Deposit__Params {
    return new Deposit__Params(this);
  }
}

export class Deposit__Params {
  _event: Deposit;

  constructor(event: Deposit) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get aspanMinted(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get usdcDeposited(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Withdraw extends ethereum.Event {
  get params(): Withdraw__Params {
    return new Withdraw__Params(this);
  }
}

export class Withdraw__Params {
  _event: Withdraw;

  constructor(event: Withdraw) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get aspanBurned(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get usdcWithdrew(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Vault extends ethereum.SmartContract {
  static bind(address: Address): Vault {
    return new Vault("Vault", address);
  }

  ASPANTOKEN(): Address {
    let result = super.call("ASPANTOKEN", "ASPANTOKEN():(address)", []);

    return result[0].toAddress();
  }

  try_ASPANTOKEN(): ethereum.CallResult<Address> {
    let result = super.tryCall("ASPANTOKEN", "ASPANTOKEN():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getPoolAddress(): Address {
    let result = super.call("getPoolAddress", "getPoolAddress():(address)", []);

    return result[0].toAddress();
  }

  try_getPoolAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getPoolAddress",
      "getPoolAddress():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class DepositCall extends ethereum.Call {
  get inputs(): DepositCall__Inputs {
    return new DepositCall__Inputs(this);
  }

  get outputs(): DepositCall__Outputs {
    return new DepositCall__Outputs(this);
  }
}

export class DepositCall__Inputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get dc2dtSwapCallData(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get dc2daiSwapCallData(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class DepositCall__Outputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }
}

export class RescueFundCall extends ethereum.Call {
  get inputs(): RescueFundCall__Inputs {
    return new RescueFundCall__Inputs(this);
  }

  get outputs(): RescueFundCall__Outputs {
    return new RescueFundCall__Outputs(this);
  }
}

export class RescueFundCall__Inputs {
  _call: RescueFundCall;

  constructor(call: RescueFundCall) {
    this._call = call;
  }

  get tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RescueFundCall__Outputs {
  _call: RescueFundCall;

  constructor(call: RescueFundCall) {
    this._call = call;
  }
}

export class SetAspanTokenAddressCall extends ethereum.Call {
  get inputs(): SetAspanTokenAddressCall__Inputs {
    return new SetAspanTokenAddressCall__Inputs(this);
  }

  get outputs(): SetAspanTokenAddressCall__Outputs {
    return new SetAspanTokenAddressCall__Outputs(this);
  }
}

export class SetAspanTokenAddressCall__Inputs {
  _call: SetAspanTokenAddressCall;

  constructor(call: SetAspanTokenAddressCall) {
    this._call = call;
  }

  get newAspanToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetAspanTokenAddressCall__Outputs {
  _call: SetAspanTokenAddressCall;

  constructor(call: SetAspanTokenAddressCall) {
    this._call = call;
  }
}

export class SetPriceOracleCall extends ethereum.Call {
  get inputs(): SetPriceOracleCall__Inputs {
    return new SetPriceOracleCall__Inputs(this);
  }

  get outputs(): SetPriceOracleCall__Outputs {
    return new SetPriceOracleCall__Outputs(this);
  }
}

export class SetPriceOracleCall__Inputs {
  _call: SetPriceOracleCall;

  constructor(call: SetPriceOracleCall) {
    this._call = call;
  }

  get newPriceOracle(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetPriceOracleCall__Outputs {
  _call: SetPriceOracleCall;

  constructor(call: SetPriceOracleCall) {
    this._call = call;
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }

  get aspanTokenAmount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get dt2dcSwapCallData(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get dai2dcSwapCallData(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}
