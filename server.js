const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("./Develop/public"));


// Get Request
app.get("/api/notes", function(req, res) {
  readFileAsync("./Develop/db/db.json", "utf8").then(function(data) {
      notes = [].concat(JSON.parse(data))
      res.json(notes);
    })
}); 


// Post Request
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./Develop/db/db.json", "utf8").then(function(data) {
      const notes = [].concat(JSON.parse(data));
      note.id = notes.length + 1
      notes.push(note);
      return notes
    }).then(function(notes) {
      writeFileAsync("./Develop/db/db.json", JSON.stringify(notes))
      res.json(note);
    })
});


// Delete Request
app.delete("/api/notes/:id", function(req, res) {
  const deleteNotes = parseInt(req.params.id);
  readFileAsync("./Develop/db/db.json", "utf8").then(function(data) {
    const notes = [].concat(JSON.parse(data));
    const newNotesData = []
    for (let i = 0; i<notes.length; i++) {
      if(deleteNotes !== notes[i].id) {
        newNotesData.push(notes[i])
      }
    }
    return newNotesData
  }).then(function(notes) {
    writeFileAsync("./Develop/db/db.json", JSON.stringify(notes))
    res.send('Changes Saved');
  })
})


// HTML Routes
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
  });

app.get("/", function(req, res) {
     res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
  });

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
 });


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });