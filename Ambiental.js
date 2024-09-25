document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('.container');
    let isCalculated = false; // Variável de controle para verificar se o cálculo foi realizado

    // Função para exibir o container selecionado
    function showContainer(containerId) {
        containers.forEach(container => {
            container.style.display = 'none';
        });
        const selectedContainer = document.getElementById(containerId);
        if (selectedContainer) {
            selectedContainer.style.display = 'block';
        }
    }

    // Função para ocultar todos os containers e zerar os campos de entrada
    function hideContainers() {
        containers.forEach(container => {
            container.style.display = 'none';
            resetFields(container);
            hideResults(container);
        });
    }

    // Função para resetar campos de entrada do container
    function resetFields(container) {
        const municipioInput = container.querySelector('.municipio');
        const populationInput = container.querySelector('.population');
        const horasTecnicasInput = container.querySelector('.horas-tecnicas'); // Campo de horas técnicas
        const valorHoraTecnicaInput = container.querySelector('.valor-horas-tecnicas'); // Campo de valor por hora técnica
        if (municipioInput) municipioInput.value = '';
        if (populationInput) populationInput.value = '';
        if (horasTecnicasInput) horasTecnicasInput.value = ''; // Resetar horas técnicas
        if (valorHoraTecnicaInput) valorHoraTecnicaInput.value = ''; // Resetar valor de hora técnica
    }


    // Adiciona conversão para caixa alta no campo município
    document.querySelectorAll('.municipio').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.toUpperCase(); // Converte o valor para caixa alta
        });
    });
    
    // Função para ocultar resultados e zerar dados no container
    function hideResults(container) {
        const resultContainers = container.querySelectorAll('.result-container');
        resultContainers.forEach(resultContainer => {
            resultContainer.style.display = 'none';
            const resultFields = ['.pop-result', '.monthly-cost', '.annual-cost', '.implementation-cost', '.horas-tecnicas-result'];
            resultFields.forEach(selector => {
                const element = resultContainer.querySelector(selector);
                if (element) element.textContent = '-';
            });
        });
    }

    function displayCalculationResults(resultContainer, population, monthlyCost, annualCost, implementationCost, totalHorasTecnicas) {
        const popResult = resultContainer.querySelector('.pop-result');
        const monthlyCostResult = resultContainer.querySelector('.monthly-cost');
        const annualCostResult = resultContainer.querySelector('.annual-cost');
        const implementationCostResult = resultContainer.querySelector('.implementation-cost');
        const horasTecnicasResult = resultContainer.querySelector('.horas-tecnicas-result'); // Adiciona o campo para exibir horas técnicas
    
        if (popResult) popResult.textContent = population.toLocaleString('pt-BR');
        if (monthlyCostResult) monthlyCostResult.textContent = formatarNumero(monthlyCost);
        if (annualCostResult) annualCostResult.textContent = formatarNumero(annualCost);
        if (implementationCostResult) implementationCostResult.textContent = formatarNumero(implementationCost);
        if (horasTecnicasResult) horasTecnicasResult.textContent = formatarNumero(totalHorasTecnicas); // Exibe o total das horas técnicas
    
        resultContainer.style.display = 'block';
        isCalculated = true; // Marca como calculado
    }

    // Função para calcular custos do Sistema Ambiental com ajustes de R$ 0,005 entre as faixas
    function calcularCustoMensalAmbiental(populacao) {
        let custoMensal;
    
        if (populacao <= 15000) {
            custoMensal = 1200;  
        } else if (populacao <= 30000) {
            custoMensal = populacao * 0.065;
        } else if (populacao <= 50000) {
            custoMensal = populacao * 0.055;
        } else if (populacao <= 100000) {
            custoMensal = populacao * 0.030;
        } else if (populacao <= 150000) {
            custoMensal = populacao * 0.026;
        } else if (populacao <= 200000) {
            custoMensal = populacao * 0.025;
        } else if (populacao <= 250000) {
            custoMensal = populacao * 0.024;
        } else if (populacao <= 300000) {
            custoMensal = populacao * 0.022;
        } else {
            custoMensal = 6500;  
        }

        return custoMensal;
    }

    // Função de formatação de número para moeda
    function formatarNumero(numero) {
        return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    let calculatedValues = {
        population: 0,
        monthlyCost: 0,
        annualCost: 0,
        implementationCost: 0,
        qtdHorasTecnicas: 0,
        totalHorasTecnicas: 0
    };
    
    // Função para calcular e exibir os resultados
    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('#calcularButtonAmbiental');
        if (button) {
            const container = button.closest('.container');
            const municipioInput = container.querySelector('.municipio');
            const populationInput = container.querySelector('.population');
            const horasTecnicasInput = container.querySelector('.horas-tecnicas'); // Campo de horas técnicas
            const valorHoraTecnicaInput = container.querySelector('.valor-horas-tecnicas'); // Campo de valor por hora técnica
            
            const municipio = municipioInput ? municipioInput.value.trim() : null;
            const population = parseInt(populationInput ? populationInput.value.trim() : '0', 10);
            const qtdHorasTecnicas = parseInt(horasTecnicasInput ? horasTecnicasInput.value.trim() : '0', 10); // Quantidade de horas técnicas
            const valorHoraTecnica = parseFloat(valorHoraTecnicaInput ? valorHoraTecnicaInput.value.trim() : '0'); // Valor da hora técnica inserido pelo usuário

            if (!municipio) {
                alert('Por favor, insira o nome do município.');
                municipioInput.focus();
                return;
            }

            if (isNaN(population) || population <= 0) {
                alert('Por favor, insira um número válido para a população.');
                populationInput.focus();
                return;
            }

            if (isNaN(qtdHorasTecnicas) || qtdHorasTecnicas <= 0) {
                alert('Por favor, insira uma quantidade válida de horas técnicas.');
                horasTecnicasInput.focus();
                return;
            }

            if (isNaN(valorHoraTecnica) || valorHoraTecnica <= 0) {
                alert('Por favor, insira um valor válido para o valor por hora técnica.');
                valorHoraTecnicaInput.focus();
                return;
            }

            // Cálculo do custo mensal e anual
            const monthlyCost = calcularCustoMensalAmbiental(population);
            const annualCost = monthlyCost * 12;

            // Ajustar o Custo de Implantação para 30% do valor anual
            const implementationCost = annualCost * 0.30;

            // Calcular o custo total das horas técnicas
            const totalHorasTecnicas = qtdHorasTecnicas * valorHoraTecnica;

            calculatedValues = {
                population,
                monthlyCost,
                annualCost,
                implementationCost,
                qtdHorasTecnicas,
                totalHorasTecnicas
            };

            const resultContainer = container.querySelector('.result-container');
            displayCalculationResults(resultContainer, population, monthlyCost, annualCost, implementationCost, totalHorasTecnicas);
    
            // Habilita o botão de "Baixar Orçamento" após calcular
            const downloadButton = container.querySelector('.generate-pdf');
            if (downloadButton) {
                downloadButton.disabled = false; // Habilita o botão
            }
        }
    });

    // Função para gerar o PDF sempre que o botão "Baixar Orçamento" for clicado
    document.body.addEventListener('click', function(event) {
        const downloadButton = event.target.closest('.generate-pdf');
        if (downloadButton) {
            gerarPdf(); // Chama a função de gerar PDF
        }
    });

    // Função para gerar o PDF
    function gerarPdf() {
        console.log("PDF gerado com sucesso.");
    }

    // Função para resetar ao clicar em "Início"
    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('.btn-inicio');
        if (button) {
            hideContainers();
            const downloadButton = document.querySelector('.generate-pdf');
            if (downloadButton) {
                downloadButton.disabled = true; // Desabilitar o botão de "Baixar Orçamento" ao clicar em "Início"
            }
            isCalculated = false; // Reseta o estado de cálculo
        }
    });

    // Desabilitar o botão "Baixar Orçamento" ao alterar os inputs
    document.querySelectorAll('.municipio, .population, .horas-tecnicas, .valor-horas-tecnicas').forEach(input => {
        input.addEventListener('input', function() {
            const downloadButton = document.querySelector('.generate-pdf');
            if (downloadButton) {
                downloadButton.disabled = true; // Desabilita o botão ao modificar os dados
            }
            isCalculated = false; // Reseta o estado de cálculo
        });
    });

    // Função para exibir o container do Sistema Ambiental
    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('.btnSistema[data-target="containerAmbiental"]');
        if (button) {
            showContainer('containerAmbiental');
        }
    });

    // Certificar-se de que a funcionalidade do botão está correta para outros containers
    document.querySelectorAll('.btnSistema').forEach(button => {
        button.addEventListener('click', function() {
            const target = button.getAttribute('data-target');
            showContainer(target);
        });
    });
});
