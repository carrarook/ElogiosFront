// --- Interatividade (O JavaScript "Mágico") ---

// IMPORTANTE: Altere esta URL para o endereço da sua API!
const API_URL = "https://elogio-api-294345468765.us-central1.run.app"; // Verifique a porta no seu projeto .NET

// Pegando os elementos da página que vamos manipular
const container = document.getElementById('container-principal');
const elogioTextoElement = document.getElementById('elogio-texto');
const elogioFotoElement = document.getElementById('elogio-foto');
const gerarBotao = document.getElementById('btn-gerar');

// Função principal para buscar os dados na nossa API
async function gerarNovoElogio() {
    // Ativa o estado de "carregando"
    gerarBotao.disabled = true;
    gerarBotao.textContent = 'Gerando... รอ';
    container.classList.add('loading');

    try {
        // Inicia as duas chamadas à API em paralelo para ser mais rápido
        const promiseElogio = fetch(`${API_URL}/api/Elogio/elogio`);
        const promiseFoto = fetch(`${API_URL}/api/Elogio/foto`);

        // Espera as duas promessas terminarem
        const [respostaElogio, respostaFoto] = await Promise.all([promiseElogio, promiseFoto]);

        // --- Processa a resposta do elogio ---
        if (!respostaElogio.ok) {
            throw new Error(`Falha ao buscar o elogio (Status: ${respostaElogio.status})`);
        }
        const dadosElogio = await respostaElogio.json();
        elogioTextoElement.textContent = dadosElogio.texto;

        // --- Processa a resposta da foto ---
        if (!respostaFoto.ok) {
            throw new Error(`Falha ao buscar a foto (Status: ${respostaFoto.status})`);
        }
        // Converte a resposta da imagem para um formato que o <img> entende
        const blobDaFoto = await respostaFoto.blob();
        const urlDaFoto = URL.createObjectURL(blobDaFoto);

        // Antes de atribuir a nova URL, revogamos a antiga para liberar memória
        if (elogioFotoElement.src) {
            URL.revokeObjectURL(elogioFotoElement.src);
        }
        elogioFotoElement.src = urlDaFoto;

    } catch (error) {
        console.error("Ocorreu um erro:", error);
        elogioTextoElement.textContent = 'Ops, algo deu errado! Verifique o console (F12) para mais detalhes.';
    } finally {
        // Desativa o estado de "carregando", independentemente de sucesso ou erro
        gerarBotao.disabled = false;
        gerarBotao.textContent = 'Gerar Novo ✨';
        container.classList.remove('loading');
    }
}

// Adiciona o "ouvinte" de evento para o clique no botão
gerarBotao.addEventListener('click', gerarNovoElogio);

// Gera o primeiro elogio assim que a página carrega
document.addEventListener('DOMContentLoaded', gerarNovoElogio);