import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const { onLoadIngredients } = props;
  const inputRef = useRef();

  useEffect(() => {

    // This SetTime out executes after every 500 secs and inside the setTimeout
    // we are comparing current value by reference with the value enter 500 ms 
    // if it's equal then we are sending the API request
    // By this we are making sure after typing when user takes a pause then we are sending the request
    setTimeout(() => {
      if(enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hook-90f4c-default-rtdb.firebaseio.com/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            for(const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            
            onLoadIngredients(loadedIngredients);
          })
      }
    }, 500);
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value) } />
        </div>
      </Card>
    </section>
  );
});

export default Search;
