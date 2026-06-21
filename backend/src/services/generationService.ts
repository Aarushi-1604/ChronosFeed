import fs from 'fs';
import path from 'path';
import { supabase } from '../lib/supabase';
import { callGemini } from '../services/geminiService';
import { World, Event, Persona, Post } from '../types/database';

// ============================================================
// REALITY MODE TYPES
// ============================================================
type RealityMode = 'anchored' | 'ripple' | 'chaos';

const MODE_PREFIX_REGEX = /^\[Mode:\s*(anchored|ripple|chaos)\]\s*/i;

/**
 * Parses a reality mode prefix from the prompt string.
 * Returns the mode and the clean user prompt.
 */
export function parseModeFromPrompt(fullPrompt: string): { mode: RealityMode; userPrompt: string } {
    const match = fullPrompt.match(MODE_PREFIX_REGEX);
    if (match) {
        const mode = match[1].toLowerCase() as RealityMode;
        const userPrompt = fullPrompt.replace(MODE_PREFIX_REGEX, '').trim();
        return { mode, userPrompt };
    }
    return { mode: 'anchored', userPrompt: fullPrompt.trim() };
}

/**
 * Returns mode-specific reality instruction block to inject into prompts.
 */
function getModeInstructions(mode: RealityMode): string {
    switch (mode) {
        case 'anchored':
            return `REALITY MODE: ANCHORED
You are operating in strict Reality-Anchored Mode.
- ONLY the specific person/event/change named in the prompt is altered.
- ALL other real-world entities remain EXACTLY as they are in reality: real governments function normally, real news channels still exist, real institutions (UN, NATO, Parliament, Congress, Supreme Court) operate as they do today.
- Real-world figures NOT named in the prompt retain their real-world roles and personalities.
- Reference real current events, real geography, real technologies.
- Example: If Modi becomes China's President, Xi Jinping is displaced but the CCP structure remains. India still has its Parliament. BBC, CNN, NDTV still exist.`;

        case 'ripple':
            return `REALITY MODE: RIPPLE
You are operating in Ripple Mode.
- The divergence prompt is the starting point, but its consequences spread outward to affect related real-world entities.
- Real institutions and figures that would logically be affected by the divergence should show measurable changes.
- Unrelated regions, industries, and figures remain unchanged.
- Think in terms of cause-and-effect chains: who would be destabilized, who would benefit, what alliances would shift?
- Example: If Modi becomes China's President, India-China trade agreements transform, Pakistan's geopolitical strategy shifts, the US State Department issues new advisories.`;

        case 'chaos':
            return `REALITY MODE: CHAOS
You are operating in Chaos Mode.
- The divergence has cascading, unpredictable effects across the entire world.
- Multiple real-world power structures are disrupted simultaneously.
- Unexpected alliances form. Historical trajectories accelerate or reverse dramatically.
- Creative freedom is high, but all changes must follow internal logic.
- Reference real institutions and figures, but their behavior can be radically altered.
- This mode explores maximum butterfly-effect consequences of the divergence.`;
    }
}

// ============================================================
// POLLINATIONS.AI IMAGE URL BUILDER
// ============================================================
/**
 * Converts an image prompt string into a Pollinations.ai image URL.
 * Returns null if the prompt is empty or invalid.
 */
