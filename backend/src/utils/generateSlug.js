const slugify = require('slugify');

const generateSlug = async (Model, title) => {
  const baseSlug = slugify(title, { lower: true, strict: true, locale: 'fr' });
  let slug = baseSlug;
  let isUnique = false;
  let counter = 2;

  while (!isUnique) {
    const existingDoc = await Model.findOne({ slug });
    if (!existingDoc) {
      isUnique = true;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
};

module.exports = generateSlug;
