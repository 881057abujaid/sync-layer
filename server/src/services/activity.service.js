import * as activityRepo from "../repositories/activity.repo.js";

export const logActivity = async ({
    actorId,
    action,
    resourceType,
    resourceId,
    context
}) =>{
    return await activityRepo.createActivity({
        actor_id: actorId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        context
    });
};