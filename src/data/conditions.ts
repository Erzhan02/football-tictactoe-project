import type { Condition, Preset } from '@/types';

// ─────────────────────────────────────────────
// Condition catalog — all available conditions
// ─────────────────────────────────────────────
export const CONDITIONS_CATALOG: Condition[] = [
	// Competitions
	{ id: 'cond-ucl', label: 'Лига Чемпионов', tag: 'ucl' },
	{ id: 'cond-uel', label: 'Лига Европы', tag: 'uel' },
	{ id: 'cond-worldcup-winner', label: 'Чемпион мира', tag: 'worldcup-winner' },
	{ id: 'cond-euro', label: 'Чемпион Европы', tag: 'euro' },
	{
		id: 'cond-copa-america',
		label: 'Чемпион Южной Америки',
		tag: 'copa-america',
	},
	{ id: 'cond-ballondor', label: 'Золотой мяч', tag: 'ballondor' },
	// Leagues
	{ id: 'cond-premier-league', label: 'АПЛ', tag: 'premier-league' },
	{ id: 'cond-laliga', label: 'Ла Лига', tag: 'laliga' },
	{ id: 'cond-serie-a', label: 'Серия А', tag: 'serie-a' },
	{ id: 'cond-bundesliga', label: 'Бундеслига', tag: 'bundesliga' },
	{ id: 'cond-ligue1', label: 'Лига 1', tag: 'ligue1' },
	{ id: 'cond-mls', label: 'MLS', tag: 'mls' },
	{ id: 'cond-saudi', label: 'Саудовская Про-лига', tag: 'saudi-league' },
	// Clubs
	{ id: 'cond-barcelona', label: 'Играл за Барселону', tag: 'barcelona' },
	{ id: 'cond-real-madrid', label: 'Играл за Реал Мадрид', tag: 'real-madrid' },
	{
		id: 'cond-manchester-city',
		label: 'Играл за Манчестер Сити',
		tag: 'manchester-city',
	},
	{
		id: 'cond-manchester-united',
		label: 'Играл за Манчестер Юнайтед',
		tag: 'manchester-united',
	},
	{ id: 'cond-liverpool', label: 'Играл за Ливерпуль', tag: 'liverpool' },
	{ id: 'cond-chelsea', label: 'Играл за Челси', tag: 'chelsea' },
	{ id: 'cond-arsenal', label: 'Играл за Арсенал', tag: 'arsenal' },
	{ id: 'cond-psg', label: 'Играл за ПСЖ', tag: 'psg' },
	{ id: 'cond-bavaria', label: 'Играл за Баварию', tag: 'bavaria' },
	{ id: 'cond-dortmund', label: 'Играл за Боруссию Дортмунд', tag: 'dortmund' },
	{ id: 'cond-juventus', label: 'Играл за Ювентус', tag: 'juventus' },
	{ id: 'cond-ac-milan', label: 'Играл за Милан', tag: 'ac-milan' },
	{ id: 'cond-inter', label: 'Играл за Интер', tag: 'inter' },
	{ id: 'cond-atletico', label: 'Играл за Атлетико Мадрид', tag: 'atletico' },
	// Managers
	{ id: 'cond-pep', label: 'Играл под руководством Пепа', tag: 'pep' },
	{
		id: 'cond-mourinho',
		label: 'Играл под руководством Моуриньо',
		tag: 'mourinho',
	},
	// Nationalities
	{ id: 'cond-spain', label: 'Испания (сборная)', tag: 'spain' },
	{ id: 'cond-germany', label: 'Германия (сборная)', tag: 'germany' },
	{ id: 'cond-france', label: 'Франция (сборная)', tag: 'france' },
	{ id: 'cond-brazil', label: 'Бразилия (сборная)', tag: 'brazil' },
	{ id: 'cond-argentina', label: 'Аргентина (сборная)', tag: 'argentina' },
	{ id: 'cond-england', label: 'Англия (сборная)', tag: 'england' },
	{ id: 'cond-portugal', label: 'Португалия (сборная)', tag: 'portugal' },
	{ id: 'cond-italy', label: 'Италия (сборная)', tag: 'italy' },
	{ id: 'cond-netherlands', label: 'Нидерланды (сборная)', tag: 'netherlands' },
	{ id: 'cond-belgium', label: 'Бельгия (сборная)', tag: 'belgium' },
	{ id: 'cond-russia', label: 'Россия (сборная)', tag: 'russia' },
	{ id: 'cond-uruguay', label: 'Уругвай (сборная)', tag: 'uruguay' },
	{ id: 'cond-croatia', label: 'Хорватия (сборная)', tag: 'croatia' },
	{ id: 'cond-colombia', label: 'Колумбия (сборная)', tag: 'colombia' },
	{ id: 'cond-switzerland', label: 'Швейцария (сборная)', tag: 'switzerland' },
	{ id: 'cond-sweden', label: 'Швеция (сборная)', tag: 'sweden' },
	{ id: 'cond-morocco', label: 'Марокко (сборная)', tag: 'morocco' },
	{ id: 'cond-turkey', label: 'Турция (сборная)', tag: 'turkey' },
	{ id: 'cond-denmark', label: 'Дания (сборная)', tag: 'denmark' },
	{ id: 'cond-ukraine', label: 'Украина (сборная)', tag: 'ukraine' },
	{
		id: 'cond-ivory-coast',
		label: "Кот-д'Ивуар (сборная)",
		tag: 'ivory-coast',
	},
	{ id: 'cond-egypt', label: 'Египет (сборная)', tag: 'egypt' },
	{ id: 'cond-norway', label: 'Норвегия (сборная)', tag: 'norway' },
	{ id: 'cond-chile', label: 'Чили (сборная)', tag: 'chile' },
	{ id: 'cond-wales', label: 'Уэльс (сборная)', tag: 'wales' },
];

