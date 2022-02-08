const dayjs = require('dayjs')
const { Sequelize, sequelize, Restaurant, Category } = require('../models')

const isAttached = (entryId, manyModel, foreignKey) => {
  // Check if a one (entry) to many (Model) relationship data has at least one attached entry. The foreignKey must be provided for checking.
  const where = {}
  where[foreignKey] = entryId
  return new Promise((resolve, reject) => {
    manyModel
      .findOne({ where })
      .then(data => {
        if (!data) return resolve(false)
        return resolve(true)
      })
      .catch(err => reject(err))
  })
}

// Handle restaurant data for dashboard line chart
const lineChartData = async duration => {
  if (duration === 'days') {
    // Comments
    // Use raw SQL query to keep code simple
    const [comments, views] = await Promise.all([
      sequelize.query(
        `SELECT 
          COUNT(id) AS comment_counts, 
          convert(created_at, date) AS date 
        FROM comments 
        WHERE datediff(current_date(), created_at) <= 30 GROUP BY date ORDER BY date;`,
        { type: Sequelize.QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT 
          COUNT(id) AS view_counts, 
          convert(created_at, date) AS date 
        FROM views 
        WHERE datediff(current_date(),created_at) <= 30 GROUP BY date 
        ORDER BY date;`,
        { type: Sequelize.QueryTypes.SELECT }
      )
    ])

    // Create an array of each date of past 30 days
    const dayInMs = 86400000
    const pastThirtyDays = []
    for (let i = 30; i > 0; i--) {
      const today = new Date()
      const nextDay = new Date(today.getTime() - dayInMs * i)
      pastThirtyDays.push(dayjs(nextDay).format('YYYY-MM-DD'))
    }

    // Check if data have skip a day, if so, fill with 0
    checkTimeContinuum(comments, 'comment_counts', pastThirtyDays)
    checkTimeContinuum(views, 'view_counts', pastThirtyDays)

    return [comments, views, pastThirtyDays]
  }

  if (duration === 'months') {
    const [comments, views] = await Promise.all([
      sequelize.query(
        `SELECT 
          SUM(sums) AS comment_counts, 
          date_format(ordered_date, "%m/%Y") AS date 
          FROM 
            (
              SELECT 
                COUNT(id) AS sums, 
                convert(created_at, date) AS ordered_date
              FROM comments
              GROUP BY ordered_date
              ORDER BY ordered_date ASC
            ) AS origin
        GROUP BY date;`,
        { type: Sequelize.QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT 
          SUM(sums) AS view_counts, 
          date_format(ordered_date, "%m/%Y") AS date 
          FROM 
            (
              SELECT COUNT(id) AS sums, 
              convert(created_at, date) AS ordered_date
              FROM views
              GROUP BY ordered_date
              ORDER BY ordered_date ASC
            ) AS origin
        GROUP BY date;`,
        { type: Sequelize.QueryTypes.SELECT }
      )
    ])

    // Extract an array of each month
    const months = []
    for (let i = 0; i < comments.length; i++) {
      months.push(comments[i].date)
    }

    // Check if data have skip a month, if so, fill with 0
    checkTimeContinuum(comments, 'comment_counts', months)
    checkTimeContinuum(views, 'view_counts', months)

    return [comments, views, months]
  }
}

// Handle restaurant data for dashboard pie chart
const pieChartData = async () => {
  const rawData = await Restaurant.findAll({
    attributes: [
      [sequelize.fn('count', sequelize.col('category_id')), 'count'],
      'categoryId'
    ],
    include: [Category],
    group: 'categoryId',
    raw: true,
    nest: true
  })

  // Data cleaning
  // sort category by counts
  rawData.sort((a, b) => b.count - a.count)
  const categories = []
  const counts = []
  rawData.forEach(data => {
    categories.push(data.Category.name)
    counts.push(data.count)
  })

  // Only shows top 5 category
  if (rawData.length > 5) {
    const total = counts.slice(5).reduce((acc, curr) => acc + curr)
    counts.splice(5)
    counts.push(total)
    categories.splice(5)
    categories.push('其他')
  }

  return [categories, counts]
}

module.exports = { isAttached, lineChartData, pieChartData }

// Function
function checkTimeContinuum (data, dataCounts, time) {
  // Both data and date are arrays
  // Date contains date information for each entry
  for (let i = 0; i < time.length; i++) {
    // Add 0 if the last data is missing
    if (!data[i]) {
      data.push(0)
      continue
    }
    if (time[i] === data[i].date) {
      data[i] = data[i][dataCounts]
    } else {
      // If detecting missing data, insert 0
      data.splice(i - 1, 0, 0)
    }
  }
}
