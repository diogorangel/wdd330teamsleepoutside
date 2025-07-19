// src/app.js (ou outro arquivo principal)

const { fetchDataFromExternalApi } = require('/services/externalApi');

async function main() {
    try {
        console.log('Tentando buscar dados de example.com...');
        const dataExample = await fetchDataFromExternalApi('example.com', '/');
        console.log('Dados de example.com (TLS 1.2):', dataExample.substring(0, 200) + '...'); // Mostra os primeiros 200 caracteres

        // Exemplo com outro host (se aplicável)
        // console.log('\nTentando buscar dados de anothersite.com...');
        // const dataAnother = await fetchDataFromExternalApi('anothersite.com', '/api/v1/data');
        // console.log('Dados de anothersite.com (TLS 1.2):', dataAnother);

    } catch (error) {
        console.error('Ocorreu um erro ao buscar dados:', error);
    }
}

main();