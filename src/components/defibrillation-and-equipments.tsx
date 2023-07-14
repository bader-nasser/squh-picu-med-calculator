import {Alert, Card, Row, Col, Typography} from 'antd';
import {round} from '@/utilities';

const {Title} = Typography;

function getEttSize({weight, age}: {weight: number; age: number}): string {
	const uncuffedEttSize = ((age / 4) + 4);
	const cuffedEttSize = ((age / 4) + 3);

	if (weight < 1) {
		return `${2.5 * uncuffedEttSize} uncuffed`;
	}

	if (weight >= 1 && weight <= 2) {
		return `${3 * uncuffedEttSize} uncuffed`;
	}

	// Todo: revise
	if (weight >= 3 && weight <= 5) {
		return `${3.5 * uncuffedEttSize} uncuffed`;
	}

	if (weight >= 6 && weight <= 9) {
		return `${3.5 * uncuffedEttSize} uncuffed, ${3 * cuffedEttSize} cuffed`;
	}

	if (weight >= 10 && weight <= 11) {
		return `${4 * uncuffedEttSize} uncuffed, ${3.5 * cuffedEttSize} cuffed`;
	}

	if (weight >= 12 && weight <= 14) {
		return `${4.5 * uncuffedEttSize} uncuffed, ${4 * cuffedEttSize} cuffed`;
	}

	if (weight >= 15 && weight <= 18) {
		return `${5 * uncuffedEttSize} uncuffed, ${4.5 * cuffedEttSize} cuffed`;
	}

	if (weight >= 19 && weight <= 23) {
		return `${5.5 * uncuffedEttSize} uncuffed, ${5 * cuffedEttSize} cuffed`;
	}

	if (weight >= 24 && weight <= 29) {
		return `${6 * cuffedEttSize} cuffed`;
	}

	if (weight >= 30 && weight <= 36) {
		return `${6.5 * cuffedEttSize} cuffed`;
	}

	return 'No data availabe for weights > 36!';
}

function getEttDepth(weight: number): number | string {
	if (weight === 0.5) {
		return 6.5;
	}

	if (weight === 1) {
		return 7;
	}

	if (weight === 2) {
		return 8;
	}

	if (weight === 3) {
		return '9 - 9.5';
	}

	if (weight === 4) {
		return '9.5 - 10';
	}

	if (weight === 5) {
		return '10 - 10.5';
	}

	if (weight >= 6 && weight <= 9) {
		return '10.5 - 11';
	}

	if (weight >= 10 && weight <= 11) {
		return '11 - 12';
	}

	if (weight >= 12 && weight <= 14) {
		return 13.5;
	}

	if (weight >= 15 && weight <= 18) {
		return '14 - 15';
	}

	if (weight >= 19 && weight <= 23) {
		return 16.5;
	}

	if (weight >= 24 && weight <= 29) {
		return '17 - 18';
	}

	if (weight >= 30 && weight <= 36) {
		return '18.5 - 19.5';
	}

	return 'No data availabe for weights < 0.5 or > 36!';
}

function getOralAirway(weight: number): number | string {
	if (weight >= 6 && weight <= 9) {
		return 50;
	}

	if (weight >= 10 && weight <= 18) {
		return 60;
	}

	if (weight >= 19 && weight <= 23) {
		return 70;
	}

	if (weight >= 24 && weight <= 36) {
		return 80;
	}

	return 'No data availabe for weights < 6 or > 36!';
}

function getResuscitationBagSize(weight: number): string {
	if (weight >= 6 && weight <= 9) {
		return 'Infant / Child';
	}

	if (weight >= 10 && weight <= 29) {
		return 'Child';
	}

	if (weight >= 30 && weight <= 36) {
		return 'Adult';
	}

	return 'No data availabe for weights < 6 or > 36!';
}

function getLaryngoscopeBladeSize(weight: number): string {
	if (weight >= 6 && weight <= 11) {
		return '1 straight (Miller)';
	}

	if (weight >= 12 && weight <= 18) {
		return '2 straight (Miller)';
	}

	if (weight >= 19 && weight <= 29) {
		return '2 straight (Miller) or Curved (Macintosh)';
	}

	if (weight >= 30 && weight <= 36) {
		return '3 straight (Miller) or Curved (Macintosh)';
	}

	return 'No data availabe for weights < 6 or > 36!';
}

function getSuctionCatheter(weight: number): number | string {
	if (weight >= 6 && weight <= 9) {
		return 8;
	}

	if (weight >= 10 && weight <= 29) {
		return 10;
	}

	if (weight >= 30 && weight <= 36) {
		return '10 - 12';
	}

	return 'No data availabe for weights < 6 or > 36!';
}

function getNgTube(weight: number): number | string {
	if (weight >= 6 && weight <= 9) {
		return '6 - 8';
	}

	if (weight >= 10 && weight <= 11) {
		return '8 - 10';
	}

	if (weight >= 12 && weight <= 18) {
		return 10;
	}

	if (weight >= 19 && weight <= 23) {
		return '12 - 14';
	}

	if (weight >= 24 && weight <= 29) {
		return '14 - 16 (18 in the doc)';
	}

	if (weight >= 30 && weight <= 36) {
		return '16 - 18';
	}

	return 'No data availabe for weights < 6 or > 36!';
}

