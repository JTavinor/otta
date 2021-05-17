const CSVToJSON = require("csvtojson");

// Module which takes our CSV of user data and finds the 2 most similar
//      users (Users with most matching liked jobs)
// To do this we will:
// 1) Convert the CSV to JSON in order to manipulate it easier
// 2) Discard all the entries where the job has not been liked as they are irrelevent to our problem
// 3) Collate each users liked jobs, so instead of many entries for each user,
//         each users like jobs will be in an array associated with that users ID
// 4) Iterate over each pair of users, using the length of the intersection of their liked jobs
//         arrays to determine which are most similar

// Note: We will export the collated liked jobs to use for finding the most similar companies

// Filtering out the unliked jobs as they are irrelevant
const filterLikedJobs = (users) => {
  const usersToFilter = users;
  const likedJobs = usersToFilter.filter((user) => user.direction == "true");
  return likedJobs;
};

// Collate each users liked jobs, so instead of each liked job for a user being
// associated with a seperate data entry,
// each users liked jobs will be an array associated with that users ID
const collateUserData = (data) => {
  const collatedUsers = [];
  // Iterate through each entry, collating each users liked jobs
  for (let i = 0; i < data.length; i++) {
    const current_entry = data[i];
    // Checking if user exists in our new JSON
    const index = collatedUsers.findIndex(
      (element) => element.user_id === current_entry.user_id
    );
    //  If it doesn't exist then create it as a new entry
    if (index === -1) {
      collatedUsers.push({
        user_id: current_entry.user_id,
        job_ids: [current_entry.job_id],
      });
    }
    //  If user exists, add the new liked job to the corresponding job_ids array
    else {
      collatedUsers[index].job_ids.push(current_entry.job_id);
    }
  }

  return collatedUsers;
};

// Calculates the best match by iterating through each user pair,
// Calculating how many jobs both have liked and comparing that to the current high score
const calculateBestMatch = (data) => {
  const bestMatch = { user1: "", user2: "", score: 0 }; // Provisional Best match - will be updated whenever new best match is found
  //  Iterating over each pair of users
  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      const userA = data[i];
      const userB = data[j];
      // Finding the length of the intersection of the array of two users liked jobs
      // This is how many jobs both have liked
      const intersection = userA.job_ids.filter((value) =>
        userB.job_ids.includes(value)
      );
      const similarity = intersection.length;
      // Updates our provisional best match if current pair is a better match
      if (similarity > bestMatch.score) {
        bestMatch.user1 = userA.user_id;
        bestMatch.user2 = userB.user_id;
        bestMatch.score = similarity;
      }
    }
    return bestMatch;
  }
};

// Collates each users liked jobs to be associated with a single user ID
// Exported for use in calculated most similar companies
const collatedUserData = async function () {
  const users = await CSVToJSON().fromFile("otta\\data\\reactions.csv");
  const likedJobs = filterLikedJobs(users);
  const collatedData = collateUserData(likedJobs);
  return collatedData;
};

const bestUserMatch = async function () {
  const collatedData = await collatedUserData();
  const bestMatch = calculateBestMatch(collatedData);
  return bestMatch;
};

exports.bestUserMatch = bestUserMatch;
exports.collatedUserData = collatedUserData;
