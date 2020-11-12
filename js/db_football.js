let dbPromised = idb.open("football", 1, function(upgradeDb){
    let footballObjectStore = upgradeDb.createObjectStore("Team", { keyPath: "id"});
    footballObjectStore.createIndex("name", "name", { unique: true});
});

function saveTeam(team){
    console.log('team')
    dbPromised.then(function(db){
        let tx = db.transaction("Team", "readwrite"),
            store = tx.objectStore("Team");
    
        store.put(team);
        return tx.complete;
    })
    .then(() => {
        M.toast({html: "Team berhasil di simpan."})
    })
    .catch(() => {
        M.toast({html: "Team gagal disimpan."})
    })
}

function getAllTeam() {
    return new Promise(function(resolve, reject){
        dbPromised.then(function(db){
            let tx = db.transaction("Team", "readonly"),
                store = tx.objectStore("Team");
            return store.getAll();
        })
        .then(function(teams){
            resolve(teams);
        });
    });
}

function isAvailable(id) {
    // let available = false;
    let available = dbPromised.then(function(db){
        let tx = db.transaction("Team", "readonly"),
            store = tx.objectStore("Team");
        return store.get(parseInt(id))
    })
    .then(function(team) {
        return typeof team !== 'undefined';
    })

    return available;
} 

function deleteTeam(id) {
    dbPromised.then(function(db) {
        let tx = db.transaction("Team", "readwrite"),
            store = tx.objectStore("Team");
        store.delete(parseInt(id))
        
        return tx.complete;
    })
    .then(function() {
        console.log('Team berhasil dihapus.')
    })
}