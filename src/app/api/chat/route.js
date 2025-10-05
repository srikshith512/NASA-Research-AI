import sql from "@/app/api/utils/sql";

// Create embeddings for search (simplified - in production you'd use OpenAI embeddings)
async function createEmbedding(text) {
  // For demonstration, we'll use a simple text-based search
  // In production, you'd call OpenAI's embedding API here
  return null;
}

// Search publications using semantic similarity
async function searchPublications(query, mode = 'scientist', limit = 5) {
  try {
    // Local database search (text based)
    const dbPromise = sql`
      SELECT p.id, p.title, p.authors, p.publication_year, p.abstract, 
             p.results, p.conclusion, p.nasa_publication_id, p.research_area, p.keywords
      FROM publications p
      WHERE 
        LOWER(p.title) LIKE LOWER(${'%' + query + '%'}) OR
        LOWER(p.abstract) LIKE LOWER(${'%' + query + '%'}) OR
        LOWER(p.results) LIKE LOWER(${'%' + query + '%'}) OR
        LOWER(p.conclusion) LIKE LOWER(${'%' + query + '%'}) OR
        array_to_string(p.keywords, ' ') ILIKE ${'%' + query + '%'}
      ORDER BY 
        CASE 
          WHEN LOWER(p.title) LIKE LOWER(${'%' + query + '%'}) THEN 1
          WHEN LOWER(p.abstract) LIKE LOWER(${'%' + query + '%'}) THEN 2
          ELSE 3
        END,
        p.publication_year DESC
      LIMIT ${limit}
    `;

    // NASA Images API (no key required)
    const imagesApiPromise = fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error('images-api failed')))
      .then(json => {
        const items = Array.isArray(json?.collection?.items) ? json.collection.items : [];
        return items.slice(0, limit).map((item, idx) => {
          const data = Array.isArray(item?.data) ? item.data[0] : null;
          const links = Array.isArray(item?.links) ? item.links : [];
          const originalLink = links.find(l => l?.href)?.href;
          return {
            id: `nasa-image-${data?.nasa_id || idx}`,
            title: data?.title || 'NASA Image',
            authors: data?.photographer || null,
            publication_year: data?.date_created ? new Date(data.date_created).getFullYear() : null,
            abstract: data?.description || data?.keywords?.join(', '),
            results: null,
            conclusion: null,
            nasa_publication_id: data?.nasa_id || null,
            research_area: data?.keywords?.join(', ') || null,
            keywords: data?.keywords || [],
            url: originalLink || (data?.nasa_id ? `https://images.nasa.gov/details-${data.nasa_id}` : null)
          };
        });
      })
      .catch(() => []);

    // NASA TechPort (requires API key; will be skipped if not provided)
    const techportKey = process.env.NASA_API_KEY;
    const techportPromise = techportKey
      ? fetch(`https://api.nasa.gov/techport/api/projects/search?searchQuery=${encodeURIComponent(query)}&api_key=${techportKey}`)
          .then(r => r.ok ? r.json() : Promise.reject(new Error('techport failed')))
          .then(json => {
            const projects = Array.isArray(json?.projects?.projects) ? json.projects.projects : [];
            return projects.slice(0, limit).map((p) => ({
              id: `techport-${p.id}`,
              title: p.title,
              authors: null,
              publication_year: p.startYear ? Number(p.startYear) : null,
              abstract: p.description,
              results: null,
              conclusion: null,
              nasa_publication_id: String(p.id),
              research_area: p.primaryTaxonomyNodes?.map(t => t.title).join(', '),
              keywords: [],
              url: `https://techport.nasa.gov/view/${p.id}`
            }));
          })
          .catch(() => [])
      : Promise.resolve([]);

    // Wikipedia summary fallback (only used if no NASA results)
    const wikipediaPromise = (async () => {
      try {
        const search = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json`)
          .then(r => r.ok ? r.json() : Promise.reject(new Error('wiki search failed')));
        const title = Array.isArray(search) && search[1]?.[0];
        if (!title) return [];
        const summary = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
          .then(r => r.ok ? r.json() : Promise.reject(new Error('wiki summary failed')));
        return [{
          id: `wiki-${summary.pageid || title}`,
          title: summary.title,
          authors: null,
          publication_year: null,
          abstract: summary.extract,
          results: null,
          conclusion: null,
          nasa_publication_id: null,
          research_area: null,
          keywords: [],
          url: summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
        }];
      } catch { return []; }
    })();

    const [db, images, techport, wikipedia] = await Promise.all([dbPromise, imagesApiPromise, techportPromise, wikipediaPromise]);

    // Merge and de-duplicate by nasa_publication_id/title
    const combined = [...db, ...images, ...techport, ...wikipedia];
    const seen = new Set();
    const deduped = [];
    for (const pub of combined) {
      const key = pub.nasa_publication_id || pub.title;
      if (key && !seen.has(key)) {
        seen.add(key);
        deduped.push(pub);
      }
    }

    return deduped.slice(0, limit);
  } catch (error) {
    console.error('Error searching publications:', error);
    return [];
  }
}

// Generate AI response based on user query and relevant publications
async function generateResponse(query, publications, mode, sessionId) {
  try {
    // Prepare context from publications
    const context = publications.map(pub => 
      `Publication: ${pub.title} (${pub.publication_year})
Authors: ${pub.authors}
Abstract: ${pub.abstract}
Results: ${pub.results}
Conclusion: ${pub.conclusion}
NASA ID: ${pub.nasa_publication_id}`
    ).join('\n\n---\n\n');

    // Create mode-specific system prompt
    let systemPrompt = '';
    switch (mode) {
      case 'scientist':
        systemPrompt = `You are a NASA bioscience research assistant providing detailed, technical responses to scientists. Use precise scientific terminology and cite specific studies. Include methodology details and statistical findings when available.`;
        break;
      case 'manager':
        systemPrompt = `You are a NASA research assistant providing concise, actionable summaries for managers and decision-makers. Focus on key findings, implications, and recommendations. Keep responses brief but comprehensive.`;
        break;
      case 'student':
        systemPrompt = `You are a NASA research assistant explaining complex bioscience concepts to students. Use simple language, provide context, and explain technical terms. Make the information accessible and educational.`;
        break;
      default:
        systemPrompt = `You are a NASA bioscience research assistant providing helpful, accurate information based on published research.`;
    }

    // Generate a concise summary response directly from sources (no external AI dependency)
    let aiResponse = '';
    if (publications.length === 0) {
      aiResponse = `I couldn't find NASA sources matching "${query}" right now. Try rephrasing or broadening your query.`;
    } else {
      const top = publications.slice(0, Math.min(5, publications.length));
      const formatBullet = (p, i, maxAbstract = 280) => {
        const year = p.publication_year ? ` (${p.publication_year})` : '';
        const nasaId = p.nasa_publication_id ? ` [${p.nasa_publication_id}]` : '';
        const url = p.url ? `\nLink: ${p.url}` : '';
        const abstract = p.abstract ? `\nSummary: ${String(p.abstract).slice(0, maxAbstract)}${String(p.abstract).length > maxAbstract ? '…' : ''}` : '';
        return `${i + 1}. ${p.title}${year}${nasaId}${abstract}${url}`;
      };

      if (mode === 'student') {
        const bullets = top.map((p, i) => formatBullet(p, i, 180)).join('\n\n');
        aiResponse = `In simple terms, here are NASA resources about "${query}":\n\n${bullets}\n\nTell me if you want a kid-friendly explanation or pictures.`;
      } else if (mode === 'scientist') {
        const bullets = top.map((p, i) => formatBullet(p, i, 420)).join('\n\n');
        aiResponse = `Technical summary for "${query}":\n\n${bullets}\n\nI can cross-compare methodologies, extract metrics, or suggest analyses.`;
      } else {
        // researcher/manager style concise brief
        const bullets = top.map((p, i) => formatBullet(p, i, 240)).join('\n\n');
        aiResponse = `Executive summary for "${query}":\n\n${bullets}\n\nAsk for key takeaways or a short brief you can share.`;
      }
    }

    // Store the conversation
    try {
      await sql`
        INSERT INTO chat_messages (session_id, role, content, sources)
        VALUES (${sessionId}, 'user', ${query}, NULL)
      `;
    } catch (_) {}

    try {
      await sql`
        INSERT INTO chat_messages (session_id, role, content, sources)
        VALUES (${sessionId}, 'assistant', ${aiResponse}, ${JSON.stringify(publications.map(p => ({ id: p.id, nasa_id: p.nasa_publication_id, title: p.title, url: p.url || null })))} )
      `;
    } catch (_) {}

    return {
      response: aiResponse,
      sources: publications,
      suggestions: generateSuggestions(query, publications)
    };

  } catch (error) {
    console.error('Error generating response:', error);
    return {
      response: 'I apologize, but I encountered an error while processing your request. Please try again.',
      sources: [],
      suggestions: []
    };
  }
}

