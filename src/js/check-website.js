// Este script não precisa de 'node-fetch' se você usa Node.js 18+ (o workflow usará Node 20)
// e o 'fetch' global já está disponível.

const SITE_URL = process.env.SITE_URL; // A URL do site no ar será passada via variável de ambiente do GitHub Actions
const PATHS_TO_CHECK = [
    '/',         // A página principal do seu site
    '/index.html', // Comum para GitHub Pages, mesmo para SPAs
    // Adicione outros caminhos específicos do seu site que você quer verificar,
    // por exemplo: '/about.html', '/products.html', etc.
    // Se seu site é um SPA (Single Page Application) e usa roteamento client-side,
    // verificar apenas a '/' pode ser suficiente, a menos que você tenha páginas estáticas específicas.
];

async function checkWebsite() {
    if (!SITE_URL) {
        console.error('Erro: A variável de ambiente SITE_URL não está definida!');
        process.exit(1);
    }

    console.log(`Iniciando verificação do site: ${SITE_URL}`);
    let allGood = true;

    for (const path of PATHS_TO_CHECK) {
        const url = `${SITE_URL}${path}`;
        try {
            console.log(`Verificando ${url}...`);
            const response = await fetch(url); // Usando o 'fetch' global do Node.js

            if (response.ok) { // 'response.ok' é true para status HTTP 200-299
                console.log(`✅ SUCESSO: ${url} respondeu com status ${response.status}`);
            } else {
                console.error(`❌ ERRO: ${url} respondeu com status ${response.status}`);
                allGood = false;
            }
        } catch (error) {
            console.error(`❌ ERRO FATAL ao acessar ${url}: ${error.message}`);
            allGood = false;
        }
    }

    if (allGood) {
        console.log('🎉 Todas as URLs verificadas responderam com sucesso!');
        process.exit(0); // Indica sucesso para o GitHub Actions
    } else {
        console.error('🔥 Algumas URLs falharam na verificação. Por favor, investigue!');
        process.exit(1); // Indica falha para o GitHub Actions
    }
}

checkWebsite();