const { postClearDataHandler } = require("govuk-prototype-kit/lib/manage-prototype-handlers");
const { configure } = require("nunjucks");

module.exports = function (router) {

    const version = "v3";
    const govuk = "/govuk";

    const pestMappings = {
        // 'aleurodicus dispersus (spiralling white fly)': '/pests/spiralling-white-fly',
        'bemisia tabaci (cassava whitefly, cotton whitefly, sweet potato whitefly, tobacco whitefly)': '/pests/bemisia-tabaci',
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
        'xylella fastidiosa (alfalfa dwarf, anaheim disease, california vine disease, dwarf disease of alfalfa, dwarf disease of lucerne, leaf scald of oleander, leaf scald of plum, leaf scorch, phony disease of peach, pierces disease of grapevine, variegated chlorosis of citrus)': '/pests/xylella-fastidiosa',
    };

    const plantMappings = {
        // 'amaryllis belladonna (lily)': '/plants/amaryllis',
        // 'chrysanthemum carinatum (chrysanthemums)': '/plants/chrysanthemum',
        // 'dahlia pinnata (dahlias)': '/plants/dahlia',
        // 'dianthus caryophyllus (carnations)': '/plants/dianthus-caryophyllus',
        'euphorbia pulcherrima (poinsettia)': '/plants/euphorbia-pulcherrima',
        // 'geranium pilosum (geraniums)': '/plants/geranium',
        // 'lilium lancifolium (devil lily, kentan, lily, tiger))': '/plants/lolium-lancifolum',
        // 'orchidaceae': '/plants/orchidaceae',
        // 'pelargonium x hortorum (pelargonium, zonal)': '/plants/pelargonium',
        'pinus pinea (pine stone, pine umbrella)': '/plants/pinus-pinea',
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
            const match = searchQuery.match(/^(.*?)\s*\([^)]*\)/);
            const plantNameWithoutBrackets = match ? match[1].trim() : searchQuery.trim().toLowerCase();
            const fullLowerCaseNameWithBrackets = searchQuery.toLowerCase();

            req.session.data['plantName'] = plantNameWithoutBrackets;

            if (plantMappings[fullLowerCaseNameWithBrackets]) {
                res.redirect('/' + version + '/service/do-you-import');
            } else if (pestMappings[fullLowerCaseNameWithBrackets]) {
                res.redirect('/' + version + pestMappings[fullLowerCaseNameWithBrackets]);
            } else {
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
            'error': req.query.error,
            'plantName': req.session.data['plantName']

        });

    });

    router.post('/' + version + '/service/do-you-import', function (req, res) {

        let doYouImport = req.session.data['import']


        if (doYouImport === undefined) {
            res.redirect('/' + version + '/service/do-you-import?error=true');
        }
        else if (doYouImport === 'great-britain')
            res.redirect('/' + version + '/service/country-select')

        else if (doYouImport === 'northern-ireland')
            res.redirect('/' + version + '/service/northern-ireland-handoff')
        else {
            const searchQuery = req.session.data['searchQuery'].trim().toLowerCase();

            if (plantMappings[searchQuery]) {
                res.redirect('/' + version + plantMappings[searchQuery]);
            }

            else {
                //currently set to redirect to itself
                res.redirect('/' + version + '/service/do-you-import');
            }
        }
    })


    // enter a country
    router.get('/' + version + '/service/country-select', function (req, res) {
        req.session.data['country'] = ''
        req.session.data['import'] = ("great-britain");

        res.render(version + '/service/country-select', {
            'version': version,
            'error': req.query.error,
            'plantName': req.session.data['plantName'],
        });

    });


    router.post('/' + version + '/service/country-select', function (req, res) {
        const searchQuery = req.session.data['searchQuery'].trim().toLowerCase();
        let country = req.session.data['country']


        if (country === '') {
            res.redirect('/' + version + '/service/country-select?error=true');
        }
        else
            res.redirect('/' + version + '/service/format')
    });

     // what format?
     router.get('/' + version + '/service/format', function (req, res) {
        res.render(version + '/service/format', {
            'version': version,
            'error': req.query.error,
            'plantName': req.session.data['plantName']

        });

    });

    router.post('/' + version + '/service/format', function (req, res) {

        let format = req.session.data['format']
        const searchQuery = req.session.data['searchQuery'].trim().toLowerCase();


        if (format === undefined) {
            res.redirect('/' + version + '/service/format?error=true');
        }
        else if (searchQuery) {
            const preprocessedSearchQuery = searchQuery.trim().toLowerCase();

            if (plantMappings[preprocessedSearchQuery]) {
                res.redirect('/' + version + plantMappings[searchQuery]);
            }
            else {
                // currently set to redirect to itself
                res.redirect('/' + version + '/service/format');
            }
        }
    })



    // Plants
    // euphorbia-pulcherrima
    router.get('/' + version + '/plants/euphorbia-pulcherrima', function (req, res) {
        console.log("my country is set to" + " " + req.session.data['country'])

        // Set a default value if 'country' is not defined or falsy
        const country = req.session.data['country'] || 'Default Country';

        res.render(version + '/plants/euphorbia-pulcherrima', {
            'version': version,
            'doYouImport': req.session.data['import'],
            'country': country
        });
    });

    router.post('/' + version + '/plants/euphorbia-pulcherrima', function (req, res) {
        
        req.session.destroy(function(err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/search');
    });

    

    // quercus
    router.get('/' + version + '/plants/quercus', function (req, res) {
        const country = req.session.data['country'] || 'Default Country';

        res.render(version + '/plants/quercus', {
            'version': version,
            'doYouImport': req.session.data['import'],
            'country': country

        });
    });

    router.post('/' + version + '/plants/quercus', function (req, res) {
        
        req.session.destroy(function(err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/search');
    });

    // pinus pinea
    router.get('/' + version + '/plants/pinus-pinea', function (req, res) {
        const country = req.session.data['country'] || 'Default Country';

        res.render(version + '/plants/pinus-pinea', {
            'version': version,
            'doYouImport': req.session.data['import'],
            'country': country,
            'format': req.session.data['format'],

        });
    });
    
    router.post('/' + version + '/plants/pinus-pinea', function (req, res) {
        
        req.session.destroy(function(err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/search');
    });

    // Pests
    // bemisia-tabaci
    router.get('/' + version + '/pests/bemisia-tabaci', function (req, res) {
        res.render(version + '/pests/bemisia-tabaci', {
            'version': version,
        });

    });

    router.post('/' + version + '/pests/bemisia-tabaci', function (req, res) {
        
        req.session.destroy(function(err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/search');
    });

    // xylella-fastidiosa
    router.get('/' + version + '/pests/xylella-fastidiosa', function (req, res) {
        res.render(version + '/pests/xylella-fastidiosa', {
            'version': version,

        });
        
    });

    router.post('/' + version + '/pests/xylella-fastidiosa', function (req, res) {
        
        req.session.destroy(function(err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/search');
    });
};