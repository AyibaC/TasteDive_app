console.log('hooked up');
const searchForm = document.forms["search-form"];

function renderList(taste){
    const helloMessage = document.getElementById('hello-message');
    if(helloMessage){helloMessage.remove()};
    const spinner = document.getElementById('spinner');
    if(document.readyState!=="complete"){
        spinner.removeAttribute("hidden");
    }else{
        const resultMessage = document.getElementById('result-message');
        resultMessage.innerHTML = ''
        const msg = document.createElement("p");
        msg.classList.add('list-heading')
        const userTaste = JSON.parse(localStorage.getItem('userTaste'));
        msg.innerHTML = `If you like ${userTaste.input}, you'll also like...`
        resultMessage.append(msg);
        const resultsSection = document.getElementById("resultsListMountNode");
        resultsSection.innerHTML = '';
        const list = document.createElement("ul");
        console.log('results: ', taste.similar.results);
        console.log('length', taste.similar.results.length);
        if(taste.similar.results.length!==0){
            for (const {description, name, wUrl, yID, yUrl} of taste.similar.results) {
                resultsSection.appendChild(list);
                list.classList.add("row", "g-2");
                const li = document.createElement("li");
                li.classList.add("col", "col-lg-4", "col-md-6", "col-sm-12");
                
            if(['music','podcast'].includes(userTaste.type)){
                console.log('type: ',userTaste.type);
                if(!yUrl){
                    li.innerHTML = `<div class="card">
                    <div class="card-body">
                    <h2>${name}</h2>
                    <a href=${wUrl} target="_blank" class="btn btn-primary">Learn more</a>
                    </div>
                    </div>`
                } else {
                    const videoID = yUrl.split("v=")[1]?.split("&")[0];
                    const embedURL = `https://www.youtube.com/embed/${videoID}`; 
                    li.innerHTML = `<div class="card">
                    <iframe src="${embedURL}"  alt='No video available' class="card-img-top" style="height:18rem;" allowfullscreen></iframe>
                    <div class="card-body">
                    <h2>${name}</h2>
                    <a href=${wUrl} target="_blank" class="btn btn-primary">Learn more</a>
                    </div>
                    </div>`
                }
                list.append(li);
            } else {
                if(!yUrl){
                    li.innerHTML = `<div class="card">
                    <div class="card-body">
                    <h2>${name}</h2>
                    <p>${description}</p>
                    <a href=${wUrl} target="_blank" class="btn btn-primary">Learn more</a>
                    </div>
                    </div>`
                } else {
                    const videoID = yUrl.split("v=")[1]?.split("&")[0];
                    const embedURL = `https://www.youtube.com/embed/${videoID}`; 
                    li.innerHTML = `<div class="card">
                    <iframe src="${embedURL}"  alt='No video available' class="card-img-top" style="height:18rem;" allowfullscreen></iframe>
                    <div class="card-body">
                    <h2>${name}</h2>
                    <p>${description}</p>
                    <a href=${wUrl} target="_blank" class="btn btn-primary">Learn more</a>
                    </div>
                    </div>`
                }
                list.append(li);
            }
            // else if(userTaste.input.type=='game'){
                
            // }





                // if(!yUrl){
                //     li.innerHTML = `<div class="card">
                //     <div class="card-body">
                //     <h2>${name}</h2>
                //     <p>${description}</p>
                //     <a href=${wUrl} target="_blank" class="btn btn-primary">Learn more</a>
                //     </div>
                //     </div>`
                // } else {
                //     const videoID = yUrl.split("v=")[1]?.split("&")[0];
                //     const embedURL = `https://www.youtube.com/embed/${videoID}`; 
                //     li.innerHTML = `<div class="card">
                //     <iframe src="${embedURL}"  alt='No video available' class="card-img-top" style="height:18rem;" allowfullscreen></iframe>
                //     <div class="card-body">
                //     <h2>${name}</h2>
                //     <p>${description}</p>
                //     <a href=${wUrl} target="_blank" class="btn btn-primary">Learn more</a>
                //     </div>
                //     </div>`
                // }
                // list.append(li);
            }
        } else if(taste.Similar.Results.length==0){
        console.log('no results');
        const sadIcon = document.createElement("i");
        sadIcon.classList.add("bi","bi-emoji-frown");
        sadIcon.style.fontSize = "1.5rem";
        resultsSection.appendChild(sadIcon);
        const noResults = document.createElement("p");
        noResults.innerHTML = `Sorry we can't find any tastes to match yours. Try something else.`;
        resultsSection.appendChild(noResults);
        noResults.style.fontSize = "1.5rem"
        resultsSection.style.textAlign = "center"
        }
    }
    };

async function getTastes(data, handler=renderList) {
    console.log('getTastes input: ', data);
    const inputArray = data.input.split(' ');
    const joinedData = inputArray.join('+');
    const queryString = `?q=${joinedData}&type=${data.type}`;
    console.log('query string: ', queryString);
    try {
        const response = await fetch(`http://localhost:3000/api/v1/similar_tastes${queryString}`)
        if(response.ok){
            const result = await response.json();
            console.log('result', result);
            renderList(result);
            } else {
            console.log('status',response.status, response.statusText);
            throw new Error(response);
        } } catch (err) {
            console.log(err);
            const resultsSection = document.getElementById("resultsListMountNode");
            resultsSection.innerHTML = '';
            const sadIcon = document.createElement("i");
            sadIcon.classList.add("bi","bi-emoji-frown");
            sadIcon.style.fontSize = "1.5rem";
            resultsSection.appendChild(sadIcon);
            const noResults = document.createElement("p");
            noResults.innerHTML = `We haven't heard of your search term. Please check the spelling and try again.`;
            resultsSection.appendChild(noResults);
            noResults.style.fontSize = "1.5rem"
            resultsSection.style.textAlign = "center"
        }};


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);
    localStorage.setItem('userTaste', JSON.stringify(Object.fromEntries(formData)));
    const data = Object.fromEntries(formData);
    getTastes(data);
    searchForm.reset();
});



