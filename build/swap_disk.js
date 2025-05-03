// swap_disk.js
class IndexedDbSwap {
  constructor(sectors, sector_size = 512) {
    this.sectors      = sectors;
    this.sector_size  = sector_size;
    this.db_name      = "v86-swap-db";
    this.store_name   = "swap-store";
    this._ready       = this._init_db();
  }

  // Open (or create) the DB and object store
  _init_db() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.db_name, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        db.createObjectStore(this.store_name);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
  }

  async _txn(storeMode, callback) {
    const db = await this._ready;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.store_name, storeMode);
      const store = tx.objectStore(this.store_name);
      const result = callback(store);
      tx.oncomplete = () => resolve(result);
      tx.onerror    = () => reject(tx.error);
    });
  }

  get_total_sectors() {
    return this.sectors;
  }

  get_sector_size() {
    return this.sector_size;
  }

  // Read `count` sectors starting at LBA `lba`
  async read_sectors(lba, count) {
    const offset = lba * this.sector_size;
    const length = count * this.sector_size;

    const data = await this._txn("readonly", store => {
      return store.get(offset);
    });

    if (data) {
      // We stored raw ArrayBuffers
      return data;
    } else {
      // If nothing’s there yet, return a zero‐filled buffer
      return new Uint8Array(length).buffer;
    }
  }

  // Write `data` (an ArrayBuffer whose byteLength = count*sector_size)
  async write_sectors(lba, data) {
    const offset = lba * this.sector_size;
    await this._txn("readwrite", store => {
      store.put(data, offset);
    });
  }
}

