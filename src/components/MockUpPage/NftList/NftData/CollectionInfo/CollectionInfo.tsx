import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { formatEther } from 'ethers';

import { BlockItemCollection, CollectionInfoBody } from './CollectionInfoItems';

import {
  TNftItemResponse,
  TTokenData
} from '../../../../../axios.responseTypes';
import { useAppSelector } from '../../../../../hooks/useReduxHooks';
import useServerSettings from '../../../../../hooks/useServerSettings';
import useSwal from '../../../../../hooks/useSwal';
import useWindowDimensions from '../../../../../hooks/useWindowDimensions';
import { defaultHotDrops } from '../../../../../images';
import InputSelect from '../../../../common/InputSelect';
import PurchaseTokenButton from '../../../../common/PurchaseToken';
import { ImageLazy } from '../../../ImageLazy/ImageLazy';
import { TParamsNftItemForCollectionView } from '../../../mockupPage.types';
import { ICollectionInfo } from '../../nftList.types';

import { ModalContentCloseBtn } from './../../../../MockUpPage/utils/button/ShowMoreItems';

import './CollectionInfo.css';

const EasyMintRow = ({
  token,
  tokenData,
  defaultPhoto,
  blockchain,
  contractAddress,
  setPurchaseStatus,
  mintToken
}) => {
  const rSwal = useSwal();
  const hotdropsVar = import.meta.env.VITE_TESTNET;
  const [tokensToMint, setTokensToMint] = useState('1');
  const remainingCopies = token.copies - token.soldCopies;
  const navigate = useNavigate();
  const { getBlockchainData } = useServerSettings();
  return (
    <BlockItemCollection className="block-item-collection">
      <div className="item-name">
        <ImageLazy
          src={
            tokenData && tokenData[0]?.metadata
              ? token?.range[0] && tokenData[token.range[0]]?.metadata.image
              : defaultPhoto
          }
          alt="Created by user"
        />
        <div className="item-name-text">{token.offerName}</div>
      </div>
      <div className="item-availa">
        <p>
          {remainingCopies} / {token.copies}
        </p>
      </div>
      <div className="item-price">
        <img
          alt="Blockchain network"
          src={blockchain && getBlockchainData(blockchain)?.image}
        />
        {formatEther(
          +token.price !== Infinity && token.price !== undefined
            ? token.price.toString()
            : 0
        ).toString()}{' '}
        {blockchain && getBlockchainData(blockchain)?.symbol}
      </div>
      {remainingCopies > 0 ? (
        <>
          {token.sponsored ? (
            <div
              style={{
                width: '88px'
              }}
              className="item-multi-mint"></div>
          ) : (
            <div className="item-multi-mint">
              <InputSelect
                placeholder="Choose Quantity"
                options={[...Array(Math.min(remainingCopies, 30))].map(
                  (_, index) => {
                    return {
                      label: (index + 1).toString(),
                      value: (index + 1).toString()
                    };
                  }
                )}
                getter={tokensToMint}
                setter={setTokensToMint}
              />
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            fontSize: '12px'
          }}>
          No tokens available.
        </div>
      )}
      {mintToken && (
        <div className={`collection-mint-button`}>
          {Number(token.copies - token.soldCopies) === Number(0) ? (
            <button disabled>Buy</button>
          ) : (
            <PurchaseTokenButton
              customButtonClassName={`${
                hotdropsVar === 'true' ? 'hotdrops-bg' : ''
              }`}
              amountOfTokensToPurchase={tokensToMint}
              contractAddress={contractAddress}
              requiredBlockchain={blockchain}
              collection={true}
              offerIndex={[token.offerIndex]}
              buttonLabel="Buy"
              diamond={token.diamond}
              setPurchaseStatus={setPurchaseStatus}
              customSuccessAction={(purchasedTokens) => {
                rSwal
                  .fire(
                    'Success',
                    `Token${tokensToMint !== '1' ? 's' : ''} purchased!`,
                    'success'
                  )
                  .then((result) => {
                    if (result.isConfirmed || result.isDismissed) {
                      navigate(
                        `/tokens/${blockchain}/${contractAddress}/${token?.product || 0}/${purchasedTokens}`
                      );
                    }
                  });
              }}
            />
          )}
        </div>
      )}
    </BlockItemCollection>
  );
};

const CollectionInfo: FC<ICollectionInfo> = ({
  blockchain,
  offerData,
  openTitle,
  mintToken,
  contractAddress,
  setPurchaseStatus,
  closeModal,
  mainBannerInfo
}) => {
  const { primaryColor, isDarkMode } = useAppSelector((store) => store.colors);
  const params = useParams<TParamsNftItemForCollectionView>();
  const [tokenData, setTokenData] = useState<TTokenData[] | null>(null);
  const { width } = useWindowDimensions();

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const defaultPhoto =
    hotdropsVar === 'true'
      ? defaultHotDrops
      : `${
          import.meta.env.VITE_IPFS_GATEWAY
        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`;

  const getTokens = async () => {
    const { data } = await axios.get<TNftItemResponse>(
      `/api/nft/network/${mainBannerInfo ? mainBannerInfo.blockchain : params.blockchain}/${mainBannerInfo ? mainBannerInfo.contract : params.contract}/${mainBannerInfo ? mainBannerInfo.product : params.product}?fromToken=0&toToken=1`
    );

    if (data && data.success) {
      const count = data.totalCount;
      const response = await axios.get<TNftItemResponse>(
        `/api/nft/network/${mainBannerInfo ? mainBannerInfo.blockchain : params.blockchain}/${mainBannerInfo ? mainBannerInfo.contract : params.contract}/${mainBannerInfo ? mainBannerInfo.product : params.product}?fromToken=0&toToken=${count}`
      );

      if (response.data.success) {
        setTokenData(response.data.tokens);
      }
    }
  };

  useEffect(() => {
    getTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`wrapper-collection-info ${mintToken ? 'mint' : ''} ${
        primaryColor === '#dedede' ? 'rhyno' : ''
      }`}>
      {openTitle && <div className="collection-info-head">Collection Info</div>}
      <div className="contianer-collection-info">
        {mintToken && width < 1025 ? (
          <></>
        ) : (
          <div className="collection-info-title">
            <div className="collection-part-text">Item name</div>
            {!mintToken && <div className="collection-part-text">Rank</div>}
            <div className="collection-part-text">Availability</div>
            <div className="collection-part-text">Floor Price</div>
            <div className="collection-part-text">Selection</div>
          </div>
        )}
        <CollectionInfoBody
          isDarkMode={isDarkMode}
          className={`collection-info-body ${mintToken ? 'mint' : ''}`}>
          {closeModal && (
            <div
              style={{
                position: 'fixed'
              }}>
              <ModalContentCloseBtn
                isDarkMode={isDarkMode}
                onClick={closeModal}>
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{ lineHeight: 'inherit' }}
                />
              </ModalContentCloseBtn>
            </div>
          )}
          {offerData &&
            offerData
              ?.sort((a, b) => {
                if (b.offerIndex > a.offerIndex) {
                  return 1;
                }
                return 0;
              })
              .filter(
                (offer) =>
                  offer.offerIndex !== undefined &&
                  offer.hidden !== true &&
                  !offer.sold
              )
              .map((token, index) => {
                return (
                  <EasyMintRow
                    {...{
                      token,
                      tokenData,
                      defaultPhoto,
                      blockchain,
                      contractAddress,
                      setPurchaseStatus,
                      mintToken
                    }}
                    key={index}
                  />
                );
              })}
        </CollectionInfoBody>
      </div>
    </div>
  );
};

export default CollectionInfo;
