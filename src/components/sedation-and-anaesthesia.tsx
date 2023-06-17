import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {displayData, getNumberWithOneDecimalPoint, prettifyKeyName, capitalize} from '@/utilities';
import data from '@/data/sedation-and-anaesthesia.json';

const {Title} = Typography;

// @ts-expect-error Silencing a strange error!
const {medications}: {medications: SedationAndAnaesthesiaDataType[]} = data;

type DoseAmountArgs = {
	multiplier: number;
	weight: number;
	divider?: number;
};

function getDoseAmount({multiplier, weight, divider = 1}: DoseAmountArgs) {
	return getNumberWithOneDecimalPoint(multiplier * weight / divider);
}

function getNsAmount({multiplier, weight, divider = 1}: DoseAmountArgs) {
	return getNumberWithOneDecimalPoint(50 - (multiplier * weight / divider));
}

type FormulaObjectData = {
	text: string;
	multiplier: number | number[];
	divider: number;
};

type SedationAndAnaesthesiaDataType = {
	name: string;
	dose:
	| string
	| {
		info: string;
		multiplier: number | number[];
		unit: string;
	};
	formula_50ml: string | Record<string, string> | Record<string, FormulaObjectData>;
	compatible: string[];
	incompatible: string[];
};

type DataType = {
	key: string;
	medications: string;
	weight: number;
} & Omit<SedationAndAnaesthesiaDataType, 'name'>;

const columns: ColumnsType<DataType> = [
	{
		title: 'Medications',
		dataIndex: 'medications',
		key: 'medications',
		render(_, {medications}) {
			return capitalize(medications);
		},
	},
	{
		title: 'Dose',
		dataIndex: 'dose',
		key: 'dose',
		render(_, {dose, weight}) {
			if (typeof dose === 'string') {
				return dose;
			}

			const {info, multiplier, unit} = dose;
			let computedValue = '';
			if (typeof multiplier === 'number') {
				computedValue = `${getDoseAmount({multiplier, weight})}`;
			} else {
				const [v1, v2] = multiplier.map(m =>
					getDoseAmount({multiplier: m, weight}),
				);
				computedValue = `${v1} - ${v2}`;
			}

			return (
				<>
					<p>{info}</p>
					<p>
						({computedValue}) {unit}
					</p>
				</>
			);
		},
	},
	{
		title: 'Formula (50ml)',
		dataIndex: 'formula_50ml',
		key: 'formula_50ml',
		render(_, {formula_50ml, weight}) {
			if (typeof formula_50ml === 'string') {
				return displayData(formula_50ml, {capitalize: true});
			}

			const newFormula: Record<string, string> = {};
			for (const [key, value] of Object.entries(formula_50ml)) {
				if (typeof value === 'string') {
					newFormula[key] = value;
				} else {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const newValue: FormulaObjectData = value;
					const {text, multiplier, divider} = newValue;
					let newText = text;
					let amount: string;
					let amountMl: string;
					if (typeof multiplier === 'number') {
						amount = getDoseAmount({multiplier, weight}).toString();
						amountMl = getDoseAmount({multiplier, weight, divider}).toString();
						const nsAmount = getNsAmount({multiplier, weight, divider}).toString();
						newText = newText.replace('_ns_amount_', nsAmount);
					} else {
						const [v1, v2] = multiplier.map(m =>
							getDoseAmount({multiplier: m, weight}));
						const [v1Ml, v2Ml] = multiplier.map(m =>
							getDoseAmount({multiplier: m, weight, divider}));
						amount = `(${v1} to ${v2})`;
						amountMl = `(${v1Ml} to ${v2Ml})`;
					}

					newText = newText.replace('_amount_', amount);
					newText = newText.replace('_amount_ml_', amountMl);
					newFormula[key] = newText;
				}
			}

			return displayData(newFormula, {capitalize: true});
		},
	},
	{
		title: 'Compatible',
		dataIndex: 'compatible',
		key: 'compatible',
		render(_, {compatible}) {
			return displayData(compatible, {
				joinBy: ', ',
				capitalize: {secondWord: true},
			});
		},
	},
	{
		title: 'Incompatible',
		dataIndex: 'incompatible',
		key: 'incompatible',
		render(_, {incompatible}) {
			return displayData(incompatible, {
				joinBy: ', ',
				capitalize: {secondWord: true},
			});
		},
	},
];

type Props = {
	weight: number;
};

export default function SedationAndAnaesthesia({weight}: Props) {
	const tableData: DataType[] = [];

	for (const medication of medications) {
		tableData.push({
			key: medication.name,
			medications: medication.name,
			weight,
			...medication,
		});
	}

	return (
		<>
			<Title level={2}>Sedation and Anaesthesia</Title>
			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
