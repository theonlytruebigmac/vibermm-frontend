import { Widget } from '@/types/widget';
import { defaultWidgetData } from './dashboard';

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  widgets: Omit<Widget, 'id' | 'layout'>[];
}

const generateTemplateWidgets = () => {
  // Device Health Template
  const deviceHealthWidgets: Omit<Widget, 'id' | 'layout'>[] = [
    {
      type: 'doughnut',
      title: 'Device Status Overview',
      data: {
        labels: ["Online", "Offline", "Maintenance"],
        datasets: [
          {
            data: [85, 10, 5],
            backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
            borderColor: ["#fff", "#fff", "#fff"],
            borderWidth: 2,
            hoverOffset: 6
          }
        ]
      },
      settings: {
        chartOptions: {
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        },
        refreshInterval: 300
      }
    },
    {
      type: 'line',
      title: 'System Uptime Trends',
      data: {
        labels: ["Jun 26", "Jun 27", "Jun 28", "Jun 29", "Jun 30", "Jul 1"],
        datasets: [
          {
            label: "Average Uptime (%)",
            data: [99.2, 98.7, 99.5, 99.8, 99.1, 99.6],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      settings: {
        refreshInterval: 300
      }
    },
    {
      type: 'bar',
      title: 'Resource Utilization',
      data: {
        labels: ["Server 1", "Server 2", "Server 3", "Server 4"],
        datasets: [
          {
            label: "CPU (%)",
            data: [65, 48, 72, 31],
            backgroundColor: "#a5b4fc"
          },
          {
            label: "Memory (%)",
            data: [72, 55, 60, 42],
            backgroundColor: "#818cf8"
          },
          {
            label: "Disk (%)",
            data: [45, 38, 62, 53],
            backgroundColor: "#6366f1"
          }
        ]
      },
      settings: {
        refreshInterval: 60
      }
    }
  ];

  // Security Monitoring Template
  const securityMonitoringWidgets: Omit<Widget, 'id' | 'layout'>[] = [
    {
      type: 'line',
      title: 'Security Alerts Trend',
      data: {
        labels: ["Jun 26", "Jun 27", "Jun 28", "Jun 29", "Jun 30", "Jul 1"],
        datasets: [
          {
            label: "Critical Alerts",
            data: [2, 5, 1, 0, 3, 4],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: "Warning Alerts",
            data: [8, 12, 6, 5, 7, 9],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      settings: {
        refreshInterval: 60
      }
    },
    {
      type: 'doughnut',
      title: 'Alert Category Distribution',
      data: {
        labels: ["Authentication", "Malware", "Network", "Policy Violation", "Other"],
        datasets: [
          {
            data: [35, 20, 25, 15, 5],
            backgroundColor: ["#ef4444", "#f59e0b", "#6366f1", "#10b981", "#8b5cf6"],
            borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
            borderWidth: 2,
            hoverOffset: 6
          }
        ]
      },
      settings: {
        chartOptions: {
          plugins: {
            legend: {
              position: 'right'
            }
          }
        },
        refreshInterval: 300
      }
    },
    {
      type: 'table',
      title: 'Recent Security Events',
      data: defaultWidgetData.table,
      settings: {
        refreshInterval: 60
      }
    }
  ];

  // Performance Monitoring Template
  const performanceMonitoringWidgets: Omit<Widget, 'id' | 'layout'>[] = [
    {
      type: 'line',
      title: 'Network Throughput',
      data: {
        labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
        datasets: [
          {
            label: "Inbound (Mbps)",
            data: [125, 142, 164, 187, 156, 172],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: "Outbound (Mbps)",
            data: [95, 102, 124, 142, 113, 132],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      settings: {
        refreshInterval: 60
      }
    },
    {
      type: 'bar',
      title: 'Average Response Time',
      data: {
        labels: ["API", "Database", "Web Server", "Authentication"],
        datasets: [
          {
            label: "Response Time (ms)",
            data: [85, 120, 45, 65],
            backgroundColor: "#6366f1"
          }
        ]
      },
      settings: {
        refreshInterval: 60
      }
    },
    {
      type: 'stats',
      title: 'System Performance Overview',
      data: defaultWidgetData.stats,
      settings: {
        refreshInterval: 60
      }
    }
  ];

  return {
    deviceHealthWidgets,
    securityMonitoringWidgets,
    performanceMonitoringWidgets
  };
};

const templates = generateTemplateWidgets();

export const dashboardTemplates: DashboardTemplate[] = [
  {
    id: 'device-health',
    name: 'Device Health',
    description: 'Monitor your device status, uptime, and resource utilization',
    thumbnail: '/templates/device-health.png',
    widgets: templates.deviceHealthWidgets
  },
  {
    id: 'security-monitoring',
    name: 'Security Monitoring',
    description: 'Track security alerts, events, and potential threats',
    thumbnail: '/templates/security-monitoring.png',
    widgets: templates.securityMonitoringWidgets
  },
  {
    id: 'performance-monitoring',
    name: 'Performance Monitoring',
    description: 'Monitor network, application, and system performance metrics',
    thumbnail: '/templates/performance-monitoring.png',
    widgets: templates.performanceMonitoringWidgets
  }
];