import { World, HistoricalEvent, Persona, Post, News, Ad, Comment, PersonaRole, MediaType, NewsCategory, OperatorPersona, OperatorRole } from '../types';

interface WorldTemplate {
  id: string;
  name: string;
  prompt: string;
  summary: string;
  era: string;
  tech_level: string;
  gov_type: string;
  events: Array<{ year: string; title: string; desc: string; impact: string }>;
  personas: Array<{ name: string; handle: string; role: PersonaRole; bio: string; interests: string[]; personality: string }>;
  posts: Array<{ handle: string; content: string; media_type: MediaType; likes: number; reposts: number }>;
  news: Array<{ title: string; content: string; category: NewsCategory; publisher: string }>;
  ads: Array<{ company_name: string; tagline: string; description: string; price: string }>;
}

const TEMPLATES: WorldTemplate[] = [
  {
    id: 'stub-world-id',
    name: 'The Victorian Web',
    prompt: 'What if the internet was invented in 1890?',
    summary: 'Charles Babbage completes the Analytical Engine under Royal charter, launching steam computing 60 years ahead of schedule and connecting the British Empire via pneumatic telegraph networks.',
    era: 'Victorian Cyberpunk',
    tech_level: 'Mechanical steam computation, punch-card routers',
    gov_type: 'Corporatist Monarchy',
    events: [
      { year: '1890', title: 'Analytical Engine Finalized', desc: 'Babbage completes the prototype with funding from the British Crown.', impact: 'Socio-economic industrial scale computing goes online.' },
      { year: '1895', title: 'Net Expansion Act', desc: 'Parliament passes the Net Act, placing tubes and mechanical lines across the empire.', impact: 'Information corporations take structural control.' },
      { year: '1901', title: 'Pneumatic Mail Interconnect', desc: 'Major cities linked by high-pressure messaging capsules.', impact: 'Communication delay drops from weeks to minutes.' },
      { year: '1905', title: 'The Great Cog Strike', desc: 'Machinists strike in London, bringing down the steam mainframe grid.', impact: 'First ever industrial network blackout.' },
      { year: '1910', title: 'Automatic Calculation Bureau', desc: 'Establishment of state surveillance calculating offices.', impact: 'Civil census and records fully automated via punch-cards.' },
      { year: '1912', title: 'First Wireless Spark Gap Net', desc: 'Marconi demonstrates wireless text transmissions over the Atlantic.', impact: 'Decline of physical pneumatic lines.' }
    ],
    personas: [
      { name: 'Charles Babbage III', handle: 'steam_coder_99', role: 'SCIENTIST', bio: 'Chief Engineer at the Royal Calculation Office. Oiling gears and compiling punch cards.', interests: ['steam-logic', 'mechanics', 'royal-academy'], personality: 'Methodical and precise. Has no patience for manual division.' },
      { name: 'Lady Eleanor Sterling', handle: 'brass_nobility', role: 'POLITICIAN', bio: 'Member of Parliament. Advocate for nationalizing the coal-based packet networks.', interests: ['empire-legislation', 'coal-shares', 'high-society'], personality: 'Calculating, persuasive, fiercely loyal to the Crown.' },
      { name: 'Ada Lovelace Jr.', handle: 'analytical_genius', role: 'SCIENTIST', bio: 'Writing recursive mathematics for the mechanical loom. Loop enthusiast.', interests: ['algorithms', 'weaving-engines', 'music-synthesis'], personality: 'Visionary, easily excited by complex mathematics, coffee lover.' },
      { name: 'Captain Copperfield', handle: 'aeronaut_pioneer', role: 'INFLUENCER', bio: 'Sky-skimming aeronaut. Travel the Empire in the mechanical airship HMS Defiant.', interests: ['aviation', 'steam-valves', 'foreign-ports'], personality: 'Daring, charismatic, loves sharing photos of clouds from airships.' },
      { name: 'Babbage & Sons', handle: 'babbage_corp', role: 'BRAND', bio: 'Official providers of analytical cogs, valves, and premium punch cards.', interests: ['commerce', 'manufacturing', 'patents'], personality: 'Polite, industrial, commercialized.' },
      { name: 'The London Dispatch', handle: 'london_daily', role: 'INFLUENCER', bio: 'Your daily sheet of news, gossip, and stock prices from the Steam exchange.', interests: ['journalism', 'daily-records', 'scandal'], personality: 'Alert, sensationalist, quick to press.' }
    ],
    posts: [
      { handle: 'steam_coder_99', content: 'Just upgraded the central steam-router. Speed is now up to 10 punch-cards per minute! Mechanical computation has never felt so fast.', media_type: 'TEXT', likes: 420, reposts: 17 },
      { handle: 'analytical_genius', content: 'Developing a new compiler for the Mark IV Analytical Engine. Successfully executed a recursive Bernoulli numbers algorithm in under three minutes!', media_type: 'TEXT', likes: 852, reposts: 112 },
      { handle: 'brass_nobility', content: 'The Coal & Steam Grid Bill has passed the Commons. Private server owners must register their boilers with the Ministry of Fuel. Order must be maintained.', media_type: 'TEXT', likes: 310, reposts: 45 },
      { handle: 'aeronaut_pioneer', content: 'Aetheric signal quality is superb at 12,000 feet. Currently flying over Paris, drafting coordinates for the new transatlantic relay towers.', media_type: 'IMAGE', likes: 1205, reposts: 342 },
      { handle: 'babbage_corp', content: 'Announcing the new Brass-Coated Cogs (Grade A). Specially treated to prevent friction wear in high-rpm calculation cycles. Order your set today!', media_type: 'IMAGE', likes: 215, reposts: 14 },
      { handle: 'london_daily', content: 'BREAKING: Rumors of a mechanical logic virus spreading through the East India Company local grid. Several cogs reported frozen in infinity loops.', media_type: 'TEXT', likes: 984, reposts: 512 },
      { handle: 'steam_coder_99', content: 'Who left a grease pot on the main arithmetic unit? The division register is slipping, throwing division-by-zero errors in the tax ledger!', media_type: 'TEXT', likes: 340, reposts: 11 },
      { handle: 'analytical_genius', content: 'Can we agree that card-punchers who do not verify their parity holes are the absolute worst? Oiling paper fiber out of the reader is not my job.', media_type: 'TEXT', likes: 620, reposts: 88 },
      { handle: 'brass_nobility', content: 'National security demands all telegraphic streams be audited by the Royal Censors. Privacy is a luxury the empire cannot afford during economic rivalries.', media_type: 'TEXT', likes: 190, reposts: 39 },
      { handle: 'aeronaut_pioneer', content: 'Nothing beats the sound of steam rushing through the turbines as we soar towards Rome. The mechanical horizon is infinite.', media_type: 'IMAGE', likes: 1890, reposts: 210 },
      { handle: 'babbage_corp', content: 'Need custom punch-cards for your ledger calculations? Babbage & Sons offers premium linen cardstock resistant to humidity and ink smudges.', media_type: 'TEXT', likes: 140, reposts: 5 },
      { handle: 'london_daily', content: 'SOCIETY GOSSIP: Baroness Sterling spotted dining with the lead engineer of BabbageCorp. Are coal tariffs about to shift?', media_type: 'TEXT', likes: 740, reposts: 190 }
    ],
    news: [
      { title: 'Steam Parliament Passes Net Expansion Act', content: 'The Imperial Steam Parliament voted 312-88 to fund expansion of the Mechanical Net to all major colonies, sparking a surge in stock value for BabbageCo.', category: 'POLITICS', publisher: 'The London Gazette' },
      { title: 'Friction Anomaly Threatens London Core', content: 'Metropolitan fire brigades rushed to the Central Calculating Bureau today after friction heat ignited a paper dust pile inside the main arithmetic tower.', category: 'TECHNOLOGY', publisher: 'The Evening Chronos' },
      { title: 'Coal Prices Surge Amid Steam Grid Growth', content: 'Coal stocks hit record highs on the London Exchange as calculation servers demand thousands of tons of high-grade anthracite weekly.', category: 'BUSINESS', publisher: 'Imperial Trade Review' },
      { title: 'Pneumatic Tube Networks Reach Dublin', content: 'Dublin has officially joined the Imperial Pneumatic Ring. Correspondence can now reach London in under four minutes through deep-sea copper pipelines.', category: 'SCIENCE', publisher: 'The Scientific Observer' },
      { title: 'Socio-Mechanical Lectures Draw Crowds', content: 'Professor Ada Lovelace filled the Royal Lecture Hall yesterday, detailing the psychological impacts of constant telegraphic dispatches on the human mind.', category: 'CULTURE', publisher: 'The Athenaeum' },
      { title: 'Automated Census Declared Complete', content: 'The Home Office announced that the 1912 national census has been processed in just three weeks using mechanical card counters, proving engine efficiency.', category: 'POLITICS', publisher: 'The Daily Chronicle' }
    ],
    ads: [
      { company_name: 'BabbageCo Steam Solutions', tagline: 'Compute at the speed of steam.', description: 'Our Mark VII Analytical Coprocessor handles 500 mechanical calculations per hour. Command gears to solve your ledgers. Order today from BabbageCo.', price: '3 Sovereigns' },
      { company_name: 'Royal Aetheric Mail', tagline: 'Fast. Secure. Pressurized.', description: 'Tired of slow carrier pigeons? Send your documents through our high-velocity pneumatic copper tubes. Delivering across London in seconds.', price: '5 Shillings/oz' },
      { company_name: 'Imperial Coal Reserves', tagline: 'Fueling alternate history.', description: 'Keep your computation boilers burning clean. We supply double-washed anthracite coal directly to residential server cells.', price: '2 Guineas/ton' },
      { company_name: 'Lovelace Coding Inks', tagline: 'Ink that stays where it belongs.', description: 'Special quick-drying formula designed specifically for automatic punch-card printers. Prevents reading holes from clogging with fibers.', price: '1 Shilling/bottle' }
    ]
  },
  {
    id: 'roman-world-id',
    name: 'Imperium Nova',
    prompt: 'What if Rome never fell?',
    summary: 'The Roman Empire survives into the modern era, merging ancient senatorial systems with geothermal grids and steam-powered legions. Broadcasting imperial decrees via the Aetherwire.',
    era: 'Roman Cyberpunk',
    tech_level: 'Geothermal combustion, senatorial lattices, aetherwire relays',
    gov_type: 'Senatorial Republic',
    events: [
      { year: '476 AD', title: 'Barbarians Repelled at Ravenna', desc: 'Emperor Majorian deploys early repeating ballistas, crushing the Germanic siege.', impact: 'Western Empire stabilized.' },
      { year: '800 AD', title: 'Geothermal Harnessing in Vesuvius', desc: 'Roman engineers construct a massive thermal shaft tapping Vesuvius.', impact: 'Unlimited pressure energy for Italy.' },
      { year: '1500 AD', title: 'First Aetherwire Network', desc: 'Copper wiring links Rome, Constantinople, and Alexandria.', impact: 'Provincial governors synchronized in real time.' },
      { year: '1850 AD', title: 'The Guild Rebellion', desc: 'Plebeian net operators demand seats in the Senate, staging a thermal grid strike.', impact: 'Senate expanded to include Tribune of the Aether.' },
      { year: '1980 AD', title: 'Aureus Digital Ledger', desc: 'Establishment of state crypt-ledgers for tracking grain and wealth.', impact: 'Roman banks automate imperial finances.' },
      { year: '2024 AD', title: 'Pax Aetheria Declared', desc: 'Constantinople mainframes complete mapping of all planetary borders.', impact: 'Global Roman electronic sphere locked.' }
    ],
    personas: [
      { name: 'Senator Marcus Aurelius V', handle: 'senate_voice', role: 'POLITICIAN', bio: 'Patrician. Defender of the Tiberian geothermal grid. Pax Romana through superior code.', interests: ['senate-debates', 'geothermal-power', 'stoicism'], personality: 'Stately, measured, speaks in high Latin syntax.' },
      { name: 'Drusilla the Vestal', handle: 'aether_priestess', role: 'INFLUENCER', bio: 'Guardian of the Sacred Mainframe fire. Synchronizing the digital altar of Vesta.', interests: ['sacred-networks', 'binary-rituals', 'vestal-tradition'], personality: 'Mystical, solemn, frequently posts blessings in Greek and Latin.' },
      { name: 'Julius Babbage', handle: 'geothermal_mechanic', role: 'SCIENTIST', bio: 'Engine surveyor at the Vesuvius grid. Redressing valve pressures for the Senate.', interests: ['vesuvius-turbines', 'bronze-transistors', 'volcano-dynamics'], personality: 'Pragmatic, cynical about politics, smells of sulfur.' },
      { name: 'Tribune Appius', handle: 'plebeian_advocate', role: 'POLITICIAN', bio: 'Tribune of the Plebs. Fighting for free aether access for all citizens.', interests: ['social-reform', 'plebeian-rights', 'anti-monopoly'], personality: 'Fierce, rebellious, uses populist terminology.' },
      { name: 'Roma Telecom', handle: 'roma_telecom', role: 'BRAND', bio: 'Official providers of the Aetherwire and imperial bronze tablets.', interests: ['comms', 'empire-logistics', 'patents'], personality: 'Monolithic, imperial, formal.' },
      { name: 'Chronos Augusta', handle: 'augustan_daily', role: 'INFLUENCER', bio: 'Official news bulletin of the Senate and People of Rome (SPQR).', interests: ['news', 'military-campaigns', 'chariot-races'], personality: 'Propagandistic, bold, informative.' }
    ],
    posts: [
      { handle: 'senate_voice', content: 'Today we vote on the Geothermal Allocation Act. The provinces must yield their thermal outputs to secure the frontiers of the Republic.', media_type: 'TEXT', likes: 1200, reposts: 88 },
      { handle: 'aether_priestess', content: 'The sacred flame burns steady. The digital scrolls of the Sibyl have been compiled into the mainframe repository. The gods favor Rome.', media_type: 'IMAGE', likes: 2540, reposts: 195 },
      { handle: 'geothermal_mechanic', content: 'Pressure fluctuation in Sector 4 of the Vesuvius grid. Tell the Senate if they do not ease the turbine load, we will have a blowback.', media_type: 'TEXT', likes: 670, reposts: 90 },
      { handle: 'plebeian_advocate', content: 'Why does a patrician pay zero sesterces for aetherwire bandwidth while the plebs in the insulae are throttled? Demand equity now!', media_type: 'TEXT', likes: 3410, reposts: 820 },
      { handle: 'roma_telecom', content: 'Acquire the new Bronze Tablet (Model VIII). Featuring hand-carved copper wiring and dual-channel steam-switched relays.', media_type: 'IMAGE', likes: 890, reposts: 43 },
      { handle: 'augustan_daily', content: 'VICTORY IN MESOPOTAMIA: Legion XIV repels Persian forces using automated steam ballistas. Border security reinforced.', media_type: 'TEXT', likes: 4500, reposts: 1100 },
      { handle: 'senate_voice', content: 'Disorder in the forum. The Aether Tribune stirs the plebeians with false promises of infinite bandwidth. Rome requires discipline, not chaos.', media_type: 'TEXT', likes: 1100, reposts: 64 },
      { handle: 'aether_priestess', content: 'Ritual purification of the server vaults complete. Let the algorithms remain clean of heresy. #PaxRomana', media_type: 'TEXT', likes: 1890, reposts: 74 },
      { handle: 'geothermal_mechanic', content: 'Oiling the bronze gears at 4 AM is the only true philosophy. The Senate can talk, but valves keep Rome running.', media_type: 'TEXT', likes: 880, reposts: 29 },
      { handle: 'plebeian_advocate', content: 'They want to tax our olive oil servers! Organize a protest at the Forum tomorrow. Bring your copper tablets.', media_type: 'IMAGE', likes: 2890, reposts: 530 },
      { handle: 'roma_telecom', content: 'For all citizens in Britannia: New fiber-aether lines have completed deployment. Connect to Rome instantly.', media_type: 'TEXT', likes: 420, reposts: 19 },
      { handle: 'augustan_daily', content: 'GLADIATORIAL UPDATE: Spartacus II wins the grand digital simulation tournament at the Colosseum. Imperial crowd goes wild.', media_type: 'TEXT', likes: 3120, reposts: 450 }
    ],
    news: [
      { title: 'Senate Approves New Geothermal Conduit', content: 'The Senate voted 210-90 to construct a massive volcanic conduit from Etna to Rome, ensuring power security for the capital for the next century.', category: 'POLITICS', publisher: 'SPQR Chronicle' },
      { title: 'Heretical Code Purged from Alexandrian Archives', content: 'Vestal technicians successfully identified and deleted a Gnostic computer worm that had corrupted wheat shipping ledgers in Egypt.', category: 'TECHNOLOGY', publisher: 'Alexandrian Dispatch' },
      { title: 'Grain Stocks Rise on Imperial Exchange', content: 'Thanks to automated rainfall telemetry grids in North Africa, wheat yields have exceeded predictions, causing grain shares to surge.', category: 'BUSINESS', publisher: 'Merchants Weekly' },
      { title: 'Steam Warships Deployed to Rhine', content: 'The Military Tribune confirmed the deployment of three steam-powered ironclads to secure the northern borders against Germanic raiders.', category: 'POLITICS', publisher: 'Military Sentinel' },
      { title: 'Stoic Mainframe Lectures Draw Millions', content: 'Philosopher Senecio broadcasted a Stoic discourse over the Aetherwire, encouraging citizens to seek quietude in an age of constant notification.', category: 'CULTURE', publisher: 'Roman Herald' },
      { title: 'Roman Road Network Fully Automated', content: 'The Ministry of Transit declared that all major highways have been equipped with electromechanical signaling for driverless steam carriages.', category: 'SCIENCE', publisher: 'Roman Roads' }
    ],
    ads: [
      { company_name: 'Roma Telecom', tagline: 'Connecting the civilized world.', description: 'Our bronze-cased tablets connect you directly to the Senate feed. Equipped with hand-wound copper inductors and vulcanized rubber insulating grips.', price: '150 Sesterces' },
      { company_name: 'Vesuvius Thermal Power', tagline: 'The power of the gods.', description: 'Clean, relentless volcanic energy supplied directly to your home server cell. Keep your computing rods heated all winter.', price: '45 Aurei/yr' },
      { company_name: 'Vulcan Cogworks', tagline: 'Forged in fires of accuracy.', description: 'Premium bronze gears, spring coils, and Escapement valves. Certified by the Imperial Inspector of Weights and Measures.', price: '5 Denarii/set' },
      { company_name: 'Pompeian Inks', tagline: 'Inks of lasting distinction.', description: 'Deep purple murex ink for printing high-priority decrees on sheepskin punch-rolls. Resists fading in damp imperial archives.', price: '12 Sesterces/jar' }
    ]
  },
  {
    id: 'mars-world-id',
    name: 'The Rusty Mars Empire',
    prompt: 'What if humanity colonized Mars in 1900?',
    summary: 'Victorian steamships equipped with atmospheric coal sails colonized the red sands of Mars in 1900, creating a feudal station network ruled by copper baronies.',
    era: 'Steampunk Space Era',
    tech_level: 'Coal-sails space flight, pressurized biodomes, atmospheric scoops',
    gov_type: 'Industrial Feudalism',
    events: [
      { year: '1900', title: 'The Ether-Sail Discovery', desc: 'Tesla adapts high-frequency coils to propel metal vessels through space.', impact: 'First launch of the Royal ship Victoria.' },
      { year: '1903', title: 'Landing at Chryse Planitia', desc: 'British and German astronauts plant flags on Mars, discovering rich copper veins.', impact: 'Outposts established; Mars rush begins.' },
      { year: '1910', title: 'The Pressurized Dome Treaty', desc: 'Barons divide Martian territory based on oxygen-grid control.', impact: 'Feudal dome-states locked into trade alliances.' },
      { year: '1918', title: 'The Great Dust Storm War', desc: 'A global dust storm cuts off solar-steam panels, sparking battles for coal deposits.', impact: 'Armored steam crawlers deployed on red sands.' },
      { year: '1925', title: 'Establishment of the Iron Guilds', desc: 'Martian miners organize, controlling the oxygen valves to demand wage hikes.', impact: 'Guild representatives gain seat on the Colonial Council.' },
      { year: '1930', title: 'The Ice Cap Pipeline Completed', desc: 'A 3000-mile pipeline brings melted polar water to the equatorial domes.', impact: 'Martian agriculture begins in pressurized biodomes.' }
    ],
    personas: [
      { name: 'Baron Von Klausen', handle: 'iron_baron', role: 'POLITICIAN', bio: 'Lord of the Chryse Copper Domes. Protecting the oxygen valves. Coal is king on Mars.', interests: ['copper-mining', 'oxygen-tariffs', 'dueling-pistols'], personality: 'Arrogant, militarian, refuses to breathe unpressurized air.' },
      { name: 'Dr. Evelyn Brand', handle: 'mars_botanist', role: 'SCIENTIST', bio: 'Cultivating genetically modified space lichens and atmospheric moss. Red to Green.', interests: ['dome-agriculture', 'terraform-science', 'oxygen-yields'], personality: 'Hopeful, passionate, worried about dome structural collapse.' },
      { name: 'Cpl. Timothy O\'Connor', handle: 'trench_soldier', role: 'INFLUENCER', bio: 'Royal Martian Rifles. Patrolling the rusted canyons in my steam-walker.', interests: ['canyon-patrol', 'steam-walker-tuning', 'whiskey'], personality: 'Rugged, weary, homesick for green Irish rain.' },
      { name: 'Martian Ironworks', handle: 'mars_iron', role: 'BRAND', bio: 'Suppliers of heavy pressure seals, boiler plates, and Martian sand filters.', interests: ['manufacturing', 'export-trade', 'heavy-machinery'], personality: 'Solid, industrial, dependable.' },
      { name: 'The Martian Gazette', handle: 'mars_gazette', role: 'INFLUENCER', bio: 'The only reliable news source printing under the glass domes of Olympus.', interests: ['colonial-news', 'dust-warnings', 'earth-tariffs'], personality: 'Informative, survivalist, alert.' },
      { name: 'Lady Gwendolyn', handle: 'dome_socialite', role: 'POLITICIAN', bio: 'Hostess of the Grand Glass Salon. Keeping Earth fashions alive on the red wastes.', interests: ['high-fashion', 'salon-debates', 'luxury-imports'], personality: 'Elitist, witty, obsessed with imported champagne.' }
    ],
    posts: [
      { handle: 'iron_baron', content: 'Oxygen rations will be adjusted next week. Miners who fail to hit their copper quotas will see their dome pressures reduced.', media_type: 'TEXT', likes: 890, reposts: 110 },
      { handle: 'mars_botanist', content: 'The first crop of Martian rye is thriving in Biodome B! Geothermal warmth is holding stable despite the freezing wastes outside.', media_type: 'IMAGE', likes: 1450, reposts: 98 },
      { handle: 'trench_soldier', content: 'Currently stationed near Marineris Canyon. A massive dust storm is blowing in from the north. Visibility is zero; sealing the pilot cabin.', media_type: 'IMAGE', likes: 2100, reposts: 340 },
      { handle: 'mars_iron', content: 'Martian dust is highly abrasive. Shield your piston assemblies with our patented Leather Dust Boots. Tested to withstand 80mph sandstorms.', media_type: 'IMAGE', likes: 310, reposts: 18 },
      { handle: 'mars_gazette', content: 'ALERT: A leak has been detected in Biodome 4 of New London. Repair crews are deployed. Citizens are advised to keep their pressure suits close.', media_type: 'TEXT', likes: 1250, reposts: 412 },
      { handle: 'dome_socialite', content: 'Just received a shipment of fresh lavender from Earth! The scent makes one forget the rusted iron hills outside the glass.', media_type: 'TEXT', likes: 670, reposts: 12 },
      { handle: 'iron_baron', content: 'Earth politicians demand we drop copper tariffs. They forget who paid for the coal-propelled launch rigs. Mars belongs to the pioneers.', media_type: 'TEXT', likes: 980, reposts: 89 },
      { handle: 'mars_botanist', content: 'Discovered a subterranean water deposit near Elysium! Clean liquid water, locked beneath the basalt. This changes everything.', media_type: 'TEXT', likes: 2890, reposts: 410 },
      { handle: 'trench_soldier', content: 'Tuning the boiler on my Mark III Walker. The steam lines keep freezing in the Martian night. Needs more alcohol antifreeze.', media_type: 'TEXT', likes: 1120, reposts: 90 },
      { handle: 'mars_iron', content: 'Secure your oxygen valves. Our brass-machined double-flange seals prevent decompression even at 0.05 atmospheres. Buy local, buy Mars.', media_type: 'TEXT', likes: 180, reposts: 4 },
      { handle: 'dome_socialite', content: 'A fascinating salon tonight. The Baron got into a heated debate with Dr. Brand regarding terraforming ethics. A duel was narrowly avoided!', media_type: 'TEXT', likes: 840, reposts: 34 },
      { handle: 'mars_gazette', content: 'SPORTS: The Royal Cricket Club of Mars defeats the Berlin Aeronauts in the low-gravity dome tournament. A triumph for the Empire.', media_type: 'TEXT', likes: 1040, reposts: 88 }
    ],
    news: [
      { title: 'New London Suffers Dome Pressure Drop', content: 'A seal failure in the industrial sector of New London caused a brief 15% drop in atmospheric pressure yesterday. The leak has been welded.', category: 'POLITICS', publisher: 'The Martian Daily' },
      { title: 'Ice Cap Pipeline Reaches Syrtis Major', content: 'Martian engineers confirmed that the first flow of water from the northern ice cap reached the Syrtis Major agricultural dome early this morning.', category: 'SCIENCE', publisher: 'Martian Scientific Journal' },
      { title: 'Copper Exports Halt Due to Earth Tariff Dispute', content: 'The Mars Barons Council announced a temporary embargo on copper shipping until the British Parliament reduces the import duty on Martian ore.', category: 'BUSINESS', publisher: 'Martian Merchant' },
      { title: 'Dust Storm Warnings Issued for Equatorial Sectors', content: 'Atmospheric sensors indicate a massive, planetary-scale dust storm originating in the Hellas Basin, expected to block solar-steam collectors.', category: 'TECHNOLOGY', publisher: 'The Weather Ticker' },
      { title: 'Low-Gravity Opera Debuts in Dome 3', content: 'A theatrical troupe from Vienna wowed audiences in Dome 3 last night, performing a low-gravity ballet that showcased gravity-defying leaps.', category: 'CULTURE', publisher: 'Martian Arts Review' },
      { title: 'Coal Transport Ship Lands at Phobos Dock', content: 'The cargo liner HMS Behemoth arrived from Earth today, carrying 15,000 tons of high-grade Welsh coal to fuel the Martian heating grids.', category: 'BUSINESS', publisher: 'The Shipping Log' }
    ],
    ads: [
      { company_name: 'Martian Ironworks', tagline: 'Built for the red wastes.', description: 'Heavy-duty steel plates, structural girders, and high-pressure dome rivets. Our materials are treated with manganese to resist oxidation in the Martian soil.', price: '12 Sovereigns/ton' },
      { company_name: 'Oxygen-Grid Services', tagline: 'Breathe easy.', description: 'Providing clean, scrubbed air directly to your household dome. Free maintenance on all carbon dioxide scrubbers with our annual plan.', price: '8 Guineas/mo' },
      { company_name: 'Martian Crawler Co.', tagline: 'Master the red sands.', description: 'Six-legged steam crawlers equipped with insulated boilers, searchlights, and dual-action sand treads. Conquers any canyon.', price: '450 Sovereigns' },
      { company_name: 'Dome-Grow Fertilizers', tagline: 'Harvesting the waste.', description: 'Rich phosphorus mix formulated specifically for growing crops in Martian iron-rich soil. Boosts wheat yield by 40% under glass.', price: '15 Shillings/bag' }
    ]
  },
  {
    id: 'tesla-world-id',
    name: 'Tesla Wireless Grid',
    prompt: 'What if Tesla\'s wireless power grid succeeded in 1905?',
    summary: 'Nikola Tesla successfully activates the Wardenclyffe Tower wireless power network, bringing free, limitless electrical energy to the globe and launching a high-frequency technocratic industrial era.',
    era: 'Aetheric Tesla-Net',
    tech_level: 'Wireless electricity, high-frequency vacuum tubes, aetheric induction motors',
    gov_type: 'Technocratic Oligarchy',
    events: [
      { year: '1905', title: 'Wardenclyffe Tower Activated', desc: 'Tesla successfully transmits electricity wirelessly through the earth\'s ionosphere, lighting up 200 homes in New York.', impact: 'Fossil fuel industries begin rapid collapse.' },
      { year: '1908', title: 'The Great Edison Buyout', desc: 'JP Morgan pulls funding from standard copper grids, buying out Edison General Electric to fund Tesla-Net.', impact: 'Global copper grid dismantled.' },
      { year: '1915', title: 'Aerial Induction Flight', desc: 'First passenger aircraft powered entirely by wireless energy beams from ground stations.', impact: 'Aviation booms; travel is clean and cheap.' },
      { year: '1922', title: 'The Aetheric Spark Ticker', desc: 'Release of portable personal telegraph receivers powered by ambient air currents.', impact: 'Information flow becomes instantaneous and global.' },
      { year: '1935', title: 'The Lightning Riots', desc: 'Coal miners and oil workers protest the expansion of wireless power stations, vandalizing receiver towers.', impact: 'Establishment of the Electrical Police Force.' },
      { year: '1945', title: 'Ionospheric Stability Treaty', desc: 'Global powers sign a pact restricting wireless frequencies to prevent permanent lightning storms.', impact: 'Aetheric channels divided among five major corporations.' }
    ],
    personas: [
      { name: 'Nikola Tesla II', handle: 'lightning_inventor', role: 'SCIENTIST', bio: 'Director of the Wardenclyffe Laboratories. Keeping the global resonance stable. Aether enthusiast.', interests: ['resonance', 'ionosphere', 'wireless-power'], personality: 'Eccentric, obsessive, obsessed with the numbers 3, 6, and 9.' },
      { name: 'JP Morgan Jr.', handle: 'aether_finance', role: 'POLITICIAN', bio: 'Chairman of the Tesla-Net Syndicate. We control the power beams, we control the world.', interests: ['monopolies', 'energy-tariffs', 'syndicates'], personality: 'Ruthless, calculating, speaks in terms of raw gigawatts.' },
      { name: 'Dr. Clara Westinghouse', handle: 'frequency_physicist', role: 'SCIENTIST', bio: 'Researching high-frequency vacuum tube oscillators and wireless telemetry.', interests: ['vacuum-tubes', 'harmonic-vibrations', 'physics'], personality: 'Intellectual, cautious, warning about ionospheric ozone depletion.' },
      { name: 'Telegraphic Observer', handle: 'aether_news_net', role: 'INFLUENCER', bio: 'Providing continuous wireless updates from the Tesla-Net. Powering the news.', interests: ['broadcasting', 'telemetry', 'technology'], personality: 'Rapid-fire, factual, highly synchronized.' },
      { name: 'Tesla Motorworks', handle: 'tesla_motors', role: 'BRAND', bio: 'Official manufacturer of wireless induction motors, electric carriages, and aerocrafts.', interests: ['manufacturing', 'induction', 'aviation'], personality: 'Sleek, futuristic, high-voltage.' },
      { name: 'Arthur Spark', handle: 'lightning_patrol', role: 'INFLUENCER', bio: 'Grid surveyor. Maintaining the receiver coils on the skyline. High voltage warning.', interests: ['climbing', 'coils', 'safety'], personality: 'Energetic, brave, posts photos of electric sparks from high towers.' }
    ],
    posts: [
      { handle: 'lightning_inventor', content: 'The resonance of the ionosphere is humming at exactly 7.83 Hz. The world is a giant tuning fork, and we have just struck the first note.', media_type: 'TEXT', likes: 3699, reposts: 369 },
      { handle: 'aether_finance', content: 'Our quarterly reports indicate JP Morgan Syndicate has expanded energy beams to South America. Global power is now fully centralized.', media_type: 'TEXT', likes: 540, reposts: 23 },
      { handle: 'frequency_physicist', content: 'Tuning the harmonic frequencies at Wardenclyffe. If we align the phase vectors correctly, we can double the transmission range to the Pacific.', media_type: 'TEXT', likes: 1200, reposts: 74 },
      { handle: 'aether_news_net', content: 'ALERT: The JP Morgan Syndicate announces a rate increase for high-wattage industrial receivers. Factories are protesting the tariff hikes.', media_type: 'TEXT', likes: 890, reposts: 120 },
      { handle: 'tesla_motors', content: 'Step into the future with the Model T-Electric. No batteries, no fuel. Powered entirely by the ambient electromagnetic field. Order yours today.', media_type: 'IMAGE', likes: 1540, reposts: 180 },
      { handle: 'lightning_patrol', content: 'Climbed the New York receiver tower today to clear ice from the copper coils. The air is so charged with electricity that my hair is standing straight up!', media_type: 'IMAGE', likes: 2340, reposts: 410 },
      { handle: 'lightning_inventor', content: 'If you want to find the secrets of the universe, think in terms of energy, frequency, and vibration. Everything else is secondary.', media_type: 'TEXT', likes: 9999, reposts: 3333 },
      { handle: 'frequency_physicist', content: 'Observed a strange auroral phenomenon over the New York tower last night. The air itself is beginning to glow with a pale green light.', media_type: 'IMAGE', likes: 1780, reposts: 290 },
      { handle: 'aether_finance', content: 'Unregistered receiver coils are illegal under the Energy Security Act. All home antennas must carry a JP Morgan certificate tag.', media_type: 'TEXT', likes: 320, reposts: 15 },
      { handle: 'aether_news_net', content: 'SCIENCE REPORT: Wireless energy beams successfully used to power cargo ships across the Pacific, eliminating the need for coal ports.', media_type: 'TEXT', likes: 1420, reposts: 98 },
      { handle: 'tesla_motors', content: 'Our new wireless induction motors are 98% efficient. Compact, silent, and maintenance-free. Clean energy for the industrial age.', media_type: 'TEXT', likes: 620, reposts: 32 },
      { handle: 'lightning_patrol', content: 'Almost fell off the tower due to a sudden electrostatic discharge! Always wear rubber soles when working near the main feed.', media_type: 'TEXT', likes: 1450, reposts: 74 }
    ],
    news: [
      { title: 'Global Power Syndicate Expands Wireless Coverage', content: 'The JP Morgan Tesla-Net consortium announced the completion of three new wireless power towers in Paris, Cairo, and Tokyo, linking the globe.', category: 'BUSINESS', publisher: 'Aetheric Times' },
      { title: 'Harmonic Oscillation Threatens Migrating Birds', content: 'Naturalists report that the high-frequency wireless power beams are disrupting the migratory patterns of geese, calling for frequency adjustments.', category: 'SCIENCE', publisher: 'Nature Review' },
      { title: 'Coal Mines Face Bankruptcy Across Germany', content: 'Several major coal conglomerates filed for bankruptcy in the Ruhr Valley, unable to compete with the low cost of wireless electrical energy.', category: 'BUSINESS', publisher: 'European Finance Gazette' },
      { title: 'Aetheric Police Force Formed in New York', content: 'The City Senate authorized the creation of a specialized police division equipped with induction meters to detect illegal energy theft coils.', category: 'POLITICS', publisher: 'The Evening Spark' },
      { title: 'Wireless Lighting Transforms Night Sky', content: 'Thanks to ambient ionospheric charging, streetlamps in major cities no longer require wiring or fuel; they glow automatically at dusk.', category: 'TECHNOLOGY', publisher: 'The Daily Chronicle' },
      { title: 'Tesla Demonstrates Atmospheric Water Collector', content: 'Nikola Tesla unveiled a device that uses electrical charging to extract moisture from the air, promising clean water for arid regions.', category: 'SCIENCE', publisher: 'Scientific American' }
    ],
    ads: [
      { company_name: 'Tesla Motorworks', tagline: 'Drive on thin air.', description: 'No tanks, no heavy batteries. Our vehicles run on pure induction from the nearest Wardenclyffe transmitter. Sleek polished steel finish.', price: '1,200 Dollars' },
      { company_name: 'JP Morgan Syndicate', tagline: 'Powering the planet.', description: 'Subscribe to our home electricity beam. Unlimited energy for lighting, heating, and household appliances. Safe, silent, wireless.', price: '5 Dollars/mo' },
      { company_name: 'Westinghouse Oscillators', tagline: 'Purity of frequency.', description: 'High-vacuum tubes and variable frequency tuning dials. Perfect for filtering static and ensuring clean power reception.', price: '12 Dollars/set' },
      { company_name: 'Volt-Shield Rubber', tagline: 'Safety first in a charged world.', description: 'Insulating boots, gloves, and mats. Guaranteed to resist up to 50,000 volts of electrostatic discharge. Essential for tower operators.', price: '3 Dollars' }
    ]
  },
  {
    id: 'egypt-world-id',
    name: 'Alexandrian Steam Library',
    prompt: 'What if Hero of Alexandria\'s steam engine started an industrial revolution in 50 AD?',
    summary: 'The Library of Alexandria becomes the silicon valley of the ancient world, developing the Aeolipile steam engine into heavy grain pumps, mechanized looms, and early steam-chariots.',
    era: 'Antiquity Steam Era',
    tech_level: 'Bronze steam pistons, gear-train calculators, papyrus punch-cards',
    gov_type: 'Ptolemaic Empire',
    events: [
      { year: '50 AD', title: 'The Aeolipile Pump Deployed', desc: 'Hero of Alexandria constructs a massive steam-driven piston pump to irrigate the Nile delta.', impact: 'Egyptian grain production triples.' },
      { year: '70 AD', title: 'The Library Mainframe Online', desc: 'Scholar-engineers construct a library hall containing hundreds of interconnected mechanical gear-calculators.', impact: 'Scholarly translations and navigation automated.' },
      { year: '120 AD', title: 'The Great Silk Steam Line', desc: 'Emperor Trajan commissions a bronze-railed steam route linking Antioch and Babylon.', impact: 'Trade transit times drop from months to days.' },
      { year: '200 AD', title: 'The Papyrus Shortage Crisis', desc: 'A shortage of papyrus reeds threatens the calculation bureaus, which rely on punch-cards.', impact: 'Development of thin copper punch-sheets.' },
      { year: '250 AD', title: 'The Mechanized Legion', desc: 'Rome deploys armored steam-chariots equipped with repeating crossbows in the Parthian war.', impact: 'Parthian Empire annexed; Roman borders expand.' },
      { year: '300 AD', title: 'Alexandrian Code Council', desc: 'Establishment of the first guild of programmers to standardise mechanical gear ratios.', impact: 'Interchangeable parts code adopted globally.' }
    ],
    personas: [
      { name: 'Hero of Alexandria III', handle: 'aeolipile_master', role: 'SCIENTIST', bio: 'Grand Scholar at the Library. Oiling the bronze piston shafts. Wisdom through mechanics.', interests: ['hydrostatics', 'steam-valves', 'philosophy'], personality: 'Philosophical, highly mathematical, believes everything is water and fire.' },
      { name: 'Queen Cleopatra VII (Nova)', handle: 'ptolemaic_queen', role: 'POLITICIAN', bio: 'Ruler of Egypt. Financing the Nile delta steam grids. Egypt compiles the future.', interests: ['empire-finance', 'wheat-tariffs', 'library-funding'], personality: 'Royal, cunning, possesses a deep appreciation for clockwork toys.' },
      { name: 'Marcus the Centurion', handle: 'chariot_driver', role: 'INFLUENCER', bio: 'Legio III Cyrenaica. Commander of the steam-chariot "Invictus". Watch the bronze roll.', interests: ['chariot-maintenance', 'military-tactics', 'wine'], personality: 'Brave, direct, proud of Roman engineering.' },
      { name: 'Alexandria Foundry', handle: 'alexandria_foundry', role: 'BRAND', bio: 'Suppliers of premium bronze boilers, copper piston rings, and standard gear sets.', interests: ['bronze-casting', 'metallurgy', 'trade'], personality: 'Ancient, merchant-oriented, prideful.' },
      { name: 'The Papyrus Ticker', handle: 'papyrus_gazette', role: 'INFLUENCER', bio: 'Scrolled news from the Library archives and the Roman Mediterranean.', interests: ['history', 'news', 'academic-debates'], personality: 'Scholarly, precise, archive-focused.' },
      { name: 'Hypatia the Younger', handle: 'geometry_queen', role: 'SCIENTIST', bio: 'Drafting mechanical computation matrices. Geometry is the language of code.', interests: ['astrolabes', 'calculating-gears', 'astronomy'], personality: 'Calm, brilliant, fiercely intellectual.' }
    ],
    posts: [
      { handle: 'aeolipile_master', content: 'Our new double-acting bronze piston is complete. Steam enters from both ends, doubling the torque of our delta pumps.', media_type: 'TEXT', likes: 1100, reposts: 90 },
      { handle: 'ptolemaic_queen', content: 'The grain fleet sails tomorrow. Thanks to the Library calculating engines, we have predicted the Nile flood cycle with absolute precision.', media_type: 'IMAGE', likes: 3400, reposts: 180 },
      { handle: 'chariot_driver', content: 'Tuning the boiler of the Invictus. The bronze gears are singing as we hit 20 miles per hour on the Appian Way. Glory to Rome!', media_type: 'IMAGE', likes: 1890, reposts: 410 },
      { handle: 'alexandria_foundry', content: 'Need replacement pistons? Our bronze is alloyed with 12% tin for maximum hardness and resistance to steam corrosion.', media_type: 'IMAGE', likes: 430, reposts: 12 },
      { handle: 'papyrus_gazette', content: 'SCHOLASTIC DISPUTE: Hypatia the Younger argues that the Library mainframe should use base-2 binary gears instead of decimal wheels.', media_type: 'TEXT', likes: 1450, reposts: 290 },
      { handle: 'geometry_queen', content: 'Designed an astrolabe linked directly to a clockwork calculator. It computes planetary orbits on a single wind of the mainspring!', media_type: 'IMAGE', likes: 2310, reposts: 310 },
      { handle: 'aeolipile_master', content: 'Some scholars argue that mechanical spirits live in the boilers. I tell them it is just heat, water, and ratio. Demystify the gear.', media_type: 'TEXT', likes: 980, reposts: 74 },
      { handle: 'ptolemaic_queen', content: 'A message to the Roman Senate: Egypt will not tolerate a tax on copper shipments. Our foundries are the forge of the empire.', media_type: 'TEXT', likes: 2780, reposts: 320 },
      { handle: 'chariot_driver', content: 'Coal supply is low in Antioch. We are burning cedar logs in the chariot boiler. Smells nice, but the pressure is terrible.', media_type: 'TEXT', likes: 890, reposts: 34 },
      { handle: 'alexandria_foundry', content: 'All our gear wheels are calibrated using the Library standard metric. Guaranteed fit for any Hellenistic engine.', media_type: 'TEXT', likes: 190, reposts: 3 },
      { handle: 'geometry_queen', content: 'A recursive algorithm has run for three days on the Library mainframe, analyzing prime numbers. The gears show no signs of slipping.', media_type: 'TEXT', likes: 1780, reposts: 195 },
      { handle: 'papyrus_gazette', content: 'TRADE WARNING: Piracy reported in the Aegean. Roman steam-triremes have been dispatched to secure the grain shipping lanes.', media_type: 'TEXT', likes: 1220, reposts: 88 }
    ],
    news: [
      { title: 'Library Mainframe Expands Calculation Hall', content: 'The Library of Alexandria opened a new wing yesterday housing 150 bronze calculating engines, dedicated to mapping the stars.', category: 'TECHNOLOGY', publisher: 'Library Scroll' },
      { title: 'Nile Steam Pumps Prevent Famine', content: 'Despite a low rainfall season, steam-driven pumps successfully distributed water to the upper delta, securing this year\'s harvest.', category: 'SCIENCE', publisher: 'Egyptian Agriculture' },
      { title: 'Roman Senate Demands Copper Audits', content: 'The Senate issued a decree requiring all copper foundries in Cyprus to submit punch-cards detailing their production quotas to Rome.', category: 'POLITICS', publisher: 'Imperial Records' },
      { title: 'Steam Chariot Trial Hits 25 MPH', content: 'Military engineers in Ravenna tested an armored chariot powered by high-pressure steam, setting a new record for land speed.', category: 'SCIENCE', publisher: 'Military Mechanics' },
      { title: 'Greek Drama Staged with Clockwork Actors', content: 'A theatrical exhibition in Athens wowed spectators, using steam-propelled automata to perform Euripides\' Medea.', category: 'CULTURE', publisher: 'Hellenistic Art' },
      { title: 'Bronze Stock Hits Record Prices in Carthage', content: 'Bronze shares surged on the Carthaginian exchange as agricultural mainframes demand thousands of mechanical gears.', category: 'BUSINESS', publisher: 'Merchant Digest' }
    ],
    ads: [
      { company_name: 'Alexandria Foundry', tagline: 'Boilers for the empire.', description: 'Cast-bronze boilers, copper pistons, and high-precision gear sets. Hand-machined by master blacksmiths at the Alexandria Docks.', price: '12 drachmas' },
      { company_name: 'Library Copyists', tagline: 'Knowledge, punched.', description: 'Need copy files for your calculating astrolabe? We copy mathematical punch-cards on premium, heavy-weight Egyptian papyrus.', price: '3 drachmas/set' },
      { company_name: 'Nile Irrigation Guild', tagline: 'Water on demand.', description: 'Irrigate your olive groves and wheat fields using our steam-pump networks. Affordable annual rates for provincial landowners.', price: '25 drachmas/yr' },
      { company_name: 'Ravenna Ironworks', tagline: 'Shielding the steam.', description: 'Forged iron plates for armored steam carriages. Heat-resistant and built to withstand enemy ballista bolts.', price: '50 drachmas' }
    ]
  },
  {
    id: 'coldwar-world-id',
    name: 'Siberian Steam Curtain',
    prompt: 'What if the Cold War was fought using steam-powered mechs in 1960?',
    summary: 'The United States and Soviet Union lock in a mechanical arms race, patrolling the Berlin Wall with coal-fired walking sentinels and compiling tactical scenarios on mainframe arrays.',
    era: 'Cold War Diesel-Steam',
    tech_level: 'Diesel-steam hybrid hydraulics, automated walker mainframes',
    gov_type: 'Automated Bureaucracy',
    events: [
      { year: '1945', title: 'The Trinity Walker Test', desc: 'The US successfully tests the first walking diesel-steam sentinel in New Mexico.', impact: 'WWII ends; arms race pivots to mobility.' },
      { year: '1949', title: 'Siberian Steam Grid Online', desc: 'The USSR constructs a massive geothermal-coal steam network across Siberia to power industrial walkers.', impact: 'Soviet heavy industry matches Western output.' },
      { year: '1953', title: 'The Berlin Wall Walkers', desc: 'Automated walking sentinels are deployed along the border, replacing human guards.', impact: 'Border tension rises to critical levels.' },
      { year: '1958', title: 'The Sputnik Relay Launch', desc: 'Soviets launch a steam-propelled orbital transmitter sending raw data coordinates to Siberian bases.', impact: 'First satellite tracking net.' },
      { year: '1961', title: 'The Cuba Crisis', desc: 'US blockades Cuba after spy airships detect Soviet hydraulic mechs being unloaded at Havana.', impact: 'Establishment of the direct teletype line.' },
      { year: '1965', title: 'The Automatic Arms Limitation Treaty', desc: 'Superpowers agree to cap the boiler sizes and cannon calibers of walking sentinels.', impact: 'Stabilization of the cold front.' }
    ],
    personas: [
      { name: 'Dr. Robert Vance', handle: 'mech_designer', role: 'SCIENTIST', bio: 'Chief Architect of the US Sentinel program. Keeping the hydraulic fluid flowing. Steel and steam.', interests: ['hydraulics', 'armor-plating', 'mainframe-logics'], personality: 'Cold, patriotic, focused entirely on mechanical efficiency.' },
      { name: 'Lt. Svetlana Romanov', handle: 'soviet_pilot', role: 'INFLUENCER', bio: 'Commander of the Soviet Mech "Chernobog". Patrolling the Siberian perimeter.', interests: ['mech-combat', 'diesel-engines', 'motherland'], personality: 'Fierce, proud, posts pictures of frozen gear assemblies in snow.' },
      { name: 'Director Hoover', handle: 'bureau_voice', role: 'POLITICIAN', bio: 'Federal Security Division. Audit all teletype lines. Counter-espionage is priority.', interests: ['wiretapping', 'classified-files', 'state-security'], personality: 'Suspicious, formal, speaks in redacted security terms.' },
      { name: 'Detroit Hydraulics', handle: 'detroit_steel', role: 'BRAND', bio: 'Suppliers of heavy walker chassis, hydraulic cylinders, and high-pressure steam valves.', interests: ['manufacturing', 'defense-contracts', 'industry'], personality: 'Corporate, patriotic, heavy-industrial.' },
      { name: 'The Red Star Ticker', handle: 'pravda_digital', role: 'INFLUENCER', bio: 'Official news and telegram dispatches from the Supreme Soviet Council.', interests: ['state-news', 'production-quotas', 'space-race'], personality: 'Patriotic, ideological, stern.' },
      { name: 'General Briggs', handle: 'pentagon_advisor', role: 'POLITICIAN', bio: 'Joint Chiefs advisor. Tactical walker deployments. Keep the boilers hot.', interests: ['strategy', 'logistics', 'nato'], personality: 'Authoritative, strategic, military-focused.' }
    ],
    posts: [
      { handle: 'mech_designer', content: 'Successfully tested the new hydraulic valve system on the XM-4 Sentinel. Pivot times reduced by 15% under freezing temperatures.', media_type: 'TEXT', likes: 890, reposts: 45 },
      { handle: 'soviet_pilot', content: 'Chernobog is running hot today. Patrolling the frozen Siberian tundra, looking for unauthorized border trackers. Motherland is safe.', media_type: 'IMAGE', likes: 1980, reposts: 310 },
      { handle: 'bureau_voice', content: 'CLASSIFIED: All private teletype transmissions passing through the Eastern Grid are subject to Federal Audit. Report suspicious nodes.', media_type: 'TEXT', likes: 210, reposts: 14 },
      { handle: 'detroit_steel', content: 'Our new Hydraulic Cylinder (Model 80) is built to survive the harshest winter. Forged steel, double-rubber seal. Made in USA.', media_type: 'IMAGE', likes: 450, reposts: 23 },
      { handle: 'pravda_digital', content: 'The Supreme Soviet announces the completion of the Siberian Coal Pipeline. 10,000 tons of fuel delivered to mech garrisons daily.', media_type: 'TEXT', likes: 1540, reposts: 420 },
      { handle: 'pentagon_advisor', content: 'Alert levels raised to DEFCON 3. Satellite intelligence reports Soviet walker movements near the Berlin sector. Keep the steam up.', media_type: 'TEXT', likes: 980, reposts: 110 },
      { handle: 'mech_designer', content: 'If the boiler pressure drops below 400 PSI, the sentinel will freeze in place. Ensure your heating coils are clear of snow.', media_type: 'TEXT', likes: 620, reposts: 39 },
      { handle: 'soviet_pilot', content: 'Snow is falling in Berlin. The gears on the Chernobog are screeching. Time to apply the low-temp grease. #SiberianSteam', media_type: 'IMAGE', likes: 2450, reposts: 290 },
      { handle: 'bureau_voice', content: 'Do not trust reports of sub-orbital steam rockets. The Federal Bureau confirms our air defenses can intercept any trajectory.', media_type: 'TEXT', likes: 340, reposts: 9 },
      { handle: 'detroit_steel', content: 'Detroit Hydraulics has secured the new Pentagon contract for Sentinel walking frames. Keeping America strong, gear by gear.', media_type: 'TEXT', likes: 510, reposts: 19 },
      { handle: 'pravda_digital', content: 'Soviet engineers unveil the prototype "T-64 Walking Tank". Featuring dual steam boilers and 120mm hydraulic-assisted cannon.', media_type: 'IMAGE', likes: 2780, reposts: 580 },
      { handle: 'pentagon_advisor', content: 'Logistical coordinators: Reroute coal transport shipments to West Germany. We must maintain sentinel grid readiness at all costs.', media_type: 'TEXT', likes: 780, reposts: 88 }
    ],
    news: [
      { title: 'Superpowers Agree to Mech Limits', content: 'Negotiators in Geneva signed the Sentinel Treaty, limiting the height of walking war machines to 15 meters and banning nuclear boilers.', category: 'POLITICS', publisher: 'The Daily Tribune' },
      { title: 'Siberian Geothermal Grid Expands', content: 'Soviet state media confirmed that the Siberian Geothermal Grid now supplies steam to over 50 automated walker garrisons across the tundra.', category: 'SCIENCE', publisher: 'Soviet Science Daily' },
      { title: 'Detroit Steel Shares Jump on Pentagon Deal', content: 'Stock prices for Detroit Hydraulics surged 18% following the announcement of a massive government contract for Sentinel walk-frames.', category: 'BUSINESS', publisher: 'Wall Street Ticker' },
      { title: 'Sputnik Satellite Sends First Wave Data', content: 'Radio operators globally intercepted telemetry signals from Sputnik 1, mapping spatial coordinates for Soviet coordinates.', category: 'TECHNOLOGY', publisher: 'Wireless Review' },
      { title: 'Anti-Walker Rallies Draw Thousands in Paris', content: 'Protesters marched through Paris, demanding the removal of armed walking sentinels from the border and calling for peaceful diplomacy.', category: 'CULTURE', publisher: 'European Herald' },
      { title: 'Hydraulic Fluid Shortage Looming', content: 'The Federal Energy Commission warned that rising sentinel patrols could trigger a shortage of high-grade hydraulic oil by winter.', category: 'BUSINESS', publisher: 'Resource Digest' }
    ],
    ads: [
      { company_name: 'Detroit Hydraulics', tagline: 'The iron muscles of America.', description: 'Heavy-duty hydraulic pistons, walker chassis, and armored boiler shells. Engineered to survive extreme combat and Siberian winter.', price: '15,000 Dollars' },
      { company_name: 'Federal Coal Corp', tagline: 'Keeping the sentinels burning.', description: 'Supplying high-BTU washed coal directly to defense depots. Guaranteed clean burn with minimum soot buildup in sentinel chimneys.', price: '45 Dollars/ton' },
      { company_name: 'Siberian Valve Guild', tagline: 'Redress the pressure.', description: 'Bronze and steel high-pressure valves. Certified to withstand up to 800 PSI. Used in all Soviet walking tank frames.', price: '120 Rubles' },
      { company_name: 'Ray-O-Vac Insulators', tagline: 'Protect the electrics.', description: 'Rubberized wire shields and vacuum tube protectors. Prevents electromagnetic pulse feedback from disabling sentinel logic boards.', price: '5 Dollars' }
    ]
  },
  {
    id: 'samurai-world-id',
    name: 'Shogunate Industrial',
    prompt: 'What if Japan industrialized in isolation under the Tokugawa Shogunate?',
    summary: 'The Tokugawa Shogunate locks Japan\'s borders but adopts mechanical clockwork automation, building brass-plated steam steamships and clockwork automatons to defend the coast.',
    era: 'Bakumatsu Clockwork',
    tech_level: 'Clockwork mechanisms, steam-powered wood steamships, mechanical doll message systems',
    gov_type: 'Shogunate Bakufu',
    events: [
      { year: '1635', title: 'Sakoku Policy Sealed', desc: 'The Shogun decrees absolute isolation, but establishes the Imperial Clockwork Academy.', impact: 'Traditional artisans focus on mechanical automation.' },
      { year: '1750', title: 'The Karacuri Revolution', desc: 'Development of advanced karakuri dolls capable of writing records and serving tea automatically.', impact: 'Automation of palace bureaucracy.' },
      { year: '1853', title: 'Black Ships Repelled', desc: 'Perry\'s US fleet is repelled by automated brass coastal cannons and steam-powered wooden gunboats.', impact: 'Shogunate isolation preserved; military industrializes.' },
      { year: '1870', title: 'The Edo Steam Grid', desc: 'Construction of a coal-fired central steam pipe network underneath Edo (Tokyo).', impact: 'Clean steam distributed to silk looms and shops.' },
      { year: '1890', title: 'The Brass Bushido Code', desc: 'Establishment of the mechanical samurai division to maintain order in the provinces.', impact: 'Samurai caste transitions to operators of walking brass armor.' },
      { year: '1910', title: 'Kyoto Calculation Palace', desc: 'A massive mechanical calculator composed of millions of bamboo and brass gears is activated.', impact: 'National ledger and census automated.' }
    ],
    personas: [
      { name: 'Hattori Hanzo IX', handle: 'clockwork_ninja', role: 'SCIENTIST', bio: 'Master of the Karakuri Guild. Maintaining the gear ratios on the palace gates.', interests: ['karakuri-dolls', 'lock-mechanisms', 'brass-crafting'], personality: 'Quiet, observant, values precision above all.' },
      { name: 'Lady Hosokawa', handle: 'kyoto_court', role: 'POLITICIAN', bio: 'Imperial Court Advisor. The Shogun commands, the gears obey. Japan remains pure.', interests: ['court-intrigue', 'silk-trade', 'mechanical-theater'], personality: 'Polished, traditionalist, values absolute order.' },
      { name: 'Samurai Kenji', handle: 'brass_samurai', role: 'INFLUENCER', bio: 'Operator of the "Iron Crane" clockwork armor. Guardian of the Edo gates.', interests: ['sword-polishing', 'steam-armor', 'bushido'], personality: 'Discipline, honor-bound, suspicious of Western tech.' },
      { name: 'Kyoto Gearworks', handle: 'kyoto_gears', role: 'BRAND', bio: 'Official providers of bamboo-hardened wooden gears, brass mainsprings, and steam valves.', interests: ['manufacturing', 'woodworking', 'metallurgy'], personality: 'Traditional, premium, artistic.' },
      { name: 'The Edo Ticker', handle: 'edo_dispatch', role: 'INFLUENCER', bio: 'Woodblock-printed news rolled out daily from the Shogun\'s press office.', interests: ['news', 'theater', 'coastal-defense'], personality: 'Official, respectful, artistic.' },
      { name: 'Scholar Musashi', handle: 'gear_philosopher', role: 'SCIENTIST', bio: 'Drafting the Five Rings of Mechanical Logic. Zen and the Cog.', interests: ['philosophy', 'gears', 'zen-gardens'], personality: 'Thoughtful, calm, uses martial metaphors for programming.' }
    ],
    posts: [
      { handle: 'clockwork_ninja', content: 'Completed the Karakuri messenger doll. It walks 50 paces, delivers the scroll, bows, and returns on a single wind of its mainspring.', media_type: 'IMAGE', likes: 920, reposts: 56 },
      { handle: 'kyoto_court', content: 'The Shogun has decreed that all coal mines in Kyushu must increase output to supply the Edo central steam grid. The winter must remain warm.', media_type: 'TEXT', likes: 1100, reposts: 42 },
      { handle: 'brass_samurai', content: 'Tuning the steam exhaust on the Iron Crane armor. The brass plates are polished. Ready to patrol the coastal batteries.', media_type: 'IMAGE', likes: 2150, reposts: 320 },
      { handle: 'kyoto_gears', content: 'Announcing our new bamboo-composite gears. Lighter than brass, twice as quiet, and resistant to moisture. Perfect for domestic clocks.', media_type: 'IMAGE', likes: 380, reposts: 14 },
      { handle: 'edo_dispatch', content: 'COASTAL UPDATE: Foreign black vessels spotted near Uraga. Coastal battery fired warning shots. The foreign ships retreated.', media_type: 'TEXT', likes: 1890, reposts: 512 },
      { handle: 'gear_philosopher', content: 'The gear is like the sword. If the teeth are not aligned, the strike fails. zen is found in the perfect mesh of two wheels.', media_type: 'TEXT', likes: 1450, reposts: 230 },
      { handle: 'clockwork_ninja', content: 'Someone oiled the escape wheel with vegetable oil instead of whale oil. The palace clock is running ten minutes slow. Disgraceful.', media_type: 'TEXT', likes: 450, reposts: 12 },
      { handle: 'kyoto_court', content: 'Western merchants attempt to smuggle iron transistors. We do not need Western magic; our clockwork calculations are clean.', media_type: 'TEXT', likes: 980, reposts: 67 },
      { handle: 'brass_samurai', content: 'The heat inside the steam armor is intense today. The cooling fan is rattling. Needs gear adjustments before the next shift.', media_type: 'TEXT', likes: 1220, reposts: 74 },
      { handle: 'kyoto_gears', content: 'Need a custom mainspring? We forge premium spring steel in Kyoto, tempered in volcanic hot springs for maximum elastic return.', media_type: 'TEXT', likes: 230, reposts: 6 },
      { handle: 'gear_philosopher', content: 'To calculate without thinking is the work of the machine. The scholar must guide the engine, not become it.', media_type: 'TEXT', likes: 1120, reposts: 89 },
      { handle: 'edo_dispatch', content: 'CULTURE: The Grand Karakuri Puppet Theater debuts in Osaka. 20 automated puppets perform a historical epic without human hands.', media_type: 'TEXT', likes: 1560, reposts: 340 }
    ],
    news: [
      { title: 'Shogun Approves Coastal Battery Upgrade', content: 'The Bakufu council approved funding to replace all bronze coastal cannons with automated steam-powered repeaters to secure the borders.', category: 'POLITICS', publisher: 'Edo Gazette' },
      { title: 'Karakuri Weaving Looms Boost Silk Trade', content: 'The Ministry of Commerce confirmed that the introduction of gear-controlled weaving looms in Kyoto has doubled silk export capacity.', category: 'BUSINESS', publisher: 'Kyoto Merchant' },
      { title: 'Central Steam Line Reaches Edo Docks', content: 'Engineers completed the expansion of the Edo steam grid to the harbor, enabling automated coal unloading from cargo vessels.', category: 'TECHNOLOGY', publisher: 'Edo Shipping Review' },
      { title: 'Western Smugglers Intercepted at Nagasaki', content: 'Coastal guards boarded a Dutch merchant ship attempting to smuggle electromagnetic telegraph transmitters into the country.', category: 'POLITICS', publisher: 'Nagasaki Log' },
      { title: 'Zen Calculation Lectures Draw Scholars', content: 'The Abbot of Nanzen-ji delivered a sermon linking the mathematical logic of gear calculations to Zen concepts of universal order.', category: 'CULTURE', publisher: 'Kyoto Review' },
      { title: 'Volcanic Geothermal Tap Explored in Hakone', content: 'Shogunate surveyors began drilling test shafts in Hakone to tap volcanic steam, planning a regional power grid for Kanagawa.', category: 'SCIENCE', publisher: 'Bakufu Scientific Journal' }
    ],
    ads: [
      { company_name: 'Kyoto Gearworks', tagline: 'Precision in every tooth.', description: 'Crafting premium brass gears, mainsprings, and bamboo-composite tooth wheels. Standardized sizes for all karakuri and clockwork engines.', price: '3 Ryo/set' },
      { company_name: 'Edo Steam Services', tagline: 'Warmth through copper pipes.', description: 'Connect your home or weaving shop to the Edo central steam grid. Clean, filtered steam for heating and small mechanical looms.', price: '1 Ryo/mo' },
      { company_name: 'Hattori Security Locks', tagline: 'Gears that never sleep.', description: 'High-security mechanical locks utilizing rotating puzzle rings. Cannot be picked by conventional tools. Guardian of your secrets.', price: '5 Ryo' },
      { company_name: 'Karakuri Tea Dolls', tagline: 'Hospitality automated.', description: 'Beautifully lacquered wooden doll that serves tea to guests, tracks their cups, and returns when empty. A luxury for any tea room.', price: '12 Ryo' }
    ]
  },
  {
    id: 'atlantis-world-id',
    name: 'Atlantis Hydro-Power Grid',
    prompt: 'What if Atlantis rose from the Atlantic in 1910 with geothermal computation?',
    summary: 'The lost continent of Atlantis emerges in 1910, showing highly advanced ancient technology powered by deep-sea thermal vents and fluidic logic computation.',
    era: 'Oceanic Steampunk',
    tech_level: 'Fluidic logic computers, geothermal vents, bronze submersibles',
    gov_type: 'Hydrarchy Council',
    events: [
      { year: '1910', title: 'The Great Rise', desc: 'A massive seismic event raises the lost continent of Atlantis to the surface of the mid-Atlantic.', impact: 'Global shipping routes disrupted; geopolitical scramble begins.' },
      { year: '1912', title: 'The Geothermal Grid Active', desc: 'Atlantean engineers reactivate the deep-sea thermal shafts, powering the sunken cities.', impact: 'Unlimited thermal energy and high-pressure steam.' },
      { year: '1915', title: 'Fluidic Logic Discovered', desc: 'Western scholars study Atlantean water-calculators, which use liquid flow instead of gears to compute.', impact: 'Birth of fluidic computer science.' },
      { year: '1920', title: 'The Treaty of Pontus', desc: 'Atlantis signs a trade pact with Britain and the US, exchanging thermal energy for coal and iron.', impact: 'Atlantis recognized as a sovereign nation.' },
      { year: '1928', title: 'Deep Sea Mining Booms', desc: 'Atlantean submersibles begin extraction of rare mineral nodules from the Mariana Trench.', impact: 'Oceanic copper and nickel prices crash.' },
      { year: '1935', title: 'The Tsunami Crisis', desc: 'A volcanic malfunction in the central thermal grid triggers a local sea-quake, flooding three outer domes.', impact: 'Reinforcement of the coastal seawalls.' }
    ],
    personas: [
      { name: 'Archon Thalassos', handle: 'atlantis_voice', role: 'POLITICIAN', bio: 'Archon of the High Hydrarchy Council. Guarding the thermal vents. The ocean is our shield.', interests: ['atlantis-defense', 'oceanography', 'thermal-energy'], personality: 'Noble, protective, speaks of the sea with deep reverence.' },
      { name: 'Dr. Arthur Sterling', handle: 'oceanic_engineer', role: 'SCIENTIST', bio: 'Royal Society scholar studying Atlantean fluidic logic and high-pressure bronze.', interests: ['fluidic-computers', 'deep-sea-diving', 'valves'], personality: 'Inquisitive, analytical, always wet from diving.' },
      { name: 'Captain Nemo II', handle: 'sub_explorer', role: 'INFLUENCER', bio: 'Commander of the deep submersible Nautilus. Exploring the ocean floor.', interests: ['diving', 'maritime-records', 'abyssal-creatures'], personality: 'Solitary, adventurous, posts pictures of glowing deep-sea fish.' },
      { name: 'Poseidon Ironworks', handle: 'poseidon_steel', role: 'BRAND', bio: 'Suppliers of pressure-resistant bronze plates, diving helmets, and hydraulic pumps.', interests: ['manufacturing', 'submersibles', 'metallurgy'], personality: 'Solid, commercial, aquatic.' },
      { name: 'The Atlantean Herald', handle: 'herald_daily', role: 'INFLUENCER', bio: 'Official updates from the Hydrarchy Council and the Atlantic shipping lanes.', interests: ['news', 'shipping-alerts', 'volcano-monitoring'], personality: 'Informative, official, alert.' },
      { name: 'Lady Coral', handle: 'abyssal_socialite', role: 'POLITICIAN', bio: 'Representative of the Oceanic Guilds. Fighting for sustainable mining.', interests: ['conservation', 'guild-rights', 'pearl-trade'], personality: 'Elegant, persuasive, passionate about marine life.' }
    ],
    posts: [
      { handle: 'atlantis_voice', content: 'The central thermal shafts are operating at peak capacity. Energy levels are stable. We will not open our inner channels to foreign warships.', media_type: 'TEXT', likes: 1540, reposts: 98 },
      { handle: 'oceanic_engineer', content: 'Testing a fluidic logic gate. By directing high-pressure water through micro-channels, we can perform addition without a single gear wheel!', media_type: 'IMAGE', likes: 1120, reposts: 145 },
      { handle: 'sub_explorer', content: 'Currently exploring the Mid-Atlantic Ridge at 8,000 feet. The hydrothermal vents are spewing superheated water. Rusted steel would crush; bronze holds.', media_type: 'IMAGE', likes: 2900, reposts: 560 },
      { handle: 'poseidon_steel', content: 'Our new Abyssal Diving Suit (Mark III) is cast from marine bronze. Rated to survive pressures up to 300 atmospheres. Order yours today.', media_type: 'IMAGE', likes: 450, reposts: 23 },
      { handle: 'herald_daily', content: 'SHIPPING ALERT: A massive ice field detected in the North Atlantic. Ships are advised to use the southern Atlantean shipping corridor.', media_type: 'TEXT', likes: 980, reposts: 210 },
      { handle: 'abyssal_socialite', content: 'Pearls harvested from the deep-sea trenches are showing a unique purple luster. The jewelry salon tonight will showcase the collection.', media_type: 'IMAGE', likes: 1340, reposts: 88 },
      { handle: 'atlantis_voice', content: 'Foreign corporations seek to buy mining leases on the ridge. They forget that the sea floor is the sovereign territory of the Council.', media_type: 'TEXT', likes: 1100, reposts: 74 },
      { handle: 'oceanic_engineer', content: 'The Atlantean water-calculators are remarkably fast. They use sea water as the computing medium. If we can prevent salt corrosion, it is perfect.', media_type: 'TEXT', likes: 890, reposts: 67 },
      { handle: 'sub_explorer', content: 'Spotted a giant squid near the Mariana Trench. It swam alongside the submersible for ten minutes, fascinated by the searchlights.', media_type: 'TEXT', likes: 3120, reposts: 450 },
      { handle: 'poseidon_steel', content: 'Need high-pressure valves? Poseidon Ironworks offers double-gate valves machined from marine brass. Tested in salt water for ten years.', media_type: 'TEXT', likes: 190, reposts: 5 },
      { handle: 'abyssal_socialite', content: 'Organizing a charity ball for families of miners lost in the volcanic shaft explosion. The Council must enforce better safety seals.', media_type: 'TEXT', likes: 820, reposts: 45 },
      { handle: 'herald_daily', content: 'WEATHER: High tide warnings issued for the outer Atlantean seawalls. Sea gates will be closed at dusk.', media_type: 'TEXT', likes: 1020, reposts: 90 }
    ],
    news: [
      { title: 'Hydrarchy Council Rejects Mining Leases', content: 'The High Council voted unanimously to reject bids from British and American mining syndicates seeking to lease thermal areas on the ridge.', category: 'POLITICS', publisher: 'Atlantis Gazette' },
      { title: 'Fluidic Logic Computers Run First Census', content: 'Atlantean scholars completed the national census in three days using water-flow logic mainframes, proving the speed of fluidic computing.', category: 'TECHNOLOGY', publisher: 'Scientific Atlantis' },
      { title: 'Submersible Exports Hit Record Highs', content: 'The Poseidon Ironworks reported a surge in orders for bronze deep-sea exploration vessels from marine research academies globally.', category: 'BUSINESS', publisher: 'Oceanic Trade Journal' },
      { title: 'Abyssal Seismograph Detects Vent Tremors', content: 'Seismic sensors near the central vent grid detected minor tremors yesterday, prompting engineers to adjust steam vent pressure valves.', category: 'SCIENCE', publisher: 'Seismic Log' },
      { title: 'Pearl Harvesting Guild Demands Safety Gear', content: 'Representatives of the diving guilds staged a march, calling for mandatory deployment of steam-powered air pumps during deep dives.', category: 'POLITICS', publisher: 'Diver Weekly' },
      { title: 'Deep Sea Flora Exhibited in New York', content: 'A botanical team from Atlantis opened a gallery in New York showing glowing deep-sea lichens cultivated in pressurized domes.', category: 'CULTURE', publisher: 'Times Tribune' }
    ],
    ads: [
      { company_name: 'Poseidon Ironworks', tagline: 'Master the abyssal depths.', description: 'Cast-bronze hulls, high-pressure viewing ports, and steam-driven propellers. Custom submersibles built to explore the ocean trenches.', price: '8,500 Dollars' },
      { company_name: 'Atlantean Pearl Guild', tagline: 'Pearls of the abyss.', description: 'Rare, purple murex-treated pearls harvested by deep-sea divers. Each pearl is hand-selected and polished by Atlantean artisans.', price: '150 Dollars/strand' },
      { company_name: 'Hydro-Logical Corp', tagline: 'Computation through water.', description: 'Fluidic logic gates, copper tubing, and micro-channel routing blocks. Build clean water-driven calculating units without cogs.', price: '45 Dollars' },
      { company_name: 'Abyssal Oil & Grease', tagline: 'Waterproof lubrication.', description: 'Heavy-duty grease formulated to resist washing away in high-pressure salt water. Essential for external gear shafts and diving hinges.', price: '3 Dollars/bucket' }
    ]
  },
  {
    id: 'aztec-world-id',
    name: 'Aztec Clockwork Hegemony',
    prompt: 'What if the Aztec Empire industrialized using volcanic energy and mechanical engines?',
    summary: 'The Triple Alliance repels European invasions by developing geothermal power from the Mexican Volcanic Belt, building copper-plated clockwork armor and mechanical calculating temples.',
    era: 'Mesoamerican Mechanical',
    tech_level: 'Geothermal volcanic pressure, copper gears, obsidian-tipped pistons',
    gov_type: 'Triple Alliance Syndicate',
    events: [
      { year: '1520', title: 'The Spanish Repelled', desc: 'Tenochtitlan deploys early steam-driven copper throwers, sinking the Spanish ships on the lake.', impact: 'Spanish colonization defeated.' },
      { year: '1550', title: 'The Volcano Shafts Activated', desc: 'Priest-engineers drill shafts into Popocatépetl, capturing steam pressure.', impact: 'Abundant geothermal energy for Tenochtitlan.' },
      { year: '1600', title: 'The Great Copper Canal Grid', desc: 'A network of copper steam pipes and canal routers is constructed across the Valley of Mexico.', impact: 'Eighty chinampas gardens automated via steam pumps.' },
      { year: '1680', title: 'The Jaguar Mech Division', desc: 'Establishment of the military division utilizing clockwork armor plated in gold and copper.', impact: 'Border defenses solidified against northern tribes.' },
      { year: '1750', title: 'Sun Stone Calculator Online', desc: 'A massive circular calculator (30ft diameter) made of obsidian and copper gears is dedicated.', impact: 'Solar calendars and tax records automated.' },
      { year: '1820', title: 'Pax Anahuac Declared', desc: 'The Triple Alliance establishes trade relays linking Central and South America.', impact: 'Mesoamerican mechanical sphere secured.' }
    ],
    personas: [
      { name: 'Dr. Tlaloc', handle: 'rain_engineer', role: 'SCIENTIST', bio: 'Grand mechanic of the Tenochtitlan steam canals. Calibrating the copper pumps.', interests: ['hydraulics', 'geothermal-power', 'obsidian-cutters'], personality: 'Scientific, devout, believes steam is the breath of the rain god.' },
      { name: 'Lord Montezuma XI', handle: 'hegemony_voice', role: 'POLITICIAN', bio: 'Speaker of the Triple Alliance Syndicate. Gold, copper, and volcanic power. Anahuac stands tall.', interests: ['alliance-politics', 'gold-ledgers', 'obsidian-trade'], personality: 'Imperial, proud, speaks with high Nahuatl metaphors.' },
      { name: 'Jaguar Warrior Cuauhtémoc', handle: 'jaguar_mech', role: 'INFLUENCER', bio: 'Operator of the copper-plated clockwork armor "Sun Eagle". Defender of the lake.', interests: ['combat-drills', 'gear-maintenance', 'obsidian-swords'], personality: 'Discipline, warrior-spirit, posts videos of clockwork weapon sweeps.' },
      { name: 'Tenochtitlan Foundry', handle: 'tenoch_foundry', role: 'BRAND', bio: 'Suppliers of volcanic copper gears, steam valves, and obsidian piston linings.', interests: ['copper-casting', 'metallurgy', 'volcanic-drilling'], personality: 'Ancient, industrial, guild-focused.' },
      { name: 'The Sun Stone Ticker', handle: 'alliance_gazette', role: 'INFLUENCER', bio: 'Official updates from the Speaker\'s office and the volcanic power grids.', interests: ['news', 'volcano-monitoring', 'crop-yields'], personality: 'Official, respectful, alert.' },
      { name: 'Priestess Xochitl', handle: 'calendar_computer', role: 'SCIENTIST', bio: 'Operator of the Sun Stone calculating mainframe. Mapping the 52-year cycle.', interests: ['astronomy', 'calendars', 'mechanical-cycles'], personality: 'Quiet, mystical, obsessed with cycles.' }
    ],
    posts: [
      { handle: 'rain_engineer', content: 'The lake level has stabilized. Our geothermal-driven copper pumps are lifting 500 gallons of water per minute to the chinampas. The crops are secure.', media_type: 'TEXT', likes: 1120, reposts: 74 },
      { handle: 'hegemony_voice', content: 'A message to the Northern Merchants: Tenochtitlan will not tolerate the smuggling of untested boilers. Volcanic power must remain certified.', media_type: 'TEXT', likes: 2540, reposts: 180 },
      { handle: 'jaguar_mech', content: 'Polished the copper claws on the Sun Eagle mech. The clockwork mainspring is wound to maximum tension. Ready to patrol the eastern causeway.', media_type: 'IMAGE', likes: 1980, reposts: 340 },
      { handle: 'tenoch_foundry', content: 'Announcing our new Obsidian-Lined Piston Sleeves. Reduces friction by 40% and withstands geothermal steam temperatures up to 800 degrees.', media_type: 'IMAGE', likes: 430, reposts: 15 },
      { handle: 'alliance_gazette', content: 'VOLCANO REPORT: Minor pressure release recorded at Popocatépetl. Geothermal grid operators adjusted steam valves to handle the surge.', media_type: 'TEXT', likes: 980, reposts: 110 },
      { handle: 'calendar_computer', content: 'The Sun Stone calculator has completed compiling the solar calendar for the next cycle. No logic errors detected in the obsidian wheels.', media_type: 'IMAGE', likes: 1780, reposts: 210 },
      { handle: 'rain_engineer', content: 'Someone mixed river sand with the pump lubricant! The copper gears are grinding. Clean the axles immediately.', media_type: 'TEXT', likes: 320, reposts: 8 },
      { handle: 'hegemony_voice', content: 'Our alliance stands strong. The gold ledgers show record trade surpluses with the Mayan copper guilds. Prosperity through industry.', media_type: 'TEXT', likes: 1890, reposts: 120 },
      { handle: 'jaguar_mech', content: 'Currently patrolled near Texcoco. The water-steam vents are roaring. The lake is beautiful under the rising sun. #PaxAnahuac', media_type: 'TEXT', likes: 1450, reposts: 98 },
      { handle: 'tenoch_foundry', content: 'Need high-grade copper wire? We supply drawn wire from the Michoacán mines, perfect for astrolabe relays and mechanical calendars.', media_type: 'TEXT', likes: 190, reposts: 4 },
      { handle: 'calendar_computer', content: 'To trace the path of the stars is to understand the clockwork of the gods. The gears of the mainframe are the fingers of time.', media_type: 'TEXT', likes: 1220, reposts: 90 },
      { handle: 'alliance_gazette', content: 'SPORTS: The Tenochtitlan Ball Club defeats the Tlaxcala Steamers in the low-gravity rubber ball tournament. Celebration at the Palace.', media_type: 'TEXT', likes: 1560, reposts: 230 }
    ],
    news: [
      { title: 'Speaker Approves Geothermal Expansions', content: 'Lord Montezuma approved funding to drill three new steam-shafts near the volcanic ridge, boosting industrial power by 30%.', category: 'POLITICS', publisher: 'Tenochtitlan Chronicle' },
      { title: 'Sun Stone Computes Solar Alignments', content: 'Astronomers completed mapping the solstice alignments using the central obsidian calculating stone, verifying calendar accuracy.', category: 'SCIENCE', publisher: 'Alliance Academy' },
      { title: 'Mayan Copper Shipments Reach Tenochtitlan', content: 'A cargo fleet carrying 200 tons of high-grade copper arrived from Yucatán yesterday, destined for the military mech foundries.', category: 'BUSINESS', publisher: 'Trade Gazette' },
      { title: 'Geothermal Valve Malfunction Resolved', content: 'Technicians successfully replaced a damaged volcanic valve in the industrial sector, preventing a localized pressure explosion.', category: 'TECHNOLOGY', publisher: 'Steam Monitor' },
      { title: 'Featherwork Steam Capes Popular in Court', content: 'Fashion reviews highlight the popularity of capes woven from quetzal feathers and copper wire, designed to shield against steam moisture.', category: 'CULTURE', publisher: 'Palace Review' },
      { title: 'Lake Texcoco Aqueducts Fully Mechanized', content: 'The Ministry of Agriculture confirmed that all major canals have been equipped with steam-driven gates, streamlining irrigation.', category: 'SCIENCE', publisher: 'Nile Observer' }
    ],
    ads: [
      { company_name: 'Tenochtitlan Foundry', tagline: 'Volcanic copper, forged to last.', description: 'Copper gears, bronze valves, and obsidian-tipped pistons. Certified to withstand the intense heat of volcanic steam grids.', price: '15 gold cacao' },
      { company_name: 'Tenochtitlan Steam Canals', tagline: 'Clean power for Anahuac.', description: 'Providing geothermal steam lines and automatic irrigation gates to landowners. Boost your crop yield on the chinampas today.', price: '5 gold cacao/mo' },
      { company_name: 'Jaguar Mech Armor', tagline: 'Shielding the Empire.', description: 'Copper-plated clockwork armor frames. Equipped with pneumatic arm-mounts for obsidian swords. Trusted by the Triple Alliance.', price: '120 gold cacao' },
      { company_name: 'Tenochtitlan Inks', tagline: 'Inks of royal decree.', description: 'Quick-drying black ink formulated from volcanic ash and copal resin. Perfect for painting codex rolls and punch-sheets.', price: '2 gold cacao' }
    ]
  },
  {
    id: 'napoleon-world-id',
    name: 'Napoleon\'s Analytical Armée',
    prompt: 'What if Babbage\'s computer was funded by Napoleon in 1815?',
    summary: 'Napoleon Bonaparte wins the Battle of Waterloo by using Babbage\'s early Analytical Engines to coordinate troop movements, calculate artillery angles, and intercept British coded letters.',
    era: 'Napoleonic Brass Era',
    tech_level: 'Artillery calculation engines, mechanical field telegraphs, brass punch-cards',
    gov_type: 'Imperial Directorate',
    events: [
      { year: '1815', title: 'Waterloo Won by Calculations', desc: 'Napoleon deploys the prototype "Lovelace-Babbage Arithmetic Carriage" to compute British positions and coordinate reinforcements.', impact: 'Waterloo ends in French victory.' },
      { year: '1818', title: 'The Paris Mainframe Centralized', desc: 'Bonaparte orders the construction of a massive calculation center in the Louvre, containing 10,000 brass gears.', impact: 'Imperial administration automated.' },
      { year: '1825', title: 'The Mechanical Semaphore Net', desc: 'Deployment of mechanical optical towers across Europe, translating signals into punch-cards.', impact: 'Message transit times across Europe drop to under an hour.' },
      { year: '1835', title: 'The Code Napoleon (Digital)', desc: 'The legal code is adapted into standard punch-card formats, allowing court clerks to calculate sentences.', impact: 'Automated legal processing established.' },
      { year: '1848', title: 'The Iron Guild Revolts', desc: 'French coal miners strike, shutting down the boilers of the semaphore mainframes.', impact: 'Establishment of the Imperial Military Grid.' },
      { year: '1855', title: 'Pax Napoleonica Declared', desc: 'The French Empire locks down European borders, monitoring shipping and populations via Babbage grids.', impact: 'French hegemony solidified.' }
    ],
    personas: [
      { name: 'Dr. Jean-Pierre Lovelace', handle: 'imperial_calculator', role: 'SCIENTIST', bio: 'Directing the Louvre calculation mainframe. Calculating trajectories for the Emperor. Vive la Science.', interests: ['ballistics', 'gear-ratios', 'cryptography'], personality: 'Patriotic, highly mathematical, proud of French scientific superiority.' },
      { name: 'Marshal Ney', handle: 'grand_marshal', role: 'POLITICIAN', bio: 'Commander of the Grand Armée. Coordination through calculation. Cavalry and cogs.', interests: ['cavalry-tactics', 'semaphore-relays', 'military-orders'], personality: 'Fiery, authoritative, values speed and coordination.' },
      { name: 'Pierre the Ticker Operator', handle: 'semaphore_surveyor', role: 'INFLUENCER', bio: 'Grid surveyor. Maintaining the optical relays on the Eiffel line. High visibility warning.', interests: ['optical-comms', 'mechanical-clocks', 'climbing'], personality: 'Energetic, brave, posts photos of countryside from high towers.' },
      { name: 'Louvre Ironworks', handle: 'louvre_foundry', role: 'BRAND', bio: 'Official providers of brass gearsets, artillery punch-cards, and high-pressure steam boilers.', interests: ['manufacturing', 'defense-contracts', 'industry'], personality: 'Stately, corporate, patriotic.' },
      { name: 'The Parisian Moniteur', handle: 'moniteur_daily', role: 'INFLUENCER', bio: 'Official updates from the Emperor\'s press office and the European semaphore net.', interests: ['news', 'military-campaigns', 'state-events'], personality: 'Official, respectful, alert.' },
      { name: 'Lady Josephine', handle: 'imperial_socialite', role: 'POLITICIAN', bio: 'Hostess of the Grand Salon. Keeping French culture alive on the wire.', interests: ['high-fashion', 'salon-debates', 'political-gossip'], personality: 'Polished, traditionalist, values absolute order.' }
    ],
    posts: [
      { handle: 'imperial_calculator', content: 'Completed the ballistics table for the 12-pounder cannons. Artillery coordinates can now be calculated in under 30 seconds. Vive l\'Empereur!', media_type: 'TEXT', likes: 1120, reposts: 74 },
      { handle: 'grand_marshal', content: 'All semaphore lines are synchronized. The Division at Berlin has received the orders to reinforce the Rhine. Speed is our weapon.', media_type: 'TEXT', likes: 2540, reposts: 180 },
      { handle: 'semaphore_surveyor', content: 'Climbed the optical tower at Strasbourg to clear snow from the shutter gears. The view of the Rhine is magnificent.', media_type: 'IMAGE', likes: 1980, reposts: 340 },
      { handle: 'louvre_foundry', content: 'Announcing our new Brass Gearsets (Grade A). Machined to 0.01mm tolerance. Guaranteed to prevent jam-ups in high-priority semaphore arrays.', media_type: 'IMAGE', likes: 430, reposts: 15 },
      { handle: 'moniteur_daily', content: 'ALERT: The Emperor has decorated the lead engineer of the Louvre Mainframe with the Legion of Honor. Science fuels the Empire.', media_type: 'TEXT', likes: 980, reposts: 110 },
      { handle: 'imperial_socialite', content: 'The Salon tonight was filled with debate about the new Legal Punch-Card system. Some fear the machines will replace human judges.', media_type: 'IMAGE', likes: 1780, reposts: 210 },
      { handle: 'imperial_calculator', content: 'If the parity holes are not verified, the calculations will slip. Oiling paper fiber out of the reader is a chore.', media_type: 'TEXT', likes: 320, reposts: 8 },
      { handle: 'grand_marshal', content: 'Security demands all optical transmissions be checked by the Imperial Censors. Order must be maintained.', media_type: 'TEXT', likes: 1890, reposts: 120 },
      { handle: 'semaphore_surveyor', content: 'The gear teeth on the shutter lines keep freezing. We are applying grease mixed with whale oil antifreeze.', media_type: 'TEXT', likes: 1450, reposts: 98 },
      { handle: 'louvre_foundry', content: 'Need custom punch-cards for your ledger calculations? Louvre Ironworks offers premium cardstock resistant to humidity and ink smudges.', media_type: 'TEXT', likes: 190, reposts: 4 },
      { handle: 'imperial_socialite', content: 'Spotted Baroness Sterling dining with the lead engineer of BabbageCorp. Are coal tariffs about to shift?', media_type: 'TEXT', likes: 1220, reposts: 90 },
      { handle: 'moniteur_daily', content: 'GLADIATORIAL UPDATE: Spartacus II wins the grand digital simulation tournament at the Colosseum. Imperial crowd goes wild.', media_type: 'TEXT', likes: 1560, reposts: 230 }
    ],
    news: [
      { title: 'Louvre Mainframe Expands Calculation Hall', content: 'The Louvre opened a new wing yesterday housing 150 bronze calculating engines, dedicated to mapping the stars.', category: 'TECHNOLOGY', publisher: 'Library Scroll' },
      { title: 'French Artillery Coordinates Automated', content: 'Military engineers tested an armored carriage powered by high-pressure steam, setting a new record for land speed.', category: 'SCIENCE', publisher: 'Military Mechanics' },
      { title: 'Coal Prices Surge Amid Steam Grid Growth', content: 'Coal stocks hit record highs on the London Exchange as calculation servers demand thousands of tons of high-grade anthracite weekly.', category: 'BUSINESS', publisher: 'Imperial Trade Review' },
      { title: 'Pneumatic Tube Networks Reach Strasbourg', content: 'Strasbourg has officially joined the Imperial Pneumatic Ring. Correspondence can now reach Paris in under four minutes through deep-sea copper pipelines.', category: 'SCIENCE', publisher: 'The Scientific Observer' },
      { title: 'Socio-Mechanical Lectures Draw Crowds', content: 'Professor Ada Lovelace filled the Royal Lecture Hall yesterday, detailing the psychological impacts of constant telegraphic dispatches on the human mind.', category: 'CULTURE', publisher: 'The Athenaeum' },
      { title: 'Automated Census Declared Complete', content: 'The Home Office announced that the 1850 national census has been processed in just three weeks using mechanical card counters, proving engine efficiency.', category: 'POLITICS', publisher: 'The Daily Chronicle' }
    ],
    ads: [
      { company_name: 'Louvre Foundry', tagline: 'Precision in every tooth.', description: 'Brass gears, bronze valves, and high-pressure steam boilers. Standardized sizes for all karakuri and clockwork engines.', price: '12 francs' },
      { company_name: 'Imperial Telegraph', tagline: 'Connecting the Empire.', description: 'Tired of slow carrier pigeons? Send your documents through our high-velocity pneumatic copper tubes. Delivering across Paris in seconds.', price: '5 Shillings/oz' },
      { company_name: 'Parisian Coal Guild', tagline: 'Fueling alternate history.', description: 'Keep your computation boilers burning clean. We supply double-washed anthracite coal directly to residential server cells.', price: '2 francs/bag' },
      { company_name: 'Lovelace Coding Inks', tagline: 'Ink that stays where it belongs.', description: 'Special quick-drying formula designed specifically for automatic punch-card printers. Prevents reading holes from clogging with fibers.', price: '1 Shilling/bottle' }
    ]
  },
  {
    id: 'lunar-world-id',
    name: 'Lunar Coal Armada',
    prompt: 'What if the Victorian Space Race began in 1870 with steam rockets?',
    summary: 'The British Empire and the German Kaiser launch coal-fired steam rockets to the Moon in 1870, establishing rival mining outposts and competing for lunar mineral rights.',
    era: 'Selenite Steampunk',
    tech_level: 'Steam propulsion rockets, pressurized brass space suits, lunar steam-crawlers',
    gov_type: 'Space Chartered Companies',
    events: [
      { year: '1870', title: 'The First Lunar Launch', desc: 'The British Royal Space Society launches the coal-powered rocket "Goliath", landing on the Moon.', impact: 'Lunar space race begins.' },
      { year: '1875', title: 'Outpost Selene Established', desc: 'British astronauts construct a pressurized brass dome in the Mare Imbrium.', impact: 'First permanent lunar settlement.' },
      { year: '1880', title: 'Kaiser Outpost Online', desc: 'Germany launches the "Barbarossa", establishing a rival outpost in the Copernicus Crater.', impact: 'Lunar territory divided.' },
      { year: '1890', title: 'The Selenite Conflict', desc: 'Skirmishes break out near the lunar water ice deposits, with armored crawlers exchanging shots.', impact: 'Space weaponization treaty signed.' },
      { year: '1900', title: 'Lunar Water Pipeline Active', desc: 'A pipeline brings water from the polar ice caps to the equatorial outposts.', impact: 'Lunar dome farming established.' },
      { year: '1910', title: 'The Chartered Lunar Syndicate', desc: 'Global powers sign a pact restricting space frequencies to prevent permanent space storms.', impact: 'Aetheric channels divided among five major corporations.' }
    ],
    personas: [
      { name: 'Dr. Arthur Sterling', handle: 'lunar_engineer', role: 'SCIENTIST', bio: 'Chief Architect of the Selene Domes. Keeping the pressure levels stable. Steel and steam.', interests: ['pressurization', 'steam-propulsion', 'astronomy'], personality: 'Cautious, precise, obsessed with dome integrity.' },
      { name: 'Captain Timothy O\'Connor', handle: 'lunar_patrol', role: 'INFLUENCER', bio: 'Royal Selenite Rifles. Patrolling the lunar wastes in my steam-crawler.', interests: ['crawler-combat', 'low-gravity-tactics', 'whiskey'], personality: 'Rugged, weary, homesick for green Irish rain.' },
      { name: 'Director Hoover', handle: 'lunar_finance', role: 'POLITICIAN', bio: 'Chairman of the Selene Syndicate. We control the water, we control the world.', interests: ['monopolies', 'space-tariffs', 'syndicates'], personality: 'Ruthless, calculating, speaks in terms of raw gallons.' },
      { name: 'Selene Ironworks', handle: 'lunar_steel', role: 'BRAND', bio: 'Suppliers of pressure-resistant brass plates, space suits, and steam-crawler parts.', interests: ['manufacturing', 'space-suits', 'metallurgy'], personality: 'Solid, commercial, Selenite.' },
      { name: 'The Selene Herald', handle: 'lunar_gazette', role: 'INFLUENCER', bio: 'Official updates from the Selene Syndicate and the lunar shipping lanes.', interests: ['news', 'shipping-alerts', 'weather-monitoring'], personality: 'Informative, official, alert.' },
      { name: 'Lady Gwendolyn', handle: 'lunar_socialite', role: 'POLITICIAN', bio: 'Hostess of the Grand Glass Salon. Keeping Earth fashions alive on the lunar wastes.', interests: ['high-fashion', 'salon-debates', 'luxury-imports'], personality: 'Elitist, witty, obsessed with imported champagne.' }
    ],
    posts: [
      { handle: 'lunar_engineer', content: 'The pressure inside Dome A is holding stable at 1.0 atmospheres. Boiler levels are optimal. The coal reserves are secure.', media_type: 'TEXT', likes: 1100, reposts: 90 },
      { handle: 'lunar_patrol', content: 'Patrolling the Copernicus Crater. A massive dust storm is blowing in from the south. Visibility is zero; sealing the pilot cabin.', media_type: 'IMAGE', likes: 1890, reposts: 410 },
      { handle: 'lunar_finance', content: 'Water rates will be adjusted next week. Domes that fail to hit their copper quotas will see their water allocations reduced.', media_type: 'TEXT', likes: 3400, reposts: 180 },
      { handle: 'lunar_steel', content: 'Our new Abyssal Space Suit (Mark III) is cast from marine bronze. Rated to survive pressures up to 3 atmospheres. Order yours today.', media_type: 'IMAGE', likes: 430, reposts: 12 },
      { handle: 'lunar_gazette', content: 'ALERT: A leak has been detected in Biodome 4 of New London. Repair crews are deployed. Citizens are advised to keep their pressure suits close.', media_type: 'TEXT', likes: 1450, reposts: 290 },
      { handle: 'lunar_socialite', content: 'Just received a shipment of fresh lavender from Earth! The scent makes one forget the rusted iron hills outside the glass.', media_type: 'IMAGE', likes: 2310, reposts: 310 },
      { handle: 'lunar_engineer', content: 'Some scholars argue that mechanical spirits live in the boilers. I tell them it is just heat, water, and ratio. Demystify the gear.', media_type: 'TEXT', likes: 980, reposts: 74 },
      { handle: 'lunar_patrol', content: 'Tuning the boiler on my Mark III Walker. The steam lines keep freezing in the Selenite night. Needs more alcohol antifreeze.', media_type: 'TEXT', likes: 1120, reposts: 90 },
      { handle: 'lunar_finance', content: 'Earth politicians demand we drop copper tariffs. They forget who paid for the coal-propelled launch rigs. Mars belongs to the pioneers.', media_type: 'TEXT', likes: 1890, reposts: 120 },
      { handle: 'lunar_steel', content: 'Secure your oxygen valves. Our brass-machined double-flange seals prevent decompression even at 0.05 atmospheres. Buy local, buy Selene.', media_type: 'TEXT', likes: 190, reposts: 3 },
      { handle: 'lunar_socialite', content: 'A fascinating salon tonight. The Baron got into a heated debate with Dr. Brand regarding terraforming ethics. A duel was narrowly avoided!', media_type: 'TEXT', likes: 820, reposts: 45 },
      { handle: 'lunar_gazette', content: 'SPORTS: The Royal Cricket Club of Mars defeats the Berlin Aeronauts in the low-gravity dome tournament. A triumph for the Empire.', media_type: 'TEXT', likes: 1220, reposts: 88 }
    ],
    news: [
      { title: 'Selene Outpost Suffers Pressure Drop', content: 'A seal failure in the industrial sector of Selene caused a brief 15% drop in atmospheric pressure yesterday. The leak has been welded.', category: 'POLITICS', publisher: 'The Selene Daily' },
      { title: 'Ice Cap Pipeline Reaches Syrtis Major', content: 'Martian engineers confirmed that the first flow of water from the northern ice cap reached the Syrtis Major agricultural dome early this morning.', category: 'SCIENCE', publisher: 'Martian Scientific Journal' },
      { title: 'Copper Exports Halt Due to Earth Tariff Dispute', content: 'The Mars Barons Council announced a temporary embargo on copper shipping until the British Parliament reduces the import duty on Martian ore.', category: 'BUSINESS', publisher: 'Martian Merchant' },
      { title: 'Dust Storm Warnings Issued for Equatorial Sectors', content: 'Atmospheric sensors indicate a massive, planetary-scale dust storm originating in the Hellas Basin, expected to block solar-steam collectors.', category: 'TECHNOLOGY', publisher: 'The Weather Ticker' },
      { title: 'Low-Gravity Opera Debuts in Dome 3', content: 'A theatrical troupe from Vienna wowed audiences in Dome 3 last night, performing a low-gravity ballet that showcased gravity-defying leaps.', category: 'CULTURE', publisher: 'Martian Arts Review' },
      { title: 'Coal Transport Rocket Lands at Phobos Dock', content: 'The cargo liner HMS Behemoth arrived from Earth today, carrying 15,000 tons of high-grade Welsh coal to fuel the Martian heating grids.', category: 'BUSINESS', publisher: 'The Shipping Log' }
    ],
    ads: [
      { company_name: 'Selene Ironworks', tagline: 'Built for the lunar wastes.', description: 'Heavy-duty steel plates, structural girders, and high-pressure dome rivets. Our materials are treated with manganese to resist oxidation in the Martian soil.', price: '12 Sovereigns/ton' },
      { company_name: 'Oxygen-Grid Services', tagline: 'Breathe easy.', description: 'Providing clean, scrubbed air directly to your household dome. Free maintenance on all carbon dioxide scrubbers with our annual plan.', price: '8 Guineas/mo' },
      { company_name: 'Martian Crawler Co.', tagline: 'Master the red sands.', description: 'Six-legged steam crawlers equipped with insulated boilers, searchlights, and dual-action sand treads. Conquers any canyon.', price: '450 Sovereigns' },
      { company_name: 'Dome-Grow Fertilizers', tagline: 'Harvesting the waste.', description: 'Rich phosphorus mix formulated specifically for growing crops in Martian iron-rich soil. Boosts wheat yield by 40% under glass.', price: '15 Shillings/bag' }
    ]
  }
];

