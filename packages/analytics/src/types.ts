/** Snapshot of on-chain analytics for a given ledger window. */
export interface AnalyticsSnapshot {
  contractId: string;
  ledger: number;
  totalTips: bigint;
  activeProfiles: number;
  postCount: number;
}
