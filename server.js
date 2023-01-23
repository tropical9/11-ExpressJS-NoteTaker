const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");
const uuid = require('uuid');
const app = express();

var PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const dltNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id); 
    fs.writeFileSync("./db/db.json", JSON.stringify(dltNote));
    res.json(dltNote);
})
//should return index html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//should return notes html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
//should return db 
app.get("/api/notes", (req, res) => 
    res.sendFile(path.join(__dirname, "/db/db.json"))
);
//should return new note
app.post("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4(); 
    notes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(notes);
});

app.listen(PORT, function () {
    console.log(`Example app listening at http://localhost:${PORT} 🚀`)
});