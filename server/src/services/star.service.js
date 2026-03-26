import * as starRepo from "../repositories/star.repo.js";

export const starResource = async ({ userId, resourceType, resourceId }) =>{
    return await starRepo.addStar({
        user_id: userId,
        resource_type: resourceType,
        resource_id: resourceId
    });
};

export const unstarResource = async ({ userId, resourceType, resourceId }) =>{
    return await starRepo.removeStar({
        userId,
        resourceType,
        resourceId
    });
};

export const getStarredFiles = async (userId) =>{
    return await starRepo.getStarredFiles(userId);
};

export const removeStar = async ({ userId, resourceType, resourceId }) =>{
    return await starRepo.removeStar({
        userId,
        resourceType,
        resourceId
    });
};