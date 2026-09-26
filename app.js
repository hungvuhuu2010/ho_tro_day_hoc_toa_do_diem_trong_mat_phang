/*
ÔN TẬP TỌA ĐỘ ĐIỂM

* Mặt phẳng sử dụng SVG
* Hệ tọa độ toán học độc lập với pixel
* Hai dạng bài:

  1. Đọc tọa độ
  2. Vẽ điểm theo tọa độ
     =========================================================
     */

/* =====================================================
CẤU HÌNH
===================================================== */

const CONFIG = {
min: -10,
max: 10,


// Số pixel cho một đơn vị tọa độ
scale: 45,

points: ["A", "B", "C", "D"]


};

/* =====================================================
TRẠNG THÁI
===================================================== */

const state = {


mode: "read",

exercise: {
    name: "A",
    x: 2,
    y: 3
},

score: 0,

answered: false


};

/* =====================================================
DOM
===================================================== */

const svg =
document.getElementById("coordinate-system");

const viewport =
document.querySelector(".graph-viewport");

const cursorCoords =
document.getElementById("cursor-coords");

const readPanel =
document.getElementById("read-panel");

const plotPanel =
document.getElementById("plot-panel");

const tabs =
document.querySelectorAll(".mode-tab");

const answerX =
document.getElementById("answer-x");

const answerY =
document.getElementById("answer-y");

const checkAnswer =
document.getElementById("check-answer");

const readFeedback =
document.getElementById("read-feedback");

const plotFeedback =
document.getElementById("plot-feedback");

const readPointName =
document.getElementById("read-point-name");

const plotPointName =
document.getElementById("plot-point-name");

const targetCoordinate =
document.getElementById("target-coordinate");

const scoreElement =
document.getElementById("score");

const newExerciseButton =
document.getElementById("new-exercise");

/* =====================================================
SVG UTILITIES
===================================================== */

const SVG_NS =
"http://www.w3.org/2000/svg";

function createSVGElement(type, attributes = {}) {


const element =
    document.createElementNS(SVG_NS, type);

for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
}

return element;


}

/* =====================================================
VIEW
===================================================== */

let view = {
width: 800,
height: 600,


centerX: 0,
centerY: 0,

scale: CONFIG.scale


};

/* =====================================================
CHUYỂN TỌA ĐỘ
===================================================== */

function mathToSvg(x, y) {


return {
    x:
        view.width / 2 +
        view.centerX +
        x * view.scale,

    y:
        view.height / 2 +
        view.centerY -
        y * view.scale
};


}

function svgToMath(px, py) {


return {

    x:
        (px -
            view.width / 2 -
            view.centerX) /
        view.scale,

    y:
        (view.height / 2 +
            view.centerY -
            py) /
        view.scale
};


}

/* =====================================================
CẬP NHẬT KÍCH THƯỚC
===================================================== */

function updateViewSize() {
    const rect = viewport.getBoundingClientRect();

    view.width = rect.width;
    view.height = rect.height;

    // Tính tỉ lệ để toàn bộ hệ tọa độ từ -10 đến 10
    // luôn nằm gọn trong vùng hiển thị.
    const padding = 40;

    const availableWidth = view.width - padding * 2;
    const availableHeight = view.height - padding * 2;

    // Có 20 đơn vị từ -10 đến +10.
    // Dùng cùng một scale cho cả hai chiều để giữ đúng hình vuông.
    const scaleX = availableWidth / (CONFIG.max - CONFIG.min);
    const scaleY = availableHeight / (CONFIG.max - CONFIG.min);

    // Lấy scale nhỏ hơn để hệ tọa độ không bị tràn.
    view.scale = Math.max(1, Math.min(scaleX, scaleY));

    // SVG luôn chiếm toàn bộ vùng graph
    svg.setAttribute("viewBox", `0 0 ${view.width} ${view.height}`);
    svg.setAttribute("width", view.width);
    svg.setAttribute("height", view.height);

    // Vẽ lại toàn bộ hệ tọa độ theo kích thước mới
    drawCoordinateSystem();
}

/* =====================================================
MŨI TÊN TRỤC
===================================================== */