export const MOCK_WORLDS: World[] = TEMPLATES.map(t => ({
  id: t.id,
  prompt: t.prompt,
  name: t.name,
  summary: t.summary,
  era: t.era,
  tech_level: t.tech_level,
  gov_type: t.gov_type,
  status: 'ready',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  events: t.events.map((e, idx) => ({
    id: `mock-event-${t.id}-${idx}`,
    world_id: t.id,
    year: e.year,
    title: e.title,
    description: e.desc,
    impact: e.impact
  }))
}));

export function getMockWorld(id: string): World | undefined {
  return MOCK_WORLDS.find(w => w.id === id);
}

export function getMockPersonas(worldId: string): Persona[] {
  const template = TEMPLATES.find(t => t.id === worldId);
  if (!template) return [];
  return template.personas.map((p, idx) => ({
    id: `mock-pers-${worldId}-${idx}`,
    world_id: worldId,
    name: p.name,
    handle: p.handle,
    avatar: '',
    bio: p.bio,
    role: p.role,
    followers_count: 4500 + (idx * 1500),
    following_count: 120 + (idx * 45),
    influence_score: 65 + (idx * 5),
    interests: p.interests,
    personality: p.personality
  }));
}

export function getMockPersona(personaId: string) {
  // Extract worldId from mock-pers-[worldId]-[index]
  const match = personaId.match(/^mock-pers-([a-z-0-9]+)-\d+$/);
  if (!match) return undefined;
  const worldId = match[1];
  const personas = getMockPersonas(worldId);
  const persona = personas.find(p => p.id === personaId);
  if (!persona) return undefined;
  
  // Attach posts
  const posts = getMockFeed(worldId).posts.filter(p => p.persona_id === personaId);
  return { ...persona, posts };
}

