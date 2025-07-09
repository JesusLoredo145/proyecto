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
            
        }
    }
});