function createArrowMarker() {


const defs =
    createSVGElement("defs");

const marker =
    createSVGElement("marker", {
        id: "axis-arrow",
        viewBox: "0 0 10 10",
        refX: "6",
        refY: "5",
        markerWidth: "6",
        markerHeight: "6",
        orient: "auto-start-reverse"
    });

const path =
    createSVGElement("path", {
        d: "M 0 2 L 10 5 L 0 8 Z",
        fill: "#475569"
    });

marker.appendChild(path);
defs.appendChild(marker);

svg.appendChild(defs);


}

/* =====================================================
VẼ LƯỚI
===================================================== */

function drawGrid(group) {


for (
    let x = CONFIG.min;
    x <= CONFIG.max;
    x++
) {

    if (x === 0) continue;

    const p1 =
        mathToSvg(x, CONFIG.min);

    const p2 =
        mathToSvg(x, CONFIG.max);

    const line =
        createSVGElement("line", {
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            class: "grid-line"
        });

    group.appendChild(line);
}


for (
    let y = CONFIG.min;
    y <= CONFIG.max;
    y++
) {

    if (y === 0) continue;

    const p1 =
        mathToSvg(CONFIG.min, y);

    const p2 =
        mathToSvg(CONFIG.max, y);

    const line =
        createSVGElement("line", {
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            class: "grid-line"
        });

    group.appendChild(line);
}


}

/* =====================================================
VẼ TRỤC
===================================================== */

function drawAxes(group) {


const origin =
    mathToSvg(0, 0);


/* Ox */

const axisX =
    createSVGElement("line", {
        x1: 0,
        y1: origin.y,
        x2: view.width,
        y2: origin.y,
        class: "axis",
        "marker-end": "url(#axis-arrow)"
    });

group.appendChild(axisX);


/* Oy */

const axisY =
    createSVGElement("line", {
        x1: origin.x,
        y1: view.height,
        x2: origin.x,
        y2: 0,
        class: "axis",
        "marker-end": "url(#axis-arrow)"
    });

group.appendChild(axisY);


/* x */

const labelX =
    createSVGElement("text", {
        x: view.width - 18,
        y: origin.y - 10,
        class: "axis-label"
    });

labelX.textContent = "x";

group.appendChild(labelX);


/* y */

const labelY =
    createSVGElement("text", {
        x: origin.x + 10,
        y: 22,
        class: "axis-label"
    });

labelY.textContent = "y";

group.appendChild(labelY);


/* O */

const labelO =
    createSVGElement("text", {
        x: origin.x + 8,
        y: origin.y + 18,
        class: "origin-label"
    });

labelO.textContent = "O";

group.appendChild(labelO);


}

/* =====================================================
VẼ VẠCH VÀ SỐ
===================================================== */

function drawTicks(group) {


const origin =
    mathToSvg(0, 0);


for (
    let x = CONFIG.min;
    x <= CONFIG.max;
    x++
) {

    if (x === 0) continue;

    const p =
        mathToSvg(x, 0);

    const tick =
        createSVGElement("line", {
            x1: p.x,
            y1: origin.y - 5,
            x2: p.x,
            y2: origin.y + 5,
            class: "tick"
        });

    group.appendChild(tick);


    const text =
        createSVGElement("text", {
            x: p.x,
            y: origin.y + 20,
            class: "axis-number"
        });

    text.textContent = x;

    group.appendChild(text);
}


for (
    let y = CONFIG.min;
    y <= CONFIG.max;
    y++
) {

    if (y === 0) continue;

    const p =
        mathToSvg(0, y);

    const tick =
        createSVGElement("line", {
            x1: origin.x - 5,
            y1: p.y,
            x2: origin.x + 5,
            y2: p.y,
            class: "tick"
        });

    group.appendChild(tick);


    const text =
        createSVGElement("text", {
            x: origin.x + 10,
            y: p.y + 5,
            class: "axis-number"
        });

    text.setAttribute(
        "text-anchor",
        "start"
    );

    text.textContent = y;

    group.appendChild(text);
}


}

/* =====================================================
VẼ ĐIỂM BÀI TẬP
===================================================== */

