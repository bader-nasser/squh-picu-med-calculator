import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import data from '@/data/pediatric-intubation-medications.json';
import {displayData, getDoseAmount} from '@/utilities';

const {Title} = Typography;
const {medications}: {medications: PediatricIntubationMedication[]} = data;

type PediatricIntubationMedication = {
	name: string | string[];
	doses: Array<{
		info: string | string[];
		mg_mcg_mmol: {
			multiplier: number | number[];
			unit: string;
			max?: number;
			min?: number;
		};
		ml: {
			multiplier: number | number[];
			max?: number;
			min?: number;
			divider?: number;
		};
	}>;
};

type DataType = {
	key: string;
	medications: string | string[];
	dose: string | string[];
	weight: number;
} & Omit<PediatricIntubationMedication['doses'][0], 'info'>;

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
		render(_, {dose}) {
			return displayData(dose);
		},
	},
	{
		title: 'mg/mcg/mmol',
		dataIndex: 'mg_mcg_mmol',
		key: 'mg_mcg_mmol',
		render(_, {mg_mcg_mmol, weight}) {
			const {multiplier, unit, max, min} = mg_mcg_mmol;
			const doseAmount = getDoseAmount({
				multiplier, weight, max, min, seperator: 'to'});
			return `(${doseAmount}) ${unit}`;
		},
	},
	{
		title: 'ml',
		dataIndex: 'ml',
		key: 'ml',
		render(_, {ml, weight}) {
			const unit = 'ml';
			const {multiplier, max, divider, min} = ml;
			const doseAmount = getDoseAmount({
				multiplier, weight, max, min, seperator: 'to'});
			return `(${doseAmount}) ${unit}`;
		},
	},
];

type Props = {
	weight: number;
};

export default function PediatricIntubationMedications({weight}: Props) {
	const tableData: DataType[] = [];
	let index = 0;
	const rowSpanData: Array<{index: number; length: number}> = [];

	for (const {name, doses} of medications) {
		let doseIndex = 0;

		/* eslint-disable @typescript-eslint/naming-convention */
		for (const {info, mg_mcg_mmol, ml} of doses) {
			const key = `${Array.isArray(name) ? name[0] : name}-${doseIndex}`;
			tableData.push({
				key,
				medications: name,
				dose: info,
				mg_mcg_mmol,
				/* eslint-enable @typescript-eslint/naming-convention */
				ml,
				weight,
			});

			if (doses.length > 1) {
				if (doseIndex === 0) {
					rowSpanData.push({index, length: doses.length});
				} else {
					rowSpanData.push({index, length: 0});
				}
			} else {
				rowSpanData.push({
					index, length: 1,
				});
			}

			doseIndex++;
			index++;
		}
	}

	columns[0].onCell = (_, tableIndex) => {
		for (const rowSpanInfo of rowSpanData) {
			if (tableIndex === rowSpanInfo.index) {
				return {rowSpan: rowSpanInfo.length};
			}
		}

		return {};
	};

	return (
		<>
			<Title level={2}>Pediatric Intubation Medications</Title>
			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
