require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../public'));

// MangaDex API Configuration
const MANGADEX_API = 'https://api.mangadex.org';
const CLIENT_ID = process.env.MANGADEX_CLIENT_ID;
const API_KEY = process.env.MANGADEX_API_KEY;

// Axios instance with auth
const mangadex = axios.create({
    baseURL: MANGADEX_API,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Client-ID': CLIENT_ID
    }
});

// API Routes
app.get('/api/manga/popular', async (req, res) => {
    try {
        // Fetch popular manga (sorted by rating)
        const response = await mangadex.get('/manga', {
            params: {
                limit: 20,
                order: { rating: 'desc' },
                contentRating: ['safe'],
                includes: ['cover_art']
            }
        });
        
        const mangaList = response.data.data.map(manga => {
            const attributes = manga.attributes;
            const title = attributes.title.en || 
                         attributes.title.ja || 
                         attributes.title.ko || 
                         Object.values(attributes.title)[0] || 'Untitled';
            
            // Get cover art
            let coverUrl = null;
            const coverArt = manga.relationships.find(r => r.type === 'cover_art');
            if (coverArt) {
                coverUrl = `${MANGADEX_API}/covers/${manga.id}/${coverArt.id}.512.jpg`;
            }
            
            // Get genres/tags
            const genres = attributes.tags
                .filter(tag => tag.attributes.group === 'genre')
                .map(tag => tag.attributes.name.en)
                .slice(0, 3);
            
            return {
                id: manga.id,
                title: title,
                description: attributes.description.en || '',
                rating: attributes.contentRating === 'safe' ? 'Safe' : 'Mature',
                genres: genres,
                coverUrl: coverUrl,
                status: attributes.status
            };
        });
        
        res.json(mangaList);
    } catch (error) {
        console.error('Error fetching popular manga:', error.message);
        res.status(500).json({ error: 'Failed to fetch manga' });
    }
});

app.get('/api/manga/:id/chapters', async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await mangadex.get(`/manga/${id}/feed`, {
            params: {
                limit: 50,
                translatedLanguage: ['en'],
                order: { chapter: 'desc' }
            }
        });
        
        const chapters = response.data.data.map(chapter => {
            const attributes = chapter.attributes;
            return {
                id: chapter.id,
                chapterNumber: attributes.chapter,
                title: attributes.title || `Chapter ${attributes.chapter}`,
                pages: attributes.pages
            };
        });
        
        res.json(chapters);
    } catch (error) {
        console.error('Error fetching chapters:', error.message);
        res.status(500).json({ error: 'Failed to fetch chapters' });
    }
});

app.get('/api/chapter/:id/pages', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get chapter data
        const chapterResponse = await mangadex.get(`/at-home/server/${id}`);
        const { baseUrl, chapter } = chapterResponse.data;
        
        // Construct page URLs
        const pages = chapter.data.map((page, index) => ({
            index: index,
            url: `${baseUrl}/data/${chapter.hash}/${page}`,
            width: chapter.dataSaver?.[index]?.width || 800,
            height: chapter.dataSaver?.[index]?.height || 1200
        }));
        
        res.json(pages);
    } catch (error) {
        console.error('Error fetching pages:', error.message);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.json([]);
        }
        
        const response = await mangadex.get('/manga', {
            params: {
                title: q,
                limit: 20,
                contentRating: ['safe'],
                includes: ['cover_art']
            }
        });
        
        const mangaList = response.data.data.map(manga => {
            const attributes = manga.attributes;
            const title = attributes.title.en || 
                         attributes.title.ja || 
                         Object.values(attributes.title)[0] || 'Untitled';
            
            let coverUrl = null;
            const coverArt = manga.relationships.find(r => r.type === 'cover_art');
            if (coverArt) {
                coverUrl = `${MANGADEX_API}/covers/${manga.id}/${coverArt.id}.512.jpg`;
            }
            
            return {
                id: manga.id,
                title: title,
                coverUrl: coverUrl,
                description: attributes.description.en?.substring(0, 100) + '...' || ''
            };
        });
        
        res.json(mangaList);
    } catch (error) {
        console.error('Error searching:', error.message);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve main page for all other routes
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '../public' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('MangaDex API configured:', CLIENT_ID ? 'Yes' : 'No');
}); 