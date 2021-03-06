import {Injectable} from '@angular/core';
import {Profile} from '../types/profile.type';
import {OffchainService} from '../services/offchain.service';
import {environment} from 'src/environments/environment';

@Injectable()
export class VerifiedWalletsService {
  public readonly verifiedProfiles = {
    '0x461A66090E15bc417fB0c75981eB6113b5E72CE4': {
      username: 'Digible',
      twitter: 'digibleio',
      border: 'Digible'
    },
    '0x0CddA72F5E42C43E82f86E9F2F2CE0c59A498473': {
      username: 'SteveAoki',
      twitter: 'steveaoki',
      twitch: 'steveaoki',
      instagram: 'steveaoki',
      border: 'Aoki\'s Card House',
      website: 'https://www.aokiscardbreaks.com/',
      description: 'The Ultimate Aoki cardhouse collection.',
      imageUrl: '/assets/images/collection_heros/aoki-hero.jpeg',
      collectionAvatar: '/assets/images/seller_avatars/aoki-icon.jpeg',
    },
    '0xe176A3B77DA8a0a463D7d77715f11446F7c75F31': {
      username: '_SystemLabs',
      twitter: 'wearesystemlabs',
      instagram: '_systemLabs',
      border: 'The _SystemLabs Collection',
      email: 'info@systemlabs.io',
      website: 'https://systemlabs.io/',
      description: 'The Ultimate _SystemLabs NFT collection.',
      imageUrl: '/assets/images/collection_heros/sl-hero.jpg',
      collectionAvatar: '/assets/images/seller_avatars/sl-icon.png',
    },
    '0x2e8e67e67a138e1D1aA24857A0242b788ca388ac': {
      username: 'The El Sputnik Collection',
      border: 'The El Sputnik Collection',
      description: 'The El Sputnik Collection',
      imageUrl: '/assets/images/home/home-1.jpeg',
    },
    '0x341C42B0DE10FBDD60b10a0AbcD6C3565D736838': {
      username: 'DIGIZARD',
      border: 'DIGIZARD',
      description: 'The DIGIZARD Collection',
      imageUrl: '/assets/images/home/home-1.jpeg',
    },
    '0x828Baa8802CdC76Bee4904cF5E063f587185D564': {
      username: 'Testnet - Digible',
      twitter: 'digibleio',
      border: 'Testnet - Digible',
      description: 'The Testnet - Digible Collection',
      website: 'https://systemlabs.io/',
      imageUrl: '/assets/images/logo-link.png',
      collectionAvatar: '/assets/images/seller_avatars/logo-link.png',
    },
    '0x5e1320Aa48eB7C927A9386f6B194bF57de149645': {
      username: 'Testnet - Escrow - Digible',
      twitter: 'digibleio',
      description: 'The Testnet - Escrow - Digible - Digible Collection',
      imageUrl: '/assets/images/home/home-1.jpeg',
    },

    '0xa1c80b8ea2ce44b889f48dbfa166597434f33904': {
      username: 'Escrow - Digible',
      twitter: 'digibleio'
    },
    '0xf0EDE1a2FD711d6333C5d9a0525DBb12d25c6584': {
      username: 'defiTrophy.com Collection',
      twitter: 'defitrophy',
      border: 'defiTrophy'

    },
    '0x8Ef6857fb72A8726Ab1eccC1E9296F079a465Ca4': {
      username: 'Migaladari',
      twitter: 'migaladari',
      instagram: 'marwangaladari',
      twitch: 'wontontm'

    },
      '0xd7f7d732BD74efA1C39FeC5FDF28167cd14970fE': {
      username: 'Sunny6e',
      instagram: 'Sunny6e'

    },
      '0x984A2a68B6Fd544588Cb358e6C035079bad96258': {
      username: 'QnVegas',
      twitter: 'qnvegas',
      twitch: 'qnvegas'

    },
    '0xEC89BbFf7f763bCbCd03841EA2d0aCdffbCBa274': {
      username: 'Dubovka',
      twitter: 'Dubovkas',
      instagram: 'Dubovka'
  },
  '0x6dbdf9d84dE1d016c1598c3291278eD3aE7e569a': {
    username: 'Roboskillz',
    email: 'r.hudson89@gmail.com',
    twitter: 'roboskillz',
    tiktok: 'roboskillz',
    instagram: 'roboskillz',
  },
  '0xb4E1cf1b4C163f954cFAdb084ce51065213b9d33': {
    username: 'Crypt0Wizard',
    email: 'daniel.m@digible.io',
  }

};

  private inverseVerifiedProfiles = {};

  constructor(public offchain: OffchainService) {
    this.inverseVerifiedProfiles = Object.assign(
      {},
      ...Object.entries(this.verifiedProfiles).map(([a, b]) => ({
        [b.username]: a,
      }))
    );
  }

  getVerifiedProfile(name: string): string | undefined {
    return this.inverseVerifiedProfiles[name];
  }

  getVerifiedName(address: string): string | undefined {
    return this.verifiedProfiles[address]
      ? this.verifiedProfiles[address].username
      : undefined;
  }

  getFullProfileOld(address: string): Profile | undefined {
    return this.verifiedProfiles[address]
      ? this.verifiedProfiles[address]
      : undefined;
  }

  async getFullProfile(address: string){
    let data = await this.getProfileData(address);
    if (data['status'] != 'success') {
        return undefined;
    } else {
        return data;
    }
  }

  async getProfileData(address: string) {
    const request = new Request(environment.offchainApi+`/profile/`+address,
    {
        method: "GET"
    });
    var data = await fetch(request).then( response => response.json()
    );
    return data;
  }

  async updProfileData(address: string, profileImage: string) {
    const ipfs = await this.offchain.updProfile(address, profileImage);
    return ipfs['status'] == 'success';
  }

  getCustomBorder(address: string): string | undefined {
    return this.verifiedProfiles[address]
      ? this.verifiedProfiles[address].border
      : undefined;
  }
}
