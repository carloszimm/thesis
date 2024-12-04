const fs = require('fs');
const axios = require('axios');

// GitHub API token
const GITHUB_API_TOKEN = '';

const FILE_NAME = 'rxjava';

// Load the JSON file
const data = JSON.parse(fs.readFileSync(`${FILE_NAME}.json`, 'utf-8'));

// Create a Set of repository full names to easily check parents
const repoNamesSet = new Set(data.map(repo => repo.repoFullName));

const parentCount = new Map();

// Function to check if a repository is a fork and return parent information
async function checkForkStatus(repo) {
  const apiUrl = `https://api.github.com/repos/${repo.repoFullName}`;
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_API_TOKEN}`
      }
    });
    const repoData = response.data;
    
    if (repoData.fork && repoData.parent) {
      if(!parentCount.has(repoData.parent.full_name)){
      	parentCount.set(repoData.parent.full_name, 0);
      }
      parentCount.set(repoData.parent.full_name, ++parentCount.get(repoData.parent.full_name));
      return { isFork: true, parentFullName: repoData.parent.full_name, error: false };
    }
  } catch (error) {
    console.error(`Error fetching data for ${repo.repoFullName}:`, error.message);
    return { isFork: false, error: true };
  }
  return { isFork: false, error: false };
}

let errorCount = 0, forkWithRepos = 0;

// Filter repositories by checking their fork status
async function filterRepositories() {
  const filteredRepos = [];

  for (const repo of data) {
    const forkStatus = await checkForkStatus(repo);
    if(forkStatus.error){ errorCount++; continue; }

    if(!forkStatus.isFork){
      filteredRepos.push(repo);
    } else if (!repoNamesSet.has(forkStatus.parentFullName)) {
      if(parentCount.get(forkStatus.parentFullName) != Number.MaxValue){
        filteredRepos.push(repo);
        parentCount.set(repoData.parent.full_name, Number.MaxValue);
      }
      forkWithRepos++;
    } else {
      forkWithRepos++;
    }
  }

  // Output or save the filtered list
  let difference = data.length - filteredRepos.length;
  console.log(`Difference: ${difference}`);
  console.log(`Percentage: ${((difference/data.length) * 100).toFixed(2)}`);
  console.log(`Number of repos which missing information: ${errorCount}`);
  console.log(`Number of forks in which their parents or simblings were present : ${forkWithRepos}`);

  // Optional: Save the filtered list to a new file
  fs.writeFileSync(`./results/repos_without_forks_${FILE_NAME}.json`, JSON.stringify(filteredRepos, null, 2), 'utf-8');
}

// Start the filtering process
filterRepositories();