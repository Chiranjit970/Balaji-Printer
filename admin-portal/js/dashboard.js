import { AdminSession } from './utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
  // Authentication check
  AdminSession.init();

  if (!AdminSession.isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  const admin = AdminSession.getAdmin();
  if (admin && admin.name) {
    document.getElementById('admin-name').textContent = admin.name;
  }

  document.getElementById('logout-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    await AdminSession.logout();
  });

  // Initialize Charts
  initCharts();

  // Populate Table
  populateRecentOrders();
});

function initCharts() {
  // Orders Trend Chart
  const ordersCtx = document.getElementById('ordersChart');
  if (ordersCtx) {
    new Chart(ordersCtx, {
      type: 'line',
      data: {
        labels: ['May 06', 'May 07', 'May 08', 'May 09', 'May 10', 'May 11', 'May 12'],
        datasets: [{
          label: 'Orders',
          data: [14, 21, 17, 24, 19, 27, 32],
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#2563EB',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#111',
            titleFont: { family: 'Inter', size: 13 },
            bodyFont: { family: 'Inter', size: 13 },
            padding: 10,
            displayColors: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 40,
            ticks: { stepSize: 10, font: { family: 'Inter', size: 12 }, color: '#9CA3AF' },
            grid: { color: '#F3F4F6', drawBorder: false }
          },
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { font: { family: 'Inter', size: 12 }, color: '#9CA3AF' }
          }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false }
      }
    });
  }

  // Revenue Trend Chart
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['May 06', 'May 07', 'May 08', 'May 09', 'May 10', 'May 11', 'May 12'],
        datasets: [{
          label: 'Revenue (₹)',
          data: [11000, 18000, 12500, 21000, 15000, 22000, 24850],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#111',
            titleFont: { family: 'Inter', size: 13 },
            bodyFont: { family: 'Inter', size: 13 },
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return '₹' + context.parsed.y.toLocaleString('en-IN');
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 40000,
            ticks: {
              stepSize: 10000,
              font: { family: 'Inter', size: 12 },
              color: '#9CA3AF',
              callback: function(value) {
                if (value === 0) return '₹0';
                return '₹' + (value / 1000) + 'K';
              }
            },
            grid: { color: '#F3F4F6', drawBorder: false }
          },
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { font: { family: 'Inter', size: 12 }, color: '#9CA3AF' }
          }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false }
      }
    });
  }
}

function populateRecentOrders() {
  const mockOrders = [
    { id: '#BP12548', customer: 'Rohit Sharma', items: '2 (1 Print, 1 Product)', amount: '723.64', payment: 'Paid', status: 'Placed', date: 'May 12, 2025 10:30 AM' },
    { id: '#BP12547', customer: 'Neha Patel', items: '3 (2 Print, 1 Product)', amount: '1,240.00', payment: 'Paid', status: 'Processing', date: 'May 12, 2025 09:15 AM' },
    { id: '#BP12546', customer: 'Aarav Mehta', items: '1 (Print Job)', amount: '240.00', payment: 'Paid', status: 'Placed', date: 'May 12, 2025 08:45 AM' },
    { id: '#BP12545', customer: 'Priya Nair', items: '2 (2 Products)', amount: '498.00', payment: 'Pending', status: 'Processing', date: 'May 12, 2025 08:10 AM' },
    { id: '#BP12544', customer: 'Vikram Singh', items: '1 (Print Job)', amount: '348.00', payment: 'Paid', status: 'Dispatched', date: 'May 12, 2025 07:30 AM' }
  ];

  const tbody = document.getElementById('recent-orders-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  mockOrders.forEach(order => {
    const tr = document.createElement('tr');
    
    // Status Badge Class mapping
    const statusClass = `badge-${order.status.toLowerCase()}`;
    // Payment Badge Class mapping
    const paymentClass = `badge-${order.payment.toLowerCase()}`;

    tr.innerHTML = `
      <td class="font-medium">${order.id}</td>
      <td>${order.customer}</td>
      <td class="text-muted">${order.items}</td>
      <td class="font-medium">₹${order.amount}</td>
      <td><span class="badge ${paymentClass}">${order.payment}</span></td>
      <td><span class="badge ${statusClass}">${order.status}</span></td>
      <td class="text-muted">${order.date}</td>
    `;
    
    tbody.appendChild(tr);
  });
}
