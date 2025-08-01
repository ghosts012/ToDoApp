import Task from "../models/task.js";
const TASK_OPERATIONS = {
    tasks: [],
    getTasks() {
        return this.tasks;
    },
    getSize() {
        return this.tasks.length;
    },
    getMarkSize() {
        return this.tasks.filter(taskObject => taskObject.isMarked).length;
    },
    getUnmarkSize() {
        return this.getSize() - this.getMarkSize();
    },
    add(generic_task) {
        let task = new Task();
        for (let key in generic_task) {
            task[key] = generic_task[key];
        }
        this.tasks.push(task);
        console.log("All tasks are: ", this.tasks);
    },
    remove() {
        this.tasks = this.tasks.filter(taskObject => !taskObject.isMarked);
        return this.tasks;
    },
    search(taskId) {
        return this.tasks.find(generic_task => generic_task.id === taskId);
    },
    update() {

    },
    sort() {

    },
    toggleMark(taskId) {
        const taskObject = this.search(taskId);
        if (taskObject) {
            taskObject.toggle();
        }
    }
}
export default TASK_OPERATIONS;