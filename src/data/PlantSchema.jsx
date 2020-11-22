export default class PlantSchema {
    constructor({
        image,
        popularName,
        scientificName,
        description,
        habit,
        mdtx,
        geoDistrib,
        prepMode,
        utilization,
        observations,
        references,
        effects,
        activeIngredient,
        regionForTreatment,
        therapeuticDose,
        toxicIngredient,
        regionForPoison,
        toxicDose,
        possibleWounds
    }) {

        // Common & req
        this.popularName = popularName
        this.scientificName = scientificName
        this.image = image
        this.description = description
        this.habit = habit
        this.mdtx = mdtx
        this.geoDistrib = geoDistrib

        // Common & not req
        this.prepMode = prepMode ? prepMode : ""
        this.utilization = utilization ? utilization : ""
        this.effects = effects ? effects : ""
        this.observations = observations ? observations : ""
        this.references = references ? references : ""

        // para medicinais
        this.activeIngredient = activeIngredient ? activeIngredient : ""
        this.regionForTreatment = regionForTreatment ? regionForTreatment : ""
        this.therapeuticDose = therapeuticDose ? therapeuticDose : ""

        // para tóxicas:
        this.toxicIngredient = toxicIngredient ? toxicIngredient : ""
        this.regionForPoison = regionForPoison ? regionForPoison : ""
        this.toxicDose = toxicDose ? toxicDose : ""
        this.possibleWounds = possibleWounds ? possibleWounds : ""
    }
}
