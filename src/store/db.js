import Dexie from 'dexie';

const db = new Dexie('vbago');
db.version(1).stores({
  account: '++, username',
  observe: '++id, taxonId, siteId',
});

export default db;
