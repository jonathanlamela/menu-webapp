import app from "./app";
import dotenv from "dotenv";

//Configure dotnev to use .env file
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

//Retrieve the port from .env
const PORT = process.env.PORT;

//Start to listen
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}).on("error", (error) => {

    throw new Error(error.message);
});


export default app;
