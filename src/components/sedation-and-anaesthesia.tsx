import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {displayData, getNumberWithOneDecimalPoint, prettifyKeyName} from '@/utilities';
import data from '@/data/sedation-and-anaesthesia.json';

const {Title} = Typography;

// @ts-expect-error Silencing a strange error!
const {medications}: {medications: SedationAndAnaesthesiaDataType[]} = data;

type SedationAndAnaesthesiaDataType = {
	name: string;
	dose:
	| string
	| {
		info: string;
		multiplier: number | number[];
		unit: string;
	};
	formula_50ml: string | Record<string, string>;
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
				computedValue = `${getNumberWithOneDecimalPoint(
					multiplier * weight,
				)}`;
			} else {
				const [v1, v2] = multiplier.map(m =>
					getNumberWithOneDecimalPoint(m * weight),
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
		render(_, {formula_50ml}) {
			return displayData(formula_50ml);
		},
	},
	{
		title: 'Compatible',
		dataIndex: 'compatible',
		key: 'compatible',
		render(_, {compatible}) {
			return displayData(compatible, {joinBy: ', '});
		},
	},
	{
		title: 'Incompatible',
		dataIndex: 'incompatible',
		key: 'incompatible',
		render(_, {incompatible}) {
			return displayData(incompatible, {joinBy: ', '});
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
