import {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {
	Form,
	Input,
	InputNumber,
	Row,
	Col,
	Layout,
	Card,
	Space,
	Typography,
	Button,
} from 'antd';
import localforage from 'localforage';
import pkg from '../../package.json';
import {prettify, round} from '@/utilities';
import data from '@/data/categories.json';
import styles from '@/styles/frontpage.module.css';

const {Title} = Typography;
const {Content, Footer} = Layout;
const FormItem = Form.Item;

const {prettyName: appName, version} = pkg;
const {categories} = data;

type ChangedValuesProps = {
	name?: string;
	mrn?: number;
	age?: number;
	weight?: number;
	height?: number;
};

const minNameLength = 7;
const namePattern = /^\D{7,}$/;
const mrnPattern = /^\d{8,10}$/;

async function getSavedData() {
	const name = await localforage.getItem<string>('name');
	const mrn = await localforage.getItem<number>('mrn');
	const age = await localforage.getItem<number>('age');
	const weight = await localforage.getItem<number>('weight');
	const height = await localforage.getItem<number>('height');
	return {
		name: name ?? '',
		mrn: mrn ?? undefined,
		age: age ?? undefined,
		weight: weight ?? undefined,
		height: height ?? undefined,
	};
}

export default function Home() {
	const router = useRouter();
	const [form] = Form.useForm();
	const [name, setName] = useState('');
	const [mrn, setMrn] = useState<number>();
	const [age, setAge] = useState<number>();
	const [weight, setWeight] = useState<number>();
	const [height, setHeight] = useState<number>();
	const [hasOldData, setHasOldData] = useState<boolean>(false);

	useEffect(() => {
		async function getData() {
			try {
				const data = await getSavedData();
				form.setFieldsValue(data);
				setName(data.name);
				setAge(data.age);
				setMrn(data.mrn);
				setWeight(data.weight);
				setHeight(data.height);
				setHasOldData(Boolean(data.name));
				await form.validateFields();
			} catch (error) {
				console.error(error);
			}
		}

		void getData();
	}, [form]);

	const onValuesChange = (changedValues: ChangedValuesProps) => {
		const {name, mrn, age, weight, height} = changedValues;
		if (name !== undefined) {
			setName(name.trim());
		}

		if (mrn !== undefined) {
			setMrn(mrn);
		}

		if (age !== undefined) {
			if (age === null) {
				setAge(undefined);
			} else {
				setAge(round(age));
			}
		}

		if (weight !== undefined) {
			if (weight === null) {
				setWeight(undefined);
			} else {
				setWeight(round(weight));
			}
		}

		if (height !== undefined) {
			if (height === null) {
				setHeight(undefined);
			} else {
				setHeight(round(height));
			}
		}
	};

	const isDataReady = Boolean(
		name && namePattern.test(name)
		&& mrn && mrnPattern.test(`${mrn}`)
		&& age && weight,
	);

	async function setData() {
		await localforage.setItem('name', name);
		await localforage.setItem('mrn', mrn);
		await localforage.setItem('age', age);
		await localforage.setItem('weight', weight);
		await localforage.setItem('height', height);
	}

	async function removeData() {
		form.resetFields();
		setName('');
		setMrn(undefined);
		setAge(undefined);
		setWeight(undefined);
		setHeight(undefined);
	}

	return (
		<Layout className={`layout ${styles.frontpage}`}>
			<Head>
				<title>{appName}</title>
				<meta key='title' property='og:title' content={appName}/>
			</Head>

			<Content className='content'>
				<Row>
					<Col
						xs={{span: 22, offset: 1}}
						lg={{span: 20, offset: 2}}
						xxl={{span: 18, offset: 3}}
					>
						<Row align='middle' justify='center' className='mb-2'>
							<Space align='center' direction='vertical'>
								<Image
									width='323'
									height='65'
									style={{maxWidth: '100%', height: 'auto'}}
									src='/logo_small.png'
									alt='Logo of Sultan Qaboos University Hospital'
								/>

								<Title style={{color: 'white'}}>{appName}</Title>
							</Space>

						</Row>

						{hasOldData && (
							<Row justify='center' className='mb-2'>
								<Col>
									<Title
										level={3}
										style={{color: 'white'}}
									>
										Patient&apos;s Data exists!
									</Title>

									<p
										style={{color: 'white'}}
									>
										To delete it, you must use the {' '}
										<Button
											ghost
											style={{
												background: 'red',
												color: 'white',
											}}
											className='mx-1'
											onClick={async () => {
												document.body.style.cursor = 'wait';
												await localforage.clear();
												setHasOldData(false);
												await removeData();
												document.body.style.cursor = 'auto';
											}}
										>
											Change Patient
										</Button> {' '}
										button!
									</p>
								</Col>
							</Row>
						)}

						<Row>
							<Col
								xs={{span: 24}}
								md={{span: 12}}
							>
								<Form
									className={`${styles['white-text']} mb-5`}
									form={form}
									layout='horizontal'
									size='large'
									labelCol={{span: 8}}
									onValuesChange={onValuesChange}
								>
									<FormItem
										name='name'
										label='Patient&apos;s Name'
										rules={[
											{
												required: true,
												min: minNameLength,
												type: 'string',
											},
											{
												pattern: /^\D{7,}$/,
												validator(rule, value, callback) {
													if (!rule.pattern?.test(value as string)) {
														callback('Use letters, spaces and no numbers');
													}
												},
											},
										]}
									>
										<Input/>
									</FormItem>

									<FormItem
										name='mrn'
										label='Patient&apos;s MRN'
										rules={[
											{
												required: true,
												type: 'number',
												pattern: /^\d{8,10}$/,
											},
											{
												pattern: /^\d{8,10}$/,
												validator(rule, value, callback) {
													if (!rule.pattern?.test(value as string)) {
														callback('The length must be between 8-10 numbers');
													}
												},
											},
										]}
									>
										<Input
											minLength={8}
											maxLength={10}
										/>
									</FormItem>

									<FormItem
										name='age'
										label='Age'
										rules={[{required: true}]}
									>
										<InputNumber
											addonAfter='years'
											min={1}
											max={120}
										/>
									</FormItem>

									<FormItem
										name='weight'
										label='Weight'
										rules={[{required: true}]}
									>
										<InputNumber
											addonAfter='kg'
											min={2}
											max={150}
										/>
									</FormItem>

									<FormItem
										name='height'
										label='Height'
									>
										<InputNumber
											addonAfter='cm'
											min={40}
											max={300}
										/>
									</FormItem>

									<FormItem wrapperCol={{offset: 8, span: 16}}>
										<Button
											htmlType='reset'
											onClick={async () => {
												await removeData();
											}}
										>
											Clear
										</Button>
									</FormItem>
								</Form>
							</Col>

							<Col
								xs={{span: 24}}
								md={{span: 12}}
							>
								<Row
									gutter={[16, 16]}
									justify={{xs: 'center', lg: 'start'}}
								>
									{Object.entries(categories).map(([key, value]) => (
										<Col key={key} md={{span: 20, offset: 2}}>
											<Card
												size='small'
												hoverable={isDataReady}
												style={{
													cursor: isDataReady
														? 'pointer'
														: 'not-allowed',
												}}
												className={
													isDataReady
														? styles.active
														: styles.disabled
												}
												onClick={async () => {
													if (isDataReady) {
														document.body.style.cursor = 'wait';
														await setData();
														await router.push(`/${key}`);
														document.body.style.cursor = 'auto';
													}
												}}
											>
												{prettify(value)}
											</Card>
										</Col>
									))}
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			</Content>

			<Footer className={`${styles.footer} no-print`}>
				<Row>
					<Col
						xs={{span: 22, offset: 1}}
						lg={{span: 20, offset: 2}}
						xxl={{span: 18, offset: 3}}
					>
						<p>Developed by Bader Nasser</p>

						<p>{version}</p>
					</Col>
				</Row>
			</Footer>
		</Layout>
	);
}
