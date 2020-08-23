const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const port = 3000;

const mainDir = path.join(__dirname, "/public");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", function (req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.post("/api/notes", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNotes = req.body;
    let uniqueID = (savedNotes.length).toString();
    
    newNotes.id = uniqueID;
    savedNotes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

app.delete("/api/notes/:id", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let idNote = req.params.id;
    let newID = 0;
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != idNote;
    })
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})
app.listen(port, function () {
})