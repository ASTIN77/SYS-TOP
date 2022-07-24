const path = require("path");
const osu = require("node-os-utils");
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;
let platform = "";
let cpuOverload;
let alertFrequency;

// Get seetings and values
ipcRenderer.on("settings:get", (e, settings) => {
  cpuOverload = +settings.cpuOverload;
  alertFrequency = +settings.alertFrequency;
});

// Show days, hours minutes and seconds
const secondstoDhms = (seconds) => {
  seconds += seconds;
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return `${d} Days, ${h} Hours, ${m} Minutes and ${s} Seconds.`;
};

// Run  every 2 seconds
setInterval(() => {
  // CPU usage
  cpu.usage().then((info) => {
    document.getElementById("cpu-usage").innerText = info + "%";
    document.getElementById("cpu-progress").style.width = info + "%";

    // Make progress bar red if overload

    if (info >= cpuOverload) {
      document.getElementById("cpu-progress").style.background = "red";
    } else {
      document.getElementById("cpu-progress").style.background = "#30c88b";
    }
    // Check Overload
    if (info >= cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        title: "CPU overload",
        body: `CPU is over ${cpuOverload}%`,
        icon: path.join(__dirname, "img", "icon.png"),
      });

      localStorage.setItem("lastNotify", +new Date());
    }
  });

  // CPU Free
  cpu.free().then((info) => {
    document.getElementById("cpu-free").innerText = info + "%";
  });
}, 2000);
// System uptime

document.getElementById("sys-uptime").innerText = secondstoDhms(os.uptime());

// Set model

document.getElementById("cpu-model").innerText = cpu.model();

// Computer Name
document.getElementById("comp-name").innerText = os.hostname();

// OS

os.type() == "Darwin" ? (platform = "MacOS") : (platform = os.type());

document.getElementById("os").innerText = `${platform} ${os.arch()}`;

// Total Memory

mem.info().then((info) => {
  document.getElementById("mem-total").innerText = `${info.totalMemMb} Mb  /  ${
    info.totalMemMb / 1024
  } Gb`;
});

// Send notification
const notifyUser = (options) => {
  new Notification(options.title, options);
};

// Check how much time has passed since notification

const runNotify = (frequency) => {
  if (localStorage.getItem("lastNotify") === null) {
    // Store timestamp
    localStorage.setItem("lastNotify", +new Date());
    return true;
  }
  const notifyTime = new Date(parseInt(localStorage.getItem("lastNotify")));
  const now = new Date();
  const diffTime = Math.abs(now - notifyTime);
  const minutesPast = Math.ceil(diffTime / (1000 * 60));
  if (minutesPast > frequency) {
    return true;
  } else {
    return false;
  }
};
