/**
 * Example filename: 20251222-add-role-to-users.js
 */

module.exports.up = async (db) => {
  // await db.collection("users").updateMany({}, { $set: { role: "user" } });
};

module.exports.down = async (db) => {
  // await db.collection("users").updateMany({}, { $unset: { role: "" } });
};
