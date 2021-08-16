import { Component, OnInit } from '@angular/core';
import { OffchainService } from 'src/app/services/offchain.service';
import { VerifiedWalletsService } from 'src/app/services/verified-wallets.service';

@Component({
  selector: 'app-search',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
})
export class CollectionsComponent implements OnInit {
  searchReady = false;
  currentOffset = 0;
  endReached = false;
  leaders = [];

  readonly limit = 10005;

  constructor(
    private readonly offchain: OffchainService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.currentOffset = 0;
    this.endReached = false;
    this.getCollections();
  }

  getCollections() {
    this.searchReady = false;
    const wallets = new VerifiedWalletsService(this.offchain);
    const walletsArr = wallets.verifiedProfiles;
    const result = Object.keys(walletsArr).map((key) => [walletsArr[key]]);

    setTimeout(async () => {
      for (const col of result) {
        this.leaders.push({
          username: col[0].username,
          twitter: col[0].twitter,
          instagram: col[0].instagram,
          border: col[0].border,
          email: col[0].email,
          website: col[0].website,
          description: col[0].description,
          imageUrl: col[0].imageUrl,
          collectionAvatar: col[0].collectionAvatar,
          link: '/profile/' + col[0].username,
        });
      }
    }, 200);
    this.loading();
  }

  loading() {
    setTimeout(async () => {
      this.searchReady = true;
    }, 1500);
  }
}
