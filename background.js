chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.requestCapture) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
                chrome.tabs.sendMessage(tab.id, {
                    action: "captureImage",
                    dataUrl: dataUrl
                });
            });
        });
    }
});