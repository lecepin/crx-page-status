(function () {
  const LEVEL_COLOR = {
    NORMAL: "#52c41a",
    WARNING: "#faad14",
    DANGER: "#f5222d",
    NONE: "#fff",
  };

  const FILE_TYPE_ICON = {
    navigation: "images/html.svg",
    other: "images/other.svg",
    script: "images/js.svg",
    link: "images/css.svg",
    xmlhttprequest: "images/fetch.svg",
    fetch: "images/fetch.svg",
    img: "images/img.svg",
  };

  const _messageBox = [];
  let _visibleWindow = true;

  function converSize(size) {
    let _size = "";
    if (size < 0.1 * 1024) {
      _size = size.toFixed(2) + "B";
    } else if (size < 0.1 * 1024 * 1024) {
      _size = (size / 1024).toFixed(2) + "KB";
    } else if (size < 0.1 * 1024 * 1024 * 1024) {
      _size = (size / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      _size = (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }

    const sizestr = _size + "";
    const len = sizestr.indexOf(".");
    const dec = sizestr.substr(len + 1, 2);
    if (dec == "00") {
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
    }
    return sizestr;
  }

  function converTimeSecond(time) {
    const _time = time / 1000;
    return _time.toFixed(_time >= 100 ? 0 : _time >= 10 ? 1 : 2) + "秒";
  }

  function converTimeMicoSecond(time) {
    if (time < 1000) {
      return time.toFixed(0) + "ms";
    } else if (time < 1000 * 100) {
      return (time / 1000).toFixed(0) + "s";
    }
  }

  function getFPS() {
    return new Promise((res) => {
      let frame = 0;
      let lastTime = Date.now();
      function loop() {
        var now = Date.now();
        frame++;

        if (now > 1000 + lastTime) {
          if (!_visibleWindow) {
            return res(0);
          }

          const fps = ~~((frame * 1000) / (now - lastTime));
          res(fps);
          // frame = 0;
          // lastTime = now;
        } else {
          requestAnimationFrame(loop);
        }
      }

      loop();
    });
  }

  function appendStyle(css) {
    const el = document.createElement("style");

    el.setAttribute("type", "text/css");
    el.innerHTML = css;

    document.getElementsByTagName("head")[0].appendChild(el);
  }

  function createMessage(text, type, config) {
    if (config["notify-enable"] == "false") {
      return;
    }

    const el = document.createElement("div");
    const top = _messageBox.length * (62 + 10);

    el.style.cssText = `
      box-sizing: border-box;
      margin: 0 24px 0 0;
      padding: 0;
      color: #fff;
      background: ${LEVEL_COLOR[type]};
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: "tnum";
      position: fixed;
      z-index: 999999999;
      right: 0px;
      top: calc(24px + ${top}px);
      bottom: auto;
      box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
      padding: 30px 16px 10px 16px;
      width: 205px;
    `;
    el.className = "animate__animated animate__bounceInRight";
    el.innerHTML =
      `
      <div style="
        background: rgba(255,255,255,.8);
        position: absolute;
        top: 0;
        border-radius: 0 0 10px 0;
        left: 0;
        color: #222;
        padding: 2px 5px;
        font-size: 12px;
      ">PageStatus 通知</div>
      <img style="
        position: absolute;
        top: 5px;
        right: 5px;
        width: 15px;
        cursor: pointer;
      " src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0ibTUyMC41MiA0NDguMjYtMzYwLjYtMzYwLjZhNDUgNDUgMCAxIDAtNjMuNjYgNjMuNmwzNjAuNiAzNjAuNjMtMzYwLjYgMzYwLjYzYTQ1IDQ1IDAgMSAwIDYzLjYzIDYzLjYyOEw1MjAuNTIgNTc1LjU1bDM2MC42MyAzNjAuNmE0NSA0NSAwIDEgMCA2My42My02My42bC0zNjAuNi0zNjAuNjYgMzYwLjYtMzYwLjZhNDUgNDUgMCAxIDAtNjMuNjMtNjMuNjNsLTM2MC42IDM2MC42eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==" />
      <img
        title="设置"
        style="
        position: absolute;
        bottom: 5px;
        right: 5px;
        width: 15px;
        cursor: pointer;
      " src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDExMDUgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTM4LjEyNSIgaGVpZ2h0PSIxMjgiPjxwYXRoIGQ9Ik00MjQuMzY1IDk5My4wMzNjLTIuNjkzIDAtNS41MDQtLjM1MS04LjE5OC0xLjE3MS04MC42OS0yMi4zNjktMTU1LjE3My02NS4yMzItMjE1LjQ4Ni0xMjQuMTQtNi4zMjQtNi4yMDYtOS42MDMtMTQuODcyLTkuMTM1LTIzLjY1Ni40NjgtOC43ODMgNC44MDItMTcuMDk4IDExLjgyOC0yMi40ODUgMzguNTMtMjkuOTgxIDQ5LjE4OC04NC4yMDQgMjQuODI4LTEyNi4yNDctMjQuNDc2LTQyLjE2LTc2LjcwOC01OS45NjItMTIxLjc5Ny00MS45MjctOC4xOTcgMy4zOTctMTcuNTY2IDMuMDQ1LTI1LjQxMy0xLjA1NC03Ljg0Ny0zLjk4MS0xMy43MDItMTEuMjQyLTE1LjgxLTE5Ljc5MkE1MDQuNjY4IDUwNC42NjggMCAwIDEgNDkuNzIzIDUwOC41NGE1MDYuMDcgNTA2LjA3IDAgMCAxIDE1LjQ1OS0xMjQuMDIxYzIuMjI1LTguNTUgNy45NjMtMTUuODEgMTUuODEtMTkuOTEgNy44NDctNC4wOTggMTcuMDk4LTQuNDUgMjUuNDEzLTEuMDU0IDQ0Ljk3MSAxOC4yNyA5Ny4yMDQuMzUyIDEyMS42OC00MS44MDkgMjQuMzYtNDEuOTI2IDEzLjcwMi05Ni4yNjYtMjQuODI4LTEyNi4yNDctNy4wMjYtNS41MDQtMTEuMjQzLTEzLjcwMi0xMS44MjgtMjIuNDg1LS40NjktOC43ODQgMi44MS0xNy40NSA5LjEzNS0yMy42NTdDMjYwLjg3NiA5MC40NSAzMzUuNDc3IDQ3LjQ2OCA0MTYuMDUgMjUuMjE3YzguNjY3LTIuMjI1IDE3LjY4NC0uODIgMjUuMDYyIDMuOTgyIDcuMzc4IDQuOTE5IDEyLjI5NyAxMi42NDggMTMuNDY4IDIxLjQzMSA2LjU1OSA0OC4xMzQgNDguMjUgODQuNDM4IDk2Ljg1MiA4NC40MzggMzQuNzgyIDAgODQuMzItNTEuNzYzIDk3LjIwMy03NC40ODMtLjkzNy00LjY4NS0uNzAyLTkuNzIuNzAzLTE0LjY0IDQuOTE5LTE2LjE2IDIyLjAxNy0yNS4xNzggMzguMDYxLTIwLjYxaC4xMThDNzcxLjYwMyA1MC4zOTUgODQzLjg2IDkyLjIwNCA5MDIuMyAxNDkuMjM4YzYuMzI0IDYuMjA3IDkuNzIgMTQuODczIDkuMjUxIDIzLjY1Ny0uNDY4IDguNzgzLTQuODAxIDE2Ljk4LTExLjgyOCAyMi40ODUtMzguNDEzIDI5Ljk4LTQ5LjE4NyA4NC4yMDQtMjQuODI4IDEyNi4yNDcgMjQuNDc3IDQyLjE2IDc2LjgyNiA2MC4xOTYgMTIxLjc5NyA0MS44MWEzMC4xNjUgMzAuMTY1IDAgMCAxIDI1LjQxMyAxLjA1M2M3Ljk2NCAzLjk4MiAxMy43MDMgMTEuMjQzIDE1LjgxIDE5LjkxIDEwLjMwNiA0MC43NTUgMTUuNDYgODIuNDQ2IDE1LjQ2IDEyMy45MDRzLTUuMjcgODMuMTUtMTUuNDYgMTI0LjAyMmMtMi4yMjUgOC41NS03Ljk2MyAxNS44MS0xNS44MSAxOS43OTItNy45NjMgNC4xLTE3LjA5OCA0LjQ1LTI1LjQxMyAxLjA1NC00NC45NzEtMTguMTUyLTk3LjMyLS4yMzQtMTIxLjc5NyA0MS45MjYtMjQuMzYgNDEuOTI3LTEzLjcwMiA5Ni4yNjcgMjQuODI4IDEyNi4yNDcgNy4wMjcgNS4zODggMTEuMjQzIDEzLjU4NSAxMS44MjggMjIuNDg2cy0yLjgxIDE3LjQ1LTkuMjUxIDIzLjY1N2MtNjAuMTk2IDU4Ljc5LTEzNC42OCAxMDEuNzctMjE1LjQ4NyAxMjQuMTM5LTguNTUgMi4zNDItMTcuNjg0LjkzNy0yNC45NDUtMy45ODJhMzEuMzU4IDMxLjM1OCAwIDAgMS0xMy41ODUtMjEuNDMyYy02LjU1OC00OC4xMzMtNDguMTMzLTg0LjQzOC05Ni44NTItODQuNDM4LTQ4LjYwMiAwLTkwLjI5MyAzNi4zMDUtOTYuODUyIDg0LjQzOC0xLjE3IDguNzg0LTYuMDkgMTYuNTEzLTEzLjQ2OCAyMS40MzItNC45MTggMy43NDctMTAuNzc0IDUuMzg3LTE2Ljc0NyA1LjM4N3ptLTE1Ny42MzMtMTQ4LjAzYzQwLjQwNCAzNC4wOCA4Ni42NjMgNjAuNzgxIDEzNi4yMDIgNzguNDY1IDIyLjk1NC02MC40MyA4MS43NDQtMTAyLjcwNyAxNDguNzMyLTEwMi43MDcgNjYuOTg5IDAgMTI1Ljc3OSA0Mi4yNzcgMTQ4LjczMyAxMDIuNzA3IDQ5LjY1Ni0xNy42ODQgOTUuNzk4LTQ0LjM4NSAxMzYuMjAyLTc4LjQ2NS00MC44NzMtNTAuMzU4LTQ4LjEzNC0xMjIuMzgyLTE0LjUyMi0xODAuMzUzIDMzLjQ5NC01Ny44NTMgOTkuNTQ1LTg3LjI0OSAxNjMuMjU0LTc3LjUyOCA0LjY4NS0yNiA2LjkxLTUyLjM1IDYuOTEtNzguNDY1IDAtMjYuMTE2LTIuMzQyLTUyLjM1LTYuOTEtNzguNDY2LTYzLjQ3NSAxMC4zMDYtMTI5LjY0My0xOS42NzUtMTYzLjI1NC03Ny41MjgtMzMuNjEyLTU3Ljg1My0yNi4zNS0xMjkuODc4IDE0LjUyMi0xODAuMjM2LTM5LjQ2Ny0zMy4yNi04NS4zNzUtNTkuNDkzLTEzNi45MDUtNzguMzQ4LTI2LjExNiA0Mi44NjMtODkuMjQgMTAyLjQ3My0xNDguMDMgMTAyLjQ3My02Ni44NyAwLTEyNS42NjEtNDIuMjc3LTE0OC43MzItMTAyLjcwNy00OS41MzkgMTcuNTY3LTk1Ljc5OCA0NC4yNjgtMTM2LjIwMiA3OC41ODIgNDAuODcyIDUwLjM1OCA0OC4xMzMgMTIyLjM4MyAxNC41MjIgMTgwLjIzNi0zMy42MTEgNTcuODUzLTk5LjE5NCA4Ny42LTE2My4xMzcgNzcuNTI4YTQ0Mi4yOCA0NDIuMjggMCAwIDAtNy4wMjcgNzguNDY2IDQ0Mi4yOCA0NDIuMjggMCAwIDAgNy4wMjcgNzguNDY1YzYzLjU5Mi0xMC4wNzIgMTI5LjY0MyAxOS42NzUgMTYzLjI1NCA3Ny42NDUgMzMuMzc3IDU3LjczNyAyNi4yMzMgMTI5Ljg3OC0xNC42MzkgMTgwLjIzNnoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNTUxLjU1IDY2Ny45M2MtODcuNzE4IDAtMTU5LjE1Ni03MS40NC0xNTkuMTU2LTE1OS4yNzNTNDYzLjgzMiAzNDkuNSA1NTEuNTQ5IDM0OS41czE1OS4xNTYgNzEuNDM4IDE1OS4xNTYgMTU5LjE1Ni03MS40MzkgMTU5LjI3Mi0xNTkuMTU2IDE1OS4yNzJ6bTAtMjU3LjA2MmMtNTMuOTkgMC05Ny45MDcgNDMuOTE3LTk3LjkwNyA5Ny45MDZzNDMuOTE3IDk3LjkwNiA5Ny45MDYgOTcuOTA2YzUzLjk4OSAwIDk3Ljc4OS00My45MTggOTcuNzg5LTk3LjkwNnMtNDMuOC05Ny45MDYtOTcuNzg5LTk3LjkwNnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=" />
    ` + text;

    if (config["notify-auto-close"] == "true") {
      setTimeout(() => {
        el.className = "animate__animated animate__bounceOutRight";
      }, config["notify-auto-close-time"] * 1000);
    }

    el.addEventListener("click", (e) => {
      if (e.target.getAttribute("title") == "设置") {
        chrome.runtime.sendMessage({
          openOptionPage: true,
        });
        return;
      }
      if (e.target.nodeName == "IMG") {
        el.className = "animate__animated animate__bounceOutRight";
      }
    });

    _messageBox.push(el);
    document.body.appendChild(el);
  }

  try {
    appendStyle(`
      .animate__animated {
        animation-duration: 1s;
        animation-fill-mode: both;
      }
      .animate__bounceInRight {
        animation-name: bounceInRight;
      }
      @keyframes bounceInRight {
        from,
        60%,
        75%,
        90%,
        to {
          animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
      
        from {
          opacity: 0;
          transform: translate3d(3000px, 0, 0) scaleX(3);
        }
      
        60% {
          opacity: 1;
          transform: translate3d(-25px, 0, 0) scaleX(1);
        }
      
        75% {
          transform: translate3d(10px, 0, 0) scaleX(0.98);
        }
      
        90% {
          transform: translate3d(-5px, 0, 0) scaleX(0.995);
        }
      
        to {
          transform: translate3d(0, 0, 0);
        }
      }
      .animate__bounceOutRight {
        animation-name: bounceOutRight;
      }
      @keyframes bounceOutRight {
        20% {
          opacity: 1;
          transform: translate3d(-20px, 0, 0) scaleX(0.9);
        }
      
        to {
          opacity: 0;
          transform: translate3d(2000px, 0, 0) scaleX(2);
        }
      }
    `);
    window.addEventListener("load", collect);

    // 平均帧率
    getFPS().then((fps) => {
      chrome.runtime.sendMessage(
        {
          storage: {
            type: "getAll",
          },
        },
        (config) => {
          const _fps = {
            _1: fps == 0 ? "--" : fps + "fps",
            _1Status:
              fps == 0
                ? "NONE"
                : fps < config["fps-d-min"]
                ? "DANGER"
                : fps < config["fps-w-min"]
                ? "WARNING"
                : "NORMAL",
          };

          _fps._1StatusColor = LEVEL_COLOR[_fps._1Status];
          _fps._1Status == "DANGER" &&
            createMessage(`<b>📺 平均帧率：</b> ${_fps._1}`, "DANGER", config);
          chrome.runtime.sendMessage({
            fps: _fps,
          });
        }
      );
    });
  } catch (error) {
    console.error("PageStatus", error);
  }

  function collect() {
    const times = {};

    times.load = {
      _value:
        performance.timing.loadEventEnd - performance.timing.navigationStart,
      _raw: performance.getEntriesByType("navigation")[0].toJSON(),
    };

    if (times.load._value <= 0) {
      return setTimeout(collect, 50);
    }

    times.res = {
      _value: performance
        .getEntries()
        .filter((item) => item instanceof PerformanceResourceTiming),
    };

    // 取配置
    chrome.runtime.sendMessage(
      {
        storage: {
          type: "getAll",
        },
      },
      (config) => {
        // 页面加载时间
        times.load.status =
          times.load._value / 1000 > config["load-d-min"]
            ? "DANGER"
            : times.load._value / 1000 >= config["load-w-min"]
            ? "WARNING"
            : "NORMAL";
        times.load = {
          ...times.load,
          name: "⏱️ 页面加载时间",
          value: converTimeSecond(times.load._value),
          statusColor: LEVEL_COLOR[times.load.status],
          _dnsTime:
            times.load._raw.domainLookupEnd - times.load._raw.domainLookupStart,
          _tcpTime: times.load._raw.connectEnd - times.load._raw.connectStart,
          _reqTime:
            times.load._raw.responseStart - times.load._raw.requestStart,
          _resTime: times.load._raw.responseEnd - times.load._raw.responseStart,
          _domParseTime:
            times.load._raw.domComplete - times.load._raw.responseEnd,
        };
        times.load = {
          ...times.load,
          totalTime:
            times.load._dnsTime +
            times.load._tcpTime +
            times.load._reqTime +
            times.load._resTime +
            times.load._domParseTime,
          dnsTime: converTimeMicoSecond(times.load._dnsTime),
          tcpTime: converTimeMicoSecond(times.load._tcpTime),
          reqTime: converTimeMicoSecond(times.load._reqTime),
          resTime: converTimeMicoSecond(times.load._resTime),
          domParseTime: converTimeMicoSecond(times.load._domParseTime),
        };
        times.load = {
          ...times.load,
          percentDnsTime: ~~(
            (times.load._dnsTime / times.load.totalTime) *
            100
          ),
          percentTcpTime: ~~(
            (times.load._tcpTime / times.load.totalTime) *
            100
          ),
          percentReqTime: ~~(
            (times.load._reqTime / times.load.totalTime) *
            100
          ),
          percentResTime: ~~(
            (times.load._resTime / times.load.totalTime) *
            100
          ),
          percentDomParseTime: ~~(
            (times.load._domParseTime / times.load.totalTime) *
            100
          ),
        };
        times.load = {
          ...times.load,
          percentDnsTimeStart: 0,
          percentTcpTimeStart: times.load.percentDnsTime,
          percentReqTimeStart:
            times.load.percentTcpTime + times.load.percentDnsTime,
          percentResTimeStart:
            times.load.percentReqTime +
            times.load.percentTcpTime +
            times.load.percentDnsTime,
          percentDomParseTimeStart:
            times.load.percentResTime +
            times.load.percentReqTime +
            times.load.percentTcpTime +
            times.load.percentDnsTime,
        };
        times.load.status == "DANGER" &&
          createMessage(
            `<b>${times.load.name}：</b> ${times.load.value}`,
            "DANGER",
            config
          );

        // 加载资源数量
        times.res.status =
          times.res._value.length > config["res-d-min"]
            ? "DANGER"
            : times.res._value.length >= config["res-w-min"]
            ? "WARNING"
            : "NORMAL";
        times.res = {
          ...times.res,
          name: "🚂 加载资源数量",
          value: times.res._value.length + "个",
          statusColor: LEVEL_COLOR[times.res.status],
          list: times.res._value.map((item) => {
            return {
              typeIcon:
                FILE_TYPE_ICON[item.initiatorType] || FILE_TYPE_ICON.other,
              name: item.name,
              time: converTimeMicoSecond(item.responseEnd - item.fetchStart),
              _time: item.responseEnd - item.fetchStart,
              timeColor:
                item.responseEnd - item.fetchStart >= 1000
                  ? LEVEL_COLOR["DANGER"]
                  : converTimeMicoSecond(item.responseEnd - item.fetchStart) ==
                    "0ms"
                  ? "#eee"
                  : "inherit",
              timeThrough:
                converTimeMicoSecond(item.responseEnd - item.fetchStart) ==
                "0ms"
                  ? "line-through"
                  : "inherit",
              size: converSize(item.transferSize),
              _size: item.transferSize,
            };
          }),
        };
        times.res.status == "DANGER" &&
          createMessage(
            `<b>${times.res.name}：</b> ${times.res.value}`,
            "DANGER",
            config
          );

        // 大文件数量
        times.big = {
          name: "🐘 大资源数量",
          list: (times.res.list || [])
            .filter((item) => item._size >= config["big-size"] * 1024 * 1024)
            .sort((a, b) => b._size - a._size),
        };
        times.big = {
          ...times.big,
          value: times.big.list.length + "个",
          _value: times.big.list.length,
        };
        times.big.status =
          times.big._value > config["big-d-min"]
            ? "DANGER"
            : times.big._value >= config["big-w-min"]
            ? "WARNING"
            : "NORMAL";
        times.big.statusColor = LEVEL_COLOR[times.big.status];
        times.big.status == "DANGER" &&
          createMessage(
            `<b>${times.big.name}：</b> ${times.big.value}`,
            "DANGER",
            config
          );

        // 慢资源数量
        times.slow = {
          name: "🐢 慢资源数量",
          list: (times.res.list || [])
            .filter((item) => item._time >= config["slow-time"])
            .sort((a, b) => b._time - a._time),
        };
        times.slow = {
          ...times.slow,
          value: times.slow.list.length + "个",
          _value: times.slow.list.length,
        };
        times.slow.status =
          times.slow._value > config["slow-d-min"]
            ? "DANGER"
            : times.slow._value >= config["slow-w-min"]
            ? "WARNING"
            : "NORMAL";
        times.slow.statusColor = LEVEL_COLOR[times.slow.status];
        times.slow.status == "DANGER" &&
          createMessage(
            `<b>${times.slow.name}：</b> ${times.slow.value}`,
            "DANGER",
            config
          );

        // 时间
        times.time = new Date().toLocaleString();
        chrome.runtime.sendMessage({
          times,
        });
      }
    );
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      _visibleWindow = !document.hidden;
    }
  });
})();
