export function prettifyKeyName(key: string) {
	let newText = key.replace("_", " ");
	newText = `${newText[0].toUpperCase()}${newText.slice(1)}`;
	return newText;
}

export function getNumberWithOneDecimalPoint(value: number) {
	return parseFloat(value.toFixed(1));
}
