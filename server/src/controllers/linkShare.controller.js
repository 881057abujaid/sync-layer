import * as linkService from "../services/linkShare.service.js";

export const createPunlicLink = async (req, res) =>{
    try {
        const link = await linkService.createPublicLink({
            resourceType: req.body.resource_type,
            resourceId: req.body.resource_id,
            password: req.body.password,
            expiresAt: req.body.expires_at,
            createdBy: req.user.userId
        });

        res.json({
            status: "success",
            shareLink: `/s/${link.token}`
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const accessPublicLink = async (req, res) =>{
    try {
        const password = req.body?.password;
        const result = await linkService.accessPublicLink(
            req.params.token,
            password
        );

        res.json({
            status: "success",
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};