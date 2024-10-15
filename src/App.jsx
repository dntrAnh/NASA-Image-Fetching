import React, { useState } from 'react';
import './App.css';
import backgroundGif from './assets/images/universe.gif'; 
const App = () => {
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchImage = async () => {
    try {
      const response = await fetch('https://images-api.nasa.gov/search?media_type=image');
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.collection.items.length);
      const selectedImage = data.collection.items[randomIndex];
      const imgTags = selectedImage.data[0].keywords || [];

      const allowedTags = imgTags.filter(tag => !banList.includes(tag));

      setImage(selectedImage.links[0].href);
      setTags(allowedTags);
      setHistory((prevHistory) => [...prevHistory, selectedImage.data[0].title]);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleTagClick = (tag) => {
    setBanList((prevBanList) => [...prevBanList, tag]);
    setTags((prevTags) => prevTags.filter(t => t !== tag));
  };

  const removeTagFromBanList = (tag) => {
    setBanList((prevBanList) => prevBanList.filter(t => t !== tag));
  };

  const removeFromHistory = (item) => {
    setHistory((prevHistory) => prevHistory.filter(h => h !== item));
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${backgroundGif})` }}>
      <section className="history-section">
        <h2>History</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <button onClick={() => removeFromHistory(item)}>{item} (Remove)</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="main-section">
        <h1>Nasa Image Fetcher</h1>
        <button onClick={fetchImage}>Fetch New Image</button>
        {image && <img className="fetched-image" src={image} alt="NASA" />}
        {image && <h2>{history[history.length - 1]}</h2>}
        {tags.length > 0 && (
          <div className="tags">
            {tags.map((tag, index) => (
              <button key={index} onClick={() => handleTagClick(tag)}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="ban-section">
        <h2>Ban List</h2>
        <ul>
          {banList.map((item, index) => (
            <li key={index}>
              <button onClick={() => removeTagFromBanList(item)}>{item} (Unban)</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default App;
