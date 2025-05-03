const { contextBridge, ipcRenderer } = require('electron');
const Store = require('electron-store');

console.log('Preload script loaded');

const store = new Store();

let isPaidVersion = false;
try {
  isPaidVersion = process.env.CARAT_IS_PAID_VERSION === "true";
} catch (e) {
  isPaidVersion = false;
}

contextBridge.exposeInMainWorld("api", {
  getItems: () => {
    console.log("Fetching items from store...");
    const items = store.get("items") || [];
    console.log("Fetched items:", items);
    return items;
  },
  addItem: (item) => {
    console.log("Adding item:", item);
    const items = store.get("items") || [];
    store.set("items", [...items, item]);
  },
  updateItem: (index, updatedItem) => {
    const items = store.get("items") || [];
    items[index] = updatedItem;
    store.set("items", items);
  },
  deleteItem: (index) => {
    const items = store.get("items") || [];
    items.splice(index, 1);
    store.set("items", items);
  },
  onFocusAddGem: (callback) => {
    ipcRenderer.on("focus-add-gem", (...args) => {
      callback(...args);
    });
  },
  getTagsFeatureEnabled: () => store.get("tagsFeatureEnabled") || false,
  setTagsFeatureEnabled: (enabled) => store.set("tagsFeatureEnabled", enabled),
  isPaidVersion: isPaidVersion,
});
