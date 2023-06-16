export function prettifyKeyName(key: string) {
	let newText = key.replace('_', ' ');
	newText = `${newText[0].toUpperCase()}${newText.slice(1)}`;
	return newText;
}

export function getNumberWithOneDecimalPoint(value: number) {
	return Number.parseFloat(value.toFixed(1));
}

export function capitalize(text: string, options?: {secondWord: boolean}) {
	let newText = text;
	newText = `${newText[0].toUpperCase()}${newText.slice(1)}`;
	if (options?.secondWord) {
		const [firstWord, secondWord = '', ...rest] = newText.split(' ');
		newText = `${firstWord}${capitalize(secondWord)}${rest.toString()}}`;
	}

	return newText;
}

type DisplayDataOptions = {
	joinBy: string;
};

export function displayData(data: string | string[] | Record<string, string>, options?: DisplayDataOptions) {
	if (typeof data === 'string') {
		return data;
	}

	if (Array.isArray(data)) {
		if (options) {
			return data.join(options.joinBy);
		}

		return (
			<>
				{data.map(d => (
					<p key={d}>{d}</p>
				))}
			</>
		);
	}

	return (
		<>
			{Object.entries(data).map(([key, value]) => (
				<p key={key}>
					<strong>{prettifyKeyName(key)}:</strong> {value}
				</p>
			))}
		</>
	);
}
