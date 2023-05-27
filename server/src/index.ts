import express from "express";
import { Dummy } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.get("/api/dummy", Dummy);
app.listen(port, () => console.log(`Server listening on ${port}`));
