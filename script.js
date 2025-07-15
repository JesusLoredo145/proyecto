//espera a que el dom este completamente cargado
document.addEventListener('DOMContentLoaded', function(){
    //referencias a elementos del dom
    const addButton=document.getElementById('agrega');
    const taskInput=document.getElementById('tareas');
    const taskList=document.getElementById('pendingTasks');

    //cargar tareas al iniciar la pagina
    loadTasks();//pendiente a la base de datos
    
    //detecta clic en el boton add
    addButton.addEventListener('click', function(){
        addTask();
    });

    //permite agregar tareas presionando enter
    taskInput.addEventListener('keypress', function(e){
        if(e.key === 'Enter'){
            addTask();
        } 
    });

    //funcion para agregar una nueva tarea
    async function addTask(){
        //obtiene el texto de la tarea desde el input
        const taskText=taskInput.ariaValueMax.trim();
        //valida que el campo no se deje vacio
        if(taskText===''){
            showError('Ingrese una tarea valida');
            return;
        }
        //limpia el mensaje de error
        clearError();

        try{
            // enviar informacin al servidor
            const response = await fetch('add_task.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: taskText
                })
            });

            // Verificar si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const result = await response.json();

            // Verificar si el servidor procesó correctamente la tarea
            if (result.success) {
                // Limpiar el input
                taskInput.value = '';
                
                // Volver a cargar la lista de tareas
                await loadTasks();
                
                console.log('Tarea agregada exitosamente');
            } else {
                showError(result.message || 'Error al agregar la tarea');
            }

        } catch (error) {
            console.error('Error al agregar tarea:', error);
            showError('Error de conexión. Por favor, intenta nuevamente.');
        }
    }

    // Función para cargar las tareas desde el servidor
    async function loadTasks() {
        try {
            const response = await fetch('get_tasks.php');
            
            if (!response.ok) {
                throw new Error('Error al cargar tareas');
            }

            const tasks = await response.json();
            
            // Limpiar la lista actual
            taskList.innerHTML = '';
            
            // Agregar cada tarea a la lista
            tasks.forEach(task => {
                const taskElement = createTaskElement(task);
                taskList.appendChild(taskElement);
            });

        } catch (error) {
            console.error('Error al cargar tareas:', error);
            showError('Error al cargar las tareas');
        }
    }

    // Función para crear un elemento de tarea en el DOM
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-text">${escapeHtml(task.text)}</span>
            <span class="task-date">${task.date}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
        `;
        return li;
    }

    // Función para mostrar mensajes de error
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        } else {
            alert(message);
        }
    }

    // Función para limpiar mensajes de error
    function clearError() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }

    // Función para escapar HTML y prevenir XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Función global para eliminar tareas (opcional)
    window.deleteTask = async function(taskId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            try {
                const response = await fetch('delete_task.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: taskId
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    await loadTasks();
                } else {
                    showError('Error al eliminar la tarea');
                }
            } catch (error) {
                console.error('Error al eliminar tarea:', error);
                showError('Error de conexión al eliminar la tarea');
            }
        }
    };
});

// Versión alternativa usando XMLHttpRequest (para navegadores más antiguos)
function addTaskXHR() {
    const taskText = document.getElementById('taskInput').value.trim();
    
    if (taskText === '') {
        alert('Por favor, ingresa una tarea válida');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'add_task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                if (result.success) {
                    document.getElementById('taskInput').value = '';
                    loadTasksXHR();
                } else {
                    alert('Error al agregar la tarea');
                }
            } else {
                alert('Error de conexión');
            }
        }
    };
    
    xhr.send(JSON.stringify({
        task: taskText
    }));
        }
    }
});
