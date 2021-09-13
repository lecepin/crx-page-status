import "./options.css";

const domConfigForm = document.getElementById("config-form");
const domSaveBtn = document.getElementById("save-btn");
const domResetBtn = document.getElementById("reset-btn");

init();

domSaveBtn.addEventListener("click", () => {
  const result = {};
  Array.from(domConfigForm.getElementsByTagName("input")).map((item) => {
    if (item.type == "checkbox") {
      return (result[item.name] = item.checked);
    }
    result[item.name] = item.value;
  });

  alert("保存成功");

  chrome.runtime.sendMessage({
    storage: {
      type: "setAll",
      value: result,
    },
  });
});

domResetBtn.addEventListener("click", () => {
  if (!confirm("确定要 恢复默认配置 么？")) {
    return;
  }
  chrome.runtime.sendMessage(
    {
      storage: {
        type: "getOrigin",
      },
    },
    (value) => {
      Array.from(domConfigForm.getElementsByTagName("input")).map((item) => {
        if (item.type == "checkbox") {
          return (item.checked = value[item.name]);
        }
        item.value = value[item.name];
      });
    }
  );
});

function init() {
  chrome.runtime.sendMessage(
    {
      storage: {
        type: "getAll",
      },
    },
    (value) => {
      Array.from(domConfigForm.getElementsByTagName("input")).map((item) => {
        if (item.type == "checkbox") {
          return (item.checked = value[item.name]);
        }
        item.value = value[item.name];
      });
    }
  );
}
