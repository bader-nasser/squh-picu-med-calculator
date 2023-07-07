// credit:
// https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation
// https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props
import {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import {PrinterOutlined} from '@ant-design/icons';
import Link from 'next/link';
import {type GetStaticProps, type InferGetStaticPropsType} from 'next';
import localforage from 'localforage';
import {
	Row,
	Col,
	Layout,
	Button,
	Spin,
	Space,
} from 'antd';
import pkg from '../../package.json';
import data from '@/data/categories.json';
import {prettify} from '@/utilities';

const {Content, Footer} = Layout;
const {categories} = data;

const PediatricResuscitationMedications = dynamic(async () =>
	import('@/components/pediatric-resuscitation-medications'), {
	loading: () => <Spin size='large'/>,
});

const PediatricIntubationMedications = dynamic(async () =>
	import('@/components/pediatric-intubation-medications'), {
	loading: () => <Spin size='large'/>,
});

const InotropicInfusions = dynamic(async () =>
	import('@/components/inotropic-infusions'), {
	loading: () => <Spin size='large'/>,
});

const SedationAndAnaesthesia = dynamic(async () =>
	import('@/components/sedation-and-anaesthesia'), {
	loading: () => <Spin size='large'/>,
});

const OtherImportantInfusions = dynamic(async () =>
	import('@/components/other-important-infusions'), {
	loading: () => <Spin size='large'/>,
});

function LoadCategory({category, weight}: {category: string; weight: number}) {
	if (category === categories['pediatric-resuscitation-medications']) {
		return <PediatricResuscitationMedications weight={weight}/>;
	}

	if (category === categories['pediatric-intubation-medications']) {
		return <PediatricIntubationMedications weight={weight}/>;
	}

	if (category === categories['inotropic-infusions']) {
		return <InotropicInfusions weight={weight}/>;
	}

	if (category === categories['sedation-and-anaesthesia']) {
		return <SedationAndAnaesthesia weight={weight}/>;
	}

	return <OtherImportantInfusions weight={weight}/>;
}

export default function Category({category}: InferGetStaticPropsType<typeof getStaticProps>) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [name, setName] = useState<string>('');
	const [mrn, setMrn] = useState<number>();
	const [age, setAge] = useState<number>();
	const [weight, setWeight] = useState<number>();
	const [height, setHeight] = useState<number>();

	async function getData() {
		try {
			const name = await localforage.getItem<string>('name');
			const mrn = await localforage.getItem<number>('mrn');
			const age = await localforage.getItem<number>('age');
			const weight = await localforage.getItem<number>('weight');
			const height = await localforage.getItem<number>('height');
			setName(prettify(name ?? '', {splitText: ' '}));
			setMrn(mrn ?? undefined);
			setAge(age ?? undefined);
			setWeight(weight ?? undefined);
			setHeight(height ?? undefined);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		void getData();
	}, []);

	const isDataReady = Boolean(name && mrn && age && weight);

	return (
		<Layout className='layout'>
			<Content className='content'>
				<Row>
					<Col
						xs={{span: 22, offset: 1}}
						sm={{span: 20, offset: 2}}
						lg={{span: 18, offset: 3}}
						xxl={{span: 16, offset: 4}}
						className='print-flex-100'
					>
						<Row align='middle' justify='space-between' className='mb-2'>
							<Col>
								<Space align='center'>
									<img
										src='/logo_small.png'
										alt='Logo of Sultan Qaboos University Hospital'
									/>

									<Link
										href='/'
										className='print-bigger'
									>
										{pkg.prettyName}
									</Link>
								</Space>
							</Col>

							<Col className='no-print'>
								<Space align='center'>
									<PrinterOutlined
										style={{fontSize: '32px'}}
										onClick={() => {
											window.print();
										}}
									/>

									{isDataReady && (
										<Button
											ghost
											style={{
												background: 'blue',
												color: 'white',
											}}
											onClick={async () => {
												document.body.style.cursor = 'wait';
												await router.push('/');
												document.body.style.cursor = 'auto';
											}}
										>
											Edit data
										</Button>
									)}

									<Button
										ghost
										style={{
											background: 'red',
											color: 'white',
										}}
										onClick={async () => {
											document.body.style.cursor = 'wait';
											if (isDataReady) {
												await localforage.clear();
											}

											await router.push('/');
											document.body.style.cursor = 'auto';
										}}
									>
										{isDataReady ? 'Change' : 'New'} Patient
									</Button>
								</Space>
							</Col>
						</Row>

						<Row justify='end' gutter={[16, 16]} className='mb-4 no-print'>
							{Object.entries(categories).map(([key, value]) => (
								<Col key={key}>
									<Link
										href={`/${key}`}
										// Todo: revise!
										onClick={async event => {
											event.preventDefault();
											await router.push(`/${key}`);
											await getData();
										}}
									>
										{prettify(value)}
									</Link>
								</Col>
							))}
						</Row>

						{isLoading && <Spin size='large'/>}

						{!isLoading && !isDataReady && (
							<>
								<p>Patient&apos;s information is not available!</p>

								<p>Please, add it using the {' '}
									<Button
										ghost
										style={{
											background: 'red',
											color: 'white',
										}}
										onClick={async () => {
											document.body.style.cursor = 'wait';
											await router.push('/');
											document.body.style.cursor = 'auto';
										}}
									>
										New Patient
									</Button> {' '}
									button.
								</p>
							</>
						)}

						{isDataReady && (
							<>
								<p>
									Patient&apos;s Name: {' '}
									<strong className='print-bigger'>{name}</strong> &mdash; {' '}
									Patient&apos;s MRN: {' '}
									<strong className='print-bigger'>{mrn}</strong> &mdash; {' '}
									Age: {' '}
									<strong className='print-bigger'>{age}</strong> years &mdash; {' '}
									Weight: {' '}
									<strong className='print-bigger'>{weight}</strong> kg &mdash; {' '}
									Height: {' '}
									<strong className='print-bigger'>{height ?? 'Not Provided'}</strong> cm
								</p>

								<LoadCategory category={category} weight={weight!}/>
							</>
						)}
					</Col>
				</Row>
			</Content>

			<Footer className='footer no-print'>
				<Row>
					<Col
						xs={{span: 22, offset: 1}}
						sm={{span: 20, offset: 2}}
						lg={{span: 18, offset: 3}}
						xxl={{span: 16, offset: 4}}
					>
						<p>Developed by Bader Nasser</p>

						<p>{pkg.version}</p>
					</Col>
				</Row>
			</Footer>
		</Layout>
	);
}

export async function getStaticPaths() {
	const paths: Array<{
		params: {category: string};
	}> = [];

	for (const [_, category] of Object.entries(categories)) {
		paths.push({
			params: {category},
		});
	}

	// We'll pre-render only these paths at build time.
	// { fallback: false } means other routes should 404.
	return {paths, fallback: false};
}

export const getStaticProps: GetStaticProps<{
	category: string;
}> = async ({params}) => {
	let category = params?.category ?? '';
	if (Array.isArray(category)) {
		category = category[0];
	}

	return {props: {category}};
};
