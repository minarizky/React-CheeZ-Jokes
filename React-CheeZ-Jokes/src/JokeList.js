import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** Custom hook to manage local storage */
const useLocalStorage = (key, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (err) {
      console.error(err);
      return defaultValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue];
};

const JokeList = ({ numJokesToGet = 5 }) => {
  const [jokes, setJokes] = useLocalStorage("jokes", []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (jokes.length === 0) fetchJokes();
  }, []);

  /** Fetch jokes from API */
  const fetchJokes = async () => {
    setIsLoading(true);
    try {
      let newJokes = [];
      let seenJokes = new Set(jokes.map(j => j.id));

      while (newJokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          newJokes.push({ ...joke, votes: 0, isLocked: false });
          seenJokes.add(joke.id);
        }
      }

      setJokes(jokes => [...jokes.filter(j => j.isLocked), ...newJokes]);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  /** Vote on a joke */
  const vote = (id, delta) => {
    setJokes(jokes =>
      jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  };

  /** Reset votes and clear local storage */
  const resetVotes = () => {
    setJokes([]);
    window.localStorage.removeItem("jokes");
  };

  /** Lock or unlock a joke */
  const toggleLock = (id) => {
    setJokes(jokes =>
      jokes.map(j => (j.id === id ? { ...j, isLocked: !j.isLocked } : j))
    );
  };

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={fetchJokes}>
        Get New Jokes
      </button>
      <button className="JokeList-reset" onClick={resetVotes}>
        Reset Jokes
      </button>

      {sortedJokes.map(j => (
        <Joke
          key={j.id}
          id={j.id}
          votes={j.votes}
          text={j.joke}
          vote={vote}
          isLocked={j.isLocked}
          toggleLock={toggleLock}
        />
      ))}
    </div>
  );
};

export default JokeList;
