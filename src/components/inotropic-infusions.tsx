import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import data from '@/data/inotropic-infusions.json';
import {displayData, getNumberWithOneDecimalPoint, capitalize} from '@/utilities';

const {Title} = Typography;
const {medications}: {medications: InotropicInfusion[]} = data;

type GetAmountProps = {
	multiplier: number;
	weight: number;
};

type GetNsAmountProps = {
	nsMultiplier?: number;
} & GetAmountProps;

function getAmount({multiplier, weight}: GetAmountProps) {
	return getNumberWithOneDecimalPoint(
		multiplier * weight,
	);
}

function getDoseAmount(args: GetAmountProps) {
	return getAmount(args);
}

function getNsAmount({nsMultiplier, multiplier, weight}: GetNsAmountProps) {
	return getNumberWithOneDecimalPoint(
		50 - ((nsMultiplier ?? multiplier) * weight),
	);
}

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

			let text = '';
			const {info, multiplier, unit} = dose;

			if (typeof multiplier === 'number') {
				const doseAmount = getDoseAmount({multiplier, weight});
				text = `(${doseAmount}) ${unit}`;
			} else {
				const [v1, v2] = multiplier.map(m =>
					getDoseAmount({multiplier: m, weight}),
				);
				text = `(${v1} to ${v2}) ${unit}`;
			}

			return (
				<>
					<p>{info}</p>
					<p>{text}</p>
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
				return capitalize(formula_50ml);
			}

			const {text, multiplier, ns_multiplier: nsMultiplier} = formula_50ml;
			const amount = getAmount({weight, multiplier});
			const nsAmount = getNsAmount({nsMultiplier, multiplier, weight});
			let newText = text.replace('_amount_', `${amount}`);
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
		tableData.push({
			key: medication.name,
			medications: medication.name,
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
