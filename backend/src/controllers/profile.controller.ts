import { Request, Response } from "express";
import { User } from "../models/User";
import { asyncHandler, successResponse } from "../helpers/response.helper";

export const profileController = {
  updateProfile: asyncHandler(async (req: any, res: Response) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });

    const avatarFilename = req.file ? req.file.filename : undefined;
    const { description, age, gender, name, familyName, email, mobileNumber } =
      req.body;
    if (!user) throw new Error("User not found");
    user.name = name ?? user.name;
    user.familyName = familyName ?? user.familyName;
    user.email = email ?? user.email;
    user.mobileNumber = mobileNumber ?? user.mobileNumber;

    user.profile = {
      ...user.profile,
      description: description ?? user.profile?.description,
      age: age ?? user.profile?.age,
      gender: gender ?? user.profile?.gender,
      avatar: avatarFilename ?? user.profile?.avatar,
    };
    
    await user.save();

    successResponse(res, "Profile updated successfully", { user });
  }),

  getProfile: asyncHandler(async (req: any, res: Response) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) throw new Error("User not found");

    const { password, __v, ...userWithoutPass } = user.toObject();

    const profile = user.profile || {};
    const fullProfile = {
      description: profile.description || "",
      age: profile.age || "",
      gender: profile.gender || "",
      avatar: profile.avatar
        ? `http://localhost:5000/uploads/${profile.avatar}`
        : "",
    };

    successResponse(res, "Profile fetched successfully", {
      ...userWithoutPass,
      profile: fullProfile,
    });
  }),
};
