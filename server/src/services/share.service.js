import * as shareRepo from "../repositories/share.repo.js";
import { logActivity } from "./activity.service.js";

export const shareResource = async ({
    resourceType,
    resourceId,
    granteeUserId,
    role,
    createdBy,
    resourceName
}) =>{
    await logActivity({
        actorId: createdBy,
        action: "share",
        resourceType: resourceType,
        resourceId: resourceId,
        context: { name: resourceName }
    });
    return await shareRepo.createShare({
        resource_type: resourceType,
        resource_id: resourceId,
        grantee_user_id: granteeUserId,
        role,
        created_by: createdBy
    });
};

export const getSharedFiles = async (userId) =>{
    return await shareRepo.getSharedFiles(userId);
};