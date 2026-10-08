const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ url, statusCode: res.statusCode, headers: res.headers });
    });
    req.on('error', (err) => resolve({ url, error: err.message }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url, error: 'TIMEOUT' });
    });
    req.end();
  });
}

async function run() {
  const urls = [
    'https://media.ouedkniss.com/photos/58058031/1.jpg',
    'https://media.ouedkniss.com/58058031/1.jpg',
    'https://media.ouedkniss.com/photos/57812904/1.jpg',
    'https://cdn.ouedkniss.com/photos/57812904/1.jpg'
  ];
  for (const u of urls) {
    const res = await testUrl(u);
    console.log(res);
  }
}

run();
