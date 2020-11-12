const BASE_URL = "https://api.football-data.org/v2/",
    API_KEY = 'dc0a2f5de62b46b4a76cfe3700eb7b45',
    CLASSEMENT_ENDPOINT = `${BASE_URL}competitions/2014/standings`,
    MATCH_ENDPOINT = `${BASE_URL}competitions/2014/matches`;


document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelector('.tabs'),
        sideNav = document.querySelector('.sidenav'),
        tabsInit = M.Tabs.init(tabs, {});
    M.Sidenav.init(sideNav);

    // set base layout
    const classementBody = document.querySelector('#classement'),
        matchBody = document.querySelector('#match'),
        teamBody = document.querySelector('#team');

    // get page
    const navPart = fetch('partials/nav.html').then(res => res.text()),
        classementPart = fetch('pages/classement.html').then(res => res.text()),
        matchPart = fetch('pages/match.html').then(res => res.text()),
        teamPart = fetch('pages/team.html').then(res => res.text());

    // set page to main body
    Promise.all([navPart, classementPart, matchPart, teamPart])
        .then(response => {
            sideNav.innerHTML = response[0];
            classementBody.innerHTML = response[1];
            matchBody.innerHTML = response[2];
            teamBody.innerHTML = response[3];

            tabSelect();
            classement();
            match();
            team();
        })

    // select tab action
    let tabSelect = () => {
        let classementMenu = document.querySelectorAll('.classement'),
            matchMenu = document.querySelectorAll('.match'),
            teamMenu = document.querySelectorAll('.team');

        // sidenav menu
        classementMenu[0].addEventListener('click', function () {
            tabsInit.select(this.dataset.tab);
            classement();
        });

        matchMenu[0].addEventListener('click', function () {
            tabsInit.select(this.dataset.tab);
            match();
        });

        teamMenu[0].addEventListener('click', function () {
            tabsInit.select(this.dataset.tab)
            team()
        });

        // tab menu
        classementMenu[1].addEventListener('click', () => classement());
        matchMenu[1].addEventListener('click', () => match());
        teamMenu[1].addEventListener('click', () => team());
    }

    // preloader
    let loaderElement = document.querySelector('.preloader-classement');
    let preloader = `
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

    let fetchApi = (endPoint, type) => {
        let waiting = setTimeout(() => {
            loaderElement.innerHTML = preloader;
        }, 0);

        const classement = fetch(endPoint, { headers: { 'X-Auth-Token': API_KEY } })
            .then(response => response.json().then(result => {
                if (type == "classement")
                    renderClassement(result)
                else if (type == "match")
                    renderMatch(result)
            }))
            .catch(error => console.log(error))

        Promise.all([waiting, classement])
            .finally(() => loaderElement.innerHTML = "");
    }

    // get data based on selected menu
    let classement = () => {
        // load data from cache if exist
        if ("caches" in window) {
            console.log('classment from cache')
            caches.match(CLASSEMENT_ENDPOINT)
                .then(response => {
                    if (response)
                        response.json().then(result => renderClassement(result))
                    else
                        fetchApi(CLASSEMENT_ENDPOINT, "classement")
                })
                .catch(error => console.log(error))
                .finally(() => loaderElement.innerHTML = "");
        }
    }

    // show data classement
    let renderClassement = (data) => {
        let classementHTML = "";
        data.standings[0].table.forEach((std, index) => {
            let clubImage = std.team.crestUrl;
            if (clubImage !== null) {
                clubImage = std.team.crestUrl.replace(/^http:\/\//i, 'https://');
            }
            classementHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td class="valign-wrapper">
                        <img src="${clubImage}" alt="team-flag" onError="this.onerror=null;this.src='${"../images/default-team.png"}'"/>
                        ${std.team.name}         
                        <a href="./pages/detail_team.html?id=${std.team.id}">
                            <i class="material-icons dp24 blue-text text-lighten-2 det-team" data-team_id=${std.team.id}>info_outline</i>
                        </a>
                    </td>
                    <td>${std.playedGames}</td>
                    <td>${std.won}</td>
                    <td>${std.draw}</td>
                    <td>${std.lost}</td>
                    <td>${std.goalsFor}</td>
                    <td>${std.goalsAgainst}</td>
                    <td>${std.goalDifference}</td>
                    <td>${std.points}</td>
                </tr>
            `;
        });
        document.querySelector('.classement-table').innerHTML = classementHTML;
    }

    let match = () => {
        // load data from cache if exist
        if ("caches" in window) {
            console.log('match from cache');
            caches.match(MATCH_ENDPOINT)
                .then(response => {
                    if (response)
                        response.json().then(result => renderMatch(result))
                    else
                        fetchApi(MATCH_ENDPOINT, "match")
                })
                .catch(error => console.log(error))
                .finally(() => { loaderElement.innerHTML = "" });
        }
    }

    // show dat match schedule
    let renderMatch = (data) => {
        let matches = data.matches,
            matchesHTML = "";

        matches.forEach((mth, index) => {
            let current = matches[index].matchday;

            if (index + 1 != data.count) {
                let next = matches[index + 1].matchday;

                if (index == 0)
                    matchesHTML += `<tr><td colspan="4" style="background-color: aliceblue;">Matchday ${current}</td></tr>`;

                if (current != next)
                    matchesHTML += `<tr><td colspan="4" style="background-color: aliceblue;">Matchday ${next}</td></tr>`;

                matchesHTML += `
                <tr>
                    <td>
                        ${mth.homeTeam.name} <br/>
                        ${mth.awayTeam.name}
                    </td>
                    <td>
                        ${mth.score.fullTime.homeTeam ?? '-'} <br/>
                        ${mth.score.fullTime.awayTeam ?? '-'}
                    </td>
                    <td>
                        ${new Date(mth.utcDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: '2-digit' })}
                    </td>
                    <td>
                        <span class="badge ${mth.status == 'FINISHED' ? 'green' : 'red'} white-text">${mth.status}</span>
                    </td>
                </tr>
            `;
            }
        })
        document.querySelector('.match-collection').innerHTML = matchesHTML;
    }

    // show detail data from indexedDB
    let team = () => {
        let loaderElement = document.querySelector('.preloader-classement');
        loaderElement.innerHTML = preloader;

        let waiting = setTimeout(() => {
            loaderElement.innerHTML = preloader;
        }, 0);

        const allTeam = getAllTeam()
            .then(data => renderMyTeam(data))
            .catch(error => console.log(error));

        Promise.all([waiting, allTeam])
            .finally(() => { loaderElement.innerHTML = "" });
    }

    let renderMyTeam = (data) => {
        let favTeam = document.querySelector('.fav-team'),
            myFavoriteHTML = "";

        if (data.length == 0)
            favTeam.innerHTML = `
                    <div class="center-align">
                        <img src="football-laliga/images/error-404.png" alt="not-found" />
                        <strong><h5>Tidak ada data tersimpan.</h5></strong>
                    </div>
                `;
        else {
            data.forEach(item => {
                let clubImage = item.crestUrl;
                if (clubImage !== null) {
                    clubImage = item.crestUrl.replace(/^http:\/\//i, 'https://');
                }
                myFavoriteHTML += `
                        <div class="col s12 m3">
                            <div class="card">
                                <div class="card-image">
                                    <img src="${clubImage}" alt="team-flag" onError="this.onerror=null;this.src='${"../images/default-team.png"}'"/>
                                    <a data-team_id="${item.id}" class="btn-floating halfway-fab waves-effect waves-light red delete-team">
                                        <i class="material-icons">delete_forever</i>
                                    </a>
                                </div>
                                <div class="card-action">
                                    <a href="./pages/detail_team.html?id=${item.id}">${item.name}</a>
                                </div>
                            </div>
                        </div>
                    `;

                favTeam.innerHTML = myFavoriteHTML;

                let delTeam = document.querySelectorAll('.delete-team');

                delTeam.forEach((item) => {
                    item.addEventListener('click', function () {
                        deleteTeam(this.dataset.team_id);
                        M.toast({ html: "Team berhasil dihapus." })
                        team();
                    })
                })
            });
        }
    }
})



// Service worker
if (!('serviceWorker' in navigator)) {
    console.log("Service worker tidak didukung browser ini.");
} else {
    registerServiceWorker();
    requestPermission();
}

// Register service worker
function registerServiceWorker() {
    return navigator.serviceWorker.register('sw.js')
        .then(function (registration) {
            console.log('Registrasi service worker berhasil.');
            return registration;
        })
        .catch(function (err) {
            console.error('Registrasi service worker gagal.', err);
        });
}

function requestPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function (result) {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diijinkan.");
                return;
            } else if (result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }

            navigator.serviceWorker.ready.then(() => {
                if (('PushManager' in window)) {
                    navigator.serviceWorker.getRegistration().then(function (registration) {
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array('BLov5ynw4BHpSqNOE1f4lzoQUqo7cLhmnzZkNeqcbKWaxNtXYx5wdPUwpuT63jaVyVMCYdLFuVj_kwx8_BL9Vok')
                        }).then(function (subscribe) {
                            console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                            console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('p256dh')))));
                            console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('auth')))));
                        }).catch(function (e) {
                            console.error('Tidak dapat melakukan subscribe ', e.message);
                        });
                    });
                }
            });
        });
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
