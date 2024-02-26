var DeleteType;
(function (DeleteType) {
    DeleteType[DeleteType["SELECTED"] = 0] = "SELECTED";
    DeleteType[DeleteType["FINISHED"] = 1] = "FINISHED";
    DeleteType[DeleteType["ALL"] = 2] = "ALL";
})(DeleteType || (DeleteType = {}));
const loadState = () => {
    const stateInLocalStorage = localStorage.getItem('state');
    return stateInLocalStorage ? JSON.parse(stateInLocalStorage) : {
        tasks: [],
        selectedTask: null,
        edit: false
    };
};
let state = loadState();
const selectTask = (state, task) => {
    if (task.finished) {
        return state;
    }
    return {
        ...state,
        selectedTask: task.id === state.selectedTask?.id ? null : task,
        edit: false
    };
};
const addTask = (state, task) => {
    return {
        ...state,
        tasks: [...state.tasks, task]
    };
};
const resetForm = () => {
    const formAddTask = document.querySelector('.app__form-add-task');
    const textarea = document.querySelector('.app__form-textarea');
    state.edit = false;
    textarea.value = '';
    formAddTask.classList.add('hidden');
};
const saveState = () => localStorage.setItem('state', JSON.stringify(state));
const deleteTask = (state, deleteType) => {
    const newState = { ...state };
    if (deleteType === DeleteType.SELECTED) {
        newState.tasks = newState.tasks.filter(task => task.id !== newState.selectedTask?.id);
        newState.selectedTask = null;
    }
    if (deleteType === DeleteType.FINISHED) {
        newState.tasks = newState.tasks.filter(task => !task.finished);
    }
    if (deleteType === DeleteType.ALL) {
        newState.tasks = [];
        newState.selectedTask = null;
    }
    return newState;
};
const getID = () => {
    const date = new Date();
    const dateToString = date.toLocaleString('pt-br', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3
    });
    return dateToString;
};
const getSelectedTask = () => {
    if (state.selectedTask) {
        state.selectedTask = state.tasks.find(task => task.id === state.selectedTask.id);
    }
};
const updateUI = () => {
    const pOngoingTask = document.querySelector('.app__section-active-task-description');
    const btnDeleteFinished = document.querySelector('#btn-remover-concluidas');
    const btnDeleteAll = document.querySelector('#btn-remover-todas');
    const ulTasks = document.querySelector('.app__section-task-list');
    const formAddTask = document.querySelector('.app__form-add-task');
    const formLabel = document.querySelector('.app__form-label');
    const textarea = document.querySelector('.app__form-textarea');
    const btnDeleteSelected = document.querySelector('.app__form-footer__button--delete');
    const btnCancelForm = document.querySelector('.app__form-footer__button--cancel');
    const btnAddTask = document.querySelector('.app__button--add-task');
    pOngoingTask.innerHTML = state.selectedTask ? state.selectedTask.description : '';
    if (ulTasks) {
        ulTasks.innerHTML = '';
    }
    const taskIconSvg = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF" />
            <path
                d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E" />
        </svg>
    `;
    state.tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('app__section-task-list-item');
        const btnFinishTask = document.createElement('svg');
        btnFinishTask.innerHTML = taskIconSvg;
        btnFinishTask.addEventListener('click', e => {
            if (task.id === state.selectedTask?.id) {
                e.stopPropagation();
                state.selectedTask = null;
                task.finished = true;
                resetForm();
                updateUI();
            }
        });
        const paragraph = document.createElement('p');
        paragraph.classList.add('app__section-task-list-item-description');
        paragraph.textContent = task.description;
        const btnEditTask = document.createElement('button');
        btnEditTask.classList.add('app_button-edit');
        const editIcon = document.createElement('img');
        editIcon.setAttribute('src', './imagens/edit.png');
        btnEditTask.appendChild(editIcon);
        btnEditTask.addEventListener('click', e => {
            if (task.id === state.selectedTask?.id) {
                e.stopPropagation();
                state.edit = true;
                textarea.value = task.description;
                formLabel.textContent = 'Editando tarefa';
                formAddTask.classList.remove('hidden');
            }
        });
        if (task.finished) {
            btnEditTask.setAttribute('disabled', 'true');
            li.classList.add('app__section-task-list-item-complete');
        }
        if (task.id === state.selectedTask?.id) {
            li.classList.add('app__section-task-list-item-active');
        }
        li.appendChild(btnFinishTask);
        li.appendChild(paragraph);
        li.appendChild(btnEditTask);
        li.addEventListener('click', () => {
            state = selectTask(state, task);
            updateUI();
        });
        ulTasks?.appendChild(li);
    });
    if (!btnAddTask) {
        throw new Error('Element "btnAddTask" not found!');
    }
    btnDeleteFinished.onclick = () => {
        state = deleteTask(state, DeleteType.FINISHED);
        updateUI();
    };
    btnDeleteAll.onclick = () => {
        state = deleteTask(state, DeleteType.ALL);
        updateUI();
    };
    btnAddTask.onclick = () => {
        formLabel.textContent = 'Adicionando tarefa';
        resetForm();
        formAddTask?.classList.remove('hidden');
        textarea.focus();
    };
    btnDeleteSelected.onclick = () => {
        if (state.selectedTask && state.edit) {
            state = deleteTask(state, DeleteType.SELECTED);
            resetForm();
            updateUI();
        }
    };
    btnCancelForm.onclick = () => {
        resetForm();
    };
    textarea.onkeydown = e => {
        if (e.code === 'Enter') {
            e.preventDefault();
            formAddTask.requestSubmit();
        }
    };
    formAddTask.onsubmit = e => {
        e.preventDefault();
        const description = textarea.value;
        if (state.selectedTask && state.edit) {
            state.selectedTask.description = description;
            resetForm();
            updateUI();
            return;
        }
        state = addTask(state, {
            description,
            finished: false,
            id: getID()
        });
        resetForm();
        updateUI();
    };
    saveState();
};
document.addEventListener('TarefaFinalizada', () => {
    if (state.selectedTask) {
        state.selectedTask.finished = true;
        state.selectedTask = null;
        resetForm();
        updateUI();
    }
});
getSelectedTask();
updateUI();
