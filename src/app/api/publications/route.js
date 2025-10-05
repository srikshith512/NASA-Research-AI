import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const researchArea = searchParams.get('researchArea') || '';
    const yearFrom = searchParams.get('yearFrom') || '';
    const yearTo = searchParams.get('yearTo') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build dynamic query
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`(
        LOWER(title) LIKE LOWER($${paramIndex}) OR 
        LOWER(abstract) LIKE LOWER($${paramIndex}) OR 
        LOWER(authors) LIKE LOWER($${paramIndex}) OR
        array_to_string(keywords, ' ') ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (researchArea) {
      whereConditions.push(`LOWER(research_area) = LOWER($${paramIndex})`);
      params.push(researchArea);
      paramIndex++;
    }

    if (yearFrom) {
      whereConditions.push(`publication_year >= $${paramIndex}`);
      params.push(parseInt(yearFrom));
      paramIndex++;
    }

    if (yearTo) {
      whereConditions.push(`publication_year <= $${paramIndex}`);
      params.push(parseInt(yearTo));
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM publications ${whereClause}`;
    const countResult = await sql(countQuery, params);
    const total = parseInt(countResult[0].total);

    // Get publications
    const publicationsQuery = `
      SELECT id, title, authors, publication_year, abstract, research_area, 
             keywords, nasa_publication_id, created_at
      FROM publications 
      ${whereClause}
      ORDER BY publication_year DESC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const publications = await sql(publicationsQuery, [...params, limit, offset]);

    // Get research areas for filters
    const researchAreas = await sql`
      SELECT DISTINCT research_area, COUNT(*) as count
      FROM publications 
      WHERE research_area IS NOT NULL
      GROUP BY research_area 
      ORDER BY count DESC
    `;

    // Get year range for filters
    const yearRange = await sql`
      SELECT MIN(publication_year) as min_year, MAX(publication_year) as max_year
      FROM publications 
      WHERE publication_year IS NOT NULL
    `;

    return Response.json({
      publications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        researchAreas: researchAreas.map(area => area.research_area),
        yearRange: yearRange[0] || { min_year: 1990, max_year: 2024 }
      }
    });

  } catch (error) {
    console.error('Error fetching publications:', error);
    return Response.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
}