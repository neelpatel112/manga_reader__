require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MangaDex API Configuration
const MANGADEX_API = 'https://api.mangadex.org';
const CLIENT_ID = process.env.MANGADEX_CLIENT_ID;
const API_KEY = process.env.MANGADEX_API_KEY;

console.log('API Config:', { 
    hasClientId: !!CLIENT_ID, 
    hasApiKey: !!API_KEY 
});

// Axios instance
const mangadex = axios.create({
    baseURL: MANGADEX_API,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Client-ID': CLIENT_ID
    }
});

// TEST ROUTE - Always works
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '✅ API is working!',
        clientId: CLIENT_ID ? 'Set ✅' : 'Not set ❌',
        apiKey: API_KEY ? 'Set ✅' : 'Not set ❌',
        timestamp: new Date().toISOString()
    });
});

// Popular manga
app.get('/api/manga/popular', async (req, res) => {
    try {
        console.log('Fetching popular manga...');
        const response = await mangadex.get('/manga', {
            params: {
                limit: 12,
                order: { rating: 'desc' },
                contentRating: ['safe'],
                includes: ['cover_art']
            }
        });
        
        const mangaList = response.data.data.map(manga => {
            const attributes = manga.attributes;
            const title = attributes.title.en || 
                         Object.values(attributes.title)[0] || 'Untitled';
            
            // Get cover
            let coverUrl = null;
            const coverArt = manga.relationships.find(r => r.type === 'cover_art');
            if (coverArt) {
                coverUrl = `${MANGADEX_API}/covers/${manga.id}/${coverArt.id}.256.jpg`;
            }
            
            return {
                id: manga.id,
                title: title,
                coverUrl: coverUrl || 'https://via.placeholder.com/200x280/667eea/ffffff?text=No+Cover',
                description: attributes.description.en?.substring(0, 100) || ''
            };
        });
        
        console.log(`Found ${mangaList.length} manga`);
        res.json(mangaList);
    } catch (error) {
        console.error('❌ Error fetching manga:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch manga',
            details: error.message 
        });
    }
});

// Chapters for a manga
app.get('/api/manga/:id/chapters', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching chapters for manga: ${id}`);
        
        const response = await mangadex.get(`/manga/${id}/feed`, {
            params: {
                limit: 10,
                translatedLanguage: ['en'],
                order: { chapter: 'asc' }
            }
        });
        
        const chapters = response.data.data.map(chapter => ({
            id: chapter.id,
            chapter: chapter.attributes.chapter,
            title: chapter.attributes.title || `Chapter ${chapter.attributes.chapter}`
        }));
        
        res.json(chapters);
    } catch (error) {
        console.error('❌ Error fetching chapters:', error.message);
        res.status(500).json({ error: 'Failed to fetch chapters' });
    }
});

// Pages for a chapter
app.get('/api/chapter/:id/pages', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching pages for chapter: ${id}`);
        
        const response = await mangadex.get(`/at-home/server/${id}`);
        const { baseUrl, chapter } = response.data;
        
        const pages = chapter.data.map((page, index) => ({
            page: index + 1,
            url: `${baseUrl}/data/${chapter.hash}/${page}`
        }));
        
        res.json(pages);
    } catch (error) {
        console.error('❌ Error fetching pages:', error.message);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

// Search manga
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        console.log(`Searching for: ${q}`);
        
        if (!q) return res.json([]);
        
        const response = await mangadex.get('/manga', {
            params: {
                title: q,
                limit: 10,
                contentRating: ['safe']
            }
        });
        
        const mangaList = response.data.data.map(manga => {
            const attributes = manga.attributes;
            const title = attributes.title.en || Object.values(attributes.title)[0] || 'Untitled';
            
            return {
                id: manga.id,
                title: title
            };
        });
        
        res.json(mangaList);
    } catch (error) {
        console.error('❌ Error searching:', error.message);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Export the app
module.exports = app; 