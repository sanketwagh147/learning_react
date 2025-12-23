import useHttp from '../hooks/useHttp.js';
import MealItem from './MealItem.jsx';
import Error from './UI/Error.jsx';
const requestConfig = {};
function Meals() {
  const {
    data: meals,
    loading,
    error,
  } = useHttp('http://localhost:3000/meals', requestConfig, []);

  if (loading) {
    return <p id="center">Loading meals...</p>;
  }
  if (error) {
    return <Error title="Error loading meals" message={error} />;
  }

  return (
    <ul id="meals">
      {meals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
export default Meals;
