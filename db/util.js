function dbFields(fields) {
  const insert = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  const select = Object.keys(fields)
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  const vals = Object.values(fields);
  return { insert, select, vals };
}

console.log(dbFields({ name: "Preston", username: "pwallace" }));

module.exports = {
  dbFields,
};
