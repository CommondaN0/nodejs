export default function requireJson(req, res, next) {
    const contentType = req.headers["content-type"] || "";
    
    if(!contentType.includes("application/json")) {
        return res.status(415).json({
            message: "Content-Type must be application/json"
        });
    }

    next();
}