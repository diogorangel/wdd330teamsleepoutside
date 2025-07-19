// src/services/externalApi.js

const https = require('https');

/**
 * Faz uma requisição GET para uma API externa usando TLS 1.2.
 * @param {string} hostname O hostname da API (ex: 'api.example.com').
 * @param {string} path O caminho da requisição (ex: '/data').
 * @returns {Promise<string>} Uma Promise que resolve com os dados da resposta.
 */
async function fetchDataFromExternalApi(hostname, path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: hostname,
            port: 443,
            path: path,
            method: 'GET',
            // Especificando TLS 1.2
            secureProtocol: 'TLSv1_2_method'
        };

        const req = https.request(options, (res) => {
            let data = '';

            console.log(`Status Code para ${hostname}${path}:`, res.statusCode);

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`Falha na requisição: ${res.statusCode} - ${data}`));
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Erro na requisição para ${hostname}${path}:`, e.message);
            reject(e);
        });

        req.end();
    });
}

module.exports = {
    fetchDataFromExternalApi
};