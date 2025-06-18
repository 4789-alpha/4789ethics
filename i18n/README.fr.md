# Ethicom – Évaluation éthique humain-machine

**Ethicom** permet aux humains d’évaluer des sources numériques ou des comportements à l’aide d’une échelle éthique transparente (SRC-0 à SRC-8+).  
Chaque évaluation est signée, horodatée et vérifiée par hachage – à commencer par la signature `4789`.


### Résumé

Le dépôt 4789ethics propose un cadre éthique structurel pour des projets numériques responsables. Toutes les fonctions sont accessibles via [bsvrb.ch](https://www.bsvrb.ch) ; commencez par `GET_STARTED.md` puis `index.html`. Le cadre comprend un modèle complet d'opérateurs (OP 0–9.x), un système d'autoréflexion (Signature 9874) et une approche « ethics‑first ». Les dossiers importants `app`, `ethics_modules`, `interface`, `i18n` et `tools` contiennent les modules principaux. L'utilisation suit la licence Open‑Ethics. L'humour est possible avec responsabilité. Aucune garantie n'est donnée ; les données de connexion optionnelles sont hachées localement. Après installation, exécutez `node --test`, `node tools/check-translations.js` et `node tools/check-file-integrity.js`.
Contenu du dépôt :
- Interface multilingue
- Définition des niveaux éthiques (`ethikscale`)
- Modules validés (ex. `structure_9874`)
- Évaluations de sources et manifestes

Interface : `ethicom.html`  
Langues : voir `i18n/ui-text.json`  
