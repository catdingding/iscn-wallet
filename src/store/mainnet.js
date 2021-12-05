export default {
  chainId: "likecoin-mainnet-2",
  chainName: "LikeCoin chain",
  rpc: "https://mainnet-node.like.co/rpc/",
  rest: "https://mainnet-node.like.co",
  stakeCurrency: {
    coinDenom: "LIKE",
    coinMinimalDenom: "nanolike",
    coinDecimals: 9,
    coinGeckoId: "likecoin",
  },
  walletUrlForStaking: "https://stake.like.co",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "cosmos",
    bech32PrefixAccPub: "cosmospub",
    bech32PrefixValAddr: "cosmosvaloper",
    bech32PrefixValPub: "cosmosvaloperpub",
    bech32PrefixConsAddr: "cosmosvalcons",
    bech32PrefixConsPub: "cosmosvalconspub",
  },
  currencies: [
    {
      coinDenom: "LIKE",
      coinMinimalDenom: "nanolike",
      coinDecimals: 9,
      coinGeckoId: "likecoin",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "LIKE",
      coinMinimalDenom: "nanolike",
      coinDecimals: 9,
      coinGeckoId: "likecoin",
    },
  ],
  coinType: 118,
  gasPriceStep: {
    low: 0.01,
    average: 10,
    high: 1000,
  },
  features: ["stargate", "ibc-transfer"],
};
