import PediatricResuscitationMedications from './pediatric-resuscitation-medications';
import PediatricIntubationMedications from './pediatric-intubation-medications';
import InotropicInfusions from './inotropic-infusions';
import SedationAndAnaesthesia from './sedation-and-anaesthesia';
import OtherImportantInfusions from './other-important-infusions';

type Props = {
	category: string;
	weight: number;
};

export default function ShowCategory({category, weight}: Props) {
	switch (category) {
		case 'pediatric_resuscitation_medications': {
			return <PediatricResuscitationMedications weight={weight}/>;
		}

		case 'pediatric_intubation_medications': {
			return <PediatricIntubationMedications weight={weight}/>;
		}

		case 'inotropic_infusions': {
			return <InotropicInfusions weight={weight}/>;
		}

		case 'sedation_and_anaesthesia': {
			return <SedationAndAnaesthesia weight={weight}/>;
		}

		case 'other_important_infusions': {
			return <OtherImportantInfusions weight={weight}/>;
		}

		default: {
			return <PediatricResuscitationMedications weight={weight}/>;
		}
	}
}
