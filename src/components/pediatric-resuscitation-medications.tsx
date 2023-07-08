import {Table, Typography} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import data from '@/data/pediatric-resuscitation-medications.json';
import {displayData, getDoseAmount} from '@/utilities';

const {Title} = Typography;
// @ts-expect-error Ignoring ts error!
const {medications}: {medications: PediatricResuscitationMedication[]} = data;

export type PediatricResuscitationMedication = {
	name: string;
	doses: Array<{
		info: string;
		mg_mcg_mmol?: {
			/**
			 * The number multiplied by the weight.
			 * If the dose has a range, use an array like: [1, 2]
			 * @example
			 * "multiplier": [0.01, 0.5]
			 * @example
			 * "multiplier": 2
			 */
			multiplier?: number | number[];
			unit: 'mg' | 'mcg' | 'mmol';
			/**
			 * Optional
			 */
			max?: number;
			/**
			 * Optional
			 */
			doses?: Array<{
				/**
				 * The number multiplied by the weight
				 * @example
				 * "multiplier": 2
				 */
				multiplier: number;
				/**
				 * Optional
				 */
				max?: number;
			}>;
		};
		/**
		 * Optional
		 */
		ml?:
		| {
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
		}
		| Array<{
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
			 * @default 1
			 */
			divider?: number;
			/**
			 * Optional
			 */
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
		render(_, {medications}) {
			return displayData(medications, {capitalize: {secondWord: true}});
		},
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
					const data: string[] = [];
					for (const dose of doses) {
						const doseAmount = getDoseAmount({multiplier: dose.multiplier, weight, max});
						data.push(`(${doseAmount}) ${unit}`);
					}

					return displayData(data);
				}

				if (multiplier) {
					const doseAmount = getDoseAmount({multiplier, weight, max});
					return `(${doseAmount}) ${unit}`;
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
						const doseAmount = getDoseAmount({
							multiplier, weight, divider, seperator: 'to',
						});
						data.push(`(${doseAmount}) ${unit} ${label ?? ''}`);
					}

					return displayData(data);
				}

				const {multiplier, max} = ml;
				const doseAmount = getDoseAmount({
					multiplier, weight, max, seperator: 'to'});

				return `(${doseAmount}) ${unit}`;
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
		let index = 0;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		for (const {info, mg_mcg_mmol, ml} of doses) {
			const key = `${name}-${index}`;
			tableData.push({
				key,
				medications: name,
				dose: info,
				// eslint-disable-next-line @typescript-eslint/naming-convention
				mg_mcg_mmol,
				ml,
				weight,
			});
			index++;
		}
	}

	return (
		<>
			<Title
				level={2}
				className='print-bigger print-margin print-center'
			>
				Pediatric Resuscitation Medications
			</Title>

			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
