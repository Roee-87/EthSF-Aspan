import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { Deposit, Withdraw } from "../generated/Vault/Vault"

export function createDepositEvent(
  user: Address,
  aspanBalance: BigInt,
  usdcDeposited: BigInt
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam(
      "aspanBalance",
      ethereum.Value.fromUnsignedBigInt(aspanBalance)
    )
  )
  depositEvent.parameters.push(
    new ethereum.EventParam(
      "usdcDeposited",
      ethereum.Value.fromUnsignedBigInt(usdcDeposited)
    )
  )

  return depositEvent
}

export function createWithdrawEvent(
  user: Address,
  aspanBurned: BigInt,
  usdcWithdrew: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "aspanBurned",
      ethereum.Value.fromUnsignedBigInt(aspanBurned)
    )
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "usdcWithdrew",
      ethereum.Value.fromUnsignedBigInt(usdcWithdrew)
    )
  )

  return withdrawEvent
}
