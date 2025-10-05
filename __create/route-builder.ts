import { Hono } from 'hono';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

// Mock data for publications
const mockPublications = [
  {
    id: 1,
    title: "Advanced Propulsion Systems for Deep Space Exploration",
    authors: "Dr. Sarah Johnson, Dr. Michael Chen",
    publication_year: 2024,
    abstract: "This paper presents novel propulsion technologies for long-duration space missions, including ion propulsion and nuclear thermal systems.",
    research_area: "Propulsion Systems",
    keywords: ["propulsion", "deep space", "ion drive", "nuclear thermal"],
    nasa_publication_id: "NASA-TP-2024-001",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Machine Learning Applications in Space Weather Prediction",
    authors: "Dr. Emily Rodriguez, Dr. James Wilson",
    publication_year: 2024,
    abstract: "We demonstrate the effectiveness of neural networks in predicting solar flares and geomagnetic storms using satellite data.",
    research_area: "Space Weather",
    keywords: ["machine learning", "space weather", "solar flares", "prediction"],
    nasa_publication_id: "NASA-TP-2024-002",
    created_at: "2024-02-20T14:45:00Z"
  },
  {
    id: 3,
    title: "Sustainable Life Support Systems for Mars Colonies",
    authors: "Dr. Robert Kim, Dr. Lisa Thompson",
    publication_year: 2023,
    abstract: "Development of closed-loop life support systems using advanced recycling technologies for long-term Mars habitation.",
    research_area: "Life Support Systems",
    keywords: ["life support", "Mars", "recycling", "sustainability"],
    nasa_publication_id: "NASA-TP-2023-015",
    created_at: "2023-11-10T09:15:00Z"
  },
  {
    id: 4,
    title: "Quantum Computing Applications in Space Navigation",
    authors: "Dr. David Park, Dr. Maria Garcia",
    publication_year: 2023,
    abstract: "Exploring quantum algorithms for autonomous spacecraft navigation and communication in deep space environments.",
    research_area: "Quantum Computing",
    keywords: ["quantum computing", "navigation", "spacecraft", "algorithms"],
    nasa_publication_id: "NASA-TP-2023-028",
    created_at: "2023-09-05T16:20:00Z"
  },
  {
    id: 5,
    title: "Advanced Materials for Space Radiation Shielding",
    authors: "Dr. Jennifer Lee, Dr. Thomas Brown",
    publication_year: 2023,
    abstract: "Development of lightweight, high-strength materials for protecting astronauts from cosmic radiation during long-duration missions.",
    research_area: "Materials Science",
    keywords: ["materials", "radiation", "shielding", "astronauts"],
    nasa_publication_id: "NASA-TP-2023-042",
    created_at: "2023-07-18T11:30:00Z"
  },
  {
    id: 6,
    title: "Autonomous Robotic Systems for Lunar Construction",
    authors: "Dr. Alex Chen, Dr. Sarah Williams",
    publication_year: 2022,
    abstract: "Design and testing of robotic systems for automated construction of lunar bases using in-situ resources.",
    research_area: "Robotics",
    keywords: ["robotics", "lunar", "construction", "autonomous"],
    nasa_publication_id: "NASA-TP-2022-035",
    created_at: "2022-12-03T13:45:00Z"
  },
  {
    id: 7,
    title: "Bioastronautics: Human Adaptation to Microgravity",
    authors: "Dr. Rachel Green, Dr. Mark Davis",
    publication_year: 2022,
    abstract: "Comprehensive study of physiological changes in astronauts during extended space missions and countermeasures.",
    research_area: "Bioastronautics",
    keywords: ["bioastronautics", "microgravity", "physiology", "countermeasures"],
    nasa_publication_id: "NASA-TP-2022-018",
    created_at: "2022-08-22T14:10:00Z"
  },
  {
    id: 8,
    title: "Advanced Telescope Technologies for Exoplanet Detection",
    authors: "Dr. Kevin Zhang, Dr. Amanda Taylor",
    publication_year: 2022,
    abstract: "Next-generation telescope designs incorporating adaptive optics and coronagraphy for direct exoplanet imaging.",
    research_area: "Astrophysics",
    keywords: ["telescopes", "exoplanets", "adaptive optics", "imaging"],
    nasa_publication_id: "NASA-TP-2022-051",
    created_at: "2022-05-14T10:25:00Z"
  },
  {
    id: 9,
    title: "Space Debris Mitigation Strategies",
    authors: "Dr. Patricia Moore, Dr. Steven Johnson",
    publication_year: 2021,
    abstract: "Comprehensive analysis of space debris accumulation and proposed mitigation strategies for sustainable space operations.",
    research_area: "Space Debris",
    keywords: ["space debris", "mitigation", "sustainability", "orbital mechanics"],
    nasa_publication_id: "NASA-TP-2021-033",
    created_at: "2021-10-30T15:40:00Z"
  },
  {
    id: 10,
    title: "Advanced Communication Systems for Deep Space",
    authors: "Dr. Michael Anderson, Dr. Lisa Wang",
    publication_year: 2021,
    abstract: "Development of high-bandwidth communication systems for maintaining contact with spacecraft in the outer solar system.",
    research_area: "Communications",
    keywords: ["communications", "deep space", "bandwidth", "spacecraft"],
    nasa_publication_id: "NASA-TP-2021-047",
    created_at: "2021-06-12T12:15:00Z"
  },
  {
    id: 11,
    title: "In-Situ Resource Utilization on Mars",
    authors: "Dr. Christopher Lee, Dr. Nicole Brown",
    publication_year: 2021,
    abstract: "Technologies for extracting and processing Martian resources to support human exploration and settlement.",
    research_area: "ISRU",
    keywords: ["ISRU", "Mars", "resources", "extraction"],
    nasa_publication_id: "NASA-TP-2021-022",
    created_at: "2021-03-08T09:50:00Z"
  },
  {
    id: 12,
    title: "Advanced Thermal Management for Spacecraft",
    authors: "Dr. Daniel Kim, Dr. Jessica White",
    publication_year: 2020,
    abstract: "Innovative thermal control systems for maintaining optimal temperatures in spacecraft during extreme space environments.",
    research_area: "Thermal Systems",
    keywords: ["thermal", "spacecraft", "temperature", "control"],
    nasa_publication_id: "NASA-TP-2020-039",
    created_at: "2020-11-25T16:30:00Z"
  }
];

