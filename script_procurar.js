// script_procurar.js

const formProcurar = document.getElementById('form-procurar');
const resultadosElogiosDiv = document.getElementById('resultados-elogios');
const resultadosFotosDiv = document.getElementById('resultados-fotos');

formProcurar.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dataInicioInput = document.getElementById('data-inicio').value;
    const dataFimInput = document.getElementById('data-fim').value;

    // --- VALIDAÇÃO DO INTERVALO DE 7 DIAS NO FRONTEND ---
    if (dataInicioInput && dataFimInput) {
        const dataInicio = new Date(dataInicioInput);
        const dataFim = new Date(dataFimInput);
        const diffTime = Math.abs(dataFim - dataInicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 7) {
            alert('O intervalo máximo de busca é de 7 dias. Por favor, ajuste as datas.');
            return; // Impede a execução da busca
        }
    }
    // --------------------------------------------------

    resultadosElogiosDiv.innerHTML = '<h3>Frases:</h3><p>Buscando...</p>';
    resultadosFotosDiv.innerHTML = '<h3>Fotos:</h3><p>Buscando...</p>';

    let queryString = `?dataInicio=${dataInicioInput}`;
    if (dataFimInput) {
        queryString += `&dataFim=${dataFimInput}`;
    }

    try {
        // Buscar Elogios
        const resElogios = await fetch(`${API_URL}/api/Elogio/elogios/buscar${queryString}`);
        if (!resElogios.ok) {
            const errorData = await resElogios.json();
            throw new Error(errorData.message || 'Erro ao buscar elogios');
        }
        const elogios = await resElogios.json();
        renderElogios(elogios);

        // Buscar Fotos
        const resFotos = await fetch(`${API_URL}/api/Elogio/fotos/buscar${queryString}`);
        if (!resFotos.ok) {
             const errorData = await resFotos.json();
            throw new Error(errorData.message || 'Erro ao buscar fotos');
        }
        const fotos = await resFotos.json();
        renderFotos(fotos);

    } catch (error) {
        resultadosElogiosDiv.innerHTML = `<h3>Frases:</h3><p class="error-message">${error.message}</p>`;
        resultadosFotosDiv.innerHTML = `<h3>Fotos:</h3><p class="error-message">${error.message}</p>`;
    }
});

function renderElogios(elogios) {
    resultadosElogiosDiv.innerHTML = '<h3>Frases:</h3>';
    if (elogios.length === 0) {
        resultadosElogiosDiv.innerHTML += '<p>Nenhuma frase encontrada para este período.</p>';
        return;
    }
    const lista = document.createElement('ul');
    elogios.forEach(e => {
        const item = document.createElement('li');
        item.textContent = `(ID: ${e.id}) - "${e.texto}"`;
        lista.appendChild(item);
    });
    resultadosElogiosDiv.appendChild(lista);
}

function renderFotos(fotos) {
    resultadosFotosDiv.innerHTML = '<h3>Fotos:</h3>';
    if (fotos.length === 0) {
        resultadosFotosDiv.innerHTML += '<p>Nenhuma foto encontrada para este período.</p>';
        return;
    }
    const grid = document.createElement('div');
    grid.className = 'results-grid';
    fotos.forEach(f => {
        const img = document.createElement('img');
        // Usamos o endpoint que serve a imagem pelo nome
        img.src = `${API_URL}/api/Elogio/foto/by-name/${f.nomeArquivo}`;
        img.title = `ID: ${f.id} | Data: ${new Date(f.dataFoto).toLocaleDateString()}`;
        grid.appendChild(img);
    });
    resultadosFotosDiv.appendChild(grid);
}