//to call bindevents after page load
import { doAjax } from "../data/services/ajax.js";
import TASK_OPERATIONS from "../data/services/task-operations.js";
window.addEventListener('load', init);
function init(){
    bindEvents();
    showRecords();
    disable();
}
function bindEvents(){
    document.getElementById('add').addEventListener('click', addTask);
    document.querySelector('#delete').addEventListener('click', deleteForever);
    document.querySelector('#save').addEventListener('click', save);
    document.querySelector('#load').addEventListener('click', load);
    document.querySelector('#update').addEventListener('click', update);
    document.querySelector('#load-from-server').addEventListener('click', loadFromServer);
    document.querySelector('#clearall').addEventListener('click', clearAll);
}
function clearAll(){
    document.querySelector('#total').value = '';
    document.querySelector('#mark').value = '';
    document.querySelector('#unmark').value = '';
    document.querySelector('#tasks').innerHTML = '';
}
async function loadFromServer(){
    try{
        const result = await doAjax();
        console.log('Result of Task JSON is ', result);
        TASK_OPERATIONS.tasks = result['tasks'];
        printTaskTable( TASK_OPERATIONS.getTasks() );
        showRecords();
    }
    catch(err){
        alert("Some error");
        console.log(err);
    }
}
function update(){
    for( let field of fields ){
        taskObject[field] = document.querySelector(`#${field}`).value;
    }
    printTaskTable( TASK_OPERATIONS.getTasks() );
    showRecords(); 
}
function save(){
    if( window.localStorage ){
        const tasks = TASK_OPERATIONS.getTasks();
        console.log(tasks);
        console.log(tasks.length);
        localStorage.tasks = JSON.stringify( tasks );
        alert("Data Stored");
    }
    else{
        alert("Outdated browser");
    }
}
function load(){
    if( window.localStorage ){
        if( localStorage.tasks ){
            const tasks = JSON.parse( localStorage.tasks );
            printTaskTable(tasks);
            showRecords();
        }
        else{
            alert("No data to load");
        }
    }
    else{
        alert("Outdated browser");
    }
}
function deleteForever(){
    const tasks = TASK_OPERATIONS.remove();
    printTaskTable(tasks);
    showRecords();
}
function printTaskTable(tasks){
    document.querySelector('#tasks').innerHTML = '';
    tasks.forEach(taskObject=>printTask(taskObject));  
}
function disable(){
    document.querySelector('#delete').setAttribute("disabled", true);
    document.querySelector('#update').setAttribute("disabled", true);
}
const fields = ['id', 'name', 'desc', 'date', 'color', 'url'];
function addTask(){
    const generic_task = {};
    for( let field of fields){
        let fieldValue = document.querySelector(`#${field}`).value;
        generic_task[field] = fieldValue;
    }
    TASK_OPERATIONS.add(generic_task);
    printTask(generic_task);
    showRecords();
    clearFields();
}
let taskObject; 
function edit(){
    const icon = this;
    const taskId = icon.getAttribute('taskId');
    taskObject = TASK_OPERATIONS.search(taskId);
    if( taskObject ){
        for( let key in taskObject ){
            if( key === 'isMarked' ){
                continue;
            }
            document.querySelector(`#${key}`).value = taskObject[key];
        }
        document.querySelector('#update').disabled = false;
    }
}
function clearFields(){
    for( let field of fields ){
        if( field === 'color' ){
            document.querySelector(`#${field}`).value = '#000000';
            continue;   
        }
        document.querySelector(`#${field}`).value = '';
    }
    document.querySelector('#id').focus();
}
function toggleDelete(){
    let icon = this;
    const tr = icon.parentNode.parentNode;
    const taskId = icon.getAttribute('taskId');
    TASK_OPERATIONS.toggleMark(taskId);
    tr.classList.toggle('alert');
    showRecords();
    const isDelete = TASK_OPERATIONS.getMarkSize()>0?false : true;
    document.querySelector('#delete').disabled = isDelete;
}
function createIcon(iconClass, fn, taskId){
    const iconTag = document.createElement('i');
    iconTag.className = `fa-solid ${iconClass} hand`;
    iconTag.addEventListener('click', fn);
    iconTag.setAttribute("taskId", taskId);
    return iconTag;
}
function createImage(url){
    const imageTag = document.createElement('img');
    imageTag.src = url;
    imageTag.className = 'size';
    return imageTag;
}
function printTask(generic_task){
    const tbody = document.querySelector('#tasks');
    const tr = tbody.insertRow();
    for( let key in generic_task ){
        if( key === 'isMarked' ){
            continue;
        } 
        else if( key === 'url' ){
            let td = tr.insertCell();
            td.appendChild(createImage(generic_task[key]));
            continue;
        } 
        else if( key == 'color' ){
            let td = tr.insertCell();
            const color = generic_task[key];
            td.style = "background-color : " + color;
            continue;
        }
        
        let td = tr.insertCell();
        td.innerText = generic_task[key];
    }
    let td = tr.insertCell();
    td.appendChild(createIcon("fa-pen-to-square", edit, generic_task.id));
    td.appendChild(createIcon("fa-trash", toggleDelete, generic_task.id));

}
function showRecords(){
    document.querySelector('#total').innerText = TASK_OPERATIONS.getSize();
    document.querySelector('#mark').innerText = TASK_OPERATIONS.getMarkSize();
    document.querySelector('#unmark').innerText = TASK_OPERATIONS.getUnmarkSize();
}