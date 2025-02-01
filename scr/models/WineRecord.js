// src/models/WineRecord.js

/**
 * Класс WineRecord описывает полную структуру записи дегустации вина.
 */
export class WineRecord {
    /**
     * @param {Object} params – параметры записи.
     * @param {string} params.id – уникальный идентификатор записи.
     * @param {string} params.winery – название винодельни.
     * @param {string} params.wineName – название вина.
     * @param {number|string} params.harvestYear – год урожая.
     * @param {number|string} params.bottlingYear – год розлива.
     * @param {Array<Object>} params.grapeVarieties – массив сортов винограда, каждый объект: { name, percentage }.
     * @param {string} params.winemaker – имя винодела.
     * @param {string} params.owner – собственник вина.
     * @param {string} params.country – страна производства.
     * @param {string} params.region – регион производства.
     * @param {number|string} params.sugarContent – содержание сахара (в %).
     * @param {number|string} params.alcoholContent – содержание спирта (в %).
     * @param {string} params.wineStyle – вид вина (например, "сухое", "полусухое", "сладкое" и т.д.).
     * @param {string} params.wineType – тип вина (например, "тихое", "игристое").
     * @param {string} params.wineColor – цвет вина (например, "красное", "белое", "розовое" и т.д.).
     * @param {number|string} params.price – цена.
     * @param {Object} params.tastingNotes – дегустационные характеристики:
     *   @param {string} params.tastingNotes.color – цвет (заметки).
     *   @param {string} params.tastingNotes.density – плотность.
     *   @param {string} params.tastingNotes.firstNose – первый нос (без аэрации).
     *   @param {string} params.tastingNotes.aromaAfterAeration – аромат после аэрации.
     *   @param {string} params.tastingNotes.taste – вкус (спиртуозность).
     *   @param {string} params.tastingNotes.tannins – танины.
     *   @param {string} params.tastingNotes.acidity – кислотность.
     *   @param {string} params.tastingNotes.sweetness – сладость.
     *   @param {string} params.tastingNotes.balance – баланс.
     *   @param {string} params.tastingNotes.associations – ассоциации.
     *   @param {string} params.tastingNotes.consumptionDate – дата потребления.
     * @param {Object} params.personalVerdict – личный вердикт:
     *   @param {string} params.personalVerdict.verdict – оценка ("моё/не моё", "брать/не брать").
     *   @param {string} params.personalVerdict.notes – дополнительные комментарии.
     * @param {Object} params.photos – фотографии:
     *   @param {string} params.photos.bottle – путь к фотографии бутылки.
     *   @param {string} params.photos.label – путь к фотографии этикетки.
     *   @param {string} params.photos.counterLabel – путь к фотографии контрэтикетки.
     *   @param {string} params.photos.plaque – путь к фотографии плакетки (для игристого вина).
     */
    constructor({
      id,
      winery,
      wineName,
      harvestYear,
      bottlingYear,
      grapeVarieties,
      winemaker,
      owner,
      country,
      region,
      sugarContent,
      alcoholContent,
      wineStyle,
      wineType,
      wineColor,
      price,
      tastingNotes,
      personalVerdict,
      photos,
    }) {
      this.id = id;
      this.winery = winery;
      this.wineName = wineName;
      this.harvestYear = harvestYear;
      this.bottlingYear = bottlingYear;
      this.grapeVarieties = grapeVarieties;
      this.winemaker = winemaker;
      this.owner = owner;
      this.country = country;
      this.region = region;
      this.sugarContent = sugarContent;
      this.alcoholContent = alcoholContent;
      this.wineStyle = wineStyle;
      this.wineType = wineType;
      this.wineColor = wineColor;
      this.price = price;
  
      // Объект с дегустационными характеристиками.
      this.tastingNotes = {
        color: tastingNotes?.color || '',
        density: tastingNotes?.density || '',
        firstNose: tastingNotes?.firstNose || '',
        aromaAfterAeration: tastingNotes?.aromaAfterAeration || '',
        taste: tastingNotes?.taste || '',
        tannins: tastingNotes?.tannins || '',
        acidity: tastingNotes?.acidity || '',
        sweetness: tastingNotes?.sweetness || '',
        balance: tastingNotes?.balance || '',
        associations: tastingNotes?.associations || '',
        consumptionDate: tastingNotes?.consumptionDate || '',
      };
  
      // Объект с личным вердиктом.
      this.personalVerdict = {
        verdict: personalVerdict?.verdict || '',
        notes: personalVerdict?.notes || '',
      };
  
      // Объект с фотографиями.
      this.photos = {
        bottle: photos?.bottle || '',
        label: photos?.label || '',
        counterLabel: photos?.counterLabel || '',
        plaque: photos?.plaque || '',
      };
    }
  }