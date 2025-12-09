// Supabase Configuration
const SUPABASE_URL = 'https://ugygopzoogyvbviltxck.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVneWdvcHpvb2d5dmJ2aWx0eGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMjk3ODEsImV4cCI6MjA4MDgwNTc4MX0.GYZiMZJwIs5fcG84BOsbM7Tik5cpJQviuB-5wzO0mnE';

// Supabase Client Helper
const supabase = {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY,

    // Generic fetch helper
    async fetch(table, options = {}) {
        let url = `${SUPABASE_URL}/rest/v1/${table}`;
        const params = new URLSearchParams();

        if (options.select) params.append('select', options.select);
        if (options.order) params.append('order', options.order);
        if (options.limit) params.append('limit', options.limit);
        if (options.filter) {
            Object.entries(options.filter).forEach(([key, value]) => {
                params.append(key, value);
            });
        }

        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Error fetching ${table}`);
        return response.json();
    },

    // Insert data
    async insert(table, data) {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`Error inserting into ${table}`);
        return response.json();
    }
};