const mockResearchAreas = [
  "Propulsion Systems", "Space Weather", "Life Support Systems", "Quantum Computing",
  "Materials Science", "Robotics", "Bioastronautics", "Astrophysics", "Space Debris",
  "Communications", "ISRU", "Thermal Systems"
];

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalPublications: 12,
    totalAreas: 12,
    totalAuthors: 24,
    averageYear: 2022,
    recentPublications: 5
  },
  charts: {
    publicationsByYear: [
      { year: 2020, count: 1 },
      { year: 2021, count: 3 },
      { year: 2022, count: 4 },
      { year: 2023, count: 3 },
      { year: 2024, count: 2 }
    ],
    publicationsByArea: [
      { area: "Propulsion Systems", count: 1 },
      { area: "Space Weather", count: 1 },
      { area: "Life Support Systems", count: 1 },
      { area: "Quantum Computing", count: 1 },
      { area: "Materials Science", count: 1 },
      { area: "Robotics", count: 1 },
      { area: "Bioastronautics", count: 1 },
      { area: "Astrophysics", count: 1 },
      { area: "Space Debris", count: 1 },
      { area: "Communications", count: 1 },
      { area: "ISRU", count: 1 },
      { area: "Thermal Systems", count: 1 }
    ],
    topKeywords: [
      { keyword: "spacecraft", count: 3 },
      { keyword: "deep space", count: 2 },
      { keyword: "navigation", count: 2 },
      { keyword: "materials", count: 2 },
      { keyword: "propulsion", count: 2 },
      { keyword: "Mars", count: 2 },
      { keyword: "robotics", count: 1 },
      { keyword: "quantum", count: 1 },
      { keyword: "thermal", count: 1 },
      { keyword: "communications", count: 1 },
      { keyword: "space debris", count: 1 },
      { keyword: "telescopes", count: 1 },
      { keyword: "bioastronautics", count: 1 },
      { keyword: "life support", count: 1 },
      { keyword: "space weather", count: 1 }
    ],
    topAuthors: [
      { author: "Dr. Sarah Johnson", count: 2 },
      { author: "Dr. Michael Chen", count: 2 },
      { author: "Dr. Emily Rodriguez", count: 1 },
      { author: "Dr. James Wilson", count: 1 },
      { author: "Dr. Robert Kim", count: 1 },
      { author: "Dr. Lisa Thompson", count: 1 },
      { author: "Dr. David Park", count: 1 },
      { author: "Dr. Maria Garcia", count: 1 },
      { author: "Dr. Jennifer Lee", count: 1 },
      { author: "Dr. Thomas Brown", count: 1 }
    ],
    chatActivity: [
      { month: "2024-01", messages: 45, sessions: 12 },
      { month: "2024-02", messages: 52, sessions: 15 },
      { month: "2024-03", messages: 38, sessions: 10 },
      { month: "2024-04", messages: 61, sessions: 18 },
      { month: "2024-05", messages: 47, sessions: 14 },
      { month: "2024-06", messages: 55, sessions: 16 },
      { month: "2024-07", messages: 42, sessions: 13 },
      { month: "2024-08", messages: 49, sessions: 15 },
      { month: "2024-09", messages: 58, sessions: 17 },
      { month: "2024-10", messages: 44, sessions: 12 },
      { month: "2024-11", messages: 51, sessions: 16 },
      { month: "2024-12", messages: 39, sessions: 11 }
    ],
    popularTopics: [
      { topic: "Propulsion Systems", mentions: 15 },
      { topic: "Space Weather", mentions: 12 },
      { topic: "Life Support Systems", mentions: 10 },
      { topic: "Quantum Computing", mentions: 8 },
      { topic: "Materials Science", mentions: 7 },
      { topic: "Robotics", mentions: 6 },
      { topic: "Bioastronautics", mentions: 5 },
      { topic: "Astrophysics", mentions: 4 },
      { topic: "Space Debris", mentions: 3 },
      { topic: "Communications", mentions: 2 }
    ]
  },
  insights: {
    researchGaps: [
      { area: "Space Debris", publicationCount: 1 },
      { area: "Communications", publicationCount: 1 },
      { area: "ISRU", publicationCount: 1 },
      { area: "Thermal Systems", publicationCount: 1 }
    ],
    trends: {
      growingAreas: ["Propulsion Systems", "Space Weather", "Life Support Systems"],
      underResearched: ["Space Debris", "Communications", "ISRU", "Thermal Systems", "Bioastronautics"]
    }
  }
};

