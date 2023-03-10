// TODO Give the arrows the functionality of going to the next/prevoius block

import { useRouter } from "next/router";
import { getBlock } from "../../utils/alchemySDK";
import { Utils } from "alchemy-sdk";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import SideBar from "../../components/SideBar";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import TxCard from "../../components/TxCard";
import { getTimeSince } from "../../utils/convertTimeStamp";

export default function BlockNum() {
  // Component
  const BiskitIcon = ({ icon }) => {
    return <div className="biskit-icon">{icon}</div>;
  };
  // Component State and Router Hook
  const router = useRouter();
  const { blockNum } = router.query;
  const [block, setBlock] = useState({});
  const [txLength, setTxLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @dev This useEffect will get a block number from the dynamic route
   * and use it to collect the specific block from Alchemy SDK getBlock method.
   * @notice The variable blockNum would return undefined on first refresh
   * the router.isReady hook was used to wait for blockNum to be populated
   */
  useEffect(() => {
    if (!blockNum) {
      return;
    }
    async function getQueryBlock(_blockNum) {
      const blockInt = parseInt(_blockNum);
      return await getBlock(blockInt);
    }

    async function setTxCount(_block) {
      if (_block.transactions) {
        setTxLength(_block.transactions.length);
      }
    }
    if (router.isReady) {
      getQueryBlock(blockNum).then((res) => {
        setBlock(res);
        setTxCount(res);
        setIsLoading(false);
      });
    }
  }, [blockNum]);

  /**
   * @dev Listen for when the isLoading is true and return loading screen
   */
  if (isLoading) {
    return <div className=" bg-base min-h-screen">Loading....</div>;
  }
  return (
    <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-base  ">
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      {/* Header */}
      <Header />

      {/* Holding Container */}
      <div className="h-full ml-14 mt-14 mb-10 md:ml-64">
        {/* SideBar */}
        <SideBar />

        {/* Block Details */}
        <div className="h-full mx-8 mt-14 mb-10 md:mx-8 bg-drkgrey rounded-lg p-3">
          <div className="flex justify-between">
            <div className="text-lg text-primary font-bold p-3">
              Block Details
            </div>
            <div className="flex text-primary">
              <BiskitIcon icon={<ArrowLeftIcon />} />
              <div>{block.number}</div>
              <BiskitIcon icon={<ArrowRightIcon />} />
            </div>
          </div>

          <dl className="mb-3 text-[12px] flex">
            <dt className="p-3 text-base2">Block Height</dt>
            <dd className="p-3 text-primary">{block.number}</dd>
          </dl>

          <dl className="mb-3 text-[12px] flex">
            <dt className="p-3 text-base2">Timestamp</dt>
            <dd className="p-3 text-primary">
              {getTimeSince(block.timestamp)}
            </dd>
          </dl>

          <dl className="mb-3 text-[12px] flex">
            <dt className="p-3 text-base2">Transactions</dt>
            <dd className="p-3 text-primary">{txLength} Transactions</dd>
          </dl>

          <dl className="mb-3 text-[12px] flex">
            <dt className="p-3 text-base2">Miner</dt>
            <dd className="p-3 text-primary">{block.miner}</dd>
          </dl>

          <dl className="mb-3 text-[12px] flex">
            <dt className="p-3 text-base2">Hash</dt>
            <dd className="p-3 text-primary">{block.hash}</dd>
          </dl>

          <dl className="mb-3 text-[12px] flex">
            <dt className="p-3 text-base2">Difficulty</dt>
            <dd className="p-3 text-primary">{block.difficulty}</dd>
          </dl>

          <dl className="mb-3 text-[12px] flex">
            <dt className="p-3 text-base2">Gas Used</dt>
            <dd className="p-3 text-primary">
              {Utils.formatEther(block.gasUsed)} ETH (
              {Utils.formatUnits(block.gasUsed, "gwei")} Gwei)
            </dd>
          </dl>

          <dl className="mb-3 text-[12px] flex">
            <dt className="p-3 text-base2">Parent Block</dt>
            <dd className="p-3 text-primary">{block.parentHash}</dd>
          </dl>
        </div>

        <div className="h-full mx-4 mt-3 mb-10 md:mx-8 bg-base2 rounded-lg p-2">
          <div className="w-full bg-mdgrey rounded-md p-4 flex  justify-between">
            <h1 className="text-3xl font-bold text-primary">Transactions</h1>
            <div className="flex text-primary space-x-2 items-center justify-center">
              <BiskitIcon icon={<ArrowLeftIcon />} />
              <div>Page 1</div>
              <BiskitIcon icon={<ArrowRightIcon />} />
            </div>
          </div>
          <TxCard />
          <TxCard />
          <TxCard />
          <TxCard />
          <TxCard />
          <TxCard />
        </div>
      </div>
    </div>
  );
}