function getUrinaryCatheter(weight: number): number | string {
	if (weight >= 3 && weight <= 5) {
		return 6;
	}

	if (weight >= 6 && weight <= 9) {
		return 8;
	}

	if (weight >= 10 && weight <= 11) {
		return '8 - 10';
	}

	if (weight >= 12 && weight <= 23) {
		return '10 - 12';
	}

	if (weight >= 24 && weight <= 36) {
		return 12;
	}

	return 'No data availabe for weights < 6 or > 36!';
}

function getChestTube(weight: number): number | string {
	if (weight >= 6 && weight <= 9) {
		return '10 - 12';
	}

	if (weight >= 10 && weight <= 11) {
		return '16 - 20';
	}

	if (weight >= 12 && weight <= 18) {
		return '20 - 24';
	}

	if (weight >= 19 && weight <= 23) {
		return '24 - 28 (32 in the doc)';
	}

	if (weight >= 24 && weight <= 29) {
		return '28 - 32';
	}

	if (weight >= 30 && weight <= 36) {
		return '32 - 38';
	}

	return 'No data availabe for weights < 6 or > 36!';
}

function getIo(weight: number): number | string {
	if (weight >= 6 && weight <= 9) {
		return '18* - 15 (*maybe 8?)';
	}

	if (weight >= 10 && weight <= 36) {
		return '15';
	}

	return 'No data availabe for weights < 6 or > 36!';
}

function getBpCuff(weight: number): string {
	if (weight >= 3 && weight <= 5) {
		return 'Neonatal / Infant';
	}

	if (weight >= 6 && weight <= 9) {
		return 'Infant / Child';
	}

	if (weight >= 10 && weight <= 29) {
		return 'Child';
	}

	if (weight >= 30 && weight <= 36) {
		return 'Small Adult';
	}

	return 'No data availabe for weights < 6 or > 36!';
}

type Props = {
	age: number;
	weight: number;
};

export default function DefibrillationAndEquipments({age, weight}: Props) {
	const uncuffedEttSize = round((age / 4) + 4);
	const cuffedEttSize = round((age / 4) + 3);

	return (
		<>
			<Title
				level={2}
				className='print-bigger print-margin print-center'
			>
				Defibrillation and Equipments
			</Title>

			<Alert
				message='Note: This section is NOT ready yet and might contain inaccurate data!'
				type='warning'
				className='mb-4'
			/>

			<Row align='stretch' justify='start' gutter={[16, 16]} className='print-gap'>
				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='Defibrillation'
						bordered={false}
						className='print-no-shadow'
					>
						<p>First Dose: {2 * weight}</p>
						<p>Second Dose: {4 * weight}</p>
						<p>Third Dose: {4 * weight}</p>
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='A. ETT size (mm)'
						bordered={false}
						className='print-no-shadow'
					>
						<ul>
							<li>Uncuffed tube: {uncuffedEttSize} mm</li>
							<li>Cuffed tube: {cuffedEttSize} mm</li>
						</ul>

						{getEttSize({weight, age})}
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='B. ETT depth (lip level) (cm)'
						bordered={false}
						className='print-no-shadow'
					>
						<ul>
							<li>Newborn: {6 + weight} cm</li>
							<li>
								Others:
								<ul>
									<li>Cuffed tube: {3 * cuffedEttSize} cm</li>
									<li>Uncuffed tube: {3 * uncuffedEttSize} cm</li>
								</ul>
							</li>
						</ul>

						{getEttDepth(weight)}
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='C. Oral airway (mm)'
						bordered={false}
						className='print-no-shadow'
					>
						{getOralAirway(weight)}
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='D. Resuscitation Bag Size'
						bordered={false}
						className='print-no-shadow'
					>
						{getResuscitationBagSize(weight)}
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='E. Laryngoscope Blade Size'
						bordered={false}
						className='print-no-shadow'
					>
						{getLaryngoscopeBladeSize(weight)}
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='F. Suction Catheter (Fr.)'
						bordered={false}
						className='print-no-shadow'
					>
						{getSuctionCatheter(weight)}
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='G. NG Tube (Fr.)'
						bordered={false}
						className='print-no-shadow'
					>
						{getNgTube(weight)}
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='H. Urinary catheter (Fr.)'
						bordered={false}
						className='print-no-shadow'
					>
						{getUrinaryCatheter(weight)}
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='I. Chest Tube (Fr.)'
						bordered={false}
						className='print-no-shadow'
					>
						{getChestTube(weight)}
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='J. IO (ga)'
						bordered={false}
						className='print-no-shadow'
					>
						{getIo(weight)}
					</Card>
				</Col>

				<Col
					xs={24}
					md={12}
					lg={8}
					className='print-border print-padding print-margin-end print-flex-item'
				>
					<Card
						title='K. BP Cuff'
						bordered={false}
						className='print-no-shadow'
					>
						{getBpCuff(weight)}
					</Card>
				</Col>
			</Row>
		</>
	);
}
