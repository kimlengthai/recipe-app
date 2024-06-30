import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Details() {
    const { id } = useParams();
    const { setRecipeDetailsData, handleAddToFavorite, favoritesList } = useContext(GlobalContext);
    const [recipeDetailsData, setLocalRecipeDetailsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getRecipeDetails() {
            try {
                const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
                const data = await response.json();
                if (data?.data?.recipe) {
                    setRecipeDetailsData(data.data.recipe);
                    setLocalRecipeDetailsData(data.data.recipe);
                } else {
                    setError("Recipe not found.");
                }
            } catch (error) {
                setError("Failed to fetch recipe details.");
            } finally {
                setLoading(false);
            }
        }

        getRecipeDetails();
    }, [id, setRecipeDetailsData]);

    if (loading) return <div className="container mx-auto py-10">Loading...</div>;
    if (error) return <div className="container mx-auto py-10">{error}</div>;

    const isFavorite = favoritesList.some(item => item.id === recipeDetailsData?.id);

    return (
        <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="lg:col-start-1 lg:col-end-2">
                <div className="h-96 overflow-hidden rounded-xl group">
                    <img
                        src={recipeDetailsData?.image_url}
                        alt={recipeDetailsData?.title}
                        className="w-full h-full object-cover block group-hover:scale-105 duration-300"
                    />
                </div>
            </div>
            <div className="lg:col-start-2 lg:col-end-3">
                <div className="mt-5">
                    <h1 className="text-3xl font-bold text-black">{recipeDetailsData?.title}</h1>
                    <div>
                        <button
                            onClick={() => handleAddToFavorite(recipeDetailsData)}
                            className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
                        >
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    </div>
                    <div className="mt-5">
                        <span className="text-2xl font-semibold text-black">
                            Ingredients:
                        </span>
                        <ul className="flex flex-col gap-3">
                            {recipeDetailsData?.ingredients?.map((ingredient, index) => 
                                <li key={index} className="text-gray-600">
                                    {ingredient.quantity ? `${ingredient.quantity} ${ingredient.unit}` : ''} {ingredient.description}
                                </li>
                            )}
                        </ul>
                    </div>
                    <p className="text-gray-600 mt-3">Publisher: {recipeDetailsData?.publisher}</p>
                </div>
            </div>
        </div>
    );
}