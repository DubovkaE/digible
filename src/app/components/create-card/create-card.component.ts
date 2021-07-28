import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { Network } from '../../types/network.enum';
import Web3 from 'web3';
import { environment } from 'src/environments/environment';
import { TokensService } from 'src/app/services/tokens.service';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { OffchainService } from '../../services/offchain.service';
import { NftService } from '../../services/nft.service';
import { Router } from '@angular/router';
import {Receipt} from '../../types/mint.types';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss'],
})
export class CreateCardComponent implements OnInit {
  showSwitchToEth = false;
  ipfsHash;
  ipfsUri;
  isVideo;

  ipfsHashBack;
  ipfsUriBack;
  isVideoBack;

  walletReceiver;
  walletReceiverBack;
  cardName;
  physical;
  cardPublisher;
  cardEdition;
  cardYear;
  cardGraded;
  cardPopulation;
  tokenId;

  loading = false;

  constructor(
    private readonly wallet: WalletService,
    private readonly cdr: ChangeDetectorRef,
    private readonly offchain: OffchainService,
    private readonly nft: NftService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.checkNetwork();
    if (window.ethereum) {
      window.ethereum.on('networkChanged', () => {
        this.checkNetwork();
      });
    }
  }

  async create(): Promise<void> {
    this.loading = true;
    try {
      const result: Receipt = await this.nft.mint(
        this.walletReceiver,
        this.cardName,
        this.ipfsHash,
        this.physical
      );

      const fullDescription = JSON.stringify({
        publisher: '',
        edition: '',
        year: '',
        graded: '',
        population: '',
        description: '',
        backCardImage: this.ipfsUriBack || ''
      });

      if (result.events && result.events.Transfer && result.events.Transfer.returnValues && result.events.Transfer.returnValues['2']) {
        this.tokenId = result.events.Transfer.returnValues['2'];
      }

      if (this.tokenId) {
        await this.offchain.addDescrption(
          await this.sign(fullDescription),
          fullDescription,
          this.tokenId
        );
      }

      await this.router.navigate(['/profile/' + this.walletReceiver]);
    } catch (e) {}
    this.loading = false;
  }

  async dropped(files: NgxFileDropEntry[]): Promise<void> {
    if (files.length === 0) {
      return;
    }
    const droppedFile = files[0];
    const droppedFileBack = files[1];
    if (droppedFile.fileEntry.isFile) {
      const signature = await this.sign();
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

      fileEntry.file(async (file: File) => {
        this.loading = true;
        try {
         const ipfs = await this.offchain.uploadFile(
           signature,
           file,
           droppedFile.relativePath
         );

         this.ipfsHash = ipfs.hash;
         this.isVideo = await this.offchain.isVideo(ipfs.uri);
         this.ipfsUri = ipfs.uri;
         this.walletReceiver = await this.wallet.getAccount();
        } catch (e) {}

        this.loading = false;
      });

      if (droppedFileBack.fileEntry.isFile) {
        const fileEntry2 = droppedFileBack.fileEntry as FileSystemFileEntry;
        fileEntry2.file(async (file: File) => {
          this.loading = true;
          try {

          const ipfs2 = await this.offchain.uploadFile(
            signature,
            file,
            droppedFileBack.relativePath
          );

          this.ipfsHashBack = ipfs2.hash;
          this.isVideoBack = await this.offchain.isVideo(ipfs2.uri);
          this.ipfsUriBack = ipfs2.uri;

          } catch (e) {}

          this.loading = false;
        });
      }
    }

  }

  async sign(message = ''): Promise<string> {
    return await this.wallet.signMessage(message || 'Digible');
  }

  async checkNetwork(): Promise<void> {
    const network = await this.wallet.getNetwork();
    if (network !== Network.ETH) {
      this.showSwitchToEth = true;
    } else {
      this.showSwitchToEth = false;
    }
    this.cdr.detectChanges();
  }
}
