import { ArcElement, Chart, Colors, PieController, Tooltip } from "chart.js";
Chart.register(ArcElement, Colors, PieController, Tooltip);

(function () {
  // Get data
  const arr = Array.prototype.slice.call(
    document.querySelectorAll("table[border='1'] tr")
  );
  arr.shift();

  const moods = [];
  const counts = [];
  let i = 0;
  for (let row of arr) {
    const mood = row.querySelector("td:nth-child(1)").textContent;
    const count = parseInt(row.querySelector("td:nth-child(2)").textContent);
    if (isNaN(count)) {
      console.warn(`Row ${i} has invalid number`);
      continue;
    }
    moods.push(mood);
    counts.push(count);
    i++;
  }

  // Create graph
  const chartContainer = document.createElement("div");
  chartContainer.id = "mood-chart";
  chartContainer.innerHTML = "<div></div>";

  const chartEl = document.createElement("canvas");
  new Chart(chartEl, {
    type: "pie",
    data: {
      labels: moods,
      datasets: [
        {
          label: "Mood frequency",
          data: counts
        }
      ]
    },
    options: {
      borderWidth: 0,
      layout: {
        padding: 24
      },
      plugins: {
        legend: {
          display: false
        }
      },
      elements: {
        arc: {
          hoverBorderWidth: 2
        }
      }
    }
  });

  chartContainer.querySelector("div").appendChild(chartEl);
  document
    .querySelector(".content")
    .insertBefore(chartContainer, document.querySelector("div[align=center]"));
})();
