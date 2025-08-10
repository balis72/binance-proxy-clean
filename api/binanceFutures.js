export default async function handler(req, res) {
  try {
    const { endpoint, ...params } = req.query;
    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    // Sukuriam URL su parametrais
    const urlParams = new URLSearchParams(params).toString();
    const url = `https://fapi.binance.com/${endpoint}${urlParams ? `?${urlParams}` : ''}`;

    // Fetch su JSON apsauga
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Binance API error: ${response.statusText}` });
    }

    // Paimam kaip tekstą, kad išvengtume "Unexpected end of JSON input"
    const textData = await response.text();
    let jsonData;
    try {
      jsonData = JSON.parse(textData);
    } catch (e) {
      return res.status(500).json({ error: 'Invalid JSON returned from Binance', details: e.message });
    }

    return res.status(200).json(jsonData);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch from Binance Futures API', details: error.message });
  }
}
