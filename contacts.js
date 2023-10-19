import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.join(process.cwd(), "db", "contacts.json");

async function getContacts() {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });

    return JSON.parse(data);
  } catch (error) {
    console.error(error.message);
  }
}

export async function listContacts() {
  return await getContacts();
}

export async function getContactById(contactId) {
  const contacts = await getContacts();

  for (const contact of contacts) {
    if (contact.id === contactId) {
      return contact;
    }
  }

  return null;
}

export function removeContact(contactId) {
  getContacts().then((contacts) => {
    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );

    fs.writeFile(contactsPath, Buffer.from(JSON.stringify(filteredContacts)));
  });
}

export async function addContact(name, email, phone) {
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