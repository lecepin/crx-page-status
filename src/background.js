const config = {
  "load-w-min": "2",
  "load-d-min": "3",
  "res-w-min": "30",
  "res-d-min": "60",
  "big-size": "1",
  "big-w-min": "3",
  "big-d-min": "6",
  "slow-time": "500",
  "slow-w-min": "3",
  "slow-d-min": "6",
  "fps-w-min": "40",
  "fps-d-min": "20",
  "notify-enable": "true",
  "notify-auto-close": "true",
  "notify-auto-close-time": "3",
};

chrome.runtime.onMessage.addListener(
  ({ times, fps, storage, openOptionPage }, sender, sendResponse) => {
    if (openOptionPage) {
      window.chrome.tabs.create({ url: "options.html" });
    }

    if (times) {
      chrome.storage.local.get("times", (store) => {
        store.times = store.times || {};
        store.times[sender.tab.id] = times;
        chrome.storage.local.set(store, () => {
          chrome.browserAction.setPopup({
            popup: "popup.html",
            tabId: sender.tab.id,
          });
          chrome.browserAction.setBadgeText({
            text: times.load.value,
            tabId: sender.tab.id,
          });
          chrome.browserAction.setBadgeBackgroundColor({
            color: times.load.statusColor,
            tabId: sender.tab.id,
          });
        });
      });
    }

    if (fps) {
      chrome.storage.local.get("fps", (store) => {
        store.fps = store.fps || {};
        store.fps[sender.tab.id] = {
          ...(store.fps[sender.tab.id] || {}),
          ...fps,
        };
        chrome.storage.local.set(store, () => {});
      });
    }

    if (storage) {
      if (storage.type == "get") {
        return sendResponse(
          localStorage.getItem(storage.key) || config[storage.key]
        );
      }

      if (storage.type == "getOrigin") {
        return sendResponse(config);
      }

      if (storage.type == "getAll") {
        const all = {};

        Object.keys(config).map((key) => {
          all[key] = localStorage.getItem(key) || config[key];
        });

        return sendResponse(all);
      }

      if (storage.type == "set") {
        return localStorage.setItem(storage.key, storage.value);
      }

      if (storage.type == "setAll") {
        Object.keys(storage.value).map((key) => {
          localStorage.setItem(key, storage.value[key]);
        });
      }
    }
  }
);

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get("times", (store) => {
    if (store.times) {
      delete store.times[tabId];
      chrome.storage.local.set(store, () => {});
    }
  });
  chrome.storage.local.get("fps", (store) => {
    if (store.fps) {
      delete store.fps[tabId];
      chrome.storage.local.set(store, () => {});
    }
  });
});
