import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import stripe from "stripe";
import cors from "cors";
dotenv.config();
const app = express();
const port = 5000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5000",
  })
);

const stripel = stripe(
  "sk_test_51L61bwSALzfHghdABR58AzbDCGbuVkgoBR2AAI7pEo9lRJR8cNjBderVrjF7sAEATq6YdWno99ptZS6wP7GYttMw00H8Luk2S8"
);
let loadedMeals = [];
try {
  fetch("https://better-food-order-default-rtdb.firebaseio.com/Meals.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something Went Wrong");
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error);
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
    });
  app.post("/create-checkout-session", async (req, res) => {
    try {
      console.log("req recd");
      const session = await stripel.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.orderedItems.map((item) => {
          const storeItem = loadedMeals.find((el) => el.id === item.id);
          console.log(storeItem);
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.price * 1000,
            },
            quantity: item.amount,
          };
        }),
        success_url: "https://google.com/",
        cancel_url: "https://youtube.com/",
      });
      res.json({ url: session.url });
    } catch {
      (error) => console.log(error);
    }
  });
  app.listen(port, () => console.log(`listening on port ${port}`));
} catch (error) {
  console.log(error);
}

// server/index.js
/* const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
 */
