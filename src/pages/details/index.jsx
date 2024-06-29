import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Details() {
    const { id } = useParams();
    const { setRecipeDetailsData } = useContext(GlobalContext);
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

    return (
        <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="row-start-2 lg:row-start-auto">
                <div className="h-96 overflow-hidden rounded-xl group">
                    <img
                        src={recipeDetailsData?.image_url}
                        alt={recipeDetailsData?.title}
                        className="w-full h-full object-cover block group-hover:scale-105 duration-300"
                    />
                </div>
                <div className="mt-5">
                    <h1 className="text-3xl font-bold">{recipeDetailsData?.title}</h1>
                    <p className="text-gray-600 mt-3">Publisher: {recipeDetailsData?.publisher}</p>
                </div>
            </div>
        </div>
    );
}