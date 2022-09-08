import React, { useState, useReducer } from "react";
import './App.scss';
import { v4 as uuid } from 'uuid';

const initialNoteState = {
  lastNoteCreated: null,
  totalNotes: 0,
  notes: [],
};

const notesReducer = (prevState, action) => {
  switch (action.type) {
      case 'ADD_NOTE': {
          const newState = { 
              notes: [...prevState.notes, action.payload],
              totalNotes: prevState.notes.length + 1,
              lastNoteCreated: new Date().toTimeString().slice(0, 8),
          };
          console.log('After ADD_NOTE: ', newState);
          return newState;
      }

      case 'DELETE_NOTE': {
          const newState = {
              ...prevState,
              notes: prevState.notes.filter(note => note.id !== action.payload.id),
              totalNotes: prevState.notes.length - 1,
          };
          console.log('After DELETE_NOTE: ', newState);
          return newState;
      }
      default: 
  }
};


function App() {

  const [noteInput, setNoteInput] = useState('');
  const [notesState, dispatch] = useReducer(notesReducer, initialNoteState);
  
  const addNote = event => {
    event.preventDefault();

    if(!noteInput) {
      return;
    }

    const newNote = {
      id: uuid(),
      text: noteInput,
      rotate: Math.floor(Math.random() * 20),
    };

    dispatch({type: 'ADD_NOTE', payload: newNote });
    setNoteInput('');
  };

  const dropNote = event => {
    event.target.style.left = `${event.pageX - 50}px`;
    event.target.style.top = `${event.pageY - 50}px`;
  }

  const dragOver = event => {
    event.stopPropagination();
    event.preventDefault();
  }

  return (
    <div className="app" onDragOver={dragOver}>
      <div className="wrapper">
        <h1>
          Sticky Notes ({notesState.totalNotes})
          <span>{notesState.totalNotes > 0 ? `Last note created: ${notesState.lastNoteCreated}` : ''}</span>
        </h1>
        <form onSubmit={addNote} className="form">
          <textarea 
          value={noteInput}
          onChange={e => setNoteInput(e.target.value)}
          placeholder="Create new note"></textarea>
          <button>Add</button>
        </form>
      </div>

    {notesState
      .notes
      .map(note => (
        <div className="note" 
        style={{transform: `rotate(${note.rotate}deg)`}}
        draggable='true'
        onDragEnd={dropNote}
        key={note.id}
        >
        <div onClick={() => dispatch({type: 'DELETE_NOTE', payload: note})} className="close">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </div>
          <pre className="text">{note.text}</pre>
        </div>
      ))
    }

    </div>
  );
}

export default App;
