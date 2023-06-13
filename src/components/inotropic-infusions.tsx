import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import data from "@/data/inotropic-infusions.json";
import { getNumberWithOneDecimalPoint } from "@/utilities";

const { Title } = Typography;
const medications: InotropicInfusion[] = data.medications;

type InotropicInfusion = {
	name: string;
	dose: string;
	formula_50ml:
		| string
		| {
				text: string;
				multiplier: number;
				ns_multiplier?: number;
		  };
	compatible: string | string[];
	incompatible: string | string[];
};

type DataType = {
	key: string;
	medications: string;
	weight: number;
} & Omit<InotropicInfusion, "name">;

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
				const amount = getNumberWithOneDecimalPoint(
					multiplier * weight
				);
				const nsAmount = getNumberWithOneDecimalPoint(
					50 - (ns_multiplier || multiplier) * weight
				);
				let newText = text.replace("_amount_", `${amount}`);
				newText = newText.replace("_ns_amount_", `${nsAmount}`);
				return newText;
			}
		},
	},
	{
		title: "Compatible",
		dataIndex: "compatible",
		key: "compatible",
		render: (_, { compatible }) => {
			if (typeof compatible === "string") {
				return compatible;
			} else {
				return compatible.join(", ");
			}
		},
	},
	{
		title: "Incompatible",
		dataIndex: "incompatible",
		key: "incompatible",
		render: (_, { incompatible }) => {
			if (typeof incompatible === "string") {
				return incompatible;
			} else {
				return incompatible.join(", ");
			}
		},
	},
];

interface Props {
	weight: number;
}

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
			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
