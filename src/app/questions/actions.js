"use server";

import { db } from "@/lib/db";

/**
 * Fetch groups (used in dropdowns in QuestionForm)
 */
export async function getGroups() {
  try {
    return await db.group.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("getGroups error:", err);
    throw new Error("Failed to fetch groups");
  }
}



/**
 * Fetch questions (with filters)
 */
export async function getQuestions(filter = {}) {
  try {
    return await db.question.findMany({
      where: {
        ...(filter.groupId && { groupId: filter.groupId }),
        ...(filter.type && { type: filter.type }),
      },
      include: {
        group: { select: { id: true, name: true } },
        choices: true,
      },
      orderBy: { text: "asc" },
    });
  } catch (err) {
    console.error("getQuestions error:", err);
    throw new Error("Failed to fetch questions");
  }
}

/** Fetch single question by ID
 */ 

export async function getQuestionById(id) {
  try {
    return await db.question.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, name: true } },
        choices: true,
      },
    });
  } catch (err) {
    console.error("getQuestionById error:", err);
    throw new Error("Failed to fetch question");
  }
}


/**
 * Create question
 */

export async function createQuestion(data) {
  try {
    return await db.question.create({
      data: {
        text: data.text,
        type: data.type.toUpperCase(), // ensure enum matches
        groupId: data.groupId,
        score: data.score,
        correct: data.type.toUpperCase() === "MCQ" ? data.correct : null,
        choices:
          data.type.toUpperCase() === "MCQ" && data.choices?.length
            ? {
                create: data.choices.map((c) => ({
                  text: c.text,
                  index: c.index,
                })),
              }
            : undefined,
      },
      include: { group: true, choices: true },
    });
  } catch (err) {
    console.error("createQuestion error:", err);
    throw new Error("Failed to create question");
  }
}



/**
 * Update question
 */
// export async function updateQuestion(id, data) {
//   try {
//     return await db.question.update({
//       where: { id },
//       data: {
//         text: data.text,
//         type: data.type,
//         groupId: data.groupId,
//         score: data.score,
//         correct: data.type === "MCQ" ? data.correct : null,
//         choices:
//           data.type === "MCQ" && data.choices?.length
//             ? {
//                 deleteMany: {}, // clear old
//                 create: data.choices.map((c) => ({
//                   text: c.text,
//                   index: c.index,
//                 })),
//               }
//             : { deleteMany: {} }, // remove if not MCQ
//       },
//       include: { group: true, choices: true },
//     });
//   } catch (err) {
//     console.error("updateQuestion error:", err);
//     throw new Error("Failed to update question");
//   }
// }

export async function updateQuestion(id, data) {
  try {
    const type = data.type.toUpperCase();

    return await db.question.update({
      where: { id },
      data: {
        text: data.text,
        type,
        groupId: data.groupId,
        score: data.score,
        correct: type === "MCQ" ? data.correct : null,
        choices:
          type === "MCQ"
            ? {
                deleteMany: {},
                create: data.choices?.map((c) => ({
                  text: c.text,
                  index: c.index,
                })) || [],
              }
            : { deleteMany: {} },
      },
      include: { group: true, choices: true },
    });
  } catch (err) {
    console.error("updateQuestion error:", err);
    throw new Error("Failed to update question");
  }
}



/**
 * Delete question
 */
export async function deleteQuestion(id) {
  try {
    // Delete related choices
    await db.choice.deleteMany({ where: { questionId: id } });

    // Delete related userAnswers
    await db.userAnswer.deleteMany({ where: { questionId: id } });

    // Delete related testQuestions
    await db.testQuestion.deleteMany({ where: { questionId: id } });

    // Now delete the question
    return await db.question.delete({ where: { id } });
  } catch (err) {
    console.error("deleteQuestion error:", err);
    throw new Error("Failed to delete question");
  }
}

