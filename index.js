import { parse } from 'yaml';
import { readFile, writeFile } from 'fs/promises';
import { renderFile } from 'ejs';
import { markdown } from 'markdown';

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

	// extending data with cross-references between projects, work_experience and technologies
	const technologies = {};
	for (const tech of cv.technologies) {
		technologies[tech.title] = tech;
		tech.projects = [];
		tech.work_experience = [];
		tech.id = `technology-${makeId(tech.title)}`;
	}
	for (const proj of cv.projects) {
		proj.id = `project-${makeId(proj.title)}`;
		const p_technologies = [];
		for (const tname of proj.technologies) {
			const tech = technologies[tname];
			if (!tech)
				throw new Error(`no technology by title: ${tname} mentioned in the project ${proj.title}`);
			tech.projects.push(proj);
			p_technologies.push(tech);
		}
		proj.technologies = p_technologies;
	}
	for (const wexp of cv.work_experience) {
		const id = `${wexp.company}-${wexp.position}`;
		wexp.id = `wexp-${makeId(id)}`;
		const w_technologies = [];
		for (const tname of wexp.technologies) {
			const tech = technologies[tname];
			if (!tech)
				throw new Error(`no technology by title: ${tname} mentioned in the work_experience ${id}`);
			tech.work_experience.push(wexp);
			w_technologies.push(tech);
		}
		wexp.technologies = w_technologies;
	}

	// sort work_experience to display fresh items at the top
	cv.work_experience.sort(compareWorkExperience);

	// to render markdown in the template
	cv.markdown = markdown.toHTML;

	// render html
	const html = await renderFile('./template/index.ejs', cv, {});

	// write html into a file
	await writeFile('./index.html', html);
}

main();
