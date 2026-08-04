document.addEventListener("DOMContentLoaded", () => {

    // Vérification des données envoyées par EJS
    if (!window.dashboardData) {
        console.error("dashboardData introuvable");
        return;
    }

    const data = window.dashboardData;

    // ==========================
    // GRAPHIQUE VENTES / ACHATS
    // ==========================

    const salesChartCanvas =
        document.getElementById("salesChart");

    if (salesChartCanvas) {
        new Chart(salesChartCanvas, {
            type: "line",
            data: {
                labels: data.salesLabels,
                datasets: [

                    {
                        label: "Ventes",
                        data: data.salesData,
                        borderColor: "#0d6efd",
                        backgroundColor:
                            "rgba(13,110,253,0.15)",
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },

                    {
                        label: "Achats",
                        data: data.purchaseData,
                        borderColor: "#dc3545",
                        backgroundColor:
                            "rgba(220,53,69,0.15)",
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top"
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // ==========================
    // GRAPHIQUE PROFIT
    // ==========================

    const profitChartCanvas =
        document.getElementById("profitChart");

    if (profitChartCanvas) {
        new Chart(profitChartCanvas, {
            type: "doughnut",
            data: {
                labels: [
                    "Chiffre d'affaires",
                    "Achats",
                    "Profit"
                ],
                datasets: [{
                    data: [
                        data.totalRevenue,
                        data.totalPurchases,
                        data.profit
                    ],
                    backgroundColor: [
                        "#0d6efd",
                        "#dc3545",
                        "#198754"
                    ]
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    }
});