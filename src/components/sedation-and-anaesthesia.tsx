import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {displayData, getDoseAmount, getNsAmount} from '@/utilities';
import data from '@/data/sedation-and-anaesthesia.json';

const {Title} = Typography;

// @ts-expect-error Silencing a strange error!
const {medications}: {medications: SedationAndAnaesthesiaDataType[]} = data;

type FormulaObjectData = {
	text: string;
	multiplier: number | number[];
	divider: number;
};

type SedationAndAnaesthesiaDataType = {
	name: string | string[];
	dose:
	| string
	| {
		info: string;
		multiplier: number | number[];
		unit: string;
	};
	formula_50ml: string | Record<string, string> | Record<string, FormulaObjectData>;
	compatible: string | string[];
	incompatible: string | string[];
};

type DataType = {
	key: string;
	medications: string | string[];
	weight: number;
} & Omit<SedationAndAnaesthesiaDataType, 'name'>;

const columns: ColumnsType<DataType> = [
	{
		title: 'Medications',
		dataIndex: 'medications',
		key: 'medications',
		render(_, {medications}) {
			return displayData(medications, {capitalize: true});
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
			const doseAmount = getDoseAmount({multiplier, weight});
			const calculations = `(${doseAmount}) ${unit}`;
			const data = [info, calculations];

			return displayData(data);
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
					const doseAmount = getDoseAmount({multiplier, weight});
					const doseAmountMl = getDoseAmount({multiplier, weight, divider});
					if (typeof multiplier === 'number') {
						const nsAmount = getNsAmount({multiplier, weight, divider});
						newText = newText.replace('_ns_amount_', nsAmount);
					}

					newText = newText.replace('_amount_', doseAmount);
					newText = newText.replace('_amount_ml_', doseAmountMl);
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
		const {name} = medication;
		const key = Array.isArray(name) ? name[0] : name;
		tableData.push({
			key,
			medications: name,
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
