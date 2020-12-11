import React, { useReducer, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'REMOVE':
      return currentIngredients.filter(item => item.id !== action.id);
    default:
      throw new Error('Shouldn\'t have reached here.');
  }
};

const httpReducer = (curHttpState, action) => {
  switch(action.type) {
    case 'SEND':
      return {...curHttpState, isLoading: true, err: null};
    case 'RESPONSE':
      return {...curHttpState, isLoading: false, err: null};
    case 'ERROR':
      return {...curHttpState, isLoading: false, err: action.error};
    case 'RESET':
      return {...curHttpState, isLoading: false, err: null};
    default:
      throw new Error('Shouldn\'t have reached here.');
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, httpDispath] = useReducer(httpReducer, { isLoading: false, err: null });

  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [err, setErr] = useState();

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

  
  console.log('RENDERING : Ingredients');

  const addIngredienthandler = useCallback((ingredient) => {
    httpDispath({type: 'SEND'});
    // setIsLoading(true);

    fetch('https://react-hook-90f4c-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      httpDispath({type: 'RESPONSE'});
      // setIsLoading(false);
      return response.json();
    }).then(responseData => {
      dispatch({ type: 'ADD', ingredient: {id: responseData.name, ...ingredient} });
      // setUserIngredients(prevIngredient => [
      //   ...prevIngredient,
      //   {id: responseData.name, ...ingredient}
      // ]);
    }).catch(error => {
      httpDispath({type: 'ERROR', error: 'Something went wrong!'});
      // setErr('Something went wrong!');
      // setIsLoading(false);
    });
  }, []);

  const removeIngredienthandler = useCallback((ingredientId) => {
    // httpDispath({type: 'SEND'});
    // setIsLoading(true);
    fetch(`https://react-hook-90f4c-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      httpDispath({type: 'RESPONSE'});
      // setIsLoading(false);
      dispatch({ type: 'REMOVE', id: ingredientId });
      // setUserIngredients(prevIngredients =>
      //   prevIngredients.filter(item => item.id !== ingredientId)
      // );
    }).catch(error => {
      httpDispath({type: 'ERROR', error: 'Something went wrong!'});
      // setErr('Something went wrong!');
      // setIsLoading(false);
    });
  }, []);

  const ingredientFilterHandler = useCallback((ingredients) => {
    dispatch({ type: 'SET', ingredients: ingredients });
    // setUserIngredients(ingredients);
  }, []);

  const clearError = useCallback(() => {
    httpDispath({type: 'RESET'});
    // setErr(null);
  }, []);

  const ingredeintList = useMemo(() => {
    return <IngredientList
              ingredients={userIngredients}
              onRemoveItem={removeIngredienthandler} />;
  }, [userIngredients, removeIngredienthandler]);

  return (
    <div className="App">
      {httpState.err && <ErrorModal onClose={clearError}>{httpState.err}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredienthandler} loading={httpState.isLoading} />
      <section>
        <Search onLoadIngredients={ingredientFilterHandler} />
        {ingredeintList}
      </section>
    </div>
  );
}

export default Ingredients;