export function getMockFeed(worldId: string) {
  const template = TEMPLATES.find(t => t.id === worldId);
  if (!template) return { posts: [], hasMore: false, nextCursor: null };
  const personas = getMockPersonas(worldId);
  const posts: Post[] = template.posts.map((p, idx) => {
    const persona = personas.find(pers => pers.handle === p.handle) || personas[0];
    return {
      id: `mock-post-${worldId}-${idx}`,
      world_id: worldId,
      persona_id: persona.id,
      content: p.content,
      media_url: p.media_type === 'IMAGE' 
        ? `https://image.pollinations.ai/prompt/${encodeURIComponent(p.content)}?width=600&height=400&nologo=true&enhance=true`
        : null,
      media_type: p.media_type,
      likes_count: p.likes,
      reposts_count: p.reposts,
      created_at: new Date(Date.now() - (idx * 3600000)).toISOString(),
      persona: {
        id: persona.id,
        name: persona.name,
        handle: persona.handle,
        avatar: '',
        role: persona.role,
        influence_score: persona.influence_score
      }
    };
  });
  return { posts, hasMore: false, nextCursor: null };
}

export function getMockNews(worldId: string): News[] {
  const template = TEMPLATES.find(t => t.id === worldId);
  if (!template) return [];
  return template.news.map((n, idx) => ({
    id: `mock-news-${worldId}-${idx}`,
    world_id: worldId,
    title: n.title,
    content: n.content,
    category: n.category,
    publisher: n.publisher,
    created_at: new Date(Date.now() - (idx * 4800000)).toISOString(),
    image_url: `https://image.pollinations.ai/prompt/${encodeURIComponent(n.title)}?width=600&height=350&nologo=true&enhance=true`
  }));
}

