import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import data from "@/data/pediatric-resuscitation-medications.json";

const { Title } = Typography;
const medications: PediatricResuscitationMedication[] = data.medications;

type PediatricResuscitationMedication = {
	name: string;
	doses: {
		info: string;
		mg_mcg_mmol?: {
			multiplier?: number | number[];
			unit: string;
			max?: number;
			doses?: { multiplier: number; max: number }[];
		};
		ml?:
			| {
					multiplier: number | number[];
					max?: number;
			  }
			| {
					multiplier: number | number[];
					divider?: number;
					label?: string;
			  }[];
	}[];
};

type DataType = {
	key: string;
	medications: string;
	dose: string;
	weight: number;
} & Omit<PediatricResuscitationMedication["doses"][0], "info">;

const columns: ColumnsType<DataType> = [
	{
		title: "Medications",
		dataIndex: "medications",
		key: "medications",
	},
	{
		title: "Dose",
		dataIndex: "dose",
		key: "dose",
	},
	{
		title: "mg/mcg/mmol",
		dataIndex: "mg_mcg_mmol",
		key: "mg_mcg_mmol",
		render: (_, { mg_mcg_mmol, weight }) => {
			if (mg_mcg_mmol) {
				const { multiplier, unit, max, doses } = mg_mcg_mmol;
				if (doses && Array.isArray(doses)) {
					return (
						<>
							{doses.map((dose) => (
								<p key={dose.multiplier}>
									({dose.multiplier * weight}) {unit} (max
									value {max} {unit})
								</p>
							))}
						</>
					);
				} else if (multiplier) {
					let value = "";
					if (Array.isArray(multiplier)) {
						const [m1, m2] = multiplier;
						value = `(${m1 * weight} to ${m2 * weight}) ${unit}`;
					} else {
						value = `(${multiplier * weight}) ${unit}`;
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
		title: "ml",
		dataIndex: "ml",
		key: "ml",
		render: (_, { ml, weight }) => {
			if (ml) {
				const unit = "ml";
				if (Array.isArray(ml)) {
					const data = [];
					for (const m of ml) {
						const { multiplier, label, divider } = m;
						if (Array.isArray(multiplier) && label) {
							const [m1, m2] = multiplier;
							data.push(
								`(${m1 * weight} to ${
									m2 * weight
								}) ${unit} ${label}`
							);
						} else if (typeof multiplier === "number" && divider) {
							data.push(
								`(${(multiplier * weight) / divider}) ${unit}`
							);
						}
					}
					return (
						<>
							{data.map((d) => (
								<p key={d}>{d}</p>
							))}
						</>
					);
				} else {
					const { multiplier, max } = ml;
					let value = "";
					if (Array.isArray(multiplier)) {
						const [m1, m2] = multiplier;
						value = `(${m1 * weight} to ${m2 * weight}) ${unit}`;
					} else {
						value = `(${multiplier * weight}) ${unit}`;
					}
					if (max) {
						value = `${value} (max value ${max}${unit})`;
					}
					return value;
				}
			}
		},
	},
];

interface Props {
	weight: number;
}

export default function PediatricResuscitationMedications({ weight }: Props) {
	const tableData: DataType[] = [];

	for (const { name, doses } of medications) {
		for (const { info, mg_mcg_mmol, ml } of doses) {
			tableData.push({
				key: name,
				medications: name,
				dose: info,
				mg_mcg_mmol,
				ml,
				weight,
			});
		}
	}

	return (
		<>
			<Title level={2}>Pediatric Resuscitation Medications</Title>
			<Table columns={columns} dataSource={tableData} />
		</>
	);
}
