import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { fetchOpenGptData } from '../utils/api';
import './popup.css';

const App: React.FC<{}> = () => {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  const retrieveStorage = () => {
    chrome.storage.local.get(['inputText'], function (result) {
      console.log('Value currently is ' + result.inputText);
      setInput(result.inputText);
      handleSubmit(result.inputText);
    });
  };

  useEffect(() => {
    retrieveStorage()
  }, []);

  const handleChange = (event) => {
    setInput(event.target.value);
  }

  const handleSubmit = (inputValue) => {
    console.log("inputValue from selected value", inputValue)
    setIsLoading(true); // start loading
    fetchOpenGptData(inputValue)
      .then((res) => {
        console.log(res);
        // Navigate the response object to get the content
        if (res.choices && res.choices[0] && res.choices[0].message) {
          setResponse(res.choices[0].message.content);
        } else {
          setResponse("No content found in response");
        }
      })
      .catch((err) => {
        console.log(err);
        setResponse("Error occurred while fetching data");
      })
      .finally(() => {
        setIsLoading(false); // stop loading
      });
  }


  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit(input);
  }

  return (
    <div>
      <h1>Response from GPT:</h1>
      <form onSubmit={handleFormSubmit}>
        <input type="text" value={input} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {isLoading ? <p>Bot is typing...</p> : <p>{response}</p>}
    </div>
  );
}



const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
