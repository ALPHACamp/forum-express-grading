const axios = require('axios')
const Chart = require('chart.js')
const chart = document.querySelector('#chart').getContext('2d')
const btns = document.querySelectorAll('.list-group-item')

// Render default line chart on load
let myChart
window.onload = async () => {
  const res = await requestRestaurantData()
  const [comments, views, labels] = res.data
  lineChart(chart, labels, comments, views)
}

btns.forEach(btn => {
  btn.addEventListener('click', async function onBtnClick (event) {
    // Active btn
    btns.forEach(btn => btn.classList.remove('active'))
    btn.classList.add('active')

    // Reset Chart
    myChart.destroy()

    // Render Line Chart
    if (btn.dataset.type === 'restaurant') {
      const res = await requestRestaurantData(btn)
      const [comments, views, labels] = res.data
      lineChart(chart, labels, comments, views, "Restaurants' Data")
    }

    // Render Category Pie Chart
    if (btn.dataset.type === 'category') {
      const res = await requestRestaurantData(btn)
      const [categories, counts] = res.data
      pieChart(chart, categories, counts, 'Top 5 Categories')
    }
  })
})

// Functions
// Request for restaurant data
const requestRestaurantData = btn => {
  const type = btn ? btn.dataset.type : 'restaurant'
  const duration = btn ? btn.value : 'days'
  const data = axios.get(
    `/admin/dashboard/chart?type=${type}&duration=${duration}`
  )
  return data
}

// Render line chart
const lineChart = (chart, labels, comments, views, title) => {
  myChart = new Chart(chart, {
    type: 'line',
    data: {
      // Timeline
      labels,
      datasets: [
        // Views
        {
          label: ['Comments'],
          data: comments,
          backgroundColor: 'rgba(255, 99, 132, 1)',
          borderColor: 'rgba(255, 99, 132, 1)'
        },
        // Likes
        {
          label: ['Views'],
          data: views,
          backgroundColor: 'rgba(54, 162, 235, 1)',
          borderColor: 'rgba(54, 162, 235, 1)'
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: !!title,
          text: title
        }
      }
    }
  })
}

// Render pie chart
const pieChart = (chart, categories, counts, title) => {
  myChart = new Chart(chart, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [
        {
          label: 'My First Dataset',
          data: counts,
          backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(54, 162, 235)',
            'rgba(255, 206, 86)',
            'rgba(75, 192, 192)',
            'rgba(153, 102, 255)',
            'rgba(255, 159, 64)'
          ],
          hoverOffset: 4
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: !!title,
          text: title
        }
      }
    }
  })
}
