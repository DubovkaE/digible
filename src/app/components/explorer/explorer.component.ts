import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MarketplaceService } from 'src/app/services/marketplace.service';
import { NftService } from 'src/app/services/nft.service';
import { WalletService } from 'src/app/services/wallet.service';
import { MarketCard } from 'src/app/types/market-card.types';
import { Network } from 'src/app/types/network.enum';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  static nftListCached: MarketCard[] = null;
  static cacheUntil: Date = null;
  static lastOffset: number;

  typeFilter = 'ALL';
  filterBy = [
    { name: 'All', id: 'ALL' },
    { name: 'Date ending Up', id: 'DATE_ENDING_UP' },
    { name: 'Date ending Down', id: 'DATE_ENDING_DOWN' },
    { name: 'Price Up', id: 'PRICE_UP' },
    { name: 'Price Down', id: 'PRICE_DOWN' },
    { name: 'Ethereum', id: 'ETHEREUM' },
    { name: 'Matic', id: 'MATIC' },
  ];

  nftList: MarketCard[] = null;
  unfilteredNftList: MarketCard[] = null; 
  showSwitchToMatic = false;
  digibleNftAddress;
  network: Network;

  loading = false;
  currentOffset = 0;
  endReached = false;
  readonly limit = 24;

  constructor(
    private readonly nft: NftService,
    private readonly market: MarketplaceService,
    private readonly cdr: ChangeDetectorRef,
    private readonly wallet: WalletService,
  ) {}

  ngOnInit(): void {
    this.nft.getNftAddress(true).then((address) => {
      this.digibleNftAddress = address;
    });
    this.loadData();
    this.checkNetwork();
    if (window.ethereum) {
      window.ethereum.on('networkChanged', () => {
        this.loadData();
        this.checkNetwork();
      });
    }
  }

  async checkNetwork(): Promise<void> {
    this.network = await this.wallet.getNetwork();
    this.cdr.detectChanges();
  }

  async loadData(): Promise<void> {
    if (ExplorerComponent.cacheUntil > new Date() && ExplorerComponent.nftListCached) {
      this.nftList = ExplorerComponent.nftListCached;
      this.currentOffset = ExplorerComponent.lastOffset;
      this.unfilteredNftList = this.nftList;
      return;
    }
    this.currentOffset = 0;
    this.endReached = false;
    this.nftList = (await this.market.getLastSales(this.limit)).sales;

    const filteredList = [];
    for (const nft of this.nftList) {
        const owner = await this.nft.owner(nft.id);
        nft.network = owner.network;
        filteredList.push(nft);
    }
    this.nftList = filteredList;

    this.setCache();
    this.unfilteredNftList = this.nftList;
    this.cdr.detectChanges();
  }

  async switchToMatic(): Promise<void> {
    await this.wallet.switchToMatic();
  }

  async loadMore(): Promise<void> {
    this.loading = true;
    this.currentOffset = this.currentOffset + this.limit;
    const newNfts = await this.market.getLastSales(this.limit, this.currentOffset);
    if (newNfts.total < (this.limit + this.currentOffset)) {
      this.endReached = true;
    }
    this.nftList = [...this.nftList, ...newNfts.sales];
    if (this.typeFilter !== 'ALL') {
      this.changeFilter(this.typeFilter);
    } else {
      this.nftList = this.unfilteredNftList;
    }
    this.setCache();
    this.loading = false;
  }
  
  changeFilterModel(): void {
  }

  changeFilter(typeFilter): void {
    this.loading = true;
    setTimeout(async () => {
        this.typeFilter = typeFilter;

        switch (this.typeFilter) {
            case 'PRICE_UP':
                this.nftList.sort((a, b) => (a.price > b.price) ? 1 : -1);
            break;
            case 'PRICE_DOWN':
                this.nftList.sort((a, b) => (a.price > b.price) ? -1 : 1);
            break;
            case 'DATE_ENDING_UP':
                this.nftList.sort((a, b) => (a.endDate > b.endDate) ? 1 : -1);
            break;
            case 'DATE_ENDING_DOWN':
                this.nftList.sort((a, b) => (a.endDate > b.endDate) ? -1 : 1);
            break;
            case 'ETHEREUM':
                this.nftList = this.unfilteredNftList.filter((a, b) => (a.network == 'ETHEREUM' || a.network == 'ETH'));
            break;
            case 'MATIC':
                this.nftList = this.unfilteredNftList.filter((a, b) => (a.network == 'MATIC'));
            break;
            default:
                this.nftList = this.unfilteredNftList; 
            break;
        }

        if (this.nftList.length === 0 && !this.endReached) {
          this.loadMore();
        }
        this.loading = false;
    }, 200);
  }

  private setCache(): void {
    ExplorerComponent.nftListCached = this.nftList;
    ExplorerComponent.lastOffset = this.currentOffset;
    const date = new Date();
    date.setMinutes( date.getMinutes() + 30 );
    ExplorerComponent.cacheUntil = date;
  }
}
