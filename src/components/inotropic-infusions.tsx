import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import data from '@/data/inotropic-infusions.json';
import {displayData, capitalize, getDoseAmount, getNsAmount} from '@/utilities';

const {Title} = Typography;
const {medications}: {medications: InotropicInfusion[]} = data;

export type InotropicInfusion = {
	name: string;
	dose:
	| string
	| {
		info: string;
		/**
		 * The number multiplied by the weight.
		 * If the dose has a range, use an array like: [1, 2]
		 * @example
		 * "multiplier": [0.01, 0.5]
		 * @example
		 * "multiplier": 2
		 */
		multiplier: number | number[];
		unit: string;
	};
	formula_50ml:
	| string
	| {
		/**
		 * Use special values for calculations:
		 *
		 * `_amount_` which is equal to (`multiplier` x weight).
		 *
		 * `_ns_amount_` which is equal to (50 - (`ns_multiplier` x weight)).
		 *
		 * Note: if `ns_multiplier` = `multiplier`, then no need to use
		 * `ns_multiplier`
		 */
		text: string;
		/**
		 * The number multiplied by the weight.
		 * Should be a number not an array of numbers
		 * @example
		 * "multiplier": 30
		 */
		multiplier: number;
		/**
		 * Optional key, use it when it's NOT equal to the `multiplier`
		 * @example
		 * "ns_multiplier": 0.3
		 */
		ns_multiplier?: number;
		/**
		 * The devider applied when calculating `_amount_ml_` and `_ns_amount_` used
		 * in `text`. Optional
		 */
		divider?: number;
	};
	/**
	 * Note: The first letter of the first two words will be capitalized!
	 * @example
	 * "compatible": "single value"
	 * @example
	 * "compatible": ["also single value"]
	 * @example
	 * "compatible": ["multiple", "values", "more than one"]
	 */
	compatible: string | string[];
	/**
	 * Note: The first letter of the first two words will be capitalized!
	 * @example
	 * "incompatible": "single value"
	 * @example
	 * "incompatible": ["also single value"]
	 * @example
	 * "incompatible": ["multiple", "values", "more than one"]
	 */
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

			const {text, multiplier, ns_multiplier: nsMultiplier, divider} = formula_50ml;
			const doseAmount = getDoseAmount({weight, multiplier});
			const doseAmountMl = getDoseAmount({multiplier, weight, divider});
			const nsAmount = getNsAmount({nsMultiplier, multiplier, weight});
			let newText = text.replace('_amount_', `${doseAmount}`);
			newText = newText.replace('_amount_ml_', `${doseAmountMl}`);
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
