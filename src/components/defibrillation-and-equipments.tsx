import {Card, Space, Typography} from 'antd';

const {Title} = Typography;

type Props = {
	age: number;
	weight: number;
};

export default function DefibrillationAndEquipments({age, weight}: Props) {
	return (
		<>
			<Title
				level={2}
				className='print-bigger print-margin print-center'
			>
				Defibrillation And Equipments
			</Title>

			<Space wrap direction='horizontal' align='baseline'>
				<Card
					title='Defibrillation'
					bordered={false}
					style={{width: 250}}
				>
					<p>First Dose: {2 * weight}</p>
					<p>Second Dose: {4 * weight}</p>
					<p>Third Dose: {4 * weight}</p>
				</Card>

				<Card
					title='ETT size (mm)'
					bordered={false}
					style={{width: 250}}
				>
					<ul>
						<li>Uncuffed tube: {(age / 4) + 4} mm</li>
						<li>Cuffed tube: {(age / 4) + 3} mm</li>
					</ul>

					To be continued...
				</Card>
			</Space>
		</>
	);
}
