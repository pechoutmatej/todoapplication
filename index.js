const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");
const { compileETag } = require("express/lib/utils");

dotenv.config();
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));


//mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
});

app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
});
app.route("/done").get((req, res) => {

    TodoTask.find({completed:true}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
        });
});
app.route("/jsonView").get((req, res) => {
    //download json of all tasks
    var tasksJson;
    const fs = require('fs')
    TodoTask.find({}, (err, tasks) => {
        const data = JSON.stringify(tasks);
        fs.writeFile('tasks.json', data, (err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });
    });
    var file = fs.readFileSync('tasks.json');
    var jsonObject = JSON.parse(file);
    res.json(jsonObject);
    
    res.redirect("/");
});
app
    .route("/edit/:id")
    .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
    })
    .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content, completed: req.body.completed }, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
});

app.route("/update/:id").get((req,res)=>{
    /*var todo = TodoTask.findById(req.params.id);
    console.log(todo.content);
    if(todo.completed == undefined)
        todo.completed = false;
    else
        todo.completed = !todo.completed;
    TodoTask.updateOne({id:req.params.id},{$set: {completed:!(todo.completed)}},(err)=>{
        if(err) return res.send(500, err);
        res.redirect("/");
    });*/
    /*
    TodoTask.findByIdAndUpdate(req.params.id,{$set: {completed:!(req.body.completed)}},(err)=>{
        console.log('completed: '+req.body.completed);
        if(err) return res.send(500, err);
        res.redirect("/");
    });*/
    TodoTask.updateOne({_id:req.params.id},{completed:!(req.body.completed)},(err)=>{
        //console.log('completed: '+req.body.completed);
        if(err) return res.send(500, err);
        res.redirect("/");
    });
});

app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    console.log(id);
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });