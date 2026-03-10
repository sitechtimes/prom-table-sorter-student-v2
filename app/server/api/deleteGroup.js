import connectDB from "../utils/db";
import Group from "../models/group";
import Student from "../models/student";
export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);
  const { leader, members } = body;

  //based on passed body of group, delete it from the group collection
  await Group.deleteOne({ leader });
});