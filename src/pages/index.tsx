import { useState } from "react";

import {
	Form,
	Input,
	InputNumber,
	Select,
	Row,
	Col,
	Layout,
	Typography,
} from "antd";

import PediatricResuscitationMedications from "@/components/pediatric-resuscitation-medications";
import PediatricIntubationMedications from "@/components/pediatric-intubation-medications";
import InotropicInfusions from "@/components/inotropic-infusions";
import SedationAndAnaesthesia from "@/components/sedation-and-anaesthesia";
import OtherImportantInfusions from "@/components/other-important-infusions";

import pkg from "../../package.json";

const { Title } = Typography;
const { Option } = Select;
const { Header, Content, Footer } = Layout;
const FormItem = Form.Item;

const initialValues = {
	weight: 49.4,
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

	let CategoryToShow = () => (
		<PediatricResuscitationMedications weight={weight} />
	);

	switch (category) {
		case "pediatric_resuscitation_medications":
			CategoryToShow = () => (
				<PediatricResuscitationMedications weight={weight} />
			);
			break;
		case "pediatric_intubation_medications":
			CategoryToShow = () => (
				<PediatricIntubationMedications weight={weight} />
			);
			break;
		case "inotropic_infusions":
			CategoryToShow = () => <InotropicInfusions weight={weight} />;
			break;
		case "sedation_and_anaesthesia":
			CategoryToShow = () => <SedationAndAnaesthesia weight={weight} />;
			break;
		case "other_important_infusions":
			CategoryToShow = () => <OtherImportantInfusions weight={weight} />;
			break;
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

							<Row>
								<Col xs={{ span: 24 }} lg={{ span: 12 }}>
									<FormItem
										name="category"
										label="Category"
										rules={[{ required: true }]}
									>
										<Select placeholder="Select a category">
											<Option value="pediatric_resuscitation_medications">
												Pediatric Resuscitation
												Medications
											</Option>
											<Option value="pediatric_intubation_medications">
												Pediatric Intubation Medications
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
										</Select>
									</FormItem>
								</Col>
							</Row>

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
