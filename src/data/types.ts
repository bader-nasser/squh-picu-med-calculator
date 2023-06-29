import type {PediatricResuscitationMedication} from '@/components/pediatric-resuscitation-medications';
import type {PediatricIntubationMedication} from '@/components/pediatric-intubation-medications';
import type {InotropicInfusion} from '@/components/inotropic-infusions';
import type {SedationAndAnaesthesiaDataType} from '@/components/sedation-and-anaesthesia';
import type {OtherImportantInfusion} from '@/components/other-important-infusions';

export type PediatricResuscitationMedications = {
	$schema: string;
	medications: PediatricResuscitationMedication[];
};

export type PediatricIntubationMedications = {
	$schema: string;
	medications: PediatricIntubationMedication[];
};

export type InotropicInfusionMedications = {
	$schema: string;
	medications: InotropicInfusion[];
};

export type SedationAndAnaesthesiaMedications = {
	$schema: string;
	medications: SedationAndAnaesthesiaDataType[];
};

export type OtherImportantInfusionMedications = {
	$schema: string;
	medications: OtherImportantInfusion[];
};
