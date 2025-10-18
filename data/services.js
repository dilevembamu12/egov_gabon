// data/services.js
// This file centralizes the definition of all e-services and their forms.
export const servicesData = {
    //======================================================================
    // CATEGORY: État Civil et Citoyenneté
    //======================================================================
    'demande-acte-etat-civil': {
        categoryKey: 'etat_civil_citoyennete',
        icon: 'fa-file-alt', color: '#3498db', title: 'Acte d\'État Civil', desc: 'Commandez des extraits d\'actes de naissance, mariage ou décès.',
        form: {
            title: 'Demande d\'Acte d\'État Civil',
            icon: 'fa-file-alt',
            fields: [
                { id: 'nom_complet', label: 'Nom complet de la personne concernée', type: 'text', required: true, exemple: 'Kassa-Mamboundou Alida', preview_id: 'preview-nom_complet' },
                { id: 'date_naissance', label: 'Date de naissance', type: 'date', required: true, preview_id: 'preview-date_naissance' },
                { id: 'lieu_naissance', label: 'Lieu de naissance', type: 'text', required: true, exemple: 'Tchibanga', preview_id: 'preview-lieu_naissance' },
                { id: 'nom_pere', label: 'Nom complet du père', type: 'text', required: true, exemple: 'Kassa Jean-Victor', preview_id: 'preview-nom_pere' },
                { id: 'nom_mere', label: 'Nom complet de la mère', type: 'text', required: true, exemple: 'Mamboundou Joséphine', preview_id: 'preview-nom_mere' },
                { id: 'type_acte', label: 'Type d\'acte demandé', type: 'select', required: true, options: ['Naissance', 'Mariage', 'Décès'], preview_id: 'preview-type_acte' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère de l'Intérieur</p></div>
                <h1 class="cert-title">EXTRAIT D'ACTE DE <span id="preview-type_acte">[TYPE ACTE]</span></h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Nom(s) et Prénom(s)</p><p id="preview-nom_complet" class="data-value"><span class="placeholder">[Nom Complet]</span></p></div>
                    <div class="data-field"><p class="data-label">Date de Naissance</p><p id="preview-date_naissance" class="data-value"><span class="placeholder">[Date]</span></p></div>
                    <div class="data-field"><p class="data-label">Lieu de Naissance</p><p id="preview-lieu_naissance" class="data-value"><span class="placeholder">[Lieu]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Père</p><p id="preview-nom_pere" class="data-value"><span class="placeholder">[Nom du père]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Mère</p><p id="preview-nom_mere" class="data-value"><span class="placeholder">[Nom de la mère]</span></p></div>
                </main>
            `
        }
    },
    'demande-cni': {
        categoryKey: 'etat_civil_citoyennete',
        icon: 'fa-id-card', color: '#27ae60', title: 'Carte Nationale d\'Identité', desc: 'Initiez votre demande ou renouvellement de CNI.',
        form: {
            title: 'Demande de Carte Nationale d\'Identité',
            icon: 'fa-id-card',
            fields: [
                { id: 'type_demande', label: 'Type de demande', type: 'select', required: true, options: ['Première demande', 'Renouvellement', 'Perte/Vol'], preview_id: 'preview-type_demande' },
                { id: 'nom_complet', label: 'Nom complet', type: 'text', required: true, exemple: 'Ndong Obiang Jean', preview_id: 'preview-nom_complet' },
                { id: 'cni_ancienne', label: 'Ancien numéro de CNI (si renouvellement)', type: 'text', required: false, pattern: '^[0-9]{10}$', exemple: '0102123456', preview_id: 'preview-cni_ancienne' },
                { id: 'date_naissance', label: 'Date de naissance', type: 'date', required: true, preview_id: 'preview-date_naissance' },
                { id: 'adresse', label: 'Adresse de résidence', type: 'textarea', required: true, exemple: 'Akébé, Libreville', preview_id: 'preview-adresse' },
                { id: 'telephone', label: 'Numéro de téléphone', type: 'tel', required: true, pattern: '^(061|062|065|066|074|077)[0-9]{6}$', exemple: '066123456', preview_id: 'preview-telephone' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p></div>
                <h1 class="cert-title">DEMANDE DE CNI</h1>
                <main class="content-grid">
                    <div class="data-field"><p class="data-label">Type de Demande</p><p id="preview-type_demande" class="data-value"><span class="placeholder">[Type]</span></p></div>
                    <div class="data-field"><p class="data-label">Ancien N° CNI</p><p id="preview-cni_ancienne" class="data-value"><span class="placeholder">[N/A]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Nom Complet</p><p id="preview-nom_complet" class="data-value"><span class="placeholder">[Nom Complet]</span></p></div>
                    <div class="data-field"><p class="data-label">Date de Naissance</p><p id="preview-date_naissance" class="data-value"><span class="placeholder">[Date]</span></p></div>
                    <div class="data-field"><p class="data-label">Téléphone</p><p id="preview-telephone" class="data-value"><span class="placeholder">[Téléphone]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Adresse</p><p id="preview-adresse" class="data-value"><span class="placeholder">[Adresse]</span></p></div>
                </main>
            `
        }
    },
    'demande-passeport': {
        categoryKey: 'etat_civil_citoyennete',
        icon: 'fa-passport', color: '#2980b9', title: 'Passeport Biométrique', desc: 'Obtenez ou renouvelez votre passeport biométrique.',
        form: {
            title: 'Demande de Passeport Biométrique',
            icon: 'fa-passport',
            fields: [
                { id: 'nom_complet', label: 'Nom complet (tel qu\'il figure sur votre CNI)', type: 'text', required: true, exemple: 'Mba Obame Pierre', preview_id: 'preview-nom_complet' },
                { id: 'cni', label: 'Numéro de Carte Nationale d\'Identité (CNI)', type: 'text', required: true, pattern: '^[0-9]{10}$', exemple: '0102123456', preview_id: 'preview-cni' },
                { id: 'date_naissance', label: 'Date de naissance', type: 'date', required: true, preview_id: 'preview-date_naissance' },
                { id: 'lieu_naissance', label: 'Lieu de naissance', type: 'text', required: true, exemple: 'Libreville', preview_id: 'preview-lieu_naissance' },
                { id: 'adresse', label: 'Adresse de résidence complète', type: 'textarea', required: true, exemple: 'Quartier Louis, Libreville', preview_id: 'preview-adresse' },
                { id: 'telephone', label: 'Numéro de téléphone de contact', type: 'tel', required: true, pattern: '^(061|062|065|066|074|077)[0-9]{6}$', exemple: '077123456', preview_id: 'preview-telephone' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère de l'Intérieur</p></div>
                <h1 class="cert-title">DEMANDE DE PASSEPORT</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Nom Complet</p><p id="preview-nom_complet" class="data-value"><span class="placeholder">[Nom Complet]</span></p></div>
                    <div class="data-field"><p class="data-label">N° CNI</p><p id="preview-cni" class="data-value"><span class="placeholder">[N° CNI]</span></p></div>
                    <div class="data-field"><p class="data-label">Date de Naissance</p><p id="preview-date_naissance" class="data-value"><span class="placeholder">[Date]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Lieu de Naissance</p><p id="preview-lieu_naissance" class="data-value"><span class="placeholder">[Lieu]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Adresse</p><p id="preview-adresse" class="data-value"><span class="placeholder">[Adresse]</span></p></div>
                    <div class="data-field"><p class="data-label">Téléphone</p><p id="preview-telephone" class="data-value"><span class="placeholder">[Téléphone]</span></p></div>
                </main>
            `
        }
    },

    //======================================================================
    // CATEGORY: Transports et Mobilité
    //======================================================================
    'immatriculation-vehicule': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-car', color: '#16a085', title: 'Immatriculation Véhicule', desc: 'Obtenez la première carte grise pour un véhicule.',
        form: {
            title: 'Immatriculation d\'un Véhicule',
            icon: 'fa-car',
            fields: [
                { id: 'nom_proprietaire', label: 'Nom complet du propriétaire', type: 'text', required: true, exemple: 'Mba Obame Pierre', preview_id: 'preview-nom_proprietaire' },
                { id: 'cni', label: 'Numéro de CNI du propriétaire', type: 'text', required: true, pattern: '^[0-9]{10}$', exemple: '0102123456', preview_id: 'preview-cni' },
                { id: 'marque', label: 'Marque du véhicule', type: 'text', required: true, exemple: 'Toyota', preview_id: 'preview-marque' },
                { id: 'modele', label: 'Modèle du véhicule', type: 'text', required: true, exemple: 'Hilux', preview_id: 'preview-modele' },
                { id: 'vin', label: 'Numéro de châssis (VIN, 17 caractères)', type: 'text', required: true, pattern: '^[A-HJ-NPR-Z0-9]{17}$', exemple: 'VF123456789ABCDEF', preview_id: 'preview-vin' },
                { id: 'annee_circulation', label: 'Année de première mise en circulation', type: 'number', required: true, pattern: '^(19[8-9][0-9]|20[0-2][0-9])$', exemple: '2021', preview_id: 'preview-annee' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère des Transports</p></div>
                <h1 class="cert-title">CERTIFICAT D'IMMATRICULATION</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Propriétaire</p><p id="preview-nom_proprietaire" class="data-value"><span class="placeholder">[Nom du Propriétaire]</span></p></div>
                    <div class="data-field"><p class="data-label">N° CNI</p><p id="preview-cni" class="data-value"><span class="placeholder">[N° CNI]</span></p></div>
                    <div class="data-field"><p class="data-label">Année</p><p id="preview-annee" class="data-value"><span class="placeholder">[Année]</span></p></div>
                    <div class="data-field"><p class="data-label">Marque</p><p id="preview-marque" class="data-value"><span class="placeholder">[Marque]</span></p></div>
                    <div class="data-field"><p class="data-label">Modèle</p><p id="preview-modele" class="data-value"><span class="placeholder">[Modèle]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Numéro de Châssis (VIN)</p><p id="preview-vin" class="data-value"><span class="placeholder">[Numéro de châssis]</span></p></div>
                </main>
            `
        }
    },
    'paiement-vignette': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-sticky-note', color: '#2ecc71', title: 'Paiement Vignette', desc: 'Payez en ligne votre taxe annuelle de circulation automobile.',
        form: {
            title: 'Paiement de la Vignette Automobile',
            icon: 'fa-sticky-note',
            fields: [
                { id: 'immatriculation', label: 'Numéro d\'immatriculation du véhicule', type: 'text', required: true, exemple: 'AB-123-CD', preview_id: 'preview-immatriculation' },
                { id: 'vin', label: '4 derniers chiffres du Numéro de châssis (VIN)', type: 'text', required: true, pattern: '^[A-HJ-NPR-Z0-9]{4}$', exemple: 'CDEF', preview_id: 'preview-vin_partiel' },
                { id: 'annee_vignette', label: 'Année de la vignette', type: 'number', required: true, pattern: '^20[2-9][0-9]$', exemple: '2025', preview_id: 'preview-annee_vignette' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Direction Générale des Impôts</p></div>
                <h1 class="cert-title">REÇU DE PAIEMENT - VIGNETTE <span id="preview-annee_vignette">[Année]</span></h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">N° Immatriculation</p><p id="preview-immatriculation" class="data-value"><span class="placeholder">[Immatriculation]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">VIN (partiel)</p><p id="preview-vin_partiel" class="data-value"><span class="placeholder">[XXXX]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Statut</p><p class="data-value" style="color: green; font-weight: bold;">PAYÉ</p></div>
                </main>
            `
        }
    },
    'immatriculation-vehicule': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-car', color: 'green', title: 'Immatriculation Véhicule', desc: 'Obtenez la première carte grise pour un véhicule neuf ou importé.',
        form: {
            title: 'Immatriculation d\'un Véhicule',
            icon: 'fa-car',
            fields: [
                { id: 'nom_proprietaire', label: 'Nom complet du propriétaire', type: 'text', required: true, exemple: 'Mba Obame Pierre', preview_id: 'preview-nom_proprietaire' },
                { id: 'cni', label: 'Numéro de CNI du propriétaire', type: 'text', required: true, pattern: '^[0-9]{10}$', exemple: '0102123456', preview_id: 'preview-cni' },
                { id: 'marque', label: 'Marque du véhicule', type: 'text', required: true, exemple: 'Toyota', preview_id: 'preview-marque' },
                { id: 'modele', label: 'Modèle du véhicule', type: 'text', required: true, exemple: 'Hilux', preview_id: 'preview-modele' },
                { id: 'vin', label: 'Numéro de châssis (VIN, 17 caractères)', type: 'text', required: true, pattern: '^[A-HJ-NPR-Z0-9]{17}$', exemple: 'VF123456789ABCDEF', preview_id: 'preview-vin' },
                { id: 'annee_circulation', label: 'Année de première mise en circulation', type: 'number', required: true, pattern: '^(19[8-9][0-9]|20[0-2][0-9])$', exemple: '2021', preview_id: 'preview-annee' },
                { id: 'telephone', label: 'Numéro de téléphone de contact', type: 'tel', required: true, pattern: '^(061|062|065|066|074|077)[0-9]{6}$', exemple: '077123456', preview_id: 'preview-telephone' },
                { id: 'email', label: 'Adresse e-mail (Optionnel)', type: 'email', required: false, exemple: 'pierre.mba@email.com', preview_id: 'preview-email' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère des Transports</p></div>
                <h1 class="cert-title">CERTIFICAT D'IMMATRICULATION</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Propriétaire</p><p id="preview-nom_proprietaire" class="data-value"><span class="placeholder">[Nom]</span></p></div>
                    <div class="data-field"><p class="data-label">N° CNI</p><p id="preview-cni" class="data-value"><span class="placeholder">[N° CNI]</span></p></div>
                    <div class="data-field"><p class="data-label">Année</p><p id="preview-annee" class="data-value"><span class="placeholder">[Année]</span></p></div>
                    <div class="data-field"><p class="data-label">Marque</p><p id="preview-marque" class="data-value"><span class="placeholder">[Marque]</span></p></div>
                    <div class="data-field"><p class="data-label">Modèle</p><p id="preview-modele" class="data-value"><span class="placeholder">[Modèle]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Numéro de Châssis (VIN)</p><p id="preview-vin" class="data-value"><span class="placeholder">[VIN]</span></p></div>
                    <div class="data-field"><p class="data-label">Téléphone</p><p id="preview-telephone" class="data-value"><span class="placeholder">[Téléphone]</span></p></div>
                    <div class="data-field"><p class="data-label">Email</p><p id="preview-email" class="data-value"><span class="placeholder">[Email]</span></p></div>
                </main>`
        }
    },
    'renouvellement-carte-grise': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-id-card-alt', color: 'green', title: 'Renouvellement Carte Grise', desc: 'Mettez à jour ou demandez un duplicata.',
        form: {
            title: 'Renouvellement de Carte Grise',
            icon: 'fa-id-card-alt',
            fields: [
                { id: 'plaque', label: 'Numéro d\'immatriculation (plaque)', type: 'text', required: true, exemple: 'AA-123-BC', preview_id: 'preview-plaque' },
                { id: 'vin', label: 'Numéro de châssis (VIN)', type: 'text', required: true, pattern: '^[A-HJ-NPR-Z0-9]{17}$', exemple: 'VF123456789ABCDEF', preview_id: 'preview-vin' },
                { id: 'cni', label: 'Numéro de CNI du propriétaire', type: 'text', required: true, pattern: '^[0-9]{10}$', exemple: '0102123456', preview_id: 'preview-cni' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère des Transports</p></div>
                <h1 class="cert-title">RENOUVELLEMENT CARTE GRISE</h1>
                <main class="content-grid">
                    <div class="data-field"><p class="data-label">N° Immatriculation</p><p id="preview-plaque" class="data-value"><span class="placeholder">[AA-123-BC]</span></p></div>
                    <div class="data-field"><p class="data-label">N° CNI du Propriétaire</p><p id="preview-cni" class="data-value"><span class="placeholder">[N° CNI]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Numéro de Châssis (VIN)</p><p id="preview-vin" class="data-value"><span class="placeholder">[VIN]</span></p></div>
                </main>`
        }
    },
    'transfert-de-propriete': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-exchange-alt', color: 'green', title: 'Transfert De Propriété', desc: 'Effectuez le changement de propriétaire d\'un véhicule d\'occasion.',
        form: {
            title: 'Transfert de Propriété',
            icon: 'fa-exchange-alt',
            fields: [
                { id: 'plaque', label: 'Numéro d\'immatriculation du véhicule', type: 'text', required: true, exemple: 'AA-123-BC', preview_id: 'preview-plaque' },
                { id: 'ancien_proprio_nom', label: 'Nom complet de l\'ancien propriétaire (vendeur)', type: 'text', required: true, exemple: 'Kassa Marie', preview_id: 'preview-ancien_proprio_nom' },
                { id: 'ancien_proprio_cni', label: 'N° de CNI de l\'ancien propriétaire', type: 'text', required: true, pattern: '^[0-9]{10}$', exemple: '0103123456', preview_id: 'preview-ancien_proprio_cni' },
                { id: 'nouveau_proprio_nom', label: 'Nom complet du nouveau propriétaire (acheteur)', type: 'text', required: true, exemple: 'Ndong Paul', preview_id: 'preview-nouveau_proprio_nom' },
                { id: 'nouveau_proprio_cni', label: 'N° de CNI du nouveau propriétaire', type: 'text', required: true, pattern: '^[0-9]{10}$', exemple: '0104123456', preview_id: 'preview-nouveau_proprio_cni' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère des Transports</p></div>
                <h1 class="cert-title">CERTIFICAT DE CESSION</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Véhicule</p><p id="preview-plaque" class="data-value"><span class="placeholder">[N° Plaque]</span></p></div>
                    <div class="data-field"><p class="data-label">Ancien Propriétaire</p><p id="preview-ancien_proprio_nom" class="data-value"><span class="placeholder">[Nom Vendeur]</span></p></div>
                    <div class="data-field"><p class="data-label">CNI Ancien Propriétaire</p><p id="preview-ancien_proprio_cni" class="data-value"><span class="placeholder">[CNI Vendeur]</span></p></div>
                    <div class="data-field"><p class="data-label">Nouveau Propriétaire</p><p id="preview-nouveau_proprio_nom" class="data-value"><span class="placeholder">[Nom Acheteur]</span></p></div>
                    <div class="data-field"><p class="data-label">CNI Nouveau Propriétaire</p><p id="preview-nouveau_proprio_cni" class="data-value"><span class="placeholder">[CNI Acheteur]</span></p></div>
                </main>`
        }
    },
    'permis-de-conduire-numerique': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-address-card', color: 'blue', title: 'Permis De Conduire Numérique', desc: 'Effectuez votre première demande pour un permis de conduire sécurisé.',
        form: {
            title: 'Permis De Conduire (Première demande)',
            icon: 'fa-address-card',
            fields: [
                { id: 'nom_complet', label: 'Nom complet (tel qu\'il figure sur votre CNI)', type: 'text', required: true, exemple: 'Ondo Biyogo Alain', preview_id: 'preview-nom' },
                { id: 'date_naissance', label: 'Date de naissance', type: 'date', required: true, preview_id: 'preview-date' },
                { id: 'lieu_naissance', label: 'Lieu de naissance', type: 'text', required: true, exemple: 'Libreville', preview_id: 'preview-lieu' },
                { id: 'cni', label: 'Numéro de CNI', type: 'text', required: true, pattern: '^[0-9]{10}$', exemple: '0105123456', preview_id: 'preview-cni' },
                { id: 'telephone', label: 'Numéro de téléphone', type: 'tel', required: true, pattern: '^(061|062|065|066|074|077)[0-9]{6}$', exemple: '066123456', preview_id: 'preview-tel' },
                { id: 'categorie', label: 'Catégorie de permis demandée', type: 'text', required: true, exemple: 'Catégorie B', preview_id: 'preview-cat' },
                { id: 'adresse', label: 'Adresse de résidence (Optionnel)', type: 'textarea', required: false, exemple: 'Quartier Louis, Libreville', preview_id: 'preview-adresse' },
            ],
            preview_html: `
                 <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère des Transports</p></div>
                <h1 class="cert-title">DEMANDE DE PERMIS</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Nom Complet</p><p id="preview-nom" class="data-value"><span class="placeholder">[Nom]</span></p></div>
                    <div class="data-field"><p class="data-label">Date de Naissance</p><p id="preview-date" class="data-value"><span class="placeholder">[Date]</span></p></div>
                    <div class="data-field"><p class="data-label">Lieu de Naissance</p><p id="preview-lieu" class="data-value"><span class="placeholder">[Lieu]</span></p></div>
                    <div class="data-field"><p class="data-label">N° CNI</p><p id="preview-cni" class="data-value"><span class="placeholder">[CNI]</span></p></div>
                    <div class="data-field"><p class="data-label">Catégorie</p><p id="preview-cat" class="data-value"><span class="placeholder">[Catégorie]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Adresse</p><p id="preview-adresse" class="data-value"><span class="placeholder">[Adresse]</span></p></div>
                </main>`
        }
    },
    'paiement-amendes-routieres': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-receipt', color: 'red', title: 'Paiement Amendes Routières', desc: 'Réglez vos contraventions et amendes de circulation en ligne.',
        form: {
            title: 'Paiement d\'Amendes Routières',
            icon: 'fa-receipt',
            fields: [
                { id: 'avis_contravention', label: 'Numéro de l\'avis de contravention', type: 'text', required: true, exemple: 'AC-2025-123456', preview_id: 'preview-avis' },
                { id: 'plaque', label: 'Numéro d\'immatriculation du véhicule concerné', type: 'text', required: true, exemple: 'EE-456-FG', preview_id: 'preview-plaque' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Trésor Public</p></div>
                <h1 class="cert-title">AVIS DE PAIEMENT</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">N° de l'Avis de Contravention</p><p id="preview-avis" class="data-value"><span class="placeholder">[N° Avis]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">N° d'Immatriculation</p><p id="preview-plaque" class="data-value"><span class="placeholder">[N° Plaque]</span></p></div>
                </main>`
        }
    },
    'controle-technique': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-wrench', color: 'gray', title: 'Contrôle Technique', desc: 'Prenez rendez-vous pour la visite technique de votre véhicule.',
        form: {
            title: 'Rendez-vous Contrôle Technique',
            icon: 'fa-wrench',
            fields: [
                { id: 'plaque', label: 'Numéro d\'immatriculation du véhicule', type: 'text', required: true, exemple: 'GH-789-IJ', preview_id: 'preview-plaque' },
                { id: 'nom_complet', label: 'Votre nom complet', type: 'text', required: true, exemple: 'Ngouabi Sylvie', preview_id: 'preview-nom' },
                { id: 'telephone', label: 'Numéro de téléphone pour confirmation', type: 'tel', required: true, pattern: '^(061|062|065|066|074|077)[0-9]{6}$', exemple: '074123456', preview_id: 'preview-tel' },
                { id: 'centre', label: 'Centre de contrôle technique souhaité', type: 'text', required: true, exemple: 'Centre de Owendo', preview_id: 'preview-centre' },
                { id: 'preference_horaire', label: 'Préférence de date/créneau (Optionnel)', type: 'text', required: false, exemple: 'Le matin, la semaine prochaine', preview_id: 'preview-pref' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère des Transports</p></div>
                <h1 class="cert-title">PRISE DE RENDEZ-VOUS</h1>
                <main class="content-grid">
                    <div class="data-field"><p class="data-label">Véhicule</p><p id="preview-plaque" class="data-value"><span class="placeholder">[Plaque]</span></p></div>
                    <div class="data-field"><p class="data-label">Centre</p><p id="preview-centre" class="data-value"><span class="placeholder">[Centre]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Nom du demandeur</p><p id="preview-nom" class="data-value"><span class="placeholder">[Nom]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Téléphone</p><p id="preview-tel" class="data-value"><span class="placeholder">[Téléphone]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Préférence</p><p id="preview-pref" class="data-value"><span class="placeholder">[Préférence]</span></p></div>
                </main>`
        }
    },
    'renouvellement-permis': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-sync', color: 'blue', title: 'Renouvellement Permis', desc: 'Renouvelez votre permis de conduire arrivé à expiration.',
        form: {
            title: 'Renouvellement de Permis de Conduire',
            icon: 'fa-sync',
            fields: [
                { id: 'num_permis', label: 'Numéro de votre permis de conduire actuel', type: 'text', required: true, pattern: '^[0-9]{12}$', exemple: '250112345678', preview_id: 'preview-permis' },
                { id: 'cni', label: 'Numéro de CNI pour confirmation', type: 'text', required: true, pattern: '^[0-9]{10}$', exemple: '0105123456', preview_id: 'preview-cni' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère des Transports</p></div>
                <h1 class="cert-title">RENOUVELLEMENT PERMIS</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">N° Permis à renouveler</p><p id="preview-permis" class="data-value"><span class="placeholder">[N° Permis]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">N° CNI du titulaire</p><p id="preview-cni" class="data-value"><span class="placeholder">[N° CNI]</span></p></div>
                </main>`
        }
    },
    'permis-de-stationnement': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-parking', color: 'blue', title: 'Permis De Stationnement', desc: 'Obtenez une autorisation de stationnement pour des zones réglementées.',
        form: {
            title: 'Demande de Permis de Stationnement',
            icon: 'fa-parking',
            fields: [
                { id: 'plaque', label: 'Numéro d\'immatriculation du véhicule', type: 'text', required: true, exemple: 'KL-456-MN', preview_id: 'preview-plaque' },
                { id: 'zone', label: 'Zone ou quartier demandé', type: 'text', required: true, exemple: 'Centre-ville, zone A', preview_id: 'preview-zone' },
                { id: 'nom_complet', label: 'Votre nom complet', type: 'text', required: true, exemple: 'Ango Martine', preview_id: 'preview-nom' },
                { id: 'telephone', label: 'Numéro de téléphone de contact', type: 'tel', required: true, pattern: '^(061|062|065|066|074|077)[0-9]{6}$', exemple: '062123456', preview_id: 'preview-tel' },
                { id: 'duree', label: 'Durée souhaitée (Optionnel)', type: 'text', required: false, exemple: '3 mois', preview_id: 'preview-duree' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Mairie de Libreville</p></div>
                <h1 class="cert-title">PERMIS DE STATIONNEMENT</h1>
                <main class="content-grid">
                    <div class="data-field"><p class="data-label">Véhicule</p><p id="preview-plaque" class="data-value"><span class="placeholder">[Plaque]</span></p></div>
                    <div class="data-field"><p class="data-label">Zone Demandée</p><p id="preview-zone" class="data-value"><span class="placeholder">[Zone]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Titulaire</p><p id="preview-nom" class="data-value"><span class="placeholder">[Nom]</span></p></div>
                    <div class="data-field"><p class="data-label">Contact</p><p id="preview-tel" class="data-value"><span class="placeholder">[Téléphone]</span></p></div>
                    <div class="data-field"><p class="data-label">Durée</p><p id="preview-duree" class="data-value"><span class="placeholder">[Durée]</span></p></div>
                </main>`
        }
    },
    'autorisation-transport-public': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-bus', color: 'purple', title: 'Autorisation Transport Public', desc: 'Demandez ou renouvelez une licence pour le transport de passagers.',
        form: {
            title: 'Autorisation de Transport Public',
            icon: 'fa-bus',
            fields: [
                { id: 'nom_entreprise', label: 'Nom de l\'entreprise ou de l\'opérateur', type: 'text', required: true, exemple: 'Sogatra', preview_id: 'preview-entreprise' },
                { id: 'nif', label: 'Numéro d\'Identification Fiscale (NIF)', type: 'text', required: true, pattern: '^[0-9]{8}$', exemple: '12345678', preview_id: 'preview-nif' },
                { id: 'plaque', label: 'Numéro d\'immatriculation du véhicule', type: 'text', required: true, exemple: 'TP-001-GA', preview_id: 'preview-plaque' },
                { id: 'type_autorisation', label: 'Type d\'autorisation demandée', type: 'text', required: true, exemple: 'Licence de transport urbain', preview_id: 'preview-type' },
                { id: 'nom_gerant', label: 'Nom complet du gérant ou contact', type: 'text', required: true, exemple: 'Moukagni Ivan', preview_id: 'preview-gerant' },
                { id: 'email', label: 'Email de contact (Optionnel)', type: 'email', required: false, exemple: 'contact@sogatra.ga', preview_id: 'preview-email' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère des Transports</p></div>
                <h1 class="cert-title">LICENCE DE TRANSPORT</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Opérateur</p><p id="preview-entreprise" class="data-value"><span class="placeholder">[Entreprise]</span></p></div>
                    <div class="data-field"><p class="data-label">NIF</p><p id="preview-nif" class="data-value"><span class="placeholder">[NIF]</span></p></div>
                    <div class="data-field"><p class="data-label">Véhicule</p><p id="preview-plaque" class="data-value"><span class="placeholder">[Plaque]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Type de Licence</p><p id="preview-type" class="data-value"><span class="placeholder">[Type]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Gérant</p><p id="preview-gerant" class="data-value"><span class="placeholder">[Nom Gérant]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Email</p><p id="preview-email" class="data-value"><span class="placeholder">[Email]</span></p></div>
                </main>`
        }
    },
    'suivi-fret-logistique': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-truck', color: 'purple', title: 'Suivi Fret & Logistique', desc: 'Suivez le statut de vos marchandises et dossiers de fret.',
        form: {
            title: 'Suivi de Fret & Logistique',
            icon: 'fa-truck',
            fields: [
                { id: 'tracking_id', label: 'Numéro de suivi ou de dossier (Tracking ID)', type: 'text', required: true, exemple: 'GAB-FR-123456789', preview_id: 'preview-tracking' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Port Autonome de Libreville</p></div>
                <h1 class="cert-title">SUIVI DE FRET</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Numéro de Suivi</p><p id="preview-tracking" class="data-value"><span class="placeholder">[GAB-FR-...]</span></p></div>
                </main>`
        }
    },
    'journal-transactions': {
        categoryKey: 'transports_mobilite',
        icon: 'fa-book', color: 'gray', title: 'Journal Des Transactions', desc: 'Consultez l\'historique de tous vos paiements effectués sur la plateforme.',
        form: {
            title: 'Journal Des Transactions',
            icon: 'fa-book',
            fields: [
                { id: 'identifiant', label: 'Identifiant de recherche (N° CNI ou N° Immatriculation)', type: 'text', required: true, exemple: '0102123456 ou AB-123-CD', preview_id: 'preview-id' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Trésor Public</p></div>
                <h1 class="cert-title">HISTORIQUE DES PAIEMENTS</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Recherche pour l'Identifiant</p><p id="preview-id" class="data-value"><span class="placeholder">[N° CNI ou Plaque]</span></p></div>
                </main>`
        }
    },
    
    //======================================================================
    // CATEGORY: Entreprises et Emploi
    //======================================================================
    'creation-entreprise': {
        categoryKey: 'entreprises_emploi',
        icon: 'fa-building', color: '#f39c12', title: 'Création d\'Entreprise', desc: 'Enregistrez votre nouvelle entreprise au guichet unique.',
        form: {
            title: 'Création d\'Entreprise en Ligne',
            icon: 'fa-building',
            fields: [
                { id: 'nom_entreprise', label: 'Dénomination sociale de l\'entreprise', type: 'text', required: true, exemple: 'Gabon Services Innovants', preview_id: 'preview-nom_entreprise' },
                { id: 'forme_juridique', label: 'Forme juridique', type: 'select', required: true, options: ['SARL', 'SA', 'Établissement'], preview_id: 'preview-forme_juridique' },
                { id: 'nom_gerant', label: 'Nom complet du gérant ou promoteur', type: 'text', required: true, exemple: 'Ali Bongo Ondimba', preview_id: 'preview-nom_gerant' },
                { id: 'cni_gerant', label: 'N° CNI du gérant', type: 'text', required: true, pattern: '^[0-9]{10}$', exemple: '0102123456', preview_id: 'preview-cni_gerant' },
                { id: 'activite', label: 'Activité principale de l\'entreprise', type: 'textarea', required: true, exemple: 'Développement de logiciels et conseil informatique', preview_id: 'preview-activite' },
                { id: 'siege_social', label: 'Adresse du siège social', type: 'textarea', required: true, exemple: 'Centre-ville, Libreville', preview_id: 'preview-siege_social' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Guichet Unique de Création d'Entreprise</p></div>
                <h1 class="cert-title">ATTESTATION DE CRÉATION</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Dénomination Sociale</p><p id="preview-nom_entreprise" class="data-value"><span class="placeholder">[Nom Entreprise]</span></p></div>
                    <div class="data-field"><p class="data-label">Forme Juridique</p><p id="preview-forme_juridique" class="data-value"><span class="placeholder">[Forme]</span></p></div>
                    <div class="data-field"><p class="data-label">Gérant</p><p id="preview-nom_gerant" class="data-value"><span class="placeholder">[Nom Gérant]</span></p></div>
                    <div class="data-field"><p class="data-label">N° CNI Gérant</p><p id="preview-cni_gerant" class="data-value"><span class="placeholder">[N° CNI]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Activité Principale</p><p id="preview-activite" class="data-value"><span class="placeholder">[Activité]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Siège Social</p><p id="preview-siege_social" class="data-value"><span class="placeholder">[Adresse]</span></p></div>
                </main>
            `
        }
    },

    //======================================================================
    // CATEGORY: Impôts et Finances
    //======================================================================
    'quitus-fiscal': {
        categoryKey: 'impots_finances',
        icon: 'fa-file-invoice-dollar', color: '#8e44ad', title: 'Quitus Fiscal', desc: 'Demandez une attestation de votre situation fiscale.',
        form: {
            title: 'Demande de Quitus Fiscal',
            icon: 'fa-file-invoice-dollar',
            fields: [
                { id: 'nif', label: 'Votre Numéro d\'Identification Fiscale (NIF)', type: 'text', required: true, pattern: '^[0-9A-Z]{9}$', exemple: '12345678A', preview_id: 'preview-nif' },
                { id: 'nom_contribuable', label: 'Nom complet ou raison sociale', type: 'text', required: true, exemple: 'Mba Obame Pierre / Gabon Services Innovants', preview_id: 'preview-nom_contribuable' },
                { id: 'motif', label: 'Motif de la demande', type: 'textarea', required: true, exemple: 'Soumission à un marché public', preview_id: 'preview-motif' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Direction Générale des Impôts</p></div>
                <h1 class="cert-title">ATTESTATION DE SITUATION FISCALE (QUITUS)</h1>
                <main class="content-grid">
                    <div class="data-field"><p class="data-label">N° NIF</p><p id="preview-nif" class="data-value"><span class="placeholder">[NIF]</span></p></div>
                    <div class="data-field"><p class="data-label">Contribuable</p><p id="preview-nom_contribuable" class="data-value"><span class="placeholder">[Nom]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Motif</p><p id="preview-motif" class="data-value"><span class="placeholder">[Motif de la demande]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Conclusion</p><p class="data-value">Le contribuable est en règle de ses obligations fiscales à la date de ce jour.</p></div>
                </main>
            `
        }
    },
    
    //======================================================================
    // CATEGORY: Foncier, Habitat et Urbanisme
    //======================================================================
    'permis-construire': {
        categoryKey: 'foncier_urbanisme',
        icon: 'fa-home', color: '#d35400', title: 'Permis de Construire', desc: 'Déposez et suivez votre demande de permis de construire.',
        form: {
            title: 'Demande de Permis de Construire',
            icon: 'fa-home',
            fields: [
                { id: 'nom_demandeur', label: 'Nom complet du demandeur', type: 'text', required: true, preview_id: 'preview-nom_demandeur' },
                { id: 'cni_demandeur', label: 'N° CNI du demandeur', type: 'text', required: true, pattern: '^[0-9]{10}$', preview_id: 'preview-cni_demandeur' },
                { id: 'num_parcelle', label: 'Numéro de la parcelle cadastrale', type: 'text', required: true, exemple: 'Section A, N°123', preview_id: 'preview-num_parcelle' },
                { id: 'type_construction', label: 'Type de construction envisagée', type: 'text', required: true, exemple: 'Villa R+1 à usage d\'habitation', preview_id: 'preview-type_construction' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère de l'Habitat et de l'Urbanisme</p></div>
                <h1 class="cert-title">ACCUSÉ DE DÉPÔT - PERMIS DE CONSTRUIRE</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Demandeur</p><p id="preview-nom_demandeur" class="data-value"><span class="placeholder">[Nom]</span></p></div>
                    <div class="data-field"><p class="data-label">N° CNI</p><p id="preview-cni_demandeur" class="data-value"><span class="placeholder">[CNI]</span></p></div>
                    <div class="data-field"><p class="data-label">Parcelle</p><p id="preview-num_parcelle" class="data-value"><span class="placeholder">[N° Parcelle]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Projet</p><p id="preview-type_construction" class="data-value"><span class="placeholder">[Type de construction]</span></p></div>
                </main>
            `
        }
    },

    //======================================================================
    // CATEGORY: Justice et Légalité
    //======================================================================
    'casier-judiciaire': {
        categoryKey: 'justice_legalite',
        icon: 'fa-gavel', color: '#34495e', title: 'Casier Judiciaire', desc: 'Demandez en ligne un extrait de votre casier judiciaire (Bulletin n°3).',
        form: {
            title: 'Demande d\'Extrait de Casier Judiciaire',
            icon: 'fa-gavel',
            fields: [
                { id: 'nom_complet', label: 'Nom complet', type: 'text', required: true, preview_id: 'preview-nom_complet' },
                { id: 'date_naissance', label: 'Date de naissance', type: 'date', required: true, preview_id: 'preview-date_naissance' },
                { id: 'lieu_naissance', label: 'Lieu de naissance', type: 'text', required: true, preview_id: 'preview-lieu_naissance' },
                { id: 'nom_pere', label: 'Nom du père', type: 'text', required: true, preview_id: 'preview-nom_pere' },
                { id: 'nom_mere', label: 'Nom de la mère', type: 'text', required: true, preview_id: 'preview-nom_mere' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère de la Justice</p></div>
                <h1 class="cert-title">EXTRAIT DE CASIER JUDICIAIRE (B3)</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Concernant</p><p id="preview-nom_complet" class="data-value"><span class="placeholder">[Nom Complet]</span></p></div>
                    <div class="data-field"><p class="data-label">Né(e) le</p><p id="preview-date_naissance" class="data-value"><span class="placeholder">[Date]</span></p></div>
                    <div class="data-field"><p class="data-label">À</p><p id="preview-lieu_naissance" class="data-value"><span class="placeholder">[Lieu]</span></p></div>
                    <div class="data-field"><p class="data-label">Fils/Fille de</p><p id="preview-nom_pere" class="data-value"><span class="placeholder">[Père]</span></p></div>
                    <div class="data-field"><p class="data-label">Et de</p><p id="preview-nom_mere" class="data-value"><span class="placeholder">[Mère]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Mention</p><p class="data-value" style="font-weight: bold;">NÉANT</p></div>
                </main>
            `
        }
    },

    //======================================================================
    // CATEGORY: Santé et Protection Sociale
    //======================================================================
    'sante-rdv-medicaux': {
        categoryKey: 'sante_protection_sociale',
        icon: 'fa-calendar-check', color: '#e74c3c', title: 'Rendez-vous Médical', desc: 'Prenez rendez-vous dans un hôpital public ou un centre de santé.',
        form: {
            title: 'Prise de Rendez-vous Médical',
            icon: 'fa-calendar-check',
            fields: [
                { id: 'nom_patient', label: 'Nom complet du patient', type: 'text', required: true, preview_id: 'preview-nom_patient' },
                { id: 'num_assurance', label: 'Numéro d\'assurance maladie (CNAMGS)', type: 'text', required: false, preview_id: 'preview-num_assurance' },
                { id: 'hopital', label: 'Hôpital ou Centre de santé', type: 'select', required: true, options: ['CHU de Libreville', 'CHU d\'Owendo', 'Hôpital Militaire'], preview_id: 'preview-hopital' },
                { id: 'specialite', label: 'Spécialité demandée', type: 'text', required: true, exemple: 'Cardiologie', preview_id: 'preview-specialite' },
                { id: 'date_souhaitee', label: 'Date de rendez-vous souhaitée', type: 'date', required: true, preview_id: 'preview-date_souhaitee' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Ministère de la Santé</p></div>
                <h1 class="cert-title">CONFIRMATION DE DEMANDE DE RDV</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Patient</p><p id="preview-nom_patient" class="data-value"><span class="placeholder">[Nom Patient]</span></p></div>
                    <div class="data-field"><p class="data-label">N° CNAMGS</p><p id="preview-num_assurance" class="data-value"><span class="placeholder">[N/A]</span></p></div>
                    <div class="data-field"><p class="data-label">Date Souhaitée</p><p id="preview-date_souhaitee" class="data-value"><span class="placeholder">[Date]</span></p></div>
                    <div class="data-field"><p class="data-label">Établissement</p><p id="preview-hopital" class="data-value"><span class="placeholder">[Hôpital]</span></p></div>
                    <div class="data-field"><p class="data-label">Spécialité</p><p id="preview-specialite" class="data-value"><span class="placeholder">[Spécialité]</span></p></div>
                </main>
            `
        }
    },
    
    //======================================================================
    // CATEGORY: Éducation et Formation
    //======================================================================
    'education-demande-bourse': {
        categoryKey: 'education_formation',
        icon: 'fa-graduation-cap', color: '#9b59b6', title: 'Demande de Bourse', desc: 'Soumettez votre dossier pour une bourse d\'études nationale.',
        form: {
            title: 'Demande de Bourse d\'Études',
            icon: 'fa-graduation-cap',
            fields: [
                { id: 'nom_etudiant', label: 'Nom complet de l\'étudiant', type: 'text', required: true, preview_id: 'preview-nom_etudiant' },
                { id: 'cni_etudiant', label: 'N° CNI de l\'étudiant', type: 'text', required: true, pattern: '^[0-9]{10}$', preview_id: 'preview-cni_etudiant' },
                { id: 'etablissement', label: 'Établissement fréquenté', type: 'text', required: true, exemple: 'Université Omar Bongo', preview_id: 'preview-etablissement' },
                { id: 'niveau_etudes', label: 'Niveau d\'études actuel', type: 'text', required: true, exemple: 'Licence 2', preview_id: 'preview-niveau_etudes' },
                { id: 'type_bourse', label: 'Type de bourse demandée', type: 'select', required: true, options: ['Bourse Nationale', 'Aide Sociale'], preview_id: 'preview-type_bourse' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Agence Nationale des Bourses du Gabon (ANBG)</p></div>
                <h1 class="cert-title">ACCUSÉ DE DÉPÔT - DOSSIER DE BOURSE</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Étudiant</p><p id="preview-nom_etudiant" class="data-value"><span class="placeholder">[Nom Étudiant]</span></p></div>
                    <div class="data-field"><p class="data-label">N° CNI</p><p id="preview-cni_etudiant" class="data-value"><span class="placeholder">[CNI]</span></p></div>
                    <div class="data-field"><p class="data-label">Type</p><p id="preview-type_bourse" class="data-value"><span class="placeholder">[Type]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Établissement</p><p id="preview-etablissement" class="data-value"><span class="placeholder">[Établissement]</span></p></div>
                    <div class="data-field"><p class="data-label">Niveau</p><p id="preview-niveau_etudes" class="data-value"><span class="placeholder">[Niveau]</span></p></div>
                </main>
            `
        }
    },
    
    //======================================================================
    // CATEGORY: Douanes et Commerce Extérieur
    //======================================================================
    'douanes-declaration': {
        categoryKey: 'douanes_commerce',
        icon: 'fa-ship', color: '#34495e', title: 'Déclaration Douanière', desc: 'Soumettez vos documents pour le dédouanement de marchandises.',
        form: {
            title: 'Déclaration Douanière Simplifiée',
            icon: 'fa-ship',
            fields: [
                { id: 'nif_operateur', label: 'NIF de l\'opérateur économique', type: 'text', required: true, pattern: '^[0-9A-Z]{9}$', preview_id: 'preview-nif_operateur' },
                { id: 'raison_sociale', label: 'Raison sociale', type: 'text', required: true, preview_id: 'preview-raison_sociale' },
                { id: 'num_manifeste', label: 'Numéro de manifeste ou LTA/BL', type: 'text', required: true, preview_id: 'preview-num_manifeste' },
                { id: 'type_operation', label: 'Type d\'opération', type: 'select', required: true, options: ['Importation', 'Exportation'], preview_id: 'preview-type_operation' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Direction Générale des Douanes</p></div>
                <h1 class="cert-title">ENREGISTREMENT DE DÉCLARATION</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Opérateur</p><p id="preview-raison_sociale" class="data-value"><span class="placeholder">[Raison Sociale]</span></p></div>
                    <div class="data-field"><p class="data-label">NIF</p><p id="preview-nif_operateur" class="data-value"><span class="placeholder">[NIF]</span></p></div>
                    <div class="data-field"><p class="data-label">Opération</p><p id="preview-type_operation" class="data-value"><span class="placeholder">[Type]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Document de transport N°</p><p id="preview-num_manifeste" class="data-value"><span class="placeholder">[Manifeste/LTA/BL]</span></p></div>
                </main>
            `
        }
    },

    //======================================================================
    // CATEGORY: Tourisme et Artisanat
    //======================================================================
    'demande-evisa': {
        categoryKey: 'tourisme_artisanat',
        icon: 'fa-plane-departure', color: '#1abc9c', title: 'E-Visa Touristique', desc: 'Faites votre demande de visa d\'entrée touristique en ligne.',
        form: {
            title: 'Demande de Visa Touristique en Ligne',
            icon: 'fa-plane-departure',
            fields: [
                { id: 'nom_complet', label: 'Nom complet (tel que sur le passeport)', type: 'text', required: true, preview_id: 'preview-nom_complet' },
                { id: 'num_passeport', label: 'Numéro de passeport', type: 'text', required: true, preview_id: 'preview-num_passeport' },
                { id: 'nationalite', label: 'Nationalité', type: 'text', required: true, preview_id: 'preview-nationalite' },
                { id: 'date_arrivee', label: 'Date d\'arrivée prévue au Gabon', type: 'date', required: true, preview_id: 'preview-date_arrivee' },
                { id: 'adresse_gabon', label: 'Adresse de séjour au Gabon (Hôtel, etc.)', type: 'textarea', required: true, preview_id: 'preview-adresse_gabon' },
            ],
            preview_html: `
                <div class="cert-header"><p class="cert-republic">RÉPUBLIQUE GABONAISE</p><p class="cert-ministry">Direction Générale de la Documentation et de l'Immigration (DGDI)</p></div>
                <h1 class="cert-title">AUTORISATION D'ENTRÉE e-VISA</h1>
                <main class="content-grid">
                    <div class="data-field col-span-2"><p class="data-label">Bénéficiaire</p><p id="preview-nom_complet" class="data-value"><span class="placeholder">[Nom Complet]</span></p></div>
                    <div class="data-field"><p class="data-label">Passeport N°</p><p id="preview-num_passeport" class="data-value"><span class="placeholder">[N° Passeport]</span></p></div>
                    <div class="data-field"><p class="data-label">Nationalité</p><p id="preview-nationalite" class="data-value"><span class="placeholder">[Nationalité]</span></p></div>
                    <div class="data-field"><p class="data-label">Valable à partir du</p><p id="preview-date_arrivee" class="data-value"><span class="placeholder">[Date]</span></p></div>
                    <div class="data-field col-span-2"><p class="data-label">Adresse de séjour</p><p id="preview-adresse_gabon" class="data-value"><span class="placeholder">[Adresse]</span></p></div>
                </main>
            `
        }
    }
};

