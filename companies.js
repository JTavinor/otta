const CSVToJSON = require('csvtojson');
const {collatedUserData} = require('./users');

// Module which takes the CSV file of companies and jobs, along with user data,
//  and finds the 2 most similar companies (2 companies which users have liked jobs at both)
 // To do this we will:
 // 1) Convert the CSV to JSON in order to manipulate it easier
// 2) Collate each companies jobs, so instead of many entries for each company, 
//         each companies jobs will be in an array associated with that companies ID
// 3) Iterate over each pair of companies with each user to fins the best matching companies


const collateCompanyData = companies => {
    // Combine each companies listed jobs into a single array
    const collatedCompanies = []; 
    // Iterate through each entry, collating each companies jobs
    for (let i = 0; i < companies.length; i++) {
        const currentEntry = companies[i];
    // Checking if company exists in our new JSON
     const index = collatedCompanies.findIndex(element => element.company_id === currentEntry.company_id);
    //  If it doesn't exist then create it as a new entry
     if (index === -1) {
         collatedCompanies.push({company_id: currentEntry.company_id, job_ids: [currentEntry.job_id]})
     } 
    //  If user exists, add the new liked job to the corresponding job_ids array
     else  {
         collatedCompanies[index].job_ids.push(currentEntry.job_id)
     }}
    
     return collatedCompanies
}

const calculateBestMatch = (users, companies) => {

const best_match = {company1: '', company2: '', score: 0}
// Iterate through each pair of companies
for (let i = 0; i < companies.length; i++) {
        for(let j = i+1; j < companies.length; j++) {
            // Running tally of similarity score
            let bothCompaniesLiked = 0;
            // Iterating through users
            for(let k = 0; k < users.length; k++){
         
            
            const company1Jobs = companies[i].job_ids;
            const company2Jobs = companies[j].job_ids;
            const userJobs = users[k].job_ids

            // Returns true as soon as a matching job id is found
            const company1Liked = company1Jobs.some(job_id => userJobs.includes(job_id))
            const company2Liked = company2Jobs.some(job_id => userJobs.includes(job_id))
           
                // Updating similarity score
            if (
                company1Liked && company2Liked
                ) {
             
                bothCompaniesLiked += 1
            }
           }
           // Updating provisional best match
           if (bothCompaniesLiked > best_match.score) {
               best_match.company1 = companies[i].company_id;
               best_match.company2 = companies[j].company_id;
               best_match.score = bothCompaniesLiked
           }
            }
        }
        return best_match
    }

 module.exports =   async function bestCompanyMatch()  {
        const companies = await CSVToJSON().fromFile('otta\\data\\jobs.csv');
        const collatedComp = collateCompanyData(companies);
        const collatedUsers = await collatedUserData();
        const best_match =  calculateBestMatch(collatedUsers, collatedComp) ;
        return best_match
    }
