const bestCompanyMatch = require('./companies');
const {bestUserMatch} = require('./users');

const run = async (userMatch, companyMatch) => {
    const {user1, user2, score} = await userMatch
    const {company1, company2, score: companyScore} = await companyMatch
    console.log(`The two most similar users are the users with ID's ${user1} and ${user2}, with a compatibilty score of ${score}.
The two most similar companies are the companies with ID's ${company1} and ${company2}, with a compatibilty score of ${companyScore}.`)
}

run(bestUserMatch(), bestCompanyMatch())