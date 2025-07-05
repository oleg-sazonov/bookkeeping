document.addEventListener("DOMContentLoaded", () => {
    const months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
    ];

    const usernameInput = document.getElementById("username");
    usernameInput?.addEventListener("input", () => {
        const username = usernameInput.value.trim();
        const usernameRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        usernameInput.style.borderColor = usernameRegex.test(username)
            ? "green"
            : "red";
    });

    const getMonthlyData = () => {
        const incomeData = months.map((month) =>
            Number(document.getElementById(`income-${month}`)?.value || 0)
        );
        const expensesData = months.map((month) =>
            Number(document.getElementById(`expenses-${month}`)?.value || 0)
        );
        return { incomeData, expensesData };
    };

    const ctx = document.getElementById("barChart").getContext("2d");
    const barChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: months.map(
                (month) => month.charAt(0).toUpperCase() + month.slice(1)
            ),
            datasets: [
                {
                    label: "Income",
                    data: [],
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Expenses",
                    data: [],
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true },
            },
        },
    });

    const updateChart = () => {
        const { incomeData, expensesData } = getMonthlyData();
        barChart.data.datasets[0].data = incomeData;
        barChart.data.datasets[1].data = expensesData;
        barChart.update();
    };

    months.forEach((month) => {
        const incomeInput = document.getElementById(`income-${month}`);
        const expensesInput = document.getElementById(`expenses-${month}`);
        incomeInput?.addEventListener("input", updateChart);
        expensesInput?.addEventListener("input", updateChart);
    });

    document
        .getElementById("downloadChartBtn")
        .addEventListener("click", () => {
            const canvas = document.getElementById("barChart");
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = "chart.png";
            link.click();
        });
});
