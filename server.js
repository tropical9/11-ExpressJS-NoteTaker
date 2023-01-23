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

//should read the db.json file and return all saved notes as JSON
app.get("/api/notes", (req, res) => 
    res.sendFile(path.join(__dirname, "/db/db.json"))
);

//should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. 
app.post("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(notes);
});

// should receive a query parameter containing the id of a note to delete, read all notes from the db.json file, remove the note with the given id property, and then rewrite the db.json.
app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const dltNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(dltNote));
    res.json(dltNote);
})



app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


app.listen(PORT, function () {
    console.log(`Example app listening at http://localhost:${PORT} 🚀`)
});