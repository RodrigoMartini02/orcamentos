document.addEventListener('DOMContentLoaded', function() {
    function generatePdf() {
        // Obtenção dos valores diretamente do DOM
        const municipioInput = document.querySelector('#containerGEO .municipio');
        const municipio = municipioInput ? municipioInput.value.trim() : 'Nome do Município';

        // Pega os valores já calculados e exibidos no HTML
        const monthlyCost = document.querySelector('#containerGEO .monthly-cost').textContent || '0';
        const annualCost = document.querySelector('#containerGEO .annual-cost').textContent || '0';
        const implementationCost = document.querySelector('#containerGEO .implementation-cost').textContent || '0';
        const technicalHoursCost = document.querySelector('#containerGEO .valor-horas-tecnicas').value || '0';
        const technicalHoursQuantity = document.querySelector('#containerGEO .horas-tecnicas').value || '0';

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
                <h1 class="bold text" style="margin-bottom: 0px;">PREFEITURA MUNICIPAL DE ${municipio}</h1>
                <h2 class="left-align large-margin-bottom" style="margin-top: 0; margin-bottom: 20px;">SECRETARIA DA FAZENDA</h2>
                <h2 class="center-align large-margin-bottom" style="margin-top: 40px;">ORÇAMENTO SISTEMA DE GESTÃO GEO</h2>
                <p class="text-margin">A empresa TECNOLÓGICA PRESTADORA DE SERVIÇOS DE INFORMÁTICA, inscrita no CNPJ. 09.599.021/0001-40, estabelecida à Avenida Osvaldo Pinto da Veiga, 1323, Próspera, Criciúma/SC, vem por meio deste, apresentar nosso orçamento para o Sistema De Gestão GEO no município de ${municipio}.</p>
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
                        <td>Locação mensal Sistema de Gestão GEO:
-	Cartografia;
-	Análise Espacial;
-	Geoprocessamento;
-	Gestão Imobiliária
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
            <p class="text-margin large-margin-bottom right-align">Criciúma, ${formatDate(new Date())}.</p>

            <br>
            <p style="margin-bottom: 0; margin-top: 60px;"><strong>TECNOLÓGICA PRESTADORA DE SERVIÇOS DE INFORMÁTICA LTDA</strong></p>
            <p style="margin-top: 0;"><strong>CNPJ: 09.599.021/0001-40</strong></p>
        `;

        const options = {
            margin: [10, 10, 10, 10],
            filename: "orcamento_geo.pdf",
            html2canvas: { scale: 1.5 },
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
    const downloadButton = document.querySelector('#containerGEO .generate-pdf');
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
