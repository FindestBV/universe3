import { openDB } from "idb";

const DB_NAME = "searchDB";
const STORE_NAME = "searches";

export const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
  return db;
};

export const saveSearch = async (searchData: any) => {
  const db = await initDB();
  return db.add(STORE_NAME, searchData);
};

export const getAllSearches = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};
