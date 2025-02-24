const URL = ["https://www.acmicpc.net/problem/*"];

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "copyTitle",
        title: "문제 복사하기",
        contexts: ["all"],
        documentUrlPatterns: URL
    });
    chrome.contextMenus.create({
        id: "copyTag",
        title: "문제 분류 복사하기",
        contexts: ["all"],
        documentUrlPatterns: URL
    });
    chrome.contextMenus.create({
        id: "captureImage",
        title: "문제 캡처하기",
        contexts: ["all"],
        documentUrlPatterns: URL
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copyTitle") {
        chrome.tabs.sendMessage(tab.id, { action: "copyTitle" });
    }
    else if (info.menuItemId === "copyTag") {
        chrome.tabs.sendMessage(tab.id, { action: "copyTag" });
    }
    else if (info.menuItemId === "captureImage") {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
            chrome.tabs.sendMessage(tab.id, { action: "captureImage", dataUrl: dataUrl });
        });

    }
});