import connectDB from "../utils/db";
import Group from "../models/group";
import Student from "../models/student";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);

  //find group by leader name osis and email
  const { firstName, lastName, email, osis } = body.leader;
  const group = await Group.findOne({ "leader.firstName":firstName,"leader.lastName":lastName,"leader.email":email, "leader.osis":osis});
  if (!group) {
    throw createError({
      statusCode: 404,
      message:
        "Group not found, check if your information is correct or if you were really the group leader",
    });
  }
  return group;
});
