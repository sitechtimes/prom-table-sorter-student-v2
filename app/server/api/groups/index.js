import connectDB from "../../utils/db";
import Group from "../../models/Group";
import studentsInGroupMiddleware from "../../middleware/studentsInGroupMiddleware";
import validateStudentsMiddleware from "../../middleware/validateStudentsMiddleware";
import Student from "../../models/studentInfo";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(body);

  await validateStudentsMiddleware(body);
  const { leader, members } = body;

  if (!leader) {
    throw createError({ statusCode: 400, message: "Missing leader" });
  }

  const allPeople = [leader, ...(members || [])];
  const failedIndexes = [];
  //validate students (check if they exist in the big excel)
  await Promise.all(
    allPeople.map(async (person, index) => {
      const match = await Student.findOne({
        first_name: person.first_name.toLowerCase(),
        last_name: person.last_name.toLowerCase(),
        email: person.email.toLowerCase(),
      });
      if (!match) failedIndexes.push(index);
    })
  );

  if (failedIndexes.length > 0) {
    return res.status(400).json({
      message: "Some students could not be validated.",
      failedIndexes,
    });
  }

  const emails = allPeople.map((person) => person.email.trim().toLowerCase());

  //checks if the students are in another group already by concatenating all the emails already in groups and comparing it to list of emails being submitted
  const existingStudents = await Group.aggregate([
    {
      $project: {
        _id: 0,
        matchedEmails: {
          $setIntersection: [
            emails,
            {
              $concatArrays: [
                ["$leader.email"],
                { $ifNull: ["$members.email", []] },
              ],
            },
          ],
        },
      },
    },
    { $match: { "matchedEmails.0": { $exists: true } } },
  ]);

  if (existingStudents.length > 0) {
    const indexes = [];
    allPeople.forEach((dict, index) => {
      if (
        existingStudents[0].matchedEmails.includes(
          dict.email.trim().toLowerCase()
        )
      ) {
        indexes.push(index);
      }
    });
    return res.status(400).json({
      message: "Some students already in other groups",
      duplicates: indexes,
    });
  }
  ``;
  const group = await Group.create(body);
  return { message: "Group created", group };
});
