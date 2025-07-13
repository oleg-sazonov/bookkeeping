document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const emailButton = document.getElementById("sendEmailButton");
    const chartCanvas = document.getElementById("barChart");
    const downloadBtn = document.getElementById("downloadChartBtn");
    const ctx = document.getElementById("barChart").getContext("2d");
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

    /**
     * Validates the value of the username input field against a specific pattern.
     * The pattern requires at least 8 characters, including at least one lowercase letter,
     * one uppercase letter, one digit, and one special character (@$!%*?&).
     * Sets the input border color to green if valid, otherwise red.
     */
    const usernameInputCallback = () => {
        const username = usernameInput.value.trim();
        const usernameRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        usernameInput.style.borderColor = usernameRegex.test(username)
            ? "green"
            : "red";
    };

    /**
     * Downloads the chart displayed on the canvas element with the ID "barChart" as a PNG image.
     * Creates a temporary anchor element to trigger the download of the image.
     *
     * @function
     * @returns {void}
     */
    const downloadChart = () => {
        const canvas = document.getElementById("barChart");
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "chart.png";
        link.click();
    };

    /**
     * Sends an email with an attached chart image to the specified email address.
     *
     * @async
     * @function
     * @param {string} email - The recipient's email address.
     * @param {string} chartImageBase64 - The base64-encoded image of the chart to be sent.
     * @returns {Promise<void>} Resolves when the email is sent or logs an error if it fails.
     */
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

    /**
     * Assigns random income and expense values to input fields for each month.
     *
     * For each month in the `months` array, this function finds the corresponding
     * income and expenses input elements by their IDs (`income-{month}` and `expenses-{month}`),
     * then assigns them random values within the specified ranges.
     *
     * @param {number} [minExpense=200] - The minimum value for generated expenses.
     * @param {number} [maxExpense=800] - The maximum value for generated expenses.
     * @param {number} [minIncome=100] - The minimum value for generated incomes.
     * @param {number} [maxIncome=1200] - The maximum value for generated incomes.
     */
    const addRandomValuesForIncomesAndExpenses = (
        minExpense = 200,
        maxExpense = 800,
        minIncome = 100,
        maxIncome = 1200
    ) => {
        months.forEach((month) => {
            const incomeInput = document.getElementById(`income-${month}`);
            const expensesInput = document.getElementById(`expenses-${month}`);

            if (incomeInput && expensesInput) {
                // Generate independent random values
                const expenses =
                    Math.floor(Math.random() * (maxExpense - minExpense + 1)) +
                    minExpense;
                const income =
                    Math.floor(Math.random() * (maxIncome - minIncome + 1)) +
                    minIncome;

                // Set default values
                incomeInput.value = income;
                expensesInput.value = expenses;
            }
        });
    };

    /**
     * Retrieves monthly income and expenses data from input elements in the DOM.
     *
     * Iterates over the `months` array, fetching the value of each corresponding
     * income and expenses input field by their IDs (formatted as `income-{month}` and `expenses-{month}`).
     * Converts the input values to numbers, defaulting to 0 if the input is missing or empty.
     *
     * @returns {{ incomeData: number[], expensesData: number[] }}
     *   An object containing two arrays: `incomeData` and `expensesData`, each representing the numeric values for all months.
     */
    const getMonthlyData = () => {
        const incomeData = months.map((month) =>
            Number(document.getElementById(`income-${month}`)?.value || 0)
        );
        const expensesData = months.map((month) =>
            Number(document.getElementById(`expenses-${month}`)?.value || 0)
        );
        return { incomeData, expensesData };
    };

    /**
     * Updates the bar chart with the latest monthly income and expenses data.
     * Retrieves new data using `getMonthlyData`, assigns it to the respective datasets,
     * and refreshes the chart display.
     */
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

    usernameInput?.addEventListener("input", usernameInputCallback);
    downloadBtn.addEventListener("click", downloadChart);
    emailButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        if (!email) {
            console.error("Please enter a valid email address.");
            return;
        }

        // Generate the Base64 image string inside the click event listener
        const chartImageBase64 = chartCanvas.toDataURL("image/png");

        sendEmailWithChart(email, chartImageBase64);
    });
});
