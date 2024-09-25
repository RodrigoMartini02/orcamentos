document.addEventListener('DOMContentLoaded', function () {
    let isCalculated = false;
    let valoresCalculados = null;

    // Função para calcular o valor total de CPFs
    function calcular() {
        const valorCPF = parseFloat(document.getElementById('cpfValor').value); // Valor por CPF
        const quantidadeCPF = parseInt(document.getElementById('cpfQuantidade').value); // Quantidade de CPFs
        const municipio = document.getElementById('municipio').value.trim(); // Nome do Município

        // Verificar se os valores são válidos
        if (isNaN(valorCPF) || isNaN(quantidadeCPF) || quantidadeCPF <= 0 || valorCPF <= 0) {
            alert("Por favor, insira valores válidos para a quantidade e o valor por CPF.");
            isCalculated = false;
            return;
        }

        if (municipio === "") {
            alert("Por favor, insira o nome do município.");
            isCalculated = false;
            return;
        }

        // Multiplicação do valor pela quantidade
        const totalCPF = valorCPF * quantidadeCPF;

        // Exibe o resultado no div 'resultado'
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = `<p>Total: ${formatarCusto(totalCPF)}</p>`;
        resultadoDiv.style.display = 'block';

        isCalculated = true;
        valoresCalculados = { totalCPF, valorCPF, quantidadeCPF, municipio }; // Inclui o município nos valores calculados
    }

    // Função para formatar números como moeda BRL
    function formatarCusto(numero) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero);
    }

    // Função para limpar os valores dos inputs e zerar resultados
    function limparCampos() {
        document.getElementById('cpfValor').value = '';
        document.getElementById('cpfQuantidade').value = '';
        document.getElementById('municipio').value = '';
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = ''; // Limpa o resultado exibido
        resultadoDiv.style.display = 'none'; // Esconde o div de resultado
        isCalculated = false; // Reseta a flag de cálculo
        valoresCalculados = null; // Limpa os valores calculados

        // Verificação no console
        console.log('Campos e resultados foram zerados.');
    }

 // Adiciona conversão para caixa alta no campo município
document.getElementById('municipio').addEventListener('input', function() {
    this.value = this.value.toUpperCase(); // Converte o valor para caixa alta
});


    // Função para ocultar os containers
    function hideContainers() {
        // Oculta todos os containers e limpa resultados
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.display = 'none'; // Esconde o container
            const resultContainer = container.querySelector('.result-container');
            if (resultContainer) {
                const resultFields = ['.pop-result', '.monthly-cost', '.annual-cost', '.implementation-cost'];
                resultFields.forEach(selector => {
                    const element = resultContainer.querySelector(selector);
                    if (element) element.textContent = '-'; // Limpa os valores exibidos
                });
            }
        });

        // Limpa os campos de entrada
        limparCampos();
    }

    // Event listener para o botão de calcular
    document.getElementById("calcularButton").addEventListener("click", calcular);

    // Função para resetar ao clicar em "Início"
    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('.btn-inicio');
        if (button) {
            hideContainers();
            console.log('Botão Início clicado, containers ocultos e campos limpos.');
        }
    });

    // Função para obter os valores calculados
    window.obterValoresCalculados = function () {
        if (!isCalculated) {
            alert("Por favor, realize o cálculo antes de baixar o orçamento.");
            return null;
        }
        return valoresCalculados;
    };
});
