import { express } from "express";
import { header } from "express/lib/request";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next)=>{
    const method = req.method;
    const path = req.path;
    const query = req.query;
    console.log(`${method} ${path} \n${query}`);
    next()
});
app.get("/health", (req, res) => {
    res.status(200).json({status: "ok"})
});
app.get("/users", (req, res) => {
    const users = [{name: "Alice"}, {name: "Bob"}];
    const result = req.query.name ? users.filter(u => u.name === req.query.name) : users;
    res.status(200).json({users});
});
app.get("/headers", (req, res) => {
    const method = req.method;
    const path = req.path;
    const query = req.query;
    res.status(200).json({headers: req.headers});
});
app.get("/request-info", (req, res) => {
    res.status(200).json({
        method: req.method,
        path: req.path,
        query: req.query
    });
});
app.post("/echo", (req, res) => {
  res.status(200).json({ received: req.body });
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});