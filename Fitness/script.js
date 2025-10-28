// Firebase cấu hình và xử lý lưu/đọc dữ liệu cho fitness tracker

let chartInstance = null;
let monthChartInstances = [];
 
let fitnessData = [];

// ✅ Hàm thông báo status
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

// Hàm tạo nhãn cho biểu đồ theo năm
function generateLabels(year) {
    return Array.from({ length: 365 }, (_, index) => {
        const date = new Date(year, 0, 1);
        date.setDate(date.getDate() + index);
        return date.toISOString().split('T')[0];
    });
}

// Khởi tạo biểu đồ
const charts = {
    'Gập bụng - lưng': new Chart(document.getElementById('absBackChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: generateLabels(2025),
            datasets: [
                { label: 'Buổi Sáng', data: Array(365).fill(0), backgroundColor: '#FFD700', stack: 'Stack 0', order: 1 },
                { label: 'Buổi Chiều', data: Array(365).fill(0), backgroundColor: 'blue', stack: 'Stack 0', order: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Ngày', color: '#e0e0e0', font: { size: 16 }},
                    ticks: {
                        callback: function(value, index) {
                            const year = parseInt(document.getElementById('year').value);
                            const date = new Date(year, 0, 1);
                            date.setDate(date.getDate() + index);
                            return date.getMonth() + 1 ;
                        },
                        maxTicksLimit: 12,
                        color: '#e0e0e0',
                        font: { size: 16 }
                    },
                    grid: { color: '#444' }
                },
                y: {
                    title: { display: true, text: 'Số Lần', color: '#e0e0e0',font: { size: 16 } },
                    beginAtZero: true,
                    stacked: true,
                    ticks: { color: '#e0e0e0', font: { size: 16 }},
                    grid: { color: '#444' },
                }
            },
            plugins: { legend: { labels: { color: '#e0e0e0', font: { size: 16 } } } }
        }
    }),
    'Gập bụng - chân': new Chart(document.getElementById('absLegChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: generateLabels(2025),
            datasets: [
                { label: 'Buổi Sáng', data: Array(365).fill(0), backgroundColor: '#FFD700', stack: 'Stack 0', order: 1 },
                { label: 'Buổi Chiều', data: Array(365).fill(0), backgroundColor: 'blue', stack: 'Stack 0', order: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Ngày', color: '#e0e0e0',font: { size: 16 } },
                    ticks: {
                        callback: function(value, index) {
                            const year = parseInt(document.getElementById('year').value);
                            const date = new Date(year, 0, 1);
                            date.setDate(date.getDate() + index);
                            return date.getMonth() + 1 ;
                        },
                        maxTicksLimit: 12,
                        color: '#e0e0e0', font: { size: 16 }
                    },
                    grid: { color: '#444' }
                },
                y: {
                    title: { display: true, text: 'Số Lần', color: '#e0e0e0', font: { size: 16 } },
                    beginAtZero: true,
                    stacked: true,
                    ticks: { color: '#e0e0e0', font: { size: 16 }, font: { size: 16 } },
                    grid: { color: '#444' }
                }
            },
            plugins: { legend: { labels: { color: '#e0e0e0', font: { size: 16 } } } }
        }
    }),
    'Tập tay': new Chart(document.getElementById('armsChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: generateLabels(2025),
            datasets: [
                { label: 'Buổi Sáng', data: Array(365).fill(0), backgroundColor: '#FFD700', stack: 'Stack 0', order: 1 },
                { label: 'Buổi Chiều', data: Array(365).fill(0), backgroundColor: 'blue', stack: 'Stack 0', order: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Ngày', color: '#e0e0e0', font: { size: 16 } },
                    ticks: {
                        callback: function(value, index) {
                            const year = parseInt(document.getElementById('year').value);
                            const date = new Date(year, 0, 1);
                            date.setDate(date.getDate() + index);
                            return date.getMonth() + 1 ;
                        },
                        maxTicksLimit: 12,
                        color: '#e0e0e0', font: { size: 16 }
                    },
                    grid: { color: '#444' }
                },
                y: {
                    title: { display: true, text: 'Số Lần', color: '#e0e0e0', font: { size: 16 } },
                    beginAtZero: true,
                    stacked: true,
                    ticks: { color: '#e0e0e0', font: { size: 16 } },
                    grid: { color: '#444' }
                }
            },
            plugins: { legend: { labels: { color: '#e0e0e0', font: { size: 16 } } } }
        }
    }),
    'Hít đất': new Chart(document.getElementById('pushUpChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: generateLabels(2025),
            datasets: [
                { label: 'Buổi Sáng', data: Array(365).fill(0), backgroundColor: '#FFD700', stack: 'Stack 0', order: 1 },
                { label: 'Buổi Chiều', data: Array(365).fill(0), backgroundColor: 'blue', stack: 'Stack 0', order: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Ngày', color: '#e0e0e0', font: { size: 16 } },
                    ticks: {
                        callback: function(value, index) {
                            const year = parseInt(document.getElementById('year').value);
                            const date = new Date(year, 0, 1);
                            date.setDate(date.getDate() + index);
                            return date.getMonth() + 1 ;
                        },
                        maxTicksLimit: 12,
                        color: '#e0e0e0', font: { size: 16 }
                    },
                    grid: { color: '#444' }
                },
                y: {
                    title: { display: true, text: 'Số Lần', color: '#e0e0e0' , font: { size: 16 }},
                    beginAtZero: true,
                    stacked: true,
                    ticks: { color: '#e0e0e0', font: { size: 16 } },
                    grid: { color: '#444' }
                }
            },
            plugins: { legend: { labels: { color: '#e0e0e0' , font: { size: 16 }} } }
        }
    }),
    'Plank': new Chart(document.getElementById('plankChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: generateLabels(2025),
            datasets: [
                { label: 'Buổi Sáng', data: Array(365).fill(0), backgroundColor: '#FFD700', stack: 'Stack 0', order: 1 },
                { label: 'Buổi Chiều', data: Array(365).fill(0), backgroundColor: 'blue', stack: 'Stack 0', order: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Ngày', color: '#e0e0e0' , font: { size: 16 }},
                    ticks: {
                        callback: function(value, index) {
                            const year = parseInt(document.getElementById('year').value);
                            const date = new Date(year, 0, 1);
                            date.setDate(date.getDate() + index);
                            return date.getMonth() + 1 ;
                        },
                        maxTicksLimit: 12,
                        color: '#e0e0e0', font: { size: 16 }
                    },
                    grid: { color: '#444' }
                },
                y: {
                    title: { display: true, text: 'Số Lần', color: '#e0e0e0', font: { size: 16 } },
                    beginAtZero: true,
                    stacked: true,
                    ticks: { color: '#e0e0e0', font: { size: 16 } },
                    grid: { color: '#444' }
                }
            },
            plugins: { legend: { labels: { color: '#e0e0e0', font: { size: 16 } } } }
        }
    }),
    'Tập chân': new Chart(document.getElementById('legChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: generateLabels(2025),
            datasets: [
                { label: 'Buổi Sáng', data: Array(365).fill(0), backgroundColor: '#FFD700', stack: 'Stack 0', order: 1 },
                { label: 'Buổi Chiều', data: Array(365).fill(0), backgroundColor: 'blue', stack: 'Stack 0', order: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Ngày', color: '#e0e0e0' , font: { size: 16 }},
                    ticks: {
                        callback: function(value, index) {
                            const year = parseInt(document.getElementById('year').value);
                            const date = new Date(year, 0, 1);
                            date.setDate(date.getDate() + index);
                            return date.getMonth() + 1 ;
                        },
                        maxTicksLimit: 12,
                        color: '#e0e0e0', font: { size: 16 }
                    },
                    grid: { color: '#444' }
                },
                y: {
                    title: { display: true, text: 'Số Lần', color: '#e0e0e0', font: { size: 16 } },
                    beginAtZero: true,
                    stacked: true,
                    ticks: { color: '#e0e0e0', font: { size: 16 } },
                    grid: { color: '#444' }
                }
            },
            plugins: { legend: { labels: { color: '#e0e0e0', font: { size: 16 } } } }
        }
    }),
    'Nhảy tại chỗ': new Chart(document.getElementById('jumpChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: generateLabels(2025),
            datasets: [
                { label: 'Buổi Sáng', data: Array(365).fill(0), backgroundColor: '#FFD700', stack: 'Stack 0', order: 1 },
                { label: 'Buổi Chiều', data: Array(365).fill(0), backgroundColor: 'blue', stack: 'Stack 0', order: 2 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Ngày', color: '#e0e0e0', font: { size: 16 } },
                    ticks: {
                        callback: function(value, index) {
                            const year = parseInt(document.getElementById('year').value);
                            const date = new Date(year, 0, 1);
                            date.setDate(date.getDate() + index);
                            return date.getMonth() + 1 ;
                        },
                        maxTicksLimit: 12,
                        color: '#e0e0e0', font: { size: 16 }
                    },
                    grid: { color: '#444' }
                },
                y: {
                    title: { display: true, text: 'Số Lần', color: '#e0e0e0', font: { size: 16 } },
                    beginAtZero: true,
                    stacked: true,
                    ticks: { color: '#e0e0e0', font: { size: 16 } },
                    grid: { color: '#444' }
                }
            },
            plugins: { legend: { labels: { color: '#e0e0e0', font: { size: 16 } } } }
        }
    })
};

