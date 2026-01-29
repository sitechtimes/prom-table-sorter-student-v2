import connectDB from "../utils/db";
import Group from "../models/group";
import Student from "../models/student";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);

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
        firstName: person.firstName.toLowerCase(),
        lastName: person.lastName.toLowerCase(),
        email: person.email.toLowerCase(),
      });
      if (!match) failedIndexes.push(index);
    })
  );

  //if some students dont exist throw an error with the indexes
  if (failedIndexes.length > 0) {
    throw createError({
      statusCode: 599,
      message: "Some students could not be validated.",
      data: { failedIndexes },
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

  //if there are students already in groups throw an error with their indexes
  if (existingStudents.length > 0) {
    allPeople.forEach((dict, index) => {
      if (
        existingStudents[0].matchedEmails.includes(
          dict.email.trim().toLowerCase()
        )
      ) {
        failedIndexes.push(index);
      }
    });
    throw createError({
      statusCode: 599,
      message: "Some students already exist in other groups.",
      data: { failedIndexes },
    });
  }

  //once validation stuff is done post the actual group
  const group = await Group.create(body);
  return { message: "Group created successfully", group };
});
