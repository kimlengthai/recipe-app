import { createContext, useState } from "react";

export const GlobalContext = createContext(null);

export default function GlobalState({children}) {
    const [searchParam, setSearchParam] = useState('');
    const [loading, setLoading] = useState(false);
    const [recipeList, setRecipeList] = useState([]);
    const [recipeDetailsData, setRecipeDetailsData] = useState(null);
    const [favoritesList, setFavoritesList] = useState([]);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`);
            
            const data = await res.json();
            if (data?.data?.recipes) {
                setRecipeList(data.data.recipes);
            } else {
                setRecipeList([]);
            }
            setLoading(false);
            setSearchParam('');
        } catch (error) {
            console.log(error);
            setLoading(false);
            setSearchParam('');
        }
    }    

    function handleAddToFavorite(getCurrentItem) {
        console.log(getCurrentItem);
        setFavoritesList(prevFavorites => [...prevFavorites, getCurrentItem]);
    }

    return (
        <GlobalContext.Provider value={{ searchParam, loading, recipeList, setSearchParam, handleSubmit, recipeDetailsData, setRecipeDetailsData, handleAddToFavorite }}>
            {children}
        </GlobalContext.Provider>
    );
}