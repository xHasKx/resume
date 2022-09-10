import { parse } from 'yaml';
import { readFile, writeFile } from 'fs/promises';
import { renderFile } from 'ejs';

async function main() {
	// load CV data in YAML form
	const cvYaml = await readFile('./data/cv.yaml', { encoding: 'utf-8' });

	// parse data from YAML form into js object
	const cv = parse(cvYaml);

	// TODO: expand data

	// render html
	const html = await renderFile('./template/index.ejs', cv, {});

	// write html into a file
	await writeFile('./index.html', html);
}

main();