export function buildPollinationsUrl(imagePrompt: string, width = 600, height = 400): string | null {
    if (!imagePrompt || imagePrompt.trim().length < 10) return null;
    const encoded = encodeURIComponent(imagePrompt.trim());
    return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&enhance=true`;
}

// ============================================================
// FALLBACK IMAGE URLS (Unsplash keyword-based)
// ============================================================
function getMediaUrlForContent(content: string): string | null {
    const text = content.toLowerCase();
    
    let ids = [
        'photo-1585320806297-9794b3e4eeae', // vintage paper
        'photo-1473163928189-364b2c4e1135', // old street
        'photo-1501504905252-473c47e087f8', // writing desk
        'photo-1513542789411-b6a5d4f31634', // map
        'photo-1478147427282-58a87a120781', // antique scale
        'photo-1512820790803-83ca734da794', // old books
    ];
    
    if (text.includes('rome') || text.includes('caesar') || text.includes('senat') || text.includes('empire')) {
        ids = ['photo-1552832230-c0197dd311b5', 'photo-1515003844-640a32066fa9'];
    } else if (text.includes('steam') || text.includes('babbage') || text.includes('engine') || text.includes('gear') || text.includes('telegraph')) {
        ids = ['photo-1508962914676-134849a727f0', 'photo-1580137189272-c9379f8864fd'];
    } else if (text.includes('mars') || text.includes('space') || text.includes('planet') || text.includes('rocket') || text.includes('orbit') || text.includes('moon')) {
        ids = ['photo-1614728894747-a83421e2b9c9', 'photo-1451187580459-43490279c0fa'];
    } else if (text.includes('modi') || text.includes('india') || text.includes('delhi') || text.includes('trump') || text.includes('china') || text.includes('president') || text.includes('beijing')) {
        ids = ['photo-1548013146-72479768bada', 'photo-1508009603885-50cf7c579365', 'photo-1529655683826-09574890a537'];
    } else if (text.includes('egypt') || text.includes('alexandria') || text.includes('library') || text.includes('greece') || text.includes('philosopher')) {
        ids = ['photo-1507842217343-583bb7270b66', 'photo-1564507592333-c60657eea523'];
    } else if (text.includes('napoleon') || text.includes('french') || text.includes('waterloo') || text.includes('battle') || text.includes('soldier')) {
        ids = ['photo-1508849789987-4e5333c12b78', 'photo-1473163928189-364b2c4e1135'];
    } else if (text.includes('einstein') || text.includes('quantum') || text.includes('physics') || text.includes('science') || text.includes('laboratory')) {
        ids = ['photo-1507668077129-56e32842fceb'];
    } else if (text.includes('tesla') || text.includes('electricity') || text.includes('energy') || text.includes('power')) {
        ids = ['photo-1485827404703-89b55fcc595e'];
    } else if (text.includes('cold war') || text.includes('soviet') || text.includes('russia') || text.includes('moscow') || text.includes('communis')) {
        ids = ['photo-1513542789411-b6a5d4f31634', 'photo-1508962914676-134849a727f0'];
    } else if (text.includes('japan') || text.includes('tokyo') || text.includes('samurai') || text.includes('shogun') || text.includes('meiji')) {
        ids = ['photo-1528360983277-13d401cdc186', 'photo-1540959733332-eab4deabeeaf'];
    } else if (text.includes('africa') || text.includes('kenya') || text.includes('nigeria') || text.includes('mandela') || text.includes('coloniali')) {
        ids = ['photo-1516026672322-bc52d61a55d5', 'photo-1489392191049-fc10c97e64b6'];
    } else if (text.includes('ai') || text.includes('robot') || text.includes('tech') || text.includes('digital') || text.includes('silicon')) {
        ids = ['photo-1485827404703-89b55fcc595e', 'photo-1535378917042-10a22c95931a'];
    }
    
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    return `https://images.unsplash.com/${randomId}?auto=format&fit=crop&w=600&q=80`;
}

function getAdImageUrl(companyName: string, tagline: string): string {
    const text = (companyName + ' ' + tagline).toLowerCase();
    let ids = [
        'photo-1501504905252-473c47e087f8',
        'photo-1513542789411-b6a5d4f31634',
        'photo-1585320806297-9794b3e4eeae',
    ];
    if (text.includes('tech') || text.includes('digital') || text.includes('ai') || text.includes('app')) {
        ids = ['photo-1485827404703-89b55fcc595e', 'photo-1535378917042-10a22c95931a'];
    } else if (text.includes('travel') || text.includes('tour') || text.includes('cruise') || text.includes('airship')) {
        ids = ['photo-1488085061387-422e29b40080', 'photo-1569949381669-ecf31ae8e613'];
    } else if (text.includes('food') || text.includes('tea') || text.includes('drink') || text.includes('tonic')) {
        ids = ['photo-1546069901-ba9599a7e63c', 'photo-1482049016688-2d3e1b311543'];
    }
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    return `https://images.unsplash.com/${randomId}?auto=format&fit=crop&w=600&q=80`;
}


