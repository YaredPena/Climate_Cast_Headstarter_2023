import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Search from './components/search/search';
import Forecast from './components/search/forecast/forecast';
import CurrentWeather from './components/search/current-weather/current-weather';
import { WEATHER_API_URL, WEATHER_API_KEY, NEWS_API_KEY, OPENAI_API_KEY } from './api';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [data, setData] = useState([]);
  const [showNews, setShowNews] = useState(false);
  const [searchedCity, setSearchedCity] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/chat", { prompt })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(' ');
    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
        setSearchedCity(searchData.label);

        axios
          .get(`https://newsapi.org/v2/everything?q=${searchData.label}&apiKey=${NEWS_API_KEY}`)
          .then((response) => {
            setData(response.data.articles);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (searchedCity) {
      axios
        .get(`https://newsapi.org/v2/everything?q=${searchedCity}&apiKey=${NEWS_API_KEY}`)
        .then((response) => {
          setData(response.data.articles);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [searchedCity]);

  const getNews = () => {
    setShowNews(true);
  };

  /*const askQuestion = async () => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci/completions',
        {
          prompt: question,
          max_tokens: 100,
          temperature: 0.7,
          n: 1,
          stop: '\n',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const answer = response.data.choices[0].text.trim();
      setAnswer(answer);
    } catch (error) {
      console.log(error);
    }
  };
  */

  return (
    <div className="container">
      <h1 className="Title">Climate Cast</h1>
      <div className="row">
        <div className="col-lg-6">
          <Search onSearchChange={handleOnSearchChange} />
          {currentWeather && <CurrentWeather data={currentWeather} />}
          {forecast && <Forecast data={forecast} />}
        </div>
        <div className="col-lg-6">
          {!showNews && (
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary" onClick={getNews}>
                News
              </button>
            </div>
          )}
          {showNews && (
            <div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ask a question"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleSubmit}>
                  Ask
                </button>
              </div>
              {response && (
                <div className="card mb-3" style={{ backgroundColor: 'rgba(240, 240, 240, 0.6)' }}>
                  <div className="card-body">
                    <h5 className="card-title">Answer:</h5>
                    <p className="card-text">{response}</p>
                  </div>
                </div>
              )}
              <div className="row">
                {data.slice(0, 6).map((value) => (
                  <div className="col-6 col-md-4" key={value.title}>
                    <div className="card mb-3" style={{ backgroundColor: 'rgba(240, 240, 240, 0.6)' }}>
                      <img src={value.urlToImage} className="card-img-top" alt="..." />
                      <div className="card-body">
                        <h5 className="card-title" style={{ fontSize: '14px' }}>
                          {value.title}
                        </h5>
                        <p className="card-text" style={{ fontSize: '12px' }}>
                          {value.description}
                        </p>
                        <a href={value.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

//Search bar with 2 widgets current weather 3rd = forecast

/*                 <button className='btn btn-danger' onClick={getNews}> News </button>
      <div className="container">
        <div className="row">

                </div>
      </div>
    </div>

                data.map((value) => {
              return (
                <>

                </>
              );

            })
          }

<div className="col-3">
                    <div className="card h-50" style={{ width: "18rem" }}>
                      <img src={value.urlToImage} class="card-img-top" alt="..." />
                      <div className="card-body">
                        <h5 class="card-title">{value.title}</h5>
                        <p class="card-text">{value.description}</p>
                        <a href="#" class="btn btn-primary">Main News</a>
                      </div>
                    </div>
                  </div>*/

/*useEffect(() => {
    axios
      .get("https://newsapi.org/v2/top-headlines?country=us&apiKey=58502e6444d04a4da079e8225b1626d7")
      .then((response) => {
        setData(response.data.articles);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);*/