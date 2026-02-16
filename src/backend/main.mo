import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Trading Types

  public type ForexPair = {
    baseCurrency : Text;
    quoteCurrency : Text;
    symbol : Text;
  };

  public type TradeDirection = { #buy; #sell };
  public type TradeStatus = { #open; #closed };
  public type DepositStatus = { #pending; #approved; #rejected };
  public type BonusType = { #depositMatch; #signup; #loyalty };

  public type AccountBalance = {
    available : Float;
    lockedMargin : Float;
    totalEquity : Float;
  };

  public type TradePosition = {
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

  public type DepositRequest = {
    requestId : Nat;
    user : Principal;
    amount : Float;
    timestamp : Time.Time;
    status : DepositStatus;
    mpesaReference : ?Text;
    adminNote : ?Text;
  };

  public type Bonus = {
    bonusId : Nat;
    user : Principal;
    amount : Float;
    timestamp : Time.Time;
    bonusType : BonusType;
    description : Text;
    isActive : Bool;
  };

  public type TradingFee = {
    feeId : Nat;
    tradeId : Nat;
    user : Principal;
    amount : Float;
    timestamp : Time.Time;
  };

  public type TradingSummary = {
    totalTrades : Nat;
    totalVolume : Float;
    totalProfitLoss : Float;
    winningTrades : Nat;
    losingTrades : Nat;
    averageTradeSize : Float;
  };

  public type UserProfile = {
    displayName : Text;
    role : AccessControl.UserRole;
    walletBalance : Float;
  };

  //////////////////// Map initialization //////////////////////

  let trades = Map.empty<Nat, TradePosition>();
  let balances = Map.empty<Principal, AccountBalance>();
  let deposits = Map.empty<Nat, DepositRequest>();
  let bonuses = Map.empty<Nat, Bonus>();
  let fees = Map.empty<Nat, TradingFee>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Access Control & Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent M-Pesa Destination Number
  var mpesaNumber : Text = "255712345678";

  public query ({ caller }) func getMpesaNumber() : async Text {
    mpesaNumber;
  };

  public shared ({ caller }) func setMpesaNumber(newNumber : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can change M-Pesa number");
    };
    mpesaNumber := newNumber;
  };

  //////////////////// User Profile Management //////////////////////

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  //////////////////// Forex Trading ///////////////////////

  var tradeCounter = 0;
  var depositCounter = 0;
  var bonusCounter = 0;
  var feeCounter = 0;

  func getBaseCurrency(pairSymbol : Text) : Text {
    let chars = pairSymbol.toArray();
    let baseChars = chars.sliceToArray(0, 3);
    Text.fromArray(baseChars);
  };

  func getQuoteCurrency(pairSymbol : Text) : Text {
    let chars = pairSymbol.toArray();
    let quoteChars = chars.sliceToArray(4, 7);
    Text.fromArray(quoteChars);
  };

  public shared ({ caller }) func openTrade(
    pairSymbol : Text,
    direction : TradeDirection,
    leverage : Nat,
    margin : Float
  ) : async TradePosition {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can open trades");
    };

    tradeCounter += 1;
    let tradeId = tradeCounter;

    let trade : TradePosition = {
      tradeId;
      user = caller;
      forexPair = {
        baseCurrency = getBaseCurrency(pairSymbol);
        quoteCurrency = getQuoteCurrency(pairSymbol);
        symbol = pairSymbol;
      };
      direction;
      leverage;
      margin;
      openPrice = 20.0;
      closePrice = null;
      profitLoss = null;
      openTimestamp = Time.now();
      closeTimestamp = null;
      status = #open;
      platformFee = 2.0;
    };

    trades.add(tradeId, trade);
    trade;
  };

  public shared ({ caller }) func closeTrade(tradeId : Nat) : async TradePosition {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can close trades");
    };

    var finalTrade : ?TradePosition = null;

    switch (trades.get(tradeId)) {
      case (null) {
        Runtime.trap("Trade does not exist.");
      };
      case (?trade) {
        if (trade.status == #closed) {
          Runtime.trap("Trade already closed.");
        };
        if (trade.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot close another user's trade");
        };

        finalTrade := ?{
          trade with
          closePrice = ?45.0;
          profitLoss = ?(-167.0);
          closeTimestamp = ?Time.now();
          status = #closed;
        };
      };
    };

    switch (finalTrade) {
      case (null) { Runtime.trap("Trade not found") };
      case (?tradeResult) {
        trades.add(tradeId, tradeResult);
        tradeResult;
      };
    };
  };

  public query ({ caller }) func getOpenTrades() : async [TradePosition] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trades");
    };
    trades.values().toArray().filter(func(t) { t.status == #open and t.user == caller });
  };

  public query ({ caller }) func getTradeHistory() : async [TradePosition] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trade history");
    };
    trades.values().toArray().filter(func(t) { t.user == caller });
  };

  public query ({ caller }) func getAllTrades() : async [TradePosition] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all trades");
    };
    trades.values().toArray();
  };

  /////////////////////// Account Balances //////////////////////

  public query ({ caller }) func getAvailableBalance() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };
    switch (balances.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance.available };
    };
  };

  public shared ({ caller }) func depositFunds(amount : Float, mpesaRef : ?Text) : async DepositRequest {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit funds");
    };

    depositCounter += 1;
    let depositRequest : DepositRequest = {
      requestId = depositCounter;
      user = caller;
      amount;
      timestamp = Time.now();
      status = #pending;
      mpesaReference = mpesaRef;
      adminNote = null;
    };

    deposits.add(depositCounter, depositRequest);
    depositRequest;
  };

  public query ({ caller }) func getDepositStatus() : async [DepositRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view deposit status");
    };
    deposits.values().toArray().filter(func(d) { d.user == caller });
  };

  public query ({ caller }) func getAllDepositRequests() : async [DepositRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all deposit requests");
    };
    deposits.values().toArray();
  };

  public shared ({ caller }) func approveDeposit(requestId : Nat, adminNote : ?Text) : async DepositRequest {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve deposits");
    };

    switch (deposits.get(requestId)) {
      case (null) {
        Runtime.trap("Deposit request does not exist.");
      };
      case (?deposit) {
        if (deposit.status != #pending) {
          Runtime.trap("Deposit request already processed.");
        };

        let updatedDeposit : DepositRequest = {
          deposit with
          status = #approved;
          adminNote = adminNote;
        };

        deposits.add(requestId, updatedDeposit);

        // Update user balance
        let currentBalance = switch (balances.get(deposit.user)) {
          case (null) {
            {
              available = 0.0;
              lockedMargin = 0.0;
              totalEquity = 0.0;
            };
          };
          case (?bal) { bal };
        };

        balances.add(deposit.user, {
          currentBalance with
          available = deposit.amount;
          totalEquity = deposit.amount;
        });

        updatedDeposit;
      };
    };
  };

  public shared ({ caller }) func rejectDeposit(requestId : Nat, adminNote : ?Text) : async DepositRequest {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject deposits");
    };

    switch (deposits.get(requestId)) {
      case (null) {
        Runtime.trap("Deposit request does not exist.");
      };
      case (?deposit) {
        if (deposit.status != #pending) {
          Runtime.trap("Deposit request already processed.");
        };

        let updatedDeposit : DepositRequest = {
          deposit with
          status = #rejected;
          adminNote = adminNote;
        };

        deposits.add(requestId, updatedDeposit);
        updatedDeposit;
      };
    };
  };

  public shared ({ caller }) func applyBonus(targetUser : Principal, amount : Float, bonusType : BonusType, description : Text) : async Bonus {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can apply bonuses");
    };

    bonusCounter += 1;
    let bonus : Bonus = {
      bonusId = bonusCounter;
      user = targetUser;
      amount;
      timestamp = Time.now();
      bonusType;
      description;
      isActive = true;
    };

    bonuses.add(bonusCounter, bonus);

    // Update user balance
    let currentBalance = switch (balances.get(targetUser)) {
      case (null) {
        {
          available = 0.0;
          lockedMargin = 0.0;
          totalEquity = 0.0;
        };
      };
      case (?bal) { bal };
    };

    balances.add(targetUser, {
      currentBalance with
      available = amount;
      totalEquity = amount;
    });

    bonus;
  };

  public query ({ caller }) func getUserBonuses() : async [Bonus] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bonuses");
    };
    bonuses.values().toArray().filter(func(b) { b.user == caller });
  };

  public query ({ caller }) func getAllBonuses() : async [Bonus] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all bonuses");
    };
    bonuses.values().toArray();
  };

  public shared ({ caller }) func withdrawFunds(amount : Float) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can withdraw funds");
    };

    switch (balances.get(caller)) {
      case (null) { false };
      case (?balance) {
        if (balance.available < amount) {
          false;
        } else {
          balances.add(caller, {
            balance with
            available = balance.available - amount;
            totalEquity = balance.totalEquity - amount;
          });
          true;
        };
      };
    };
  };

  public shared ({ caller }) func submitTradingFee(tradeId : Nat, amount : Float) : async TradingFee {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit trading fees");
    };

    feeCounter += 1;
    let tradingFee : TradingFee = {
      feeId = feeCounter;
      tradeId;
      user = caller;
      amount;
      timestamp = Time.now();
    };

    fees.add(feeCounter, tradingFee);
    tradingFee;
  };

  public query ({ caller }) func getTradingFees() : async [TradingFee] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trading fees");
    };
    fees.values().toArray().filter(func(f) { f.user == caller });
  };

  public query ({ caller }) func getAllTradingFees() : async [TradingFee] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all trading fees");
    };
    fees.values().toArray();
  };

  public query ({ caller }) func getPlatformRevenue() : async Float {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view platform revenue");
    };
    var totalRevenue : Float = 0;
    for (fee in fees.values()) {
      totalRevenue += fee.amount;
    };
    totalRevenue;
  };
};