// ─────────────────────────────────────────────
// Default presets
// ─────────────────────────────────────────────
export const DEFAULT_PRESETS: Preset[] = [
	{
		id: 'preset-classic',
		name: '🏆 Классика',
		createdAt: Date.now(),
		rowConditions: [
			{ id: 'r1', label: 'Пеп Гвардиола', tag: 'pep' },
			{ id: 'r2', label: 'Чемпион мира', tag: 'worldcup-winner' },
			{ id: 'r3', label: 'Золотой мяч', tag: 'ballondor' },
		],
		colConditions: [
			{ id: 'c1', label: 'Лига Чемпионов', tag: 'ucl' },
			{ id: 'c2', label: 'АПЛ', tag: 'premier-league' },
			{ id: 'c3', label: 'Бундеслига', tag: 'bundesliga' },
		],
	},
	{
		id: 'preset-clubs',
		name: '⚽ Великие клубы',
		createdAt: Date.now(),
		rowConditions: [
			{ id: 'r1', label: 'Реал Мадрид', tag: 'real-madrid' },
			{ id: 'r2', label: 'Барселона', tag: 'barcelona' },
			{ id: 'r3', label: 'Манчестер Сити', tag: 'manchester-city' },
		],
		colConditions: [
			{ id: 'c1', label: 'Лига Чемпионов', tag: 'ucl' },
			{ id: 'c2', label: 'Золотой мяч', tag: 'ballondor' },
			{ id: 'c3', label: 'Чемпион мира', tag: 'worldcup-winner' },
		],
	},
	{
		id: 'preset-nationals',
		name: '🌍 Сборные',
		createdAt: Date.now(),
		rowConditions: [
			{ id: 'r1', label: 'Испания', tag: 'spain' },
			{ id: 'r2', label: 'Германия', tag: 'germany' },
			{ id: 'r3', label: 'Франция', tag: 'france' },
		],
		colConditions: [
			{ id: 'c1', label: 'Лига Чемпионов', tag: 'ucl' },
			{ id: 'c2', label: 'Баварию', tag: 'bavaria' },
			{ id: 'c3', label: 'Барселону', tag: 'barcelona' },
		],
	},
];

// ─────────────────────────────────────────────
// Default game conditions (starting grid)
// ─────────────────────────────────────────────
export const DEFAULT_ROW_CONDITIONS: Condition[] = [
	{ id: 'r1', label: 'Пеп Гвардиола', tag: 'pep' },
	{ id: 'r2', label: 'Чемпион мира', tag: 'worldcup-winner' },
	{ id: 'r3', label: 'Золотой мяч', tag: 'ballondor' },
];

export const DEFAULT_COL_CONDITIONS: Condition[] = [
	{ id: 'c1', label: 'Лига Чемпионов', tag: 'ucl' },
	{ id: 'c2', label: 'АПЛ', tag: 'premier-league' },
	{ id: 'c3', label: 'Бундеслига', tag: 'bundesliga' },
];
