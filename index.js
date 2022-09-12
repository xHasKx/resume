import { parse } from 'yaml';
import { readFile, writeFile } from 'fs/promises';
import { renderFile } from 'ejs';

function makeId(str) {
	return str.toLowerCase().replace(/\s/g, '-').replace(/\W/g, '_');
}

function compareWorkExperience(wexp1, wexp2) {
	const year1 = parseInt(wexp1.years[1]) || 100000;
	const year2 = parseInt(wexp2.years[1]) || 100000;
	return year2 - year1;
}

async function main() {
	// load CV data in YAML form
	const cvYaml = await readFile('./data/cv.yaml', { encoding: 'utf-8' });

	// parse data from YAML form into js object
	const cv = parse(cvYaml);

	// extending data with cross-references between projects, work_experience and programming_languages
	const programming_languages = {};
	for (const lang of cv.programming_languages) {
		programming_languages[lang.title] = lang;
		lang.projects = [];
		lang.work_experience = [];
		lang.id = `prog-lang-${makeId(lang.title)}`;
	}
	for (const proj of cv.projects) {
		proj.id = `project-${makeId(proj.title)}`;
		const languages = [];
		for (const lname of proj.languages) {
			const lang = programming_languages[lname];
			if (!lang)
				throw new Error(`no programming_language by title: ${lname} mentioned in the project ${proj.title}`);
			lang.projects.push(proj);
			languages.push(lang);
		}
		proj.languages = languages;
	}
	for (const wexp of cv.work_experience) {
		const id = `${wexp.company}-${wexp.position}`;
		wexp.id = `wexp-${makeId(id)}`;
		const languages = [];
		for (const lname of wexp.languages) {
			const lang = programming_languages[lname];
			if (!lang)
				throw new Error(`no programming_language by title: ${lname} mentioned in the work_experience ${id}`);
			lang.work_experience.push(wexp);
			languages.push(lang);
		}
		wexp.languages = languages;
	}

	// sort work_experience to display fresh items at the top
	cv.work_experience.sort(compareWorkExperience);

	// render html
	const html = await renderFile('./template/index.ejs', cv, {});

	// write html into a file
	await writeFile('./index.html', html);
}

main();
