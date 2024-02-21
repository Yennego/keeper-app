import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [update, setUpdate] = useState(false);
  const [selectedNote, setSelectedNote] = useState({
    id: null,
    title: "",
    content: "",
  });

  useEffect(() => {
    getNotes();
  }, [update]);

  async function getNotes() {
    try {
      const res = await axios.get("http://localhost:8000/api");
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  function addNote(newNote) {
    if (newNote.title.trim() === "" || newNote.content.trim() === "") {
      return;
    }
    axios
      .post("http://localhost:8000/api", newNote)
      .then(() => {
        setUpdate(!update);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteNote(id) {
    axios
      .delete(`http://localhost:8000/api/${id}`)
      .then(() => {
        setUpdate(!update);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function updateNote(id, updatedNote) {
    console.log("ID:", id);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/update/${id}`,
        updatedNote
      );
      if (response.status === 200) {
        // Note updated successfully, trigger an update
        setUpdate(!update);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header />
      <CreateArea
        onAdd={addNote}
        getNotes={() => getNotes()}
        update={update}
        setUpdate={(data) => setUpdate(data)}
        selectedNote={selectedNote}
        setSelectedNote={(d) => setSelectedNote(d)}
      />
      {notes.map((data) => (
        <Note
          id={data._id}
          key={data._id}
          title={data.title}
          content={data.content}
          getNotes={() => getNotes()}
          update={update}
          setUpdate={(data) => setUpdate(data)}
          setSelectedNote={(data) => setSelectedNote(data)}
          onDelete={deleteNote}
          onUpdate={(updatedNote) => updateNote(data._id, updatedNote)}
        />
      ))}
      <Footer />
    </>
  );
}
