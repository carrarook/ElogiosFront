const container = document.getElementById('container-principal');
const elogioTextoElement = document.getElementById('elogio-texto');
const elogioFotoElement = document.getElementById('elogio-foto');
const gerarBotao = document.getElementById('btn-gerar');

async function gerarNovoElogio() {
    gerarBotao.disabled = true;
    gerarBotao.textContent = 'Gerando... รอ';
    container.classList.add('loading');
    try {
        const promiseElogio = fetch(`${API_URL}/api/Elogio/elogio`);
        const promiseFoto = fetch(`${API_URL}/api/Elogio/foto`);
        const [respostaElogio, respostaFoto] = await Promise.all([promiseElogio, promiseFoto]);

        if (!respostaElogio.ok) throw new Error(`Falha ao buscar o elogio (Status: ${respostaElogio.status})`);
        const dadosElogio = await respostaElogio.json();
        elogioTextoElement.textContent = dadosElogio.texto;

        if (!respostaFoto.ok) throw new Error(`Falha ao buscar a foto (Status: ${respostaFoto.status})`);
        const blobDaFoto = await respostaFoto.blob();
        const urlDaFoto = URL.createObjectURL(blobDaFoto);
        if (elogioFotoElement.src) {
            URL.revokeObjectURL(elogioFotoElement.src);
        }
        elogioFotoElement.src = urlDaFoto;
    } catch (error) {
        console.error("Ocorreu um erro:", error);
        elogioTextoElement.textContent = 'Ops, algo deu errado! Ligue pro Brunin';
    } finally {
        gerarBotao.disabled = false;
        gerarBotao.textContent = 'Gerar Novo ✨';
        container.classList.remove('loading');
    }
}

gerarBotao.addEventListener('click', gerarNovoElogio);
document.addEventListener('DOMContentLoaded', gerarNovoElogio);