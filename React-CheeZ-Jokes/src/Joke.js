import React from "react";
import "./Joke.css";

/** A single joke, along with vote up/down buttons. */
const Joke = ({ id, vote, votes, text, isLocked, toggleLock }) => {
  return (
    <div className={`Joke ${isLocked ? "Joke-locked" : ""}`}>
      <div className="Joke-votearea">
        <button onClick={() => vote(id, +1)}>
          <i className="fas fa-thumbs-up" />
        </button>
        <button onClick={() => vote(id, -1)}>
          <i className="fas fa-thumbs-down" />
        </button>
        {votes}
      </div>
      <div className="Joke-text">{text}</div>
      <button onClick={() => toggleLock(id)}>
        {isLocked ? "Unlock" : "Lock"}
      </button>
    </div>
  );
};

export default Joke;

