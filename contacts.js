const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.win32.join(__dirname, "db", "contacts.json");

async function getContacts() {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });

    return JSON.parse(data);
  } catch (error) {
    console.error(error.message);
  }
}

async function listContacts() {
  return await getContacts();
}

async function getContactById(contactId) {
  const contacts = await getContacts();

  for (const contact of contacts) {
    if (contact.id === contactId) {
      return contact;
    }
  }

  return null;
}

function removeContact(contactId) {
  getContacts().then((contacts) => {
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );

    fs.writeFile(contactsPath, Buffer.from(JSON.stringify(filteredContacts)));
  });
}

async function addContact(name, email, phone) {
  getContacts().then((contacts) => {
    
    for (const contact of contacts) {
      if (contact.name === name) {
        throw new Error(`Contact with name ${name} already exist in contacts.`);
      }
    }

    contacts.push({
      id: nanoid(),
      name,
      email,
      phone,
    });

    fs.writeFile(contactsPath, JSON.stringify(contacts));
  });
}

exports.listContacts = listContacts;
exports.getContactById = getContactById;
exports.removeContact = removeContact;
exports.addContact = addContact;
