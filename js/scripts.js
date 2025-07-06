document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username");
    usernameInput?.addEventListener("input", () => {
        const username = usernameInput.value.trim();
        const usernameRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        usernameInput.style.borderColor = usernameRegex.test(username)
            ? "green"
            : "red";
    });

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

    const addRandomValuesForIncomesAndExpenses = () => {
        months.forEach((month) => {
            const incomeInput = document.getElementById(`income-${month}`);
            const expensesInput = document.getElementById(`expenses-${month}`);

            if (incomeInput && expensesInput) {
                // Generate random values
                const expenses =
                    Math.floor(Math.random() * (800 - 200 + 1)) + 200; // 200–800
                const income =
                    Math.floor(Math.random() * (1000 - (expenses + 1))) +
                    (expenses + 1); // Greater than expenses

                // Set default values
                incomeInput.value = income;
                expensesInput.value = expenses;
            }
        });
    };

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
        addRandomValuesForIncomesAndExpenses();
        const incomeInput = document.getElementById(`income-${month}`);
        const expensesInput = document.getElementById(`expenses-${month}`);
        incomeInput?.addEventListener("input", updateChart);
        expensesInput?.addEventListener("input", updateChart);
    });

    updateChart();

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

    const sendEmailWithChart = async (email, chartImageBase64) => {
        try {
            const response = await fetch("http://localhost:3000/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, chartImage: chartImageBase64 }),
            });

            if (response.ok) {
                console.log("Email sent successfully!");
            } else {
                console.error("Failed to send email.");
            }
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    // Example usage:
    const emailInput = document.getElementById("email");
    const emailButton = document.getElementById("sendEmailButton");
    const chartCanvas = document.getElementById("barChart"); // Assuming chart is rendered on a canvas
    const chartImageBase64 = chartCanvas.toDataURL("image/png");

    emailButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        sendEmailWithChart(email, chartImageBase64);
    });
});
