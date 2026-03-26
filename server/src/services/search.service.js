import * as searchRepo from "../repositories/search.repo.js";

export const searchResources = async (userId, query) =>{
    const files = await searchRepo.searchFiles(userId, query);
    const folders = await searchRepo.searchFolders(userId, query);

    return {
        files,
        folders
    };
};