function drawExercisePoint(group) {
    // Chỉ vẽ điểm khi đang ở chế độ:
    // 1. Đọc tọa độ
    // 2. Phản xạ
    if (state.mode !== "read" && state.mode !== "reflex") {
        return;
    }

    const { x, y, name } = state.exercise;

    const { x: sx, y: sy } = mathToSvg(x, y);

    // Điểm
    const point = createSVGElement("circle");

    point.setAttribute("cx", sx);
    point.setAttribute("cy", sy);
    point.setAttribute("r", 7);
    point.setAttribute("class", "exercise-point");

    // Tên điểm
    const label = createSVGElement("text");

    label.setAttribute("x", sx + 12);
    label.setAttribute("y", sy - 12);
    label.setAttribute("class", "point-label");

    label.textContent = name;

    group.appendChild(point);
    group.appendChild(label);
}

/* =====================================================
VẼ TOÀN BỘ
===================================================== */

function drawCoordinateSystem() {


svg.innerHTML = "";

createArrowMarker();


const gridGroup =
    createSVGElement("g");

const axesGroup =
    createSVGElement("g");

const ticksGroup =
    createSVGElement("g");

const pointGroup =
    createSVGElement("g");


drawGrid(gridGroup);
drawAxes(axesGroup);
drawTicks(ticksGroup);
drawExercisePoint(pointGroup);


svg.appendChild(gridGroup);
svg.appendChild(axesGroup);
svg.appendChild(ticksGroup);
svg.appendChild(pointGroup);


}

/* =====================================================
TẠO BÀI MỚI
===================================================== */

function randomInteger() {


return Math.floor(
    Math.random() *
    (
        CONFIG.max -
        CONFIG.min +
        1
    )
) + CONFIG.min;


}

// =====================================================
// CẬP NHẬT HÀM TẠO BÀI TẬP THÔNG THƯỜNG VÀ PHẢN XẠ
// =====================================================
function generateExercise() {
    const coords = generateCoordinate();
    const x = coords.x;
    const y = coords.y;

    const name =
        CONFIG.points[
            Math.floor(
                Math.random() *
                CONFIG.points.length
            )
        ];

    state.exercise = {
        name,
        x,
        y
    };

    state.answered = false;
    updateExerciseUI();
    drawCoordinateSystem();
}

/* =====================================================
CẬP NHẬT PANEL
===================================================== */

function updateExerciseUI() {


readPointName.textContent =
    state.exercise.name;

plotPointName.textContent =
    state.exercise.name;

targetCoordinate.textContent =
    `(${state.exercise.x}; ${state.exercise.y})`;


answerX.value = "";
answerY.value = "";


clearFeedback();


}

/* =====================================================
CHUYỂN DẠNG BÀI
===================================================== */

// =========================================================
// CHẾ ĐỘ PHẢN XẠ
// =========================================================

// DOM của chế độ phản xạ
const reflexPanel = document.getElementById("reflex-panel");
const reflexPointName = document.getElementById("reflex-point-name");
const reflexAnswerX = document.getElementById("reflex-answer-x");
const reflexAnswerY = document.getElementById("reflex-answer-y");
const reflexSubmit = document.getElementById("reflex-submit");
const reflexFeedback = document.getElementById("reflex-feedback");
const reflexScoreElement = document.getElementById("score");

// Modal luật chơi
const reflexRulesModal = document.getElementById("reflex-rules-modal");
const reflexCancel = document.getElementById("reflex-cancel");
const reflexStart = document.getElementById("reflex-start");


// Trạng thái riêng của chế độ phản xạ
const reflexState = {
    score: 0,
    started: false,
    finished: false
};


// =========================================================
// CHUYỂN CHẾ ĐỘ
// =========================================================

/* =====================================================
THÊM BIẾN LƯU TÊN HỌC SINH
===================================================== */
let studentName = "";
const studentNameInput = document.getElementById("student-name-input");

// Biến tham chiếu tới nút Bài mới để ẩn/hiện
const newExerciseBtn = document.getElementById("new-exercise");

// =====================================================
// CẬP NHẬT CHUYỂN CHẾ ĐỘ (Hỗ trợ ẩn nút Bài mới & Tên)
// =====================================================
function setMode(mode) {
    if (mode === "reflex") {
        reflexRulesModal.hidden = false;
        // Focus vào ô nhập tên nếu có modal mở lên
        setTimeout(() => {
            if (studentNameInput) studentNameInput.focus();
        }, 100);
        return;
    }

    state.mode = mode;

    readPanel.hidden = mode !== "read";
    plotPanel.hidden = mode !== "plot";
    reflexPanel.hidden = true;

    // Ở chế độ thông thường, hiện nút bài mới
    newExerciseBtn.hidden = false;
    
    // Đổi hiển thị khung điểm về mặc định (chữ "Điểm")
    document.querySelector(".score span").textContent = "Điểm";

    tabs.forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.mode === mode
        );
    });

    generateExercise();
}


