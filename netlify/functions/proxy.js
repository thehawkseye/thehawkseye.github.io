const https = require('https');

exports.handler = async function (event) {
    const targetUrl = event.queryStringParameters.url;

    if (!targetUrl) {
        return { statusCode: 400, body: 'Missing url parameter' };
    }

    function fetchUrl(url, redirects = 5) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location && redirects > 0) {
                    return resolve(fetchUrl(res.headers.location, redirects - 1));
                }
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({
                    statusCode: 200,
                    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                    body: data
                }));
            }).on('error', reject);
        });
    }

    try { return await fetchUrl(targetUrl); }
    catch (err) { return { statusCode: 500, body: err.message }; }
};