// ============================================================
// PROMPT BUILDERS
// ============================================================

export function buildWorldGenesisPrompt(userPrompt: string, mode: RealityMode): string {
    try {
        const filePath = path.join(process.cwd(), '..', 'ai-lab', 'prompts', 'world_genesis.txt');
        const template = fs.readFileSync(filePath, 'utf8');
        return template
            .split('{{USER_PROMPT}}').join(userPrompt)
            .split('{{REALITY_MODE_INSTRUCTIONS}}').join(getModeInstructions(mode));
    } catch (error) {
        return (
            `${getModeInstructions(mode)}\n\nGenerate a JSON object for an alternate history world based on: ` +
            userPrompt +
            '. Return ONLY valid JSON with keys: name, summary, era, tech_level, gov_type, divergence, reality_anchors, events.' +
            ' events is an array of 6 objects each with: year, title, description, impact.'
        );
    }
}

export function buildPersonaPrompt(worldContext: string): string {
    try {
        const filePath = path.join(process.cwd(), '..', 'ai-lab', 'prompts', 'persona.txt');
        const template = fs.readFileSync(filePath, 'utf8');
        return template.split('{{WORLD_CONTEXT}}').join(worldContext);
    } catch (error) {
        return (
            'Generate a JSON array of 6 unique social media personas for this alternate history world: ' +
            worldContext +
            '. Return ONLY a valid JSON array. Each object must have: name, handle, bio, role' +
            ' (one of INFLUENCER/SCIENTIST/POLITICIAN/BRAND), followers_count, following_count,' +
            ' influence_score (1-100), interests (string array), personality.'
        );
    }
}

export function buildPostPrompt(worldContext: string, personaHandles: string[]): string {
    try {
        const filePath = path.join(process.cwd(), '..', 'ai-lab', 'prompts', 'post.txt');
        const template = fs.readFileSync(filePath, 'utf8');
        let completed = template.split('{{WORLD_CONTEXT}}').join(worldContext);
        completed = completed.split('{{PERSONA_HANDLES}}').join(personaHandles.join(', '));
        return completed;
    } catch (error) {
        return (
            'Generate a JSON array of 12 social media posts for this alternate history world: ' +
            worldContext +
            '. The available persona handles are: ' +
            personaHandles.join(', ') +
            '. Return ONLY a valid JSON array. Each object must have: handle, content, media_type (TEXT or IMAGE),' +
            ' likes_count (number), reposts_count (number), image_prompt (string).'
        );
    }
}

export function buildNewsPrompt(worldContext: string): string {
    try {
        const filePath = path.join(process.cwd(), '..', 'ai-lab', 'prompts', 'news.txt');
        const template = fs.readFileSync(filePath, 'utf8');
        return template.split('{{WORLD_CONTEXT}}').join(worldContext);
    } catch (error) {
        return (
            'Generate a JSON array of 6 news articles for this alternate history world: ' +
            worldContext +
            '. Return ONLY a valid JSON array. Each object must have: title, content,' +
            ' category (one of POLITICS/SCIENCE/BUSINESS/CULTURE/TECHNOLOGY), publisher, image_prompt.'
        );
    }
}

export function buildAdsPrompt(worldContext: string): string {
    try {
        const filePath = path.join(process.cwd(), '..', 'ai-lab', 'prompts', 'ads.txt');
        const template = fs.readFileSync(filePath, 'utf8');
        return template.split('{{WORLD_CONTEXT}}').join(worldContext);
    } catch (error) {
        return (
            'Generate a JSON array of 4 advertisements for this alternate history world: ' +
            worldContext +
            '. Return ONLY a valid JSON array. Each object must have: company_name,' +
            ' tagline, description, price, image_prompt.'
        );
    }
}