// =====================================================
// BẮT ĐẦU CHẾ ĐỘ PHẢN XẠ (Kiểm tra tên & Ẩn nút bài mới)
// =====================================================
function startReflexMode() {
    const enteredName = studentNameInput.value.trim();
    if (!enteredName) {
        alert("Vui lòng nhập họ và tên trước khi bắt đầu!");
        studentNameInput.focus();
        return;
    }

    studentName = enteredName;
    reflexRulesModal.hidden = true;

    state.mode = "reflex";

    readPanel.hidden = true;
    plotPanel.hidden = true;
    reflexPanel.hidden = false;

    // Ẩn nút "Bài mới" ở chế độ phản xạ vì câu hỏi tự động sinh
    newExerciseBtn.hidden = true;

    tabs.forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.mode === "reflex"
        );
    });

    reflexState.score = 0;
    reflexState.started = true;
    reflexState.finished = false;
    
    reflexAnswerX.disabled = false;
    reflexAnswerY.disabled = false;
    reflexSubmit.disabled = false;

    // Hiển thị tên học sinh thay thế hoặc kết hợp trên nhãn khung Điểm
    document.querySelector(".score span").innerHTML = `Điểm (${studentName})`;
    reflexScoreElement.textContent = "0";
    reflexFeedback.textContent = "";

    generateReflexExercise();
    reflexAnswerX.focus();
}



// =========================================================
// HỦY VÀO CHẾ ĐỘ PHẢN XẠ
// =========================================================

function cancelReflexMode() {
    reflexRulesModal.hidden = true;

    // Tìm lại chế độ hiện tại trước khi mở modal
    const currentTab = [...tabs].find(
        tab => tab.classList.contains("active")
    );

    const previousMode =
        currentTab?.dataset.mode || "read";

    state.mode = previousMode;

    readPanel.hidden = previousMode !== "read";
    plotPanel.hidden = previousMode !== "plot";
    reflexPanel.hidden = true;

    tabs.forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.mode === previousMode
        );
    });
}


// =========================================================
// TẠO CÂU HỎI MỚI CHO PHẢN XẠ
// =========================================================

function generateReflexExercise() {
    const coords = generateCoordinate();
    const x = coords.x;
    const y = coords.y;

    const name =
        CONFIG.points[
            Math.floor(Math.random() * CONFIG.points.length)
        ];

    state.exercise = {
        name,
        x,
        y
    };

    state.answered = false;

    reflexPointName.textContent = name;
    reflexAnswerX.value = "";
    reflexAnswerY.value = "";
    reflexFeedback.textContent = "";

    drawCoordinateSystem();
}


// =========================================================
// KIỂM TRA CÂU TRẢ LỜI PHẢN XẠ
// =========================================================

function checkReflexAnswer() {
    // Không xử lý nếu chưa bắt đầu
    // hoặc đã đạt 10 điểm.
    if (!reflexState.started || reflexState.finished) {
        return;
    }

    const x = Number(reflexAnswerX.value);
    const y = Number(reflexAnswerY.value);

    const correct =
        x === state.exercise.x &&
        y === state.exercise.y;

    if (correct) {

        // Đúng → cộng 1
        reflexState.score++;

        reflexScoreElement.textContent =
            reflexState.score;

        reflexFeedback.textContent =
            "✓ Chính xác!";

        reflexFeedback.className =
            "feedback correct";

        // Đạt 10 câu liên tiếp
        if (reflexState.score >= 10) {
            finishReflexMode();
            return;
        }

        // Chờ rất ngắn để học sinh thấy kết quả
        // rồi chuyển ngay sang câu tiếp theo.
        setTimeout(() => {
            if (
                state.mode === "reflex" &&
                reflexState.started &&
                !reflexState.finished
            ) {
                generateReflexExercise();
                reflexAnswerX.focus();
            }
        }, 300);

    } else {

        // Sai → về 0
        reflexState.score = 0;

        reflexScoreElement.textContent = "0";

        reflexFeedback.textContent =
            `✗ Chưa chính xác. Đáp án là (${state.exercise.x}; ${state.exercise.y}). Chuỗi điểm trở về 0.`;

        reflexFeedback.className =
            "feedback incorrect";

        // Tạo câu mới sau khi báo kết quả
        setTimeout(() => {
            if (
                state.mode === "reflex" &&
                reflexState.started &&
                !reflexState.finished
            ) {
                generateReflexExercise();
                reflexAnswerX.focus();
            }
        }, 700);
    }
}


