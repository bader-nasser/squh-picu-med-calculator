import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import data from "@/data/other-important-infusions.json";

const { Title } = Typography;
const medications: OtherImportantInfusion[] = data.medications;

export type OtherImportantInfusion = {
	name: string;
	dose:
		| string
		| {
				info: string;
				multiplier: number;
				unit: string;
		  };
	formula_50ml:
		| string
		| {
				minimum_strength: string;
				maximum_strength: string;
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
	dose:
		| string
		| {
				info: string;
				multiplier?: number;
				unit?: string;
		  };
	formula_50ml:
		| string
		| {
				minimum_strength: string;
				maximum_strength: string;
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
		render: (_, { dose, weight }) => {
			if (typeof dose === "string") {
				return dose;
			} else {
				const { info, multiplier, unit } = dose;
				return (
					<>
						<div>{info}</div>
						{multiplier && (
							<div>
								({multiplier * weight}) {unit}
							</div>
						)}
					</>
				);
			}
		},
	},
	{
		title: "Formula (50ml)",
		dataIndex: "formula_50ml",
		key: "formula_50ml",
		render: (_, { formula_50ml }) => {
			if (typeof formula_50ml === "string") {
				return formula_50ml;
			} else {
				const { minimum_strength, maximum_strength } = formula_50ml;
				return (
					<>
						<div>
							<strong>Minimum strength</strong>:{" "}
							{minimum_strength}
						</div>
						<div>
							<strong>Maximum strength</strong>:{" "}
							{maximum_strength}
						</div>
					</>
				);
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

export default function OtherImportantInfusions({ weight }: Props) {
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
			<Table columns={columns} dataSource={tableData} />
		</>
	);
}
