const dadosDesempenho = [
    { titulo: 'Título 1', visualizacoes: 980, nota: 8.7 },
    { titulo: 'Título 2', visualizacoes: 860, nota: 8.2 },
    { titulo: 'Título 3', visualizacoes: 745, nota: 7.9 },
    { titulo: 'Título 4', visualizacoes: 690, nota: 8.5 },
    { titulo: 'Título 5', visualizacoes: 540, nota: 7.1 },
    { titulo: 'Título 6', visualizacoes: 430, nota: 6.8 },
    { titulo: 'Título 7', visualizacoes: 320, nota: 7.4 },
    { titulo: 'Título 8', visualizacoes: 210, nota: 6.2 }
];

let graficoDesempenho = null;

function ehNotebook() {
    return window.innerWidth <= 1440;
}

function cssVar(nome) {
    return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

function renderizarGrafico(dados) {
    const canvas = document.getElementById('graficoDesempenho');
    if (!canvas || typeof Chart === 'undefined') return;

    if (graficoDesempenho) {
        graficoDesempenho.destroy();
    }

    const vermelho = cssVar('--vermelho-padrao');
    const vermelhoEscuro = cssVar('--vermelho-secundario');
    const cinzaClaro = cssVar('--cinza-claro');
    const cinzaBorda = cssVar('--cinza-borda');

    const fonte = ehNotebook() ? 12 : 14;
    const cor = 'rgba(255, 255, 255, 0.12)';

    Chart.defaults.font.family = 'Poppins, sans-serif';
    Chart.defaults.font.size = fonte;
    Chart.defaults.color = cinzaClaro;

    const ordenados = [...dados].sort((a, b) => b.visualizacoes - a.visualizacoes);

    graficoDesempenho = new Chart(canvas, {
        data: {
            labels: ordenados.map(d => d.titulo),
            datasets: [
                {
                    type: 'bar',
                    label: 'Visualizações (mil)',
                    data: ordenados.map(d => d.visualizacoes),
                    backgroundColor: vermelho,
                    hoverBackgroundColor: vermelhoEscuro,
                    borderRadius: 6,
                    maxBarThickness: ehNotebook() ? 40 : 56,
                    yAxisID: 'y',
                    order: 2
                },
                {
                    type: 'line',
                    label: 'Nota média',
                    data: ordenados.map(d => d.nota),
                    borderColor: '#ffffff',
                    backgroundColor: '#ffffff',
                    borderWidth: 2,
                    tension: 0.35,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y1',
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#ffffff',
                        usePointStyle: true,
                        boxWidth: 8,
                        padding: 16
                    }
                },
                tooltip: {
                    backgroundColor: '#111111',
                    borderColor: cinzaBorda,
                    borderWidth: 1,
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    padding: 12,
                    callbacks: {
                        label(ctx) {
                            const v = ctx.parsed.y;
                            if (ctx.dataset.yAxisID === 'y1') {
                                return ' Nota média: ' + v.toFixed(1).replace('.', ',');
                            }
                            return ' ' + v.toLocaleString('pt-BR') + ' mil visualizações';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { color: cinzaBorda },
                    ticks: { color: cinzaClaro, maxRotation: 0 }
                },
                y: {
                    beginAtZero: true,
                    position: 'left',
                    grid: { color: cor },
                    border: { display: false },
                    ticks: {
                        color: cinzaClaro,
                        callback: v => v.toLocaleString('pt-BR')
                    },
                    title: {
                        display: true,
                        text: 'Visualizações (mil)',
                        color: cinzaClaro
                    }
                },
                y1: {
                    min: 0,
                    max: 10,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    border: { display: false },
                    ticks: { color: cinzaClaro, stepSize: 2 },
                    title: {
                        display: true,
                        text: 'Nota média',
                        color: cinzaClaro
                    }
                }
            }
        }
    });
}

renderizarGrafico(dadosDesempenho);

let ultimoEraNotebook = ehNotebook();
window.addEventListener('resize', function () {
    if (ehNotebook() !== ultimoEraNotebook) {
        ultimoEraNotebook = ehNotebook();
        renderizarGrafico(dadosDesempenho);
    }
});