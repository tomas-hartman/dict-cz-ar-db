const getCategories = (tags) => {
    /**
     * Vynechané kategorie. Cíl je hlavně odlišit slovesa a substantiva, 
     * která mohou mít po normalizaci stejný tvar a zmenšit tak počet
     * false errorů
     */
    const ignoredCategories = ['cat_fraze', 'cat_castice'];

    const tagsArr = tags.split(' ');
    const categories = tagsArr.filter((tag) => {
        return tag.includes('cat_') && !ignoredCategories.includes(tag);
    });

    return categories;
};

module.exports = {getCategories};
