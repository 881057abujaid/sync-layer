import cron from "node-cron";
import { cleanupTrash } from "../services/file.service.js";

export const startCleanupJob = () =>{
    cron.schedule("0 0 * * *", async () =>{
        console.log("Running trash cleanup job...");
        await cleanupTrash();
        console.log("Trash cleanup job completed");
    });
};