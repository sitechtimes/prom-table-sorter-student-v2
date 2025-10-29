import connectDB from "../../utils/db";
import Group from "../../models/Group";
import studentsInGroupMiddleware from "../../middleware/studentsInGroupMiddleware";
import validateStudentsMiddleware from "../../middleware/validateStudentsMiddleware";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);

  // Run custom middleware
  await validateStudentsMiddleware(body);
  await studentsInGroupMiddleware(body);

  // Save group
  const group = await Group.create(body);
  return { message: "Group created", group };
});