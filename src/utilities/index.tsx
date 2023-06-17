export function prettifyKeyName(key: string) {
	let newText = key.replace('_', ' ');
	newText = `${newText[0].toUpperCase()}${newText.slice(1)}`;
	return newText;
}

export function getNumberWithOneDecimalPoint(value: number) {
	return Number.parseFloat(value.toFixed(1));
}

export function capitalize(text: string, options?: {secondWord: boolean}): string {
	let newText = text;
	newText = `${newText[0].toUpperCase()}${newText.slice(1)}`;
	if (options?.secondWord) {
		return newText
			.split(' ')
			.map((t, index) => (index === 1 ? capitalize(t) : t))
			.join(' ');
	}

	return newText;
}

type DisplayDataOptions = {
	joinBy?: string;
	capitalize?: boolean | {
		secondWord: boolean;
	};
};

export function displayData(
	data: string | string[] | Record<string, string>,
	options: DisplayDataOptions = {},
) {
	const {joinBy, capitalize: cap = false} = options;
	if (typeof data === 'string') {
		return cap
			? capitalize(data, {
				secondWord: typeof cap === 'object' && cap?.secondWord,
			})
			: data;
	}

	if (Array.isArray(data)) {
		if (typeof joinBy === 'string') {
			return data
				.map(d => cap
					? capitalize(d, {
						secondWord: typeof cap === 'object' && cap?.secondWord,
					})
					: d,
				)
				.join(joinBy);
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
