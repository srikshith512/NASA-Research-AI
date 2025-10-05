import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // Publications by year
    const publicationsByYear = await sql`
      SELECT publication_year as year, COUNT(*) as count
      FROM publications 
      WHERE publication_year IS NOT NULL
      GROUP BY publication_year 
      ORDER BY publication_year ASC
    `;

    // Publications by research area
    const publicationsByArea = await sql`
      SELECT research_area, COUNT(*) as count
      FROM publications 
      WHERE research_area IS NOT NULL
      GROUP BY research_area 
      ORDER BY count DESC
    `;

    // Top keywords
    const topKeywords = await sql`
      SELECT UNNEST(keywords) as keyword, COUNT(*) as count
      FROM publications 
      WHERE keywords IS NOT NULL AND array_length(keywords, 1) > 0
      GROUP BY keyword 
      ORDER BY count DESC 
      LIMIT 15
    `;

    // Recent publications (last 5 years)
    const currentYear = new Date().getFullYear();
    const recentPublications = await sql`
      SELECT COUNT(*) as count
      FROM publications 
      WHERE publication_year >= ${currentYear - 4}
    `;

    // Total statistics
    const totalStats = await sql`
      SELECT 
        COUNT(*) as total_publications,
        COUNT(DISTINCT research_area) as total_areas,
        COUNT(DISTINCT authors) as total_authors,
        AVG(publication_year) as avg_year
      FROM publications
    `;

    // Most productive authors
    const topAuthors = await sql`
      SELECT authors, COUNT(*) as publications_count
      FROM publications 
      WHERE authors IS NOT NULL AND authors != ''
      GROUP BY authors 
      ORDER BY publications_count DESC 
      LIMIT 10
    `;

    // Research gaps (areas with few publications)
    const researchGaps = await sql`
      SELECT research_area, COUNT(*) as count
      FROM publications 
      WHERE research_area IS NOT NULL
      GROUP BY research_area 
      HAVING COUNT(*) <= 3
      ORDER BY count ASC, research_area ASC
    `;

    // Monthly chat activity (last 12 months)
    const chatActivity = await sql`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as message_count,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM chat_messages 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month ASC
    `;

    // Most asked about topics (from chat messages)
    const popularTopics = await sql`
      SELECT 
        research_area,
        COUNT(cm.id) as mention_count
      FROM publications p
      JOIN chat_messages cm ON (
        LOWER(cm.content) LIKE LOWER('%' || p.research_area || '%') OR
        LOWER(cm.content) LIKE LOWER('%' || p.title || '%')
      )
      WHERE p.research_area IS NOT NULL
      GROUP BY research_area
      ORDER BY mention_count DESC
      LIMIT 10
    `;

    return Response.json({
      overview: {
        totalPublications: parseInt(totalStats[0].total_publications),
        totalAreas: parseInt(totalStats[0].total_areas),
        totalAuthors: parseInt(totalStats[0].total_authors),
        averageYear: Math.round(parseFloat(totalStats[0].avg_year)),
        recentPublications: parseInt(recentPublications[0].count)
      },
      charts: {
        publicationsByYear: publicationsByYear.map(item => ({
          year: item.year,
          count: parseInt(item.count)
        })),
        publicationsByArea: publicationsByArea.map(item => ({
          area: item.research_area,
          count: parseInt(item.count)
        })),
        topKeywords: topKeywords.map(item => ({
          keyword: item.keyword,
          count: parseInt(item.count)
        })),
        topAuthors: topAuthors.map(item => ({
          author: item.authors,
          count: parseInt(item.publications_count)
        })),
        chatActivity: chatActivity.map(item => ({
          month: item.month,
          messages: parseInt(item.message_count),
          sessions: parseInt(item.unique_sessions)
        })),
        popularTopics: popularTopics.map(item => ({
          topic: item.research_area,
          mentions: parseInt(item.mention_count)
        }))
      },
      insights: {
        researchGaps: researchGaps.map(item => ({
          area: item.research_area,
          publicationCount: parseInt(item.count)
        })),
        trends: {
          growingAreas: publicationsByArea.slice(0, 3).map(item => item.research_area),
          underResearched: researchGaps.slice(0, 5).map(item => item.research_area)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}