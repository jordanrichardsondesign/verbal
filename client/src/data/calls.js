export const CALLS = [
  /* ── Stephanie Jackson ── */
  {
    date: 'Today',     time: '11:30 AM', provider: { name: 'Stephanie Jackson', dept: 'Neurology',    initials: 'SJ' },
    patient: 'William Thomas',    checklist: 'Behavioral Health Follow-up',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '100%',     variant: 'green'  },
    pace:     { value: '135 WPM',  variant: 'green'  }, listen:   { value: '56%',      variant: 'orange' },
    language: { value: '98%',      variant: 'green'  }, duration: { value: '01:20:34', variant: 'green'  },
  },
  {
    date: 'Today',     time: '09:15 AM', provider: { name: 'Stephanie Jackson', dept: 'Neurology',    initials: 'SJ' },
    patient: 'Sarah Chen',        checklist: 'Medication Review',
    callAdh:  { value: '88%',      variant: 'green'  }, noteAdh:  { value: '92%',      variant: 'green'  },
    pace:     { value: '128 WPM',  variant: 'green'  }, listen:   { value: '61%',      variant: 'green'  },
    language: { value: '95%',      variant: 'green'  }, duration: { value: '00:44:12', variant: 'green'  },
  },
  {
    date: 'Yesterday', time: '02:20 PM', provider: { name: 'Stephanie Jackson', dept: 'Neurology',    initials: 'SJ' },
    patient: 'James Rodriguez',   checklist: 'Behavioral Health Follow-up',
    callAdh:  { value: '75%',      variant: 'orange' }, noteAdh:  { value: '80%',      variant: 'green'  },
    pace:     { value: '142 WPM',  variant: 'green'  }, listen:   { value: '52%',      variant: 'orange' },
    language: { value: '91%',      variant: 'green'  }, duration: { value: '00:58:05', variant: 'green'  },
  },
  {
    date: 'Yesterday', time: '08:45 AM', provider: { name: 'Stephanie Jackson', dept: 'Neurology',    initials: 'SJ' },
    patient: 'Emily Park',        checklist: 'Mental Health Check-in',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '96%',      variant: 'green'  },
    pace:     { value: '131 WPM',  variant: 'green'  }, listen:   { value: '67%',      variant: 'green'  },
    language: { value: '100%',     variant: 'green'  }, duration: { value: '01:05:22', variant: 'green'  },
  },
  {
    date: 'Jun 8',     time: '10:00 AM', provider: { name: 'Stephanie Jackson', dept: 'Neurology',    initials: 'SJ' },
    patient: 'Robert Martinez',   checklist: 'HIPAA Compliance',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '100%',     variant: 'green'  },
    pace:     { value: '138 WPM',  variant: 'green'  }, listen:   { value: '59%',      variant: 'orange' },
    language: { value: '97%',      variant: 'green'  }, duration: { value: '00:38:48', variant: 'green'  },
  },

  /* ── Michael King ── */
  {
    date: 'Today',     time: '10:00 AM', provider: { name: 'Michael King',       dept: 'Cardiology',  initials: 'MK' },
    patient: 'Ronald Carter',     checklist: 'Behavioral Health Follow-up',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '56%',      variant: 'orange' },
    pace:     { value: '150 WPM',  variant: 'green'  }, listen:   { value: '70%',      variant: 'green'  },
    language: { value: '92%',      variant: 'green'  }, duration: { value: '00:48:10', variant: 'green'  },
  },
  {
    date: 'Yesterday', time: '03:30 PM', provider: { name: 'Michael King',       dept: 'Cardiology',  initials: 'MK' },
    patient: 'Linda Johnson',     checklist: 'Post-Surgical',
    callAdh:  { value: '82%',      variant: 'green'  }, noteAdh:  { value: '78%',      variant: 'orange' },
    pace:     { value: '155 WPM',  variant: 'green'  }, listen:   { value: '63%',      variant: 'green'  },
    language: { value: '89%',      variant: 'green'  }, duration: { value: '00:31:44', variant: 'green'  },
  },
  {
    date: 'Jun 8',     time: '09:45 AM', provider: { name: 'Michael King',       dept: 'Cardiology',  initials: 'MK' },
    patient: 'David Kim',         checklist: 'Nurse Discharge',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '90%',      variant: 'green'  },
    pace:     { value: '147 WPM',  variant: 'green'  }, listen:   { value: '74%',      variant: 'green'  },
    language: { value: '96%',      variant: 'green'  }, duration: { value: '00:52:33', variant: 'green'  },
  },

  /* ── Laura Hill ── */
  {
    date: 'Today',     time: '09:30 AM', provider: { name: 'Laura Hill',         dept: 'Pediatrics',  initials: 'LH' },
    patient: 'Maria Santos',      checklist: 'Nurse Discharge',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '95%',      variant: 'green'  },
    pace:     { value: '140 WPM',  variant: 'green'  }, listen:   { value: '80%',      variant: 'green'  },
    language: { value: '100%',     variant: 'green'  }, duration: { value: '00:32:55', variant: 'green'  },
  },
  {
    date: 'Yesterday', time: '11:00 AM', provider: { name: 'Laura Hill',         dept: 'Pediatrics',  initials: 'LH' },
    patient: 'Patricia Lee',      checklist: 'Behavioral Health Follow-up',
    callAdh:  { value: '94%',      variant: 'green'  }, noteAdh:  { value: '88%',      variant: 'green'  },
    pace:     { value: '136 WPM',  variant: 'green'  }, listen:   { value: '77%',      variant: 'green'  },
    language: { value: '99%',      variant: 'green'  }, duration: { value: '00:41:20', variant: 'green'  },
  },

  /* ── Alice Newton ── */
  {
    date: 'Today',     time: '08:45 AM', provider: { name: 'Alice Newton',       dept: 'Dermatology', initials: 'AN' },
    patient: 'James Wright',      checklist: 'HIPAA Compliance',
    callAdh:  { value: '45%',      variant: 'ruby'   }, noteAdh:  { value: '46%',      variant: 'orange' },
    pace:     { value: '160 WPM',  variant: 'green'  }, listen:   { value: '90%',      variant: 'ruby'   },
    language: { value: '88%',      variant: 'green'  }, duration: { value: '00:12:04', variant: 'orange' },
  },
  {
    date: 'Yesterday', time: '02:00 PM', provider: { name: 'Alice Newton',       dept: 'Dermatology', initials: 'AN' },
    patient: 'Charles Wilson',    checklist: 'Medication Review',
    callAdh:  { value: '52%',      variant: 'ruby'   }, noteAdh:  { value: '48%',      variant: 'orange' },
    pace:     { value: '163 WPM',  variant: 'green'  }, listen:   { value: '85%',      variant: 'ruby'   },
    language: { value: '82%',      variant: 'green'  }, duration: { value: '00:09:37', variant: 'orange' },
  },
  {
    date: 'Jun 8',     time: '01:30 PM', provider: { name: 'Alice Newton',       dept: 'Dermatology', initials: 'AN' },
    patient: 'Barbara Moore',     checklist: 'Post-Surgical',
    callAdh:  { value: '60%',      variant: 'orange' }, noteAdh:  { value: '55%',      variant: 'orange' },
    pace:     { value: '158 WPM',  variant: 'green'  }, listen:   { value: '88%',      variant: 'ruby'   },
    language: { value: '85%',      variant: 'green'  }, duration: { value: '00:15:12', variant: 'orange' },
  },

  /* ── Robert Collins ── */
  {
    date: 'Yesterday', time: '01:45 PM', provider: { name: 'Robert Collins',     dept: 'Oncology',    initials: 'RC' },
    patient: 'Linda Park',        checklist: 'Behavioral Health Follow-up',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '88%',      variant: 'green'  },
    pace:     { value: '130 WPM',  variant: 'green'  }, listen:   { value: '65%',      variant: 'green'  },
    language: { value: '95%',      variant: 'green'  }, duration: { value: '00:55:22', variant: 'green'  },
  },
  {
    date: 'Jun 8',     time: '10:30 AM', provider: { name: 'Robert Collins',     dept: 'Oncology',    initials: 'RC' },
    patient: 'Thomas Rivera',     checklist: 'Post-Surgical',
    callAdh:  { value: '96%',      variant: 'green'  }, noteAdh:  { value: '91%',      variant: 'green'  },
    pace:     { value: '127 WPM',  variant: 'green'  }, listen:   { value: '69%',      variant: 'green'  },
    language: { value: '93%',      variant: 'green'  }, duration: { value: '00:48:50', variant: 'green'  },
  },
  {
    date: 'Jun 7',     time: '09:15 AM', provider: { name: 'Robert Collins',     dept: 'Oncology',    initials: 'RC' },
    patient: 'Barbara Evans',     checklist: 'Nurse Discharge',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '85%',      variant: 'green'  },
    pace:     { value: '133 WPM',  variant: 'green'  }, listen:   { value: '62%',      variant: 'green'  },
    language: { value: '97%',      variant: 'green'  }, duration: { value: '00:36:41', variant: 'green'  },
  },

  /* ── Henry James ── */
  {
    date: 'Yesterday', time: '02:15 PM', provider: { name: 'Henry James',        dept: 'Orthopedics', initials: 'HJ' },
    patient: 'Thomas Rivera',     checklist: 'Post-Surgical',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '85%',      variant: 'green'  },
    pace:     { value: '125 WPM',  variant: 'green'  }, listen:   { value: '60%',      variant: 'green'  },
    language: { value: '97%',      variant: 'green'  }, duration: { value: '01:02:18', variant: 'green'  },
  },
  {
    date: 'Jun 8',     time: '11:00 AM', provider: { name: 'Henry James',        dept: 'Orthopedics', initials: 'HJ' },
    patient: 'William Chen',      checklist: 'HIPAA Compliance',
    callAdh:  { value: '91%',      variant: 'green'  }, noteAdh:  { value: '87%',      variant: 'green'  },
    pace:     { value: '122 WPM',  variant: 'green'  }, listen:   { value: '58%',      variant: 'orange' },
    language: { value: '94%',      variant: 'green'  }, duration: { value: '00:44:07', variant: 'green'  },
  },

  /* ── Cynthia Turner ── */
  {
    date: 'Yesterday', time: '03:00 PM', provider: { name: 'Cynthia Turner',     dept: 'Gastroenterology', initials: 'CT' },
    patient: 'Barbara Evans',     checklist: 'Nurse Discharge',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '93%',      variant: 'green'  },
    pace:     { value: '145 WPM',  variant: 'green'  }, listen:   { value: '75%',      variant: 'green'  },
    language: { value: '100%',     variant: 'green'  }, duration: { value: '00:41:33', variant: 'green'  },
  },
  {
    date: 'Jun 8',     time: '02:30 PM', provider: { name: 'Cynthia Turner',     dept: 'Gastroenterology', initials: 'CT' },
    patient: 'Patricia Nguyen',   checklist: 'Mental Health Check-in',
    callAdh:  { value: '98%',      variant: 'green'  }, noteAdh:  { value: '90%',      variant: 'green'  },
    pace:     { value: '141 WPM',  variant: 'green'  }, listen:   { value: '78%',      variant: 'green'  },
    language: { value: '100%',     variant: 'green'  }, duration: { value: '00:33:15', variant: 'green'  },
  },

  /* ── James Peterson ── */
  {
    date: 'Jun 8',     time: '09:30 AM', provider: { name: 'James Peterson',     dept: 'Endocrinology', initials: 'JP' },
    patient: 'William Chen',      checklist: 'HIPAA Compliance',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '90%',      variant: 'green'  },
    pace:     { value: '120 WPM',  variant: 'green'  }, listen:   { value: '68%',      variant: 'green'  },
    language: { value: '91%',      variant: 'green'  }, duration: { value: '00:28:47', variant: 'green'  },
  },
  {
    date: 'Jun 7',     time: '10:00 AM', provider: { name: 'James Peterson',     dept: 'Endocrinology', initials: 'JP' },
    patient: 'Charles Moore',     checklist: 'Medication Review',
    callAdh:  { value: '95%',      variant: 'green'  }, noteAdh:  { value: '87%',      variant: 'green'  },
    pace:     { value: '118 WPM',  variant: 'green'  }, listen:   { value: '71%',      variant: 'green'  },
    language: { value: '90%',      variant: 'green'  }, duration: { value: '00:35:19', variant: 'green'  },
  },

  /* ── Emma Matthews ── */
  {
    date: 'Jun 8',     time: '11:15 AM', provider: { name: 'Emma Matthews',      dept: 'Urology',     initials: 'EM' },
    patient: 'Patricia Nguyen',   checklist: 'Behavioral Health Follow-up',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '98%',      variant: 'green'  },
    pace:     { value: '155 WPM',  variant: 'green'  }, listen:   { value: '82%',      variant: 'green'  },
    language: { value: '99%',      variant: 'green'  }, duration: { value: '00:37:15', variant: 'green'  },
  },
  {
    date: 'Jun 7',     time: '01:00 PM', provider: { name: 'Emma Matthews',      dept: 'Urology',     initials: 'EM' },
    patient: 'James Wright',      checklist: 'Post-Surgical',
    callAdh:  { value: '97%',      variant: 'green'  }, noteAdh:  { value: '94%',      variant: 'green'  },
    pace:     { value: '152 WPM',  variant: 'green'  }, listen:   { value: '79%',      variant: 'green'  },
    language: { value: '98%',      variant: 'green'  }, duration: { value: '00:42:30', variant: 'green'  },
  },

  /* ── Thomas White ── */
  {
    date: 'Jun 7',     time: '09:00 AM', provider: { name: 'Thomas White',       dept: 'Ophthalmology', initials: 'TW' },
    patient: 'Charles Moore',     checklist: 'Post-Surgical',
    callAdh:  { value: '100%',     variant: 'green'  }, noteAdh:  { value: '87%',      variant: 'green'  },
    pace:     { value: '110 WPM',  variant: 'green'  }, listen:   { value: '73%',      variant: 'green'  },
    language: { value: '96%',      variant: 'green'  }, duration: { value: '00:51:09', variant: 'green'  },
  },
  {
    date: 'Jun 6',     time: '02:30 PM', provider: { name: 'Thomas White',       dept: 'Ophthalmology', initials: 'TW' },
    patient: 'Ronald Carter',     checklist: 'Nurse Discharge',
    callAdh:  { value: '93%',      variant: 'green'  }, noteAdh:  { value: '84%',      variant: 'green'  },
    pace:     { value: '114 WPM',  variant: 'green'  }, listen:   { value: '70%',      variant: 'green'  },
    language: { value: '94%',      variant: 'green'  }, duration: { value: '00:29:44', variant: 'green'  },
  },
];
