export function prettifyKeyName(key: string): string {
	let newText = key.replace('_', ' ');
	newText = `${newText[0].toUpperCase()}${newText.slice(1)}`;
	return newText;
}

type PrettifyOptions = {
	splitText?: string;
};

export function prettify(text: string, options: PrettifyOptions = {}): string {
	const {splitText = '-'} = options;
	return text
		.split(splitText)
		.map(t => `${t[0].toUpperCase()}${t.slice(1)}`)
		.join(' ');
}

export function round(value: number): number {
	return Number.parseFloat(value.toFixed(0));
}

export function getNumberWithOneDecimalPoint(value: number): number {
	return Number.parseFloat(value.toFixed(1));
}

type GetDoseAmountProps = {
	multiplier: number | number[];
	divider?: number;
	weight: number;
	max?: number;
	min?: number;
	seperator?: string;
};

type GetNsAmountProps = {
	multiplier: number;
	divider?: number;
	weight: number;
	nsMultiplier?: number;
};

export function getDoseAmount({
	multiplier, weight, divider, max, min, seperator = '-',
}: GetDoseAmountProps): string {
	const theDivider = divider ?? 1;
	if (typeof multiplier === 'number') {
		let doseAmount = getNumberWithOneDecimalPoint((multiplier * weight) / theDivider);
		if (min && doseAmount < min) {
			doseAmount = min;
		}

		if (max && doseAmount > max) {
			doseAmount = max;
		}

		return `${doseAmount}`;
	}

	let [v1, v2] = multiplier.map(m =>
		getNumberWithOneDecimalPoint((m * weight) / theDivider));
	if (min) {
		if (v1 < min) {
			v1 = min;
		}

		if (v2 < min) {
			v2 = min;
		}
	}

	if (max) {
		if (v1 > max) {
			v1 = max;
		}

		if (v2 > max) {
			v2 = max;
		}
	}

	if (v1 === v2) {
		return `${v1}`;
	}

	return `${v1} ${seperator} ${v2}`;
}

export function getNsAmount({
	nsMultiplier, multiplier, weight, divider = 1,
}: GetNsAmountProps): string {
	const theDivider = divider ?? 1;
	const theNsMultiplier = nsMultiplier ?? multiplier;
	const nsAmount = getNumberWithOneDecimalPoint(
		50 - ((theNsMultiplier * weight) / theDivider),
	);
	return `${nsAmount}`;
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
	const capitalizeSecondWord = typeof cap === 'object' && cap?.secondWord;

	if (typeof data === 'string') {
		return cap
			? capitalize(data, {secondWord: capitalizeSecondWord})
			: data;
	}

	if (Array.isArray(data)) {
		if (typeof joinBy === 'string') {
			return data
				.map(d => cap
					? capitalize(d, {secondWord: capitalizeSecondWord})
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
