import { parse } from 'yaml';
import { readFile, writeFile } from 'fs/promises';
import { renderFile } from 'ejs';

function makeId(str) {
	return str.toLowerCase().replace(/\s/g, '-').replace(/\W/g, '_');
}

async function main() {
	// load CV data in YAML form
	const cvYaml = await readFile('./data/cv.yaml', { encoding: 'utf-8' });

	// parse data from YAML form into js object
	const cv = parse(cvYaml);

	// extending data with cross-references between projects and programming languages
	const programming_languages = {};
	for (const lang of cv.programming_languages) {
		programming_languages[lang.title] = lang;
		lang.projects = [];
		lang.id = `prog-lang-${makeId(lang.title)}`;
	}
	for (const proj of cv.projects) {
		proj.id = `project-${makeId(proj.title)}`;
		const languages = [];
		for (const lname of proj.languages) {
			const lang = programming_languages[lname];
			if (!lang)
				throw new Error(`no programming_language by title: ${lname}`);
			lang.projects.push(proj);
			languages.push(lang);
		}
		proj.languages = languages;
	}

	// render html
	const html = await renderFile('./template/index.ejs', cv, {});

	// write html into a file
	await writeFile('./index.html', html);
}

main();
