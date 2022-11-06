import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Vault,
  Deposit as DepositEvent,
  Withdraw as WithdrawalEvent,
} from "../generated/Vault/Vault";
import { Position, Deposit, Withdrawal } from "../generated/schema";

export function handleDeposit(event: DepositEvent): void {
  const posId = event.params.user;
  let position = Position.load(posId);
  if (!position) {
    position = new Position(posId);
    position.userAddress = event.params.user;
    position.usdcWithdrawn = new BigInt(0);
    position.aspanBalance = new BigInt(0);
    position.usdcProvided = new BigInt(0);
    position.active = true;
  }

  // event.block.timestamp

  position.aspanBalance = position.aspanBalance.plus(event.params.aspanMinted);
  position.usdcProvided = position.usdcProvided.plus(
    event.params.usdcDeposited
  );
  position.save();

  const depId = getIdFromEventParams(
    event.params.user,
    event.block.timestamp,
    event.transaction.nonce
  );
  let deposit = new Deposit(depId);
  deposit.userAddress = event.params.user;
  deposit.usdcProvided = event.params.usdcDeposited;
  deposit.tokensMinted = event.params.aspanMinted;
  deposit.timestamp = event.block.timestamp;
  deposit.save();
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  const posId = event.params.user;
  let position = Position.load(posId);

  position!.usdcWithdrawn = position!.usdcWithdrawn.plus(
    event.params.usdcWithdrew
  );
  position!.aspanBalance = position!.aspanBalance.minus(
    event.params.aspanBurned
  );

  if (position!.aspanBalance.isZero()) position!.active = false;

  position!.save();

  const withId = getIdFromEventParams(
    event.params.user,
    event.block.timestamp,
    event.transaction.nonce
  );
  let withdrawal = new Withdrawal(withId);
  withdrawal.userAddress = event.params.user;
  withdrawal.usdcWithdrawn = event.params.usdcWithdrew;
  withdrawal.tokensBurnt = event.params.aspanBurned;
  withdrawal.timestamp = event.block.timestamp;
  withdrawal.save();
}

function getIdFromEventParams(
  addr: Address,
  timestamp: BigInt,
  nonce: BigInt
): string {
  return addr.toHexString() + timestamp.toHexString() + nonce.toHexString();
}
