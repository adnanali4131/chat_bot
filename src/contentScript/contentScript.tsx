import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './contentScript.css';
import { fetchOpenGptData } from '../utils/api';
import { Remarkable } from 'remarkable';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);

const md = new Remarkable({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (error) {
        console.error(error);
      }
    }
    try {
      return hljs.highlightAuto(str).value;
    } catch (error) {
      console.error(error);
    }
    return '';
  },
});

const App: React.FC<{}> = () => {
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState([]);

  const handleGPTButtonClick = () => {
    setShowInput(true);
    setInputText('');
  };

  const handleCancelButtonClick = () => {
    setShowInput(false);
    setInputText('');
  };

  const handleSubmit = () => {
    chrome.storage.local.set({ 'inputText': inputText }, function () {
      console.log('Value is set to ' + inputText);
    });
    setIsLoading(true);
    fetchOpenGptData(inputText)
      .then((res) => {
        if (res.choices && res.choices[0] && res.choices[0].message) {
          setResponses(prevResponses => [...prevResponses, { question: inputText, response: res.choices[0].message.content }]);
        } else {
          setResponses(prevResponses => [...prevResponses, { question: inputText, response: "No content found in response" }]);
        }
      })
      .catch((err) => {
        console.log(err);
        setResponses(prevResponses => [...prevResponses, "Error occurred while fetching data"]);
      })
      .finally(() => {
        setIsLoading(false);
        setInputText('');
      });
  };

  const isCode = (response) => {
    return response.includes('```');
  };

  const extractCodeBlocks = (response) => {
    const codeRegex = /```([\s\S]*?)```/g;
    const codeBlocks = response.match(codeRegex);

    if (codeBlocks) {
      return codeBlocks.map((codeBlock, index) => {
        const codeContent = codeBlock.slice(3, -3).trim();
        const highlightedCode = hljs.highlightAuto(codeContent).value;

        return (
          <pre className="response code-response" key={index}>
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }}></code>
          </pre>
        );
      });
    }

    return null;
  };

  return (
    <div className="app-container">
      {showInput ? (
        <div className="input-container" style={{ height: responses.length > 0 ? '600px' : '150px' }}>
          {responses.map((responseObj, index) => (
            <div key={index}>
              <p className="question">{responseObj.question}</p>
              {isCode(responseObj.response) ? (
                extractCodeBlocks(responseObj.response)
              ) : (
                <p className="response" dangerouslySetInnerHTML={{ __html: md.render(responseObj.response) }}></p>
              )}
            </div>
          ))}
          <div className="user_inputs">
            <div className="loading-container">
              {isLoading && <p>Bot is typing...</p>}
            </div>
            <span className="input_data">
              <input
                type="text"
                placeholder="Type something..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button className="cancel-btn" onClick={handleCancelButtonClick}>
                Cancel
              </button>
              <button type="submit" onClick={handleSubmit}>
                Submit
              </button>
            </span>
          </div>
        </div>
      ) : (
        <button className="gpt-button" onClick={handleGPTButtonClick}>GPT</button>
      )}
    </div>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);


