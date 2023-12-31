const html = document.querySelector('html');
const btnFoco = document.querySelector('.app__card-button--foco');
const btnCurto = document.querySelector('.app__card-button--curto');
const btnLongo = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const buttons = document.querySelectorAll('.app__card-button');
const btnStartPause = document.querySelector('#start-pause');
const btnRestart = document.querySelector('#restart');
const btnRestartImg = document.querySelector('#restart img');
const btnComecarPausarTexto = document.querySelector('#start-pause span');
const imgComecarPausar = document.querySelector('.app__card-primary-button-icon');
const tempoNaTela = document.querySelector('#timer');
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('./sons/play.wav');
const audioTempoFinalizado = new Audio('./sons/beep.mp3');
const audioPausa = new Audio('./sons/pause.mp3');

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;

musica.loop = true;
musicaFocoInput.addEventListener('change', function() {
    // if(musica.paused)
    if(musicaFocoInput.checked) {
        musica.play();
    } else {
        musica.pause();
    }
})

btnFoco.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alteraContexto('foco');
    btnFoco.classList.add('active');
});

btnCurto.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alteraContexto('descanso-curto');
    btnCurto.classList.add('active');
});

btnLongo.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alteraContexto('descanso-longo');
    btnLongo.classList.add('active');
});

function alteraContexto(contexto) {
    mostraTempo();

    buttons.forEach(function (target) {
        target.classList.remove('active');
    })

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);

    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `;
            break;

        case 'descanso-curto':
            titulo.innerHTML = `
            Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `;
        break;

        case 'descanso-longo':
            titulo.innerHTML = `
            Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `;
        break;
    
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        audioTempoFinalizado.play();
        alert('Tempo finalizado!');
        zerar();

        const focoAtivo = html.getAttribute('data-contexto') === 'foco';
        if (focoAtivo) {            
            var event = new CustomEvent("TarefaFinalizada", {
                detail: {
                    message: "A tarefa foi concluída com sucesso!",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
            // tempoDecorridoEmSegundos = 5;
            // mostraTempo();
        }

        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostraTempo();
}

function iniciarPausar() {
    if(intervaloId) {
        audioPausa.play();
        zerar();
        return;
    }
    audioPlay.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    btnComecarPausarTexto.textContent = 'Pausar';
    imgComecarPausar.setAttribute('src', './imagens/pause.png');
}

function zerar() {
    clearInterval(intervaloId);
    btnComecarPausarTexto.textContent = 'Começar';
    imgComecarPausar.setAttribute('src', './imagens/play_arrow.png');
    intervaloId = null;
}

btnStartPause.addEventListener('click', iniciarPausar);

function reiniciarContador() {
    const contexto = html.dataset.contexto;
    
    switch (contexto) {
        case 'foco':
            tempoDecorridoEmSegundos = 1500;
            mostraTempo();
            break;

        case 'descanso-curto':
            tempoDecorridoEmSegundos = 300;
            mostraTempo();
            break;

        case 'descanso-longo':
        tempoDecorridoEmSegundos = 900;
        mostraTempo();
        break;
    
        default:
            break;
    }

    btnRestartImg.classList.add('spin');
    setTimeout(() => {
        btnRestartImg.classList.remove('spin');
    }, 750);
}

btnRestart.addEventListener('click', reiniciarContador);

function mostraTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);    /* Cria data em milissegundos a partir de hora 0 */
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});   /* Converte horário da data para minutos e segundos, ambos com 2 dígitos */
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostraTempo();