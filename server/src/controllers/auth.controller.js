import * as authService from "../services/auth.service.js";
import * as userRepo from "../repositories/user.repo.js";

export const register = async (req, res) =>{
    try {
        const user = await authService.registerUser(req.body, req.file);
        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
};

export const login = async (req, res) =>{
    try {
        const token = await authService.loginUser(req.body);
        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
};

export const getCurrentUser = async (req, res) =>{
    try {
        const user = await userRepo.findUserById(req.user.userId);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
};

export const getStorageUsage = async (req, res) =>{
    try {
        const storage = await userRepo.getUserStorage(req.user.userId);

        res.json({
            status: "success",
            data: storage
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updatedUser = await authService.updateProfile(req.user.userId, req.body, req.file);
        res.json({
            status: "success",
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        if(!req.body.currentPassword || !req.body.newPassword){
            throw new Error("Please provide current and new password");
        }
        const updatedUser = await authService.changePassword(req.user.userId, {
            currentPassword: req.body.currentPassword,
            newPassword: req.body.newPassword
        });
        res.json({
            status: "success",
            message: "Password changed successfully",
            data: updatedUser
        });
    } catch (error) {
        console.log("ERROR: ", error);
        res.status(400).json({
            error: error.message
        });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        await authService.deleteUser(req.user.userId);
        res.json({
            status: "success",
            message: "Account deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: error.message
        });
    }
};