export function buildCommentPrompt(
    worldContext: string,
    postContent: string,
    postAuthorHandle: string,
    personaHandles: string[]
): string {
    try {
        const filePath = path.join(process.cwd(), '..', 'ai-lab', 'prompts', 'comment.txt');
        const template = fs.readFileSync(filePath, 'utf8');
        let completed = template.split('{{WORLD_CONTEXT}}').join(worldContext);
        completed = completed.split('{{POST_CONTENT}}').join(postContent);
        completed = completed.split('{{POST_AUTHOR_HANDLE}}').join(postAuthorHandle);
        completed = completed.split('{{PERSONA_HANDLES}}').join(
            personaHandles.filter(h => h !== postAuthorHandle).join(', ')
        );
        return completed;
    } catch (error) {
        return (
            'Generate a JSON array of 3 comments for this post in an alternate history world. ' +
            'World: ' + worldContext + '. Post: ' + postContent + '. ' +
            'Return ONLY a JSON array. Each object must have: handle (from: ' +
            personaHandles.filter(h => h !== postAuthorHandle).join(', ') + '), ' +
            'content (2-3 sentences), likes_count (integer 10-50000).'
        );
    }
}

// ============================================================
// MAIN GENERATION PIPELINE
// ============================================================

export async function generateWorld(worldId: string, fullPrompt: string): Promise<void> {
    // Parse reality mode prefix from prompt
    const { mode, userPrompt } = parseModeFromPrompt(fullPrompt);
    console.log(`[Generation] Mode: ${mode} | Prompt: "${userPrompt}"`);

    try {
        // ==========================================
        // Step 1 — Generate world data
        // ==========================================
        const worldGenesisPrompt = buildWorldGenesisPrompt(userPrompt, mode);
        const worldResultRaw = await callGemini(worldGenesisPrompt, worldId);

        const worldResult = worldResultRaw as {
            name: string;
            summary: string;
            era: string;
            tech_level: string;
            gov_type: string;
            divergence?: string;
            reality_anchors?: string[];
            events: Array<{
                year: string;
                title: string;
                description: string;
                impact: string;
            }>;
        };

        if (!worldResult || typeof worldResult !== 'object') {
            throw new Error('Invalid response from Gemini for world genesis: expected an object.');
        }

        const { error: updateWorldError } = await supabase
            .from('worlds')
            .update({
                name: worldResult.name,
                summary: worldResult.summary,
                era: worldResult.era,
                tech_level: worldResult.tech_level,
                gov_type: worldResult.gov_type,
            })
            .eq('id', worldId);

        if (updateWorldError) {
            throw new Error(`Failed to update world record: ${updateWorldError.message}`);
        }

        if (Array.isArray(worldResult.events) && worldResult.events.length > 0) {
            const eventsToInsert = worldResult.events.map(event => ({
                world_id: worldId,
                year: event.year,
                title: event.title,
                description: event.description,
                impact: event.impact,
            }));

            const { error: insertEventsError } = await supabase
                .from('events')
                .insert(eventsToInsert);

            if (insertEventsError) {
                throw new Error(`Failed to insert events: ${insertEventsError.message}`);
            }
        }

        // Build rich world context for downstream prompts
        const realityAnchors = Array.isArray(worldResult.reality_anchors) 
            ? worldResult.reality_anchors.join(', ') 
            : '';
        const worldContext = [
            `World: ${worldResult.name}`,
            `Era: ${worldResult.era}`,
            `Prompt: ${userPrompt}`,
            `Mode: ${mode}`,
            worldResult.divergence ? `Divergence: ${worldResult.divergence}` : '',
            realityAnchors ? `Reality Anchors (unchanged): ${realityAnchors}` : '',
        ].filter(Boolean).join(' | ');

        // ==========================================
        // Step 2 — Generate personas
        // ==========================================
        const personaPrompt = buildPersonaPrompt(worldContext);
        const personaResultRaw = await callGemini(personaPrompt, worldId);

        if (!Array.isArray(personaResultRaw)) {
            throw new Error('Invalid response from Gemini for personas: expected an array.');
        }

        const personaResult = personaResultRaw as Array<{
            name: string;
            handle: string;
            bio: string;
            role: any;
            followers_count: number;
            following_count: number;
            influence_score: number;
            interests: string[];
            personality: string;
        }>;

        const personasToInsert = personaResult.map(p => ({
            world_id: worldId,
            name: p.name,
            handle: p.handle,
            avatar: '',
            bio: p.bio,
            role: p.role,
            followers_count: p.followers_count,
            following_count: p.following_count,
            influence_score: p.influence_score,
            interests: p.interests || [],
            personality: p.personality,
        }));

        const { data: insertedPersonas, error: insertPersonasError } = await supabase
            .from('personas')
            .insert(personasToInsert)
            .select();

        if (insertPersonasError) {
            throw new Error(`Failed to insert personas: ${insertPersonasError.message}`);
        }

        if (!insertedPersonas || insertedPersonas.length === 0) {
            throw new Error('Failed to retrieve inserted personas.');
        }

        const personasList = insertedPersonas as Persona[];

        // ==========================================
        // Step 3 — Generate posts
        // ==========================================
        let insertedPostsForComments: any[] | null = null;
        try {
            const personaHandles = personasList.map(p => p.handle);
            const postPrompt = buildPostPrompt(worldContext, personaHandles);
            const postResultRaw = await callGemini(postPrompt, worldId);

            if (!Array.isArray(postResultRaw)) {
                throw new Error('Invalid response from Gemini for posts: expected an array.');
            }

            const postResult = postResultRaw as Array<{
                handle: string;
                content: string;
                media_type: any;
                likes_count: number;
                reposts_count: number;
                image_prompt?: string;
            }>;

            const handleToIdMap = new Map<string, string>();
            personasList.forEach(p => {
                handleToIdMap.set(p.handle, p.id);
            });

            const postsToInsert = postResult
                .map(post => {
                    const personaId = handleToIdMap.get(post.handle);
                    if (!personaId) {
                        console.warn(`Handle '${post.handle}' not found in persona map. Skipping post.`);
                        return null;
                    }
                    
                    // Try Pollinations.ai first, fall back to Unsplash keyword matching
                    let mediaUrl: string | null = null;
                    if (post.media_type === 'IMAGE' || (post.image_prompt && post.image_prompt.length > 10)) {
                        mediaUrl = buildPollinationsUrl(post.image_prompt || post.content, 600, 400)
                            || getMediaUrlForContent(post.content);
                    } else if (Math.random() < 0.7) {
                        mediaUrl = getMediaUrlForContent(post.content);
                    }
                    
                    return {
                        world_id: worldId,
                        persona_id: personaId,
                        content: post.content,
                        media_url: mediaUrl,
                        media_type: mediaUrl ? 'IMAGE' : 'TEXT',
                        likes_count: post.likes_count,
                        reposts_count: post.reposts_count,
                    };
                })
                .filter((post): post is Exclude<typeof post, null> => post !== null);

            let insertedPosts: any[] | null = null;

            if (postsToInsert.length > 0) {
                const { data: postsData, error: insertPostsError } = await supabase
                    .from('posts')
                    .insert(postsToInsert)
                    .select();

                if (insertPostsError) {
                    throw new Error(`Failed to insert posts: ${insertPostsError.message}`);
                }

                insertedPosts = postsData;
            }
            insertedPostsForComments = insertedPosts;
        } catch (postError: any) {
            console.error('Step 3 (Post Generation) failed:', postError.message);
        }

        // ==========================================
        // Step 3b — Generate news
        // ==========================================
        try {
            const newsPrompt = buildNewsPrompt(worldContext);
            const newsResultRaw = await callGemini(newsPrompt, worldId);

            if (!Array.isArray(newsResultRaw)) {
                console.warn('Invalid response from Gemini for news: expected an array.');
            } else {
                const newsResult = newsResultRaw as Array<{
                    title: string;
                    content: string;
                    category: string;
                    publisher: string;
                    image_prompt?: string;
                }>;

                const validCategories = ['POLITICS', 'SCIENCE', 'BUSINESS', 'CULTURE', 'TECHNOLOGY'];

                const newsToInsert = newsResult.map(item => {
                    const category = validCategories.includes(String(item.category).toUpperCase())
                        ? String(item.category).toUpperCase()
                        : 'CULTURE';

                    // Try Pollinations.ai first for news images
                    const imageUrl = buildPollinationsUrl(item.image_prompt || item.title, 600, 350)
                        || getMediaUrlForContent(item.title + ' ' + item.content);

                    return {
                        world_id: worldId,
                        title: item.title,
                        content: item.content,
                        category: category,
                        publisher: item.publisher,
                        image_url: imageUrl,
                    };
                });

                if (newsToInsert.length > 0) {
                    const { error: insertNewsError } = await supabase
                        .from('news')
                        .insert(newsToInsert);

                    if (insertNewsError) {
                        // If image_url column doesn't exist, retry without it
                        console.warn(`News insert failed (${insertNewsError.message}), retrying without image_url...`);
                        const newsWithoutImages = newsToInsert.map(({ image_url, ...rest }) => rest);
                        const { error: retryError } = await supabase
                            .from('news')
                            .insert(newsWithoutImages);
                        if (retryError) {
                            throw new Error(`Failed to insert news: ${retryError.message}`);
                        }
                    }
                }
            }
        } catch (newsError: any) {
            console.error('Step 3b (News Generation) failed:', newsError.message);
        }

        // ==========================================
        // Step 3c — Generate ads
        // ==========================================
        try {
            const adsPrompt = buildAdsPrompt(worldContext);
            const adsResultRaw = await callGemini(adsPrompt, worldId);

            if (!Array.isArray(adsResultRaw)) {
                console.warn('Invalid response from Gemini for ads: expected an array.');
            } else {
                const adsResult = adsResultRaw as Array<{
                    company_name: string;
                    tagline: string;
                    description: string;
                    price: string;
                    image_prompt?: string;
                }>;

                const adsToInsert = adsResult.map(item => ({
                    world_id: worldId,
                    company_name: item.company_name,
                    tagline: item.tagline,
                    description: item.description,
                    price: item.price,
                    image_url: buildPollinationsUrl(item.image_prompt || `${item.company_name} ${item.tagline}`, 600, 350)
                        || getAdImageUrl(item.company_name, item.tagline),
                }));

                if (adsToInsert.length > 0) {
                    const { error: insertAdsError } = await supabase
                        .from('ads')
                        .insert(adsToInsert);

                    if (insertAdsError) {
                        throw new Error(`Failed to insert ads: ${insertAdsError.message}`);
                    }
                }
            }
        } catch (adsError: any) {
            console.error('Step 3c (Ads Generation) failed:', adsError.message);
        }

        // ==========================================
        // Step 3d — Generate comments
        // ==========================================
        try {
            const insertedPosts: any[] | null = insertedPostsForComments;

            if (insertedPosts && insertedPosts.length > 0) {
                const handleToPersonaId = new Map<string, string>();
                personasList.forEach(p => {
                    handleToPersonaId.set(p.handle, p.id);
                });

                const postIdToHandle = new Map<string, string>();
                insertedPosts.forEach(post => {
                    const persona = personasList.find(p => p.id === post.persona_id);
                    if (persona) {
                        postIdToHandle.set(post.id, persona.handle);
                    }
                });

                const personaHandles = personasList.map(p => p.handle);
                const postsToComment = insertedPosts.slice(0, 5);

                for (let i = 0; i < postsToComment.length; i++) {
                    const post = postsToComment[i];

                    if (i > 0) {
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    }

                    const authorHandle = postIdToHandle.get(post.id);
                    if (!authorHandle) {
                        console.warn(`Could not find author handle for post ${post.id}. Skipping.`);
                        continue;
                    }

                    const commentPrompt = buildCommentPrompt(worldContext, post.content, authorHandle, personaHandles);
                    const commentResultRaw = await callGemini(commentPrompt, worldId);

                    if (!Array.isArray(commentResultRaw)) {
                        console.warn(`Invalid response from Gemini for comments on post ${post.id}: expected an array.`);
                        continue;
                    }

                    const commentResult = commentResultRaw as Array<{
                        handle: string;
                        content: string;
                        likes_count: number;
                    }>;

                    for (const comment of commentResult) {
                        const commenterId = handleToPersonaId.get(comment.handle);
                        if (!commenterId) {
                            continue;
                        }

                        const { error: insertCommentError } = await supabase
                            .from('comments')
                            .insert({
                                post_id: post.id,
                                persona_id: commenterId,
                                content: comment.content,
                                likes_count: comment.likes_count,
                            });

                        if (insertCommentError) {
                            console.warn(`Failed to insert comment for post ${post.id}: ${insertCommentError.message}`);
                        }
                    }

                    console.log('Comments generated for post ' + post.id);
                }
            } else {
                console.log('Step 3d: No inserted posts available. Skipping comment generation.');
            }
        } catch (commentError: any) {
            console.error('Step 3d (Comment Generation) failed:', commentError.message);
        }

        // ==========================================
        // Step 4 — Mark world as ready
        // ==========================================
        const { error: markReadyError } = await supabase
            .from('worlds')
            .update({ status: 'ready' })
            .eq('id', worldId);

        if (markReadyError) {
            throw new Error(`Failed to mark world as ready: ${markReadyError.message}`);
        }

        console.log('World generation complete for worldId: ' + worldId);

    } catch (error: any) {
        console.error('Fatal error during world generation:', error.message);
        try {
            await supabase
                .from('worlds')
                .update({ status: 'failed' })
                .eq('id', worldId);
        } catch (dbError: any) {
            console.error('Failed to update world status to failed:', dbError.message);
        }
    }
}

