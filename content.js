function copyTitle() {
    const title = "[JAVA-자바] " + document.title;
    navigator.clipboard.writeText(title);
}

function copyTag() {
    const tags = "자바,JAVA,코딩,코딩테스트,코테,알고리즘,백준," +
        Array.from(document.querySelectorAll('.spoiler-link'))
            .map(el => el.textContent.trim())
            .join(',');

    navigator.clipboard.writeText(tags);
}

function captureImage(dataUrl) {
    const pageHeader = document.querySelector(".page-header");
    const sampleInput = document.querySelector("#sampleinput1");

    const headerRect = pageHeader.getBoundingClientRect();
    const sampleRect = sampleInput.getBoundingClientRect();

    const padding = 15;

    const rect = {
        x: headerRect.left - padding,
        y: headerRect.top - padding,
        width: headerRect.width + (2 * padding),
        height: sampleRect.top - headerRect.top,
    };

    const scale = window.devicePixelRatio;

    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            img,
            rect.x * scale,
            rect.y * scale,
            rect.width * scale,
            rect.height * scale,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(blob => {
            if (!blob) {
                console.error("Blob 변환 실패");
                return;
            }
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]);
        }, "image/png");
    };

    img.onerror = err => {
        console.error("이미지 로드 실패:", err);
    };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "copyTitle") {
        copyTitle();
    }
    else if (message.action === "copyTag") {
        copyTag();
    }
    else if (message.action === "captureImage") {
        captureImage(message.dataUrl);
    }
});

window.addEventListener("load", () => {
    const targetDiv = document.querySelector(".btn-group.pull-right.problem-button");
    if (!targetDiv) return;

    const buttonConfigs = [
        { text: "제목", action: "copyTitle" },
        { text: "태그", action: "copyTag" },
        { text: "캡쳐", action: "captureImage" }
    ];

    buttonConfigs.forEach(({ text, action }) => {
        const button = document.createElement("button");
        button.className = "btn btn-default";
        button.type = "button";
        const span = document.createElement("span");
        span.textContent = text;
        button.appendChild(span);

        button.addEventListener("click", () => {
            if (action === "copyTitle") {
                copyTitle();
            } else if (action === "copyTag") {
                copyTag();
            } else if (action === "captureImage") {
                chrome.runtime.sendMessage({ requestCapture: true });
            }
        });

        targetDiv.appendChild(button);
    });
});
