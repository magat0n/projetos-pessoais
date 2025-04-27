const form = document.getElementById('form');

form.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita o envio do formulário

    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;

    const bmi = (weight / (height * height)).toFixed(2); // Cálculo do IMC

    const value = document.getElementById('value');
    let description = '';

    value.classList.add('attention'); // Adiciona a classe 'attention' para destacar o resultado

    document.getElementById('infos').classList.remove('hidden'); // Remove a classe 'hidden' para mostrar o resultado

    if (bmi < 18.5) {
        description = 'Abaixo do peso!';
    } else if (bmi >= 18.5 && bmi < 25){ 
        description = "Peso normal!";
        value.classList.remove('attention'); // Remove a classe 'attention' se o IMC estiver na faixa normal
        value.classList.add('normal'); // Adiciona a classe 'normal' para destacar o resultado
    } else if (bmi >= 25 && bmi < 30){
        description = "Sobrepeso!";
    }
    else if (bmi >= 30 && bmi < 35){
        description = "Obesidade grau 1!";
    }
    else if (bmi >= 35 && bmi < 40){
        description = "Obesidade grau 2!";
    }
    else {
        description = "Obesidade grau 3!";
    }

    // Exibe o resultado na tela

 

    value.textContent = bmi.replace('.',','); // Exibe o IMC calculado
    document.getElementById('description').textContent = description;
});