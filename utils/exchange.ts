export const getExchangeRate = async (currency: string) => {
  if (currency === "USD") return 1;

  const response = await fetch(
    `https://api.frankfurter.dev/v2/rate/USD/${currency}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate");
  }

  const data = await response.json();

 return data.rate
};