// ✅ Ghi dữ liệu từ form vào Realtime Database
function addData() {
    const date = document.getElementById('date').value;
    const morning = parseFloat(document.getElementById('morning').value) || 0;
    const afternoon = parseFloat(document.getElementById('afternoon').value) || 0;
    const type = document.getElementById('type').value;

    if (!date || !type) {
        showStatus('Vui lòng chọn ngày và loại tập!', true);
        return;
    }

    const db = firebase.database().ref("fitnessEntries");
    // Xóa các bản ghi có cùng date và type
    db.orderByChild("date").equalTo(date).once("value")
        .then(snapshot => {
            const updates = [];
            snapshot.forEach(child => {
                if (child.val().type === type) {
                    updates.push(child.ref.remove());
                }
            });
            return Promise.all(updates);
        })
        .then(() => {
            return db.push({ date, morning, afternoon, type });
        })
        .then(() => {
            showStatus("Đã lưu vào Firebase!");
            document.getElementById('date').value = '';
            document.getElementById('morning').value = '';
            document.getElementById('afternoon').value = '';
            fetchFirebaseData();
        })
        .catch((error) => {
            console.error("Lỗi ghi dữ liệu:", error);
            showStatus("Lỗi khi lưu Firebase!", true);
        });
}

// ✅ Đọc dữ liệu từ Firebase và hiển thị vào textarea
function fetchFirebaseData() {
    firebase.database().ref("fitnessEntries").once("value")
        .then(snapshot => {
            let dataText = '';
            fitnessData = [];
            snapshot.forEach(child => {
                const { date, morning, afternoon, type } = child.val();
                fitnessData.push({ date, morning, afternoon, type });
                dataText += `${date},${morning},${afternoon},${type}\n`;
            });
            document.getElementById('dataText').value = dataText;
            showStatus("Đã tải dữ liệu từ Firebase!");
            updateCharts();
        })
        .catch(err => {
            console.error("Lỗi đọc dữ liệu Firebase:", err);
            showStatus("Lỗi khi đọc Firebase!", true);
        });
}

