var IDB = require('../../assets/js/lib/idbpromises-js');


var dbPrefix = 'test-myki-';
describe('Store', function() {
    var pageStore = {            
        storeName: 'pages',
        storePrefix: dbPrefix,
        dbVersion: 1,
        keyPath: 'id',
        autoIncrement: true,
        indexes: [
            {name: 'title', keyPath: 'title', unique: true}
        ]
    };

    var fileStore = {
        storeName: 'files',
        storePrefix: dbPrefix,
        dbVersion: 1,
        keyPath: 'id',
        autoIncrement: true,
        indexes: [
            { name: 'name', keyPath: 'name', unique: true }
        ]
    };

    var pages = null;
    var files = null;

    describe('#init', function() {

        it("doit pouvoir ouvrir un store", function(done) {         
            pages = new IDB(pageStore)
            pages.open().then(function(rs) {
                expect(pages.idbstore).to.exist;
                done();
            }).catch(function(error) {
                console.error(error);
            });
        });

        it("doit pouvoir ouvrir 2 stores", function(done) {
            pages = new IDB(pageStore);
            files = new IDB(fileStore);
                
            pages.open().then(function(rs) {
                return files.open();
            }).then(function(rs) {
                expect(pages.idbstore).to.exist;
                expect(files.idbstore).to.exist;
                done();
            }).catch(function(error) {
                console.error(error);
            });

        });

    });

    describe('#save', function() {
        
        it('doit pouvoir sauver un élément dans un store, et lui ajouter un id', function(done) {
            pages = new IDB(pageStore);
            pages.open().then(function() {
                pages.clear();
                return pages.put({'title': 'page2', 'content': '# page 1 content' });
            }).then(function(rs) {
                expect(rs).to.exist;
                done();
            }).catch(function(error) {
                console.error(error.srcElement);
            });
        });

    });

    describe('#load', function() {

        it("doit pouvoir sauver plusieurs model d'un coup", function(done) {
            pages = [
                { type: 'put', value: {title: 'new page1', content: '# my new page1 title'}},
                { type: 'put', value: {title: 'new page2', content: '# my new page2 title'}}
            ];

            store = new IDB(pageStore);
            store.open().then(function() {
                store.clear();
                return store.batch(pages);
            }).then(function(rs) {
                expect(rs).to.be.true;
                done();
            }).catch(function(error) {
                console.error(error);
            });
        });

    });

});
