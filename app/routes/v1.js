const { configure } = require("nunjucks");

module.exports = function (router) {

    const version = "v1";
    const govuk = "/govuk";

    const pestMappings = {
        // 'aleurodicus dispersus (spiralling white fly)': '/pests/spiralling-white-fly',
        'bemisia tabaci (cassava whitefly, cotton whitefly, sweet potato whitefly, tobacco whitefly)': '/pests/bermisia-tabaci',
        // 'cactodera cacti': '/pests/cactodera-cacti',
        // 'ceroplastes sinensis': '/pests/ceroplastes-sinensis',
        // 'clover phyllody phytoplasma': '/pests/clover-phyllody-phytoplasma',
        // 'curtobacterium flaccumfaciens pv. Poinsettiae': '/pests/curtobacterium-flaccumfaciens',
        // 'duponchelia fovealis (dark marbled tabby, european pepper moth, southern european marshland pyralid)': '/pests/duponchelia-fovealis',
        // 'cchinothrips americanus': '/pests/echinothrips-americanus',
        // 'eotetranychus lewisi (lewis spider mite)': '/pests/lewis-spider-mite',
        // 'eotetranychus sexmaculatus': '/pests/eotetranychus-sexmaculatus',
        // 'erysiphe euphorbiae': '/pests/erysiphe-euphorbiae',
        // 'erysiphe euphorbiicola': '/pests/erysiphe-euphorbiicola',
        // 'leveillula clavata': '/pests/leveillula-clavata',
        // 'opogona sacchari (banana moth, sugarcane borer, sugarcane moth)': '/pests/opogona-sacchari',
        'xylella fastidiosa': '/pests/xylella-fastidiosa',

    };

    const plantMappings = {
        // 'amaryllis belladonna (lily)': '/plants/amaryllis',
        // 'chrysanthemum carinatum (chrysanthemums)': '/plants/chrysanthemum',
        // 'dahlia pinnata (dahlias)': '/plants/dahlia',
        // 'dianthus caryophyllus (carnations)': '/plants/dianthus-caryophyllus',
        'euphorbia pulcherrima (poinsettias)': '/plants/euphorbia-pulcherrima',
        // 'geranium pilosum (geraniums)': '/plants/geranium',
        // 'lilium lancifolium (devil lily, kentan, lily, tiger))': '/plants/lolium-lancifolum',
        // 'orchidaceae': '/plants/orchidaceae',
        // 'pelargonium x hortorum (pelargonium, zonal)': '/plants/pelargonium',
        'quercus robur (oak)': '/plants/quercus',
        // 'rosa rugosa (rosa, ramanas, rose, hedge-row)': '/plants/rosa-rugosa',
        // 'tulipa (tulips)': '/plants/tuplia',

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
                // currently set to redirect to itself
                res.redirect('/' + version + '/service/search');
            }
        } else {
            res.redirect('/' + version + '/service/search?error=true');
        }
    });

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
                    //currently set to redirect to itself
                    res.redirect('/' + version + '/service/do-you-import');
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
                //currently set to redirect to itself
                res.redirect('/' + version + '/service/country-select');
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
    });

    // quercus
    router.get('/' + version + '/plants/quercus', function (req, res) {
        res.render(version + '/plants/quercus', {
            'version': version,
            'doYouImport': req.session.data['import']
        });
    });


    // Pests
    // bermisia-tabaci
    router.get('/' + version + '/pests/bermisia-tabaci', function (req, res) {
        res.render(version + '/pests/bermisia-tabaci', {
            'version': version,
        });

    });

    // xylella-fastidiosa
    router.get('/' + version + '/pests/xylella-fastidiosa', function (req, res) {
        res.render(version + '/pests/xylella-fastidiosa', {
            'version': version,
        });

    });
};