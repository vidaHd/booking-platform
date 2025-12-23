import fs from "fs";

const prettierConfig = {
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  endOfLine: "auto",
};

fs.writeFileSync(".prettierrc", JSON.stringify(prettierConfig, null, 2) + "\n");

console.log(".prettierrc created successfully!");