export function getMockAds(worldId: string): Ad[] {
  const template = TEMPLATES.find(t => t.id === worldId);
  if (!template) return [];
  return template.ads.map((a, idx) => ({
    id: `mock-ad-${worldId}-${idx}`,
    world_id: worldId,
    company_name: a.company_name,
    tagline: a.tagline,
    description: a.description,
    image_url: `https://image.pollinations.ai/prompt/${encodeURIComponent(a.company_name + ' ' + a.tagline)}?width=600&height=350&nologo=true&enhance=true`,
    price: a.price,
    created_at: new Date(Date.now() - (idx * 7200000)).toISOString()
  }));
}

export function getMockComments(postId: string): Comment[] {
  // Extract worldId and post index from mock-post-[worldId]-[index]
  const match = postId.match(/^mock-post-([a-z-0-9]+)-(\d+)$/);
  if (!match) return [];
  const worldId = match[1];
  const postIdx = parseInt(match[2], 10);
  const personas = getMockPersonas(worldId);
  
  const commentTemplates = [
    {
      SCIENTIST: 'An elegant hypothesis. Have you calibrated the pressure sensors on the secondary cylinders?',
      POLITICIAN: 'This development merits careful regulation by the Council. Order must be maintained.',
      INFLUENCER: 'Absolutely spectacular! The brass finish on these assemblies is gorgeous. #Mechanics',
      BRAND: 'Contact our office for industrial cogwheel polish to keep your computing lattices running clean!'
    },
    {
      SCIENTIST: 'My calculations confirm your results. The mathematical purity of the gear ratios is undeniable.',
      POLITICIAN: 'This could shift the balance of trade in the provinces. We must prepare legislation.',
      INFLUENCER: 'I am sharing this signal instantly. Everyone needs to read this dispatch!',
      BRAND: 'Get the best rates on raw copper rods and vulcanized shielding at our local foundries!'
    },
    {
      SCIENTIST: 'Fascinating. But does it account for the friction coefficient of steam condensation at high altitudes?',
      POLITICIAN: 'National progress requires this grid to expand. Security is the foundation of the State.',
      INFLUENCER: 'Stunning engineering. I need to visit the main calculation Bureau myself soon!',
      BRAND: 'Our premium spring valves are back in stock. Guaranteed leak-free operation up to 500 PSI.'
    }
  ];

  // Pick 3 commenters from the other personas
  const comments: Comment[] = [];
  const startIdx = (postIdx * 3) % personas.length;
  
  for (let c = 0; c < 3; c++) {
    const commenter = personas[(startIdx + c) % personas.length];
    const role = commenter.role;
    const templateGroup = commentTemplates[c % commentTemplates.length];
    const content = templateGroup[role as keyof typeof templateGroup] || 'Fascinating dispatches indeed.';
    
    comments.push({
      id: `mock-comment-${postId}-${c}`,
      post_id: postId,
      persona_id: commenter.id,
      content,
      likes_count: 42 + (c * 87),
      created_at: new Date(Date.now() - (c * 1800000)).toISOString(),
      persona: commenter
    });
  }
  
  return comments;
}

