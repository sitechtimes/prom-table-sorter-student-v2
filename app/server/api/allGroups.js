import connectDB from "../utils/db";
import Group from "../models/group";
import Student from "../models/student";

export default defineEventHandler(async () => {
  await connectDB();

  const allGroups = await Group.find({}).lean();

  return allGroups;
});
