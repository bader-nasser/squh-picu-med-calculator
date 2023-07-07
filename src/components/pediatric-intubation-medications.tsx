import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import data from '@/data/pediatric-intubation-medications.json';
import {displayData, getDoseAmount} from '@/utilities';

const {Title} = Typography;
// @ts-expect-error Ignoring ts error!
const {medications}: {medications: PediatricIntubationMedication[]} = data;

export type PediatricIntubationMedication = {
	/**
	 * @example
	 * "name": "Midazolam (5mg/ml), (prepare a solution of 5mg (1ml) midazolam with 4 ml of 0.9% NS (1mg/ml))"
	 * @example
	 * "name": [
	 *   "Atropine (0.5mg/ml)",
	 *   "(Prepare a solution of 0.5mg of atropine with 4ml of 0.9%NS (100mcg/ml))"
	 * ]
	 */
	name: string | string[];
	doses: Array<{
		info: string | string[];
		mg_mcg_mmol: {
			/**
			 * The number multiplied by the weight.
			 * If the dose has a range, use an array like: [1, 2]
			 * @example
			 * "multiplier": [0.01, 0.5]
			 * @example
			 * "multiplier": 2
			 */
			multiplier: number | number[];
			unit: 'mg' | 'mcg' | 'mmol';
			/**
			 * Optional
			 */
			max?: number;
			/**
			 * Optional
			 */
			min?: number;
		};
		ml: {
			/**
			 * The number multiplied by the weight.
			 * If the dose has a range, use an array like: [1, 2]
			 * @example
			 * "multiplier": [0.01, 0.5]
			 * @example
			 * "multiplier": 2
			 */
			multiplier: number | number[];
			/**
			 * Optional
			 */
			max?: number;
			/**
			 * Optional
			 */
			min?: number;
			/**
			 * Optional
			 * @default 1
			 */
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
			<Title
				level={2}
				className='print-bigger print-margin'
			>
				Pediatric Intubation Medications
			</Title>

			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
