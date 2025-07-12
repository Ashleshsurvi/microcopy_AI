chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generateMicrocopy",
    title: "Generate Microcopy Variations",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generateMicrocopy") {
    // Save the selected text in storage
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      // Open the popup
      chrome.action.openPopup();
    });
  }
});
