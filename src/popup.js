import "./popup.css";
import { converSize } from './utils.js';

chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  if (!tabs.length) {
    return;
  }

  chrome.storage.local.get(["times", "fps"], ({ fps: _fps, times: _times }) => {
    const times = (_times || {})[tabs[0].id] || {};
    const fps = (_fps || {})[tabs[0].id] || {};
    const domApp = document.getElementById("app");
    let appHtml = "";
    const resMap = new Map();
    console.log(times.res);
    (times.res.list || []).forEach((item) => {
      const { _size, type } = item;
      if (!resMap.has(type)) {
        resMap.set(type, _size);
      } else {
        resMap.set(type, resMap.get(type) + _size);
      }
    }, resMap);

    const resArr = []
    resMap.forEach((value, key) => {
      resArr.push({ key, value });
    });

    if (times.load) {
      appHtml += `
        <div class="group" style="border-color:${
          times.load.status == "DANGER" ? times.load.statusColor : "inherit"
        }">
          <div class="group-head">
            <div class="group-head-block">
              <img class="group-head-icon" src="images/add.svg" />
              <div class="group-head-title"><span>${times.load.name.substr(
                0,
                3
              )}</span>${times.load.name.substr(3)}</div>
            </div>
            <div class="group-head-block">
              <div class="group-head-value">${times.load.value}</div>
              <div class="group-head-status" style="background: ${
                times.load.statusColor
              }"></div>
            </div>
          </div>
          <div class="group-content">
            <div class="group-content-item-between">
              <div class="group-content-item-between-title">DNS解析</div>
              <div class="group-content-item-between-value">
                ${times.load.dnsTime}
                <div class="group-content-item-between-value-progress" style="left: ${
                  times.load.percentDnsTimeStart
                }%; right: calc(100% - ${times.load.percentDnsTimeStart}% - ${
        times.load.percentDnsTime
      }%); background: ${times.load.statusColor};"></div>
              </div>
            </div>
            <div class="group-content-item-between">
              <div class="group-content-item-between-title">TCP连接</div>
              <div class="group-content-item-between-value">
                ${times.load.tcpTime}
                <div class="group-content-item-between-value-progress" style="left: ${
                  times.load.percentTcpTimeStart
                }%; right: calc(100% - ${times.load.percentTcpTimeStart}% - ${
        times.load.percentTcpTime
      }%); background: ${times.load.statusColor};"></div>
              </div>
            </div>
            <div class="group-content-item-between">
              <div class="group-content-item-between-title">请求发送</div>
              <div class="group-content-item-between-value">
                ${times.load.reqTime}
                <div class="group-content-item-between-value-progress" style="left: ${
                  times.load.percentReqTimeStart
                }%; right: calc(100% - ${times.load.percentReqTimeStart}% - ${
        times.load.percentReqTime
      }%); background: ${times.load.statusColor};"></div>
              </div>
            </div>
            <div class="group-content-item-between">
              <div class="group-content-item-between-title">响应下载</div>
              <div class="group-content-item-between-value">
                ${times.load.resTime}
                <div class="group-content-item-between-value-progress" style="left: ${
                  times.load.percentResTimeStart
                }%; right: calc(100% - ${times.load.percentResTimeStart}% - ${
        times.load.percentResTime
      }%); background: ${times.load.statusColor};"></div>
              </div>
            </div>
            <div class="group-content-item-between">
              <div class="group-content-item-between-title">DOM完成</div>
              <div class="group-content-item-between-value">
                ${times.load.domParseTime}
                <div class="group-content-item-between-value-progress" style="left: ${
                  times.load.percentDomParseTimeStart
                }%; right: 0; background: ${times.load.statusColor};"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (times.res) {
      appHtml += `
        <div class="group" style="border-color:${
          times.res.status == "DANGER" ? times.res.statusColor : "inherit"
        }">
          <div class="group-head">
            <div class="group-head-block">
              <img class="group-head-icon" src="images/add.svg" />
              <div class="group-head-title"><span>${times.res.name.substr(
                0,
                3
              )}</span>${times.res.name.substr(3)}</div>
            </div>
            <div class="group-head-block">
              <div class="group-head-value">${times.res.value}</div>
              <div class="group-head-status" style="background: ${
                times.res.statusColor
              }"></div>
            </div>
          </div>
          <div class="group-content">
            <div>
              ${resArr.map(i => {
                const { key, value } = i;
                return `<span class="group-filter" id="${key}">${key}:${converSize(value)}</span>`
              }).join("")}
            </div>
            ${times.res.list
              .map((item, index) => {
                return `
                  <div class="${`group-content-item group-content-item-ordinary group-content-item-${item.type}`}" style="color: ${
                    item.timeColor
                  }; text-decoration: ${item.timeThrough}">
                    <div class="group-content-item-index">${index + 1}.</div>
                    <img class="group-content-item-type" src="${
                      item.typeIcon
                    }" />
                    <div class="group-content-item-name" title="${item.name}">${
                  item.name
                }</div>
                    <div class="group-content-item-time">${item.time}</div>
                    <div class="group-content-item-time">${item.size}</div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    }

    if (times.big) {
      appHtml += `
        <div class="group" style="border-color:${
          times.big.status == "DANGER" ? times.big.statusColor : "inherit"
        }">
          <div class="group-head">
            <div class="group-head-block">
              ${
                !times.big._value
                  ? '<div class="group-head-icon-place"></div>'
                  : '<img class="group-head-icon" src="images/add.svg" />'
              }
              <div class="group-head-title"><span>${times.big.name.substr(
                0,
                3
              )}</span>${times.big.name.substr(3)}</div>
            </div>
            <div class="group-head-block">
              <div class="group-head-value">${times.big.value}</div>
              <div class="group-head-status" style="background: ${
                times.big.statusColor
              }"></div>
            </div>
          </div>
          <div class="group-content">
            ${times.big.list
              .map((item, index) => {
                return `
                  <div class="group-content-item">
                    <div class="group-content-item-index">${index + 1}.</div>
                    <img class="group-content-item-type" src="${
                      item.typeIcon
                    }" />
                    <div class="group-content-item-name" title="${item.name}">${
                  item.name
                }</div>
                  <div class="group-content-item-time">${item.size}</div>
                </div>
              `;
              })
              .join("")}
          </div>
        </div>
      `;
    }

    if (times.slow) {
      appHtml += `
        <div class="group" style="border-color:${
          times.slow.status == "DANGER" ? times.slow.statusColor : "inherit"
        }">
          <div class="group-head">
            <div class="group-head-block">
            ${
              !times.slow._value
                ? '<div class="group-head-icon-place"></div>'
                : '<img class="group-head-icon" src="images/add.svg" />'
            }
              <div class="group-head-title"><span>${times.slow.name.substr(
                0,
                3
              )}</span>${times.slow.name.substr(3)}</div>
            </div>
            <div class="group-head-block">
              <div class="group-head-value">${times.slow.value}</div>
              <div class="group-head-status" style="background: ${
                times.slow.statusColor
              }"></div>
            </div>
          </div>
          <div class="group-content">
            ${times.slow.list
              .map((item, index) => {
                return `
                  <div class="group-content-item">
                    <div class="group-content-item-index">${index + 1}.</div>
                    <img class="group-content-item-type" src="${
                      item.typeIcon
                    }" />
                    <div class="group-content-item-name" title="${item.name}">${
                  item.name
                }</div>
                    <div class="group-content-item-time">${item.time}</div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    }

    if (fps._1) {
      appHtml += `
        <div class="group" style="border-color:${
          fps._1Status == "DANGER" ? fps._1StatusColor : "inherit"
        }">
          <div class="group-head">
            <div class="group-head-block">
              <div class="group-head-icon-place"></div>
              <div class="group-head-title"><span>📺 </span>平均帧率</div>
            </div>
            <div class="group-head-block">
              <div class="group-head-value">${fps._1 || "--"}</div>
              <div class="group-head-status" style="background:${
                fps._1StatusColor
              }"></div>
            </div>
          </div>
          <div class="group-content">内容</div>
        </div>
      `;
    }

    appHtml += `
      <div class="op-area">
        <div>${times.time}</div>
        <img id="setting" src="images/setting.svg" title="设置" />
      </div>
    `;

    appHtml && (domApp.innerHTML = appHtml);

    domApp.addEventListener("click", ({ target }) => {
      if (target.classList.contains("group-head-icon")) {
        if (target.getAttribute("src").indexOf("add.svg") > -1) {
          target.setAttribute("src", "images/sub.svg");
          target.parentElement.parentElement.parentElement.lastElementChild.style.display =
            "block";
        } else {
          target.setAttribute("src", "images/add.svg");

          target.parentElement.parentElement.parentElement.lastElementChild.style.display =
            "none";
        }
      }
      if (target.classList.contains("group-filter")) {
        const curType = target.getAttribute("id");
        if (curType) {
          const allElements = document.getElementsByClassName('group-content-item-ordinary');
          for (let e of allElements) {
            e.style.display = 'none'
          }
          const elements = document.getElementsByClassName(`group-content-item-${curType}`);
          for (let e of elements) {
            e.style.display = 'flex'
          }
        }
      }
    });

    document.getElementById("setting").addEventListener("click", () => {
      window.chrome.tabs.create({ url: "options.html" });
    });
  });
});
