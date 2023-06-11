import { useState } from "react";

import {
	Form,
	Input,
	InputNumber,
	Select,
	Table,
	Row,
	Col,
	Layout,
	Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import data from "@/data.json";
import InotropicInfusions from "@/components/inotropic-infusions";
import SedationAndAnaesthesia from "@/components/sedation-and-anaesthesia";
import OtherImportantInfusions from "@/components/other-important-infusions";
import { Medications } from "@/types";
import pkg from "../../package.json";

const { Title, Text } = Typography;
const { Option } = Select;
const FormItem = Form.Item;
const { Header, Content, Footer } = Layout;

interface DataType {
	key: string;
	medications: string;
	dose: string;
	mg_mcg_mmol: string;
	ml: string;
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
		title: "mg/mcg/mmol",
		dataIndex: "mg_mcg_mmol",
		key: "mg_mcg_mmol",
	},
	{
		title: "ml",
		dataIndex: "ml",
		key: "ml",
	},
];

const medications: Medications = data;
const initialValues = {
	weight: 10,
	category: "pediatric_resuscitation_medications",
};

export default function Home() {
	const [form] = Form.useForm();
	const [weight, setWeight] = useState(initialValues.weight);
	const [category, setCategory] = useState(initialValues.category);

	const onValuesChange = (changedValues: any, allValues: any) => {
		console.log("Success:", changedValues);
		changedValues.weight && setWeight(changedValues.weight);
		changedValues.category && setCategory(changedValues.category);
	};

	const onFinish = (values: any) => {
		console.log("Success:", values);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	const tableData: DataType[] = [];

	medications.categories.pediatric_resuscitation_medications.forEach(
		({ name, doses }) => {
			doses.forEach((dose, index) => {
				const { info, mg_mcg_mmol, ml } = dose;
				let mg_ = "";
				let ml_ = "";
				if (mg_mcg_mmol) {
					const { multiplier, unit, max } = mg_mcg_mmol;
					if (Array.isArray(multiplier)) {
						const [a, b] = multiplier;
						mg_ = `(${a * weight} to ${b * weight}) ${unit}`;
					} else {
						mg_ = `(${multiplier * weight}) ${unit}`;
					}
					if (max) {
						mg_ = `${mg_} (max value ${max}${unit})`;
					}
				}
				if (ml) {
					const unit = "ml";
					const { multiplier, max } = ml;
					if (Array.isArray(multiplier)) {
						const [a, b] = multiplier;
						ml_ = `(${a * weight} to ${b * weight}) ${unit}`;
					} else {
						ml_ = `(${multiplier * weight}) ${unit}`;
					}
					if (max) {
						ml_ = `${ml_} (max value ${max}${unit})`;
					}
				}

				tableData.push({
					key: `${name}_${index}`,
					medications: name,
					dose: info,
					mg_mcg_mmol: mg_,
					ml: ml_,
				});
			});
		}
	);

	let CategoryToShow = () => <div>Please select a category</div>;
	switch (category) {
		case "pediatric_resuscitation_medications":
			CategoryToShow = () => (
				<>
					<Title level={2}>Pediatric Resuscitation Medications</Title>
					<Table columns={columns} dataSource={tableData} />
				</>
			);
			break;

		case "inotropic_infusions":
			CategoryToShow = () => (
				<InotropicInfusions
					medications={medications.categories["inotropic_infusions"]}
					weight={weight}
				/>
			);
			break;
		case "sedation_and_anaesthesia":
			CategoryToShow = () => (
				<SedationAndAnaesthesia
					medications={
						medications.categories["sedation_and_anaesthesia"]
					}
					weight={weight}
				/>
			);
			break;
		case "other_important_infusions":
			CategoryToShow = () => (
				<OtherImportantInfusions
					medications={
						medications.categories["other_important_infusions"]
					}
					weight={weight}
				/>
			);
			break;
		case "other": {
			CategoryToShow = () => <div>Not implemented yet!</div>;
			break;
		}
		default:
			break;
	}

	return (
		<Layout>
			<Header>
				<Row>
					<Col xs={{ span: 20, offset: 2 }}>
						<Title
							style={{ color: "var(--background-color)" }}
							className="m-0"
						>
							{pkg.prettyName}
						</Title>
					</Col>
				</Row>
			</Header>

			<Content className="my-5">
				<Row>
					<Col xs={{ span: 20, offset: 2 }}>
						<Form
							form={form}
							layout="horizontal"
							initialValues={initialValues}
							size={"large"}
							onValuesChange={onValuesChange}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
						>
							<Row gutter={16}>
								<Col xs={{ span: 24 }} lg={{ span: 12 }}>
									<FormItem
										name="name"
										label="Patient Name"
										rules={[{ required: true }]}
									>
										<Input />
									</FormItem>
								</Col>

								<Col xs={{ span: 24 }} lg={{ span: 12 }}>
									<Row gutter={16}>
										<Col>
											<FormItem
												name="weight"
												label="Weight"
												rules={[{ required: true }]}
											>
												<InputNumber
													addonAfter="kg"
													min={1}
													max={300}
													style={{ width: "120px" }}
												/>
											</FormItem>
										</Col>

										<Col>
											<FormItem
												name="height"
												label="Height"
												rules={[{ required: false }]}
											>
												<InputNumber
													addonAfter="cm"
													min={1}
													max={300}
													style={{ width: "120px" }}
												/>
											</FormItem>
										</Col>
									</Row>
								</Col>
							</Row>

							<FormItem
								name="category"
								label="Category"
								rules={[{ required: true }]}
							>
								<Select placeholder="Select a category">
									<Option value="pediatric_resuscitation_medications">
										Pediatric Resuscitation Medications
									</Option>
									<Option value="inotropic_infusions">
										Inotropic Infusions
									</Option>
									<Option value="sedation_and_anaesthesia">
										Sedation and Anaesthesia
									</Option>
									<Option value="other_important_infusions">
										Other Important Infusions
									</Option>
									<Option value="other">Other</Option>
								</Select>
							</FormItem>

							<CategoryToShow />
						</Form>
					</Col>
				</Row>
			</Content>

			<Footer>
				<Row>
					<Col xs={{ span: 20, offset: 2 }}>
						<div>
							<p>Developed by Bader Nasser</p>
							<p>{pkg.version}</p>
						</div>
					</Col>
				</Row>
			</Footer>
		</Layout>
	);
}
