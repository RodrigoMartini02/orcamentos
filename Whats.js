document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('.container');
    let isCalculated = false;

    function showContainer(containerId) {
        containers.forEach(container => {
            container.style.display = 'none';
        });
        const selectedContainer = document.getElementById(containerId);
        if (selectedContainer) {
            selectedContainer.style.display = 'block';
        }
    }

    function hideContainers() {
        containers.forEach(container => {
            container.style.display = 'none';
            resetFields(container);
            hideResults(container);
        });
    }

    function resetFields(container) {
        const municipioInput = container.querySelector('.municipio');
        const populationInput = container.querySelector('.population');
        const horasTecnicasInput = container.querySelector('.horas-tecnicas');
        const valorHoraTecnicaInput = container.querySelector('.valor-horas-tecnicas');
        if (municipioInput) municipioInput.value = '';
        if (populationInput) populationInput.value = '';
        if (horasTecnicasInput) horasTecnicasInput.value = '';
        if (valorHoraTecnicaInput) valorHoraTecnicaInput.value = '';
    }

    document.querySelectorAll('.municipio').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    });

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
        const horasTecnicasResult = resultContainer.querySelector('.horas-tecnicas-result');
    
        if (popResult) popResult.textContent = population.toLocaleString('pt-BR');
        if (monthlyCostResult) monthlyCostResult.textContent = formatarNumero(monthlyCost);
        if (annualCostResult) annualCostResult.textContent = formatarNumero(annualCost);
        if (implementationCostResult) implementationCostResult.textContent = formatarNumero(implementationCost);
        if (horasTecnicasResult) horasTecnicasResult.textContent = formatarNumero(totalHorasTecnicas);
    
        resultContainer.style.display = 'block';
        isCalculated = true;
    }

    function calcularCustoMensalWhats(populacao) {
        let custoMensal;
    
        if (populacao <= 15000) {
            custoMensal = 800;  
        } else if (populacao <= 30000) {
            custoMensal = populacao * 0.058;
        } else if (populacao <= 50000) {
            custoMensal = populacao * 0.048;
        } else if (populacao <= 100000) {
            custoMensal = populacao * 0.027;
        } else if (populacao <= 150000) {
            custoMensal = populacao * 0.023;
        } else if (populacao <= 200000) {
            custoMensal = populacao * 0.022;
        } else if (populacao <= 250000) {
            custoMensal = populacao * 0.021;
        } else if (populacao <= 300000) {
            custoMensal = populacao * 0.019;
        } else {
            custoMensal = 5800;  
        }

        return custoMensal;
    }

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

    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('#calcularButtonWhats');
        if (button) {
            const container = button.closest('.container');
            const municipioInput = container.querySelector('.municipio');
            const populationInput = container.querySelector('.population');
            const horasTecnicasInput = container.querySelector('.horas-tecnicas');
            const valorHoraTecnicaInput = container.querySelector('.valor-horas-tecnicas');
            
            const municipio = municipioInput ? municipioInput.value.trim() : null;
            const population = parseInt(populationInput ? populationInput.value.trim() : '0', 10);
            const qtdHorasTecnicas = parseInt(horasTecnicasInput ? horasTecnicasInput.value.trim() : '0', 10);
            const valorHoraTecnica = parseFloat(valorHoraTecnicaInput ? valorHoraTecnicaInput.value.trim() : '0');

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

            const monthlyCost = calcularCustoMensalWhats(population);
            const annualCost = monthlyCost * 12;
            const implementationCost = annualCost * 0.25;
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

            const downloadButton = container.querySelector('.generate-pdf');
            if (downloadButton) {
                downloadButton.disabled = false;
            }
        }
    });

    document.body.addEventListener('click', function(event) {
        const downloadButton = event.target.closest('.generate-pdf');
        if (downloadButton) {
            gerarPdf(); 
        }
    });

    function gerarPdf() {
        console.log("PDF gerado com sucesso.");
    }

    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('.btn-inicio');
        if (button) {
            hideContainers();
            const downloadButton = document.querySelector('.generate-pdf');
            if (downloadButton) {
                downloadButton.disabled = true;
            }
            isCalculated = false;
        }
    });

    document.querySelectorAll('.municipio, .population, .horas-tecnicas, .valor-horas-tecnicas').forEach(input => {
        input.addEventListener('input', function() {
            const downloadButton = document.querySelector('.generate-pdf');
            if (downloadButton) {
                downloadButton.disabled = true;
            }
            isCalculated = false;
        });
    });

    document.body.addEventListener('click', function(event) {
        const button = event.target.closest('.btnSistema[data-target="containerWhats"]');
        if (button) {
            showContainer('containerWhats');
        }
    });

    document.querySelectorAll('.btnSistema').forEach(button => {
        button.addEventListener('click', function() {
            const target = button.getAttribute('data-target');
            showContainer(target);
        });
    });
});
