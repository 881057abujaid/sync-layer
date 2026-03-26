import * as versionService from "../services/version.service.js";

export const uploadVersion = async (req, res) =>{
    try {
        const version = await versionService.uploadNewVersion(
            req.params.fileId,
            req.file,
            req.user.userId
        );

        res.json({
            status: "success",
            data: version
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const getFileVersions = async (req, res ) =>{
    try {
        const versions = await versionService.getFileVersions(req.params.fileId);

        res.json({
            status: "success",
            data: versions
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const restoreVersion = async (req, res) =>{
    try {
        const version = await versionService.restoreVersion(
            req.params.fileId,
            req.params.versionId,
            req.user.userId
        );

        res.json({
            status: "success",
            data: version
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const downloadVersion = async (req, res) =>{
    try {
        const url = await versionService.getVersionDownloadUrl(
            req.params.id
        );

        res.json({
            status: "success",
            downloadUrl: url
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message
        });
    }
};
