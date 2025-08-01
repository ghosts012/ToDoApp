class Task{
    constructor(id, name, desc, date, color, url){
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.date = date;
        this.color = color;
        this.url = url;
        this.isMarked = false;
    }
    toggle(){
        this.isMarked = !this.isMarked;
    }
}
export default Task;