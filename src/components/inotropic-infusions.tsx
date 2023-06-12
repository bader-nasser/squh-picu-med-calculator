import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import data from "@/data/inotropic-infusions.json";

const { Title } = Typography;
const medications: InotropicInfusion[] = data.medications;

export type InotropicInfusion = {
	name: string;
	dose: string;
	formula_50ml:
		| string
		| {
				text: string;
				multiplier: number;
				ns_multiplier?: number;
		  };
	compatible: string[];
	incompatible: string[];
};

interface Props {
	weight: number;
}

interface DataType {
	key: string;
	medications: string;
	dose: string;
	formula_50ml:
		| string
		| {
				text: string;
				multiplier: number;
				ns_multiplier?: number;
		  };
	compatible: string[];
	incompatible: string[];
	weight: number;
}

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
		title: "Formula (50ml)",
		dataIndex: "formula_50ml",
		key: "formula_50ml",
		render: (_, { formula_50ml, weight }) => {
			if (typeof formula_50ml === "string") {
				return formula_50ml;
			} else {
				const { text, multiplier, ns_multiplier } = formula_50ml;
				let newText = text.replace(
					"_amount_",
					`${multiplier * weight}`
				);
				newText = newText.replace(
					"_ns_amount_",
					`${50 - (ns_multiplier || multiplier) * weight}`
				);
				return newText;
			}
		},
	},
	{
		title: "Compatible",
		dataIndex: "compatible",
		key: "compatible",
		render: (_, { compatible }) => compatible.join(", "),
	},
	{
		title: "Incompatible",
		dataIndex: "incompatible",
		key: "incompatible",
		render: (_, { incompatible }) => incompatible.join(", "),
	},
];

export default function InotropicInfusions({ weight }: Props) {
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
			<Title level={2}>Inotropic Infusions</Title>
			<Table columns={columns} dataSource={tableData} />
		</>
	);
}
