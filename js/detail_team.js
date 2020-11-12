let BASE_URL = "https://api.football-data.org/v2/",
    API_KEY = 'dc0a2f5de62b46b4a76cfe3700eb7b45',
    preloader = `
        <div class="preloader-wrapper big active">
            <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div>
                <div class="gap-patch">
                    <div class="circle"></div>
                </div>
                <div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>`;

let detailTeam = () => {
    return new Promise((resolve, reject) => {
        let urlParams = new URLSearchParams(window.location.search),
            idParam = urlParams.get("id");

        let loaderElement = document.querySelector('.preloader-detail');
            loaderElement.innerHTML = preloader;

        if ("caches" in window) {
            caches.match(`${BASE_URL}teams/${idParam}`)
                .then(response => {
                    if (response) {
                        // console.log(response)
                        response.json().then(data => {
                            renderTeam(data)
                            resolve(data)
                        });
                    } else {
                        fetchFromServer()
                    }
                })
                .catch(error => console.log(error))
                .finally(() => { loaderElement.innerHTML = "" });
        }

        let fetchFromServer = () => {
            let waiting = setTimeout(() => { 
                loaderElement.innerHTML = preloader;
            }, 0);
    
            const detail = fetch(`${BASE_URL}teams/${idParam}`, { headers: { 'X-Auth-Token': API_KEY } })
                .then(response => response.json())
                .then(data => {
                    renderTeam(data)
                    resolve(data);
                });
    
            Promise.all([waiting, detail])
                .finally(() => { loaderElement.innerHTML = "" });
        }
    });

}

let renderTeam = (data) => {
    let playerHTML = "";
    playerHTML += `
        <tr style="border-bottom:none">
            <td style="line-height:30px;" colspan="2">
                <h4>${data.name}</h4>
                <strong>Founded:</strong> ${data.founded} <br/>
                <strong>Club colors:</strong> ${data.clubColors} <br/>
                <strong>Vanue:</strong> ${data.venue} <br/>
                <strong>Phone:</strong> ${data.phone} <br/>
                <strong>Email:</strong> ${data.name} <br/>
                <strong>Address:</strong> ${data.address} <br/>
                <strong>Website:</strong> ${data.website} <br/>
            </td>
            <td colspan="3"><img src="${data.crestUrl}" alt="team-logo"/></td>
        </tr>
        <tr>
            <td colspan="5">
                <strong style="font-size:14pt;">Players</strong>
            </td>
        </tr>
        <tr>
            <td style="width:30px;">#</td>
            <td><i class="material-icons dp48">credit_card</i>&nbsp;&nbsp; Name</td>
            <td><i class="material-icons dp48">directions_run</i>&nbsp;&nbsp; Position</td>
            <td><i class="material-icons dp48">date_range</i>&nbsp;&nbsp; Birth Of Date</td>
            <td><i class="material-icons dp48">flag</i>&nbsp;&nbsp; Nationality</td>
        </tr>
    `;

    data.squad.forEach((player, index) => {
        playerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.position ?? '-'}</td>
                <td>${new Date(player.dateOfBirth).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: '2-digit' })}</td>
                <td>${player.nationality}</td>
            </tr>
    `;
    })

    document.querySelector(".player").innerHTML = playerHTML;
}