// Generate follow-up suggestions
function generateSuggestions(query, publications) {
  const suggestions = [];
  
  if (publications.length === 0) {
    suggestions.push('Try rephrasing your question or using different keywords');
    suggestions.push('Ask about a broader research area');
  } else {
    suggestions.push('Show me related studies');
    suggestions.push('Compare findings across different years');
    suggestions.push('Generate a visualization of the results');
  }
  
  return suggestions;
}

// Main chat endpoint
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, sessionId, mode = 'scientist' } = body;

    // Always respond: generate a minimal session and proceed if missing
    const safeSessionId = sessionId || `anon-${Date.now()}`;
    const safeMessage = message || 'Hello';

    // Ensure session exists
    const existingSession = await sql`
      SELECT session_id FROM chat_sessions WHERE session_id = ${sessionId}
    `;

    if (existingSession.length === 0) {
      await sql`
        INSERT INTO chat_sessions (session_id, user_mode)
        VALUES (${sessionId}, ${mode})
      `;
    } else {
      await sql`
        UPDATE chat_sessions 
        SET user_mode = ${mode}, updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ${sessionId}
      `;
    }

    // Search for relevant publications
    const relevantPublications = await searchPublications(safeMessage, mode);

    // Generate AI response
    const result = await generateResponse(safeMessage, relevantPublications, mode, safeSessionId);

    return Response.json({
      response: result.response,
      sources: result.sources,
      suggestions: result.suggestions,
      mode,
      sessionId: safeSessionId
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    // Fallback answer to always respond
    return Response.json({
      response: 'I ran into a hiccup, but here is a quick helpful summary: please try rephrasing or ask another question while I stabilize.','sources': [], 'suggestions': ['Try rephrasing your question', 'Ask for a short summary', 'Ask for related studies'], 'mode': 'scientist', 'sessionId': `anon-${Date.now()}`
    });
  }
}

// Fallback GET handler used by the client in dev mode
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const message = searchParams.get('message') || 'Hello';
    const mode = searchParams.get('mode') || 'scientist';
    const sessionId = searchParams.get('sessionId') || `anon-${Date.now()}`;

    // Try to ensure session (ignore failures)
    try {
      const existingSession = await sql`
        SELECT session_id FROM chat_sessions WHERE session_id = ${sessionId}
      `;
      if (existingSession.length === 0) {
        await sql`
          INSERT INTO chat_sessions (session_id, user_mode)
          VALUES (${sessionId}, ${mode})
        `;
      }
    } catch (_) {}

    const publications = await searchPublications(message, mode);
    const result = await generateResponse(message, publications, mode, sessionId);
    return Response.json({
      response: result.response,
      sources: result.sources,
      suggestions: result.suggestions,
      mode,
      sessionId,
    });
  } catch (error) {
    console.error('Error in chat GET endpoint:', error);
    return Response.json({
      response: 'I had an issue processing that, but here is a quick helpful note: try asking about a NASA topic, and I will summarize known resources.',
      sources: [],
      suggestions: ['Ask about a research area', 'Request a simple explanation'],
      mode: 'scientist',
      sessionId: `anon-${Date.now()}`,
    });
  }
}