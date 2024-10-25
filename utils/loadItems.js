import fs from "fs";
function LoadItems(path) {
  const loadedItems = fs.readFileSync(path, "utf8");
  if (!loadedItems) {
    return [];
  }
  return JSON.parse(loadedItems);
}
export default LoadItems;
