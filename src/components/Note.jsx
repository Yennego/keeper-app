import axios from "axios";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Note(props) {
  const onEdit = async () => {
    props.setUpdate(true);
    props.setSelectedNote({
      id: props.id,
      title: props.title,
      content: props.content,
    });
  };

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:8000/api/delete/${id}`);
      props.getNotes();
      props.setSelectedNote({
        id: null,
        title: null,
        content: null,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="note" autoComplete="off">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={() => onEdit()}>
        <EditIcon />
      </button>
      <button onClick={() => handleDelete(props.id)}>
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
