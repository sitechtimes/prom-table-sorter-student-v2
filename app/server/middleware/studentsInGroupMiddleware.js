const Student = require("../models/studentInfo");
const Group = require("../models/Group");

const inGroupStudentsMiddleware = async (req, res, next) => {
  try {
    const { leader, members } = req.body;

    if (!leader || !members) {
      return res.status(400).json({ message: "Missing leader or members " });
    }

    const allPeople = [leader, ...members];
    const failedIndexes = [];

    const emails = allPeople.map(person => person.email.trim().toLowerCase());

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
                  { $ifNull: ["$members.email", []] }
                ]
              }
            ]
          }
        }
      },
      { $match: { "matchedEmails.0": { $exists: true } } },
    ]);

    if (existingStudents.length > 0) {
      const indexes = [];
       allPeople.forEach((dict, index) => {
          if (existingStudents[0].matchedEmails.includes(dict.email.trim().toLowerCase())) {
            indexes.push(index);
        }
       });
      return res.status(400).json({ message: "Some students already in other groups", duplicates: indexes });
  }
  next();
} catch (err) {
  console.error("Validation error:", err);
  res.status(500).json({ message: "Server error during student validation." });
}
}
module.exports = inGroupStudentsMiddleware;