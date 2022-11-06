// import fetch from "node-fetch";
import qs from "querystring";

export const getCallData = async (sellAddress, buyAddress, amount) => {
  const params = {
    sellToken: sellAddress,
    buyToken: buyAddress,
    sellAmount: amount.toString(),
  };

  const response = await fetch(
    `https://polygon.api.0x.org/swap/v1/quote?${qs.stringify(params)}`
  );

  const { data } = await response.json();

  return data;
};
