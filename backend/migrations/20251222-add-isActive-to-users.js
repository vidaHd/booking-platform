module.exports.up = async (db) => {
  await db.collection("users").updateMany({}, { $set: { isActive: true } });
};

module.exports.down = async (db) => {
  await db.collection("users").updateMany({}, { $unset: { isActive: "" } });
};