export function getMockOperatorPersona(worldId: string): OperatorPersona | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(`chronos-operator-${worldId}`);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as OperatorPersona;
  } catch {
    return null;
  }
}

export function createMockOperatorPersona(worldId: string, role: string): OperatorPersona {
  const template = TEMPLATES.find(t => t.id === worldId);
  const era = template ? template.era : 'Alternate Era';
  
  let name = '';
  let handle = '';
  let bio = '';
  let customStatLabel = '';
  let customStatValue = 75;

  const cleanRole = role.toUpperCase() as OperatorRole;

  switch (cleanRole) {
    case 'CITIZEN':
      name = 'Observer Agent';
      handle = 'chronos_spectator';
      bio = `Decoupled from standard chronological stream. Documenting the social dispatches of this ${era} reality.`;
      customStatLabel = 'Observational Parity';
      break;
    case 'TECHNOLOGIST':
      name = 'Lattice Compiler';
      handle = 'grid_compiler';
      bio = `Compiling the primary analytical matrices. Developing localized nodes for the global computational grid.`;
      customStatLabel = 'Calculation Output';
      break;
    case 'REBEL':
      name = 'Faction Leader';
      handle = 'dissident_press';
      bio = `Injecting unofficial signals into the censored networks. We will reclaim control over our timelines!`;
      customStatLabel = 'Revolution Friction';
      break;
    case 'IMPERIAL':
      name = 'Ministry Surveyor';
      handle = 'crown_auditor';
      bio = `Official observer delegated by the High Directorate. Auditing chronological stability and public fealty.`;
      customStatLabel = 'Crown Fealty';
      break;
  }

  if (worldId === 'roman-world-id') {
    if (cleanRole === 'REBEL') {
      name = 'Tribune Appius V';
      handle = 'plebs_voice';
      bio = `Broadcasting illegal aetherwire streams from the sub-forum insulae. Down with Senatorial geothermal hoarding!`;
    } else if (cleanRole === 'TECHNOLOGIST') {
      name = 'Julius the Mechanician';
      handle = 'aether_coder';
    } else if (cleanRole === 'IMPERIAL') {
      name = 'Aurelius Prefect';
      handle = 'praetorian_eye';
    }
  } else if (worldId === 'stub-world-id') {
    if (cleanRole === 'REBEL') {
      name = 'Silas the Luddite';
      handle = 'cog_striker';
    } else if (cleanRole === 'TECHNOLOGIST') {
      name = 'Ada Apprentice';
      handle = 'steam_logic_dev';
    } else if (cleanRole === 'IMPERIAL') {
      name = 'Lord Sterling Auditor';
      handle = 'royal_censor';
    }
  } else if (worldId === 'mars-world-id') {
    if (cleanRole === 'REBEL') {
      name = 'Miner Jack';
      handle = 'oxygen_stealer';
    } else if (cleanRole === 'TECHNOLOGIST') {
      name = 'Navigator Evans';
      handle = 'sand_filterer';
    } else if (cleanRole === 'IMPERIAL') {
      name = 'Deputy Klausen';
      handle = 'dome_enforcer';
    }
  }

  const newPersona: OperatorPersona = {
    id: 'operator',
    world_id: worldId,
    name,
    handle,
    avatar: '',
    bio,
    role: cleanRole,
    followers_count: 8400,
    following_count: 210,
    influence_score: 72,
    custom_stat_label: customStatLabel,
    custom_stat_value: customStatValue,
    created_at: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(`chronos-operator-${worldId}`, JSON.stringify(newPersona));
  }

  return newPersona;
}

