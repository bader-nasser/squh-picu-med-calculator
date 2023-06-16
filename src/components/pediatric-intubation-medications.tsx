import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import data from '@/data/pediatric-intubation-medications.json';
import {displayData, getNumberWithOneDecimalPoint} from '@/utilities';

const {Title} = Typography;
const {medications}: {medications: PediatricIntubationMedication[]} = data;

type GetMgMcgMmolValueProps = {multiplier: number; weight: number};
type GetMlValueProps = {divider?: number} & GetMgMcgMmolValueProps;

function getMlValue({multiplier, divider = 1, weight}: GetMlValueProps) {
	return divider && getNumberWithOneDecimalPoint(
		(multiplier * weight) / divider,
	);
}

function getMgMcgMmolValue({multiplier, weight}: GetMgMcgMmolValueProps) {
	return getNumberWithOneDecimalPoint(multiplier * weight);
}

type PediatricIntubationMedication = {
	name: string | string[];
	doses: Array<{
		info: string | string[];
		mg_mcg_mmol?: {
			multiplier?: number | number[];
			unit: string;
			max?: number;
			min?: number;
			doses?: Array<{multiplier: number; max: number}>;
		};
		ml?:
		| {
			multiplier: number | number[];
			max?: number;
			min?: number;
			divider?: number;
		}
		| Array<{
			multiplier: number | number[];
			divider?: number;
			label?: string;
		}>;
	}>;
};

type DataType = {
	key: string;
	medications: string | string[];
	dose: string | string[];
	weight: number;
} & Omit<PediatricIntubationMedication['doses'][0], 'info'>;

const columns: ColumnsType<DataType> = [
	{
		title: 'Medications',
		dataIndex: 'medications',
		key: 'medications',
		render(_, {medications}) {
			return displayData(medications);
		},
	},
	{
		title: 'Dose',
		dataIndex: 'dose',
		key: 'dose',
		render(_, {dose}) {
			return displayData(dose);
		},
	},
	{
		title: 'mg/mcg/mmol',
		dataIndex: 'mg_mcg_mmol',
		key: 'mg_mcg_mmol',
		render(_, {mg_mcg_mmol, weight}) {
			if (mg_mcg_mmol) {
				const {multiplier, unit, max, min, doses} = mg_mcg_mmol;
				if (doses && Array.isArray(doses)) {
					const data: string[] = [];
					for (const dose of doses) {
						let text = `(${getMgMcgMmolValue({
							multiplier: dose.multiplier,
							weight})}) ${unit}`;
						if (max) {
							text = `${text} (max value ${max} ${unit})`;
						}

						data.push(text);
					}

					return displayData(data);
				}

				if (multiplier) {
					let value = '';
					if (Array.isArray(multiplier)) {
						const [v1, v2] = multiplier.map(m =>
							getMgMcgMmolValue({multiplier: m, weight}),
						);
						value = `(${v1} to ${v2}) ${unit}`;
					} else {
						value = `(${getMgMcgMmolValue(
							{multiplier, weight},
						)}) ${unit}`;
					}

					if (max) {
						value = `${value} (max value ${max} ${unit})`;
					}

					if (min) {
						value = `${value} (minimum value ${min} ${unit})`;
					}

					return value;
				}
			}
		},
	},
	{
		title: 'ml',
		dataIndex: 'ml',
		key: 'ml',
		render(_, {ml, weight}) {
			if (ml) {
				const unit = 'ml';
				if (Array.isArray(ml)) {
					const data = [];
					for (const m of ml) {
						const {multiplier, label, divider} = m;
						if (Array.isArray(multiplier) && label) {
							const [v1, v2] = multiplier.map(mul =>
								getMlValue({multiplier: mul, weight, divider}),
							);
							data.push(`(${v1} to ${v2}) ${unit} ${label}`);
						} else if (typeof multiplier === 'number' && divider) {
							const value = getMlValue({
								multiplier, weight, divider,
							});
							data.push(`(${value}) ${unit}`);
						}
					}

					return displayData(data);
				}

				const {multiplier, max, divider, min} = ml;
				let value = '';
				if (Array.isArray(multiplier)) {
					const [v1, v2] = multiplier.map(m =>
						getMlValue({multiplier: m, weight, divider}),
					);
					value = `(${v1} to ${v2}) ${unit}`;
				} else {
					const amount = getMlValue({
						multiplier, weight, divider,
					},
					);
					value = `(${amount}) ${unit}`;
				}

				if (max) {
					value = `${value} (max value ${max}${unit})`;
				}

				return value;
			}
		},
	},
];

type Props = {
	weight: number;
};

export default function PediatricIntubationMedications({weight}: Props) {
	const tableData: DataType[] = [];
	let index = 0;
	const rowSpanData: Array<{index: number; length: number}> = [];

	for (const {name, doses} of medications) {
		let doseIndex = 0;

		/* eslint-disable @typescript-eslint/naming-convention */
		for (const {info, mg_mcg_mmol, ml} of doses) {
			tableData.push({
				key: Array.isArray(name) ? name[0] : name,
				medications: name,
				dose: info,
				mg_mcg_mmol,
				/* eslint-enable @typescript-eslint/naming-convention */
				ml,
				weight,
			});

			if (doses.length > 1) {
				if (doseIndex === 0) {
					rowSpanData.push({index, length: doses.length});
				} else {
					rowSpanData.push({index, length: 0});
				}
			} else {
				rowSpanData.push({
					index, length: 1,
				});
			}

			doseIndex++;
			index++;
		}
	}

	columns[0].onCell = (_, tableIndex) => {
		for (const rowSpanInfo of rowSpanData) {
			if (tableIndex === rowSpanInfo.index) {
				return {rowSpan: rowSpanInfo.length};
			}
		}

		return {};
	};

	return (
		<>
			<Title level={2}>Pediatric Intubation Medications</Title>
			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
