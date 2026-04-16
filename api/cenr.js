// Vercel serverless proxy — fetches config.zscaler.com/zscaler.net/cenr
// server-side so the browser never makes a cross-origin request.
// Uses the built-in https module (works on Node 14/16/18/20).

const https = require('https');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const options = {
    hostname: 'config.zscaler.com',
    path: '/zscaler.net/cenr',
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (compatible; zia-subcloud-tool/1.0)'
    }
  };

  const upstream = https.request(options, (proxyRes) => {
    // Follow a single redirect if needed
    if (proxyRes.statusCode >= 301 && proxyRes.statusCode <= 302 && proxyRes.headers.location) {
      return res.status(502).json({ error: `Redirect to ${proxyRes.headers.location} — update proxy URL` });
    }

    if (proxyRes.statusCode !== 200) {
      return res.status(502).json({ error: `Upstream returned HTTP ${proxyRes.statusCode}` });
    }

    let body = '';
    proxyRes.setEncoding('utf8');
    proxyRes.on('data', chunk => { body += chunk; });
    proxyRes.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.status(200).json(data);
      } catch (e) {
        res.status(502).json({ error: 'Upstream returned non-JSON', preview: body.slice(0, 300) });
      }
    });
  });

  upstream.on('error', (err) => {
    res.status(502).json({ error: err.message, code: err.code });
  });

  upstream.setTimeout(10000, () => {
    upstream.destroy();
    res.status(504).json({ error: 'Upstream timed out after 10s' });
  });

  upstream.end();
};
