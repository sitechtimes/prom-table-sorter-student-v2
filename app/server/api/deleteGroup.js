import connectDB from "../utils/db";
import Group from "../models/group";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);

  // if (!group) {
  //   throw createError({
  //     statusCode: 404,
  //     message:
  //       "Group not found, check if your information is correct or if you were really the group leader",
  //   });
  // }
  // return group;
});