// ✅ Ghi toàn bộ dữ liệu từ textarea vào Firebase (batch)
function saveAllToFirebase() {
    const rawData = document.getElementById('dataText').value;
    const lines = rawData.split('\n').filter(line => line.trim());
    let successCount = 0;
    let failCount = 0;

    const db = firebase.database().ref("fitnessEntries");
    const existing = {};

    // Tải dữ liệu cũ để xử lý cập nhật
    db.once("value").then(snapshot => {
        snapshot.forEach(child => {
            const { date, type } = child.val();
            const key = `${date}_${type}`;
            if (!existing[key]) existing[key] = [];
            existing[key].push(child.key);
        });

        const updates = lines.map(line => {
            const [date, morningStr, afternoonStr, type] = line.split(',');
            const morning = parseFloat(morningStr);
            const afternoon = parseFloat(afternoonStr);
            if (date && type && !isNaN(morning) && !isNaN(afternoon)) {
                const key = `${date}_${type}`;
                const deletes = (existing[key] || []).map(id => db.child(id).remove());
                return Promise.all(deletes).then(() => db.push({ date, morning, afternoon, type })).then(() => successCount++);
            } else {
                failCount++;
                return Promise.resolve();
            }
        });

        return Promise.all(updates);
    }).then(() => {
        showStatus(`Đã lưu ${successCount} dòng vào Firebase. ${failCount} dòng lỗi.`, failCount > 0);
        fetchFirebaseData();
    }).catch(err => {
        console.error("Lỗi lưu dữ liệu:", err);
        showStatus("Lỗi khi lưu Firebase!", true);
    });
}

// Cập nhật biểu đồ
function updateCharts() {
    const types = ['Gập bụng - lưng', 'Gập bụng - chân', 'Tập tay', 'Hít đất', 'Plank', 'Tập chân', 'Nhảy tại chỗ'];
    const year = parseInt(document.getElementById('year').value || new Date().getFullYear());
    const startDate = new Date(year, 0, 1);

    // Cập nhật nhãn cho tất cả biểu đồ
    types.forEach(type => {
        charts[type].data.labels = generateLabels(year);
    });

    types.forEach(type => {
        const morningData = Array(365).fill(0);
        const afternoonData = Array(365).fill(0);
        fitnessData.forEach(item => {
            if (item.type === type) {
                const itemDate = new Date(item.date);
                const dayIndex = Math.floor((itemDate - startDate) / (1000 * 60 * 60 * 24));
                if (dayIndex >= 0 && dayIndex < 365) {
                    morningData[dayIndex] = item.morning;
                    afternoonData[dayIndex] = item.afternoon;
                }
            }
        });
        charts[type].data.datasets[0].data = morningData;
        charts[type].data.datasets[1].data = afternoonData;
        charts[type].update();
    });
}

// Gọi hàm khi load trang để hiển thị dữ liệu Firebase
window.addEventListener("load", () => {
    fetchFirebaseData();
});
