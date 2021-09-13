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
  "notify-enable": true,
  "notify-auto-close": true,
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
          chrome.action.setPopup({
            popup: "popup.html",
            tabId: sender.tab.id,
          });
          chrome.action.setBadgeText({
            text: times.load.value,
            tabId: sender.tab.id,
          });
          chrome.action.setBadgeBackgroundColor({
            color: times.load.statusColor,
            tabId: sender.tab.id,
          });
        });
      });

      return true;
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

      return true;
    }

    if (storage) {
      if (storage.type == "get") {
        chrome.storage.local.get(storage.key, (store) => {
          sendResponse(
            store[storage.key] === undefined
              ? config[storage.key]
              : store[storage.key]
          );
        });
        return true;
      }

      if (storage.type == "getOrigin") {
        return sendResponse(config);
      }

      if (storage.type == "getAll") {
        const all = {};
        chrome.storage.local.get(Object.keys(config), (store) => {
          Object.keys(config).map((key) => {
            all[key] = store[key] === undefined ? config[key] : store[key];
          });
          sendResponse(all);
        });
        // 必须 return true; 不然 等不到异步结束 (￣ε￣；)
        return true;
      }

      if (storage.type == "set") {
        return chrome.storage.local.set(
          {
            [storage.key]: storage.value,
          },
          () => {}
        );
      }

      if (storage.type == "setAll") {
        const all = {};

        Object.keys(storage.value).map((key) => {
          all[key] = storage.value[key];
        });

        return chrome.storage.local.set(all, () => {});
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
