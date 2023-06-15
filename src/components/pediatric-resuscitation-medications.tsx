import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import data from '@/data/pediatric-resuscitation-medications.json';
import {getNumberWithOneDecimalPoint} from '@/utilities';

const {Title} = Typography;
const {medications}: {medications: PediatricResuscitationMedication[]} = data;

type PediatricResuscitationMedication = {
	name: string;
	doses: Array<{
		info: string;
		mg_mcg_mmol?: {
			multiplier?: number | number[];
			unit: string;
			max?: number;
			doses?: Array<{multiplier: number; max?: number}>;
		};
		ml?:
		| {
			multiplier: number | number[];
			max?: number;
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
	medications: string;
	dose: string;
	weight: number;
} & Omit<PediatricResuscitationMedication['doses'][0], 'info'>;

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
	},
	{
		title: 'mg/mcg/mmol',
		dataIndex: 'mg_mcg_mmol',
		key: 'mg_mcg_mmol',
		render(_, {mg_mcg_mmol, weight}) {
			if (mg_mcg_mmol) {
				const {multiplier, unit, max, doses} = mg_mcg_mmol;
				if (doses && Array.isArray(doses)) {
					return (
						<>
							{doses.map(dose => (
								<p key={dose.multiplier}>
									(
									{getNumberWithOneDecimalPoint(
										dose.multiplier * weight,
									)}
									) {unit}{' '}
									{dose.max
										&& `(max value ${dose.max} ${unit})`}
								</p>
							))}
						</>
					);
				}

				if (multiplier) {
					let value = '';
					if (Array.isArray(multiplier)) {
						const [v1, v2] = multiplier.map(m =>
							getNumberWithOneDecimalPoint(m * weight),
						);
						value = `(${v1} to ${v2}) ${unit}`;
					} else {
						const amount = getNumberWithOneDecimalPoint(
							multiplier * weight,
						);
						value = `(${amount}) ${unit}`;
					}

					if (max) {
						value = `${value} (max value ${max}${unit})`;
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
							const [v1, v2] = multiplier.map(m =>
								getNumberWithOneDecimalPoint(m * weight),
							);
							data.push(`(${v1} to ${v2}) ${unit} ${label}`);
						} else if (typeof multiplier === 'number' && divider) {
							const amount = getNumberWithOneDecimalPoint(
								(multiplier * weight) / divider,
							);
							data.push(`(${amount}) ${unit}`);
						}
					}

					return (
						<>
							{data.map(d => (
								<p key={d}>{d}</p>
							))}
						</>
					);
				}

				const {multiplier, max} = ml;
				let value = '';
				if (Array.isArray(multiplier)) {
					const [v1, v2] = multiplier.map(m =>
						getNumberWithOneDecimalPoint(m * weight),
					);
					value = `(${v1} to ${v2}) ${unit}`;
				} else {
					const amount = getNumberWithOneDecimalPoint(
						multiplier * weight,
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

export default function PediatricResuscitationMedications({weight}: Props) {
	const tableData: DataType[] = [];

	for (const {name, doses} of medications) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		for (const {info, mg_mcg_mmol, ml} of doses) {
			tableData.push({
				key: name,
				medications: name,
				dose: info,
				// eslint-disable-next-line @typescript-eslint/naming-convention
				mg_mcg_mmol,
				ml,
				weight,
			});
		}
	}

	return (
		<>
			<Title level={2}>Pediatric Resuscitation Medications</Title>
			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
