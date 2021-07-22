const getCategories = (tags) => {
    /**
     * Vynechané kategorie. Cíl je hlavně odlišit slovesa a substantiva, 
     * která mohou mít po normalizaci stejný tvar a zmenšit tak počet
     * false errorů u duplicit apod.
     * Also, slouží jako rychlá metoda jak z tagů získat kategorii
     */
    const ignoredCategories = ['cat_fraze', 'cat_castice'];

    const tagsArr = tags.split(' ');
    const categories = tagsArr.filter((tag) => {
        return tag.includes('cat_') && !ignoredCategories.includes(tag);
    });

    return categories;
};

module.exports = {getCategories};
