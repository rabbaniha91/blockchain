import { useEffect, useState } from "react";
import { getCryptosInfo } from "../api";
import CryptosInfo from "./CryptosInfo";

const Cryptos = () => {
  const [cryptos, setCryptos] = useState(null);

  useEffect(async () => {
    const response = await getCryptosInfo();

    setCryptos(response.data.data);
  }, []);

  useEffect(() => {
    console.log(cryptos);
  }, [cryptos]);
  return (
    <>
      <div className="cryptos">
        {cryptos?.length > 0 &&
          cryptos?.map((crypto) => (
            <CryptosInfo
              key={crypto?.id}
              name={crypto?.name}
              symbol={crypto?.symbol}
              price={crypto?.price_usd}
              change24h={
                crypto?.percent_change_24h
              }
              change7d={crypto?.percent_change_7d}
            />
          ))}
      </div>
    </>
  );
};

csupply: "19736430.00";
id: "90";
market_cap_usd: "1126678740999.60";
msupply: "21000000";
name: "Bitcoin";
nameid: "bitcoin";
percent_change_1h: "1.19";
percent_change_7d: "-3.78";
percent_change_24h: "-1.05";
price_btc: "1.00";
price_usd: "57086.25";
rank: 1;
symbol: "BTC";
tsupply: "19736430";
volume24: 30840240659.451538;
volume24a: 26866524841.942448;

export default Cryptos;
