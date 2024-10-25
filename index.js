import fs from "fs";
import { Command } from "commander";
import chalk from "chalk";
import LoadItems from "./utils/loadItems.js";

const program = new Command();

program
  .name("budget-track-app")
  .description("A CLI utility that will help you track your budget")
  .version("1.0.0");

//add item
program
  .command("new")
  .description("Adding a budget")
  .option("-t, --title <value>", "Name of the item to be added")
  .option("-q, --quantity <value>", "Quantity of the item to be added")
  .option("-p, --unitprice <value>", "Price of the item per quantity")
  .action(function (option) {
    const title = option.title;
    const quantity = option.quantity;
    const unitprice = option.unitprice;

    const newItem = {
      title: title,
      quantity: quantity,
      unitprice: unitprice,
      createdAt: new Date(),
      lastupdateAt: new Date(),
    };

    const Items = LoadItems("./data/budget.json");

    const itemwithname = Items.find((product) => product.title === title);
    if (itemwithname) {
      console.log(chalk.red("Item ${title} already budgeted"));
      return;
    }

    Items.push(newItem);

    fs.writeFileSync("./data/budget.json", JSON.stringify(Items));
    console.log(chalk.green("Item added successifuly"));
  });

//Get all items
program
  .command("Getall")
  .description("Geting all the Items in the Budget")
  .option("-t, --title <value>", "Getting the specific item ")
  .action((options) => {
    const title = options.title;
    const allItems = LoadItems("./data/budget.json");
    if (title) {
      const product = allItems.find((product) => product.title === title);
      if (product) {
        console.log(
          `${chalk.green(product.title)} | ${chalk.yellow(product.quantity)} | ${chalk.cyan(product.unitprice)}`,
        );
      } else {
        console.log(chalk.red(`No item that matches the title: ${title}`));
        return;
      }
      return;
    }

    if (allItems.length === 0) {
      console.log(chalk.red("you don't have any item in your budget yet"));
      return;
    }
    allItems.forEach((product) => {
      console.log(
        `${chalk.green(product.title)} | ${chalk.yellow(product.quantity)} | ${chalk.cyan(product.unitprice)}`,
      );
    });
  });

  //delete

  program
  .command("delete")
  .description("Delete a specific item from the budget")
  .option("-t, --title <value>", "Title for the item to be deleted")
  .action((options) => {
    const title = options.title;
    const allItems = LoadItems("./data/budget.json");

    if (allItems.length === 0) {
      console.log(chalk.yellow(`You don't have any item.`));
      return;
    }


    // Filter out the item with the matching title
    const remainingItems = allItems.filter((product) => product.title !== title);

    if (remainingItems.length === allItems.length) {
      console.log(chalk.red(`No item with the title "${title}" was found.`));
      return;
    }

    // Write the remaining items back to the JSON file
    try {
      fs.writeFileSync("./data/budget.json", JSON.stringify(remainingItems, null, 2));
      console.log(chalk.green(`Item deleted successfully.`));
    } catch (err) {
      console.log(chalk.red("Error writing to file:", err));
    }
  });

// update item
program
  .command("update")
  .option("-t, --title", "update the name of the item in the budget")
  .option("-q, --newquantity", "update the quantity of the item in the budget")
  .option("-p, --newunitprice", "update price of the item in craeted budget");

program.parse(process.argv);
