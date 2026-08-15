document.addEventListener("DOMContentLoaded", () => {
  const data = window.dashboardData;

  if (!data || typeof Chart === "undefined") {
    console.error("Les données du dashboard ou Chart.js sont indisponibles.");
    return;
  }

  const currency = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0
  });

  const showEmptyState = (canvasId, messageId, isEmpty) => {
    const canvas = document.getElementById(canvasId);
    const message = document.getElementById(messageId);
    if (!canvas || !message) return;
    canvas.classList.toggle("d-none", isEmpty);
    message.classList.toggle("d-none", !isEmpty);
  };

  const salesValues = (data.salesData || []).map(Number);
  const purchaseValues = (data.purchaseData || []).map(Number);
  const hasActivity = [...salesValues, ...purchaseValues].some((value) => value > 0);
  showEmptyState("salesChart", "salesChartEmpty", !hasActivity);

  const salesChartCanvas = document.getElementById("salesChart");
  if (salesChartCanvas && hasActivity) {
    new Chart(salesChartCanvas, {
      type: "line",
      data: {
        labels: data.salesLabels || [],
        datasets: [
          {
            label: "Ventes",
            data: salesValues,
            borderColor: "#0d6efd",
            backgroundColor: "rgba(13, 110, 253, .15)",
            borderWidth: 3,
            tension: .35,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: "Achats",
            data: purchaseValues,
            borderColor: "#dc3545",
            backgroundColor: "rgba(220, 53, 69, .1)",
            borderWidth: 3,
            tension: .35,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${currency.format(context.parsed.y)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (value) => currency.format(value) }
          }
        }
      }
    });
  }

  const totalRevenue = Math.max(0, Number(data.totalRevenue) || 0);
  const totalPurchases = Math.max(0, Number(data.totalPurchases) || 0);
  const result = Number(data.profit) || 0;
  const financialLabels = ["Ventes", "Achats", result >= 0 ? "Bénéfice net" : "Déficit"];
  const financialValues = [totalRevenue, totalPurchases, Math.abs(result)];
  const hasFinancialData = financialValues.some((value) => value > 0);
  showEmptyState("profitChart", "profitChartEmpty", !hasFinancialData);

  const profitChartCanvas = document.getElementById("profitChart");
  if (profitChartCanvas && hasFinancialData) {
    new Chart(profitChartCanvas, {
      type: "doughnut",
      data: {
        labels: financialLabels,
        datasets: [{
          data: financialValues,
          backgroundColor: ["#0d6efd", "#dc3545", result >= 0 ? "#198754" : "#f59e0b"],
          borderWidth: 2,
          borderColor: "#fff"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${currency.format(context.parsed)}`
            }
          }
        }
      }
    });
  }
});
