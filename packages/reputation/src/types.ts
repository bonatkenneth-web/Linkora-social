/** Reputation score for a Linkora account. */
export interface ReputationScore {
  address: string;
  score: number;
  updatedAt: number; // ledger sequence
}
