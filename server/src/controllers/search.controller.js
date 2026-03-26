import * as searchService from "../services/search.service.js";

export const search = async (req, res) =>{
    try {
        const query = req.query.q;

        if(!query){
            return res.status(400).json({
                error: "Search query is required"
            });
        }

        const userId = req.user.userId;

        const result = await searchService.searchResources(userId, query);

        res.json({
            status: "success",
            data: result
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};