// =========================================================
// KẾT THÚC KHI ĐẠT 10 ĐIỂM
// =========================================================

function finishReflexMode() {
    reflexState.finished = true;
    reflexState.started = false;

    reflexScoreElement.textContent = "10";

    reflexFeedback.textContent =
        "🎉 Hoàn thành! Bạn đã trả lời đúng 10 câu liên tiếp.";

    reflexFeedback.className =
        "feedback correct";

    reflexAnswerX.disabled = true;
    reflexAnswerY.disabled = true;
    reflexSubmit.disabled = true;
}


// =========================================================
// SỰ KIỆN
// =========================================================

// Bấm "Đồng ý, bắt đầu"
reflexStart.addEventListener(
    "click",
    startReflexMode
);


// Bấm "Hủy"
reflexCancel.addEventListener(
    "click",
    cancelReflexMode
);


// Bấm "Trả lời"
reflexSubmit.addEventListener(
    "click",
    checkReflexAnswer
);


// Nhấn Enter trong ô tọa độ
reflexAnswerX.addEventListener(
    "keydown",
    event => {
        if (event.key === "Enter") {
            checkReflexAnswer();
        }
    }
);

reflexAnswerY.addEventListener(
    "keydown",
    event => {
        if (event.key === "Enter") {
            checkReflexAnswer();
        }
    }
);

/* =====================================================
KIỂM TRA ĐỌC TỌA ĐỘ
===================================================== */

function checkReadAnswer() {


if (state.answered) return;


const x =
    Number(answerX.value);

const y =
    Number(answerY.value);


const correct =
    x === state.exercise.x &&
    y === state.exercise.y;


if (correct) {

    showFeedback(
        readFeedback,
        "correct",
        "Chính xác! Bạn đã đọc đúng tọa độ."
    );

    state.score++;

    state.answered = true;

} else {

    let message =
        "Chưa chính xác. ";

    if (x !== state.exercise.x) {
        message +=
            "Kiểm tra lại hoành độ x. ";
    }

    if (y !== state.exercise.y) {
        message +=
            "Kiểm tra lại tung độ y.";
    }

    showFeedback(
        readFeedback,
        "wrong",
        message
    );
}


updateScore();


}

/* =====================================================
CLICK MẶT PHẲNG
===================================================== */

svg.addEventListener("click", event => {


if (state.mode !== "plot") return;
if (state.answered) return;


const rect =
    svg.getBoundingClientRect();


const px =
    event.clientX -
    rect.left;

const py =
    event.clientY -
    rect.top;


const math =
    svgToMath(px, py);


/*
   Làm tròn về tọa độ nguyên gần nhất.
   Vì bài tập hiện tại dùng các điểm nguyên.
*/

const x =
    Math.round(math.x);

const y =
    Math.round(math.y);


const target =
    state.exercise;


if (
    x === target.x &&
    y === target.y
) {

    showFeedback(
        plotFeedback,
        "correct",
        "Chính xác! Bạn đã đặt điểm đúng vị trí."
    );

    state.score++;

    state.answered = true;


    drawStudentPoint(
        target.x,
        target.y
    );

} else {

    let message =
        "Chưa đúng. ";


    if (x !== target.x) {

        message +=
            x < target.x
                ? "Điểm cần sang phải. "
                : "Điểm cần sang trái. ";
    }


    if (y !== target.y) {

        message +=
            y < target.y
                ? "Điểm cần lên trên."
                : "Điểm cần xuống dưới.";
    }


    showFeedback(
        plotFeedback,
        "wrong",
        message
    );
}


updateScore();


});

/* =====================================================
HIỂN THỊ ĐIỂM HỌC SINH ĐẶT
===================================================== */

