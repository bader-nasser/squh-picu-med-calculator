import {useState} from 'react';
import {
	Form,
	Input,
	InputNumber,
	Select,
	Row,
	Col,
	Layout,
	Typography,
} from 'antd';
import {PrinterOutlined} from '@ant-design/icons';
import Link from 'next/link';
import pkg from '../../package.json';
import ShowCategory from '@/components/show-category';
import {round} from '@/utilities';

const {Title} = Typography;
const {Option} = Select;
const {Header, Content, Footer} = Layout;
const FormItem = Form.Item;

const initialValues = {
	weight: 50,
	category: 'pediatric_resuscitation_medications',
};

export default function Home() {
	const [form] = Form.useForm();
	const [weight, setWeight] = useState(round(initialValues.weight));
	const [category, setCategory] = useState(initialValues.category);

	const onValuesChange = (changedValues: {weight: number; category: string}) => {
		const {weight, category} = changedValues;
		if (weight) {
			setWeight(round(weight));
		}

		if (category) {
			setCategory(category);
		}
	};

	return (
		<Layout className='layout'>
			<Header className='header'>
				<Row>
					<Col
						xs={{span: 22, offset: 1}}
						lg={{span: 20, offset: 2}}
						xxl={{span: 18, offset: 3}}
					>
						<Row justify='space-between' align='middle'>
							<Col>
								<Title className='title'>
									{pkg.prettyName}
								</Title>
							</Col>
							<Col className='no-print'>
								<PrinterOutlined
									style={{fontSize: '32px', paddingBlock: '16px'}}
									onClick={() => {
										window.print();
									}}
								/>
							</Col>
						</Row>
						<Row justify='space-between' align='middle' className='no-print'>
							<Col>
								<Link
									href='/frontpage'
									style={{
										color: 'white',
										textDecorationLine: 'underline',
									}}
								>Front Page (Almost done)
								</Link>
							</Col>
						</Row>
					</Col>
				</Row>
			</Header>

			<Content className='content'>
				<Row>
					<Col
						xs={{span: 22, offset: 1}}
						lg={{span: 20, offset: 2}}
						xxl={{span: 18, offset: 3}}
					>
						<Form
							form={form}
							layout='horizontal'
							initialValues={initialValues}
							size='large'
							onValuesChange={onValuesChange}
						>
							<Row gutter={16}>
								<Col xs={{span: 24}} lg={{span: 12}}>
									<FormItem
										name='name'
										label='Patient Name'
										rules={[{required: true}]}
									>
										<Input/>
									</FormItem>
								</Col>

								<Col xs={{span: 24}} lg={{span: 12}}>
									<Row gutter={16}>
										<Col>
											<FormItem
												name='weight'
												label='Weight'
												rules={[{required: true}]}
											>
												<InputNumber
													addonAfter='kg'
													min={2}
													max={150}
													style={{width: '120px'}}
												/>
											</FormItem>
										</Col>

										<Col>
											<FormItem
												name='height'
												label='Height'
												rules={[{required: false}]}
											>
												<InputNumber
													addonAfter='cm'
													min={40}
													max={300}
													type='number'
													style={{width: '120px'}}
												/>
											</FormItem>
										</Col>
									</Row>
								</Col>
							</Row>

							<Row className='no-print'>
								<Col xs={{span: 24}} lg={{span: 12}}>
									<FormItem
										name='category'
										label='Category'
										rules={[{required: true}]}
									>
										<Select placeholder='Select a category'>
											<Option value='pediatric_resuscitation_medications'>
												Pediatric Resuscitation
												Medications
											</Option>
											<Option value='pediatric_intubation_medications'>
												Pediatric Intubation Medications
											</Option>
											<Option value='inotropic_infusions'>
												Inotropic Infusions
											</Option>
											<Option value='sedation_and_anaesthesia'>
												Sedation and Anaesthesia
											</Option>
											<Option value='other_important_infusions'>
												Other Important Infusions
											</Option>
										</Select>
									</FormItem>
								</Col>
							</Row>
						</Form>

						<ShowCategory category={category} weight={weight}/>
					</Col>
				</Row>
			</Content>

			<Footer className='footer no-print'>
				<Row>
					<Col
						xs={{span: 22, offset: 1}}
						lg={{span: 20, offset: 2}}
						xxl={{span: 18, offset: 3}}
					>
						<p>Developed by Bader Nasser</p>
						<p>{pkg.version}</p>
					</Col>
				</Row>
			</Footer>
		</Layout>
	);
}
