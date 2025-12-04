import { useMonitorStore } from "@/store/monitor";

export default class Ocx {
  constructor(options) {
    this.oWebControl = null;

    if (!document || typeof window === "undefined") {
      throw new Error("document不存在");
    }

    this.el = options.el || "playWnd";
    const $el = document.getElementById(this.el);
    if (!$el) {
      throw new Error(`未找到指定容器：${this.el}，请检查是否设置正确的元素ID`);
    }

    const _width = $el.offsetWidth;
    const _height = $el.offsetHeight;
    this.lock = options.width !== undefined && options.height !== undefined;
    this.width = options.width || _width;
    this.height = options.height || _height;

    this.options = options;

    this.success = options.success || function () {};
    this.error = options.error || function () {};

    this.iLastCoverLeft = 0;
    this.iLastCoverTop = 0;
    this.iLastCoverRight = 0;
    this.iLastCoverBottom = 0;

    if (options.autoLoad) {
      this.run(true);
    }
    // window.addEventListener('resize', this.resize.bind(this))
    // window.addEventListener('scroll', this.resize.bind(this))
    // window.addEventListener('resize', () => {
    //   this.resize()
    // })
    // window.addEventListener('scroll', () => {
    //   this.resize()
    // })
    window.onbeforeunload = () => {
      this.close();
    };
  }

  run(autoCreateWnd) {
    const that = this;
    return new Promise((resolve) => {
      that.oWebControl = new window.WebControl({
        szPluginContainer: that.el,
        iServicePortStart: that.options.iServicePortStart || 14460, // 对应 LocalServiceConfig.xml 中的ServicePortStart值
        iServicePortEnd: that.options.iServicePortEnd || 14460, // 对应 LocalServiceConfig.xml 中的ServicePortEnd值
        szClassId: that.options.szClassId || "FD400310-EC09-4CE9-BFD4-13E8C6E7D6CA",
        cbConnectSuccess: function () {
          that.callback(that.options.callback);
          that.oWebControl
            .JS_StartService("window", {
              dllPath: that.options.dllPath,
            })
            .catch((e) => {
              console.log("121321231", e);
            })
            .then(
              function () {
                if (autoCreateWnd) {
                  window.addEventListener("resize", that.resize.bind(that));
                  window.addEventListener("scroll", that.resize.bind(that));

                  const currentState = useMonitorStore.getState();
                  const initData = currentState.initData || {};
                  const params = {
                    playHandle: 0,
                    showMode: 1,
                    moduleIndex: 0,
                    artemisToken: initData.artemisToken,
                    artemisUrl: initData.artemisUrl,
                    productCode: initData.productCode,
                    projectId: initData.projectId,
                    strAuthorization: initData.strAuthorization,
                    userIndexCode: "564171090096672",
                    keepLiveUrl: initData.keepLiveUrl,
                    needPictureResult: 1,
                    notifyPlayBackTimes: 10,
                    defaultStreamType: 1,
                    playRealAdaptiveLayou: initData.playRealAdaptiveLayou,
                    playBackAdaptiveLayou: initData.playBackAdaptiveLayou,
                  };
                  console.log(params);
                  that.sendCommonParams("Hik_ParamBeforCreatWnd", params);
                }
                resolve();
              },
              function () {
                console.error("JS_CreateWnd failed");
                that.error();
              },
            );
        },
        cbConnectError: function () {
          console.error("cbConnectError");
          that.oWebControl = null;
          that.error();
        },
        cbConnectClose: function (bNormalClose) {
          // 连接异常断开：bNormalClose = false
          // JS_Disconnect正常断开：bNormalClose = true
          console.warn(`连接关闭. ${bNormalClose ? "正常断开" : "异常断开"}`);
          that.oWebControl = null;
        },
      });
    });
  }

  sendCommonParams(funcName = "Hik_ParamBeforCreatWnd", params) {
    this.request({
      funcName,
      arguments: params,
    }).then((res) => {
      console.log(res);
      this.createWnd();
    });
  }

  createWnd(options = {}) {
    const that = this;
    return new Promise((resolve) => {
      const { width, height, el } = that;
      that.oWebControl.JS_CreateWnd(el, width, height, options).then(function () {
        that.clientResize("SendPlayWndSize", width, height);
        that._setWndCover();
        that.success();

        that.options.afterCreateWnd && that.options.afterCreateWnd(that);
        resolve();
      });
    });
  }

  clientResize(funcName = "SendPlayWndSize", width, height) {
    this.request({
      funcName,
      arguments: {
        arg1: width,
        arg2: height,
      },
    });
  }

  request(params) {
    return new Promise((resolve) => {
      this.oWebControl
        .JS_RequestInterface({
          funcName: params.funcName,
          arguments: params.arguments,
        })
        .then((oData) => {
          resolve(oData);
        });
    });
  }

  callback(cb) {
    const that = this;
    that.oWebControl.JS_SetWindowControlCallback({
      cbIntegrationCallBack: function (data) {
        cb(data, that);
      },
    });
  }

  cut(left = 0, top = 0, width = this.width, height = this.height) {
    this.oWebControl.JS_CuttingPartWindow(left, top, width + 1, height);
  }

