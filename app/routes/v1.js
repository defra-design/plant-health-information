const { configure } = require("nunjucks");

module.exports = function (router) {

    const version = "v1";
    const govuk = "/govuk";

    const pestMappings = {
        'aleurodicus dispersus (spiralling white fly)': '/pests/spiralling-white-fly',
        'bemisia tabaci (cassava whitefly, cotton whitefly, sweet potato whitefly, tobacco whitefly)': '/pests/bermisia-tabaci',
        'cactodera cacti': '/pests/cactodera-cacti',
        'ceroplastes sinensis': '/pests/ceroplastes-sinensis',
        'clover phyllody phytoplasma': '/pests/clover-phyllody-phytoplasma',
        'curtobacterium flaccumfaciens pv. Poinsettiae': '/pests/curtobacterium-flaccumfaciens',
        'duponchelia fovealis (dark marbled tabby, european pepper moth, southern european marshland pyralid)': '/pests/duponchelia-fovealis',
        'cchinothrips americanus': '/pests/echinothrips-americanus',
        'eotetranychus lewisi (lewis spider mite)': '/pests/lewis-spider-mite',
        'eotetranychus sexmaculatus': '/pests/eotetranychus-sexmaculatus',
        'erysiphe euphorbiae': '/pests/erysiphe-euphorbiae',
        'erysiphe euphorbiicola': '/pests/erysiphe-euphorbiicola',
        'leveillula clavata': '/pests/leveillula-clavata',
        'opogona sacchari (banana moth, sugarcane borer, sugarcane moth)': '/pests/opogona-sacchari',

    };

    const plantMappings = {
        'chrysanthemum spp. (chrysanthemums)': '/plants/chrysanthemum',
        'dahlia spp. (dahlias)': '/plants/dahlia',
        'dianthus caryophyllus (carnations)': '/plants/dianthus-caryophyllus',
        'euphorbia pulcherrima (poinsettias)': '/plants/euphorbia-pulcherrima',
        'geranium spp. (geraniums)': '/plants/geranium',
        'hippeastrum spp. (Amaryllis)': '/plants/Hippeastrum',
        'lilium spp. (Lilies)': '/plants/Lilium',
        'orchidaceae (orchids)': '/plants/orchidaceae',

    };

    // .GOV.UK
    router.get('/' + version + govuk + '/plant-health-information-start', function (req, res) {
        res.render(version + govuk + '/plant-health-information-start', {
            'version': version,

        });
    });

    // search
    router.get('/' + version + '/service/search', function (req, res) {
        req.session.data['searchQuery'] = ''
        res.render(version + '/service/search', {
            'version': version,
            'error': req.query.error

        });

    });


    router.post('/' + version + '/service/search', function (req, res) {
        let searchQuery = req.session.data['searchQuery'];

        if (searchQuery) {
            const preprocessedSearchQuery = searchQuery.trim().toLowerCase();

            if (plantMappings[preprocessedSearchQuery]) {
                res.redirect('/' + version + '/service/do-you-import');
            }
            else if (pestMappings[preprocessedSearchQuery]) {
                res.redirect('/' + version + pestMappings[preprocessedSearchQuery]);
            }
            else {
                res.redirect('/' + version + '/service/no-results');
            }
        } else {
            res.redirect('/' + version + '/service/search?error=true');
        }
    });



    router.post('/' + version + '/service/search', function (req, res) {

        let searchQuery = req.session.data['searchQuery']

        if (searchQuery === '') {
            res.redirect('/' + version + '/service/search?error=true')
        }
        else {
            req.session.searchQuery = searchQuery;
            res.redirect('/' + version + '/service/do-you-import')

        }
    })

    // do you import?
    router.get('/' + version + '/service/do-you-import', function (req, res) {
        res.render(version + '/service/do-you-import', {
            'version': version,
            'error': req.query.error

        });

    });

    router.post('/' + version + '/service/do-you-import', function (req, res) {

        let doYouImport = req.session.data['import']

        if (doYouImport === 'yes') {
            res.redirect('/' + version + '/service/country-select')
        }
        else {
            const searchQuery = req.session.data['searchQuery'].trim().toLowerCase();

            if (searchQuery) {

                if (plantMappings[searchQuery]) {
                    res.redirect('/' + version + plantMappings[searchQuery]);
                }
                else {
                    res.redirect('/' + version + '/service/no-results');
                }
            } else {
                res.redirect('/' + version + '/service/country-select?error=true');

            }
        }
    })

    // enter a country
    router.get('/' + version + '/service/country-select', function (req, res) {
        req.session.data['country'] = ''
        console.log(req.session.data['country'])
        res.render(version + '/service/country-select', {
            'version': version,
            'error': req.query.error

        });

    });

    router.post('/' + version + '/service/country-select', function (req, res) {

        const searchQuery = req.session.data['searchQuery'].trim().toLowerCase();

        if (searchQuery) {

            if (plantMappings[searchQuery]) {
                res.redirect('/' + version + plantMappings[searchQuery]);
            }
            else {
                res.redirect('/' + version + '/service/no-results');
            }
        } else {
            res.redirect('/' + version + '/service/country-select?error=true');
        }
    })

    // Plants
    // euphorbia-pulcherrima
    router.get('/' + version + '/plants/euphorbia-pulcherrima', function (req, res) {
        res.render(version + '/plants/euphorbia-pulcherrima', {
            'version': version,
            'doYouImport': req.session.data['import']
        });
        console.log(req.session.data['import'])
    });


    // Pests
    // bermisia tabaci
    router.get('/' + version + '/pests/bermisia-tabaci', function (req, res) {
        res.render(version + '/pests/bermisia-tabaci', {
            'version': version,
        });

    });
};