import * as starService from "../services/star.service.js";

export const starResource = async (req, res) =>{
    try {
        const star = await starService.starResource({
            userId: req.user.userId,
            resourceType: req.body.resource_type,
            resourceId: req.body.resource_id
        });

        res.json({
            status: "success",
            data: star
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const unstarResource = async (req, res) =>{
    try {
        const { resource_type, resource_id } = req.body;

        await starService.unstarResource({
            userId: req.user.userId,
            resourceType: resource_type,
            resourceId: resource_id
        });

        res.json({
            status: "success"
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const getStarredFiles = async (req, res) =>{
    try {
        const files = await starService.getStarredFiles(req.user.userId);

        res.json({
            status: "success",
            data: files
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const removeStar = async (req, res) =>{
    try {
        const { resource_type, resource_id } = req.params;

        await starService.removeStar({
            userId: req.user.userId,
            resourceType: resource_type,
            resourceId: resource_id
        });

        res.json({
            status: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};