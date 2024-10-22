import data from "./data.json" with { type: "json" };

/**
 * This function will drop and recreate the collection of sample data in our json file.
 * By doing this we ensure that your functions are working on the same data, very similar to how you would set up a test environment.
 *
 * @param {MongoClient} client - The client that is connected to your database
 */
const seedDatabase = async (client, bobRossCollection) => {
  const hasCollection = await client
    .db('databaseWeek3')
    .listCollections({ name: 'bob_ross_episodes' })
    .hasNext();

  if (!hasCollection) throw Error('`bob_ross_episodes` does not exist!');

  // Remove all the documents
  await bobRossCollection.deleteMany({});

  // Convert data to array version of elements
  const documents = data.map((dataItem) => {
    const { EPISODE, TITLE } = dataItem;

    const depictionElementKeys = Object.keys(dataItem).filter(
      (key) => !['EPISODE', 'TITLE'].includes(key),
    );
    const depictionElements = depictionElementKeys.filter(
      (key) => dataItem[key] === 1,
    );

    return {
      episode: EPISODE,
      // Remove the extra quotation marks
      title: TITLE.replaceAll('"', ''),
      elements: depictionElements,
    };
  });

  // Add our documents
  await bobRossCollection.insertMany(documents);
};

export default seedDatabase;
