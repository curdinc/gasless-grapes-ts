export function runChromeListeners() {
  chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);
  });

  chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      checkCommandShortcuts();
      const url = chrome.runtime.getURL("popup.html");
      chrome.tabs
        .create({
          url,
        })
        .catch((e) => {
          console.error("Error opening onboarding page", e);
        });
    }
  });
}

function checkCommandShortcuts() {
  chrome.commands.getAll((commands) => {
    const missingShortcuts = [];

    for (const { name, shortcut } of commands) {
      if (shortcut === "") {
        missingShortcuts.push(name);
      }
    }
    if (missingShortcuts.length > 0) {
      // Update the extension UI to inform the user that one or more
      // commands are currently unassigned.
      console.log("missingShortcuts", missingShortcuts);
    }
  });
}
