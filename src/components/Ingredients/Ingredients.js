import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState();

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

  
  useEffect(
    () => console.log('Ingredients Component rendered.'),
    [userIngredients]
  );

  const addIngredienthandler = (ingredient) => {
    setIsLoading(true);
    fetch('https://react-hook-90f4c-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredient => [
        ...prevIngredient,
        {id: responseData.name, ...ingredient}
      ]);
    }).catch(error => {
      setErr('Something went wrong!');
      setIsLoading(false);
    });
  };

  const removeIngredienthandler = (ingredientId) => {
    setIsLoading(true);
    fetch(`https://react-hook-90f4c-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(item => item.id !== ingredientId)
      );
    }).catch(error => {
      setErr('Something went wrong!');
      setIsLoading(false);
    });
  };

  const ingredientFilterHandler = useCallback((ingredients) => {
    setUserIngredients(ingredients);
  }, []);

  const clearError = () => {
    setErr(null);
  };

  return (
    <div className="App">
      {err && <ErrorModal onClose={clearError}>{err}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredienthandler} loading={isLoading} />
      <section>
        <Search onLoadIngredients={ingredientFilterHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredienthandler} />
      </section>
    </div>
  );
}

export default Ingredients;
