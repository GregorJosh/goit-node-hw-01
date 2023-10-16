const contacts = require("./contacts.js");
const { Command } = require("commander");

const cmd = new Command();

cmd
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

cmd.parse(process.argv);

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      console.table(await contacts.listContacts());

      break;
    case "get":
      const contact = await contacts.getContactById(id);

      if (contact) {
        console.table(contact);
      } else {
        console.error("\nThere is no contact with id " + id);
      }

      break;
    case "add":
      try {
        await contacts.addContact(name, email, phone);
      } catch (error) {
        console.error(error);
      }

      break;
    case "remove":
      contacts.removeContact(id);

      break;
    default:
      console.warn("Unknknown action type!");
  }
}

invokeAction(cmd.opts());