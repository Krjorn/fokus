const taskListContainer = document.querySelector('.app__section-task-list');
const formTask = document.querySelector('.app__form-add-task');
const formLabel = document.querySelector('.app__form-label');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task');
const textarea = document.querySelector('.app__form-textarea');
const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel');
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const btnDeletar = document.querySelector('.app__form-footer__button--delete');
const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas');
const btnDeletarTodas = document.querySelector('#btn-remover-todas');
const taskActiveDescription = document.querySelector('.app__section-active-task-description');

const localStorageTarefas = localStorage.getItem('tarefas');
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : [];

const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`;

let tarefaSelecionada = null;
let itemTarefaSelecionada = null;

let tarefaEmEdicao = null;
let paragrafoEmEdicao = null;

const selecionaTarefa = (tarefa, elemento) => {
    if(tarefa.concluida) {
        return;
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function(button) {
        button.classList.remove('app__section-task-list-item-active');
    });

    if(tarefaSelecionada == tarefa) {
        taskActiveDescription.textContent = null;
        itemTarefaSelecionada = null;
        tarefaSelecionada = null;
        return;
    }

    // EDITAR AO SELECIONAR OUTRO ITEM
    // if(!formTask.classList.contains('hidden')) {
    //     selecionaTarefaParaEditar(tarefa, elemento.querySelector('p'));
    // }

    tarefaSelecionada = tarefa;
    itemTarefaSelecionada = elemento;
    taskActiveDescription.textContent = tarefa.descricao;
    elemento.classList.add('app__section-task-list-item-active');
};

const clearForm = () => {
    tarefaEmEdicao = null;
    paragrafoEmEdicao = null;
    textarea.value = '';
    formTask.classList.add('hidden');
};

const selecionaTarefaParaEditar = (tarefa, elemento) => {
    if(tarefaEmEdicao == tarefa) {
        clearForm();
        return;
    }

    formLabel.textContent = 'Editando tarefa';
    tarefaEmEdicao = tarefa;
    paragrafoEmEdicao = elemento;
    textarea.value = tarefa.descricao;
    formTask.classList.remove('hidden');
};

function createTask(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg;

    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description');
    paragrafo.textContent = tarefa.descricao;

    const editIcon = document.createElement('img');
    editIcon.setAttribute('src', './imagens/edit.png')

    const button = document.createElement('button');
    button.classList.add('app_button-edit');
    button.appendChild(editIcon);

    button.addEventListener('click', (evento) => {
        if(tarefa === tarefaSelecionada) {
            evento.stopPropagation();
            selecionaTarefaParaEditar(tarefa, paragrafo);
        }
    });

    li.addEventListener('click', () => {
        selecionaTarefa(tarefa, li);
    });

    svgIcon.addEventListener('click', (evento) => {
        if(tarefa === tarefaSelecionada) {
            evento.stopPropagation();
            button.setAttribute('disabled', true);
            li.classList.add('app__section-task-list-item-complete');
            li.classList.remove('app__section-task-list-item-active');
            tarefaSelecionada.concluida = true;
            updateLocalStorage();
        }
    });

    if(tarefa.concluida) {
        button.setAttribute('disabled', true);
        li.classList.add('app__section-task-list-item-complete');
    }

    li.appendChild(svgIcon);
    li.appendChild(paragrafo);
    li.appendChild(button);

    return li;
}

tarefas.forEach(tarefa => {
    const taskItem = createTask(tarefa);
    taskListContainer.appendChild(taskItem);
});

cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden');
});

btnCancelar.addEventListener('click', clearForm);

btnDeletar.addEventListener('click', () => {
    if(tarefaSelecionada) {
        const index = tarefas.indexOf(tarefaSelecionada);

        if(index !== -1) {
            tarefas.splice(index, 1);
        }

        itemTarefaSelecionada.remove();
        tarefas.filter(t => t != tarefaSelecionada);
        tarefaSelecionada = null;
        itemTarefaSelecionada = null;
    }

    updateLocalStorage();
    clearForm();
});

function removerTarefas(somenteConcluidas) {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(elemento => elemento.remove());

    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : [];

    updateLocalStorage();
}

btnDeletarConcluidas.addEventListener('click', () => removerTarefas(true));

btnDeletarTodas.addEventListener('click', () => removerTarefas(false));

toggleFormTaskBtn.addEventListener('click', () => {
    // REMOVE SELEÇÃO DE ITEM AO CRIAR NOVO
    // if(tarefaSelecionada) {
    //     document.querySelectorAll('.app__section-task-list-item-active').forEach(function(button) {
    //         button.classList.remove('app__section-task-list-item-active');
    //     });

    //     tarefaSelecionada = null;
    //     itemTarefaSelecionada = null;
    //     taskActiveDescription.textContent = null;
    // }
    
    formLabel.textContent = 'Adicionando tarefa';
    clearForm();
    formTask.classList.remove('hidden');
});

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
};

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if(tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textarea.value;
        paragrafoEmEdicao.textContent = textarea.value;
    } else {
        const task = {
            descricao: textarea.value,
            concluida: false
        };
    
        tarefas.push(task);
        const taskItem = createTask(task);
        taskListContainer.appendChild(taskItem);
    }

    updateLocalStorage();
    clearForm();
});

document.addEventListener('TarefaFinalizada', function(e) {
    if(tarefaSelecionada) {
        tarefaSelecionada.concluida = true;
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        itemTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true);
        updateLocalStorage();
    }
});