export default async function handler(req, res) {
  const symbol = req.query.symbol;

  if (!symbol) {
    return res.status(400).json({ error: "Missing symbol parameter" });
  }

  const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code || data.msg) {
      return res.status(500).json({ error: "Binance error", details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Fetch failed", details: error.message });
  }
}