  repair(left = 0, top = 0, width = this.width, height = this.height) {
    this.oWebControl.JS_RepairPartWindow(left, top, width + 1, height);
  }

  close(success, error) {
    if (this.oWebControl != null) {
      const that = this;
      const bIE = !!window.ActiveXObject || "ActiveXObject" in window; // 是否为IE浏览器

      this.request({ funcName: "destroyWnd" });
      window.removeEventListener("resize", this.resize.bind(this));
      window.removeEventListener("scroll", this.resize.bind(this));

      if (bIE) {
        if (this.oWebControl != null) {
          that.oWebControl.JS_Disconnect().then(
            function () {
              success && success();
            },
            function () {
              error && error();
            },
          );
        }
      } else {
        if (this.oWebControl != null) {
          that.oWebControl.JS_DestroyWnd().then(
            function () {},
            function () {
              error && error();
            },
          );
          that.oWebControl.JS_StopService("window").then(function () {
            that.oWebControl.JS_Disconnect().then(
              function () {
                success && success();
              },
              function () {
                error && error();
              },
            );
          });
        }
      }
    }
  }

  resize() {
    if (this.oWebControl !== null) {
      let { width, height } = this;
      if (!this.lock) {
        const $el = document.getElementById(this.el);
        if (!$el) return;
        width = $el.offsetWidth;
        height = $el.offsetHeight;
        this.oWebControl.JS_Resize(width, height);
      } else {
        this.oWebControl.JS_Resize(width, height);
        this._setWndCover();
      }
    }
  }

  wakeUp(path) {
    window.WebControl.JS_WakeUp(path);
  }

  _setWndCover() {
    if (!document.getElementById(this.el)) return;

    const { width, height } = this;

    const iWidth = window.innerWidth;
    const iHeight = window.innerHeight;
    const oDivRect = document.getElementById(this.el).getBoundingClientRect();

    let iCoverLeft = oDivRect.left < 0 ? Math.abs(oDivRect.left) : 0;
    let iCoverTop = oDivRect.top < 0 ? Math.abs(oDivRect.top) : 0;
    let iCoverRight = oDivRect.right - iWidth > 0 ? Math.round(oDivRect.right - iWidth) : 0;
    let iCoverBottom = oDivRect.bottom - iHeight > 0 ? Math.round(oDivRect.bottom - iHeight) : 0;

    iCoverLeft = iCoverLeft > width ? width : iCoverLeft;
    iCoverTop = iCoverTop > height ? height : iCoverTop;
    iCoverRight = iCoverRight > width ? width : iCoverRight;
    iCoverBottom = iCoverBottom > height ? height : iCoverBottom;

    if (this.iLastCoverLeft !== iCoverLeft) {
      this.iLastCoverLeft = iCoverLeft;
    }
    if (this.iLastCoverTop !== iCoverTop) {
      if (iCoverTop === 0) {
        this.oWebControl.JS_RepairPartWindow(0, 0, width, height);
        this.oWebControl.JS_CuttingPartWindow(width - iCoverRight, 0, iCoverRight, height);
      }
      this.iLastCoverTop = iCoverTop;
      if (oDivRect.right - iWidth > 0) {
        this.oWebControl.JS_RepairPartWindow(0, 0, width, height);
        this.oWebControl.JS_CuttingPartWindow(width - iCoverRight, 0, iCoverRight, height);
        this.oWebControl.JS_CuttingPartWindow(0, 0, width, iCoverTop);
      } else {
        this.oWebControl.JS_RepairPartWindow(0, 0, width, height);
        this.oWebControl.JS_CuttingPartWindow(0, 0, width, iCoverTop);
      }
    }
    if (this.iLastCoverRight !== iCoverRight) {
      if (iCoverRight === 0) {
        this.oWebControl.JS_RepairPartWindow(0, 0, width, height);
        this.oWebControl.JS_CuttingPartWindow(0, 0, width, iCoverTop);
      }

      this.iLastCoverRight = iCoverRight;

      if (oDivRect.top < 0) {
        this.oWebControl.JS_RepairPartWindow(0, 0, width, height);
        this.oWebControl.JS_CuttingPartWindow(0, 0, width, iCoverTop);
        this.oWebControl.JS_CuttingPartWindow(width - iCoverRight, 0, iCoverRight, height);
      } else {
        this.oWebControl.JS_RepairPartWindow(0, 0, width, height);
        this.oWebControl.JS_CuttingPartWindow(width - iCoverRight, 0, iCoverRight, height);
      }

      if (oDivRect.bottom - iHeight > 0) {
        this.oWebControl.JS_CuttingPartWindow(0, height - iCoverBottom, width, iCoverBottom + 20);
      }
    }
    if (this.iLastCoverBottom !== iCoverBottom) {
      this.iLastCoverBottom = iCoverBottom;

      this.oWebControl.JS_RepairPartWindow(0, 0, width, height);
      this.oWebControl.JS_CuttingPartWindow(0, 0, width, iCoverTop);
      this.oWebControl.JS_CuttingPartWindow(width - iCoverRight, 0, iCoverRight, height);
      this.oWebControl.JS_CuttingPartWindow(0, height - iCoverBottom, width, iCoverBottom + 20);
    }
  }
}
