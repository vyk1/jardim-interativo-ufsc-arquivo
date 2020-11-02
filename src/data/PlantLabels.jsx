export default PlantSchema = {
    popularName: {
        value: "",
        name: "popularName",
        label: "Nome Popular"
    },
    scientificName: {
        value: "",
        name: "scientificName",
        label: "Nome Científico"
    },
    description: {
        value: "",
        name: "Descrição"
    },
    habit: {
        value: [],
        name: "habit",
        label: "Hábitos de Crescimento"
    },
    mdtx: {
        value: [],
        name: "mdtx",
        label: "Tóxica, medicinal ou ambas?"
    },
    geoDistrib: {
        value: "",
        name: "geoDistrib",
        label: "Distribuição Geográfica"
    },

    prepMode: {
        value: "",
        name: "prepMode",
        label: "Modos De Preparo"
    },
    utilization: {
        value: "",
        name: "utilization",
        label: "Utilização"
    },
    observations: {
        value: "",
        name: "observations",
        label: "Observações"
    },
    effects: {
        value: "",
        name: "effects",
        label: "Efeitos"
    },

    // para medicinais
    activeIngredient: {
        value: "",
        name: "activeIngredient",
        label: "Princípios Ativos"
    },
    regionForTreatment: {
        value: "",
        name: "regionForTreatment",
        label: "Parte da Planta com Efeito Terapêutico"
    },
    therapeuticDose: {
        value: "",
        name: "therapeuticDose",
        label: "Dose Terapêutica"
    },

    // para tóxicas:
    regionForPoison: {
        value: "",
        name: "regionForPoison",
        label: "Parte da Planta que leva a intoxicação"
    },
    toxicIngredient: {
        value: "",
        name: "toxicIngredient",
        label: "Princípios Tóxicos"
    },
    toxicDose: {
        value: "",
        name: "toxicDose",
        label: "Dose Tóxica"
    },
    possibleWounds: {
        value: "",
        name: "possibleWounds",
        label: "Possíveis Lesões"
    },

}
