import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import data from '@/data/other-important-infusions.json';
import {getNumberWithOneDecimalPoint, prettifyKeyName} from '@/utilities';

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
			if (typeof formula_50ml === 'string') {
				return formula_50ml;
			}

			return (
				<>
					{Object.entries(formula_50ml).map(([key, value]) => (
						<p key={key}>
							<strong>{prettifyKeyName(key)}:</strong> {value}
						</p>
					))}
				</>
			);
		},
	},
	{
		title: 'Compatible',
		dataIndex: 'compatible',
		key: 'compatible',
		render(_, {compatible}) {
			if (typeof compatible === 'string') {
				return compatible;
			}

			return compatible.join(', ');
		},
	},
	{
		title: 'Incompatible',
		dataIndex: 'incompatible',
		key: 'incompatible',
		render(_, {incompatible}) {
			if (typeof incompatible === 'string') {
				return incompatible;
			}

			return incompatible.join(', ');
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
