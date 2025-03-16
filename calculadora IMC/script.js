function calcularIMC() {
    let peso = parseFloat(document.getElementById("peso").value);
    let altura = parseFloat(document.getElementById("altura").value);
    let idade = parseInt(document.getElementById("idade").value);
    let comorbidades = document.getElementById("comorbidades").value;
    let usoDrogas = document.getElementById("usoDrogas").value;
    let alcool = document.getElementById("alcool").value;
    let tabagismo = document.getElementById("tabagismo").value;
    let doencas = document.getElementById("doencas").value;
    
    if (!peso || !altura || altura <= 0 || !idade || idade <= 0) {
        alert("Por favor, insira valores válidos para peso, altura e idade.");
        return;
    }

    let imc = peso / (altura * altura);
    let classificacao = "";
    let mensagem = "";
    let faixaEtaria = "";

    // Classificação do IMC
    if (imc < 18.5) {
        classificacao = "Abaixo do peso";
        mensagem = `
            🔴 Riscos: Fraqueza, sistema imunológico debilitado, risco maior de osteoporose.<br>
            ✅ Dicas: Consuma mais calorias saudáveis (abacate, castanhas, carnes magras) e faça treinos de resistência para ganhar massa muscular.
        `;
    } else if (imc < 24.9) {
        classificacao = "Peso normal";
        mensagem = `
            🟢 Você está com um peso saudável!<br>
            ✅ Mantenha uma alimentação equilibrada e pratique atividades físicas regularmente.
        `;
    } else if (imc < 29.9) {
        classificacao = "Sobrepeso";
        mensagem = `
            🟡 Riscos: Maior risco de doenças cardíacas e pressão alta.<br>
            ✅ Dicas: Pratique exercícios aeróbicos (caminhada, corrida, natação) e reduza alimentos ultraprocessados.
        `;
    } else if (imc < 34.9) {
        classificacao = "Obesidade grau 1";
        mensagem = `
            🟠 Riscos: Risco aumentado de diabetes tipo 2 e problemas nas articulações.<br>
            ✅ Dicas: Invista em musculação combinada com exercícios aeróbicos e ajuste a dieta reduzindo açúcares e gorduras saturadas.
        `;
    } else if (imc < 39.9) {
        classificacao = "Obesidade grau 2";
        mensagem = `
            🔴 Riscos: Hipertensão, colesterol alto, dificuldades respiratórias.<br>
            ✅ Dicas: Procure um nutricionista e um personal trainer para um plano adequado. Prefira exercícios de baixo impacto, como hidroginástica.
        `;
    } else {
        classificacao = "Obesidade grau 3 (grave)";
        mensagem = `
            🚨 Riscos: Alto risco de doenças cardiovasculares e metabólicas.<br>
            ✅ Dicas: Busque acompanhamento médico, invista em reeducação alimentar e pratique atividades leves com supervisão profissional.
        `;
    }

    // Verificação de faixa etária e IMC adequado
    if (idade < 18) {
        faixaEtaria = "Menores de 18 anos";
        mensagem += `<br><strong>Atenção:</strong> O IMC pode não ser um indicador preciso para menores de 18 anos, pois o crescimento e a composição corporal variam muito nessa faixa etária. Consulte um pediatra ou endocrinologista para mais informações.`;
    } else if (idade >= 18 && idade <= 64) {
        faixaEtaria = "Adultos (18-64 anos)";
    } else {
        faixaEtaria = "Idosos (65+ anos)";
        mensagem += `<br><strong>Atenção:</strong> Em idades mais avançadas, a avaliação do IMC pode não ser a melhor medida de saúde. Considere fazer exames de saúde regularmente para um diagnóstico mais preciso.`;
    }

    // Exibir comorbidades e outros hábitos
    let comorbidadesInfo = comorbidades ? `<strong>Comorbidades:</strong> ${comorbidades}` : "Nenhuma comorbidade relatada";
    let usoDrogasInfo = usoDrogas === "sim" ? "<strong>Uso de Drogas:</strong> Sim" : "<strong>Uso de Drogas:</strong> Não";
    let alcoolInfo = alcool === "sim" ? "<strong>Consumo de Álcool:</strong> Sim" : "<strong>Consumo de Álcool:</strong> Não";
    let tabagismoInfo = tabagismo === "sim" ? "<strong>Tabagismo:</strong> Sim" : "<strong>Tabagismo:</strong> Não";
    let doencasInfo = doencas ? `<strong>Doenças pré-existentes:</strong> ${doencas}` : "Nenhuma doença pré-existente relatada";

    let resultadoHTML = `
        <p>Seu IMC é <strong>${imc.toFixed(2)}</strong> - ${classificacao}</p>
        <p><strong>Faixa Etária:</strong> ${faixaEtaria}</p>
        <p>${mensagem}</p>
        <p>${comorbidadesInfo}</p>
        <p>${usoDrogasInfo}</p>
        <p>${alcoolInfo}</p>
        <p>${tabagismoInfo}</p>
        <p>${doencasInfo}</p>
    `;
    
    document.getElementById("resultado").innerHTML = resultadoHTML;
}
