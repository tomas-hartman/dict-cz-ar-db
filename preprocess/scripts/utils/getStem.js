const getStem = (tags) => {
    const tagsArr = tags.split(' ');
    const stems = tagsArr.filter((tag) => {

        return tag.includes('_kmen');
    });

    return stems;
};

module.exports = {getStem};
