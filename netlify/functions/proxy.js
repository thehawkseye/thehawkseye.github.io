const https = require('https');

exports.handler = async function (event) {
    const targetUrl = event.queryStringParameters.url;

    if (!targetUrl) {
        return { statusCode: 400, body: 'Missing url parameter' };
    }

    return new Promise((resolve) => {
        https.get(targetUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: data
                });
            });
        }).on('error', (err) => {
            resolve({ statusCode: 500, body: err.message });
        });
    });
};