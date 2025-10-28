// ==================== FITNESS TRACKER FULL SCRIPT ====================

// Biểu đồ + dữ liệu
let fitnessData = [];

// ==================== HIỂN THỊ TRẠNG THÁI ====================
function showStatus(message, isError = false) {
    const status = document.getElementById('status');
    if (status) {
        status.textContent = message;
        status.className = isError ? 'error' : 'success';
        setTimeout(() => status.textContent = '', 3000);
    } else {
        console.log(message);
    }
}

// ==================== STOPWATCH (PLANK) ====================
let stopwatchInterval = null;
let stopwatchTime = 0;
let isRunning = false;

function updateStopwatchDisplay() {
    const minutes = Math.floor(stopwatchTime / 60);
    const seconds = stopwatchTime % 60;
    document.getElementById('stopwatch-display').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startStopwatch() {
    const type = document.getElementById('type').value;
    if (!type) return showStatus("Chọn loại tập trước!", true);

    const startStopBtn = document.getElementById('startStopBtn');
    if (isRunning) {
        clearInterval(stopwatchInterval);
        isRunning = false;
        startStopBtn.textContent = 'Start';
        startStopBtn.classList.remove('running');
        const session = document.getElementById('sessionSelect').value;
        document.getElementById(session).value = stopwatchTime;
        showStatus(`Đã dừng: ${stopwatchTime}s (${session === 'morning' ? 'Sáng' : 'Chiều'})`);
    } else {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            updateStopwatchDisplay();
        }, 1000);
        isRunning = true;
        startStopBtn.textContent = 'Stop';
        startStopBtn.classList.add('running');
        showStatus("Đang bấm giờ...");
    }
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    isRunning = false;
    updateStopwatchDisplay();
    const startStopBtn = document.getElementById('startStopBtn');
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('running');
    showStatus("Reset stopwatch.");
}

// ==================== XỬ LÝ DỮ LIỆU ====================
function loadDataForDate() {
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    if (!date || !type) return;

    const db = firebase.database().ref("fitnessEntries");
    db.orderByChild("date").equalTo(date).once("value").then(snapshot => {
        let morning = 0, afternoon = 0;
        snapshot.forEach(child => {
            if (child.val().type === type) {
                morning = child.val().morning || 0;
                afternoon = child.val().afternoon || 0;
            }
        });
        document.getElementById('morning').value = morning;
        document.getElementById('afternoon').value = afternoon;
        if (type === 'Plank') updateStopwatchDisplay();
        showStatus(`Đã load dữ liệu cho ${date} - ${type}`);
    });
}

function fetchFirebaseData() {
    return firebase.database().ref("fitnessEntries").once("value")
        .then(snapshot => {
            fitnessData = [];
            let text = '';
            snapshot.forEach(child => {
                const { date, morning, afternoon, type } = child.val();
                fitnessData.push({ date, morning, afternoon, type });
                text += `${date},${morning},${afternoon},${type}\n`;
            });
            document.getElementById('dataText').value = text;
            showStatus("Đã tải dữ liệu từ Firebase!");
            updateCharts();
        });
}

function addData() {
    const date = document.getElementById('date').value;
    const morning = parseFloat(document.getElementById('morning').value) || 0;
    const afternoon = parseFloat(document.getElementById('afternoon').value) || 0;
    const type = document.getElementById('type').value;

    if (!date || !type) return showStatus("Chọn ngày và loại tập!", true);

    const db = firebase.database().ref("fitnessEntries");
    db.orderByChild("date").equalTo(date).once("value").then(snapshot => {
        const removePromises = [];
        snapshot.forEach(child => {
            if (child.val().type === type) removePromises.push(child.ref.remove());
        });
        return Promise.all(removePromises);
    }).then(() => db.push({ date, morning, afternoon, type }))
      .then(() => {
          showStatus("Đã lưu vào Firebase!");
          refreshPageState(); // ✅ Gọi lại load đầy đủ như F5
      });
}

// ==================== CẬP NHẬT GIAO DIỆN ====================
function refreshPageState() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    fetchFirebaseData().then(() => {
        loadDataForDate();
        updateStopwatchDisplay();
    });
}

// ==================== CẬP NHẬT BIỂU ĐỒ ====================
function updateCharts() {
    const year = parseInt(document.getElementById('year').value || new Date().getFullYear());
    const startDate = new Date(year, 0, 1);
    const types = ['Gập bụng - lưng', 'Gập bụng - chân', 'Tập tay', 'Hít đất', 'Plank', 'Tập chân', 'Nhảy tại chỗ'];

    types.forEach(type => {
        const chart = charts[type];
        if (!chart) return;
        const morningData = Array(365).fill(0);
        const afternoonData = Array(365).fill(0);
        fitnessData.forEach(item => {
            if (item.type === type) {
                const d = new Date(item.date);
                const dayIndex = Math.floor((d - startDate) / (1000 * 60 * 60 * 24));
                if (dayIndex >= 0 && dayIndex < 365) {
                    morningData[dayIndex] = item.morning;
                    afternoonData[dayIndex] = item.afternoon;
                }
            }
        });
        chart.data.datasets[0].data = morningData;
        chart.data.datasets[1].data = afternoonData;
        chart.update();
    });
}

// ==================== KHỞI TẠO ====================
window.addEventListener("load", () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    fetchFirebaseData().then(() => loadDataForDate());
    updateStopwatchDisplay();
});

// ==================== GẮN SỰ KIỆN ====================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('date').addEventListener('change', loadDataForDate);
    document.getElementById('type').addEventListener('change', loadDataForDate);
    document.getElementById('startStopBtn').addEventListener('click', startStopwatch);
    document.getElementById('resetBtn').addEventListener('click', resetStopwatch);
});
