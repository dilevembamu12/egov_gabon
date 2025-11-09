import db from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Tâche planifiée pour mettre à jour les infractions en retard et appliquer les pénalités.
 * S'exécute toutes les 24 heures (86 400 000 millisecondes).
 */
export function runPenaltyJob() {
    setInterval(async () => {
        console.log(`[CRON] Vérification des pénalités - ${new Date().toISOString()}`);
        
        try {
            // 1. Récupérer toutes les règles de pénalité, triées
            const rules = await db.PenaltyRule.findAll({ order: [['jours_apres_delai', 'ASC']] });
            if (rules.length === 0) {
                console.log('[CRON] Aucune règle de pénalité configurée. Tâche terminée.');
                return;
            }

            // 2. Récupérer toutes les infractions qui sont "en_attente" et dont la date limite est dépassée
            const infractionsEnRetard = await db.Infraction.findAll({
                where: {
                    statut: 'en_attente',
                    date_limite_paiement: {
                        [Op.lt]: new Date() // "lt" = Less Than (inférieur à) la date/heure actuelle
                    }
                },
                include: ['type'] // Inclure le montant de base
            });

            if (infractionsEnRetard.length === 0) {
                console.log('[CRON] Aucune infraction en retard trouvée. Tâche terminée.');
                return;
            }

            console.log(`[CRON] ${infractionsEnRetard.length} infraction(s) en retard trouvée(s). Calcul des pénalités...`);

            // 3. Boucler sur chaque infraction en retard pour appliquer la pénalité
            for (const infraction of infractionsEnRetard) {
                const dateLimite = new Date(infraction.date_limite_paiement);
                const joursDeRetard = Math.floor((new Date() - dateLimite) / (1000 * 60 * 60 * 24));

                // Trouver la règle de pénalité la plus élevée applicable
                let regleApplicable = null;
                for (const rule of rules) {
                    if (joursDeRetard >= rule.jours_apres_delai) {
                        regleApplicable = rule;
                    } else {
                        break; // Les règles sont triées, donc on peut s'arrêter
                    }
                }

                if (regleApplicable) {
                    let nouveauMontant = parseFloat(infraction.type.montant_base);
                    
                    if (regleApplicable.type_penalite === 'fixe') {
                        nouveauMontant += parseFloat(regleApplicable.valeur);
                    } else if (regleApplicable.type_penalite === 'pourcentage') {
                        nouveauMontant += nouveauMontant * (parseFloat(regleApplicable.valeur) / 100);
                    }

                    // Mettre à jour l'infraction si le montant a changé
                    if (nouveauMontant > parseFloat(infraction.montant_actuel)) {
                        infraction.statut = 'en_retard';
                        infraction.montant_actuel = nouveauMontant;
                        await infraction.save();
                        console.log(`[CRON] Infraction ID ${infraction.id} mise à jour: Statut 'en_retard', Nouveau montant: ${nouveauMontant}`);
                    }
                } else {
                    // Marquer comme "en_retard" même si aucune règle ne s'applique (délai dépassé)
                    if (infraction.statut !== 'en_retard') {
                         infraction.statut = 'en_retard';
                         await infraction.save();
                         console.log(`[CRON] Infraction ID ${infraction.id} mise à jour: Statut 'en_retard'`);
                    }
                }
            }
            console.log('[CRON] Tâche de pénalité terminée.');

        } catch (error) {
            console.error('[CRON] Erreur grave dans la tâche de pénalité:', error);
        }

    }, 86400000); // 24 heures en millisecondes
}