import * as storageService from "../services/storage.service.js";

export const getStorageBreakdown = async (req, res) => {
    try {
        const breakdown = await storageService.getStorageBreakdown(req.user.userId);
        res.status(200).json({
            status: "success",
            data: breakdown
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};