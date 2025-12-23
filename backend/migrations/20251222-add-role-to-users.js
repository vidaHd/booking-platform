/**
 * Migration: add-role-to-users
 * Adds a new field "role" with default value "user" to all users
 */

module.exports.up = async (db) => {
  await db.collection("users").updateMany({}, { $set: { role: "user" } });
  console.log('Field "role" added to all users');
};

module.exports.down = async (db) => {
  await db.collection("users").updateMany({}, { $unset: { role: "" } });
  console.log('Field "role" removed from all users');
};
