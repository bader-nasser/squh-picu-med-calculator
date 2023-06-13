import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";

import { getNumberWithOneDecimalPoint, prettifyKeyName } from "@/utilities";
import data from "@/data/sedation-and-anaesthesia.json";

const { Title } = Typography;
// @ts-ignore
const medications: SedationAndAnaesthesia[] = data.medications;

type SedationAndAnaesthesia = {
	name: string;
	dose:
		| string
		| {
				info: string;
				multiplier: number | number[];
				unit: string;
		  };
	formula_50ml: string | { [key: string]: string };
	compatible: string[];
	incompatible: string[];
};

type DataType = {
	key: string;
	medications: string;
	weight: number;
} & Omit<SedationAndAnaesthesia, "name">;

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
				let computedValue = "";
				if (typeof multiplier === "number") {
					computedValue = `${getNumberWithOneDecimalPoint(
						multiplier * weight
					)}`;
				} else {
					const [v1, v2] = multiplier.map((m) =>
						getNumberWithOneDecimalPoint(m * weight)
					);
					computedValue = `${v1} - ${v2}`;
				}
				return (
					<>
						<p>{info}</p>
						<p>
							({computedValue}) {unit}
						</p>
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
				return (
					<>
						{Object.entries(formula_50ml).map(([key, value]) => (
							<p key={key}>
								<strong>{prettifyKeyName(key)}</strong>: {value}
							</p>
						))}
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

export default function SedationAndAnaesthesia({ weight }: Props) {
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
			<Title level={2}>Sedation and Anaesthesia</Title>
			<Table
				columns={columns}
				dataSource={tableData}
				pagination={false}
			/>
		</>
	);
}
