import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import data from "@/data/other-important-infusions.json";
import { getNumberWithOneDecimalPoint } from "@/utilities";

const { Title } = Typography;
const medications: OtherImportantInfusion[] = data.medications;

type OtherImportantInfusion = {
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
	compatible: string | string[];
	incompatible: string | string[];
};

type DataType = {
	key: string;
	medications: string;
	weight: number;
} & Omit<OtherImportantInfusion, "name">;

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
				const doseAmount = getNumberWithOneDecimalPoint(
					multiplier * weight
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
						<p>
							<strong>Minimum strength</strong>:{" "}
							{minimum_strength}
						</p>
						<p>
							<strong>Maximum strength</strong>:{" "}
							{maximum_strength}
						</p>
					</>
				);
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
			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
