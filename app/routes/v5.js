const { postClearDataHandler } = require("govuk-prototype-kit/lib/manage-prototype-handlers");
const { configure } = require("nunjucks");

module.exports = function (router) {

    const version = "v5";
    const govuk = "/govuk";

    const pestMappings = {
        // 'aleurodicus dispersus (spiralling white fly)': '/pests/spiralling-white-fly',
        'agrilus bilineatus (two-lined chestnut borer)': '/pests/agrilus-bilineatus',
        'anoplophora glabripennis (asian longhorn beetle, starry sky beetle)': '/pests/anoplophora-glabripennis',
        'bemisia tabaci (cassava whitefly, cotton whitefly, sweet potato whitefly, tobacco whitefly)': '/pests/bemisia-tabaci',
        'ips typographus (eight-spined engraver, eight-toothed spruce bark beetle, larger eight-toothed european spruce bark beetle, spruce bark beetle)': '/pests/ips-typographus',
        'parabemisia myricae (japanese bayberry whitefly)': '/pests/parabemisia-myricae',
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
        'tomato chlorotic dwarf viroid': '/pests/tcdvd',
    };

    const plantMappings = {
        'acer macrophyllum (bigleaf maple)': '/plants/acer-macrophyllum',
        // 'amaryllis belladonna (lily)': '/plants/amaryllis',
        // 'chrysanthemum carinatum (chrysanthemums)': '/plants/chrysanthemum',
        // 'dahlia pinnata (dahlias)': '/plants/dahlia',
        // 'dianthus caryophyllus (carnations)': '/plants/dianthus-caryophyllus',
        'euphorbia pulcherrima (poinsettia)': '/plants/euphorbia-pulcherrima',
        // 'geranium pilosum (geraniums)': '/plants/geranium',
        // 'lilium lancifolium (devil lily, kentan, lily, tiger))': '/plants/lolium-lancifolum',
        // 'orchidaceae': '/plants/orchidaceae',
        // 'pelargonium x hortorum (pelargonium, zonal)': '/plants/pelargonium',
        'pinus pentaphylla': '/plants/pinus-pentaphylla',
        'pinus pinea (pine stone, pine umbrella)': '/plants/pinus-pinea',
        'populus alba (white poplar)': '/plants/populus-alba',
        'quercus robur (oak)': '/plants/quercus',
        // 'rosa rugosa (rosa, ramanas, rose, hedge-row)': '/plants/rosa-rugosa',
        'solanum lycopersicum (tomato)': '/plants/solanum',
        // 'tulipa (tulips)': '/plants/tuplia',

    };
/*
    function isCountryInEU(country) {
        const euCountries = [
            "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark",
            "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland",
            "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands",
            "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
            "Albania", "Andorra", "Armenia", "Azerbaijan", "Belarus", "Bosnia-Herzegovina",
            "Faroe Islands", "Georgia", "Iceland", "Italy", "Liechtenstein", "Malta",
            "Moldova", "Monaco", "Montenegro", "Norway", "Serbia", "Switzerland", "Turkey",
            "Ukraine"
        ];

        return euCountries.includes(country);
    }
*/
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
                res.redirect('/' + version + '/service/country-select');
            } else if (pestMappings[fullLowerCaseNameWithBrackets]) {
                res.redirect('/' + version + pestMappings[fullLowerCaseNameWithBrackets]);
            } else {
                res.redirect('/' + version + '/service/search');
            }
        } else {
            res.redirect('/' + version + '/service/search?error=true');
        }
    });

    // Pest-Journey
    router.get('/' + version + '/pests/pest-journey', function (req, res) {
        req.session.data['searchQuery'] = ''
        res.render(version + '/pests/pest-journey', {
            'version': version,
            'error': req.query.error

        });

    });


    router.post('/' + version + '/pests/pest-journey', function (req, res) {
        let searchQuery = req.session.data['searchQuery'];

        if (searchQuery) {
            const match = searchQuery.match(/^(.*?)\s*\([^)]*\)/);
            const plantNameWithoutBrackets = match ? match[1].trim() : searchQuery.trim().toLowerCase();
            const fullLowerCaseNameWithBrackets = searchQuery.toLowerCase();

            req.session.data['plantName'] = plantNameWithoutBrackets;

            if (plantMappings[fullLowerCaseNameWithBrackets]) {
                res.redirect('/' + version + '/pests/xylella-fastidiosa');
            } else if (pestMappings[fullLowerCaseNameWithBrackets]) {
                res.redirect('/' + version + pestMappings[fullLowerCaseNameWithBrackets]);
            } else {
                res.redirect('/' + version + '/pests/pest-journey');
            }
        } else {
            res.redirect('/' + version + '/pests/pest-journey?error=true');
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
            res.redirect('/' + version + '/service/search')

        else if (doYouImport === 'northern-ireland')
            res.redirect('/' + version + '/service/handoffs/northern-ireland')
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

     // Purpose of your Journey?
     router.get('/' + version + '/service/purpose', function (req, res) {
        res.render(version + '/service/purpose', {
            'version': version,
            'error': req.query.error,
            'plantName': req.session.data['plantName']

        });

    });

    router.post('/' + version + '/service/purpose', function (req, res) {

        let purposeOfVisit = req.session.data['plant-purpose']


        if (purposeOfVisit === undefined) {
            res.redirect('/' + version + '/service/purpose?error=true');
        }
        else if (purposeOfVisit === 'plant-journey')
            res.redirect('/' + version + '/service/do-you-import')

        else if (purposeOfVisit === 'pests-journey')
            res.redirect('/' + version + '/pests/pest-journey')
        else {
            const searchQuery = req.session.data['searchQuery'].trim().toLowerCase();

            if (plantMappings[searchQuery]) {
                res.redirect('/' + version + plantMappings[searchQuery]);
            }

            else {
                //currently set to redirect to itself
                res.redirect('/' + version + '/service/purpose');
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
          //  const isEU = isCountryInEU(country);
          //  req.session.data['isEU'] = isEU;
          const preprocessedSearchQuery = searchQuery.trim().toLowerCase();
         //   console.log('Is ' + req.session.data['country'] + ' ' + 'in the EU?' + ' ' + isEU)

            if (plantMappings[preprocessedSearchQuery]) {
                res.redirect('/' + version + plantMappings[searchQuery]);
            }
        } else {
            // currently set to redirect to itself
            res.redirect('/' + version + '/service/country-select');
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
           // 'inEU': req.session.data['isEU']

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

        res.redirect('/' + version + '/service/purpose');
    });



    // quercus
    router.get('/' + version + '/plants/quercus', function (req, res) {
        const country = req.session.data['country'] || 'Default Country';

        res.render(version + '/plants/quercus', {
            'version': version,
            'doYouImport': req.session.data['import'],
            'country': country,
            'format': req.session.data['format'],
            //'inEU': req.session.data['isEU']
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

        res.redirect('/' + version + '/service/purpose');
    });

     // Populus Alba
     router.get('/' + version + '/plants/populus-alba', function (req, res) {
        const country = req.session.data['country'] || 'Default Country';

        res.render(version + '/plants/populus-alba', {
            'version': version,
            'doYouImport': req.session.data['import'],
            'country': country,
            'format': req.session.data['format'],
            //'inEU': req.session.data['isEU']
        });
    });

    router.post('/' + version + '/plants/populus-alba', function (req, res) {

        req.session.destroy(function(err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/purpose');
    });

    // pinus pinea
    router.get('/' + version + '/plants/pinus-pinea', function (req, res) {
        const country = req.session.data['country'] || 'Default Country';

        res.render(version + '/plants/pinus-pinea', {
            'version': version,
            'doYouImport': req.session.data['import'],
            'country': country,
            'format': req.session.data['format'],
           // 'inEU': req.session.data['isEU']

        });
    });

    router.post('/' + version + '/plants/pinus-pinea', function (req, res) {

        req.session.destroy(function (err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/purpose');
    });


    // Solanum
    router.get('/' + version + '/plants/solanum', function (req, res) {
        const country = req.session.data['country'] || 'Default Country';

        res.render(version + '/plants/solanum', {
            'version': version,
            'doYouImport': req.session.data['import'],
            'country': country,
            'format': req.session.data['format'],
            'inEU': req.session.data['isEU']

        });
    });

    router.post('/' + version + '/plants/solanum', function (req, res) {

        req.session.destroy(function (err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/purpose');
    });

// Acer Macrophyllum
router.get('/' + version + '/plants/acer-macrophyllum', function (req, res) {
    const country = req.session.data['country'] || 'Default Country';

    res.render(version + '/plants/acer-macrophyllum', {
        'version': version,
        'doYouImport': req.session.data['import'],
        'country': country,
        'format': req.session.data['format'],
        'inEU': req.session.data['isEU']

    });
});

router.post('/' + version + '/plants/acer-macrophyllum', function (req, res) {

    req.session.destroy(function (err) {
        if (err) {
            console.error('Error destroying session:', err);
        } else {
            console.log('Session destroyed');
        }
    });

    res.redirect('/' + version + '/service/purpose');
});

// Pinus Pentaphylla
router.get('/' + version + '/plants/pinus-pentaphylla', function (req, res) {
    const country = req.session.data['country'] || 'Default Country';

    res.render(version + '/plants/pinus-pentaphylla', {
        'version': version,
        'doYouImport': req.session.data['import'],
        'country': country,
        'format': req.session.data['format'],
        //'inEU': req.session.data['isEU']
    });
});

router.post('/' + version + '/plants/pinus-pentaphylla', function (req, res) {

    req.session.destroy(function(err) {
        if (err) {
            console.error('Error destroying session:', err);
        } else {
            console.log('Session destroyed');
        }
    });

    res.redirect('/' + version + '/service/purpose');
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

        res.redirect('/' + version + '/service/purpose');
    });

    // xylella-fastidiosa
    router.get('/' + version + '/pests/xylella-fastidiosa', function (req, res) {
        res.render(version + '/pests/xylella-fastidiosa', {
            'version': version,

        });

    });

    router.post('/' + version + '/pests/xylella-fastidiosa', function (req, res) {

        req.session.destroy(function (err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/purpose');
    });

    // Tomato chlorotic dwarf viroid
    router.get('/' + version + '/pests/tcdvd', function (req, res) {
        res.render(version + '/pests/tcdvd', {
            'version': version,

        });

    });

    router.post('/' + version + '/pests/tcdvd', function (req, res) {

        req.session.destroy(function (err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/purpose');
    });

    // Anoplophora Glabripennis
    router.get('/' + version + '/pests/anoplophora-glabripennis', function (req, res) {
        res.render(version + '/pests/anoplophora-glabripennis', {
            'version': version,

        });

    });

    router.post('/' + version + '/pests/anoplophora-glabripennis', function (req, res) {

        req.session.destroy(function (err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/purpose');
    });

    // Agrilus bilineatus
    router.get('/' + version + '/pests/agrilus-bilineatus', function (req, res) {
        res.render(version + '/pests/agrilus-bilineatus', {
            'version': version,

        });

    });

    router.post('/' + version + '/pests/agrilus-bilineatus', function (req, res) {

        req.session.destroy(function (err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/purpose');
    });

    // IPS Typographus
    router.get('/' + version + '/pests/ips-typographus', function (req, res) {
        res.render(version + '/pests/ips-typographus', {
            'version': version,

        });

    });

    router.post('/' + version + '/pests/ips-typographus', function (req, res) {

        req.session.destroy(function (err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/purpose');
    });

    // Parabemisia Myricae
    router.get('/' + version + '/pests/parabemisia-myricae', function (req, res) {
        res.render(version + '/pests/parabemisia-myricae', {
            'version': version,

        });

    });

    router.post('/' + version + '/pests/parabemisia-myricae', function (req, res) {

        req.session.destroy(function (err) {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                console.log('Session destroyed');
            }
        });

        res.redirect('/' + version + '/service/purpose');
    });

    
};


