// Vercel serverless function — proxies config.zscaler.com/zscaler.net/cenr
// to avoid browser CORS restrictions. Runs server-side so no CORS applies.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const upstream = await fetch('https://config.zscaler.com/zscaler.net/cenr', {
      headers: { 'Accept': 'application/json' }
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Upstream returned ${upstream.status}` });
    }

    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
}
