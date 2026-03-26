import * as shareService from "../services/share.service.js";
import * as userRepo from "../repositories/user.repo.js";

export const shareResource = async (req, res) =>{
    try {
        const { resource_name, resource_type, resource_id, email, role } = req.body;
        const user = await userRepo.findUserByEmail(email);
        if(!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const share = await shareService.shareResource({
            resourceType: resource_type,
            resourceId: resource_id,
            resourceName: resource_name,
            granteeUserId: user.id,
            role,
            createdBy: req.user.userId
        });

        res.json({
            status: "success",
            message: "Resource shared successfully",
            data: share
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const getSharedFiles = async (req, res) =>{
    try {
        const files = await shareService.getSharedFiles(req.user.userId);

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