// Publications API
api.get('/publications', async (c) => {
  try {
    const search = c.req.query('search') || '';
    const researchArea = c.req.query('researchArea') || '';
    const yearFrom = c.req.query('yearFrom') || '';
    const yearTo = c.req.query('yearTo') || '';
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '12');
    const offset = (page - 1) * limit;

    // Filter mock data
    let filteredPublications = [...mockPublications];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPublications = filteredPublications.filter(pub => 
        pub.title.toLowerCase().includes(searchLower) ||
        pub.abstract.toLowerCase().includes(searchLower) ||
        pub.authors.toLowerCase().includes(searchLower) ||
        pub.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
      );
    }

    if (researchArea) {
      filteredPublications = filteredPublications.filter(pub => 
        pub.research_area.toLowerCase() === researchArea.toLowerCase()
      );
    }

    if (yearFrom) {
      filteredPublications = filteredPublications.filter(pub => 
        pub.publication_year >= parseInt(yearFrom)
      );
    }

    if (yearTo) {
      filteredPublications = filteredPublications.filter(pub => 
        pub.publication_year <= parseInt(yearTo)
      );
    }

    // Sort by year and date
    filteredPublications.sort((a, b) => {
      if (b.publication_year !== a.publication_year) {
        return b.publication_year - a.publication_year;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const total = filteredPublications.length;
    const paginatedPublications = filteredPublications.slice(offset, offset + limit);

    // Get year range
    const years = mockPublications.map(p => p.publication_year);
    const yearRange = {
      min_year: Math.min(...years),
      max_year: Math.max(...years)
    };

    return c.json({
      publications: paginatedPublications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        researchAreas: mockResearchAreas,
        yearRange
      }
    });

    } catch (error) {
    console.error('Error fetching publications:', error);
    return c.json({ error: 'Failed to fetch publications' }, 500);
  }
});

