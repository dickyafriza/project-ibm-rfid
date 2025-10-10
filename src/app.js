class ParkingSystem {
    constructor() {
        this.parkingSpaces = [];
        this.rfidCards = [];
        this.iotDevices = [];
        this.currentTab = 'dashboard';
        this.currentLevel = 1;
        
        this.init();
    }

    init() {
        this.initializeData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.updateTime();
        this.renderCurrentTab();
    }

    initializeData() {
        // Initialize parking spaces
        this.parkingSpaces = [];
        for (let level = 1; level <= 3; level++) {
            for (let i = 1; i <= 20; i++) {
                const spaceNumber = (level - 1) * 20 + i;
                const isOccupied = Math.random() > 0.6;
                this.parkingSpaces.push({
                    id: `space-${spaceNumber}`,
                    number: spaceNumber,
                    isOccupied,
                    level,
                    zone: level === 1 ? 'Ground' : level === 2 ? 'Level 1' : 'Level 2',
                    ...(isOccupied && {
                        rfidCard: `RFID-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
                        userInfo: {
                            name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
                            vehicle: ['BMW X5', 'Toyota Camry', 'Honda Civic', 'Ford F-150'][Math.floor(Math.random() * 4)],
                            checkInTime: new Date(Date.now() - Math.random() * 3600000 * 5),
                        },
                    }),
                });
            }
        }

        // Initialize RFID cards
        this.rfidCards = [
            {
                id: '1',
                cardNumber: 'RFID-0001',
                userName: 'John Doe',
                vehicle: 'BMW X5 - ABC123',
                status: 'active',
                balance: 125.50,
                lastUsed: new Date(Date.now() - 1800000),
            },
            {
                id: '2',
                cardNumber: 'RFID-0002',
                userName: 'Jane Smith',
                vehicle: 'Toyota Camry - XYZ789',
                status: 'active',
                balance: 89.25,
                lastUsed: new Date(Date.now() - 3600000),
            },
            {
                id: '3',
                cardNumber: 'RFID-0003',
                userName: 'Mike Johnson',
                vehicle: 'Honda Civic - DEF456',
                status: 'blocked',
                balance: 5.00,
                lastUsed: new Date(Date.now() - 86400000),
            },
            {
                id: '4',
                cardNumber: 'RFID-0004',
                userName: 'Sarah Wilson',
                vehicle: 'Ford F-150 - GHI789',
                status: 'active',
                balance: 200.00,
                lastUsed: new Date(Date.now() - 900000),
            },
        ];

        // Initialize IoT devices
        this.iotDevices = [
            {
                id: '1',
                name: 'Entry Gate Reader',
                type: 'rfid-reader',
                status: 'online',
                location: 'Main Entrance',
                lastPing: new Date(Date.now() - 30000),
            },
            {
                id: '2',
                name: 'Exit Gate Reader',
                type: 'rfid-reader',
                status: 'online',
                location: 'Main Exit',
                lastPing: new Date(Date.now() - 45000),
            },
            {
                id: '3',
                name: 'Level 1 Sensors',
                type: 'sensor',
                status: 'online',
                location: 'Ground Floor',
                lastPing: new Date(Date.now() - 20000),
            },
            {
                id: '4',
                name: 'Level 2 Sensors',
                type: 'sensor',
                status: 'offline',
                location: 'Level 1',
                lastPing: new Date(Date.now() - 300000),
            },
            {
                id: '5',
                name: 'Entry Barrier',
                type: 'barrier',
                status: 'online',
                location: 'Main Entrance',
                lastPing: new Date(Date.now() - 15000),
            },
        ];
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Level tabs
        document.querySelectorAll('.level-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const level = parseInt(e.currentTarget.dataset.level);
                this.switchLevel(level);
            });
        });

        // Add New Card button
        const addCardBtn = document.querySelector('.btn-primary');
        if (addCardBtn) {
            addCardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAddCardModal();
            });
        }

        // Settings form inputs
        document.querySelectorAll('.form-input, .form-checkbox').forEach(input => {
            input.addEventListener('change', (e) => {
                this.saveSettings();
            });
        });

        // Action buttons
        document.querySelectorAll('.btn-secondary, .btn-warning, .btn-danger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.currentTarget.textContent.trim();
                this.handleActionButton(action);
            });
        });
    }

    switchTab(tabId) {
        this.currentTab = tabId;
        
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tabId) {
                item.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');

        this.renderCurrentTab();
    }

    switchLevel(level) {
        this.currentLevel = level;
        
        // Update level tabs
        document.querySelectorAll('.level-tab').forEach(tab => {
            tab.classList.remove('active');
            if (parseInt(tab.dataset.level) === level) {
                tab.classList.add('active');
            }
        });

        this.renderParkingGrid();
    }

    showAddCardModal() {
        alert('Add New Card functionality would open a modal here');
        // In a real application, this would open a modal form
    }

    saveSettings() {
        console.log('Settings saved');
        // In a real application, this would save to backend
    }

    handleActionButton(action) {
        switch(action) {
            case 'Export Data':
                alert('Exporting data...');
                break;
            case 'System Backup':
                alert('Creating system backup...');
                break;
            case 'Reset System':
                if (confirm('Are you sure you want to reset the system?')) {
                    alert('System reset initiated...');
                }
                break;
        }
    }

    renderCurrentTab() {
        switch (this.currentTab) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'parking':
                this.renderParkingGrid();
                break;
            case 'rfid':
                this.renderRFIDCards();
                break;
            case 'devices':
                this.renderIoTDevices();
                break;
            case 'settings':
                // Settings are static HTML
                break;
        }
    }

    renderDashboard() {
        const occupiedSpaces = this.parkingSpaces.filter(space => space.isOccupied).length;
        const totalSpaces = this.parkingSpaces.length;
        const occupancyRate = totalSpaces > 0 ? (occupiedSpaces / totalSpaces) * 100 : 0;
        const onlineDevices = this.iotDevices.filter(device => device.status === 'online').length;
        const activeCards = this.rfidCards.filter(card => card.status === 'active').length;

        // Update stats
        document.getElementById('total-spaces').textContent = totalSpaces;
        document.getElementById('occupied-spaces').textContent = occupiedSpaces;
        document.getElementById('active-cards').textContent = activeCards;
        document.getElementById('online-devices').textContent = `${onlineDevices}/${this.iotDevices.length}`;

        // Update occupancy
        document.getElementById('occupancy-rate').textContent = `${occupancyRate.toFixed(1)}%`;
        document.getElementById('occupancy-progress').style.width = `${occupancyRate}%`;
        document.getElementById('available-count').textContent = totalSpaces - occupiedSpaces;
        document.getElementById('occupied-count').textContent = occupiedSpaces;
        document.getElementById('total-count').textContent = totalSpaces;

        // Update recent activity
        const recentActivity = document.getElementById('recent-activity');
        const occupiedWithInfo = this.parkingSpaces
            .filter(space => space.isOccupied && space.userInfo)
            .slice(0, 5);

        recentActivity.innerHTML = occupiedWithInfo.map(space => `
            <div class="activity-item">
                <div class="activity-left">
                    <div class="activity-dot"></div>
                    <div class="activity-info">
                        <h4>${space.userInfo.name}</h4>
                        <p>Space ${space.number} • ${space.zone}</p>
                    </div>
                </div>
                <div class="activity-right">
                    <p>Check-in</p>
                    <p>${space.userInfo.checkInTime.toLocaleTimeString()}</p>
                </div>
            </div>
        `).join('');
    }

    renderParkingGrid() {
        const grid = document.getElementById('parking-grid');
        const levelSpaces = this.parkingSpaces.filter(space => space.level === this.currentLevel);
        
        grid.innerHTML = levelSpaces.map(space => `
            <div class="parking-space ${space.isOccupied ? 'occupied' : 'available'}" 
                 title="${space.isOccupied ? `Occupied by ${space.userInfo?.name || 'Unknown'}` : 'Available'}">
                ${space.number}
            </div>
        `).join('');
    }

    renderRFIDCards() {
        const container = document.getElementById('rfid-cards');
        
        container.innerHTML = this.rfidCards.map(card => `
            <div class="rfid-card">
                <div class="rfid-card-content">
                    <div class="rfid-card-left">
                        <div class="rfid-card-icon ${card.status}">
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <div class="rfid-card-info">
                            <h4>${card.userName}</h4>
                            <p>${card.cardNumber}</p>
                            <p>${card.vehicle}</p>
                        </div>
                    </div>
                    <div class="rfid-card-right">
                        <div class="status-badge ${card.status}">
                            ${card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                        </div>
                        <p class="balance">$${card.balance.toFixed(2)}</p>
                        <p class="last-used">
                            Last used: ${card.lastUsed?.toLocaleDateString() || 'Never'}
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderIoTDevices() {
        const container = document.getElementById('iot-devices');
        
        container.innerHTML = this.iotDevices.map(device => `
            <div class="device-card">
                <div class="device-content">
                    <div class="device-left">
                        <div class="device-icon ${device.status}">
                            <i class="fas fa-${device.status === 'online' ? 'wifi' : 'wifi'}"></i>
                        </div>
                        <div class="device-info">
                            <h4>${device.name}</h4>
                            <p>${device.type.replace('-', ' ')}</p>
                            <p>${device.location}</p>
                        </div>
                    </div>
                    <div class="device-right">
                        <div class="device-status ${device.status}">
                            ${device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                        </div>
                        <p class="last-ping">
                            Last ping: ${Math.floor((Date.now() - device.lastPing.getTime()) / 1000)}s ago
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateTime() {
        const updateClock = () => {
            const now = new Date();
            document.getElementById('current-time').textContent = now.toLocaleTimeString();
            document.getElementById('current-date').textContent = now.toLocaleDateString();
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    startRealTimeUpdates() {
        // Simulate real-time parking updates
        setInterval(() => {
            const randomIndex = Math.floor(Math.random() * this.parkingSpaces.length);
            const space = this.parkingSpaces[randomIndex];
            
            if (Math.random() > 0.95) { // 5% chance of change
                if (space.isOccupied) {
                    // Vehicle leaves
                    space.isOccupied = false;
                    delete space.rfidCard;
                    delete space.userInfo;
                } else {
                    // Vehicle arrives
                    space.isOccupied = true;
                    space.rfidCard = `RFID-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
                    space.userInfo = {
                        name: ['Alex Brown', 'Emma Davis', 'Chris Lee', 'Lisa Anderson'][Math.floor(Math.random() * 4)],
                        vehicle: ['Tesla Model 3', 'Audi A4', 'Mercedes C-Class', 'Nissan Altima'][Math.floor(Math.random() * 4)],
                        checkInTime: new Date(),
                    };
                }
                
                this.renderCurrentTab();
            }
        }, 5000);

        // Update device ping times
        setInterval(() => {
            this.iotDevices.forEach(device => {
                if (device.status === 'online') {
                    device.lastPing = new Date(Date.now() - Math.random() * 60000);
                }
            });
            
            if (this.currentTab === 'devices') {
                this.renderIoTDevices();
            }
        }, 10000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParkingSystem();
});