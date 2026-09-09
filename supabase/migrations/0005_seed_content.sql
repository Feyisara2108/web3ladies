-- Web3Ladies — seed observable content (Phase 6)
-- Content + asset paths reproduce the live site (see docs/live-content-reference.md).
-- Images reference files committed to /public/assets (served by Next at /assets/...).
-- Idempotent: clears these content tables then re-inserts. Safe to re-run BEFORE
-- admins start creating their own records (it resets content rows only).

begin;

truncate table
  public.featured_items,
  public.impact_stats,
  public.social_proof,
  public.partners,
  public.testimonials,
  public.founder_story
restart identity;

-- Featured ("What's happening") ---------------------------------------------
insert into public.featured_items (title, description, category, cta_label, cta_url, position) values
('Web3 x AI Venture Builder — Now Open', 'Our flagship program is accepting applications. Build your MVP, grow your skills, and demo what you create.', 'Program', 'Apply Now', '/venture-builder', 0),
('Worktool Grant Applications Open', 'Apply or sponsor a work tool grant — laptops, internet, and software access for women builders who need it most.', 'Initiative', 'Learn More', '/partner', 1),
('AI x Web3: The Market Landscape and Opportunity', 'Knowledge sharing session in celebration of IWD 2026, our gift to the community.', 'Panel', 'See Events', '/events', 2);

-- Impact stats --------------------------------------------------------------
insert into public.impact_stats (value, label, description, position) values
('20,000+', 'women reached', 'We''ve shown up in the feeds, inboxes, and communities of over twenty thousand women across Africa and the UAE. That reach is growing every week.', 0),
('4,700+', 'community members', 'These are the women who chose to stay, joining our network, showing up to events, and building alongside each other in emerging technology.', 1),
('483+', 'accepted and trained', 'We don''t accept everyone. These are women who applied, were selected, and committed to structured learning through our cohort and venture builder programs.', 2),
('77+', 'graduates', 'Women who went all the way, completing full program tracks and shipping real projects at the end.', 3),
('49+', 'projects submitted', 'Real products. Real MVPs. Ideas that went from a conversation to something you can actually click on.', 4),
('50+', 'events hosted', 'Workshops, AMAs, masterclasses, and meetups where we put women in the same room as the ideas and people that matter.', 5);

-- Social proof ("Proof of work") --------------------------------------------
insert into public.social_proof (title, category, image_url, position) values
('Nofisat''s team won a prize at the Celo MiniPay Hack', 'Hackathon Win', '/assets/celo-hackathon-win-DXkh0P2H.jpg', 0),
('Nofisat received her HP laptop through our Worktool Program', 'Worktool Grant', '/assets/worktool-laptop-CC7TtD_m.jpg', 1),
('Amarachiugwu''s team won $1,500 at Web3 Lagos Conference', 'Hackathon Win', '/assets/web3lagos-win-DQTmc7vv.jpg', 2),
('Amarachiugwu created a SIWE tutorial after a Web3Ladies workshop', 'Workshop Impact', '/assets/siwe-workshop-gyz5A3vU.jpg', 3);

-- Partners ------------------------------------------------------------------
-- The five with real logo assets render in the marquee; the rest are name-only
-- (logos not recovered). Category logo_marquee = homepage strip.
insert into public.partners (name, logo_url, category, position) values
('Polygon', '/assets/polygon-2zd062MT.png', 'logo_marquee', 0),
('Celo', '/assets/celo-DCHEvpCA.png', 'logo_marquee', 1),
('Solana', '/assets/solana-DIiB-o-r.png', 'logo_marquee', 2),
('Ethereum Foundation', '/assets/ethereum-foundation-DLDjYPx9.png', 'logo_marquee', 3),
('Yellow Card', '/assets/yellowcard-DWXjHJ-Y.png', 'logo_marquee', 4),
('Nodo', null, 'logo_marquee', 5),
('Starknet', null, 'logo_marquee', 6),
('Base', null, 'logo_marquee', 7),
('Cartesi', null, 'logo_marquee', 8),
('Stellar / DSF Labs', null, 'logo_marquee', 9),
('Filecoin', null, 'past_partner', 10),
('SheCode Africa', null, 'past_partner', 11),
('Celo Foundation', null, 'past_partner', 12);

-- Founder story -------------------------------------------------------------
insert into public.founder_story (section_key, heading, body, image_url, position) values
('why', 'Why Web3Ladies exists',
 'I started Web3Ladies because when I transitioned into blockchain, I could clearly see two things at the same time: the immense opportunity Web3 was creating, new careers, new economies, new ways of building, and a painful gap: there were not enough women in the room, especially women who looked like me.

If the room did not naturally make space for more women, then I would help build a bigger room.

— Oluchi Enebeli, Founder, Web3Ladies',
 '/assets/founder-oluchi-BnQV3JEa.png', 0);

-- Testimonials --------------------------------------------------------------
-- 6 on the homepage ("Real stories…"), 3 on the community page.
insert into public.testimonials (name, role, quote, category, placement, position) values
('Nofisat Abiodun Ayanlola', 'Hackathon Winner', 'Consistency and having the right energy makes you excel — we won a prize on the Celo hack! Am excited to share our victory of winning a prize pool on our project #ChopConnect on the just concluded Celo hack on MiniPay, thanks to Web3Ladies.', 'Hackathon', 'home', 0),
('Community Member', 'Worktool Recipient', 'Thank you so much @web3ladies — this means a whole lot to me. I got my worktool alreadyyyy! The Work Tool Assistance Program gave me the device I needed to keep building. Without it, I would have been stuck watching from the sidelines.', 'Worktool', 'home', 1),
('Worktool Recipient', 'Community Member', 'I am thrilled to say that the reality is here — I just received my gift of an HP laptop from Web3Ladies! All my roadmap to this resilience — am grateful to Web3Ladies and everyone who made this possible.', 'Worktool', 'home', 2),
('Content Creator & Developer', 'Developer', 'I was inspired to create a YouTube video about Sign In With Ethereum after a Web3Ladies workshop. After joining a workshop by Johanna Fransson hosted by Web3Ladies on SIWE, I discussed the motivation and goal of sign in with Ethereum and the great options it brings.', 'Workshop', 'home', 3),
('Hackathon Winner', 'Builder', 'My team won the $1,500 prize pool at Web3 Lagos Conference under Lisk protocol! Thank you Web3Ladies — you all played significant roles in making this win possible. The skills and community gave me the foundation to compete and deliver.', 'Hackathon', 'home', 4),
('Solidity Developer', 'Solidity Developer', 'Over the past couple of months, I have witnessed sporadic growth in my tech journey and this is owing to the amazing mentorship Web3Ladies provided me.', 'Mentorship', 'home', 5),
('Web Developer', 'Web Developer', 'The mentorship helped me develop my organizational and technical skills along with personal development. I had the pleasure to be a mentee at Web3Ladies Cohort II for 4 months without prior knowledge of HTML, CSS, and JavaScript. The mentors have deep knowledge of teaching technical courses.', 'Cohort', 'community', 0),
('Web3 Developer', 'Web3 Developer', 'The cohort made me more eager to learn and provided me with a community to learn with. Prior to the cohort I had tried learning web3 development 2 times but didn''t remain consistent until I got into the cohort that provided me with people to look up to.', 'Cohort', 'community', 1),
('Crypto/DeFi Enthusiast', 'Crypto/DeFi Enthusiast', 'I had so many challenges but in the end, I bought my first coin during class. I also started saving in USDT. I am very grateful for the cohort.', 'Cohort', 'community', 2);

commit;
