import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import data from '@/data/other-important-infusions.json';
import {displayData, getNumberWithOneDecimalPoint, prettifyKeyName} from '@/utilities';

const {Title} = Typography;
const {medications}: {medications: OtherImportantInfusion[]} = data;

type OtherImportantInfusion = {
	name: string;
	dose:
	| string
	| {
		info: string;
		multiplier: number;
		unit: string;
	};
	formula_50ml: string | Record<string, string>;
	compatible: string | string[];
	incompatible: string | string[];
};

type DataType = {
	key: string;
	medications: string;
	weight: number;
} & Omit<OtherImportantInfusion, 'name'>;

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
			const doseAmount = getNumberWithOneDecimalPoint(
				multiplier * weight,
			);

			return (
				<>
					<p>{info}</p>
					{multiplier && (
						<p>
							({doseAmount}) {unit}
						</p>
					)}
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

export default function OtherImportantInfusions({weight}: Props) {
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
			<Title level={2}>Other Important Infusions</Title>
			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
