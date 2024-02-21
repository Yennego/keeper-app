import React, { useState, useEffect } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { Fab, Zoom } from "@mui/material";
// import NoteAltIcon from "@mui/icons-material/NoteAlt";
// import Zoom from "@mui/material/Zoom";

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    setNote({
      title: props.selectedNote.title || "",
      content: props.selectedNote.content || "",
    });
  }, [props.update, props.selectedNote]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const submitNote = async (e) => {
    e.preventDefault();

    try {
      // console.log("props.selectedNote._id:", props.selectedNote._id);
      let data = {
        id: props.selectedNote.id,
        title: note.title.trim(),
        content: note.content.trim(),
      };
      console.log("data:", data);
      if (props.update) {
        await axios.put(`http://localhost:8000/api/update/${data.id}`, data);
        props.setSelectedNote({
          id: null,
          title: null,
          content: null,
        });
        props.setUpdate(false);
      } else {
        await axios.post("http://localhost:8000/api/addNew", note);
        setNote({
          title: "",
          content: "",
        });
      }

      props.getNotes();
    } catch (err) {
      console.log(err);
    }

    setNote({
      title: "",
      content: "",
    });
  };

  const expand = () => {
    setExpanded(true);
  };

  return (
    <div>
      <form className="create-note">
        {isExpanded ? (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
            autoFocus
          />
        ) : null}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? "3" : "1"}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
