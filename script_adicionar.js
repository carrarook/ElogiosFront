// Formulário de Frase
const formFrase = document.getElementById('form-add-frase');
const statusFrase = document.getElementById('status-frase');

formFrase.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusFrase.textContent = 'Enviando...';
    const texto = document.getElementById('texto-frase').value;
    const dataElogio = document.getElementById('data-frase').value;

    try {
        const response = await fetch(`${API_URL}/api/Elogio/elogio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto, dataElogio })
        });
        if (!response.ok) throw new Error('Falha ao salvar a frase.');
        statusFrase.textContent = 'Frase salva com sucesso!';
        formFrase.reset();
    } catch (error) {
        statusFrase.textContent = `Erro: ${error.message}`;
    }
});

// Formulário de Foto
const formFoto = document.getElementById('form-add-foto');
const statusFoto = document.getElementById('status-foto');

formFoto.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusFoto.textContent = 'Enviando foto...';

    const formData = new FormData();
    formData.append('arquivo', document.getElementById('arquivo-foto').files[0]);
    formData.append('dataFoto', document.getElementById('data-foto').value);
    const elogioId = document.getElementById('id-link-elogio').value;
    if (elogioId) {
        formData.append('elogioLinkadoId', elogioId);
    }
    
    try {
        const response = await fetch(`${API_URL}/api/Elogio/foto`, {
            method: 'POST',
            body: formData // Para multipart/form-data, não defina o Content-Type
        });
        if (!response.ok) throw new Error('Falha ao salvar a foto.');
        statusFoto.textContent = 'Foto salva com sucesso!';
        formFoto.reset();
    } catch (error) {
        statusFoto.textContent = `Erro: ${error.message}`;
    }
});