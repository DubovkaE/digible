export type PendingDigiCard = {
  id: number;
  price?: number;
  endDate?: string;
  auction?: boolean;
  auctionId: number;
  seller: boolean;
  sold: boolean;
};
