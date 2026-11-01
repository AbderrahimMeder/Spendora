
export const getExchangeRate = async (currency: string): Promise<number> => {
  if (currency === "USD") return 1;

  const response = await fetch(
    `https://api.frankfurter.dev/v2/rate/USD/${currency}`
  );

  if (!response.ok) {
    throw new Error(
      `Exchange rate API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (typeof data.rate !== "number") {
    throw new Error("Invalid exchange rate returned by API");
  }

  return data.rate;
};
