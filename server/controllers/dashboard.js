const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: format Date -> YYYY-MM-DD
function fmt(date) {
  return date.toISOString().slice(0, 10);
}

// Build bucket SQL expressions for MySQL
function bucketExpressions(bucket) {
  if (bucket === 'week') {
    return {
      startExpr: "DATE_SUB(DATE(`createdAt`), INTERVAL WEEKDAY(`createdAt`) DAY)",
      endExpr: "DATE_ADD(DATE_SUB(DATE(`createdAt`), INTERVAL WEEKDAY(`createdAt`) DAY), INTERVAL 6 DAY)",
      groupBy: "DATE_SUB(DATE(`createdAt`), INTERVAL WEEKDAY(`createdAt`) DAY)"
    };
  }
  if (bucket === 'month') {
    return {
      startExpr: "DATE_FORMAT(`createdAt`, '%Y-%m-01')",
      endExpr: "LAST_DAY(`createdAt`)",
      groupBy: "DATE_FORMAT(`createdAt`, '%Y-%m')"
    };
  }
  // day
  return {
    startExpr: "DATE(`createdAt`)",
    endExpr: "DATE(`createdAt`)",
    groupBy: "DATE(`createdAt`)"
  };
}

async function productsHandler(req, res) {
  try {
    let { startDate, endDate, bucket = 'day' } = req.query;
    bucket = bucket === 'week' ? 'week' : bucket === 'month' ? 'month' : 'day';

    // defaults: last 30 days
    const now = new Date();
    if (!endDate) endDate = fmt(now);
    if (!startDate) {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      startDate = fmt(d);
    }

    const expr = bucketExpressions(bucket);

    // Use prisma.$queryRaw with parameterized values
    const sql = `
      SELECT
        ${expr.startExpr} AS bucketStart,
        ${expr.endExpr} AS bucketEnd,
        COUNT(*) AS totalProducts
      FROM ProductTrend
      WHERE createdAt >= ${'${start}'} AND createdAt < DATE_ADD(${ '${end}' }, INTERVAL 1 DAY)
      GROUP BY ${expr.groupBy}
      ORDER BY bucketStart ASC
    `;

    // prisma.$queryRaw with tagged template - inject parameters safely
    const rows = await prisma.$queryRawUnsafe(
      sql.replace('${start}', `'${startDate} 00:00:00'`).replace('${end}', `'${endDate} 00:00:00'`)
    );

    const data = rows.map(r => ({
      startDate: r.bucketStart ? (r.bucketStart instanceof Date ? r.bucketStart.toISOString().slice(0,10) : String(r.bucketStart).slice(0,10)) : null,
      endDate: r.bucketEnd ? (r.bucketEnd instanceof Date ? r.bucketEnd.toISOString().slice(0,10) : String(r.bucketEnd).slice(0,10)) : null,
      totalProducts: Number(r.totalProducts)
    }));

    res.json({ success: true, bucket, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function visitorsHandler(req, res) {
  try {
    let { startDate, endDate, bucket = 'day' } = req.query;
    bucket = bucket === 'week' ? 'week' : bucket === 'month' ? 'month' : 'day';

    const now = new Date();
    if (!endDate) endDate = fmt(now);
    if (!startDate) {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      startDate = fmt(d);
    }

    const expr = bucketExpressions(bucket);

    const sql = `
      SELECT
        ${expr.startExpr} AS bucketStart,
        ${expr.endExpr} AS bucketEnd,
        COUNT(*) AS totalVisits,
        COUNT(DISTINCT ip) AS uniqueVisitors
      FROM VisitorLog
      WHERE createdAt >= ${'${start}'} AND createdAt < DATE_ADD(${ '${end}' }, INTERVAL 1 DAY)
      GROUP BY ${expr.groupBy}
      ORDER BY bucketStart ASC
    `;

    const rows = await prisma.$queryRawUnsafe(
      sql.replace('${start}', `'${startDate} 00:00:00'`).replace('${end}', `'${endDate} 00:00:00'`)
    );

    const data = rows.map(r => ({
      startDate: r.bucketStart ? (r.bucketStart instanceof Date ? r.bucketStart.toISOString().slice(0,10) : String(r.bucketStart).slice(0,10)) : null,
      endDate: r.bucketEnd ? (r.bucketEnd instanceof Date ? r.bucketEnd.toISOString().slice(0,10) : String(r.bucketEnd).slice(0,10)) : null,
      totalVisits: Number(r.totalVisits),
      uniqueVisitors: Number(r.uniqueVisitors)
    }));

    res.json({ success: true, bucket, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  productsHandler,
  visitorsHandler
};
