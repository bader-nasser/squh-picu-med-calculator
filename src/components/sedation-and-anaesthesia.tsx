import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {displayData, getDoseAmount, getNsAmount} from '@/utilities';
import data from '@/data/sedation-and-anaesthesia.json';

const {Title} = Typography;

// @ts-expect-error Silencing a strange error!
const {medications}: {medications: SedationAndAnaesthesiaDataType[]} = data;

type FormulaObjectData = {
	/**
	 * Use special values for calculations:
	 * `_amount_` which is equal to (multiplier x weight).
	 *
	 * `_amount_ml_` which is equal to ((multiplier x weight) / divider).
	 *
	 * `_ns_amount_` which is equal to (50 - ((multiplier x weight) / divider)).
	 */
	text: string;
	/**
	 * The number multiplied by the weight.
	 * If the dose has a range, use an array like: [1, 2]
	 *
	 * Note: can't be an array if you use the `_ns_amount_` in the `text`
	 * @example
	 * "multiplier": [0.01, 0.5]
	 * @example
	 * "multiplier": 2
	 */
	multiplier: number | number[];
	/**
	 * The divider applied when calculating `_amout_ml_` and `_ns_amount_` used
	 * in `text`.
	 */
	divider: number;
};

export type SedationAndAnaesthesiaDataType = {
	name: string | string[];
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
	/**
	 * @example
	 * "formula_50ml": "Undiluted"
	 * @example
	 * "formula_50ml": {
	 *   "single_strength": "prepare solution of (500mcg) 10ml of fentanyl with 40 ml of 0.9% NS \n (10mcg/ml)",
	 *   "double_strength": "prepare solution of (1000mcg) 20 ml of fentanyl with 30 ml of 0.9% NS \n (20mcg/ml)"
	 * }
	 * @example
	 * "formula_50ml": {
	 *   "full_strength": {
	 *     "text": "prepare solution of (_amount_) mg (_amount_ml_) ml with (_ns_amount_) ml of 0.9% NS \n (20mcg/Kg/ml)",
	 *     "multiplier": 1,
	 *     "divider": 10
	 *   },
	 *   "double_strength": {
	 *     "text": "prepare solution of (_amount_) mg (_amount_ml_) ml with (_ns_amount_) ml of 0.9% NS \n (40mcg/Kg/ml)",
	 *     "multiplier": 2,
	 *     "divider": 10
	 *   }
	 * }
	 */
	formula_50ml: string | Record<string, string> | Record<string, FormulaObjectData>;
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
