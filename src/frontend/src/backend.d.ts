import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TradePosition {
    status: TradeStatus;
    forexPair: ForexPair;
    direction: TradeDirection;
    leverage: bigint;
    platformFee: number;
    openPrice: number;
    closeTimestamp?: Time;
    user: Principal;
    profitLoss?: number;
    tradeId: bigint;
    closePrice?: number;
    margin: number;
    openTimestamp: Time;
}
export type Time = bigint;
export interface ForexPair {
    baseCurrency: string;
    quoteCurrency: string;
    symbol: string;
}
export interface DepositRequest {
    status: DepositStatus;
    mpesaReference?: string;
    requestId: bigint;
    user: Principal;
    adminNote?: string;
    timestamp: Time;
    amount: number;
}
export interface Bonus {
    user: Principal;
    description: string;
    isActive: boolean;
    bonusType: BonusType;
    timestamp: Time;
    amount: number;
    bonusId: bigint;
}
export interface TradingFee {
    user: Principal;
    tradeId: bigint;
    timestamp: Time;
    amount: number;
    feeId: bigint;
}
export interface UserProfile {
    displayName: string;
    role: UserRole;
    walletBalance: number;
}
export enum BonusType {
    signup = "signup",
    depositMatch = "depositMatch",
    loyalty = "loyalty"
}
export enum DepositStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum TradeDirection {
    buy = "buy",
    sell = "sell"
}
export enum TradeStatus {
    closed = "closed",
    open = "open"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyBonus(targetUser: Principal, amount: number, bonusType: BonusType, description: string): Promise<Bonus>;
    approveDeposit(requestId: bigint, adminNote: string | null): Promise<DepositRequest>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    closeTrade(tradeId: bigint): Promise<TradePosition>;
    depositFunds(amount: number, mpesaRef: string | null): Promise<DepositRequest>;
    getAllBonuses(): Promise<Array<Bonus>>;
    getAllDepositRequests(): Promise<Array<DepositRequest>>;
    getAllTrades(): Promise<Array<TradePosition>>;
    getAllTradingFees(): Promise<Array<TradingFee>>;
    getAvailableBalance(): Promise<number>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDepositStatus(): Promise<Array<DepositRequest>>;
    getMpesaNumber(): Promise<string>;
    getOpenTrades(): Promise<Array<TradePosition>>;
    getPlatformRevenue(): Promise<number>;
    getTradeHistory(): Promise<Array<TradePosition>>;
    getTradingFees(): Promise<Array<TradingFee>>;
    getUserBonuses(): Promise<Array<Bonus>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    openTrade(pairSymbol: string, direction: TradeDirection, leverage: bigint, margin: number): Promise<TradePosition>;
    rejectDeposit(requestId: bigint, adminNote: string | null): Promise<DepositRequest>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setMpesaNumber(newNumber: string): Promise<void>;
    submitTradingFee(tradeId: bigint, amount: number): Promise<TradingFee>;
    withdrawFunds(amount: number): Promise<boolean>;
}
