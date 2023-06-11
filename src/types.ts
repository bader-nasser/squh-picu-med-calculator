type MgOrMcgOrMmolUnit = "mg" | "mcg" | "mmol" | string;

type PediatricResuscitationMedicationDose = {
	info: string;
	mg_mcg_mmol?: {
		multiplier: number | number[];
		unit: MgOrMcgOrMmolUnit;
		max?: number;
	};
	ml?: {
		multiplier: number | number[];
		max?: number;
	};
};

export type PediatricResuscitationMedication = {
	name: string;
	doses: PediatricResuscitationMedicationDose[];
};
/////////////

export type OtherImportantInfusion = {
	name: string;
	dose:
		| string
		| {
				info: string;
				multiplier: number;
				unit: string;
		  };
	formula_50ml:
		| string
		| {
				minimum_strength: string;
				maximum_strength: string;
		  };
	compatible: string[];
	incompatible: string[];
};

export type InotropicInfusion = {
	name: string;
	dose: string;
	formula_50ml:
		| string
		| {
				text: string;
				multiplier: number;
				ns_multiplier?: number;
		  };
	compatible: string[];
	incompatible: string[];
};

export type SedationAndAnaesthesia = {
	name: string;
	dose:
		| string
		| {
				info: string;
				multiplier: number[];
				unit: string;
		  };
	formula_50ml: string;
	compatible: string[];
	incompatible: string[];
};

export type Medications = {
	categories: {
		pediatric_resuscitation_medications: PediatricResuscitationMedication[];
		inotropic_infusions: InotropicInfusion[];
		sedation_and_anaesthesia: SedationAndAnaesthesia[];
		other_important_infusions: OtherImportantInfusion[];
	};
};