function drawStudentPoint(x, y) {


const p =
    mathToSvg(x, y);


const point =
    createSVGElement("circle", {
        cx: p.x,
        cy: p.y,
        r: 7,
        class: "student-point"
    });


svg.appendChild(point);


}

/* =====================================================
TỌA ĐỘ CON TRỎ
===================================================== */

svg.addEventListener("mousemove", event => {


const rect =
    svg.getBoundingClientRect();


const px =
    event.clientX -
    rect.left;

const py =
    event.clientY -
    rect.top;


const math =
    svgToMath(px, py);


const x =
    Math.round(math.x * 10) / 10;

const y =
    Math.round(math.y * 10) / 10;


cursorCoords.textContent =
    `(${x}; ${y})`;


});

svg.addEventListener("mouseleave", () => {


cursorCoords.textContent =
    "(0; 0)";


});

/* =====================================================
FEEDBACK
===================================================== */

function showFeedback(
element,
type,
message
) {


element.className =
    `feedback ${type}`;

element.textContent =
    message;


}

function clearFeedback() {


readFeedback.className =
    "feedback";

readFeedback.textContent =
    "";

plotFeedback.className =
    "feedback";

plotFeedback.textContent =
    "";


}

/* =====================================================
ĐIỂM
===================================================== */

function updateScore() {


scoreElement.textContent =
    state.score;


}

/* =====================================================
EVENTS
===================================================== */

tabs.forEach(tab => {


tab.addEventListener(
    "click",
    () => {
        setMode(tab.dataset.mode);
    }
);


});

checkAnswer.addEventListener(
"click",
checkReadAnswer
);

newExerciseButton.addEventListener(
"click",
generateExercise
);

answerX.addEventListener(
"keydown",
event => {


    if (event.key === "Enter") {
        checkReadAnswer();
    }
}


);

answerY.addEventListener(
"keydown",
event => {


    if (event.key === "Enter") {
        checkReadAnswer();
    }
}


);

window.addEventListener(
"resize",
updateViewSize
);


// =========================================================
// PAN + ZOOM MẶT PHẲNG TỌA ĐỘ
// =========================================================

let isPanning = false;
let panStart = {
    x: 0,
    y: 0,
    centerX: 0,
    centerY: 0
};

// Giới hạn zoom
const ZOOM_MIN = 20;
const ZOOM_MAX = 120;


// ---------------------------------------------------------
// Bắt đầu pan
// ---------------------------------------------------------
svg.addEventListener("pointerdown", (event) => {

    // Trong chế độ vẽ điểm, vẫn cho phép click để chọn điểm.
    // Nhưng chỉ xem là pan khi người dùng thực sự kéo.
    isPanning = true;

    panStart.x = event.clientX;
    panStart.y = event.clientY;

    panStart.centerX = view.centerX;
    panStart.centerY = view.centerY;

    svg.setPointerCapture(event.pointerId);
});


// ---------------------------------------------------------
// Pan khi kéo
// ---------------------------------------------------------
svg.addEventListener("pointermove", (event) => {

    if (!isPanning) return;

    const dx = event.clientX - panStart.x;
    const dy = event.clientY - panStart.y;

    // Chuyển độ dịch pixel thành độ dịch của hệ tọa độ
    view.centerX = panStart.centerX + dx;
    view.centerY = panStart.centerY + dy;

    drawCoordinateSystem();

    // Cập nhật tọa độ con trỏ
    const rect = svg.getBoundingClientRect();

    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;

    const point = svgToMath(px, py);

    cursorCoords.textContent =
        `(${point.x.toFixed(1)}; ${point.y.toFixed(1)})`;
});


// ---------------------------------------------------------
// Kết thúc pan
// ---------------------------------------------------------
svg.addEventListener("pointerup", (event) => {

    isPanning = false;

    if (svg.hasPointerCapture(event.pointerId)) {
        svg.releasePointerCapture(event.pointerId);
    }
});


svg.addEventListener("pointercancel", () => {
    isPanning = false;
});


