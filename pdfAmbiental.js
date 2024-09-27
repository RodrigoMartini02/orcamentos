document.addEventListener('DOMContentLoaded', function() {
    function generatePdf() {
        // Obtenção dos valores diretamente do DOM
        const municipioInput = document.querySelector('#containerAmbiental .municipio');
        const municipio = municipioInput ? municipioInput.value.trim() : 'Nome do Município';

        // Pega os valores já calculados e exibidos no HTML
        const monthlyCost = document.querySelector('#containerAmbiental .monthly-cost').textContent || '0';
        const annualCost = document.querySelector('#containerAmbiental .annual-cost').textContent || '0';
        const implementationCost = document.querySelector('#containerAmbiental .implementation-cost').textContent || '0';
        const technicalHoursCost = document.querySelector('#containerAmbiental .valor-horas-tecnicas').value || '0';
        const technicalHoursQuantity = document.querySelector('#containerAmbiental .horas-tecnicas').value || '0';

        // Converte os valores para números corretamente, removendo o "R$" e separadores de milhar
        function parseMonetaryValue(value) {
            return parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
        }

        // Calculando os valores monetários
        const monthlyCostValue = parseMonetaryValue(monthlyCost);
        const annualCostValue = parseMonetaryValue(annualCost);
        const implementationCostValue = parseMonetaryValue(implementationCost);
        const technicalHoursCostValue = parseMonetaryValue(technicalHoursCost);
        const technicalHoursQuantityValue = parseFloat(technicalHoursQuantity) || 0;
        const technicalHoursTotalValue = technicalHoursCostValue * technicalHoursQuantityValue;

        // Total da tabela "Dos Valores"
        const totalDosValores = annualCostValue;

        // Total da tabela "Dos Serviços"
        const totalDosServicos = (implementationCostValue + technicalHoursTotalValue).toFixed(2);

        // Total Global (somando os dois totais separados)
        const totalGlobal = (parseFloat(totalDosValores) + parseFloat(totalDosServicos)).toFixed(2);

        // Criação do conteúdo do PDF
        const content = document.createElement('div');
        content.classList.add('pdf-body');
        content.style.textAlign = 'justify';
        content.innerHTML = `
            <div class="header-text">
            <!-- Adicionando uma imagem de cabeçalho com Base64 -->
        <img src="data:image/png;base64,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" alt="Logo" style="width: 100%; max-height: 150px; object-fit: contain; margin-bottom: 20px;">

                <h1 class="bold text" style="margin-bottom: 0px;"> ${municipio}</h1>
                <h2 class="left-align large-margin-bottom" style="margin-top: 0; margin-bottom: 20px;">SECRETARIA DA FAZENDA</h2>
                <h2 class="center-align large-margin-bottom" style="margin-top: 40px;">ORÇAMENTO SISTEMA DE GESTÃO AMBIENTAL</h2>
                <p class="text-margin">A empresa TECNOLÓGICA PRESTADORA DE SERVIÇOS DE INFORMÁTICA, inscrita no CNPJ. 09.599.021/0001-40, estabelecida à Avenida Osvaldo Pinto da Veiga, 1323, Próspera, Criciúma/SC, vem por meio deste, apresentar nosso orçamento para o Sistema De Gestão Ambiental no município de ${municipio}.</p>
            </div>
            
            <h3 class="text-margin">DOS VALORES:</h3>
            <table class="pdf-table text-margin">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Descrição</th>
                        <th>Un.</th>
                        <th>Qtd.</th>
                        <th>Valor Un.</th>
                        <th>Valor Anual</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Locação mensal Sistema de Gestão Ambiental:<br>
                              -	Geração de taxas;<br>
                              -	Licenciamentos;<br>
                              -	Denúncias;<br>
                              -	Infrações;<br>
                              -	Agenda Castração
                        </td>
                        <td>Mês</td>
                        <td>12</td>
                        <td>${formatarCusto(monthlyCostValue)}</td>
                        <td>${formatarCusto(annualCostValue)}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align: right;">Total:</td>
                        <td>${formatarCusto(monthlyCostValue)}</td>
                        <td>${formatarCusto(totalDosValores)}</td>
                    </tr>
                </tfoot>
            </table>

            <h3 class="text-margin">DOS SERVIÇOS:</h3>
            <table class="pdf-table text-margin">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Descrição</th>
                        <th>Un.</th>
                        <th>Qtd.</th>
                        <th>Valor Un.</th>
                        <th>Valor Anual</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2</td>
                        <td>Implantação e treinamento</td>
                        <td>UN</td>
                        <td>01</td>
                        <td>${formatarCusto(implementationCostValue)}</td>
                        <td>${formatarCusto(implementationCostValue)}</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Horas Técnicas</td>
                        <td>HR</td>
                        <td>${technicalHoursQuantityValue}</td>
                        <td>${formatarCusto(technicalHoursCostValue)}</td>
                        <td>${formatarCusto(technicalHoursTotalValue)}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align: right;">Total:</td>
                        <td></td>
                        <td>${formatarCusto(totalDosServicos)}</td>
                    </tr>
                </tfoot>
            </table>

            <div style="height: 30px;"></div>

            <table class="pdf-table text-margin">
                <thead>
                    <tr>
                        <th colspan="5">VALOR GLOBAL (SOMA DOS VALORES E SERVIÇOS)</th>
                        <th>${formatarCusto(totalGlobal)}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6" style="text-align: left;">VALOR POR EXTENSO: ${valorPorExtenso(totalGlobal)}</td>
                    </tr>
                </tbody>
            </table>

            <p class="text-margin large-margin-bottom">- Proposta válida por 60 (sessenta) dias.</p>
<p class="text-margin large-margin-bottom right-align" style="margin-bottom: 5px;">Criciúma, ${formatDate(new Date())}.</p>

<br>
<p style="margin-bottom: 0; margin-top: 5px;"><strong>TECNOLÓGICA PRESTADORA DE SERVIÇOS DE INFORMÁTICA LTDA</strong></p>
<p style="margin-top: 0;"><strong>CNPJ: 09.599.021/0001-40</strong></p>

        `;

        const options = {
            margin: [10, 10, 10, 10], // Margens de 10mm em todos os lados
            filename: "orcamento_ambiental.pdf",
            html2canvas: { scale: 1.5 }, // Reduz a escala para evitar que o conteúdo fique muito grande
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            image: { type: 'jpeg', quality: 0.98 }
        };
        

        html2pdf().from(content).set(options).toPdf().get('pdf').then(pdf => {
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.text(`Página ${i} de ${totalPages}`, pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 10, { align: 'center' });
            }
            pdf.save(options.filename);
        });
    }

    // Evento para gerar PDF quando o botão for clicado
    const downloadButton = document.querySelector('#containerAmbiental .generate-pdf');
    if (downloadButton) {
        downloadButton.addEventListener('click', generatePdf); // Gera PDF sempre que clicado
    }

    function formatarCusto(custo) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(custo);
    }

    function valorPorExtenso(valor) {
        const valorFloat = parseFloat(valor);
        const parteInteira = Math.floor(valorFloat);
        const parteDecimal = Math.round((valorFloat - parteInteira) * 100);

        let extenso = '';

        extenso += numPorExtenso(parteInteira);

        if (parteInteira === 1) {
            extenso += ' real';
        } else {
            extenso += ' reais';
        }

        if (parteDecimal > 0) {
            extenso += ' e ' + numPorExtenso(parteDecimal);

            if (parteDecimal === 1) {
                extenso += ' centavo';
            } else {
                extenso += ' centavos';
            }
        }

        return extenso;
    }

    function numPorExtenso(num) {
        const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
        const dezAteDezenove = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
        const dezenas = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
        const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

        let extenso = '';

        if (num >= 1000) {
            extenso += numPorExtenso(Math.floor(num / 1000)) + ' mil ';
            num %= 1000;
        }

        if (num >= 100) {
            extenso += centenas[Math.floor(num / 100)] + ' ';
            num %= 100;
        }

        if (num >= 10 && num < 20) {
            extenso += dezAteDezenove[num - 10];
        } else {
            if (num >= 20) {
                extenso += dezenas[Math.floor(num / 10)] + ' ';
                num %= 10;
            }
            if (num > 0) {
                extenso += unidades[num];
            }
        }

        return extenso.trim();
    }

    function formatDate(date) {
        const day = date.getDate();
        const monthNames = [
            "Janeiro", "Fevereiro", "Março",
            "Abril", "Maio", "Junho", "Julho",
            "Agosto", "Setembro", "Outubro",
            "Novembro", "Dezembro"
        ];
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return `${day} de ${monthNames[monthIndex]} de ${year}`;
    }
    
});
