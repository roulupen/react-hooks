import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  // Since we are already fethcing the initial data in search component so we don't need to
  // initialize the data, so the code is commented but kept for reference to how to call
  // a API call on laoding of a component
  // useEffect(() => {
  //   fetch('https://react-hook-90f4c-default-rtdb.firebaseio.com/ingredients.json')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       const loadedIngredients = [];
  //       for(const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         });
  //       }
  //       setUserIngredients(loadedIngredients);
  //     })
  // }, []);

  useEffect(() => console.log('Ingredients Component rendered.'));

  const addIngredienthandler = (ingredient) => {
    fetch('https://react-hook-90f4c-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredient => [
        ...prevIngredient,
        {id: responseData.name, ...ingredient}
      ]);
    });
  };

  const removeIngredienthandler = (ingredientId) => {
    setUserIngredients(prevIngredients =>
      prevIngredients.filter(item => item.id !== ingredientId)
    );
  };

  const ingredientFilterHandler = useCallback((ingredients) => {
    setUserIngredients(ingredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredienthandler} />

      <section>
        <Search onLoadIngredients={ingredientFilterHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredienthandler} />
      </section>
    </div>
  );
}

export default Ingredients;
