import {useState} from 'react';
import {useRouter} from 'next/router';
import {
	Form,
	Input,
	InputNumber,
	Row,
	Col,
	Layout,
	Card,
} from 'antd';
import Link from 'next/link';
import localforage from 'localforage';
import pkg from '../../package.json';
import {prettify, round} from '@/utilities';
import data from '@/data/categories.json';
import styles from '@/styles/frontpage.module.css';

const {categories} = data;

const {Content, Footer} = Layout;
const FormItem = Form.Item;

type ChangedValuesProps = {
	name?: string;
	age?: number;
	weight?: number;
	height?: number;
};

const minNameLength = 3;

export default function Home() {
	const router = useRouter();
	const [form] = Form.useForm();
	const [name, setName] = useState('');
	const [age, setAge] = useState<number>();
	const [weight, setWeight] = useState<number>();
	const [height, setHeight] = useState<number>();

	const onValuesChange = (changedValues: ChangedValuesProps) => {
		const {name, age, weight, height} = changedValues;
		if (name !== undefined) {
			setName(name.trim());
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

	const isDataReady = Boolean(name && name.length >= minNameLength && age && weight);

	async function setData() {
		await localforage.setItem('name', name);
		await localforage.setItem('age', age);
		await localforage.setItem('weight', weight);
		await localforage.setItem('height', height);
	}

	return (
		<Layout className={`layout ${styles.frontpage}`}>
			<Content className='content'>
				<Row>
					<Col
						xs={{span: 22, offset: 1}}
						lg={{span: 12, offset: 6}}
						xxl={{span: 8, offset: 8}}
					>
						<Row justify='center' className='mb-4'>
							<Col>
								<img
									src='/logo_small.png'
									alt='Logo of Sultan Qaboos University Hospital'
								/>
							</Col>
						</Row>

						<Form
							className={styles['white-text']}
							form={form}
							layout='horizontal'
							size='large'
							labelCol={{span: 8}}
							wrapperCol={{span: 8}}
							onValuesChange={onValuesChange}
						>
							<FormItem
								name='name'
								label='Patient Name'
								rules={[{required: true, min: minNameLength}]}
							>
								<Input/>
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
						</Form>

						<Row
							gutter={[16, 16]}
							justify='center'
						>
							{Object.entries(categories).map(([key, value]) => (
								<Link
									key={key}
									href={isDataReady ? `/${key}` : '#'}
									style={{
										cursor: isDataReady ? 'default' : 'not-allowed',
									}}
									onClick={async event => {
										event.preventDefault();
										if (isDataReady) {
											document.body.style.cursor = 'wait';
											await setData();
											await router.push(`/${key}`);
											document.body.style.cursor = 'auto';
										}
									}}
								>
									<Col>
										<Card
											hoverable={isDataReady}
											className={isDataReady
												? styles.active : styles.disabled}
										>
											{prettify(value)}
										</Card>
									</Col>
								</Link>
							))}
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
						<p>{pkg.version}</p>
					</Col>
				</Row>
			</Footer>
		</Layout>
	);
}
