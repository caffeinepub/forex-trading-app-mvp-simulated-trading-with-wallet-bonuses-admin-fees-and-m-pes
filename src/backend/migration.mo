import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type ForexPair = {
    baseCurrency : Text;
    quoteCurrency : Text;
    symbol : Text;
  };

  type TradeDirection = { #buy; #sell };
  type TradeStatus = { #open; #closed };
  type DepositStatus = { #pending; #approved; #rejected };
  type BonusType = { #depositMatch; #signup; #loyalty };

  type AccountBalance = {
    available : Float;
    lockedMargin : Float;
    totalEquity : Float;
  };

  type TradePosition = {
    tradeId : Nat;
    user : Principal;
    forexPair : ForexPair;
    direction : TradeDirection;
    leverage : Nat;
    margin : Float;
    openPrice : Float;
    closePrice : ?Float;
    profitLoss : ?Float;
    openTimestamp : Time.Time;
    closeTimestamp : ?Time.Time;
    status : TradeStatus;
    platformFee : Float;
  };

  type DepositRequest = {
    requestId : Nat;
    user : Principal;
    amount : Float;
    timestamp : Time.Time;
    status : DepositStatus;
    mpesaReference : ?Text;
    adminNote : ?Text;
  };

  type Bonus = {
    bonusId : Nat;
    user : Principal;
    amount : Float;
    timestamp : Time.Time;
    bonusType : BonusType;
    description : Text;
    isActive : Bool;
  };

  type TradingFee = {
    feeId : Nat;
    tradeId : Nat;
    user : Principal;
    amount : Float;
    timestamp : Time.Time;
  };

  type UserProfile = {
    displayName : Text;
    role : { #admin; #user; #guest };
    walletBalance : Float;
  };

  // Old actor type (without persistent M-Pesa number)
  type OldActor = {
    trades : Map.Map<Nat, TradePosition>;
    balances : Map.Map<Principal, AccountBalance>;
    deposits : Map.Map<Nat, DepositRequest>;
    bonuses : Map.Map<Nat, Bonus>;
    fees : Map.Map<Nat, TradingFee>;
    userProfiles : Map.Map<Principal, UserProfile>;
    tradeCounter : Nat;
    depositCounter : Nat;
    bonusCounter : Nat;
    feeCounter : Nat;
  };

  // New actor type (with persistent M-Pesa number)
  type NewActor = {
    trades : Map.Map<Nat, TradePosition>;
    balances : Map.Map<Principal, AccountBalance>;
    deposits : Map.Map<Nat, DepositRequest>;
    bonuses : Map.Map<Nat, Bonus>;
    fees : Map.Map<Nat, TradingFee>;
    userProfiles : Map.Map<Principal, UserProfile>;
    tradeCounter : Nat;
    depositCounter : Nat;
    bonusCounter : Nat;
    feeCounter : Nat;
    mpesaNumber : Text;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      mpesaNumber = "255712345678";
    };
  };
};
