import react from "react";
import NoteContext from "./NoteContext";
import { useState } from "react";
import Host from "../Host/Host";

const ContextState = (props) => {
  const notesData = [];

  const [notes, setNotes] = useState(notesData);

  // Get all gochar
  const getBlogs = async () => {
    const response = await fetch(`${Host}/api/blog/all`, {
      method: "GET",
    });
    const json = await response.json();
    // console.log(json, "json");
    setNotes(json);
  };



  return (
    <NoteContext.Provider
      value={{
        notes,
        getBlogs,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default ContextState;
