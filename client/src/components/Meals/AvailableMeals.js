import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";
import { useState, useEffect } from "react";

const AvailableMeals = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [meals, setMeals] = useState([]);
  useEffect(() => {
    const loadedMeals = [];
    setIsLoading(true);
    // console.log(isLoading);
    try {
      fetch("https://better-food-order-default-rtdb.firebaseio.com/Meals.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Something Went Wrong");
          }
          return response.json();
        })
        .catch((error) => {
          // console.log(error);
          setIsLoading(false);
          setIsError(error.message);
        })
        .then((data) => {
          if (!data) return;
          if (data.error) {
            throw new Error("Something Went Wrong(2)");
          }
          console.log(data);
          for (const key in data) {
            loadedMeals.push({
              id: key,
              name: data[key].name,
              description: data[key].description,
              price: data[key].price,
            });
          }
          // console.log(loadedMeals);
          setIsLoading(false);
          setMeals(loadedMeals);
        });
    } catch (error) {}
  }, []);

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        {isLoading && <p>Loading..!!</p>}
        {!isLoading && isError && <p>Something Went Wrong</p>}
        {!isLoading && !isError && <ul>{mealsList}</ul>}
      </Card>
    </section>
  );
};

export default AvailableMeals;
