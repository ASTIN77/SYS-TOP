const { app, Menu, Tray } = require("electron");

class AppTray extends Tray {
  constructor(icon, mainWindow) {
    super(icon);
    this.mainWindow = mainWindow;
    this.setToolTip("SysTop");

    this.on("click", () => {
      if (this.mainWindow.isVisible() === true) {
        this.mainWindow.hide();
      } else {
        this.mainWindow.show();
      }
    });

    this.on("right-click", () => {
      const contextMenu = Menu.buildFromTemplate([
        {
          label: "Quit",
          click: () => {
            app.isQuitting = true;
            app.quit();
          },
        },
      ]);
      this.popUpContextMenu(contextMenu);
    });
  }
}

module.exports = AppTray;
