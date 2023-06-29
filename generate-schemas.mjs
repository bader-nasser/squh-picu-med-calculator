import {writeFile, watch} from 'node:fs';
import {argv} from 'node:process';
import tsj from 'ts-json-schema-generator';

const args = new Set(argv.slice(2));

const files = [
	'pediatric-resuscitation-medications',
	'pediatric-intubation-medications',
	'inotropic-infusions',
	'sedation-and-anaesthesia',
	'other-important-infusions',
];

function getTypeFromFile(filename) {
	let typeName = filename
		.split('-')
		.map(name => `${name[0].toUpperCase()}${name.slice(1)}`)
		.join('');
	if (!typeName.includes('Medications')) {
		typeName = typeName.replace(/s$/, '');
		typeName = `${typeName}Medications`;
	}

	return typeName;
}

function generate(filename) {
	const filteredFiles = files.filter(file => {
		if (filename) {
			if (file === filename) {
				return file;
			}

			return;
		}

		return file;
	});

	for (const file of filteredFiles) {
		/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
		const config = {
			path: 'src/data/types.ts',
			tsconfig: 'tsconfig.json',
			type: getTypeFromFile(file),
		};

		const outputPath = `src/schemas/${file}.json`;

		const schema = tsj.createGenerator(config).createSchema(config.type);
		const schemaString = JSON.stringify(schema, null, 4);

		console.log(`Creating "${outputPath}"...`);
		writeFile(outputPath, schemaString, error => {
			if (error) {
				throw error;
			}
		});
	}
}

generate();

if (args.has('-w') || args.has('--watch')) {
	console.log('Watching `src` directory for changes...');
	watch('src', {recursive: true}, filename => {
		if (filename) {
			for (const file of files) {
				if (filename.includes(`${file}.tsx`)) {
					console.log(`Recreating schema file for "${file}.tsx"...`);
					generate(file);
				}
			}

			if (filename.includes('types.ts')) {
				console.log('Recreating all schema files...');
				generate();
			}
		} else {
			console.log('filename not provided');
		}
	});
}
