import { LoadingDefaultFavicon } from '../images';

const hotdropsVar = import.meta.env.VITE_TESTNET;

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface SeoInformation {
  title: string;
  ogTitle: string;
  twitterTitle: string;
  contentName: string;
  content: string;
  description: string;
  ogDescription: string;
  twitterDescription: string;
  image: string;
  favicon: string;
  faviconMobile: string;
}

const initialStates: { [key: string]: SeoInformation } = {
  hotdrops: {
    title: 'HotDrops Technologies',
    ogTitle: 'HotDrops Technologies',
    twitterTitle: 'HotDrops Technologies',
    contentName: 'author',
    content: 'Digital Ownership Encryption',
    description:
      'HotDrops is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content',
    ogDescription: 'Encrypted, Streaming NFTs',
    twitterDescription: 'Encrypted, Streaming NFTs',
    image: 'https://hotdrops.live/static/media/hotdrops-default.e7c4e7eb.png',
    favicon: LoadingDefaultFavicon,
    faviconMobile: LoadingDefaultFavicon
  },
  rair: {
    title: 'RAIR Technologies',
    ogTitle: 'RAIR Technologies',
    twitterTitle: 'RAIR Technologies',
    contentName: 'author',
    content: 'Digital Ownership Encryption',
    description:
      'RAIR is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content',
    ogDescription: 'Encrypted, Streaming NFTs',
    twitterDescription: 'Encrypted, Streaming NFTs',
    image: `${
      import.meta.env.VITE_IPFS_GATEWAY
    }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`,
    favicon: LoadingDefaultFavicon,
    faviconMobile: LoadingDefaultFavicon
  }
};

const initialState: SeoInformation = {
  ...initialStates[hotdropsVar ? 'hotdrops' : 'rair']
};

export const seoSlice = createSlice({
  name: 'seo',
  initialState,
  reducers: {
    setSEOInfo: (state, action: PayloadAction<SeoInformation | undefined>) => {
      return action.payload || initialStates[hotdropsVar ? 'hotdrops' : 'rair'];
    },
    resetSEOInfo: (state) => {
      Object.keys(state).forEach((key) => {
        state[key] = '';
      });
    }
  }
});

export const { setSEOInfo, resetSEOInfo } = seoSlice.actions;
export default seoSlice.reducer;
