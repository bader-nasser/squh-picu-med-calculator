import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
const { Title } = Typography;

import type { SedationAndAnaesthesia } from "@/types";

interface Props {
	medications: SedationAndAnaesthesia[];
	weight: number;
}

interface DataType {
	key: string;
	medications: string;
	dose:
		| string
		| {
				info: string;
				multiplier: number[];
				unit: string;
		  };
	formula_50ml: string;
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
				const {
					info,
					multiplier: [a, b],
					unit,
				} = dose;
				return (
					<>
						<div>{info}</div>
						<div>
							({a * weight} - {b * weight}) {unit}
						</div>
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

export default function SedationAndAnaesthesia({ medications, weight }: Props) {
	const tableData: DataType[] = [];

	medications.forEach(
		({ name, dose, formula_50ml, compatible, incompatible }, index) => {
			tableData.push({
				key: `${name}_${index}`,
				medications: name,
				dose,
				formula_50ml,
				compatible,
				incompatible,
				weight,
			});
		}
	);
	return (
		<>
			<Title level={2}>Sedation and Anaesthesia</Title>
			<Table columns={columns} dataSource={tableData} />
		</>
	);
}
