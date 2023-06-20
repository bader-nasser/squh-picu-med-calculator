import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import data from '@/data/inotropic-infusions.json';
import {displayData, capitalize, getDoseAmount, getNsAmount} from '@/utilities';

const {Title} = Typography;
const {medications}: {medications: InotropicInfusion[]} = data;

type InotropicInfusion = {
	name: string;
	dose:
	| string
	| {
		info: string;
		multiplier: number | number[];
		unit: string;
	};
	formula_50ml:
	| string
	| {
		text: string;
		multiplier: number;
		ns_multiplier?: number;
	};
	compatible: string | string[];
	incompatible: string | string[];
};

type DataType = {
	key: string;
	medications: string;
	weight: number;
} & Omit<InotropicInfusion, 'name'>;

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
				return capitalize(formula_50ml);
			}

			const {text, multiplier, ns_multiplier: nsMultiplier} = formula_50ml;
			const doseAmount = getDoseAmount({weight, multiplier});
			const nsAmount = getNsAmount({nsMultiplier, multiplier, weight});
			let newText = text.replace('_amount_', `${doseAmount}`);
			newText = newText.replace('_ns_amount_', `${nsAmount}`);
			return capitalize(newText);
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

export default function InotropicInfusions({weight}: Props) {
	const tableData: DataType[] = [];

	for (const medication of medications) {
		const {name} = medication;
		tableData.push({
			key: name,
			medications: name,
			weight,
			...medication,
		});
	}

	return (
		<>
			<Title level={2}>Inotropic Infusions</Title>
			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