export async function generateOperatorPersona(
    worldId: string,
    worldPrompt: string,
    era: string,
    techLevel: string,
    govType: string,
    role: string
): Promise<{ name: string; handle: string; bio: string; custom_stat_label: string; custom_stat_value: number }> {
    try {
        const filePath = path.join(process.cwd(), '..', 'ai-lab', 'prompts', 'operator_persona.txt');
        const template = fs.readFileSync(filePath, 'utf8');
        let prompt = template.split('{{WORLD_PROMPT}}').join(worldPrompt);
        prompt = prompt.split('{{WORLD_ERA}}').join(era);
        prompt = prompt.split('{{WORLD_TECH}}').join(techLevel);
        prompt = prompt.split('{{WORLD_GOV}}').join(govType);
        prompt = prompt.split('{{OPERATOR_ROLE}}').join(role);

        const resultRaw = await callGemini(prompt, worldId);
        return resultRaw as { name: string; handle: string; bio: string; custom_stat_label: string; custom_stat_value: number };
    } catch (error) {
        console.error('Operator persona generation failed, using defaults:', error);
        const mockName = role === 'REBEL' ? 'Rebel Outlaw' : role === 'TECHNOLOGIST' ? 'Chief Mechanician' : role === 'IMPERIAL' ? 'Imperial Sentinel' : 'Ordinary Citizen';
        const mockHandle = role.toLowerCase() + '_agent';
        const mockBio = `I operate in this alternate reality as a ${role.toLowerCase()}. Compiling temporal dispatches for public records.`;
        const mockStatLabel = role === 'REBEL' ? 'Anarchy Quotient' : role === 'TECHNOLOGIST' ? 'Calculation Output' : role === 'IMPERIAL' ? 'Fealty Level' : 'Timeline Alignment';
        
        return {
            name: mockName,
            handle: mockHandle,
            bio: mockBio,
            custom_stat_label: mockStatLabel,
            custom_stat_value: 75
        };
    }
}

