import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/user.repo.js";
import { uploadAvatarToStorage } from "./storage.service.js";

export const registerUser = async ({ email, password, name }, avatarFile) =>{
    const existingUser = await userRepo.findUserByEmail(email);
    if(existingUser){
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    const user = await userRepo.createUser({
        email,
        password_hash: hashedPassword,
        name,
        image_url: imageUrl
    });

    if (avatarFile) {
        try {
            const uploadedUrl = await uploadAvatarToStorage(avatarFile, user.id);
            await userRepo.updateUserProfile(user.id, { image_url: uploadedUrl });
            user.image_url = uploadedUrl;
        } catch (uploadError) {
            console.error("Failed to upload avatar during registration:", uploadError);
        }
    }

    return user;
};

export const loginUser = async ({ email, password }) =>{
    const user = await userRepo.findUserByEmail(email);

    if(!user){
        throw new Error("User not found");
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if(!valid){
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
    return token;
};

export const updateProfile = async (userId, data, avatarFile) => {
    if (avatarFile) {
        const uploadedUrl = await uploadAvatarToStorage(avatarFile, userId);
        data.image_url = uploadedUrl;
    }
    const updatedUser = await userRepo.updateUserProfile(userId, data);
    return updatedUser;
};

export const changePassword = async (userId, {currentPassword, newPassword}) => {
    const valid = await userRepo.verifyCurrentPassword(userId, currentPassword);
    if(!valid){
        throw new Error("Current password is incorrect");
    }
    const updatedUser = await userRepo.updatePassword(userId, newPassword);
    return updatedUser;
};

export const deleteUser = async (userId) => {
    return await userRepo.deleteUserAccount(userId);
};
