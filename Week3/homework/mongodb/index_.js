import { MongoClient } from 'mongodb';
import seedDatabase from './seedDatabase.js';

if (process.env.MONGODB_URI == null) throw Error(`no uri in .env`);

const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
  await client.connect();

  const bobRossCollection = client
    .db('databaseWeek3')
    .collection('bob_ross_episodes');

  await seedDatabase(client, bobRossCollection); // Seed our database

  await createEpisodeExercise(bobRossCollection); // CREATE

  await findEpisodesExercises(bobRossCollection); // READ

  await updateEpisodeExercises(bobRossCollection); // UPDATE

  await deleteEpisodeExercise(bobRossCollection); // DELETE
}

main()
  .catch(console.error)
  .finally(() => client.close());

async function createEpisodeExercise(collection) {
  const episodeToAdd = {
    episode: 'S09E13',
    title: 'MOUNTAIN HIDE-AWAY',
    elements: [
      'CIRRUS',
      'CLOUDS',
      'CONIFER',
      'DECIDIOUS',
      'GRASS',
      'MOUNTAIN',
      'MOUNTAINS',
      'RIVER',
      'SNOWY_MOUNTAIN',
      'TREE',
      'TREES',
    ],
  };

  const result = await collection.insertOne(episodeToAdd);

  console.log(
    `Created season 9 episode 13 and the document got the id ${result.insertedId}`,
  );
}

async function findEpisodesExercises(collection) {
  const filter1 = { episode: 'S02E02' };
  const filter2 = { title: 'BLACK RIVER' };
  const filter3 = { elements: 'CLIFF' }; //or $elemMatch: {$eq: 'CLIFF'}, $in: ['CLIFF']
  const filter4 = { elements: { $all: ['CLIFF', 'LIGHTHOUSE'] } }; //or $and: [{elements: 'CLIFF'}, {elements: 'LIGHTHOUSE'}]

  const result1 = await collection.findOne(filter1); //[WINTER SUN]
  const result2 = await collection.findOne(filter2); //[S02E06]
  const result3 = await collection.find(filter3).toArray(); //[NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL]
  const result4 = await collection.find(filter4).toArray(); //[NIGHT LIGHT]

  const episodesTitles3 = result3.map((episode) => episode.title).join(', ');
  const episodesTitles4 = result4.map((episode) => episode.title).join(', ');

  console.log(`The title of episode 2 in season 2 is ${result1.title}`);
  console.log(
    `The season and episode number of the "BLACK RIVER" episode is ${result2.episode}`,
  );
  console.log(
    `The episodes that Bob Ross painted a CLIFF are: ${episodesTitles3}.`,
  );
  console.log(
    `The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are: ${episodesTitles4}`,
  );
}

async function updateEpisodeExercises(collection) {
  const filter = { episode: 'S30E13' };
  const update = { $set: { title: 'BLUE RIDGE FALLS' } };
  const result = await collection.updateOne(filter, update); //one episode

  const filterAll = { elements: 'BUSHES' };
  const updateAll = { $set: { 'elements.$[]': 'BUSH' } }; //or elements.$: 'BUSH'
  const resultAll = await collection.updateMany(filterAll, updateAll); //120 episode

  console.log(
    `Ran a command to update episode 13 in season 30 and it updated ${result.modifiedCount} episodes`,
  );
  console.log(
    `Ran a command to update all the BUSHES to BUSH and it updated ${resultAll.modifiedCount} episodes`,
  );
}

async function deleteEpisodeExercise(collection) {
  const filter = { episode: 'S31E14' };
  const result = await collection.deleteOne(filter);

  const notDeleted = await collection.findOne(filter);
  if (notDeleted) throw Error('The episode was not deleted');

  console.log(
    `Ran a command to delete episode and it deleted ${result.deletedCount} episodes`,
  );
}

/**
 * In the end the console should read something like this: 

Created season 9 episode 13 and the document got the id 625e9addd11e82a59aa9ff93
The title of episode 2 in season 2 is WINTER SUN
The season and episode number of the "BLACK RIVER" episode is S02E06
The episodes that Bob Ross painted a CLIFF are NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL
The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are NIGHT LIGHT
Ran a command to update episode 13 in season 30 and it updated 1 episodes
Ran a command to update all the BUSHES to BUSH and it updated 120 episodes
Ran a command to delete episode and it deleted 1 episodes
 
*/
