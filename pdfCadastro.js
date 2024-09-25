document.addEventListener('DOMContentLoaded', function () {
    const baixarOrcamentoButton = document.getElementById('baixarOrcamentoButton');

    if (baixarOrcamentoButton) {
        baixarOrcamentoButton.addEventListener('click', generatePdf);
    }

    function generatePdf() {
        const valoresCalculados = window.obterValoresCalculados();

        if (!valoresCalculados) {
            alert("Por favor, realize o cálculo antes de gerar o PDF.");
            return; // Impede a geração do PDF se o cálculo não foi realizado
        }

        const { totalCPF, valorCPF, quantidadeCPF, municipio } = valoresCalculados;

        // Criar o conteúdo para o PDF
        const content = document.createElement('div');
        content.classList.add('pdf-body');
        content.style.textAlign = 'justify';
        content.innerHTML = `
            <div class="header-text">
                <h1 class="bold text" style="line-height: 0;">PREFEITURA MUNICIPAL DE ${municipio}</h1>
                <h2 class="left-align large-margin-bottom" style="line-height: 0;">SECRETARIA DA FAZENDA</h2>
                <h2 class="left-align large-margin-bottom" style="text-align: center;">ORÇAMENTO HIGIENIZAÇÃO CADASTRAL</h2>
                <p class="text-margin">A empresa TECNOLÓGICA PRESTADORA DE SERVIÇOS DE INFORMÁTICA, inscrita no CNPJ. 09.599.021/0001-40, estabelecida à Avenida Osvaldo Pinto da Veiga, 1323, Próspera, Criciúma/SC, vem por meio deste, apresentar nosso orçamento para Higienização Cadastral no município de ${municipio}.</p>
            </div>

            <h3 class="text-margin">DOS VALORES:</h3>
            <table class="pdf-table text-margin" style="width: 100%; border-collapse: collapse;" border="1">
                <thead>
                    <tr>
                        <th style="padding: 8px;">Item</th>
                        <th style="padding: 8px;">Descrição</th>
                        <th style="padding: 8px;">Un.</th>
                        <th style="padding: 8px;">Qtd.</th>
                        <th style="padding: 8px;">Valor Un.</th>
                        <th style="padding: 8px;">Valor Global</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 8px;">1</td>
                        <td style="padding: 8px;">Esforço de Desenvolvimento para Higienização Cadastral</td>
                        <td style="padding: 8px;">Mês</td>
                        <td style="padding: 8px;">${quantidadeCPF}</td>
                        <td style="padding: 8px;">${formatarCusto(valorCPF)}</td>
                        <td style="padding: 8px;">${formatarCusto(totalCPF.toFixed(2))}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align: right; padding: 8px;">Total:</td>
                        <td style="padding: 8px;">${formatarCusto(valorCPF)}</td>
                        <td style="padding: 8px;">${formatarCusto(totalCPF.toFixed(2))}</td>
                    </tr>
                </tfoot>
            </table>

            <p id="valorPorExtenso" class="large-margin-bottom">VALOR POR EXTENSO: ${valorPorExtenso(totalCPF.toFixed(2))}</p>



            <p class="text-margin large-margin-bottom" style="text-align: right;">Criciúma, ${formatDate(new Date())}</p>

            <br>
            <p class="bold text-margin large-margin-bottom">TECNOLÓGICA PRESTADORA DE SERVIÇOS DE INFORMÁTICA LTDA</p>
            <p class="bold text-margin large-margin-bottom">CNPJ: 09.599.021/0001-40</p>
        `;

        const options = {
            margin: [10, 10, 10, 10],
            filename: `Orcamento_${municipio}.pdf`,
            html2canvas: { scale: 1.5 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().from(content).set(options).save();
    }

    // Função para formatar números como moeda BRL
    function formatarCusto(numero) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero);
    }

    function valorPorExtenso(valor) {
        const valorFloat = parseFloat(valor.replace(/[^\d,]+/g, '').replace(',', '.'));
        const parteInteira = Math.floor(valorFloat);
        const parteDecimal = Math.round((valorFloat - parteInteira) * 100);

        let extenso = '';

        // Parte inteira
        extenso += numPorExtenso(parteInteira);

        if (parteInteira === 1) {
            extenso += ' real';
        } else {
            extenso += ' reais';
        }

        // Parte decimal
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
    
    
    


    // Função para formatar a data
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
