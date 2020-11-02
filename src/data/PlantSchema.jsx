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
        effects,
        activeIngredient,
        regionForTreatment,
        therapeuticDose,
        toxicIngredient,
        regionForPoison,
        toxicDose,
        possibleWounds
    }) {

        this.popularName = popularName
        this.image = image
        this.scientificName = scientificName
        this.description = description
        this.habit = habit
        this.mdtx = mdtx
        this.geoDistrib = geoDistrib

        this.prepMode = prepMode
        this.utilization = utilization
        this.observations = observations
        this.effects = effects

        // para medicinais
        this.activeIngredient = activeIngredient
        this.regionForTreatment = regionForTreatment
        this.therapeuticDose = therapeuticDose

        // para tóxicas:
        this.toxicIngredient = toxicIngredient
        this.regionForPoison = regionForPoison
        this.toxicDose = toxicDose
        this.possibleWounds = possibleWounds
    }
}
