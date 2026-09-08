-- Web3Ladies — seed the 5 configurable public forms (fields + select options).
-- Field labels/types/required flags reproduce the current live forms. Some
-- select option lists were not fully observable and are marked UNKNOWN inline;
-- adjust them in the admin Form Config once verified.
-- Idempotent: safe to re-run (re-seeds fields/options for these 5 forms).

insert into public.forms (key, title, description, submit_label, position) values
  ('community_join',        'Join the Web3Ladies Community', 'Tell us a little about you and why you want to join.', 'Join Community', 0),
  ('event_host_request',    'Host an Event with Web3Ladies', 'Pitch a workshop, AMA, panel, or masterclass for our community.', 'Submit Request', 1),
  ('membership_application', 'Apply for Web3Ladies Circle',  'A curated membership for women ready to do the work.', 'Submit Application', 2),
  ('partner_inquiry',       'Partner with Web3Ladies',       'Let''s build something meaningful together.', 'Send Inquiry', 3),
  ('venture_builder',       'Apply to the Web3 x AI Venture Builder', 'For women ready to build with more clarity, confidence, and intention.', 'Submit Application', 4)
on conflict (key) do update
  set title = excluded.title,
      description = excluded.description,
      submit_label = excluded.submit_label,
      position = excluded.position;

-- Clear existing fields (cascades to options) for a clean re-seed.
delete from public.form_fields
where form_id in (select id from public.forms where key in
  ('community_join','event_host_request','membership_application','partner_inquiry','venture_builder'));

-- Fields ---------------------------------------------------------------------
insert into public.form_fields (form_id, name, label, field_type, is_required, position)
select f.id, v.name, v.label, v.field_type, v.is_required, v.position
from public.forms f
join (values
  -- community_join
  ('community_join','full_name','Full name','text',true,0),
  ('community_join','email','Email','email',true,1),
  ('community_join','country_residence','Country of Residence','textarea',true,2),
  ('community_join','role_interest','Current role or area of interest','text',true,3),
  ('community_join','why_join','Why do you want to join Web3Ladies?','textarea',true,4),
  ('community_join','knowledge_level','What is your level of knowledge in Blockchain/AI?','select',true,5),
  ('community_join','how_heard','How did you hear about Web3Ladies?','select',true,6),
  ('community_join','acknowledgement','Acknowledgement','select',true,7),

  -- event_host_request
  ('event_host_request','your_name','Your name','text',true,0),
  ('event_host_request','email','Email address','email',true,1),
  ('event_host_request','linkedin','LinkedIn Handle','text',true,2),
  ('event_host_request','event_type','Event type','select',true,3),
  ('event_host_request','event_idea','Describe your event idea','textarea',true,4),
  ('event_host_request','what_you_do','In one sentence, what do you do or what are you building?','text',true,5),
  ('event_host_request','topic','What topic would you like to speak or teach on?','textarea',true,6),
  ('event_host_request','authority','What gives you the authority to speak on this topic? This can be lived experience, projects you''ve built.','textarea',true,7),
  ('event_host_request','outline','Submit a short outline of your session. Include: the topic title, what you''ll cover, and 3 key takeaways your audience will leave with.','textarea',true,8),

  -- membership_application
  ('membership_application','full_name','Full name','text',true,0),
  ('membership_application','email','Email','email',true,1),
  ('membership_application','country_city','Country / City','text',true,2),
  ('membership_application','role_focus','Current role or area of focus','text',true,3),
  ('membership_application','why_join_circle','Why do you want to join the Web3Ladies Circle?','textarea',true,4),

  -- partner_inquiry
  ('partner_inquiry','your_name','Your name','text',true,0),
  ('partner_inquiry','company','Company / Organization','text',true,1),
  ('partner_inquiry','email','Email','email',true,2),
  ('partner_inquiry','website','Website','text',true,3),
  ('partner_inquiry','partnership_type','Partnership type','select',false,4),
  ('partner_inquiry','explore','What would you like to explore?','textarea',true,5),

  -- venture_builder
  ('venture_builder','full_name','Full name','text',true,0),
  ('venture_builder','email','Email','email',true,1),
  ('venture_builder','linkedin_portfolio','LinkedIn / Portfolio','text',false,2),
  ('venture_builder','country_city','Country / City','text',true,3),
  ('venture_builder','current_role','Current role','text',false,4),
  ('venture_builder','why_join','Why do you want to join this program?','textarea',true,5),
  ('venture_builder','what_build','What do you want to build or explore?','textarea',false,6),
  ('venture_builder','meaningful','What would make this experience meaningful for you?','textarea',false,7)
) as v(form_key, name, label, field_type, is_required, position)
  on f.key = v.form_key;

-- Select options -------------------------------------------------------------
insert into public.form_field_options (field_id, label, value, position)
select ff.id, o.label, o.value, o.position
from public.form_fields ff
join public.forms f on f.id = ff.form_id
join (values
  -- community_join.knowledge_level
  ('community_join','knowledge_level','Beginner','beginner',0),
  ('community_join','knowledge_level','Intermediate','intermediate',1),
  ('community_join','knowledge_level','Expert','expert',2),
  -- community_join.how_heard
  ('community_join','how_heard','Friend','friend',0),
  ('community_join','how_heard','Word of Mouth','word_of_mouth',1),
  ('community_join','how_heard','Twitter','twitter',2),
  ('community_join','how_heard','LinkedIn','linkedin',3),
  ('community_join','how_heard','Instagram','instagram',4),
  ('community_join','how_heard','Google Search','google',5),
  ('community_join','how_heard','Website','website',6),
  ('community_join','how_heard','Facebook','facebook',7),
  ('community_join','how_heard','Other','other',8),
  -- community_join.acknowledgement (UNKNOWN exact wording)
  ('community_join','acknowledgement','I acknowledge and agree to the community code of conduct','yes',0),
  -- event_host_request.event_type
  ('event_host_request','event_type','Workshop','workshop',0),
  ('event_host_request','event_type','Panel','panel',1),
  ('event_host_request','event_type','AMA','ama',2),
  ('event_host_request','event_type','Masterclass','masterclass',3),
  ('event_host_request','event_type','Meetup','meetup',4),
  ('event_host_request','event_type','Demo Day','demo_day',5),
  ('event_host_request','event_type','Other','other',6),
  -- partner_inquiry.partnership_type (from the partner page tiers)
  ('partner_inquiry','partnership_type','Scholarship Partner','scholarship',0),
  ('partner_inquiry','partnership_type','Work Tool Partner','work_tool',1),
  ('partner_inquiry','partnership_type','Event Series Sponsor','event_series',2),
  ('partner_inquiry','partnership_type','Cohort/Track Sponsor','cohort_track',3),
  ('partner_inquiry','partnership_type','Annual Ecosystem Partner','annual_ecosystem',4),
  ('partner_inquiry','partnership_type','Custom Partnership','custom',5)
) as o(form_key, field_name, label, value, position)
  on f.key = o.form_key and ff.name = o.field_name;
