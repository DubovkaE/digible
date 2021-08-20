export type PendingDigiCard = {
  id: number;
  price?: number;
  endDate: number;
  auction?: boolean;
  auctionId: number;
  seller: boolean;
  sold: boolean;
};
