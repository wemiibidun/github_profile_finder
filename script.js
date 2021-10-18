//Couple of things to note
//I used the github API to fetch github user's profile displayed in a card. Also fetch user's most recent 4 repositories
//Axios was used instead of fetch API
//Axios is a promise based HTTP for the browser and NodeJS
//Created a function to take in user name
//There are several ways to fetch data with axios.This is a sample of one way: axios.get (APIURL + username).then(res => console.log(res))
//try and catch are used for error handling



const APIURL = 'https://api.github.com/users/'; //root url


const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');


async function getUser(username){
    try{
        //grab the url link plus any username passed. This returns a promise
        //With axios you dont need to keep chaining
        const res = await axios (APIURL + username);

        createUserCard(res.data);
        getRepos(username);

    } catch (error){
        if(error.response.status == 404){
            createErrorCard('Oops!!! Username does not exist')
        }
    }
}




async function getRepos(username){
    try{
        const res = await axios (APIURL + username + '/repos?sort=created');

        addReposToCard(res.data);

    } catch (error){
            createErrorCard("Issues with fetching user's most recent repositories")
    }
}



//allow the search bar to take in user name and output user's info
function createUserCard(user){
    const cardHTML = `    
            <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            </div>

            <div class="user-info">
                <h2>${user.name}</h2>
                <p>${user.bio}</p>

                <ul>
                    <li> ${user.followers}<strong>Followers</strong></li>
                    <li> ${user.following} <strong>Following</strong></li>
                    <li> ${user.public_repos} <strong>Repos</strong></li>
                </ul>

                <div id="repos"></div>
            </div>
        </div>
     `
     main.innerHTML = cardHTML;
}


function createErrorCard(message){
    const cardHTML = `
    <div class="card">
        <h1>${message}</h1>
    </div>
  `
  main.innerHTML = cardHTML;
}



function addReposToCard(repos){
    const reposElement = document.getElementById('repos');

    repos
    .slice(0, 4)
    .forEach(repo => {
        const repoElement = document.createElement('a');

        repoElement.classList.add('repo')
        repoElement.href = repo.html_url
        repoElement.target = '_blank'
        repoElement.innerText = repo.name


        reposElement.appendChild(repoElement)
    })
}



form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value;

    if(user){
        getUser(user);

        search.value = ''; //clear the input box after
    }
})