document.addEventListener("DOMContentLoaded", function () {
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

    // input with id "username" on change
    const usernameInput = document.getElementById("username");
    if (usernameInput) {
        usernameInput.addEventListener("input", function () {
            const username = usernameInput.value.trim();

            // regex to check if username has at least 1 capital letter, 1 lowercase letter, 1 number, 1 special character, and is at least 8 characters long
            const usernameRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (usernameRegex.test(username)) {
                usernameInput.style.borderColor = "green";
            } else {
                usernameInput.style.borderColor = "red";
            }
        });
    }

    function getMonthlyData() {
        const incomeData = [];
        const expensesData = [];

        months.forEach((month) => {
            const incomeInput = document.getElementById(`income-${month}`);
            const expensesInput = document.getElementById(`expenses-${month}`);

            incomeData.push(Number(incomeInput?.value || 0));
            expensesData.push(Number(expensesInput?.value || 0));
        });

        return { incomeData, expensesData };
    }

    const ctx = document.getElementById("barChart").getContext("2d");
    const barChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ],
            datasets: [
                {
                    label: "Income",
                    data: [], // Initially empty
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Expenses",
                    data: [], // Initially empty
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    // Function to update the chart
    function updateChart() {
        const { incomeData, expensesData } = getMonthlyData();

        barChart.data.datasets[0].data = incomeData; // Update income data
        barChart.data.datasets[1].data = expensesData; // Update expenses data

        barChart.update(); // Refresh the chart
    }

    // Add event listeners to input fields
    function attachInputListeners() {
        months.forEach((month) => {
            const incomeInput = document.getElementById(`income-${month}`);
            const expensesInput = document.getElementById(`expenses-${month}`);

            if (incomeInput) {
                incomeInput.addEventListener("input", () =>
                    updateChart(barChart)
                );
            }
            if (expensesInput) {
                expensesInput.addEventListener("input", () =>
                    updateChart(barChart)
                );
            }
        });
    }

    // Attach listeners on page load
    attachInputListeners();

    document
        .getElementById("downloadChartBtn")
        .addEventListener("click", () => {
            const canvas = document.getElementById("barChart");
            const image = canvas.toDataURL("image/png"); // Convert canvas to image data URL

            const link = document.createElement("a");
            link.href = image;
            link.download = "chart.png"; // Set the default file name
            link.click(); // Trigger the download
        });
});