// Analytics API
api.get('/analytics', async (c) => {
  try {
    // Simulate a small delay to mimic real API behavior
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return c.json(mockAnalytics);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

export { api, API_BASENAME };

// Dev-only proxy routes to align with src/app API routes
// This resolves 405 for /api/chat during dev by wiring Hono to the route modules
api.post('/chat', async (c) => {
	try {
		const { message, sessionId, mode = 'student' } = await c.req.json();
		if (!message || !sessionId) {
			return c.json({ error: 'Message and session ID are required' }, 400);
		}

		const limit = 5;
		// NASA Images API
		const images = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(message)}&media_type=image`)
			.then(r => r.ok ? r.json() : Promise.reject(new Error('images')))
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
						abstract: data?.description || (Array.isArray(data?.keywords) ? data.keywords.join(', ') : ''),
						results: null,
						conclusion: null,
						nasa_publication_id: data?.nasa_id || null,
						research_area: Array.isArray(data?.keywords) ? data.keywords.join(', ') : null,
						keywords: Array.isArray(data?.keywords) ? data.keywords : [],
						url: originalLink || (data?.nasa_id ? `https://images.nasa.gov/details-${data.nasa_id}` : null)
					};
				});
			})
			.catch(() => []);

		// NASA TechPort API (optional)
		const techportKey = (globalThis as any).process?.env?.NASA_API_KEY;
		const techport = techportKey
			? await fetch(`https://api.nasa.gov/techport/api/projects/search?searchQuery=${encodeURIComponent(message)}&api_key=${techportKey}`)
					.then(r => r.ok ? r.json() : Promise.reject(new Error('techport')))
					.then(json => {
						const projects = Array.isArray(json?.projects?.projects) ? json.projects.projects : [];
						return projects.slice(0, limit).map((p: any) => ({
							id: `techport-${p.id}`,
							title: p.title,
							authors: null,
							publication_year: p.startYear ? Number(p.startYear) : null,
							abstract: p.description,
							results: null,
							conclusion: null,
							nasa_publication_id: String(p.id),
							research_area: Array.isArray(p.primaryTaxonomyNodes) ? p.primaryTaxonomyNodes.map((t: any) => t.title).join(', ') : null,
							keywords: [],
							url: `https://techport.nasa.gov/view/${p.id}`
						}));
					})
					.catch(() => [])
			: [];

		let combined = [...images, ...techport];
		if (combined.length === 0) {
			try {
				const search = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(message)}&limit=1&namespace=0&format=json`).then(r => r.ok ? r.json() : Promise.reject());
				const title = Array.isArray(search) && search[1]?.[0];
				if (title) {
					const summary = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`).then(r => r.ok ? r.json() : Promise.reject());
					combined = [{
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
				}
			} catch {}
		}
		const seen = new Set<string>();
		const unique = combined.filter((p) => {
			const key = p.nasa_publication_id || p.title;
			if (!key || seen.has(key)) return false;
			seen.add(key);
			return true;
		}).slice(0, limit);

		let responseText: string;
		if (unique.length === 0) {
			responseText = `I couldn't find NASA sources matching "${message}" right now. Try rephrasing or broadening your query.`;
		} else {
			const maxAbs = mode === 'scientist' ? 420 : mode === 'student' ? 180 : 240;
			const bullets = unique.map((p, i) => {
				const year = p.publication_year ? ` (${p.publication_year})` : '';
				const nasaId = p.nasa_publication_id ? ` [${p.nasa_publication_id}]` : '';
				const url = p.url ? `\nLink: ${p.url}` : '';
				const abstract = p.abstract ? `\nSummary: ${String(p.abstract).slice(0, maxAbs)}${String(p.abstract).length > maxAbs ? '…' : ''}` : '';
				return `${i + 1}. ${p.title}${year}${nasaId}${abstract}${url}`;
			}).join('\n\n');
			if (mode === 'scientist') {
				responseText = `Technical summary for "${message}":\n\n${bullets}\n\nI can cross-compare methodologies, extract metrics, or suggest analyses.`;
			} else if (mode === 'student') {
				responseText = `In simple terms, here are NASA resources about "${message}":\n\n${bullets}\n\nTell me if you want a kid-friendly explanation or pictures.`;
			} else {
				responseText = `Executive summary for "${message}":\n\n${bullets}\n\nAsk for key takeaways or a short brief you can share.`;
			}
		}

		return c.json({
			response: responseText,
			sources: unique,
			suggestions: unique.length ? ['Show me related studies','Compare findings across years','Open the first link'] : ['Try rephrasing','Ask a broader topic']
		});
	} catch (err) {
		console.error('Dev /api/chat error', err);
		return c.json({ error: 'Failed to process chat message' }, 500);
	}
});

// GET fallback for dev (allows calling /api/chat?message=...)
api.get('/chat', async (c) => {
	const message = c.req.query('message') || '';
	const sessionId = c.req.query('sessionId') || `session_${Date.now()}`;
	const mode = c.req.query('mode') || 'student';
	if (!message) return c.json({ error: 'Message is required' }, 400);
	// Reuse the POST logic by calling the handler above
	const res = await api.request(`/chat`, { method: 'POST', body: JSON.stringify({ message, sessionId, mode }) });
	const json = await res.json();
	return c.json(json, res.status);
});

api.get('/chat/history', async (c) => {
	try {
		const url = new URL(c.req.url);
		const mod = await import('../src/app/api/chat/history/route.js');
		const req = new Request(url, { method: 'GET' });
		const res: Response = await mod.GET(req);
		const json = await res.json();
		return c.json(json, res.status);
	} catch (err) {
		console.error('Dev proxy /api/chat/history failed:', err);
		return c.json({ error: 'Failed to fetch history' }, 500);
	}
});

api.get('/chat/sessions', async (c) => {
	try {
		const url = new URL(c.req.url);
		const mod = await import('../src/app/api/chat/sessions/route.js');
		const req = new Request(url, { method: 'GET' });
		const res: Response = await mod.GET(req);
		const json = await res.json();
		return c.json(json, res.status);
	} catch (err) {
		console.error('Dev proxy /api/chat/sessions failed:', err);
		return c.json({ error: 'Failed to fetch sessions' }, 500);
	}
});