// ---------------------------------------------------------
// Zoom bằng con lăn chuột
// ---------------------------------------------------------
svg.addEventListener("wheel", (event) => {

    event.preventDefault();

    const rect = svg.getBoundingClientRect();

    // Vị trí con trỏ trước khi zoom
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const before = svgToMath(mouseX, mouseY);

    // Zoom
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;

    const newScale = Math.max(
        ZOOM_MIN,
        Math.min(ZOOM_MAX, view.scale * zoomFactor)
    );

    view.scale = newScale;

    // Tính lại vị trí điểm dưới con trỏ
    const after = svgToMath(mouseX, mouseY);

    // Điều chỉnh tâm để điểm dưới con trỏ
    // vẫn nằm đúng vị trí đó sau khi zoom
    view.centerX += (after.x - before.x) * view.scale;
    view.centerY -= (after.y - before.y) * view.scale;

    drawCoordinateSystem();
});


// ---------------------------------------------------------
// Zoom bằng pinch trên màn hình cảm ứng
// ---------------------------------------------------------
let pinchDistance = null;

svg.addEventListener("pointerdown", (event) => {

    if (event.pointerType !== "touch") return;

    const touches = [...svg.getPointerCapture ? [] : []];

    // Pinch được xử lý thông qua hai pointer đang hoạt động
});


// Danh sách pointer đang chạm màn hình
const activePointers = new Map();

svg.addEventListener("pointerdown", (event) => {

    if (event.pointerType !== "touch") return;

    activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
    });

    if (activePointers.size === 2) {
        const points = [...activePointers.values()];

        pinchDistance = Math.hypot(
            points[0].x - points[1].x,
            points[0].y - points[1].y
        );
    }
});


svg.addEventListener("pointermove", (event) => {

    if (event.pointerType !== "touch") return;

    if (!activePointers.has(event.pointerId)) return;

    activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
    });

    if (activePointers.size !== 2) return;

    const points = [...activePointers.values()];

    const newDistance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y
    );

    if (!pinchDistance || pinchDistance === 0) {
        pinchDistance = newDistance;
        return;
    }

    const factor = newDistance / pinchDistance;

    // Chỉ thay đổi khi đủ rõ ràng để tránh rung
    if (Math.abs(factor - 1) < 0.01) return;

    const rect = svg.getBoundingClientRect();

    // Tâm của hai ngón tay
    const centerX =
        (points[0].x + points[1].x) / 2 - rect.left;

    const centerY =
        (points[0].y + points[1].y) / 2 - rect.top;

    const before = svgToMath(centerX, centerY);

    view.scale = Math.max(
        ZOOM_MIN,
        Math.min(ZOOM_MAX, view.scale * factor)
    );

    const after = svgToMath(centerX, centerY);

    view.centerX += (after.x - before.x) * view.scale;
    view.centerY -= (after.y - before.y) * view.scale;

    pinchDistance = newDistance;

    drawCoordinateSystem();
});


svg.addEventListener("pointerup", (event) => {

    if (event.pointerType !== "touch") return;

    activePointers.delete(event.pointerId);

    if (activePointers.size < 2) {
        pinchDistance = null;
    }
});


svg.addEventListener("pointercancel", (event) => {

    if (event.pointerType !== "touch") return;

    activePointers.delete(event.pointerId);

    if (activePointers.size < 2) {
        pinchDistance = null;
    }
});

// =====================================================
// HÀM SINH TỌA ĐỘ VỚI TỶ LỆ 40% TRÊN TRỤC - 60% NGOÀI TRỤC
// =====================================================
function generateCoordinate() {
    let x, y;
    // Tỷ lệ 20% nằm trên trục (Ox hoặc Oy), 80% không nằm trên trục nào
    const isOnAxis = Math.random() < 0.2; 

    if (isOnAxis) {
        // Nằm trên trục tọa độ (x = 0 hoặc y = 0, nhưng không đồng thời là O(0,0))
        if (Math.random() < 0.5) {
            // Nằm trên trục Oy -> x = 0, y chạy từ min đến max (trừ 0)
            x = 0;
            do {
                y = randomInteger();
            } while (y === 0);
        } else {
            // Nằm trên trục Ox -> y = 0, x chạy từ min đến max (trừ 0)
            y = 0;
            do {
                x = randomInteger();
            } while (x === 0);
        }
    } else {
        // Không nằm trên trục nào -> Cả x và y đều khác 0
        do {
            x = randomInteger();
            y = randomInteger();
        } while (x === 0 || y === 0);
    }

    return { x, y };
}
/* =====================================================
KHỞI ĐỘNG
===================================================== */

updateViewSize();
generateExercise();


