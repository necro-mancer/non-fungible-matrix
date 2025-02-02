import React, { useState } from 'react';
import {
  Row,
  Col,
  Divider,
  Layout,
  Tag,
  Button,
  Skeleton,
  List,
  Card,
} from 'antd';
import { useParams } from 'react-router-dom';
import { useArt, useAccount, useExtendedArt } from '../../hooks';
// import { useArt, useExtendedArt } from '../../hooks';
import { ArtContent } from '../../components/ArtContent';
import { shortenAddress, useConnection } from '@oyster/common';
import { AccountInfo } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { MetaAvatar } from '../../components/MetaAvatar';
import { sendSignMetadata } from '../../actions/sendSignMetadata';
import { ViewOn } from '../../components/ViewOn';
import { ArtType } from '../../types';
import { ArtMinting } from '../../components/ArtMinting';

const { Content } = Layout;

export const ArtView = () => {
  const { id } = useParams<{ id: string }>();
  const wallet = useWallet();
  const [remountArtMinting, setRemountArtMinting] = useState(0);
  const connection = useConnection();
  const art = useArt(id);
  const account = useAccount(id);
  
  let badge = '';
  if (art.type === ArtType.NFT) {
    badge = 'Unique';
  } else if (art.type === ArtType.Master) {
    badge = 'Genesis';
  } else if (art.type === ArtType.Print) {
    badge = `${art.edition} of ${art.supply}`;
  }
  const { ref, data } = useExtendedArt(id);

  // const { userAccounts } = useUserAccounts();
  // const accountByMint = userAccounts.reduce((prev, acc) => {
  //   prev.set(acc.info.mint.toBase58(), acc);
  //   return prev;
  // }, new Map<string, TokenAccount>());

  const description = data?.description;
  const attributes = data?.attributes;
  
  const pubkey = wallet?.publicKey?.toBase58() || '';
  const numCreators = art?.creators?.length || '';
  
  const whoOwn = account || 'unknown';
  
  const tag = (
    <div className="info-header">
      <Tag color="blue">UNVERIFIED</Tag>
    </div>
  );

  const unverified = (
    <>
      {tag}
      <div style={{ fontSize: 12 }}>
        <i>
          This artwork is still missing verification from{' '}
          {art.creators?.filter(c => !c.verified).length} contributors before it
          can be considered verified and sellable on the platform.
        </i>
      </div>
      <br />
    </>
  );

  return (
    <Content>
      <Col>
        <Row ref={ref}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} style={{ marginTop: 40, padding: '30px' }}>
            <ArtContent
              style={{ width: '450px', height: '300px', margin: '0 auto' }}
              height={300}
              width={450}
              className="artwork-image"
              pubkey={id}
              active={true}
              allowMeshRender={true}
            />
          </Col>
          {/* <Divider /> */}
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            style={{ textAlign: 'left', fontSize: '1.4rem' }}
          >
            <Row>
              <div style={{ marginTop: 30, fontWeight: 500, fontSize: '3rem' }}>
                {art.title || <Skeleton paragraph={{ rows: 0 }} />}
              </div>
            </Row>
            <Row>
              <Col span={6}>
                <h6 style={{ marginTop: 10 }}>ROYALTIES</h6>
                <div className="royalties">
                  {((art.seller_fee_basis_points || 0) / 100).toFixed(2)}%
                </div>
              </Col>
              <Col span={12}>
                <ViewOn id={id} />
              </Col>
            </Row>
            <Row>
              <Col>
                <h6 style={{ marginTop: 15, marginBottom: 10 }}>CREATOR</h6>
                <div className="creators">
                  {(art.creators || []).map((creator, idx) => {
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: 10,
                          marginRight: 10,
                        }}
                      >
                        <MetaAvatar creators={[creator]} size={32} />
                        <div className="art-edition">&nbsp;necromancer</div>
                        <div>
                          <div style={{ marginLeft: 10 }}>
                            {!creator.verified &&
                              (creator.address === pubkey ? (
                                <Button
                                  onClick={async () => {
                                    try {
                                      await sendSignMetadata(
                                        connection,
                                        wallet,
                                        id,
                                      );
                                    } catch (e) {
                                      console.error(e);
                                      return false;
                                    }
                                    return true;
                                  }}
                                >
                                  Verify
                                </Button>
                              ) : (
                                tag
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <h6 style={{ marginTop: 15, marginBottom: -1 }}>Minted on</h6>
                <div className="art-edition">{
                    whoOwn
                }</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <h6 style={{ marginTop: 10, marginBottom: -1 }}>Edition</h6>
                <div className="art-edition">{badge}</div>
              </Col>
            </Row>

            {/* <Button
                  onClick={async () => {
                    if(!art.mint) {
                      return;
                    }
                    const mint = new PublicKey(art.mint);

                    const account = accountByMint.get(art.mint);
                    if(!account) {
                      return;
                    }

                    const owner = wallet.publicKey;

                    if(!owner) {
                      return;
                    }
                    const instructions: any[] = [];
                    await updateMetadata(undefined, undefined, true, mint, owner, instructions)

                    sendTransaction(connection, wallet, instructions, [], true);
                  }}
                >
                  Mark as Sold
                </Button> */}
            <br />
            {/* TODO: Add conversion of MasterEditionV1 to MasterEditionV2 */}
            <ArtMinting
              id={id}
              key={remountArtMinting}
              onMint={async () => await setRemountArtMinting(prev => prev + 1)}
            />
          </Col>
          <Col span="12">
            <Divider />
            {art.creators?.find(c => !c.verified) && unverified}
            <div className="info-header">ABOUT THE CREATION</div>
            <div className="info-content">{description}</div>
            
            {/*
              TODO: add info about artist


            <div className="info-header">ABOUT THE CREATOR</div>
            <div className="info-content">{art.about}</div> */}
          </Col>
          <Col span="9" offset="2">
            {attributes && (
              <>
                <Divider />
                <div className="info-header">Attributes</div>
                <List size="small" grid={{ column: 4 }}>
                  {attributes.map((attribute, idx) => (
                    <List.Item key={idx}>
                      <Card type="inner" title={attribute.trait_type}>
                        {attribute.value}
                      </Card>
                    </List.Item>
                  ))}
                </List>
              </>
            )}
          </Col>
        </Row>
      </Col>
    </Content>
  );
};
