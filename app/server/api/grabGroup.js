import connectDB from "../utils/db";
import Group from "../models/group";
import Student from "../models/student";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);

  //find group by leader name osis and email
  const { firstName, lastName, email, osis } = body.leader;
  
});
