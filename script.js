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

document.getElementById('singleRollButton').addEventListener('click', function () {
    const fileInput = document.getElementById('configFile');
    if (!fileInput.files.length) {
        alert('Por favor, envie o arquivo de configuração.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const config = JSON.parse(event.target.result);
        startRoulette(config);
    };

    reader.readAsText(file);
});

const images = {
    "Heatran": "https://archives.bulbagarden.net/media/upload/thumb/6/60/0485Heatran.png/250px-0485Heatran.png",
    "Toxapex": "https://archives.bulbagarden.net/media/upload/thumb/b/bf/0748Toxapex.png/250px-0748Toxapex.png",
    "Excadrill": "https://archives.bulbagarden.net/media/upload/thumb/e/e3/0530Excadrill.png/250px-0530Excadrill.png",
    "Tyranitar": "https://archives.bulbagarden.net/media/upload/thumb/0/09/0248Tyranitar.png/250px-0248Tyranitar.png",
    "Chansey": "https://archives.bulbagarden.net/media/upload/thumb/c/c0/0113Chansey.png/250px-0113Chansey.png",
    "Ferrothorn": "https://archives.bulbagarden.net/media/upload/thumb/b/b1/0598Ferrothorn.png/250px-0598Ferrothorn.png",
    "Bisharp": "https://archives.bulbagarden.net/media/upload/thumb/6/6b/0625Bisharp.png/250px-0625Bisharp.png",
    "Crobat": "https://archives.bulbagarden.net/media/upload/thumb/3/35/0169Crobat.png/250px-0169Crobat.png",
    "Steelix": "https://archives.bulbagarden.net/media/upload/thumb/2/2a/0208Steelix.png/250px-0208Steelix.png",
    "Chandelure": "https://archives.bulbagarden.net/media/upload/thumb/9/97/0609Chandelure.png/250px-0609Chandelure.png",
    "Tentacruel": "https://archives.bulbagarden.net/media/upload/thumb/c/cb/0073Tentacruel.png/250px-0073Tentacruel.png",
    "Gengar": "https://archives.bulbagarden.net/media/upload/thumb/4/47/0094Gengar.png/250px-0094Gengar.png",
    "Arrokuda": "https://archives.bulbagarden.net/media/upload/thumb/1/1f/0846Arrokuda.png/250px-0846Arrokuda.png",
    "Barbaracle": "https://archives.bulbagarden.net/media/upload/thumb/3/36/0689Barbaracle.png/250px-0689Barbaracle.png",
    "Marowak": "https://archives.bulbagarden.net/media/upload/thumb/a/a1/0105Marowak.png/250px-0105Marowak.png"
};

function startRoulette(config) {
    const roulette = document.getElementById('roulette');
    roulette.innerHTML = '';
    const rollItems = [];

    const itemWidth = 120;
    const containerWidth = 600;
    const paddingItems = Math.ceil((containerWidth / 2) / itemWidth); // ex: 3

    // Sorteia o item verdadeiro com base nas chances
    const selectedItem = getRandomItem(config.rewards);
    const baseName = selectedItem.name.match(/[\w]+/g)?.find(word => images[word]) || "Marowak";

    // Padding inicial
    for (let i = 0; i < paddingItems + 10; i++) {
        const randomItem = getRandomItem(config.rewards);
        const name = randomItem.name.match(/[\w]+/g)?.find(word => images[word]) || "Marowak";
        const element = document.createElement('div');
        element.className = 'roulette-item';
        element.innerHTML = `<img src="${images[name]}"><div>${randomItem.name}</div>`;
        roulette.appendChild(element);
    }

    // Item verdadeiro no centro
    const winningElement = document.createElement('div');
    winningElement.className = 'roulette-item';
    winningElement.innerHTML = `<img src="${images[baseName]}"><div>${selectedItem.name}</div>`;
    roulette.appendChild(winningElement);

    // Padding final
    for (let i = 0; i < paddingItems + 10; i++) {
        const randomItem = getRandomItem(config.rewards);
        const name = randomItem.name.match(/[\w]+/g)?.find(word => images[word]) || "Marowak";
        const element = document.createElement('div');
        element.className = 'roulette-item';
        element.innerHTML = `<img src="${images[name]}"><div>${randomItem.name}</div>`;
        roulette.appendChild(element);
    }

// Calcular deslocamento central
const totalBefore = paddingItems + 10; // Total de itens antes do item selecionado
const offset = (totalBefore * itemWidth) - (itemWidth - 285); // Ajuste para centralizar

roulette.style.transition = 'none';
roulette.style.transform = `translateX(0px)`;
setTimeout(() => {
    roulette.style.transition = 'transform 5s ease-out';
    roulette.style.transform = `translateX(-${offset}px)`; // Aplicar o novo offset

    setTimeout(() => {
        document.getElementById('resultItem').innerText = `🎉 Você obteve: ${selectedItem.name}`;
    }, 5100);
}, 50);

}

function getRandomItem(rewards) {
    const rand = Math.random();
    let sum = 0;
    for (const item of rewards) {
        sum += item.chance;
        if (rand < sum) return item;
    }
    return rewards[rewards.length - 1];
}
