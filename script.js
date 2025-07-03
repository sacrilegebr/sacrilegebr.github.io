document.getElementById('simulateButton').addEventListener('click', function() {
    const fileInput = document.getElementById('configFile');
    const testCount = document.getElementById('testCount').value;

    if (!fileInput.files.length || !testCount) {
        alert('Por favor, faça upload do arquivo de configuração e defina a quantidade de testes.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const config = JSON.parse(event.target.result);
        simulateGacha(config, testCount);
    };

    reader.readAsText(file);
});

function simulateGacha(config, testCount) {
    const results = {};
    const totalTests = parseInt(testCount);

    for (let i = 0; i < totalTests; i++) {
        const randomValue = Math.random();
        let cumulativeProbability = 0;

        for (const item of config.rewards) {
            cumulativeProbability += item.chance;
            if (randomValue < cumulativeProbability) {
                results[item.name] = (results[item.name] || 0) + 1;
                break;
            }
        }
    }

    displayResults(results);
}

function displayResults(results) {
    const summary = document.getElementById('summary');
    summary.innerHTML = '';

    for (const [item, count] of Object.entries(results)) {
        summary.innerHTML += `<p>Você obteve ${count} vezes a recompensa ${item}</p>`;
    }

    // Aqui você pode adicionar a lógica para gerar gráficos com Chart.js
}
